--!strict
local Arena = require("./Arena")
local Movement = require("./Movement")

export type Box = { left: number, right: number, top: number, bottom: number }
export type Attack = {
    startupTicks: number, activeTicks: number, recoveryTicks: number,
    damage: number, hitstunTicks: number, hitbox: Box, animation: number?,
}
export type FighterConfig = { maxHealth: number, attack: Attack, hitAnimation: number?, defeatAnimation: number? }
export type Config = { arena: Arena.Config, first: FighterConfig, second: FighterConfig }
export type FighterInput = { left: boolean?, right: boolean?, down: boolean?, jump: boolean?, attack: boolean? }
export type Input = { first: FighterInput, second: FighterInput }
export type State = "ready" | "startup" | "active" | "recovery" | "hitstun" | "defeated"
export type Fighter = {
    state: State, stateTicks: number, health: number, attackHeld: boolean,
    hitConnected: boolean, attackFacing: number, hitstunTicks: number, animation: number?,
}
export type HitEvent = { type: "hit", attacker: "first" | "second", defender: "first" | "second", damage: number, remainingHealth: number }
export type Snapshot = { tick: number, arena: Arena.Snapshot, first: Fighter, second: Fighter, events: { HitEvent } }

local Combat = { TICKS_PER_SECOND = Arena.TICKS_PER_SECOND }
local states = { ready = true, startup = true, active = true, recovery = true, hitstun = true, defeated = true }

local function finite(value: any): boolean
    return type(value) == "number" and value == value and math.abs(value) < math.huge
end
local function positiveInteger(value: any): boolean
    return finite(value) and value > 0 and value % 1 == 0
end
local function animation(value: any)
    assert(value == nil or finite(value), "animation must be nil or a finite number")
end
local function validateFighterConfig(config: FighterConfig)
    assert(type(config) == "table" and positiveInteger(config.maxHealth), "maxHealth must be a positive integer")
    local attack = config.attack
    assert(type(attack) == "table", "attack config is required")
    assert(positiveInteger(attack.startupTicks) and positiveInteger(attack.activeTicks) and positiveInteger(attack.recoveryTicks), "attack durations must be positive integers")
    assert(positiveInteger(attack.damage) and positiveInteger(attack.hitstunTicks), "damage and hitstun must be positive integers")
    local box = attack.hitbox
    assert(type(box) == "table", "hitbox is required")
    assert(finite(box.left) and finite(box.right) and box.left < box.right, "hitbox must have finite increasing horizontal edges")
    assert(finite(box.top) and finite(box.bottom) and box.top < box.bottom, "hitbox must have finite increasing vertical edges")
    animation(attack.animation); animation(config.hitAnimation); animation(config.defeatAnimation)
end
local function validateConfig(config: Config)
    assert(type(config) == "table", "combat config is required")
    validateFighterConfig(config.first); validateFighterConfig(config.second)
end
local function validateFighter(fighter: Fighter, config: FighterConfig, tick: number)
    assert(type(fighter) == "table" and states[fighter.state] == true, "invalid combat state")
    assert(finite(fighter.stateTicks) and fighter.stateTicks >= 0 and fighter.stateTicks % 1 == 0 and fighter.stateTicks <= tick, "invalid combat stateTicks")
    assert(finite(fighter.health) and fighter.health % 1 == 0 and fighter.health >= 0 and fighter.health <= config.maxHealth, "invalid health")
    assert((fighter.health == 0) == (fighter.state == "defeated"), "zero health must be defeated")
    assert(type(fighter.attackHeld) == "boolean" and type(fighter.hitConnected) == "boolean", "invalid attack bookkeeping")
    assert(fighter.attackFacing == 1 or fighter.attackFacing == -1, "invalid attackFacing")
    assert(finite(fighter.hitstunTicks) and fighter.hitstunTicks >= 0 and fighter.hitstunTicks % 1 == 0, "invalid hitstun duration")
    assert((fighter.hitstunTicks > 0) == (fighter.state == "hitstun"), "hitstun duration must match state")
    animation(fighter.animation)
end
local function optionalBoolean(value: any)
    assert(value == nil or type(value) == "boolean", "combat inputs must be booleans")
end
local function validateInput(input: FighterInput)
    assert(type(input) == "table", "both fighter inputs are required")
    optionalBoolean(input.left); optionalBoolean(input.right); optionalBoolean(input.down)
    optionalBoolean(input.jump); optionalBoolean(input.attack)
end
local function attacking(state: State): boolean
    return state == "startup" or state == "active" or state == "recovery"
end
local function enter(fighter: Fighter, state: State)
    fighter.state = state
    fighter.stateTicks = 1
end

