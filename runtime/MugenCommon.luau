--!strict
-- Standard host approximation, not an implementation of the reference common1.cns.
local State = require('./MugenState')
local Common = {}
export type Vector = {x: number, y: number}
export type Settings = {
	movement: {walkForward: number?, walkBack: number?, runForward: number?, runBackX: number?, runBackY: number?,
		jump: Vector?, jumpBack: number?, jumpForward: number?,
		airJump: Vector?, airJumpBack: number?, airJumpForward: number?, airJumpNum: number?, airJumpHeight: number?,
		gravity: number?, standFriction: number?, crouchFriction: number?}?,
	size: {groundBack: number?, groundFront: number?, height: number?}?,
	reactions: {liedownTime: number?}?, animations: {[string]: number}?, recoveryCommand: string?,
}
local keys: {[number]: string} = {[0]='idle',[10]='crouchDown',[11]='crouch',[12]='crouchUp',[20]='walkForward',
	[40]='jumpStart',[50]='jumpNeutral',[52]='landing',[100]='runForward',[105]='runBack',[106]='runBackLanding',[120]='guardStand',[130]='guardStand',[131]='guardCrouch',
	[132]='guardAir',[150]='guardStand',[151]='guardCrouch',[152]='guardAir',[5000]='hitStandLight',
	[5010]='hitCrouch',[5020]='hitAir',[5030]='hitAir',[5050]='fall',[5100]='down',[5110]='down',[5120]='getUp',[5150]='ko'}
function Common.value(settings: Settings?, key: string, default: number): number
	local movement = if settings then settings.movement else nil
	local value = if movement then (movement :: any)[key] else nil
	return if value ~= nil then value else default
end
function Common.animation(settings: Settings?, key: string, fallback: number): number
	local animations = if settings then settings.animations else nil
	return if animations and animations[key] ~= nil then animations[key] else fallback
end
function Common.recoveryRequested(s: State.Snapshot, settings: Settings?, upEdge: boolean): boolean
	local command = if settings then settings.recoveryCommand else nil
	return if command then s.commands.active[command] == true else upEdge
end
export type Recovery = {kind: string, remaining: number, recover: boolean?, recoverTime: number?, age: number?}
function Common.recover(machine: State.Program, s: State.Snapshot, settings: Settings?, reaction: Recovery, upEdge: boolean): (State.Snapshot, boolean)
	if s.hitPause > 0 or not Common.recoveryRequested(s,settings,upEdge) then return s,false end
	if (reaction.kind == 'hit' or reaction.kind == 'fall') and s.stateType == 'A' and s.y < 0 and reaction.recover and (reaction.age or 0) >= (reaction.recoverTime or 0) then
		local nextState = Common.transition(machine,s,settings,50,'jumpNeutral')
		nextState.ctrl = true
		return nextState,true
	elseif reaction.kind == 'down' and reaction.remaining == 0 then
		return Common.transition(machine,s,settings,5120,'getUp'),true
	end
	return s,false
end
function Common.owned(s: State.Snapshot): boolean
	return keys[s.stateNo] ~= nil and s.moveType ~= 'A'
end
function Common.prepare(config: any): any
	local result = table.clone(config)
	result.states = table.clone(config.states)
	local existing: {[number]: boolean} = {}
	local animations: {[number]: boolean} = {}
	for _, s in config.states do existing[s.id] = true end
	for _, a in config.animations do animations[a.id] = true end
	local settings: Settings? = config.combat.common
	local idle = Common.animation(settings, 'idle', config.startState)
	if not animations[idle] then idle = config.animations[1].id end
	for id, key in keys do
		if existing[id] then continue end
		local air = id == 50 or id == 105 or id == 132 or id == 152 or id == 5020 or id == 5030 or id == 5050
		local crouch = id == 10 or id == 11 or id == 12 or id == 131 or id == 151 or id == 5010
		local down = id == 5100 or id == 5110 or id == 5150
		local anim = Common.animation(settings, key, idle)
		if not animations[anim] then anim = idle end
		table.insert(result.states, {id=id,entries={
			{key='type',value=if air then 'A' elseif crouch then 'C' elseif down then 'L' else 'S'},
			{key='movetype',value=if id >= 150 then 'H' else 'I'},
			{key='physics',value='N'}, {key='anim',value=tostring(anim)},
			{key='ctrl',value=if id == 0 or id == 10 or id == 11 or id == 20 or id == 50 or id == 100 then '1' else '0'},
		}, controllers={}})
	end
	for _, definition in result.states do
		if definition.id == 105 and not existing[105] then
			table.insert(definition.entries,{key='velset',value=tostring(Common.value(settings,'runBackX',-4.5))..','..tostring(Common.value(settings,'runBackY',-3.8))})
		end
	end
	return result
end
function Common.transition(machine: State.Program, s: State.Snapshot, settings: Settings?, id: number, key: string?): State.Snapshot
	local animation: number? = nil
	if key and settings and settings.animations then animation = settings.animations[key] end
	return State.transition(machine, s, id, animation)
