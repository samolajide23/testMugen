--!strict
local Arena = require("../../runtime/Arena")
local Movement = require("../../runtime/Movement")
local imported = require("../../generated/luau/movement") :: { [string]: Movement.Config }

local function copy(value: any): any
    if type(value) ~= "table" then return value end
    local result = {}
    for key, entry in pairs(value) do result[key] = copy(entry) end
    return result
end
local function freeze(value: any)
    if type(value) ~= "table" then return end
    for _, entry in pairs(value) do freeze(entry) end
    table.freeze(value)
end
local function equal(a: any, b: any)
    assert(type(a) == type(b), "type mismatch")
    if type(a) ~= "table" then assert(a == b, "value mismatch"); return end
    for key, value in pairs(a) do equal(value, b[key]) end
    for key in pairs(b) do assert(a[key] ~= nil, "extra field") end
end
local function near(a: number, b: number)
    assert(math.abs(a - b) < 1e-8, string.format("expected %g, got %g", b, a))
end
local function rejects(callback: () -> ())
    local ok = pcall(callback)
    assert(not ok, "expected rejection")
end
local function movementConfig(): Movement.Config
    return {
        walkForward = 4, walkBackward = -2,
        jumpNeutral = { x = 0, y = -8 }, jumpForward = { x = 5, y = -8 }, jumpBackward = { x = -3, y = -8 },
        gravity = 1, crouchDownTicks = 2, crouchUpTicks = 2, jumpStartTicks = 1, landTicks = 2,
        animations = { idle = 0, walkForward = 20, walkBackward = 21, crouchDown = 10, crouch = 11,
            crouchUp = 12, jumpStart = 40, jumpNeutral = 41, jumpForward = 42, jumpBackward = 43, land = 47 },
    }
end
local function config(): Arena.Config
    return {
        minX = -100, maxX = 100,
        first = { movement = movementConfig(), body = { halfWidth = 10, height = 20 }, startX = -30 },
        second = { movement = movementConfig(), body = { halfWidth = 10, height = 20 }, startX = 30 },
    }
end
local function idle(): Arena.Input return { first = {}, second = {} } end
local function validBodies(c: Arena.Config, s: Arena.Snapshot)
    assert(s.first.x >= c.minX + c.first.body.halfWidth and s.first.x <= c.maxX - c.first.body.halfWidth)
    assert(s.second.x >= c.minX + c.second.body.halfWidth and s.second.x <= c.maxX - c.second.body.halfWidth)
    if s.first.y > s.second.y - c.second.body.height and s.second.y > s.first.y - c.first.body.height then
        assert(math.abs(s.first.x - s.second.x) + 1e-8 >= c.first.body.halfWidth + c.second.body.halfWidth, "body overlap")
    end
    assert(s.tick == s.first.tick and s.tick == s.second.tick)
end

local passed = 0
local function test(name: string, callback: () -> ())
    callback()
    passed += 1
    print("Arena passed: " .. name)
end

test("initial positions and facing in either slot order", function()
    local c = config()
    local s = Arena.new(c)
    assert(s.tick == 0 and s.first.facing == 1 and s.second.facing == -1)
    assert(s.first.x == -30 and s.second.x == 30)
    c.first.startX, c.second.startX = 30, -30
    s = Arena.new(c)
    assert(s.first.facing == -1 and s.second.facing == 1)
    s = Arena.step(c, s, { first = { left = true }, second = { right = true } })
    assert(s.first.x == 26 and s.second.x == -26)
end)

test("simultaneous movement retains distinct source speeds and animations", function()
    local c = config()
    c.second.movement.walkForward = 6
    local s = Arena.step(c, Arena.new(c), { first = { right = true }, second = { left = true } })
    assert(s.first.x == -26 and s.second.x == 24)
    assert(s.first.animation == 20 and s.second.animation == 20)
    s = Arena.step(c, s, { first = { left = true }, second = { right = true } })
    assert(s.first.x == -28 and s.second.x == 26)
    assert(s.first.animation == 21 and s.second.animation == 21)
end)

