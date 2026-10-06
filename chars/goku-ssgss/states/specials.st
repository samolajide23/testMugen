;---------------------------------------------------------------------------
; Ki blast
[Statedef 1000]
type=S
physics=S
movetype=A
anim=1000
ctrl=0
velset=0,0
poweradd=72
sprpriority=1
facep2=1


[State 1000, Strength]
type = varset
trigger1 = !time && !AIlevel
var(10) = ifelse(command = "z", 3, ifelse(command = "y", 2, 1))
[State 1000, Strength AI]
type = varset
trigger1 = !time && AIlevel
var(10) = ifelse((p2movetype = H || random < 500), 3, ifelse(random < 500, 2, 1))

[State 1000, width]
type = width
trigger1 = animelemtime(5) = -1
value = 30,0

[State 0, Explod]
type = Explod
trigger1 = animelem = 3
anim = 1007
ID = 1007
pos = 40,-79
postype = p1
removetime = -2
pausemovetime = 0
supermovetime = 0
scale = .5,.5
sprpriority = 5
ownpal = 1

[State 1205, 1]
type = PlaySnd
trigger1 = AnimElem = 1
value = 1100,0

[State 1205, 1]
type = PlaySnd
trigger1 = AnimElem = 3
value = 1100,1

[State 0, Helper]
type = Helper
trigger1 = animelemtime(3)=1;animelem = 3
helpertype = normal
name = "Ki Blasts"
ID = 1000
stateno = 1005
pos = 40,-79
postype = p1
ownpal = 1
supermovetime = 0
pausemovetime = 0
size.xscale = 1
size.yscale = 1


[State 1000, End]
type = changestate
trigger1 = !animtime
value = 0
ctrl = 1
;Ki Push
[Statedef 1020]
type    = S
movetype= A
physics = N
juggle  = 7
velset = 0,0
anim = 1020
ctrl = 0
sprpriority = 2
poweradd=72*!var(20)

[State 1000, width]
type = width
trigger1 = animelemtime(2) = 8
player= 30, 0
edge=50,0
value = 30,0


[State 220, snd]
type = playsnd
triggerall = var(55)=0		;Voice=Japan
trigger1 = animelem=3
value = 3,5+random%3
channel = 0

[State 200, 1];voice
type = PlaySnd
triggerall = var(55)=1		;Voice=English
trigger1 = animelem=3
value = 3,105+random%2
channel = 0


[State 200, 1]
type = PlaySnd
trigger1 = AnimElemtime(3)=0
value = 1,33

[State 0, Explod]
type = Explod
trigger1 = animelem =3
anim = 1007
ID = 1007
pos = 40,-79
postype = p1
removetime = -2
pausemovetime = 0
supermovetime = 0
scale = .5,.5
sprpriority = 5
ownpal = 1

[State 1000, lkb]
type = Helper
helpertype = normal
trigger1 = AnimElemtime(3)=0
name = "EXkiblast"
postype = P1
pos = 80,-80
ownpal = 1
stateno = 1025
id = 1025

[State 1000, Relax]
type = statetypeset
trigger1 = animelem = 4
movetype = I

[State 1000, 7]
type = ChangeState
trigger1 = AnimTime = 0
value = 0
ctrl = 1
[Statedef 1050]
type    = S
movetype= A
physics = N
juggle  = 7
velset = 0,0
anim = 1050
ctrl = 0
sprpriority = 2
poweradd=72*!var(20)

[State 1000, width]
type = width
trigger1 = animelemtime(3) = 2
player= 30, 0
edge=50,0
value = 30,0


[State 220, snd]
type = playsnd
triggerall = var(55)=0		;Voice=Japan
trigger1 = animelem=3
value = 3,5+random%3
channel = 0

[State 200, 1];voice
type = PlaySnd
triggerall = var(55)=1		;Voice=English
trigger1 = animelem=3
value = 3,105+random%2
channel = 0


[State 200, 1]
type = PlaySnd
trigger1 = AnimElemtime(3)=0
value = 1,33

