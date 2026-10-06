import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { parseCmd, parseStates, parseAir } from '../tools/mugen-import.mjs';
import { auditCharacter, auditLibrary, readCharacter, identifiers, commandFeatures, main } from '../tools/audit-compatibility.mjs';

function fixture(text = '') {
  return { directory: 'sample', name: 'Sample', sourceVersion: '1.0', selectedDef: 'sample.def', alternateDefs: [],
    dependencies: [], parseWarnings: [], commands: parseCmd(text, 'sample.cmd'), states: parseStates(text, 'sample.cmd').states,
    animations: parseAir('[Begin Action 200]\nClsn1: 1\nClsn1[0] = 0,-10,20,0\n0,0,0,0,3') };
}
const source = `[Defaults]
command.time = 20
command.buffer.time = 3
[Remap]
a = b
[Command]
name = "punch"
command = ~30D, $DF, /F, >a+b
[Command]
name = "punch"
command = x
[Statedef -1]
[State -1, input]
type = ChangeState
triggerall = command = "punch"
trigger1 = ctrl
trigger1 = statetype != A
trigger2 = movecontact && var(2) > 0
value = 200
[Statedef 200]
anim = 200 + var(1)
[State 200, active]
type = HitDef
trigger1 = AnimElem = 2
attr = S, NA
damage = ifelse(var(1), 30, 20)
p2stateno = 5000
[State 200, exit]
type = ChangeState
trigger1 = AnimTime = 0
value = ifelse(pos y < 0, 50, 0)
`;

test('inventory retains command alternatives, timings, remaps, trigger groups and source lines', () => {
  const input = fixture(source), before = structuredClone(input), report = auditCharacter(input);
  assert.deepEqual(input, before);
  assert.equal(report.counts.commands, 2);
  assert.equal(report.counts.uniqueCommandNames, 1);
  assert.equal(report.counts.controllers, 3);
  assert.equal(report.counts.triggerClauses, 6);
  assert.equal(report.commands[0].time, '20');
  assert.equal(report.commands[0].bufferTime, '3');
  assert.deepEqual(report.commands[0].remap, { a: 'b' });
  assert.equal(report.commandReferences[0].name, 'punch');
  assert.equal(report.undefinedCommandReferences.length, 0);
  assert.ok(report.triggerExpressions.find(x => x.name === 'ctrl').samples[0].line > 0);
  assert.equal(report.triggerExpressions.find(x => x.name === 'ctrl').samples[0].parameter, 'trigger1');
  assert.ok(report.triggerSymbolCandidates.some(x => x.name === 'ifelse'));
  assert.equal(report.collisionFrames.attack, 1);
  assert.equal(report.runtimeSupport.importedControllers, false);
  assert.deepEqual(report, auditCharacter(input));
});

test('command syntax inventory includes releases, charge, holds, diagonals and chords', () => {
  assert.deepEqual(commandFeatures('~30D, $DF, /F, >a+b'), [
    'sequence', 'simultaneous-buttons', 'hold', 'release', 'charge-duration', 'direction-wildcard', 'strict-step',
  ]);
  assert.deepEqual(commandFeatures('x'), []);
});

test('lexical candidates exclude quoted names, exponents and dotted constant fields', () => {
  assert.deepEqual(identifiers('ifelse(command = "Time MoveHit", 1e-3, const(velocity.walk.fwd))'),
    ['ifelse', 'command', 'const', 'velocity.walk.fwd']);
  const report = auditCharacter(fixture('[Statedef 0]\n[State 0]\ntype = Null\ntrigger1 = parent, var(0)\nvalue = "time"'));
  assert.equal(report.redirectionCandidates[0].name, 'parent');
  assert.ok(!report.triggerSymbolCandidates.some(x => x.name === 'time'));
});

test('command references inside expressions are checked case-sensitively without reading string content', () => {
  const report = auditCharacter(fixture(source + '[State 200]\ntype = Null\ntrigger1 = command != "Punch"\ntext = "command = fake"'));
  assert.deepEqual(report.undefinedCommandReferences.map(x => x.name), ['Punch']);
  assert.equal(report.commandReferences.length, 2);
});

test('literal and dynamic state destinations are distinguished without claiming missing states are broken', () => {
  const report = auditCharacter(fixture(source));
  assert.equal(report.stateReferences[0].literal, 200);
  assert.equal(report.stateReferences[0].locallyDefined, true);
  assert.equal(report.stateReferences[1].literal, 5000);
  assert.equal(report.stateReferences[1].locallyDefined, false);
  assert.equal(report.stateReferences[2].literal, null);
  assert.equal(report.stateReferences[2].locallyDefined, null);
  assert.equal(report.specialStates[0].name, '-1');
});

test('duplicate type declarations and unknown controller identities remain explicit diagnostics', () => {
  const report = auditCharacter(fixture('[Statedef 0]\n[State 0]\ntype = StateTypeSet\ntrigger1 = 1\ntype = L'));
  assert.equal(report.diagnostics[0].kind, 'duplicate-controller-type');
  assert.deepEqual(report.diagnostics[0].declarations.map(e => e.value), ['StateTypeSet', 'L']);
  assert.equal(report.diagnostics[1].kind, 'unrecognized-controller-type');
  assert.equal(report.controllerTypes[0].name, 'l');
});

