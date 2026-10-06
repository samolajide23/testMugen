;---------------------------------------------------------------------------
; SPECIAL MOVES
;---------------------------------------------------------------------------
; Tyrodoken (Weak) 
[Statedef 1000]
type = S
movetype = A
physics = S
anim = 1000
poweradd = 75
juggle = 14
velSet = 3,0
ctrl = 0

[State 1000, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = S1,5
channel = 1

[State 3045, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 1
value = S1000,0
volumescale = 100
channel = 2
loop = 0

[State 1000, Helper]
type = Helper
trigger1 = AnimElem = 1
name = "Tyrodoken (Weak)"
ID = 1001
stateno = 1001
pos = 0,0
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 0


[State 1000, End]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1


; Tyrodoken (Strong) 
[Statedef 1005]
type = S
movetype = A
physics = S
anim = 1000
poweradd = 100
juggle = 14
velSet = 0,0
ctrl = 0

[State 1005, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = S1,5
channel = 1

[State 3045, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 1
value = S1000,0
volumescale = 100
channel = 2
loop = 0

[State 1005, Helper]
type = Helper
trigger1 = AnimElem = 1
name = "Tyrodoken (Strong)"
ID = 1002
stateno = 1002
pos = 0,0
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 0


[State 1005, End]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1

; Tyuken (Weak)
[Statedef 1010]
type = S
movetype = A
physics = S
anim = 1010
poweradd = 50
juggle = 14
velSet = 0,0
ctrl = 0

[State 1010, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = S1,11
channel = -1

[State 1010, Accel]
type = veladd
trigger1 = vel x > 0
x = -0.667

[State 1010, Accel]
type = velset
trigger1 = vel x < 0
x = 0

[State 1010, Accel]
type = veladd
trigger1 = anim = 1010
trigger1 = animelemtime(2) >= 1
trigger2 = anim = 1011
y = 0.672

[State 1010, Vel]
type = velset
trigger1 = anim = 1010
trigger1 = animelem = 2
x = 5.0

[State 1010, Vel]
type = velset
trigger1 = anim = 1010
trigger1 = animelemtime(2) = [0, 1]
y = -10.338

[State 1010, Sound]
type = playsnd
trigger1 = anim = 1010
trigger1 = animelem = 2
value = 0,4
channel = 1
volumescale = 50


[State 1010, Hit]
type = hitdef
trigger1 = animelem = 1 && anim = 1010
air.juggle = 32
damage = 40, 5
attr = A, SA
animtype = Hard
fall.animtype = Hard
hitflag = MAF
guardflag = M
priority = 4, Hit
pausetime = 12, 12
sparkno = s7002
guard.sparkno = s7006
sparkxy = -10, 0
hitsound = s2, 2
guardsound = s2, 5
ground.type = Low
ground.hittime = 1 + 18
ground.slidetime = 18
ground.velocity = -3.0,-9.0
air.type = Low
air.velocity = -3.0,-9.0
yaccel = 0.4850
ground.cornerpush.veloff = 0
guard.hittime = 1 + 16
guard.ctrltime = 1 + 16
guard.slidetime = 16
guard.velocity = -10.52
guard.cornerpush.veloff = 0
getpower = ifelse(movehit, 25, 100)
givepower = 40, 40
envshake.time = 12; special
envshake.freq = 180
envshake.ampl = ifelse((gametime % 2), -2, 2)
fall = 1
fall.recover = 1
fall.recovertime = 120
fall.animtype = Medium
forcestand = 1
airguard.ctrltime = 1 + 16
airguard.cornerpush.veloff = 0
airguard.velocity = -6.00, -1.00

[State 1010, Type]
type = statetypeset
trigger1 = anim = 1010
trigger1 = animelem = 2
statetype = A
physics = N

[State 1010, Anim]
type = changeanim
trigger1 = anim = 1010
trigger1 = animelemtime(2) > 0
trigger1 = vel y > -5.3
value = 1011

[State 1010, Land]
type = changestate
trigger1 = statetype = A
trigger1 = vel y > 0
trigger1 = pos y > -vel y
value = 1019


; Tyuken (Strong) 
[Statedef 1015]
type = S
movetype = A
physics = S
anim = 1010
poweradd = 75
juggle = 14
velSet = 0,0
ctrl = 0

[State 1015, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = S1,11
channel = -1

[State 1015, Accel]
type = veladd
trigger1 = vel x > 0
x = -0.667

[State 1015, Accel]
type = velset
trigger1 = vel x < 0
x = 0

[State 1015, Accel]
type = veladd
trigger1 = anim = 1010
trigger1 = animelemtime(2) >= 1
trigger2 = anim = 1011
y = 0.672

[State 1015, Vel]
type = velset
trigger1 = anim = 1010
trigger1 = animelem = 2
x = 10.0

[State 1015, Vel]
type = velset
trigger1 = anim = 1010
trigger1 = animelemtime(2) = [0, 1]
y = -13.784

[State 1015, Sound]
type = playsnd
trigger1 = anim = 1010
trigger1 = animelem = 2
value = 0,4
channel = 1
volumescale = 50


[State 1015, Hit]
type = hitdef
trigger1 = animelem = 1 && anim = 1010
air.juggle = 32
damage = 20, 10
attr = A, SA
animtype = Hard
fall.animtype = Hard
hitflag = MAF
guardflag = M
priority = 4, Hit
pausetime = 12, 12
sparkno = s7002
guard.sparkno = s7006
sparkxy = -10, 0
hitsound = s2, 2
guardsound = s2, 5
ground.type = Low
ground.hittime = 1 + 18; + 2 * map(counterhit_buffer)
ground.slidetime = 18
ground.velocity = -3.0,-9.0
air.type = Low
air.velocity = -3.0,-9.0
yaccel = 0.4850
ground.cornerpush.veloff = 0
guard.hittime = 1 + 16
guard.ctrltime = 1 + 16
guard.slidetime = 16
guard.velocity = -10.52
guard.cornerpush.veloff = 0
getpower = ifelse(movehit, 25, 100)
givepower = 40, 40
envshake.time = 12; special
envshake.freq = 180
envshake.ampl = ifelse((gametime % 2), -2, 2)
fall = 1
fall.recover = 1
fall.recovertime = 120
fall.animtype = Medium
forcestand = 1
airguard.ctrltime = 1 + 16
airguard.cornerpush.veloff = 0
airguard.velocity = -6.00, -1.00



[State 1015, Hit (Mid Air)]
type = hitdef
trigger1 = animelem = 2 && anim = 1010
air.juggle = 32
damage = 20, 10
attr = S, SA
animtype = Hard
fall.animtype = Hard
hitflag = MAF
guardflag = M
priority = 4, Hit
pausetime = 12, 12
sparkno = s7002
guard.sparkno = s7006
sparkxy = -10, 0
hitsound = s2, 2
guardsound = s2, 5
ground.type = Low
ground.hittime = 1 + 18; + 2 * map(counterhit_buffer)
ground.slidetime = 18
ground.velocity = -3.0,-9.0
air.type = Low
air.velocity = -3.0,-9.0
yaccel = 0.4850
ground.cornerpush.veloff = 0
guard.hittime = 1 + 16
guard.ctrltime = 1 + 16
guard.slidetime = 16
guard.velocity = -10.52
guard.cornerpush.veloff = 0
getpower = ifelse(movehit, 25, 100)
givepower = 40, 40
envshake.time = 12; special
envshake.freq = 180
envshake.ampl = ifelse((gametime % 2), -2, 2)
fall = 1
fall.recover = 1
fall.recovertime = 120
fall.animtype = Medium
forcestand = 1
airguard.ctrltime = 1 + 16
airguard.cornerpush.veloff = 0
airguard.velocity = -6.00, -1.00



[State 1015, Type]
type = statetypeset
trigger1 = anim = 1010
trigger1 = animelem = 2
statetype = A
physics = N

[State 1015, Anim]
type = changeanim
trigger1 = anim = 1010
trigger1 = animelemtime(2) > 0
trigger1 = vel y > -5.3
value = 1011

[State 1015, Land]
type = changestate
trigger1 = statetype = A
trigger1 = vel y > 0
trigger1 = pos y > -vel y
value = 1019

; Tyuken (Land)
[Statedef 1019]
type = S
physics = S
movetype = I
anim = 1019
ctrl = 0
velset = 0, 0
sprpriority = 2
movehitpersist = 1
hitcountpersist = 1

[State 1019, Pos]
type = posset
trigger1 = 1
y = 0

[State 1019, Sound]
type = playsnd
trigger1 = !time
value = 0, 6


[State 1019, End]
type = changestate
trigger1 = !animtime
value = 0
ctrl = 1


;TyroPin (Grabbling)
[Statedef 1020]
type = S
movetype = A
physics = S
anim = 1020
poweradd = 100
juggle = 14
velSet = 0,0
ctrl = 0

[State 1020, NotHitBy]
type = NotHitBy
trigger1 = AnimElemTime(1) < 0
time = 1
value = SCA

[State 1020, No Corner Push]
type = VarSet
trigger1 = !Time
fvar(5) = 0

[State 1020, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = S1,8
channel = -1

[State 1020, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = S1010,0
channel = -1

[State 1020, Vel]
type = Velset
trigger1 = AnimElemTime(3) >= 0
x = 7.5 

[State 1020, HitDef]
type = HitDef
trigger1 = AnimElemTime(3) >= 0 
ID = 1020
attr = S, SA
hitFlag = MAF
guardFlag = M
priority = 4, Hit
damage = 0,0
getPower = 0,0
givePower = 36, 36
pauseTime = 0, 0
guard.pauseTime = 2, 2
animType = Hard
air.animType = Back
fall.animType = Back
ground.type = Low
air.type = Low
ground.hitTime = 12
ground.slideTime = 12
guard.hitTime = 12
air.hitTime = 120
ground.velocity = 0, 0
ground.cornerPush.velOff = 0
guard.velocity = -4.68937069644
guard.cornerPush.velOff = 0
air.velocity = 0, 0
air.cornerPush.velOff = 0
yAccel = 0.5126953125
fall = 0
air.fall = 1
fall.recover = 1
fall.recoverTime = 120
forceStand = 1
hitSound = s2,6
guardSound = s2,5
sparkNo = 0
guard.sparkNo = -1 
sparkXY = -10,0
kill = 0

[State 1020, TargetDrop]
type = TargetDrop
trigger1 = NumTarget(1020) > 1
keepOne = 1
excludeID = 1020
ignoreHitPause = 1

[State 1020, TargetState]
type = TargetState
trigger1 = MoveHit && NumTarget(1020)
value = 1026
ID = 1020
ignoreHitPause = 1
persistent = 0

[State 1020, ChangeState]
type = ChangeState
trigger1 = NumTarget(1020)
trigger1 = MoveHit && Target, Alive
value = 1021

[State 1020, ChangeState]
type = ChangeState
triggerAll = AnimElemTime(4) >= 0
trigger1 = MoveGuarded
trigger2 = !AnimTime
trigger3 = FrontEdgeDist <= 0
trigger4 = P2BodyDist X <= 0 && P2StateType = L
value = 1025

;TyroPin (Connected)
[Statedef 1021]
type = S
movetype = A
physics = S
anim = 1023
poweradd = 50
juggle = 14
velSet = 0,0
ctrl = 0

[State 1021, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = S1,13
channel = -1

[State 1021, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = S2,6
channel = -1

[State 1021, Lost Target]
type = ChangeState
trigger1 = !Time && !NumTarget
value = 0
ctrl = 1

[State 1021, NotHitBy]
type = NotHitBy
trigger1 = NumTarget
value = SCA
time = 1

[State 1021, VelSet]
type = VelSet
trigger1 = AnimElemNo(1) >= 0
x = 11.1731843575

[State 1021, TargetState]
type = TargetState
trigger1 = !Time && NumTarget
value = 1026

[State 1021, TargetBind]
type = TargetBind
trigger1 = NumTarget
trigger1 = Time >= 0
pos = 0, 0

[State 1021, End]
type = ChangeState
trigger1 = AnimElemTime(1) >= 2 && AnimElemTime(2) < 0
trigger1 = FrontEdgeDist <= 52
trigger2 = AnimElemTime(2) >= 0
trigger2 = FrontEdgeDist <= 35
trigger3 = Time >= 600
value = 11021

[State 1021, End]
type = ChangeState
trigger1 = AnimElemTime(2) > 0
trigger1 = pos y > -vel y
value = 1022

;TyroPin (Connected)
[Statedef 11021]
type = S
movetype = A
physics = S
anim = 1023
poweradd = 50
juggle = 14
velSet = 0,0
ctrl = 0

[State 11021, Lost Target]
type = ChangeState
trigger1 = !Time && !NumTarget
value = 0
ctrl = 1

[State 11021, NotHitBy]
type = NotHitBy
trigger1 = NumTarget
value = SCA
time = 1

[State 11021, PosSet]
type = PosSet
trigger1 = 1
y = 0

[State 11021, VelSet]
type = VelSet
trigger1 = 1
x = 11.1731843575

[State 11021, TargetBind]
type = TargetBind
trigger1 = NumTarget
pos = -31, 0

[State 11021, End]
type = ChangeState
trigger1 = FrontEdgeDist <= 35
trigger2 = Time >= 600
value = 1022


;---------------------------------------------------------------------------
;TyroPin (Wallbounded)
[Statedef 1022]
type    = S
physics = N
anim = 1024
sprpriority = 3
velset = 0,0
ctrl = 0

[State 1022, SFX]
type = PlaySnd
trigger1 = Time = 0
value = S2,2

[State 1032, Lost Target]
type = ChangeState
trigger1 = !Time && !NumTarget
value = 0
ctrl = 1

[State 1022, NotHitBy]
type = NotHitBy
trigger1 = NumTarget && AnimElemTime(2) < 1
value = SCA
time = 1

[State 1022, PosSet]
type = PosSet
trigger1 = 1
y = 0

[State 1022, TargetState]
type = TargetState
trigger1 = !Time && NumTarget
value = 1027

[State 1022, Width]
type = Width
trigger1 = AnimElemTime(2) >= 0
edge = 65, 0

[State 1022, TargetBind]
type = TargetBind
trigger1 = NumTarget
trigger1 = AnimElemTime(2) < 0
pos = 35, -7

[State 1022, TargetBind 2]
type = TargetBind
trigger1 = NumTarget
trigger1 = AnimElemTime(2) >= 0 && AnimElemTime(3) < 0
pos = 68, -21

[State 1022, SprPriority]
type = SprPriority
trigger1 = NumTarget && AnimElemTime(2) = 0
value = 2

[State 1022, Damage]
type = TargetLifeAdd
trigger1 = NumTarget && AnimElemTime(2) = 0
value = -103

[State 1022, TargetPowerAdd]
type = TargetPowerAdd
trigger1 = NumTarget && AnimElemTime(2) = 0
value = 36

[State 1022, Power]
type = PowerAdd
trigger1 = NumTarget && AnimElemTime(2) = 0 && !var(20)
value = 72

[State 1022, HitAdd]
type = HitAdd
trigger1 = NumTarget && AnimElemTime(2) = 0
value = 1

[State 1022, EnvShake]
type = EnvShake
trigger1 = NumTarget && AnimElemTime(2) = 0
time = 14
ampl = -4
freq = 120

[State 1022, Throw]
type = TargetState
trigger1 = NumTarget && AnimElemTime(2) = 1
value = 1028

[State 1022, End]
type = ChangeState
trigger1 = !AnimTime
value = 1023
ctrl = 0

;---------------------------------------------------------------------------
; TyroPin (Jump)
[Statedef 1023]
type    = S
physics = N
anim = 1025
sprpriority = 3
ctrl = 0

[State 1023, Sound]
type = playsnd
trigger1 = !time
value = s0, 5


[State 1023, StateTypeSet: A]
type = StateTypeSet
trigger1 = AnimElem = 1
StateType = A

[State 1023, VelSet]
type = VelSet
trigger1 = AnimElem = 1
x = -5
y = -10

[State 1023, VelAdd]
type = VelAdd
trigger1 = 1
y = 0.5

[State 1023, ScreenBound]
type = ScreenBound
trigger1 = 1
movecamera = 0,0
value = 1

[State 1023, End]
type = ChangeState
trigger1 = Pos Y >= 0 && Vel Y > 0
value = 1024
ctrl = 0

; TyroPin (Land)
[Statedef 1024]
type = S
physics = S
movetype = I
anim = 1026
ctrl = 0
velset = 0, 0
sprpriority = 2
movehitpersist = 1
hitcountpersist = 1

[State 1019, Pos]
type = posset
trigger1 = 1
y = 0

[State 1019, Sound]
type = playsnd
trigger1 = !time
value = 0, 6


[State 1019, End]
type = changestate
trigger1 = !animtime
value = 0
ctrl = 1

; TyroPin (Missed)
[Statedef 1025]
type    = S
movetype= A
physics = S
ctrl = 0
anim = 1022
velset = 10,0

[State 1025, HD-1]
type = HitDef
trigger1 = AnimElem = 1
attr = S, SA
animtype  = Medium
damage    = 0,0
getpower= 0,0
givepower = 35,35
guardflag = MA
pausetime = 12,12
guard.sparkNo = S7006
sparkXY = -10, -30
guardsound = s2, 6
ground.type = Low
ground.slidetime = 12
ground.hittime  = 12
ground.velocity = -6
air.velocity = -3.5,-5
air.hittime = 8

[State 1025, Vel]
type = Velset
trigger1 = !AnimTime
x = 7.5

[State 1020, Accel]
type = VelAdd
trigger1 = vel x < 0
x = -0.125

[State 1020, Land]
type = ChangeState
trigger1 = anim = 1022 && AnimTime = 20
value = 0
ctrl = 1

;Ashura Senkuu Forward (Weak)
[Statedef 1100]
type = S
movetype = I
physics = N
ctrl = 0
anim = 1100
velset = 0,0
sprpriority = -1
facep2 = 1

[State 1100, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = S1,8
volumescale = 100
channel = 0
loop = 0

[State 1100, ChangeAnim]
type = ChangeAnim
trigger1 = time = 15
value = 1101

[State 1100, Helper]
type = Helper 
trigger1 = Anim = 1101
trigger1 = !NumHelper(11100)
trigger1 = AnimElem =  1 || AnimElem =   6
trigger2 = AnimElem =  11 || AnimElem =  16
trigger3 = AnimElem =  21
name = "Tyrone (Aura)"
ID = 11100
stateno = 11100
postype = P1    ;P2, Front, Back, Left, Right


[State 1100, VelSet]
type = VelSet
trigger1 = Anim = 1101
trigger1 = AnimElem = 1
x = 4

[State 1100, VelAdd]
type = VelAdd
trigger1 = Anim = 1101
trigger1 = time = 20
trigger1 = animelemtime(1) > 0
x = ifElse(vel x >= 0, -0.15, 0.15)

[State 1100, PlaySnd]
type = PlaySnd
trigger1 = Anim = 1101
trigger1 = time = 15
value = S4,1
volumescale = 100
channel = 0
loop = 0

[State 1100, Turn]
type = turn
trigger1 = Anim = 1101
trigger1 = animelemtime(2) > 0
trigger1 = p2dist x < 0

[State 1100, End]
type = changestate
triggerall = Anim = 1101
triggerall = animelemtime(1) > 0
trigger1 = time >= 60
trigger2 = vel x < 0 && backedgebodydist <= 0
trigger3 = vel x > 0 && frontedgebodydist <= 0
value = 1102

[State 1100, NHB]
type = nothitby
trigger1 = Anim = 1101
trigger1 = 1
value = SCA, AA, AP, AT
time = 1

[State 1100, Push]
type = playerpush
trigger1 = Anim = 1101
trigger1 = time > 0
trigger1 = animelemtime(1) >= 0
value = 0

; Ashura Senkuu Back (Weak)
[Statedef 1101]
type = S
movetype = I
physics = N
ctrl = 0
anim = 1100
velset = 0,0
sprpriority = -1
facep2 = 1

[State 1101, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = S1,8
volumescale = 100
channel = 0
loop = 0

[State 1101, ChangeAnim]
type = ChangeAnim
trigger1 = time = 15
value = 1101

[State 1101, Helper]
type = Helper 
trigger1 = Anim = 1101
trigger1 = !NumHelper(11100)
trigger1 = AnimElem =  1 || AnimElem =   6
trigger2 = AnimElem =  11 || AnimElem =  16
trigger3 = AnimElem =  21
name = ""
ID = 11100
stateno = 11100
postype = P1    ;P2, Front, Back, Left, Right

[State 1101, VelSet]
type = VelSet
trigger1 = Anim = 1101
trigger1 = AnimElem = 1
x = -4

[State 1101, VelAdd]
type = VelAdd
trigger1 = Anim = 1101 
trigger1 = time = 20
trigger1 = animelemtime(1) > 0
x = ifElse(vel x >= 0, -0.15, 0.15)

[State 1101, PlaySnd]
type = PlaySnd
trigger1 = Anim = 1101
trigger1 = time = 15
value = S4,1
volumescale = 100
channel = 0
loop = 0

[State 1101, Turn]
type = turn
trigger1 = Anim = 1101
trigger1 = animelemtime(1) > 0
trigger1 = p2dist x < 0

[State 1101, End]
type = changestate
triggerall = Anim = 1101
triggerall = animelemtime(1) > 0
trigger1 = time >= 60
trigger2 = vel x < 0 && backedgebodydist <= 0
trigger3 = vel x > 0 && frontedgebodydist <= 0
value = 1102

[State 1101, NHB]
type = nothitby
trigger1 = Anim = 1101
trigger1 = animelemtime(1) > 0
value = SCA, AA, AP, AT
time = 1

[State 1101, Push]
type = playerpush
trigger1 = Anim = 1101
trigger1 = time > 0
trigger1 = animelemtime(1) >= 0
value = 0

;Ashura Senkuu Forward (Strong)
[Statedef 1110]
type = S
movetype = I
physics = N
ctrl = 0
anim = 1100
velset = 0,0
sprpriority = -1
facep2 = 1

[State 1100, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = S1,8
volumescale = 100
channel = 0
loop = 0

[State 1100, ChangeAnim]
type = ChangeAnim
trigger1 = time = 15
value = 1101

[State 1100, Helper]
type = Helper 
trigger1 = Anim = 1101
trigger1 = !NumHelper(11100)
trigger1 = AnimElem =  1 || AnimElem =   6
trigger2 = AnimElem =  11 || AnimElem =  16
trigger3 = AnimElem =  21
name = "Tyrone (Aura)"
ID = 11100
stateno = 11100
postype = P1    ;P2, Front, Back, Left, Right


[State 1100, VelSet]
type = VelSet
trigger1 = Anim = 1101
trigger1 = AnimElem = 1
x = 8

[State 1100, VelAdd]
type = VelAdd
trigger1 = Anim = 1101
trigger1 = time = 20
trigger1 = animelemtime(1) > 0
x = ifElse(vel x >= 0, -0.2, 0.2)

[State 1100, PlaySnd]
type = PlaySnd
trigger1 = Anim = 1101
trigger1 = time = 15
value = S4,1
volumescale = 100
channel = 0
loop = 0

[State 1100, Turn]
type = turn
trigger1 = Anim = 1101
trigger1 = animelemtime(2) > 0
trigger1 = p2dist x < 0

[State 1100, End]
type = changestate
triggerall = Anim = 1101
triggerall = animelemtime(1) > 0
trigger1 = time >= 60
trigger2 = vel x < 0 && backedgebodydist <= 0
trigger3 = vel x > 0 && frontedgebodydist <= 0
value = 1102

[State 1100, NHB]
type = nothitby
trigger1 = Anim = 1101
trigger1 = 1
value = SCA, AA, AP, AT
time = 1

[State 1100, Push]
type = playerpush
trigger1 = Anim = 1101
trigger1 = time > 0
trigger1 = animelemtime(1) >= 0
value = 0

; Ashura Senkuu Back (Strong)
[Statedef 1111]
type = S
movetype = I
physics = N
ctrl = 0
anim = 1100
velset = 0,0
sprpriority = -1
facep2 = 1

[State 1101, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = S1,8
volumescale = 100
channel = 0
loop = 0

[State 1101, ChangeAnim]
type = ChangeAnim
trigger1 = time = 15
value = 1101

[State 1101, Helper]
type = Helper 
trigger1 = Anim = 1101
trigger1 = !NumHelper(11100)
trigger1 = AnimElem =  1 || AnimElem =   6
trigger2 = AnimElem =  11 || AnimElem =  16
trigger3 = AnimElem =  21
name = ""
ID = 11100
stateno = 11100
postype = P1    ;P2, Front, Back, Left, Right

[State 1101, VelSet]
type = VelSet
trigger1 = Anim = 1101
trigger1 = AnimElem = 1
x = -8

[State 1101, VelAdd]
type = VelAdd
trigger1 = Anim = 1101 
trigger1 = time = 20
trigger1 = animelemtime(1) > 0
x = ifElse(vel x >= 0, -0.2, 0.2)

[State 1101, PlaySnd]
type = PlaySnd
trigger1 = Anim = 1101
trigger1 = time = 15
value = S4,1
volumescale = 100
channel = 0
loop = 0

[State 1101, Turn]
type = turn
trigger1 = Anim = 1101
trigger1 = animelemtime(1) > 0
trigger1 = p2dist x < 0

[State 1101, End]
type = changestate
triggerall = Anim = 1101
triggerall = animelemtime(1) > 0
trigger1 = time >= 60
trigger2 = vel x < 0 && backedgebodydist <= 0
trigger3 = vel x > 0 && frontedgebodydist <= 0
value = 1102

[State 1101, NHB]
type = nothitby
trigger1 = Anim = 1101
trigger1 = animelemtime(1) > 0
value = SCA, AA, AP, AT
time = 1

[State 1101, Push]
type = playerpush
trigger1 = Anim = 1101
trigger1 = time > 0
trigger1 = animelemtime(1) >= 0
value = 0



;Recovery
[Statedef 1102]
type = S
physics = N
movetype = I
anim = 1101
velset = 0, 0
ctrl = 0
sprpriority = -1

[State 1102, End]
type = changestate
trigger1 = !animtime
value = 0
ctrl = 1

