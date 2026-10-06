--!strict
local Combat = require('../../runtime/MugenCombat')
local State = require('../../runtime/MugenState')
local Commands = require('../../runtime/MugenCommands')
local config: Combat.Config = require('../../generated/luau/coiny-checkpoint')
local program = Combat.compile({config, config})
local passed, failed = 0, 0
local function test(name: string, run: () -> ())
	local ok, message = pcall(run)
	if ok then passed += 1; print('PASS Coiny gameplay: ' .. name)
	else failed += 1; print('FAIL Coiny gameplay: ' .. name .. ': ' .. tostring(message)) end
end
local function expect(value: boolean, message: string)
	assert(value, message)
end
local function near(a: number, b: number)
	expect(math.abs(a-b) < 1e-8, tostring(a) .. ' ~= ' .. tostring(b))
end
local function inputs(slot: number, input: Commands.Input, other: Commands.Input?): {Commands.Input}
	local result: {Commands.Input} = {{}, {}}
	result[slot] = input; result[3-slot] = other or {}
	return result
end
local function step(s: Combat.Snapshot, slot: number, input: Commands.Input?, other: Commands.Input?): Combat.Snapshot
	return Combat.step(program, s, inputs(slot, input or {}, other))
end
local function setup(slot: number, facing: number, gap: number?): Combat.Snapshot
	local positions = {0, 0}
	positions[3-slot] = facing * (gap or 300)
	return Combat.new(program, positions)
end
local function direction(facing: number, forward: boolean): Commands.Input
	return if (facing == 1) == forward then {right=true} else {left=true}
end
local function motion(s: Combat.Snapshot, slot: number, button: string, other: Commands.Input?, backwards: boolean?): Combat.Snapshot
	local forward = direction(s.fighters[slot].state.facing, not backwards)
	s = step(s, slot, {down=true}, other)
	local diagonal = table.clone(forward); diagonal.down = true
	s = step(s, slot, diagonal, other)
		-- Complete F before the button so common crouch release can restore control within Time=10.
		for _=1,3 do s=step(s,slot,forward,other) end
		local finish = table.clone(forward); (finish :: any)[button] = true
	return step(s, slot, finish, other)
end
local function duration(anim: number): number
	local animation = program[1].machine.animations[anim]
	assert(animation, 'Missing source AIR ' .. anim)
	local total = 0
	for _, ticks in animation.durations do assert(ticks >= 0, 'Held source AIR ' .. anim); total += ticks end
	return total
end
local function elementTime(anim: number, element: number): number
	local total = 0
	for index, ticks in program[1].machine.animations[anim].durations do
		if index == element then return total end
		assert(ticks >= 0); total += ticks
	end
	error('Missing AIR element')
end
local function projectiles(s: Combat.Snapshot): {Combat.Projectile}
	return s.projectiles or {}
end
local function events(s: Combat.Snapshot, slot: number, stateNo: number): {Combat.Event}
	local result: {Combat.Event} = {}
	for _, event in s.events do
		if event.attacker == slot and event.stateNo == stateNo then
			table.insert(result, event)
		end
	end
	return result
