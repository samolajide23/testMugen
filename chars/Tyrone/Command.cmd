;===================================================
[Remap]
x = x
y = y
z = z
a = a
b = b
c = c
s = s
;===================================================
[Defaults]
command.time = 25
command.buffer.time = 1 

; Supers
; Raging Fox
[Command]
name = "Raging Fox"
command = x, x, F, a, y
time = 45

;Tyinkku Tyrodoken
[Command]
name = "Tyinkku Tyrodoken"
command = ~D, DB, B, D, DB, B, a

;Dyinkku Tyrodoken
[Command]
name = "Dyinkku Tyrodoken"
command = ~D, DB, B, D, DB, B, b

; BFG
[Command]
name = "BFG"
command = ~D, DF, F, D, DF, F, c

; Rocket
[Command]
name = "Rocket"
command = ~D, DF, F, D, DF, F, y

; Plasma
[Command]
name = "Plasma"
command = ~D, DF, F, D, DF, F, x

; Specials
; Ashura Senkuu
[Command]
name = "Ashura Senkuu Forward"
command = ~F, D ,DF, c

; Ashura Senkuu
[Command]
name = "Ashura Senkuu Back"
command = ~B, D ,DB, c

; Ashura Senkuu
[Command]
name = "Ashura Senkuu Forward Strong"
command = ~F, D ,DF, x+y

; Ashura Senkuu
[Command]
name = "Ashura Senkuu Back Strong"
command = ~B, D ,DB, x+y

; TyroPin
[Command]
name = "TyroPin"
command = ~B, DB, D, c

;Tyrodoken Weak
[Command]
name = "Tyrodoken (Weak)"
command = ~F, DF, D, a

;Tyrodoken Strong
[Command]
name = "Tyrodoken (Strong)"
command = ~F, DF, D, b

;Tyuken Weak
[Command]
name = "Tyuken (Weak)"
command = ~D, DF, F, x

;Tyuken Strong
[Command]
name = "Tyuken (Strong)"
command = ~D, DF, F, y


;-| Special Motions |------------------------------------------------------
[Command]
name = "blocking"
command = $F,x
time = 3

[Command]
name = "blocking" ;Same name as above (buttons in opposite order)
command = x,$F
time = 3

[Command]
name = "upper_x"
command = ~F, D, DF, x

[Command]
name = "upper_y"
command = ~F, D, DF, y

[Command]
name = "upper_xy"
command = ~F, D, DF, x+y

[Command]
name = "QCF_x"
command = ~D, DF, F, x

[Command]
name = "QCF_y"
command = ~D, DF, F, y

[Command]
name = "QCF_xy"
command = ~D, DF, F, x+y

[Command]
name = "QCB_x"
command = ~D, DB, B, x

[Command]
name = "QCB_y"
command = ~D, DB, B, y

[Command]
name = "QCB_xy"
command = ~D, DB, B, x+y

[Command]
name = "QCF_a"
command = ~D, DF, F, a

[Command]
name = "QCF_b"
command = ~D, DF, F, b

[Command]
name = "QCF_ab"
command = ~D, DF, F, a+b

[Command]
name = "FF_ab"
command = F, F, a+b

[Command]
name = "FF_a"
command = F, F, a

[Command]
name = "FF_b"
command = F, F, b



;-| Double Tap |-----------------------------------------------------------
[Command]
name = "FF"     ;Required (do not remove)
command = F, F
time = 10

;-| 2/3 Button Combination |-----------------------------------------------
[Command]
name = "recovery";Required (do not remove)
command = x+y
time = 1

[Command]
name = "BB"     ;Required (do not remove)
command = B, B
time = 10

;-| Dir + Button |---------------------------------------------------------
[Command]
name = "down_a"
command = /$D,a
time = 1

[Command]
name = "down_b"
command = /$D,b
time = 1

;-| Hold Single Button |---------------------------------------------------------
[Command]
name = "holda"
command = /a
time = 1

[Command]
name = "holdb"
command = /b
time = 1

[Command]
name = "holdc"
command = /c
time = 1

[Command]
name = "holdx"
command = /x
time = 1

[Command]
name = "holdy"
command = /y
time = 1

[Command]
name = "holdz"
command = /z
time = 1

[Command]
name = "holdstart"
command = /s
time = 1


