--!strict
-- Bounded standard reactions, not a general HitDef implementation.
-- compile retains expression ASTs; evaluate resolves them once per activation. The
-- caller supplies a stable Random in Context and resolves raw duplicate keys
-- before constructing Params (strict by default; source opt-in keeps first).
-- Ground hit/slide times, damage, pauses and velocities default to zero.
-- guardPause/guardVictimPause inherit pausetime's respective components; guardTime
-- inherits ground.hittime; guardSlideTime inherits guard.hittime (NOT ground.slidetime).
-- guardCtrlTime inherits guardSlideTime; airGuardCtrlTime inherits guardCtrlTime.
-- airGuardHitTime/airGuardSlideTime are bounded extensions inheriting guardTime/
-- guardSlideTime respectively (not parameters in the public Elecbyte reference).
-- guard.velocity takes one scalar, defaults to ground.velocity.x, and always has y=0.
-- ground.type Back is a bounded host reaction extension; Trip remains unsupported.
-- Flags H/M allow standing, L/M crouching, A airborne and F fallen targets;
-- hitflag's optional final + / - requires / excludes hitstun. D remains unsupported.
-- fall defaults false, fallRecover true, fallRecoverTime 4; fallVelocity defaults
-- to (0, -4.5) in source 240p units. The bounded x=0 substitutes for MUGEN's
-- omitted-x 'no change'; yaccel=nil delegates acceleration to the character default.
-- The host owns collision eligibility, reaction behavior and priority resolution.
-- Missing presentation resources remain playerDefault references, not guessed IDs.
-- Air/down reactions and hit-confirm p1stateno are resolved by the host.
-- Heavy aliases Hard. Explicit getpower/givepower use hit,guard pairs (guard defaults
-- to half hit); omitted power gains are zero until source lifetopower constants
-- are imported. Presentation remains supported=false.
-- Defaults: https://www.elecbyte.com/mugendocs/sctrls.html#hitdef
local Expression = require('./MugenExpression')
local HitDef = {}

export type Params = {[string]: string}
export type Vector = {x: number, y: number}
export type Spark = {source: string, action: number?, defaultKey: string?}
export type Sound = {source: string, group: number?, item: number?, defaultKey: string?}
export type Presentation = {
	supported: boolean, spark: Spark, guardSpark: Spark, sparkOffset: Vector,
	hitSound: Sound, guardSound: Sound, palette: {[string]: {number}}?, fallAnimType: string?,
}
export type Air = {
	supported: boolean, reason: string, hitFlag: string, guardFlag: string,
	hitType: string, animType: string, hitTime: number, velocity: Vector, guardVelocity: Vector,
}
export type Definition = {
	damage: number, guardDamage: number,
	hitPause: number, victimPause: number, guardPause: number, guardVictimPause: number,
	hitTime: number, slideTime: number, guardTime: number, guardSlideTime: number,
	guardCtrlTime: number, airGuardCtrlTime: number, airGuardHitTime: number, airGuardSlideTime: number,
	fall: boolean, fallRecover: boolean, fallRecoverTime: number, fallVelocity: Vector, yaccel: number?,
	groundVelocity: Vector, guardVelocity: Vector, priority: number, priorityType: string,
	hitFlag: string, guardFlag: string, attr: string, groundType: string, animType: string,
	presentation: Presentation, air: Air,
	airFall: boolean, airJuggle: number, downVelocity: Vector, downHitTime: number, downBounce: boolean,
	p1StateNo: number?, getPower: Vector, givePower: Vector,
}
export type Program = {
	expressions: {[string]: {Expression.Node}}, sources: {[string]: string},
	attr: string, hitFlag: string, guardFlag: string, priorityType: string,
	groundType: string, animType: string, airType: string, airAnimType: string, fallAnimType: string?,
}

