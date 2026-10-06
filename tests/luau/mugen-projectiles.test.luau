--!strict
local C=require('../../runtime/MugenCombat')
local S=require('../../runtime/MugenState')
local function entries(values: {[string]: string}): {S.Entry}
	local result: {S.Entry}={}; for key,value in values do table.insert(result,{key=key,value=value}) end; return result
end
local function fixture(): any
	local states={}; local animations={}
	for _, id in {0,150,5000,3011,1011,1012} do
		table.insert(states,{id=id,entries=entries({type='S',movetype=if id==5000 then 'H' else 'I',physics='N',anim=tostring(id),ctrl='1'}),controllers={}})
		table.insert(animations,{id=id,durations=if id==1012 then {2,2} else {-1},loopStart=1,frames=if id==1012 then {{attackBoxes={},hurtBoxes={}},{attackBoxes={},hurtBoxes={}}} else {{attackBoxes=if id==1011 then {{-10,-10,10,10}} else {},hurtBoxes={{-2,-10,2,0}}}}})
	end
	return {startState=0,commands={},states=states,animations=animations,combat={life=100,attack=100,defence=100,xscale=1,yscale=1,localcoord={320,240},guardState=150,hitState=5000,guardAnim=150,hitAnims={High={Light=5000,Hard=5000}}}}
end
local function spawn(positions: {number}, input: any?): C.Snapshot
	local config=fixture(); local params={trigger1='time=0',projanim='1011',projhitanim='1012',projscale='.3,.3',projheightbound='0,0',offset='30,-5',velocity='7',attr='S,SP',damage='20,10',guardflag='MA',pausetime='2,3',['ground.hittime']='10',['ground.velocity']='-1'}
	config.states[1].controllers={{type='Projectile',entries=entries(params),source='player.cns',line=704}}
	local source=C.compile({config,fixture()})
	return C.step(source,C.new(source,positions),{{},input or {}})
end
local count=0
local function test(name: string, run: () -> ()) run(); count+=1; print('PASS projectiles: '..name) end

