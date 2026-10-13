--!strict
-- mugenSkel SpriteFighter — drop into StarterPlayerScripts or a Tool
-- Usage:
--   local Fighter = require(path.to.MugenSkelFighter)
--   local data = require(path.to.CharacterData)
--   Fighter.start(imageLabel, data)  -- ImageLabel with atlas.png as Image

local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")

export type PackData = {
	id: string,
	anims: any,
	atlas: any,
	moves: any,
	binds: any,
	physics: any,
}

local MugenSkelFighter = {}

local function setFrame(image: ImageLabel, data: PackData, key: string, facing: number)
	local fr = data.atlas.frames[key]
	if not fr then
		return
	end
	image.ImageRectOffset = Vector2.new(fr.x, fr.y)
	image.ImageRectSize = Vector2.new(fr.w, fr.h)
	-- Keep a stable on-screen size from pack scale
	local scale = data.atlas.scale or 2
	image.Size = UDim2.fromOffset(math.floor(fr.w * scale), math.floor(fr.h * scale))
	image.ResampleMode = Enum.ResamplerMode.Pixelated
	if facing < 0 then
		image.ImageRectSize = Vector2.new(-fr.w, fr.h)
		image.ImageRectOffset = Vector2.new(fr.x + fr.w, fr.y)
	end
end

function MugenSkelFighter.start(image: ImageLabel, data: PackData)
	assert(image and image:IsA("ImageLabel"), "Need an ImageLabel with the atlas uploaded")
	assert(data and data.anims and data.atlas, "Need CharacterData module")

	local state = {
		animName = "idle",
		frameIndex = 0,
		accum = 0,
		facing = 1,
		busy = false,
	}

	local function play(name: string, lock: boolean?)
		if not data.anims.map[name] then
			return
		end
		state.animName = name
		state.frameIndex = 0
		state.accum = 0
		if lock ~= nil then
			state.busy = lock
		end
	end

	local function currentAction()
		local aid = data.anims.map[state.animName]
		if aid == nil then
			return nil
		end
		return data.anims.actions[tostring(aid)] or data.anims.actions[aid]
	end

	play("idle", false)

	local connRender = RunService.RenderStepped:Connect(function(dt)
		local action = currentAction()
		if not action or not action.frames or #action.frames == 0 then
			return
		end
		local fr = action.frames[state.frameIndex + 1]
		if not fr then
			return
		end
		setFrame(image, data, fr.key, state.facing)
		-- MUGEN ticks ≈ 1/60s
		local dur = math.max(1, fr.ticks or 3) / 60
		state.accum += dt
		if state.accum >= dur then
			state.accum -= dur
			state.frameIndex += 1
			if state.frameIndex >= #action.frames then
				if state.busy then
					state.busy = false
					play("idle", false)
				else
					state.frameIndex = 0
				end
			end
		end
	end)

	local function tryMove(moveId: string)
		if state.busy then
			return
		end
		local move = data.moves[moveId]
		if not move then
			return
		end
		local anim = move.animation or moveId
		if data.anims.map[anim] then
			play(anim, true)
		end
	end

	local keyToMove: { [Enum.KeyCode]: string } = {}
	for keyName, binding in pairs(data.binds.keyboard or {}) do
		local ok, code = pcall(function()
			return Enum.KeyCode[keyName]
		end)
		if ok and code and binding.move then
			keyToMove[code] = binding.move
		end
	end

	local connInput = UserInputService.InputBegan:Connect(function(input, gp)
		if gp then
			return
		end
		if input.UserInputType ~= Enum.UserInputType.Keyboard then
			return
		end
		local moveId = keyToMove[input.KeyCode]
		if moveId then
			tryMove(moveId)
			return
		end
		-- Facing / crude locomotion anims
		if input.KeyCode == Enum.KeyCode.A then
			state.facing = -1
			if not state.busy then
				play("walkBack", false)
			end
		elseif input.KeyCode == Enum.KeyCode.D then
			state.facing = 1
			if not state.busy then
				play("walk", false)
			end
		elseif input.KeyCode == Enum.KeyCode.W then
			if not state.busy then
				play(data.anims.map.jump and "jump" or "idle", false)
			end
		elseif input.KeyCode == Enum.KeyCode.S then
			if not state.busy then
				play(data.anims.map.crouch and "crouch" or "idle", false)
			end
		end
	end)

	local connRelease = UserInputService.InputEnded:Connect(function(input)
		if input.UserInputType ~= Enum.UserInputType.Keyboard then
			return
		end
		if state.busy then
			return
		end
		if input.KeyCode == Enum.KeyCode.A or input.KeyCode == Enum.KeyCode.D or input.KeyCode == Enum.KeyCode.S then
			play("idle", false)
		end
	end)

	return function stop()
		connRender:Disconnect()
		connInput:Disconnect()
		connRelease:Disconnect()
	end
end

return MugenSkelFighter
