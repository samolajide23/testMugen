--!strict
local C=require('../../runtime/MugenCombat')
local S=require('../../runtime/MugenState')
local function entries(values: {[string]: string}): {S.Entry}
	local result: {S.Entry}={}; for key,value in values do table.insert(result,{key=key,value=value}) end; return result
end
local function fixture(move: number?, confirm: boolean?): any
	local states: {any}={}; local animations: {any}={}
	for _, id in {0,150,5000,3010,3011,3012,1011} do
		local controllers={}
		if id==3010 then
			table.insert(controllers,{type='SuperPause',entries=entries({trigger1='time=0',time='3',movetime=tostring(move or 0),unhittable='1'})})
			if confirm then table.insert(controllers,{type='HitDef',entries=entries({trigger1='time=0',attr='S,NA',damage='20',guardflag='MA',pausetime='0,6',p1stateno='3011'})}) end
		elseif id==3011 then
			table.insert(controllers,{type='ChangeState',entries=entries({trigger1='time=2',value='3012'})})
		end
		table.insert(states,{id=id,entries=entries({type='S',movetype=if id>=3010 and id<=3012 then 'A' else 'I',physics='N',anim=tostring(id),ctrl=if id==0 then '1' else '0'}),controllers=controllers})
		table.insert(animations,{id=id,durations={2,2,-1},loopStart=1,frames={{attackBoxes=if id==3010 and confirm then {{5,-10,15,0}} else {},hurtBoxes={{-2,-10,2,0}}},{attackBoxes={},hurtBoxes={{-2,-10,2,0}}},{attackBoxes={},hurtBoxes={{-2,-10,2,0}}}}})
	end
	table.insert(states,{id=-1,entries={},controllers={{type='ChangeState',entries=entries({trigger1='command="x" && ctrl',value='3010'})}}})
	return {startState=0,states=states,animations=animations,commands={{name='x',command='x',time=1,bufferTime=1}},combat={life=100,attack=100,defence=100,xscale=1,yscale=1,localcoord={320,240},guardState=150,hitState=5000,guardAnim=150,hitAnims={High={Light=5000}}}}
end
local count=0
local function test(name: string,run: () -> ()) run(); count+=1; print('PASS superpause: '..name) end

test('source SuperPause freezes both state AIR motion and does not replay time-zero requests',function()
	local config=fixture(); local p=C.compile({config,config}); local s=C.step(p,C.new(p,{0,30}),{{x=true},{}})
	assert(s.superPause and s.superPause.remaining==3)
	local before=s; s.fighters[2].state.vx=2; s.fighters[2].state.ctrl=false
	for left=2,0,-1 do
		s=C.step(p,s,{{},{}})
		assert(s.fighters[1].state.time==0 and s.fighters[2].state.time==0 and s.fighters[2].state.x==30)
		assert(s.fighters[1].state.animPosition==0 and (if left>0 then (s.superPause :: C.SuperPause).remaining==left else s.superPause==nil))
	end
	assert((before.superPause :: C.SuperPause).remaining==3)
	s=C.step(p,s,{{},{}}); assert(s.fighters[1].state.time==1 and s.fighters[2].state.x==28)
end)
test('movetime allowance advances owner only and command inputs buffer through freeze',function()
	local config=fixture(2); local p=C.compile({config,config}); local s=C.step(p,C.new(p,{0,30}),{{x=true},{}})
	for tick=1,3 do
		s=C.step(p,s,{{},{x=tick==1}})
		assert(s.fighters[1].state.time==math.min(tick,2) and s.fighters[2].state.time==0)
	end
	s=C.step(p,s,{{},{}}); assert(s.fighters[2].state.stateNo==3010,'Frozen command should execute on resume')
end)
test('all projectiles freeze irrespective of owner movetime',function()
	local config=fixture(3); config.states[1].controllers={{type='Projectile',entries=entries({trigger1='time=0',persistent='0',projanim='1011',offset='0,-30',velocity='7',projheightbound='0,0',attr='S,SP',damage='20'})}}
	local p=C.compile({config,fixture()}); local s=C.step(p,C.new(p,{0,80}),{{},{}})
	s=C.step(p,s,{{x=true},{}}); local x=(s.projectiles :: {C.Projectile})[1].x; local age=(s.projectiles :: {C.Projectile})[1].age
	for _=1,3 do s=C.step(p,s,{{},{}}); assert((s.projectiles :: {C.Projectile})[1].x==x and (s.projectiles :: {C.Projectile})[1].age==age) end
	s=C.step(p,s,{{},{}}); assert((s.projectiles :: {C.Projectile})[1].x==x+7)
end)
test('p1stateno transitions on actual hit only and victim hitpause survives external freeze',function()
	local config=fixture(0,true); local p=C.compile({config,fixture()})
	local s=C.step(p,C.new(p,{0,10}),{{x=true},{}})
	assert(s.events[1].kind=='hit' and s.fighters[1].state.stateNo==3011 and s.fighters[2].state.hitPause==6)
	for _=1,3 do s=C.step(p,s,{{},{}}); assert(s.fighters[2].state.hitPause==6) end
	for _=1,3 do s=C.step(p,s,{{},{}}) end; assert(s.fighters[1].state.stateNo==3012)
	p=C.compile({config,fixture()}); s=C.step(p,C.new(p,{0,10}),{{x=true},{right=true}})
	assert(s.events[1].kind=='guard' and s.fighters[1].state.stateNo==3010)
	s=C.step(p,C.new(p,{0,40}),{{x=true},{}}); assert(#s.events==0 and s.fighters[1].state.stateNo==3010)
end)
test('unhittable SuperPause owner rejects an already active opponent HitDef',function()
	local owner=fixture(3); local opponent=fixture()
	for _, animation in opponent.animations do
		if animation.id==0 then for _, frame in animation.frames do frame.attackBoxes={{5,-10,15,0}} end end
	end
	opponent.states[1].controllers={{type='HitDef',entries=entries({trigger1='time=0',attr='S,NA',damage='20'})}}
	local p=C.compile({owner,opponent}); local s=C.step(p,C.new(p,{0,10}),{{x=true},{}})
	assert(s.fighters[1].life==100 and #s.events==0)
	for _=1,3 do s=C.step(p,s,{{},{}}); assert(s.fighters[1].life==100) end
end)
print(tostring(count)..' superpause tests passed')
