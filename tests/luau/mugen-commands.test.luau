--!strict
local C = require('../../runtime/MugenCommands')
local count = 0
local function test(name: string, run: () -> ()) run(); count += 1; print('PASS commands: '..name) end
local function def(name: string, pattern: string, buffer: number?): C.Definition return {name=name,command=pattern,time=1,bufferTime=buffer or 1} end
local function fails(run: () -> ()) assert(not pcall(run), 'Expected rejection') end
test('rising edges and release before repress',function()
	local p=C.compile({def('x','x')}); local first=C.step(p,C.new(),{x=true},1)
	assert(first.active.x); local held=C.step(p,first,{x=true},1); assert(not held.active.x)
	local released=C.step(p,held,{},1); assert(C.step(p,released,{x=true},1).active.x)
end)
test('buffer lifetime includes matching tick',function()
	local p=C.compile({def('x','x',3)}); local s=C.step(p,C.new(),{x=true},1)
	for _=1,2 do s=C.step(p,s,{},1); assert(s.active.x) end
	assert(not C.step(p,s,{},1).active.x)
end)
test('hold wildcard includes diagonals and cancels opposites',function()
	local p=C.compile({def('down','/$D'),def('exact','/D')})
	local s=C.step(p,C.new(),{down=true,right=true},1); assert(s.active.down and not s.active.exact)
	s=C.step(p,s,{down=true,right=true},1); assert(s.active.down)
	assert(not C.step(p,s,{down=true,up=true},1).active.down)
end)
test('facing relative directions and no synthetic press on flip',function()
	local p=C.compile({def('forward','F'),def('holdforward','/F')})
	local s=C.step(p,C.new(),{left=true},1); assert(not s.active.forward)
	s=C.step(p,s,{left=true},-1); assert(not s.active.forward and s.active.holdforward)
	assert(C.step(p,C.new(),{left=true},-1).active.forward)
end)
test('release and chord recognition',function()
	local p=C.compile({def('release','~x'),def('chord','x+y')})
	local s=C.step(p,C.new(),{x=true},1); assert(not s.active.chord)
	s=C.step(p,s,{x=true,y=true},1); assert(s.active.chord)
	s=C.step(p,s,{y=true},1); assert(s.active.release and not s.active.chord)
end)
test('remaps and duplicate names are alternatives',function()
	local remapped=def('attack','x'); remapped.remap={x='a'}
	local p=C.compile({remapped,def('attack','z')})
	assert(C.step(p,C.new(),{a=true},1).active.attack); assert(C.step(p,C.new(),{z=true},1).active.attack)
	assert(not C.step(p,C.new(),{x=true},1).active.attack)
end)
test('snapshots and inputs are not mutated',function()
	local p=C.compile({def('x','x')}); local input={x=true}; local initial=C.new()
	local s=C.step(p,initial,input,1); input.x=false
	assert(s.held.x and initial.tick==0 and not initial.active.x)
	C.step(p,s,{},1); assert(s.active.x and s.remaining[1]==1)
end)
test('hitpause buffers edges until the first resumed tick only',function()
	local p=C.compile({def('x','x')}); local s=C.step(p,C.new(),{x=true},1,true)
	for _=1,3 do s=C.step(p,s,{},1,true); assert(s.active.x) end
	s=C.step(p,s,{},1,false); assert(s.active.x)
	s=C.step(p,s,{},1,false); assert(not s.active.x)
	s=C.step(p,s,{x=true},1,true); s=C.step(p,s,{x=true},1,false); assert(s.active.x)
	assert(not C.step(p,s,{x=true},1,false).active.x)
end)
local function motion(name: string, pattern: string, time: number?, buffer: number?): C.Definition
	local d=def(name,pattern,buffer); d.time=time or 10; return d
end
local function replay(p: C.Program, inputs: {C.Input}, facing: number?, initial: C.Snapshot?): C.Snapshot
	local s=initial or C.new()
	for _, input in inputs do s=C.step(p,s,input,facing or 1) end
	return s