test('duplicate states/actions and orphan controllers are reported rather than silently resolved', () => {
  const input = fixture('[State stray]\ntype = Null\n[Statedef 0]\n[Statedef 0]');
  input.animations.push(structuredClone(input.animations[0]));
  const report = auditCharacter(input);
  assert.equal(report.counts.stateDefinitions, 2);
  assert.equal(report.duplicateStates[0].count, 2);
  assert.equal(report.duplicateAnimations[0].count, 2);
  assert.equal(report.diagnostics[0].kind, 'orphan-controllers');
});

async function library(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'rift-audit-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const input = path.join(root, 'chars'), folder = path.join(input, 'sample'), output = path.join(root, 'generated');
  await fs.mkdir(folder, { recursive: true }); await fs.mkdir(output);
  await fs.writeFile(path.join(folder, 'sample.def'), '[Info]\nname = Sample\n[Files]\ncns = player.cmd\ncmd = PLAYER.CMD\nst = player.cmd\nstcommon = common1.cns\nanim = player.air');
  await fs.writeFile(path.join(folder, 'alternate.def'), '[Info]\nname = Excluded');
  await fs.writeFile(path.join(folder, 'player.cmd'), source);
  await fs.writeFile(path.join(folder, 'player.air'), '[Begin Action 0]\n-1,0,0,0,-1');
  return { input, folder, output };
}

test('reads original files, deduplicates shared state dependencies, and retains CMD declarations', async t => {
  const { input, folder } = await library(t);
  let report = await auditLibrary(input);
  const c = report.characters[0];
  assert.deepEqual(c.alternateDefs, ['alternate.def']);
  assert.equal(c.counts.commands, 2);
  assert.equal(c.counts.stateDefinitions, 2);
  assert.equal(c.dependencies.find(d => d.key === 'stcommon').engineCommonCandidate, true);
  assert.equal(c.dependencies.find(d => d.key === 'cmd').sha256.length, 64);
  const hash = c.dependencies.find(d => d.key === 'cmd').sha256;
  await fs.appendFile(path.join(folder, 'player.cmd'), '\n[Statedef 999]\n');
  report = await auditLibrary(input);
  assert.equal(report.characters[0].counts.stateDefinitions, 3);
  assert.notEqual(report.characters[0].dependencies.find(d => d.key === 'cmd').sha256, hash);
});

test('reads source victory text without interpreting quotes as executable state data', async t => {
  const { folder } = await library(t);
  await fs.appendFile(path.join(folder, 'player.cmd'), '\n[Quotes]\nVictory1 = "Good match; well played." ; note\nvictory10 = "Again?"\ninvalid = "Ignored"\n');
  const character = await readCharacter(folder);
  assert.deepEqual(character.victoryQuotes, { 1: 'Good match; well played.', 10: 'Again?' });
});

test('unresolved escaping references and malformed state headers are reported', async t => {
  const { folder } = await library(t);
  await fs.appendFile(path.join(folder, 'sample.def'), '\nst1 = ../outside.cns');
  await fs.appendFile(path.join(folder, 'player.cmd'), '\n[Statedef abc]\n[State 200, Missing bracket\ntype = Null\n[Statedef 201, Label]\n');
  const c = await readCharacter(folder);
  assert.equal(c.dependencies.find(d => d.key === 'st1').status, 'unresolved');
  assert.ok(c.parseWarnings.some(w => w.includes('Unparsed state definition')));
  assert.ok(c.parseWarnings.some(w => w.includes('Malformed section header')));
  assert.ok(c.states.some(s => s.id === 201));
});

test('ambiguous definitions fail visibly rather than omitting a character', async t => {
  const { input, folder } = await library(t);
  await fs.rename(path.join(folder, 'sample.def'), path.join(folder, 'third.def'));
  const report = await auditLibrary(input);
  assert.equal(report.characters.length, 0);
  assert.equal(report.failures.length, 1);
  assert.equal(report.summary.failedCharacters, 1);
});

test('CLI persists deterministic report without touching source files or existing preview data', async t => {
  const { input, folder, output } = await library(t);
  const before = await fs.readFile(path.join(folder, 'player.cmd'));
  await fs.writeFile(path.join(output, 'characters.json'), 'unchanged');
  await main(['--input', input, '--output', output]);
  const text = await fs.readFile(path.join(output, 'compatibility-audit.json'), 'utf8');
  assert.deepEqual(JSON.parse(text), await auditLibrary(input));
  assert.deepEqual(await fs.readFile(path.join(folder, 'player.cmd')), before);
  assert.equal(await fs.readFile(path.join(output, 'characters.json'), 'utf8'), 'unchanged');
  await assert.rejects(main(['--input', input, '--output', folder]), /must not be inside/);
  await assert.rejects(main(['--unknown', 'value']), /Usage/);
});
