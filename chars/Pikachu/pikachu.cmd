[Command]
name = "CPU1"
command = U, D, B, F, a, b, c
time = 1

[Command]
name = "CPU2"
command = D, D, B, F, c, b, c
time = 1

[Command]
name = "CPU3"
command = U, D, F, B, a, b, c
time = 1

[Command]
name = "CPU4"
command = U, F, D, F, a, b, c
time = 1

[Command]
name = "CPU5"
command = F, D, F, U, a, b, c
time = 1

[Command]
name = "CPU6"
command = B, D, U, B, a, b, c
time = 1

[Command]
name = "CPU7"
command = F, D, F, F, a, b, c
time = 1

[Command]
name = "CPU8"
command = B, D, U, F, a, b, c
time = 1

[Command]
name = "CPU9"
command = B, D, B, B, a, b, c
time = 1

[Command]
name = "CPU10"
command = U, U, B, U, a, b, c
time = 1

[Command]
name = "CPU11"
command = D, F, B, D, a, b, c
time = 1

[Command]
name = "CPU12"
command = U, F, U, F, a, b, c
time = 1

[Command]
name = "CPU13"
command = U, B, F, B, a, b, c
time = 1

[Command]
name = "CPU14"
command = D, B, F, F, a, b, c
time = 1

[Command]
name = "CPU15"
command = U, F, U, F, a, b, c
time = 1
;=========================================================================

[Remap]
x = x
y = y
z = z
a = a
b = b
c = c
s = s
;-| Super Motions |--------------------------------------------------------
;The following two have the same name, but different motion.
;Either one will be detected by a "command = TripleKFPalm" trigger.
;Time is set to 20 (instead of default of 15) to make the move
;easier to do.
;
[Command]
name = "BusterBlaster"
command = ~D, DF, F, x+y
time = 10

[Command]
name = "RockSquad"
command = ~D, DB, B, x+y
time = 10
;-| Special Motions |------------------------------------------------------
;[Command]
;name = "slash"
;command = ~a
;time = 1

;[Command]
;name = "blam"
;command = ~b
;time = 1

;[Command]
;name = "FF_a"
;command = F, F, a

;[Command]
;name = "FF_b"
;command = F, F, b

;-| Double Tap |-----------------------------------------------------------
[Command]
name = "FF"     ;Required (do not remove)
command = F, F
time = 10

[Command]
name = "BB"     ;Required (do not remove)
command = B, B
time = 10

;-| 2/3 Button Combination |-----------------------------------------------
[Command]
name = "recovery";Required (do not remove)
command = x+y
time = 1

;-| Dir + Button |---------------------------------------------------------
[Command]
name = "down_a"
command = /$D,a
time = 1

[Command]
name = "down_b"
command = /$D,b
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

;[Command]
;name = "charge";Required (do not remove)
;command = /$a
;time = 1

;[Command]
;name = "charge1";Required (do not remove)
;command = /$b
;time = 1

;---------------------------------------------------------------------------
;STATE -1
;===========================================================================
[Statedef -1]

[State -1, Activate AI]
type = VarSet
trigger1 = command = "CPU1"

v = 59
value = 1

[State -1,cpu display]
type = DisplayToClipboard ; Pone el nombre en el debug
trigger1 = var(59)=1 ; Condición para que ponga el texto
text = "Bunny A.I. Activated" ; Nombre del texto

;============================================================================

;===========================================================================
;This is not a move, but it sets up var(1) to be 1 if conditions are right
;for a combo into a special move (used below).
;Since a lot of special moves rely on the same conditions, this reduces
;redundant logic.
[State -1, Combo condition Reset]
type = VarSet
value = 100
trigger1 = 1
var(1) = 0
;Combo condition Check
[State -1, Combo condition Check]
type = VarSet
value = 100
trigger1 = statetype != A
trigger1 = ctrl
trigger2 = (stateno = [200,299]) || (stateno = [400,499])
trigger2 = stateno != 440 ;Except for sweep kick
trigger2 = movecontact
var(1) = 1
;============================================================================
[State -1, Rock Squad]
type = ChangeState
value = 3000
triggerall = command = "RockSquad"
triggerall = power >= 1000
triggerall = statetype != A
trigger1 = ctrl
trigger2 = hitdefattr = SC, NA, SA, HA
trigger2 = stateno != [3000,3100]
trigger2 = movecontact
;---------------------------------------------------------------------------
[State -1, Buster Blaster]
type = ChangeState
value = 4000
triggerall = command = "BusterBlaster"
triggerall = power >= 1000
triggerall = statetype != A
trigger1 = ctrl
trigger2 = hitdefattr = SC, NA, SA, HA
trigger2 = stateno != [3001,3100]
trigger2 = movecontact
trigger3 = (stateno = 220) || (stateno = 420)
trigger3 = time>=16
;---------------------------------------------------------------------------
;Run Fwd
[State -1, Run Fwd]
type = ChangeState
value = 100
trigger1 = command = "FF"
trigger1 = statetype = S
trigger1 = ctrl
;---------------------------------------------------------------------------
;Run Back
;Œã‘Þƒ_ƒbƒVƒ…
[State -1, Run Back]
type = ChangeState
value = 105
trigger1 = command = "BB"
trigger1 = statetype = S
trigger1 = ctrl
;---------------------------------------------------------------------------
;[State -1,Throw]
;type = ChangeState
;value = 800
;triggerall = command = "z"
;triggerall = statetype = S
;triggerall = ctrl
;triggerall = stateno != 100
;trigger1 = command = "holdfwd"
;trigger1 = p2bodydist X < 3
;trigger1 = (p2statetype = S) || (p2statetype = C)
;trigger1 = p2movetype != H
;trigger2 = command = "holdback"
;trigger2 = p2bodydist X < 5
;trigger2 = (p2statetype = S) || (p2statetype = C)
;trigger2 = p2movetype != H
;===========================================================================
;---------------------------------------------------------------------------
;Punch 1
[State -1, Punch 1]
type = ChangeState
value = 200
triggerall = command = "x"
triggerall = command != "holddown"
trigger1 = statetype = S
trigger1 = ctrl