end
test('Coiny three alternatives share one name, both motions and all six buttons',function()
	for _, buttons in {{'x','y','z'},{'a','b','c'}} do
		for _, back in {false,true} do
			local direction=if back then 'B' else 'F'
			local p=C.compile({motion('special','~D,D'..direction..','..direction..','..buttons[1]),
				motion('special','~D,D'..direction..','..direction..','..buttons[2]),
				motion('special','~D,D'..direction..','..direction..','..buttons[3])})
			for _, facing in {1,-1} do
				local key=if (facing==1) ~= back then 'right' else 'left'
				for _, button in buttons do
					local s=replay(p,{{down=true},{down=true,[key]=true},{[key]=true,[button]=true}},facing)
					assert(s.active.special)
					for _=1,12 do s=C.step(p,s,{[key]=true,[button]=true},facing); assert(not s.active.special) end
				end
				local s=replay(p,{{down=true},{down=true,[key]=true},{[key]=true,x=true,y=true,z=true,a=true,b=true,c=true}},facing)
				assert(s.active.special and s.remaining[1]==1 and s.remaining[2]==1 and s.remaining[3]==1)
			end
		end
	end
end)
test('ordered exact diagonal edges and wrong order reject',function()
	local p=C.compile({motion('qcf','~D,DF,F,x')})
	for _, inputs: {C.Input} in {
		{{down=true},{right=true},{x=true}},
		{{right=true},{down=true,right=true},{down=true},{right=true,x=true}},
		{{down=true,x=true},{down=true,right=true,x=true},{right=true,x=true}},
		{{down=true},{right=true,x=true}},
		{{down=true},{down=true,right=true},{x=true}},
	} do assert(not replay(p,inputs).active.qcf) end
	local s=replay(p,{{down=true},{down=true,right=true},{right=true},{x=true}}); assert(s.active.qcf)
end)
test('authored time counts inclusive input ticks and expires old prefixes',function()
	local p=C.compile({motion('qcf','~D,DF,F,x',3)})
	assert(replay(p,{{down=true},{down=true,right=true},{right=true},{x=true}}).active.qcf)
	assert(not replay(p,{{down=true},{down=true,right=true},{right=true},{},{x=true}}).active.qcf)
	assert(replay(p,{{down=true},{down=true,right=true},{},{down=true},{down=true,right=true},{right=true,x=true}}).active.qcf)
end)
test('motion final chords and releases retain single step edge semantics',function()
	local p=C.compile({motion('chord','D,DF,F,x+y'),motion('release','D,DF,F,~z')})
	local s=replay(p,{{down=true,z=true},{down=true,right=true,z=true},{right=true,z=true,x=true}})
	assert(not s.active.chord and not s.active.release)
	s=C.step(p,s,{right=true,x=true,y=true},1)
	assert(s.active.chord and s.active.release)
	assert(not C.step(p,s,{right=true,x=true,y=true},1).active.chord)
end)
test('double taps require distinct rising edges',function()
	local p=C.compile({motion('dash','F,F')})
	assert(not replay(p,{{right=true},{right=true}}).active.dash)
	assert(replay(p,{{right=true},{},{right=true}}).active.dash)
end)
test('release is an actual release, not a down press',function()
	local p=C.compile({motion('release','~D,x')})
	assert(not replay(p,{{down=true},{down=true,x=true}}).active.release)
	assert(replay(p,{{down=true},{x=true}}).active.release)
end)
test('holds remain predicates through the subsequent button',function()
	local p=C.compile({motion('down','/$D,x',1),motion('long','/D,F,x')})
	assert(replay(p,{{down=true,right=true,x=true}}).active.down)
	assert(not replay(p,{{down=true},{x=true}}).active.down)
	assert(not replay(p,{{down=true},{right=true},{x=true}}).active.long)
end)
test('charge counts continuous active ticks before release, outside motion time',function()
	local p=C.compile({motion('charge','~3$B,F,x',2),motion('button','~3a',1)})
	assert(replay(p,{{left=true},{left=true,down=true},{left=true},{right=true,x=true}}).active.charge)
	assert(not replay(p,{{left=true},{left=true},{right=true,x=true}}).active.charge)
	assert(not replay(p,{{left=true},{},{left=true},{right=true,x=true}}).active.charge)
	assert(replay(p,{{a=true},{a=true},{a=true},{}}).active.button)
	assert(not replay(p,{{a=true},{a=true},{}}).active.button)
end)
test('motion pause clock freezes while input edges and buffers survive',function()
	local p=C.compile({motion('qcf','~D,DF,F,x',2,2)})
	local s=replay(p,{{down=true},{down=true,right=true}})
	for _=1,20 do s=C.step(p,s,{down=true,right=true},1,true) end
	s=C.step(p,s,{right=true,x=true},1,true); assert(s.active.qcf)
	for _=1,20 do s=C.step(p,s,{right=true,x=true},1,true); assert(s.active.qcf) end
	s=C.step(p,s,{right=true,x=true},1,false); assert(s.active.qcf)
	s=C.step(p,s,{},1,false); assert(s.active.qcf)
	assert(not C.step(p,s,{},1,false).active.qcf)
end)
test('charge duration does not grow during hitpause',function()
	local p=C.compile({motion('charge','~3a')}); local s=C.step(p,C.new(),{a=true},1)
	for _=1,20 do s=C.step(p,s,{a=true},1,true) end
	assert(not C.step(p,s,{},1).active.charge)
end)
local function copy(value: any): any
	if type(value)~='table' then return value end
	assert(getmetatable(value)==nil)
	local result={}; for key, child in value do result[key]=copy(child) end; return result