[State 0, Explod]
type = Explod
trigger1 = animelem =3
anim = 1007
ID = 1007
pos = 40,-100
postype = p1
removetime = -2
pausemovetime = 0
supermovetime = 0
scale = .5,.5
sprpriority = 5
ownpal = 1

[State 1000, lkb]
type = Helper
helpertype = normal
trigger1 = AnimElemtime(3)=0
name = "EXkiblast"
postype = P1
pos = 80,-80
ownpal = 1
stateno = 1051
id = 1051

[State 1000, Relax]
type = statetypeset
trigger1 = animelem = 4
movetype = I

[State 1000, 7]
type = ChangeState
trigger1 = AnimTime = 0
value = 0
ctrl = 1

;-----------------------------------------------------------------------------------
;
[Statedef 1100, Arrow Knee]
type    = S
movetype =  A
physics = S
juggle = 8
velset = 0,0
anim = 1100
poweradd = 0
ctrl = 0
sprpriority = 2
poweradd=72*!var(20)



[State 1000, Strength]
type = varset
trigger1 = !time && !AIlevel
var(10) = ifelse(command = "z", 3, ifelse(command = "y", 2, 1))
[State 1000, Strength AI]
type = varset
trigger1 = !time && AIlevel
var(10) = ifelse((p2movetype = H || random < 500), 3, ifelse(random < 500, 2, 1))

[State 1200, VarSet]
type = VarSet
trigger1 =!time
var(10) = 3
ignorehitpause = 1

[State 1200, MAX Timer Drain]
type=VarAdd
trigger1=!Time
trigger1=var(20) > 0
var(20)=-250

[State 1200, Custom Combo Juggle Reset]
type=VarSet
trigger1=!Time && var(20)
var(15)=0
ignoreHitPause=1


[State 1200, NotHitBy]
type = NotHitBy
trigger1 =Animelemtime(5)<0
value = SCA,AP
time = 1
ignorehitpause =1

[State 1200,0]
type = VelSet
trigger1 = Animelem = 3
x = 18


[State 1400, Width]
type = Width
trigger1 =animelemtime(2)>=0&&animelemtime(5)<0
edge = 30,0
player = 30,0

[State 1200,0]
type = ChangeState
trigger1 =!time && !AIlevel
value = ifelse(command = "z", 1103, ifelse(command = "y", 1102, 1101))

[State 1200,0]
type = ChangeState
trigger1 =!time && AIlevel
value = ifelse((p2movetype = H || random < 500), 1103, ifelse(random < 500, 1102, 1101))


;------------------------------------------------------------------------------
[Statedef 1101]
type = A
movetype = A
physics = N
anim = 1101
velset = 4.5,-10.0
ctrl = 0


[State 1210, Width]
type = Width
trigger1 =animelemtime(1)>=0&&animelemtime(2)<0
edge = 10,0
player = 10,0

[State 1210, NotHitBy]
type=NotHitBy
trigger1=AnimElemTime(1) < 0
time=1
value=SCA

[State 1210,1]
type = VelAdd
trigger1 = Time >= 0
y = 0.75

[State 1210, Dust Helper]
type=Helper
trigger1 = Time = 0
helperType=Normal
stateNo=7100
ID=7100
name="Jump Dust"
posType=P1
ownPal=1

[State 1210,0]
type = PlaySnd
trigger1 = Time = 0
value = 1100, 0

[State 1210,0]
type = PlaySnd
trigger1 = Time = 0
value = 41, 0

[State 1210,0]
type = PlaySnd
trigger1 = Time = 0
value = 0, 0

[State 1210,0]
type = PlaySnd
trigger1 = Time = 0
value = 1100, 4


