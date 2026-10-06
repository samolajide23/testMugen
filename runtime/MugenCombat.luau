--!strict
local State = require('./MugenState')
local Commands = require('./MugenCommands')
local HitDef = require('./MugenHitDef')
local Common = require('./MugenCommon')
local Combat = { TICKS_PER_SECOND = 60 }
-- Entity scope: source AIR projectiles, hit/guard/removal and SuperPause clocks.
-- Screen edges use a 320px camera centered between fighters; stage bounds are
-- opt-in. Projectile clashes, helpers and full MUGEN juggle rules
-- are not implemented. Falling targets share a bounded 15-point air.juggle budget.
export type Settings = { life: number, attack: number, defence: number, xscale: number, yscale: number,
	localcoord: {number}, guardState: number, hitState: number, guardAnim: number, hitAnims: {[string]: {[string]: number}}, common: Common.Settings?, stageBounds: {number}?, airJuggle: number?, winState: number?, introState: number?, loseState: number?, name: string?, victoryQuotes: {[string]: string}? }
export type Config = State.Config & { combat: Settings }
type Frame = { attackBoxes: {{number}}, hurtBoxes: {{number}} }
type Character = { machine: State.Program, settings: Settings, frames: {[number]: {Frame}} }
export type Program = {Character}
export type Reaction = { kind: string, remaining: number, slideRemaining: number, ctrlRemaining: number?,
	fall: boolean?, recover: boolean?, recoverTime: number?, age: number?, gravity: number?, fallVelocity: {x: number,y: number}?, bounced: boolean? }
export type Fighter = { state: State.Snapshot, life: number, reaction: Reaction?, airJumps: number?, previousUp: boolean?, jumpDirection: number?, juggleRemaining: number? }
export type Projectile = { owner: number, id: number, serial: number, stateNo: number, source: string, line: number,
	x: number, y: number, vx: number, vy: number, facing: number, scale: {number}, anim: number, animElem: number, elemTime: number,
	age: number, hits: number, cooldown: number, hitPause: number, removing: boolean, request: any, hit: State.ActiveHit }
export type Helper = {owner: number, id: number, serial: number, state: State.Snapshot, feedback: State.Feedback?, supermove: boolean, source: string, line: number}
export type Effect = { owner: number, id: number, serial: number, resource: string, anim: number, animElem: number, elemTime: number,
	x: number, y: number, space: string, facing: number, vfacing: number, scale: {x: number,y: number}, sprpriority: number,
	age: number, bindAge: number, vx: number, vy: number, anchor: number?, helperAnchor: number?, request: State.ExplodRequest,
	source: string, line: number, stateNo: number, flags: {[string]: boolean} }
export type SuperPause = { owner: number, remaining: number, moveRemaining: number, unhittable: boolean,
	darken: boolean?, anim: number?, pos: HitDef.Vector?, origin: HitDef.Vector?, age: number? }
export type Event = { kind: string, tick: number, attacker: number, target: number, damage: number,
	stateNo: number, serial: number, source: string, line: number, presentation: any }
export type Snapshot = { tick: number, fighters: {Fighter}, events: {Event}, projectiles: {Projectile}?, projectileSerial: number?, superPause: SuperPause?, finished: boolean?, winner: number?,
	helpers: {Helper}?, helperSerial: number?, effects: {Effect}?, effectSerial: number?, presentation: State.Presentation?, winTime: number?, pauseTime: number?, victoryQuote: string?, intro: boolean? }