end
for slot=1,2 do for _, facing in {1,-1} do
	local label = 'slot ' .. slot .. ' facing ' .. facing .. ': '
	for _, move in {{button='x',state=1000,power=55}, {button='y',state=1000,power=55}, {button='z',state=1000,power=55},
		{button='a',state=1020,power=100}, {button='b',state=1020,power=100}, {button='c',state=1020,power=100}} do
		test(label .. move.button .. ' complete QCF command selects source special', function()
			local initial = setup(slot, facing)
			local s = motion(initial, slot, move.button)
			local state = s.fighters[slot].state
			expect(state.commands.active[if move.state==1000 then 'Special1' else 'Special2'] == true, 'Original command must match')
			expect(state.stateNo == move.state and state.time == 0 and not state.ctrl, 'Incorrect special route: state='..state.stateNo..', time='..state.time..', ctrl='..tostring(state.ctrl))
			expect(state.power == move.power and initial.fighters[slot].state.power == 0, 'Source power gain / immutable previous snapshot')
			local hold = direction(facing, true); (hold :: any)[move.button] = true
			for _=1,180 do s=step(s,slot,hold) end
			expect(s.fighters[slot].state.stateNo ~= move.state and s.fighters[slot].state.ctrl, 'Special must finish; held button must not repeat')
			expect(s.fighters[slot].state.power == move.power, 'Held special must not add power again')
		end)
	end
	test(label .. 'missing diagonal, stale motion and reverse motion do not select QCF specials', function()
		local f = direction(facing, true)
		for _, button in {'x','a'} do
			local s=step(setup(slot,facing),slot,{down=true})
			local finish=table.clone(f); (finish :: any)[button]=true
			s=step(s,slot,finish)
			expect(s.fighters[slot].state.stateNo~=1000 and s.fighters[slot].state.stateNo~=1020, 'Incomplete motion accepted')
			s=step(setup(slot,facing),slot,{down=true})
			local df=table.clone(f); df.down=true; s=step(s,slot,df)
			for _=1,12 do s=step(s,slot,{}) end
			s=step(s,slot,finish)
			expect(s.fighters[slot].state.stateNo~=1000 and s.fighters[slot].state.stateNo~=1020, 'Expired motion accepted')
			s=motion(setup(slot,facing),slot,button,nil,true)
			expect(s.fighters[slot].state.stateNo~=1000 and s.fighters[slot].state.stateNo~=1020, 'Unexported reverse special accepted')
		end
	end)
	for _, posture in {'S','C','A'} do
		for n, button in {'x','y','z'} do
			local id=(if posture=='S' then 200 elseif posture=='C' then 400 else 600)+(n-1)*10
			test(label .. id .. ' normal uses real posture input and recovers', function()
				local s=setup(slot,facing)
				if posture=='C' then s=step(s,slot,{down=true})
				elseif posture=='A' then
					s=step(s,slot,{up=true})
					for _=1,8 do if s.fighters[slot].state.stateNo==50 then break end; s=step(s,slot,{}) end
					expect(s.fighters[slot].state.stateNo==50 and s.fighters[slot].state.y<0, 'Actual jump input must reach common air state')
				end
				local input: Commands.Input={down=posture=='C'}; (input :: any)[button]=true
				s=step(s,slot,input)
				expect(s.fighters[slot].state.stateNo==id and not s.fighters[slot].state.ctrl, 'Normal command route')
				expect(s.fighters[slot].state.hit~=nil and #s.events==0, 'Whiff must arm source HitDef without contact')
				for _=1,100 do s=step(s,slot,input) end
				expect(s.fighters[slot].state.stateNo==(if posture=='C' then 11 else 0) and s.fighters[slot].state.ctrl, 'Recovery / held normal should not repeat')
			end)
		end
	end
	test(label .. 'FF run and BB hop land through common 106', function()
		for _, forward in {true,false} do
			local input=direction(facing,forward)
			local s=step(setup(slot,facing),slot,input); s=step(s,slot,{}); s=step(s,slot,input)
			expect(s.fighters[slot].state.stateNo==(if forward then 100 else 105), 'Source double-tap route')
			local before=s.fighters[slot].state.x
			s=step(s,slot,input)
			expect((s.fighters[slot].state.x-before)*facing*(if forward then 1 else -1)>0, 'Mirrored dash displacement')
			if forward then s=step(s,slot,{}); expect(s.fighters[slot].state.stateNo==0 and s.fighters[slot].state.ctrl, 'Run release')
			else
				local landed=false
				for _=1,50 do
					s=step(s,slot,{})
					if s.fighters[slot].state.stateNo==106 then landed=true; expect(s.fighters[slot].state.y==0 and not s.fighters[slot].state.ctrl,'Backhop landing lock') end
				end
				expect(landed and s.fighters[slot].state.stateNo==0 and s.fighters[slot].state.ctrl, '106 must recover')
			end
		end
	end)
	for _, hyper in {{state=3000,cost=1000,buttons={x=true,y=true}}, {state=3010,cost=2000,buttons={a=true,b=true}}} do
		test(label .. hyper.state .. ' exact power gate and one-time cost', function()
			for _, power in {hyper.cost-1,hyper.cost,3000} do
				local s=setup(slot,facing); s.fighters[slot].state.power=power
				s=step(s,slot,hyper.buttons)
				if power<hyper.cost then expect(s.fighters[slot].state.stateNo~=hyper.state, 'Insufficient power accepted')
				else
					expect(s.fighters[slot].state.stateNo==hyper.state and s.fighters[slot].state.power==power-hyper.cost, 'Exact source hyper cost')
					expect(s.superPause~=nil and s.superPause.remaining==30, 'Authored opening superpause')
					local initialTime=s.fighters[slot].state.time
					for _=1,30 do s=step(s,slot,hyper.buttons); expect(s.fighters[slot].state.time==initialTime and s.fighters[slot].state.power==power-hyper.cost, 'Pause must freeze state and not re-spend power') end
					expect(s.superPause==nil, 'Pause must expire after exactly 30 ticks')
					s=step(s,slot,{})
					expect(s.fighters[slot].state.time==1, 'State resumes after superpause')
				end
			end
		end)
	end
	test(label .. 'taunt recovers on source AIR end; win 180→181 locks movement and attacks', function()
		local s=step(setup(slot,facing),slot,{s=true})
		expect(s.fighters[slot].state.stateNo==195 and not s.fighters[slot].state.ctrl, 'Taunt input route')
		for age=1,duration(195)-1 do
			s=step(s,slot,{x=age%2==1,up=true,s=true})
			expect(s.fighters[slot].state.stateNo==195 and not s.fighters[slot].state.ctrl, 'Taunt cannot be interrupted')
		end
		s=step(s,slot,{})
		expect(s.fighters[slot].state.stateNo==0 and s.fighters[slot].state.ctrl, 'Taunt AIR end recovery')
		-- Round completion is a host transition; no player command enters the win state.
		s.fighters[slot].state=State.transition(program[slot].machine,s.fighters[slot].state,180)
		s=step(s,slot,{})
		expect(s.fighters[slot].state.stateNo==181 and not s.fighters[slot].state.ctrl, 'Source win decider')
		local x=s.fighters[slot].state.x
		for tick=1,100 do
			s=step(s,slot,{up=true,right=true,x=tick%2==1,y=true,a=true,b=true,s=true})
			expect(s.fighters[slot].state.stateNo==181 and not s.fighters[slot].state.ctrl and not s.fighters[slot].state.hit, 'Win cannot accept gameplay commands')
			near(s.fighters[slot].state.x,x); near(s.fighters[slot].state.y,0)
		end
	end)
end end
for slot=1,2 do for _, facing in {1,-1} do
	local label='slot '..slot..' facing '..facing..': '
	test(label .. 'roll source Time%7 HitDefs, velocity and AnimTime recovery on whiff', function()
		local s=motion(setup(slot,facing,300),slot,'x')
		local total=duration(1000)
		for age=0,total-1 do
			if age>0 then s=step(s,slot,{}) end
			local state=s.fighters[slot].state
			expect(state.stateNo==1000 and state.time==age and not state.ctrl, 'Roll must retain source state until AIR end')
			local definitions=0
			for _, event in state.events do if event.controller=='hitdef' then definitions+=1; expect(event.time==age and event.source=='player.cns','Roll HitDef provenance') end end
			expect(definitions==(if age%7==0 then 1 else 0),'Roll must refresh HitDef only at authored seven-tick intervals')
			near(state.vx,if age>=elementTime(1000,3) then 4 else 0)
		end
		s=step(s,slot,{})
		expect(s.fighters[slot].state.stateNo==0 and s.fighters[slot].state.ctrl,'Roll recovery on exact AIR end')
	end)
	for _, guarded in {false,true} do
		test(label .. 'normal contact permits QCF cancel on '..(if guarded then 'guard' else 'hit'), function()
			local s=setup(slot,facing,25)
			local defender=if guarded then direction(-facing,false) else {}
			s=step(s,slot,{x=true},defender)
			local contacted=false
			for _=1,8 do
				for _, event in events(s,slot,200) do expect(event.kind==(if guarded then 'guard' else 'hit'),'Normal contact kind'); contacted=true end
				if contacted then break end
				s=step(s,slot,{},defender)
			end
			expect(contacted,'Normal must contact actual defender')
			s=motion(s,slot,'a',defender)
			for _=1,12 do if s.fighters[slot].state.stateNo==1020 then break end; s=step(s,slot,{},defender) end
			expect(s.fighters[slot].state.stateNo==1020,'Buffered real motion must cancel after contact / hitpause')
		end)
		test(label .. 'toss '..(if guarded then 'guard' else 'hit')..' retains original CNS provenance', function()
			local defender=if guarded then direction(-facing,false) else {}
			local s=motion(setup(slot,facing,90),slot,'a',defender)
			for _=1,100 do
				for _, event in events(s,slot,1020) do
					expect(event.source=='player.cns' and event.line>0,'Projectile provenance: source='..event.source..', line='..event.line)
					return
				end
				s=step(s,slot,{},defender)
			end
			error('Missing toss contact for provenance check')
		end)
		test(label .. 'toss source element timing, mirrored projectile '..(if guarded then 'guard' else 'hit')..' and removal', function()
			local s=setup(slot,facing,90)
			local defender=if guarded then direction(-facing,false) else {}
			s=motion(s,slot,'a',defender)
			local spawnTime=elementTime(1001,2)
			for age=0,spawnTime-1 do
				expect(#projectiles(s)==0,'Toss must not spawn before source AIR element 2')
				s=step(s,slot,{},defender)
			end
			expect(#projectiles(s)==1,'Toss must spawn exactly one projectile at AIR element 2')
			local projectile=projectiles(s)[1]
			expect(projectile.owner==slot and projectile.facing==facing and projectile.stateNo==1020 and projectile.anim==1011,'Projectile owner and source animation')
			near(projectile.x,s.fighters[slot].state.x+30*facing); near(projectile.y,-30)
			near(projectile.scale[1],.3); near(projectile.vx,7)
			local contacts=0; local removal=false
			for _=1,120 do
				for _, event in events(s,slot,1020) do
					contacts+=1; expect(event.kind==(if guarded then 'guard' else 'hit') and event.damage==(if guarded then 10 else 20),'Source toss damage and guard')
					expect(s.fighters[slot].state.hitPause==0,'Projectile contact must not freeze owner')
					for _, entity in projectiles(s) do if entity.serial==projectile.serial then removal=true; expect(entity.removing and entity.anim==1012,'Projectile must switch to authored removal AIR') end end
				end
				s=step(s,slot,{},defender)
			end
			expect(contacts==1 and removal and #projectiles(s)==0,'Toss must contact once, play removal and expire')
			expect(s.fighters[3-slot].life==1000-(if guarded then 10 else 20),'Toss final life')
		end)
	end
	test(label .. 'roll cannot cancel after whiff; repeated rolling contact uses fresh serials', function()
		local whiff=step(setup(slot,facing,300),slot,{x=true})
		whiff=motion(whiff,slot,'a')
		expect(whiff.fighters[slot].state.stateNo==200 and whiff.fighters[slot].state.moveContact==0,'Whiff cannot special-cancel')
		local s=motion(setup(slot,facing,25),slot,'x')
		local serials: {[number]: boolean}={}; local hits=0
		for _=1,150 do
			for _, event in events(s,slot,1000) do
				expect(not serials[event.serial] and event.damage==15,'Each source rolling HitDef must hit once')
				serials[event.serial]=true; hits+=1
			end
			s=step(s,slot,{})
		end
		expect(hits>=2,'Roll must make multiple real contacts, not reuse one consumed HitDef')
		expect(s.fighters[3-slot].life==1000-hits*15,'Roll cumulative damage')
	end)
	test(label .. 'Hyper1 emits six projectiles at original AIR element times, once each', function()
		local s=setup(slot,facing,300); s.fighters[slot].state.power=1000
		s=step(s,slot,{x=true,y=true})
		local seen: {[number]: boolean}={}; local times: {number}={}
		for _=1,250 do
			for _, entity in projectiles(s) do
				if not seen[entity.serial] then
					seen[entity.serial]=true; table.insert(times,s.fighters[slot].state.time)
					expect(entity.stateNo==3000 and entity.owner==slot and entity.hit.definition.damage==30,'Hyper projectile source definition')
				end
			end
			s=step(s,slot,{})
		end
		expect(#times==6,'Hyper1 projectile count: '..#times)
		for index, element in {2,5,8,11,14,17} do expect(times[index]==elementTime(1030,element),'Hyper1 source emission time '..index) end
		expect(s.fighters[slot].state.stateNo==0 and s.fighters[slot].state.ctrl and s.fighters[slot].state.power==0,'Hyper1 return and one-time cost')
	end)
	test(label .. 'Hyper2 whiff never enters success states; real hit completes multihit finisher', function()
		local whiff=setup(slot,facing,300); whiff.fighters[slot].state.power=2000
		whiff=step(whiff,slot,{a=true,b=true})
		for _=1,120 do
			expect(whiff.fighters[slot].state.stateNo~=3011 and whiff.fighters[slot].state.stateNo~=3012 and #whiff.events==0,'Hyper2 whiff cannot enter success path')
			whiff=step(whiff,slot,{})
		end
		expect(whiff.fighters[slot].state.stateNo==0 and whiff.fighters[slot].state.power==0,'Hyper2 whiff recovery / cost')
		local s=setup(slot,facing,25); s.fighters[slot].state.power=2000
		s=step(s,slot,{a=true,b=true})
		local seenSuccess, seenFinisher=false,false
		local starter, lightHits, heavyHits=0,0,0
		local serials: {[number]: boolean}={}
		for _=1,650 do
			if s.fighters[slot].state.stateNo==3011 then seenSuccess=true end
			if s.fighters[slot].state.stateNo==3012 then seenFinisher=true end
			for _, event in s.events do
				if event.attacker~=slot then continue end
				expect(event.kind=='hit' and event.source=='player.cns' and not serials[event.serial],'Hyper2 actual hits and fresh source HitDefs')
				serials[event.serial]=true
				if event.stateNo==3010 then starter+=1; expect(event.damage==20 and s.fighters[slot].state.stateNo==3011,'p1stateno must enter success on real hit')
				elseif event.stateNo==3012 and event.damage==20 then lightHits+=1
				elseif event.stateNo==3012 and event.damage==200 then heavyHits+=1
				else error('Unexpected Hyper2 contact '..event.stateNo..' damage '..event.damage) end
			end
			s=step(s,slot,{})
		end
		expect(seenSuccess and seenFinisher and starter==1 and lightHits==10 and heavyHits==1,'Hyper2 contact counts: '..starter..'/'..lightHits..'/'..heavyHits)
		expect(s.fighters[3-slot].life==580,'Hyper2 authored 20+10*20+200 damage')
		expect(s.fighters[slot].state.stateNo==0 and s.fighters[slot].state.ctrl and s.fighters[slot].state.power==0,'Hyper2 recovery and cost')
	end)
	test(label .. 'Hyper2 source starter has no guardflag: holding back must not fabricate guard-success', function()
		local s=setup(slot,facing,25); s.fighters[slot].state.power=2000
		local back=direction(-facing,false)
		s=step(s,slot,{a=true,b=true},back)
		local hit=false
		for _=1,80 do
			for _, event in events(s,slot,3010) do
				expect(event.kind=='hit' and s.fighters[slot].state.stateNo==3011,'Authored unblockable starter must be a real unguarded hit')
				hit=true
			end
			if hit then break end
			s=step(s,slot,{},back)
		end
		expect(hit,'Hyper2 back-holding defender must contact starter')
	end)
end end
for slot=1,2 do for _, facing in {1,-1} do
	local label='slot '..slot..' facing '..facing..': '
	test(label .. 'roll guard deals repeated authored chip without fabricating hit feedback', function()
		local back=direction(-facing,false)
		local s=motion(setup(slot,facing,25),slot,'x',back)
		local contacts=0
		for _=1,150 do
			for _, event in events(s,slot,1000) do
				contacts+=1
				expect(event.kind=='guard' and event.damage==5 and s.fighters[slot].state.moveGuarded>0 and s.fighters[slot].state.moveHit==0,'Roll real guarded contact and feedback')
			end
			s=step(s,slot,{},back)
		end
		expect(contacts>=2 and s.fighters[3-slot].life==1000-contacts*5,'Repeated source roll chip')
	end)
	test(label .. 'hyper commands cannot spend power in air or uncontrolled recovery', function()
		for _, chord: Commands.Input in {{x=true,y=true},{a=true,b=true}} do
			local s=step(setup(slot,facing),slot,{up=true})
			for _=1,8 do if s.fighters[slot].state.stateNo==50 then break end; s=step(s,slot,{}) end
			s.fighters[slot].state.power=3000; s=step(s,slot,chord)
			expect(s.fighters[slot].state.stateNo~=3000 and s.fighters[slot].state.stateNo~=3010 and s.fighters[slot].state.power>=3000,'Air hyper gate must not charge cost')
			s=step(setup(slot,facing),slot,{s=true}); s.fighters[slot].state.power=3000
			s=step(s,slot,chord)
			expect(s.fighters[slot].state.stateNo==195 and s.fighters[slot].state.power==3000,'Uncontrolled taunt cannot enter or spend hyper')
		end
	end)
end end
test('combat recovery uses exported source chords rather than jump input', function()
	local function falling(): Combat.Snapshot
		local s=setup(1,1,300)
		s.fighters[1].state=State.transition(program[1].machine,s.fighters[1].state,5050)
		s.fighters[1].state.y=-100
		s.fighters[1].reaction={kind='hit',remaining=30,slideRemaining=0,fall=true,recover=true,recoverTime=0,age=10}
		return s
	end
	local s=step(falling(),1,{up=true})
	expect(s.fighters[1].reaction~=nil,'Up does not replace source recovery command')
	s=step(falling(),1,{x=true,y=true})
	s=step(s,1,{})
	expect(s.fighters[1].reaction==nil and s.fighters[1].state.ctrl,'Buffered source chord recovers in combat host')
end)
test('actual knockout enters source victory and rejects further player input', function()
	local s=setup(1,1,20)
	s.fighters[2].life=1
	for tick=1,90 do
		s=step(s,1,if tick==1 then {x=true} else {})
		if s.finished then break end
	end
	expect(s.finished==true and s.winner==1,'Winner determined by real contact')
	expect(s.fighters[1].state.stateNo==181,'Source 180→181 runs at knockout')
	for _=1,60 do s=step(s,1,{right=true,x=true,a=true,b=true}) end
	expect(s.fighters[1].state.stateNo==181 and not s.fighters[1].state.ctrl,'Finished match input lock')
end)
print('Coiny gameplay: '..passed..' passed, '..failed..' failed')
assert(failed==0, tostring(failed)..' Coiny gameplay integration tests failed')
