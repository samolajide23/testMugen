import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCharacter, commandFeatures } from './audit-compatibility.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const MOVES = [
  ['stand-x', 'Standing x', 'normal', 'x', [200], []],
  ['stand-y', 'Standing y', 'normal', 'y', [210], []],
  ['stand-z', 'Standing z', 'normal', 'z', [220], []],
  ['crouch-x', 'Crouching x', 'normal', 'x', [400], ['normal-export']],
  ['crouch-y', 'Crouching y', 'normal', 'y', [410], ['normal-export']],
  ['crouch-z', 'Crouching z', 'normal', 'z', [420], ['normal-export']],
  ['air-x', 'Air x', 'normal', 'x', [600], ['normal-export', 'air-normal-lifecycle']],
  ['air-y', 'Air y', 'normal', 'y', [610], ['normal-export', 'air-normal-lifecycle']],
  ['air-z', 'Air z', 'normal', 'z', [620], ['normal-export', 'air-normal-lifecycle']],
  ['roll', 'Roll like a wheel', 'special', 'Special1', [1000], ['command-sequences', 'combo-variable-shorthand', 'hitdef-attributes', 'multi-hit-tests']],
  ['projectile', 'Projectile special', 'special', 'Special2', [1020], ['command-sequences', 'combo-variable-shorthand', 'projectiles', 'expanded-hit-rules']],
  ['coin-toss', 'Coin toss hyper', 'hyper', 'Hyper1', [3000], ['helper-count', 'superpause', 'projectiles', 'expanded-hit-rules', 'heavy-alias', 'effects-audio']],
  ['slap-combo', 'Slap combo hyper', 'hyper', 'Hyper2', [3010, 3011, 3012], ['helper-count', 'superpause', 'hit-confirm-transition', 'heavy-alias', 'multi-hit-tests', 'effects-audio']],
];
const BACKLOG = [
  { id: 'normal-export', batch: 1, status: 'implemented', title: 'Export all nine normals and their original human transitions/AIR actions', scope: 'Source crouch x/y/z and air x/y/z are included with distinct authored crouch friction. Down+attack can enter the original crouch route on the same tick.', acceptance: 'Crouch x→y→z, air x→y→z and direct x→z tested with real contacts, whiffs, guards and landing; source files unchanged.' },
  { id: 'hitdef-attributes', batch: 2, title: 'Extend attack attributes beyond normal attacks', scope: 'A, NA now works for state 620, with source HA guard eligibility and falling reactions. S, SA in 1000 and S, SP in projectiles remain unsupported. Attribute posture is not the current fighter posture.', acceptance: 'Compile exact source special/projectile attributes and preserve attack classes; retain normal HA guard/fall regressions.' },
  { id: 'air-normal-lifecycle', batch: 1, status: 'implemented', title: 'Validate authored airborne attack control and landing', scope: '600/610/620 restore ctrl at Time=20 without a ChangeState; restored control permits source attacks and source-limited air jumps. Gravity integrates once across common/authored transitions. Juggle budget enforcement remains in expanded-hit-rules.', acceptance: 'Landing interrupts each air normal, clears HitDef and restores grounded control; source Time20 control and held AIR frames, mirrored hit/guard chains, input-only jumps and no duplicate gravity are tested.' },
  { id: 'command-sequences', batch: 2, title: 'Recognize ordered directional histories and release steps', scope: 'Special1/2 use ~D,DF,F plus a button; FF/BB use double taps. Hyper1/2 are already-supported single-step chords but not exported.', acceptance: 'Use original command time/buffer/remaps; reject wrong order/expired motions; test both facings, diagonals, release and hitpause.' },
  { id: 'combo-variable-shorthand', batch: 2, title: 'Support VarSet var(1)=value shorthand', scope: 'The original -1 reset/check controllers maintain the special-cancel condition. Current VarSet accepts only v/fv/value.', acceptance: 'Keep source controller ordering and prove special cancels require ctrl or the authored grounded-normal MoveContact condition.' },
  { id: 'multi-hit-tests', batch: 2, title: 'Validate repeated HitDef activation and source combo timing', scope: '1000 re-arms every seven state ticks; 3012 activates on ten animation elements plus a finisher. Generic activation already exists; these moves are untested.', acceptance: 'One contact per activation, correct re-arm/pause timing, no extra hits from held AIR elements or global pause.' },
  { id: 'projectiles', batch: 3, title: 'Implement Projectile entities and their lifecycle', scope: '1020/3000 use animation 1011, impact 1012, offset/velocity/scale, priority, height/edge/screen bounds, shadow and repeated spawns.', acceptance: 'Projectile movement, ownership, collision, hit/guard damage, removal, impact animation and multiple simultaneous projectiles; define stage/screen bounds first.' },
  { id: 'expanded-hit-rules', batch: 3, title: 'Add projectile air/down/juggle parameters', scope: 'air.juggle, air.fall, down.velocity, down.hittime, down.bounce occur in both projectile controllers and are unsupported. State juggle costs are imported but character juggle budgets are not enforced, including normals. air.animtype=Back already compiles but needs projectile integration tests.', acceptance: 'Source parameter compilation plus airborne/downed-target integration tests; no silent parameter dropping.' },
  { id: 'helper-count', batch: 4, title: 'Expose truthful match/entity trigger context', scope: 'Human hypers require numhelper=0. No Helper controller is authored here; supply a real zero count for this host rather than accepting arbitrary unknown triggers.', acceptance: 'Both human hypers respect their source power and helper-count gates; AI additionally requires opponent/match/projectile context.' },
  { id: 'superpause', batch: 4, title: 'Implement global SuperPause semantics', scope: '30-tick hyper startup and 270-tick success sequence with owner movetime, unhittable, darken and effect/audio timing.', acceptance: 'Both fighters, projectiles, effects and input buffers obey global freeze/owner movement allowances. Hitpause alone is insufficient.' },
  { id: 'hit-confirm-transition', batch: 4, title: 'Implement HitDef p1stateno on actual hit', scope: '3010 enters 3011 only through p1stateno=3011; 3011 then enters 3012. Exporting ChangeState targets alone misses this path.', acceptance: 'Whiff returns idle; hit enters 3011 exactly once; transition survives target pause and completes the authored 3012 sequence.' },
  { id: 'heavy-alias', batch: 3, title: 'Resolve source animtype=Heavy compatibility', scope: '3000 projectile and 3012 finisher use Heavy; current enum accepts Hard but rejects Heavy. Treat as explicit compatibility policy, not a source-file edit.', acceptance: 'Record the alias/diagnostic policy and test exact source blocks.' },
  { id: 'effects-audio', batch: 4, title: 'Execute PlaySnd and Explod presentation', scope: 'Source Explod portraits/backgrounds, placement, lifetime, binding, remove-on-hit, pause behavior and -3 AngleDraw execute. Browser renders source visuals; unavailable common sparks/F40/SuperPause100 use explicit procedural fallbacks. Only audio remains deferred.', acceptance: 'Separate presentation events from gameplay; preserve resource ownership, source/screen coordinates, channels, lifetime and pause behavior.' },
  { id: 'shared-extras', batch: 2, title: 'Add authored taunt, run/back-hop and recovery-command mapping', scope: '195 taunt is not exported. FF/BB point to missing common states 100/105; -3 refers to back-hop landing106. CMD recovery is six two-button alternatives, not the current host up-edge shortcut.', acceptance: 'Import taunt, implement explicit 100/105/106 fallback with source run constants, and use recovery commands without breaking standard jumps.' },
  { id: 'round-lifecycle', batch: 5, title: 'Support intro, win/lose and character-global controllers', scope: 'Optional source intros190/191/192 lock both players until completion. Source victory180/181, lose170 after KO, VarRandom, NotHitBy, AssertSpecial, VictoryQuote and bounded match/enemy/Explod context execute. Audio is intentionally deferred.', acceptance: 'Start/end a full round using source presentation and assert invulnerability/intro gating; no wholesale silent deferral of gameplay controllers.' },
  { id: 'ai-context', batch: 6, title: 'Add source AI separately from human move compatibility', scope: 'AI_1..40 activation plus RoundState, opponent state/life/movetype/body distance, NumProj/NumHelper and IsHelper. Helper-check targets9741/9742 are not defined locally.', acceptance: 'Document missing helper destinations; test AI activation/decisions only after real entity/match context exists. AI commands do not count as forty moves.' },
];
const values = (entries, key) => entries.filter(e => e.key.toLowerCase() === key).map(e => e.value);
const at = item => ({ source: item.source, line: item.line });