local function prepare(config: FighterConfig, previous: Fighter, input: FighterInput, movement: Movement.Snapshot, opponentX: number): Fighter
    local fighter = table.clone(previous)
    fighter.stateTicks += 1
    fighter.attackHeld = input.attack == true
    local state = previous.state
    if state == "startup" and previous.stateTicks >= config.attack.startupTicks then enter(fighter, "active")
    elseif state == "active" and previous.stateTicks >= config.attack.activeTicks then enter(fighter, "recovery")
    elseif state == "recovery" and previous.stateTicks >= config.attack.recoveryTicks then enter(fighter, "ready")
    elseif state == "hitstun" and previous.stateTicks >= previous.hitstunTicks then
        enter(fighter, "ready")
        fighter.hitstunTicks = 0
    end
    if fighter.state == "ready" and fighter.attackHeld and not previous.attackHeld
        and movement.y == 0 and (movement.state == "idle" or movement.state == "walk") then
        enter(fighter, "startup")
        fighter.hitConnected = false
        fighter.attackFacing = if opponentX > movement.x then 1 elseif opponentX < movement.x then -1 else movement.facing
    end
    return fighter
end

local function movementInput(fighter: Fighter, input: FighterInput): Movement.Input
    if fighter.state ~= "ready" then return {} end
    return { left = input.left, right = input.right, down = input.down, jump = input.jump }
end

local function hits(attacker: Fighter, attack: Attack, from: Movement.Snapshot, target: Movement.Snapshot, body: Arena.Body): boolean
    if attacker.state ~= "active" or attacker.hitConnected then return false end
    local box = attack.hitbox
    local left = from.x + (if attacker.attackFacing == 1 then box.left else -box.right)
    local right = from.x + (if attacker.attackFacing == 1 then box.right else -box.left)
    return left < target.x + body.halfWidth and right > target.x - body.halfWidth
        and from.y + box.top < target.y and from.y + box.bottom > target.y - body.height
end

local function selectAnimation(fighter: Fighter, config: FighterConfig, movement: Movement.Snapshot)
    if attacking(fighter.state) then fighter.animation = config.attack.animation
    elseif fighter.state == "hitstun" then fighter.animation = config.hitAnimation
    elseif fighter.state == "defeated" then fighter.animation = config.defeatAnimation
    else fighter.animation = movement.animation end
end

function Combat.new(config: Config): Snapshot
    validateConfig(config)
    local arena = Arena.new(config.arena)
    local function newFighter(fighterConfig: FighterConfig, movement: Movement.Snapshot): Fighter
        return { state = "ready", stateTicks = 0, health = fighterConfig.maxHealth, attackHeld = false,
            hitConnected = false, attackFacing = movement.facing, hitstunTicks = 0, animation = movement.animation }
    end
    return { tick = 0, arena = arena, first = newFighter(config.first, arena.first), second = newFighter(config.second, arena.second), events = {} }
end

function Combat.step(config: Config, previous: Snapshot, input: Input): Snapshot
    validateConfig(config)
    assert(type(previous) == "table" and finite(previous.tick) and previous.tick >= 0 and previous.tick % 1 == 0, "invalid combat tick")
    assert(type(previous.arena) == "table" and previous.arena.tick == previous.tick, "arena tick must match combat tick")
    validateFighter(previous.first, config.first, previous.tick); validateFighter(previous.second, config.second, previous.tick)
    assert(type(input) == "table", "combat input is required")
    validateInput(input.first); validateInput(input.second)
    local first = prepare(config.first, previous.first, input.first, previous.arena.first, previous.arena.second.x)
    local second = prepare(config.second, previous.second, input.second, previous.arena.second, previous.arena.first.x)
    local arena = Arena.step(config.arena, previous.arena, {
        first = movementInput(first, input.first), second = movementInput(second, input.second),
    })
    -- Consume physical jump edges even when combat suppresses movement input.
    arena.first.jumpHeld = input.first.jump == true
    arena.second.jumpHeld = input.second.jump == true
    if attacking(first.state) then arena.first.facing = first.attackFacing end
    if attacking(second.state) then arena.second.facing = second.attackFacing end

    -- Collect both contacts before applying either result so simultaneous hits can trade.
    local firstHits = second.health > 0 and hits(first, config.first.attack, arena.first, arena.second, config.arena.second.body)
    local secondHits = first.health > 0 and hits(second, config.second.attack, arena.second, arena.first, config.arena.first.body)
    local events: { HitEvent } = {}
    local function applyHit(attacker: Fighter, defender: Fighter, attack: Attack, target: Movement.Snapshot,
        targetMovement: Movement.Config, attackerId: "first" | "second", defenderId: "first" | "second")
        attacker.hitConnected = true
        local damage = math.min(defender.health, attack.damage)
        defender.health -= damage
        enter(defender, if defender.health == 0 then "defeated" else "hitstun")
        defender.hitstunTicks = if defender.health == 0 then 0 else attack.hitstunTicks
        if target.y == 0 then
            target.state = "idle"
            target.stateTicks = 1
            target.vx, target.vy = 0, 0
            target.animation = targetMovement.animations.idle
        end
        local event: HitEvent = { type = "hit", attacker = attackerId, defender = defenderId, damage = damage, remainingHealth = defender.health }
        table.insert(events, event)
    end
    if firstHits then applyHit(first, second, config.first.attack, arena.second, config.arena.second.movement, "first", "second") end
    if secondHits then applyHit(second, first, config.second.attack, arena.first, config.arena.first.movement, "second", "first") end
    selectAnimation(first, config.first, arena.first); selectAnimation(second, config.second, arena.second)
    return { tick = previous.tick + 1, arena = arena, first = first, second = second, events = events }
end

return Combat
