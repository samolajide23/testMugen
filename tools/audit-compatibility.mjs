import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parseDef, parseIni, parseCmd, parseStates, parseAir, stripComment, resolveCharacterFile } from './mugen-import.mjs';

// Catalog names identify requirements, not implemented runtime features.
const TRIGGERS = new Set(`abs acos ailevel alive anim animelem animelemno animelemtime animexist animtime asin atan authorname
backedgebodydist backedgedist canrecover ceil command cond const const240p const480p const720p cos ctrl drawgame e exp facing floor
frontedgebodydist frontedgedist fvar gameheight gametime gamewidth gethitvar hitcount hitdefattr hitfall hitover hitpausetime hitshakeover
hitvel id ifelse inguarddist ishelper ishometeam life lifemax ln log lose matchno matchover movecontact moveguarded movehit movetype
movereversed name numenemy numexplod numhelper numpartner numproj numprojid numtarget p1name p2bodydist p2dist p2life p2movetype p2name
p2stateno p2statetype p3name p4name palno parentdist pi pos power powermax playeridexist prevstateno projcanceltime projcontact
projcontacttime projguarded projguardedtime projhit projhittime random rootdist roundno roundsexisted roundstate screenpos selfanimexist
sin stateno statetype stagevar sysfvar sysvar tan teammode teamside tickspersecond time timemod uniqhitcount var vel win`.split(/\s+/));
const CONTROLLERS = new Set(`afterimage afterimagetime allpalfx angleadd angledraw anglemul angleset appendtoclipboard assertspecial
attackdist attackmulset bgpalfx bindtoparent bindtoroot bindtotarget changeanim changeanim2 changestate clearclipboard ctrlset defencemulset
destroyself displaytoclipboard envcolor envshake explod explodbindtime forcefeedback fallenvshake gamemakeanim gravity helper hitadd hitby
hitdef hitfalldamage hitfallset hitfallvel hitoverride hitvelset lifeadd lifeset makedust modifyexplod movehitreset nothitby null offset palfx
parentvaradd parentvarset pause playerpush playsnd posadd posfreeze posset poweradd powerset projectile remappal removeexplod reversaldef
screenbound selfstate sprpriority statetypeset sndpan stopsnd superpause targetbind targetdrop targetfacing targetlifeadd targetpoweradd
targetstate targetveladd targetvelset trans turn varadd varrandom varrangeset varset veladd velmul velset victoryquote width`.split(/\s+/));
const REDIRECTIONS = new Set('parent root helper target partner enemy enemynear playerid'.split(' '));
const REFERENCES = [
  'https://www.elecbyte.com/mugendocs/cns.html',
  'https://www.elecbyte.com/mugendocs/trigger.html',
  'https://www.elecbyte.com/mugendocs/sctrls.html',
  'https://www.elecbyte.com/mugendocs/air.html',
  'https://github.com/ikemen-engine/Ikemen-GO',
];
const LIMITATIONS = [
  'Static requirements inventory, not execution, reachability analysis, or a move/combination compatibility guarantee.',
  'No imported CMD/CNS controller or trigger is executed by the current Luau prototypes.',
  'Counts include AI, effects, helpers, duplicate definitions and potentially unreachable code; command definitions are not move counts.',
  'Symbol candidates are lexical matches, not parsed expressions. Other identifiers may be enum values, argument names, extensions or errors.',
  'Unresolved literal state references may belong to shared engine states or another player. Dynamic references require runtime evaluation.',
  'Reads the selected DEF and its referenced text files directly. Alternate DEF variants and unreferenced files are excluded.',
  'Uses the existing text parsers; unsupported syntax is not evidence of compatibility. Does not decode or validate sprites/sounds.',
];

