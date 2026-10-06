--!strict
local C=require('../../runtime/MugenCombat')
local S=require('../../runtime/MugenState')
local config=require('../../generated/luau/coiny-checkpoint')
local p=C.compile({config,config})
local count=0
local function test(name: string, run: () -> ()) run(); count+=1; print('PASS Coiny visuals: '..name) end
local function step(s: C.Snapshot, ticks: number): C.Snapshot
	for _=1,ticks do s=C.step(p,s,{{},{}}) end
	return s
end

test('optional source intros lock both inputs and restore idle control',function()
	local s=C.new(p,nil,true)
	assert(s.intro and not s.fighters[1].state.ctrl)
	local sawIntro=false
	for _=1,600 do
		s=C.step(p,s,{{right=true,x=true},{left=true,x=true}})
		if s.intro then
			assert(s.fighters[1].state.x==-20 and s.fighters[2].state.x==20)
			sawIntro=sawIntro or s.fighters[1].state.stateNo==191 or s.fighters[1].state.stateNo==192
		else break end
	end
	assert(sawIntro and not s.intro and s.fighters[1].state.ctrl and s.fighters[2].state.ctrl)
end)
test('both authored intro variants finish in either slot',function()
	for slot=1,2 do for id=191,192 do
		local s=C.new(p,nil,true)
		s.fighters[slot].state=S.enterFromHit(p[slot].machine,s.fighters[slot].state,id)
		s=step(s,600)
		assert(not s.intro and s.fighters[slot].state.stateNo==0 and s.fighters[slot].state.ctrl)
	end end
end)
test('source lose pose follows held KO frame and remains stable',function()
	for slot=1,2 do
		local s=C.new(p); s.finished=true; s.winner=3-slot
		s.fighters[slot].life=0
		s.fighters[slot].state=S.enterFromHit(p[slot].machine,s.fighters[slot].state,5150)
		s=step(s,100); assert(s.fighters[slot].state.stateNo==5150)
		s=step(s,160); assert(s.fighters[slot].state.stateNo==170 and s.fighters[slot].state.anim==170)
		s=step(s,30); assert(s.fighters[slot].state.stateNo==170)
	end
end)
test('hyper artwork and common flash preserve source metadata and pause clock',function()
	for _, id in {3000,3010} do
		local s=C.new(p,{-100,100})
		s.fighters[1].state.power=3000
		s.fighters[1].state=S.transition(p[1].machine,s.fighters[1].state,id)
		s=C.step(p,s,{{},{}})
		local pause=s.superPause :: C.SuperPause
		assert(pause.anim==100 and pause.darken and (pause.pos :: {x:number,y:number}).y==(if id==3000 then -30 else -60))
		local effects=s.effects :: {C.Effect}
		assert(#effects==2 and effects[1].anim==3999 and effects[2].anim==4050)
		assert(effects[1].resource=='self' and effects[2].resource=='self')
		s=step(s,5); assert((s.effects :: {C.Effect})[1].age==5 and (s.superPause :: C.SuperPause).age==5)
	end
end)
test('slap continuation disables flash and darkening and permits owner movement',function()
	local s=C.new(p,{-100,100})
	s.fighters[1].state=S.transition(p[1].machine,s.fighters[1].state,3011)
	for _=1,30 do s=C.step(p,s,{{},{}}); if s.superPause then break end end
	local pause=s.superPause :: C.SuperPause
	assert(pause.anim==-1 and pause.darken==false and pause.moveRemaining==270)
end)
test('source crouch scales presentation without altering collision frame data',function()
	local s=C.new(p)
	local boxes=p[1].frames[11][1].hurtBoxes
	s.fighters[1].state=S.transition(p[1].machine,s.fighters[1].state,11)
	s=C.step(p,s,{{down=true},{}})
		s=C.step(p,s,{{down=true},{}})
		local visual=s.fighters[1].state.visual :: S.Visual
	assert(visual.scale.x==1.5 and visual.scale.y==0.5 and p[1].frames[11][1].hurtBoxes==boxes, tostring(s.fighters[1].state.stateNo)..' scale '..visual.scale.x..','..visual.scale.y)
end)
test('real hyper KO creates 160-tick finish and source enemy victory quote',function()
	local s=C.new(p,{-20,20})
	s.fighters[2].life=1
	s.fighters[1].state.power=3000
	s.fighters[1].state=S.transition(p[1].machine,s.fighters[1].state,3010)
	for _=1,100 do
		s=C.step(p,s,{{},{}},{{enemyName='Rocky'},{}})
		if s.finished then break end
	end
	assert(s.finished and s.winner==1 and s.victoryQuote==config.combat.victoryQuotes['10'])
	local finish: C.Effect?=nil
	for _, effect in s.effects or {} do if effect.id==13580 then finish=effect end end
	assert(finish and finish.resource=='common' and finish.anim==40 and finish.request.removetime==160)
	s=step(s,1)
	assert(s.presentation and s.presentation.flags.nobg and s.presentation.flags.nofg and s.presentation.flags.nobardisplay)
	s=step(s,160)
	for _, effect in s.effects or {} do assert(effect.id~=13580) end
	assert(s.presentation and not s.presentation.flags.nobg)
end)
print('Coiny visuals tests passed: '..count)
