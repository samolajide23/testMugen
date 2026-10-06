
;Kamehameha
[Statedef 3000]
type = S
movetype = A
physics = S
anim = 3000
poweradd = -1000
velset = 0
ctrl = 0
sprpriority = 0

;[state 2300, super a]
;type = superpause
;trigger1 = time = 0
;time = 75
;anim = -1
[State 3000, Black BG]
type = Explod
trigger1 = Time = 0
removetime = -1
id = 6035
anim = 6035
pos = 0,0
postype = Left
scale = 1,1
sprpriority = -99999
facing = 1
vfacing = 1
ownpal = 1
bindtime = -1
ontop = 0
ownpal = 1
supermove = 1
pausemove = 1
removeongethit = 1
ignorehitpause = 1
persistent = 1
supermovetime = 60
pausemovetime =  60
[State 0, Helper]
type = Helper
trigger1=!time
helpertype = normal ;player
name = "Super Fx"
ID = 2061
stateno = 2061
pos = -30, -60
postype = p1
facing = 1
keyctrl = 0
ownpal = 1
supermovetime = 48
[State 0, Helper]
type = Helper
trigger1 =time=0
helpertype = normal ;player
name = "portrait"
ID = 6033
stateno = 6033
postype = back
facing = 1
keyctrl = 0
ownpal = 1
supermovetime = 99999
size.xscale =.5
size.yscale =.5
[State 6034, HyperBG]
type=helper
trigger1 = AnimElem =6
helpertype=normal
stateno=6031
ID=6034
name="HyperBG"
postype=Back
supermovetime=99999
pausemovetime=99999
ownpal=1
ignorehitpause=1
size.xscale=.6
size.yscale=.6
[State 0,LV1]
type=afterimage
trigger1=Time=5
time = 999
timegap = 1
framegap = 10
length = 30
paladd = 0, 0, 0
palmul = 0.75, 0.75, 0.75
palcontrast = 128, 128, 128
palpostbright = 0, 0, 0
trans = add1
[State 3000, Super Pause]
type = superpause
trigger1 = time = 1
time = 50
movetime = 50
anim = -1
sound = s3100,0
p2defmul = 1
darken = 0

[State 0, Explod]
type = Explod
trigger1 =animelem=5
anim = 3030
ID = 3030
pos = -25,-60
postype = p1
bindtime = -1
removetime = 45
pausemovetime = 999999
supermovetime = 999999
scale = .3,.3
sprpriority = 1
ownpal = 1
removeongethit = 1

;[State 2300, juggle]
;type = AssertSpecial
;trigger1 = 1
;flag = nojugglecheck

;[State 2300, Aura1]
;type = Explod
;trigger1 = animelem = 1
;anim = 1226
;sprpriority = 5
;postype = p1
;pos = 0,0;
;bindtime = -1
;removetime = 87
;removeongethit = 1
;supermove = 1

[State 2300, dust]
type = Explod
trigger1 = AnimElem = 1
anim = 2216
ID = 2216
postype = p1
pos = -25,0
bindtime = -1
sprpriority = 5
supermovetime = 52
ownpal = 1
removeongethit = 1
facing = -1

[State 2300, 1];w—­‚ß‚é‰¹x
type = PlaySnd
trigger1 = AnimElem = 1
value = 20,0

[State 2300, 1];w—­‚ß‚é‰¹x
type = PlaySnd
trigger1 = AnimElem = 5
value = 2000,5

[State 2300, 1];wŒ‚‚Â‰¹x
type = PlaySnd
trigger1 = AnimElem = 6
value = 2200,4

[State 2300, 1];wŒ‚‚Â‰¹x
type = PlaySnd
trigger1 = AnimElem = 4
value = 1400,0

[State 2300, StopSnd]
type = StopSnd
trigger1 = animelem = 4
channel = 4

[State 0, Super Kamehameha]
type = Helper
trigger1 = anim=3000&&animelem = 6
helpertype = normal
name = "superkamehameha"
ID = 3005
stateno = 3005
pos = 0,0
postype = p1
facing = 1
keyctrl = 0
ownpal = 1
size.xscale = .5
size.yscale = .7

[State 2200, dust]
type = explod
trigger1 = animelem = 5;time = 25
anim = 2215
pos = 17,5
sprpriority = 5
bindtime = 1
ownpal = 1
removeongethit = 1
facing = -1
removetime = 66

[State 2300, 3]
type = ChangeState
trigger1 = animtime = 0
value = 0
ctrl = 1

;Air Kamehameha
[Statedef 3010]
type = A
movetype = A
physics = S
anim = 3010
poweradd = -1000
velset = 0,0
ctrl = 0
sprpriority = 0

