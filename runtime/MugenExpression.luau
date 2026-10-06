--!strict
local Expression = {}
export type Value = { kind: string, number: number?, text: string? }
export type Node = { kind: string, text: string?, value: Value?, op: string?, left: Node?, right: Node?, args: {Node}? }
export type Context = { resolve: (string, {Value}) -> Value }
local function freeze(value: any): any return table.freeze(value) end
local BOTTOM: Value = freeze({ kind = 'bottom' })
local function finite(n: number): boolean return n == n and math.abs(n) < math.huge end
function Expression.integer(n: number): Value
	if not finite(n) then return BOTTOM end
	return { kind = 'int', number = (math.modf(n) + 2147483648) % 4294967296 - 2147483648 }
end
function Expression.float(n: number): Value
	return if finite(n) then { kind = 'float', number = n } else BOTTOM
end
function Expression.string(s: string): Value return { kind = 'string', text = s } end
function Expression.bottom(): Value return BOTTOM end
function Expression.truth(v: Value): boolean return v.number ~= nil and v.number ~= 0 end
function Expression.number(v: Value): number
	assert(v.number ~= nil, 'Expected numeric expression, got ' .. v.kind)
	return v.number
end
local function bool(b: boolean): Value return Expression.integer(if b then 1 else 0) end
local PRECEDENCE = { ['||']=1, ['^^']=2, ['&&']=3, ['|']=4, ['^']=5, ['&']=6,
	['=']=7, ['!=']=7, ['>']=8, ['>=']=8, ['<']=8, ['<=']=8, ['+']=9, ['-']=9, ['*']=10, ['/']=10, ['%']=10, ['**']=11 }

