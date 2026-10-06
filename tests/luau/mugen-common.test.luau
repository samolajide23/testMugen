--!strict
local C=require('../../runtime/MugenCombat')
local S=require('../../runtime/MugenState')
local count=0
local function test(name: string, run: () -> ()) run(); count+=1; print('PASS MugenCommon: '..name) end
local function entries(values: {[string]: string}): {S.Entry}
	local result: {S.Entry}={}; for key,value in values do table.insert(result,{key=key,value=value}) end; return result
end
local function fixture(overrides: {[string]: string}?): any
	local hit={attr='S,NA',damage='20,5',pausetime='0,0',['guard.pausetime']='0,0',guardflag='HLA',hitflag='HLAF',
		['ground.type']='High',animtype='Light',['ground.hittime']='4',['ground.slidetime']='2',
		['guard.hittime']='5',['guard.slidetime']='1',['ground.velocity']='-1,0',['guard.velocity']='-.5',priority='4,Hit'}
	for key,value in overrides or {} do hit[key]=value end
	local h=entries(hit); table.insert(h,{key='trigger1',value='time=0'})
	local animations: {any}={}
	for id=0,30 do table.insert(animations,{id=id,durations={-1},loopStart=1,frames={{attackBoxes={},hurtBoxes={{-3,-12,3,0}}}}}) end
	table.insert(animations,{id=200,durations={-1},loopStart=1,frames={{attackBoxes={{-20,-100,20,20}},hurtBoxes={{-3,-12,3,0}}}}})
	return {startState=0,commands={{name='x',command='x',time=1,bufferTime=1}},
		combat={life=100,attack=100,defence=100,xscale=1,yscale=1,localcoord={320,240},guardState=150,hitState=5000,guardAnim=15,hitAnims={High={Light=18}},
			common={movement={walkForward=2,walkBack=-1,jump={x=2,y=-6},jumpForward=3,jumpBack=-2,
				airJump={x=1,y=-5},airJumpForward=2,airJumpBack=-1,airJumpNum=1,airJumpHeight=4,gravity=1,standFriction=.8,crouchFriction=.6},
				reactions={liedownTime=3},size={groundBack=3,groundFront=3,height=12},
				animations={idle=0,walkForward=1,walkBack=2,crouchDown=3,crouch=4,crouchUp=5,jumpStart=6,jumpNeutral=7,jumpForward=8,jumpBack=9,
					landing=10,guardStand=11,guardCrouch=12,guardAir=13,hitStandLight=18,hitStandMedium=19,hitStandHard=20,
					hitLowLight=21,hitLowMedium=22,hitLowHard=23,hitCrouch=24,hitAir=25,fall=26,down=27,getUp=28,ko=29}}},
		states={{id=-1,entries={},controllers={{type='ChangeState',entries=entries({trigger1='command="x" && ctrl',value='200'})}}},
			{id=0,entries=entries({type='S',movetype='I',physics='N',anim='0',ctrl='1',velset='0,0'}),controllers={}},
			{id=200,entries=entries({type='S',movetype='A',physics='N',anim='200',ctrl='0',velset='0,0'}),controllers={{type='HitDef',entries=h}}}},animations=animations}
end
local function advance(p: C.Program, s: C.Snapshot, ticks: number, a: any?, b: any?): C.Snapshot
	for _=1,ticks do s=C.step(p,s,{a or {},b or {}}) end; return s
end
local function air(p: C.Program,s: C.Snapshot,index: number,y: number): ()
	s.fighters[index].state=S.transition(p[index].machine,s.fighters[index].state,50)
	s.fighters[index].state.y=y; s.fighters[index].state.vy=0; s.fighters[index].state.ctrl=true
end
local function strike(overrides: {[string]: string}?, posture: string?, input: any?): C.Snapshot
	local p=C.compile({fixture(overrides),fixture()}); local s=C.new(p,{0,5})
	if posture=='A' then air(p,s,2,-20)
	elseif posture=='C' then s.fighters[2].state=S.transition(p[2].machine,s.fighters[2].state,11)
	elseif posture=='L' then s.fighters[2].state=S.transition(p[2].machine,s.fighters[2].state,5110) end
	return C.step(p,s,{{x=true},input or {}})
