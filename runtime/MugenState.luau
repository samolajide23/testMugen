--!strict
local Expression = require('./MugenExpression')
local Commands = require('./MugenCommands')
local HitDef = require('./MugenHitDef')
local State = { TICKS_PER_SECOND = 60 }
export type Entry = { key: string, value: string, line: number? }
export type Controller = { type: string, entries: {Entry}, source: string?, line: number? }
export type Definition = { id: number, entries: {Entry}, controllers: {Controller}, source: string? }
export type Animation = { id: number, durations: {number}, loopStart: number }
export type Config = { states: {Definition}, animations: {Animation}, commands: {Commands.Definition},
	deferredControllers: {string}?, permissiveParameters: boolean?, startState: number?, gravity: number?, friction: number?, crouchFriction: number?, commonAnimations: {Animation}? }
export type ProjectileRequest = { hitdef: HitDef.Definition, source: string, line: number, projid: number, projanim: number,
	projhitanim: number, projremanim: number, projremove: number, projremovetime: number, projhits: number,
	projpriority: number, projmisstime: number, projscale: HitDef.Vector, offset: HitDef.Vector,
	velocity: HitDef.Vector, velmul: HitDef.Vector, acceleration: HitDef.Vector,
	projedgebound: number, projstagebound: number, projheightbound: {number}, postype: string }
export type HelperRequest = {id: number, stateNo: number, pos: HitDef.Vector, postype: string, facing: number, supermove: boolean, sprPriority: number, source: string, line: number}
export type SuperPauseRequest = { time: number, movetime: number, unhittable: boolean, darken: boolean, anim: number, pos: HitDef.Vector }
export type Visual = { scale: {x: number, y: number}, angle: number }
export type Presentation = { flags: {[string]: boolean}, victoryQuote: number? }
export type HostContext = { roundstate: number?, win: boolean?, wintime: number?, numenemy: number?, enemyName: string?, life: number?, p2BodyDistX: number?, p2BodyDistY: number?, numExplod: {[number]: number}?, numHelper: {[number]: number}?, isHelper: boolean? }
export type ExplodRequest = { id: number, anim: number, resource: string, pos: HitDef.Vector, postype: string,
	facing: number, vfacing: number, bindtime: number, removetime: number, scale: HitDef.Vector, sprpriority: number,
	supermove: boolean, supermovetime: number, pausemovetime: number, removeongethit: boolean, ownpal: boolean,
	velocity: HitDef.Vector, acceleration: HitDef.Vector, source: string, line: number, stateNo: number }
type Params = {[string]: string}
type CompiledController = { type: string, params: Params, all: {Expression.Node}, groups: {{Expression.Node}},
	persistent: number, ignoreHitPause: boolean, source: string, line: number, key: string, entries: {Entry}, hitDef: HitDef.Program? }
type CompiledState = { id: number, params: Params, controllers: {CompiledController} }
export type Program = { states: {[number]: CompiledState}, animations: {[number]: Animation}, commands: Commands.Program,
	deferred: {[string]: boolean}, expressions: {[string]: Expression.Node}, startState: number, gravity: number, friction: number, crouchFriction: number, commonAnimations: {[number]: Animation} }
export type Event = { kind: string, controller: string, source: string, line: number, tick: number, stateNo: number, time: number, entries: {Entry} }
export type ActiveHit = { definition: HitDef.Definition, serial: number, targets: {[number]: boolean}, source: string, line: number }
export type Snapshot = { tick: number, started: boolean, stateNo: number, prevStateNo: number, time: number,
	hit: ActiveHit?, hitSerial: number, rng: number,
	stateType: string, moveType: string, physics: string, ctrl: boolean, facing: number,
	x: number, y: number, vx: number, vy: number, power: number, juggle: number, sprPriority: number,
	anim: number, animPosition: number, animElem: number, elemTime: number, animWrapped: boolean,
	vars: {[number]: number}, fvars: {[number]: number}, runs: {[string]: number},
	commands: Commands.Snapshot, moveContact: number, moveHit: number, moveGuarded: number, hitPause: number, events: {Event},
	projectileRequests: {ProjectileRequest}?, superPauseRequests: {SuperPauseRequest}?, unhittableTicks: number?,
	helperRequests: {HelperRequest}?, destroyed: boolean?, visual: Visual?, presentation: Presentation?, explodRequests: {ExplodRequest}?, host: HostContext? }
