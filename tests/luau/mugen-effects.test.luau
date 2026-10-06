--!strict
local C=require('../../runtime/MugenCombat')
local S=require('../../runtime/MugenState')
local function entries(values: {[string]: string}): {S.Entry}
	local result: {S.Entry}={}; for key,value in values do table.insert(result,{key=key,value=value}) end; return result
end
local function controller(kind: string, values: {[string]: string}): S.Controller
	return {type=kind,entries=entries(values),source='player.cns',line=787}
end
local function fixture(controllers: {S.Controller}?, negative: {S.Controller}?): any
	local states: {any}={}; local animations: {any}={}
	for _, id in {0,10,11,12,150,5000,5150,180,191,192,3010,3999,4050} do
		table.insert(states,{id=id,entries=entries({type=if id>=10 and id<=12 then 'C' else 'S',movetype=if id==3010 then 'A' else 'I',physics='N',anim=tostring(id),ctrl='0'}),controllers=if id==0 then controllers or {} else {}})
		local frames={}; for _=1,2 do table.insert(frames,{attackBoxes=if id==0 or id==3010 then {{5,-10,15,0}} else {},hurtBoxes={{-2,-10,2,0}}}) end
		table.insert(animations,{id=id,durations=if id==3999 then {1,1} else {2,-1},loopStart=1,frames=frames})
	end
	if negative then table.insert(states,{id=-2,entries={},controllers=negative}) end
	return {startState=0,states=states,animations=animations,commonAnimations={{id=40,durations={2,2},loopStart=1}},commands={},combat={life=100,attack=100,defence=100,xscale=1,yscale=1,localcoord={320,240},guardState=150,hitState=5000,guardAnim=150,hitAnims={High={Light=5000}}}}
end
local count=0
local function test(name: string, run: () -> ()) run(); count+=1; print('PASS effects: '..name) end
local function explod(values: {[string]: string}?): S.Controller
	local params={trigger1='time=0',persistent='0',anim='3999',id='3999',removetime='-2',pos='3,-4',bindtime='-1'}
	for key,value in values or {} do params[key]=value end
	return controller('Explod',params)
end
local function effects(s: C.Snapshot): {C.Effect} return s.effects :: {C.Effect} end