;-| Single Button |---------------------------------------------------------
[Command]
name = "a"
command = a
time = 1

[Command]
name = "b"
command = b
time = 1

[Command]
name = "c"
command = c
time = 1

[Command]
name = "x"
command = x
time = 1

[Command]
name = "y"
command = y
time = 1

[Command]
name = "z"
command = z
time = 1

[Command]
name = "start"
command = s
time = 1

;-| Hold Dir |--------------------------------------------------------------
[Command]
name = "holdfwd";Required (do not remove)
command = /$F
time = 1

[Command]
name = "holdback";Required (do not remove)
command = /$B
time = 1

[Command]
name = "holdup" ;Required (do not remove)
command = /$U
time = 1

[Command]
name = "holddown";Required (do not remove)
command = /$D
time = 1


[Statedef -1]

;===================== AI Code ============================================
[State -1, AI ON] 
Type = VarSet
TriggerAll = Var(59) < 1 
TriggerAll = RoundState = 2 ; the fight has started and is not over yet and
Trigger1 = AILevel > 0 ; the computer is playing the character
v = 59
value = 1 ; value of 1 will mean the AI is on
Ignorehitpause=1

[State -1, AI OFF] ; Turn the AI off when
Type = VarSet
Trigger1 = var(59) > 0 ; it is on and
Trigger1 = RoundState != 2 ; the round is not started yet or is already over
Trigger2 = !IsHelper ; OR if we are a player, but
Trigger2 = AILevel = 0 ; the computer is not in control
v = 59
value = 0 ; value of 0 will mean the AI is off. values other than 0 and 1 are not used in this example, we have only one AI mode, the normal one.
Ignorehitpause = 1

[State -1]
Type = VarSet
Trigger1 = 1
var(58) = (AILevel=1)*3+(AILevel=2)*7+(AILevel=3)*16+(AILevel=4)*30+(AILevel=5)*58+(AILevel=6)*90+ (AILevel=7)*150+(AILevel=8)*300

;Projectile Dodge 
[State -1]
type = ChangeState
value = 710
triggerall = ctrl
triggerall = statetype = S
Triggerall = var(59) > 0            
Triggerall = random < var(58)*2.0 
triggerall = enemy,NumProj >= 1 
triggerall = p2bodydist x > 30
trigger1 = InGuardDist  

;Dodge 
[State -1]
type = ChangeState
value = 105
triggerall = statetype = S
Triggerall = var(59) > 0             
triggerall = p2bodydist x <= 10
Triggerall = random < var(58)*1.0 
trigger1 = ctrl  

;Throw (Punch) 
[State -1]
type = ChangeState
value = 800
triggerall = statetype = S
Triggerall = var(59) > 0            
Triggerall = random < var(58)*2.0 
triggerAll = P2StateType != A && P2StateType != L && P2MoveType != H
triggerAll = (P2BodyDist x = [-20,20]) && P2BodyDist y = 0
trigger1 = ctrl

;Throw (Kick)
[State -1]
type = ChangeState
value = 850
triggerall = statetype = S
Triggerall = var(59) > 0            
Triggerall = random < var(58)*2.0 
triggerAll = P2StateType != A && P2StateType != L && P2MoveType != H
triggerAll = (P2BodyDist x = [-20,20]) && P2BodyDist y = 0
trigger1 = ctrl

;Run
[State -1]
type = ChangeState
value = 100
trigger1 = statetype = S
trigger1 = var(59) > 0
trigger1 = ctrl  && (StateNo != [100,106])
trigger1 = (EnemyNear, MoveType != A) && P2BodyDist x >= 160 && random < var(58)*2.0

;Defend
[State -1]
Type=Changestate
value=120
Trigger1 = Inguarddist
Trigger1 = var(59) > 0
Trigger1 = ctrl

[State -1]
Type=Assertspecial
Triggerall=StateNo!=[120,160]
Trigger1=var(59) > 0
flag=noairguard
flag2=nocrouchguard
flag3=nostandguard

;Power up
[State -1]
type = ChangeState
value = 750
trigger1 = statetype = S
trigger1 = var(59) > 0
trigger1 = random < var(58)*1.0 
trigger1 = Power < const(data.power)
trigger1 = ctrl && Power < const(data.power) && Power < PowerMax
trigger1 = !InGuardDist && P2BodyDist x >= 160