function record(map, name, location) {
  let item = map.get(name);
  if (!item) { item = { name, count: 0, samples: [] }; map.set(name, item); }
  item.count++;
  if (item.samples.length < 3) item.samples.push(location);
}
function inventory(map) { return [...map.values()].sort((a, b) => a.name.localeCompare(b.name)); }
export function identifiers(value) {
  const tokens = value.match(/"(?:\\.|[^"\\])*"|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[a-z_][a-z_0-9.]*/gi) ?? [];
  return tokens.filter(t => /^[a-z_]/i.test(t)).map(t => t.toLowerCase());
}
export function commandFeatures(pattern) {
  const features = [];
  for (const [name, expression] of [
    ['sequence', /,/], ['simultaneous-buttons', /\+/], ['hold', /\//], ['release', /~/],
    ['charge-duration', /~\d+/], ['direction-wildcard', /\$/], ['strict-step', />/],
  ]) if (expression.test(pattern)) features.push(name);
  return features;
}

export function auditCharacter(character) {
  const controllers = new Map(), parameters = new Map(), clauses = new Map(), symbols = new Map(), other = new Map();
  const redirections = new Map(), commandRefs = new Map(), features = new Map(), diagnostics = [];
  const references = [], stateIds = new Map(), actionIds = new Map();
  const counts = { commands: character.commands.length, uniqueCommandNames: new Set(character.commands.map(c => c.name)).size,
    stateDefinitions: character.states.filter(s => s.id !== null).length, controllers: 0, triggerClauses: 0, animations: character.animations.length };
  const expression = (value, at, findCommands = true) => {
    for (const token of identifiers(value)) {
      record(TRIGGERS.has(token) ? symbols : REDIRECTIONS.has(token) ? redirections : other, token, at);
    }
    if (findCommands) for (const match of value.matchAll(/\bcommand\s*(?:!=|=)\s*"([^"]*)"|"(?:\\.|[^"\\])*"/gi)) {
      if (match[1] !== undefined) record(commandRefs, match[1], at);
    }
  };
  const commands = character.commands.map(c => {
    const at = { source: c.source, line: c.line }, requiredFeatures = commandFeatures(c.command);
    for (const feature of requiredFeatures) record(features, feature, at);
    return { name: c.name, pattern: c.command, time: c.time, bufferTime: c.bufferTime, remap: c.remap, ...at, features: requiredFeatures };
  });
  for (const state of character.states) {
    const at = { source: state.source, line: state.line, state: state.id };
    if (state.id === null) diagnostics.push({ kind: 'orphan-controllers', ...at });
    else record(stateIds, String(state.id), at);
    for (const entry of state.entries) expression(entry.value, { ...at, line: entry.line, parameter: entry.key });
    for (const ctrl of state.controllers) {
      const type = ctrl.type.toLowerCase(), location = { ...at, line: ctrl.line };
      counts.controllers++;
      record(controllers, type, location);
      const typeEntries = ctrl.entries.filter(e => e.key === 'type');
      if (typeEntries.length > 1) diagnostics.push({ kind: 'duplicate-controller-type', ...location,
        declarations: typeEntries, importedType: type, note: 'Importer selects the last type entry; controller identity needs manual review.' });
      if (!CONTROLLERS.has(type)) diagnostics.push({ kind: 'unrecognized-controller-type', type, ...location });
      for (const entry of ctrl.entries) {
        const loc = { ...location, line: entry.line, controller: type, parameter: entry.key };
        record(parameters, `${type}.${entry.key}`, loc);
        if (entry.key === 'type') continue;
        expression(entry.value, loc);
        if (/^trigger(?:all|\d+)$/.test(entry.key)) { counts.triggerClauses++; record(clauses, entry.value, loc); }
        if ((['changestate', 'selfstate', 'targetstate'].includes(type) && entry.key === 'value') ||
            (type === 'helper' && entry.key === 'stateno') || (type === 'hitdef' && ['p1stateno', 'p2stateno'].includes(entry.key))) {
          const literal = /^[+-]?\d+$/.test(entry.value) ? Number(entry.value) : null;
          references.push({ ...loc, expression: entry.value, literal,
            scope: ['selfstate', 'targetstate'].includes(type) ? 'runtime-player-state-owner' : 'character-or-engine' });
        }
      }
    }
  }
  for (const animation of character.animations) record(actionIds, String(animation.id), { action: animation.id });
  const frames = character.animations.flatMap(a => a.frames);
  const defined = new Set(commands.map(c => c.name));
  const allRefs = inventory(commandRefs);
  return {
    directory: character.directory, name: character.name, sourceVersion: character.sourceVersion,
    selectedDef: character.selectedDef, alternateDefs: character.alternateDefs,
    dependencies: character.dependencies, parseWarnings: character.parseWarnings,
    counts: { ...counts, controllerTypes: controllers.size, triggerSymbolCandidates: symbols.size,
      referencedCommandNames: commandRefs.size, uniqueTriggerExpressions: clauses.size },
    runtimeSupport: { importedCommands: false, importedStates: false, importedControllers: false, importedTriggers: false },
    commands, commandFeatures: inventory(features), commandReferences: allRefs,
    undefinedCommandReferences: allRefs.filter(r => !defined.has(r.name)),
    controllerTypes: inventory(controllers), controllerParameters: inventory(parameters),
    triggerExpressions: inventory(clauses), triggerSymbolCandidates: inventory(symbols),
    redirectionCandidates: inventory(redirections), otherIdentifiers: inventory(other),
    specialStates: inventory(stateIds).filter(s => [-3, -2, -1].includes(Number(s.name))),
    duplicateStates: inventory(stateIds).filter(s => s.count > 1),
    duplicateAnimations: inventory(actionIds).filter(a => a.count > 1),
    stateReferences: references.map(r => ({ ...r, locallyDefined: r.literal === null ? null : stateIds.has(String(r.literal)) })),
    collisionFrames: { total: frames.length, attack: frames.filter(f => f.attackBoxes.length).length,
      hurt: frames.filter(f => f.hurtBoxes.length).length },
    diagnostics,
  };
}

export async function readCharacter(directory) {
  directory = await fs.realpath(directory);
  const defs = (await fs.readdir(directory)).filter(n => /\.def$/i.test(n)).sort();
  const selectedDef = defs.find(n => n.toLowerCase() === `${path.basename(directory).toLowerCase()}.def`) ?? (defs.length === 1 ? defs[0] : null);
  if (!selectedDef) throw new Error('Expected one DEF or a directory-matching DEF');
  const dependencies = [], parseWarnings = [], seenStates = new Set();
  async function read(key, reference) {
    try {
      const file = await resolveCharacterFile(directory, reference), bytes = await fs.readFile(file);
      const source = path.relative(directory, file).split(path.sep).join('/');
      dependencies.push({ key, reference, source, status: 'loaded', sha256: createHash('sha256').update(bytes).digest('hex') });
      return { source, text: bytes.toString('utf8') };
    } catch (error) {
      dependencies.push({ key, reference, status: 'unresolved', error: error.message,
        engineCommonCandidate: key === 'stcommon' });
      return null;
    }
  }
  const definition = await read('def', selectedDef);
  if (!definition) throw new Error('Cannot read selected DEF');
  const def = parseDef(definition.text), commands = [], states = [], constants = {}, victoryQuotes = {};
  for (const [key, reference] of Object.entries(def.files).filter(([k]) => /^(cmd|cns|st\d*|stcommon)$/.test(k))) {
    const file = await read(key, reference);
    if (!file) continue;
    if (key === 'cmd') commands.push(...parseCmd(file.text, file.source));
    if (key === 'cns') {
      Object.assign(constants, parseStates(file.text, file.source).constants);
      for (const section of parseIni(file.text).filter(s => s.name.toLowerCase() === 'quotes')) {
        for (const entry of section.entries) {
          const match = /^victory([1-9]\d*)$/.exec(entry.key);
          if (match) victoryQuotes[Number(match[1])] = entry.value.replace(/^"|"$/g, '');
        }
      }
    }
    if (seenStates.has(file.source.toLowerCase())) continue;
    seenStates.add(file.source.toLowerCase());
    states.push(...parseStates(file.text, file.source).states);
    for (const section of parseIni(file.text)) {
      if (/^statedef\b/i.test(section.name) && !/^statedef\s+-?\d+(?:\s*,.*)?$/i.test(section.name)) {
        parseWarnings.push(`${file.source}:${section.line}: Unparsed state definition [${section.name}]`);
      }
    }
    for (const [offset, raw] of file.text.split(/\r?\n/).entries()) {
      const line = stripComment(raw);
      if (line.startsWith('[') && !/^\[[^\]]+\]$/.test(line)) {
        parseWarnings.push(`${file.source}:${offset + 1}: Malformed section header: ${line}`);
      }
    }
  }
  for (const key of ['cmd', 'anim']) if (!def.files[key]) dependencies.push({ key, status: 'undeclared' });
  const air = def.files.anim ? await read('anim', def.files.anim) : null;
  const animations = air ? parseAir(air.text, parseWarnings) : [];
  return { directory: path.basename(directory), name: def.name, sourceVersion: def.sourceVersion, selectedDef,
    alternateDefs: defs.filter(d => d !== selectedDef), commands, states, animations, dependencies, parseWarnings, constants, victoryQuotes, localcoord: def.localcoord };
}

