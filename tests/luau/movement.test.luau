--!strict
local Movement = require('../../runtime/Movement')
type Config = Movement.Config
type Snapshot = Movement.Snapshot
type Input = Movement.Input

local passed = 0
local function test(name: string, run: () -> ())
	local ok, problem = pcall(run)
	assert(ok, name .. ": " .. tostring(problem))
	passed += 1
end

local function equal(actual: any, expected: any)
	assert(actual == expected, "expected " .. tostring(expected) .. ", got " .. tostring(actual))
end

local function same(actual: any, expected: any)
	for key, value in pairs(expected) do equal(actual[key], value) end
	for key, value in pairs(actual) do equal(value, expected[key]) end
end

local function rejects(run: () -> ())
	local ok = pcall(run)
	assert(not ok, "expected validation failure")
end

-- Freeze at runtime without narrowing fixtures to Luau's read-only table types.
local function freeze(value: any)
	table.freeze(value)
end

local function config(): Config
	return {
		walkForward = 3, walkBackward = -2,
		jumpNeutral = { x = 0, y = -4 },
		jumpForward = { x = 3, y = -4 },
		jumpBackward = { x = -2, y = -4 },
		gravity = 2,
		crouchDownTicks = 2, crouchUpTicks = 2, jumpStartTicks = 2, landTicks = 2,
		animations = {
			idle = 0, walkForward = 20, walkBackward = 21,
			crouchDown = 10, crouch = 11, crouchUp = 12,
			jumpStart = 40, jumpNeutral = 41, jumpForward = 42, jumpBackward = 43, land = 47,
		},
	}
end

local function expectState(snapshot: Snapshot, state: string, ticks: number, animation: number?)
	equal(snapshot.state, state)
	equal(snapshot.stateTicks, ticks)
	equal(snapshot.animation, animation)
end

local function launch(c: Config, facing: number, input: Input): Snapshot
	local s = Movement.step(c, Movement.new(c, 0, facing), input)
	for _ = 1, c.jumpStartTicks do s = Movement.step(c, s, {}) end
	equal(s.state, "air")
	return s
end

test("initial state and independent fighters", function()
	local c = config()
	local a = Movement.new(c)
	local b = Movement.new(c, 10, -1)
	equal(Movement.TICKS_PER_SECOND, 60)
	expectState(a, "idle", 0, 0)
	equal(a.tick, 0)
	equal(a.x, 0)
	equal(a.y, 0)
	equal(a.vx, 0)
	equal(a.vy, 0)
	equal(a.facing, 1)
	equal(a.jumpHeld, false)
	equal(a.jumpDirection, 0)
	local moved = Movement.step(c, a, { right = true })
	equal(moved.x, 3)
	equal(a.x, 0)
	equal(b.x, 10)
	equal(b.facing, -1)
	assert(a ~= b and a ~= moved)
end)

test("immutability and deterministic replay", function()
	local c = config()
	freeze(c.jumpNeutral)
	freeze(c.jumpForward)
	freeze(c.jumpBackward)
	freeze(c.animations)
	freeze(c)
	local world: Movement.World = { minX = -30, maxX = 30, opponentX = 10 }
	freeze(world)
	local a = Movement.new(c)
	local b = Movement.new(c)
	for tick = 1, 100 do
		local input: Input = { right = tick % 3 == 0, left = tick % 7 == 0, down = tick % 11 == 0, jump = tick % 13 == 0 }
		freeze(input)
		local before = table.clone(a)
		freeze(a)
		local nextA = Movement.step(c, a, input, world)
		same(a, before)
		assert(nextA ~= a)
		a = nextA
		b = Movement.step(c, b, input, world)
		same(a, b)
		equal(a.tick, tick)
	end
end)