;Flight
[State -1]
type = ChangeState
value = 45
trigger1 = statetype = A
trigger1 = var(59) > 0
trigger1 = ctrl
trigger1 = P2BodyDist x >= 160 && P2BodyDist y >= 40 

;Projectile Dodge 
[State -1]
type = ChangeState
value = 700
triggerall = ctrl
triggerall = statetype != A
Triggerall = var(59) > 0            
Triggerall = random < var(58)*2.0 
triggerall = enemy,NumProj >= 1 
triggerall = p2bodydist x > 60
trigger1 = InGuardDist

;Projectile Dodge 
[State -1]
type = ChangeState
value = 715
triggerall = ctrl
triggerall = statetype != A
Triggerall = var(59) > 0            
Triggerall = random < var(58)*2.0 
triggerall = enemy,NumProj >= 1 
triggerall = p2bodydist x < 120
trigger1 = InGuardDist 

;Projectile Jump Over 
[State -1]
type = ChangeState
value = 40
triggerall = ctrl
triggerall = statetype = s
Triggerall = var(59) > 0 
Triggerall = random < var(58)*2.0 
triggerall = enemy,NumProj >= 1 
triggerall = p2bodydist x > 60
trigger1 = InGuardDist 


;======================================================================
;Ai Combo 1
[State -1]
type = ChangeState
value = 10000
triggerall = ctrl
triggerall = statetype != A 
Triggerall = var(59) > 0
triggerall = P2BodyDist x <= 50
Triggerall = random < var(58)*1.0 
trigger1 = random < 700

;Knockdown
[State -1]
type = ChangeState
value = 240
triggerall = ctrl
triggerall = statetype != A 
Triggerall = var(59) > 0
triggerall = P2BodyDist x <= 50
Triggerall = random < var(58)*1.0 
trigger1 = random < 700

;--------------------------------------------
;Plasma
[State -1]
type = ChangeState
value = 3000
triggerall = ctrl
triggerall = statetype != A 
Triggerall = var(59) > 0
Triggerall = power >= 1000
Triggerall = random < var(58)*0.25
trigger1 = roundstate = 2  
trigger1 = random < 500
trigger1 = AIlevel >= 1
trigger2 = AnimElem = 17
trigger2 = power >= 2000
trigger2 = stateno = 3010
trigger3 = AnimElem = 17
trigger3 = power >= 3000
trigger3 = stateno = 3020  
triggerall = p2bodydist x = [180,240]

;Rocket
[State -1]
type = ChangeState
value = 3010
trigger1 = ctrl
triggerall = statetype != A
Triggerall = var(59) > 0
Triggerall = power >= 2000
Triggerall = random < var(58)*0.5
trigger1 = random < 500
trigger2 = Projhit = 5
trigger2 = power >= 3000
trigger2 = stateno = 3020 
triggerall = p2bodydist x = [890,240]


;BFG
[State -1]
type = ChangeState
value = 3020
triggerall = ctrl
triggerall = statetype != A
Triggerall = var(59) > 0
Triggerall = power >= 3000
Triggerall = random < var(58)*0.75
trigger1 = random < 500 
triggerall = p2bodydist x = [120,240]

;Raging Fox
[State -1]
type = ChangeState
value = 3030
triggerall = ctrl
triggerall = statetype != A
Triggerall = var(59) > 0
Triggerall = power >= 3000
Triggerall = random < var(58)*0.75  
trigger1 = random < 500
triggerall = abs(p2bodydist x) = [190,240]

;Tyinkku Tyrodoken
[State -1]
type = ChangeState
value = 3040
trigger1 = ctrl
triggerall = statetype != A
Triggerall = var(59) > 0
Triggerall = power >= 1000
Triggerall = random < var(58)*0.25
trigger2 = ProjHit = 5
trigger2 = power >= 2000
trigger2 = stateno = 3045
trigger1 = random < 500
triggerall = abs(p2bodydist x) = [90,240]

;Dyinkku Tyrodoken
[State -1]
type = ChangeState
value = 3045
trigger1 = ctrl
triggerall = statetype != A
Triggerall = var(59) > 0
Triggerall = power >= 1000
Triggerall = random < var(58)*0.25
trigger2 = projhit = 6 
trigger2 = power >= 3000
trigger2 = stateno = 3030 
trigger1 = random < 500
triggerall = abs(p2bodydist x) = [90,240]

