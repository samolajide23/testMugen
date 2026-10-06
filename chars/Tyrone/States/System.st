; ________________________________
;|Tyrone The Fox By DoomJoshuaBoy|
; ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯

;---------------------------------------------------------------------------
; SYSTEM
;---------------------------------------------------------------------------

;---------------------------------------------------------------------------
;MOVEMENTS
;---------------------------------------------------------------------------

;---------------------------------------------------------------------------
; Stand
[Statedef 0]
type = S
physics = S
movetype = I
velSet = 0,0
sprPriority = 0
juggle = 0

[State 0, Remove Explods]
type = RemoveExplod
trigger1 = IsHelper

[State 0, Destroy Helpers]
type = DestroySelf
trigger1 = IsHelper

[State 0, Life Check (High)]
type = ChangeAnim
triggerall = Life > (LifeMax/4)
trigger1 = Anim = 5 && !AnimTime
trigger2 = Time = 0 && Anim != 5
value = 0

[State 0, Life Check (Low)]
type = ChangeAnim
triggerall = Life <= (LifeMax/4)
trigger1 = Anim = 5 && !AnimTime
trigger2 = Time = 0 && Anim != 5
value = 1

[State 0, Dead]
type = selfstate
trigger1 = !alive
value = 5050
ctrl = 0

;Crouch
[Statedef 10]
type = C
physics = C
movetype = I
velset = 0, 0
sprpriority = 0

[State 10, Anim]
type = changeanim
triggerall = !time
trigger1 = anim = 12
value = 10
elem = 4 - animelemno(0)

[State 10, Anim]
type = changeanim
trigger1 = anim != 10
value = 10

[State 10, End]
type = selfstate
trigger1 = !animtime
value = 11


[Statedef 11]
type = C
physics = C
movetype = I
anim = 11
velset = 0, 0
sprpriority = 0

[State 11, Anim]
type = changeanim
trigger1 = anim = 6
trigger1 = !animtime
value = 11


[Statedef 12]
type = S
physics = S
movetype = I
velset = 0, 0
sprpriority = 0

[State 12, Anim]
type = changeanim
trigger1 = !time
trigger1 = anim = 10
value = 12
elem = 2 - animelemno(0)

[State 12, Anim]
type = changeanim
trigger1 = anim != 12
value = 12

[State 12, End]
type = selfstate
trigger1 = !animtime
value = 0


;WALKING
[Statedef 20]
type = S
physics = S
movetype = I
sprpriority = 0

[State 20, Vel]
type = velset
trigger1 = command = "holdfwd"
x = const(velocity.walk.fwd.x)

[State 20, Vel]
type = velset
trigger1 = command = "holdback"
x = const(velocity.walk.back.x)

[State 20, Anim]
type = changeanim
triggerall = vel x > 0
trigger1 = anim != 5 && anim != 12 && anim != 20
trigger2 = anim = 5
trigger2 = !animtime
trigger3 = anim = 12
trigger3 = !animtime
value = 20

[State 20, Anim]
type = changeanim
triggerall = vel x < 0
trigger1 = anim != 5 && anim != 12 && anim != 21
trigger2 = anim = 5
trigger2 = !animtime
trigger3 = anim = 12
trigger3 = !animtime
value = 21




;---------------------------------------------------------------------------
; Jump Start
[Statedef 40]
type = S
physics = S
anim = 40
ctrl = 0
velSet = 0,0
sprPriority = 1
faceP2 = 1

[State 40, Snd]
type = PlaySnd
trigger1 = !time
value = s0,4
volumescale = 100
channel = -1
loop = 0

[State 40, Var]
type = VarSet
trigger1 = !time
sysvar(1) = 0

[State 40, Var]
type = VarSet
trigger1 = command = "holdfwd"
sysvar(1) = 1

[State 40, Var]
type = VarSet
trigger1 = command = "holdback"
sysvar(1) = -1

[State 40, Vel]
type = VelSet
trigger1 = !AnimTime
x = ifelse(sysvar(1)=0, const(velocity.jump.neu.x), ifelse(sysvar(1)=1, const(velocity.jump.fwd.x), const(velocity.jump.back.x)))
y = const(velocity.jump.y)

[State 40, Vel]
type = VelSet
trigger1 = !AnimTime
trigger1 = prevstateno = 100 ;RUN_FWD
trigger1 = sysvar(1) = 1
x = const(velocity.runjump.fwd.x)

[State 40, End]
type = ChangeState
trigger1 = !AnimTime
value = 50
ctrl = 1

; AirJump Start (Flight)
[Statedef 45]
type = A
physics = S
moveType = I
anim = 50
ctrl = 0
velSet = 0,0
sprPriority = 1
faceP2 = 1

[State 45, State]
type = changestate
trigger1 = !time
value = 46
ctrl = 1

;Flying
[Statedef 46]
type = A
physics = A
moveType = I
ctrl = 0
velSet = 0,0
sprPriority = 1
faceP2 = 1
anim = 51

