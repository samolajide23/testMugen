;---------------------------------------------------------------------------
; NORMAL MOVES
;---------------------------------------------------------------------------

;---------------------------------------------------------------------------
; STAND LIGHT PUNCH
[Statedef 200]
type = S
movetype = A
physics = S
anim = 200
poweradd = 5
velset = 0,0
ctrl = 0

[State 200, Snd]
type = PlaySnd
trigger1 = !time
value = s0,0

[State 200, Voice]
type = PlaySnd
trigger1 = !time
trigger1 = Random < 500
value = s1,0

[State 200, HitSpark]
type = HitDef
trigger1 = AnimElem = 2
attr = S, NA
animtype = Light
damage = 8, 1
getpower = 20, 10
givepower = 10, 5
guardflag = M
pausetime = 8,9
sparkxy = -17,-26
sparkno = S7000
guard.sparkno = S7006
hitsound = s2,0
guardsound = s2,5
ground.type = High
ground.slidetime = 4
ground.hittime = 8
ground.velocity = -3.5
air.velocity = -2,-3
airguard.velocity = -3,-2.5

[State 200, End]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1

;---------------------------------------------------------------------------
; STAND HARD PUNCH
[Statedef 210]
type = S
movetype = A
physics = S
anim = 210
poweradd = 30
velset = 0,0
ctrl = 0

[State 210, Snd]
type = PlaySnd
trigger1 = AnimElem = 2
value = s0,2

[State 210, Voice]
type = PlaySnd
trigger1 = AnimElem = 3
trigger1 = Random < 500
value = s1,1

[State 210, HitSpark]
type = HitDef
trigger1 = AnimElem = 3
attr = S, NA
animtype = Hard
getpower = 40, 20
givepower = 20, 10
damage = 60, 2
guardflag = M
pausetime = 12,12
sparkno = S7001
guard.sparkno = S7006
sparkxy = -11,-28
hitsound = s2,1
guardsound = s2,5
ground.type = High
ground.slidetime = 7
ground.hittime = 18
ground.velocity = -4.5
air.velocity = -2,-1.5

[State 210, End]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1

;---------------------------------------------------------------------------
; STAND LIGHT KICK
[Statedef 220]
type = S
movetype = A
physics = S
anim = 220
poweradd = 20
juggle = 8
velset = 0,0
ctrl = 0

[State 220, Pos]
type = PosAdd
trigger1 = AnimElem = 2
x = 9

[State 220, Pos]
type = PosAdd
trigger1 = Animelem = 3
x = 2

[State 220, Snd]
type = PlaySnd
trigger1 = AnimELem = 2
value = s0,0

[State 220, Voice]
type = PlaySnd
trigger1 = AnimElem = 2
trigger1 = Random < 500
value = s1,0

[State 220, HitSpark]
type = HitDef
trigger1 = AnimElem = 3
attr = S, NA
animtype = Light
damage = 50, 1
guardflag = M
getpower = 25, 12
givepower = 12, 6
pausetime = 10,10
sparkxy = -20,-19
sparkno = S7000
guard.sparkno = S7006
hitsound = s2,3
guardsound = s2,5
ground.type = Low
ground.slidetime = 2
ground.hittime = 15
ground.velocity = -4
air.velocity = -1.3,-1

[State 220, End]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1

;---------------------------------------------------------------------------
; STAND SWING KICK
[Statedef 230]
type = S
movetype = A
physics = S
anim = 230
poweradd = 30
ctrl = 0
velset = 0,0


[State 230, Pos]
type = PosAdd
trigger1 = AnimElem = 3
trigger2 = AnimElem = 4
trigger3 = AnimElem = 5
x = 2

[State 230, Pos]
type = PosAdd
trigger1 = AnimElem = 2
x = 9

[State 230, Snd]
type = PlaySnd
trigger1 = AnimElem = 3
value = s0,1

[State 230, Voice]
type = PlaySnd
trigger1 = AnimElem = 3
trigger1 = Random < 500
value = s1,1

