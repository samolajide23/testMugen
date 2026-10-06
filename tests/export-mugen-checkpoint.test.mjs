import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCharacter } from '../tools/audit-compatibility.mjs';
import { buildCoinyCheckpoint, checkpointToLuau, exportMugenCheckpoint } from '../tools/export-mugen-checkpoint.mjs';
const source = fileURLToPath(new URL('../chars/coiny', import.meta.url));
const character = await readCharacter(source);
const normalIds = [200, 210, 220, 400, 410, 420, 600, 610, 620];
const transitionLines = [1017, 1027, 1039, 1052, 1062, 1074, 1088, 1097, 1108];
async function outputDirectory(t) {
  const output = fileURLToPath(new URL(`../.export-checkpoint-test-${randomUUID()}`, import.meta.url));
  await fs.mkdir(output);
  t.after(() => fs.rm(output, { recursive: true, force: true }));
  return output;
}

test('exports original human transitions in source order, not AI alternatives', () => {
  const { config, report } = buildCoinyCheckpoint(character);
  const commandState = config.states.find(s => s.id === -1);
  const normals = commandState.controllers.filter(c => transitionLines.includes(c.line));
  assert.deepEqual(normals.map(c => c.line), transitionLines);
  assert.deepEqual(normals.map(c => Number(c.entries.find(e => e.key === 'value').value)), normalIds);
  assert.deepEqual(commandState.controllers.map(c => c.line), [...commandState.controllers.map(c => c.line)].sort((a, b) => a - b));
  for (const id of [1000, 1020, 3000, 3010, 100, 105, 195]) assert.ok(commandState.controllers.some(c => c.entries.some(e => e.key === 'value' && e.value === String(id))));
  assert.equal(commandState.controllers.filter(c => c.type.toLowerCase() === 'varset').length, 2);
  for (const c of commandState.controllers) assert.deepEqual(c.entries, character.states.find(s => s.id === -1).controllers.find(original => original.line === c.line).entries);
  assert.deepEqual(new Set(config.commands.map(c => c.name)), new Set(['x', 'y', 'z', 'holddown', 'Special1', 'Special2', 'Hyper1', 'Hyper2', 'FF', 'BB', 's', 'recovery']));
  assert.equal(config.commands.find(c => c.name === 'holddown').command, '/$D');
  assert.equal(report.selectedControllers.length + report.excludedControllers.length, character.states.reduce((n, s) => n + s.controllers.length, 0));
  assert.deepEqual(report.selectedStates.filter(s => normalIds.includes(s.id)).map(s => s.id), normalIds);
  for (const id of [1000, 1020, 3000, 3010, 3011, 3012, 195, 180, 181]) {
    assert.ok(report.selectedStates.some(s => s.id === id));
    assert.ok(!report.excludedStates.some(s => s.id === id));
  }
  assert.ok(report.limitations.some(s => s.includes('Coiny player gameplay checkpoint')));
  assert.equal(report.excludedCommands.length + report.selectedCommands.length, character.commands.length);
  assert.ok(report.excludedControllers.some(c => c.line === 833));
});
test('preserves state parameters and complete controller entries without manual attacks', () => {
  const { config } = buildCoinyCheckpoint(character);
  for (const id of [...normalIds, 1000, 1020, 3000, 3010, 3011, 3012, 195, 180, 181]) {
    const original = character.states.find(s => s.id === id), exported = config.states.find(s => s.id === id);
    assert.deepEqual(exported.entries, original.entries);
    assert.deepEqual(exported.controllers.map(c => c.entries), original.controllers.map(c => c.entries));
    assert.deepEqual(exported.controllers.map(c => [c.type, c.source, c.line]), original.controllers.map(c => [c.type, c.source, c.line]));
    assert.equal(exported.source, original.source);
  }
  assert.deepEqual(config.deferredControllers, ['playsnd']);
  assert.equal(config.combat.winState, 180);
  assert.equal(config.combat.common.movement.runForward, 4.6);
  assert.equal(config.combat.common.movement.runBackX, -4.5);
  assert.equal(config.combat.common.movement.runBackY, -3.8);
  assert.equal(config.combat.life, 1000);
  assert.equal(config.combat.xscale, 0.2);
  assert.equal(config.combat.yscale, 0.2);
  assert.equal(config.combat.attack, 100);
  assert.equal(config.combat.defence, 100);
  assert.deepEqual(config.combat.localcoord, [320, 240]);
  assert.equal(config.states.find(s => s.id === 5000).source, '<host:checkpoint-hit>');
  assert.equal(config.states.find(s => s.id === 150).source, '<host:checkpoint-guard>');
  assert.equal(config.states[0].source, '<host:checkpoint-idle>');
});
test('exports original visual globals, intro/lose states and self effect artwork without audio execution', () => {
  const { config, report } = buildCoinyCheckpoint(character);
  assert.deepEqual(config.combat.victoryQuotes, character.victoryQuotes);
  assert.equal(Object.keys(config.combat.victoryQuotes).length, 11);
  assert.equal(config.combat.introState, 190);
  assert.equal(config.combat.loseState, 170);
  const exportedController = ({ type, source, line, entries }) => ({ type, source, line, entries });
  for (const id of [170, 190, 191, 192]) {
    const original = character.states.find(s => s.id === id);
    const exported = config.states.find(s => s.id === id);
    assert.deepEqual(exported.controllers, original.controllers.map(exportedController));
    assert.deepEqual(exported.entries, original.entries);
  }
  for (const [id, types] of [[-2, ['explod', 'assertspecial', 'victoryquote']], [-3, ['angledraw']]]) {
    const original = character.states.find(s => s.id === id);
    assert.deepEqual(config.states.find(s => s.id === id).controllers,
      original.controllers.filter(c => types.includes(c.type.toLowerCase())).map(exportedController));
  }
  for (const id of [170, 190, 191, 3999, 4050]) {
    assert.deepEqual(config.animations.find(a => a.id === id).frames, character.animations.find(a => a.id === id).frames);
    assert.ok(!report.animationFallbacks.some(a => a.id === id));
    const changed = structuredClone(character);
    changed.animations = changed.animations.filter(a => a.id !== id);
    assert.throws(() => buildCoinyCheckpoint(changed), new RegExp(`AIR action ${id}`));
  }
  assert.deepEqual(config.deferredControllers, ['playsnd']);
});
test('preserves AIR frames, hitboxes and durations; converts indices once', () => {
  const { config } = buildCoinyCheckpoint(character);
  for (const exported of config.animations) {
    const original = character.animations.find(a => a.id === exported.id) ?? character.animations.find(a => a.id === 0);
    assert.deepEqual(exported.frames, original.frames);
    assert.deepEqual(exported.durations, original.frames.map(f => f.duration));
    assert.equal(exported.loopStart, original.loopStart + 1);
  }
  assert.deepEqual(config.animations.filter(a => normalIds.includes(a.id)).map(a => a.id), normalIds);
  assert.deepEqual(config.animations.filter(a => character.animations.some(original => original.id === a.id)).map(a => a.id), character.animations.filter(a => config.animations.some(exported => exported.id === a.id)).map(a => a.id));
  assert.deepEqual(config.animations.find(a => a.id === 200).durations, [4, 4, 7]);
  assert.deepEqual(config.animations.find(a => a.id === 220).durations, [5, 10]);
});
test('all nine normal states and human transitions reject missing or duplicate definitions', () => {
  for (const id of normalIds) {
    for (const duplicate of [false, true]) {
      const c = structuredClone(character);
      if (duplicate) c.states.push(c.states.find(s => s.id === id));
      else c.states = c.states.filter(s => s.id !== id);
      assert.throws(() => buildCoinyCheckpoint(c), new RegExp(`Expected exactly one state ${id}; found ${duplicate ? 2 : 0}`));
    }
  }
  for (const [index, line] of transitionLines.entries()) {
    for (const duplicate of [false, true]) {
      const c = structuredClone(character), special = c.states.find(s => s.id === -1);
      if (duplicate) special.controllers.push(special.controllers.find(controller => controller.line === line));
      else special.controllers = special.controllers.filter(controller => controller.line !== line);
      assert.throws(() => buildCoinyCheckpoint(c), new RegExp(`human [xyz] transition to ${normalIds[index]}; found ${duplicate ? 2 : 0}`));
    }
  }
  for (const name of ['x', 'y', 'z', 'holddown']) {
    const c = structuredClone(character); c.commands = c.commands.filter(command => command.name !== name);
    assert.throws(() => buildCoinyCheckpoint(c), new RegExp(`Missing command ${name}`));
  }
});
test('every required AIR action rejects missing or duplicate definitions instead of falling back', () => {
  for (const id of [0, ...normalIds, 150, 5000, 5001, 5002, 5010, 5011, 5012]) {
    for (const duplicate of [false, true]) {
      const c = structuredClone(character);
      if (duplicate) c.animations.push(c.animations.find(a => a.id === id));
      else c.animations = c.animations.filter(a => a.id !== id);
      assert.throws(() => buildCoinyCheckpoint(c), new RegExp(`Expected exactly one AIR action ${id}; found ${duplicate ? 2 : 0}`));
    }
  }
});
test('preserves authored state, command, controller and AIR order without mutating source data', () => {
  const c = structuredClone(character);
  c.states.reverse(); c.commands.reverse(); c.animations.reverse();
  for (const state of c.states) state.controllers.reverse();
  const before = structuredClone(c);
  const { config, report } = buildCoinyCheckpoint(c);
  assert.deepEqual(c, before);
  assert.deepEqual(config.states.filter(s => normalIds.includes(s.id)).map(s => s.id), [...normalIds].reverse());
  assert.deepEqual(config.commands.map(command => command.name), c.commands.filter(command => config.commands.some(exported => exported.name === command.name)).map(command => command.name));
  assert.deepEqual(config.states.find(s => s.id === -1).controllers.filter(controller => transitionLines.includes(controller.line)).map(controller => controller.line), [...transitionLines].reverse());
  for (const id of normalIds) {
    assert.deepEqual(config.states.find(s => s.id === id).controllers.map(controller => controller.entries), c.states.find(s => s.id === id).controllers.map(controller => controller.entries));
  }
  assert.deepEqual(config.animations.filter(a => character.animations.some(original => original.id === a.id)).map(a => a.id), c.animations.filter(a => config.animations.some(exported => exported.id === a.id)).map(a => a.id));
  assert.deepEqual(report.selectedControllers.map(controller => controller.line), c.states.flatMap(state => state.controllers.filter(controller => report.selectedControllers.some(selected => selected.state === state.id && selected.line === controller.line)).map(controller => controller.line)));
  config.states.find(s => s.id === 400).entries[0].value = 'changed';
  config.states.find(s => s.id === 600).controllers[0].entries[0].value = 'changed';
  config.animations.find(a => a.id === 620).frames[0].duration = 999;
  assert.deepEqual(c, before);
});
test('missing constants, reaction frames and conflicting shared states reject', () => {
  for (const mutate of [c => delete c.constants.size.xscale, c => c.constants.data.life = 'var(0)', c => delete c.constants.movement['crouch.friction'], c => c.constants.movement['crouch.friction'] = 'var(0)', c => c.constants.movement['crouch.friction'] = '-0.1', c => c.animations = c.animations.filter(a => a.id !== 5001), c => c.states.push({ id: 5000 })]) {
    const c = structuredClone(character); mutate(c); assert.throws(() => buildCoinyCheckpoint(c));
  }
});
test('exports standard movement constants and explicit common states without inventing speeds', () => {
  const { config, report } = buildCoinyCheckpoint(character);
  const common = config.combat.common;
  assert.equal(common.movement.walkForward, 2.4);
  assert.equal(common.movement.walkBack, -2.2);
  assert.deepEqual(common.movement.jump, { x: 0, y: -8.4 });
  assert.deepEqual(common.movement.airJump, { x: 0, y: -8.1 });
  assert.equal(common.movement.airJumpNum, 0);
  assert.equal(common.movement.gravity, 0.44);
  assert.equal(common.movement.crouchFriction, 0.82);
  assert.equal(config.friction, Number(character.constants.movement['stand.friction']));
  assert.equal(config.crouchFriction, Number(character.constants.movement['crouch.friction']));
  const changed = structuredClone(character);
  changed.constants.movement['stand.friction'] = '0.91';
  changed.constants.movement['crouch.friction'] = '0.73';
  const distinct = buildCoinyCheckpoint(changed).config;
  assert.equal(distinct.friction, 0.91);
  assert.equal(distinct.crouchFriction, 0.73);
  assert.equal(distinct.combat.common.movement.standFriction, distinct.friction);
  assert.equal(distinct.combat.common.movement.crouchFriction, distinct.crouchFriction);
  assert.equal(common.reactions.liedownTime, 60);
  assert.deepEqual(common.size, { groundBack: 11, groundFront: 8, height: 60 });
  for (const id of [10, 11, 12, 20, 40, 50, 52, 151, 152, 5020, 5030, 5050, 5100, 5110, 5120, 5150]) {
    assert.ok(config.states.find(s => s.id === id).source.startsWith('<host:'));
  }
  assert.deepEqual(report.animationFallbacks.map(a => a.id), [106]);
});
test('optional standard action fallback is explicit, cloned and does not mask ambiguity', () => {
  const c = structuredClone(character); c.animations = c.animations.filter(a => a.id !== 5150);
  const { config, report } = buildCoinyCheckpoint(c);
  assert.ok(report.animationFallbacks.some(a => a.id === 5150));
  assert.deepEqual(config.animations.find(a => a.id === 5150).frames, c.animations.find(a => a.id === 0).frames);
  config.animations.find(a => a.id === 5150).frames[0].duration = 999;
  assert.notEqual(c.animations.find(a => a.id === 0).frames[0].duration, 999);
  for (const mutate of [c => c.constants.velocity['jump.neu'] = '0,var(0)', c => c.constants.movement['airjump.num'] = '1.5', c => c.states.push({ id: 50 }), c => c.animations.push(c.animations.find(a => a.id === 10))]) {
    const c = structuredClone(character); mutate(c); assert.throws(() => buildCoinyCheckpoint(c));
  }
});
test('serialized arrays use numeric indices and strings cannot inject code', () => {
  assert.match(checkpointToLuau([true, '"\n\\']), /\[1\] = true/);
  assert.match(checkpointToLuau([true, '"\n\\']), /\[2\] = "\\034\\010\\092"/);
  for (const value of [undefined, null, NaN, Infinity]) assert.throws(() => checkpointToLuau(value));
});
test('export is deterministic, preserves originals and records source hashes and omissions', async t => {
  const output = await outputDirectory(t);
  await exportMugenCheckpoint(source, output);
  const module = path.join(output, 'luau', 'coiny-checkpoint.luau');
  const first = await fs.readFile(module, 'utf8');
  const { report } = await exportMugenCheckpoint(source, output);
  assert.equal(await fs.readFile(module, 'utf8'), first);
  assert.deepEqual((await readCharacter(source)).dependencies, character.dependencies);
  assert.ok(report.dependencies.some(d => d.sha256?.length === 64));
  assert.ok(report.selectedStates.some(s => s.id === -2));
  assert.ok(report.excludedControllers.some(c => c.state === -2 && c.type.toLowerCase() === 'playsnd'));
  assert.ok(report.limitations.some(s => s.includes('MugenCombat resolves')));
  assert.ok(report.limitations.some(s => s.includes('PlaySnd/audio is deferred')));
  const saved = JSON.parse(await fs.readFile(path.join(output, 'luau', 'coiny-checkpoint-report.json'), 'utf8'));
  assert.deepEqual(saved, report);
});
test('generated records preserve all config data and strict analysis finishes within the timeout', async t => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const tool = name => path.join(root, '.tools', 'luau-0.741', name + (process.platform === 'win32' ? '.exe' : ''));
  try { await fs.access(tool('luau')); await fs.access(tool('luau-analyze')); }
  catch { t.skip('Official local Luau CLIs unavailable'); return; }
  const output = await outputDirectory(t);
  const { config } = await exportMugenCheckpoint(source, output);
  const module = path.join(output, 'luau', 'coiny-checkpoint.luau');
  const run = (cli, file) => {
    const result = spawnSync(tool(cli), [file], { cwd: root, encoding: 'utf8', timeout: 30000 });
    assert.equal(result.status, 0, result.stdout + result.stderr + (result.error?.message ?? ''));
  };
  run('luau-analyze', module);
  const probe = path.join(output, 'luau', 'compare.luau');
  await fs.writeFile(probe, `local actual = require('./coiny-checkpoint')
local expected = ${checkpointToLuau(config)}
local function equal(a: any, b: any)
  assert(type(a) == type(b))
  if type(a) == 'table' then
    for key, value in pairs(a) do equal(value, b[key]) end
    for key in pairs(b) do assert(a[key] ~= nil) end
  else
    assert(a == b)
  end
end
equal(actual, expected)
`);
  run('luau', probe);
});
test('rejects source-tree destinations and linked output files', async t => {
  await assert.rejects(exportMugenCheckpoint(source, source), /outside source/);
  const output = await outputDirectory(t);
  await fs.mkdir(path.join(output, 'luau'));
  const sentinel = path.join(output, 'sentinel'); await fs.writeFile(sentinel, 'untouched');
  await fs.link(sentinel, path.join(output, 'luau', 'coiny-checkpoint.luau'));
  await assert.rejects(exportMugenCheckpoint(source, output), /Unsafe checkpoint/);
  assert.equal(await fs.readFile(sentinel, 'utf8'), 'untouched');
});