[State 46, attack]
type = ChangeState
trigger1 = !AILevel && Command = "x"
trigger2 = AILevel && P2BodyDist x <= 20 && P2BodyDist y <= -35
value = 601

[State 46, attack]
type = ChangeState
trigger1 = !AILevel && Command = "y"
trigger2 = AILevel && P2BodyDist x <= 20 && P2BodyDist y <= -35
value = 611

[State 46, attack]
type = ChangeState
trigger1 = !AILevel && Command = "a"
trigger2 = AILevel && P2BodyDist x <= 20 && P2BodyDist y <= -35
value = 621

[State 46, attack]
type = ChangeState
trigger1 = !AILevel && Command = "b"
trigger2 = AILevel && P2BodyDist x <= 20 && P2BodyDist y <= -35
value = 631

[State 46, Snd]
type = PlaySnd
trigger1 = AnimElem = 2 || AnimElem = 4
value = s5,0

[state 46, VelSet]
type = velset
trigger1 = time > 0
y = 0.05

[state 46, VelSet]
type = velset
trigger1 = vel X>= 2
x = 2

[state 46, VelSet]
type = velset
trigger1 = vel X<= -2
x = -2

[state 46, VelAdd]
type = veladd
trigger1 = !AILevel && Command = "holdfwd" && vel X<= 2
trigger2 = AILevel && P2BodyDist x <= 20 && P2BodyDist y <= 60 && vel X>= -2 
x = 0.3

[state 46, VelAdd]
type = veladd
trigger1 = !AILevel && Command = "holdback" && vel X>= -2
trigger2 = AILevel && P2BodyDist x >= 20 && P2BodyDist y <= 60 && vel X>= -2
trigger2 = InGuardDist
x = -0.3

[state 46, VelSet]
type = velset
trigger1 = !Ailevel && command != "holdback" && command != "holdfwd"
trigger2 = AILevel && P2BodyDist x = 20
x = 0

[state 46, End]
type = changestate
trigger1 = Pos Y >= -30
trigger2 = command = "holddown"
trigger3 = winko || WinTime
value = 47


;Drop down 
[statedef 47]
type = A
physics = A
moveType = I
ctrl = 0
velSet = 0,0
sprPriority = 1
faceP2 = 1
anim = 52


[State 47, VelAdd]
type = VelAdd
trigger1 = 1
y = 1


[state 47, End]
type = changestate
trigger1 = !AnimTime 
value = 52
ctrl = 0


;---------------------------------------------------------------------------
; Jump Up
[Statedef 50]
type = A
physics = A
moveType = I
sprPriority = 1

[State 50, ChangeState]
type = ChangeState
triggerall = time = 30
trigger1 = Pos Y >= -50
trigger1 = command = "holdup"  
value = 45

[State 50, Var]
type = VarSet
trigger1 = Time = 0
sysvar(1) = 0

[State 50, Var]
type = ChangeAnim
trigger1 = Time = 0
value = ifelse((vel x)=0, 41, ifelse((vel x)>0, 42, 43))

[State 50, End]
type = ChangeAnim
trigger1 = Vel y > Const720p(-8)
trigger1 = SelfAnimExist(anim + 3)
trigger1 = anim >= 41 && anim <= 43
persistent = 0
value = Anim + 3

;---------------------------------------------------------------------------
; Jump Land
[Statedef 52]
type = S
physics = S
moveType = I
anim = 47
ctrl = 0
velSet = 0,0
sprPriority = 1

[State 52, Snd]
type = PlaySnd
trigger1 = !time
value = s0,6
volumescale = 100 
channel = -1
loop = 0

[State 52, Vel]
type = VelSet
trigger1 = !time
y = 0

[State 52, Pos]
type = PosSet
trigger1 = !time
y = 0

[State 52, Ctrl]
type = CtrlSet
trigger1 = Time = 3
value = 1

[State 52, Vel]
type = VelSet
trigger1 = abs(vel x) < Const(movement.stand.friction.threshold)
x = 0

[State 52, End]
type = ChangeState
trigger1 = AnimTime = 0
value = 0
ctrl = 1


;---------------------------------------------------------------------------
; Run forward
[Statedef 100]
type = S
physics = N
moveType = I
anim = 100
ctrl = 0
sprPriority = 1

[State 100, Snd]
type = PlaySnd
trigger1 = AnimElem = 3
value = s5,0
volumescale = 100 
channel = -1
loop = 0

[State 100, Vel]
type = VelSet
trigger1 = 1
x = const(velocity.run.fwd.x)

[State 100, Assert] ;Prevent run from canceling into walk
type = AssertSpecial
trigger1 = 1
flag = NoWalk

[State 100, Assert] ;Prevent from turning
type = AssertSpecial
trigger1 = 1
flag = NoAutoTurn

[State 100, End]
type = ChangeState
trigger1 = command != "holdfwd"
value = 0
ctrl = 1

;---------------------------------------------------------------------------
; Hop backwards
[Statedef 105]
type = A
physics = A
moveType = I
velSet = 0,0
anim = 105
ctrl = 0
sprPriority = 1