test("symmetric contact blocks crossing without slot priority", function()
    local c = config()
    local s = Arena.new(c)
    for _ = 1, 100 do
        s = Arena.step(c, s, { first = { right = true }, second = { left = true } })
        validBodies(c, s)
    end
    near(s.first.x, -10); near(s.second.x, 10)
    assert(s.first.vx == 4 and s.second.vx == -4)
end)

test("one fighter pushes stationary body by sharing overlap", function()
    local c = config()
    c.first.startX, c.second.startX = -10, 10
    local s = Arena.step(c, Arena.new(c), { first = { right = true }, second = {} })
    near(s.first.x, -8); near(s.second.x, 12)
    assert(s.second.state == "idle" and s.second.vx == 0)
    s = Arena.step(c, s, { first = { left = true }, second = {} })
    near(s.first.x, -10); near(s.second.x, 12)
end)

test("wall transfers correction and full body remains on stage", function()
    local c = config()
    c.first.startX, c.second.startX = 70, 90
    local s = Arena.new(c)
    for _ = 1, 30 do s = Arena.step(c, s, { first = { right = true }, second = {} }); validBodies(c, s) end
    near(s.first.x, 70); near(s.second.x, 90)
    c.first.startX, c.second.startX = -90, -70
    s = Arena.step(c, Arena.new(c), { first = {}, second = { left = true } })
    near(s.first.x, -90); near(s.second.x, -70)
end)

test("unequal widths, fractional geometry and exact-fit stage", function()
    local c = config()
    c.minX, c.maxX = 0, 60
    c.first.body.halfWidth, c.second.body.halfWidth = 20, 10
    c.first.startX, c.second.startX = 20, 50
    local s = Arena.new(c)
    for _ = 1, 10 do s = Arena.step(c, s, { first = { right = true }, second = { left = true } }); validBodies(c, s) end
    near(s.first.x, 20); near(s.second.x, 50)
    c = config()
    c.first.body.halfWidth, c.second.body.halfWidth = 10.1, 7.3
    c.first.movement.walkForward = 13.7
    s = Arena.new(c)
    for _ = 1, 40 do s = Arena.step(c, s, { first = { right = true }, second = {} }); validBodies(c, s) end
end)

test("swept horizontal contact prevents fast ground tunneling", function()
    local c = config()
    c.first.movement.walkForward, c.second.movement.walkForward = 1000, 1000
    local s = Arena.step(c, Arena.new(c), { first = { right = true }, second = { left = true } })
    near(s.first.x, -10); near(s.second.x, 10)
    validBodies(c, s)
end)

test("clear jumps pass over and grounded fighters turn next tick", function()
    local c = config()
    c.first.startX, c.second.startX = -25, 0
    c.first.movement.jumpForward = { x = 10, y = -30 }
    c.first.movement.gravity = 3
    local s = Arena.step(c, Arena.new(c), { first = { jump = true, right = true }, second = {} })
    local crossed = false
    for _ = 1, 40 do
        s = Arena.step(c, s, idle())
        validBodies(c, s)
        if s.first.x > s.second.x and s.first.state == "air" then
            crossed = true
            assert(s.first.facing == 1, "airborne facing must remain locked")
        end
    end
    assert(crossed)
    assert(s.first.state == "idle" and s.first.y == 0)
    assert(s.first.facing == -1 and s.second.facing == 1)
end)

test("low aerial motion cannot tunnel through a tall body", function()
    local c = config()
    c.first.body.height, c.second.body.height = 100, 100
    c.first.movement.jumpForward = { x = 1000, y = -8 }
    local s = Arena.step(c, Arena.new(c), { first = { jump = true, right = true }, second = {} })
    s = Arena.step(c, s, idle())
    assert(s.first.state == "air" and s.first.x < s.second.x)
    validBodies(c, s)
end)

test("vertical edge contact allows clearance without standing on heads", function()
    local c = config()
    local s = Arena.new(c)
    s.first.state, s.first.y, s.first.vx, s.first.vy = "air", -20, 80, 0
    s = Arena.step(c, s, idle())
    assert(s.first.x == 50 and s.first.y == -20)
    validBodies(c, s)
end)