test('source AIR scaled projectile contacts at offset and survives owner independently',function()
	local s=spawn({0,30})
	assert(#s.events==1 and s.events[1].kind=='hit' and s.fighters[2].life==80)
	assert(s.fighters[1].state.moveHit==1 and s.fighters[1].state.hitPause==0)
	assert((s.projectiles :: {C.Projectile})[1].removing and (s.projectiles :: {C.Projectile})[1].anim==1012)
	assert(s.fighters[1].state.power==0 and s.fighters[2].state.power==0)
	assert(s.events[1].source~='')
end)
test('source guard applies chip and owner contact without hitpause',function()
	local s=spawn({0,30},{right=true})
	assert(s.events[1].kind=='guard' and s.fighters[2].life==90)
	assert(s.fighters[1].state.moveGuarded==1 and s.fighters[1].state.moveHit==0)
end)
test('source whiff, projectile travel, mirrored facing and immutable snapshots',function()
	local config=fixture(); config.states[1].controllers={{type='Projectile',entries=entries({trigger1='time=0',persistent='0',projanim='1011',projscale='.3,.3',projheightbound='0,0',offset='30,-5',velocity='7',attr='S,SP',damage='20',guardflag='MA'})}}
	local p=C.compile({config,fixture()}); local s=C.step(p,C.new(p,{0,50}),{{},{}}); local before=s
	assert(#s.events==0 and #(s.projectiles :: {C.Projectile})==1)
	for _=1,3 do s=C.step(p,s,{{},{}}) end
	assert(s.fighters[2].life==80 and before.fighters[2].life==100 and (before.projectiles :: {C.Projectile})[1].x==30)
	p=C.compile({config,fixture()}); s=C.step(p,C.new(p,{60,30}),{{},{}}); assert(s.fighters[2].life==80)
end)
test('removal animation expires and explicit height/time bounds remove whiffs',function()
	local config=fixture(); config.states[1].controllers={{type='Projectile',entries=entries({trigger1='time=0',persistent='0',projanim='1011',projhitanim='1012',projheightbound='0,0',offset='30,-5',velocity='7',attr='S,SP',damage='20'})}}
	local p=C.compile({config,fixture()}); local s=C.step(p,C.new(p,{0,30}),{{},{}})
	for _=1,4 do s=C.step(p,s,{{},{}}) end; assert(#(s.projectiles :: {C.Projectile})==0)
	for _, bound in {{projheightbound='-2,0'},{projremovetime='1'},{projedgebound='0',velocity='400'}} do
		local params: {[string]: string}={trigger1='time=0',persistent='0',projanim='1011',offset='30,-5',velocity='7',attr='S,SP',damage='20'}
		for key,value in bound do params[key]=value end
		config.states[1].controllers={{type='Projectile',entries=entries(params)}}; p=C.compile({config,fixture()})
		s=C.step(p,C.new(p,{0,100}),{{},{}}); s=C.step(p,s,{{},{}}); assert(#(s.projectiles :: {C.Projectile})==0)
	end
end)
test('source projectile airborne fall juggle budget and explicit contact power',function()
	local config=fixture(); config.states[1].controllers={{type='Projectile',entries=entries({trigger1='time=0',persistent='0',projanim='1011',offset='30,-5',velocity='0',projheightbound='0,0',
		attr='S,SP',damage='20',guardflag='MA',['air.velocity']='-4,-6',['air.fall']='1',['air.juggle']='3',['down.velocity']='-4,-6',['down.hittime']='30',['down.bounce']='0',getpower='24',givepower='10,3'})}}
	local p=C.compile({config,fixture()}); local s=C.new(p,{0,30})
	s.fighters[2].state.stateType='A'; s.fighters[2].state.y=-5
	s=C.step(p,s,{{},{}})
	assert(s.fighters[2].life==80 and s.fighters[2].state.vx==-4 and s.fighters[2].state.vy==-6 and (s.fighters[2].reaction :: C.Reaction).fall)
	assert(s.fighters[1].state.power==24 and s.fighters[2].state.power==10)
	local blocked=C.new(p,{0,30}); blocked.fighters[2].state.stateType='A'; blocked.fighters[2].state.y=-5
	blocked.fighters[2].reaction={kind='hit',remaining=10,slideRemaining=10,fall=true,recover=false}; blocked.fighters[2].juggleRemaining=2
	blocked=C.step(p,blocked,{{},{}}); assert(#blocked.events==0 and blocked.fighters[2].life==100)
	local down=C.new(p,{0,30}); down.fighters[2].state.stateType='L'; down.fighters[2].reaction={kind='down',remaining=20,slideRemaining=0}
	down=C.step(p,down,{{},{}}); assert(down.fighters[2].life==80 and (down.fighters[2].reaction :: C.Reaction).remaining==30)
	assert((down.fighters[2].reaction :: C.Reaction).fallVelocity and ((down.fighters[2].reaction :: C.Reaction).fallVelocity :: {x:number,y:number}).y==0)
end)
test('multi-hit miss interval and optional stage bounds persist source requests',function()
	local config=fixture(); config.states[1].controllers={{type='Projectile',entries=entries({trigger1='time=0',persistent='0',projanim='1011',projhits='2',projmisstime='2',
		projheightbound='0,0',offset='30,-5',velocity='0',attr='S,SP',damage='20'})}}
	local p=C.compile({config,fixture()}); local s=C.step(p,C.new(p,{0,30}),{{},{}})
	assert(s.fighters[2].life==80); s=C.step(p,s,{{},{}}); assert(#s.events==0)
	s=C.step(p,s,{{},{}}); assert(s.fighters[2].life==60 and #(s.projectiles :: {C.Projectile})==0)
	config.combat.stageBounds={-10,10}; config.states[1].controllers={{type='Projectile',entries=entries({trigger1='time=0',persistent='0',projanim='1011',projstagebound='0',
		projheightbound='0,0',offset='0,-5',velocity='20',attr='S,SP',damage='20'})}}
	p=C.compile({config,fixture()}); s=C.step(p,C.new(p,{0,100}),{{},{}}); s=C.step(p,s,{{},{}})
	assert(#(s.projectiles :: {C.Projectile})==0)
end)
print(tostring(count)..' projectile tests passed')
