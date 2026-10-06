--!strict
local Movement = require("../../runtime/Movement")
local configs = require("../../generated/luau/movement") :: { [string]: Movement.Config }

local function same(a: Movement.Snapshot, b: Movement.Snapshot)
    assert(a.tick == b.tick and a.state == b.state and a.stateTicks == b.stateTicks)
    assert(a.x == b.x and a.y == b.y and a.vx == b.vx and a.vy == b.vy)
    assert(a.facing == b.facing and a.animation == b.animation)
    assert(a.jumpHeld == b.jumpHeld and a.jumpDirection == b.jumpDirection)
end

local count = 0
for id, config in pairs(configs) do
    local initial = Movement.new(config)
    local forward = Movement.step(config, initial, { right = true })
    assert(forward.x == config.walkForward and forward.animation == config.animations.walkForward, id)
    local backward = Movement.step(config, initial, { left = true })
    assert(backward.x == config.walkBackward and backward.animation == config.animations.walkBackward, id)
    local facingLeft = Movement.step(config, Movement.new(config, 0, -1), { left = true })
    assert(facingLeft.x == -config.walkForward, id)

    local crouched = Movement.step(config, initial, { down = true })
    assert(crouched.state == "crouchDown" and crouched.animation == config.animations.crouchDown, id)
    assert(config.crouchDownTicks < 10000 and config.crouchUpTicks < 10000, "Smoke-test timing budget exceeded: " .. id)
    for _ = 1, config.crouchDownTicks do
        crouched = Movement.step(config, crouched, { down = true })
    end
    assert(crouched.state == "crouch" and crouched.y == 0, id)
    for _ = 1, config.crouchUpTicks + 1 do
        crouched = Movement.step(config, crouched, {})
    end
    assert(crouched.state == "idle", id)

    local jumping = Movement.step(config, initial, { jump = true })
    local seenAir, seenLand, minimumY = false, false, 0
    local budget = math.ceil(-2 * config.jumpNeutral.y / config.gravity) + config.jumpStartTicks + config.landTicks + 5
    assert(budget < 10000, "Smoke-test flight budget exceeded: " .. id)
    for _ = 1, budget do
        jumping = Movement.step(config, jumping, { jump = true })
        if jumping.state == "air" then seenAir = true end
        if jumping.state == "land" then seenLand = true end
        minimumY = math.min(minimumY, jumping.y)
    end
    assert(seenAir and seenLand and minimumY < 0, id)
    assert(jumping.state == "idle" and jumping.y == 0 and jumping.vy == 0, id)

    local first, replay = Movement.new(config), Movement.new(config)
    for tick = 1, 600 do
        local input: Movement.Input = {
            right = tick % 80 < 25, left = tick % 80 >= 50,
            jump = tick % 90 == 1, down = tick % 130 > 115,
        }
        local world: Movement.World = { minX = -100, maxX = 100, opponentX = if tick < 300 then 50 else -50 }
        first = Movement.step(config, first, input, world)
        replay = Movement.step(config, replay, input, world)
        same(first, replay)
        assert(first.x >= -100 and first.x <= 100 and first.y <= 0, id)
    end
    count += 1
    print("Exported movement passed: " .. id)
end
assert(count > 0, "No character movement configurations exported")
print("Exported movement: " .. count .. " character integrations passed")