;--------------------------------------------
;Tyrodoken Weak
[State -1]
type = ChangeState
value = 1000
triggerall = ctrl
triggerall = statetype = S
Triggerall = var(59) > 0            
Triggerall = random < var(58)*1.0   
trigger1 = random < 500
triggerall = p2bodydist x < 50


;TyroPin
[State -1]
type = ChangeState
value = 1020
triggerall = ctrl
triggerall = statetype = S
Triggerall = var(59) > 0            
Triggerall = random < var(58)*1.0    
trigger1 = random < 500
triggerall = p2bodydist x = [120,240]


;Tyrodoken Strong
[State -1]
type = ChangeState
value = 1005
triggerall = ctrl
triggerall = statetype = S
Triggerall = var(59) > 0            
Triggerall = random < var(58)*1.0
triggerall = p2bodydist x = [50,300]   
trigger1 = random < 500        

;Tyuken (Weak)
[State -1]
type = ChangeState
value = 1010
triggerall = ctrl
triggerall = statetype = S
Triggerall = var(59) > 0            
Triggerall = random < var(58)*1.0
triggerall = p2bodydist x < 25   
trigger1 = random < 150  

;Tyuken (Strong)
[State -1]
type = ChangeState
value = 1015
triggerall = ctrl
triggerall = statetype = S
Triggerall = var(59) > 0            
Triggerall = random < var(58)*1.0
triggerall = p2bodydist x < 25   
trigger1 = random < 200  


;Ashura Senkuu
[State -1]
type = ChangeState
value = 1100
triggerall = ctrl
triggerall = statetype = S
Triggerall = var(59) > 0
triggerall = backedgedist < 25
Triggerall = random < var(58)*2.0 
trigger1 = InGuardDist 

;Ashura Senkuu
[State -1]
type = ChangeState
value = 1101
triggerall = ctrl
triggerall = statetype = S
Triggerall = var(59) > 0
triggerall = P2BodyDist x <= 30
trigger1 = InGuardDist 

;Ashura Senkuu
[State -1]
type = ChangeState
value = 1110
triggerall = ctrl
triggerall = statetype = S
Triggerall = var(59) > 0
triggerall = backedgedist < 15
trigger1 = InGuardDist 

;Ashura Senkuu
[State -1]
type = ChangeState
value = 1111
triggerall = ctrl
triggerall = statetype = S
Triggerall = var(59) > 0
triggerall = P2BodyDist x < 20
trigger1 = InGuardDist 

;---------------------------------------------
;NON AI
;---------------------------------------------------------------------------

; Raging Fox (MAX Super)
[State -1, Raging Fox]
type = ChangeState
value = 3030
triggerall = command = "Raging Fox"
triggerall = statetype = S
Triggerall = var(59) < 1
Triggerall = power >= 3000
trigger1 = ctrl
trigger2 = stateno = 200
trigger2 = movehit
trigger3 = stateno = 200
trigger3 = movehit
trigger4 = Command = "holdfwd"
trigger4 = movehit
trigger5 = stateno = 220
trigger5 = movehit
trigger6 = stateno = 210
trigger6 = movehit

; BFG (MAX Super)
[State -1, BFG]
type = ChangeState
value = 3020
Triggerall = var(59) < 1
triggerall = command = "BFG"
triggerall = statetype = S
Triggerall = power >= 3000
trigger1 = ctrl
trigger2 = stateno = 200
trigger2 = movehit
trigger3 = stateno = 410
trigger3 = movehit
trigger4 = stateno = 230
trigger4 = movehit
trigger5 = stateno = 1005
trigger5 = projHit = 1
trigger6 = stateno = 3000
trigger6 = projHit = 3
trigger7 = stateno = 3010
trigger7 = projHit = 3


; Rocket (LEVEL 2 Super)
[State -1, Rocket]
type = ChangeState
value = 3010
Triggerall = var(59) < 1
triggerall = command = "Rocket"
triggerall = statetype = S
Triggerall = power >= 2000
trigger1 = ctrl
trigger2 = stateno = 200
trigger2 = movehit
trigger3 = stateno = 410
trigger3 = movehit
trigger4 = stateno = 230
trigger4 = movehit
trigger5 = stateno = 1005
trigger5 = projHit = 1
trigger6 = stateno = 3000
trigger6 = projHit = 3