[State 1210,2]
type = HitDef
trigger1 = Animelem = 1
attr = A, SA
animtype = Hard
hitflag = MAF
guardflag = MA
damage = 20, 10
getpower=30* !var(20),15* !var(20)
givepower=20,20
hitsound=S2, 5
guardsound = S2,0
sparkno = s7030 + (random % 8)
guard.sparkno =  s7001
sparkxy = -10 + 0*(var(35):=50), var(36):=-75
pausetime = 7, 6
ground.slidetime = 15
ground.type = High
ground.velocity = -4.0,-8.0
air.velocity = -5.0,-7.0
fall.recover = 0
air.recover = 0
fall = 1
palfx.time = 12*var(9)
palfx.add = 255,255,255
palfx.sinadd= -255,-255,-255,48
envshake.time = 10
envshake.ampl = 5

[State 1210,2]
type = HitDef
trigger1 = Animelem = 2
attr = A, SA
animtype = Hard
hitflag = MAF
guardflag = MA
damage = 20, 10
getpower=30* !var(20),15* !var(20)
givepower=20,20
hitsound=S2, 5
guardsound = S2,0
sparkno = s7030 + (random % 8)
guard.sparkno =  s7001
sparkxy = -10 + 0*(var(35):=50), var(36):=-75
pausetime = 6, 6
ground.slidetime = 15
ground.type = High
ground.velocity = -4.0,-8.0
air.velocity = -5.0,-5.0
fall.recover = 0
air.recover = 0
fall = 1
palfx.time = 12*var(9)
palfx.add = 255,255,255
palfx.sinadd= -255,-255,-255,48
envshake.time = 10
envshake.ampl = 5
fall.envshake.time = 15
fall.envshake.ampl = 5

[State 1210,4]
type = ChangeState
trigger1 = Vel Y >= 0
value = 1104



[Statedef 1102]
type = A
movetype = A
physics = N
anim = 1102
velset = 4.5,-10.0
ctrl = 0

[State 1210, Width]
type = Width
trigger1 =animelemtime(1)>=0&&animelemtime(2)<0
edge = 10,0
player = 10,0

[State 1210, NotHitBy]
type=NotHitBy
trigger1=AnimElemTime(1) < 0
time=1
value=SCA

[State 1210,1]
type = VelAdd
trigger1 = Time >= 0
y = 0.75

[State 1210, Dust Helper]
type=Helper
trigger1 = Time = 0
helperType=Normal
stateNo=7100
ID=7100
name="Jump Dust"
posType=P1
ownPal=1

[State 1210,0]
type = PlaySnd
trigger1 = Time = 0
value = 1100, 0

[State 1210,0]
type = PlaySnd
trigger1 = Time = 0
value = 41, 0

[State 1210,0]
type = PlaySnd
trigger1 = Time = 0
value = 0, 0

[State 1210,0]
type = PlaySnd
trigger1 = Time = 0
value = 1100, 4


[State 1210,2]
type = HitDef
trigger1 = Animelem = 1
attr = A, SA
animtype = Hard
hitflag = MAF
guardflag = MA
damage = 20, 10
getpower=30* !var(20),15* !var(20)
givepower=20,20
hitsound=S2, 5
guardsound = S2,0
sparkno = s7030 + (random % 8)
guard.sparkno =  s7001
sparkxy = -10 + 0*(var(35):=50), var(36):=-75
pausetime = 7, 6
ground.slidetime = 15
ground.type = High
ground.velocity = -4.0,-8.0
air.velocity = -5.0,-7.0
fall.recover = 0
air.recover = 0
fall = 1
palfx.time = 12*var(9)
palfx.add = 255,255,255
palfx.sinadd= -255,-255,-255,48
envshake.time = 10
envshake.ampl = 5

[State 1210,2]
type = HitDef
trigger1 = Animelem = 2
attr = A, SA
animtype = Hard
hitflag = MAF
guardflag = MA
damage = 20, 10
getpower=30* !var(20),15* !var(20)
givepower=20,20
hitsound=S2, 5
guardsound = S2,0
sparkno = s7030 + (random % 8)
guard.sparkno =  s7001
sparkxy = -10 + 0*(var(35):=50), var(36):=-75
pausetime = 6, 6
ground.slidetime = 15
ground.type = High
ground.velocity = -4.0,-8.0
air.velocity = -5.0,-5.0
fall.recover = 0
air.recover = 0
fall = 1
palfx.time = 12*var(9)
palfx.add = 255,255,255
palfx.sinadd= -255,-255,-255,48
envshake.time = 10
envshake.ampl = 5
fall.envshake.time = 15
fall.envshake.ampl = 5

