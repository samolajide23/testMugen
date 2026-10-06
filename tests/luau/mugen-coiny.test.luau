--!strict
local M = require('../../runtime/MugenState')
local config: M.Config = require('../../generated/luau/coiny-checkpoint')
local p = M.compile(config)
local count = 0
local function test(name: string, run: () -> ()) run(); count+=1; print('PASS Coiny: '..name) end
for _, normal in {{button='x',state=200,power=20},{button='y',state=210,power=65},{button='z',state=220,power=65}} do
	test(normal.button..' executes original state, AIR and return-to-control',function()
		local s=M.step(p,M.new(p),{[normal.button]=true})
		assert(s.stateNo==normal.state and s.anim==normal.state and s.time==0 and not s.ctrl and s.power==normal.power)
		assert(#s.events==2 and s.events[1].controller=='playsnd' and s.events[2].controller=='hitdef')
		assert(s.events[2].source=='player.cns' and s.events[2].time==0)
		for age=1,14 do
			s=M.step(p,s,{})
			assert(s.stateNo==normal.state and s.time==age and not s.ctrl and #s.events==0)
			local element = if normal.state==220 then (if age<5 then 1 else 2) else (if age<4 then 1 elseif age<8 then 2 else 3)
			assert(s.animElem==element,'Wrong source AIR element at age '..tostring(age))
		end
		s=M.step(p,s,{}); assert(s.stateNo==0 and s.anim==0 and s.ctrl and s.time==0 and s.prevStateNo==normal.state)
	end)
end
test('holding an attack does not repeat after recovery',function()
	local s=M.new(p)
	for _=1,40 do s=M.step(p,s,{x=true}) end
	assert(s.stateNo==0 and s.power==20)
	s=M.step(p,s,{}); s=M.step(p,s,{x=true}); assert(s.stateNo==200 and s.power==40)
end)
test('source holddown blocks standing normals including diagonals',function()
	for _, button in {'x','y','z'} do
		local s=M.step(p,M.new(p),{down=true,right=true,[button]=true})
		assert(s.stateNo==0 and s.ctrl and s.power==0 and #s.events==0)
	end
end)
test('source command priority and no cancel without contact',function()
	local s=M.step(p,M.new(p),{x=true,y=true,z=true}); assert(s.stateNo==200)
	s=M.step(p,s,{}); s=M.step(p,s,{y=true}); assert(s.stateNo==200)
	s=M.step(p,s,{}); s=M.step(p,s,{z=true}); assert(s.stateNo==200)
end)
test('injected contact enables authored x-to-y-to-z cancels, not synthetic combo timers',function()
	local s=M.step(p,M.new(p),{x=true})
	s=M.step(p,s,{y=true},{moveHit=true}); assert(s.stateNo==210 and s.time==0 and s.power==85 and s.moveContact==0)
	s=M.step(p,s,{z=true}); assert(s.stateNo==210,'Contact must reset when entering a new move')
	s=M.step(p,s,{}); s=M.step(p,s,{z=true},{moveGuarded=true})
	assert(s.stateNo==220 and s.time==0 and s.power==150)
	for _=1,15 do s=M.step(p,s,{}) end
	assert(s.stateNo==0 and s.ctrl)
end)
test('injected contact also permits direct x-to-z source cancel',function()
	local s=M.step(p,M.new(p),{x=true}); s=M.step(p,s,{z=true},{moveContact=true})
	assert(s.stateNo==220 and s.power==85)
end)
test('replaying the same inputs produces the same source-driven snapshots',function()
	local a,b=M.new(p),M.new(p)
	for tick=1,100 do
		local input={x=tick%30==1,y=tick%30==5,z=tick%30==8}
		local feedback: M.Feedback={moveContact=tick%30==5 or tick%30==8}
		a=M.step(p,a,input,feedback); b=M.step(p,b,input,feedback)
		assert(a.stateNo==b.stateNo and a.anim==b.anim and a.animElem==b.animElem and a.time==b.time and a.power==b.power)
		assert(#a.events==#b.events)
	end
end)
print(tostring(count)..' imported Coiny tests passed')
