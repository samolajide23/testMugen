--!strict
local Movement = require("./Movement")

export type Body = { halfWidth: number, height: number }
export type FighterConfig = { movement: Movement.Config, body: Body, startX: number }
export type Config = { minX: number, maxX: number, first: FighterConfig, second: FighterConfig }
export type Snapshot = { tick: number, first: Movement.Snapshot, second: Movement.Snapshot }
export type Input = { first: Movement.Input, second: Movement.Input }

local Arena = { TICKS_PER_SECOND = Movement.TICKS_PER_SECOND }
local states = { idle = true, walk = true, crouchDown = true, crouch = true, crouchUp = true, jumpStart = true, air = true, land = true }

local function finite(value: any): boolean
    return type(value) == "number" and value == value and math.abs(value) < math.huge
end

local function validateFighter(config: FighterConfig, minX: number, maxX: number)
    assert(type(config) == "table" and type(config.body) == "table", "fighter config and body are required")
    assert(finite(config.body.halfWidth) and config.body.halfWidth > 0, "body halfWidth must be finite and positive")
    assert(finite(config.body.height) and config.body.height > 0, "body height must be finite and positive")
    assert(finite(config.startX), "startX must be finite")
    assert(config.startX >= minX + config.body.halfWidth and config.startX <= maxX - config.body.halfWidth, "starting body must fit inside stage")
end

local function validateConfig(config: Config)
    assert(type(config) == "table", "arena config is required")
    assert(finite(config.minX) and finite(config.maxX) and config.minX < config.maxX, "stage must have finite increasing bounds")
    local width = config.maxX - config.minX
    assert(finite(width), "stage width must be finite")
    validateFighter(config.first, config.minX, config.maxX)
    validateFighter(config.second, config.minX, config.maxX)
    local separation = config.first.body.halfWidth + config.second.body.halfWidth
    assert(separation <= width / 2, "stage must fit both complete bodies")
    assert(math.abs(config.first.startX - config.second.startX) >= separation, "starting bodies must not overlap")
end

local function validateSnapshot(snapshot: Movement.Snapshot, tick: number, body: Body, config: Config)
    assert(type(snapshot) == "table" and snapshot.tick == tick, "fighter ticks must match arena tick")
    assert(states[snapshot.state] == true, "unknown fighter state")
    assert(finite(snapshot.stateTicks) and snapshot.stateTicks >= 0 and snapshot.stateTicks <= tick and snapshot.stateTicks % 1 == 0, "invalid stateTicks")
    assert(finite(snapshot.x) and snapshot.x >= config.minX + body.halfWidth and snapshot.x <= config.maxX - body.halfWidth, "fighter outside stage")
    assert(finite(snapshot.y) and snapshot.y <= 0 and finite(snapshot.vx) and finite(snapshot.vy), "invalid fighter position or velocity")
    assert(snapshot.facing == 1 or snapshot.facing == -1, "invalid facing")
    assert(snapshot.animation == nil or finite(snapshot.animation), "invalid animation")
    assert(type(snapshot.jumpHeld) == "boolean", "invalid jumpHeld")
    assert(snapshot.jumpDirection == -1 or snapshot.jumpDirection == 0 or snapshot.jumpDirection == 1, "invalid jumpDirection")
end

local function validateInput(input: Movement.Input)
    assert(type(input) == "table", "fighter input is required")
    assert(input.left == nil or type(input.left) == "boolean", "left must be boolean")
    assert(input.right == nil or type(input.right) == "boolean", "right must be boolean")
    assert(input.down == nil or type(input.down) == "boolean", "down must be boolean")
    assert(input.jump == nil or type(input.jump) == "boolean", "jump must be boolean")
end

-- Open overlap intervals exclude edge-only contact and detect tunneling between ticks.
local function interval(start: number, finish: number, lower: number, upper: number): (number, number)
    local velocity = finish - start
    if velocity == 0 then
        if start > lower and start < upper then return -math.huge, math.huge end
        return math.huge, -math.huge
    end
    local a, b = (lower - start) / velocity, (upper - start) / velocity
    return math.min(a, b), math.max(a, b)
end

local function contact(config: Config, previous: Snapshot, first: Movement.Snapshot, second: Movement.Snapshot): boolean
    local separation = config.first.body.halfWidth + config.second.body.halfWidth
    local xIn, xOut = interval(previous.second.x - previous.first.x, second.x - first.x, -separation, separation)
    local yIn, yOut = interval(previous.second.y - previous.first.y, second.y - first.y, -config.first.body.height, config.second.body.height)
    return math.max(0, xIn, yIn) < math.min(1, xOut, yOut)
end

local function separate(config: Config, previous: Snapshot, first: Movement.Snapshot, second: Movement.Snapshot)
    if not contact(config, previous, first, second) then return end
    local left, right, leftBody, rightBody = first, second, config.first.body, config.second.body
    -- Equal centers are possible after a vertically clear cross-over; slot one breaks the tie.
    if previous.first.x > previous.second.x then
        left, right, leftBody, rightBody = second, first, config.second.body, config.first.body
    end
    local gap = leftBody.halfWidth + rightBody.halfWidth
    local overlap = gap - (right.x - left.x)
    if overlap <= 0 then return end
    local desiredLeft = left.x - overlap / 2
    -- Share correction equally; a wall transfers the remaining correction to the other body.
    left.x = math.clamp(desiredLeft, config.minX + leftBody.halfWidth, config.maxX - rightBody.halfWidth - gap)
    right.x = math.min(config.maxX - rightBody.halfWidth, left.x + gap)
end

function Arena.new(config: Config): Snapshot
    validateConfig(config)
    local facing = if config.first.startX < config.second.startX then 1 else -1
    return {
        tick = 0,
        first = Movement.new(config.first.movement, config.first.startX, facing),
        second = Movement.new(config.second.movement, config.second.startX, -facing),
    }
end

function Arena.step(config: Config, previous: Snapshot, input: Input): Snapshot
    validateConfig(config)
    assert(type(previous) == "table" and finite(previous.tick) and previous.tick >= 0 and previous.tick % 1 == 0, "invalid arena tick")
    validateSnapshot(previous.first, previous.tick, config.first.body, config)
    validateSnapshot(previous.second, previous.tick, config.second.body, config)
    assert(type(input) == "table", "arena input is required")
    validateInput(input.first)
    validateInput(input.second)
    -- Both fighters observe the same previous tick, never a partially updated opponent.
    local first = Movement.step(config.first.movement, previous.first, input.first, {
        minX = config.minX + config.first.body.halfWidth,
        maxX = config.maxX - config.first.body.halfWidth,
        opponentX = previous.second.x,
    })
    local second = Movement.step(config.second.movement, previous.second, input.second, {
        minX = config.minX + config.second.body.halfWidth,
        maxX = config.maxX - config.second.body.halfWidth,
        opponentX = previous.first.x,
    })
    separate(config, previous, first, second)
    return { tick = previous.tick + 1, first = first, second = second }
end

return Arena