[State 230, Hit spark]
type = HitDef
trigger1 = AnimElem = 4
attr = S, NA
animtype = Medium
damage = 72, 2
getpower = 32, 16
givepower = 16, 8
guardflag = M
pausetime = 12,12
sparkno = S7001
guard.sparkno = S7006
sparkxy = -17,-23
hitsound = s2,4
guardsound = s2,5
ground.type = High
ground.slidetime = 10
ground.hittime = 23
ground.velocity = -7.5
air.velocity = -3.5,-3

[State 230, 5]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1

;---------------------------------------------------------------------------
; KNOCKDOWN ATTACK
[Statedef 240]
type    = S
movetype= A
physics = S
juggle  = 2
poweradd = 40
ctrl = 0
velset = 2,0
anim = 240

[State 240, PosAdd]
type = PosAdd
trigger1 = AnimElem = 2
trigger2 = AnimElem = 3
x = 4

[State 240, Snd]
type = PlaySnd
trigger1 = AnimElem = 5
value = s0,3

[State 240, Voice]
type = PlaySnd
trigger1 = Random < 200
trigger1 = AnimElem = 6
value = s1,4

[State 240, Hitspark]
type = HitDef
trigger1 = AnimElem = 6
attr = S, NA
animtype = Hard
damage = 62, 3
getpower = 25, 12
givepower = 12, 6
guardflag = M
pausetime = 12,12
sparkno = S7002
guard.sparkno = S7006
sparkxy = -36,-22
hitsound = s2,2
guardsound = s2,5
ground.type = High
ground.slidetime = 10
ground.hittime = 23
ground.velocity = -5,-3
air.velocity = -3.5,-3
envshake.time = 15
envshake.freq = 60
envshake.ampl = -4
envshake.phase = 90
fall = 1

[State 241, Change]
type = Changestate
trigger1 = AnimTime = 0
value = 0
ctrl = 1

;---------------------------------------------------------------------------
;CROUCH LIGHT PUNCH
[Statedef 400]
type    = C
movetype= A
physics = C
juggle  = 7
poweradd = 5
ctrl = 0
anim = 400

[State 400, 1]
type = PlaySnd
trigger1 = Time = 0
value = s0,0

[State 400, 2]
type = PlaySnd
trigger1 = Time = 0
trigger1 = Random < 500
value = s1,0

[State 400, 3]
type = HitDef
trigger1 = AnimElem = 2
attr = C, NA
animtype = Light
damage = 8, 1
getpower = 20, 10
givepower = 10, 5
guardflag = M
pausetime = 8,9
sparkxy = -17,-17
sparkno = S7000
guard.sparkno = S7006
hitsound = s2,0
guardsound = s2,5
ground.type = High
ground.slidetime = 8
ground.hittime = 8
ground.velocity = -3.5
air.velocity = -2,-3
airguard.velocity = -3,-2.5

[State 400, 3b]
type = CtrlSet
trigger1 = Time = 9
value = 1

[State 400, 4]
type = ChangeState
trigger1 = AnimTime = 0
value = 11

;---------------------------------------------------------------------------
;CROUCH UPPER PUNCH
[Statedef 410]
type    = C
movetype= A
physics = C
juggle  = 10
poweradd = 30
ctrl = 0
anim = 410

[State 410, 1]
type = PlaySnd
trigger1 = Animelem = 2
value = s0,2

[State 410, 2]
type = PlaySnd
trigger1 = Animelem = 2
trigger1 = Random < 500
value = s1,1

[State 410, 3]
type = HitDef
trigger1 = AnimElem = 3
attr = C, NA
animtype = Hard
getpower = 40, 20
givepower = 20, 10
damage = 65, 2
guardflag = M
pausetime = 12,12
sparkno = S7001
guard.sparkno = S7006
sparkxy = -20,-35
hitsound = s2,1
guardsound = s2,5
ground.type = High
ground.slidetime = 13
ground.hittime = 18
ground.velocity = -6.5
air.velocity = -4,-2.5