[State 1210,4]
type = ChangeState
trigger1 = Vel Y >= 0
value = 1104

[Statedef 1103]
type = A
movetype = A
physics = N
anim = 1103
velset = 4.5,-10.0
ctrl = 0


[State 1210, Width]
type = Width
trigger1 =animelemtime(1)>=0&&animelemtime(2)<0
edge = 10,0
player = 10,0

[State 1210, NotHitBy]
type=NotHitBy
trigger1=AnimElemTime(1) < 0
time=1
value=SCA

[State 1210,1]
type = VelAdd
trigger1 = Time >= 0
y = 0.75

[State 1210, Dust Helper]
type=Helper
trigger1 = Time = 0
helperType=Normal
stateNo=7100
ID=7100
name="Jump Dust"
posType=P1
ownPal=1

[State 1210,0]
type = PlaySnd
trigger1 = Time = 0
value = 1100, 0

[State 1210,0]
type = PlaySnd
trigger1 = Time = 0
value = 41, 0

[State 1210,0]
type = PlaySnd
trigger1 = Time = 0
value = 0, 0

[State 1210,0]
type = PlaySnd
trigger1 = Time = 0
value = 1100, 4


[State 1210,2]
type = HitDef
trigger1 = Animelem = 1
attr = A, SA
animtype = Hard
hitflag = MAF
guardflag = MA
damage = 30, 12
getpower=30* !var(20),15* !var(20)
givepower=20,20
hitsound=S2, 5
guardsound = S2,0
sparkno = s7030 + (random % 8)
guard.sparkno =  s7001
sparkxy = -10 + 0*(var(35):=50), var(36):=-75
pausetime = 7, 6
ground.slidetime = 15
ground.type = High
ground.velocity = -4.0,-8.0
air.velocity = -5.0,-7.0
fall.recover = 0
air.recover = 0
fall = 1
palfx.time = 12*var(9)
palfx.add = 255,255,255
palfx.sinadd= -255,-255,-255,48
envshake.time = 10
envshake.ampl = 5

[State 1210,2]
type = HitDef
trigger1 = Animelem = 2
attr = A, SA
animtype = Hard
hitflag = MAF
guardflag = MA
damage = 30, 12
getpower=30* !var(20),15* !var(20)
givepower=20,20
hitsound=S2, 5
guardsound = S2,0
sparkno = s7030 + (random % 8)
guard.sparkno =  s7001
sparkxy = -10 + 0*(var(35):=50), var(36):=-75
pausetime = 6, 6
ground.slidetime = 15
ground.type = High
ground.velocity = -4.0,-8.0
air.velocity = -5.0,-5.0
fall.recover = 0
air.recover = 0
fall = 1
palfx.time = 12*var(9)
palfx.add = 255,255,255
palfx.sinadd= -255,-255,-255,48
envshake.time = 10
envshake.ampl = 5
fall.envshake.time = 15
fall.envshake.ampl = 5

[State 1210,4]
type = ChangeState
trigger1 = Vel Y >= 0
value = 1104

;---------------------------------------------------------------------------------
[Statedef 1104]
type = A
movetype = A
physics = N
anim = 1104
velset = 6.5,-6.0
ctrl = 0

[State 1220,0]
type = VelAdd
trigger1 = Time >= 0
y = .65



[State 1220,1]
type = Explod
trigger1 = AnimElem = 4
anim = 1150
pos = -24,-130
postype = P1
sprpriority = 3
scale = .5,.5
bindtime = 1
ignorehitpause = 1
ownpal = 1
velocity = .05,.05


