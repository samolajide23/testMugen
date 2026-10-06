# RIFT ARENA

## Character Lab — first engine milestone

A local MUGEN character importer and browser animation harness. Requires **Node.js 22+**, but no Roblox Studio, package installation, or cloud service.

```powershell
npm run import:chars
npm run dev
```

Open **http://127.0.0.1:4173/preview/index.html**. Select a character and an AIR animation, pause or step through ticks, change scale/facing, and inspect collision boxes and import warnings. Focus the canvas to use **A/D** or **left/right** for preview movement, **F** to flip, and **Space** to pause. In **Animation inspector** mode, movement uses a fixed preview speed. Select **Luau movement** to run the local core with imported movement constants and automatic state/animation changes; **S/↓** crouches and **W/↑** jumps. Blur clears held inputs. **Source combat (Coiny)** adds two-fighter original-state combat via the local Luau bridge: player 1 uses **WASD + J/K/L**, player 2 uses **arrows + Numpad 1/2/3**. Install the official Luau CLI and export the checkpoint first; see the source-combat instructions below.
The **Character keybinds & combos** panel automatically lists the selected character’s imported CMD inputs, both players’ keyboard equivalents, motion notation, timing windows, and source posture/power/cancel conditions. Expand a command for its routes and engine blockers. Support labels use exported checkpoint reports: Coiny routes can be browser-playable, Pikachu’s supported routes are currently Luau-only, and characters without reports remain unverified. Only commands with direct move routes appear; unused definitions and standalone held-direction modifiers are hidden. Posture modifiers remain in the corresponding move’s conditions. Authored moves with engine blockers remain visible with their status; the guide does not enable unsupported attacks. Browser attack-button presses use a 33 ms chord-collection window so separately delivered keyboard events such as J + K reach the engine together, rather than starting J’s normal first. Releases and motion inputs remain ordered; source command and activation rules are unchanged.

- Source character packages remain untouched under [chars](./chars).
- The [importer](./tools/mugen-import.mjs) writes a library manifest, per-character JSON, and decoded PNG sprites under `generated`. Run it again after changing source packages, then reload the browser.
- The [browser harness](./preview/index.html) previews that data at 60 simulation ticks per second. Imported CNS `[Size]` `xscale`/`yscale` apply to sprites, their axes/offsets, and collision overlays; missing or invalid scales default to 1. **View zoom** defaults to **1×** and magnifies the result independently. Characters retain their authored proportions rather than being forced to equal heights. The status panel shows their source X/Y scale. This covers static size constants, not state-driven scaling or local-coordinate normalization. AIR duration `-1` holds a frame; it does not automatically run the next character state.
- The [local server](./tools/preview-server.mjs) binds only to `127.0.0.1` and exposes only preview/generated files, not raw character packages or the rest of the workspace. Use `$env:PORT = '4174'; npm run dev` to choose another port.
- Run automated importer, ZIP upload, playback, and server tests with `npm test`.

### Add a character ZIP

Start `npm run dev`, then drop a permitted character ZIP onto the Character Lab upload area or use **Choose ZIP**. It saves a new folder under `chars`, imports the sprites/metadata into `generated`, updates the library, and selects the character automatically. No terminal import command or page reload is required. These files persist after restarting the server. Uploads go only to this PC, not to an external service or Roblox.

- One character per ZIP, either flat or inside a wrapper folder, with its DEF, SFF, AIR and supporting files. Nested asset folders are preserved. Multiple ambiguous character definitions/packages are rejected.
- Standard stored/deflated ZIP only, not password-protected, ZIP64, RAR, or 7z. Limits: **50 MiB archive**, **200 MiB expanded**, **50 MiB per expanded file**, **5,000 entries**.
- Existing source folders, generated character directories, and library IDs are **never overwritten**. A duplicate returns an error; it is not a replacement workflow.
- Extraction and conversion are staged before publication. Invalid paths, links, corrupted archives, and unsupported required assets fail without publishing a new character.
- Keep the page open while importing. Only one upload is processed at a time. Use the exact `127.0.0.1` address printed by the server; cross-origin upload requests are rejected.
- If this server was already running before the ZIP feature was added, restart it and reload the page.

ZIP ingestion is local development tooling, not a public multi-user upload service. The same importer compatibility limits below still apply.

**Preview scope:** this is an importer/animation preview, not a playable fighting engine or Roblox port. CMD/CNS/ST definitions are inspected as data, not executed. Controller lists are not promises of compatibility. A portable Luau movement prototype is available through the browser's local bridge below. A separate two-fighter combat prototype is locally tested but not connected to the browser. Sound playback, AI, multiplayer networking, Roblox uploads, and Roblox integration remain unimplemented. Unsupported import features and missing dependencies are reported rather than silently treated as supported. The converter must support a source sprite encoding before its images can be previewed.

### Import coverage and example results

The importer supports SFF1 8-bit PCX and SFF2 raw indexed/RGB/RGBA, RLE8, RLE5, LZ5, and noninterlaced PNG sprite data, including sprite/palette links. It parses DEF dependencies, AIR frames/loop starts/collision boxes, CMD command definitions, and raw CNS/ST state/controller metadata. Unsupported AIR effects are reported; they are not rendered. Duplicate animation IDs remain individually selectable for inspection, without claiming to reproduce MUGEN's duplicate resolution. Sprite group/index lookups wrap to unsigned 16-bit IDs, matching SFF storage; an explicit `-1` in either field means a blank sprite. Authored AIR IDs remain intact in JSON alongside a resolved `spriteKey` (`null` for blank frames). Missing-sprite warnings count unique unresolved keys after this conversion. Reimport existing packages and reload the page after importer updates; restart the server so subsequent ZIP uploads also use the updated importer.

- **Pikachu:** 544 decoded sprites and 158 animations. Unsigned sprite-ID resolution fixes 225 formerly unresolved references, leaving 96 unique unresolved sprite keys (101 total warnings including other limitations). Affected frames remain flagged rather than invented.
- **Tyrone:** 511 decoded sprites and 203 animations. Its referenced shared `common1.cns` is absent locally; no shared-state fallback has been implemented.

