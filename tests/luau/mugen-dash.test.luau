--!strict
local C=require('../../runtime/MugenCombat')
local S=require('../../runtime/MugenState')
local Common=require('../../runtime/MugenCommon')
local Commands=require('../../runtime/MugenCommands')
local count=0
local function test(name: string, run: () -> ()) run(); count+=1; print('PASS MugenDash: '..name) end
local function entries(values: {[string]: string}): {S.Entry}
	local result: {S.Entry}={}; for key,value in values do table.insert(result,{key=key,value=value}) end; return result
end
local function fixture(): any
	local animations: {any}={}
	for _,id in {0,20,40,41,42,43,50,52,100,105,106,150,5000,200,600} do
		table.insert(animations,{id=id,durations={-1},loopStart=1,frames={{attackBoxes={},hurtBoxes={{-2,-10,2,0}}}}})
	end
	return {startState=0,gravity=.44,friction=.85,
		commands={{name='FF',command='F,F',time=10,bufferTime=1},{name='BB',command='B,B',time=10,bufferTime=1},
			{name='x',command='x',time=1,bufferTime=1}},
		combat={life=100,attack=100,defence=100,xscale=1,yscale=1,localcoord={320,240},guardState=150,hitState=5000,
			guardAnim=150,hitAnims={High={Light=5000}},common={movement={walkForward=2.4,walkBack=-2.2,
				runForward=4.6,runBackX=-4.5,runBackY=-3.8,jump={x=0,y=-8.4},jumpForward=2.5,jumpBack=-2.55,
				airJump={x=0,y=-8.1},airJumpNum=1,airJumpHeight=0,gravity=.44,standFriction=.85},
				animations={idle=0,walkForward=20,jumpStart=40,jumpNeutral=41,jumpForward=42,jumpBack=43,landing=52,
					runForward=100,runBack=105,runBackLanding=106}}},
		states={{id=-1,entries={},controllers={
			{type='ChangeState',entries=entries({trigger1='command="x" && ctrl',value='ifelse(statetype=A,600,200)'})},
			{type='ChangeState',entries=entries({trigger1='command="FF" && ctrl && statetype=S',value='100'})},
			{type='ChangeState',entries=entries({trigger1='command="BB" && ctrl && statetype=S',value='105'})}}},
			{id=0,entries=entries({type='S',movetype='I',physics='N',anim='0',ctrl='1',velset='0,0'}),controllers={}},
			{id=200,entries=entries({type='S',movetype='A',physics='N',anim='200',ctrl='0',velset='0,0'}),controllers={}},
			{id=600,entries=entries({type='A',movetype='A',physics='A',anim='600',ctrl='0'}),controllers={}}},animations=animations}
end
local function press(index: number, input: any): {any}
	local inputs: {any}={{},{}}; inputs[index]=input; return inputs
end
local function advance(p: C.Program,s: C.Snapshot,n: number,index: number,input: any): C.Snapshot
	for _=1,n do s=C.step(p,s,press(index,input)) end; return s
end
local function route(p: C.Program,index: number,forward: boolean): C.Snapshot
	local s=C.new(p,{0,200})
	local right=(index==1)==forward
	local input=if right then {right=true} else {left=true}
	s=C.step(p,s,press(index,input)); s=C.step(p,s,{{},{}}); s=C.step(p,s,press(index,input))
	assert(s.fighters[index].state.stateNo==(if forward then 100 else 105),'source double-tap route')
	return s