[State 105, Snd]
type = PlaySnd
trigger1 = !time
value = s5,1
volumescale = 100 
channel = -1
loop = 0

[State 105, Vel]
type = VelSet
trigger1 = Time = 0
x = const(velocity.run.back.x)
y = const(velocity.run.back.y)

[State 105, Ctrl]
type = CtrlSet
trigger1 = Time = 2
value = 1

[State 105, End]
type = ChangeState
trigger1 = Vel Y > 0
trigger1 = Pos Y >= 0
value = 106

;---------------------------------------------------------------------------
; Hop backwards (land)
[Statedef 106]
type    = S
physics = S
ctrl = 0
anim = 47
velSet = 0,0

[State 106, Vel]
type = VelSet
trigger1 = Time = 0
y = 0

[State 106, Pos]
type = PosSet
trigger1 = Time = 0
y = 0

[State 106, Dust]
type = MakeDust
trigger1 = Time = 2
pos = 0, 0
spacing = 1

[State 106, Vel]
type = VelSet
trigger1 = abs(vel x) < Const(movement.stand.friction.threshold)
x = 0

[State 106, End]
type = ChangeState
trigger1 = Time = 7
value = 0
ctrl = 11

;---------------------------------------------------------------------------
; Lose by Time Over
[Statedef 170]
type = S
ctrl = 0
anim = 170
velset = 0,0

[State 170, Assert: RoundNotOver]
type = AssertSpecial
trigger1 = Time < 200
flag = RoundNotOver

;DRAW GAME
[StateDef 175]
type = S
ctrl = 0
velSet = 0,0

[State 175, ChangeState]
type = ChangeState
trigger1 = !Time
value = 170

;CONTINUE?
[StateDef 5500]
type = S
anim = 5300
velSet = 0,0
ctrl = 0

[State 5500, ChangeAnim]
type = ChangeAnim
trigger1 = !Time
value = 5500

;Win State Decider
[Statedef 180]
type = S

[State 180, Quote]
type = victoryquote
trigger1 = 1
value = 1 + (random % 1)

[state 180, Sonic]
type = victoryquote
triggerall = numenemy
trigger1 = enemy, name = "Sonic"
trigger2 = enemy, name = "SonicMH"
value = 50

[state 180, Ryu]
type = victoryquote
triggerall = numenemy
trigger1 = enemy, name = "EvilRyu" || enemy, name = "Evil Ryu"
trigger2 = enemy, name = "cvsevilryu" || enemy, name = "svcevilryu"
trigger3 = enemy, authorname = "Phantom.of.the.Server" && enemy, name = "Ryu" && (enemy, var(1) = 2)
value = 51

[state 180, Ryu]
type = victoryquote
triggerall = numenemy
trigger1 = enemy, name = "Ryu"
trigger2 = enemy, name = "cvsryu" || enemy, name = "svcryu"
value = 51


[state 180, Tails]
type = victoryquote
triggerall = numenemy
trigger1 = enemy, name = "Tails"
trigger2 = enemy, name = "TailsMH"
value = 52

[state 180, Sally]
type = victoryquote
triggerall = numenemy
trigger1 = enemy, name = "Sally"
trigger2 = enemy, name = "SallyMH"
value = 53

[state 180, Cream]
type = victoryquote
triggerall = numenemy
trigger1 = enemy, name = "Cream"
value = 54

[state 180, Amy]
type = victoryquote
triggerall = numenemy
trigger1 = enemy, name = "Amy"
trigger2 = enemy, name = "AmyRose" || enemy, name = "AmyRose2"
value = 55

[state 180, Scourge]
type = victoryquote
triggerall = numenemy
trigger1 = enemy, name = "Scourge"
trigger2 = enemy, name = "ScourgeMH"
value = 56

[state 180, Himself]
type = victoryquote
triggerall = numenemy
trigger1 = enemy, name = "Tyrone"
value = 57

[State 180, Win by Raging Fox]
type = ChangeState
trigger1 = PrevStateNo = 3037
value = 3037

[State 180, Win]
type = changestate
trigger1 = PalNo > 10 
value = 184

[State 180, Win]
type = changestate
trigger1 = time = 0
value = 181+(random%3)



;---------------------------------------------------------------------------
; Win 1: Punch, Kick and Tailwhip + Celebrate 
[Statedef 181]
type = S
ctrl = 0
anim = 181
velset = 0,0

[State 181, NHB]
type = NotHitBy
trigger1 = 1
value = SCA
time = 1

[State 181, Snd]
type = PlaySnd
trigger1 = animelem = 2 || animelem = 4 || AnimElem = 21
value = s0,0
volumescale = 100
channel = -1
loop = 0

[State 181, Snd]
type = PlaySnd
trigger1 = AnimElem = 7
value = s0,1
volumescale = 100
channel = -1
loop = 0

[State 181, Snd]
type = PlaySnd
trigger1 = animelem = 10
value = s0,2
volumescale = 100
channel = -1
loop = 0

