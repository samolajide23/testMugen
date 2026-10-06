--!strict
-- Pure 60 Hz simulation. Speeds are units/tick; gravity is units/tick squared.
-- Entry counts as state tick 1. Timed states last N snapshots, then transition
-- on the following step. Launch integrates its first airborne tick immediately.
-- Jump vector x is authored facing-right (backward normally negative), y is negative up.
-- Missing animation IDs remain nil; bounds clamp position, not authored velocity.

export type Jump = { x: number, y: number }
export type Animations = {
	idle: number?, walkForward: number?, walkBackward: number?,
	crouchDown: number?, crouch: number?, crouchUp: number?,
	jumpStart: number?, jumpNeutral: number?, jumpForward: number?,
	jumpBackward: number?, land: number?,
}
export type Config = {
	walkForward: number, walkBackward: number,
	jumpNeutral: Jump, jumpForward: Jump, jumpBackward: Jump,
	gravity: number,
	crouchDownTicks: number, crouchUpTicks: number,
	jumpStartTicks: number, landTicks: number,
	animations: Animations,
}
export type Input = { left: boolean?, right: boolean?, down: boolean?, jump: boolean? }
export type World = { minX: number?, maxX: number?, opponentX: number? }
export type State = "idle" | "walk" | "crouchDown" | "crouch" | "crouchUp" | "jumpStart" | "air" | "land"
export type Snapshot = {
	tick: number, state: State, stateTicks: number,
	x: number, y: number, vx: number, vy: number,
	facing: number, animation: number?, jumpHeld: boolean, jumpDirection: number,
}

local Movement = { TICKS_PER_SECOND = 60 }

local function finite(value: any): boolean
	return type(value) == "number" and value == value and value > -math.huge and value < math.huge
end

local function validateJump(value: Jump)
	assert(type(value) == "table", "jump vector must be a table")
	assert(finite(value.x), "jump x must be finite")
	assert(finite(value.y) and value.y < 0, "jump y must be finite and negative")
end

local function validateDuration(value: number)
	assert(finite(value) and value >= 1 and value % 1 == 0, "duration must be a positive integer")
end

local function validateAnimation(id: number?)
	assert(id == nil or finite(id), "animation IDs must be finite numbers")
end

local function validateConfig(config: Config)
	assert(type(config) == "table", "config must be a table")
	assert(finite(config.walkForward) and config.walkForward >= 0, "walkForward must be finite and nonnegative")
	assert(finite(config.walkBackward) and config.walkBackward <= 0, "walkBackward must be finite and nonpositive")
	assert(finite(config.gravity) and config.gravity > 0, "gravity must be finite and positive")
	validateJump(config.jumpNeutral)
	validateJump(config.jumpForward)
	validateJump(config.jumpBackward)
	validateDuration(config.crouchDownTicks)
	validateDuration(config.crouchUpTicks)
	validateDuration(config.jumpStartTicks)
	validateDuration(config.landTicks)
	assert(type(config.animations) == "table", "animations must be a table")
	local animations = config.animations
	validateAnimation(animations.idle)
	validateAnimation(animations.walkForward)
	validateAnimation(animations.walkBackward)
	validateAnimation(animations.crouchDown)
	validateAnimation(animations.crouch)
	validateAnimation(animations.crouchUp)
	validateAnimation(animations.jumpStart)
	validateAnimation(animations.jumpNeutral)
	validateAnimation(animations.jumpForward)
	validateAnimation(animations.jumpBackward)
	validateAnimation(animations.land)
end

local function validateWorld(world: World?)
	if world == nil then return end
	assert(type(world) == "table", "world must be a table")
	if world.minX ~= nil then assert(finite(world.minX), "minX must be finite") end
	if world.maxX ~= nil then assert(finite(world.maxX), "maxX must be finite") end
	if world.opponentX ~= nil then assert(finite(world.opponentX), "opponentX must be finite") end
	if world.minX ~= nil and world.maxX ~= nil then
		assert(world.minX <= world.maxX, "minX must not exceed maxX")
	end
end

local function enter(snapshot: Snapshot, state: State)
	if snapshot.state == state then
		snapshot.stateTicks += 1
	else
		snapshot.state = state
		snapshot.stateTicks = 1
	end
end