;[state 2300, super a]
;type = superpause
;trigger1 = time = 0
;time = 75
;anim = -1
[State 3000, Black BG]
type = Explod
trigger1 = Time = 0
removetime = -1
id = 6035
anim = 6035
pos = 0,0
postype = Left
scale = 1,1
sprpriority = -99999
facing = 1
vfacing = 1
ownpal = 1
bindtime = -1
ontop = 0
ownpal = 1
supermove = 1
pausemove = 1
removeongethit = 1
ignorehitpause = 1
persistent = 1
supermovetime = 60
pausemovetime =  60
[State 0, Helper]
type = Helper
trigger1=!time
helpertype = normal ;player
name = "Super Fx"
ID = 2061
stateno = 2061
pos = -15,-100
postype = p1
facing = 1
keyctrl = 0
ownpal = 1
supermovetime = 48
[State 0, Helper]
type = Helper
trigger1 =time=0
helpertype = normal ;player
name = "portrait"
ID = 6033
stateno = 6033
postype = back
facing = 1
keyctrl = 0
ownpal = 1
supermovetime = 99999
size.xscale =.5
size.yscale =.5
[State 6034, HyperBG]
type=helper
trigger1 = AnimElem =3
helpertype=normal
stateno=6031
ID=6034
name="HyperBG"
postype=Back
supermovetime=99999
pausemovetime=99999
ownpal=1
ignorehitpause=1
size.xscale=.6
size.yscale=.6
[State 0,LV1]
type=afterimage
trigger1=Time=5
time = 999
timegap = 1
framegap = 10
length = 30
paladd = 0, 0, 0
palmul = 0.75, 0.75, 0.75
palcontrast = 128, 128, 128
palpostbright = 0, 0, 0
trans = add1
[State 3000, Super Pause]
type = superpause
trigger1 = time = 1
time = 52
movetime = 52
anim = -1
sound = s3100,0
p2defmul = 1
darken = 0

[State 0, Explod]
type = Explod
trigger1 =animelem=3
anim = 3030
ID = 3030
pos = -15,-100
postype = p1
bindtime = -1
removetime = 45
pausemovetime = 999999
supermovetime = 999999
scale = .3,.3
sprpriority = 1
ownpal = 1
removeongethit = 1

[State 2300, 1];w—­‚ß‚é‰¹x
type = PlaySnd
trigger1 = AnimElem = 4
value = 2200,4

[State 2300, 1];w—­‚ß‚é‰¹x
type = PlaySnd
trigger1 = AnimElem = 2
value = 2000,5

[State 2300, 1];wŒ‚‚Â‰¹x
type = PlaySnd
trigger1 = AnimElem = 3
value = 1400,0


[State 2300, StopSnd]
type = StopSnd
trigger1 = animelem = 4
channel = 4

[State 0, Super Kamehameha]
type = Helper
trigger1 = anim=3010 && animelem = 5
helpertype = normal
name = "superkamehameha"
ID = 3015
stateno = 3015
pos = -7,-17;0,0
postype = p1
facing = 1
keyctrl = 0
ownpal = 1
size.xscale = .7
size.yscale = .7

[State 1100, Gravity]
type = Veladd
trigger1 = AnimElem=6
y = 6

[State 3020, End]
type = changestate
trigger1 = Pos Y >= 0 && Vel Y > 0
value = 52

;warp kamehameha
[Statedef 3020]
type = S
movetype = A
physics = S
anim = 3020
velset = 0
ctrl = 0
juggle = 1

[State 3000, 8]
type = SuperPause
trigger1 = AnimElem = 1
time = 90
movetime = 90
anim = -1

[State 2400, not hit]
type = NotHitBy
trigger1 = animelem = 3
time = 16
value = SCA

[State 2400, push]
type = PlayerPush
trigger1 = Time = [0,14]
value = 0

[state 2400, pos]
type = posadd
trigger1 = AnimElem = 5
x = p2bodydist x + 190

[state 2400, pos]
type = posadd
trigger1 = p2statetype=A&&AnimElem = 5
x = p2bodydist x + 190
y = p2bodydist y +  5

[state 2400, turn]
type = turn
trigger1 = p2bodydist x < 0

[State 2400, sound]
type = PlaySnd
trigger1 = AnimElem = 3
value = 300, 0

[State 2400, land]
type = PlaySnd
trigger1 = AnimElem = 7
value = 0, 2

[State 2400,zanzou]
type = explod
trigger1 = AnimElem = 4
anim = 3602
pos = 0,0
postype = p1
sprpriority = 2
ownpal = 1
removetime = 4
removeongethit = 0

[State 2400,lines1]
type = explod
trigger1 = time = 11
anim = 3021
pos = 0,0
postype = p1
sprpriority = 3
ownpal = 1
removetime = 9
removeongethit = 0

[State 2400,lines2]
type = explod
trigger1 = AnimElem = 5
anim = 3021
pos = -21,12
postype = p1
sprpriority = 3
ownpal = 1
supermovetime =18
removetime = 18
removeongethit = 0


[State 2401, end]
type = ChangeState
Trigger1 = AnimElem = 6;AnimTime = 0
value = ifelse(p2statetype=A,3010,3000)
ctrl = 0



;-----------------------------------------------------
;instant transmission(air)
[Statedef 3021]
type = A
movetype = A
physics = S
anim = 3021
velset = 0,0
ctrl = 0
juggle = 1

[State 3000, 8]
type = SuperPause
trigger1 = AnimElem = 1
time = 52
movetime = 52
anim = -1

[State 2401, not hit]
type = NotHitBy
trigger1 = animelem = 3
time = 16
value = SCA

[State 2401, push]
type = PlayerPush
trigger1 = Time = [0,14]
value = 0

[state 2401, pos]
type = posadd
trigger1 = AnimElem = 5
x = p2bodydist x + 190
y = p2bodydist y + 0

[state 2401, turn]
type = turn
trigger1 = p2bodydist x < 0

[State 2401, sound]
type = PlaySnd
trigger1 = AnimElem = 3
value = 300, 0

[State 2401,zanzou]
type = explod
trigger1 = AnimElem = 4
anim = 3606
pos = 0,0
postype = p1
sprpriority = 2
ownpal = 1
removetime = 4
removeongethit = 0