[State 410, 4]
type = ChangeState
trigger1 = AnimTime = 0
value = 11
ctrl = 1
;---------------------------------------------------------------------------
;CROUCH LIGHT KICK
[Statedef 420]
type    = C
movetype= A
physics = C
juggle  = 8
poweradd= 20
ctrl = 0
anim = 420

[State 420, 1]
type = PlaySnd
trigger1 = Time = 0
value = s0,0

[State 420, 2]
type = PlaySnd
trigger1 = Time = 0
trigger1 = Random < 500
value = s1,0

[State 420, 3]
type = HitDef
trigger1 = AnimElem = 2
attr = C, NA
animtype = Light
damage = 20, 1
guardflag = M
getpower = 25, 12
givepower = 12, 6
pausetime = 10,10
sparkxy = -20,-2
sparkno = S7000
guard.sparkno = S7006
hitsound = s2,3
guardsound = s2,5
ground.type = Low
ground.slidetime = 5
ground.hittime = 15
ground.velocity = -4
air.velocity = -1.3,-1

[State 420, 3b]
type = CtrlSet
trigger1 = Time = 10
value = 1

[State 420, 4]
type = ChangeState
trigger1 = AnimTime = 0
value = 11


;---------------------------------------------------------------------------
;CROUCH SWEEP KICK
[Statedef 430]
type    = C
movetype= A
physics = C
juggle  = 15
poweradd= 30
ctrl = 0
anim = 430

[State 430, 2]
type = PlaySnd
trigger1 = AnimElem = 2
value = s0,1

[State 430, 3]
type = PlaySnd
trigger1 = AnimElem = 2
trigger1 = Random < 500
value = s1,1

[State 430, 3]
type = HitDef
trigger1 = AnimElem = 2
attr = C, NA
damage   = 65, 2
getpower = 30, 15
givepower = 15, 7
guardflag = L
pausetime = 11,12
sparkno = S7001
guard.sparkno = S7006
sparkxy = -18,-5
hitsound = s2,4
guardsound = s2,5
ground.type = Trip
ground.slidetime = 18
ground.hittime  = 25
guard.hittime = 36
guard.ctrltime = 36
ground.velocity = -2,-4
guard.velocity = -6
air.velocity = -2.4,-3.5
airguard.velocity = -3,-3
fall = 1

[State 430, 4]
type = ChangeState
trigger1 = AnimTime = 0
value = 11
ctrl = 1

;---------------------------------------------------------------------------
;JUMP WEAK PUNCH
[Statedef 600]
type    = A
movetype= A
physics = A
juggle  = 5
poweradd= 20
ctrl = 0
anim = 600

[State 600, 1]
type = PlaySnd
trigger1 = Time = 0
value = s0,0

[State 600, 2]
type = PlaySnd
trigger1 = Time = 0
trigger1 = Random < 500
value = s1,0

[State 600, 3]
type = HitDef
trigger1 = AnimElem = 2
attr = A, NA
animtype = Light
damage = 20, 1
getpower = 20, 10
givepower = 10, 5
guardflag = HA
pausetime = 8,9
sparkxy = -16,-39
sparkno = S7000
guard.sparkno = S7006
hitsound = s2,2
guardsound = s2,5
ground.type = High
ground.slidetime = 8
ground.hittime = 8
ground.velocity = -3.5
air.velocity = -2,-3
airguard.velocity = -3,-2.5


[State 600, 3]
type = ChangeState
trigger1 = Pos Y >= 0
trigger1 = Vel Y > 0
value = 50
ctrl = 1

;JUMP WEAK PUNCH (Flight)
[Statedef 601]
type    = A
movetype= A
physics = S
juggle  = 5
poweradd= 20
ctrl = 0
anim = 601

[State 600, 1]
type = PlaySnd
trigger1 = Time = 0
value = s0,0

[State 600, 2]
type = PlaySnd
trigger1 = Time = 0
trigger1 = Random < 500
value = s1,0