local function animationFor(config: Config, snapshot: Snapshot, direction: number): number?
	local animations = config.animations
	local state = snapshot.state
	if state == "idle" then return animations.idle end
	if state == "walk" then
		if direction * snapshot.facing > 0 then return animations.walkForward end
		return animations.walkBackward
	end
	if state == "crouchDown" then return animations.crouchDown end
	if state == "crouch" then return animations.crouch end
	if state == "crouchUp" then return animations.crouchUp end
	if state == "jumpStart" then return animations.jumpStart end
	if state == "land" then return animations.land end
	if snapshot.jumpDirection > 0 then return animations.jumpForward end
	if snapshot.jumpDirection < 0 then return animations.jumpBackward end
	return animations.jumpNeutral
end

function Movement.new(config: Config, x: number?, facing: number?): Snapshot
	validateConfig(config)
	local startX = if x == nil then 0 else x
	local startFacing = if facing == nil then 1 else facing
	assert(finite(startX), "x must be finite")
	assert(startFacing == 1 or startFacing == -1, "facing must be +1 or -1")
	return {
		tick = 0, state = "idle", stateTicks = 0,
		x = startX, y = 0, vx = 0, vy = 0,
		facing = startFacing, animation = config.animations.idle,
		jumpHeld = false, jumpDirection = 0,
	}
end

function Movement.step(config: Config, previous: Snapshot, input: Input, world: World?): Snapshot
	validateConfig(config)
	validateWorld(world)
	local snapshot: Snapshot = table.clone(previous)
	snapshot.tick += 1
	local jumpHeld = input.jump == true
	local jumpPressed = jumpHeld and not previous.jumpHeld
	snapshot.jumpHeld = jumpHeld
	local direction = (if input.right then 1 else 0) - (if input.left then 1 else 0)
	local down = input.down == true
	local state = previous.state

	if state ~= "air" and state ~= "jumpStart" then
		local opponentX = if world then world.opponentX else nil
		if opponentX ~= nil then
			if opponentX > snapshot.x then snapshot.facing = 1 end
			if opponentX < snapshot.x then snapshot.facing = -1 end
		end
	end

	if state == "jumpStart" and previous.stateTicks >= config.jumpStartTicks then
		local jump = config.jumpNeutral
		if snapshot.jumpDirection > 0 then jump = config.jumpForward end
		if snapshot.jumpDirection < 0 then jump = config.jumpBackward end
		snapshot.vx = jump.x * snapshot.facing
		snapshot.vy = jump.y
		state = "air"
	end

	if state == "air" then
		enter(snapshot, "air")
		snapshot.x += snapshot.vx
		snapshot.y += snapshot.vy
		local descending = snapshot.vy >= 0
		snapshot.vy += config.gravity
		if descending and snapshot.y >= 0 then
			snapshot.y = 0
			snapshot.vx = 0
			snapshot.vy = 0
			enter(snapshot, "land")
		end
	elseif state == "jumpStart" then
		enter(snapshot, "jumpStart")
	else
		snapshot.vx = 0
		snapshot.vy = 0
		snapshot.y = 0
		local groundedAction = false
		if state == "land" and previous.stateTicks < config.landTicks then
			enter(snapshot, "land")
		elseif state == "crouchDown" or state == "crouch" then
			if not down then
				enter(snapshot, "crouchUp")
			elseif state == "crouch" or previous.stateTicks >= config.crouchDownTicks then
				enter(snapshot, "crouch")
			else
				enter(snapshot, "crouchDown")
			end
		elseif state == "crouchUp" then
			if down then
				enter(snapshot, "crouchDown")
			elseif previous.stateTicks < config.crouchUpTicks then
				enter(snapshot, "crouchUp")
			else
				groundedAction = true
			end
		else
			groundedAction = true
		end

		if groundedAction then
			if down then
				enter(snapshot, "crouchDown")
			elseif jumpPressed then
				snapshot.jumpDirection = direction * snapshot.facing
				enter(snapshot, "jumpStart")
			elseif direction ~= 0 then
				local speed = if direction * snapshot.facing > 0 then config.walkForward else config.walkBackward
				snapshot.vx = speed * snapshot.facing
				snapshot.x += snapshot.vx
				enter(snapshot, "walk")
			else
				enter(snapshot, "idle")
			end
		end
	end

	if world ~= nil then
		if world.minX ~= nil then snapshot.x = math.max(snapshot.x, world.minX) end
		if world.maxX ~= nil then snapshot.x = math.min(snapshot.x, world.maxX) end
	end
	snapshot.animation = animationFor(config, snapshot, direction)
	return snapshot
end

return Movement
