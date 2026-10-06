--!strict
local C=require('../../runtime/MugenCombat')
local S=require('../../runtime/MugenState')
local config: C.Config=require('../../generated/luau/coiny-checkpoint')
local p=C.compile({config,config})
local count=0
local function test(name: string, run: () -> ()) run(); count+=1; print('PASS Coiny normals: '..name) end
local function near(a: number,b: number) assert(math.abs(a-b)<1e-8,tostring(a)..' ~= '..tostring(b)) end
local function flight(state: S.Snapshot,y: number,vy: number)
	state.y=y; state.vy=vy
end
local function inputs(index: number,a: any,b: any?): {any}
	local result: {any}={{},{}}; result[index]=a; result[3-index]=b or {}; return result
end
local function setup(posture: string,index: number,gap: number?): C.Snapshot
	local s=C.new(p,{0,gap or 30})
	if posture=='A' then
		for i=1,2 do
			s.fighters[i].state=S.transition(p[i].machine,s.fighters[i].state,50)
			s.fighters[i].state.y=-80; s.fighters[i].state.vy=-3
		end
	elseif posture=='C' then
		s=C.step(p,s,inputs(index,{down=true}))
	end
	return s
end
local function attack(posture: string,button: string?): any
	local input: any={down=posture=='C'}; if button then input[button]=true end; return input
end
local function guard(s: C.Snapshot,index: number,posture: string): any
	return {left=s.fighters[index].state.facing==1,right=s.fighters[index].state.facing==-1,down=posture=='C'}
end
for _, posture in {'C','A'} do
	for n,button in {'x','y','z'} do
		local id=(if posture=='C' then 400 else 600)+(n-1)*10
		test(tostring(id)..' source activation, hit/guard and mirrored slots',function()
			for index=1,2 do for _, guarded in {false,true} do
				local s=setup(posture,index)
				local defender=if guarded then guard(s,3-index,posture) else {}
				local hits=0
				for tick=1,12 do
					s=C.step(p,s,inputs(index,attack(posture,if tick==1 then button else nil),defender))
					if tick==1 then
						assert(s.fighters[index].state.stateNo==id and not s.fighters[index].state.ctrl)
						assert((s.fighters[index].state.hit :: S.ActiveHit).definition.attr==(if id==620 then 'A, NA' else 'S, NA'))
					end
					for _, event in s.events do
						assert(event.attacker==index and event.stateNo==id and event.source=='player.cns')
						assert(event.kind==(if guarded then 'guard' else 'hit'))
						assert(event.damage==(if guarded then 10 elseif id==620 then 35 else 20))
						hits+=1
					end
				end
				assert(hits==1,tostring(id)..' missing/duplicate contact: '..hits)
			end end
		end)
	end