[State 600, 3]
type = HitDef
trigger1 = AnimElem = 2
attr = A, NA
animtype = Light
damage = 20, 1
getpower = 20, 10
givepower = 10, 5
guardflag = HA
pausetime = 8,9
sparkxy = -16,-39
sparkno = S7000
guard.sparkno = S7006
hitsound = s2,0
guardsound = s2,5
ground.type = High
ground.slidetime = 8
ground.hittime = 8
ground.velocity = -3.5
air.velocity = -2,-3
airguard.velocity = -3,-2.5


[State 600, 3]
type = ChangeState
trigger1 = !animtime
value = 46
ctrl = 1

;---------------------------------------------------------------------------
;JUMP HARD PUNCH
[Statedef 610]
type    = A
movetype= A
physics = A
juggle  = 8
poweradd= 30
ctrl = 0
anim = 610

[State 610, 1]
type = PlaySnd
trigger1 = Animelem = 3
value = s0,2

[State 610, 2]
type = PlaySnd
trigger1 = Animelem = 3
trigger1 = Random < 500
value = s1,1

[State 610, 3]
type = HitDef
trigger1 = AnimElem = 3
attr = A, NA
animtype = Hard
getpower = 40, 20
givepower = 20, 10
damage = 50, 2
guardflag = HA
pausetime = 12,12
sparkno = S7001
guard.sparkno = S7006
sparkxy = -9,-48
hitsound = 2,1
guardsound = 2,5
ground.type = High
ground.slidetime = 13
ground.hittime = 18
ground.velocity = -4.5
air.velocity = -3.2,-1.8

[State 610, 4]
type = ChangeState
trigger1 = Vel Y > 0
trigger1 = Pos Y >= 0
value = 50
ctrl = 1

;JUMP HARD PUNCH  (Flight)
[Statedef 611]
type    = A
movetype= A
physics = S
juggle  = 8
poweradd= 30
ctrl = 0
anim = 611

[State 610, 1]
type = PlaySnd
trigger1 = Animelem = 3
value = s0,2

[State 610, 2]
type = PlaySnd
trigger1 = Animelem = 3
trigger1 = Random < 500
value = s1,1

[State 610, 3]
type = HitDef
trigger1 = AnimElem = 3
attr = A, NA
animtype = Hard
getpower = 40, 20
givepower = 20, 10
damage = 50, 2
guardflag = HA
pausetime = 12,12
sparkno = S7001
sparkxy = -9,-48
hitsound = s2,1
guardsound = s2,5
ground.type = High
ground.slidetime = 13
ground.hittime = 18
ground.velocity = -4.5
air.velocity = -3.2,-1.8

[State 610, 4]
type = ChangeState
trigger1 = !animtime
value = 46
ctrl = 1

;---------------------------------------------------------------------------
;JUMP WEAK KICK
[Statedef 620]
type    = A
movetype= A
physics = A
juggle  = 5
poweradd = 20
ctrl = 0
anim = 620

[State 620, 1]
type = PlaySnd
trigger1 = Time = 0
value = s0,0

[State 620, 2]
type = PlaySnd
trigger1 = Time = 0
trigger1 = Random < 500
value = s1,0

[State 620, 3]
type = HitDef
trigger1 = AnimElem = 2
attr = A, NA
animtype = Light
damage = 30, 1
guardflag = HA
getpower = 25, 12
givepower = 12, 6
pausetime = 10,10
sparkxy = -15,-30
sparkno = S7000
guard.sparkno = S7006
hitsound = s2,3
guardsound = s2,5
ground.type = High
ground.slidetime = 5
ground.hittime = 15
ground.velocity = -4
air.velocity = -1.3,-1

[State 620, 3]
type = ChangeState
trigger1 = Vel Y > 0
trigger1 = Pos Y >= 0
value = 50

;JUMP WEAK KICK (Flight)
[Statedef 621]
type    = A
movetype= A
physics = S
juggle  = 5
poweradd = 20
ctrl = 0
anim = 621