local NUMERIC: {[string]: {number}} = {
	damage = {1, 2}, pausetime = {2, 2}, ['guard.pausetime'] = {2, 2},
	['ground.hittime'] = {1, 1}, ['ground.slidetime'] = {1, 1},
	['guard.hittime'] = {1, 1}, ['guard.slidetime'] = {1, 1},
	['ground.velocity'] = {1, 2}, ['guard.velocity'] = {1, 1},
	['air.velocity'] = {2, 2}, ['airguard.velocity'] = {2, 2}, ['air.hittime'] = {1, 1},
	fall = {1, 1}, ['fall.recover'] = {1, 1}, ['fall.recovertime'] = {1, 1},
	['fall.xvelocity'] = {1, 1}, ['fall.yvelocity'] = {1, 1}, yaccel = {1, 1},
	['guard.ctrltime'] = {1, 1}, ['airguard.ctrltime'] = {1, 1},
	['airguard.hittime'] = {1, 1}, ['airguard.slidetime'] = {1, 1},
	sparkxy = {2, 2}, ['air.fall'] = {1, 1}, ['air.juggle'] = {1, 1},
	['down.velocity'] = {2, 2}, ['down.hittime'] = {1, 1}, ['down.bounce'] = {1, 1},
	p1stateno = {1, 1}, getpower = {1, 2}, givepower = {1, 2},
	['palfx.time']={1,1}, ['palfx.mul']={3,3}, ['palfx.add']={3,3}, ['palfx.sinadd']={4,4},
	['palfx.color']={1,1}, ['palfx.invertall']={1,1},
}
local SPECIAL = {attr = true, hitflag = true, guardflag = true, priority = true,
	animtype = true, ['ground.type'] = true, ['air.type'] = true, ['air.animtype'] = true,
	['fall.animtype'] = true, sparkno = true, ['guard.sparkno'] = true, hitsound = true, guardsound = true}

local function trim(text: string): string return (string.gsub(text, '^%s*(.-)%s*$', '%1')) end