[State 181, Snd]
type = PlaySnd
trigger1 = animelem = 4
value = s1,0
volumescale = 100
channel = -1
loop = 0

[State 181, Snd]
type = PlaySnd
trigger1 = AnimElem = 7
value = s1,10
volumescale = 100
channel = -1
loop = 0

[State 181, Snd]
type = PlaySnd
trigger1 = animelem = 11
value = s1,4
volumescale = 100
channel = -1
loop = 0

[State 181, Snd]
type = PlaySnd
trigger1 = animelem = 21
value = s1,11
volumescale = 100
channel = -1
loop = 0

[State 181, notover]
type = assertspecial
trigger1 = time < 300
flag = roundnotover



;---------------------------------------------------------------------------
; Win 2: FLEX
[Statedef 182]
type = S
ctrl = 0
anim = 182
velset = 0,0

[State 182, Snd]
type = PlaySnd
trigger1 = !time
value = s0,0
volumescale = 100
channel = 0
loop = 0


[State 182, Snd]
type = PlaySnd
trigger1 = !time
value = s1,7
volumescale = 100
channel = 1
loop = 0


[State 182, notover]
type = assertspecial
trigger1 = time < 300
flag = roundnotover


;---------------------------------------------------------------------------
; Win 3: Kanji 
[Statedef 183]
type = S
ctrl = 0
anim = 183
velset = 0,0
sprPriority = -1

[State 191, Camera Helper]
type = Helper
trigger1 = !NumHelper(8999)
stateNo = 8999
ID = 8999
name = "Camera"
posType = P1

[State 191, ScreenBound]
type = ScreenBound
trigger1 = 1
value = 0
moveCamera = 0, 0
ignoreHitPause = 1

[State 191, Kanji]
type = explod
trigger1 = animelem = 4
anim = 18300
ID = 18300
sprpriority = 0
postype = p1
pos = 0,-5
bindtime = -1
removeongethit = 1
ownpal = 1

[State 191, Snd]
type = PlaySnd
trigger1 = animelem = 4
value = s1,25+(random%3)
volumescale = 100
channel = -1
loop = 0

[State 191, PosAdd]
type = Posadd
trigger1 = AnimElem = 1 || AnimElem = 2 || AnimElem = 3 || AnimElem = 4
x = -10
y = 0

[State 182, notover]
type = assertspecial
trigger1 = time < 300
flag = roundnotover

;---------------------------------------------------------------------------
; Win 4: Tyrone's Transform to normal
[Statedef 184]
type = S
ctrl = 0
anim = 184
velset = 0,0
sprPriority = -2

[State 184, PlaySnd]
type = PlaySnd
trigger1 = !time
value = s3,3
volumescale = 100
channel = -1

[State 184, Helper]
type = Helper
trigger1 = Time = 70
name = "Transform"
ID = 18402
stateno = 18402
pos = 0,0
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 1

[State 184, Snd]
type = PlaySnd
trigger1 = Time = 70
value = s11,1
volumescale = 50
channel = -1
loop = 0


[State 184, Helper]
type = Helper
trigger1 = Time = 80
name = "Chaos Emeralds"
ID = 18400
stateno = 18400
pos = 0,-80
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 1

[State 184, Helper]
type = Helper
trigger1 = Time = 80
name = "Electric Sheld"
ID = 18410
stateno = 18410
pos = 0,-30
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 1

[State 184, RemapPal]
type = RemapPal
trigger1 = time = 195
source = 1,1
dest = 1,1

[State 184, notover]
type = assertspecial
trigger1 = time < 300
flag = roundnotover


; Intro State Decider
[Statedef 190]
type = S

[State 190, End]
type = ChangeState
trigger1 = PalNo > 10
value = 194

[State 190, End]
type = ChangeState
trigger1 = enemy, name = "Scourge"
trigger2 = enemy, name = "ScourgeMH"
value = 191

[State 190, End]
type = ChangeState
trigger1 = !time
value = 191+(random%3)
;---------------------------------------------------------------------------
; Intro 1: Kanji 
[Statedef 191]
type = S
ctrl = 0
anim = 191
velset = 0,0
sprPriority = -1

[State 191, Camera Helper]
type = Helper
trigger1 = !NumHelper(8999)
stateNo = 8999
ID = 8999
name = "Camera"
posType = P1

[State 191, ScreenBound]
type = ScreenBound
trigger1 = 1
value = 0
moveCamera = 0, 0
ignoreHitPause = 1

[State 191, Intro] ;Assert this until you want "round 1, fight" to begin
type = AssertSpecial
trigger1 = 1
flag = Intro
flag2= NoBarDisplay

[State 191, Helper]
type = Helper
trigger1 = !Time
name = "Made by: DoomJoshuaBoy Logo"
ID = 8010
stateno = 8010
pos = 50,30
facing = 1
keyctrl = 0
ownpal = 0

[State 191, Kanji]
type = explod
trigger1 = !time
anim = 19100
ID = 19100
sprpriority = 0
postype = p1
pos = 0,-5
bindtime = -1
removeongethit = 1
ownpal = 1

