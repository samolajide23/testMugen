;---------------------------------------------------------------------------
; SUPERS AND HYPERS
;---------------------------------------------------------------------------

; Plasma (Super) 
[Statedef 3000]
type = S
movetype = H
physics = S
anim = 3000
poweradd = 0
juggle = 0
velSet = 0,0
sprPriority = -2
ctrl = 0

[State 3000, SuperPause]
type = SuperPause
trigger1 = !Time
time = 34
anim = -1
sound = S100,0
pos = -10,-50
p2defmul = 0
poweradd = -1000
unhittable = 1
;ignorehitpause = 

[State 3000, Helper]
type = Helper
trigger1 = !time
name = "Level 1 Super"
ID = 17100
stateno = 17100
pos = -10,-50
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 0
supermovetime = 34
pausemovetime = 34
size.xscale = 0.75
size.yscale = 0.75

[State 3001, Explod]
type = Explod
trigger1 = !time
anim = 13000
ID = 3000
postype = P1
pos = 0,-5
removetime = -2
bindtime = -1
sprPriority = 1
removeongethit = 1

[State 3001, PlaySnd]
type = PlaySnd
trigger1 = Time = 2
value = S3000,2 
volumescale = 200
channel = 0
loop = 0

[State 3000, PlaySnd]
type = PlaySnd
trigger1 = !time
value = S1,21
volumescale = 200
channel = 0
loop = 0

[State 3000, Helper]
type = Helper
trigger1 = AnimElem = 3 || AnimElem = 4 || AnimElem = 6 || AnimElem = 7 || AnimElem = 9 || AnimElem = 10 
trigger2 = AnimElem = 12
name = "Plasma Ball (Level 1 Super)"
ID = 3000
stateno = 3002
pos = 10,-30
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 1

[State 3000, Helper]
type = Helper
trigger1 = AnimElem = 13
name = "Plasma Ball (Level 1 Super)"
ID = 3000
stateno = 3003
pos = 10,-30
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 1

[State 3000, End]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1


; Rocket (Super) 
[Statedef 3010]
type = S
movetype = H
physics = S
anim = 3010
poweradd = 0
juggle = 14
velSet = 0,0
sprPriority = -2
ctrl = 0

[State 3010, SuperPause]
type = SuperPause
trigger1 = !Time
time = 34
anim = -1
sound = S100,1
pos = -10,-50
p2defmul = 0
poweradd = -2000
unhittable = 1
;ignorehitpause = 

[State 3010, EnvColor]
type = EnvColor
trigger1 = !time
value =	0,0,0
time = 34
under = 1

[State 3010, Helper]
type = Helper
trigger1 = !time
name = "Level 2 Super"
ID = 17101
stateno = 17101
pos = -10,-50
postype = P1    ;P2, Front, Back, Left, Right
facing = 0
keyctrl = 0
ownpal = 0
supermovetime = 34
pausemovetime = 34
size.xscale = 0.75
size.yscale = 0.75

[State 3010, Explod]
type = Explod
trigger1 = !time
anim = 13010
ID = 3010
removetime = -2
postype = P1
pos = 0,-5
bindtime = -1
sprPriority = 1
removeongethit = 1

[State 3010, PlaySnd]
type = PlaySnd
trigger1 = Time = 2
value = S3010,2
volumescale = 200
channel = 0
loop = 0

[State 3010, PlaySnd]
type = PlaySnd
trigger1 = !time
value = S1,21
volumescale = 200
channel = 0
loop = 0

[State 3010, Helper]
type = Helper
trigger1 = AnimElem = 3 || AnimElem = 6 || AnimElem = 9 || AnimElem = 12
name = "Rocket (Level 2 Super)"
ID = 3010
stateno = 3012
pos = 10,-30
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 1

[State 3010, Helper]
type = Helper
trigger1 = AnimElem = 15 
name = "Rocket (Level 2 Super)"
ID = 3010
stateno = 3013
pos = 10,-30
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 1

[State 3007, End]
type = RemoveExplod
trigger1 = !animtime
ID = 3010

[State 3010, End]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1


; BFG (Super) 
[Statedef 3020]
type = S
movetype = H
physics = S
anim = 3020
poweradd = 0
juggle = 14
velSet = 0,0
sprPriority = -2
ctrl = 0