end
function Common.motion(machine: State.Program, s: State.Snapshot, settings: Settings?, input: any, jumpEdge: boolean, airJumps: number, startupDirection: number?): (State.Snapshot, number)
	local controlledAir = s.ctrl and s.stateType == 'A'
	if not settings or not (Common.owned(s) or controlledAir) then return s, airJumps end
	local back = if s.facing == 1 then input.left else input.right
	local forward = if s.facing == 1 then input.right else input.left
	local direction = if forward and not back then 1 elseif back and not forward then -1 else 0
	local movement = if settings then settings.movement else nil
	local priorVelocity = s.vx
	local function friction(key: string): number
		local velocity=priorVelocity*Common.value(settings,key,0)
		return if math.abs(velocity)<0.01 then 0 else velocity
	end
	local function change(id: number, key: string?): () s = Common.transition(machine, s, settings, id, key) end
	if s.stateNo == 105 then
		if s.time == 0 then
			s.vx = Common.value(settings,'runBackX',-4.5)
			s.vy = Common.value(settings,'runBackY',-3.8)
			s.stateType = 'A'; s.ctrl = false
		elseif s.vy >= 0 and s.y + s.vy + Common.value(settings,'gravity',0.44) >= 0 then
			change(106,'runBackLanding'); s.y = 0; s.vx = 0; s.vy = 0; s.ctrl = false; airJumps = 0
		end
	elseif s.stateNo == 106 then
		if s.time >= 2 then change(0,'idle'); s.ctrl = true end
	elseif s.stateNo == 100 and s.ctrl then
		if jumpEdge then
			change(40,'jumpStart'); s.ctrl = false; s.vx = 0; s.vy = 0
		elseif not forward or back or input.down then
			change(0,'idle'); s.ctrl = true; s.vx = 0; s.vy = 0
		else
			s.vx = Common.value(settings,'runForward',4.6); s.vy = 0
		end
	elseif s.stateNo == 40 then
		direction = startupDirection or direction
		if s.prevStateNo == 100 and direction == 0 then direction = 1 end
		if s.time >= 2 then
			change(50, if direction > 0 then 'jumpForward' elseif direction < 0 then 'jumpBack' else 'jumpNeutral')
			local jump = if movement and movement.jump then movement.jump else {x=0,y=-8}
			s.vx = if direction > 0 then Common.value(settings,'jumpForward',jump.x) elseif direction < 0 then Common.value(settings,'jumpBack',-jump.x) else 0
			s.vy = jump.y; s.ctrl = true; s.stateType = 'A'
		end
	elseif s.stateNo == 52 then
		if s.time >= 2 then change(0,'idle'); s.ctrl = true end
	elseif s.stateNo == 10 then
		if not input.down then change(12,'crouchUp') elseif s.time >= 1 then change(11,'crouch'); s.ctrl = true end
	elseif s.stateNo == 12 then
		if input.down then change(10,'crouchDown'); s.ctrl = true elseif s.time >= 1 then change(0,'idle'); s.ctrl = true end
	elseif s.ctrl then
		if s.stateType == 'A' then
			local limit = Common.value(settings,'airJumpNum',0)
			if jumpEdge and airJumps < limit and -s.y >= Common.value(settings,'airJumpHeight',0) then
				local jump = if movement and movement.airJump then movement.airJump else {x=0,y=-8}
				change(50,if direction > 0 then 'jumpForward' elseif direction < 0 then 'jumpBack' else 'jumpNeutral')
				s.vx = if direction > 0 then Common.value(settings,'airJumpForward',jump.x) elseif direction < 0 then Common.value(settings,'airJumpBack',-jump.x) else 0
				s.vy = jump.y; s.ctrl = true; s.stateType = 'A'; airJumps += 1
			end
		elseif jumpEdge then
			change(40,'jumpStart'); s.ctrl = false; s.vx = 0; s.vy = 0
		elseif input.down then
			if s.stateNo ~= 10 and s.stateNo ~= 11 then change(10,'crouchDown'); s.ctrl = true end
			s.vx = friction('crouchFriction')
		elseif s.stateNo == 11 then
			change(12,'crouchUp'); s.ctrl = false; s.vx = 0
		else
			local speed = if direction > 0 then Common.value(settings,'walkForward',0) elseif direction < 0 then Common.value(settings,'walkBack',0) else 0
			local id = if direction ~= 0 and speed ~= 0 then 20 else 0
			local key = if direction > 0 then 'walkForward' elseif direction < 0 then 'walkBack' else 'idle'
			if s.stateNo ~= id then change(id,key) elseif id == 20 then
				local anim = Common.animation(settings,key,s.anim)
				if s.anim ~= anim then s = State.transition(machine,s,id,anim) end
			end
			s.ctrl = true; s.vx = if id==0 then friction('standFriction') elseif direction < 0 then -math.abs(speed) else math.abs(speed); s.vy = 0
		end
	end
	return s, airJumps
end
return Common