[State 1220,2]
type = HitDef
trigger1 = time = 0
attr = A, SA
animtype = Hard
hitflag = MAF
guardflag = HA
damage = 30, 10
getpower=30* !var(20),15* !var(20)
givepower=20,20
hitsound=S2, 5
guardsound = S2,0
sparkno = s7030 + (random % 8)
guard.sparkno =  s7001
sparkxy = -10 + 0*(var(35):=50), var(36):=-65
pausetime = 7,6
ground.hittime = 24
ground.slidetime = 18
ground.type = High
ground.velocity = -6.3  
air.velocity = -8.0,15.5
fall.yvelocity = -4.0
fall.recover = 0
air.recover = 0
fall = 1
palfx.time = 12*var(9)
palfx.add = 255,255,255
palfx.sinadd= -255,-255,-255,48
envshake.time = 10
envshake.ampl = 5
fall.envshake.time = 15
fall.envshake.ampl = 5

[State 1220,4]
type = ChangeState
trigger1 = Pos Y >= 0
value = 1105
;------------------------------------------------------------------------------------
[Statedef 1105]
type = S
movetype = I
physics = S
anim = 1105
velset = 0, 0
ctrl = 0

[State 1230,0]
type = PosSet
trigger1 = Time = 0
y = 0

[State 1230, Landing Sound]
type = PlaySnd
trigger1 = !Time
value = 52,0

[State 1230, Landing Dust Explod]
type = Explod
trigger1 = !Time
anim = 7106
sprPriority = -3
posType = P1
scale = 0.5,0.5
pauseMoveTime = -1
superMoveTime = -1
ownPal = 1

[State 1230,1]
type = ChangeState
trigger1 = AnimTime = 0
value = 0
ctrl = 1

;Instant transmission
[Statedef 1200]
type = S
movetype = I
physics = S
anim = 1204
juggle = 0
velset = 0,0
ctrl = 0
sprpriority = 2
poweradd=72*!var(20)


[State 1400, nothitby]
type=nothitby
triggerall= animelemtime(6)<=ifelse((var(10)=3 || var(10)=-3),35,20)
trigger1= animelemtime(6)<0
trigger2= vel x<0 && backedgebodydist > ifelse((var(10)=3 || var(10)=-3), 14, 9)
trigger3= vel x>0 && frontedgebodydist> ifelse((var(10)=3 || var(10)=-3), 14, 9)
value=SCA,AA,AP,AT
time=ifelse(life<=250,32,2)
ignorehitpause=1

[State 1200, not hit]
type = NotHitBy
trigger1 = animelem = 3
time = 16
value = SCA

[State 1200, pos]
type = PosAdd
trigger1 = AnimElem = 5
x = -185

[State 1200, sound]
type = PlaySnd
trigger1 = AnimElem = 3
value = 300, 0

[State 1200, land]
type = PlaySnd
trigger1 = AnimElem = 7
value = 0, 2

[State 1200,zanzou]
type = explod
trigger1 = AnimElem = 4
anim = 1203
pos = 0,0
postype = p1
sprpriority = 2
ownpal = 1
removetime = 4
removeongethit = 0

[State 1200,lines1]
type = explod
trigger1 = time = 11
anim = 1201
pos = 0,0
postype = p1
sprpriority = 3
ownpal = 1
removetime = 9
removeongethit = 0

[State 1200,lines2]
type = explod
trigger1 = AnimElem = 5
anim = 1201
pos = 0,0
postype = p1
sprpriority = 3
ownpal = 1
removetime = 9
removeongethit = 0

[State 1200, landdust1];’…’nƒzƒRƒŠ1
type = explod
trigger1 = AnimElem = 7
postype = p1
pos = -17,0
spacing = 1
anim = 4010
ownpal = 1
scale = .5, .5
supermove = 1

[State 1200, landdust];’…’nƒzƒRƒŠ2
type = explod
trigger1 = AnimElem = 7
postype = p1
pos = 20,0
facing = -1
spacing = 1
anim = 4010
ownpal = 1
scale = .5, .5
supermove = 1