end
test('idle, facing-relative walking, crouch down/hold/up and immutable inputs',function()
	for _, positions in {{0,100},{100,0}} do
		local c=fixture(); local p=C.compile({c,c}); local s=C.new(p,positions); local old=s
		local forward=if positions[1]<positions[2] then {right=true} else {left=true}
		local back=if positions[1]<positions[2] then {left=true} else {right=true}
		s=C.step(p,s,{forward,{}}); assert(s.fighters[1].state.stateNo==20 and s.fighters[1].state.anim==1)
		assert(s.fighters[1].state.x==positions[1]+2*s.fighters[1].state.facing and old.fighters[1].state.x==positions[1])
		s=C.step(p,s,{back,{}}); assert(s.fighters[1].state.anim==2 and s.fighters[1].state.vx==-1)
		s=C.step(p,s,{{},{}}); assert(s.fighters[1].state.stateNo==0 and s.fighters[1].state.vx==-.8)
		s=C.step(p,s,{{down=true},{}}); assert(s.fighters[1].state.stateNo==10)
		s=advance(p,s,4,{down=true}); assert(s.fighters[1].state.stateNo==11 and s.fighters[1].state.ctrl)
		s=C.step(p,s,{{},{}}); assert(s.fighters[1].state.stateNo==12)
		s=advance(p,s,2); assert(s.fighters[1].state.stateNo==0 and s.fighters[1].state.ctrl)
		assert(c.states[2].entries[1].value=='S' and #c.states==3)
	end
end)
test('jump startup, neutral/forward/back, air-jump limits and landing reset',function()
	for _, input in {{up=true},{up=true,right=true},{up=true,left=true}} do
		local p=C.compile({fixture(),fixture()}); local s=C.new(p,{0,100})
		s=C.step(p,s,{input,{}}); assert(s.fighters[1].state.stateNo==40 and s.fighters[1].state.y==0)
		s=advance(p,s,3,input); assert(s.fighters[1].state.stateNo==50 and s.fighters[1].state.y<0)
		assert(s.fighters[1].state.anim==(if input.right then 8 elseif input.left then 9 else 7))
		local vy=s.fighters[1].state.vy
		s=C.step(p,s,{input,{}}); assert(s.fighters[1].state.vy==vy+1 and s.fighters[1].airJumps==0)
		s=C.step(p,s,{{},{}}); s=C.step(p,s,{{up=true},{}}); assert(s.fighters[1].airJumps==1 and s.fighters[1].state.vy==-4)
		s=C.step(p,s,{{},{}}); s=C.step(p,s,{{up=true},{}}); assert(s.fighters[1].airJumps==1 and s.fighters[1].state.vy==-2)
		local landed=false
		for _=1,40 do s=C.step(p,s,{{},{}}); if s.fighters[1].state.stateNo==52 then landed=true; assert(s.fighters[1].airJumps==0 and s.fighters[1].state.y==0) end end
		assert(landed and s.fighters[1].state.stateNo==0)
	end
end)
test('mirrored slots, jump direction latching, height limits and single host friction',function()
	for index=1,2 do
		local config=fixture(); config.combat.common.movement.airJumpHeight=100
		local p=C.compile({config,config}); local s=C.new(p,{0,100})
		local input: {any}={{},{}}; input[index]=if index==1 then {up=true,right=true} else {up=true,left=true}
		s=C.step(p,s,input); s=advance(p,s,3)
		assert(s.fighters[index].state.anim==8 and s.fighters[index].state.vx==3)
		assert(s.fighters[index].state.x==(if index==1 then 3 else 97))
		input[index]={up=true}; s=C.step(p,s,input); assert(s.fighters[index].airJumps==0)
	end
	local config=fixture(); config.states[2].entries=entries({type='S',movetype='I',physics='S',anim='0',ctrl='1',velset='0,0'})
	local p=C.compile({config,config}); local s=C.new(p,{0,100}); s.fighters[1].state.vx=10
	s=C.step(p,s,{{},{}}); assert(s.fighters[1].state.vx==8 and s.fighters[1].state.x==8)
	config.combat.common.movement.standFriction=0; config.combat.common.movement.jump.y=-99
	s=C.step(p,s,{{},{}}); assert(s.fighters[1].state.vx==6.4)
end)
test('source attacks are never reset by held common motion input',function()
	local p=C.compile({fixture(),fixture()}); local s=C.new(p,{0,100})
	s=C.step(p,s,{{x=true,right=true},{}}); assert(s.fighters[1].state.stateNo==200)
	for _=1,12 do s=C.step(p,s,{{down=true,up=true,left=true},{}}); assert(s.fighters[1].state.stateNo==200) end
end)
test('authored aerial CtrlSet permits limited air jumps without resetting locked attacks',function()
	for _, limit in {0,1} do
		local c=fixture(); c.gravity=1; c.combat.common.movement.airJumpNum=limit
		c.states[3].entries=entries({type='A',movetype='A',physics='A',anim='200',ctrl='0'})
		table.insert(c.states[3].controllers,{type='CtrlSet',entries=entries({trigger1='time=20',value='1'})})
		local p=C.compile({c,c}); local s=C.new(p,{0,300}); air(p,s,1,-300)
		s=C.step(p,s,{{x=true},{}}); s=C.step(p,s,{{up=true},{}})
		assert(s.fighters[1].state.stateNo==200 and s.fighters[1].airJumps==0)
		for _=2,20 do s=C.step(p,s,{{},{}}) end
		assert(s.fighters[1].state.ctrl and s.fighters[1].state.time==20)
		s=C.step(p,s,{{up=true},{}})
		assert(s.fighters[1].state.stateNo==(if limit==1 then 50 else 200) and s.fighters[1].airJumps==limit)
		if limit==1 then assert(s.fighters[1].state.vy==-4 and not s.fighters[1].state.hit) end
	end
end)
test('H/M standing, L/M crouch, A air, F fallen and S is not a flag',function()
	for _, case in {{'S','H',true},{'S','M',true},{'S','L',false},{'C','L',true},{'C','M',true},{'C','H',false},
		{'A','A',true},{'A','M',false},{'L','F',true},{'L','M',false}} do
		local s=strike({hitflag=case[2] :: string},case[1] :: string,if case[1]=='C' then {down=true} else nil)
		assert((#s.events>0)==case[3],tostring(case[1])..'/'..tostring(case[2]))
	end
	assert(not pcall(function() C.compile({fixture({hitflag='S'}),fixture()}) end))
end)
test('standing/crouch/air guards use posture flags and reaction animations',function()
	local p=C.compile({fixture({guardflag='M'}),fixture()}); local s=C.new(p,{0,5})
	s=C.step(p,s,{{},{right=true,down=true}}); assert(s.fighters[2].state.stateNo==10)
	s=C.step(p,s,{{x=true},{right=true,down=true}}); assert(s.events[1].kind=='guard')
	s=C.new(p,{0,5}); s=advance(p,s,3,nil,{right=true,down=true})
	s=C.step(p,s,{{x=true},{right=true,down=true}}); assert(s.events[1].kind=='guard' and s.fighters[2].state.stateNo==151)
	for _, case in {{'S','H',150,11},{'C','L',151,12},{'C','M',151,12},{'A','A',152,13}} do
		s=strike({guardflag=case[2] :: string},case[1] :: string,{right=true,down=case[1]=='C'})
		assert(s.events[1].kind=='guard' and s.fighters[2].life==95)
		assert(s.fighters[2].state.stateNo==case[3] and s.fighters[2].state.anim==case[4])
	end
	assert(strike({guardflag='L'},'S',{right=true}).events[1].kind=='hit')
	assert(strike({guardflag='H'},'C',{right=true,down=true}).events[1].kind=='hit')
	assert(strike({guardflag='M'},'A',{right=true}).events[1].kind=='hit')
end)
test('ground hit animation severity, crouch hit and air launch/gravity/landing',function()
	for _, kind in {'High','Low'} do for index,severity in {'Light','Medium','Hard'} do
		local s=strike({['ground.type']=kind,animtype=severity})
		assert(s.fighters[2].state.anim==(if kind=='High' then 17+index else 20+index))
	end end
	assert(strike(nil,'C',{down=true}).fighters[2].state.anim==24)
	local p=C.compile({fixture({['ground.velocity']='-1,-5'}),fixture()}); local s=C.new(p,{0,5})
	s=C.step(p,s,{{x=true},{}}); assert(s.fighters[2].state.stateNo==5020 and s.fighters[2].state.vy==-5)
	s=C.step(p,s,{{},{}}); assert(s.fighters[2].state.y==-5 and s.fighters[2].state.vy==-4)
	s=advance(p,s,30); assert(s.fighters[2].state.y==0 and s.fighters[2].state.ctrl)
end)
test('None is damage/pause only, Back uses hard fallback, Low does not crouch and common input is opt-in',function()
	local p=C.compile({fixture({['ground.type']='None',pausetime='2,3',['ground.velocity']='-8,-9'}),fixture()})
	local s=C.step(p,C.new(p,{0,5}),{{x=true},{}})
	assert(s.fighters[2].life==80 and s.fighters[2].state.stateNo==0 and s.fighters[2].state.vx==0 and not s.fighters[2].reaction)
	assert(s.fighters[2].state.hitPause==3)
	assert(strike({animtype='Back'}).fighters[2].state.anim==20)
	assert(strike({['ground.type']='Low'}).fighters[2].state.stateType=='S')
	local config=fixture(); config.combat.common=nil; p=C.compile({config,config})
	s=C.step(p,C.new(p,{0,100}),{{up=true,right=true,down=true},{}})
	assert(s.fighters[1].state.stateNo==0 and s.fighters[1].state.x==0 and s.fighters[1].state.y==0)
end)
test('fall and knockdown always get up; fallRecover only gates aerial recovery',function()
	for _, recover in {'1','0'} do
		local p=C.compile({fixture({fall='1',['fall.recover']=recover,['ground.velocity']='0,-4'}),fixture()})
		local s=C.step(p,C.new(p,{0,5}),{{x=true},{}}); local fallen=false; local down=false; local getup=false
		for _=1,40 do s=C.step(p,s,{{},{}}); local id=s.fighters[2].state.stateNo
			fallen=fallen or id==5050; down=down or id==5110; getup=getup or id==5120
		end
		assert(fallen and down)
		assert(getup and s.fighters[2].state.ctrl)
		p=C.compile({fixture({fall='1',['fall.recover']=recover,['fall.recovertime']='0',['ground.velocity']='0,-8'}),fixture()})
		s=C.step(p,C.new(p,{0,5}),{{x=true},{}})
		s=C.step(p,s,{{},{}}); s=C.step(p,s,{{},{up=true}})
		assert(s.fighters[2].state.ctrl==(recover=='1'))
	end
end)
test('air hit/guard constants, guard control clocks and fall bounce/recovery flags',function()
	local p=C.compile({fixture({['air.velocity']='-2,-6',['air.hittime']='9',yaccel='.5',guardflag='A',
		['airguard.velocity']='-3,-1',['airguard.hittime']='8',['airguard.ctrltime']='2',['airguard.slidetime']='4'}),fixture()})
	local s=C.new(p,{0,5}); air(p,s,2,-20); s=C.step(p,s,{{x=true},{}})
	assert(s.fighters[2].state.vx==-2 and s.fighters[2].state.vy==-6 and (s.fighters[2].reaction :: C.Reaction).remaining==9)
	s=C.step(p,s,{{},{}}); assert(s.fighters[2].state.vy==-5.5)
	s=C.new(p,{0,5}); air(p,s,2,-20); s=C.step(p,s,{{x=true},{right=true}})
	assert(s.fighters[2].state.vx==-3 and s.fighters[2].state.vy==-1)
	assert((s.fighters[2].reaction :: C.Reaction).remaining==8 and (s.fighters[2].reaction :: C.Reaction).ctrlRemaining==2)
	s=advance(p,s,3); assert(s.fighters[2].state.ctrl and not s.fighters[2].reaction)
	p=C.compile({fixture({fall='1',['ground.velocity']='0,-8',['fall.yvelocity']='-2',['fall.xvelocity']='-1',['fall.recovertime']='5'}),fixture()})
	s=C.step(p,C.new(p,{0,5}),{{x=true},{}})
	s=C.step(p,s,{{},{up=true}}); assert(not s.fighters[2].state.ctrl)
	s=advance(p,s,5); s=C.step(p,s,{{},{up=true}}); assert(s.fighters[2].state.ctrl)
	s=C.step(p,C.new(p,{0,5}),{{x=true},{}}); local bounced=false
	for _=1,40 do s=C.step(p,s,{{},{}}); if s.fighters[2].state.stateNo==5100 and not bounced then bounced=true; assert(s.fighters[2].state.vy==-2) end end
	assert(bounced and s.fighters[2].state.ctrl)
end)
test('KO prevents movement and authored attacks, including airborne KO landing',function()
	for _, velocity in {'0,0','0,-5'} do
		local p=C.compile({fixture({damage='200',['ground.velocity']=velocity}),fixture()}); local s=C.step(p,C.new(p,{0,5}),{{x=true},{}})
		assert(s.fighters[2].life==0)
		s=advance(p,s,30,nil,{x=true,up=true,right=true}); assert(s.fighters[2].state.stateNo==5150 and s.fighters[2].state.y==0)
		assert(not s.fighters[2].state.ctrl and not s.fighters[2].state.hit)
	end
end)
test('pause freezes common movement and air reaction clocks, and snapshots replay deterministically',function()
	local p=C.compile({fixture({['ground.velocity']='0,-5',pausetime='2,3',fall='1'}),fixture()})
	local s=C.step(p,C.new(p,{0,5}),{{x=true},{}}); local old=s; local y=s.fighters[2].state.y
	s=advance(p,s,3); assert(s.fighters[2].state.y==y and (s.fighters[2].reaction :: C.Reaction).age==0)
	assert(old.fighters[2].state.hitPause==3 and old.fighters[2].state.y==y)
	local a,b=C.new(p,{0,100}),C.new(p,{0,100})
	for tick=1,150 do
		local input={{up=tick%20==1,right=tick%15<7,down=tick%33>27,x=tick%40==7},{left=tick%18<9,up=tick%23==1}}
		a=C.step(p,a,input); b=C.step(p,b,input)
		for index=1,2 do local x,z=a.fighters[index],b.fighters[index]
			assert(x.life==z.life and x.state.stateNo==z.state.stateNo and x.state.x==z.state.x and x.state.y==z.state.y and x.state.vy==z.state.vy and x.airJumps==z.airJumps)
		end
	end
end)
print(tostring(count)..' standard common tests passed')