export function buildCoinyMoveAudit(character, checkpoint) {
  const commandState = character.states.find(s => s.id === -1);
  if (!commandState || character.states.filter(s => s.id === -1).length !== 1) throw new Error('Expected one Coiny command state');
  const locateState = id => {
    const states = character.states.filter(s => s.id === id);
    if (states.length !== 1) throw new Error(`Expected one Coiny state ${id}`);
    return states[0];
  };
  const stateDetail = id => {
    const s = locateState(id);
    const actionIds = values(s.entries, 'anim').filter(v => /^\d+$/.test(v)).map(Number);
    for (const c of s.controllers) for (const key of ['projanim', 'projhitanim']) actionIds.push(...values(c.entries, key).filter(v => /^\d+$/.test(v)).map(Number));
    return { id, ...at(s), header: s.entries, controllers: s.controllers.map(c => ({ type: c.type, ...at(c), triggers: c.entries.filter(e => /^trigger/i.test(e.key)), parameters: c.entries.filter(e => !/^trigger|^type$/i.test(e.key)) })),
      actions: [...new Set(actionIds)].map(actionId => {
        const matches = character.animations.filter(a => a.id === actionId);
        return { id: actionId, definitions: matches.length, frames: matches[0]?.frames.length ?? 0, attackFrames: matches[0]?.frames.filter(f => f.attackBoxes.length).length ?? 0 };
      }) };
  };
  const moves = MOVES.map(([id, name, category, command, states, requirements]) => {
    const transitions = commandState.controllers.filter(c => c.type.toLowerCase() === 'changestate'
      && values(c.entries, 'value').includes(String(states[0]))
      && c.entries.some(e => /^trigger/.test(e.key) && new RegExp(`command\\s*=\\s*"${command}"`, 'i').test(e.value)));
    if (transitions.length !== 1) throw new Error(`Expected one human transition for ${id}`);
    const included = states.every(state => checkpoint.selectedStates.some(s => s.id === state && !s.source.startsWith('<host:')))
      && checkpoint.selectedControllers.some(c => c.source === transitions[0].source && c.line === transitions[0].line);
    return { id, name, category, command, status: included ? 'included-in-current-checkpoint' : 'not-exported-or-validated',
      transition: { ...at(transitions[0]), entries: transitions[0].entries },
      commandDefinitions: character.commands.filter(c => c.name === command).map(c => ({ ...at(c), pattern: c.command, time: c.time, bufferTime: c.bufferTime, features: commandFeatures(c.command) })),
      states: states.map(stateDetail), requirements };
  });
  const references = new Set();
  for (const s of character.states) for (const c of s.controllers) for (const e of c.entries) {
    for (const match of e.value.matchAll(/command\s*(?:!=|=)\s*"([^"]*)"/gi)) references.add(match[1]);
  }
  return { schemaVersion: 1, character: character.name, selectedDef: character.selectedDef,
    scope: 'Source-linked Coiny human move audit against the current selected checkpoint. Static inclusion is not execution or full compatibility; compile probes are recorded separately.',
    counts: { commandDefinitions: character.commands.length, stateDefinitions: character.states.length,
      controllerBlocks: character.states.reduce((n, s) => n + s.controllers.length, 0), humanAttackEntryPoints: moves.length,
      attackStates: new Set(moves.flatMap(m => m.states.map(s => s.id))).size,
      includedAttackEntryPoints: moves.filter(m => m.status === 'included-in-current-checkpoint').length,
      remainingAttackEntryPoints: moves.filter(m => m.status !== 'included-in-current-checkpoint').length },
    moves, backlog: BACKLOG.map(item => ({ ...item, status: item.id === 'ai-context' ? 'pending' : ['effects-audio','round-lifecycle'].includes(item.id) ? 'partial' : 'implemented', scope: ['effects-audio','ai-context','round-lifecycle'].includes(item.id) ? item.scope : 'Implemented in the selected player gameplay checkpoint; verified by source-driven runtime tests. Reference-exact parity is not claimed.' })),
    normalIntegrationTests: ['tests/luau/mugen-coiny.test.luau', 'tests/luau/mugen-coiny-normals.test.luau', 'tests/luau/mugen-combat.test.luau', 'tests/luau/coiny-gameplay.test.luau', 'tests/luau/coiny-visuals.test.luau', 'tests/luau/mugen-effects.test.luau'],
    integrationLimitations: 'All13 human attack routes have source-driven tests in both slots/facings. Source intro/lose/global visuals are supported; missing common artwork uses procedural fallbacks. AI, helpers and audio remain incomplete. Host motion/common reactions and screen bounds are approximations; projectile clashes and Roblox integration are pending.',
    auxiliaryStates: [170, 180, 181, 190, 191, 192, 195].map(stateDetail),
    globalControllers: character.states.filter(s => s.id < 0).map(s => ({ id: s.id, ...at(s), controllers: s.controllers.map(c => ({ type: c.type, ...at(c) })) })),
    sourceNotes: [
      'Nine normals, two specials and two hyper entry points; the slap hyper contains three linked states. Taunt, runs, round poses and AI are listed separately.',
      'SSpecial1/SSpecial2 reverse-quarter-circle commands are declared but not referenced by these source controllers; declarations alone do not prove moves exist.',
      'Crouching and air x/y HitDefs retain source attr=S,NA. Do not rewrite them to match posture; air z explicitly uses A,NA.',
      'Both combo-condition VarSet controllers use var(1)=value shorthand, not v=1/value=... .',
      'Common states100/105/106 and helper targets9741/9742 are absent locally. The selected DEF references unresolved common1.cns; explicit host run/backhop fallbacks use source velocities; missing AIR106 uses idle.',
      'Air/down/juggle rules, Heavy-to-Hard alias, hit-confirm transitions and SuperPause are implemented for this player checkpoint; helper entities and reference-exact parity are not.',
    ],
    unreferencedCommandNames: [...new Set(character.commands.map(c => c.name))].filter(name => !references.has(name)),
    dependencies: character.dependencies, parseWarnings: character.parseWarnings,
    validation: { kind: 'static-source-audit', runtimeProbes: 'See tests/coiny-move-audit.test.mjs; source-based Luau probes verify implemented blocks; gameplay compatibility is tested separately in coiny-gameplay.test.luau.' } };
}

export async function auditCoinyMoves() {
  const character = await readCharacter(path.join(ROOT, 'chars', 'coiny'));
  const checkpoint = JSON.parse(await fs.readFile(path.join(ROOT, 'generated', 'luau', 'coiny-checkpoint-report.json'), 'utf8'));
  const currentHashes = character.dependencies.filter(d => d.sha256).map(d => [d.source, d.sha256]);
  const checkpointHashes = checkpoint.dependencies.filter(d => d.sha256).map(d => [d.source, d.sha256]);
  if (JSON.stringify(currentHashes) !== JSON.stringify(checkpointHashes)) throw new Error('Checkpoint source hashes are stale; regenerate the checkpoint first');
  const report = buildCoinyMoveAudit(character, checkpoint);
  const output = path.join(ROOT, 'generated', 'coiny-move-audit.json');
  await fs.writeFile(output, JSON.stringify(report, null, 2) + '\n');
  console.log(`Coiny: ${report.counts.humanAttackEntryPoints} attack entry points; ${report.counts.includedAttackEntryPoints} included, ${report.counts.remainingAttackEntryPoints} remaining. Static audit: ${output}`);
  return report;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  auditCoinyMoves().catch(error => { console.error(error.message); process.exitCode = 1; });
}