[State 1200, proj]
type = Helper
trigger1 = AnimElem = 4
pos = 0, 0
postype = p1
stateno = 6700
helpertype = normal
name = "warp"
id = 6700
ownpal = 1
size.xscale = .01
size.yscale = .01

[State 1200, end]
type = ChangeState
Trigger1 = AnimTime = 0
value = 0
ctrl = 1


;Instant Transmission
[Statedef 1250]
type = S
movetype = I
physics = S
anim = 1200
juggle = 0
sprpriority = 2
poweradd=72*!var(20)
velset = 0,0
ctrl = 0

[State 1400, nothitby]
type=nothitby
triggerall= animelemtime(6)<=ifelse((var(10)=3 || var(10)=-3),35,20)
trigger1= animelemtime(6)<0
trigger2= vel x<0 && backedgebodydist > ifelse((var(10)=3 || var(10)=-3), 14, 9)
trigger3= vel x>0 && frontedgebodydist> ifelse((var(10)=3 || var(10)=-3), 14, 9)
value=SCA,AA,AP,AT
time=ifelse(life<=250,32,2)
ignorehitpause=1

[State 1250, not hit]
type = NotHitBy
trigger1 = animelem = 3
time = 16
value = SCA

[State 1250, push]
type = PlayerPush
trigger1 = Time = [0,14]
value = 0

[state 1250, pos]
type = posadd
trigger1 = AnimElem = 5
x = p2bodydist x + 150

[state 1250, turn]
type = turn
trigger1 = p2bodydist x < 0

[State 1250, sound]
type = PlaySnd
trigger1 = AnimElem = 3
value = 300, 0

[State 1250, land]
type = PlaySnd
trigger1 = AnimElem = 7
value = 0, 2

[State 1250,zanzou]
type = explod
trigger1 = AnimElem = 4
anim = 1202
pos = 0,0
postype = p1
sprpriority = 2
ownpal = 1
removetime = 4
removeongethit = 0

[State 1250,lines1]
type = explod
trigger1 = time = 11
anim = 1201
pos = 0,0
postype = p1
sprpriority = 3
ownpal = 1
removetime = 9
removeongethit = 0

[State 1250,lines2]
type = explod
trigger1 = AnimElem = 5
anim = 1201
pos = 0,0
postype = p1
sprpriority = 3
ownpal = 1
removetime = 9
removeongethit = 0

[State 1250, landdust1];’…’nƒzƒRƒŠ1
type = explod
trigger1 = AnimElem = 7
postype = p1
pos = -17,0
spacing = 1
anim = 4010
ownpal = 1
scale = .5, .5
supermove = 1

[State 1250, landdust];’…’nƒzƒRƒŠ2
type = explod
trigger1 = AnimElem = 7
postype = p1
pos = 20,0
facing = -1
spacing = 1
anim = 4010
ownpal = 1
scale = .5, .5
supermove = 1

[State 1250, end]
type = ChangeState
Trigger1 = AnimTime = 0
value = 0
ctrl = 1

;
[statedef 1300]
type = s
movetype = a
physics = s
anim = 1300
poweradd = 50
ctrl = 0
sprpriority = 2
poweradd=72*!var(20)

[State 1300]
type = playsnd
trigger1 = time = 0
value = s1300,0
volume = 255


[State 1300, state]
type = ChangeState
trigger1 = animtime = 0
value = 1302
ctrl = 0

;-----------------(‹ó’†)
[statedef 1301]
type = a
movetype = a
physics = s
anim = 1301
poweradd = 50
ctrl = 0
velset = 0,0

[State 1301]
type = playsnd
trigger1 = time = 0
value = s1300,0
volume = 255

[State 1301, state]
type = ChangeState
trigger1 = animtime = 0
value = 1303
ctrl = 0

;-----------------------------“Ëi
[Statedef 1302]
type = A
movetype = A
physics = N
anim = 1302
poweradd = 0
juggle = 1
velset = 0
ctrl = 0

