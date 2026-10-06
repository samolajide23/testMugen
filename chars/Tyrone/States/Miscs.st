;---------------------------------------------------------------------------
; MISC
;---------------------------------------------------------------------------


;---------------------------------------------------------------------------

;---------------------------------------------------------------------------
; Custom Moves
;---------------------------------------------------------------------------
;Being Thrown Part 1/2
[StateDef 1026]
type = A
moveType = H
physics = N
velSet = 0,0
sprPriority = 1

[State 1026, PosSet]
type = PosSet
trigger1 = !time
y = 0

[State 1026, ChangeAnim2]
type = ChangeAnim2
trigger1 = !Time
value = 1027

[State 1026, Turn]
type = Turn
trigger1 = !Time
trigger1 = NumEnemy
trigger1 = Facing = EnemyNear, Facing
ignoreHitPause = 1

[State 1026, ScreenBound]
type = ScreenBound
trigger1 = 1
value = 0
moveCamera = 0,0
ignoreHitPause = 1


;Being Thrown Part 3
[StateDef 1027]
type = A
moveType = H
physics = N
velSet = 0,0
sprPriority = 1

[State 1027, PosSet]
type = PosSet
trigger1 = !time
y = 0

[State 1027, ChangeAnim2]
type = ChangeAnim2
trigger1 = !Time
value = 1028

[State 1027, Turn]
type = Turn
trigger1 = !Time
trigger1 = NumEnemy
trigger1 = Facing = EnemyNear, Facing
ignoreHitPause = 1

[State 1027, ScreenBound]
type = ScreenBound
trigger1 = 1
value = 0
moveCamera = 0,0
ignoreHitPause = 1


;After Throw
[StateDef 1028]
type = A
physics = N
movetype = H
ctrl = 0
velSet = 0,0
sprPriority = 1

[State 1028, ScreenBound]
type = ScreenBound
trigger1 = 1
value = 1
moveCamera = 1,1
ignoreHitPause = 1

[State 1028, VelAdd]
type = VelAdd
Trigger1 = 1
y = 0.5

[State 1028, EnvShake]
type = EnvShake
trigger1 = pos y > -vel y
time = 14
ampl = -4
freq = 120

[State 1028, Recover]
type = SelfState
trigger1 = Alive
trigger1 = command = "recovery"
trigger1 = vel y > 0 && pos y >= const(movement.air.getHit.groundRecover.ground.threshold)
value = 5200

[State 1028, End]
type = SelfState
trigger1 = pos y > -vel y
value = 5100

;---------------------------------------------------------------------------
; HELPERS
;---------------------------------------------------------------------------

;---------------------------------------------------------------------------
;CAMERA CONTROL
[StateDef 8999]
type = S
velSet = 0,0
anim = 2

[State 8999, ScreenBound]
type = ScreenBound
trigger1 = 1
value = 0
moveCamera = 1,1
ignoreHitPause = 1

[State 8999, End]
type = DestroySelf
trigger1 = RoundState = 2

;---------------------------------------------------------------------------
; WIN HELPERS
;---------------------------------------------------------------------------
; WIN 4: Transform to Normal (Transforming)
[StateDef 18402]
type = S
physics = N
velSet = 0,0
anim = 18402
sprPriority = -1

[State 18402, RemapPal]
type = RemapPal
trigger1 = !Time
source = 1,1
dest = 1,1
;ignorehitpause = 
;persistent =

; WIN 4: Chaos Emeralds
[StateDef 18400]
type = S
physics = N
velSet = 0,0
anim = 18400
sprPriority = 0

[State 18400, DestroySelf]
type = DestroySelf
trigger1 = !Animtime 

; Electric Sheld PT1
[StateDef 18410]
type = S
physics = N
velSet = 0,0
anim = 18410
sprPriority = 0

