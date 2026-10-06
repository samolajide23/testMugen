--!strict
local C = require('../../runtime/MugenCombat')
local S = require('../../runtime/MugenState')
local imported: C.Config = require('../../generated/luau/coiny-checkpoint')
local count=0
local function test(name: string, run: () -> ()) run(); count+=1; print('PASS MugenCombat: '..name) end
local function fails(run: () -> ()) assert(not pcall(run),'Expected explicit rejection') end
local function entries(values: {[string]: string}): {S.Entry}
	local result: {S.Entry}={}; for key,value in values do table.insert(result,{key=key,value=value}) end; return result
end
local function fixture(overrides: {[string]: string}?): any
	local hit={attr='S,NA',damage='20,5',pausetime='2,3',['guard.pausetime']='1,2',guardflag='M',
		['ground.type']='High',animtype='Light',['ground.hittime']='4',['ground.slidetime']='2',
		['guard.hittime']='5',['guard.slidetime']='1',['ground.velocity']='-1',['guard.velocity']='-.5',priority='4,Hit'}
	for key,value in overrides or {} do (hit :: {[string]: string})[key]=value end
	local controllerEntries=entries(hit); table.insert(controllerEntries,{key='trigger1',value='time=0'})
	local function frame(attack: boolean): any
		return {attackBoxes=if attack then {{5,-10,15,0}} else {},hurtBoxes={{-2,-10,2,0}},x=999,y=999,flip='HV'}
	end
	return {startState=0,commands={{name='x',command='x',time=1,bufferTime=1}},
		combat={life=100,attack=100,defence=100,xscale=1,yscale=1,localcoord={320,240},guardState=150,hitState=5000,guardAnim=150,hitAnims={High={Light=5000}}},
		states={
			{id=-1,entries={},controllers={{type='ChangeState',entries=entries({trigger1='command = "x" && ctrl',value='200'})}}},
			{id=0,entries=entries({type='S',movetype='I',physics='S',anim='0',ctrl='1',velset='0,0'}),controllers={}},
			{id=200,entries=entries({type='S',movetype='A',physics='N',anim='200',ctrl='0',velset='0,0'}),controllers={{type='HitDef',entries=controllerEntries,source='fixture.cns',line=10}}},
			{id=150,entries=entries({type='S',movetype='H',physics='N',anim='150',ctrl='0',velset='0,0'}),controllers={}},
			{id=5000,entries=entries({type='S',movetype='H',physics='N',anim='5000',ctrl='0',velset='0,0'}),controllers={}},
		},animations={{id=0,durations={-1},loopStart=1,frames={frame(false)}},
			{id=200,durations={2,2,-1},loopStart=1,frames={frame(false),frame(true),frame(true)}},
			{id=150,durations={-1},loopStart=1,frames={frame(false)}},{id=5000,durations={-1},loopStart=1,frames={frame(false)}}}}
end
local function start(p: C.Program, positions: {number}?, second: boolean?): C.Snapshot
	local s=C.new(p,positions or {0,10})
	for _=1,3 do s=C.step(p,s,{{x=true},{x=second==true}}) end
	return s