local function split(text: string, minimum: number, maximum: number): {string}
	assert(#text <= 4096, 'HitDef parameter exceeds 4096 characters')
	local parts: {string} = {}
	local depth, start = 0, 1
	local quoted = false
	for i = 1, #text do
		local c = string.sub(text, i, i)
		if c == '"' then quoted = not quoted
		elseif not quoted then
			if c == '(' or c == '[' then
				depth += 1
				assert(depth <= 64, 'HitDef nesting limit exceeded')
			elseif c == ')' or c == ']' then
				-- Intervals may deliberately mix round and square brackets.
				depth -= 1
				assert(depth >= 0, 'Unbalanced HitDef parameter')
			elseif c == ',' and depth == 0 then
				table.insert(parts, trim(string.sub(text, start, i - 1)))
				assert(#parts < maximum, 'Too many HitDef components')
				start = i + 1
			end
		end
	end
	assert(depth == 0 and not quoted, 'Unterminated HitDef parameter')
	table.insert(parts, trim(string.sub(text, start)))
	assert(#parts >= minimum and #parts <= maximum, 'Wrong HitDef component count')
	for _, part in parts do assert(part ~= '', 'Empty HitDef component') end
	return parts
end

local function enum(text: string, choices: {string}): string
	local value = string.lower(trim(text))
	if value == 'heavy' then value = 'hard' elseif value == 'med' then value = 'medium' end
	for _, choice in choices do if value == string.lower(choice) then return choice end end
	error('Unsupported HitDef enum: ' .. text)
end

local function flags(text: string, guard: boolean): string
	local value = string.upper(trim(text))
	if guard and value == '' then return value end
	local seen: {[string]: boolean} = {}
	local target = false
	for i = 1, #value do
		local c = string.sub(value, i, i)
		if not guard and (c == '+' or c == '-') then
			assert(i == #value, 'HitDef hitstun modifier must be a single final + or -')
		else
			assert(string.find(if guard then 'HLMA' else 'HLMAF', c, 1, true), 'Unsupported HitDef flag: ' .. c)
		end
		assert(not seen[c], 'Duplicate HitDef flag: ' .. c)
		seen[c] = true
		if c ~= '+' and c ~= '-' then target = true end
	end
	assert(target, 'HitDef requires at least one supported target flag')
	return value
end

function HitDef.compile(params: Params): Program
	local values: Params = {}
	for key, value in params do
		local name = string.lower(trim(key))
		assert(NUMERIC[name] or SPECIAL[name], 'Unsupported HitDef parameter: ' .. key)
		assert(values[name] == nil, 'Duplicate HitDef parameter: ' .. name)
		assert(#value <= 4096, 'HitDef parameter exceeds 4096 characters')
		values[name] = trim(value)
	end
	assert(values.attr, 'HitDef requires attr')
	local attr = split(values.attr, 2, 2)
	local animType = enum(values.animtype or 'Light', {'Light', 'Medium', 'Hard', 'Back'})
	local groundType = enum(values['ground.type'] or 'High', {'High', 'Low', 'None', 'Back'})
	local priority = split(values.priority or '4, Hit', 1, 2)
	local program: Program = {
		expressions = {}, sources = {},
		attr = enum(attr[1], {'S', 'C', 'A'}) .. ', ' .. enum(attr[2], {'NA', 'SA', 'HA', 'NP', 'SP', 'HP'}),
		hitFlag = flags(values.hitflag or 'MAF', false), guardFlag = flags(values.guardflag or '', true),
		priorityType = enum(priority[2] or 'Hit', {'Hit', 'Miss', 'Dodge'}),
		groundType = groundType, animType = animType,
		airType = enum(values['air.type'] or groundType, {'High', 'Low', 'Trip', 'None', 'Back'}),
		airAnimType = enum(values['air.animtype'] or animType, {'Light', 'Medium', 'Hard', 'Back', 'Up', 'DiagUp'}),
		fallAnimType = if values['fall.animtype'] then enum(values['fall.animtype'] :: string, {'Up','DiagUp','Back','Down'}) else nil,
	}
	program.expressions.priority = {Expression.compile(priority[1])}
	for key, arity in NUMERIC do
		if values[key] ~= nil then
			local nodes: {Expression.Node} = {}
			for _, part in split(values[key], arity[1], arity[2]) do table.insert(nodes, Expression.compile(part)) end
			program.expressions[key] = nodes
		end
	end
	for _, key in {'sparkno', 'guard.sparkno', 'hitsound', 'guardsound'} do
		if values[key] ~= nil then
			local text = values[key]
			local source = 'common'
			-- Do not mistake sin(...) or stateno for the player's S prefix.
			if string.match(text, '^[sS][%s%d%.%(+%-]') then
				source = 'player'
				text = trim(string.sub(text, 2))
			end
			local arity = if key == 'hitsound' or key == 'guardsound' then 2 else 1
			local nodes: {Expression.Node} = {}
			for _, part in split(text, arity, arity) do table.insert(nodes, Expression.compile(part)) end
			program.sources[key] = source
			program.expressions[key] = nodes
		end
	end
	return program
end

function HitDef.evaluate(program: Program, context: Expression.Context): Definition
	local evaluated: {[string]: {number}} = {}
	local function numbers(key: string): {number}?
		if evaluated[key] then return evaluated[key] end
		local nodes = program.expressions[key]
		if not nodes then return nil end
		local result: {number} = {}
		for _, node in nodes do
			local n = Expression.number(Expression.evaluate(node, context))
			assert(n == n and math.abs(n) < math.huge, 'Non-finite HitDef value: ' .. key)
			table.insert(result, n)
		end
		evaluated[key] = result
		return result
	end
	local function scalar(key: string, fallback: number): number
		local values = numbers(key)
		return if values then values[1] else fallback
	end
	local function integer(n: number, key: string, minimum: number): number
		assert(n % 1 == 0 and n >= minimum, 'Invalid HitDef integer: ' .. key)
		return n
	end
	local function time(key: string, fallback: number): number return integer(scalar(key, fallback), key, 0) end
	local function pair(key: string, x: number, y: number): Vector
		local values = numbers(key)
		return if values then {x = values[1], y = values[2] or 0} else {x = x, y = y}
	end
	local damage = pair('damage', 0, 0)
	local pause = pair('pausetime', 0, 0)
	local guardPause = pair('guard.pausetime', pause.x, pause.y)
	local groundVelocity = pair('ground.velocity', 0, 0)
	local guardVelocity = {x = scalar('guard.velocity', groundVelocity.x), y = 0}
	local hitTime = time('ground.hittime', 0)
	local guardTime = time('guard.hittime', hitTime)
	local guardSlideTime = time('guard.slidetime', guardTime)
	local guardCtrlTime = time('guard.ctrltime', guardSlideTime)
	local function boolean(key: string, fallback: boolean): boolean
		local n = integer(scalar(key, if fallback then 1 else 0), key, 0)
		assert(n <= 1, 'Invalid HitDef boolean: ' .. key)
		return n == 1
	end
	local yaccel = if program.expressions.yaccel then scalar('yaccel', 0) else nil
	assert(yaccel == nil or yaccel >= 0, 'Invalid HitDef acceleration: yaccel')
	local priority = integer(scalar('priority', 4), 'priority', 1)
	assert(priority <= 7, 'HitDef priority exceeds 7')
	local airVelocity = pair('air.velocity', 0, 0)
	local airGuardVelocity = pair('airguard.velocity', airVelocity.x * 1.5, airVelocity.y / 2)
	assert(math.abs(airGuardVelocity.x) < math.huge, 'Non-finite default airguard.velocity')
	local sparkOffset = pair('sparkxy', 0, 0)
	integer(sparkOffset.x, 'sparkxy x', -math.huge); integer(sparkOffset.y, 'sparkxy y', -math.huge)
	local function power(key: string): Vector
		local values=numbers(key)
		local hit=if values then integer(values[1],key,0) else 0
		return {x=hit,y=if values and values[2] then integer(values[2],key,0) else math.floor(hit/2)}
	end
	local function spark(key: string): Spark
		local values = numbers(key)
		if not values then return {source = 'playerDefault', defaultKey = key} end
		return {source = program.sources[key], action = integer(values[1], key, -1)}
	end
	local function sound(key: string): Sound
		local values = numbers(key)
		if not values then return {source = 'playerDefault', defaultKey = key} end
		return {source = program.sources[key], group = integer(values[1], key, -1), item = integer(values[2], key, 0)}
	end
	local palette: {[string]: {number}} = {}
	for key in NUMERIC do if string.sub(key,1,6)=='palfx.' then
		local value=numbers(key)
		if value then palette[string.sub(key,7)]=value end
	end end
	return {
		damage = integer(damage.x, 'damage', 0), guardDamage = integer(damage.y, 'guard damage', 0),
		hitPause = integer(pause.x, 'pausetime', 0), victimPause = integer(pause.y, 'pausetime', 0),
		guardPause = integer(guardPause.x, 'guard.pausetime', 0), guardVictimPause = integer(guardPause.y, 'guard.pausetime', 0),
		hitTime = hitTime, slideTime = time('ground.slidetime', 0),
		guardTime = guardTime, guardSlideTime = guardSlideTime,
		guardCtrlTime = guardCtrlTime, airGuardCtrlTime = time('airguard.ctrltime', guardCtrlTime),
		airGuardHitTime = time('airguard.hittime', guardTime), airGuardSlideTime = time('airguard.slidetime', guardSlideTime),
		fall = boolean('fall', false), fallRecover = boolean('fall.recover', true),
		fallRecoverTime = time('fall.recovertime', 4),
		fallVelocity = {x = scalar('fall.xvelocity', 0), y = scalar('fall.yvelocity', -4.5)}, yaccel = yaccel,
		airFall = boolean('air.fall', boolean('fall', false)), airJuggle = time('air.juggle', 0),
		downVelocity = pair('down.velocity', airVelocity.x, airVelocity.y), downHitTime = time('down.hittime', time('air.hittime', 20)),
		downBounce = boolean('down.bounce', false),
		p1StateNo = if program.expressions.p1stateno then integer(scalar('p1stateno', -1), 'p1stateno', -1) else nil,
		getPower = power('getpower'), givePower = power('givepower'),
		groundVelocity = groundVelocity, guardVelocity = guardVelocity,
		priority = priority, priorityType = program.priorityType, hitFlag = program.hitFlag, guardFlag = program.guardFlag,
		attr = program.attr, groundType = program.groundType, animType = program.animType,
		presentation = {
			supported = false, spark = spark('sparkno'), guardSpark = spark('guard.sparkno'), sparkOffset = sparkOffset,
			hitSound = sound('hitsound'), guardSound = sound('guardsound'),
			palette = if next(palette) then palette else nil, fallAnimType = program.fallAnimType,
		},
		air = {
			supported = true, reason = 'Standard airborne/falling reactions are resolved by the host',
			hitFlag = string.gsub(program.hitFlag, '[^AF]', ''), guardFlag = string.gsub(program.guardFlag, '[^A]', ''),
			hitType = program.airType, animType = program.airAnimType, hitTime = time('air.hittime', 20),
			velocity = airVelocity, guardVelocity = airGuardVelocity,
		},
	}
end

return HitDef