[State 2401,lines1]
type = explod
trigger1 = time = 11
anim = 3601
pos = 0,0
postype = p1
sprpriority = 3
ownpal = 1
removetime = 9
removeongethit = 0

[State 2401,lines2]
type = explod
trigger1 = AnimElem = 5
anim = 3601
pos = -10,-10
postype = p1
sprpriority = 3
ownpal = 1
supermovetime =18
removetime = 18
removeongethit = 0

[State 2401, end]
type = ChangeState
Trigger1 = AnimElem = 6;AnimTime = 0
value = ifelse(p2statetype=A,3010,3000)
ctrl = 0





;---------------------------------------------------
;start up
[Statedef 3100]
type    = S
movetype= A
physics = S
velset = 0,0
ctrl = 0
poweradd = -2000
anim = 3100
sprpriority = 0
juggle = 1

[State 3000, Black BG]
type = Explod
trigger1 = Time = 0
removetime = -1
id = 6035
anim = 6035
pos = 0,0
postype = Left
scale = 1,1
sprpriority = -99999
facing = 1
vfacing = 1
ownpal = 1
bindtime = -1
ontop = 0
ownpal = 1
supermove = 1
pausemove = 1
removeongethit = 1
ignorehitpause = 1
persistent = 1
supermovetime = 60
pausemovetime =  60
[State 0, Helper]
type = Helper
trigger1=!time
helpertype = normal ;player
name = "Super Fx"
ID = 2062
stateno = 2062
pos = 0,-60
postype = p1
facing = 1
keyctrl = 0
ownpal = 1
supermovetime = 48
[State 0, Helper]
type = Helper
trigger1 =time=0
helpertype = normal ;player
name = "portrait"
ID = 6036
stateno = 6036
postype = back
facing = 1
keyctrl = 0
ownpal = 1
supermovetime = 99999
size.xscale =.5
size.yscale =.5
[State 6034, HyperBG]
type=helper
trigger1 = AnimElem =5
helpertype=normal
stateno=6031
ID=6034
name="HyperBG"
postype=Back
supermovetime=99999
pausemovetime=99999
ownpal=1
ignorehitpause=1
size.xscale=.6
size.yscale=.6
[State 0,LV1]
type=afterimage
trigger1=Time=5
time = 999
timegap = 1
framegap = 10
length = 30
paladd = 0, 0, 0
palmul = 0.75, 0.75, 0.75
palcontrast = 128, 128, 128
palpostbright = 0, 0, 0
trans = add1
[State 3000, 8]
type = SuperPause
trigger1 = AnimElem = 1
time = 45
movetime = 45
anim = -1
sound = s3100, 1
p2defmul = 1
darken = 0

[State 0, Explod]
type = Explod
trigger1 =animelem=3
anim = 7060
ID = 7060
pos = 0,5
postype = p1
bindtime = -1
removetime = 30
pausemovetime = 45
supermovetime = 45
scale = 1,1
sprpriority = 5
ownpal = 1
removeongethit = 1

[State 3000, flash]
type = PalFX
triggerall = var(10) = 0
trigger1 = time >= 3; && AnimElem = 3, <= 1
trigger1 = TimeMod = 4,0
trigger1 = Time > 0
time = 1
add = 100,100,100

[State 3000, 1]
type = playerpush
trigger1 = Time >= 0
value = 0

[State 3000, 2]
type = NotHitBy
trigger1 = Time = 0
value = SCA
time = 15

[State 3000, playsnd]
type = PlaySnd
trigger1 = AnimElem = 1
value = 2001,1


