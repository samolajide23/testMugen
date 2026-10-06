;---------------------------------------------------------------------------
; AI
;---------------------------------------------------------------------------
;---------------------------------------------------------------------------
;---------------------------------------------------------------------------
; STAND LIGHT PUNCH
[Statedef 10000]
type = S
movetype = A
physics = S
anim = 200
poweradd = 5
velset = 2,0
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
hitsound = s2,0
guardsound = s2,5
ground.type = High
ground.slidetime = 4
ground.hittime = 8
ground.velocity = -3.5
air.velocity = -2,-3
airguard.velocity = -3,-2.5

[State 200, AI]
type = ChangeState
trigger1 = movecontact
value = 10001
ctrl = 0

[State 200, End]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1



;---------------------------------------------------------------------------
;CROUCH LIGHT KICK
[Statedef 10001]
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

[State 420, AI]
type = ChangeState
trigger1 = movecontact && animelem = 2, >= 3
value = 10002
ctrl = 0

[State 420, 4]
type = ChangeState
trigger1 = AnimTime = 0
value = 0
ctrl = 1

;---------------------------------------------------------------------------
; STAND SWING KICK
[Statedef 10002]
type = S
movetype = A
physics = S
anim = 230
poweradd = 30
ctrl = 0
velset = 2,0


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

[State 420, AI]
type = ChangeState
trigger1 = movecontact && animelem = 4, >= 3 && random > 500
value = 10003
ctrl = 0

[State 420, AI]
type = ChangeState
trigger1 = movecontact && animelem = 4, >= 3 && random > 500
value = 10004
ctrl = 0

[State 230, 5]
type = ChangeState
trigger1 = !AnimTime
value = 0
;---------------------------------------------------------------------------
; SPECIAL MOVES
;---------------------------------------------------------------------------
; Tyrodoken (Weak) 
[Statedef 10003]
type = S
movetype = A
physics = S
anim = 1000
poweradd = 50
juggle = 14
velSet = 3,0
ctrl = 0

[State 1000, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = S1,5
channel = 1

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

[State 1000, AI]
type = ChangeState
trigger1 = MoveHit = 1 && random < 500 && power >= 1000
value = 3040
ctrl = 0

[State 1000, AI]
type = ChangeState
trigger1 = MoveHit = 1 && random < 500 && power >= 2000
value = 3045
ctrl = 0

[State 1000, AI]
type = ChangeState
trigger1 = MoveHit = 1 && random < 500 && power >= 1000
value = 3000
ctrl = 0

[State 1000, AI]
type = ChangeState
trigger1 = MoveHit = 1 && random < 500 && power >= 2000
value = 3010
ctrl = 0

[State 1000, AI]
type = ChangeState
trigger1 = MoveHit = 1 && random < 500 && power >= 3000
value = 3020
ctrl = 0

[State 1000, AI]
type = ChangeState
trigger1 = MoveHit = 1 && random < 500 && power >= 3000
value = 3030
ctrl = 0

[State 1000, End]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1
; Tyrodoken (Strong) 
[Statedef 10004]
type = S
movetype = A
physics = S
anim = 1000
poweradd = 50
juggle = 14
velSet = 0,0
ctrl = 0

[State 1005, PlaySnd]
type = PlaySnd
trigger1 = !Time 
value = S1,5
channel = 1

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

[State 1000, AI]
type = ChangeState
trigger1 = ProjHit = 1 && random < 500 && power >= 1000
value = 3040
ctrl = 0

[State 1000, AI]
type = ChangeState
trigger1 = ProjHit = 1 && random < 500 && power >= 2000
value = 3045
ctrl = 0

[State 1000, AI]
type = ChangeState
trigger1 = ProjHit = 1 && random < 500 && power >= 1000
value = 3000
ctrl = 0

[State 1000, AI]
type = ChangeState
trigger1 = ProjHit = 1 && random < 500 && power >= 2000
value = 3010
ctrl = 0

[State 1000, AI]
type = ChangeState
trigger1 = ProjHit = 1 && random < 500 && power >= 3000
value = 3030
ctrl = 0

[State 1000, AI]
type = ChangeState
trigger1 = ProjHit = 1 && random < 500 && power >= 3000
value = 3020
ctrl = 0


[State 1005, End]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1