test("walk forward backward both facings and immediate release", function()
	local c = config()
	for _, facing in ipairs({ -1, 1 }) do
		for _, direction in ipairs({ -1, 1 }) do
			local s = Movement.step(c, Movement.new(c, 0, facing), { left = direction == -1, right = direction == 1 })
			local forward = facing == direction
			local velocity = (if forward then 3 else -2) * facing
			expectState(s, "walk", 1, if forward then 20 else 21)
			equal(s.vx, velocity)
			equal(s.x, velocity)
			s = Movement.step(c, s, {})
			expectState(s, "idle", 1, 0)
			equal(s.vx, 0)
			equal(s.x, velocity)
		end
	end
end)

test("ground opponent facing and equal positions", function()
	local c = config()
	local s = Movement.step(c, Movement.new(c), { right = true }, { opponentX = -5 })
	equal(s.facing, -1)
	equal(s.vx, 2)
	equal(s.animation, 21)
	s = Movement.step(c, s, {}, { opponentX = s.x })
	equal(s.facing, -1)
	s = Movement.step(c, s, { down = true }, { opponentX = 20 })
	equal(s.facing, 1)
	equal(s.x, 2)
end)

test("opposing horizontal keys are neutral including jumps", function()
	local c = config()
	local s = Movement.step(c, Movement.new(c), { left = true, right = true })
	expectState(s, "idle", 1, 0)
	equal(s.vx, 0)
	s = launch(c, -1, { left = true, right = true, jump = true })
	equal(s.jumpDirection, 0)
	equal(s.vx, 0)
	equal(s.animation, 41)
end)

test("crouch exact durations stationary and reversible", function()
	local c = config()
	local s = Movement.new(c)
	for ticks = 1, 2 do
		s = Movement.step(c, s, { down = true, right = true, jump = true })
		expectState(s, "crouchDown", ticks, 10)
		equal(s.x, 0)
		equal(s.vx, 0)
	end
	s = Movement.step(c, s, { down = true })
	expectState(s, "crouch", 1, 11)
	for ticks = 1, 2 do
		s = Movement.step(c, s, { right = true })
		expectState(s, "crouchUp", ticks, 12)
		equal(s.x, 0)
	end
	s = Movement.step(c, s, { right = true })
	expectState(s, "walk", 1, 20)
	equal(s.x, 3)
	s = Movement.step(c, s, { down = true })
	expectState(s, "crouchDown", 1, 10)
	s = Movement.step(c, s, {})
	expectState(s, "crouchUp", 1, 12)
	s = Movement.step(c, s, { down = true })
	expectState(s, "crouchDown", 1, 10)
	s = Movement.step(c, s, {})
	s = Movement.step(c, s, {})
	s = Movement.step(c, s, {})
	expectState(s, "idle", 1, 0)
end)

test("startup exact duration locks direction facing and animation", function()
	local c = config()
	local s = Movement.step(c, Movement.new(c), { jump = true, left = true }, { opponentX = -10 })
	expectState(s, "jumpStart", 1, 40)
	equal(s.facing, -1)
	equal(s.jumpDirection, 1)
	equal(s.x, 0)
	equal(s.y, 0)
	equal(s.vx, 0)
	s = Movement.step(c, s, { right = true, down = true }, { opponentX = 10 })
	expectState(s, "jumpStart", 2, 40)
	equal(s.facing, -1)
	equal(s.x, 0)
	s = Movement.step(c, s, { right = true, jump = true }, { opponentX = 10 })
	expectState(s, "air", 1, 42)
	equal(s.x, -3)
	equal(s.y, -4)
	equal(s.vy, -2)
	equal(s.facing, -1)
end)

test("neutral forward backward jumps both facings use authored vectors", function()
	local c = config()
	-- Even neutral x is authored data, not implicitly forced to zero.
	c.jumpNeutral.x = 0.5
	for _, facing in ipairs({ -1, 1 }) do
		for _, relative in ipairs({ -1, 0, 1 }) do
			local direction = relative * facing
			local s = launch(c, facing, { jump = true, left = direction == -1, right = direction == 1 })
			local x = if relative == 0 then 0.5 else if relative == 1 then 3 else -2
			equal(s.jumpDirection, relative)
			equal(s.vx, x * facing)
			equal(s.x, x * facing)
			equal(s.y, -4)
			equal(s.animation, if relative == 0 then 41 else if relative == 1 then 42 else 43)
		end
	end
end)