[State 191, Snd]
type = PlaySnd
trigger1 = animelem = 3
value = s1,25+(random%3)
volumescale = 100
channel = -1
loop = 0

[State 191, PosAdd]
type = Posadd
trigger1 = !time
x = -40
y = 0

[State 191, PosAdd]
type = Posadd
trigger1 = AnimElem = 5 || AnimElem = 6 || AnimElem = 7 || AnimElem = 8
x = 10
y = 0

[State 191, End] ;Change to stand state when done
type = ChangeState
trigger1 = !AnimTime
value = 0

; Intro 2: Scourge + Tyrone 
[Statedef 192]
type = S
ctrl = 0
anim = 192
velset = 0,0
sprPriority = -1

[State 192, Camera Helper]
type = Helper
trigger1 = !NumHelper(8999)
stateNo = 8999
ID = 8999
name = "Camera"
posType = P1

[State 192, ScreenBound]
type = ScreenBound
trigger1 = 1
value = 0
moveCamera = 0, 0
ignoreHitPause = 1

[State 191, Intro] ;Assert this until you want "round 1, fight" to begin
type = AssertSpecial
trigger1 = 1
flag = Intro
flag2= NoBarDisplay

[State 191, Helper]
type = Helper
trigger1 = !Time
name = "Made by: DoomJoshuaBoy Logo"
ID = 8010
stateno = 8010
pos = 50,30
postype = Left    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 0


[State 192, Helper]
type = Helper
trigger1 = !Time
name = "Scourge"
ID = 19200
stateno = 19200
pos = -10,0
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 0
size.xscale = 1
size.yscale = 1


[State 192, Helper]
type = Helper 
trigger1 = !NumHelper(19210)
trigger1 = AnimElem =  2 || AnimElem =   7
trigger2 = AnimElem =  12 || AnimElem =  17
trigger3 = AnimElem =  22 || AnimElem =  27
trigger4 = AnimElem =  32 || AnimElem =  37
trigger5 = AnimElem =  42 || AnimElem =  47
name = "Tyrone (Aura)"
ID = 19210
stateno = 19210
postype = P1    ;P2, Front, Back, Left, Right


[State 192, PosAdd]
type = PosAdd
trigger1 = !Time
x = 325

[State 192, PlaySnd]
type = PlaySnd
trigger1 = Time = 180
value = S4,0
volumescale = 100
channel = -1
loop = 0

[State 192, VelSet]
type = VelSet
trigger1 = Time = 170
x = -5

[State 192, VelSet]
type = VelSet
trigger1 = Time = 220
x = -2

[State 192, VelSet]
type = VelSet
trigger1 = Time = 240
x = -1

[State 192, End]
type = ChangeState
trigger1 = Time = 260
value = 19202

; Intro 3: Tyrone and Friends
[Statedef 193]
type = S
ctrl = 0
anim = 193
velset = 0,0
sprPriority = -1

[State 193, Camera Helper]
type = Helper
trigger1 = !NumHelper(8999)
stateNo = 8999
ID = 8999
name = "Camera"
posType = P1

[State 193, ScreenBound]
type = ScreenBound
trigger1 = 1
value = 0
moveCamera = 0, 0
ignoreHitPause = 1

[State 191, Intro] ;Assert this until you want "round 1, fight" to begin
type = AssertSpecial
trigger1 = 1
flag = Intro
flag2= NoBarDisplay

[State 191, Helper]
type = Helper
trigger1 = !Time
name = "Made by: DoomJoshuaBoy Logo"
ID = 8010
stateno = 8010
pos = 0,0
facing = 1
keyctrl = 0
ownpal = 0


[State 193, PosSet]
type = PosSet
trigger1 = !Time
y = -310
;ignorehitpause = 
;persistent = 


[State 193, Helper]
type = Helper
trigger1 = !Time
name = "Sonic"
ID = 19300
stateno = 19300
pos = -40,6
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 0
size.xscale = 1
size.yscale = 1

[State 193, Helper]
type = Helper
trigger1 = !Time
name = "Amy"
ID = 19310
stateno = 19310
pos = -40,-6
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 0
size.xscale = 1
size.yscale = 1

[State 193, Helper]
type = Helper
trigger1 = !Time
name = "Tails"
ID = 19320
stateno = 19320
pos = 0,0
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 0
size.xscale = 1
size.yscale = 1

[State 193, PlaySnd]
type = PlaySnd
trigger1 = Time = 180
value = S5,0
volumescale = 100
channel = -1
loop = 1

[State 193, VelSet]
type = VelSet
trigger1 = Time = 170
y = 5

[State 193, VelSet]
type = VelSet
trigger1 = Time = 220
y = 2

[State 193, VelSet]
type = VelSet
trigger1 = Time = 240
y = 1

[State 0, StopSnd]
type = StopSnd
trigger1 = Time = 259
channel = -1
;ignorehitpause = 
;persistent = 

