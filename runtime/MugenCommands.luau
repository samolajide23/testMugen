--!strict
local Commands = {}
export type Input = {[string]: boolean}
export type Definition = { name: string, command: string, time: number, bufferTime: number, remap: {[string]: string}? }
export type Part = { key: string, mode: string, wildcard: boolean, charge: number }
export type Command = { name: string, parts: {Part}, steps: {{Part}}, time: number, bufferTime: number, remap: {[string]: string} }
export type Program = {Command}
export type History = { clock: number, progress: {{number}}, charges: {{{number}}} }
export type Snapshot = { tick: number, held: Input, remaining: {number}, active: {[string]: boolean}, paused: boolean, history: History? }
local KEYS = { left=true, right=true, up=true, down=true, a=true, b=true, c=true, x=true, y=true, z=true, s=true }
local BUTTONS = { a=true, b=true, c=true, x=true, y=true, z=true, s=true }
local DIRECTIONS = { U=true, D=true, F=true, B=true, UF=true, UB=true, DF=true, DB=true }
local function positive(n: number): boolean return n > 0 and n < math.huge and n % 1 == 0 end
function Commands.compile(definitions: {Definition}): Program
	local result: Program = {}
	for _, def in definitions do
		assert(def.name ~= '' and positive(def.time) and positive(def.bufferTime), 'Invalid command name/timing')
		assert(#def.command <= 512 and def.time <= 600 and def.bufferTime <= 30, 'Command exceeds supported bounds')
		local steps: {{Part}} = {}
		for _, rawStep in string.split(def.command, ',') do
			local parts: {Part} = {}
			for _, raw in string.split(rawStep, '+') do
				local token = string.match(raw, '^%s*(.-)%s*$') :: string
				local mode, charge = 'press', 0
				if string.sub(token, 1, 1) == '/' then mode = 'hold'; token = string.sub(token, 2)
				elseif string.sub(token, 1, 1) == '~' then
					mode = 'release'; token = string.sub(token, 2)
					local digits = string.match(token, '^%d+')
					if digits then charge = tonumber(digits) :: number; token = string.sub(token, #digits + 1)
						assert(positive(charge) and charge <= 600, 'Unsupported charge duration') end
				end
				local wildcard = string.sub(token, 1, 1) == '$'
				if wildcard then token = string.sub(token, 2) end
				assert(BUTTONS[token] or DIRECTIONS[token], 'Unsupported command step: ' .. raw)
				assert(not wildcard or DIRECTIONS[token], 'Wildcard requires a direction')
				for _, part in parts do assert(part.key ~= token, 'Duplicate chord key') end
				table.insert(parts, { key=token, mode=mode, wildcard=wildcard, charge=charge })
			end
			assert(#parts <= 8, 'Command chord exceeds supported bounds')
			table.insert(steps, parts)
		end
		assert(#steps <= 32, 'Command sequence exceeds supported bounds')
		if #steps > 1 then
			local hasEdge = false
			for _, part in steps[#steps] do hasEdge = hasEdge or part.mode ~= 'hold' end
			assert(hasEdge, 'Motion must end with a press or release')
		end
		local remap: {[string]: string} = {}
		for from, to in def.remap or {} do
			assert(BUTTONS[from] and BUTTONS[to], 'Unsupported button remap')
			remap[from] = to
		end
		table.insert(result, { name=def.name, parts=steps[1], steps=steps, time=def.time, bufferTime=def.bufferTime, remap=remap })
	end
	return result
end
function Commands.new(): Snapshot return { tick=0, held={}, remaining={}, active={}, paused=false } end
local function held(input: Input, part: Part, remap: {[string]: string}, facing: number): boolean
	if BUTTONS[part.key] then return input[remap[part.key] or part.key] == true end
	local x = (if input.right then 1 else 0) - (if input.left then 1 else 0)
	local y = (if input.down then 1 else 0) - (if input.up then 1 else 0)
	local direction = (if y < 0 then 'U' elseif y > 0 then 'D' else '') .. (if x * facing > 0 then 'F' elseif x * facing < 0 then 'B' else '')
	return if part.wildcard then string.find(direction, part.key, 1, true) ~= nil else direction == part.key
end
function Commands.step(program: Program, previous: Snapshot, input: Input, facing: number, paused: boolean?): Snapshot
	assert(facing == 1 or facing == -1, 'Facing must be -1 or 1')
	for key, value in input do assert(KEYS[key] and type(value) == 'boolean', 'Invalid input field: ' .. key) end
	local old = previous.history
	local history: History = { clock=(if old then old.clock else 0) + (if paused then 0 else 1), progress={}, charges={} }
	local next: Snapshot = { tick=previous.tick + 1, held=table.clone(input), remaining={}, active={}, paused=paused == true, history=history }
	for index, command in program do
		local stepMatches: {boolean}, holdOnly: {boolean}, buttonsOnly: {boolean}, releasesOnly: {boolean} = {}, {}, {}, {}
		local charges: {{number}} = {}
		for stepIndex, parts in command.steps do
			local matches, edge, allHold, allButtons, allRelease = true, false, true, true, true
			local durations: {number} = {}
			for partIndex, part in parts do
				local now, before = held(input, part, command.remap, facing), held(previous.held, part, command.remap, facing)
				local duration = if old and old.charges[index] and old.charges[index][stepIndex] then old.charges[index][stepIndex][partIndex] or 0 else 0
				durations[partIndex] = if now then math.min(600, (if before then duration else 0) + (if paused then 0 else 1)) else 0
				if part.mode == 'release' then
					matches = matches and before and not now and duration >= part.charge
					edge = edge or (before and not now); allHold = false
				elseif part.mode == 'press' then matches = matches and now; edge = edge or (now and not before); allHold = false
				else matches = matches and now end
				allButtons = allButtons and BUTTONS[part.key] == true
				allRelease = allRelease and part.mode == 'release'
			end
			charges[stepIndex] = durations
			stepMatches[stepIndex] = matches and (allHold or edge)
			holdOnly[stepIndex], buttonsOnly[stepIndex], releasesOnly[stepIndex] = allHold, allButtons, allRelease
		end
		history.charges[index] = charges
		-- Keep only the newest start for each prefix: unrelated input is allowed,
		-- but a later step cannot repair a missing earlier edge. Time includes
		-- the starting tick; charge accumulation is outside that motion window.
		local progress: {number} = {}
		local prior = if old then old.progress[index] or {} else {}
		local matches = false
		-- A release into a diagonal, a direction plus its final button, and hold
		-- predicates may share a tick. Two successive presses of a key may not.
		for stepIndex, parts in command.steps do
			local start = prior[stepIndex] or -1
			if start >= 0 and history.clock - start >= command.time then start = -1 end
			local source = if stepIndex == 1 then history.clock else prior[stepIndex - 1] or -1
			if stepIndex > 1 and (holdOnly[stepIndex - 1] or holdOnly[stepIndex] or
				(releasesOnly[stepIndex - 1] and not releasesOnly[stepIndex]) or
				(buttonsOnly[stepIndex] and not buttonsOnly[stepIndex - 1])) then
				source = math.max(source, progress[stepIndex - 1] or -1)
			end
			local holdsSatisfied = true
			for earlier = 1, stepIndex - 1 do
				for _, part in command.steps[earlier] do
					if part.mode == 'hold' then holdsSatisfied = holdsSatisfied and held(input, part, command.remap, facing) end
				end
			end
			if not holdsSatisfied then start = -1 end
			if stepMatches[stepIndex] and holdsSatisfied and source >= 0 and history.clock - source < command.time then
				start = math.max(start, source)
				if stepIndex == #command.steps then matches = true end
			end
			progress[stepIndex] = start
		end
		history.progress[index] = progress
		-- Preserve buffered edges through hitpause and expose them on the first resumed tick.
		local decay = if paused or previous.paused then 0 else 1
		local remaining = if matches then command.bufferTime else math.max(0, (previous.remaining[index] or 0) - decay)
		next.remaining[index] = remaining
		if remaining > 0 then next.active[command.name] = true end
	end
	return next
end
return Commands