[State 3000, playsnd];ws‚­‚¼[IIv
type = PlaySnd
trigger1 = Time = 1
value = 2200,1


[State 3000, e]
type = ChangeState
trigger1 = time=30
value = 3101

;dash fwd
[Statedef 3101]
type    = S
movetype= A
physics = S
velset = 0,0
ctrl = 0
anim = 3101
sprpriority = 0

[State 1600, 1]
type = NotHitBy
trigger1 = Time = 0
value = SCA
time = 8

[State 1200, PlaySnd]
type = PlaySnd
trigger1 = Time = 0
value = s1300,0

[State 3005, 1]
type = PosAdd
trigger1 = Time > 2
x = 6

[State 3005, 2]
type = VelSet
trigger1 = Time = 2
x = 15

[State 3005, 3]
type = VelAdd
trigger1 = Time > 2
x = .15

[State 3005, AfterImage]
type = AfterImage
trigger1 = Time = 0
time = 20
FrameGap = 2
length = 12
PalBright   =   0,  0,  0
PalContrast = 128,128,128
PalAdd      =   0,  0,  0
PalMul      =  1,1,1
Trans = Add1


[State 3005, hit]
type = hitdef
trigger1 = AnimElem = 1
trigger2 = AnimElem = 7
attr = S, ha; SP
damage = 0,0
animtype = light
hitflag = maf
guardflag = ma
numhits = 0
sparkno = -1
guard.sparkno = s7030
sparkxy = 0,-70
hitsound = -1
guardsound = S6,0
pausetime = 0,0
ground.hittime = 15
ground.type = high
ground.slidetime = 5
ground.velocity = 0,0
air.velocity = 0,0
p2facing = 1
kill = 0
p2stateno= 3060
forcestand=1

[State 3005, 4]
type = ChangeState
;triggerall = var(10) = 0 || var(10) != 0
trigger1 = moveguarded = 1
value = 3105
ctrl=1

[State 3005, 4]
type = ChangeState
trigger1 = movehit = 1
value = 3102

[State 3005, end]
type = ChangeState
trigger1 = Animtime = 0
value = 0
ctrl=1

;---------------------------------
;kamehameha
[Statedef 3102]
type    = S
movetype= A
physics = S
velset = 0,0
ctrl = 0
anim = 3102
sprpriority = 0

[State 3020, muteki]
type = NotHitBy
trigger1 = 1
value = SCA

[State 3020, width]
type = width
trigger1 = 1
edge = 75,0

[State 3020, bind]
type = TargetBind
Trigger1 = AnimElem = 1, >= 1 && AnimElem = 8, <= 1
pos =  70,0



[state 3020, speedline2]
type = explod
trigger1 = time = 0
anim = 6100
postype = back
pos = 0,0
bindtime = -1
supermove = 1
sprpriority = -4
ontop = 0
ownpal = 1
removetime = 100
scale = 2.575, 1.075



[State 2300, 1];w—­‚ß‚é‰¹x
type = PlaySnd
trigger1 = AnimElem = 17
value = 20,0

[State 2300, 1];w—­‚ß‚é‰¹x
type = PlaySnd
trigger1 = AnimElem = 22
value = 2000,5


[State 3020, hit]
type = hitdef
trigger1 = AnimElem = 4
attr = S, HP
damage = 75,10
animtype = heavy
hitflag = MAf
snap = 70,0
sparkno = s7030+(random%8)
guard.sparkno = s7001
sparkxy = 0,-80
guardflag = MA
hitsound = S200,1
guardsound = S6,0
pausetime = 12,25
ground.hittime = 15
ground.type = low
ground.slidetime = 5
ground.velocity = 0,0
air.velocity = 0,0
envshake.time = 20
envshake.ampl = 6
kill = 0
p2facing = 1
;p2stateno= 3060



[state 1710, 1]
type = hitdef
trigger1 = animelem = 9
attr = S, HA
damage = 75, 20
animtype = heavy
guarDFlag = ma
hitflag = maf
priority = 7
pausetime = 10,15
sparkno = s7030+(random%8)
sparkxy = -50,-80
hitsound = S5,8
guardsound = s120,0
ground.type = high
ground.slidetime = 5
ground.hittime  = 30
ground.velocity = -1, -11
airguard.velocity = -1.9,-.8     
air.velocity =  -1, -11
fall = 1
fall.recover = 0                     
envshake.time = 20
envshake.freq = 70
envshake.ampl = -6
envshake.phase = 30
kill = 1

[state 2300, super a]
type = pause
trigger1 = animelem=17;time = 65
time = 95
movetime = 95
anim = -1

[State 0, EnvShake]
type = EnvShake
trigger1 = animelemtime(15)=0
time = 45
freq =40
ampl = -6
phase = 90
ignorehitpause = 1
persistent = 1

[State 2300, 1];wŒ‚‚Â‰¹x
type = PlaySnd
trigger1 = AnimElem = 24
value = 2200,4

[State 2300, 1];wŒ‚‚Â‰¹x
type = PlaySnd
trigger1 = AnimElem = 22
value = 1400,0

[State 0, Explod]
type = Explod
trigger1 =animelem=17
anim = 7060
ID = 7060
pos = 0,5
postype = p1
bindtime = -1
removetime = 150
pausemovetime = 220
supermovetime = 220
scale = 1,1
sprpriority = 5
ownpal = 1
removeongethit = 1

[State 0, Explod]
type = Explod
trigger1 =animelem=22
anim = 3030
ID = 3030
pos = -40,-50
postype = p1
bindtime = -1
removetime = 45
pausemovetime = 45
supermovetime = 45
scale = .3,.3
sprpriority = 3
ownpal = 1
removeongethit = 1

[State 0, Helper]
type = Helper
trigger1 = animelem=24
helpertype = normal ;player
name = "superkamehameha"
ID = 3155
stateno = 3155
pos = 0,0
postype = p1    ;p2,front,back,left,right
facing = 1
keyctrl = 0
ownpal = 0
supermovetime = 9999999
pausemovetime = 999999
sprpriority=9999
sprpriority=5

[State 3020, env]
type = EnvColor
trigger1 = AnimElem = 3
trigger2 = AnimElem = 8
value = 245,245,245
ignorehitpause = 1
time = 1


[State 1200, 3]
type = ChangeState
trigger1 = AnimTime = 0
value = 0
ctrl = 1


;Moveguarded 
[Statedef 3105]
type    = S
movetype= A
physics = S
ctrl = 0
anim = 3105

[State 1730, 1]
type = VelSet
trigger1 = Time = 0
x = -15
y = 0

[State 1730, 3]
type = VelAdd
trigger1 = Time > 0
x = .15

[state 1730, 2]
type = posset
trigger1 = time = 0
y = 0

[State 1730, landdust1]
type = explod
trigger1 = StateNo = 3105 && Time = 1
postype = p1
pos = -17,0
spacing = 1
anim = 7100
ownpal = 1
scale = .5, .5

[State 1730, landdust]
type = explod
trigger1 = StateNo = 3105 && Time = 1
postype = p1
pos = 20,0
facing = -1
spacing = 1
anim = 7100
ownpal = 1
scale = .5, .5

[State 1730, Landing Sound]
type = PlaySnd
trigger1 = animelem = 2
value = s8,0

[State 1730, e]
type = ChangeState
trigger1 = AnimTime = 0
value = 0
ctrl = 1

;L.3 BURST KAMEHAMEHA
;---------------------------------------------------
[Statedef 3200]
type    = S
movetype= A
physics = S
velset = 0,0
ctrl = 0
poweradd = -3000
anim = 3100
sprpriority = 0
juggle = 1

[State 3000, Black BG]
type = Explod
trigger1 = Time = 0
removetime = -1
id = 6035
anim = 6035
pos = 0,0
postype = Left
scale = 1,1
sprpriority = -99999
facing = 1
vfacing = 1
ownpal = 1
bindtime = -1
ontop = 0
ownpal = 1
supermove = 1
pausemove = 1
removeongethit = 1
ignorehitpause = 1
persistent = 1
supermovetime = 60
pausemovetime =  60
[State 0, Helper]
type = Helper
trigger1=!time
helpertype = normal ;player
name = "Super Fx"
ID = 2063
stateno = 2063
pos = 0,-60
postype = p1
facing = 1
keyctrl = 0
ownpal = 1
supermovetime = 48
[State 7500, portrait]
type=helper
trigger1=!time
helpertype=normal
stateno=7510
ID=7510
name="Super Charge Portrait"
postype=p1
supermovetime=300
ownpal=1

[State 6034, HyperBG]
type=helper
trigger1 = AnimElem =5
helpertype=normal
stateno=6031
ID=6034
name="HyperBG"
postype=Back
supermovetime=99999
pausemovetime=99999
ownpal=1
ignorehitpause=1
size.xscale=.6
size.yscale=.6
[State 0,LV1]
type=afterimage
trigger1=Time=5
time = 999
timegap = 1
framegap = 10
length = 30
paladd = 0, 0, 0
palmul = 0.75, 0.75, 0.75
palcontrast = 128, 128, 128
palpostbright = 0, 0, 0
trans = add1
[State 3000, 8]
type = SuperPause
trigger1 = AnimElem = 1
time = 45
movetime = 45
anim = -1
sound = s3100, 2
p2defmul = 1
darken = 0

[State 0, Explod]
type = Explod
trigger1 =animelem=3
anim = 7060
ID = 7060
pos = 0,5
postype = p1
bindtime = -1
removetime = 30
pausemovetime = 45
supermovetime = 45
scale = 1,1
sprpriority = 5
ownpal = 1
removeongethit = 1

[State 3000, flash]
type = PalFX
triggerall = var(10) = 0
trigger1 = time >= 3; && AnimElem = 3, <= 1
trigger1 = TimeMod = 4,0
trigger1 = Time > 0
time = 1
add = 100,100,100

[State 3000, 1]
type = playerpush
trigger1 = Time >= 0
value = 0

[State 3000, 2]
type = NotHitBy
trigger1 = Time = 0
value = SCA
time = 15

[State 3000, playsnd]
type = PlaySnd
trigger1 = AnimElem = 1
value = 2001,1


[State 3000, playsnd];ws‚­‚¼[IIv
type = PlaySnd
trigger1 = Time = 1
value = 2200,1


[State 3000, e]
type = ChangeState
trigger1 = time=30
value = 3201

;dash fwd
[Statedef 3201]
type    = S
movetype= A
physics = S
velset = 0,0
ctrl = 0
anim = 3101

[State 1600, 1]
type = NotHitBy
trigger1 = Time = 0
value = SCA
time = 8

[State 1200, PlaySnd]
type = PlaySnd
trigger1 = Time = 0
value = s1300,0

[State 3005, 1]
type = PosAdd
trigger1 = Time > 2
x = 6

[State 3005, 2]
type = VelSet
trigger1 = Time = 2
x = 15

[State 3005, 3]
type = VelAdd
trigger1 = Time > 2
x = .15

[State 3005, AfterImage]
type = AfterImage
trigger1 = Time = 0
time = 20
FrameGap = 2
length = 12
PalBright   =   0,  0,  0
PalContrast = 128,128,128
PalAdd      =   0,  0,  0
PalMul      =  1,1,1
Trans = Add1


[State 3005, hit]
type = hitdef
trigger1 = AnimElem = 1
trigger2 = AnimElem = 7
attr = S, ha; SP
damage = 0,0
animtype = light
hitflag = maf
guardflag = ma
numhits = 0
sparkno = -1
guard.sparkno = s7001
sparkxy = 0,-70
hitsound = -1
guardsound = S6,0
pausetime = 0,0
ground.hittime = 15
ground.type = high
ground.slidetime = 5
ground.velocity = 0,0
air.velocity = 0,0
p2facing = 1
kill = 0
p2stateno= 3060



[State 3005, 4]
type = ChangeState
;triggerall = var(10) = 0 || var(10) != 0
trigger1 = moveguarded = 1
value = 3105
ctrl=1

[State 3005, 4]
type = ChangeState
trigger1 = movehit = 1
value = 3202

[State 3005, end]
type = ChangeState
trigger1 = Animtime = 0
value = 0
ctrl=1

;ssj3 kamehameha
[Statedef 3202]
type    = S
movetype= A
physics = S
velset = 0,0
ctrl = 0
anim = 3202
sprpriority=1

[State 3020, muteki]
type = NotHitBy
trigger1 = 1
value = SCA

[State 3020, width]
type = width
trigger1 = 1
edge = 75,0

[State 3020, bind]
type = TargetBind
Trigger1 = AnimElem = 1, >= 1 && AnimElem = 8, <= 1
pos =  70,0


[State 2300, 1];w—­‚ß‚é‰¹x
type = PlaySnd
trigger1 = AnimElem = 17
value = 20,0

[State 2300, 1];w—­‚ß‚é‰¹x
type = PlaySnd
trigger1 = AnimElem = 22
value = 2000,5


[State 3020, hit]
type = hitdef
trigger1 = AnimElem = 3
attr = S, HP
damage = 75,10
animtype = heavy
hitflag = MAf
snap = 70,0
sparkno = s7030+(random%8)
guard.sparkno = s7001
sparkxy = 0,-80
guardflag = MA
hitsound = S2,1
guardsound = S6,0
pausetime = 12,25
ground.hittime = 15
ground.type = low
ground.slidetime = 5
ground.velocity = 0,0
air.velocity = 0,0
envshake.time = 20
envshake.ampl = 6
kill = 0
p2facing = 1
;p2stateno= 3060



[state 1710, 1]
type = hitdef
trigger1 = animelem = 8
attr = S, HA
damage = 75, 20
animtype = heavy
guarDFlag = ma
hitflag = maf
priority = 7
pausetime = 10,15
sparkno = s7030+(random%8)
sparkxy = -50,-80
hitsound = S2,3
guardsound = s2,0
ground.type = high
ground.slidetime = 5
ground.hittime  = 30
ground.velocity = -1, -11
airguard.velocity = -1.9,-.8     
air.velocity =  -1, -11
fall = 1
fall.recover = 0                     
envshake.time = 20
envshake.freq = 70
envshake.ampl = -6
envshake.phase = 30
kill = 1

[State 0, Pause]
type = Pause
trigger1 = animelem=16;!time
time = 260
movetime = 260
pausebg = 1


[State 3000, flash]
type = PalFX
triggerall = var(10) = 0
trigger1 = animelem=17; && AnimElem = 3, <= 1
;trigger1 = TimeMod = 4,0
;trigger1 = Time > 0
time = 1
add = 100,100,100


[State 2300, 1];wŒ‚‚Â‰¹x
type = PlaySnd
trigger1 = AnimElem = 27
value = s2300,3

[State 2300, 1];wŒ‚‚Â‰¹x
type = PlaySnd
trigger1 = AnimElem = 32
value = s2300,2


[State 2300, 1];wŒ‚‚Â‰¹x
type = PlaySnd
trigger1 = AnimElem = 16
value = s1,13

[State 0, EnvShake]
type = EnvShake
trigger1 = animelemtime(17)=0
time = 45
freq =40
ampl = -6
phase = 90
ignorehitpause = 1
persistent = 1

[State 0, Explod]
type = Explod
trigger1 =animelem=18
anim = 7060
ID = 7060
pos = 0,5
postype = p1
bindtime = -1
removetime = 260
pausemovetime = 999999
supermovetime = 999999
scale = 1,1
sprpriority = 5
ownpal = 1
removeongethit = 1

[State 0, Explod]
type = Explod
trigger1 =animelem=29
anim = 3030
ID = 3030
pos = -40,-50
postype = p1
bindtime = -1
removetime = 20
pausemovetime = 999999
supermovetime = 999999
scale = .3,.3
sprpriority = 5
ownpal = 1
removeongethit = 1


[State 0, Explod]
type = Explod
trigger1 =animelem=30
anim = 3030
ID = 3030
pos = -50,-50
postype = p1
bindtime = -1
removetime = 75
pausemovetime = 999999
supermovetime = 999999
scale = .3,.3
sprpriority = 5
ownpal = 1
removeongethit = 1


[State 0, Helper]
type = Helper
trigger1 = animelem=32
helpertype = normal ;player
name = "superkamehameha"
ID = 3255
stateno = 3255
pos = 0,0
postype = p1    ;p2,front,back,left,right
facing = 1
keyctrl = 0
ownpal = 0
supermovetime = 100
pausemovetime = 100
sprpriority=5

[State 3020, env]
type = EnvColor
trigger1 = AnimElem = 3
trigger2 = AnimElem = 8
value = 245,245,245
ignorehitpause = 1
time = 1


[State 1200, 3]
type = ChangeState
trigger1 = AnimTime = 0
value = 0
ctrl = 1

;UNIVERSAL SPIRIT BOMB
[Statedef 3300]
type    = S
movetype= A
physics = S
velset = 0,0
ctrl = 0
poweradd = -3000
anim = 3100
sprpriority = 0
juggle = 1

[State 3000, Black BG]
type = Explod
trigger1 = Time = 0
removetime = -1
id = 6035
anim = 6035
pos = 0,0
postype = Left
scale = 1,1
sprpriority = -99999
facing = 1
vfacing = 1
ownpal = 1
bindtime = -1
ontop = 0
ownpal = 1
supermove = 1
pausemove = 1
removeongethit = 1
ignorehitpause = 1
persistent = 1
supermovetime = 60
pausemovetime =  60
[State 0, Helper]
type = Helper
trigger1=!time
helpertype = normal ;player
name = "Super Fx"
ID = 2063
stateno = 2063
pos = 0,-60
postype = p1
facing = 1
keyctrl = 0
ownpal = 1
supermovetime = 48
[State 7500, portrait]
type=helper
trigger1=!time
helpertype=normal
stateno=7511
ID=7511
name="Super Charge Portrait"
postype=p1
supermovetime=300
ownpal=1

[State 6034, HyperBG]
type=helper
trigger1 = AnimElem =5
helpertype=normal
stateno=6031
ID=6034
name="HyperBG"
postype=Back
supermovetime=99999
pausemovetime=99999
ownpal=1
ignorehitpause=1
size.xscale=.6
size.yscale=.6
[State 0,LV1]
type=afterimage
trigger1=Time=5
time = 999
timegap = 1
framegap = 10
length = 30
paladd = 0, 0, 0
palmul = 0.75, 0.75, 0.75
palcontrast = 128, 128, 128
palpostbright = 0, 0, 0
trans = add1
[State 3000, 8]
type = SuperPause
trigger1 = AnimElem = 1
time = 45
movetime = 45
anim = -1
sound = s3100, 2
p2defmul = 1
darken = 0

[State 0, Explod]
type = Explod
trigger1 =animelem=3
anim = 7060
ID = 7060
pos = 0,5
postype = p1
bindtime = -1
removetime = 30
pausemovetime = 45
supermovetime = 45
scale = 1,1
sprpriority = 5
ownpal = 1
removeongethit = 1

[State 3000, flash]
type = PalFX
triggerall = var(10) = 0
trigger1 = time >= 3; && AnimElem = 3, <= 1
trigger1 = TimeMod = 4,0
trigger1 = Time > 0
time = 1
add = 100,100,100

[State 3000, 1]
type = playerpush
trigger1 = Time >= 0
value = 0

[State 3000, 2]
type = NotHitBy
trigger1 = Time = 0
value = SCA
time = 15

[State 3000, playsnd]
type = PlaySnd
trigger1 = AnimElem = 1
value = 2001,1


[State 3000, playsnd];ws‚­‚¼[IIv
type = PlaySnd
trigger1 = Time = 1
value = 2200,1


[State 3000, e]
type = ChangeState
trigger1 = time=30
value = 3305


;-----------------------------“Ëi
[Statedef 3305]
type = A
movetype = A
physics = N
velset = 0,0
ctrl = 0
anim = 3305

[State 3005, nothit]
type = NotHitBy
trigger1 = movehit = 1
value = SCA
ignorehitpause = 1

[State 3005, PlaySnd]
type = PlaySnd
trigger1 = Time = 0
value = 100,2

[State 3005, 1]
type = PosAdd
trigger1 = Time > 0
x = 15
[State 3005, 2]
type = VelSet
trigger1 = Time = 2
x = 8

[State 3005, 3]
type = VelAdd
trigger1 = Time > 2
x = -1.15

[State 3005, AfterImage]
type = AfterImage
trigger1 = Time = 0
time = 20
FrameGap = 2
length = 12
PalBright   =   0,  0,  0
PalContrast = 128,128,128
PalAdd      =   0,  0,  0
PalMul      =  1,1,1
Trans = Add1

[State 3050, hit1]
type = hitdef
trigger1 = AnimElem = 1
attr = A,HA
damage = 90,10
animtype = heavy
hitflag = MAf
sparkno = s7030+(random%8);-1
guard.sparkno = s7001
sparkxy = 10,-55
guardflag = MA
pausetime = 23,28
hitsound = S2,3
guardsound = S2,6
ground.hittime = 20
ground.type = high
ground.slidetime = 20
guard.velocity = -10.6
ground.velocity = -10.6,-3.5
air.velocity = -10.6,-3.5
pausetime = 20,19
guard.pausetime = 18,9
envshake.time = 25
envshake.ampl = 5
fall = 1
air.fall = 1
fall.recover = 0
kill = 0
p2stateno= 3360
p2facing = 1
getpower = 0

[State 3005, env]
type = EnvColor
trigger1 = movehit
value = 245,245,245
time = 2
ignorehitpause = 0
;persistent = 0

[State 3005, 4]
type = ChangeState
trigger1 = movehit = 1 && win = 0
value = 3310

[State 3005, end]
type = ChangeState
trigger1 = Animtime = 0
trigger2 = movehit = 1 && win = 1
trigger3 = moveguarded
value = 3105
ctrl = 0


;-----------------------’Ç‚¢“¢‚¿
[Statedef 3310]
type    = A
movetype= A
physics = S
velset = 0,0
ctrl = 0
anim = 3310

[State 3010, screen]
type = screenbound
trigger1 = 1
value = 1
movecamera = 1,0

[State 3010, nothit]
type = NotHitBy
trigger1 = AnimElem = 1, >= 1 && AnimElem = 15, <= 1
value = SCA

[state 3010, followup1]
type = hitdef
trigger1 = animelem = 12
attr = A,HA
damage = 90, 10
animtype = hard
guarDFlag = ma
hitflag = maf
pausetime = 10,15
sparkno = s7030+(random%8);-1
guard.sparkno = s7001
sparkxy = -40,-70
hitsound = s2,3
guardsound = s2,4
ground.hittime = 20
ground.type = high
ground.slidetime = 20
ground.velocity = 10.6,-6
air.velocity = 10.6,-6
fall = 1
air.fall = 1
fallrecover = 0
kill = 0
envshake.time = 20
envshake.freq = 90
envshake.ampl = -7
;p2stateno= 3060
getpower = 0

[State 3010, targetState]
type = targetState
trigger1 = MoveHit = 1
value = 3360


[State 3010, zanzou2]
type = Explod
trigger1 = animelem = 5
anim = 3350;362
ID = 3350;362
postype = p1
pos = 0,0
bindtime = 1
sprpriority = 2
ownpal = 1
removetime = 10
supermovetime = 10
facing = -1


[State 3010, 1]
type = PlaySnd
trigger1 = AnimElem = 1
value = 700,0

[state 3010, teleport]
type = bindtotarget
trigger1 = anim = 3310 && animelem = 5
time = -1
pos = -30,85,head;

[State 3010, end]
type = ChangeState
trigger1 = AnimTime = 0
value = 3315
ctrl = 0

;-----------------------’Ç‚¢“¢‚¿2
[Statedef 3315]
type    = A
movetype= A
physics = S
velset = 0,0
ctrl = 0
anim = 3315


[State 3015, muteki]
type = NotHitBy
trigger1 = 1
value = SCA

[state 3015, followup2]
type = hitdef
trigger1 = animelem = 12
attr = A,HA
damage = 90, 10
animtype = hard
guarDFlag = ma
hitflag = maf
pausetime = 12,12
sparkno = s7030+(random%8);-1
guard.sparkno = s7001
sparkxy = -20,-40
hitsound = s2,4
guardsound = s2,6
ground.hittime = 20
ground.type = high
ground.slidetime = 20
ground.velocity = -13.6,11
air.velocity = -13.6,11
fall = 1
air.fall = 1
fallrecover = 0
kill = 0
envshake.time = 20
envshake.freq = 90
envshake.ampl = -7
;fall.envshake.time = 30
;fall.envshake.freq = 70
;fall.envshake.ampl = -5
;fall.envshake.phase = 20
p2stateno= 3360
id = 3315
p2facing = 1
getpower = 0

[State 3015, zanzou]
type = Explod
trigger1 = animelem = 1
anim = 3350;362
ID = 3350;362
postype = p1
pos = -13,0
bindtime = 1
sprpriority = 2
ownpal = 1
removetime = 10
supermovetime = 10
facing = -1

[State 3015, zanzou2]
type = Explod
trigger1 = animelem = 3
anim = 3350;362
ID = 3350;362
postype = p1
pos = 0,0
bindtime = 1
sprpriority = 2
ownpal = 1
removetime = 10
supermovetime = 10

[State 3015, 1]
type = PlaySnd
trigger1 = AnimElem = 1
value = 700,0

[state 3015, teleport]
type = bindtotarget
trigger1 = anim = 3315 && animelem = 3
time = -1
pos = 60,75,head


[State 0, Pause]
type = Pause
trigger1 = animelem=20;15
time = 160
movetime = 160

[State 0, PlaySnd]
type = PlaySnd
trigger1 = animelem=17
value = S3200,34




[State 3015, zanzou]
type = Explod
trigger1 = animelem = 18
anim = 3328;3325;362
ID = 3325;362
postype = p1
pos = 0,-260
bindtime = 1
sprpriority = 2
ownpal = 1
removetime = 95
pausemovetime = 9999
supermovetime = 9999
facing = 1
scale=2,2;.3,.3



;ignorehitpause =
;trans = 
;persistent =
;supermove = 0
;pausemove = 0



[State 3015, TargetState]
type = TargetState
trigger1 = movehit && p2stateno = 5100
trigger2 = movehit && p2stateno = 5600
value = 3375
elem = 1



[State 3015, bg]
type = assertspecial
trigger1 = time = [59,150]
flag = noFG
flag2 = noBG
flag3 = nobardisplay
ignorehitpause = 1


[State 3015, end]
type = ChangeState
trigger1 = AnimTime = 0
value = 3320
ctrl = 0


;-----------------------------‚²‚Á‚Â‚¢ƒfƒXƒ{[ƒ‹
[Statedef 3320]
type = A
movetype = A
physics = S
juggle  = 1
velset = 0,0
ctrl = 0
anim = 3320
sprpriority = 3

[State 3020, muteki]
type = NotHitBy
trigger1 = 1
value = SCA

[State 0, PlaySnd]
type = PlaySnd
trigger1 = animelem=10
value = S3200,36

[State 0, PlaySnd]
type = PlaySnd
trigger1 = animelem=9
value = S1,13
[State 0, PlaySnd]
type = PlaySnd
trigger1 = animelem=10
value = S1,14

[State 0, Explod]
type = Explod
trigger1 =animelem=9
anim = 7060
ID = 7060
pos = 0,0
postype = p1
bindtime = -1
removetime = 230
pausemovetime = 999999
supermovetime = 999999
scale = 1,1
sprpriority = 5
ownpal = 1
removeongethit = 1

[State 3050, hadouken]
type=helper
trigger1= animelem=2
helpertype=normal
stateno=3325
ID=3325
name="Hadouken"
postype=p1
pos=63,-23
ownpal=1
size.xscale = .3;.5
size.yscale =.3; .7
pausemovetime = 6
supermovetime = 99999999999

[State 3020, width]
type = width
trigger1 = 1
edge = 40,0

[State 3020, bg]
type = assertspecial
trigger1 = time = [0,91]
flag = noFG
flag2 = noBG
flag3 = nobardisplay
ignorehitpause = 1



[State 3020, PlaySnd];Œ‚‚Â
type = PlaySnd
trigger1 = animelem = 24
value = 2000,1


[state 3020, Vel]
type = Velset
trigger1 = animelem = 17;8
y =4

[State 2101, snd]
type = playsnd
trigger1 = animelem = 8
value = s100,0

[State 3020, e]
type = ChangeState
trigger1 = Vel Y > 0 && Pos Y >= 0
value = 1105;3325
ctrl = 0

;-------------------’…’n