end
for _, posture in {'C','A'} do
	for _, direct in {false,true} do
		test(posture..(if direct then ' x→z' else ' x→y→z')..' cancels follow real hit and guard contacts',function()
			for index=1,2 do for _, guarded in {false,true} do
				local s=setup(posture,index,25)
								if posture=='A' then
									flight(s.fighters[index].state,-50,-5)
									flight(s.fighters[3-index].state,-20,-8)
								end
								local defender=if guarded then guard(s,3-index,posture) else {}
				local base=if posture=='C' then 400 else 600
				local sequence=if direct then {base,base+20} else {base,base+10,base+20}
				local contacts: {number}={}
				local queued: {[number]: boolean}={}
				for tick=1,40 do
					local button: string?=if tick==1 then 'x' else nil
					local state=s.fighters[index].state
					if state.moveContact>0 and not queued[state.stateNo] then
						if state.stateNo==base then button=if direct then 'z' else 'y'
						elseif state.stateNo==base+10 then button='z' end
						queued[state.stateNo]=true
					end
					s=C.step(p,s,inputs(index,attack(posture,button),defender))
					for _, event in s.events do
						assert(event.attacker==index and event.kind==(if guarded then 'guard' else 'hit'))
						table.insert(contacts,event.stateNo)
					end
				end
				assert(#contacts==#sequence,posture..' contacts: '..table.concat(contacts,','))
				for i,id in sequence do assert(contacts[i]==id) end
				local damage=if guarded then #sequence*10 else (#sequence-1)*20+(if posture=='A' then 35 else 20)
				assert(s.fighters[3-index].life==1000-damage)
			end end
		end)
	end
end
test('simultaneous down+attack uses original crouch routes without lost input',function()
	for n,button in {'x','y','z'} do
		local s=C.step(p,C.new(p,{0,300}),{{down=true,[button]=true},{}})
		assert(s.fighters[1].state.stateNo==400+(n-1)*10)
	end
end)
test('whiffs cannot cancel before source control recovery and held buttons do not repeat',function()
	for _, posture in {'C','A'} do
		local s=setup(posture,1,300); local base=if posture=='C' then 400 else 600
		s=C.step(p,s,{{down=posture=='C',x=true},{}})
		for tick=1,10 do
			s=C.step(p,s,{{down=posture=='C',x=true,y=tick==2,z=tick==4},{}})
			assert(s.fighters[1].state.stateNo==base and s.fighters[1].state.moveContact==0 and #s.events==0)
		end
		for _=1,60 do s=C.step(p,s,{{down=posture=='C',x=true},{}}) end
		assert(s.fighters[1].state.stateNo==(if posture=='C' then 11 else 0))
		assert(s.fighters[1].state.power==(if posture=='C' then 15 else 11))
	end
end)
test('source crouch normals return at AnimTime zero and retain source power/friction',function()
	for n,button in {'x','y','z'} do
		local s=setup('C',1,300)
		s=C.step(p,s,{{down=true,[button]=true},{}})
		s.fighters[1].state.vx=10
		s=C.step(p,s,{{down=true},{}}); near(s.fighters[1].state.vx,8.2)
		for _=2,14 do s=C.step(p,s,{{down=true},{}}); assert(s.fighters[1].state.stateNo==400+(n-1)*10) end
		s=C.step(p,s,{{down=true},{}})
		assert(s.fighters[1].state.stateNo==11 and s.fighters[1].state.ctrl and not s.fighters[1].state.hit)
		assert(s.fighters[1].state.power==(if n==1 then 15 else 50))
	end
end)
test('authored air control restores at Time20; held AIR frames remain until landing',function()
	for n,button in {'x','y','z'} do
		local s=setup('A',1,300); local id=600+(n-1)*10
		s=C.step(p,s,{{[button]=true},{}})
		for age=1,19 do s=C.step(p,s,{{},{}}); assert(s.fighters[1].state.stateNo==id and not s.fighters[1].state.ctrl) end
		s=C.step(p,s,{{},{}}); assert(s.fighters[1].state.time==20 and s.fighters[1].state.ctrl)
		assert(s.fighters[1].state.animElem==(if id==620 then 2 else 4))
		assert(s.fighters[1].state.power==({11,65,70})[n])
		s=C.step(p,s,{{x=true},{}}); assert(s.fighters[1].state.stateNo==600 and s.fighters[1].state.time==0)
	end
end)
test('jump-to-authored-attack gravity integrates once, including initial tick and hitpause',function()
	local s=setup('A',1,300); local before=s.fighters[1].state
	s=C.step(p,s,{{x=true},{}}); near(s.fighters[1].state.y,before.y+before.vy); near(s.fighters[1].state.vy,before.vy+.44)
	for _=1,8 do
		before=s.fighters[1].state; s=C.step(p,s,{{},{}})
		near(s.fighters[1].state.y,before.y+before.vy); near(s.fighters[1].state.vy,before.vy+.44)
	end
	s.fighters[1].state.hitPause=2; before=s.fighters[1].state
	for _=1,2 do s=C.step(p,s,{{},{}}); near(s.fighters[1].state.y,before.y); near(s.fighters[1].state.vy,before.vy) end
end)
test('all air normals land, clear HitDef and restore grounded control through shared landing',function()
	for _, button in {'x','y','z'} do
		local s=setup('A',1,300); s.fighters[1].state.y=-1; s.fighters[1].state.vy=2
		s=C.step(p,s,{{[button]=true},{}})
		assert(s.fighters[1].state.stateNo==52 and s.fighters[1].state.y==0 and not s.fighters[1].state.hit and not s.fighters[1].state.ctrl)
		for _=1,4 do s=C.step(p,s,{{},{}}) end
		assert(s.fighters[1].state.stateNo==0 and s.fighters[1].state.ctrl)
		s=C.step(p,s,{{x=true},{}}); assert(s.fighters[1].state.stateNo==200)
	end
end)
test('air-z HA guards standing/air but hits crouch and produces a falling reaction',function()
	for _, posture in {'S','C'} do
		local s=C.new(p,{0,25}); s.fighters[1].state=S.transition(p[1].machine,s.fighters[1].state,50)
		s.fighters[1].state.y=-10; s.fighters[1].state.vy=0
		s=C.step(p,s,{{z=true},guard(s,2,posture)})
		assert(#s.events==1 and s.events[1].kind==(if posture=='C' then 'hit' else 'guard'))
		assert(s.fighters[2].life==(if posture=='C' then 965 else 990))
		if posture=='C' then assert((s.fighters[2].reaction :: C.Reaction).fall and s.fighters[2].state.stateType=='A') end
	end
end)
test('real jump inputs route air normals then land without injected state or contacts',function()
	for _, button in {'x','y','z'} do
		local s=C.new(p,{0,300}); s=C.step(p,s,{{up=true},{}})
		for _=1,3 do s=C.step(p,s,{{},{}}) end
		assert(s.fighters[1].state.stateType=='A')
		s=C.step(p,s,{{[button]=true},{}}); assert(s.fighters[1].state.stateNo==({x=600,y=610,z=620})[button])
		for _=1,70 do s=C.step(p,s,{{},{}}) end
		assert(s.fighters[1].state.stateNo==0 and s.fighters[1].state.y==0 and s.fighters[1].state.ctrl)
	end
end)
print(tostring(count)..' source-driven crouch/air normal tests passed')