;Punch 2
[State -1, Punch 2]
type = ChangeState
value = 230
triggerall = command = "x"
triggerall = command != "holddown" && p2bodydist x<= 20
trigger1 = stateno = 200
trigger1 = movecontact && time >= 6
trigger1 = statetype = S

;Punch 2
[State -1, Punch 3]
type = ChangeState
value = 240
triggerall = command = "x"
triggerall = command != "holddown" && p2bodydist x<= 20
trigger1 = (stateno = 230)
trigger1 = movecontact  && time >= 6

;Punch 3
[State -1, Punch 3]
type = ChangeState
value = 210
triggerall = command = "y"
triggerall = command != "holddown"
trigger1 = statetype = S
trigger1 = ctrl
trigger2 = (stateno = 200) || (stateno = 230) || (stateno = 240)
trigger2 = movecontact

;Punch 2
[State -1, Punch 3]
type = ChangeState
value = 250
triggerall = command = "y"
triggerall = command != "holddown" && p2bodydist x<= 20
trigger1 = stateno = 210
trigger1 = movecontact  && time >= 6
trigger2 = stateno = 240
trigger2 = movecontact  && time >= 6
;---------------------------------------------------------------------------
;Slash
[State -1, Slash]
type = ChangeState
value = 220
triggerall = command = "a"
triggerall = command != "holddown"
trigger1 = statetype = S
trigger1 = ctrl
trigger2 = stateno = 200
trigger2 = movecontact
trigger3 = stateno = 230
trigger3 = movecontact
trigger4 = stateno = 240
trigger4 = movecontact
trigger5 = stateno = 210
trigger5 = movecontact
trigger6 = stateno = 220
trigger6 = movecontact && time >= 50
trigger7 = stateno = 250
trigger7 = movecontact
;---------------------------------------------------------------------------
;---------------------------------------------------------------------------
;Taunt
[State -1, Taunt]
type = ChangeState
value = 195
triggerall = command = "start"
triggerall = command != "holddown"
triggerall = statetype != A
triggerall = ctrl
trigger1 = ctrl
trigger2 = var(1)
;--------------------------------------------------------------------------

;[State -1,charge]
;type = ChangeState
;value = 888
;triggerall = ctrl = 1
;trigger1 = command = "charge"
;trigger1 = command = "charge1"
;trigger1 = statetype = S
;---------------------------------------------------------------------------
;Crouching Light Punch
[State -1, Crouching Light Punch]
type = ChangeState
value = 400
triggerall = command = "x"
triggerall = command = "holddown"
trigger1 = statetype = C
trigger1 = ctrl
trigger2 = (stateno = 220) || (stateno = 420)
trigger2 = time >= 20

;---------------------------------------------------------------------------
;Crouching Strong Punch
[State -1, Crouching Strong Punch]
type = ChangeState
value = 410
triggerall = command = "y"
triggerall = command = "holddown"
trigger1 = statetype = C
trigger1 = ctrl
trigger2 = (stateno = 400) || (stateno = 200)
trigger2 = (time > 10) || (time > 8)
;---------------------------------------------------------------------------
;Slide
[State -1, Slide]
type = ChangeState
value = 420
triggerall = command = "a"
trigger1 = statetype = C
trigger1 = ctrl

;---------------------------------------------------------------------------
;Jump Light Punch
[State -1, Jump Light Punch]
type = ChangeState
value = 600
triggerall = command = "x"
trigger1 = statetype = A
trigger1 = ctrl
trigger2 = (stateno = 600)
trigger2 = (time >= 16)
trigger3 = stateno = 1350 ;Air blocking
;---------------------------------------------------------------------------
;Jump Strong Punch
[State -1, Jump Strong Punch]
type = ChangeState
value = 610
triggerall = command = "y"
trigger1 = statetype = A
trigger1 = ctrl
trigger2 = stateno = 600
trigger2 = movecontact && time > 8
trigger3 = stateno = 1350 ;Air blocking
trigger4 = stateno = 610
trigger4 = time > 16
;---------------------------------------------------------------------------
;Air Slash
[State -1, Air Slash]
type = ChangeState
value = 620
triggerall = command = "a"
trigger1 = statetype = A
trigger1 = ctrl
trigger2 = stateno = 600
trigger2 = time > 6
trigger3 = stateno = 610
trigger3 = time > 6
;---------------------------------------------------------------------------
;Buster stand
[State -1, Buster stand]
type = ChangeState
value = 1000
triggerall = command = "b"
triggerall = statetype != A
triggerall = ctrl = 1
trigger1 = statetype = S

;---------------------------------------------------------------------------
;Buster Crouch
[State -1, Buster Crouch]
type = ChangeState
value = 1010
triggerall = command = "b"
triggerall = statetype = C
trigger1 = ctrl
trigger2 = stateno = 1010
trigger2 = statetime >= 12
;---------------------------------------------------------------------------
;Buster Air
[State -1, Buster Air]
type = ChangeState
value = 1020
triggerall = command = "b"
trigger1 = statetype = A
trigger1 = ctrl
trigger2 = stateno = 1020
trigger2 = statetime >= 12

