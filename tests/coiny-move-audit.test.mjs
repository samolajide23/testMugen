import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { readCharacter } from '../tools/audit-compatibility.mjs';
import { buildCoinyCheckpoint, checkpointToLuau } from '../tools/export-mugen-checkpoint.mjs';
import { buildCoinyMoveAudit } from '../tools/audit-coiny-moves.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const character = await readCharacter(path.join(root, 'chars', 'coiny'));
const checkpoint = buildCoinyCheckpoint(character);

test('counts move entry points rather than AI commands or linked states', () => {
  const report = buildCoinyMoveAudit(character, checkpoint.report);
  assert.deepEqual(report.counts, { commandDefinitions: 116, stateDefinitions: 25, controllerBlocks: 121,
    humanAttackEntryPoints: 13, attackStates: 15, includedAttackEntryPoints: 13, remainingAttackEntryPoints: 0 });
  assert.deepEqual(report.moves.find(m => m.id === 'slap-combo').states.map(s => s.id), [3010, 3011, 3012]);
  assert.equal(report.auxiliaryStates.find(s => s.id === 195).controllers[0].type.toLowerCase(), 'playsnd');
});
test('preserves source transition conditions, timings and hidden hit-confirm path', () => {
  const report = buildCoinyMoveAudit(character, checkpoint.report);
  for (const move of report.moves) {
    const original = character.states.find(s => s.id === -1).controllers.find(c => c.line === move.transition.line);
    assert.deepEqual(move.transition.entries, original.entries);
    assert.ok(move.states.every(s => s.actions.every(a => a.definitions === 1 && a.frames > 0)));
  }
  const roll = report.moves.find(m => m.id === 'roll');
  assert.equal(roll.commandDefinitions.length, 3);
  assert.deepEqual(roll.commandDefinitions.map(c => c.pattern), ['~D, DF, F, x', '~D, DF, F, y', '~D, DF, F, z']);
  assert.ok(roll.requirements.includes('combo-variable-shorthand'));
  const slap = report.moves.find(m => m.id === 'slap-combo');
  assert.ok(slap.states[0].controllers.some(c => c.parameters.some(e => e.key === 'p1stateno' && e.value === '3011')));
  assert.ok(report.unreferencedCommandNames.includes('SSpecial1'));
  assert.ok(report.unreferencedCommandNames.includes('SSpecial2'));
});
test('every move requirement has an implementation batch and acceptance criteria', () => {
  const report = buildCoinyMoveAudit(character, checkpoint.report);
  assert.equal(new Set(report.backlog.map(b => b.id)).size, report.backlog.length);
  for (const move of report.moves) for (const id of move.requirements) {
    const item = report.backlog.find(b => b.id === id);
    assert.ok(item?.batch > 0 && item.acceptance.length > 20);
  }
  assert.ok(report.dependencies.some(d => d.key === 'stcommon' && d.status === 'unresolved'));
});
test('ambiguous states and transitions reject rather than fabricate a move inventory', () => {
  const c = structuredClone(character); c.states.push(c.states.find(s => s.id === 620));
  assert.throws(() => buildCoinyMoveAudit(c, checkpoint.report), /state 620/);
  const d = structuredClone(character); d.states.find(s => s.id === -1).controllers = [];
  assert.throws(() => buildCoinyMoveAudit(d, checkpoint.report), /human transition/);
});
test('audit is deterministic and leaves source data and checkpoint untouched', () => {
  const original = JSON.stringify([character, checkpoint]);
  const a = buildCoinyMoveAudit(character, checkpoint.report), b = buildCoinyMoveAudit(character, checkpoint.report);
  assert.deepEqual(a, b);
  assert.equal(JSON.stringify([character, checkpoint]), original);
});
test('actual Luau compiler confirms all source attack states and implemented controllers', async t => {
  const cli = path.join(root, '.tools', 'luau-0.741', process.platform === 'win32' ? 'luau.exe' : 'luau');
  try { await fs.access(cli); } catch { t.skip('Official local Luau CLI unavailable'); return; }
  const directory = await fs.mkdtemp(path.join(root, 'tests', '.coiny-audit-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const probes = [];
  const state = id => character.states.find(s => s.id === id);
  for (const id of [400, 410, 420, 600, 610, 620, 1000]) {
    const config = structuredClone(checkpoint.config);
    config.states = config.states.filter(s => s.id !== id);
    config.states.push(state(id));
    const action = character.animations.find(a => a.id === id);
    config.animations = config.animations.filter(a => a.id !== id);
    config.animations.push({ id, loopStart: action.loopStart + 1, durations: action.frames.map(f => f.duration) });
    probes.push({ id, config, succeeds: true });
  }
  const params = c => Object.fromEntries(c.entries.filter(e => !/^trigger|^type$/i.test(e.key)).map(e => [e.key, e.value]));
  const confirm = params(state(3010).controllers.find(c => c.type.toLowerCase() === 'hitdef'));
  const finisher = params(state(3012).controllers.filter(c => c.type.toLowerCase() === 'hitdef').at(-1));
  const reset = state(-1).controllers.find(c => c.type.toLowerCase() === 'varset' && c.entries.some(e => e.key === 'var(1)'));
  const lua = `local State=require('../../runtime/MugenState')
local HitDef=require('../../runtime/MugenHitDef')
local Commands=require('../../runtime/MugenCommands')
local probes=${checkpointToLuau(probes)}
for _,probe in probes do
 State.compile(probe.config); print('compiles source state '..probe.id)
end
HitDef.compile(${checkpointToLuau(confirm)})
HitDef.compile(${checkpointToLuau(finisher)})
local config=${checkpointToLuau(checkpoint.config)}
local commandState
for _,state in config.states do if state.id==-1 then commandState=state end end
commandState.controllers={${checkpointToLuau(reset)}}
State.compile(config)
Commands.compile({{name='Hyper1',command='x+y',time=1,bufferTime=1}})
Commands.compile({{name='Special1',command='~D, DF, F, x',time=15,bufferTime=1}})
commandState.controllers={{type='VarSet',entries={{key='v',value='0'},{key='value',value='numhelper'},{key='trigger1',value='1'}}}}
local program=State.compile(config)
assert(State.step(program,State.new(program),{}).vars[0]==0)
for _,controller in ${checkpointToLuau([state(1020).controllers.find(c => c.type.toLowerCase() === 'projectile'), state(3000).controllers.find(c => c.type.toLowerCase() === 'superpause')])} do
 commandState.controllers={controller}
 local p=State.compile(config); State.step(p,State.new(p),{})
end
local projectile=${checkpointToLuau(params(state(1020).controllers.find(c => c.type.toLowerCase() === 'projectile')))}
for _,key in {'air.juggle','air.fall','down.velocity','down.hittime','down.bounce'} do
 HitDef.compile({attr='S, SP',[key]=projectile[key]})
end
HitDef.compile({attr='S, SP',['air.animtype']=projectile['air.animtype']})
print('source-based audit probes passed')
`;
  const file = path.join(directory, 'probe.luau'); await fs.writeFile(file, lua);
  const result = spawnSync(cli, [file], { cwd: root, encoding: 'utf8', timeout: 30000 });
  assert.equal(result.status, 0, result.stdout + result.stderr + (result.error?.message ?? ''));
  assert.match(result.stdout, /source-based audit probes passed/);
});