export type Feedback = { moveContact: boolean?, moveHit: boolean?, moveGuarded: boolean?, hitPauseTicks: number? }
local ALLOWED: {[string]: {[string]: boolean}} = {
	helper={id=true,stateno=true,pos=true,postype=true,facing=true,helpertype=true,name=true,keyctrl=true,ownpal=true,supermove=true,sprpriority=true},
	gravity={}, destroyself={},
	changestate={value=true,ctrl=true,anim=true}, changeanim={value=true,elem=true}, ctrlset={value=true},
	varset={v=true,fv=true,value=true}, varadd={v=true,fv=true,value=true},
	velset={x=true,y=true}, veladd={x=true,y=true}, velmul={x=true,y=true}, posset={x=true,y=true}, posadd={x=true,y=true},
	poweradd={value=true}, powerset={value=true}, statetypeset={statetype=true,movetype=true,physics=true},
	sprpriority={value=true}, null={}, hitdef={}, projectile={}, nothitby={value=true,time=true},
	angledraw={value=true,scale=true}, assertspecial={flag=true,flag2=true,flag3=true},
	varrandom={v=true,range=true}, victoryquote={value=true},
	explod={anim=true,id=true,pos=true,postype=true,facing=true,vfacing=true,bindtime=true,removetime=true,
		scale=true,sprpriority=true,supermove=true,supermovetime=true,pausemovetime=true,removeongethit=true,
		ownpal=true,velocity=true,accel=true},
	superpause={time=true,movetime=true,unhittable=true,anim=true,sound=true,pos=true,darken=true,poweradd=true},
}
local PROJECTILE = {projid=true,projanim=true,projhitanim=true,projremanim=true,projremove=true,
	projremovetime=true,projhits=true,projpriority=true,projmisstime=true,projscale=true,offset=true,
	velocity=true,velmul=true,acceleration=true,projedgebound=true,projstagebound=true,projscreenbound=true,
	projheightbound=true,postype=true,projshadow=true}
local HEADER = { type=true,movetype=true,physics=true,anim=true,ctrl=true,velset=true,poweradd=true,juggle=true,sprpriority=true }
local function integer(n: number): boolean return n == n and math.abs(n) < math.huge and n % 1 == 0 end
local function parameters(entries: {Entry}, permissive: boolean?): Params
	local result: Params = {}
	for _, entry in entries do
		local key = string.lower(entry.key)
		if key ~= 'type' and not string.match(key, '^trigger') then
			if result[key] ~= nil and permissive then continue end
			assert(result[key] == nil, 'Duplicate parameter ' .. key)
			result[key] = entry.value
		end
	end
	return result
end
local function splitVector(text: string): {string}
	local result: {string} = {}; local start, depth = 1, 0; local quoted = false
	for index = 1, #text do
		local c = string.sub(text, index, index)
		if c == '"' then quoted = not quoted
		elseif not quoted then
			if c == '(' or c == '[' then depth += 1 elseif c == ')' or c == ']' then depth -= 1
			elseif c == ',' and depth == 0 then table.insert(result, string.sub(text, start, index - 1)); start = index + 1 end
		end
	end
	table.insert(result, string.sub(text, start))
	return result
end