end
test('HitDef activation waits for AIR Clsn1 and does not mutate prior snapshots',function()
	local config=fixture(); local p=C.compile({config,config}); local initial=C.new(p,{0,10})
	local s=C.step(p,initial,{{x=true},{}}); assert(#s.events==0 and s.fighters[1].state.hit)
	s=C.step(p,s,{{},{}}); local before=s; assert(#s.events==0 and s.fighters[2].life==100)
	s=C.step(p,s,{{},{}}); assert(#s.events==1 and s.events[1].damage==20 and s.events[1].source=='fixture.cns')
	assert(s.fighters[2].life==80 and s.fighters[1].state.moveHit==1 and s.fighters[1].state.moveContact==1)
	assert(before.fighters[2].life==100 and not (before.fighters[1].state.hit :: S.ActiveHit).targets[2])
	assert(initial.tick==0 and initial.fighters[1].state.stateNo==0 and initial.fighters[2].life==100)
	assert(config.animations[2].frames[2].attackBoxes[1][1]==5)
end)
test('world facing, imported scale, sprite-independent boxes and inclusive edges',function()
	local config=fixture(); local p=C.compile({config,config})
	assert(#start(p,{20,10}).events==1)
	assert(#start(p,{0,17}).events==1 and #start(p,{0,17.01}).events==0)
	config.combat.xscale=.1; config.combat.yscale=.1
	for _, frame in config.animations[2].frames do if #frame.attackBoxes>0 then frame.attackBoxes={{50,-100,150,0}} end end
	p=C.compile({config,config}); assert(#start(p,{0,10}).events==1 and #start(p,{0,20}).events==0)
	for _, frame in config.animations[2].frames do if #frame.attackBoxes>0 then frame.attackBoxes={{50,-200,150,-150}} end end
	p=C.compile({config,config}); assert(#start(p,{0,10}).events==0)
end)
test('hitpause freezes animation, reaction clocks and pushback; recovery restores control',function()
	local p=C.compile({fixture(),fixture()}); local s=start(p); local age=s.fighters[1].state.time
	assert(s.fighters[1].state.hitPause==2 and s.fighters[2].state.hitPause==3)
	for _=1,2 do s=C.step(p,s,{{},{}}); assert(s.fighters[1].state.time==age and s.fighters[2].state.x==10 and (s.fighters[2].reaction :: C.Reaction).remaining==4) end
	s=C.step(p,s,{{},{}}); assert(s.fighters[1].state.time==age+1 and s.fighters[2].state.x==10)
	for tick=1,4 do s=C.step(p,s,{{},{}}); assert(s.fighters[2].state.x==10+math.min(tick,2)) end
	assert(not s.fighters[2].state.ctrl and (s.fighters[2].reaction :: C.Reaction).remaining==0)
	s=C.step(p,s,{{},{}}); assert(s.fighters[2].state.ctrl and not s.fighters[2].reaction and s.fighters[2].state.stateNo==0)
end)
test('back guards with authored chip, pauses and guard clocks',function()
	local p=C.compile({fixture(),fixture()}); local s=C.new(p,{0,10})
	for _=1,3 do s=C.step(p,s,{{x=true},{right=true}}) end
	assert(s.events[1].kind=='guard' and s.fighters[2].life==95 and s.fighters[2].state.anim==150)
	assert(s.fighters[1].state.moveGuarded==1 and s.fighters[1].state.moveHit==0)
	assert(s.fighters[1].state.hitPause==1 and s.fighters[2].state.hitPause==2)
	assert((s.fighters[2].reaction :: C.Reaction).remaining==5)
	for _=1,3 do s=C.step(p,s,{{},{right=true}}) end
	assert(s.fighters[2].state.x==10.5 and (s.fighters[2].reaction :: C.Reaction).remaining==4)
	for _, input in {{left=true},{left=true,right=true},{right=true,down=true}} do
		s=C.new(p,{0,10}); for _=1,3 do s=C.step(p,s,{{x=true},input}) end; assert(s.events[1].kind=='hit')
	end
end)
test('one contact per activation and reentry rearms the hit',function()
	local p=C.compile({fixture(),fixture()}); local s=start(p)
	for _=1,30 do s=C.step(p,s,{{},{}}); assert(#s.events==0 and s.fighters[2].life==80) end
	s.fighters[1].state=S.transition(p[1].machine,s.fighters[1].state,200)
	for _=1,3 do s=C.step(p,s,{{},{}}) end
	assert(#s.events==1 and s.fighters[2].life==60 and s.events[1].serial==2)
end)
test('simultaneous trade, numeric priority and Hit/Miss/Dodge are slot-independent',function()
	for _, pair in {{'4,Hit','4,Hit',2},{'5,Hit','4,Hit',1},{'4,Hit','4,Miss',1},{'4,Hit','4,Dodge',0},{'4,Miss','4,Miss',0}} do
		for _, reverse in {false,true} do
			local a,b=fixture({priority=pair[1] :: string}),fixture({priority=pair[2] :: string})
			local p=C.compile(if reverse then {b,a} else {a,b}); local s=start(p,nil,true)
			assert(#s.events==pair[3])
			if pair[3]==1 then assert(s.events[1].attacker==(if reverse then 2 else 1)) end
			if pair[3]==2 then assert(s.fighters[1].life==80 and s.fighters[2].life==80 and s.fighters[1].state.hit==nil and s.fighters[2].state.hit==nil) end
		end
	end
end)
test('attack/defence scaling, life clamp and defeated actors cannot attack',function()
	local a,b=fixture({damage='300'}),fixture(); a.combat.attack=50; b.combat.defence=200
	local p=C.compile({a,b}); local s=start(p); assert(s.events[1].damage==75 and s.fighters[2].life==25)
	p=C.compile({fixture({damage='300'}),fixture()}); s=start(p); assert(s.events[1].damage==100 and s.fighters[2].life==0)
	for _=1,20 do s=C.step(p,s,{{},{x=true}}); assert(s.fighters[2].life==0 and not s.fighters[2].state.ctrl and not s.fighters[2].state.hit and #s.events==0) end
end)
test('unsupported coordinates and missing boxes reject; standard airborne motion is supported',function()
	local c=fixture(); c.combat.localcoord={640,480}; fails(function() C.compile({c,c}) end)
	c=fixture(); c.animations[1].frames=nil; fails(function() C.compile({c,c}) end)
	local p=C.compile({fixture({['ground.velocity']='-1,-2'}),fixture()}); local s=start(p)
	assert(s.fighters[2].state.stateType=='A' and s.fighters[2].state.vy==-2)
	p=C.compile({fixture(),fixture()}); s=C.new(p); s.fighters[2].state.stateType='A'
	assert(C.step(p,s,{{},{}}).fighters[2].state.y==0)
end)
test('Coiny original AIR activates at age four, then deals authored damage',function()
	local p=C.compile({imported,imported}); local s=C.new(p)
	for age=0,4 do
		s=C.step(p,s,{{x=true},{}})
		assert(#s.events==(if age==4 then 1 else 0))
	end
	assert(s.events[1].stateNo==200 and s.events[1].damage==20 and s.fighters[2].life==980)
	assert(s.fighters[1].state.hitPause==3 and s.fighters[2].state.hitPause==3)
	assert((s.fighters[2].reaction :: C.Reaction).remaining==10 and (s.fighters[2].reaction :: C.Reaction).slideRemaining==5)
	assert(s.fighters[2].state.anim==5000)
end)
test('Coiny authored cancels use real contact and pause-buffered inputs',function()
	local p=C.compile({imported,imported}); local s=C.new(p); local damage=0
	for _=1,5 do s=C.step(p,s,{{x=true},{}}) end
	damage+=s.events[1].damage
	for _, normal in {{button='y',state=210,age=4},{button='z',state=220,age=5}} do
		s=C.step(p,s,{{[normal.button]=true},{}}); assert(s.fighters[1].state.stateNo~=normal.state)
		for _=1,2 do s=C.step(p,s,{{},{}}) end
		s=C.step(p,s,{{},{}}); assert(s.fighters[1].state.stateNo==normal.state and s.fighters[1].state.time==0 and s.fighters[1].state.moveContact==0)
		for _=1,normal.age do s=C.step(p,s,{{},{}}) end
		assert(#s.events==1 and s.events[1].stateNo==normal.state and s.events[1].kind=='hit')
		damage+=s.events[1].damage
	end
	assert(damage==60 and s.fighters[2].life==940 and s.fighters[1].state.power==150)
end)
test('Coiny guard contact enables the original x to z cancel',function()
	local p=C.compile({imported,imported}); local s=C.new(p)
	for _=1,5 do s=C.step(p,s,{{x=true},{right=true}}) end
	assert(s.events[1].kind=='guard' and s.events[1].damage==10 and s.fighters[2].state.anim==150)
	s=C.step(p,s,{{z=true},{right=true}})
	for _=1,3 do s=C.step(p,s,{{},{right=true}}) end
	assert(s.fighters[1].state.stateNo==220)
end)
test('source-driven two-fighter replay is deterministic',function()
	local p=C.compile({imported,imported}); local a,b=C.new(p),C.new(p)
	for tick=1,100 do
		local input={{x=tick%30==1,y=tick%30==6,z=tick%30==14},{right=tick%60>30}}
		a=C.step(p,a,input); b=C.step(p,b,input); assert(#a.events==#b.events)
		for index=1,2 do
			local x,y=a.fighters[index],b.fighters[index]
			assert(x.life==y.life and x.state.stateNo==y.state.stateNo and x.state.time==y.state.time and x.state.x==y.state.x and x.state.rng==y.state.rng)
		end
	end
end)
print(tostring(count)..' source-driven combat tests passed')