test("gravity descending crossing clamp and exact land lock", function()
	local c = config()
	c.jumpForward.y = -3
	local s = launch(c, 1, { jump = true, right = true })
	equal(s.y, -3)
	equal(s.vy, -1)
	s = Movement.step(c, s, {})
	equal(s.y, -4)
	equal(s.vy, 1)
	s = Movement.step(c, s, {})
	equal(s.y, -3)
	equal(s.vy, 3)
	s = Movement.step(c, s, { right = true })
	expectState(s, "land", 1, 47)
	equal(s.x, 12)
	equal(s.y, 0)
	equal(s.vx, 0)
	equal(s.vy, 0)
	s = Movement.step(c, s, { right = true }, { opponentX = -20 })
	expectState(s, "land", 2, 47)
	equal(s.x, 12)
	equal(s.facing, -1)
	s = Movement.step(c, s, { right = true })
	expectState(s, "walk", 1, 21)
	equal(s.x, 14)
	c.jumpNeutral.y = -0.5
	s = launch(c, 1, { jump = true })
	s = Movement.step(c, s, {})
	equal(s.state, "land")
	equal(s.y, 0)
	equal(s.vy, 0)
end)

test("minimum duration states keep one entry snapshot", function()
	local c = config()
	c.crouchDownTicks = 1
	c.crouchUpTicks = 1
	c.jumpStartTicks = 1
	c.landTicks = 1
	c.jumpNeutral.y = -0.5
	local s = Movement.step(c, Movement.new(c), { down = true })
	expectState(s, "crouchDown", 1, 10)
	s = Movement.step(c, s, { down = true })
	expectState(s, "crouch", 1, 11)
	s = Movement.step(c, s, {})
	expectState(s, "crouchUp", 1, 12)
	s = Movement.step(c, s, { jump = true })
	expectState(s, "jumpStart", 1, 40)
	s = Movement.step(c, s, {})
	expectState(s, "air", 1, 41)
	s = Movement.step(c, s, {})
	expectState(s, "land", 1, 47)
	s = Movement.step(c, s, {})
	expectState(s, "idle", 1, 0)
end)

test("jump edge held key down dominance and no buffered jump", function()
	local c = config()
	local s = Movement.new(c)
	for tick = 1, 30 do
		s = Movement.step(c, s, { jump = true })
		if tick > 10 then equal(s.state, "idle") end
	end
	equal(s.jumpHeld, true)
	s = Movement.step(c, s, {})
	s = Movement.step(c, s, { jump = true })
	equal(s.state, "jumpStart")
	s = Movement.step(c, Movement.new(c), { jump = true, down = true })
	equal(s.state, "crouchDown")
	for _ = 1, 10 do s = Movement.step(c, s, { jump = true }) end
	equal(s.state, "idle")
	s = Movement.step(c, s, {})
	s = Movement.step(c, s, { jump = true })
	equal(s.state, "jumpStart")
end)

test("air ignores jump edges steering down and opponent changes", function()
	local c = config()
	local s = launch(c, 1, { jump = true, right = true })
	for ticks = 2, 4 do
		s = Movement.step(c, s, { left = true, down = true, jump = ticks % 2 == 0 }, { opponentX = -100 })
		expectState(s, "air", ticks, 42)
		equal(s.facing, 1)
		equal(s.vx, 3)
		equal(s.x, ticks * 3)
		equal(s.jumpDirection, 1)
	end
	s = Movement.step(c, s, { jump = true })
	equal(s.state, "land")
	for _ = 1, 5 do s = Movement.step(c, s, { jump = true }) end
	equal(s.state, "idle")
end)