end
test('plain snapshots roundtrip mid motion, charge, pause and old snapshots',function()
	local p=C.compile({motion('qcf','~D,DF,F,x'),motion('charge','~3a'),def('normal','y')})
	local s=replay(p,{{down=true,a=true},{down=true,right=true,a=true}})
	local saved=copy(s)
	local resumed=C.step(p,s,{right=true,x=true,a=true},1,true)
	local restored=C.step(p,copy(s),{right=true,x=true,a=true},1,true)
	assert(restored.active.qcf and restored.history and resumed.history)
	assert(s.history)
	assert(restored.history.clock==resumed.history.clock and saved.history.progress[1][2]==s.history.progress[1][2])
	restored=C.step(p,copy(restored),{a=true},1)
	assert(C.step(p,copy(restored),{},1).active.charge)
	assert(s.held.down and not s.active.qcf)
	local legacy: C.Snapshot={tick=20,held={down=true},remaining={},active={},paused=false}
	assert(replay(p,{{down=true,right=true},{right=true,x=true}},1,legacy).active.qcf)
	assert(C.step(p,legacy,{y=true},1).active.normal)
end)
test('motion remaps and facing flips do not invent edges',function()
	local d=motion('qcf','~D,DF,F,x'); d.remap={x='a'}; local p=C.compile({d})
	assert(replay(p,{{down=true},{down=true,right=true},{right=true,a=true}}).active.qcf)
	local dash=C.compile({motion('dash','F,F')}); local s=C.step(dash,C.new(),{right=true},1)
	s=C.step(dash,s,{left=true},1); assert(not C.step(dash,s,{left=true},-1).active.dash)
end)
test('unsupported and malformed commands reject within explicit bounds',function()
	for _, pattern in {'>x','','x+','$x','D,,x','~0D','~601D','~1.5D','/~D','~ /D','x+x','/D,/F'} do fails(function() C.compile({def('bad',pattern)}) end) end
	fails(function() C.compile({motion('bad','x',601)}) end)
	fails(function() C.compile({motion('bad',string.rep('D,',32)..'x')}) end)
	fails(function() C.compile({def('bad','x',31)}) end)
	fails(function() C.compile({def('bad','x',0)}) end)
	fails(function() C.step({},C.new(),{unknown=true},1) end)
end)
print(tostring(count)..' command tests passed')