[State 1302]
type = AfterImage
trigger1 = AnimElem = 1
time = 2

[State 1302]
type = AfterImageTime
trigger1 = AnimElemTime(1) >= 0
time = 2

[State 1302, 1]
type = VelSet
trigger1 = Time = 0
x = 8.5
y = -4

[State 1302, 3]
type = VelAdd
trigger1 = Time > 0
x = .3
y = .45

[state 1302, ]
type = hitdef
trigger1 = animelem = 3
attr = S, SA
hitflag = maf
guarDFlag = ma
animtype = hard
priority = 7,hit
damage = 60,5
pausetime = 30,45
guard.pausetime = 15,10
guard.sparkno = s7001
sparkno = s7030+(random%8)
sparkxy = -10,-55
hitsound=S2, 5
guardsound = S2,0
ground.type = low
ground.hittime  = 30
ground.velocity = -15,0
airguard.velocity = -15,0
p1stateno = 1310
forcestand = 1
envshake.time = 20
envshake.freq = 70
envshake.ampl = -6
envshake.phase = 30
kill = 0
p2facing = 1

[state 1302, ]
type = changestate
trigger1 = Vel Y > 0 && Pos Y >= 0 || animtime = 0
value = 1105
ctrl = 1

[state 1302, ]
type = changestate
trigger1 = moveguarded
value = 1105
ctrl = 1


;-----------------------------‹ó’†“Ëi
[Statedef 1303]
type = A
movetype = A
physics = N
anim = 1302
poweradd = 0
juggle = 1
velset = 0
ctrl = 0

[State 1303]
type = AfterImage
trigger1 = AnimElem = 1
time = 2

[State 1303]
type = AfterImageTime
trigger1 = AnimElemTime(1) >= 0
time = 2

[State 1303, 1]
type = VelSet
trigger1 = Time = 0
x = 8.5
y = -4

[State 1303, 3]
type = VelAdd
trigger1 = Time > 0
x = .3
y = .45

[state 1303, ]
type = hitdef
trigger1 = animelem = 3
attr = S, SA
hitflag = maf
guarDFlag = ma
animtype = hard
priority = 7,hit
damage = 60,5
pausetime = 30,35
guard.pausetime = 15,10
guard.sparkno = s7001
sparkno = s7030+(random%8)
sparkxy = -10,-55
hitsound=S2, 5
guardsound = S2,0
ground.type = low
ground.hittime  = 30
ground.velocity = -15,0
airguard.velocity = -15,0
p1stateno = 1310
forcestand = 1
envshake.time = 20
envshake.freq = 70
envshake.ampl = -6
envshake.phase = 30
kill = 0
p2facing = 1

[state 1303, ]
type = changestate
trigger1 = Vel Y > 0 && Pos Y >= 0 || animtime = 0
value = 1105
ctrl = 1

[state 1303, ]
type = changestate
trigger1 = moveguarded
value = 41
ctrl = 0

;---------------------ƒ~ƒX‚Á‚½ê‡
[Statedef 1305]
type    = S
movetype= A
physics = S
ctrl = 0
anim = 1304

[State 1730, 1]
type = VelSet
trigger1 = Time = 0
x = 15
y = 0

[State 1730, 3]
type = VelAdd
trigger1 = Time > 0
x = .15

[state 1730, 2]
type = posset
trigger1 = time = 0
y =0


[State 1730, Landing Sound]
type = PlaySnd
trigger1 = animelem = 2
value = 0, 2

[State 3020, End]
type = changestate
trigger1 = Pos Y >= 0 && Vel Y > 0
value = 52

;------------------------“–‚Á‚½ê‡
[statedef 1310]
type = s
movetype = a
physics = s
anim = 1303
ctrl = 0
velset = 0,0

[State 1710, muteki]
type = NotHitBy
trigger1 = 1
value = SCA