test('evaluated source request distinguishes S/self and F/common with provenance',function()
	local config=fixture({explod({anim='S 3999'}),explod({anim='F 40',id='13580',postype='left',scale='1,1.2',supermove='1',ownpal='1',removetime='160'})})
	local p=S.compile(config); local s=S.step(p,S.new(p),{})
	local requests=s.explodRequests :: {S.ExplodRequest}
	assert(#requests==2 and requests[1].resource=='self' and requests[2].resource=='common')
	assert(requests[2].anim==40 and requests[2].scale.y==1.2 and requests[2].source=='player.cns' and requests[2].line==787)
	assert(requests[2].ownpal and requests[2].supermove)
end)
test('player binding tracks position and detaches after finite bindtime',function()
	local config=fixture({explod({bindtime='2',removetime='-1'})}); local p=C.compile({config,fixture()})
	local s=C.step(p,C.new(p,{0,80}),{{},{}}); assert(effects(s)[1].x==3 and effects(s)[1].y==-4 and effects(s)[1].space=='world')
	s.fighters[1].state.vx=5
	s=C.step(p,s,{{},{}}); assert(effects(s)[1].x==8)
	s=C.step(p,s,{{},{}}); assert(effects(s)[1].x==8 and s.fighters[1].state.x==10)
end)
test('left screen coordinates are camera independent and back uses owner facing',function()
	local config=fixture({explod({postype='left',pos='-30,10',removetime='160'}),explod({postype='back',pos='0,0',removetime='-1'})})
	local p=C.compile({fixture(),config}); local s=C.step(p,C.new(p,{-80,80}),{{},{}})
	assert(effects(s)[1].space=='screen' and effects(s)[1].x==-30 and effects(s)[1].y==10)
	assert(effects(s)[2].x==320)
	s.fighters[2].state.vx=7; s=C.step(p,s,{{},{}}); assert(effects(s)[1].x==-30 and effects(s)[2].x==320)
end)
test('AIR end -2 removes while -1 loops and held frames survive until explicit lifetime',function()
	local config=fixture({explod(),explod({id='2',removetime='-1'}),explod({id='3',anim='4050',removetime='3'})})
	local p=C.compile({config,fixture()}); local s=C.step(p,C.new(p),{{},{}})
	local before=s; s=C.step(p,s,{{},{}}); assert(effects(s)[1].animElem==2 and effects(before)[1].animElem==1)
	s=C.step(p,s,{{},{}}); assert(#effects(s)==2 and effects(s)[1].id==2 and effects(s)[1].animElem==1)
	s=C.step(p,s,{{},{}}); assert(#effects(s)==1 and effects(s)[1].id==2)
end)
test('source supermovetime -1 advances, explicit 40 allowance advances; supermove overrides',function()
	local config=fixture({explod({id='1',removetime='-1',supermovetime='-1'}),explod({id='2',removetime='40',supermovetime='40'}),explod({id='3',removetime='-1'}),explod({id='4',removetime='-1',supermove='1'}),controller('SuperPause',{trigger1='time=0',persistent='0',time='4',movetime='0'})})
	local p=C.compile({config,fixture()}); local s=C.step(p,C.new(p),{{},{}})
	for age=1,4 do s=C.step(p,s,{{},{}}); assert(effects(s)[1].age==age and effects(s)[2].age==age and effects(s)[3].age==0 and effects(s)[4].age==age) end
	assert(s.fighters[1].state.time==0)
end)
test('normal pause allowance advances entities but leaves fighter clocks frozen',function()
	local config=fixture({explod({id='1',removetime='-1',pausemovetime='2'}),explod({id='2',removetime='-1',pausemovetime='-1'})})
	local p=C.compile({config,fixture()}); local s=C.step(p,C.new(p),{{},{}}); s.pauseTime=3
	for tick=1,3 do s=C.step(p,s,{{},{}}); assert(effects(s)[1].age==math.min(tick,2) and effects(s)[2].age==tick and s.fighters[1].state.time==0) end
end)
test('AngleDraw resets per tick and does not alter AIR collisions or damage',function()
	local visual=controller('AngleDraw',{trigger1='time=0',scale='1.5,0.5',value='45'})
	local hit=controller('HitDef',{trigger1='time=0',attr='S,NA',damage='20',pausetime='0,0'})
	local config=fixture({visual,hit}); local p=C.compile({config,fixture()}); local s=C.step(p,C.new(p,{0,10}),{{},{}})
	assert(s.events[1].damage==20 and s.fighters[2].life==80)
	assert((s.fighters[1].state.visual :: S.Visual).scale.y==0.5 and (s.fighters[1].state.visual :: S.Visual).angle==45)
	s=C.step(p,s,{{},{}}); assert((s.fighters[1].state.visual :: S.Visual).scale.x==1 and (s.fighters[1].state.visual :: S.Visual).angle==0)
end)
test('gethit removes only authored effects, guard does not',function()
	local target=fixture({explod({id='1',removetime='-1',removeongethit='1'}),explod({id='2',removetime='-1'})})
	local attacker=fixture({controller('HitDef',{trigger1='time=0',attr='S,NA',damage='20',guardflag='MA'})})
	local p=C.compile({attacker,target}); local s=C.step(p,C.new(p,{0,10}),{{},{}})
	assert(#effects(s)==1 and effects(s)[1].id==2)
	local start=C.new(p,{0,10}); start.fighters[2].state.ctrl=true; s=C.step(p,start,{{},{right=true}})
	assert(s.events[1].kind=='guard' and #effects(s)==2)
end)
test('negative-state NumExplod counts new requests immediately, flags expire and quotes redirect',function()
	local finish=explod({anim='F 40',id='13580',postype='left',removetime='160',supermove='1'})
	finish.entries=entries({triggerall='win && !wintime',trigger1='numexplod(13580)=0',anim='F 40',id='13580',postype='left',removetime='160',supermove='1'})
	local config=fixture({}, {controller('VictoryQuote',{trigger1='1',value='1+(random%5)'}),controller('VictoryQuote',{triggerall='numenemy',trigger1='enemy,name = "Rocky"',value='10'}),finish,controller('AssertSpecial',{trigger1='numexplod(13580)=1',flag='NoBarDisplay',flag2='NoBG',flag3='NoFG',ignorehitpause='1'})})
	local p=S.compile(config); local s=S.step(p,S.new(p),{},nil,nil,{win=true,wintime=0,numenemy=1,enemyName='Rocky'})
	assert(#(s.explodRequests :: {S.ExplodRequest})==1 and (s.presentation :: S.Presentation).flags.nobg and (s.presentation :: S.Presentation).victoryQuote==10)
	s=S.step(p,s,{},nil,nil,{win=true,wintime=1,numenemy=1,numExplod={[13580]=1}}); assert(#(s.explodRequests :: {S.ExplodRequest})==0 and (s.presentation :: S.Presentation).flags.nofg)
	s=S.step(p,s,{},nil,nil,{numenemy=0}); assert(not (s.presentation :: S.Presentation).flags.nofg)
end)
test('intro flags and VarRandom are deterministic inclusive and immutable',function()
	local config=fixture({controller('VarRandom',{trigger1='time=0',v='1',range='0,200'}),controller('AssertSpecial',{trigger1='time<2',flag='Intro'})})
	local p=S.compile(config); local previous=S.new(p,1,77); local a=S.step(p,previous,{}); local b=S.step(p,previous,{})
	assert(a.vars[1]==b.vars[1] and a.vars[1]>=0 and a.vars[1]<=200 and previous.vars[1]==nil)
	assert((a.presentation :: S.Presentation).flags.intro); a=S.step(p,a,{}); a=S.step(p,a,{}); assert(not (a.presentation :: S.Presentation).flags.intro)
end)
test('winning special emits common finish before victory transition with visible global flags',function()
	local finish=controller('Explod',{triggerall='win && !wintime',trigger1='stateno=[3000,3999] && numexplod(13580)=0',anim='F 40',id='13580',postype='left',removetime='160',supermove='1'})
	local config=fixture({}, {finish,controller('AssertSpecial',{trigger1='numexplod(13580)=1',flag='NoBG'})})
	config.startState=3010
	for _, state in config.states do if state.id==3010 then state.controllers={controller('HitDef',{trigger1='time=0',attr='S,NA',damage='100',pausetime='0,0'})} end end
	local p=C.compile({config,fixture()}); local s=C.step(p,C.new(p,{0,10}),{{},{}})
	assert(s.finished and s.winner==1 and #effects(s)==1 and effects(s)[1].resource=='common' and effects(s)[1].id==13580)
	assert((s.presentation :: S.Presentation).flags.nobg)
	s=C.step(p,s,{{},{}}); assert(#effects(s)==1 and effects(s)[1].age==1)
end)
test('authored crouch squash formulas follow live Time without gameplay scaling',function()
	local config=fixture({}, {controller('AngleDraw',{triggerall='stateno=10',trigger1='1',scale='1.0 + 0.5/6*Time, 1.0 - 0.5/6*Time',value='0'}),controller('AngleDraw',{triggerall='stateno=11',trigger1='time>0',scale='1.5,0.5',value='0'}),controller('AngleDraw',{triggerall='stateno=12',trigger1='1',scale='1.0 + 0.5/6*(6-Time), 1.0 - 0.5/6*(6-Time)',value='0'})})
	local p=S.compile(config); local s=S.transition(p,S.new(p),10)
	for tick=0,6 do s=S.step(p,s,{}); local scale=(s.visual :: S.Visual).scale; assert(math.abs(scale.x-(1+0.5/6*tick))<1e-9 and math.abs(scale.y-(1-0.5/6*tick))<1e-9) end
	s=S.transition(p,s,11); s=S.step(p,s,{}); s=S.step(p,s,{}); assert((s.visual :: S.Visual).scale.x==1.5)
	s=S.transition(p,s,12); s=S.step(p,s,{}); assert((s.visual :: S.Visual).scale.y==0.5)
	for _=1,6 do s=S.step(p,s,{}) end; assert((s.visual :: S.Visual).scale.x==1)
end)
test('authored 40-tick screen layer expires during pause without mutation',function()
	local config=fixture({explod({anim='4050',id='4050',postype='left',pos='0,0',bindtime='-1',removetime='40',sprpriority='-7',supermovetime='40',removeongethit='1',ownpal='1'})})
	local p=C.compile({config,fixture()}); local s=C.step(p,C.new(p),{{},{}}); local before=s
	s.superPause={owner=1,remaining=45,moveRemaining=0,unhittable=true}
	for age=1,39 do s=C.step(p,s,{{},{}}); assert(#effects(s)==1 and effects(s)[1].age==age and effects(s)[1].sprpriority==-7) end
	s=C.step(p,s,{{},{}}); assert(#effects(s)==0 and #effects(before)==1 and effects(before)[1].age==0)
end)
test('public host setter isolates context and roundstate defaults to fighting',function()
	local config=fixture({controller('VarSet',{trigger1='roundstate=1',v='2',value='7'})})
	local p=S.compile(config); local original=S.new(p); local host: S.HostContext={roundstate=1,numExplod={[4]=1}}
	local intro=S.withContext(original,host); host.numExplod={[4]=2}; host.roundstate=3
	assert(original.host==nil and (intro.host :: S.HostContext).roundstate==1 and ((intro.host :: S.HostContext).numExplod :: {[number]: number})[4]==1)
	intro=S.step(p,intro,{}); assert(intro.vars[2]==7)
	local fight=S.step(p,original,{}); assert(fight.vars[2]==nil)
end)
test('F40 without fightfx is explicitly procedural and other missing common actions reject',function()
	local config=fixture({explod({anim='F 40',postype='left',removetime='3'})}); config.commonAnimations=nil
	local p=C.compile({config,fixture()}); local s=C.step(p,C.new(p),{{},{}})
	assert(#effects(s)==1 and effects(s)[1].flags.procedural and effects(s)[1].resource=='common')
	for _=1,2 do s=C.step(p,s,{{},{}}); assert(effects(s)[1].animElem==1) end
	s=C.step(p,s,{{},{}}); assert(#effects(s)==0)
	config=fixture({explod({anim='F 999'})}); config.commonAnimations=nil
	local machine=S.compile(config); assert(not pcall(function() S.step(machine,S.new(machine),{}) end))
end)
test('winner exposes source quote text without audio or manifest lookup',function()
	local config=fixture({controller('HitDef',{trigger1='time=0',attr='S,NA',damage='100',pausetime='0,0'})}, {controller('VictoryQuote',{trigger1='1',value='10'})})
	config.combat.victoryQuotes={['10']='fixture presentation'}
	local p=C.compile({config,fixture()}); config.combat.victoryQuotes['10']='changed fixture'
	local s=C.step(p,C.new(p,{0,10}),{{},{}})
	assert(s.winner==1 and s.victoryQuote=='fixture presentation' and (s.presentation :: S.Presentation).victoryQuote==10)
end)
print(tostring(count)..' effects tests passed')
