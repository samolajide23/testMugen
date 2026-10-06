import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCharacter } from './audit-compatibility.mjs';
import { discoverSourceRoutes } from './source-capabilities.mjs';
import { toLuau } from './export-movement.mjs';

const NORMALS = new Map([[200, 'x'], [210, 'y'], [220, 'z'], [400, 'x'], [410, 'y'], [420, 'z'], [600, 'x'], [610, 'y'], [620, 'z']]);
const ATTACKS = new Map([...NORMALS, [1000, 'Special1'], [1020, 'Special2'], [3000, 'Hyper1'], [3010, 'Hyper2']]);
const SOURCE_STATES = new Set([...ATTACKS.keys(), 3011, 3012, 195, 170, 180, 181, 190, 191, 192]);
const GLOBAL_VISUAL_CONTROLLERS = new Map([[-2, new Set(['explod', 'assertspecial', 'victoryquote'])], [-3, new Set(['angledraw'])]]);
const COMMANDS = new Set(['x', 'y', 'z', 'holddown', 'Special1', 'Special2', 'Hyper1', 'Hyper2', 'FF', 'BB', 's', 'recovery']);
const LIMITATIONS = [
  'Coiny player gameplay checkpoint: nine normals, rolling/toss specials, two hypers, dash/backhop, taunt and victory states; not universal character support.',
  'Original CMD transitions, Statedef parameters and AIR timings execute; source files are not modified.',
  'Explicit standard host common states provide walking/crouch/jump/landing, posture guard, air/fall/down/recovery and KO; not execution of original common1.cns or arbitrary character movement controllers.',
  'MugenCombat resolves AIR Clsn1/Clsn2 contacts with evaluated HitDef damage, posture guarding, priority, hitpause and standard host reactions.',
  'Real contacts drive MoveContact/MoveHit/MoveGuarded and source cancels. Single-fighter tests also retain injected-feedback coverage.',
  'PlaySnd/audio is deferred. Source visual globals and self Explod AIR artwork are exported; unavailable common fightfx artwork requires explicit procedural visual fallbacks.',
  'No body pushing or projectile clashes. Optional stage bounds and approximate 320px camera edges; source projectile heightbound0,0 disables height removal. Juggle defaults to a bounded15 budget. Unauthored hit power defaults remain zero; Heavy maps to Hard. Host common movement/reactions are approximations.',
  'AI, shared states, helpers and unselected commands are excluded. Selected -2/-3 visual controllers are included; audio remains deferred.',
  'Fixed-tick Luau engine with local Coiny-versus-Coiny source-combat browser bridge; separate from the generic movement and hand-tuned combat prototypes. Roblox integration remains pending.',
];
function unique(items, label) {
  if (items.length !== 1) throw new Error(`Expected exactly one ${label}; found ${items.length}`);
  return items[0];
}
const copyEntries = entries => entries.map(entry => ({ ...entry }));
function controllerCopy(controller) {
  return { type: controller.type, source: controller.source, line: controller.line, entries: copyEntries(controller.entries) };
}
function stateCopy(state) {
  return { id: state.id, source: state.source, entries: copyEntries(state.entries), controllers: state.controllers.map(controllerCopy) };
}
export function buildCoinyCheckpoint(character) {
  return buildCheckpoint(character);
}
export function buildAutomaticCheckpoint(character) {
  const discovery=discoverSourceRoutes(character);
  const result=buildCheckpoint(character, {
    states:discovery.states,commands:discovery.commands,selected:discovery.selected,omitted:discovery.omitted,
    limitations:[
      'Capability-based human source routes and reachable states; not full MUGEN compatibility or browser integration.',
      'Original common states are replaced by shared host movement and reactions. AI-dependent routes are excluded.',
      'Unsupported gameplay blocks the complete route; audio and unsupported visual controllers are explicitly omitted and reported.',
      'First-occurrence duplicate parameter policy; conflicting controller types still reject. Original files are unchanged.',
      'Normal helpers run independent source state machines and collisions; nested/key-controlled helpers, helper-versus-helper contact and custom opponent states remain unsupported.',
      'HitDef palette/fall-animation hints remain unrendered metadata. No body pushing or projectile clashes.',
    ],
  });
  result.report.routes=discovery.routes;
  result.report.presentationOmissions=discovery.omitted;
  return result;
}
export function buildPikachuCheckpoint(character) { return buildAutomaticCheckpoint(character); }
function buildCheckpoint(character, profile) {
  const attacks = profile?.attacks ?? ATTACKS;
  const sourceStates = profile?.states ?? SOURCE_STATES;
  const commandNames = profile?.commands ?? COMMANDS;
  const special = unique(character.states.filter(s => s.id === -1), 'command state -1');
  const selected = new Set(profile?.selected ?? []);
  for (const [id, command] of (profile ? [] : attacks)) {
    selected.add(unique(special.controllers.filter(c => c.type.toLowerCase() === 'changestate'
      && c.entries.some(e => e.key === 'value' && e.value.trim() === String(id))
      && c.entries.some(e => e.key === 'triggerall' && new RegExp(`^command\\s*=\\s*"${command}"$`, 'i').test(e.value.trim()))), `human ${command} transition to ${id}`));
  }
  for (const variable of (profile ? [] : ['0', '1'])) selected.add(unique(special.controllers.filter(c => c.type.toLowerCase() === 'varset'
    && c.entries.some(e => e.key === 'var(1)' && e.value.trim() === variable)), `combo condition var(1)=${variable}`));
  for (const id of (profile ? [] : [100, 105, 195])) selected.add(unique(special.controllers.filter(c => c.type.toLowerCase() === 'changestate'
    && c.entries.some(e => e.key === 'value' && e.value.trim() === String(id))
    && c.entries.some(e => /^trigger\d+$|^triggerall$/.test(e.key) && /^command\s*=/.test(e.value.trim()))), `human common transition ${id}`));
  const commands = character.commands.filter(c => commandNames.has(c.name)).map(c => {
    for (const key of ['time', 'bufferTime']) if (!/^[1-9]\d*$/.test(String(c[key]))) throw new Error(`Unsupported ${c.name} ${key}`);
    return { name: c.name, command: c.command, time: Number(c.time), bufferTime: Number(c.bufferTime), remap: { ...c.remap } };
  });
  for (const name of commandNames) if (!commands.some(c => c.name === name)) throw new Error(`Missing command ${name}`);
  for (const id of sourceStates) unique(character.states.filter(s => s.id === id), `state ${id}`);
  const states = character.states.filter(s => sourceStates.has(s.id)).map(stateCopy);
  if (profile) for (const state of states) state.controllers = state.controllers.filter(c => !profile.omitted.some(o => o.source===c.source && o.line===c.line));
  states.unshift({ id: -1, source: special.source, entries: copyEntries(special.entries), controllers: special.controllers.filter(c => selected.has(c)).map(controllerCopy) });
  for (const [id, types] of (profile ? [] : GLOBAL_VISUAL_CONTROLLERS)) {
    const source = unique(character.states.filter(s => s.id === id), `visual global state ${id}`);
    const controllers = source.controllers.filter(c => types.has(c.type.toLowerCase()));
    for (const controller of controllers) selected.add(controller);
    states.unshift({ id, source: source.source, entries: copyEntries(source.entries), controllers: controllers.map(controllerCopy) });
  }
  states.unshift({ id: 0, source: '<host:checkpoint-idle>', entries: Object.entries({ type: 'S', movetype: 'I', physics: 'S', anim: '0', ctrl: '1', velset: '0,0' }).map(([key, value]) => ({ key, value })), controllers: [] });
  const commonAnimations = { idle: 0, walkForward: 20, walkBack: 21, runForward: 100, runBack: 105, runBackLanding: 106, crouchDown: 10, crouch: 11, crouchUp: 12,
    jumpStart: 40, jumpNeutral: 41, jumpForward: 42, jumpBack: 43, landing: 47,
    guardStand: 150, guardCrouch: 151, guardAir: 152,
    hitStandLight: 5000, hitStandMedium: 5001, hitStandHard: 5002, hitLowLight: 5010, hitLowMedium: 5011, hitLowHard: 5012,
    hitCrouch: 5020, hitAir: 5030, fall: 5050, down: 5110, getUp: 5120, ko: 5150 };
  const commonStates = [[10, 'crouchDown', 'C', true], [11, 'crouch', 'C', true], [12, 'crouchUp', 'C', false],
    [100, 'runForward', 'S', true], [105, 'runBack', 'A', false], [106, 'runBackLanding', 'S', false],
    [20, 'walkForward', 'S', true], [40, 'jumpStart', 'S', false], [50, 'jumpNeutral', 'A', true], [52, 'landing', 'S', false],
    [120, 'guardStand', 'S', true], [130, 'guardStand', 'S', true], [131, 'guardCrouch', 'C', true], [132, 'guardAir', 'A', true],
    [150, 'guardStand', 'S', false], [151, 'guardCrouch', 'C', false], [152, 'guardAir', 'A', false],
    [5000, 'hitStandLight', 'S', false], [5010, 'hitLowLight', 'S', false], [5020, 'hitCrouch', 'C', false],
    [5030, 'hitAir', 'A', false], [5050, 'fall', 'A', false], [5100, 'down', 'L', false], [5110, 'down', 'L', false],
    [5120, 'getUp', 'L', false], [5150, 'ko', 'L', false]];
  for (const [id, name, posture, control] of commonStates) {
    if (!profile && character.states.some(s => s.id === id)) throw new Error(`Host common state ${id} conflicts with authored state`);
    const label = id === 150 ? 'guard' : id === 5000 ? 'hit' : name;
    states.push({ id, source: `<host:checkpoint-${label}>`, entries: Object.entries({ type: posture, movetype: id >= 150 ? 'H' : 'I', physics: 'N', anim: String(commonAnimations[name]), ctrl: control ? '1' : '0', velset: id === 105 ? character.constants.velocity['run.back'] : '0,0' }).map(([key, value]) => ({ key, value })), controllers: [] });
  }
  const animationFallbacks = [];
  const sourceAnimations = states.filter(s => sourceStates.has(s.id)).flatMap(s => [
    ...s.entries.filter(e => e.key === 'anim').map(e => Number(e.value)),
    ...s.controllers.flatMap(c => {
      const kind = c.type.toLowerCase();
      const key = kind === 'changeanim' ? 'value' : ['changestate', 'explod'].includes(kind) ? 'anim' : undefined;
      const value = key && c.entries.find(e => e.key === key)?.value;
      return value ? [Number(value.trim().replace(/^[sS]/, ''))] : [];
    }),
  ]);
  const requiredActions = new Set(profile ? [0, ...sourceAnimations] : [0, 170, 180, 190, 191, 195, 1000, 1001, 1011, 1012, 1030, 1040, 1041, 1042, 3999, 4050,
    ...NORMALS.keys(), 150, 5000, 5001, 5002, 5010, 5011, 5012]);
  const actionIds = new Set([...requiredActions, ...Object.values(commonAnimations)]);
  const animations = [...new Set([...character.animations.filter(a => actionIds.has(a.id)).map(a => a.id), ...actionIds])].map(id => {
    const candidates = character.animations.filter(a => a.id === id);
    let action;
    if (!candidates.length && !requiredActions.has(id)) {
      action = unique(character.animations.filter(a => a.id === 0), 'fallback idle AIR action');
      animationFallbacks.push({ id, fallback: 0, reason: 'Missing standard AIR action; idle frames provide explicit presentation/collision fallback.' });
    } else action = unique(candidates, `AIR action ${id}`);
    if (!action.frames.length || action.frames.some(f => !Number.isSafeInteger(f.duration) || f.duration < -1)) throw new Error(`Invalid AIR action ${id}`);
    return { id, loopStart: action.loopStart + 1, durations: action.frames.map(f => f.duration), frames: structuredClone(action.frames) };
  });
  function constant(section, name, minimum = 0) {
    const raw = character.constants?.[section]?.[name];
    if (typeof raw !== 'string' || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw.trim())) throw new Error(`Unsupported constant ${section}.${name}`);
    const value = Number(raw);
    if (!Number.isFinite(value) || value < minimum) throw new Error(`Invalid constant ${section}.${name}`);
    return value;
  }
  const combat = { life: constant('data', 'life', 1), attack: constant('data', 'attack'), defence: constant('data', 'defence', Number.EPSILON),
    xscale: constant('size', 'xscale', Number.EPSILON), yscale: constant('size', 'yscale', Number.EPSILON), localcoord: [...character.localcoord],
    name: character.name, victoryQuotes: structuredClone(character.victoryQuotes ?? {}), ...(profile ? {} : { introState: 190, loseState: 170, winState: 180 }),
    guardState: 150, hitState: 5000, guardAnim: 150, hitAnims: { High: { Light: 5000, Medium: 5001, Hard: 5002 }, Low: { Light: 5010, Medium: 5011, Hard: 5012 } } };
  function vector(section, name) {
    const raw = character.constants?.[section]?.[name];
    if (typeof raw !== 'string' || raw.split(',').length !== 2) throw new Error(`Unsupported vector ${section}.${name}`);
    const values = raw.split(',').map(v => v.trim());
    if (values.some(v => !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(v) || !Number.isFinite(Number(v)))) throw new Error(`Invalid vector ${section}.${name}`);
    return { x: Number(values[0]), y: Number(values[1]) };
  }
  const jump = vector('velocity', 'jump.neu'), airJump = vector('velocity', 'airjump.neu');
  const runForward = vector('velocity', 'run.fwd'), runBack = vector('velocity', 'run.back');
  if (jump.y >= 0 || airJump.y >= 0) throw new Error('Standard jump velocities must point upward');
  const airJumpNum = constant('movement', 'airjump.num');
  if (!Number.isSafeInteger(airJumpNum)) throw new Error('airjump.num must be an integer');
  combat.common = { animations: commonAnimations,
    movement: { runForward: runForward.x, runBackX: runBack.x, runBackY: runBack.y,
      walkForward: constant('velocity', 'walk.fwd'), walkBack: constant('velocity', 'walk.back', -Number.MAX_VALUE), jump,
      jumpBack: constant('velocity', 'jump.back', -Number.MAX_VALUE), jumpForward: constant('velocity', 'jump.fwd'),
      airJump, airJumpBack: constant('velocity', 'airjump.back', -Number.MAX_VALUE), airJumpForward: constant('velocity', 'airjump.fwd'),
      airJumpNum, airJumpHeight: constant('movement', 'airjump.height'), gravity: constant('movement', 'yaccel', Number.EPSILON),
      standFriction: constant('movement', 'stand.friction'), crouchFriction: constant('movement', 'crouch.friction') },
    size: { groundBack: constant('size', 'ground.back'), groundFront: constant('size', 'ground.front'), height: constant('size', 'height', Number.EPSILON) },
    reactions: { liedownTime: constant('data', 'liedown.time') }, recoveryCommand: 'recovery' };
  const config = { startState: 0, deferredControllers: ['playsnd'], permissiveParameters: Boolean(profile), commands, states, animations, combat,
    gravity: constant('movement', 'yaccel', Number.EPSILON), friction: constant('movement', 'stand.friction'), crouchFriction: constant('movement', 'crouch.friction') };
  const included = new Set([...selected, ...character.states.filter(s => sourceStates.has(s.id)).flatMap(s => s.controllers)
    .filter(c => !profile || !profile.omitted.some(o=>o.source===c.source && o.line===c.line))]);
  const report = {
    schemaVersion: 3, character: character.name, selectedDef: character.selectedDef, ticksPerSecond: 60, combat, animationFallbacks,
    limitations: profile?.limitations ?? LIMITATIONS, dependencies: character.dependencies, parseWarnings: character.parseWarnings,
    selectedCommands: character.commands.filter(c => commandNames.has(c.name)).map(c => ({ name: c.name, source: c.source, line: c.line })),
    selectedStates: states.map(s => ({ id: s.id, source: s.source })),
    parameterPolicy: profile ? 'first-occurrence' : 'reject-duplicates',
    duplicateParameters: states.flatMap(s => s.controllers.flatMap(c => {
      const seen = new Map();
      return c.entries.flatMap(e => {
        if (e.key === 'type' || e.key.startsWith('trigger')) return [];
        if (!seen.has(e.key)) { seen.set(e.key, e); return []; }
        return [{ state: s.id, source: c.source, controllerLine: c.line, parameter: e.key,
          retained: seen.get(e.key).value, ignored: e.value, line: e.line }];
      });
    })),
    deferredPresentationParameters: profile ? states.flatMap(s => s.controllers.flatMap(c => c.entries
      .filter(e => e.key.startsWith('palfx.') || e.key === 'fall.animtype')
      .map(e => ({ state: s.id, source: c.source, controllerLine: c.line, parameter: e.key, value: e.value })))) : [],
    selectedControllers: character.states.flatMap(s => s.controllers.filter(c => included.has(c)).map(c => ({ state: s.id, type: c.type, source: c.source, line: c.line }))),
    excludedCommands: character.commands.filter(c => !commandNames.has(c.name)).map(c => ({ name: c.name, source: c.source, line: c.line })),
    excludedStates: character.states.filter(s => !states.some(selectedState => selectedState.id === s.id)).map(s => ({ id: s.id, source: s.source, line: s.line })),
    excludedControllers: character.states.flatMap(s => s.controllers.filter(c => !included.has(c)).map(c => ({ state: s.id, type: c.type, source: c.source, line: c.line }))),
    animations: animations.map(a => ({ id: a.id, durations: a.durations, loopStart: a.loopStart })),
  };
  return { config, report };
}
export function checkpointToLuau(value, depth = 0) {
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number' || typeof value === 'string') return toLuau(value);
  if (!value || typeof value !== 'object') throw new Error('Unsupported checkpoint value');
  const indent = '  '.repeat(depth);
  const entries = Array.isArray(value) ? value.map((entry, index) => [index + 1, entry]) : Object.entries(value);
  return `{\n${entries.map(([key, entry]) => `${indent}  [${typeof key === 'number' ? key : toLuau(key)}] = ${checkpointToLuau(entry, depth + 1)},`).join('\n')}\n${indent}}`;
}
export async function exportMugenCheckpoint(input = path.join('chars', 'coiny'), output = 'generated', characterId = 'coiny') {
  const source = await fs.realpath(input), root = await fs.realpath(output), relative = path.relative(source, root);
  if (relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))) throw new Error('Checkpoint output must be outside source character');
  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(characterId)) throw new Error('Invalid checkpoint character ID');
  const result = (characterId === 'coiny' ? buildCoinyCheckpoint : buildAutomaticCheckpoint)(await readCharacter(source));
  const destination = path.join(root, 'luau');
  try {
    const stat = await fs.lstat(destination);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('Unsafe checkpoint output directory');
  } catch (error) { if (error.code === 'ENOENT') await fs.mkdir(destination); else throw error; }
  for (const name of [`${characterId}-checkpoint.luau`, `${characterId}-checkpoint-report.json`]) {
    try {
      const stat = await fs.lstat(path.join(destination, name));
      if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink > 1) throw new Error('Unsafe checkpoint output file');
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  // Separate records prevent expensive heterogeneous-table union inference in Luau.
  const assignments = ['local config: any = {}'];
  for (const [key, value] of Object.entries(result.config)) {
    const target = `config[${toLuau(key)}]`;
    if (Array.isArray(value)) {
      assignments.push(`${target} = {}`);
      value.forEach((entry, index) => assignments.push(`${target}[${index + 1}] = ${checkpointToLuau(entry)}`));
    } else assignments.push(`${target} = ${checkpointToLuau(value)}`);
  }
  await fs.writeFile(path.join(destination, `${characterId}-checkpoint.luau`), `--!strict\n-- Generated source-driven slice, NOT full character support. See ${characterId}-checkpoint-report.json.\n${assignments.join('\n')}\nreturn config\n`);
  await fs.writeFile(path.join(destination, `${characterId}-checkpoint-report.json`), `${JSON.stringify(result.report, null, 2)}\n`);
  return result;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  exportMugenCheckpoint(process.argv[2] ? path.join('chars', process.argv[2]) : undefined, 'generated', process.argv[2]?.toLowerCase() ?? 'coiny').then(({ report }) => console.log(`${report.character}: source combat checkpoint exported; see its report for selected states and limitations.`))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
