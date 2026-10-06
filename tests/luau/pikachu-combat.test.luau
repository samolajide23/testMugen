--!strict
local C=require('../../runtime/MugenCombat')
local S=require('../../runtime/MugenState')
local H=require('../../runtime/MugenHitDef')
local config=require('../../generated/luau/pikachu-checkpoint')
local p=C.compile({config,config})
local count=0
local function test(name: string, run: () -> ()) run(); count+=1; print('PASS Pikachu combat: '..name) end

test('eleven original normals hit, guard, whiff and finish in both slots and facings',function()
	for _,id in {200,210,220,230,240,250,400,410,420,600,610} do
		for slot=1,2 do for _,reverse in {false,true} do for _,mode in {'hit','guard','whiff'} do
			local distance=if mode=='whiff' then 400 else 20
			local s=C.new(p,if reverse then {distance/2,-distance/2} else {-distance/2,distance/2})
			s.fighters[slot].state=S.transition(p[slot].machine,s.fighters[slot].state,id)
			if id>=600 then s.fighters[slot].state.y=-10 end
			local contact=false
			for _=1,150 do
				local inputs: {any}={{},{}}
				if mode=='guard' then inputs[3-slot]=if s.fighters[3-slot].state.facing==1 then {left=true} else {right=true} end
				s=C.step(p,s,inputs)
				for _,event in s.events do
					if event.attacker==slot then
						contact=true
						assert(event.kind==mode and event.source=='pikachu.cns' and event.stateNo==id)
						if mode=='hit' then assert(event.damage>0) else assert(event.damage==0) end
					end
				end
			end
			assert(contact==(mode~='whiff'),tostring(id)..' '..mode)
			assert(s.fighters[slot].state.ctrl and s.fighters[slot].state.stateNo==0)
		end end end
	end
end)
test('human buttons select standing, crouching and airborne source states',function()
	for slot=1,2 do
		for _,route in {{'x',200,0},{'y',210,0},{'a',220,0},{'x',400,11},{'y',410,11},{'a',420,11},{'x',600,50},{'y',610,50}} do
			local s=C.new(p,{-200,200})
			local state=route[3] :: number
			if state~=0 then s.fighters[slot].state=S.transition(p[slot].machine,s.fighters[slot].state,state) end
			if state==50 then s.fighters[slot].state.y=-40 end
			local inputs: {any}={{},{}}
			inputs[slot]={[route[1] :: string]=true,down=state==11}
			s=C.step(p,s,inputs)
			assert(s.fighters[slot].state.stateNo==route[2])
		end
	end
end)
test('source contact and body-distance gates enable close combos but reject distant cancels',function()
	for slot=1,2 do for _,reverse in {false,true} do
		for _,distance in {20,200} do
			local s=C.new(p,if reverse then {distance/2,-distance/2} else {-distance/2,distance/2})
			s.fighters[slot].state=S.transition(p[slot].machine,s.fighters[slot].state,200)
			s.fighters[slot].state.started=true; s.fighters[slot].state.time=7
			s.fighters[slot].state.moveContact=1
			local inputs: {any}={{},{}}; inputs[slot]={x=true}
			s=C.step(p,s,inputs)
			assert(s.fighters[slot].state.stateNo==(if distance==20 then 230 else 200))
		end
	end end
end)
test('permissive parameters keep first source value while strict compilation still rejects duplicates',function()
	assert(not pcall(function()
		local strict=table.clone(config); strict.permissiveParameters=false
		C.compile({strict,strict})
	end))
	local s=C.new(p,{-10,10})
	for tick=1,30 do
		s=C.step(p,s,{{x=tick==1},{}})
		if s.fighters[1].state.hit then
			local hit=s.fighters[1].state.hit :: S.ActiveHit
			assert(hit.definition.groundVelocity.x==-3 and hit.definition.groundVelocity.y==0)
			assert(hit.definition.hitTime==10 and hit.definition.slideTime==3)
			local palette=hit.definition.presentation.palette :: {[string]: {number}}
			assert(palette.time[1]==15 and palette.sinadd[4]==6)
			return
		end
	end
	error('Source HitDef was not activated')
end)
test('Pikachu and Coiny compile together without character-specific combat execution',function()
	local coiny=require('../../generated/luau/coiny-checkpoint')
	for _,configs in {{config,coiny},{coiny,config}} do
		local mixed=C.compile(configs)
		local s=C.new(mixed,{-10,10})
		local damage=false
		for tick=1,100 do
			s=C.step(mixed,s,{{x=tick==1},{}})
			for _,event in s.events do damage=damage or event.kind=='hit' end
		end
		assert(damage and s.fighters[1].state.ctrl)
	end
end)
test('Med and fall animation hints compile as explicit presentation metadata',function()
	local hit=H.evaluate(H.compile({attr='A,NA',animtype='Med',['fall.animtype']='Down'}),{resolve=function() error('Unexpected trigger') end})
	assert(hit.animType=='Medium' and hit.presentation.fallAnimType=='Down' and not hit.presentation.supported)
end)
print('Pikachu combat: '..count..' tests passed')