[State 3020, SuperPause]
type = SuperPause
trigger1 = !time
time = 43
moveTime = 43
p2DefMul = 1
unHittable = 0
anim = -1
powerAdd = -3000
sound = s100,2
darken = 0

[State 3030, SPBG]
type = Helper
trigger1 = !time
helperType = Normal
stateNo = 8000
ID = 8000
name = "SuperPause BG"
posType = P1
pos = 28, -52
superMoveTime = 255
size.xScale = 1
size.yScale = 1
ownPal = 1


[State 3030, Helper]
type = Helper
trigger1 = !time
name = "Level 3 Super"
ID = 17102
stateno = 17102
pos = -10,-50
postype = P1    ;P2, Front, Back, Left, Right
facing = 0
keyctrl = 0
ownpal = 0
supermovetime = 30
pausemovetime = 30
size.xscale = 0.75
size.yscale = 0.75

[State 3020, PlaySnd]
type = PlaySnd
trigger1 = !time
value = S1,21
volumescale = 200
channel = 0
loop = 0

[State 3021, Explod]
type = Explod
trigger1 = !time
anim = 13020
ID = 3020
postype = P1
pos = 0,-5
removetime = -2
bindtime = -1
sprPriority = 1
removeongethit = 1

[State 3021, PlaySnd]
type = PlaySnd
trigger1 = time = 1
value = S3020,2
volumescale = 300
channel = 0
loop = 0

[State 3021, PlaySnd]
type = PlaySnd
trigger1 = time = 20
value = S3020,0
volumescale = 200
channel = 1
loop = 0

[State 3020, Helper]
type = Helper
trigger1 = AnimElem = 4, 1
name = "BFG Ball (MAX Super)"
ID = 3020
stateno = 3022
pos = 20,-40
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 1



[State 3007, End]
type = RemoveExplod
trigger1 = !animtime
ID = 3020

[State 3020, End]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1

; Raging Fox (Super) 
[Statedef 3030]
type = S
movetype = H
physics = S
anim = 3030
poweradd = 0
juggle = 0
velSet = 0,0
sprPriority = -2
ctrl = 0

[State 3030, NOT HIT BY]
type = NotHitBy
trigger1 = 1
value = SCA
time = 1

[State 3020, SuperPause]
type = SuperPause
trigger1 = !time
time = 43
moveTime = 43
p2DefMul = 1
unHittable = 0
anim = -1
powerAdd = -3000
sound = s100,2
darken = 0


[State 3030, SP]
type = Helper
trigger1 = !time
helperType = Normal
stateNo = 8000
ID = 8000
name = "SuperPause"
posType = P1
pos = 28, -52
superMoveTime = 255
size.xScale = 1
size.yScale = 1
ownPal = 1


[State 3030, Helper]
type = Helper
trigger1 = !time
name = "Level 3 Super"
ID = 17102
stateno = 17102
pos = -10,-50
postype = P1    ;P2, Front, Back, Left, Right
facing = 0
keyctrl = 0
ownpal = 0
supermovetime = 30
pausemovetime = 30
size.xscale = 0.75
size.yscale = 0.75

[State 3030, PlaySnd]
type = PlaySnd
trigger1 = Time = 1
value = S4,0
volumescale = 100
channel = -1
loop = 0

[State 3030, VelSet]
type = VelSet
triggerall = palno <= 10
trigger1 = Time > 1
x = 8

[State 3030, VelSet]
type = VelSet
triggerall = palno > 10
trigger1 = Time > 1
x = 12

[State 3030, Helper]
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

[State 3030, Miss]
type = hitdef
trigger1 = time
attr = S,HT


[State 3030, Hit]
type = hitdef
triggerall = palno <= 10
trigger1 = time
trigger1 = p2dist x >= 0 && p2bodydist x <= 20
attr = S, HT
hitflag = M-
priority = 6, Miss
numhits = 0
sparkno = -1
p1facing = 1
p1stateno = 3031
p2stateno = 3032
fall = 1 
fall.recover = 0
ID = 3030