; Plasma (LEVEL 1 Super)
[State -1, Plasma]
type = ChangeState
value = 3000
Triggerall = var(59) < 1
triggerall = command = "Plasma"
triggerall = statetype = S
Triggerall = power >= 1000
trigger1 = ctrl
trigger2 = stateno = 200
trigger2 = movehit
trigger3 = stateno = 410
trigger3 = movehit
trigger4 = stateno = 230
trigger4 = movehit
trigger5 = stateno = 1000
trigger5 = MoveHit

; Tyinkku Tyrodoken (LEVEL 1 Super)
[State -1, Tyinkku Tyrodoken]
type = ChangeState
value = 3040
Triggerall = var(59) < 1
triggerall = command = "Tyinkku Tyrodoken"
triggerall = statetype = S
Triggerall = power >= 1000
trigger1 = ctrl
trigger2 = stateno = 200
trigger2 = movehit
trigger3 = stateno = 410
trigger3 = movehit
trigger4 = stateno = 230
trigger4 = movehit
trigger5 = stateno = 1000
trigger5 = moveHit

; Dyinkku Tyrodoken (LEVEL 2 Super)
[State -1, Dyinkku Tyrodoken ]
type = ChangeState
value = 3045
Triggerall = var(59) < 1
triggerall = command = "Dyinkku Tyrodoken"
triggerall = statetype = S
Triggerall = power >= 2000
trigger1 = ctrl
trigger2 = stateno = 200
trigger2 = movehit
trigger3 = stateno = 410
trigger3 = movehit
trigger4 = stateno = 230
trigger4 = movehit
trigger5 = stateno = 1005
trigger5 = projHit = 1
trigger6 = stateno = 3040
trigger6 = projHit = 3

; Ashura Senkuu (Back)
[State -1, Ashura Senkuu Back]
type = ChangeState
value = 1101
Triggerall = var(59) < 1
triggerall = command = "Ashura Senkuu Back"
triggerall = statetype = S
trigger1 = ctrl

; Ashura Senkuu (Back)
[State -1, Ashura Senkuu Forward]
type = ChangeState
value = 1100
Triggerall = var(59) < 1
triggerall = command = "Ashura Senkuu Forward"
triggerall = statetype = S
trigger1 = ctrl

; Ashura Senkuu (Back)
[State -1, Ashura Senkuu Back]
type = ChangeState
value = 1111
Triggerall = var(59) < 1
triggerall = command = "Ashura Senkuu Back Strong"
triggerall = statetype = S
trigger1 = ctrl

; Ashura Senkuu (Back)
[State -1, Ashura Senkuu Forward]
type = ChangeState
value = 1110
Triggerall = var(59) < 1
triggerall = command = "Ashura Senkuu Forward Strong"
triggerall = statetype = S
trigger1 = ctrl



; Tyuken (Strong)
[State -1, TyroPin]
type = ChangeState
value = 1020
Triggerall = var(59) < 1
triggerall = command = "TyroPin"
triggerall = statetype = S
trigger1 = ctrl


; Tyuken (Strong)
[State -1, Tyuken (Strong)]
type = ChangeState
value = 1015
Triggerall = var(59) < 1
triggerall = command = "Tyuken (Strong)"
triggerall = statetype = S
trigger1 = ctrl

; Tyuken (Weak)
[State -1, Tyuken (Weak)]
type = ChangeState
value = 1010
Triggerall = var(59) < 1
triggerall = command = "Tyuken (Weak)"
triggerall = statetype = S
trigger1 = ctrl

; Tyrodoken (Weak)
[State -1, Tyrodoken (Weak)]
type = ChangeState
value = 1000
Triggerall = var(59) < 1
triggerall = command = "Tyrodoken (Weak)"
triggerall = statetype = S
trigger1 = ctrl

; Tyrodoken (Strong)
[State -1, Tyrodoken (Strong)]
type = ChangeState
value = 1005
Triggerall = var(59) < 1
Triggerall = var(59) < 1
triggerall = command = "Tyrodoken (Strong)"
triggerall = statetype = S
trigger1 = ctrl

