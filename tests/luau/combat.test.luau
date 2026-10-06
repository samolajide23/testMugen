--!strict
local Combat = require("../../runtime/Combat")
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
local function rejects(callback: () -> ())
    assert(not pcall(callback), "expected rejection")
end
local function movement(): Movement.Config
    return {
        walkForward = 4, walkBackward = -2,
        jumpNeutral = { x = 0, y = -8 }, jumpForward = { x = 5, y = -8 }, jumpBackward = { x = -3, y = -8 },
        gravity = 1, crouchDownTicks = 1, crouchUpTicks = 1, jumpStartTicks = 2, landTicks = 1,
        animations = { idle = 0, walkForward = 20, walkBackward = 21, crouchDown = 10, crouch = 11,
            crouchUp = 12, jumpStart = 40, jumpNeutral = 41, jumpForward = 42, jumpBackward = 43, land = 47 },
    }
end
local function fighter(): Combat.FighterConfig
    return {
        maxHealth = 100, hitAnimation = 5000, defeatAnimation = 5150,
        attack = { startupTicks = 2, activeTicks = 3, recoveryTicks = 2, damage = 25, hitstunTicks = 4,
            animation = 200, hitbox = { left = 0, right = 35, top = -18, bottom = -2 } },
    }
end
local function config(): Combat.Config
    return {
        arena = { minX = -100, maxX = 100,
            first = { movement = movement(), body = { halfWidth = 10, height = 20 }, startX = -15 },
            second = { movement = movement(), body = { halfWidth = 10, height = 20 }, startX = 15 } },
        first = fighter(), second = fighter(),
    }
end
local function idle(): Combat.Input return { first = {}, second = {} } end
local function strike(): Combat.Input return { first = { attack = true }, second = {} } end
local function stepToActive(c: Combat.Config): Combat.Snapshot
    local s = Combat.step(c, Combat.new(c), strike())
    for _ = 1, c.first.attack.startupTicks do s = Combat.step(c, s, strike()) end
    assert(s.first.state == "active")
    return s
end
local passed = 0
local function test(name: string, callback: () -> ())
    callback(); passed += 1
    print("Combat passed: " .. name)
end

