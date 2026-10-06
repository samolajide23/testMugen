--!strict
local HitDef = require('../../runtime/MugenHitDef')
local E = require('../../runtime/MugenExpression')
local count = 0
local function test(name: string, run: () -> ())
	run(); count += 1; print('PASS hitdef: ' .. name)
end
local function fails(run: () -> (), contains: string?)
	local ok, message = pcall(run)
	assert(not ok, 'Expected rejection')
	if contains then assert(string.find(tostring(message), contains, 1, true), tostring(message)) end
end
local context: E.Context = {resolve = function(name: string, _args: {E.Value}): E.Value
	if name == 'random' then return E.integer(947) end
	if name == 'time' then return E.integer(4) end
	error('Unsupported test trigger ' .. name)
end}
local function definition(params: HitDef.Params): HitDef.Definition
	return HitDef.evaluate(HitDef.compile(params), context)
end
local function parameters(key: string, value: string): HitDef.Params
	local params: HitDef.Params = {attr = 'S, NA'}
	params[key] = value
	return params
end
local function vector(actual: HitDef.Vector, x: number, y: number)
	assert(math.abs(actual.x - x) < 1e-10 and math.abs(actual.y - y) < 1e-10,
		'Unexpected vector: ' .. tostring(actual.x) .. ', ' .. tostring(actual.y))
end

-- Selected HitDefs from chars/coiny/player.cns; controller bookkeeping and comments excluded.
local coiny200: HitDef.Params = {
	attr = 'S, NA', damage = '20,10', animtype = 'Light', guardflag = 'MA', hitflag = 'MAF',
	priority = '3, Hit', pausetime = '3, 3', sparkno = '0', sparkxy = '-10, -60',
	hitsound = 's5,0+ (Random%5)', guardsound = '6,0', ['ground.type'] = 'High',
	['ground.slidetime'] = '5', ['ground.hittime'] = '10', ['ground.velocity'] = '-2',
	['airguard.velocity'] = '-1.9,-.8', ['air.type'] = 'High', ['air.velocity'] = '-1.4,-3',
	['air.hittime'] = '12',
}
local coiny210: HitDef.Params = {
	attr = 'S, NA', animtype = 'Medium', damage = '20,10', guardflag = 'MA', pausetime = '3,3',
	sparkno = '1', sparkxy = '-10,-60', hitsound = 's5,0+ (Random%5)', guardsound = '6,0',
	['ground.type'] = 'High', ['ground.slidetime'] = '12', ['ground.hittime'] = '13',
	['ground.velocity'] = '-2.5', ['air.velocity'] = '-2.5,-4',
}
local coiny220 = table.clone(coiny210)
coiny220.sparkno = '2'