[State 193, End]
type = ChangeState
trigger1 = time = 260
value = 19330

; Intro 4: Tyrone's Transform
[Statedef 194]
type = S
ctrl = 0
anim = 194
velset = 0,0
sprPriority = -2

[State 191, Intro] ;Assert this until you want "round 1, fight" to begin
type = AssertSpecial
trigger1 = 1
flag = Intro
flag2= NoBarDisplay

[State 191, Helper]
type = Helper
trigger1 = !Time
triggerall = teamside = 1 && !NumHelper(8010)
name = "Made by: DoomJoshuaBoy Logo"
ID = 8010
stateno = 8010
pos = 50,30
postype = Left    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 0

[State 192, Helper]
type = Helper
trigger1 = !Time
triggerall = teamside != 1 && !NumHelper(8011) 
name = "Made by: DoomJoshuaBoy Logo"
ID = 8011
stateno = 8010
pos = -50,30
postype = right    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 0


[State 194, EnvShake]
type = EnvShake
trigger1 = time = 10 
time = 240
freq = 60
ampl = -4
phase = 90


[State 194, PlaySnd]
type = PlaySnd
trigger1 = time = 10
value = s2,7
volumescale = 100
channel = -1
loop = 1

[State 194, Helper]
type = Helper
trigger1 = !Time
name = "Transform"
ID = 19400
stateno = 19400
pos = 0,0
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 1

[State 194, Helper]
type = Helper
trigger1 = Time = 50
name = "Chaos Emeralds"
ID = 19410
stateno = 19410
pos = 0,-20
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 1

[State 194, StopSnd]
type = StopSnd
trigger1 = Time = 250
channel = -1

[State 194, PlaySnd]
type = PlaySnd
trigger1 = Time = 260
value = S1,24
volumescale = 100
channel = -1
loop = 0

[State 194, End]
type = ChangeState
trigger1 = time = 375 
value = 0

;---------------------------------------------------------------------------
;Dodge/Evade
[StateDef 700]  
type = S
movetype = I
physics = S
anim = 700
velset = 0,0      
ctrl = 0           
poweradd = 0
sprpriority = -2



[State 700, PlaySnd]
type = PlaySnd
trigger1 = !Time
value = s1,0
volumescale = 150
channel = 0
loop = 0

[State 700, Dodge Sound]
type = PlaySnd
trigger1 = !Time
value = s0,2
channel = 1

[State 700, PlayerPush]
type = PlayerPush
trigger1 = 1
value = 0
ignoreHitPause = 1

[State 700, HitBy]
type = HitBy
trigger1 = AnimElemTime(4) < 0
value = SCA, AT
time = 1

[State 700, End] ;Change to stand state when done
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1

;Roll Forwards
[StateDef 710]  
type = S
movetype = I
physics = S
anim = 710
velset = 0,0      
ctrl = 0           
poweradd = 0
sprpriority = -2

[State 710, PlaySnd]
type = PlaySnd
trigger1 = !Time
value = s1,0
volumescale = 150
channel = 0
loop = 0

[State 710, Dodge Sound]
type = PlaySnd
trigger1 = !Time
value = s0,2
channel = 1

[State 710, PlayerPush]
type = PlayerPush
trigger1 = 1
value = 0
ignoreHitPause = 1

[State 710, HitBy]
type = HitBy
trigger1 = AnimElemTime(2) < 0
value = SCA, AT
time = 1

[State 710, VelSet]
type = VelSet
trigger1 = AnimElemTime(1) >= 0 || AnimElemTime(1) <= 25
x = 3

[State 710, VelSet]
type = VelSet
trigger1 = AnimElemTime(2) = 0
x = 0

[State 710, End]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1

;Roll Backwards
[StateDef 715]  
type = S
movetype = I
physics = S
anim = 715
velset = 0,0      
ctrl = 0           
poweradd = 0
sprpriority = -2

[State 715, PlaySnd]
type = PlaySnd
trigger1 = !Time
value = s1,0
volumescale = 150
channel = 0
loop = 0

[State 715, Dodge Sound]
type = PlaySnd
trigger1 = !Time
value = s0, 2
channel = 1

[State 715, PlayerPush]
type = PlayerPush
trigger1 = 1
value = 0
ignoreHitPause = 1

[State 715, HitBy]
type = HitBy
trigger1 = AnimElemTime(2) < 0
value = SCA, AT
time = 1

[State 715, VelSet]
type = VelSet
trigger1 = AnimElemTime(1) >= 0 || AnimElemTime(1) <= 25
x = -3

[State 715, VelSet]
type = VelSet
trigger1 = AnimElemTime(2) = 0
x = 0

[State 715, End]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1

;Power up
[StateDef 750]  
type = S
movetype = I
physics = S
anim = 750
velset = 0,0      
ctrl = 0       

[State 750, Power]
type = poweradd
triggerall = power < const(data.power) && power < powermax
trigger1 = !AIlevel && command = "holdz"
trigger2 = AIlevel
value = 2 + ifelse(time < 30, 0, (time -30) / 12)