type Contact = { attacker: number, target: number, hit: State.ActiveHit, guarded: boolean, facing: number, stateNo: number, projectile: Projectile?, helper: Helper? }
local function finite(n: number): boolean return n == n and math.abs(n) < math.huge end
local function copyBoxes(boxes: {{number}}): {{number}}
	local result: {{number}} = {}
	for _, box in boxes do
		assert(#box == 4, 'AIR box needs four coordinates')
		for _, n in box do assert(finite(n), 'Invalid AIR coordinate') end
		table.insert(result, {math.min(box[1],box[3]),math.min(box[2],box[4]),math.max(box[1],box[3]),math.max(box[2],box[4])})
	end
	return result
end
function Combat.compile(configs: {Config}): Program
	assert(#configs==2, 'Grounded checkpoint needs exactly two fighters')
	local result: Program = {}
	for _, config in configs do
		local settings = config.combat
		assert(settings, 'Missing imported combat constants')
		for _, key in {'life','attack','defence','xscale','yscale'} do
			local n = (settings :: any)[key]; assert(type(n)=='number' and finite(n) and n>=0, 'Invalid combat constant '..key)
		end
		assert(settings.life>0 and settings.life%1==0 and settings.defence>0 and settings.xscale>0 and settings.yscale>0, 'Invalid combat scale/life/defence')
		assert(#settings.localcoord==2 and settings.localcoord[1]==320 and settings.localcoord[2]==240, 'Grounded host currently requires 320x240 local coordinates')
		local character: Character = {machine=State.compile(Common.prepare(config)),settings=table.clone(settings),frames={}}
		if settings.victoryQuotes then character.settings.victoryQuotes=table.clone(settings.victoryQuotes) end
		if settings.common then
			local common = table.clone(settings.common)
			if common.movement then
				common.movement = table.clone(common.movement)
				if common.movement.jump then common.movement.jump = table.clone(common.movement.jump) end
				if common.movement.airJump then common.movement.airJump = table.clone(common.movement.airJump) end
				for key, value in common.movement :: any do
					if type(value) == 'number' then assert(finite(value), 'Invalid movement constant '..key) end
				end
			end
			if common.animations then common.animations = table.clone(common.animations) end
			if common.size then common.size = table.clone(common.size) end
			if common.reactions then common.reactions = table.clone(common.reactions) end
			character.settings.common = common
		end
		assert(settings.airJuggle==nil or (settings.airJuggle>=0 and settings.airJuggle%1==0 and finite(settings.airJuggle)), 'Invalid air juggle budget')
		if settings.stageBounds then
			assert(#settings.stageBounds==2 and finite(settings.stageBounds[1]) and finite(settings.stageBounds[2]) and settings.stageBounds[1]<settings.stageBounds[2], 'Invalid stage bounds')
			character.settings.stageBounds=table.clone(settings.stageBounds)
		end
		character.settings.localcoord=table.clone(settings.localcoord); character.settings.hitAnims={}
		for kind, animations in settings.hitAnims do character.settings.hitAnims[kind]=table.clone(animations) end
		for _, animation in config.animations do
			local frames = (animation :: any).frames :: {Frame}
			assert(frames and #frames==#animation.durations, 'Collision host requires AIR frames for every action')
			local compiled: {Frame}={}
			for _, frame in frames do table.insert(compiled,{attackBoxes=copyBoxes(frame.attackBoxes),hurtBoxes=copyBoxes(frame.hurtBoxes)}) end
			character.frames[animation.id]=compiled
		end
		assert(character.machine.states[settings.guardState] and character.machine.states[settings.hitState], 'Missing host reaction states')
		assert(character.frames[settings.guardAnim], 'Missing guard animation')
		for _, animations in settings.hitAnims do for _, id in animations do assert(character.frames[id], 'Missing hit animation') end end
		table.insert(result,character)
	end
	return result
end
function Combat.new(p: Program, positions: {number}?, withIntro: boolean?): Snapshot
	local x = positions or {-20,20}
	assert(#x==2 and finite(x[1]) and finite(x[2]) and x[1]~=x[2], 'Invalid fighter positions')
	local result: Snapshot={tick=0,fighters={},events={},projectiles={},projectileSerial=0,helpers={},helperSerial=0,effects={},effectSerial=0,presentation={flags={}}}
	for index=1,2 do
		local s=State.new(p[index].machine,if x[index]<x[3-index] then 1 else -1,index)
		s.x=x[index]
		s=State.withContext(s,{roundstate=if withIntro then 1 else 2,numenemy=1,enemyName=p[3-index].settings.name,life=p[index].settings.life})
		if withIntro and p[index].settings.introState then
			s=State.enterFromHit(p[index].machine,s,p[index].settings.introState :: number)
			result.intro=true
		end
		table.insert(result.fighters,{state=s,life=p[index].settings.life,juggleRemaining=p[index].settings.airJuggle or 15})
	end
	return result
end
local function world(box: {number}, s: State.Snapshot, settings: Settings): {number}
	-- AIR sprite offsets/flips do not transform Clsn boxes; character scale and facing do.
	local left=s.x+box[1]*settings.xscale*s.facing; local right=s.x+box[3]*settings.xscale*s.facing
	return {math.min(left,right),s.y+box[2]*settings.yscale,math.max(left,right),s.y+box[4]*settings.yscale}
end
local function overlaps(p: Program, fighters: {Fighter}, attacker: number, target: number): boolean
	local a,b=fighters[attacker].state,fighters[target].state
	local attack=p[attacker].frames[a.anim][a.animElem].attackBoxes
	local hurt=p[target].frames[b.anim][b.animElem].hurtBoxes
	for _, box in attack do
		local x=world(box,a,p[attacker].settings)
		for _, other in hurt do
			local y=world(other,b,p[target].settings)
			if x[1]<=y[3] and x[3]>=y[1] and x[2]<=y[4] and x[4]>=y[2] then return true end
		end
	end
	return false
end
local function flag(flags: string, value: string): boolean return string.find(flags,value,1,true) ~= nil end
local function isGuarding(fighter: Fighter, input: Commands.Input, def: HitDef.Definition): boolean
	local s=fighter.state
	local back=if s.facing==1 then input.left else input.right
	local forward=if s.facing==1 then input.right else input.left
	local eligible = if s.stateType == 'A' then flag(def.guardFlag,'A')
		elseif s.stateType == 'C' then flag(def.guardFlag,'L') or flag(def.guardFlag,'M')
				elseif s.stateType == 'S' and not input.down then flag(def.guardFlag,'H') or flag(def.guardFlag,'M') else false
	return back==true and not forward and eligible
		and (s.ctrl or (fighter.reaction~=nil and fighter.reaction.kind=='guard'))
end
local function priority(a: Contact, b: Contact): (boolean,boolean)
	local x,y=a.hit.definition,b.hit.definition
	if x.priority~=y.priority then return x.priority>y.priority,y.priority>x.priority end
	if x.priorityType=='Dodge' or y.priorityType=='Dodge' then return false,false end
	return x.priorityType=='Hit',y.priorityType=='Hit'
end
local function entityVector(value: any, x: number, y: number): {number}
	if not value then return {x,y} end
	return {value[1] or value.x or x,value[2] or value.y or y}
end
local function projectileAnimation(p: Program, entity: Projectile): boolean
	local a=p[entity.owner].machine.animations[entity.anim]
	for _=1,#a.durations+1 do
		if a.durations[entity.animElem]~=0 then return true end
		entity.animElem+=1
		if entity.animElem>#a.durations then
			if entity.removing then return false end
			entity.animElem=a.loopStart
		end
	end
	error('Non-progressing projectile AIR')
end
local function projectileAdvance(p: Program, entity: Projectile): boolean
	local a=p[entity.owner].machine.animations[entity.anim]
	entity.elemTime+=1
	local duration=a.durations[entity.animElem]
	if duration>=0 and entity.elemTime>=duration then
		entity.elemTime=0; entity.animElem+=1
		if entity.animElem>#a.durations then
			if entity.removing then return false end
			entity.animElem=a.loopStart
		end
	end
	return projectileAnimation(p,entity)
end
local function projectileRemove(p: Program, entity: Projectile, hit: boolean): boolean
	local request=entity.request
	local animation=if hit then request.projhitanim else request.projremanim
	if animation==nil or animation<0 then return false end
	assert(p[entity.owner].frames[animation], 'Missing projectile removal AIR '..tostring(animation))
	entity.anim=animation; entity.animElem=1; entity.elemTime=0; entity.removing=true; entity.vx=0; entity.vy=0
	return projectileAnimation(p,entity)
end
local function projectileOverlap(p: Program, entity: Projectile, victim: Fighter): boolean
	local settings=p[entity.owner].settings
	local position={x=entity.x,y=entity.y,facing=entity.facing} :: any
	local scale=table.clone(settings); scale.xscale*=entity.scale[1]; scale.yscale*=entity.scale[2]
	for _, box in p[entity.owner].frames[entity.anim][entity.animElem].attackBoxes do
		local a=world(box,position,scale)
		for _, hurt in p[3-entity.owner].frames[victim.state.anim][victim.state.animElem].hurtBoxes do
			local b=world(hurt,victim.state,p[3-entity.owner].settings)
			if a[1]<=b[3] and a[3]>=b[1] and a[2]<=b[4] and a[4]>=b[2] then return true end
		end
	end
	return false
end
local function hitEligible(victim: Fighter, def: HitDef.Definition): boolean
	local posture=victim.state.stateType
	local eligible=if posture=='A' then flag(def.hitFlag,'A') elseif posture=='C' then flag(def.hitFlag,'L') or flag(def.hitFlag,'M')
		elseif posture=='L' then flag(def.hitFlag,'F') elseif posture=='S' then flag(def.hitFlag,'H') or flag(def.hitFlag,'M') else false
	if not eligible or (flag(def.hitFlag,'+') and victim.state.moveType~='H') or (flag(def.hitFlag,'-') and victim.state.moveType=='H') then return false end
	if victim.reaction and victim.reaction.fall and def.airJuggle>(victim.juggleRemaining or 15) then return false end
	return true
end
local function effectAnimation(p: Program, e: Effect): State.Animation
	local machine=p[e.owner].machine
	local animation=if e.resource=='common' then machine.commonAnimations[e.anim] else machine.animations[e.anim]
	-- No fightfx assets are bundled: F40 is an explicit procedural held overlay.
	if not animation and e.resource=='common' and e.anim==40 then return {id=40,durations={-1},loopStart=1} end
	assert(animation, 'Missing effect AIR'); return animation
end
local function effectVisible(p: Program, e: Effect): boolean
	local a=effectAnimation(p,e)
	for _=1,#a.durations+1 do
		if e.animElem>#a.durations then
			if e.request.removetime==-2 then return false end
			e.animElem=a.loopStart
		end
		if a.durations[e.animElem]~=0 then return true end
		e.animElem+=1
	end
	error('Non-progressing effect AIR')
end
local function effectAnchor(e: Effect, fighters: {Fighter}, helpers: {Helper}?)
	local r=e.request
	if e.anchor then
		local s=fighters[e.anchor].state
		if e.helperAnchor then
			local found=false
			for _,helper in helpers or {} do if helper.serial==e.helperAnchor then s=helper.state; found=true; break end end
			if not found then return end
		end
		e.x=s.x+r.pos.x*e.facing; e.y=s.y+r.pos.y
	else
		local base=if r.postype=='right' then 320 elseif r.postype=='front' then (if e.facing==1 then 320 else 0)
			elseif r.postype=='back' then (if e.facing==1 then 0 else 320) else 0
		e.x=base+r.pos.x*e.facing; e.y=r.pos.y
	end
end
local function createEffects(p: Program, s: Snapshot)
	for owner,fighter in s.fighters do
		for _, r in fighter.state.explodRequests or {} do
			assert(r.postype=='p1' or r.postype=='p2' or r.postype=='left' or r.postype=='right' or r.postype=='front' or r.postype=='back', 'Unsupported Explod postype')
			s.effectSerial=(s.effectSerial or 0)+1
			local anchor=if r.postype=='p1' then owner elseif r.postype=='p2' then 3-owner else nil
			local facing=if r.postype=='left' or r.postype=='right' then r.facing else fighter.state.facing*r.facing
			local e: Effect={owner=owner,id=r.id,serial=s.effectSerial :: number,resource=r.resource,anim=r.anim,animElem=1,elemTime=0,
				x=0,y=0,space=if anchor then 'world' else 'screen',facing=facing,vfacing=r.vfacing,scale=table.clone(r.scale),sprpriority=r.sprpriority,
				age=0,bindAge=0,vx=r.velocity.x,vy=r.velocity.y,anchor=anchor,request=r,source=r.source,line=r.line,stateNo=r.stateNo,
				flags={supermove=r.supermove,removeongethit=r.removeongethit,ownpal=r.ownpal,
					procedural=r.resource=='common' and r.anim==40 and p[owner].machine.commonAnimations[r.anim]==nil}}
			effectAnchor(e,s.fighters)
			if r.removetime~=0 and effectVisible(p,e) then table.insert(s.effects :: {Effect},e) end
		end
		fighter.state.explodRequests={}
	end
end
local function advanceEffects(p: Program, previous: Snapshot, s: Snapshot, superPaused: boolean, normalPaused: boolean)
	for _, old in previous.effects or {} do
		local e=table.clone(old); e.scale=table.clone(old.scale); e.flags=table.clone(old.flags)
		local r=e.request; local alive=true
		local canMove=not (superPaused or normalPaused)
		if superPaused then canMove=r.supermove or r.supermovetime==-1 or e.age<r.supermovetime
		elseif normalPaused then canMove=r.pausemovetime==-1 or e.age<r.pausemovetime end
		if canMove then
			e.age+=1; e.bindAge+=1
			if r.bindtime==-1 or e.bindAge<r.bindtime then effectAnchor(e,s.fighters,s.helpers)
			else e.x+=e.vx*e.facing; e.y+=e.vy; e.vx+=r.acceleration.x; e.vy+=r.acceleration.y end
			e.elemTime+=1
			local duration=effectAnimation(p,e).durations[e.animElem]
			if duration>=0 and e.elemTime>=duration then e.animElem+=1; e.elemTime=0; alive=effectVisible(p,e) end
			if r.removetime>=0 and e.age>=r.removetime then alive=false end
		end
		if alive then table.insert(s.effects :: {Effect},e) end
	end
end
local function effectsPresentation(p: Program, s: Snapshot)
	local flags: {[string]: boolean}={}; local quote: number?=nil
	for index,fighter in s.fighters do
		local presentation=fighter.state.presentation
		if presentation then
			for name,value in presentation.flags do if value then flags[name]=true end end
			if s.winner==index then quote=presentation.victoryQuote end
		end
	end
	s.presentation={flags=flags,victoryQuote=quote}
	if s.winner and s.winner>0 and quote~=nil then
		local quotes=p[s.winner].settings.victoryQuotes
		s.victoryQuote=if quotes then quotes[tostring(quote)] else nil
	end
end
function Combat.step(p: Program, previous: Snapshot, inputs: {Commands.Input}, hosts: {State.HostContext}?): Snapshot
	assert(#inputs==2 and #previous.fighters==2, 'Exactly two fighters/inputs required')
	if previous.finished or previous.intro then inputs={{},{}} end
	local pause=if previous.superPause and previous.superPause.remaining>0 then table.clone(previous.superPause) else nil
	local next: Snapshot={tick=previous.tick+1,fighters={},events={},projectiles={},projectileSerial=previous.projectileSerial or 0,superPause=pause,finished=previous.finished,winner=previous.winner,
		helpers={},helperSerial=previous.helperSerial or 0,effects={},effectSerial=previous.effectSerial or 0,winTime=if previous.finished then (previous.winTime or 0)+1 else 0,
		pauseTime=math.max(0,(previous.pauseTime or 0)-1),intro=previous.intro}
	local paused: {boolean}={}
	local external: {boolean}={}
	for index=1,2 do external[index]=(pause~=nil and (index~=pause.owner or pause.moveRemaining<=0)) or (previous.pauseTime or 0)>0 end
	for index=1,2 do
		local old=previous.fighters[index]; local s=table.clone(old.state)
		local machine=p[index].machine; local common=p[index].settings.common
		assert(finite(old.life) and old.life>=0 and old.life<=p[index].settings.life, 'Invalid fighter life')
		local reaction: Reaction? = if old.reaction then table.clone(old.reaction) else nil
		local airJumps=old.airJumps or 0
		local jumpDirection=old.jumpDirection
		paused[index]=s.hitPause>0 or external[index]
		if not paused[index] then
			if old.life==0 and s.stateNo~=5150 and s.stateNo~=p[index].settings.loseState and s.y>=0 then
				s=Common.transition(machine,s,common,5150,'ko'); s.y=0; s.vx=0; s.vy=0; reaction=nil
			elseif reaction and old.life>0 then
				if reaction.kind=='down' and reaction.remaining==0 then
					s=Common.transition(machine,s,common,5120,'getUp'); reaction=({kind='getUp',remaining=4,slideRemaining=0} :: Reaction)
				elseif reaction.kind=='getUp' and reaction.remaining==0 then
					s=Common.transition(machine,s,common,0,'idle'); s.ctrl=true; reaction=nil
				elseif reaction.kind~='down' and reaction.kind~='getUp' and (if reaction.kind=='guard' then (reaction.ctrlRemaining or reaction.remaining)==0 else reaction.remaining==0) and not reaction.fall then
					if s.stateType=='A' then s=Common.transition(machine,s,common,50,'jumpNeutral'); s.ctrl=true
					else s=Common.transition(machine,s,common,if inputs[index].down then 11 else 0,if inputs[index].down then 'crouch' else 'idle'); s.ctrl=true end
					reaction=nil
				elseif reaction.fall and reaction.recover and s.y<0 and (reaction.age or 0)>=(reaction.recoverTime or 0)
					and Common.recoveryRequested(s,common,inputs[index].up==true and not old.previousUp) then
					s=Common.transition(machine,s,common,50,'jumpNeutral'); s.ctrl=true; reaction=nil
				end
			end
			if s.ctrl and old.life>0 and s.stateType~='A' then
				local other=previous.fighters[3-index].state
				if s.x~=other.x then s.facing=if s.x<other.x then 1 else -1 end
			end
			if not reaction and old.life>0 then
				s,airJumps=Common.motion(machine,s,common,inputs[index],inputs[index].up==true and not old.previousUp,airJumps,jumpDirection)
				if s.stateNo==40 and old.state.stateNo~=40 then
					local forward=if s.facing==1 then inputs[index].right else inputs[index].left
					local back=if s.facing==1 then inputs[index].left else inputs[index].right
					jumpDirection=if forward and not back then 1 elseif back and not forward then -1 else 0
				elseif s.stateNo~=40 then jumpDirection=nil end
			end
			if reaction and reaction.slideRemaining==0 and s.stateType~='A' then s.vx=0; s.vy=0 end
			if Common.owned(s) or reaction then s.physics='N' end
		end
		if old.life==0 then s.ctrl=false; s.hit=nil end
		local counts: {[number]: number}={}
		for _, effect in previous.effects or {} do if effect.owner==index then counts[effect.id]=(counts[effect.id] or 0)+1 end end
		local helperCounts: {[number]: number}={}
		for _,helper in previous.helpers or {} do if helper.owner==index then helperCounts[helper.id]=(helperCounts[helper.id] or 0)+1 end end
		local host: State.HostContext={numHelper=helperCounts,roundstate=if previous.finished then 3 elseif previous.intro then 1 else 2,win=previous.finished and previous.winner==index,wintime=next.winTime or 0,
			numenemy=1,enemyName=if old.state.host then old.state.host.enemyName else nil,life=old.life,numExplod=counts}
		local opponent = previous.fighters[3-index].state
		local ownCommon, opponentCommon = p[index].settings.common, p[3-index].settings.common
		local ownSize = if ownCommon then ownCommon.size else nil
		local opponentSize = if opponentCommon then opponentCommon.size else nil
		local distance = (opponent.x-s.x)*s.facing
		local ownEdge = (if ownSize then (if distance>=0 then ownSize.groundFront else ownSize.groundBack) else nil) or 0
		local opponentEdge = (if opponentSize then (if (s.x-opponent.x)*opponent.facing>=0 then opponentSize.groundFront else opponentSize.groundBack) else nil) or 0
		host.p2BodyDistX = distance - (if distance>=0 then 1 else -1)*(ownEdge*p[index].settings.xscale+opponentEdge*p[3-index].settings.xscale)
		host.p2BodyDistY = opponent.y-s.y
		if hosts and hosts[index] then for key,value in hosts[index] :: any do (host :: any)[key]=value end end
		s=State.step(machine,s,inputs[index],nil,external[index],host)
		if old.life==0 then
			s.ctrl=false; s.hit=nil
			local loseState=p[index].settings.loseState
			local animation=machine.animations[s.anim]
			if loseState and s.stateNo==5150 and animation and animation.durations[s.animElem]==-1 then
				s=State.enterFromHit(machine,s,loseState)
			end
		end
		if not paused[index] then
			-- Resolve the resulting physics after authored transitions, so jump-to-attack ticks get gravity once.
			if s.stateType=='A' and s.physics=='N' and (Common.owned(s) or reaction) then
				s.vy+=if reaction and reaction.gravity then reaction.gravity else Common.value(common,'gravity',0.44)
			end
			if reaction then
				reaction.remaining=math.max(0,reaction.remaining-1)
				reaction.slideRemaining=math.max(0,reaction.slideRemaining-1)
				reaction.age=(reaction.age or 0)+1
				if reaction.ctrlRemaining then reaction.ctrlRemaining=math.max(0,reaction.ctrlRemaining-1) end
			end
			if s.stateType=='A' and s.y>=0 and s.vy>=0 then
				s.y=0; s.vy=0; s.vx=0; airJumps=0
				if old.life==0 then s=Common.transition(machine,s,common,5150,'ko'); reaction=nil
				elseif reaction and reaction.fall then
					local bounce=reaction.fallVelocity
					if not reaction.bounced and bounce and bounce.y<0 then
						s=Common.transition(machine,s,common,5100,'down'); s.stateType='A'; s.vx=bounce.x; s.vy=bounce.y
						reaction.bounced=true
					else
						s=Common.transition(machine,s,common,5110,'down')
						local duration=if common and common.reactions and common.reactions.liedownTime then common.reactions.liedownTime else 60
						reaction=({kind='down',remaining=duration,slideRemaining=0,recover=reaction.recover} :: Reaction)
					end
				else s=Common.transition(machine,s,common,52,'landing'); s.ctrl=false; reaction=nil end
			elseif reaction and reaction.fall and s.stateType=='A' and s.vy>=0 and s.stateNo~=5050 then
				local vx,vy=s.vx,s.vy
				s=Common.transition(machine,s,common,5050,'fall'); s.vx=vx; s.vy=vy
			end
		end
		table.insert(next.fighters,{state=s,life=old.life,reaction=reaction,airJumps=airJumps,previousUp=if external[index] then old.previousUp else inputs[index].up==true,jumpDirection=jumpDirection,
			juggleRemaining=if reaction then old.juggleRemaining else (p[index].settings.airJuggle or 15)} :: Fighter)
	end
	if pause then pause.remaining-=1; pause.age=(pause.age or 0)+1; pause.moveRemaining=math.max(0,pause.moveRemaining-1); if pause.remaining==0 then next.superPause=nil end end
	for _,old in previous.helpers or {} do
		local helper=table.clone(old)
		local host=table.clone(next.fighters[helper.owner].state.host or {}) :: State.HostContext
		host.isHelper=true
		host.p2BodyDistX=(next.fighters[3-helper.owner].state.x-old.state.x)*old.state.facing
		host.p2BodyDistY=next.fighters[3-helper.owner].state.y-old.state.y
		local helperInput=old.state
		local ownerPower=next.fighters[helper.owner].state.power
		helperInput=table.clone(helperInput); helperInput.power=ownerPower
		local externalPause=(pause~=nil and not helper.supermove) or (previous.pauseTime or 0)>0
				local consumeFeedback=not externalPause and old.state.hitPause==0
				helper.state=State.step(p[helper.owner].machine,helperInput,{},if consumeFeedback then old.feedback else nil,externalPause,host)
				next.fighters[helper.owner].state.power=helper.state.power
				helper.feedback=if consumeFeedback then nil else old.feedback
		if not helper.state.destroyed then table.insert(next.helpers :: {Helper},helper) end
	end
	for owner,fighter in next.fighters do
		for _,request in fighter.state.helperRequests or {} do
			assert(#(next.helpers :: {Helper})<64, 'Helper capacity exceeded')
			local origin=if request.postype=='p2' then next.fighters[3-owner].state else fighter.state
			local state=State.new(p[owner].machine,fighter.state.facing*request.facing)
			state.x=origin.x+request.pos.x*p[owner].settings.xscale*fighter.state.facing; state.y=origin.y+request.pos.y*p[owner].settings.yscale
			state.sprPriority=request.sprPriority; state.power=fighter.state.power
			local host=table.clone(fighter.state.host or {}) :: State.HostContext; host.isHelper=true
			state=State.withContext(state,host)
			state=State.enterFromHit(p[owner].machine,state,request.stateNo)
			next.helperSerial=(next.helperSerial or 0)+1
			if not state.destroyed then table.insert(next.helpers :: {Helper},{owner=owner,id=request.id,serial=next.helperSerial :: number,state=state,supermove=request.supermove,source=request.source,line=request.line}) end
		end
		fighter.state.helperRequests={}
	end
	for _, old in previous.projectiles or {} do
		local entity=table.clone(old); entity.hit=table.clone(old.hit); entity.hit.targets=table.clone(old.hit.targets)
		local alive=true
		if not pause and (previous.pauseTime or 0)==0 then
			if entity.hitPause>0 then entity.hitPause-=1
			else
				entity.age+=1; entity.cooldown=math.max(0,entity.cooldown-1)
				entity.x+=entity.vx*entity.facing; entity.y+=entity.vy
				local r=entity.request; local mul=entityVector(r.velmul,1,1); local acc=entityVector(r.acceleration,0,0)
				entity.vx=entity.vx*mul[1]+acc[1]; entity.vy=entity.vy*mul[2]+acc[2]
				alive=projectileAdvance(p,entity)
				local height=r.projheightbound or {-240,1}
				-- Coiny's 0,0 pair disables height culling rather than deleting its y=-30 toss.
				local outsideHeight=(height[1]~=0 or height[2]~=0) and (entity.y<height[1] or entity.y>height[2])
				local center=(next.fighters[1].state.x+next.fighters[2].state.x)/2
				local outsideEdge=math.abs(entity.x-center)>160+(r.projedgebound or 40)
				local bounds=p[entity.owner].settings.stageBounds
				local outsideStage=bounds~=nil and (entity.x<bounds[1]-(r.projstagebound or 40) or entity.x>bounds[2]+(r.projstagebound or 40))
				if alive and not entity.removing and ((r.projremovetime or -1)>=0 and entity.age>=r.projremovetime or outsideHeight or outsideEdge or outsideStage) then alive=projectileRemove(p,entity,false) end
			end
		end
		if alive then table.insert(next.projectiles :: {Projectile},entity) end
	end
	for owner=1,2 do
		local s=next.fighters[owner].state :: any
		for _, request in s.projectileRequests or {} do
			next.projectileSerial=(next.projectileSerial or 0)+1
			local offset=entityVector(request.offset,0,0); local velocity=entityVector(request.velocity,0,0)
			local hit=request.hitdef or request.hitDef or request.definition
			assert(hit and p[owner].frames[request.projanim], 'Invalid projectile request')
			local origin=if request.postype=='p2' then next.fighters[3-owner].state else s
			assert(request.postype==nil or request.postype=='p1' or request.postype=='p2', 'Unsupported projectile postype')
			assert((request.projhits or 1)>=1 and (request.projhits or 1)%1==0, 'Invalid projectile hit count')
			local scale=entityVector(request.projscale,1,1)
			assert(scale[1]>0 and scale[2]>0 and finite(scale[1]) and finite(scale[2]), 'Invalid projectile scale')
			local entity: Projectile={owner=owner,id=request.projid or 0,serial=next.projectileSerial :: number,stateNo=s.stateNo,
				source=request.source or '?',line=request.line or 0,x=origin.x+offset[1]*s.facing,y=origin.y+offset[2],vx=velocity[1],vy=velocity[2] or 0,
				facing=s.facing,scale=scale,anim=request.projanim,animElem=1,elemTime=0,age=0,hits=request.projhits or 1,
				cooldown=0,hitPause=0,removing=false,request=request,hit={definition=hit,serial=next.projectileSerial :: number,targets={},source=request.source or '?',line=request.line or 0}}
			if projectileAnimation(p,entity) then table.insert(next.projectiles :: {Projectile},entity) end
		end
		s.projectileRequests={}
		for _, rawRequest in s.superPauseRequests or {} do
					local request = rawRequest :: State.SuperPauseRequest
					if request.time>0 then next.superPause={owner=owner,remaining=request.time,moveRemaining=math.min(request.time,request.movetime or 0),unhittable=request.unhittable,
				darken=request.darken,anim=request.anim,pos=request.pos,origin={x=s.x,y=s.y},age=0} end
		end
		s.superPauseRequests={}
	end
	advanceEffects(p,previous,next,pause~=nil,(previous.pauseTime or 0)>0)
	createEffects(p,next)
	local candidates: {[number]: Contact}={}
	for attacker=1,2 do
		local target=3-attacker; local a,b=next.fighters[attacker],next.fighters[target]; local hit=a.state.hit
		if not hit or hit.targets[target] or paused[attacker] or a.life==0 or b.life==0 then continue end
		local def=hit.definition
		local invulnerability=next.superPause or pause
		if not hitEligible(b,def) or (invulnerability and invulnerability.owner==target and invulnerability.unhittable) then continue end
		if overlaps(p,next.fighters,attacker,target) then
			candidates[attacker]={attacker=attacker,target=target,hit=hit,guarded=isGuarding(b,inputs[target],def),facing=a.state.facing,stateNo=a.state.stateNo}
		end
	end
	if candidates[1] and candidates[2] then
		local first,second=priority(candidates[1],candidates[2])
		if not first then candidates[1]=nil end; if not second then candidates[2]=nil end
	end
	for _,helper in next.helpers or {} do
		local virtual=table.clone(next)
		virtual.effects={}
		virtual.fighters={table.clone(next.fighters[1]),table.clone(next.fighters[2])}
		for index=1,2 do virtual.fighters[index].state=table.clone(next.fighters[index].state); virtual.fighters[index].state.explodRequests={} end
		virtual.fighters[helper.owner].state=table.clone(helper.state)
		createEffects(p,virtual)
		next.effectSerial=virtual.effectSerial
		for _,effect in virtual.effects :: {Effect} do
			assert(#(next.effects :: {Effect})<256,'Source Explod capacity exceeded')
			if effect.anchor==helper.owner then effect.helperAnchor=helper.serial end
			table.insert(next.effects :: {Effect},effect)
		end
		helper.state.explodRequests={}
	end
	local contacts: {Contact}={}
	for attacker=1,2 do if candidates[attacker] then table.insert(contacts,candidates[attacker]) end end
	if not pause and (previous.pauseTime or 0)==0 then
		for _, entity in next.projectiles or {} do
			local target=3-entity.owner; local victim=next.fighters[target]
			if not entity.removing and entity.hits>0 and entity.cooldown==0 and entity.hitPause==0 and victim.life>0 and hitEligible(victim,entity.hit.definition)
				and not (next.superPause and next.superPause.owner==target and next.superPause.unhittable) and projectileOverlap(p,entity,victim) then
				table.insert(contacts,{attacker=entity.owner,target=target,hit=entity.hit,guarded=isGuarding(victim,inputs[target],entity.hit.definition),facing=entity.facing,stateNo=entity.stateNo,projectile=entity})
			end
		end
	end
	for _,helper in next.helpers or {} do
		local target=3-helper.owner
		local victim=next.fighters[target]
		local hit=helper.state.hit
		if hit and not hit.targets[target] and helper.state.hitPause==0 and victim.life>0
			and not ((pause~=nil and not helper.supermove) or (previous.pauseTime or 0)>0)
			and not (next.superPause and next.superPause.owner==target and next.superPause.unhittable) and hitEligible(victim,hit.definition) then
			local fighters=table.clone(next.fighters)
			fighters[helper.owner]=table.clone(next.fighters[helper.owner]); fighters[helper.owner].state=helper.state
			if overlaps(p,fighters,helper.owner,target) then table.insert(contacts,{attacker=helper.owner,target=target,hit=hit,guarded=isGuarding(victim,inputs[target],hit.definition),facing=helper.state.facing,stateNo=helper.state.stateNo,helper=helper}) end
		end
	end
	local pauses: {number}={0,0}
	-- Decide both contacts before applying either reaction, so mutual hits are slot independent.
	for _, contact in contacts do
		local attacker=contact.attacker
		local a=if contact.helper then contact.helper.state else next.fighters[attacker].state; local def=contact.hit.definition
		contact.hit.targets[contact.target]=true; a.moveContact=1
		if contact.guarded then a.moveGuarded=1 else a.moveHit=1 end
		if contact.helper then
			contact.helper.feedback={moveContact=true,moveHit=not contact.guarded,moveGuarded=contact.guarded}
			contact.helper.state.hitPause=if contact.guarded then def.guardPause else def.hitPause
		elseif contact.projectile then contact.projectile.hitPause=if contact.guarded then def.guardPause else def.hitPause
		else pauses[attacker]=math.max(pauses[attacker],if contact.guarded then def.guardPause else def.hitPause) end
		local powerOwner=next.fighters[attacker].state
		powerOwner.power=math.clamp(powerOwner.power+(if contact.guarded then def.getPower.y else def.getPower.x),0,3000)
		local victimState=next.fighters[contact.target].state
		victimState.power=math.clamp(victimState.power+(if contact.guarded then def.givePower.y else def.givePower.x),0,3000)
		pauses[contact.target]=math.max(pauses[contact.target],if contact.guarded then def.guardVictimPause else def.victimPause)
	end
	for _, contact in contacts do
		local attacker=contact.attacker
		local target=contact.target; local victim=next.fighters[target]; local def=contact.hit.definition
		if contact.projectile then
			local entity=contact.projectile; entity.hits-=1; entity.cooldown=entity.request.projmisstime or 0
			if entity.hits<=0 and entity.request.projremove~=0 then
				if not projectileRemove(p,entity,true) then entity.hits=-1 end
			end
		end
		if not contact.guarded and def.p1StateNo and def.p1StateNo>=0 then
			if contact.helper then contact.helper.state=State.enterFromHit(p[attacker].machine,contact.helper.state,def.p1StateNo)
			else next.fighters[attacker].state=State.enterFromHit(p[attacker].machine,next.fighters[attacker].state,def.p1StateNo) end
		end
		local fallen=victim.state.stateType=='L'
		if not contact.guarded and victim.reaction and victim.reaction.fall then victim.juggleRemaining=math.max(0,(victim.juggleRemaining or 15)-def.airJuggle) end
		local raw=if contact.guarded then def.guardDamage else def.damage
		local damage=math.min(victim.life,math.max(0,math.floor(raw*p[attacker].settings.attack/p[target].settings.defence)))
		victim.life-=damage
		local settings=p[target].settings; local common=settings.common
		local expanded=def :: any
		local air=victim.state.stateType=='A'; local crouch=victim.state.stateType=='C'
		local velocity=if contact.guarded then (if air then expanded.air.guardVelocity else def.guardVelocity)
			else (if fallen then def.downVelocity elseif air then expanded.air.velocity else def.groundVelocity)
		local falling=if air then def.airFall else def.fall
		local launch=not contact.guarded and (air or velocity.y~=0 or falling)
		local kind=if air then expanded.air.hitType else def.groundType
		local animType=if air then expanded.air.animType else def.animType
		if kind=='None' and not contact.guarded and victim.life>0 then
			table.insert(next.events,{kind='hit',tick=next.tick,attacker=attacker,target=target,damage=damage,
				stateNo=contact.stateNo,serial=contact.hit.serial,source=contact.hit.source,line=contact.hit.line,presentation=def.presentation})
			continue
		end
		if animType=='Back' or kind=='Back' then animType='Hard' end
		local key=if contact.guarded then (if air then 'guardAir' elseif crouch then 'guardCrouch' else 'guardStand')
			elseif launch then 'hitAir' elseif crouch then 'hitCrouch'
			else (if kind=='Low' then 'hitLow' else 'hitStand')..animType
		local animations=settings.hitAnims[kind] or settings.hitAnims[def.groundType]
		local animation=Common.animation(common,key,if contact.guarded then settings.guardAnim else if animations then animations[animType] or animations[def.animType] or settings.guardAnim else settings.guardAnim)
		local state=if contact.guarded then (if air then 152 elseif crouch then 151 else settings.guardState)
			elseif launch then 5020 elseif crouch then 5010 else settings.hitState
		local controllerEvents=victim.state.events
		victim.state=State.transition(p[target].machine,victim.state,state,animation)
		victim.state.events=controllerEvents; victim.state.ctrl=false; victim.state.facing=-contact.facing
		victim.state.stateType=if launch or air then 'A' elseif crouch then 'C' else 'S'
		victim.state.vx=velocity.x; victim.state.vy=velocity.y
		if launch and falling and victim.state.vy==0 then victim.state.vy=-4 end
		local time=if contact.guarded then (if air then expanded.airGuardHitTime or def.guardTime else def.guardTime)
			else (if fallen then def.downHitTime elseif air then expanded.air.hitTime else def.hitTime)
		victim.reaction={kind=if contact.guarded then 'guard' else 'hit',remaining=time,
			slideRemaining=if contact.guarded then (if air then expanded.airGuardSlideTime or def.guardSlideTime else def.guardSlideTime) else def.slideTime,
			ctrlRemaining=if contact.guarded then (if air then expanded.airGuardCtrlTime or def.guardTime else expanded.guardCtrlTime or def.guardTime) else nil,
			fall=not contact.guarded and (falling or fallen),recover=expanded.fallRecover~=false,recoverTime=expanded.fallRecoverTime or 0,
			age=0,gravity=expanded.yaccel,fallVelocity=if fallen and not def.downBounce then {x=0,y=0} else expanded.fallVelocity}
		if victim.life==0 and not launch and not air then
			victim.state=Common.transition(p[target].machine,victim.state,common,5150,'ko'); victim.state.ctrl=false; victim.state.vx=0; victim.state.vy=0
			victim.reaction=nil
		end
		table.insert(next.events,{kind=if contact.guarded then 'guard' else 'hit',tick=next.tick,attacker=attacker,target=target,
			damage=damage,stateNo=contact.stateNo,serial=contact.hit.serial,source=contact.hit.source,line=contact.hit.line,presentation=def.presentation})
	end
	local alive: {Projectile}={}
	for _, entity in next.projectiles or {} do if entity.hits>=0 then table.insert(alive,entity) end end
	next.projectiles=alive
	for index=1,2 do next.fighters[index].state.hitPause=math.max(next.fighters[index].state.hitPause,pauses[index]) end
	if not previous.finished and (next.fighters[1].life==0 or next.fighters[2].life==0) then
		next.finished=true
		next.winner=if next.fighters[1].life==0 and next.fighters[2].life==0 then 0 elseif next.fighters[1].life>0 then 1 else 2
		next.winTime=0
		if next.winner~=0 then
			local index=next.winner :: number
			local fighter=next.fighters[index]
			local host: State.HostContext=table.clone(fighter.state.host or ({} :: State.HostContext)); host.roundstate=3; host.win=true; host.wintime=0
			fighter.state=State.present(p[index].machine,fighter.state,host)
			createEffects(p,next)
			local winState=p[index].settings.winState
			if winState then
				next.fighters[index].state=State.enterFromHit(p[index].machine,next.fighters[index].state,winState)
				next.fighters[index].reaction=nil
			end
		end
		next.projectiles={}; next.superPause=nil
	end
	createEffects(p,next)
	local effects: {Effect}={}
	for _, effect in next.effects or {} do
		local hit=false
		for _, event in next.events do if event.kind=='hit' and event.target==effect.owner then hit=true end end
		if not (effect.request.removeongethit and hit) then table.insert(effects,effect) end
	end
	next.effects=effects; effectsPresentation(p,next)
	if previous.intro and next.fighters[1].state.ctrl and next.fighters[2].state.ctrl then next.intro=false end
	return next
end
return Combat