test('documented defaults and supported air reactions', function()
	local d = definition({attr = 'S, NA'})
	assert(d.damage == 0 and d.guardDamage == 0)
	assert(d.hitPause == 0 and d.victimPause == 0 and d.guardPause == 0 and d.guardVictimPause == 0)
	assert(d.hitTime == 0 and d.slideTime == 0 and d.guardTime == 0 and d.guardSlideTime == 0)
	assert(d.priority == 4 and d.priorityType == 'Hit')
	assert(d.hitFlag == 'MAF' and d.guardFlag == '' and d.attr == 'S, NA')
	assert(d.groundType == 'High' and d.animType == 'Light')
	vector(d.groundVelocity, 0, 0); vector(d.guardVelocity, 0, 0)
	assert(d.air.supported and #d.air.reason > 0)
	assert(d.air.hitFlag == 'AF' and d.air.guardFlag == '' and d.air.hitTime == 20)
	assert(d.air.hitType == 'High' and d.air.animType == 'Light')
	vector(d.air.velocity, 0, 0); vector(d.air.guardVelocity, 0, 0)
	assert(not d.presentation.supported)
	assert(d.presentation.spark.source == 'playerDefault' and d.presentation.spark.defaultKey == 'sparkno')
	assert(d.presentation.guardSpark.source == 'playerDefault' and d.presentation.guardSpark.defaultKey == 'guard.sparkno')
	assert(d.presentation.hitSound.source == 'playerDefault' and d.presentation.hitSound.defaultKey == 'hitsound')
	assert(d.presentation.guardSound.source == 'playerDefault' and d.presentation.guardSound.defaultKey == 'guardsound')
	assert(d.presentation.spark.action == nil and d.presentation.hitSound.group == nil)
	vector(d.presentation.sparkOffset, 0, 0)
end)

test('normal special hyper and projectile attack classes preserve source attributes', function()
	for _, class in {'NA','SA','HA','NP','SP','HP'} do
		local d=definition({attr='S, '..class,damage='15,5'})
		assert(d.attr=='S, '..class and d.damage==15 and d.guardDamage==5)
	end
end)
test('airborne normal attributes retain posture independently from guard flags', function()
	local d = definition({attr='a, na',guardflag='HA',fall='1',damage='35,10',['air.velocity']='-3,8'})
	assert(d.attr=='A, NA' and d.guardFlag=='HA' and d.fall and d.damage==35)
	vector(d.air.velocity,-3,8)
end)

test('Coiny projectile air/down parameters Heavy alias and hit-confirm state', function()
	local d=definition({attr='S,SP',animtype='Heavy',damage='30,10',['air.velocity']='-4,-6',
		['air.fall']='1',['air.juggle']='3',['down.velocity']='-4,-6',['down.hittime']='30',['down.bounce']='0',p1stateno='3011',getpower='24',givepower='10,3'})
	assert(d.animType=='Hard' and d.air.animType=='Hard' and d.airFall and not d.fall and d.airJuggle==3)
	assert(d.downHitTime==30 and not d.downBounce and d.p1StateNo==3011)
	vector(d.downVelocity,-4,-6); vector(d.getPower,24,12); vector(d.givePower,10,3)
	local defaults=definition({attr='S,SP',fall='1',['air.velocity']='-2,-5'})
	assert(defaults.airFall and defaults.airJuggle==0 and defaults.downHitTime==20 and defaults.p1StateNo==nil)
	vector(defaults.downVelocity,-2,-5)
	for _, key in {'air.juggle','down.hittime','getpower','givepower'} do
		fails(function() definition(parameters(key,'-1')) end)
	end
end)

test('actual Coiny state 200', function()
	local d = definition(coiny200)
	assert(d.damage == 20 and d.guardDamage == 10 and d.priority == 3)
	assert(d.hitPause == 3 and d.victimPause == 3 and d.guardPause == 3 and d.guardVictimPause == 3)
	assert(d.hitTime == 10 and d.slideTime == 5 and d.guardTime == 10 and d.guardSlideTime == 10)
	assert(d.animType == 'Light' and d.groundType == 'High' and d.guardFlag == 'MA')
	vector(d.groundVelocity, -2, 0); vector(d.guardVelocity, -2, 0)
	assert(d.presentation.spark.source == 'common' and d.presentation.spark.action == 0)
	vector(d.presentation.sparkOffset, -10, -60)
	assert(d.presentation.hitSound.source == 'player' and d.presentation.hitSound.group == 5 and d.presentation.hitSound.item == 2)
	assert(d.presentation.guardSound.source == 'common' and d.presentation.guardSound.group == 6 and d.presentation.guardSound.item == 0)
	assert(d.air.supported and d.air.hitTime == 12 and d.air.hitFlag == 'AF' and d.air.guardFlag == 'A')
	vector(d.air.velocity, -1.4, -3); vector(d.air.guardVelocity, -1.9, -0.8)
end)

test('actual Coiny states 210 and 220', function()
	for index, params in {coiny210, coiny220} do
		local d = definition(params)
		assert(d.damage == 20 and d.guardDamage == 10 and d.priority == 4 and d.hitFlag == 'MAF')
		assert(d.animType == 'Medium' and d.groundType == 'High' and d.guardFlag == 'MA')
		assert(d.hitPause == 3 and d.victimPause == 3 and d.guardPause == 3 and d.guardVictimPause == 3)
		assert(d.hitTime == 13 and d.slideTime == 12 and d.guardTime == 13 and d.guardSlideTime == 13)
		vector(d.groundVelocity, -2.5, 0); vector(d.guardVelocity, -2.5, 0)
		assert(d.presentation.spark.action == index and d.presentation.hitSound.item == 2)
		assert(d.air.hitTime == 20 and d.air.animType == 'Medium')
		vector(d.air.velocity, -2.5, -4); vector(d.air.guardVelocity, -3.75, -2)
	end
end)

test('guard default dependencies use evaluated values', function()
	local d = definition({attr = 'C, NA', damage = 'time * 3', pausetime = 'time, time + 2',
		['ground.hittime'] = 'time + 10', ['ground.slidetime'] = '3',
		['guard.hittime'] = 'time + 20', ['ground.velocity'] = '-time / 2.0'})
	assert(d.damage == 12 and d.guardDamage == 0)
	assert(d.guardPause == 4 and d.guardVictimPause == 6)
	assert(d.hitTime == 14 and d.slideTime == 3 and d.guardTime == 24 and d.guardSlideTime == 24)
	vector(d.guardVelocity, -2, 0)
end)

test('explicit zero overrides inherited defaults', function()
	local d = definition({attr = 'S,NA', pausetime = '3,4', ['guard.pausetime'] = '0,0',
		['ground.hittime'] = '12', ['guard.hittime'] = '0', ['guard.slidetime'] = '0',
		['ground.velocity'] = '-3,0', ['guard.velocity'] = '0', ['air.velocity'] = '-4,-6',
		['airguard.velocity'] = '0,0', ['air.hittime'] = '0'})
	assert(d.guardPause == 0 and d.guardVictimPause == 0 and d.guardTime == 0 and d.guardSlideTime == 0)
	vector(d.guardVelocity, 0, 0); vector(d.air.guardVelocity, 0, 0); assert(d.air.hitTime == 0)
end)

test('nested functions and mixed interval brackets do not split vectors', function()
	local d = definition({attr = 'S, NA',
		damage = 'Cond(time = [1,5), IfElse(1, 18, 20), 0), 1 + 2',
		pausetime = 'Cond(time = (1,4], 3, 0), (1+2)',
		['ground.velocity'] = 'Cond(time = [4,9], -2.5, 0), Cond(time != (0,4], 1, 0)',
		['air.velocity'] = 'IfElse(time = [1,4], -3.0, -2.0), -(2 + 3)',
		sparkxy = 'IfElse(time = [0,4], -10, 0), -(30 * 2)',
		hitsound = 's(2+3), Cond(time = [1,9], Random%5, 0)'})
	assert(d.damage == 18 and d.guardDamage == 3 and d.hitPause == 3 and d.victimPause == 3)
	vector(d.groundVelocity, -2.5, 0); vector(d.air.velocity, -3, -5)
	vector(d.presentation.sparkOffset, -10, -60)
	assert(d.presentation.hitSound.group == 5 and d.presentation.hitSound.item == 2)
end)

test('compile once and reevaluate per activation using stable context Random', function()
	local params: HitDef.Params = {attr = 'S, NA', damage = 'Random % 5, Random % 5',
		hitsound = 's5,Random % 5', ['ground.hittime'] = 'time + 1'}
	local program = HitDef.compile(params)
	params.damage = '999'
	local originalCompile = E.compile
	E.compile = function(_source: string): E.Node error('Unexpected recompilation') end
	local ok, message = pcall(function()
		local first = HitDef.evaluate(program, context)
		local again = HitDef.evaluate(program, context)
		assert(first.damage == 2 and first.guardDamage == 2 and first.presentation.hitSound.item == 2)
		assert(again.damage == first.damage and again.hitTime == 5)
		local nextContext: E.Context = {resolve = function(name: string, _args: {E.Value}): E.Value
			return E.integer(if name == 'random' then 999 else 9)
		end}
		local nextActivation = HitDef.evaluate(program, nextContext)
		assert(nextActivation.damage == 4 and nextActivation.guardDamage == 4)
		assert(nextActivation.presentation.hitSound.item == 4 and nextActivation.hitTime == 10)
		assert(first.damage == 2 and first.hitTime == 5)
	end)
	E.compile = originalCompile
	assert(ok, tostring(message))
end)

test('inheritance does not reevaluate expressions', function()
	local calls = 0
	local ctx: E.Context = {resolve = function(_name: string, _args: {E.Value}): E.Value
		calls += 1; return E.integer(3)
	end}
	local d = HitDef.evaluate(HitDef.compile({attr = 'S,NA', ['ground.hittime'] = 'time',
		['ground.velocity'] = '-time', pausetime = 'time,time'}), ctx)
	assert(calls == 4 and d.hitTime == 3 and d.guardTime == 3 and d.guardSlideTime == 3)
	assert(d.guardPause == 3 and d.guardVictimPause == 3); vector(d.guardVelocity, -3, 0)
end)

test('case normalization and supported flags and priority classes', function()
	local d = definition({[' Attr '] = ' c, na ', ['GuardFlag'] = 'hl', hitflag = 'hmaf',
		animtype = 'hArD', ['ground.type'] = 'low', priority = '1+6,dOdGe'})
	assert(d.attr == 'C, NA' and d.animType == 'Hard' and d.groundType == 'Low')
	assert(d.guardFlag == 'HL' and d.hitFlag == 'HMAF' and d.priority == 7 and d.priorityType == 'Dodge')
	assert(d.air.hitType == 'Low' and d.air.animType == 'Hard')
	assert(definition(parameters('priority', '1,Miss')).priorityType == 'Miss')
	assert(definition(parameters('priority', '2')).priorityType == 'Hit')
	for _, flag in {'H', 'L', 'M', 'HL', 'HA', 'LF', 'A', 'F', 'AF'} do assert(definition(parameters('hitflag', flag)).hitFlag == flag) end
	for _, flag in {'H', 'L', 'M', 'HL', 'MA', 'A', ''} do assert(definition(parameters('guardflag', flag)).guardFlag == flag) end
end)

test('presentation expressions prefixes and suppressed resource metadata', function()
	local d = definition({attr = 'S, NA', sparkno = 'S (time+5)', ['guard.sparkno'] = '-1',
		hitsound = 'S 5+time, 1+2', guardsound = '-1,0', sparkxy = '-(time*2),-60'})
	assert(d.presentation.spark.source == 'player' and d.presentation.spark.action == 9)
	assert(d.presentation.guardSpark.source == 'common' and d.presentation.guardSpark.action == -1)
	assert(d.presentation.hitSound.source == 'player' and d.presentation.hitSound.group == 9 and d.presentation.hitSound.item == 3)
	assert(d.presentation.guardSound.group == -1); vector(d.presentation.sparkOffset, -8, -60)
	assert(definition(parameters('sparkno', 'sin(0)')).presentation.spark.action == 0)
end)

test('explicit air animation and reaction are supported', function()
	local d = definition({attr = 'S,NA', ['air.type'] = 'Trip', ['air.animtype'] = 'Back',
		['air.hittime'] = 'time*3', ['air.velocity'] = '-time/2.0,-time'})
	assert(d.air.supported and d.air.hitType == 'Trip' and d.air.animType == 'Back' and d.air.hitTime == 12)
	assert(d.groundType == 'High' and d.animType == 'Light')
	vector(d.air.velocity, -2, -4); vector(d.air.guardVelocity, -3, -2)
end)

test('missing unsupported and duplicate normalized parameters are rejected', function()
	fails(function() HitDef.compile({}) end, 'requires attr')
	for _, key in {'unknown', 'fall.damage', 'p2stateno', 'affectteam',
		'kill', 'guard.kill', 'hitonce',
		'ground.cornerpush.veloff', 'forcenofall', 'type', 'trigger1', 'triggerall', 'persistent', 'ignorehitpause'} do
		fails(function() HitDef.compile(parameters(key, '0')) end, 'Unsupported HitDef parameter')
	end
	fails(function() HitDef.compile({attr = 'S,NA', damage = '1', DAMAGE = '2'}) end, 'Duplicate HitDef parameter')
	fails(function() HitDef.compile({attr = 'S,NA', [' attr '] = 'C,NA'}) end, 'Duplicate HitDef parameter')
end)

test('unsupported attributes grounded reactions and priority enums', function()
	for _, attr in {'L,NA', 'S,NT', 'SC,NA', 'S', 'S,NA,NP', 'S,'} do
		fails(function() HitDef.compile({attr = attr}) end)
	end
	for _, value in {'Trip', 'Normal', 'Bogus'} do fails(function() HitDef.compile(parameters('ground.type', value)) end) end
	for _, value in {'Up', 'DiagUp'} do fails(function() HitDef.compile(parameters('animtype', value)) end) end
	fails(function() HitDef.compile(parameters('priority', '3,unknown')) end)
	fails(function() HitDef.compile(parameters('air.type', 'unknown')) end)
	fails(function() HitDef.compile(parameters('air.animtype', 'unknown')) end)
end)

test('normalized non-launching Back and pause-only None reactions', function()
	local d = definition({attr = 'S,NA', animtype = 'bAcK', ['ground.type'] = 'nOnE',
		pausetime = '3,4', damage = '20,10', ['ground.velocity'] = '-2,0'})
	assert(d.animType == 'Back' and d.groundType == 'None')
	assert(d.hitPause == 3 and d.victimPause == 4 and d.damage == 20 and d.guardDamage == 10)
	assert(d.air.animType == 'Back' and d.air.hitType == 'None' and d.air.supported)
	vector(d.groundVelocity, -2, 0)
	vector(definition({attr = 'S,NA', animtype = 'Back', ['ground.velocity'] = '-2,-1'}).groundVelocity, -2, -1)
end)

test('hitstun eligibility modifiers are preserved for the host', function()
	for _, flag in {'M+', 'M-', 'H+', 'H-', 'HL+', 'MAF-', 'MAF+'} do
		local d = definition(parameters('hitflag', string.lower(flag)))
		assert(d.hitFlag == flag)
		assert(d.air.hitFlag == (if string.find(flag, 'AF', 1, true) then 'AF' else ''))
	end
end)

test('explicit guard values override each independent inherited value', function()
	local d = definition({attr = 'S,NA', pausetime = '3,4', ['guard.pausetime'] = '5,6',
		['ground.hittime'] = '10', ['ground.slidetime'] = '12', ['guard.hittime'] = '7',
		['guard.slidetime'] = '8', ['ground.velocity'] = '-2', ['guard.velocity'] = '-1.5'})
	assert(d.hitPause == 3 and d.victimPause == 4 and d.guardPause == 5 and d.guardVictimPause == 6)
	assert(d.hitTime == 10 and d.slideTime == 12 and d.guardTime == 7 and d.guardSlideTime == 8)
	vector(d.groundVelocity, -2, 0); vector(d.guardVelocity, -1.5, 0)
end)

test('unsupported malformed and duplicate flags', function()
	for _, value in {'', 'MAD', 'S', 'MS', 'M+-', 'M-+', 'M++', 'M--',
		'+M', '-M', 'M+A', 'M-A', '+', '-', 'MM', 'MAAF', 'M A', 'Q'} do
		fails(function() HitDef.compile(parameters('hitflag', value)) end)
	end
	for _, value in {'MF', 'MD', 'S', 'MS', 'M+', 'M-', 'MM', 'M A', 'Q'} do
		fails(function() HitDef.compile(parameters('guardflag', value)) end)
	end
end)

test('vector arity missing components and malformed nesting', function()
	for _, key in {'damage', 'ground.velocity'} do
		for _, value in {'', '1,', ',2', '1,2,3', '(1,2', '1),2', 'Cond(1,2,3)),0'} do
			fails(function() HitDef.compile(parameters(key, value)) end)
		end
	end
	for _, key in {'pausetime', 'guard.pausetime', 'air.velocity', 'airguard.velocity', 'sparkxy', 'hitsound', 'guardsound'} do
		for _, value in {'1', '1,', ',2', '1,2,3'} do fails(function() HitDef.compile(parameters(key, value)) end) end
	end
	for _, key in {'guard.velocity', 'ground.hittime', 'ground.slidetime', 'air.hittime', 'sparkno', 'guard.sparkno'} do
		fails(function() HitDef.compile(parameters(key, '1,2')) end)
	end
	for _, value in {'1+', 'IfElse(1,2,3', 'time := 2', '"unterminated'} do
		fails(function() HitDef.compile(parameters('damage', value)) end)
	end
end)

test('invalid numeric results and out-of-scope gameplay are rejected', function()
	for _, value in {'1/0', '"text"', 'unknown', '1e999', '-1', '1.5'} do
		fails(function() definition(parameters('damage', value)) end)
	end
	for _, key in {'ground.hittime', 'guard.hittime', 'ground.slidetime', 'guard.slidetime', 'air.hittime'} do
		for _, value in {'-1', '0.5'} do fails(function() definition(parameters(key, value)) end) end
	end
	for _, value in {'0', '8', '3.5'} do fails(function() definition(parameters('priority', value)) end) end
	vector(definition(parameters('ground.velocity', '-2,-1')).groundVelocity, -2, -1)
	for _, key in {'pausetime', 'guard.pausetime'} do
		fails(function() definition(parameters(key, '0,-1')) end)
		fails(function() definition(parameters(key, '1.5,0')) end)
	end
	fails(function() definition(parameters('sparkno', '-2')) end)
	fails(function() definition(parameters('hitsound', 'S5,1.2')) end)
	fails(function() definition(parameters('guardsound', '6,-1')) end)
	fails(function() definition(parameters('sparkxy', '0.5,0')) end)
	fails(function() definition(parameters('air.velocity', '1/0,0')) end)
	fails(function() definition(parameters('airguard.velocity', '0,1/0')) end)
	fails(function() definition(parameters('air.velocity', '1.7e308,0')) end, 'Non-finite default')
	local nonFinite: E.Context = {resolve = function(_name: string, _args: {E.Value}): E.Value
		return {kind = 'float', number = math.huge}
	end}
	fails(function() HitDef.evaluate(HitDef.compile(parameters('ground.velocity', 'time')), nonFinite) end, 'Non-finite')
end)

test('bounded parsing budgets', function()
	fails(function() HitDef.compile(parameters('damage', string.rep('1', 4097))) end)
	fails(function() HitDef.compile(parameters('damage', string.rep('(', 65) .. '1' .. string.rep(')', 65))) end)
end)

test('fall and guard reaction defaults', function()
	local d = definition({attr = 'S,NA'})
	assert(not d.fall and d.fallRecover and d.fallRecoverTime == 4 and d.yaccel == nil)
	vector(d.fallVelocity, 0, -4.5)
	assert(d.guardCtrlTime == 0 and d.airGuardCtrlTime == 0)
	assert(d.airGuardHitTime == 0 and d.airGuardSlideTime == 0)
	assert(d.air.supported and not d.presentation.supported)
end)

test('all standard fall and guard parameters evaluate expressions', function()
	local d = definition({attr = 'S,NA', fall = 'time = 4', ['fall.recover'] = 'time != 4',
		['fall.recovertime'] = 'time + 5', ['fall.xvelocity'] = '-time / 2.0',
		['fall.yvelocity'] = '-time - 0.5', yaccel = 'time / 10.0',
		['guard.ctrltime'] = 'time + 1', ['airguard.ctrltime'] = 'time + 2',
		['airguard.hittime'] = 'time + 3', ['airguard.slidetime'] = 'time + 4',
		['ground.velocity'] = '-2,-3', ['air.type'] = 'Low', ['air.animtype'] = 'Up'})
	assert(d.fall and not d.fallRecover and d.fallRecoverTime == 9 and d.yaccel == 0.4)
	vector(d.fallVelocity, -2, -4.5); vector(d.groundVelocity, -2, -3)
	assert(d.guardCtrlTime == 5 and d.airGuardCtrlTime == 6)
	assert(d.airGuardHitTime == 7 and d.airGuardSlideTime == 8)
	assert(d.air.hitType == 'Low' and d.air.animType == 'Up')
end)

test('guard reaction inheritance uses independent evaluated values', function()
	local calls = 0
	local ctx: E.Context = {resolve = function(_name: string, _args: {E.Value}): E.Value
		calls += 1; return E.integer(3)
	end}
	local d = HitDef.evaluate(HitDef.compile({attr = 'S,NA', ['ground.hittime'] = 'time + 1',
		['guard.hittime'] = 'time + 2', ['guard.slidetime'] = 'time + 3'}), ctx)
	assert(calls == 3 and d.guardTime == 5 and d.guardSlideTime == 6)
	assert(d.guardCtrlTime == 6 and d.airGuardCtrlTime == 6)
	assert(d.airGuardHitTime == 5 and d.airGuardSlideTime == 6)
	local explicit = definition({attr = 'S,NA', ['guard.hittime'] = '7',
		['guard.slidetime'] = '8', ['guard.ctrltime'] = '9'})
	assert(explicit.guardCtrlTime == 9 and explicit.airGuardCtrlTime == 9)
	assert(explicit.airGuardHitTime == 7 and explicit.airGuardSlideTime == 8)
end)

test('explicit zero fall and guard values override defaults', function()
	local d = definition({attr = 'S,NA', fall = '0', ['fall.recover'] = '0',
		['fall.recovertime'] = '0', ['fall.xvelocity'] = '0', ['fall.yvelocity'] = '0', yaccel = '0',
		['guard.hittime'] = '7', ['guard.slidetime'] = '8', ['guard.ctrltime'] = '0',
		['airguard.ctrltime'] = '0', ['airguard.hittime'] = '0', ['airguard.slidetime'] = '0'})
	assert(not d.fall and not d.fallRecover and d.fallRecoverTime == 0 and d.yaccel == 0)
	vector(d.fallVelocity, 0, 0)
	assert(d.guardCtrlTime == 0 and d.airGuardCtrlTime == 0)
	assert(d.airGuardHitTime == 0 and d.airGuardSlideTime == 0)
end)

test('fall and guard parameters reject invalid expressions and arity', function()
	for _, key in {'fall', 'fall.recover', 'fall.recovertime', 'fall.xvelocity', 'fall.yvelocity',
		'yaccel', 'guard.ctrltime', 'airguard.ctrltime', 'airguard.hittime', 'airguard.slidetime'} do
		for _, source in {'', '1+', '1,2', 'IfElse(1,2,3', 'time := 2'} do
			fails(function() HitDef.compile(parameters(key, source)) end)
		end
		for _, source in {'1/0', '1e999', 'unknown', '"text"'} do
			fails(function() definition(parameters(key, source)) end)
		end
		fails(function() HitDef.compile({attr = 'S,NA', [key] = '1', [string.upper(key)] = '0'}) end,
			'Duplicate HitDef parameter')
	end
end)

test('fall and guard numeric range diagnostics', function()
	for _, key in {'fall', 'fall.recover'} do
		for _, source in {'-1', '0.5', '2'} do
			fails(function() definition(parameters(key, source)) end, 'HitDef')
		end
	end
	for _, key in {'fall.recovertime', 'guard.ctrltime', 'airguard.ctrltime', 'airguard.hittime', 'airguard.slidetime'} do
		for _, source in {'-1', '0.5'} do
			fails(function() definition(parameters(key, source)) end, 'Invalid HitDef integer: ' .. key)
		end
	end
	fails(function() definition(parameters('yaccel', '-0.1')) end, 'Invalid HitDef acceleration: yaccel')
	for _, key in {'fall.xvelocity', 'fall.yvelocity'} do
		local velocity = definition(parameters(key, '-0.125')).fallVelocity
		assert((if key == 'fall.xvelocity' then velocity.x else velocity.y) == -0.125)
	end
end)

test('compiled fall reactions do not recompile or alias activations', function()
	local params: HitDef.Params = {attr = 'S,NA', fall = 'time = 4', ['fall.recover'] = 'time != 4',
		['fall.recovertime'] = 'time', ['fall.xvelocity'] = '-time', ['fall.yvelocity'] = '-time / 2.0',
		yaccel = 'time / 10.0', ['guard.ctrltime'] = 'time', ['airguard.ctrltime'] = 'time + 1',
		['airguard.hittime'] = 'time + 2', ['airguard.slidetime'] = 'time + 3'}
	local program = HitDef.compile(params)
	for key in params do params[key] = '999' end
	local originalCompile = E.compile
	E.compile = function(_source: string): E.Node error('Unexpected recompilation') end
	local ok, message = pcall(function()
		local first = HitDef.evaluate(program, context)
		first.fallVelocity.x = 99; first.air.velocity.x = 99; first.guardCtrlTime = 99
		local again = HitDef.evaluate(program, context)
		assert(again.fall and not again.fallRecover and again.fallRecoverTime == 4 and again.yaccel == 0.4)
		vector(again.fallVelocity, -4, -2); vector(again.air.velocity, 0, 0)
		assert(again.guardCtrlTime == 4 and again.airGuardCtrlTime == 5)
		assert(again.airGuardHitTime == 6 and again.airGuardSlideTime == 7)
		local nextContext: E.Context = {resolve = function(_name: string, _args: {E.Value}): E.Value
			return E.integer(8)
		end}
		local nextActivation = HitDef.evaluate(program, nextContext)
		assert(not nextActivation.fall and nextActivation.fallRecover and nextActivation.fallRecoverTime == 8)
		assert(nextActivation.yaccel == 0.8 and nextActivation.guardCtrlTime == 8)
		vector(nextActivation.fallVelocity, -8, -4); vector(again.fallVelocity, -4, -2)
	end)
	E.compile = originalCompile
	assert(ok, tostring(message))
end)

test('Back ground reaction and fallen hitstun flags reach the host', function()
	local d = definition({attr = 'S,NA', ['ground.type'] = 'Back', hitflag = 'F-', guardflag = 'A'})
	assert(d.groundType == 'Back' and d.air.hitType == 'Back' and d.hitFlag == 'F-')
	assert(d.air.hitFlag == 'F' and d.air.guardFlag == 'A')
end)

print(tostring(count) .. ' hitdef tests passed')