[State 19200, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = s12,0
volumescale = 100
channel = -1
loop = 0

[State 0, ChangeState]
type = ChangeState
trigger1 = Time = 100
value = 18411

;Electric Sheld PT2
[StateDef 18411]
type = S
physics = N
velSet = 0,0
anim = 18411
sprPriority = 0

[State 19200, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = s12,1
volumescale = 100
channel = -1
loop = 0

[State 18400, DestroySelf]
type = DestroySelf
trigger1 = !AnimTime


;---------------------------------------------------------------------------

;---------------------------------------------------------------------------
; INTRO HELPERS
;---------------------------------------------------------------------------
;INTRO:  Made By: DoomJoshuaBoy LOGO
[StateDef 8010]
type = A
physics = N
velSet = 0,0
anim = 2
sprPriority = -2

[State 8010, LOGO 1]
type = explod
triggerall = teamside = 1
trigger1 = !time
anim = 8010
ID = 8010
sprpriority = 1
postype = Left
pos = 50,10
bindtime = -1
ownpal = 1
scale = 0.15,0.15



[State 8010, LOGO 2]
type = explod
triggerall = teamside = 1
trigger1 = time = 3
anim = 8011
ID = 8010
sprpriority = 1
postype = Left
pos = 50,20
bindtime = -1
ownpal = 1
scale = 0.15,0.15

[State 8010, LOGO 1]
type = explod
triggerall = teamside != 1
trigger1 = !time
anim = 8010
ID = 8010
sprpriority = 1
postype = right
pos = -50,10
bindtime = -1
ownpal = 1
scale = 0.15,0.15

[State 8010, LOGO 2]
type = explod
triggerall = teamside != 1
trigger1 = time = 3
anim = 8011
ID = 8010
sprpriority = 1
postype = right
pos = -50,20
bindtime = -1
ownpal = 1
scale = 0.15,0.15


[State 8010, DestroySelf]
type = DestroySelf
trigger1 = time = 150


;---------------------------------------------------------------------------
;INTRO 2: SCOURGE
[StateDef 19200]
type = S
physics = N
velSet = 0,0
anim = 19200
sprPriority = -2


[State 19200, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = s19200,0
volumescale = 100
channel = -1
loop = 0

[State 19200, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 22
value = s19200,1
volumescale = 100
channel = -1
loop = 0

[State 19200, Cape]
type = explod
trigger1 = AnimElem =  22
anim = 19202
ID = 19202
sprpriority = -1
postype = p1
pos = 0, 0
facing = 1
ownpal = 1

[State 19200, Crown]
type = explod
trigger1 = AnimElem =  22
anim = 19203
ID = 19203
sprpriority = 5
postype = p1
pos = 0,0
vel = -5,-1
facing = 1
ownpal = 1
ontop = 1

[State 19200, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 26 
value = s19200,2
volumescale = 100
channel = -1
loop = 0


;---------------------------------------------------------------------------
;INTRO 2: Tyrone (Success)
[StateDef 19202]
type = S
physics = N
velSet = 0,0
anim = 19201
sprPriority = -2

[State 19202, Intro] ;Assert this until you want "round 1, fight" to begin
type = AssertSpecial
trigger1 = 1
flag = Intro
flag2 = NoBarDisplay

[State 19202, PlaySnd]
type = PlaySnd
trigger1 = !Time
value = s2,6
volumescale = 100
channel = -1
loop = 0

[State 19202, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 3
value = s1,13
volumescale = 100
channel = -1
loop = 0


[State 19202, Sparks]
type = explod
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=8 || AnimElem =  7,=16
trigger2 = AnimElem =  7,=24 ||AnimElem =  7,=32 || AnimElem =  7,=40
trigger3 = AnimElem =  7,=48 || AnimElem =  7,=56 || AnimElem =  7,=64
trigger4 = AnimElem =  7,=72 || AnimElem =  7,=80 || AnimElem =  7,=88
trigger5 = AnimElem =  7,=96 || AnimElem =  7,=104 || AnimElem =  7,=112
anim = 7001
ID = 7001
sprpriority = 5
postype = P1
pos = 0,-30
random = 100, 100
facing = -1
ownpal = 1
ontop = 1

[State 19202, PlaySnd]
type = PlaySnd
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=8 || AnimElem =  7,=16
trigger2 = AnimElem =  7,=24 ||AnimElem =  7,=32 || AnimElem =  7,=40
trigger3 = AnimElem =  7,=48 || AnimElem =  7,=56 || AnimElem =  7,=64
trigger4 = AnimElem =  7,=72 || AnimElem =  7,=80 || AnimElem =  7,=88
trigger5 = AnimElem =  7,=96 || AnimElem =  7,=104 || AnimElem =  7,=112
value = s2, 1
volumescale = 100
channel = 0
loop = 0

[State 19202, Shake]
type = envshake
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=8 || AnimElem =  7,=16
trigger2 = AnimElem =  7,=24 ||AnimElem =  7,=32 || AnimElem =  7,=40
trigger3 = AnimElem =  7,=48 || AnimElem =  7,=56 || AnimElem =  7,=64
trigger4 = AnimElem =  7,=72 || AnimElem =  7,=80 || AnimElem =  7,=88
trigger5 = AnimElem =  7,=96 || AnimElem =  7,=104 || AnimElem =  7,=112
time = 6
freq = 120
ampl = -4

[State 19202, EnvColor]
type = EnvColor
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=8 || AnimElem =  7,=16
trigger2 = AnimElem =  7,=24 ||AnimElem =  7,=32 || AnimElem =  7,=40
trigger3 = AnimElem =  7,=48 || AnimElem =  7,=56 || AnimElem =  7,=64
trigger4 = AnimElem =  7,=72 || AnimElem =  7,=80 || AnimElem =  7,=88
trigger5 = AnimElem =  7,=96 || AnimElem =  7,=104 || AnimElem =  7,=112
value = 0,0,0
time = 8
under = 1

[State 19202, Posadd]
type = Posadd
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=8 || AnimElem =  7,=16
trigger2 = AnimElem =  7,=24 ||AnimElem =  7,=32 || AnimElem =  7,=40
trigger3 = AnimElem =  7,=48 || AnimElem =  7,=56 || AnimElem =  7,=64
trigger4 = AnimElem =  7,=72 || AnimElem =  7,=80 || AnimElem =  7,=88
trigger5 = AnimElem =  7,=96 || AnimElem =  7,=104 || AnimElem =  7,=112
x = -1

[State 19202, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 8
value = s2, 2
volumescale = 200
channel = 0
loop = 0

[State 19202, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 8
value = s1,25+(random%2)
volumescale = 150
channel = 1
loop = 0

[State 19202, Sparks]
type = explod
trigger1 = AnimElem =  8
anim = 7002
ID = 7002
sprpriority = 5
postype = p1
pos = 0, 30
random = 100, 100
facing = -1
ownpal = 1
ontop = 1

[State 19202, Shake]
type = envshake
trigger1 = AnimElem = 8
time = 6
freq = 150
ampl = -4

[State 19202, End]
type = ChangeState
trigger1 = !AnimTime
value = 0

;AFTER IMAGE
[Statedef 19210]
type = S
velSet = 0, 0
anim = Root, Anim
sprPriority = -3

[State 19210, Transparency]
type = Trans
trigger1 = 1
trans = AddAlpha
alpha = 256 - 16 * Time, 0 + 16 * Time
ignoreHitPause = 1

[State 19210, Assert: NoShadow]
type = AssertSpecial
trigger1 = 1
flag = NoShadow
ignoreHitPause = 1

[State 19210, End]
type = DestroySelf
trigger1 = Time = 16
;---------------------------------------------------------------------------
;INTRO 3: Sonic 
[StateDef 19300]
type = S
physics = N
velSet = 0,0
anim = 19300
sprPriority = -3

[State 19300, Intro] ;Assert this until you want "round 1, fight" to begin
type = AssertSpecial
trigger1 = 1
flag = Intro

[State 19300, PlaySnd]
type = PlaySnd
trigger1 = Time = 10
value = S19300,0
volumescale = 100
channel = -1

[State 19300, PlaySnd]
type = PlaySnd
trigger1 = AnimElem =  4 || AnimElem =  8
value = S5,3
volumescale = 50
channel = -1
loop = 0


[State 19301, PosSet]
type = PosSet
trigger1 = 1
y = -1

[State 19300, ChangeState]
type = ChangeState
trigger1 = time = 180
value = 19301
;ignorehitpause = 
;persistent = 

;INTRO 3: Sonic (run away)
[StateDef 19301]
type = S
physics = N
velSet = 0,0
anim = 19301
sprPriority = -3

[State 19301, PlaySnd]
type = PlaySnd
trigger1 = AnimElem =  5 || AnimElem =  9
value = S5,3
volumescale = 50
channel = -1
loop = 0


[State 19301, Veladd]
type = veladd
trigger1 = AnimElem =  3 || AnimElem =  4 || AnimElem =  5
trigger2 = AnimElem =  6 || AnimElem =  7 || AnimElem =  8
x = -2

[State 19301, DestroySelf]
type = DestroySelf
trigger1 = time = 60
;ignorehitpause = 
;persistent = 


;---------------------------------------------------------------------------
;INTRO 3: Amy 
[StateDef 19310]
type = S
physics = N
velSet = 0,0
anim = 19310
sprPriority = 1

[State 19310, Intro] ;Assert this until you want "round 1, fight" to begin
type = AssertSpecial
trigger1 = 1
flag = Intro

[State 19310, PlaySnd]
type = PlaySnd
trigger1 = Time = 10
value = S19310,0
volumescale = 255
channel = -1

[State 19310, PosSet]
type = PosSet
trigger1 = 1
y = 1

[State 19310, ChangeState]
type = ChangeState
trigger1 = time = 100
value = 19311

;INTRO 3: Amy (Away)
[StateDef 19311]
type = S
physics = N
velSet = 0,0
anim = 19311
sprPriority = 1

[State 19311, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 2
value = S5,1
volumescale = 50
channel = -1
loop = 0


[State 19311, Veladd]
type = veladd
trigger1 = AnimElem = 2
x = -10
y = -5

[State 19311, DestroySelf]
type = DestroySelf
trigger1 = time = 60


;---------------------------------------------------------------------------
;INTRO 3: Tails 
[StateDef 19320]
type = S
physics = N
velSet = 0,0
anim = 19320
sprPriority = -2

[State 19320, Intro] ;Assert this until you want "round 1, fight" to begin
type = AssertSpecial
trigger1 = 1
flag = Intro

[State 19320, PlaySnd]
type = PlaySnd
trigger1 = Time = 50
value = S19320,0
channel = -1

[State 19310, PosSet]
type = PosSet
trigger1 = 1
y = 1

[State 19320, ChangeState]
type = ChangeState
trigger1 = Time = 160
value = 19321

;INTRO 3: Tails (Away)
[StateDef 19321]
type = S
physics = N
velSet = 0,0
anim = 19321
sprPriority = -2

[State 19321, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 2
value = S5,1
channel = -1
loop = 0

[State 19321, Veladd]
type = veladd
trigger1 = AnimElem = 2
x = -10
y = -5

[State 19321, DestroySelf]
type = DestroySelf
trigger1 = time = 60

;INTRO 3: Tyrone land
[Statedef 19330]
type = S
physics = N
anim = 19330
velSet = 0,0
sprPriority = -2

[State 19330, Intro] ;Assert this until you want "round 1, fight" to begin
type = AssertSpecial
trigger1 = 1
flag = Intro
 
[State 19330, Snd]
type = PlaySnd
trigger1 = !time
value = s0,6
volumescale = 100 
channel = -1
loop = 0



[State 19330, End]
type = ChangeState
trigger1 = AnimTime = 0
value = 0

; INTRO 4: Transform
[StateDef 19400]
type = S
physics = N
velSet = 0,0
anim = 19400
sprPriority = -1

[State 19400, RemapPal]
type = RemapPal
trigger1 = !Time
source = 1,1
dest = 1,1
;ignorehitpause = 
;persistent =

[State 19321, DestroySelf]
type = DestroySelf
trigger1 = time = 250

; INTRO 4: Chaos Emeralds
[StateDef 19410]
type = S
physics = N
velSet = 0,0
anim = 19410
sprPriority = 0

[State 19321, DestroySelf]
type = DestroySelf
trigger1 = time = 150

;---------------------------------------------------------------------------
; PROJECTILES HELPERS
;---------------------------------------------------------------------------

;Tyrodoken (Weak)
[Statedef 1001]
type = S
physics = N
movetype = A
anim = 1001
ctrl = 0
velset = 3, 0
sprpriority = 0

[State 1001, Assert]
type = AssertSpecial
trigger1 = IsHelper
flag = NoShadow

[State 1001, Trans]
type = Trans
trigger1 = IsHelper
trans = Add

[State 1001, Hit]
type = HitDef
trigger1 = AnimElem = 5
air.juggle = 10
priority = 4, Hit
attr = S, SA
damage = 60, 15
guard.dist = const(size.proj.attack.dist)
animtype = Hard
hitflag = MAF
guardflag = MA
pausetime = 0, 12
sparkno = s7012
guard.sparkno = s7006
sparkxy = -40,10
hitsound = s3,3
guardsound = s2,5
ground.type = High
ground.hittime = 1 + 18
ground.slidetime = 18
ground.velocity = -10.52, 0
ground.cornerpush.veloff = 0
guard.hittime = 1 + 16
guard.ctrltime = 1 + 16
guard.slidetime = 16
air.velocity = -0.75 * vel x, -6
yaccel = 0.4850
fall = 0
air.fall = 1
fall.recover = 1
fall.recovertime = 120
getpower = 40, 40
givepower = 80, 80
envshake.time = 12; special
envshake.freq = 180
envshake.ampl = ifelse((gametime % 2), -2, 2)
p1sprpriority = 1
airguard.ctrltime = 1 + 16
airguard.velocity = -6.00, -1.00


[State 1001, DestroySelf]
type = DestroySelf
trigger1 = !AnimTime

;Tyrodoken (Strong)
[Statedef 1002]
type = S
physics = N
movetype = A
anim = 1002
ctrl = 0
velset = 0, 0
sprpriority = 0

[State 1002, Assert]
type = AssertSpecial
trigger1 = IsHelper
flag = NoShadow

[State 1002, Trans]
type = Trans
trigger1 = IsHelper
trans = Add

[State 1002, Projectile]
type = Projectile
trigger1 = AnimElem = 3
ProjID = 1005
projanim = 	1005
projhitanim = 1006
projscale = 1,1
projremove = 1
projremovetime = -1
projhits = 1
projmisstime = 0
projpriority = 2
projsprpriority = -1
projedgebound = 40
projstagebound = 40
projheightbound = -240,0
getpower = 50, 50
givepower = 100, 100
ownpal = 1
offset = 25,-20
velocity = 4, 0
air.juggle = 10
priority = 4, Hit
attr = S, SP
damage = 60, 15
guard.dist = const(size.proj.attack.dist)
animtype = Medium
hitflag = MAF
guardflag = MA
pausetime = 0, 12
sparkno = -1
guard.sparkno = s7006
sparkxy = 0,0
hitsound = s3,3
guardsound = s2,5
ground.type = High
ground.hittime = 1 + 18
ground.slidetime = 18
ground.velocity = -10.52, 0
ground.cornerpush.veloff = 0
guard.hittime = 1 + 16
guard.ctrltime = 1 + 16
guard.slidetime = 16
air.velocity = -0.75 * vel x, -6
yaccel = 0.4850
fall = 0
air.fall = 1
fall.recover = 1
fall.recovertime = 120
envshake.time = 12; special
envshake.freq = 180
envshake.ampl = ifelse((gametime % 2), -2, 2)
p1sprpriority = 1
airguard.ctrltime = 1 + 16
airguard.velocity = -6.00, -1.00
forcestand = 1

[State 1002, DestroySelf]
type = DestroySelf
trigger1 = !AnimTime


;Plasma Ball (Level 1 Super)
[Statedef 3002]
type = S
physics = N
movetype = A
anim = 13001
ctrl = 0
velset = 0, 0
sprpriority = 1

[State 3002, PlaySnd]
type = PlaySnd
triggerall = IsHelper
trigger1 = !time
value = S3000,0 
channel = 1
loop = 0

[State 3002, HB]
type = hitby
trigger1 = 1
time = -1
value = SCA, NP, SP, HP
ignorehitpause = 1

[State 3002, Vel]
type = velset
trigger1 = 1
x = 10
y = 0

[State 3002, Spark]
type = HitDef
triggerall = IsHelper
trigger1 = !time
ID = 3002
getpower = 0, 0
givepower = 40, 40
air.juggle = 10
priority = 4, Hit
attr = A, HA
damage = 30, 15
guard.dist = const(size.proj.attack.dist)
animtype = Medium
hitflag = MAF
guardflag = M
pausetime = 0, 12
sparkno = -1
guard.sparkno = s7006
sparkxy = 0,-30
hitsound = s3000,1
guardsound = s2,5
ground.type = High
ground.hittime = 1 + 18
ground.slidetime = 18
ground.velocity = -10.52, 0
ground.cornerpush.veloff = 0
guard.hittime = 1 + 16
guard.ctrltime = 1 + 16
guard.slidetime = 16
air.velocity = -0.75 * vel x, -6
yaccel = 0.4850
fall = 0
air.fall = 1
fall.recover = 0
fall.recovertime = 120
envshake.time = 12; special
envshake.freq = 180
envshake.ampl = ifelse((gametime % 2), -2, 2)
p1sprpriority = 1
airguard.ctrltime = 1 + 16
airguard.velocity = -6.00, -1.00
forcestand = 1
palfx.time = 30
palfx.add = 256,256,256
palfx.mul = 128,128,128
palfx.sinadd = -256,-256,-256,4
palfx.invertall = 1
palfx.color = 256
kill = 0

[State 2301, Change]
type = SelfState
triggerall = IsHelper
trigger1 = MoveContact && NumTarget
value = 3005

[State 2301, DestroySelf]
type = DestroySelf
triggerall = IsHelper
trigger1 = FrontEdgeDist < -50

;Plasma Ball (Level 1 Super)
[Statedef 3003]
type = S
physics = N
movetype = A
anim = 13001
ctrl = 0
velset = 0, 0
sprpriority = 1

[State 3002, PlaySnd]
type = PlaySnd
triggerall = IsHelper
trigger1 = !time
value = S3000,0 
channel = 1
loop = 0

[State 3002, Vel]
type = velset
trigger1 = 1
x = 10
y = 0

[State 1005, HB]
type = hitby
trigger1 = 1
time = -1
value = SCA, NP, SP, HP
ignorehitpause = 1

[State 3002, Spark]
type = HitDef
triggerall = IsHelper
trigger1 = !time
ID = 3002
getpower = 0, 0
givepower = 40, 40
air.juggle = 10
priority = 4, Hit
attr = A, HA
damage = 30, 15
guard.dist = const(size.proj.attack.dist)
animtype = DiagUp
hitflag = MAF
guardflag = M
pausetime = 0, 12
sparkno = -1
guard.sparkno = s7006
sparkxy = 0,-30
hitsound = s3000,1
guardsound = s2,5
ground.type = High
ground.hittime = 1 + 18
ground.slidetime = 18
ground.velocity = -10.52, -10
ground.cornerpush.veloff = 0
guard.hittime = 1 + 16
guard.ctrltime = 1 + 16
guard.slidetime = 16
air.velocity = -0.75 * vel x, -6
yaccel = 0.4850
fall = 1
air.fall = 1
fall.recover = 0
fall.recovertime = 120
envshake.time = 12; special
envshake.freq = 180
envshake.ampl = ifelse((gametime % 2), -2, 2)
p1sprpriority = 1
airguard.ctrltime = 1 + 16
airguard.velocity = -6.00, -1.00
palfx.time = 30
palfx.add = 256,256,256
palfx.mul = 128,128,128
palfx.sinadd = -256,-256,-256,4
palfx.invertall = 1
palfx.color = 256
kill = 1

[State 2301, Change]
type = SelfState
triggerall = IsHelper
trigger1 = MoveContact && NumTarget
value = 3005

[State 2301, DestroySelf]
type = DestroySelf
triggerall = IsHelper
trigger1 = FrontEdgeDist < -50

[Statedef 3005]
type = S
physics = N
movetype = I
anim = 13002
ctrl = 0
velset = 0,0
sprpriority = 1

[State 2302, End]
type = DestroySelf
triggerall = IsHelper
trigger1 = !AnimTime


;Rocket (Level 2 Super)
[Statedef 3012]
type = S
physics = N
movetype = A
anim = 13011
ctrl = 0
sprpriority = 1


[State 3012, PlaySnd]
type = PlaySnd
triggerall = IsHelper
trigger1 = !time
value = S3010,0 
channel = 1
loop = 0

[State 3012, HB]
type = hitby
trigger1 = 1
time = -1
value = SCA, NP, SP, HP
ignorehitpause = 1

[State 3012, Vel]
type = velset
trigger1 = 1
x = 20
y = 0

[State 3012, Spark]
type = HitDef
triggerall = IsHelper
trigger1 = !time
ID = 3012
getpower = 0, 0
givepower = 40, 40
air.juggle = 10
priority = 4, Hit
attr = A, HA
damage = 50, 25
guard.dist = const(size.proj.attack.dist)
animtype = Medium
hitflag = MAF
guardflag = M
pausetime = 0, 12
sparkno = -1
guard.sparkno = s7006
sparkxy = 0,-30
hitsound = s3010,1
guardsound = s2,5
ground.type = High
ground.hittime = 1 + 30
ground.slidetime = 25
ground.velocity = -10.52, 0
ground.cornerpush.veloff = 0
guard.hittime = 1 + 16
guard.ctrltime = 1 + 16
guard.slidetime = 16
air.velocity = -0.75 * vel x, -6
yaccel = 0.4850
fall = 0
air.fall = 1
fall.recover = 0
fall.recovertime = 120
envshake.time = 12; special
envshake.freq = 180
envshake.ampl = ifelse((gametime % 2), -2, 2)
p1sprpriority = 1
airguard.ctrltime = 1 + 16
airguard.velocity = -6.00, -1.00
forcestand = 1
palfx.time = 30
palfx.add = 240,50,0
palfx.mul = 250,224,120
palfx.sinadd = 110,55,85,30
palfx.invertall = 0
palfx.color = 0
kill = 0

[State 2301, Change]
type = SelfState
triggerall = IsHelper
trigger1 = MoveContact && NumTarget
value = 3015

[State 2301, DestroySelf]
type = DestroySelf
triggerall = IsHelper
trigger1 = FrontEdgeDist < -50

;Rocket (Level 2 Super)
[Statedef 3013]
type = S
physics = N
movetype = A
anim = 13011
ctrl = 0
velset = 10, 0
sprpriority = 1

[State 3012, PlaySnd]
type = PlaySnd
triggerall = IsHelper
trigger1 = !time
value = S3010,0 
channel = 1
loop = 0

[State 1005, HB]
type = hitby
trigger1 = 1
time = -1
value = SCA, NP, SP, HP
ignorehitpause = 1

[State 1005, Vel]
type = velset
trigger1 = 1
x = 20
y = 0

[State 3002, Spark]
type = HitDef
triggerall = IsHelper
trigger1 = !time
ID = 3012
getpower = 0, 0
givepower = 50, 50
air.juggle = 10
priority = 4, Hit
attr = A, HA
damage = 50, 50
guard.dist = const(size.proj.attack.dist)
animtype = DiagUp
hitflag = MAF
guardflag = M
pausetime = 0, 12
sparkno = -1
guard.sparkno = s7006
sparkxy = 0,-30
hitsound = s3010,1
guardsound = s2,5
ground.type = High
ground.hittime = 1 + 18
ground.slidetime = 18
ground.velocity = -10.52, -15
ground.cornerpush.veloff = 0
guard.hittime = 1 + 16
guard.ctrltime = 1 + 16
guard.slidetime = 16
air.velocity = -0.75 * vel x, -6
yaccel = 0.4850
fall = 1
air.fall = 1
fall.recover = 0
fall.recovertime = 120
envshake.time = 12; special
envshake.freq = 180
envshake.ampl = ifelse((gametime % 2), -2, 2)
p1sprpriority = 1
airguard.ctrltime = 1 + 16
airguard.velocity = -6.00, -1.00
palfx.time = 30
palfx.add = 240,50,0
palfx.mul = 250,224,120
palfx.sinadd = 110,55,85,30
palfx.invertall = 0
palfx.color = 0
kill = 1

[State 2301, Change]
type = SelfState
triggerall = IsHelper
trigger1 = MoveContact && NumTarget
value = 3015

[State 2301, DestroySelf]
type = DestroySelf
triggerall = IsHelper
trigger1 = FrontEdgeDist < -50
 
[Statedef 3015]
type = S
physics = N
movetype = I
anim = 13012
ctrl = 0
velset = 0,0
sprpriority = 1

[State 2302, End]
type = DestroySelf
triggerall = IsHelper
trigger1 = !AnimTime


;BFG Ball (MAX Super)
[Statedef 3022]
type = S
physics = N
movetype = A
anim = 13021
ctrl = 0
sprpriority = 1

[State 3022, VelSet]
type = VelSet
trigger1 = !time
x = 10
;ignorehitpause = 
;persistent = 

[State 3022, Explod]
type = Explod
trigger1 = IsHelper
anim = 13023
ID = 3022
pos = 0,0
postype = p1  ;P2, Front, Back, Left, Right
random = 90,90
removetime = -2
ownpal = 1
removeongethit = 1
;persistent = 

[State 3022, HB]
type = hitby
trigger1 = 1
time = -1
value = SCA, NP, SP, HP
ignorehitpause = 1

[State 3022, Vel]
type = velset
trigger1 = 1
x = 10
y = 0

[State 3002, Spark]
type = HitDef
triggerall = IsHelper
trigger1 = !time 
ID = 3022
getpower = 0, 0
givepower = 40, 40
air.juggle = 10
priority = 4, Hit
attr = A, HA
damage = 500, 100
guard.dist = const(size.proj.attack.dist)
animtype = DiagUp
hitflag = MAF
guardflag = M
pausetime = 0, 12
sparkno = -1
guard.sparkno = s7006
sparkxy = 0,-30
hitsound = s3020,1
guardsound = s2,5
ground.type = High
ground.hittime = 1 + 18
ground.slidetime = 18
ground.velocity = -10.52, -20
ground.cornerpush.veloff = 0
guard.hittime = 1 + 16
guard.ctrltime = 1 + 16
guard.slidetime = 16
air.velocity = -0.75 * vel x, -6
yaccel = 0.4850
fall = 1
air.fall = 1
fall.recover = 0
fall.recovertime = 120
envshake.time = 12; special
envshake.freq = 180
envshake.ampl = ifelse((gametime % 2), -2, 2)
p1sprpriority = 1
airguard.ctrltime = 1 + 16
airguard.velocity = -6.00, -1.00
forcestand = 1
palfx.time = 30
palfx.add = 50,240,50
palfx.mul = 250,224,120
palfx.sinadd = 110,55,85,30
palfx.invertall = 0
palfx.color = 0
kill = 1

[State 2301, Change]
type = SelfState
triggerall = IsHelper
trigger1 = MoveContact && NumTarget
value = 3025

[State 2301, DestroySelf]
type = DestroySelf
triggerall = IsHelper
trigger1 = FrontEdgeDist < -50
 
[Statedef 3025]
type = S
physics = N
movetype = I
anim = 13022
ctrl = 0
velset = 0,0
sprpriority = 1

[State 2302, End]
type = DestroySelf
triggerall = IsHelper
trigger1 = !AnimTime



[State 2301, DestroySelf]
type = DestroySelf
triggerall = IsHelper
trigger1 = FrontEdgeDist < -50

;Tyinkku Tyrodoken (LEVEL 1 Super)
[Statedef 3041]
type = S
physics = N
movetype = A
anim = 3042
ctrl = 0
velset = 0, 0
sprpriority = 0

[State 3041, Assert]
type = AssertSpecial
trigger1 = IsHelper
flag = NoShadow

[State 3041, Trans]
type = Trans
trigger1 = IsHelper
trans = Add

[State 3041, Projectile]
type = Projectile
trigger1 = AnimElem = 3
ProjID = 3045
projanim = 	3045
projhitanim = 3046
projscale = 1,1
projremove = 1
projremovetime = -1
projhits = 5
projmisstime = 0
projpriority = 2
projsprpriority = -1
getpower = 0, 0
givepower = 40, 40
ownpal = 1
offset = 25,-20
velocity = 7, 0
air.juggle = 10
priority = 4, Hit
attr = S, HP
damage = 30, 15
guard.dist = const(size.proj.attack.dist)
animtype = Hard
hitflag = MAF
guardflag = M
pausetime = 0, 12
sparkno = s7012
guard.sparkno = s7006
sparkxy = 0,0
hitsound = s3,3
guardsound = s2,5
ground.type = High
ground.hittime = 1 + 18
ground.slidetime = 18
ground.velocity = -10.52, 0
ground.cornerpush.veloff = 0
guard.hittime = 1 + 16
guard.ctrltime = 1 + 16
guard.slidetime = 16
air.velocity = -0.75 * vel x, -6
yaccel = 0.4850
fall = 1
air.fall = 1
fall.recover = 1
fall.recovertime = 120
envshake.time = 12; special
envshake.freq = 180
envshake.ampl = ifelse((gametime % 2), -2, 2)
p1sprpriority = 1
airguard.ctrltime = 1 + 16
airguard.velocity = -6.00, -1.00
forcestand = 1
kill = 1

[State 3041, DestroySelf]
type = DestroySelf
trigger1 = !AnimTime


;Tyinkku Tyrodoken (LEVEL 2 Super)
[Statedef 3046]
type = S
physics = N
movetype = A
anim = 3042
ctrl = 0
velset = 0, 0
sprpriority = 0

[State 3046, Assert]
type = AssertSpecial
trigger1 = IsHelper
flag = NoShadow

[State 3046, Trans]
type = Trans
trigger1 = IsHelper
trans = Add

[State 3046, Projectile]
type = Projectile
trigger1 = AnimElem = 3
ProjID = 3045
projanim = 	3045
projhitanim = 3046
projscale = 1,1
projremove = 1
projremovetime = -1
projhits = 5
projmisstime = 0
projpriority = 2
projsprpriority = -1
getpower = 0, 0
givepower = 40, 40
ownpal = 1
offset = 25,-20
velocity = 7, 0
air.juggle = 10
priority = 4, Hit
attr = S, HP
damage = 30, 15
guard.dist = const(size.proj.attack.dist)
animtype = Hard
hitflag = MAF
guardflag = M
pausetime = 0, 12
sparkno = s7012
guard.sparkno = s7006
sparkxy = 0,0
hitsound = s3,3
guardsound = s2,5
ground.type = High
ground.hittime = 1 + 18
ground.slidetime = 18
ground.velocity = -10.52, 0
ground.cornerpush.veloff = 0
guard.hittime = 1 + 16
guard.ctrltime = 1 + 16
guard.slidetime = 16
air.velocity = -0.75 * vel x, -6
yaccel = 0.4850
fall = 0
air.fall = 1
fall.recover = 1
fall.recovertime = 120
envshake.time = 12; special
envshake.freq = 180
envshake.ampl = ifelse((gametime % 2), -2, 2)
p1sprpriority = 1
airguard.ctrltime = 1 + 16
airguard.velocity = -6.00, -1.00
forcestand = 1
kill = 0

[State 3046, DestroySelf]
type = DestroySelf
trigger1 = !AnimTime

;Dyinkku Tyrodoken (LEVEL 2 Super)
[Statedef 3047]
type = S
physics = N
movetype = A
anim = 3043
ctrl = 0
velset = 0, 0
sprpriority = 0

[State 3047, Assert]
type = AssertSpecial
trigger1 = IsHelper
flag = NoShadow

[State 3047, Trans]
type = Trans
trigger1 = IsHelper
trans = Add

[State 3047, Projectile]
type = Projectile
trigger1 = AnimElem = 3
ProjID = 3047
projanim = 	3047
projhitanim = 3048
projscale = 1,1
projremove = 1
projremovetime = -1
projhits = 1
projmisstime = 0
getpower = 0, 0
givepower = 40, 40
ownpal = 1
offset = 25,-50
velocity = 10, 0
air.juggle = 10
priority = 4, Hit
attr = S, HP
damage = 200, 15
guard.dist = const(size.proj.attack.dist)
animtype = DiagUp
hitflag = MAF
guardflag = M
pausetime = 10,10
sparkno = s7012
guard.sparkno = s7006
sparkxy = 0,0
hitsound = s3,3
guardsound = s2,5
ground.type = High
ground.hittime = 1 + 18
ground.slidetime = 18
ground.velocity = -10.52, -10
ground.cornerpush.veloff = 0
guard.hittime = 1 + 16
guard.ctrltime = 1 + 16
guard.slidetime = 16
yaccel = 0.4850
fall = 1
air.fall = 1
fall.recover = 0
fall.recovertime = 120
envshake.time = 12
envshake.freq = 180
envshake.ampl = ifelse((gametime % 2), -2, 2)
airguard.ctrltime = 1 + 16
airguard.velocity = -6.00, -1.00
kill = 1

[State 3047, DestroySelf]
type = DestroySelf
trigger1 = !AnimTime



;---------------------------------------------------------------------------
; SUPER/SUPERFINISH HELPERS
;---------------------------------------------------------------------------

;SuperFinishes LOGO 1
[StateDef 8020]
type = A
velSet = 0,0
anim = 2

[State 8020, LOGO 1]
type = explod
trigger1 = !time
anim = 8020
ID = 8020
sprpriority = 1
postype = Left
pos = 160, floor((1.3333333 * GameHeight / GameWidth) * 120)
scale = 0.5, 0.5 * (1.3333333 * GameHeight / GameWidth)
bindTime = -1
removeTime = -1
pauseMoveTime = -1
superMoveTime = -1


[State 8020, DestroySelf]
type = DestroySelf
trigger1 = time = 50

;SuperFinishes LOGO 2
[StateDef 8021]
type = A
velSet = 0,0
anim = 2

[State 8021, LOGO 2]
type = explod
trigger1 = !time
anim = 8021
ID = 8021
sprpriority = 1
postype = Left
pos = 160, floor((1.3333333 * GameHeight / GameWidth) * 120)
scale = 0.5, 0.5 * (1.3333333 * GameHeight / GameWidth)
bindTime = -1
removeTime = -1
pauseMoveTime = -1
superMoveTime = -1

[State 8021, DestroySelf]
type = DestroySelf
trigger1 = time = 50

;SuperFinishes LOGO 3
[StateDef 8022]
type = A
velSet = 0,0
anim = 2

[State 8022, LOGO 3]
type = explod
trigger1 = !time
anim = 8022
ID = 8022
sprpriority = 1
postype = Left
pos = 160, floor((1.3333333 * GameHeight / GameWidth) * 120)
scale = 0.5, 0.5 * (1.3333333 * GameHeight / GameWidth)
bindTime = -1
removeTime = -1
pauseMoveTime = -1
superMoveTime = -1

[State 8022, DestroySelf]
type = DestroySelf
trigger1 = time = 50

;SuperFinishes LOGO 4
[StateDef 8023]
type = A
velSet = 0,0
anim = 2

[State 8023, LOGO 4]
type = explod
trigger1 = !time 
anim = 8023
ID = 8023
sprpriority = 1
postype = Left
pos = 160, floor((1.3333333 * GameHeight / GameWidth) * 120)
scale = 0.5, 0.5 * (1.3333333 * GameHeight / GameWidth)
bindTime = -1
removeTime = -1
pauseMoveTime = -1
superMoveTime = -1

[State 8023, DestroySelf]
type = DestroySelf
trigger1 = time = 50

;SuperFinishes LOGO 5
[StateDef 8024]
type = A
velSet = 0,0
anim = 2

[State 8024, LOGO 5]
type = explod
trigger1 = !time
anim = 8024
ID = 8024
sprpriority = 1
postype = Left
pos = 160, floor((1.3333333 * GameHeight / GameWidth) * 120)
scale = 0.5, 0.5 * (1.3333333 * GameHeight / GameWidth)
bindTime = -1
removeTime = -1
pauseMoveTime = -1
superMoveTime = -1

[State 8024, DestroySelf]
type = DestroySelf
trigger1 = time = 50

;SuperFinishes LOGO 6
[StateDef 8025]
type = A
velSet = 0,0
anim = 2

[State 8025, AssertSpecial]
type = AssertSpecial
trigger1 = 1 
flag = NOKO 

[State 8025, LOGO 6]
type = explod
trigger1 = !time
anim = 8025
ID = 8025
sprpriority = 1
postype = Left
pos = 160, floor((1.3333333 * GameHeight / GameWidth) * 120)
scale = 0.5, 0.5 * (1.3333333 * GameHeight / GameWidth)
bindTime = -1
removeTime = -1
pauseMoveTime = -1
superMoveTime = -1

[State 8025, DestroySelf]
type = DestroySelf
trigger1 = time = 50

;AFTERIMAGE
[Statedef 11100]
type = S
velSet = 0, 0
anim = Root, Anim
sprPriority = -3

[State 19210, Transparency]
type = Trans
trigger1 = 1
trans = AddAlpha
alpha = 256 - 16 * Time, 0 + 16 * Time
ignoreHitPause = 1

[State 19210, Assert: NoShadow]
type = AssertSpecial
trigger1 = 1
flag = NoShadow
ignoreHitPause = 1

[State 19210, End]
type = DestroySelf
trigger1 = Time = 16

;AFTER IMAGE
[Statedef 13030]
type = S
velSet = 0, 0
anim = Root, Anim
sprPriority = -3

[State 13030, Transparency]
type = Trans
trigger1 = 1
trans = AddAlpha
alpha = 256 - 16 * Time, 0 + 16 * Time
ignoreHitPause = 1

[State 13030, Assert: NoShadow]
type = AssertSpecial
trigger1 = 1
flag = NoShadow
ignoreHitPause = 1

[State 13030, End]
type = DestroySelf
trigger1 = Time = 16

;LEVEL 1 SUPER
[Statedef 17100]
type = S
physics = N
velSet = 0, 0
anim = 7100
sprPriority = 1

[State 8520, Assert: NoShadow]
type = AssertSpecial
trigger1 = 1
flag = NoShadow
ignoreHitPause = 1

[State 3000, Assert: NoBarDisplay, NoBG, NoFG]
type = AssertSpecial
trigger1 = Time < 34
flag = NoBG
flag2 = NoFG

[State 17100, RemapPal]
type = RemapPal
trigger1 = !time
source = 7100,0
dest = 7100,0
;ignorehitpause = 
;persistent = 

[State 17100, End]
type = DestroySelf
trigger1 = Time = 34


;LEVEL 2 SUPER
[Statedef 17101]
type = S
physics = N
velSet = 0, 0
anim = 7100
sprPriority = 1

[State 8520, Assert: NoShadow]
type = AssertSpecial
trigger1 = 1
flag = NoShadow
ignoreHitPause = 1

[State 3000, Assert: NoBarDisplay, NoBG, NoFG]
type = AssertSpecial
trigger1 = Time < 34
flag = NoBG
flag2 = NoFG

[State 17101, RemapPal]
type = RemapPal
trigger1 = !time
source = 7100,0
dest = 7100,1
;ignorehitpause = 
;persistent = 

[State 17101, End]
type = DestroySelf
trigger1 = Time = 34

;LEVEL 3/MAX SUPER
[Statedef 17102]
type = S
physics = N
velSet = 0, 0
anim = 7100
sprPriority = 1

[State 17102, RemapPal]
type = RemapPal
trigger1 = !time
source = 7100,0
dest = 7100,2
;ignorehitpause = 
;persistent =

[State 17102, End]
type = DestroySelf
trigger1 = Time = 34


;Max Super BG
[StateDef 8000]
type = A
velset = 0,0
anim = 2
sprPriority = 5

[State 8000, Assert: NoShadow]
type = AssertSpecial
trigger1 = 1
flag = NoShadow
ignoreHitPause = 1

[State 8000, Assert: NoBarDisplay, NoBG, NoFG]
type = AssertSpecial
trigger1 = Time < 40
flag = NoBG
flag2 = NoFG
flag3 = NoBarDisplay

[State 8000, Portrait 1]
type = Explod
trigger1 = !Time
anim = 8000
ID = 8000
sprPriority = -16
posType = Back
removeTime = 40
superMoveTime = -1

[State 8000, Portrait 2]
type = Explod
trigger1 = !Time
anim = 8000 
ID = 8001
sprPriority = -16
posType = Back
removeTime = 40
superMoveTime = -1

[State 8000, Scale Portrait 1a]
type = ModifyExplod
trigger1 = NumExplod(8000) && Time < 16
ID = 8000
posType = Back
pos = 160, floor((1.3333333 * GameHeight / GameWidth) * 121)
scale = 1 - (0.03125 * Time), 1 - (0.03125 * Time)
trans = AddAlpha
alpha = (8 * Time), 256

[State 8000, Scale Portrait 2a]
type = ModifyExplod
trigger1 = NumExplod(8001) && Time < 16
ID = 8001
posType = Back
pos = 160, floor((1.3333333 * GameHeight / GameWidth) * 121)
scale = 2 - (0.09375 * Time), 2 - (0.09375 * Time)
trans = AddAlpha
alpha = (8 * Time), 256

[State 8000, Scale Portrait 1b]
type = ModifyExplod
trigger1 = NumExplod(8000) && (Time = [16,32])
ID = 8000
posType = Back
pos = 160, floor((1.3333333 * GameHeight / GameWidth) * 121)
scale = 0.5, 0.5
trans = AddAlpha
alpha = 256, 256

[State 8000, Scale Portrait 2b]
type = ModifyExplod
trigger1 = NumExplod(8001) && (Time = [16,32])
ID = 8001
scale = 0,0

[State 8000, Scale Portrait 1c]
type = ModifyExplod
trigger1 = NumExplod(8000) && Time >= 32
ID = 8000
posType = Back
pos = 160 + (8 * (Time - 32)), floor((1.3333333 * GameHeight / GameWidth) * 121)
scale = 0.5, 0.5
trans = AddAlpha
alpha = 128 - 16 * (Time - 32), 256

[State 8000, Scale Portrait 2c]
type = ModifyExplod
trigger1 = NumExplod(8001) && Time >= 32
ID = 8001
posType = Back
pos = 160 - (8 * (Time - 32)), floor((1.3333333 * GameHeight / GameWidth) * 121)
scale = 0.5, 0.5
trans = AddAlpha
alpha = 128 - 16 * (Time - 32), 256

[State 8000, End]
type = DestroySelf
trigger1 = Time = 40