[State 3030, Hit]
type = hitdef
triggerall = palno > 10
trigger1 = time
trigger1 = p2dist x >= 0 && p2bodydist x <= 20
attr = S, HT
hitflag = M-
priority = 6, Miss
numhits = 0
sparkno = -1
p1facing = 1
p1stateno = 3035
p2stateno = 3036
fall = 1 
fall.recover = 0
ID = 3030

[State 3030, End]
type=changestate
trigger1= !AnimTime
value=0
ctrl=1

; Raging Fox (Success)
[Statedef 3031]
type    = S
movetype= A
physics = N
juggle  = 1
velset = 0,0
anim = 3031
ctrl = 0
sprpriority = -2

[State 3031, PlaySnd]
type = PlaySnd
trigger1 = !Time
value = s2,6
volumescale = 100
channel = -1
loop = 0

[State 3031, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 3
value = s1,13
volumescale = 100
channel = -1
loop = 0

[State 3031, Push]
type = playerpush
trigger1 = 1
value = 0

[State 3031, nothitby]
type = nothitby
trigger1 = AnimElem =  7,=120
value = SCA
time = 1

[State 3031, black]
type = envcolor
trigger1 = animelemtime(7) >= 0 && animelemtime(8) < 0
time = 5
value = 0, 0, 0

[State 3031, Assert]
type = assertspecial
trigger1 = animelemtime(7) >= 0 && animelemtime(8) < 0
flag = nobardisplay
flag2 = noFG

[State 3031, Bind]
type = targetbind
trigger1 = AnimElem =  7,=120
pos = 45, 0

[State 3031, givepower]
type = targetpoweradd
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=8 || AnimElem =  7,=16
trigger2 = AnimElem =  7,=24 ||AnimElem =  7,=32 || AnimElem =  7,=40
trigger3 = AnimElem =  7,=48 || AnimElem =  7,=56 || AnimElem =  7,=64
trigger4 = AnimElem =  7,=72 || AnimElem =  7,=80 || AnimElem =  7,=88
trigger5 = AnimElem =  7,=96 || AnimElem =  7,=104 || AnimElem =  7,=112
value = 5

[State 3031, HitAdd]
type = HitAdd
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=8 || AnimElem =  7,=16
trigger2 = AnimElem =  7,=24 ||AnimElem =  7,=32 || AnimElem =  7,=40
trigger3 = AnimElem =  7,=48 || AnimElem =  7,=56 || AnimElem =  7,=64
trigger4 = AnimElem =  7,=72 || AnimElem =  7,=80 || AnimElem =  7,=88
trigger5 = AnimElem =  7,=96 || AnimElem =  7,=104 || AnimElem =  7,=112
value = 1

[State 3031,PlaySnd]
type = PlaySnd
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=8 || AnimElem =  7,=16
trigger2 = AnimElem =  7,=24 ||AnimElem =  7,=32 || AnimElem =  7,=40
trigger3 = AnimElem =  7,=48 || AnimElem =  7,=56 || AnimElem =  7,=64
trigger4 = AnimElem =  7,=72 || AnimElem =  7,=80 || AnimElem =  7,=88
trigger5 = AnimElem =  7,=96 || AnimElem =  7,=104 || AnimElem =  7,=112
value = S2,1
channel = 1
freqmul = 1.0
loop = 0
pan = 0


[State 3031,PlaySnd]
type = PlaySnd
trigger1 = AnimElem =  7,=120
value = S2,2
channel = 1
freqmul = 1.0
loop = 0
pan = 0

[State 3031,TargetLifeAdd]
type = TargetLifeAdd
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=8 || AnimElem =  7,=16
trigger2 = AnimElem =  7,=24 ||AnimElem =  7,=32 || AnimElem =  7,=40
trigger3 = AnimElem =  7,=48 || AnimElem =  7,=56 || AnimElem =  7,=64
trigger4 = AnimElem =  7,=72 || AnimElem =  7,=80 || AnimElem =  7,=88
trigger5 = AnimElem =  7,=96 || AnimElem =  7,=104 || AnimElem =  7,=112
value = -35
kill = 0

[State 3031, Sparks]
type = explod
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=8 || AnimElem =  7,=16
trigger2 = AnimElem =  7,=24 ||AnimElem =  7,=32 || AnimElem =  7,=40
trigger3 = AnimElem =  7,=48 || AnimElem =  7,=56 || AnimElem =  7,=64
trigger4 = AnimElem =  7,=72 || AnimElem =  7,=80 || AnimElem =  7,=88
trigger5 = AnimElem =  7,=96 || AnimElem =  7,=104 || AnimElem =  7,=112
anim = 7001
ID = 7001
sprpriority = 5
postype = p2
pos = 0, (target, const(size.mid.pos.y))
random = 60, 60
facing = -1
ownpal = 1
ontop = 1
pausemovetime = 300
supermovetime = 300

[State 3031, Shake]
type = envshake
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=8 || AnimElem =  7,=16
trigger2 = AnimElem =  7,=24 ||AnimElem =  7,=32 || AnimElem =  7,=40
trigger3 = AnimElem =  7,=48 || AnimElem =  7,=56 || AnimElem =  7,=64
trigger4 = AnimElem =  7,=72 || AnimElem =  7,=80 || AnimElem =  7,=88
trigger5 = AnimElem =  7,=96 || AnimElem =  7,=104 || AnimElem =  7,=112
time = 6
freq = 120
ampl = -4

[State 3031,TargetLifeAdd]
type = TargetLifeAdd
trigger1 = AnimElem =  7,=120
value = -60
kill = 1

[State 3031, Sparks]
type = explod
trigger1 = AnimElem =  7,=120
anim = 7002
ID = 7002
sprpriority = 5
postype = p2
pos = 0, (target, const(size.mid.pos.y))
random = 60, 60
facing = -1
ownpal = 1
ontop = 1
pausemovetime = 300
supermovetime = 300


[State 3031, PosFix]
type = posset
trigger1 = anim = 3031 && AnimElem =  7,=120
y = 0

[State 3031, throw]
type = targetstate
trigger1 = AnimElem =  7,=120 && numtarget
value = 3033
persistent = 0

[State 3031, ChangeState]
type = ChangeState
trigger1 = WinKO
value = 3037

[State 3031, End]
type = changestate
trigger1 = !animtime
value = 0
ctrl = 1


; Raging Fox (Hit)
[Statedef 3032]
type = S
physics = N
movetype = H
velset = 0, 0
ctrl = 0

[State 3032, PosFix]
type = posset
trigger1 = !time
y = 0

[State 3032, ChangeAnim2]
type = ChangeAnim2
trigger1 = !time 
value = 3032


; Raging Fox (Down)
[Statedef 3033]
type = L
physics = C
movetype = H
velset = 0, 0
ctrl = 0

[State 4104, PosFix]
type = posset
trigger1 = !time
y = 0

[State 4104, anim]
type = changeanim2
trigger1 = !time
value = 3033

[State 4021, End]
type = selfstate
trigger1 = !alive
value = 5150

[State 4021, End]
type = selfstate
trigger1 = alive
trigger1 = time >= 120
value = 5120

; Raging Fox (Superform) (Success)
[Statedef 3035]
type    = S
movetype= A
physics = N
juggle  = 1
velset = 0,0
anim = 3031
ctrl = 0
sprpriority = -2

[State 3031, PlaySnd]
type = PlaySnd
trigger1 = !Time
value = s2,6
volumescale = 100
channel = -1
loop = 0

[State 3031, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 3
value = s1,13
volumescale = 100
channel = -1
loop = 0

[State 3031, Push]
type = playerpush
trigger1 = 1
value = 0

[State 3031, nothitby]
type = nothitby
trigger1 = AnimElem =  7,=120
value = SCA
time = 1

[State 3031, black]
type = envcolor
trigger1 = animelemtime(7) >= 0 && animelemtime(8) < 0
time = 5
value = 0, 0, 0

[State 3031, Assert]
type = assertspecial
trigger1 = animelemtime(7) >= 0 && animelemtime(8) < 0
flag = nobardisplay
flag2 = noFG

[State 3031, Bind]
type = targetbind
trigger1 = AnimElem =  7,=120
pos = 45, 0

[State 3031, givepower]
type = targetpoweradd
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=4 || AnimElem =  7,=8
trigger2 = AnimElem =  7,=12 ||AnimElem =  7,=16 || AnimElem =  7,=20
trigger3 = AnimElem =  7,=24 || AnimElem =  7,=28 || AnimElem =  7,=32
trigger4 = AnimElem =  7,=36 || AnimElem =  7,=40 || AnimElem =  7,=44
trigger5 = AnimElem =  7,=48 || AnimElem =  7,=52 || AnimElem =  7,=56
trigger6 = AnimElem =  7,=60 || AnimElem =  7,=64 || AnimElem =  7,=68
trigger7 = AnimElem =  7,=72 ||AnimElem =  7,=76 || AnimElem =  7,=80
trigger8 = AnimElem =  7,=84 || AnimElem =  7,=88 || AnimElem =  7,=92
trigger9 = AnimElem =  7,=96 || AnimElem =  7,=100 || AnimElem =  7,=104
trigger10 = AnimElem =  7,=108 || AnimElem =  7,=112 || AnimElem =  7,=116
value = 2

[State 3031, HitAdd]
type = HitAdd
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=4 || AnimElem =  7,=8
trigger2 = AnimElem =  7,=12 ||AnimElem =  7,=16 || AnimElem =  7,=20
trigger3 = AnimElem =  7,=24 || AnimElem =  7,=28 || AnimElem =  7,=32
trigger4 = AnimElem =  7,=36 || AnimElem =  7,=40 || AnimElem =  7,=44
trigger5 = AnimElem =  7,=48 || AnimElem =  7,=52 || AnimElem =  7,=56
trigger6 = AnimElem =  7,=60 || AnimElem =  7,=64 || AnimElem =  7,=68
trigger7 = AnimElem =  7,=72 ||AnimElem =  7,=76 || AnimElem =  7,=80
trigger8 = AnimElem =  7,=84 || AnimElem =  7,=88 || AnimElem =  7,=92
trigger9 = AnimElem =  7,=96 || AnimElem =  7,=100 || AnimElem =  7,=104
trigger10 = AnimElem =  7,=108 || AnimElem =  7,=112 || AnimElem =  7,=116
value = 1

[State 3031,PlaySnd]
type = PlaySnd
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=4 || AnimElem =  7,=8
trigger2 = AnimElem =  7,=12 ||AnimElem =  7,=16 || AnimElem =  7,=20
trigger3 = AnimElem =  7,=24 || AnimElem =  7,=28 || AnimElem =  7,=32
trigger4 = AnimElem =  7,=36 || AnimElem =  7,=40 || AnimElem =  7,=44
trigger5 = AnimElem =  7,=48 || AnimElem =  7,=52 || AnimElem =  7,=56
trigger6 = AnimElem =  7,=60 || AnimElem =  7,=64 || AnimElem =  7,=68
trigger7 = AnimElem =  7,=72 ||AnimElem =  7,=76 || AnimElem =  7,=80
trigger8 = AnimElem =  7,=84 || AnimElem =  7,=88 || AnimElem =  7,=92
trigger9 = AnimElem =  7,=96 || AnimElem =  7,=100 || AnimElem =  7,=104
trigger10 = AnimElem =  7,=108 || AnimElem =  7,=112 || AnimElem =  7,=116
value = S2,1
channel = 1
freqmul = 1.0
loop = 0
pan = 0


[State 3031,PlaySnd]
type = PlaySnd
trigger1 = AnimElem =  7,=120
value = S2,2
channel = 1
freqmul = 1.0
loop = 0
pan = 0

[State 3031,TargetLifeAdd]
type = TargetLifeAdd
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=4 || AnimElem =  7,=8
trigger2 = AnimElem =  7,=12 ||AnimElem =  7,=16 || AnimElem =  7,=20
trigger3 = AnimElem =  7,=24 || AnimElem =  7,=28 || AnimElem =  7,=32
trigger4 = AnimElem =  7,=36 || AnimElem =  7,=40 || AnimElem =  7,=44
trigger5 = AnimElem =  7,=48 || AnimElem =  7,=52 || AnimElem =  7,=56
trigger6 = AnimElem =  7,=60 || AnimElem =  7,=64 || AnimElem =  7,=68
trigger7 = AnimElem =  7,=72 ||AnimElem =  7,=76 || AnimElem =  7,=80
trigger8 = AnimElem =  7,=84 || AnimElem =  7,=88 || AnimElem =  7,=92
trigger9 = AnimElem =  7,=96 || AnimElem =  7,=100 || AnimElem =  7,=104
trigger10 = AnimElem =  7,=108 || AnimElem =  7,=112 || AnimElem =  7,=116
value = -18

[State 3031, Sparks]
type = explod
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=4 || AnimElem =  7,=8
trigger2 = AnimElem =  7,=12 ||AnimElem =  7,=16 || AnimElem =  7,=20
trigger3 = AnimElem =  7,=24 || AnimElem =  7,=28 || AnimElem =  7,=32
trigger4 = AnimElem =  7,=36 || AnimElem =  7,=40 || AnimElem =  7,=44
trigger5 = AnimElem =  7,=48 || AnimElem =  7,=52 || AnimElem =  7,=56
trigger6 = AnimElem =  7,=60 || AnimElem =  7,=64 || AnimElem =  7,=68
trigger7 = AnimElem =  7,=72 ||AnimElem =  7,=76 || AnimElem =  7,=80
trigger8 = AnimElem =  7,=84 || AnimElem =  7,=88 || AnimElem =  7,=92
trigger9 = AnimElem =  7,=96 || AnimElem =  7,=100 || AnimElem =  7,=104
trigger10 = AnimElem =  7,=108 || AnimElem =  7,=112 || AnimElem =  7,=116
anim = 7001
ID = 7001
sprpriority = 5
postype = p2
pos = 0, (target, const(size.mid.pos.y))
random = 60, 60
facing = -1
ownpal = 1
ontop = 1
pausemovetime = 300
supermovetime = 300

[State 3031, Shake]
type = envshake
trigger1 = AnimElem =  7,=0 || AnimElem =  7,=4 || AnimElem =  7,=8
trigger2 = AnimElem =  7,=12 ||AnimElem =  7,=16 || AnimElem =  7,=20
trigger3 = AnimElem =  7,=24 || AnimElem =  7,=28 || AnimElem =  7,=32
trigger4 = AnimElem =  7,=36 || AnimElem =  7,=40 || AnimElem =  7,=44
trigger5 = AnimElem =  7,=48 || AnimElem =  7,=52 || AnimElem =  7,=56
trigger6 = AnimElem =  7,=60 || AnimElem =  7,=64 || AnimElem =  7,=68
trigger7 = AnimElem =  7,=72 ||AnimElem =  7,=76 || AnimElem =  7,=80
trigger8 = AnimElem =  7,=84 || AnimElem =  7,=88 || AnimElem =  7,=92
trigger9 = AnimElem =  7,=96 || AnimElem =  7,=100 || AnimElem =  7,=104
trigger10 = AnimElem =  7,=108 || AnimElem =  7,=112 || AnimElem =  7,=116
time = 6
freq = 120
ampl = -4

[State 3031, TargetLifeAdd]
type = TargetLifeAdd
trigger1 = AnimElem =  7,=120
value = -30

[State 3031, PosFix]
type = posset
trigger1 = anim = 3031 && AnimElem =  7,=120
y = 0

[State 3031, Sparks]
type = explod
trigger1 = AnimElem =  7,=120
anim = 7002
ID = 7002
sprpriority = 5
postype = p2
pos = 0, (target, const(size.mid.pos.y))
random = 60, 60
facing = -1
ownpal = 1
ontop = 1
pausemovetime = 300
supermovetime = 300

[State 3031, throw]
type = targetstate
trigger1 = AnimElem =  7,=120 && numtarget
value = 3033
persistent = 0

[State 3031, ChangeState]
type = ChangeState
trigger1 = WinKO
value = 3037

[State 3031, End]
type = changestate
trigger1 = !animtime
value = 0
ctrl = 1


; Raging Fox (Superform) (Hit)
[Statedef 3036]
type = S
physics = N
movetype = H
velset = 0, 0
ctrl = 0

[State 3036, PosFix]
type = posset
trigger1 = !time
y = 0

[State 3036, ChangeAnim2]
type = ChangeAnim2
trigger1 = !time 
value = 3032

[Statedef 3037]
type = S

[State 3037, ChangeAnim]
type = ChangeAnim
trigger1 = !Time && (PrevStateNo = [3031, 3035])
value = 3350

[State 3037, notover]
type = assertspecial
trigger1 = time < 200
flag = roundnotover

[State 3037, Super Finish]
type = Helper
triggerall = !NumHelper(8023)
trigger1 = !time
name = "SuperFinish Logos"
ID = 8023
stateno = 8023
posType = Back
pos = 0,0
ownPal = 1
pauseMoveTime = 999
superMoveTime = 999
ignoreHitPause = 1

[State 3037, Snd]
type = PlaySnd
trigger1 = !time
value = S1,15
volumescale = 200
channel = -1
loop = 0

[State 3037, Snd]
type = PlaySnd
trigger1 = !Time
value = s7,0
volumescale = 100
channel = -1
loop = 0


[State 3037, ChangeState]
type = ChangeState
trigger1 = Time >= 120 && RoundState = 3
value = ifElse(RoundState = 3, 180, 0)
ctrl = 1

; Tyinkku Tyrodoken (Super) 
[Statedef 3040]
type = S
movetype = H
physics = S
anim = 3040
poweradd = 0
juggle = 0
velSet = 0,0
sprPriority = -2
ctrl = 0

[State 3040, SuperPause]
type = SuperPause
trigger1 = !Time
time = 34
anim = -1
sound = S100,0
pos = -10,-50
p2defmul = 0
poweradd = -1000
unhittable = 1
;ignorehitpause = 

[State 3040, Helper]
type = Helper
trigger1 = !time
name = "Level 1 Super"
ID = 17100
stateno = 17100
pos = -10,-50
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 0
supermovetime = 34
pausemovetime = 34
size.xscale = 0.75
size.yscale = 0.75



[State 3040, PlaySnd]
type = PlaySnd
trigger1 = !time
value = S1,21
volumescale = 200
channel = 0
loop = 0

[State 3045, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 3
value = S1,9
volumescale = 100
channel = 1
loop = 0

[State 3045, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 3
value = S1000,0
volumescale = 100
channel = 2
loop = 0

[State 3040, Helper]
type = Helper
trigger1 = AnimElem = 3
name = "Tyrodoken (Level 1 Super)"
ID = 3041
stateno = 3041
pos = 30,-10
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 0

[State 3040, End]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1

;Dyinkku Tyrodoken (Super) 
[Statedef 3045]
type = S
movetype = H
physics = S
anim = 3041
poweradd = 0
juggle = 0
velSet = 0,0
sprPriority = -2
ctrl = 0

[State 3045, SuperPause]
type = SuperPause
trigger1 = !Time
time = 34
anim = -1
sound = S100,1
pos = -10,-50
p2defmul = 0
poweradd = -2000
unhittable = 1
;ignorehitpause = 

[State 3045, Helper]
type = Helper
trigger1 = !time
name = "Level 2 Super"
ID = 17101
stateno = 17101
pos = -10,-50
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 0
supermovetime = 34
pausemovetime = 34
size.xscale = 0.75
size.yscale = 0.75

[State 3045, PlaySnd]
type = PlaySnd
trigger1 = !time
value = S1,21
volumescale = 200
channel = 0
loop = 0
`
[State 3045, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 3
value = S1,9
volumescale = 100
channel = 1
loop = 0

[State 3045, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 3
value = S1000,0
volumescale = 100
channel = 2
loop = 0

[State 3045, Helper]
type = Helper
trigger1 = AnimElem = 4
name = "Tyrodoken (Level 2 Super)"
ID = 3045
stateno = 3046
pos = 10,-10
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 0

[State 3045, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 11
value = S1,9
volumescale = 100
channel = 1
loop = 0

[State 3045, PlaySnd]
type = PlaySnd
trigger1 = AnimElem = 11
value = S1000,0
volumescale = 100
channel = 2
loop = 0

[State 3045, Helper]
type = Helper
trigger1 = AnimElem = 12
name = "Tyrodoken (Level 2 Super)"
ID = 3045
stateno = 3047
pos = 20,0
postype = P1    ;P2, Front, Back, Left, Right
facing = 1
keyctrl = 0
ownpal = 0

[State 3045, End]
type = ChangeState
trigger1 = !AnimTime
value = 0
ctrl = 1