[State 750, Snd]
type = playsnd
trigger1 = !time
value = 0,7
channel = -1

[State 750, Snd]
type = playsnd
trigger1 = !time
value = 1,2
channel = -1

[State 0, StopSnd]
type = StopSnd
trigger1 = Stateno = [5000,5999]
channel = -1
;ignorehitpause = 
;persistent = 

[State 750, Explod]
type = Explod
trigger1 = !time 
anim = 7050
ID = 7050
pos = 0,0
postype = P1
removetime = -1
sprPriority = 1
bindtime = -1 
removeongethit = 1
scale = 0.75,0.75

[State 730, End]
type = changestate
trigger1 = power >= const(data.power) || power >= powermax || roundstate != 2
trigger2 = !AIlevel && (command != "holdz")
trigger3 = AIlevel && (inguarddist || p2bodydist x <= 120)
value = 751
ctrl = 1


;Power up End
[Statedef 751]
type = S
physics = S
movetype = I
anim = 751
velset = 0, 0
ctrl = 1

[State 751, Stop Snd]
type = stopsnd
trigger1 = !time
channel = 0

[State 5336, 1]
type=removeexplod
trigger1= anim = 751
ID=7050

[State 751, Snd]
type = playsnd
trigger1 = !time
value = 1,18
channel = 0

[State 751, End]
type = changestate
trigger1 = !animtime
value = 0
ctrl = 1


;---------------------------------------------------------------------------
;================================================================
;GET_HIT/RECOVER/DAMAGE STATES
;================================================================
;CHEAP K.O.
[StateDef 5950]
type = S
moveType = H
physics = S
anim = 5950
velSet = 0, 0

[State 5950, NotHitBy]
type = NotHitBy
trigger1 = 1
value = SCA

[State 5950, PosSet]
type = PosSet
trigger1 = 1
y = 0

[State 5950, Assert: NoKOsnd]
type = AssertSpecial
trigger1 = 1
flag = NoKOsnd

[State 5950, StopSnd]
type = StopSnd
trigger1 = !Time && !Alive
channel = 0

[State 5950, KO Sound]
type = PlaySnd
trigger1 = AnimElem = 2 && !Alive
value = 5950, 0 + 10 * var(40)

[State 5950, Hitting the Floor Sound]
type = PlaySnd
trigger1 = AnimElem = 8
value = F7, 0

[State 5950, Hitting the Floor Explod]
type = Explod
trigger1 = AnimElem = 8
anim = F60
posType = P1
pos = 0, 0
sprPriority = -3

[State 5950, End]
type = ChangeState
trigger1= !AnimTime
value = ifElse(Alive, 5110, 5150)

;AIR HIT TRANSITION
[Statedef 5035]
type = A
movetype = H
physics = N

[State 5035, ChangeAnim]
type = ChangeAnim
trigger1 = !Time
trigger1 = SelfAnimExist(5035)
trigger1 = Anim = [5000, 5029]
value = 5035

[State 5035, VelAdd]
type = VelAdd
trigger1 = Time > 0
y = GetHitVar(yAccel)

[State 5035, Recover]
type = ChangeState
triggerAll = !HitFall
trigger1 = HitOver
trigger2 = !AnimTime
trigger3 = vel y > 0 && pos y >= 10
trigger4 = !Time
trigger4 = Anim != 5035
value = 5040

[State 5035, Fall]
type = ChangeState
triggerAll = HitFall
trigger1 = HitOver
trigger2 = !AnimTime
trigger3 = vel y > 0 && pos y >= 10
trigger4 = !Time
trigger4 = Anim != 5035
value = 5050



;GET UP FROM LIE DOWN
[Statedef 5120]
type = L
movetype = I
physics = N

[State 5120, ChangeAnim]
type = ChangeAnim
triggerAll = !Time
trigger1 = Anim != [5111, 5119]
trigger2 = !SelfAnimExist(5120 + (Anim % 10))
value = 5120

[State 5120, ChangeAnim]
type = ChangeAnim
triggerAll = !Time
trigger1 = Anim = [5111, 5119]
trigger1 = SelfAnimExist(5120 + (Anim % 10))
value = 5120 + (Anim % 10)

[State 5120, VelSet]
type = VelSet
trigger1 = !Time
x = 0

[State 5120, NotHitBy]
type = NotHitBy
trigger1 = 1
value = SCA
time = 1

[State 5120, HitFallSet]
type = HitFallSet
trigger1 = !AnimTime
value = 1

[State 5120, ChangeState]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1

[StateDef 5450]
type = S
movetype = H
physics = N
velset = 0, 0

[State 5450, ChangeAnim: Light-Hard]
type = ChangeAnim
trigger1 = !Time && GetHitVar(AnimType) != [3, 5]
value = ifElse((GetHitVar(GroundType) = 1), 5000, 5010) + GetHitVar(AnimType)

[State 5450, ChangeAnim: Freeze]
type = ChangeAnim
trigger1 = Time > 0
value = Anim