[State 620, 1]
type = PlaySnd
trigger1 = Time = 0
value = s0,0

[State 620, 2]
type = PlaySnd
trigger1 = Time = 0
trigger1 = Random < 500
value = s1,0

[State 620, 3]
type = HitDef
trigger1 = AnimElem = 2
attr = A, NA
animtype = Light
damage = 30, 1
guardflag = HA
getpower = 25, 12
givepower = 12, 6
pausetime = 10,10
sparkxy = -15,-30
sparkno = S7000
guard.sparkno = S7006
hitsound = s2,3
guardsound = s2,5
ground.type = High
ground.slidetime = 5
ground.hittime = 15
ground.velocity = -4
air.velocity = -1.3,-1

[State 621, 4]
type = ChangeState
trigger1 = !animtime
value = 46
ctrl = 1
;---------------------------------------------------------------------------
;JUMP HEAVY KICK
[Statedef 630]
type    = A
movetype= A
physics = A
juggle  = 9
poweradd= 30
ctrl = 0
anim = 630

[State 630, 2]
type = PlaySnd
trigger1 = AnimElem = 2
value = s0,1

[State 630, 3]
type = PlaySnd
trigger1 = AnimElem = 2
trigger1 = Random < 500
value = s1,1

[State 630, 3b]
type = HitDef
trigger1 = AnimElem = 3
attr = A, NA
damage   = 60, 2
getpower = 30, 15
givepower = 15, 7
guardflag = HA
pausetime = 11,12
sparkno = S7001
guard.sparkno = S7006
sparkxy = -29,-38
hitsound = s2,4
guardsound = s2,5
ground.type = Low
ground.slidetime = 13
ground.hittime  = 18
guard.hittime = 18
guard.ctrltime = 18
ground.velocity = -2
guard.velocity = -3
air.velocity = -2.4,2
airguard.velocity = -3,-3

[State 610, 4]
type = ChangeState
trigger1 = !animtime
value = 46
ctrl = 1

;JUMP HEAVY KICK  (Flight)
[Statedef 631]
type    = A
movetype= A
physics = S
juggle  = 9
poweradd= 30
ctrl = 0
anim = 631

[State 630, 2]
type = PlaySnd
trigger1 = AnimElem = 2
value = s0,1

[State 630, 3]
type = PlaySnd
trigger1 = AnimElem = 2
trigger1 = Random < 500
value = s1,1

[State 630, 3b]
type = HitDef
trigger1 = AnimElem = 3
attr = A, NA
damage   = 60, 2
getpower = 30, 15
givepower = 15, 7
guardflag = HA
pausetime = 11,12
sparkno = S7001
guard.sparkno = S7006
sparkxy = -29,-38
hitsound = s2,4
guardsound = s2,5
ground.type = Low
ground.slidetime = 13
ground.hittime  = 18
guard.hittime = 18
guard.ctrltime = 18
ground.velocity = -2
guard.velocity = -3
air.velocity = -2.4,2
airguard.velocity = -3,-3

[State 631, Flight]
type = ChangeState
trigger1 = !animtime
value = 46
ctrl = 1

;Throw Grab (Punch)
[Statedef 800]
type = S
movetype= A
physics = S
juggle = 0
velset = 0, 0
anim = 800

[State 810, PlaySnd]
type = PlaySnd
trigger1 = !Time
value = S1,18
channel = -1

[State 850, 1]
type = HitDef
Trigger1 = !Time
attr = S, NT
hitflag = M-
priority = 1, Miss
sparkno = -1
p1stateno = 810
p2stateno = 820
guard.dist = 0
ID = 800
p1sprpriority = 1
p1facing = ifelse (command = "holdfwd", 1,-1)
p2facing = 1
fall = 1

[State 800, 2]
type = ChangeState
trigger1 = AnimTime = 0
value = 0
ctrl = 1

;Throw Punch
[Statedef 810]
type = S
movetype= A
physics = N
anim = 810
poweradd = 60