test("independent single and double bounds ground and air", function()
	local c = config()
	local s = Movement.step(c, Movement.new(c), { right = true }, { maxX = 1 })
	equal(s.x, 1)
	equal(s.vx, 3)
	s = Movement.step(c, Movement.new(c), { left = true }, { minX = -1 })
	equal(s.x, -1)
	s = Movement.step(c, Movement.new(c, 50), {}, { minX = -1, maxX = 1 })
	equal(s.x, 1)
	s = Movement.step(c, Movement.new(c, -50), {}, { minX = -1, maxX = 1 })
	equal(s.x, -1)
	s = launch(c, 1, { jump = true, right = true })
	s = Movement.step(c, s, {}, { minX = 2, maxX = 2 })
	equal(s.x, 2)
	equal(s.vx, 3)
	equal(s.y, -6)
	s = Movement.step(c, s, {}, { minX = 2 })
	equal(s.x, 5)
end)

test("missing animations never stall transitions or invent IDs", function()
	local c = config()
	c.animations = {}
	local s = Movement.new(c)
	equal(s.animation, nil)
	for tick = 1, 30 do
		s = Movement.step(c, s, { jump = tick < 15, down = tick >= 15 and tick < 22 })
		equal(s.animation, nil)
	end
	equal(s.state, "idle")
	s = Movement.step(c, s, { left = true })
	equal(s.state, "walk")
	equal(s.animation, nil)
	c.animations.idle = 99
	s = Movement.step(c, s, {})
	equal(s.animation, 99)
	s = Movement.step(c, s, { jump = true })
	equal(s.animation, nil)
end)

test("invalid configurations rejected in new and step", function()
	local invalid: { (Config) -> () } = {
		function(c) c.walkForward = -1 end,
		function(c) c.walkBackward = 1 end,
		function(c) c.walkForward = math.huge end,
		function(c) c.walkBackward = -math.huge end,
		function(c) c.gravity = 0 end,
		function(c) c.gravity = -1 end,
		function(c) c.gravity = math.huge end,
		function(c) c.gravity = math.huge - math.huge end,
		function(c) c.jumpNeutral.y = 0 end,
		function(c) c.jumpForward.y = 1 end,
		function(c) c.jumpBackward.y = -math.huge end,
		function(c) c.jumpNeutral.x = math.huge end,
		function(c) c.jumpForward.x = math.huge - math.huge end,
		function(c) c.jumpBackward.x = -math.huge end,
		function(c) c.crouchDownTicks = 0 end,
		function(c) c.crouchUpTicks = 1.5 end,
		function(c) c.jumpStartTicks = -1 end,
		function(c) c.landTicks = math.huge end,
		function(c) c.animations.idle = math.huge end,
	}
	local initial = Movement.new(config())
	for _, invalidate in ipairs(invalid) do
		local c = config()
		invalidate(c)
		rejects(function() Movement.new(c) end)
		rejects(function() Movement.step(c, initial, {}) end)
	end
	local c = config()
	c.walkForward = 0
	c.walkBackward = 0
	equal(Movement.step(c, Movement.new(c), { right = true }).x, 0)
end)

test("invalid initial positions facing and worlds rejected", function()
	local c = config()
	local s = Movement.new(c)
	for _, value in ipairs({ math.huge, -math.huge, math.huge - math.huge }) do
		rejects(function() Movement.new(c, value) end)
		rejects(function() Movement.new(c, 0, value) end)
		rejects(function() Movement.step(c, s, {}, { minX = value }) end)
		rejects(function() Movement.step(c, s, {}, { maxX = value }) end)
		rejects(function() Movement.step(c, s, {}, { opponentX = value }) end)
	end
	for _, facing in ipairs({ 0, 2, -2, 0.5 }) do
		rejects(function() Movement.new(c, 0, facing) end)
	end
	rejects(function() Movement.step(c, s, {}, { minX = 2, maxX = 1 }) end)
	equal(Movement.step(c, s, {}, {}).x, 0)
end)

print(string.format("Movement: %d tests passed", passed))