function Expression.compile(source: string): Node
	assert(#source <= 4096, 'Expression exceeds 4096 characters')
	local tokens: {string} = {}
	local i = 1
	while i <= #source do
		local c = string.sub(source, i, i)
		if string.match(c, '%s') then i += 1; continue end
		local rest = string.sub(source, i)
		local token: string?
		if c == '"' then
			local finish = string.find(source, '"', i + 1, true)
			assert(finish, 'Unterminated expression string')
			token = string.sub(source, i, finish)
		elseif string.match(c, '[%d.]') then
			token = string.match(rest, '^%d+%.?%d*[eE][+-]?%d+') or string.match(rest, '^%.%d+[eE][+-]?%d+')
				or string.match(rest, '^%d+%.?%d*') or string.match(rest, '^%.%d+')
		elseif string.match(c, '[%a_]') then
			token = string.lower(string.match(rest, '^[%a_][%w_.]*') :: string)
		else
			local pair = string.sub(rest, 1, 2)
			if PRECEDENCE[pair] then token = pair
			elseif string.find('+-*/%=!~<>&^|(),[]', c, 1, true) then token = c end
		end
		assert(token, 'Unsupported expression syntax near ' .. rest)
		table.insert(tokens, token)
		assert(#tokens <= 512, 'Expression token limit exceeded')
		i += #token
	end
	local cursor, depth = 1, 0
	local parse: (number) -> Node
	local function take(expected: string)
		assert(tokens[cursor] == expected, 'Expected ' .. expected .. ', got ' .. tostring(tokens[cursor]))
		cursor += 1
	end
	parse = function(minimum: number): Node
		depth += 1; assert(depth <= 64, 'Expression nesting limit exceeded')
		local token = tokens[cursor]; assert(token, 'Incomplete expression'); cursor += 1
		local node: Node
		if token == '-' or token == '+' or token == '!' or token == '~' then
			node = { kind = 'unary', op = token, right = parse(12) }
		elseif token == '(' or token == '[' then
			local first = parse(1)
			if tokens[cursor] == ',' then
				cursor += 1; local second = parse(1); local closing = tokens[cursor]
				assert(closing == ')' or closing == ']', 'Expected interval closing bracket')
				cursor += 1; node = { kind = 'range', op = token .. closing, left = first, right = second }
			else
				assert(token == '(', 'Expected interval bounds'); take(')'); node = first
			end
		elseif string.sub(token, 1, 1) == '"' then
			node = { kind = 'literal', value = Expression.string(string.sub(token, 2, -2)) }
		elseif tonumber(token) then
			local n = tonumber(token) :: number
			node = { kind = 'literal', value = if string.find(token, '[.eE]') then Expression.float(n) else Expression.integer(n) }
		elseif string.match(token, '^[%a_]') then
			if tokens[cursor] == '(' then
				cursor += 1; local args: {Node} = {}
				if tokens[cursor] ~= ')' then
					repeat
						table.insert(args, parse(1))
						if tokens[cursor] ~= ',' then break end
						cursor += 1
					until false
				end
				take(')'); node = { kind = 'call', text = token, args = args }
			else
				local name: string = token
				if (token == 'pos' or token == 'vel' or token == 'p2bodydist') and (tokens[cursor] == 'x' or tokens[cursor] == 'y') then
					name = token .. ' ' .. tokens[cursor]; cursor += 1
				end
				node = { kind = 'name', text = name }
			end
		else error('Unexpected expression token ' .. token) end
		while tokens[cursor] and (PRECEDENCE[tokens[cursor]] or 0) >= minimum do
			local op = tokens[cursor]; cursor += 1
			local binary: Node = { kind = 'binary', op = op, left = node :: Node, right = parse(PRECEDENCE[op] + 1) }
			node = binary
		end
		depth -= 1
		return node :: Node
	end
	local result = parse(1)
	assert(cursor > #tokens, 'Unsupported expression suffix: ' .. tostring(tokens[cursor]))
	return result
end

local MATH: {[string]: (number) -> number} = { abs=math.abs, floor=math.floor, ceil=math.ceil,
	sin=math.sin, cos=math.cos, tan=math.tan, asin=math.asin, acos=math.acos, atan=math.atan, exp=math.exp, ln=function(n: number): number return math.log(n) end }
function Expression.evaluate(node: Node, context: Context): Value
	local eval: (Node) -> Value
	eval = function(n: Node): Value
		if n.kind == 'literal' then return n.value :: Value end
		if n.kind == 'name' or n.kind == 'call' then
			local name = n.text :: string; local astArgs = n.args or {}
			if name == 'cond' then
				assert(#astArgs == 3, 'Cond needs three arguments')
				local condition = eval(astArgs[1]); if condition.kind == 'bottom' then return BOTTOM end
				return eval(astArgs[if Expression.truth(condition) then 2 else 3])
			end
			local args: {Value} = {}; for _, a in astArgs do table.insert(args, eval(a)) end
			if name == 'ifelse' then
				assert(#args == 3, 'IfElse needs three arguments')
				if args[1].kind == 'bottom' then return BOTTOM end
				return args[if Expression.truth(args[1]) then 2 else 3]
			elseif name == 'pi' or name == 'e' then
				assert(#args == 0, 'Constant takes no arguments')
				return Expression.float(if name == 'pi' then math.pi else math.exp(1))
			elseif MATH[name] then
				assert(#args == 1, name .. ' needs one argument')
				if args[1].number == nil then return BOTTOM end
				local result = MATH[name](args[1].number :: number)
				return if name == 'floor' or name == 'ceil' or (name == 'abs' and args[1].kind == 'int') then Expression.integer(result) else Expression.float(result)
			end
			return context.resolve(name, args)
		elseif n.kind == 'unary' then
			local value = eval(n.right :: Node); if value.number == nil then return BOTTOM end
			local number = value.number :: number
			if n.op == '!' then return bool(number == 0) end
			if n.op == '~' then return if value.kind == 'int' then Expression.integer(bit32.bnot(number)) else BOTTOM end
			if n.op == '-' then number = -number end
			return if value.kind == 'int' then Expression.integer(number) else Expression.float(number)
		elseif n.kind == 'binary' then
			local leftNode, rightNode = n.left :: Node, n.right :: Node
			local op = n.op :: string
			if leftNode.kind == 'name' and leftNode.text == 'command' and (op == '=' or op == '!=') then
				local name = eval(rightNode); assert(name.kind == 'string', 'Command requires a string name')
				local active = context.resolve('command', { name })
				return if op == '=' then active else bool(not Expression.truth(active))
			end
			if leftNode.kind == 'name' and leftNode.text == 'animelem' and op == '=' and rightNode.kind ~= 'range' then
				local time = context.resolve('animelemtime', { eval(rightNode) })
				return if time.kind == 'bottom' then BOTTOM else bool(time.number == 0)
			end
			local a = eval(leftNode)
			if rightNode.kind == 'range' then
				assert(op == '=' or op == '!=', 'Intervals require = or !=')
				local low, high = eval(rightNode.left :: Node), eval(rightNode.right :: Node)
				if a.number == nil or low.number == nil or high.number == nil then return BOTTOM end
				local included = (if string.sub(rightNode.op :: string, 1, 1) == '[' then a.number >= low.number else a.number > low.number)
					and (if string.sub(rightNode.op :: string, 2, 2) == ']' then a.number <= high.number else a.number < high.number)
				return bool(if op == '=' then included else not included)
			end
			local b = eval(rightNode)
			if a.kind == 'bottom' or b.kind == 'bottom' then return BOTTOM end
			if op == '=' or op == '!=' then
				local same = if a.number ~= nil and b.number ~= nil then a.number == b.number else a.kind == b.kind and a.text == b.text
				return bool(if op == '=' then same else not same)
			end
			if a.number == nil or b.number == nil then return BOTTOM end
			local x, y = a.number :: number, b.number :: number
			if op == '>' then return bool(x > y) elseif op == '>=' then return bool(x >= y)
			elseif op == '<' then return bool(x < y) elseif op == '<=' then return bool(x <= y)
			elseif op == '&&' then return bool(x ~= 0 and y ~= 0) elseif op == '||' then return bool(x ~= 0 or y ~= 0)
			elseif op == '^^' then return bool((x ~= 0) ~= (y ~= 0)) end
			local integer = a.kind == 'int' and b.kind == 'int'; local result: number
			if op == '+' then result = x + y elseif op == '-' then result = x - y elseif op == '*' then result = x * y
			elseif op == '/' then if y == 0 then return BOTTOM end; result = if integer then math.modf(x / y) else x / y
			elseif op == '%' then if not integer or y == 0 then return BOTTOM end; result = x - math.modf(x / y) * y
			elseif op == '**' then result = x ^ y; integer = integer and y >= 0
			elseif op == '&' or op == '|' or op == '^' then
				if not integer then return BOTTOM end
				result = if op == '&' then bit32.band(x, y) elseif op == '|' then bit32.bor(x, y) else bit32.bxor(x, y)
			else error('Unsupported expression operator ' .. op) end
			return if integer then Expression.integer(result) else Expression.float(result)
		end
		error('Unsupported expression node ' .. n.kind)
	end
	return eval(node)
end
return Expression