[State 810, PlaySnd]
type = PlaySnd
trigger1 = !Time
value = S2,6
channel = -1


[State 810, PlaySnd]
type = PlaySnd
trigger1 = Time = 20
value = S1,4
channel = -1

[State 810, SprPriority]
type = SprPriority
trigger1 = AnimElem = 1
value = 2

[State 810, Bind 1]
type = TargetBind
trigger1 = AnimElem = 1
pos = 25.0, 0.0

[State 810, SprPriority]
type = SprPriority
trigger1 = AnimElem = 2
value = 2

[State 810, Bind 2]
type = TargetBind
trigger1 = AnimElem = 2
pos = -15.0, -50.0

[State 810, SprPriority]
type = SprPriority
trigger1 = AnimElem = 3
value = 2

[State 810, Bind 3]
type = TargetBind
trigger1 = AnimElem = 3
pos = 15.0, -50.0

[State 810, SprPriority]
type = SprPriority
trigger1 = AnimElem = 4
value = 2

[State 810, Bind 4]
type = TargetBind
trigger1 = AnimElem = 4
pos = 10.0, 20.0

[State 810, Hurt]
type = TargetLifeAdd
trigger1 = AnimElem = 4
value = -78

[State 810, Throw]
type = TargetState
trigger1 = AnimElem = 4
value = 821

[State 810, State End]
type = ChangeState
trigger1 = AnimTime = 0
value = 0
ctrl = 1

[Statedef 820]
type = A
movetype = H
physics = N
velset = 0,0

[State 820, 1]
type = ChangeAnim2
trigger1 = Time = 0
value = 820

[State 870,ChangeState]
type = ChangeState
trigger1 = P2StateNo = 820
value = 821


[Statedef 821]
type = A
movetype = H
physics = N
velset = -5,-10
poweradd = 40

[State 821, 1] ;Gravity
type = VelAdd
trigger1 = 1
y = .4

[State 820, 1]
type = ChangeAnim2
trigger1 = Time = 0
value = 830

[State 821, 4] ;Hit ground
type = SelfState
trigger1 = Vel Y > 0
trigger1 = Pos Y >= 0
value = 5100 ;Hit ground

;Throw Grab (Kick)
[Statedef 850]
type = S
movetype= A
physics = S
juggle = 0
velset = 0, 0
ctrl = 0
anim = 800
sprPriority = 2

[State 810, PlaySnd]
type = PlaySnd
trigger1 = !Time
value = S1,18
channel = -1

[State 850, 1]
type = HitDef
Trigger1 = !Time
attr = S, NT
hitflag = M-
priority = 1, Miss
sparkno = -1
p1stateno = 860
p2stateno = 870
guard.dist = 0
ID = 850
p1sprpriority = 1
p1facing = ifelse (command = "holdfwd", 1,-1)
p2facing = 1
fall = 1

[State 850, 2]
type = ChangeState
trigger1 = AnimTime = 0
value = 0
ctrl = 1


;Throw Kick
[Statedef 860]
type = S
movetype= A
physics = N
anim = 860
poweradd = 60



[State 860, PlaySnd]
type = PlaySnd
trigger1 = !Time
value = S2,6
channel = -1


[State 860, PlaySnd]
type = PlaySnd
trigger1 = Time = 10
value = S1,11
channel = -1

[State 860, SprPriority]
type = SprPriority
trigger1 = AnimElem = 1
value = 2

[State 860, Bind 1]
type = TargetBind
trigger1 = AnimElem = 1
pos = 25.0, 0.0

[State 860, SprPriority]
type = SprPriority
trigger1 = AnimElem = 2
value = 2

[State 860, Bind 2]
type = TargetBind
trigger1 = AnimElem = 2
pos = 0.0, 7.0