test("initial health, ticks and empty event stream", function()
    local c = config()
    c.second.maxHealth = 250
    local s = Combat.new(c)
    assert(s.tick == 0 and s.arena.tick == 0 and s.first.state == "ready")
    assert(s.first.health == 100 and s.second.health == 250 and #s.events == 0)
    assert(s.first.animation == 0 and not s.first.attackHeld)
end)

test("exact startup active recovery durations and no premature hit", function()
    local c = config()
    c.arena.second.startX = 80
    local s = Combat.new(c)
    local expected = { "startup", "startup", "active", "active", "active", "recovery", "recovery", "ready" }
    local ticks = { 1, 2, 1, 2, 3, 1, 2, 1 }
    for i, state in ipairs(expected) do
        s = Combat.step(c, s, strike())
        assert(s.first.state == state and s.first.stateTicks == ticks[i], "incorrect phase at tick " .. i)
        assert(#s.events == 0 and s.second.health == 100)
    end
    assert(s.first.animation == 0)
end)

test("one hit per activation and hit animation selection", function()
    local c = config()
    local s = Combat.new(c)
    local hits = 0
    for tick = 1, 20 do
        s = Combat.step(c, s, strike())
        hits += #s.events
        if tick < 3 then assert(s.second.health == 100) end
        if tick == 3 then
            assert(s.first.hitConnected and s.first.animation == 200)
            assert(s.second.state == "hitstun" and s.second.animation == 5000)
            equal(s.events[1], { type = "hit", attacker = "first", defender = "second", damage = 25, remainingHealth = 75 })
        end
    end
    assert(hits == 1 and s.second.health == 75 and s.first.state == "ready")
    s = Combat.step(c, s, idle())
    s = Combat.step(c, s, strike())
    assert(s.first.state == "startup" and not s.first.hitConnected)
    for _ = 1, 2 do s = Combat.step(c, s, strike()) end
    assert(s.second.health == 50 and #s.events == 1)
end)

test("facing-relative hitbox mirrors in either slot order", function()
    local c = config()
    c.arena.first.startX, c.arena.second.startX = 15, -15
    local s = stepToActive(c)
    assert(s.first.attackFacing == -1 and s.second.health == 75)
    c = config()
    s = Combat.new(c)
    for _ = 1, 3 do s = Combat.step(c, s, { first = {}, second = { attack = true } }) end
    assert(s.second.attackFacing == -1 and s.first.health == 75)
    assert(s.events[1].attacker == "second")
end)

test("range, vertical clearance and edge-only contact miss", function()
    local c = config()
    c.first.attack.hitbox.right = 20
    assert(stepToActive(c).second.health == 100)
    c.first.attack.hitbox.right = 20.01
    assert(stepToActive(c).second.health == 75)
    c.first.attack.hitbox.top, c.first.attack.hitbox.bottom = -30, -20
    assert(stepToActive(c).second.health == 100)
    c.first.attack.hitbox.bottom = -19.99
    assert(stepToActive(c).second.health == 75)
end)

test("whiff can connect later in active window", function()
    local c = config()
    c.arena.second.startX = 35
    local s = stepToActive(c)
    assert(s.second.health == 100 and not s.first.hitConnected)
    s = Combat.step(c, s, { first = {}, second = { left = true } })
    assert(s.second.health == 100)
    s = Combat.step(c, s, { first = {}, second = { left = true } })
    assert(s.second.health == 75 and s.first.hitConnected)
end)

test("hitstun uses incoming attack duration and unlocks on next tick", function()
    local c = config()
    c.second.attack.hitstunTicks = 99
    local s = stepToActive(c)
    assert(s.second.stateTicks == 1 and s.second.hitstunTicks == 4)
    local x = s.arena.second.x
    for i = 2, 4 do
        s = Combat.step(c, s, { first = {}, second = { right = true, attack = true } })
        assert(s.second.state == "hitstun" and s.second.stateTicks == i)
        assert(s.arena.second.x == x)
    end
    s = Combat.step(c, s, { first = {}, second = { right = true, attack = true } })
    assert(s.second.state == "ready" and s.second.hitstunTicks == 0 and s.arena.second.x > x)
end)

test("simultaneous hits trade without first-slot priority", function()
    local c = config()
    c.second.attack.damage, c.second.attack.hitstunTicks = 40, 7
    local s = Combat.new(c)
    for _ = 1, 3 do s = Combat.step(c, s, { first = { attack = true }, second = { attack = true } }) end
    assert(#s.events == 2 and s.first.health == 60 and s.second.health == 75)
    assert(s.first.state == "hitstun" and s.second.state == "hitstun")
    assert(s.first.hitstunTicks == 7 and s.second.hitstunTicks == 4)
    assert(s.first.hitConnected and s.second.hitConnected)
end)

test("hit interrupts startup, preventing its later attack", function()
    local c = config()
    c.second.attack.startupTicks = 6
    local s = Combat.new(c)
    for _ = 1, 20 do s = Combat.step(c, s, { first = { attack = true }, second = { attack = true } }) end
    assert(s.first.health == 100 and s.second.health == 75)
    assert(s.second.state == "ready")
end)

test("hit cancels grounded jump startup", function()
    local c = config()
    c.arena.second.movement.jumpStartTicks = 8
    local s = Combat.new(c)
    s = Combat.step(c, s, { first = { attack = true }, second = { jump = true } })
    assert(s.arena.second.state == "jumpStart")
    for _ = 1, 12 do s = Combat.step(c, s, { first = { attack = true }, second = { jump = true } }) end
    assert(s.second.health == 75 and s.arena.second.y == 0 and s.arena.second.state == "idle")
end)

test("attack suppresses movement and consumes held jump without buffering", function()
    local c = config()
    c.arena.second.startX = 80
    local s = Combat.new(c)
    local input: Combat.Input = { first = { attack = true, jump = true, right = true, down = true }, second = {} }
    for _ = 1, 7 do
        s = Combat.step(c, s, input)
        assert(s.arena.first.x == -15 and s.arena.first.y == 0)
        assert(s.arena.first.jumpHeld)
    end
    s = Combat.step(c, s, { first = { jump = true }, second = {} })
    assert(s.first.state == "ready" and s.arena.first.state == "idle")
    s = Combat.step(c, s, idle())
    s = Combat.step(c, s, { first = { jump = true }, second = {} })
    assert(s.arena.first.state == "jumpStart")
end)

test("press during recovery is consumed rather than queued", function()
    local c = config()
    c.arena.second.startX = 80
    c.first.attack.startupTicks, c.first.attack.activeTicks, c.first.attack.recoveryTicks = 1, 1, 1
    local s = Combat.step(c, Combat.new(c), strike())
    s = Combat.step(c, s, idle())
    s = Combat.step(c, s, strike())
    assert(s.first.state == "recovery")
    s = Combat.step(c, s, strike())
    assert(s.first.state == "ready")
    s = Combat.step(c, s, idle())
    s = Combat.step(c, s, strike())
    assert(s.first.state == "startup")
end)

test("crouched and airborne fighters cannot start the grounded attack", function()
    local c = config()
    local s = Combat.step(c, Combat.new(c), { first = { down = true }, second = {} })
    s = Combat.step(c, s, { first = { down = true, attack = true }, second = {} })
    assert(s.first.state == "ready" and s.arena.first.state == "crouch")
    s = Combat.step(c, Combat.new(c), { first = { jump = true }, second = {} })
    for _ = 1, 4 do s = Combat.step(c, s, strike()) end
    assert(s.first.state == "ready" and s.arena.first.state == "air")
end)

test("airborne hitstun retains gravity and does not teleport to ground", function()
    local c = config()
    c.first.attack.hitbox.top = -100
    local s = Combat.new(c)
    s.arena.second.state, s.arena.second.y, s.arena.second.vy = "air", -30, 0
    for _ = 1, 3 do s = Combat.step(c, s, strike()) end
    assert(s.second.state == "hitstun" and s.arena.second.y < 0)
    local y = s.arena.second.y
    s = Combat.step(c, s, { first = {}, second = { jump = true, right = true, attack = true } })
    assert(s.arena.second.y > y and s.arena.second.y < 0 and s.arena.second.state == "air")
end)

test("attack facing locks through a vertically clear cross-over", function()
    local c = config()
    c.first.attack.startupTicks = 6
    local s = Combat.step(c, Combat.new(c), strike())
    s.arena.second.state, s.arena.second.y, s.arena.second.vx, s.arena.second.vy = "air", -50, -40, 0
    for _ = 1, 3 do s = Combat.step(c, s, idle()) end
    assert(s.arena.second.x < s.arena.first.x)
    assert(s.first.state == "startup" and s.first.attackFacing == 1 and s.arena.first.facing == 1)
    for _ = 1, 10 do s = Combat.step(c, s, idle()) end
    assert(s.first.state == "ready" and s.arena.first.facing == -1)
end)

test("health clamps to zero and defeated fighter cannot act or be hit again", function()
    local c = config()
    c.first.attack.damage = 250
    local s = stepToActive(c)
    assert(s.second.health == 0 and s.second.state == "defeated" and s.second.animation == 5150)
    assert(s.events[1].damage == 100 and s.second.hitstunTicks == 0)
    for _ = 1, 25 do
        s = Combat.step(c, s, { first = {}, second = { attack = true, jump = true, right = true } })
        assert(s.second.health == 0 and s.arena.second.y == 0 and s.arena.second.x == 15 and #s.events == 0)
    end
    s = Combat.step(c, s, strike())
    for _ = 1, 4 do s = Combat.step(c, s, strike()) end
    assert(#s.events == 0 and not s.first.hitConnected and s.first.health == 100)
end)

test("simultaneous lethal attacks can defeat both fighters", function()
    local c = config()
    c.first.attack.damage, c.second.attack.damage = 100, 100
    local s = Combat.new(c)
    for _ = 1, 3 do s = Combat.step(c, s, { first = { attack = true }, second = { attack = true } }) end
    assert(#s.events == 2 and s.first.state == "defeated" and s.second.state == "defeated")
end)

test("missing combat animation IDs stay nil", function()
    local c = config()
    c.first.attack.animation, c.second.hitAnimation = nil, nil
    local s = stepToActive(c)
    assert(s.first.animation == nil and s.second.animation == nil)
    c.first.attack.damage, c.second.defeatAnimation = 100, nil
    s = stepToActive(c)
    assert(s.second.state == "defeated" and s.second.animation == nil)
end)

test("frozen arguments stay immutable, events and matches are independent", function()
    local c, input = config(), strike()
    local s = Combat.new(c)
    local original = copy({ config = c, input = input, snapshot = s })
    freeze(c); freeze(input); freeze(s)
    local nextSnapshot = Combat.step(c, s, input)
    assert(nextSnapshot ~= s and nextSnapshot.first ~= s.first and nextSnapshot.arena.first ~= s.arena.first)
    equal({ config = c, input = input, snapshot = s }, original)
    equal(Combat.new(c), s)
    s = stepToActive(c)
    local events = copy(s.events)
    local nextTick = Combat.step(c, s, idle())
    equal(s.events, events)
    assert(nextTick.events ~= s.events and #nextTick.events == 0)
end)

test("invalid config, health, input and clocks reject", function()
    for _, edit in {
        function(c: Combat.Config) c.first.maxHealth = 0 end,
        function(c: Combat.Config) c.first.attack.startupTicks = 0 end,
        function(c: Combat.Config) c.second.attack.activeTicks = 0.5 end,
        function(c: Combat.Config) c.second.attack.recoveryTicks = math.huge end,
        function(c: Combat.Config) c.first.attack.damage = -1 end,
        function(c: Combat.Config) c.first.attack.hitstunTicks = 0 end,
        function(c: Combat.Config) c.first.attack.hitbox.right = 0 end,
        function(c: Combat.Config) c.first.attack.hitbox.top = math.huge end,
    } do
        local c = config(); edit(c)
        rejects(function() Combat.new(c) end)
    end
    local c, s = config(), Combat.new(config())
    s.first.health = -1
    rejects(function() Combat.step(c, s, idle()) end)
    s = Combat.new(c); s.tick = 1
    rejects(function() Combat.step(c, s, idle()) end)
    s = Combat.step(c, Combat.new(c), strike())
    local bad: any = { first = { left = "invalid" }, second = {} }
    rejects(function() Combat.step(c, s, bad) end)
end)

test("deterministic combat replay with every exported movement config", function()
    local count = 0
    for id, source in pairs(imported) do
        local c = config()
        c.arena.first.movement = source
        c.first.maxHealth, c.second.maxHealth = 1000, 1000
        local a, b = Combat.new(c), Combat.new(c)
        for tick = 1, 600 do
            local input: Combat.Input = {
                first = { attack = tick % 19 == 1, right = tick % 90 < 50, left = tick % 90 >= 50, jump = tick % 113 == 1 },
                second = { attack = tick % 23 == 1, left = tick % 80 < 40, right = tick % 80 >= 40, down = tick % 79 > 70 },
            }
            a = Combat.step(c, a, input); b = Combat.step(c, b, input)
            equal(a, b)
            assert(a.tick == a.arena.tick and a.tick == a.arena.first.tick and a.tick == a.arena.second.tick)
            assert(a.first.health >= 0 and a.second.health >= 0)
        end
        count += 1
        print("Combat imported config: " .. id)
    end
    assert(count > 0)
end)

print("Combat: " .. passed .. " tests passed")