[State 5450, ChangeState]
type = ChangeState
trigger1 = HitShakeOver
value = 5451


;Knocked Back
[Statedef 5451]
type = S
movetype = H
physics = S

[State 5451, HitVelSet]
type = HitVelSet
trigger1 = !Time
x = 1

[State 5451, ChangeAnim]
type = ChangeAnim
trigger1 = !AnimTime
value = 5005 + GetHitVar(AnimType) + (GetHitVar(GroundType) = 2) * 10

[State 5451, VelMul]
type = VelMul
trigger1 = Time >= GetHitVar(slideTime)
x = .6

[State 5451, VelSet]
type = VelSet
trigger1 = HitOver
x = 0

[State 5451, DefenceMulSet]
type = DefenceMulSet
trigger1 = HitOver
value = 1

[State 5451, ChangeState]
type = ChangeState
trigger1 = HitOver
value = 5455


;Falling down
[StateDef 5455]
type = S
physics = N
movetype = H
ctrl = 0
velSet = 0,0

[State 5455, ChangeAnim2]
type = ChangeAnim2
trigger1 = !Time
trigger1 = !SelfAnimExist(5955)
value = 5455
ignoreHitPause = 1

[State 5455, ChangeAnim]
type = ChangeAnim
trigger1 = !Time
trigger1 = SelfAnimExist(5955)
value = 5955

[State 5455, VelSet]
type = VelAdd
trigger1 = pos y < 0
y = 0.58

[State 5455, PlaySnd]
type = PlaySnd
trigger1 = pos y > -vel y
value = F7,0 

[State 5455, Explod]
type = Explod
trigger1 = pos y > -vel y
anim = F60
pos = 0, 0
sprPriority = ifelse (sysvar(1) <= Const720p(56), -10, 10)

[State 5455, PosSet]
type = PosSet
trigger1 = pos y > -vel y
y = 0

[State 5455, PosSet]
type = VelSet
trigger1 = pos y > -vel y
y = 0

[State 5455, StateTypeSet: Air, Physics: None]
type = StateTypeSet
trigger1 = !AnimTime
trigger2 = AnimElemTime(AnimElemNo(0) + 1) = 0
stateType = A
physics = N

[State 5455, VarSet]
type = VarSet
trigger1 = !AnimTime
trigger2 = AnimElemTime(AnimElemNo(0) + 1) = 0
sysvar(0) = ifElse(Anim = 5455, 0, 1)

[State 5455, ChangeAnim]
type = ChangeAnim
trigger1 = !AnimTime
trigger2 = AnimElemTime(AnimElemNo(0) + 1) = 0
value = ifElse(Anim = 5955 && SelfAnimExist(5112), 5112, 5110)
persistent = 0

[State 5455, SelfState]
type = SelfState
trigger1 = !AnimTime
trigger2 = AnimElemTime(AnimElemNo(0) + 1) = 0
value = 5110


;---------------------------------------------------------------------------
; STATES -2 AND -3
;---------------------------------------------------------------------------

[Statedef -3]

[State -2, Super Finish]
type = Helper
triggerall = !NumHelper(8020)
triggerall = roundstate = 3
triggerall = WinKo
trigger1 = NumHelper(3020)
name = "SuperFinish Logos"
ID = 8020
stateno = 8020
posType = Back
pos = 0,0
ownPal = 1
pauseMoveTime = 999
superMoveTime = 999
ignoreHitPause = 1

[State -2, Super Finish]
type = Helper
triggerall = !NumHelper(8021)
triggerall = roundstate = 3
triggerall = WinKo
trigger1 = NumHelper(3010) 
name = "SuperFinish Logos"
ID = 8021
stateno = 8021
posType = Back
pos = 0,0
ownPal = 1
pauseMoveTime = 999
superMoveTime = 999
ignoreHitPause = 1

[State -2, Super Finish]
type = Helper
triggerall = !NumHelper(8022)
triggerall = roundstate = 3
triggerall = WinKo
trigger1 = NumHelper(3000)
name = "SuperFinish Logos"
ID = 8022
stateno = 8022
posType = Back
pos = 0,0
ownPal = 1
pauseMoveTime = 999
superMoveTime = 999
ignoreHitPause = 1

[State -2, Super Finish]
type = Helper
triggerall = !NumHelper(8024)
triggerall = roundstate = 3
triggerall = WinKo
trigger1 = NumHelper(3045)
name = "SuperFinish Logos"
ID = 8024
stateno = 8024
posType = Back
pos = 0,0
ownPal = 1
pauseMoveTime = 999
superMoveTime = 999
ignoreHitPause = 1

[State -2, Super Finish]
type = Helper
triggerall = !NumHelper(8025)
triggerall = roundstate = 3
triggerall = WinKo
trigger1 = NumHelper(3040)
name = "SuperFinish Logos"
ID = 8025
stateno = 8025
posType = Back
pos = 0,0
ownPal = 1
pauseMoveTime = 999
superMoveTime = 999
ignoreHitPause = 1