; Throw Punch
[State -1, Throw Punch]
type = ChangeState
value = 800
triggerall = command = "x"
triggerall = statetype = S
triggerall = ctrl
triggerall = stateno != 100
trigger1 = command = "holdfwd"
trigger1 = p2bodydist X < 10
trigger1 = (p2statetype = S) || (p2statetype = C)
trigger1 = p2movetype != H
trigger2 = command = "holdback"
trigger2 = p2bodydist X < 20
trigger2 = (p2statetype = S) || (p2statetype = C)
trigger2 = p2movetype != H

; Throw Kick
[State -1, Throw Kick]
type = ChangeState
value = 850
triggerall = command = "a"
triggerall = statetype = S
triggerall = ctrl
triggerall = stateno != 100
trigger1 = command = "holdfwd"
trigger1 = p2bodydist X < 10
trigger1 = (p2statetype = S) || (p2statetype = C)
trigger1 = p2movetype != H
trigger2 = command = "holdback"
trigger2 = p2bodydist X < 20
trigger2 = (p2statetype = S) || (p2statetype = C)
trigger2 = p2movetype != H

;===========================================================================
;---------------------------------------------------------------------------
;Run Fwd
[State -1, Run Fwd]
type = ChangeState
value = 100
Triggerall = var(59) < 1
trigger1 = command = "FF"
trigger1 = statetype = S
trigger1 = ctrl 
;---------------------------------------------------------------------------
;Run Back
[State -1, Step Back]
type = ChangeState
value = 105
Triggerall = var(59) < 1
trigger1 = command = "BB"
trigger1 = statetype = S
trigger1 = ctrl

[State -1, Power UP]
type = ChangeState
value = 750
trigger1 = var(59) < 1
trigger1 = command = "holdz"
trigger1 = power < const(data.power) && power < PowerMax && !var(20)
trigger1 = ctrl || (StateNo = [100,101])


;---------------------------------------------------------------------------
; Roll Forwards
[State -1, Roll Forwards]
type = ChangeState
value = 710
Triggerall = var(59) < 1
trigger1 = command = "holdfwd" && command = "recovery" 
trigger1 = statetype = S
trigger1 = ctrl

; Roll Backwards
[State -1, Roll Backwards]
type = ChangeState
value = 715
Triggerall = var(59) < 1
trigger1 = command = "holdback" && command = "recovery" 
trigger1 = statetype = S
trigger1 = ctrl
;---------------------------------------------------------------------------
;Dodge
[State -1, Dodge]
type = ChangeState
value = 700
Triggerall = var(59) < 1
trigger1 = command = "recovery"
trigger1 = statetype = S
trigger1 = ctrl

;===========================================================================
;---------------------------------------------------------------------------
;Stand Light Punch
[State -1, Stand Light Punch]
type = ChangeState
value = 200
Triggerall = var(59) < 1
triggerall = command = "x"
triggerall = command != "holddown"
trigger1 = statetype = S
trigger1 = ctrl
trigger2 = stateno = 200
trigger2 = time > 6
trigger5 = stateno = 3000
trigger5 = projHit = 3
;---------------------------------------------------------------------------
;Stand Strong Punch
[State -1, Stand Strong Punch]
type = ChangeState
value = 210
Triggerall = var(59) < 1
triggerall = command = "y"
triggerall = command != "holddown"
trigger1 = statetype = S
trigger1 = ctrl
trigger2 = (stateno = 200) && time > 7
trigger3 = (stateno = 220) && time > 11
;---------------------------------------------------------------------------
;Stand Light Kick
[State -1, Stand Light Kick]
type = ChangeState
value = 220
Triggerall = var(59) < 1
triggerall = command = "a"
triggerall = command != "holddown"
trigger1 = statetype = S
trigger1 = ctrl
trigger2 = (stateno = 200) && time > 7
trigger3 = (stateno = 220) && time > 11
;---------------------------------------------------------------------------
;Standing Strong Kick
[State -1, Standing Strong Kick]
type = ChangeState
value = 230
Triggerall = var(59) < 1
triggerall = command = "b"
triggerall = command != "holddown"
trigger1 = statetype = S
trigger1 = ctrl
trigger2 = (stateno = 200) && time > 7
trigger3 = (stateno = 220) && time > 11

;Hard Knockdown
[State -1, Hard Knockdown]
type = ChangeState
value = 240
Triggerall = var(59) < 1
triggerall = command = "c"
triggerall = command != "holddown"
trigger1 = statetype = S
trigger1 = ctrl

