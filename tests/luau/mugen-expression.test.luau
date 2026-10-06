--!strict
local E = require('../../runtime/MugenExpression')
local count = 0
local function test(name: string, run: () -> ()) run(); count += 1; print('PASS expression: ' .. name) end
local ctx: E.Context = {resolve=function(name: string, args: {E.Value}): E.Value
	if name == 'time' then return E.integer(4) end
	if name == 'statetype' or name == 's' then return E.string('S') end
	if name == 'command' then return E.integer(if args[1].text == 'x' then 1 else 0) end
	if name == 'animelemtime' then return if args[1].number == 2 then E.integer(0) else E.bottom() end
	if name == 'var' then return E.integer((args[1].number or 0) + 10) end
	error('Unsupported trigger ' .. name)
end}
local function value(text: string): E.Value return E.evaluate(E.compile(text),ctx) end
local function equal(text: string, expected: number) assert(value(text).number == expected, text .. ': got ' .. tostring(value(text).number)) end
local function fails(run: () -> ()) assert(not pcall(run), 'Expected rejection') end
test('arithmetic and integer division',function() equal('7 / 2',3); equal('-7 / 2',-3); equal('-7 % 2',-1); equal('7 / 2.0',3.5) end)
test('MUGEN precedence and left associative power',function() equal('-2 ** 2',4); equal('2 ** 3 ** 2',64); equal('1 + 2 * 3',7); equal('1 || 0 && 0',1); equal('1 | 2 & 4',1) end)
test('numeric kinds and signed bitwise values',function() assert(value('1').kind=='int'); assert(value('1e0').kind=='float'); equal('~0',-1); equal('2147483647 + 1',-2147483648); equal('5 ^ 3',6) end)
test('inclusive and exclusive intervals',function() equal('time = [4,8]',1); equal('time = (4,8]',0); equal('time != [0,4)',1); equal('(1 + 3) = 4',1) end)
test('commands, enums, calls and legacy AnimElem',function() equal('command = "x" && statetype = S',1); equal('command != "y"',1); equal('var(2) = 12',1); equal('AnimElem = 2',1) end)
test('invalid computations propagate bottom',function() for _, text in {'1/0','1%0','1.5%2','ln(-1)','AnimElem = 99','(1/0)+3'} do assert(value(text).kind=='bottom',text) end; assert(not E.truth(E.bottom())) end)
test('lazy Cond and eager IfElse',function() equal('Cond(1, 7, unsupported)',7); fails(function() value('IfElse(1, 7, unsupported)') end) end)
test('math functions',function() equal('abs(-4)',4); equal('floor(2.9)',2); equal('ceil(-2.9)',-2); assert(math.abs(E.number(value('sin(pi/2)'))-1)<0.00001) end)
test('unknown and incomplete syntax is rejected',function() for _, text in {'','1 +','var(1) := 2','parent, time','AnimElem = 1, >= 0','"unterminated'} do fails(function() E.compile(text) end) end; fails(function() value('unknown') end) end)
test('parser budgets and frozen bottom',function() fails(function() E.compile(string.rep('(',70)..'1'..string.rep(')',70)) end); fails(function() E.compile(string.rep('1+',300)..'1') end); assert(table.isfrozen(E.bottom())) end)
print(tostring(count)..' expression tests passed')
