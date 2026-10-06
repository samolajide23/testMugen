--!strict
local C=require('../../runtime/MugenCombat')
local S=require('../../runtime/MugenState')
local config=require('../../generated/luau/pikachu-checkpoint')
local p=C.compile({config,config})
local count=0
local function test(name: string,run: () -> ()) run(); count+=1; print('PASS source helper: '..name) end

test('three human special routes spawn independent source helpers in both slots and facings',function()
	for _,posture in {0,11,50} do for slot=1,2 do for _,reverse in {false,true} do
		local s=C.new(p,if reverse then {50,-50} else {-50,50})
		if posture~=0 then s.fighters[slot].state=S.transition(p[slot].machine,s.fighters[slot].state,posture) end
		if posture==50 then s.fighters[slot].state.y=-100 end
		local seen=false
		for tick=1,160 do
			local inputs: {any}={{},{}}
			inputs[slot]={b=tick==1,down=posture==11}
			local old=s
			s=C.step(p,s,inputs)
			if tick==1 then assert(s.fighters[slot].state.stateNo==(if posture==0 then 1001 elseif posture==11 then 1011 else 1021)) end
			assert(#(s.helpers or {})<=1)
			for _,helper in s.helpers or {} do
				seen=true
				assert(helper.owner==slot and helper.id==1002 and helper.state.stateNo==1002)
				assert(helper.state.facing==(if reverse then (if slot==1 then -1 else 1) else (if slot==1 then 1 else -1)))
				assert(helper.state.host and helper.state.host.isHelper)
			end
			for _,helper in old.helpers or {} do
				assert(helper.state.tick<=old.tick)
			end
		end
		assert(seen and #(s.helpers or {})==0,tostring(posture)..':'..tostring(slot)..':'..tostring(reverse)..':'..tostring(seen))
		assert(s.fighters[slot].state.ctrl and s.fighters[slot].state.stateNo==(if posture==11 then 11 else 0))
	end end end
end)

test('helper hits and chip use source AIR and feedback without changing owner contact',function()
	local stationary=table.clone(config); stationary.combat=table.clone(config.combat)
	stationary.combat.common=table.clone(config.combat.common)
	stationary.combat.common.movement=table.clone(config.combat.common.movement)
	stationary.combat.common.movement.walkBack=0
	local p=C.compile({stationary,stationary})
	for slot=1,2 do for _,reverse in {false,true} do for _,guard in {false,true} do
		local s=C.new(p,if reverse then {20,-20} else {-20,20})
		local contact=false
		local contactSerial: number?=nil
		for tick=1,150 do
			local inputs: {any}={{},{}}; inputs[slot]={b=tick==1}
			if guard then inputs[3-slot]=if s.fighters[3-slot].state.facing==1 then {left=true} else {right=true} end
			s=C.step(p,s,inputs)
			for _,event in s.events do
				assert(not contact,'Helper must not hit twice')
				contact=true
				assert(event.attacker==slot and event.stateNo==1002 and event.source=='pikachu.cns')
				assert(event.kind==(if guard then 'guard' else 'hit'))
				assert(event.damage==math.floor((if guard then 10 else 40)*p[slot].settings.attack/p[3-slot].settings.defence),tostring(event.damage))
				for _,helper in s.helpers or {} do if helper.owner==slot then contactSerial=helper.serial; assert(helper.state.moveContact==1) end end
			end
			assert(s.fighters[slot].state.moveContact==0 and s.fighters[slot].state.moveHit==0)
		end
		assert(contact and contactSerial~=nil and #(s.helpers or {})==0,tostring(slot)..':'..tostring(reverse)..':'..tostring(guard)..':'..tostring(contact)..':'..tostring(#(s.helpers or {})))
	end end end
end)

test('whiff lifetime, gravity and snapshots remain deterministic and immutable',function()
	local s=C.new(p,{-300,300})
	local captured: C.Helper?=nil
	local capturedX=0
	local age=0
	for tick=1,180 do
		s=C.step(p,s,{{b=tick==1},{}})
		assert(#s.events==0)
		for _,helper in s.helpers or {} do
			age=math.max(age,helper.state.time)
			if not captured then captured=helper; capturedX=helper.state.x end
			assert(helper.state.y==0 and helper.state.vy==0)
		end
	end
	assert(captured and captured.state.x==capturedX and captured.state.time==0)
	assert(age==59 and #(s.helpers or {})==0)
end)

test('helper requests reset each tick and helper scope never executes root globals',function()
	local fixture=table.clone(config); fixture.states=table.clone(config.states)
	table.insert(fixture.states,{id=-2,entries={},controllers={{type='VarSet',entries={{key='type',value='VarSet'},{key='trigger1',value='1'},{key='v',value='2'},{key='value',value='99'}}}}})
	local machine=S.compile(fixture)
	local root=S.new(machine)
	root=S.withContext(root,{numHelper={}})
	root=S.transition(machine,root,1001)
	for _=1,35 do
		local previous=root
		root=S.step(machine,root,{})
		assert(root.helperRequests~=previous.helperRequests)
	end
	local helper=S.withContext(S.new(machine),{isHelper=true})
	helper=S.enterFromHit(machine,helper,1002)
	helper=S.step(machine,helper,{b=true})
	assert(helper.vars[2]==nil and helper.stateNo==1002)
end)
test('NumHelper includes existing and requested entities and refuses nested spawning',function()
	local fixture=table.clone(config); fixture.states=table.clone(config.states)
	table.insert(fixture.states,{id=9000,entries={{key='anim',value='0'}},controllers={
		{type='Helper',entries={{key='type',value='Helper'},{key='trigger1',value='NumHelper(1002) = 0'},{key='id',value='1002'},{key='stateno',value='1002'}}},
		{type='Helper',entries={{key='type',value='Helper'},{key='trigger1',value='NumHelper(1002) = 0'},{key='id',value='1002'},{key='stateno',value='1002'}}},
		{type='VarSet',entries={{key='type',value='VarSet'},{key='trigger1',value='NumHelper = 1'},{key='v',value='0'},{key='value',value='1'}}},
	}})
	local machine=S.compile(fixture)
	local state=S.transition(machine,S.new(machine),9000)
	state=S.step(machine,state,{})
	assert(#(state.helperRequests or {})==1 and state.vars[0]==1)
	state=S.withContext(state,{numHelper={[1002]=1}})
	state=S.step(machine,state,{})
	assert(#(state.helperRequests or {})==0)
	state=S.withContext(S.transition(machine,S.new(machine),9000),{isHelper=true})
	assert(not pcall(function() S.step(machine,state,{}) end))
end)

test('helper pauses freeze source clocks, preserve contact feedback and enforce entity bounds',function()
	local state=C.new(p,{-300,300})
	for tick=1,50 do
		state=C.step(p,state,{{b=tick==1},{}})
		if #(state.helpers or {})>0 then break end
	end
	assert(#(state.helpers or {})==1)
	local helper=(state.helpers :: {C.Helper})[1]
	helper.supermove=false
	state.superPause={owner=1,remaining=3,moveRemaining=0,unhittable=false,darken=false,anim=30,pos={x=0,y=0},age=0}
	local time,x=helper.state.time,helper.state.x
	for _=1,3 do
		state=C.step(p,state,{{},{}})
		local current=(state.helpers :: {C.Helper})[1]
		assert(current.state.time==time and current.state.x==x)
	end
	state=C.step(p,state,{{},{}})
	assert((state.helpers :: {C.Helper})[1].state.time==time+1)
	local crowded=C.new(p,{-300,300})
	crowded.helpers={}
	for index=1,64 do local copy=table.clone(helper); copy.id=index; copy.serial=index; table.insert(crowded.helpers :: {C.Helper},copy) end
	crowded.fighters[1].state=S.transition(p[1].machine,crowded.fighters[1].state,1001)
	crowded.fighters[1].state.started=true
	crowded.fighters[1].state.animElem=5
	crowded.fighters[1].state.elemTime=-1
	crowded.fighters[1].state.animPosition=0
	for index=1,4 do crowded.fighters[1].state.animPosition+=p[1].machine.animations[1000].durations[index] end
	crowded.fighters[1].state.animPosition-=1
	assert(not pcall(function() C.step(p,crowded,{{},{}}) end))
end)

test('helper source Explod stays anchored to helper and never changes prior snapshots',function()
	local fixture=table.clone(config); fixture.states={}
	for _,original in config.states do
			local definition=table.clone(original)
		if definition.id==1002 then
			definition.controllers=table.clone(definition.controllers)
			table.insert(definition.controllers,1,{type='Explod',entries={
				{key='type',value='Explod'},{key='trigger1',value='Time = 0'},{key='anim',value='1002'},
				{key='id',value='777'},{key='bindtime',value='-1'},{key='removetime',value='10'},{key='pos',value='3,2'},
			}})
		end
		table.insert(fixture.states,definition)
	end
	local program=C.compile({fixture,fixture})
	local state=C.new(program,{-300,300})
	local seen=false
	for tick=1,100 do
		local old=state
		state=C.step(program,state,{{b=tick==1},{}})
		for _,effect in state.effects or {} do
			if effect.id==777 then
				seen=true
				assert(effect.helperAnchor~=nil)
				local matched=false
				for _,helper in state.helpers or {} do
					if helper.serial==effect.helperAnchor then matched=true; assert(effect.x==helper.state.x+3 and effect.y==helper.state.y+2) end
				end
				assert(matched)
			end
		end
		assert(old.tick==tick-1)
	end
	assert(seen and #(state.effects or {})==0)
end)
print('Source helper: '..count..' tests passed')