function State.compile(config: Config): Program
	local p: Program = { states={}, animations={}, commands=Commands.compile(config.commands), deferred={}, expressions={},
		commonAnimations={}, startState=config.startState or 0, gravity=config.gravity or 0.44, friction=config.friction or 0.85,
				crouchFriction=config.crouchFriction or config.friction or 0.85 }
			local function expression(text: string) p.expressions[text] = p.expressions[text] or Expression.compile(text) end
			assert(p.gravity > 0 and p.gravity < math.huge and p.friction >= 0 and p.friction <= 1
				and p.crouchFriction >= 0 and p.crouchFriction <= 1, 'Invalid physics constants')
	for _, name in config.deferredControllers or {} do
		assert(not ALLOWED[name], 'Implemented controllers cannot be deferred')
		p.deferred[name] = true
	end
	for _, animation in config.animations do
		assert(integer(animation.id) and not p.animations[animation.id], 'Invalid/duplicate animation ID')
		assert(#animation.durations > 0 and integer(animation.loopStart) and animation.loopStart >= 1 and animation.loopStart <= #animation.durations, 'Invalid AIR loop')
		local progressing = false
		for index, duration in animation.durations do
			assert(integer(duration) and duration >= -1, 'Invalid AIR duration')
			if index >= animation.loopStart and duration ~= 0 then progressing = true end
		end
		assert(progressing, 'Zero-duration AIR loop is unsupported')
		p.animations[animation.id] = { id=animation.id, loopStart=animation.loopStart, durations=table.clone(animation.durations) }
	end
	for _, animation in config.commonAnimations or {} do
		assert(integer(animation.id) and not p.commonAnimations[animation.id], 'Invalid common animation ID')
		assert(#animation.durations>0 and integer(animation.loopStart) and animation.loopStart>=1 and animation.loopStart<=#animation.durations, 'Invalid common AIR loop')
		local progressing=false
		for index,duration in animation.durations do
			assert(integer(duration) and duration>=-1, 'Invalid common AIR duration')
			if index>=animation.loopStart and duration~=0 then progressing=true end
		end
		assert(progressing, 'Zero-duration common AIR loop')
		p.commonAnimations[animation.id]={id=animation.id,loopStart=animation.loopStart,durations=table.clone(animation.durations)}
	end
	local function trigger(text: string): Expression.Node
		-- Bounded source redirection; no general enemy-expression interpreter.
		return Expression.compile((string.gsub(text, '[Ee][Nn][Ee][Mm][Yy]%s*,%s*[Nn][Aa][Mm][Ee]', 'enemyname')))
	end
	for _, definition in config.states do
		assert(integer(definition.id) and definition.id >= -3 and not p.states[definition.id], 'Invalid/duplicate state definition')
		local params: Params = {}
		for _, entry in definition.entries do
			assert(HEADER[entry.key], 'Unsupported Statedef parameter ' .. entry.key)
			assert(params[entry.key] == nil, 'Duplicate Statedef parameter ' .. entry.key)
			params[entry.key] = entry.value
			if entry.key == 'velset' then for _, part in splitVector(entry.value) do expression(part) end
			elseif entry.key ~= 'type' and entry.key ~= 'movetype' and entry.key ~= 'physics' then expression(entry.value) end
		end
		local compiled: CompiledState = { id=definition.id, params=params, controllers={} }
		for index, controller in definition.controllers do
			local kind = string.lower(controller.type)
			assert(ALLOWED[kind] or p.deferred[kind], 'Unsupported controller ' .. kind .. ' at ' .. (controller.source or '?') .. ':' .. tostring(controller.line))
			local c: CompiledController = { type=kind, params=parameters(controller.entries,config.permissiveParameters), all={}, groups={},
				persistent=1, ignoreHitPause=false, source=controller.source or definition.source or '?', line=controller.line or 0,
				key=tostring(definition.id) .. ':' .. tostring(index), entries={} }
			if kind == 'varset' or kind == 'varadd' then
				local shorthand: string? = nil
				for key, value in c.params do
					local variable = string.match(key, '^(f?var)%((%d+)%)$')
					if variable then
						assert(not shorthand and not c.params.v and not c.params.fv and not c.params.value, 'Conflicting variable shorthand')
						shorthand = key
					end
				end
				if shorthand then
					local variable, indexText = string.match(shorthand, '^(f?var)%((%d+)%)$')
					c.params[if variable == 'fvar' then 'fv' else 'v'] = indexText
					c.params.value = c.params[shorthand]
					c.params[shorthand] = nil
				end
			end
			local groups: {[number]: {Expression.Node}} = {}; local highest, typeCount = 0, 0
			for _, entry in controller.entries do
				table.insert(c.entries, table.clone(entry))
				if entry.key == 'type' then typeCount += 1; assert(string.lower(entry.value) == kind, 'Conflicting controller type') end
				if entry.key == 'triggerall' then table.insert(c.all, trigger(entry.value))
				else
					local number = string.match(entry.key, '^trigger(%d+)$')
					if number then
						local group = tonumber(number) :: number
						assert(group >= 1 and group <= 128, 'Invalid trigger group')
						groups[group] = groups[group] or {}; table.insert(groups[group], trigger(entry.value)); highest = math.max(highest, group)
					elseif string.match(entry.key, '^trigger') then error('Unsupported trigger key ' .. entry.key) end
				end
			end
			assert(typeCount <= 1, 'Duplicate controller type')
			assert(highest > 0, 'Controller requires trigger1')
			for group = 1, highest do assert(groups[group], 'Trigger groups must be contiguous'); table.insert(c.groups, groups[group]) end
			if c.params.persistent then c.persistent = tonumber(c.params.persistent) or -1 end
			assert(c.persistent == 0 or c.persistent == 1, 'Only persistent 0/1 is implemented')
			assert(definition.id >= 0 or c.persistent == 1, 'Negative-state persistence must be 1 in this subset')
			assert(not c.params.ignorehitpause or c.params.ignorehitpause == '0' or c.params.ignorehitpause == '1', 'Invalid ignorehitpause')
			c.ignoreHitPause = c.params.ignorehitpause == '1'
			if kind == 'hitdef' or kind == 'projectile' then
				local hitParams: Params = {}
				for key, value in c.params do
					if key ~= 'persistent' and key ~= 'ignorehitpause' and not (kind == 'projectile' and PROJECTILE[key]) then hitParams[key] = value end
				end
				local ok, hitProgram = pcall(HitDef.compile, hitParams)
				assert(ok, c.source .. ':' .. tostring(c.line) .. ' (hitdef): ' .. tostring(hitProgram))
				c.hitDef = hitProgram
				if kind == 'projectile' then
					for key, text in c.params do
						if PROJECTILE[key] and key ~= 'postype' and key ~= 'projshadow' then
							for _, part in splitVector(text) do expression(part) end
						end
					end
				end
			elseif ALLOWED[kind] then
				for key, text in c.params do
					assert(key == 'persistent' or key == 'ignorehitpause' or ALLOWED[kind][key], 'Unsupported ' .. kind .. ' parameter ' .. key)
					if kind == 'nothitby' and key == 'value' then assert(string.upper(text) == 'SCA', 'Only full SCA NotHitBy is supported'); continue end
					if kind == 'superpause' and key == 'sound' then continue end
					if kind == 'assertspecial' and string.match(key,'^flag') then continue end
					if (kind == 'explod' or kind == 'helper') and key == 'postype' then continue end
					if kind == 'helper' and (key == 'name' or key == 'helpertype') then continue end
					if kind == 'explod' and key == 'anim' then
						local value=string.gsub(text,'^%s*[sSfF]%s*',''); expression(value); continue
					end
					if key == 'scale' or key == 'pos' or key == 'velocity' or key == 'accel' or key == 'range' then
						for _, part in splitVector(text) do expression(part) end
					elseif key ~= 'statetype' and key ~= 'movetype' and key ~= 'physics' then expression(text) end
				end
			end
			table.insert(compiled.controllers, c)
		end
		p.states[definition.id] = compiled
	end
	assert(p.startState >= 0 and p.states[p.startState], 'Missing initial state')
	return p
end

local function animationTime(p: Program, s: Snapshot): number
	local total = 0
	for _, duration in p.animations[s.anim].durations do if duration == -1 then return -1 end; total += duration end
	return s.animPosition - total
end
local function context(p: Program, s: Snapshot): Expression.Context
	return { resolve=function(name: string, args: {Expression.Value}): Expression.Value
		if name == 'numhelper' then
			assert(#args<=1, 'NumHelper requires zero or one ID')
			local id=if args[1] then Expression.number(args[1]) else nil
			local count=0
			local host=s.host
			for key,value in (if host then host.numHelper or {} else {}) do if id==nil or key==id then count+=value end end
			for _,request in s.helperRequests or {} do if id==nil or request.id==id then count+=1 end end
			return Expression.integer(count)
		end
		if name == 'numexplod' then
			assert(#args<=1, 'NumExplod requires zero or one ID')
			local id=if args[1] then Expression.number(args[1]) else nil
			local count=0
			for key,value in (if s.host then (s.host :: HostContext).numExplod or {} else {}) do if id==nil or key==id then count+=value end end
			for _, request in s.explodRequests or {} do if id==nil or request.id==id then count+=1 end end
			return Expression.integer(count)
		end
		if name == 'p2bodydist x' or name == 'p2bodydist y' then
			local value = if s.host then (if name == 'p2bodydist x' then s.host.p2BodyDistX else s.host.p2BodyDistY) else nil
			assert(value ~= nil, 'P2BodyDist requires opponent host context')
			return Expression.float(value :: number)
		end
		if name == 'enemyname' then return Expression.string(if s.host then s.host.enemyName or '' else '') end
		if name == 'roundstate' then return Expression.integer(if s.host then s.host.roundstate or 2 else 2) end
		if name == 'win' then return Expression.integer(if s.host and s.host.win then 1 else 0) end
		if name == 'wintime' then return Expression.integer(if s.host then s.host.wintime or 0 else 0) end
		if name == 'numenemy' then return Expression.integer(if s.host then s.host.numenemy or 0 else 0) end
		if name == 'life' then return Expression.integer(if s.host then s.host.life or 0 else 0) end
		if name == 'command' then
			assert(#args == 1 and args[1].text ~= nil, 'Command requires a name')
			return Expression.integer(if s.commands.active[args[1].text :: string] then 1 else 0)
		elseif name == 'var' or name == 'fvar' then
			assert(#args == 1, 'Variable requires one index'); local index = Expression.number(args[1])
			assert(integer(index) and index >= 0 and index < (if name == 'var' then 60 else 40), 'Variable index out of range')
			return if name == 'var' then Expression.integer(s.vars[index] or 0) else Expression.float(s.fvars[index] or 0)
		elseif name == 'animelemtime' then
			assert(#args == 1, 'AnimElemTime requires one index')
			if args[1].number == nil then return Expression.bottom() end
			local index = args[1].number :: number; local animation = p.animations[s.anim]
			if not integer(index) or index < 1 or index > #animation.durations then return Expression.bottom() end
			local offset = 0
			for element = 1, index - 1 do
				if animation.durations[element] == -1 then return Expression.bottom() end
				offset += animation.durations[element]
			end
			return Expression.integer(s.animPosition - offset)
		elseif name == 'animexist' or name == 'selfanimexist' then
			assert(#args == 1, 'AnimExist requires one ID')
			return Expression.integer(if args[1].number ~= nil and p.animations[args[1].number :: number] then 1 else 0)
		end
		assert(#args == 0, 'Unsupported function ' .. name)
		if name == 'random' then
			s.rng = (1664525 * s.rng + 1013904223) % 4294967296
			return Expression.integer(s.rng % 1000)
		end
		local values = { time=s.time, statetime=s.time, stateno=s.stateNo, prevstateno=s.prevStateNo, anim=s.anim, animtime=animationTime(p,s),
			ctrl=if s.ctrl then 1 else 0, facing=s.facing, power=s.power, movecontact=s.moveContact, movehit=s.moveHit,
			moveguarded=s.moveGuarded, hitpausetime=s.hitPause }
		if values[name] ~= nil then return Expression.integer(values[name]) end
		local floating = { ['pos x']=s.x, ['pos y']=s.y, ['vel x']=s.vx, ['vel y']=s.vy }
		if floating[name] ~= nil then return Expression.float(floating[name]) end
		if name == 'statetype' then return Expression.string(s.stateType) elseif name == 'movetype' then return Expression.string(s.moveType) end
		if name == 's' or name == 'c' or name == 'a' or name == 'l' or name == 'i' or name == 'h' or name == 'n' then return Expression.string(string.upper(name)) end
		error('Unsupported trigger ' .. name)
	end }
end
local function number(p: Program, s: Snapshot, text: string): number
	assert(p.expressions[text], 'Uncompiled parameter expression')
	return Expression.number(Expression.evaluate(p.expressions[text], context(p,s)))
end
local function enum(text: string, allowed: string): string
	local result = string.upper((string.gsub(text, '%s+', '')))
	assert(#result == 1 and string.find(allowed, result, 1, true), 'Unsupported state enum ' .. text)
	return result
end
local function seekVisible(p: Program, s: Snapshot)
	local animation = p.animations[s.anim]
	for _ = 1, #animation.durations + 1 do
		if animation.durations[s.animElem] ~= 0 then return end
		s.animElem += 1
		if s.animElem > #animation.durations then s.animElem = animation.loopStart; s.animWrapped = true end
	end
	error('Non-progressing AIR animation')
end
local function changeAnimation(p: Program, s: Snapshot, id: number, element: number?)
	assert(integer(id) and p.animations[id], 'Missing animation ' .. tostring(id))
	local elem = element or 1; local durations = p.animations[id].durations
	assert(integer(elem) and elem >= 1 and elem <= #durations, 'Invalid animation element')
	s.anim = id; s.animPosition = 0; s.animElem = elem; s.elemTime = 0; s.animWrapped = false
	for i = 1, elem - 1 do assert(durations[i] >= 0, 'Cannot seek past a held AIR element'); s.animPosition += durations[i] end
	seekVisible(p,s)
end
local function enter(p: Program, s: Snapshot, id: number)
	assert(integer(id) and id >= 0 and p.states[id], 'Missing executable state ' .. tostring(id))
	s.prevStateNo = s.stateNo; s.stateNo = id; s.time = 0; s.hit = nil
	s.moveContact = 0; s.moveHit = 0; s.moveGuarded = 0
	for key in s.runs do if string.sub(key, 1, 1) ~= '-' then s.runs[key] = nil end end
	local params = p.states[id].params
	if params.type then s.stateType = enum(params.type, 'SCAL') end
	if params.movetype then s.moveType = enum(params.movetype, 'IAH') end
	if params.physics then s.physics = enum(params.physics, 'SCAN') end
	if params.ctrl then s.ctrl = number(p,s,params.ctrl) ~= 0 end
	if params.velset then
		local parts = splitVector(params.velset); assert(#parts <= 2, 'velset needs one or two values')
		s.vx = number(p,s,parts[1]); s.vy = if parts[2] then number(p,s,parts[2]) else 0
	end
	if params.anim then changeAnimation(p,s,number(p,s,params.anim)) end
	if params.poweradd then s.power = math.clamp(s.power + number(p,s,params.poweradd), 0, 3000) end
	if params.juggle then s.juggle = number(p,s,params.juggle) end
	if params.sprpriority then s.sprPriority = number(p,s,params.sprpriority) end
end
function State.new(p: Program, facing: number?, seed: number?): Snapshot
	local rng = seed or 1; assert(integer(rng) and rng >= 0 and rng < 4294967296, 'Invalid random seed')
	local s: Snapshot = { hitSerial=0,rng=rng,tick=0,started=false,stateNo=p.startState,prevStateNo=p.startState,time=0,stateType='S',moveType='I',physics='N',ctrl=true,
		facing=facing or 1,x=0,y=0,vx=0,vy=0,power=0,juggle=0,sprPriority=0,anim=0,animPosition=0,animElem=1,elemTime=0,animWrapped=false,
		vars={},fvars={},runs={},commands=Commands.new(),moveContact=0,moveHit=0,moveGuarded=0,hitPause=0,events={},
		visual={scale={x=1,y=1},angle=0},presentation={flags={}},explodRequests={},helperRequests={} }
	assert(s.facing == -1 or s.facing == 1, 'Invalid facing')
	enter(p,s,p.startState); assert(p.animations[s.anim], 'Initial state needs an animation')
	return s
end
local function advanceAnimation(p: Program, s: Snapshot)
	local a = p.animations[s.anim]
	-- Preserve AnimTime = 0 on the wrap tick; reset the loop clock on the next tick.
	if s.animWrapped then
		s.animPosition = 0
		for i = 1, a.loopStart - 1 do s.animPosition += math.max(0,a.durations[i]) end
		s.animWrapped = false
	end
	s.animPosition += 1; s.elemTime += 1
	local duration = a.durations[s.animElem]
	if duration >= 0 and s.elemTime >= duration then
		s.elemTime = 0; s.animElem += 1
		if s.animElem > #a.durations then s.animElem = a.loopStart; s.animWrapped = true end
		seekVisible(p,s)
	end
end
local function eligible(p: Program, s: Snapshot, c: CompiledController): boolean
	local ctx = context(p,s)
	for _, trigger in c.all do if not Expression.truth(Expression.evaluate(trigger,ctx)) then return false end end
	for _, group in c.groups do
		local passes = true
		for _, trigger in group do if not Expression.truth(Expression.evaluate(trigger,ctx)) then passes = false; break end end
		if passes then return true end
	end
	return false
end
local function execute(p: Program, s: Snapshot, c: CompiledController): boolean
	local v = c.params
	local function get(key: string): number assert(v[key], 'Missing ' .. c.type .. ' parameter ' .. key); return number(p,s,v[key]) end
	local function vector(key: string, x: number, y: number): HitDef.Vector
		if not v[key] then return {x=x,y=y} end
		local parts=splitVector(v[key]); assert(#parts<=2, 'Invalid vector '..key)
		return {x=number(p,s,parts[1]),y=if parts[2] then number(p,s,parts[2]) else y}
	end
	local function scalar(key: string, fallback: number): number return if v[key] then get(key) else fallback end
	if c.type == 'helper' then
		assert(not (s.host and s.host.isHelper), 'Nested helpers are unsupported')
		local request: HelperRequest={id=scalar('id',0),stateNo=get('stateno'),pos=vector('pos',0,0),
			postype=string.lower(v.postype or 'p1'),facing=scalar('facing',1),supermove=scalar('supermove',0)~=0,sprPriority=scalar('sprpriority',0),source=c.source,line=c.line}
		assert(integer(request.id) and integer(request.stateNo) and p.states[request.stateNo], 'Invalid helper state/ID')
		assert((v.helpertype or 'normal')=='normal' and scalar('keyctrl',0)==0, 'Only unkeyed normal helpers are supported')
		assert(request.postype=='p1' or request.postype=='p2', 'Unsupported helper postype')
		assert(math.abs(request.facing)==1, 'Invalid helper facing')
		assert(#(s.helperRequests :: {HelperRequest})<64, 'Helper request capacity exceeded')
		table.insert(s.helperRequests :: {HelperRequest},request)
	elseif c.type == 'destroyself' then
		assert(s.host and s.host.isHelper, 'DestroySelf requires helper context'); s.destroyed=true; s.hit=nil
	elseif c.type == 'gravity' then s.vy+=p.gravity
	elseif c.type == 'explod' then
		local text=v.anim; assert(text, 'Missing Explod anim')
		local prefix=string.match(text,'^%s*([sSfF])')
		local resource=if prefix and string.lower(prefix)=='f' then 'common' else 'self'
		local anim=number(p,s,(string.gsub(text,'^%s*[sSfF]%s*','')))
		assert(integer(anim) and (if resource=='common' then p.commonAnimations[anim] or anim==40 else p.animations[anim]), 'Missing '..resource..' Explod animation '..tostring(anim))
		local request: ExplodRequest={id=scalar('id',-1),anim=anim,resource=resource,pos=vector('pos',0,0),
			postype=string.lower((string.gsub(v.postype or 'p1','%s+',''))),facing=scalar('facing',1),vfacing=scalar('vfacing',1),
			bindtime=scalar('bindtime',1),removetime=scalar('removetime',-2),scale=vector('scale',1,1),sprpriority=scalar('sprpriority',0),
			supermove=scalar('supermove',0)~=0,supermovetime=scalar('supermovetime',0),pausemovetime=scalar('pausemovetime',0),
			removeongethit=scalar('removeongethit',0)~=0,ownpal=scalar('ownpal',0)~=0,
			velocity=vector('velocity',0,0),acceleration=vector('accel',0,0),source=c.source,line=c.line,stateNo=s.stateNo}
		assert(integer(request.id) and integer(request.bindtime) and request.bindtime>=-1 and integer(request.removetime) and request.removetime>=-2, 'Invalid Explod lifetime')
		assert(integer(request.supermovetime) and request.supermovetime>=-1 and integer(request.pausemovetime) and request.pausemovetime>=-1, 'Invalid Explod pause allowance')
		assert(math.abs(request.facing)==1 and math.abs(request.vfacing)==1, 'Invalid Explod facing')
		table.insert(s.explodRequests :: {ExplodRequest},request)
	elseif c.type == 'angledraw' then
		s.visual={scale=vector('scale',1,1),angle=scalar('value',0)}
	elseif c.type == 'assertspecial' then
		local presentation=s.presentation :: Presentation
		for _, key in {'flag','flag2','flag3'} do
			if v[key] then
				local name=string.lower((string.gsub(v[key],'%s+','')))
				assert(name=='intro' or name=='invisible' or name=='noshadow' or name=='nobardisplay' or name=='nobg' or name=='nofg', 'Unsupported visual AssertSpecial '..name)
				presentation.flags[name]=true
			end
		end
	elseif c.type == 'victoryquote' then
		local value=get('value'); assert(integer(value) and value>=-1, 'Invalid victory quote');
		(s.presentation :: Presentation).victoryQuote=value
	elseif c.type == 'varrandom' then
		local index=get('v'); assert(integer(index) and index>=0 and index<60, 'Variable index out of range')
		local range=vector('range',0,1000)
		if v.range and #splitVector(v.range)==1 then range.y=range.x; range.x=0 end
		assert(integer(range.x) and integer(range.y) and range.x<=range.y, 'Invalid VarRandom range')
		s.rng=(1664525*s.rng+1013904223)%4294967296
		s.vars[index]=range.x+s.rng%(range.y-range.x+1)
	elseif c.type == 'projectile' then
		local function scalar(key: string, fallback: number): number return if v[key] then get(key) else fallback end
		local function vector(key: string, x: number, y: number): HitDef.Vector
			if not v[key] then return {x=x,y=y} end
			local parts = splitVector(v[key]); assert(#parts <= 2, 'Invalid projectile vector ' .. key)
			return {x=number(p,s,parts[1]),y=if parts[2] then number(p,s,parts[2]) else y}
		end
		local bounds = vector('projheightbound', -240, 1)
		local request: ProjectileRequest = {hitdef=HitDef.evaluate(c.hitDef :: HitDef.Program,context(p,s)),source=c.source,line=c.line,
			projid=scalar('projid',0),projanim=scalar('projanim',0),projhitanim=scalar('projhitanim',-1),
			projremanim=scalar('projremanim',-1),projremove=scalar('projremove',1),projremovetime=scalar('projremovetime',-1),
			projhits=scalar('projhits',1),projpriority=scalar('projpriority',1),projmisstime=scalar('projmisstime',0),
			projscale=vector('projscale',1,1),offset=vector('offset',0,0),velocity=vector('velocity',0,0),
			velmul=vector('velmul',1,1),acceleration=vector('acceleration',0,0),
			projedgebound=scalar('projedgebound',scalar('projscreenbound',40)),projstagebound=scalar('projstagebound',40),
			projheightbound={bounds.x,bounds.y},postype=string.lower(v.postype or 'p1')}
		assert(p.animations[request.projanim], 'Missing projectile animation')
		table.insert(s.projectileRequests :: {ProjectileRequest}, request)
	elseif c.type == 'nothitby' then
		local duration = if v.time then get('time') else 1
		assert(integer(duration) and duration >= 0, 'Invalid NotHitBy time'); s.unhittableTicks = duration
	elseif c.type == 'superpause' then
		local duration = get('time'); local move = if v.movetime then get('movetime') else 0
		assert(integer(duration) and duration >= 0 and integer(move) and move >= 0, 'Invalid SuperPause time')
		table.insert(s.superPauseRequests :: {SuperPauseRequest}, {time=duration,movetime=move,unhittable=not v.unhittable or get('unhittable') ~= 0,
			darken=not v.darken or get('darken')~=0,anim=scalar('anim',30),pos=vector('pos',0,0)})
		if v.poweradd then s.power=math.clamp(s.power+get('poweradd'),0,3000) end
	elseif c.type == 'hitdef' then
		s.hitSerial += 1
		s.hit = {definition=HitDef.evaluate(c.hitDef :: HitDef.Program, context(p,s)),serial=s.hitSerial,targets={},source=c.source,line=c.line}
		local entries: {Entry} = {}; for _, entry in c.entries do table.insert(entries, table.clone(entry)) end
		table.insert(s.events, {kind='hitDef',controller=c.type,source=c.source,line=c.line,tick=s.tick,stateNo=s.stateNo,time=s.time,entries=entries})
	elseif p.deferred[c.type] then
		local entries: {Entry} = {}; for _, entry in c.entries do table.insert(entries, table.clone(entry)) end
		table.insert(s.events, {kind='unimplementedController',controller=c.type,source=c.source,line=c.line,tick=s.tick,stateNo=s.stateNo,time=s.time,entries=entries})
	elseif c.type == 'changestate' then
		local id = get('value'); local ctrl = if v.ctrl then get('ctrl') else nil; local anim = if v.anim then get('anim') else nil
		enter(p,s,id); if ctrl ~= nil then s.ctrl = ctrl ~= 0 end; if anim ~= nil then changeAnimation(p,s,anim) end
		return true
	elseif c.type == 'changeanim' then changeAnimation(p,s,get('value'),if v.elem then get('elem') else nil)
	elseif c.type == 'ctrlset' then s.ctrl = get('value') ~= 0
	elseif c.type == 'varset' or c.type == 'varadd' then
		assert((v.v ~= nil) ~= (v.fv ~= nil), 'Variable controller needs exactly one of v/fv')
		local float = v.fv ~= nil; local index = get(if float then 'fv' else 'v')
		assert(integer(index) and index >= 0 and index < (if float then 40 else 60), 'Variable index out of range')
		local target = if float then s.fvars else s.vars
		local value = get('value') + (if c.type == 'varadd' then target[index] or 0 else 0)
		target[index] = if float then value else Expression.number(Expression.integer(value))
	elseif c.type == 'poweradd' or c.type == 'powerset' then s.power = math.clamp(get('value') + (if c.type == 'poweradd' then s.power else 0),0,3000)
	elseif c.type == 'sprpriority' then s.sprPriority = get('value')
	elseif c.type == 'statetypeset' then
		if v.statetype then s.stateType = enum(v.statetype,'SCAL') end
		if v.movetype then s.moveType = enum(v.movetype,'IAH') end
		if v.physics then s.physics = enum(v.physics,'SCAN') end
	elseif c.type ~= 'null' then
		local x = if v.x then get('x') else nil; local y = if v.y then get('y') else nil
		if c.type == 'velset' then if x then s.vx=x end; if y then s.vy=y end
		elseif c.type == 'veladd' then s.vx+=x or 0; s.vy+=y or 0
		elseif c.type == 'velmul' then s.vx*=x or 1; s.vy*=y or 1
		elseif c.type == 'posset' then if x then s.x=x end; if y then s.y=y end
		elseif c.type == 'posadd' then s.x+=(x or 0)*s.facing; s.y+=y or 0
		else error('Unsupported controller ' .. c.type) end
	end
	return false
end
local function copy(previous: Snapshot): Snapshot
	local s: Snapshot = table.clone(previous)
	s.vars=table.clone(previous.vars); s.fvars=table.clone(previous.fvars); s.runs=table.clone(previous.runs); s.events={}
	s.projectileRequests={}; s.superPauseRequests={}; s.explodRequests={}; s.helperRequests={}
	s.visual=if previous.visual then {scale=table.clone(previous.visual.scale),angle=previous.visual.angle} else {scale={x=1,y=1},angle=0}
	s.presentation={flags={},victoryQuote=if previous.presentation then previous.presentation.victoryQuote else nil}
	if previous.presentation then for key,value in previous.presentation.flags do (s.presentation :: Presentation).flags[key]=value end end
	if previous.host then s.host=table.clone(previous.host); if previous.host.numExplod then (s.host :: HostContext).numExplod=table.clone(previous.host.numExplod) end end
	if previous.hit then s.hit=table.clone(previous.hit); (s.hit :: ActiveHit).targets=table.clone(previous.hit.targets) end
	return s
end
function State.withContext(previous: Snapshot, host: HostContext): Snapshot
	local s=table.clone(previous); s.host=table.clone(host)
	if host.numExplod then (s.host :: HostContext).numExplod=table.clone(host.numExplod) end
	return s
end
function State.present(p: Program, previous: Snapshot, host: HostContext): Snapshot
	local s=copy(previous); s.host=table.clone(host)
	for _, id in (if s.host and s.host.isHelper then {} else {-3,-2}) do
		local definition=p.states[id]
		if definition then for _, c in definition.controllers do
			if c.type=='explod' or c.type=='assertspecial' or c.type=='angledraw' or c.type=='victoryquote' then
				if eligible(p,s,c) then execute(p,s,c) end
			end
		end end
	end
	return s
end
function State.transition(p: Program, previous: Snapshot, id: number, animation: number?): Snapshot
	local s = copy(previous); enter(p,s,id)
	if animation then changeAnimation(p,s,animation) end
	s.started=false
	return s
end
function State.enterFromHit(p: Program, previous: Snapshot, id: number): Snapshot
	local s = copy(previous); enter(p,s,id); s.started = true
	local transitions = 0
	while true do
		local changed = false
		for _, c in p.states[s.stateNo].controllers do
			if c.persistent == 0 and s.runs[c.key] then continue end
			if eligible(p,s,c) then
				s.runs[c.key] = (s.runs[c.key] or 0) + 1
				if execute(p,s,c) then changed = true; break end
								if s.destroyed then break end
							end
						end
						if not changed then break end
		transitions += 1; assert(transitions <= 32, 'Same-tick state transition limit exceeded')
	end
	return s
end
function State.step(p: Program, previous: Snapshot, input: Commands.Input, feedback: Feedback?, externallyPaused: boolean?, host: HostContext?): Snapshot
	local s = copy(previous); s.tick+=1
	if host then s.host=table.clone(host); if host.numExplod then (s.host :: HostContext).numExplod=table.clone(host.numExplod) end end
	if feedback then
		for key, value in feedback :: any do
			if key == 'hitPauseTicks' then assert(type(value)=='number' and integer(value) and value>=0, 'Invalid hitpause')
			else assert((key=='moveContact' or key=='moveHit' or key=='moveGuarded') and type(value)=='boolean', 'Invalid feedback') end
		end
		if feedback.hitPauseTicks then s.hitPause=feedback.hitPauseTicks end
	end
	local paused = externallyPaused == true or s.hitPause > 0
	s.commands=Commands.step(p.commands,previous.commands,input,s.facing,paused)
	if externallyPaused then return s end
	s.visual={scale={x=1,y=1},angle=0}; (s.presentation :: Presentation).flags={}
	if not paused then s.unhittableTicks = math.max(0,(s.unhittableTicks or 0)-1) end
	if s.started and not paused then s.time+=1; advanceAnimation(p,s) end
	s.started=true
	for _, field in {'moveContact','moveHit','moveGuarded'} do
		local contacted = feedback and ((feedback :: any)[field] or (field=='moveContact' and (feedback.moveHit or feedback.moveGuarded)))
		if contacted then (s :: any)[field]=1
		elseif not paused and (s :: any)[field]>0 then (s :: any)[field]+=1 end
	end
	local function run(id: number): boolean
		local definition = p.states[id]; if not definition then return false end
		for _, c in definition.controllers do
			if paused and not c.ignoreHitPause then continue end
			if c.persistent==0 and s.runs[c.key] then continue end
			local ok, changed = pcall(function(): boolean
				if not eligible(p,s,c) then return false end
				s.runs[c.key]=(s.runs[c.key] or 0)+1
				return execute(p,s,c)
			end)
			assert(ok, c.source .. ':' .. tostring(c.line) .. ' (' .. c.type .. '): ' .. tostring(changed))
			if changed then return true end
						if s.destroyed then return false end
					end
					return false
	end
	if not (s.host and s.host.isHelper) then for _, id in {-3,-2,-1} do run(id) end end
	local transitions=0
	while run(s.stateNo) do transitions+=1; assert(transitions<=32, 'Same-tick state transition limit exceeded') end
	if not paused then
		s.x+=s.vx*s.facing; s.y+=s.vy
		if s.physics=='A' then s.vy+=p.gravity
		elseif s.physics=='S' then s.vx*=p.friction
		elseif s.physics=='C' then s.vx*=p.crouchFriction end
	else s.hitPause-=1 end
	return s
end
return State