test("overlapping airborne centers separate deterministically on descent", function()
    local c = config()
    local s = Arena.new(c)
    s.first.x, s.first.y, s.first.vy, s.first.state = 30, -21, 5, "air"
    s = Arena.step(c, s, idle())
    near(s.first.x, 20); near(s.second.x, 40)
    assert(s.first.y == -16 and s.first.vy == 6)
    validBodies(c, s)
end)

test("crouching stays in movement states with explicit fixed body", function()
    local c = config()
    local s = Arena.new(c)
    for _ = 1, 3 do s = Arena.step(c, s, { first = { down = true }, second = {} }) end
    assert(s.first.state == "crouch" and s.second.state == "idle")
    assert(s.first.x == -30 and s.second.x == 30)
    for _ = 1, 3 do s = Arena.step(c, s, idle()) end
    assert(s.first.state == "idle")
end)

test("snapshots, input and configs stay immutable and matches independent", function()
    local c = config()
    local input: Arena.Input = { first = { right = true }, second = { down = true } }
    local s = Arena.new(c)
    local original = copy({ c = c, input = input, s = s })
    freeze(c); freeze(input); freeze(s)
    local nextSnapshot = Arena.step(c, s, input)
    assert(nextSnapshot ~= s and nextSnapshot.first ~= s.first and nextSnapshot.second ~= s.second)
    equal({ c = c, input = input, s = s }, original)
    equal(Arena.new(c), s)
end)

test("deterministic replay and body invariants across mixed inputs", function()
    local c = config()
    local a, b = Arena.new(c), Arena.new(c)
    for tick = 1, 2000 do
        local input: Arena.Input = {
            first = { right = tick % 100 < 50, left = tick % 100 >= 50, jump = tick % 73 == 1, down = tick % 53 > 48 },
            second = { left = tick % 140 < 65, right = tick % 140 >= 65, jump = tick % 61 == 1, down = tick % 91 > 84 },
        }
        a = Arena.step(c, a, input); b = Arena.step(c, b, input)
        equal(a, b); validBodies(c, a)
    end
end)

test("invalid bounds, geometry, starts, movement, snapshots and inputs reject", function()
    for _, edit in {
        function(c: Arena.Config) c.minX = math.huge end,
        function(c: Arena.Config) c.maxX = c.minX end,
        function(c: Arena.Config) c.first.body.halfWidth = 0 end,
        function(c: Arena.Config) c.second.body.height = -1 end,
        function(c: Arena.Config) c.first.startX = -101 end,
        function(c: Arena.Config) c.second.startX = c.first.startX end,
        function(c: Arena.Config) c.first.body.halfWidth = 90 end,
        function(c: Arena.Config) c.first.movement.gravity = 0 end,
    } do
        local c = config(); edit(c)
        rejects(function() Arena.new(c) end)
    end
    local c = config()
    local s = Arena.new(c)
    s.first.tick = 1
    rejects(function() Arena.step(c, s, idle()) end)
    s = Arena.new(c); s.second.x = math.huge
    rejects(function() Arena.step(c, s, idle()) end)
    s = Arena.new(c)
    local malformed: any = { first = { left = "yes" }, second = {} }
    rejects(function() Arena.step(c, s, malformed) end)
end)

test("every exported character runs in a two-fighter replay", function()
    local count = 0
    for id, movement in pairs(imported) do
        local c = config()
        c.first.movement = movement
        local a, b = Arena.new(c), Arena.new(c)
        for tick = 1, 360 do
            local input: Arena.Input = {
                first = { right = tick % 90 < 45, left = tick % 90 >= 45, jump = tick % 85 == 1 },
                second = { left = tick % 80 < 40, right = tick % 80 >= 40, down = tick % 50 > 43 },
            }
            a = Arena.step(c, a, input); b = Arena.step(c, b, input)
            equal(a, b); validBodies(c, a)
        end
        count += 1
        print("Arena imported config: " .. id)
    end
    assert(count > 0)
end)

print("Arena: " .. passed .. " tests passed")