;---------------------------------------------------------------------------
;Crouching Light Punch
[State -1, Crouching Light Punch]
type = ChangeState
value = 400
Triggerall = var(59) < 1
triggerall = command = "x"
triggerall = command = "holddown"
trigger1 = statetype = C
trigger1 = ctrl

;---------------------------------------------------------------------------
;Crouching Strong Punch
[State -1, Crouching Strong Punch]
type = ChangeState
value = 410
Triggerall = var(59) < 1
triggerall = command = "y"
triggerall = command = "holddown"
trigger1 = statetype = C
trigger1 = ctrl
trigger2 = (stateno = 400) || (stateno = 430)
trigger2 = (time > 11) || (movecontact && time > 5)

;---------------------------------------------------------------------------
;Crouching Light Kick
[State -1, Crouching Light Kick]
type = ChangeState
value = 420
Triggerall = var(59) < 1
triggerall = command = "a"
triggerall = command = "holddown"
trigger1 = statetype = C
trigger1 = ctrl
trigger2 = (stateno = 400) || (stateno = 430)
trigger2 = (time > 11) || (movecontact && time > 5)


;---------------------------------------------------------------------------
;Crouching Strong Kick
[State -1, Crouching Strong Kick]
type = ChangeState
value = 430
Triggerall = var(59) < 1
triggerall = command = "b"
triggerall = command = "holddown"
trigger1 = statetype = C
trigger1 = ctrl
trigger2 = (stateno = 400) || (stateno = 430)
trigger2 = (time > 11) || (movecontact && time > 5)

;---------------------------------------------------------------------------
;Jump Light Punch
[State -1, Jump Light Punch]
type = ChangeState
value = 600
Triggerall = var(59) < 1
triggerall = command = "x"
trigger1 = statetype = A
trigger1 = ctrl
trigger2 = stateno = 600
trigger2 = statetime >= 10

;Jump Light Punch (FLIGHT)
[State -1, Jump Light Punch]
type = ChangeState
value = 601
Triggerall = var(59) < 1
triggerall = command = "x"
trigger1 = statetype = A
trigger1 = ctrl
trigger2 = stateno = 601
trigger2 = statetime >= 10

;---------------------------------------------------------------------------
;Jump Strong Punch
[State -1, Jump Strong Punch]
type = ChangeState
value = 610
Triggerall = var(59) < 1
triggerall = command = "y"
trigger1 = statetype = A
trigger1 = ctrl
trigger2 = stateno = 600 || stateno = 630 ;jump_x or jump_a
trigger2 = movecontact

;Jump Strong Punch (FLIGHT)
[State -1, Jump Strong Punch]
type = ChangeState
value = 611
Triggerall = var(59) < 1
triggerall = command = "y"
trigger1 = statetype = A
trigger1 = ctrl
trigger2 = stateno = 601 || stateno = 631 ;jump_x or jump_a
trigger2 = movecontact

;---------------------------------------------------------------------------
;Jump Light Kick
[State -1, Jump Light Kick]
type = ChangeState
value = 620
Triggerall = var(59) < 1
triggerall = command = "a"
trigger1 = statetype = A
trigger1 = ctrl

;Jump Light Kick (Flight)
[State -1, Jump Light Kick]
type = ChangeState
value = 621
Triggerall = var(59) < 1
triggerall = command = "a"
trigger1 = statetype = A
trigger1 = ctrl


;---------------------------------------------------------------------------
;Jump Strong Kick
[State -1, Jump Strong Kick]
type = ChangeState
value = 630
Triggerall = var(59) < 1
triggerall = command = "b"
trigger1 = statetype = A
trigger1 = ctrl
trigger2 = stateno = 600 || stateno = 630 ;jump_x or jump_a
trigger2 = movecontact

;Jump Strong Kick (FLIGHT)
[State -1, Jump Strong Kick]
type = ChangeState
value = 631
Triggerall = var(59) < 1
triggerall = command = "b"
trigger1 = statetype = A
trigger1 = ctrl
trigger2 = stateno = 601 || stateno = 631 ;jump_x or jump_a
trigger2 = movecontact

;---------------------------------------------------------------------------
;Taunt
[State -1, Taunt]
type = ChangeState
value = 195
Triggerall = var(59) < 1
triggerall = command = "start"
trigger1 = statetype != A
trigger1 = ctrl