end
test('FF source route runs mirrored without resetting time and releases to idle',function()
	for index=1,2 do
		local p=C.compile({fixture(),fixture()}); local s=route(p,index,true); local before=s
		local input=if index==1 then {right=true} else {left=true}
		s=C.step(p,s,press(index,input)); local x=s.fighters[index].state.x
		assert(s.fighters[index].state.vx==4.6 and s.fighters[index].state.anim==100)
		s=C.step(p,s,press(index,input)); assert(s.fighters[index].state.time==2)
		assert(math.abs(s.fighters[index].state.x-x-4.6*s.fighters[index].state.facing)<1e-9)
		assert(before.fighters[index].state.time==0)
		s=C.step(p,s,{{},{}}); assert(s.fighters[index].state.stateNo==0 and s.fighters[index].state.ctrl and s.fighters[index].state.vx==0)
	end
end)
test('BB source route hops backward mirrored, lands in 106 and restores control',function()
	for index=1,2 do
		local p=C.compile({fixture(),fixture()}); local s=route(p,index,false)
		local x=s.fighters[index].state.x
		s=C.step(p,s,{{},{}}); assert(s.fighters[index].state.stateNo==105 and s.fighters[index].state.y<0)
		assert(s.fighters[index].state.vx==-4.5 and not s.fighters[index].state.ctrl)
		assert(math.abs(s.fighters[index].state.x-x+4.5*s.fighters[index].state.facing)<1e-9)
		local landed=false
		for _=1,40 do s=C.step(p,s,{{},{}}); if s.fighters[index].state.stateNo==106 then landed=true; assert(s.fighters[index].state.y==0 and s.fighters[index].state.vx==0) end end
		assert(landed and s.fighters[index].state.stateNo==0 and s.fighters[index].state.ctrl)
	end
end)
test('run jump mirrors forward takeoff and air jump limit stays intact',function()
	for index=1,2 do
		local p=C.compile({fixture(),fixture()}); local s=route(p,index,true)
		local input=if index==1 then {up=true,right=true} else {up=true,left=true}
		s=C.step(p,s,press(index,input)); assert(s.fighters[index].state.stateNo==40)
		s=advance(p,s,3,index,{}); assert(s.fighters[index].state.stateNo==50 and s.fighters[index].state.anim==42 and s.fighters[index].state.vx==2.5)
		s=C.step(p,s,press(index,{up=true})); assert(s.fighters[index].airJumps==1)
		s=C.step(p,s,{{},{}}); local vy=s.fighters[index].state.vy
		s=C.step(p,s,press(index,{up=true})); assert(s.fighters[index].airJumps==1 and math.abs(s.fighters[index].state.vy-vy-.44)<1e-9)
	end
end)
test('run ctrl permits source attack cancellation; hop remains uncontrolled; controlled air attacks survive',function()
	local p=C.compile({fixture(),fixture()}); local s=route(p,1,true)
	s=C.step(p,s,{{x=true,right=true},{}}); assert(s.fighters[1].state.stateNo==200)
	s=advance(p,s,5,1,{right=true,up=true}); assert(s.fighters[1].state.stateNo==200)
	s=route(p,1,false); s=C.step(p,s,{{x=true},{}}); assert(s.fighters[1].state.stateNo==105)
	local state=S.transition(p[1].machine,s.fighters[1].state,600); state.ctrl=true; state.y=-30; state.vy=-2
	local nextState,jumps=Common.motion(p[1].machine,state,p[1].settings.common,{},false,0)
	assert(nextState.stateNo==600 and nextState.vy==-2 and jumps==0)
end)
test('pause freezes dash motion and source-owned common IDs are not overwritten',function()
	local config=fixture(); table.insert(config.states,{id=100,entries=entries({type='S',movetype='I',physics='N',anim='100',ctrl='1'}),controllers={}})
	local prepared=Common.prepare(config); assert(prepared.states[#config.states]==config.states[#config.states])
	local p=C.compile({config,config}); local s=route(p,1,true); s.fighters[1].state.hitPause=2
	local x=s.fighters[1].state.x; s=advance(p,s,2,1,{right=true}); assert(s.fighters[1].state.x==x and s.fighters[1].state.time==0)
	s=C.step(p,s,{{right=true},{}}); assert(s.fighters[1].state.vx==4.6)
end)
test('source recovery alternatives replace up-edge and gate aerial recovery clocks',function()
	local alternatives={'x+y','x+z','y+z','a+b','a+c','b+c'}
	local definitions: {Commands.Definition}={}
	for _, command in alternatives do table.insert(definitions,{name='recovery',command=command,time=1,bufferTime=1}) end
	local commands=Commands.compile(definitions)
	local p=C.compile({fixture(),fixture()}); local original=C.new(p,{0,200}).fighters[1].state
	local settings=p[1].settings.common :: Common.Settings
	settings=table.clone(settings); settings.recoveryCommand='recovery'
	local reaction: Common.Recovery={kind='hit',remaining=10,recover=true,recoverTime=4,age=4}
	for _, command in alternatives do
		local input: any={}; for button in string.gmatch(command,'[^+]+') do input[button]=true end
		local s=S.transition(p[1].machine,original,5050); s.y=-30; s.vy=2; s.vx=-1
		s.commands=Commands.step(commands,Commands.new(),input,s.facing)
		assert(Common.recoveryRequested(s,settings,false))
		local recovered,accepted=Common.recover(p[1].machine,s,settings,reaction,false)
		assert(accepted and recovered.stateNo==50 and recovered.ctrl and recovered.y==-30 and recovered.vx==-1)
		assert(s.stateNo==5050 and not s.ctrl)
	end
	local s=S.transition(p[1].machine,original,5050); s.y=-30
	assert(not Common.recoveryRequested(s,settings,true))
	local unchanged,accepted=Common.recover(p[1].machine,s,settings,reaction,true); assert(not accepted and unchanged==s)
	assert(Common.recoveryRequested(s,nil,true))
	unchanged,accepted=Common.recover(p[1].machine,s,nil,reaction,true); assert(accepted)
	s.commands=Commands.step(commands,Commands.new(),{x=true,y=true},s.facing)
	for _, blocked in {{kind='hit',remaining=10,recover=false,recoverTime=0,age=20},
		{kind='hit',remaining=10,recover=true,recoverTime=5,age=4}} do
		unchanged,accepted=Common.recover(p[1].machine,s,settings,blocked :: Common.Recovery,false); assert(not accepted)
	end
	s.hitPause=2; unchanged,accepted=Common.recover(p[1].machine,s,settings,reaction,false); assert(not accepted)
	s.hitPause=0; s=S.transition(p[1].machine,s,5110); s.y=0
	local recovered: S.Snapshot
	recovered,accepted=Common.recover(p[1].machine,s,settings,{kind='down',remaining=0,recover=false},false)
	assert(accepted and recovered.stateNo==5120)
	unchanged,accepted=Common.recover(p[1].machine,s,settings,{kind='down',remaining=2,recover=true},false); assert(not accepted)
end)
print(tostring(count)..' dash tests passed')