[state 1710, ]
type = bindtotarget
trigger1 = 1
time = 1
pos = 35,0,Foot
persistent = 0

[state 1710, ]
type = turn
trigger1 = anim = 1303 && animelem = 1

[State 1710, snd]
type = playsnd
trigger1 = animelem = 1
trigger2 = animelem = 13
value = 8,1

[state 1710, 1]
type = hitdef
trigger1 = animelem = 10 
attr = s, sa
damage = 60, 20
animtype = heavy
guarDFlag = ma
hitflag = maf
priority = 7
pausetime = 40,15
sparkno = s7030+(random%8)
sparkxy = -50,-80
hitsound=S2, 5
guardsound = S2,0
ground.type = trip
ground.slidetime = 5
ground.hittime  = 30
ground.velocity = -15, -10
airguard.velocity = -1.9,-.8     
air.velocity = -15, -10
fall = 1
fall.damage = 20                      
envshake.time = 20
envshake.freq = 70
envshake.ampl = -6
envshake.phase = 30
kill = 0        

[state 1710, ]
type = screenbound
trigger1 = anim = 1303 && animelem = 10 || anim = 1304 && animelem = 5
value = 0
movecamera = 0,0
ignorehitpause = 1

[state 1710, ]
type = changeanim
trigger1 = anim = 1303 && animtime = 0
value = 1304
persistent = 0
ignorehitpause = 0

[state 1720, ]
type = bindtotarget
trigger1 = anim = 1303 && animelem = 16
time = -1
pos = -50,100,head

[state 1720, 1]
type = hitdef
trigger1 = anim = 1304 && animelem = 11 
attr = A, SA
damage = 60, 20
animtype = hard;Diagup
guarDFlag = ma
hitflag = maf
priority = 7
pausetime = 40,15
sparkno = s7030+(random%8)
sparkxy = -10,-60
hitsound=S2, 5
guardsound = S2,0
ground.type = high;low
ground.slidetime = 5
ground.hittime  = 30
ground.velocity = 0, 20
airguard.velocity = -1.9,-.8     
air.velocity = 0, 20
fall = 1
fallrecover = 0
fall.damage = 20
envshake.time = 30
envshake.freq = 70
envshake.ampl = -5
envshake.phase = 20
fall.envshake.time = 30
fall.envshake.freq = 70
fall.envshake.ampl = -5
fall.envshake.phase = 20
p2stateno =1111500; 5010
id = 1304

[state 1720, explod2]
type = explod
trigger1 = movecontact && p2stateno = 5100
anim = 4021
id = 1720
pos = -20,12
postype = p2
ontop = 1;sprpriority = 5
ownpal = 1
removetime = 16
removeongethit = 0
ignorehitpause = 1
persistent = 0

[State 1720, snd]
type = playsnd
trigger1 = movecontact && p2stateno = 5100
value = s3000,9
volume = 255
ignorehitpause = 1
persistent = -1

[State 1720, 0]
type = TargetState
trigger1 = movehit && p2stateno = 5101 && win != 1
value = 1350
elem = 1

[State 1220,0]
type = VelAdd
trigger1 = anim = 1304&&animelem=14;time=50
y = 15

[state 1720, end]
type = changestate
trigger1 = Pos Y >= 0 && Vel Y > 0;animtime = 0
value = 1105
ctrl = 1

;---------------------------’@‚«‚Â‚¯‚ç‚ê‚½‚Q‚o

[Statedef 1350]
type    = L
movetype= H
physics = N
velset = 0,0

;[State 1750, 1]
;type = NotHitBy
;trigger1 = Time = 0
;value = SCA
;time = 60

[State 1750, 1]
type = PosSet
trigger1 = 1
y = 0

[State 1750, p2]
type = ChangeAnim2
Trigger1 = Time = 0
value = 5110

[State 1750, dead]
type = SelfState
trigger1 = time = 10 && !alive
value = 5150
ctrl = 0

[State 1750, up]
type = SelfState
Trigger1 = Time = 60
value = 5120
ctrl = 1