[State 860, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 3
value = S0,2
channel = -1

[State 860, SprPriority]
type = SprPriority
trigger1 = AnimElem = 3
value = 2

[State 860, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 3
value = S1010,0
channel = -1

[State 860, VelAdd]
type = VelAdd
trigger1 = AnimElem = 3
x = 1
y = 0
;ignorehitpause = 
;persistent = 

[State 860, TargetVelAdd]
type = TargetVelAdd
trigger1 = AnimElem = 3
x = 1
y = 0
;ignorehitpause = 
;persistent = 


[State 860, Bind 3]
type = TargetBind
trigger1 = AnimElem = 3
pos = 0.0, 10.0

[State 860, SprPriority]
type = SprPriority
trigger1 = AnimElem = 4
value = 2

[State 860, Bind 4]
type = TargetBind
trigger1 = AnimElem = 4
pos = 0.0, 10.0

[State 860, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 5
value = S0,2
channel = -1

[State 860, SprPriority]
type = SprPriority
trigger1 = AnimElem = 5
value = 2

[State 860, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 5
value = S1010,0
channel = -1

[State 860, VelAdd]
type = VelAdd
trigger1 = AnimElem = 5
x = 1
y = 0
;ignorehitpause = 
;persistent = 

[State 860, TargetVelAdd]
type = TargetVelAdd
trigger1 = AnimElem = 5
x = 1
y = 0
;ignorehitpause = 
;persistent = 

[State 860, Bind 5]
type = TargetBind
trigger1 = AnimElem = 5
pos = 0.0, 10.0

[State 860, SprPriority]
type = SprPriority
trigger1 = AnimElem = 6
value = 2

[State 860, Bind 6]
type = TargetBind
trigger1 = AnimElem = 6
pos = 0.0, 10.0

[State 860, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 7
value = S0,2
channel = -1

[State 860, SprPriority]
type = SprPriority
trigger1 = AnimElem = 7
value = 2

[State 860, VelAdd]
type = VelAdd
trigger1 = AnimElem = 7
x = 1
y = 0
;ignorehitpause = 
;persistent = 

[State 860, TargetVelAdd]
type = TargetVelAdd
trigger1 = AnimElem = 7
x = 1
y = 0
;ignorehitpause = 
;persistent = 

[State 860, Bind 7]
type = TargetBind
trigger1 = AnimElem = 7
pos = 0.0, 10.0

[State 860, SprPriority]
type = SprPriority
trigger1 = AnimElem = 8
value = 2

[State 860, Bind 8]
type = TargetBind
trigger1 = AnimElem = 8
pos = 0.0, 10.0

[State 860, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 8
value = S1,4
channel = -1

[State 860, SprPriority]
type = SprPriority
trigger1 = AnimElem = 9
value = 2

[State 860, Bind 9]
type = TargetBind
trigger1 = AnimElem = 9
pos = -14.5, -45.5

[State 860, SprPriority]
type = SprPriority
trigger1 = AnimElem = 10
value = 2

[State 860, Bind 10]
type = TargetBind
trigger1 = AnimElem = 10
pos = 12.0, -50.0

[State 860, Hurt]
type = TargetLifeAdd
trigger1 = AnimElem = 10
value = -78

[State 860, Throw]
type = TargetState
trigger1 = AnimElem = 10
value = 871


[State 860, State End]
type = ChangeState
trigger1 = AnimTime = 0
value = 0
ctrl = 1

[Statedef 870]
type    = A
movetype= H
physics = N
velset = 0,0

[State 870, 1]
type = ChangeAnim2
trigger1 = Time = 0
value = 870

[State 870,ChangeState]
type = ChangeState
trigger1 = P2StateNo = 870
value = 871


[Statedef 871]
type = A
movetype = H
physics = N
velset = -5,-10
poweradd = 40

[State 871 1] ;Gravity
type = VelAdd
trigger1 = 1
y = .4

[State 871,2]
type = ChangeAnim2
trigger1 = Time = 0
value = 880

[State 871, 0] ;Hit ground
type = SelfState
trigger1 = Vel Y > 0
trigger1 = Pos Y >= 0
value = 5100 ;Hit ground