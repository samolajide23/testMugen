--!strict
local M = require('../../runtime/MugenState')
local count = 0
local function test(name: string, run: () -> ()) run(); count += 1; print('PASS state: '..name) end
local function entries(rows: {{string}}): {M.Entry}
	local result: {M.Entry}={}; for _, row in rows do table.insert(result,{key=row[1],value=row[2]}) end; return result
end
local function controller(kind: string, rows: {{string}}): M.Controller
	local e=entries(rows); table.insert(e,1,{key='type',value=kind}); return {type=kind,entries=e,source='fixture.cns',line=7}
end
local function config(): M.Config
	return {commands={},states={{id=0,entries=entries({{'anim','0'},{'type','S'},{'physics','N'}}),controllers={}},
		{id=1,entries=entries({{'anim','1'}}),controllers={}}},animations={{id=0,durations={2,3},loopStart=1},{id=1,durations={1,2},loopStart=2},{id=2,durations={0,-1},loopStart=1}}}
end
local function fails(run: () -> (), expected: string?)
	local ok, err=pcall(run); assert(not ok,'Expected rejection'); if expected then assert(string.find(tostring(err),expected,1,true),tostring(err)) end
end
test('ordered triggerall, repeated AND and grouped OR short circuit',function()
	local c=config(); c.states[1].controllers={
		controller('VarSet',{{'v','0'},{'value','4'},{'triggerall','0'},{'triggerall','unknown'},{'trigger1','1'}}),
		controller('VarSet',{{'v','0'},{'value','9'},{'trigger1','0'},{'trigger1','unknown'},{'trigger2','1'},{'trigger3','unknown'}}),
		controller('VarAdd',{{'v','0'},{'value','1'},{'trigger1','var(0) = 9'}})}
	local p=M.compile(c); assert(M.step(p,M.new(p),{}).vars[0]==10)
end)
test('source variable shorthand preserves integer float and ordered combo checks',function()
	local c=config(); c.states[1].controllers={
		controller('VarSet',{{'var(1)','0'},{'trigger1','1'}}),
		controller('VarSet',{{'var(1)','1'},{'trigger1','ctrl'}}),
		controller('VarAdd',{{'var(1)','2'},{'trigger1','var(1) = 1'}}),
		controller('VarSet',{{'fvar(2)','1.5'},{'trigger1','1'}})}
	local p=M.compile(c); local s=M.step(p,M.new(p),{})
	assert(s.vars[1]==3 and s.fvars[2]==1.5)
	assert(c.states[1].controllers[1].entries[2].key=='var(1)')
	for _, rows in {{{'var(1)','1'},{'v','1'},{'value','2'},{'trigger1','1'}},{{'var(1)','1'},{'var(2)','2'},{'trigger1','1'}}} do
		c=config(); c.states[1].controllers={controller('VarSet',rows)}
		fails(function() M.compile(c) end,'Conflicting variable shorthand')
	end
end)
test('projectile expressions evaluate live scalar and vector parameters and clear requests',function()
	local c=config(); c.states[1].controllers={controller('Projectile',{{'trigger1','time=0'},{'projanim','1'},{'attr','S,SP'},{'damage','20,10'},
		{'offset','var(0)+30,-30'},{'velocity','7'},{'projscale','.3,.3'},{'projheightbound','0,0'},{'projpriority','3'}})}
	local p=M.compile(c); local before=M.new(p); before.vars[0]=2
	local s=M.step(p,before,{})
	local requests=s.projectileRequests :: {M.ProjectileRequest}; assert(#requests==1)
	local r=requests[1]; assert(r.offset.x==32 and r.offset.y==-30 and r.velocity.x==7 and r.velocity.y==0)
	assert(r.projscale.x==.3 and r.projheightbound[1]==0 and r.projpriority==3)
	assert(#(M.step(p,s,{}).projectileRequests :: {M.ProjectileRequest})==0)
	assert(before.projectileRequests==nil)
end)
test('SuperPause freezes clocks while inputs advance and NotHitBy timers expire',function()
	local c=config(); c.states[1].controllers={controller('SuperPause',{{'trigger1','time=0'},{'time','30'},{'movetime','2'},{'unhittable','1'}}),
		controller('NotHitBy',{{'trigger1','time=0'},{'value','SCA'},{'time','2'}})}
	local p=M.compile(c); local s=M.step(p,M.new(p),{})
	assert(#(s.superPauseRequests :: {M.SuperPauseRequest})==1 and s.unhittableTicks==2)
	local paused=M.step(p,s,{right=true},nil,true)
	assert(paused.time==s.time and paused.animPosition==s.animPosition and paused.tick==s.tick+1 and paused.unhittableTicks==2)
	assert(#(paused.superPauseRequests :: {M.SuperPauseRequest})==0)
	local next=M.step(p,paused,{}); assert(next.unhittableTicks==1)
	next=M.step(p,next,{}); assert(next.unhittableTicks==0)
	c.states[1].controllers={controller('NotHitBy',{{'trigger1','1'},{'value','S,NA'}})}
	fails(function() M.compile(c) end,'Only full SCA')
end)
test('negative states execute -3 then -2 then -1',function()
	local c=config()
	for _, id in {-3,-2,-1} do table.insert(c.states,{id=id,entries={},controllers={controller('VarSet',{{'v','0'},{'value','var(0)*10+'..tostring(-id)},{'trigger1','1'}})}}) end
	local p=M.compile(c); assert(M.step(p,M.new(p),{}).vars[0]==321)
end)
test('ChangeState stops old list and executes target Time zero',function()
	local c=config(); c.states[1].controllers={controller('ChangeState',{{'value','1'},{'ctrl','0'},{'trigger1','time=0'}}),controller('VarSet',{{'v','0'},{'value','999'},{'trigger1','1'}})}
	c.states[2].controllers={controller('VarAdd',{{'v','0'},{'value','2'},{'trigger1','time=0'}})}
	local p=M.compile(c); local s=M.step(p,M.new(p),{})
	assert(s.stateNo==1 and s.prevStateNo==0 and s.time==0 and not s.ctrl and s.vars[0]==2)
	s=M.step(p,s,{}); assert(s.time==1 and s.vars[0]==2)
end)
test('persistent zero resets on state reentry',function()
	local c=config(); c.states[1].controllers={controller('VarAdd',{{'v','0'},{'value','1'},{'persistent','0'},{'trigger1','1'}}),controller('ChangeState',{{'value','1'},{'trigger1','time=2'}})}
	c.states[2].controllers={controller('ChangeState',{{'value','0'},{'trigger1','time=1'}})}
	local p=M.compile(c); local s=M.step(p,M.new(p),{}); assert(s.vars[0]==1)
	s=M.step(p,s,{}); assert(s.vars[0]==1); s=M.step(p,s,{}); assert(s.stateNo==1)
	s=M.step(p,s,{}); assert(s.stateNo==0 and s.vars[0]==2)
end)
test('AIR frame durations, end boundary and nonpositive AnimTime',function()
	local c=config(); c.states[1].controllers={controller('VarSet',{{'v','0'},{'value','AnimTime'},{'trigger1','1'}}),controller('VarSet',{{'v','1'},{'value','AnimElemTime(1)'},{'trigger1','1'}})}
	local p=M.compile(c); local s=M.step(p,M.new(p),{}); assert(s.time==0 and s.animElem==1 and s.vars[0]==-5)
	for t=1,11 do
		s=M.step(p,s,{}); assert(s.time==t and s.vars[0]<=0)
		if t==2 then assert(s.animElem==2 and s.elemTime==0 and s.vars[0]==-3) end
		if t==5 or t==10 then assert(s.animElem==1 and s.vars[0]==0 and s.vars[1]==5) end
		if t==6 then assert(s.vars[0]==-4 and s.vars[1]==1) end
	end
end)
test('AIR loopStart skips the intro on repeated passes',function()
	local c=config(); c.startState=1
	local p=M.compile(c); local s=M.step(p,M.new(p),{}); assert(s.animElem==1)
	for t=1,8 do s=M.step(p,s,{}); assert(s.animElem==2); if t==3 or t==5 then assert(s.animWrapped) end end
end)
test('zero-duration elements skip and held frames never finish',function()
	local c=config(); c.states[1].entries=entries({{'anim','2'}})
	c.states[1].controllers={controller('VarSet',{{'v','0'},{'value','AnimTime'},{'trigger1','1'}})}
	local p=M.compile(c); local s=M.new(p); assert(s.animElem==2)
	for _=1,12 do s=M.step(p,s,{}); assert(s.animElem==2 and s.vars[0]==-1) end
end)
test('ChangeAnim seeks without resetting state Time',function()
	local c=config(); c.states[1].controllers={controller('ChangeAnim',{{'value','1'},{'elem','2'},{'trigger1','time=2'}})}
	local p=M.compile(c); local s=M.step(p,M.new(p),{}); s=M.step(p,s,{}); s=M.step(p,s,{})
	assert(s.time==2 and s.anim==1 and s.animElem==2 and s.elemTime==0 and s.animPosition==1)
end)
test('posture-specific friction defaults, validation and pause',function()
	for _, physics in {'S','C','N','A'} do
		local c=config(); c.friction=.8; c.crouchFriction=.6
		c.states[1].entries=entries({{'anim','0'},{'physics',physics},{'velset','10,-2'}})
		local p=M.compile(c); local initial=M.new(p); local s=M.step(p,initial,{})
		assert(s.x==10 and s.y==-2 and initial.x==0)
		assert(s.vx==(if physics=='S' then 8 elseif physics=='C' then 6 else 10))
		local paused=M.step(p,s,{}, {hitPauseTicks=1}); assert(paused.vx==s.vx and paused.x==s.x)
		c.crouchFriction=nil; p=M.compile(c); assert(p.crouchFriction==.8)
	end
	for _, value in {-1,1.1,math.huge,0/0} do
		local c=config(); c.crouchFriction=value; fails(function() M.compile(c) end,'Invalid physics constants')
	end
	local c=config(); c.crouchFriction=0; assert(M.compile(c).crouchFriction==0)
end)
test('controller parameters use live values and apply velocity',function()
	local c=config(); c.states[1].controllers={controller('VarSet',{{'v','0'},{'value','3'},{'trigger1','time=0'}}),controller('VelSet',{{'x','var(0)'},{'y','-1.5'},{'trigger1','time=0'}})}
	local p=M.compile(c); local s=M.step(p,M.new(p,-1),{}); assert(s.x==-3 and s.y==-1.5)
	s=M.step(p,s,{}); assert(s.x==-6 and s.vx==3)
end)
test('hitpause freezes clocks and default controllers, with explicit override',function()
	local c=config(); c.states[1].controllers={controller('VarAdd',{{'v','0'},{'value','1'},{'trigger1','1'}}),controller('VarAdd',{{'v','1'},{'value','1'},{'trigger1','1'},{'ignorehitpause','1'}})}
	local p=M.compile(c); local s=M.step(p,M.new(p),{}); s=M.step(p,s,{}, {hitPauseTicks=2})
	assert(s.time==0 and s.vars[0]==1 and s.vars[1]==2 and s.hitPause==1)
	s=M.step(p,s,{}); assert(s.time==0 and s.hitPause==0)
	s=M.step(p,s,{}); assert(s.time==1 and s.vars[0]==2 and s.vars[1]==4)
end)
test('snapshots stay immutable across successful and failed steps',function()
	local c=config(); c.states[1].controllers={controller('VarAdd',{{'v','0'},{'value','1'},{'trigger1','1'}})}
	local p=M.compile(c); local old=M.step(p,M.new(p),{}); local next=M.step(p,old,{})
	assert(old.vars[0]==1 and old.time==0 and next.vars[0]==2)
	c.states[1].controllers={controller('VarSet',{{'v','0'},{'value','unknown'},{'trigger1','1'}})}
	local bad=M.compile(c); fails(function() M.step(bad,old,{}) end,'fixture.cns:7'); assert(old.vars[0]==1)
end)
test('deferred controllers require opt-in and emit copied raw requests',function()
	local c=config(); c.states[1].controllers={controller('PlaySnd',{{'value','20,10'},{'trigger1','time=0'}})}
	fails(function() M.compile(c) end,'Unsupported controller')
	c.deferredControllers={'playsnd'}; local p=M.compile(c); local s=M.step(p,M.new(p),{})
	assert(#s.events==1 and s.events[1].kind=='unimplementedController' and s.events[1].entries[2].value=='20,10')
	s.events[1].entries[2].value='changed'; assert(c.states[1].controllers[1].entries[2].value=='20,10')
	assert(#M.step(p,s,{}).events==0)
end)
test('HitDef evaluates once at activation and clears on state entry',function()
	local c=config(); c.states[1].controllers={
		controller('VarSet',{{'v','0'},{'value','17'},{'trigger1','time=0'}}),
		controller('HitDef',{{'attr','S,NA'},{'damage','var(0),3'},{'trigger1','time=0'},{'persistent','0'}})}
	local p=M.compile(c); local initial=M.new(p); local s=M.step(p,initial,{})
	local hit=s.hit :: M.ActiveHit; assert(hit.definition.damage==17 and hit.serial==1 and s.events[1].kind=='hitDef' and initial.hit==nil)
	s.vars[0]=90; local next=M.step(p,s,{}); assert((next.hit :: M.ActiveHit).definition.damage==17)
	local nextHit=next.hit :: M.ActiveHit; nextHit.targets[2]=true; assert(not hit.targets[2])
	local entered=M.transition(p,s,1,2); assert(entered.hit==nil and entered.moveContact==0 and entered.anim==2 and entered.time==0 and s.hit==hit)
	entered=M.transition(p,entered,0); entered=M.step(p,entered,{}); assert((entered.hit :: M.ActiveHit).serial==2)
end)
test('HitDef diagnostics preserve source location and reject deferral',function()
	local c=config(); c.states[1].controllers={controller('HitDef',{{'attr','S,NA'},{'unknown','1'},{'trigger1','1'}})}
	fails(function() M.compile(c) end,'fixture.cns:7')
	c=config(); c.states[1].controllers={controller('HitDef',{{'attr','S,NA'},{'damage','unknown'},{'trigger1','1'}})}
	local p=M.compile(c); fails(function() M.step(p,M.new(p),{}) end,'fixture.cns:7')
	c=config(); c.deferredControllers={'hitdef'}; fails(function() M.compile(c) end,'Implemented controllers')
end)
test('Random is deterministic per snapshot and seed without mutating history',function()
	local c=config(); c.states[1].controllers={controller('VarSet',{{'v','0'},{'value','Random'},{'trigger1','1'}})}
	local p=M.compile(c); local old=M.new(p,1,123); local a,b=M.step(p,old,{}),M.step(p,old,{})
	assert(old.rng==123 and a.rng==b.rng and a.vars[0]==b.vars[0] and a.vars[0]>=0 and a.vars[0]<1000)
	assert(M.step(p,M.new(p,1,124),{}).rng~=a.rng)
	fails(function() M.new(p,1,-1) end); fails(function() M.new(p,1,1.5) end)
end)
test('unsupported persistence, parameters, missing targets and loops reject',function()
	local c=config(); c.states[1].controllers={controller('Null',{{'trigger1','1'},{'persistent','2'}})}
	fails(function() M.compile(c) end,'persistent')
	c.states[1].controllers={controller('Null',{{'trigger1','1'},{'mystery','1'}})}; fails(function() M.compile(c) end,'parameter')
	c.states[1].controllers={controller('Null',{{'trigger1','1'},{'trigger3','1'}})}; fails(function() M.compile(c) end,'contiguous')
	c.states[1].controllers={controller('ChangeState',{{'trigger1','1'},{'value','99'}})}; local p=M.compile(c)
	fails(function() M.step(p,M.new(p),{}) end,'Missing executable state')
	c.states[1].controllers={controller('ChangeState',{{'trigger1','1'},{'value','0'}})}; p=M.compile(c)
	fails(function() M.step(p,M.new(p),{}) end,'transition limit')
end)
print(tostring(count)..' state tests passed')