export async function auditLibrary(input = 'chars') {
  const root = await fs.realpath(input), characters = [], failures = [];
  const dirs = (await fs.readdir(root, { withFileTypes: true })).filter(e => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));
  for (const dir of dirs) {
    try { characters.push(auditCharacter(await readCharacter(path.join(root, dir.name)))); }
    catch (error) { failures.push({ directory: dir.name, error: error.message }); }
  }
  const aggregate = key => {
    const map = new Map();
    for (const c of characters) for (const item of c[key]) {
      let found = map.get(item.name);
      if (!found) { found = { name: item.name, count: 0, characters: [] }; map.set(item.name, found); }
      found.count += item.count; found.characters.push(c.directory);
    }
    return inventory(map);
  };
  return { schemaVersion: 1, limitations: LIMITATIONS, references: REFERENCES, characters, failures,
    summary: { characters: characters.length, failedCharacters: failures.length,
      controllerTypes: aggregate('controllerTypes'), triggerSymbolCandidates: aggregate('triggerSymbolCandidates'),
      commandFeatures: aggregate('commandFeatures'), redirectionCandidates: aggregate('redirectionCandidates') } };
}

export async function main(args = process.argv.slice(2)) {
  let input = 'chars', output = 'generated';
  for (let i = 0; i < args.length; i += 2) {
    if (!['--input', '--output'].includes(args[i]) || !args[i + 1]) throw new Error('Usage: audit-compatibility.mjs [--input chars] [--output generated]');
    if (args[i] === '--input') input = args[i + 1]; else output = args[i + 1];
  }
  const inputRoot = await fs.realpath(input);
  const outputRoot = await fs.realpath(output), relative = path.relative(inputRoot, outputRoot);
  if (relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))) {
    throw new Error('Audit output must not be inside source characters');
  }
  const report = await auditLibrary(inputRoot), destination = path.join(outputRoot, 'compatibility-audit.json');
  try {
    const stat = await fs.lstat(destination);
    if (!stat.isFile() || stat.nlink > 1) throw new Error('Unsafe audit output file');
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  await fs.writeFile(destination, `${JSON.stringify(report, null, 2)}\n`);
  console.table(report.characters.map(c => ({ character: c.name, commands: c.counts.commands, states: c.counts.stateDefinitions,
    controllers: c.counts.controllers, types: c.counts.controllerTypes, triggers: c.counts.triggerSymbolCandidates,
    unresolved: c.dependencies.filter(d => d.status !== 'loaded').length, diagnostics: c.diagnostics.length })));
  console.log(`Static inventory only; no imported moves validated. Report: ${destination}`);
  for (const failure of report.failures) console.error(`${failure.directory}: ${failure.error}`);
  if (report.failures.length) process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