The simulation remains separate from platform rendering. The JavaScript harness previews imported assets and delegates movement to the Luau core below; Roblox integration still requires implementation and Studio testing. [IKEMEN GO](https://github.com/ikemen-engine/Ikemen-GO) and MUGEN documentation are references, not installed runtime dependencies. Reference-derived decoder logic includes IKEMEN GO attribution and its MIT notice in the importer. Character assets have their own permissions; use only assets you are authorized to reuse. No assets are uploaded to external services by these tools.

## MUGEN compatibility requirements audit

```powershell
npm run audit:compatibility
node --test tests\audit-compatibility.test.mjs tests\mugen-import.test.mjs
```

The [auditor](./tools/audit-compatibility.mjs) reads the **original selected DEF and referenced CMD/CNS/ST/AIR files**, not potentially stale imported JSON. It writes [compatibility-audit.json](./generated/compatibility-audit.json), with source hashes, command patterns/defaults/remaps, controller and parameter inventories, trigger expressions and lexical symbol candidates, source/line samples, state destinations, AIR collision-frame counts, and dependency/parse diagnostics. It does not execute character code, change source packages, decode sprites, or change the running preview. `--input` and `--output` accept existing directories; output must be outside the source tree.

Current five-package inventory (command definitions include alternatives and AI inputs; **these are not counts of playable moves**):

| Character | Command definitions | State definitions | Controller blocks | Controller type labels |
|---|---:|---:|---:|---:|
| Coiny | 116 | 25 | 121 | 16 |
| Pikachu | 33 | 93 | 581 | 44 |
| Sylveon | 93 | 134 | 805 | 58 |
| Tyrone | 55 | 145 | 883 | 47 |
| SSJB Goku | 170 | 256 | 1,960 | 75 |

Across these packages: **4,350 controller blocks, 81 parsed type labels, and 87 trigger-symbol candidates**. One type label (`l`) is unrecognized and comes from conflicting declarations, not an additional supported controller. Lexical candidates are not a complete expression grammar or proof that a feature works. Source anomalies can affect controller identity/counts. The static audit retains conservative **not executed** flags: it does not run Luau or discover runtime coverage. The movement/arena/combat prototypes still do not interpret these definitions; the separate Coiny checkpoint below validates a deliberately selected subset, not whole-character support.

### What the actual characters require

- **All five:** ordered command sequences, held/released inputs, direction wildcards, simultaneous buttons, command timing/buffering, state changes, expression evaluation, variables, animation timing, and `HitDef` behavior. Combo transitions depend on conditions such as `MoveContact`/`MoveHit`, state numbers, control flags, and variables—not a generic combo timer.
- **Coiny:** the smallest state set, but still needs projectiles and super pauses. It is a useful first end-to-end target, not already compatible.
- **Pikachu:** helpers, custom opponent animations/states, and super pauses.
- **Sylveon:** helpers, target binding/states, hit overrides, pauses, and super pauses.
- **Tyrone:** both helpers and projectiles, extensive target binding/custom states, and super pauses.
- **SSJB Goku:** the broadest controller vocabulary; helpers, redirected expressions, custom opponent states/animations, hit overrides, pauses, and super pauses.

### Findings and limits

- Fixed a parser gap discovered during this audit: labeled headers such as `[Statedef 220,Slash]` now retain the state and its controller ownership. This recovers 16 state definitions for Pikachu and one each for Sylveon and Goku. Existing preview JSON is not regenerated by the audit; reimport to refresh it, and restart the server before importing new uploads with the updated parser.
- Coiny, Tyrone, and Goku reference a locally absent `common1.cns`. This needs an engine shared-state implementation; it is not automatically a broken package. Pikachu and Sylveon include their own shared-state files.
- Goku has two section headers missing a closing bracket and a block with both `type = StateTypeSet` and `type = L`. Pikachu has commented-out headers whose uncommented entries collect into an earlier controller; Sylveon also has a repeated type declaration. These are retained as diagnostics, not silently repaired or counted as validated behavior. Exact runtime tolerance needs reference testing.
- Duplicate state IDs, including character/shared-state overrides, are retained for load-order work; they are not automatically defects. The alternate Sylveon DEF is excluded, matching the importer's directory-matching selection.
- No undefined literal command-name references were found in the expressions scanned. That does **not** prove commands are reachable or combos work. Dynamic destinations, execution order, pause behavior, collision timing, and target ownership require runtime tests.

### Implementation direction

Use the [MUGEN expression documentation](https://www.elecbyte.com/mugendocs/cns.html), [trigger reference](https://www.elecbyte.com/mugendocs/trigger.html), [controller reference](https://www.elecbyte.com/mugendocs/sctrls.html), [AIR format](https://www.elecbyte.com/mugendocs/air.html), and [IKEMEN GO](https://github.com/ikemen-engine/Ikemen-GO) as behavioral references. The labeled-header correction was checked against its [CNS compiler](https://github.com/ikemen-engine/Ikemen-GO/blob/f77a9c6d5458753b9c7a52e3970f4ce3d9b083ac/src/compiler.go#L7013). No reference engine is installed or embedded by this audit.

1. Build the Luau expression/state executor: trigger grouping, ordered controllers, special states, variables, animation clocks, state transitions, `persistent`, and `ignorehitpause`. Report unsupported syntax explicitly rather than silently substituting prototype behavior.
2. Connect CMD input history and recognition to authored state transitions; validate normals and cancels using recorded input sequences.
3. Drive collisions from AIR boxes and implement `HitDef`, hit reactions, guard, power, hitpause, and shared states.
4. Add helpers/projectiles, redirects, custom opponent-state ownership, throws/binding, pauses, and the remaining required controllers. Visual entities such as explods can be queried by gameplay logic, so ignoring their bookkeeping can break moves even before rendering matters.
5. Verify move/combination scenarios character by character against a reference runtime before claiming compatibility. Approximate presentation is acceptable; authored conditions and timings still need to work together. The audit alone cannot guarantee every move for arbitrary MUGEN packages.

## Coiny remaining-move audit

The [move audit](./generated/coiny-move-audit.json) traces **13 human attack entry points**: nine normals, two specials and two hypers. All **13 attack entry points** are exported with source-driven gameplay tests: nine standing/crouching/aerial normals, two specials and two hypers. **No human attack entry points remain unexported.** The slap hyper spans states 3010→3011→3012, so those follow-ups are not counted as separate selectable moves. Taunt, run/back-hop, round poses and AI are separate. The 116 CMD definitions are not 116 moves.

| Group | Source states | Current evidence / missing work |
| --- | --- | --- |
| Standing x/y/z | 200/210/220 | Exported; existing real hit/guard/cancel tests |
| Crouching x/y/z | 400/410/420 | Exported; real hit/guard/cancel/whiff tests, source friction and return to crouch |
| Air x/y/z | 600/610/620 | Exported, including `A, NA`; real hit/guard chains, source control restoration, gravity and landing tests |
| Roll special | 1000 | Original motions/cancels and repeated HitDefs tested in both slots/facings |
| Projectile special | 1020 | Source spawn, hit/guard/removal, provenance and air/down/juggle rules tested |
| Coin toss hyper | 3000 | Power gate/cost, SuperPause and six concurrent projectiles tested |
| Slap combo hyper | 3010/3011/3012 | Hit-only startup transition, whiff return, owner pause allowance, ten hits and finisher tested |

The [player gameplay tests](./tests/luau/coiny-gameplay.test.luau) exercise original inputs in both slots and facings. Run/back-hop use explicit host common-state fallbacks with original velocities; missing landing AIR106 uses the recorded idle fallback. Taunt, source recovery chords, knockout input lock and source victory180→181 are supported. Compiler probes now verify implemented source blocks, not obsolete blockers. The audit remains a static inventory, not proof of exact MUGEN parity.

Remaining scope: original AI, helpers, audio, projectile clashes and Roblox match wiring. Coiny visual coverage includes self-resource hyper portraits/backgrounds, selected global visual controllers and intro/win/lose states; unavailable common fightfx artwork needs explicit procedural fallbacks rather than a claim of original-art parity. Screen bounds use a 320px camera centered between fighters; stage bounds are optional. Coiny's authored projectile height bounds0,0 disable height removal as an explicit compatibility policy. Juggle uses a bounded budget (default15); unauthored hit-power defaults remain zero. No body pushing or reference-exact common1.cns/motion matching is claimed.

Source caveats: crouch/air attacks retain authored S,NA; reverse-quarter-circle commands have no move transitions. Missing helper targets9741/9742 are not invented moves. Original character files remain unchanged.

```powershell
npm run audit:coiny
node --test tests\coiny-move-audit.test.mjs
```

The [audit tool](./tools/audit-coiny-moves.mjs) rejects stale source hashes against the [checkpoint report](./generated/luau/coiny-checkpoint-report.json); regenerate that checkpoint first if sources change. The [audit tests](./tests/coiny-move-audit.test.mjs) run source-based compiler probes when the local Luau CLI is installed, remove temporary probe files and check deterministic inventory/source preservation. They verify supported source compilation separately from gameplay execution. No server is started.

## Pikachu shared-engine combat checkpoint

```powershell
npm run export:mugen-checkpoint -- pikachu
npm run test:luau
```

The exporter also accepts another source folder through `npm run export:mugen-checkpoint -- <folder-name>`; safe non-Coiny IDs use automatic capability discovery. Unsupported or malformed source features are reported or reject export, not silently substituted. Coiny's existing validated profile is preserved for regression stability.

The shared [capability discovery](./tools/source-capabilities.mjs), [checkpoint exporter](./tools/export-mugen-checkpoint.mjs) and [combat runtime](./runtime/MugenCombat.luau) discover human CMD routes and follow reachable source state/helper dependencies **without a Pikachu move list**. Supported routes include eleven normal/combo states (200/210/220, 230/240/250, 400/410/420 and 600/610), dash/backhop, and standing/crouching/air **b specials** (1000/1010/1020). Normal buttons are **x/y/a**. Shared host movement/reactions replace original common1 execution; original source files remain unchanged.

The specials spawn helper 1002 with its own source state machine, AIR collision boxes, gravity, hitpause, contact feedback and DestroySelf lifetime. Tests cover three posture inputs, both slots/facings, hit/chip/whiff, source completion and snapshot immutability. Helper contacts do not set the owner's MoveContact. Nested/key-controlled helpers, helper-versus-helper contact and custom opponent states are not implemented. The generic importer is a conservative capability filter, not proof of full MUGEN compatibility; unsupported gameplay blocks a complete route.

[Pikachu's checkpoint report](./generated/luau/pikachu-checkpoint-report.json) lists route blockers with source locations, presentation omissions, standard-animation fallbacks and duplicate parameters. Opt-in permissive parameters keep the **first occurrence**, matching permissive [Ikemen compilation](https://github.com/ikemen-engine/Ikemen-GO/blob/master/src/compiler.go); strict mode remains default. Conflicting controller types reject. Supported Explod controllers and artwork can be imported, but Pikachu's invalid lifetime/extra parameters and duplicate AIR 1001 are explicitly omitted rather than repaired. PalFX, AfterImage and audio remain deferred; HitDef palette/fall-animation hints are **unrendered metadata**.

**Not complete:** hypers 3000/4000 remain blocked by HitDefAttr, SuperPause p2defmul and foreign opponent-state requirements; no substitute hyper is invented. Air attack 620's commented-out throw headers contaminate its final controller and remain blocked. Original AI and round poses remain pending. Browser source combat is still **Coiny-only**; these Pikachu improvements are validated in Luau, not on the site.

## Source-driven MUGEN checkpoint — Coiny player gameplay

The standalone [MugenState.luau](./runtime/MugenState.luau) executor runs Coiny's **original x/y/z standing (200/210/220), crouching (400/410/420) and aerial (600/610/620) normal transitions and states**, using [MugenExpression.luau](./runtime/MugenExpression.luau) and [MugenCommands.luau](./runtime/MugenCommands.luau). [MugenHitDef.luau](./runtime/MugenHitDef.luau) evaluates the authored hit definitions; [MugenCombat.luau](./runtime/MugenCombat.luau) resolves two-fighter contacts from actual AIR boxes. This is separate from the existing movement/arena/combat prototypes. The browser's **Source combat (Coiny)** mode runs this same engine through the local [source combat bridge](./tools/source-combat-bridge.mjs), rather than JavaScript combat logic.

```powershell
npm run export:mugen-checkpoint
npm run test:luau
node --test tests\export-mugen-checkpoint.test.mjs
```

The [checkpoint exporter](./tools/export-mugen-checkpoint.mjs) reads the original Coiny files, preserving selected command definitions, ordered controller entries, state parameters, AIR frames and collision-box data. It also reads source life, attack/defence, size scales, walk/jump/air-jump velocities, gravity/friction, recovery time and local coordinates, and includes original standard movement/reaction animations. Missing optional standard actions receive an explicit cloned idle-frame fallback recorded in `animationFallbacks`; duplicate/invalid actions and missing required normal actions still reject. The fallback does not invent missing character moves. It writes [coiny-checkpoint.luau](./generated/luau/coiny-checkpoint.luau) and a [coverage/exclusion report](./generated/luau/coiny-checkpoint-report.json) with source locations and SHA-256 hashes. Originals and browser assets are untouched. No preview server is started by these commands.

### Visual source-combat preview

With the official local Luau CLI installed, run `npm run export:mugen-checkpoint`, restart `npm run dev`, and open **http://127.0.0.1:4173/preview/index.html**. Select **Coiny**, then **Mode → Source combat (Coiny)** and focus the canvas.

- Player 1: **W/A/S/D** movement, **J/K/L** → **x/y/z**, **U/I/O** → **a/b/c**, **T** taunt.
- Player 2: **arrow keys**, **Numpad 1/2/3** → **x/y/z**, **Numpad 4/5/6** → **a/b/c**, **Numpad 0** taunt.
- Roll: down → down+forward → forward + x/y/z. Toss: the same motion + a/b/c. Forward is relative to facing.
- Toss hyper: **x+y**, requiring1000 power; slap hyper: **a+b**, requiring2000. Double-tap forward/back for run/back-hop. The browser preview also continuously regenerates1000 power per simulated second for both players, capped at3000 (full in3 seconds). This training-only setting starts after the intro, continues through hitpause/SuperPause, stops at round end and does not advance while the preview is paused. Source hyper costs remain unchanged; the standalone runtime has no automatic regeneration.
- Hold down for crouching attacks; jump for aerial attacks. Hold away from the opponent to guard. Use actual contacts to test normal chains.
- Click the stage to focus keyboard controls. Returning to the stage resumes a focus-loss pause; an explicit Pause remains paused. Pause, Step and Reset operate on the source simulation. The renderer follows each fighter's exact source animation element, including hitpause and held frames; it does not advance a separate combat animation clock.

The preview bridge executes fixed-tick batches in persistent local Luau CLI workers, compiling Coiny once per worker, and returns both fighters, life, state and combat events. Workers are concurrency-limited, stop after10 seconds idle or server closure, and remove their temporary scripts. The bridge API retains disposable execution by default for standalone diagnostics; `{ persistent: true }` enables worker reuse. Signed opaque snapshots must round-trip unchanged; restarting the server requires resetting the match. Requests remain local, same-origin, bounded and concurrency-limited. No JavaScript combat fallback is used. This mode supports **Coiny versus Coiny only** and supports specials/hypers and projectile rendering, including source Explod presentation, intro/win/lose poses and global visual flags, but not audio, body pushing or Roblox integration. Projectile screen bounds are approximate; stage bounds require explicit configuration. The browser plays received snapshots individually at60 ticks/second and prefetches a bounded batch before its buffer empties, rather than displaying all six ticks together. Pause retains buffered frames, Step consumes exactly one frame, and Reset discards old frames. Initial compilation or an overloaded local machine can still stall playback; no tick skipping or faster game rules are used. The generic animation inspector and previous Luau movement mode remain available for other imports.

Browser resets play the source intro and lock both players until both intros finish. `Combat.new(program, positions?, withIntro?)` keeps immediate idle startup by default; pass `true` to enable intros. The local bridge accepts optional boolean `intro` on reset. Source lose170 follows the held KO frame; victory poses and source quote selection run after knockout. Explods retain source positions, priorities, lifetimes, binding and pause allowances. AngleDraw affects rendering only, not collisions; NoBG/NoFG/NoBarDisplay follow source effect bookkeeping. Audio is intentionally excluded.

The [visual integration tests](./tests/luau/coiny-visuals.test.luau) cover both intro variants/slots, input locking, lose pose, actual hyper artwork and pause metadata, crouch transforms and a real hyper knockout with a 160-tick finish effect and enemy quote override.

### What executes

- Standard host movement: forward/back walking, crouch entry/hold/stand, neutral/forward/back jump startup and landing, with source velocities and optional source-limited air jumps. Inputs remain facing-relative. Jump presses use edges; air-jump counters reset on landing. The host handles its standard states without replacing authored attack controllers.
- Standing/crouch/air guard eligibility, standing/crouch/air hit reactions, launch/fall/knockdown/getup and KO use explicit standard host behavior. `fall.recover` controls aerial recovery; ordinary grounded getup remains separate. These are MUGEN-like fallback mechanics, not a full original shared-state interpreter.
- Source `x`, `y`, `z` and `holddown` commands, with facing-relative inputs, button edges, remaps and tick buffers. Held down blocks standing normals; crouching routes select 400/410/420 and airborne routes select 600/610/620. The combat host preserves control during crouch entry so simultaneous down+attack is not lost.
- Ordered `triggerall` and numbered trigger groups; repeated clauses are AND, groups are OR, with group-level short circuiting. Parameters and triggers are parsed once when compiling the program.
- State entry, control flags, power additions, state/animation changes, variables, velocity/position controllers and explicit controller ordering. The executor has a limited special-state -3/-2/-1 order, `persistent=0/1`, and hitpause clock/controller handling; these are not complete MUGEN shared-state or pause semantics.
- Original AIR timing: x/y use 4,4,7 ticks; z uses 5,10. Without interruption/cancels, each reaches the authored `AnimTime=0` transition after 15 unpaused ticks and restores control in state 0. Zero-duration elements, held frames and loop boundaries have standalone tests.
- Evaluated `HitDef` damage/chip, standing guard, priority/trades, hitpause, pushback and timed host reactions. Coiny's normals deal 20 damage or 10 guarded damage, with three-tick pauses; x first becomes active at animation age 4. Damage uses `floor(damage * attack / defence)`, clamped to remaining life.
- Current-frame Clsn1 against Clsn2, using imported character scale (Coiny: 0.2), facing and position, with inclusive edges. AIR sprite offsets/flips do not transform collision boxes. One target contact per HitDef activation; state entry clears it. Both contacts are collected before applying reactions for slot-independent trades.
- Original x→y, x→z and y→z `MoveContact` conditions now receive **real hit/guard feedback**. Integration tests verify x→y→z deals 60 total damage without injected contacts, and guard contact permits x→z. Command edges pressed during hitpause remain buffered through the first resumed tick; held buttons do not auto-repeat.
- Crouching normals return to shared crouch state 11 at the authored `AnimTime=0`. Authored `C` physics uses source crouch friction (0.82), separately from stand friction (0.85); configurations omitting `crouchFriction` retain the previous standing-friction fallback.
- Air normals retain their held final AIR frame and restore control at source `Time=20`, permitting another authored attack or a source-allowed air jump (Coiny allows zero air jumps). Landing interrupts the attack, clears its active HitDef and restores grounded control through shared landing. Position integrates before gravity; both common and authored airborne physics apply gravity exactly once, including the jump-to-attack tick, and freeze under hitpause.
- [Crouch/air integration tests](./tests/luau/mugen-coiny-normals.test.luau) exercise both fighter slots, direct x→z and x→y→z on real hits/guards, whiff rejection, held inputs, power, control, landing and input-only jumps. Suitable aerial spacing/jump phases permit 75 damage across x→y→z; crouch x→y→z deals 60. Cancelling does not guarantee that a follow-up connects at arbitrary spacing. Air z preserves source `A, NA`, 35 damage, `HA` guard flags (standing/air guard, not crouch guard) and falling reaction. Falling targets use a bounded juggle budget (default15), not full reference-engine juggle rules.
- Deterministic per-fighter `Random` and immutable stepping support repeatable tests. Audio remains deferred. The browser renders hit/guard sparks from contact metadata; unavailable common fightfx sparks, SuperPause100 flash and super-finish F40 use disclosed procedural fallbacks. Original Coiny AIR3999/4050 hyper artwork is rendered from imported sprites. Air hit/guard velocities and timing, fall/recovery flags, optional reaction gravity and guard control timers are evaluated for the standard reaction host. `air.fall` is supported; omitted `fall.xvelocity` currently defaults to zero rather than MUGEN's preserve-velocity behavior.

```luau
local MugenState = require('./runtime/MugenState')
local config = require('./generated/luau/coiny-checkpoint')
local program = MugenState.compile(config)
local snapshot = MugenState.new(program)

snapshot = MugenState.step(program, snapshot, { x = true })
assert(snapshot.stateNo == 200 and snapshot.time == 0)
for _ = 1, 15 do
    snapshot = MugenState.step(program, snapshot, {})
end
assert(snapshot.stateNo == 0 and snapshot.ctrl)
```

The single-fighter API above still accepts optional fourth-argument feedback (`moveContact`, `moveHit`, `moveGuarded`, `hitPauseTicks`) for isolated state tests. Use the two-fighter host for actual combat instead:

```luau
local MugenCombat = require('./runtime/MugenCombat')
local config = require('./generated/luau/coiny-checkpoint')
local program = MugenCombat.compile({ config, config })
local snapshot = MugenCombat.new(program) -- positions -20, +20; faces inward
for tick = 1, 5 do
    snapshot = MugenCombat.step(program, snapshot, { { x = tick == 1 }, {} })
end
assert(snapshot.fighters[2].life == 980)
assert(snapshot.events[1].kind == 'hit')
```

Call `step` once per fixed 1/60-second tick; snapshots represent the evaluated tick. A fighter contains `state`, `life` and optional `reaction` clocks. Combat events include hit/guard, attacker/target slots, actual damage, original state/source location and presentation metadata. State-level events distinguish implemented `hitDef` activations from `unimplementedController` requests. Rendering can use each fighter's `state.anim` and one-based `state.animElem`. Contacts reset on state entry; hitpause freezes state/AIR/reaction clocks and pushback. Standard host reactions use unpaused hit/guard control clocks, aerial gravity, bounded landing/bounce and source `liedown.time` before getup. `fall.recover=0` disables aerial recovery only; it does not prevent grounded getup. KO uses the common KO action and cannot regain control. Common movement is enabled by `combat.common`; configurations without it retain stationary legacy movement. Inputs and previous snapshots are not mutated; compiled programs and returned definitions should be treated as read-only.

No Roblox APIs or wall-clock time are used. For Roblox, copy these six runtime modules (including [MugenCommon.luau](./runtime/MugenCommon.luau)) and generated config into ModuleScripts, replace their relative imports with sibling ModuleScript `require` calls, and provide the fixed-tick host, rendering and coordinate conversion. This module set has been tested with standalone Luau, not Roblox Studio.

### Explicit limits and next step

- **Standard common movement/reactions in 320×240 local coordinates**, not complete character compatibility. Throws, helpers, projectile clashes, collision modifiers, body pushing and many advanced hit rules remain unsupported. Projectile stage bounds are configurable; screen edges are approximate. Collisions are discrete, not swept. Default hit/guard power gains are not applied; original Statedef power additions still execute.
- Explicit **host common states** provide standard movement and reactions with source AIR animations and constants; they do not recreate or execute missing `common1.cns`. Unselected character-specific controllers/commands and AI remain excluded and listed in the report. Selected original -2/-3 visual blocks execute AngleDraw, Explod, AssertSpecial and VictoryQuote. All13 human attack routes execute; only PlaySnd remains explicitly deferred. Standard common-state behavior is host logic, not additional imported controller coverage.
- **No sound/sparks rendered.** `PlaySnd` requires explicit deferral opt-in and emits copied, unevaluated `unimplementedController` requests. HitDef audio/spark fields remain metadata only; supported air reaction fields execute in the combat host. This does not reuse the hand-tuned prototype Combat attacks.
- Expressions support a bounded arithmetic/comparison/interval/bitwise subset, command checks, variables and selected state/animation triggers. Unsupported syntax/controllers/parameters reject rather than silently acting as supported. Unknown trigger identifiers fail when evaluated, with controller source locations. Duplicate controller types and non-contiguous trigger groups are rejected conservatively rather than emulating permissive source loading.
- Motion sequences, charge counts, redirects, assignments, advanced `AnimElem` comparison suffixes and `persistent>1` are not implemented. Single-step chord timing, hitpause input buffering, basic free-motion physics and power clamping are still subset behavior, not full reference-engine fidelity. Floats use Luau double precision, not MUGEN float32; large integer arithmetic/exponent overflow is not reference-exact.
- Tests validate source preservation and the declared tick model, **not a differential replay against MUGEN/IKEMEN**. HitDef defaults follow the [Elecbyte controller reference](https://www.elecbyte.com/mugendocs/sctrls.html#hitdef); collision transform behavior was checked against [IKEMEN GO at pinned revision f77a9c6](https://github.com/ikemen-engine/Ikemen-GO/blob/f77a9c6d5458753b9c7a52e3970f4ce3d9b083ac/src/char.go). The RNG, damage rounding, reaction clocks and pause/input model are not claimed reference-exact. Full characters and every combo are not supported yet. Next: Roblox host integration and a second-character compatibility checkpoint; the browser source-combat checkpoint is available, while Roblox integration remains separate.

## Portable Luau movement — second milestone

[Movement.luau](./runtime/Movement.luau) is a deterministic, Roblox-independent simulation module. It supports idle, forward/backward walking, crouch-down/hold/up, jump startup, airborne motion, landing, grounded opponent-facing, and horizontal stage bounds. It returns animation IDs for those states, not rendered sprites. **The browser's Luau movement mode connects to this same core through the local preview server**, with the existing canvas renderer providing sprites and AIR playback.

### Setup and validation

After importing character data, install the local CLI once on Windows:

```powershell
npm run setup:luau
npm run test:luau
```

[Setup](./tools/install-luau.ps1) downloads the official [Luau 0.741 release](https://github.com/luau-lang/luau/releases/tag/0.741), verifies the Windows archive SHA-256, and saves the binaries and MIT license under `.tools/luau-0.741`. It does not change global PATH or overwrite an existing installation. Setup requires internet access; subsequent simulation/tests run locally. To use an existing official CLI installation instead, set `$env:LUAU_BIN_DIR` to its directory.

`npm run test:luau` regenerates movement configurations and the Coiny checkpoint, runs strict Luau analysis and standalone core/interpreter tests, and steps **every movement-exported character through the movement core**, including movement, crouch, jump/landing, bounds, and deterministic replay. Source-driven state tests currently cover only the selected Coiny normals. Integration smoke tests reject transition/flight budgets of 10,000 ticks or more rather than hanging on extreme character constants. `npm test` runs the Node importer/server/exporter/browser-client suites. Bridge execution tests use the local CLI when installed and otherwise report a skip.

To regenerate configurations without running Luau:

```powershell
npm run export:movement
```

[The exporter](./tools/export-movement.mjs) reads the existing imported library and writes [movement.luau](./generated/luau/movement.luau), a table keyed by character ID, and [movement-report.json](./generated/luau/movement-report.json). Source packages and imported JSON/sprites are untouched. **Run the export again after a terminal import or browser ZIP upload**; uploading does not automatically refresh Luau configurations.

### Use the Luau core in the browser

After installing the CLI, start (or **restart**) `npm run dev` and open the Character Lab at its `127.0.0.1` URL. Select **Mode → Luau movement**, then focus the canvas:

- **A/D** or **←/→**: backward/forward movement using that character's constants.
- **S** or **↓**: crouch. **W** or **↑**: jump; holding does not repeat it.
- **Space** or **Pause**: pause. **Step tick** advances one actual Luau simulation tick while paused.
- **Reset**: restart at center, grounded and facing right. Manual animation selection and facing flips are disabled in Luau mode; switch back to **Animation inspector** to inspect arbitrary actions.

The readout shows the Luau state, tick, position, action, and sprite. Source sprite scale remains independent of physics; view zoom magnifies both displacement and artwork. The single-fighter stage bounds are X=-200..200 source units, ground Y=0. Large zoom levels can crop the stage. There is no simulated opponent or automatic turn target in this browser adapter.

[The browser client](./preview/movement.mjs) sends input and the last accepted snapshot to [the bridge](./tools/movement-bridge.mjs). It executes the real [Movement module](./runtime/Movement.luau) in the official local CLI, not JavaScript movement rules. Requests batch at most six fixed ticks, with one request in flight per page and bounded catch-up. Slow machines may display stepped motion or slower simulation; this diagnostic bridge is not production networking or an authoritative game server.

Pause, reset, switching modes/characters, and lost focus discard obsolete requests. Hidden tabs stop advancing. A short jump press is retained until the next input batch. The server accepts only protected same-origin local JSON requests, limits concurrent workers, and cleans up temporary scripts. No character-authored code is executed. Missing CLI or bridge errors pause simulation visibly rather than silently substituting JavaScript physics.

Movement settings are read directly from the selected imported JSON, so newly uploaded characters work here without manually regenerating the standalone Luau export. Export notices appear separately from import warnings. This still uses the prototype rules/defaults below, not full authored MUGEN state logic.

### Core API and tick rules

Example for a standalone Luau script placed at the project root:

```luau
local Movement = require("./runtime/Movement")
local configs = require("./generated/luau/movement") :: { [string]: Movement.Config }
local config = configs.pikachu
local fighter = Movement.new(config, 0, 1)
fighter = Movement.step(config, fighter, { right = true }, {
    minX = -160, maxX = 160, opponentX = 80,
})
print(fighter.state, fighter.x, fighter.animation)
```

- `new(config, x?, facing?)` starts grounded and idle at tick zero. Defaults: X=0, facing=1. Facing must be 1 or -1.
- `step(config, snapshot, input, world?)` returns a **new snapshot** without mutating its arguments. Call once per **1/60-second simulation tick**, not once per arbitrary render frame. The host must supply fixed ticks; there is no internal clock or `dt`.
- Input fields `left`, `right`, `down`, `jump` are optional booleans. Horizontal input is world-relative; opposing keys cancel. Forward/backward speed depends on facing. Down takes priority over jump.
- Jump requires a new press. Holding jump does not repeat it; presses while unavailable are not buffered. Facing and jump direction lock through startup and flight. There is no air steering or double jump.
- Coordinates use **negative Y upward**, ground Y=0. Air integration is `x += vx; y += vy; vy += gravity`. Ground crossing clamps Y to zero. Walking stops immediately on release; crouch and landing are stationary.
- Optional world fields are `minX`, `maxX`, and `opponentX`. Bounds clamp position, not velocity. Opponent-facing updates on the ground except during jump startup; equal X preserves facing.
- A timed state's entry counts as tick 1; it stays for its configured duration, then advances on the next step. Snapshot fields include `tick`, `state`, `stateTicks`, `x`, `y`, `vx`, `vy`, `facing`, `animation`, `jumpHeld`, and `jumpDirection`.

### What is imported versus approximated

Walk speeds, jump vectors, and gravity come from numeric CNS `[Velocity]` / `[Movement]` constants. A directional jump containing only X inherits neutral jump Y. Sprite `xscale`/`yscale` do **not** multiply physics values. Numbers are parsed without executing expressions; missing/invalid values use explicit prototype defaults with report notices: walking 2.4/-2.2, neutral jump 0/-8.4, directional jump X 2.5/-2.55, gravity 0.44.

Movement animation IDs are conventional MUGEN actions: idle 0, crouch 10/11/12, walk 20/21, jump 40/41/42/43, landing 47. Missing/empty actions remain absent (`animation = nil`). For duplicated movement IDs, the **first authored definition** is selected, even if empty, with a notice. Unresolved movement sprites are reported, not repaired.

Startup/transition times use the sum of one AIR pass for actions 10, 12, 40, and 47. Missing, held (`-1`), invalid, or all-zero durations fall back to one tick with a notice. This is **prototype timing**, not execution of authored state controllers or AIR loop logic. Custom character logic can produce different behavior in MUGEN. Importer warnings about unimplemented controllers and missing shared states remain valid.

Still excluded from the single-fighter movement core: running, friction/inertia, turn animations, air jumps, authored state/command evaluation, collision resolution, combat, animation-frame playback in Luau, rendering, audio, and networking. The arena module below adds two-body horizontal collision resolution without changing that movement API. Units are still character-local coordinates; cross-`localcoord` normalization and conversion to Roblox studs are not implemented.

### Two-fighter simulation core

[Arena.luau](./runtime/Arena.luau) composes two instances of the existing movement core into a pure, fixed-60-Hz simulation. It is **locally tested only, not connected to the browser bridge yet**. No server is needed to run its tests:

```powershell
npm run test:luau
```

Example for a standalone script at the project root:

```luau
local Arena = require("./runtime/Arena")
local Movement = require("./runtime/Movement")
local characters = require("./generated/luau/movement") :: { [string]: Movement.Config }
local config: Arena.Config = {
    minX = -200,
    maxX = 200,
    first = {
        movement = characters.pikachu,
        startX = -60,
        body = { halfWidth = 12, height = 48 },
    },
    second = {
        movement = characters.tyrone,
        startX = 60,
        body = { halfWidth = 12, height = 48 },
    },
}
local match = Arena.new(config)
match = Arena.step(config, match, {
    first = { right = true },
    second = { left = true },
})
print(match.tick, match.first.x, match.second.x)
```

`Arena.new(config)` validates the stage, movement settings, positive body dimensions, and non-overlapping starting positions. The entire starting bodies must fit inside the stage, which must be wide enough to fit both bodies side by side. Fighters initially face each other. `Arena.step(config, snapshot, input)` returns a new match snapshot containing `tick`, `first`, and `second`; each fighter retains all fields of a movement snapshot. Both input tables are required, but may be empty. The simulation does not mutate configs, inputs, or previous snapshots and has no shared match state. Keep a match's config stable between ticks.

**Body collision contract:**

- Each body is a fixed upright rectangle from `x - halfWidth` to `x + halfWidth`, and from `y - height` to its feet at `y`. Dimensions are explicit prototype settings in source units, **not automatically derived from sprites, CNS sizes, or AIR hurtboxes**. The example dimensions above are placeholders, not character-accurate geometry.
- Both movement updates read the **same previous snapshot**. Grounded facing observes the opponent's previous X, so a cross-over is reflected on the next eligible tick. Jump startup/airborne facing remains locked; landing follows the existing movement-core timing.
- Full bodies, not just their origins, stay inside stage bounds. Horizontal overlap correction is shared equally; at a wall the remaining correction moves the other fighter. A moving fighter can push a stationary fighter.
- Swept rectangle overlap checks the path between ticks, preventing fast horizontal tunneling. Vertically clear jump-overs are allowed. During contact, previous left/right order is preserved; exactly equal previous centers use the first fighter as the left-side tie-breaker.
- Separation changes **X only**, preserving intended movement velocities and state timing. Bodies do not become platforms; there is no standing on an opponent, vertical collision response, momentum transfer, or physical mass. Edge-only contact is not overlap. Floating-point separation may differ by machine epsilon at a wall.
- Crouching currently uses the same fixed body rectangle. State-specific body sizes, local-coordinate normalization, camera/rendering, attacks, hitboxes, damage, hitstun, and multiplayer authority are not part of this milestone.

Tests cover movement/facing in both slot orders, symmetric contact, pushing, both walls, unequal and fractional geometry, tunneling, jump-over clearance, aerial contact/descent, crouching, invalid inputs, frozen arguments, independent matches, deterministic replay, and every currently exported character configuration.

### Prototype grounded attack core

[Combat.luau](./runtime/Combat.luau) composes the arena with **one explicitly configured grounded attack per fighter**. It adds startup, active frames, recovery, health, hitstun, zero-health handling, and per-tick hit events. This is a locally tested engine module, **not connected to browser controls and not an interpreter for imported MUGEN attacks**. The importer and character files are unchanged.

Using the arena `config` from the previous example:

```luau
local Combat = require("./runtime/Combat")
local function combatSettings(): Combat.FighterConfig
    return {
        maxHealth = 100,
        attack = {
            startupTicks = 4, activeTicks = 3, recoveryTicks = 10,
            damage = 20, hitstunTicks = 12,
            hitbox = { left = 8, right = 40, top = -40, bottom = -8 },
        },
    }
end
local combatConfig: Combat.Config = {
    arena = config,
    first = combatSettings(),
    second = combatSettings(),
}
local fight = Combat.new(combatConfig)
fight = Combat.step(combatConfig, fight, {
    first = { attack = true },
    second = {},
})
print(fight.first.state, fight.second.health)
```

These values are prototype tuning, not authored character attacks. Use the same **60-Hz fixed-tick host** as movement. `Combat.new` initializes health and the arena; `Combat.step` returns a new immutable-by-convention snapshot without modifying its arguments. The snapshot contains:

- `tick` and `arena`: the match tick and complete underlying arena/movement snapshots.
- `first` / `second`: combat `state`, `stateTicks`, `health`, `attackHeld`, `hitConnected`, `attackFacing`, received `hitstunTicks`, and optional display `animation`.
- `events`: hits from **this tick only**, with `type = "hit"`, attacker/defender slot names, actual damage applied, and defender's remaining health. Consume once per simulated tick; replaying ticks deterministically regenerates events.

**Attack and hit rules:**

- Add optional boolean `attack` alongside the existing movement inputs. A **new press** starts an attack only when combat is `ready` and movement is grounded `idle` or `walk`. Holding does not repeat attacks. Presses while unavailable are consumed, not queued. Crouching, jumping, startup, landing, and hitstun do not allow new attacks.
- From eligible idle/walk, attack takes priority over simultaneous movement, crouch, or jump input. Startup, active, and recovery suppress movement controls and lock facing for the whole attack. Physical jump edges are still consumed, preventing a held jump from being buffered through recovery/hitstun. Body pushes can still displace an attacking fighter.
- Every duration is a positive integer. Entry is **tick 1** and transition occurs after the configured number of snapshots. With startup 4, ticks 1–4 are startup and the first active tick is tick 5. There is no hit detection during startup or recovery. A press exactly when recovery/hitstun expires may start a new attack if otherwise eligible.
- The hitbox is relative to the attacker's feet, authored facing right, with negative Y upward. X is mirrored when facing left. Each active tick checks it against the opponent's fixed arena body **after movement/body separation**. Edge-only contact misses. Each activation can hit once; a whiff may connect on a later active tick.
- Both contacts are computed before either is applied: simultaneous attacks can trade, including simultaneous defeat. Event order is first-slot hit then second-slot hit, without giving first-slot priority over contact eligibility.
- A hit reduces health (clamped to zero), interrupts the defender's attack, and applies the **incoming attack's** hitstun duration. A grounded hit cancels movement/jump startup. Airborne targets retain their current jump momentum and gravity, but cannot steer or act during hitstun. There is no knockback or hitstop yet.
- Health zero enters `defeated`; further damage and player actions are disabled. Airborne defeated fighters still fall, and their bodies remain in collision. No winner selection, round reset, respawn, or removal is automatic; create a new combat snapshot to reset the match.
- Optional `attack.animation`, `hitAnimation`, and `defeatAnimation` select display actions; omitted IDs remain `nil` rather than inventing supported artwork. While `ready`, the display action comes from movement. Render combat's `animation` with the arena position/facing—not just the underlying movement animation. Combat does not advance AIR frames or validate that supplied action IDs exist.

All health, damage, geometry, timings, and optional animation selections must be supplied explicitly. This milestone does **not** extract HitDef controllers, use AIR attack/hurt boxes, evaluate commands/triggers, implement blocking, combos/cancels, throws, invulnerability, projectiles, swept attack collision, or networking. Collision is discrete per active tick; sufficiently fast targets can cross a strike between samples even though arena body collision separately prevents body tunneling.

Run `npm run test:luau` for strict analysis and the movement/arena/combat suites. Combat tests cover exact timing, both facings, range/edge misses, delayed active hits, single-hit limits, incoming hitstun timing, trades/interruptions, movement suppression, input edges, airborne behavior, zero-health handling, optional animations, frozen arguments, and deterministic replay with every exported movement configuration. No preview server is started.

### Reuse in Roblox

The movement, arena, and combat cores can become Roblox **ModuleScripts**, and the exported data can become another ModuleScript. Roblox uses instance-based `require(...)` rather than the CLI's filesystem paths. In the arena/combat modules, replace `require("./Movement")` with `require(script.Parent.Movement)` and `require("./Arena")` with `require(script.Parent.Arena)` when the ModuleScripts are siblings; adapt the host's imports similarly. No gameplay rewrite should be needed for this supported subset. A Roblox adapter must provide fixed-tick inputs/world bounds and render returned positions/animation IDs. Studio validation, asset publishing, coordinate conversion, and multiplayer authority remain separate work. Local CLI success is not a claim of a completed or Studio-tested Roblox game.

## 15 visual directions

Open [index.html](./index.html) in a browser for the visual gallery and interactive side-by-side comparison. Or open any template below directly. No installation, server, network access, external artwork, frameworks, or backend is required.

Every template is a complete independent HTML file, with inline CSS, JavaScript and original placeholder artwork. Colours are configurable through CSS custom properties. Player statistics, currencies, fighter ownership, messages and social activity are mock data.

## Concepts

1. **Classic Platformer Map** — A bright illustrated adventure world with side-view settlements, scenic hills and a small walking player. [Complete HTML](./templates/01-classic-platformer.html)
2. **Dark Anime Fighting Game** — A sharp competitive world with midnight tones, dramatic silhouettes and red-violet energy. [Complete HTML](./templates/02-dark-anime.html)
3. **Futuristic Rift** — A dimensional hologram with cyan grids, portals and floating instrumentation. [Complete HTML](./templates/03-futuristic-rift.html)
4. **Pixel / Retro Arcade** — A chunky pixel overworld with arcade colours and CRT-inspired character. [Complete HTML](./templates/04-pixel-arcade.html)
5. **Premium AAA Game** — A cinematic landscape with sophisticated, restrained interface treatment. [Complete HTML](./templates/05-premium-aaa.html)
6. **Comic Book** — A halftone, thick-ink world with dynamic composition and explosive graphics. [Complete HTML](./templates/06-comic-book.html)
7. **Manga / Anime** — Original dramatic ink, speed lines and energy-driven world composition. [Complete HTML](./templates/07-manga-anime.html)
8. **Fantasy Rift World** — Magical floating islands, ancient ruins, crystals and atmospheric discovery. [Complete HTML](./templates/08-fantasy-rift.html)
9. **Street / Urban Fighting** — A neon-lit urban world of rooftops, underground clubs and street markets. [Complete HTML](./templates/09-street-urban.html)
10. **Collector’s World** — A collector universe with rarity, ownership, duplicate and discovery cues. [Complete HTML](./templates/10-collectors-world.html)
11. **Board Game** — A tactile tabletop street with miniature buildings and a walking token. [Complete HTML](./templates/11-board-game.html)
12. **Minimal Modern** — A highly edited monochrome side-view district with one strong accent. [Complete HTML](./templates/12-minimal-modern.html)
13. **Chaotic Multiverse** — Colliding environments, broken islands, dimensional storms and glowing faults. [Complete HTML](./templates/13-chaotic-multiverse.html)
14. **Social Hub** — A welcoming multiplayer plaza with mock avatars, merchants and activity routes. [Complete HTML](./templates/14-social-hub.html)
15. **Original Rift Arena Signature** — An original recognisable dimensional street balancing competition, collection and mystery. [Complete HTML](./templates/15-rift-signature.html)

## Side-view movement

All 15 templates use the same physical rule: a small character walks only left and right on one continuous ground plane. A following camera reveals rooms along a horizontal street. There is no jumping, free 2D movement or overhead map.

## Interaction

- Hold **← / →** or **A / D** to walk left and right.
- Press **↑** beside a doorway to enter that lobby. Entry is proximity-gated.
- Touch users can hold the **← / →** buttons and tap **↑**.
- Click a visible doorway to walk toward it; entering still requires reaching the door.
- Choose **Back to the street** or Escape to leave a mock lobby.
- Settings pause movement; blur, tab changes and modal opening clear held controls.
- Context and the entry prompt follow the physically nearby room, not a hovered distant location.
- Reduced motion disables decorative animation without disabling walking or camera following.
- Resize the browser to compare desktop and mobile composition.

These are art-direction prototypes, not Roblox scripts. Matchmaking, purchases, trading, notifications and player population are demonstrations only. All fighter artwork is original abstract placeholder art, not licensed crossover characters.
