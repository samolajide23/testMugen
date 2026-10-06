import test from 'node:test';
import assert from 'node:assert/strict';
import { readCharacter } from '../tools/audit-compatibility.mjs';
import { buildPikachuCheckpoint } from '../tools/export-mugen-checkpoint.mjs';
const character = await readCharacter('chars\\Pikachu');
const ids = [200,210,220,230,240,250,400,410,420,600,610];
test('Pikachu slice retains source gameplay, human commands and explicit exclusions', () => {
  const before = structuredClone(character);
  const { config, report } = buildPikachuCheckpoint(character);
  assert.deepEqual(character, before);
  for (const id of ids) {
    const original = character.states.find(s => s.id === id);
    const selected = config.states.find(s => s.id === id);
    assert.deepEqual(selected.entries, original.entries);
    assert.deepEqual(selected.controllers.map(c => c.entries), original.controllers
      .filter(c => !report.presentationOmissions.some(o => o.source === c.source && o.line === c.line)).map(c => c.entries));
  }
  assert.deepEqual(config.commands.map(c => c.name).sort(), ['BB','FF','a','b','holddown','recovery','x','y']);
  assert.equal(config.permissiveParameters, true);
  assert.equal(config.combat.introState, undefined);
  assert.equal(config.combat.winState, undefined);
  assert.ok(!config.states.some(s => s.id === 620));
  assert.ok(report.routes.find(r => r.state === 620).blockers.some(b => b.reason.includes('controller types')));
  for (const state of [1000,1010,1020]) assert.ok(report.routes.find(r => r.state === state).supported);
  for (const state of [3000,4000]) assert.ok(!report.routes.find(r => r.state === state).supported);
  assert.ok(report.duplicateParameters.some(p => p.state === 200 && p.parameter === 'ground.velocity' && p.retained === '-3'));
  assert.ok(report.deferredPresentationParameters.some(p => p.parameter === 'palfx.sinadd'));
  assert.equal(report.selectedControllers.length + report.excludedControllers.length,
    character.states.reduce((sum,s) => sum + s.controllers.length,0));
  assert.ok(report.excludedControllers.some(c => c.state === 200 && c.type === 'PalFX'));
  for (const route of config.states.find(s => s.id === -1).controllers) {
    assert.ok(report.routes.some(r => r.supported && r.line === route.line));
    assert.deepEqual(route.entries, character.states.find(s => s.id === -1).controllers.find(c => c.line === route.line).entries);
  }
  for (const animation of config.animations) {
    const original = character.animations.find(a => a.id === animation.id);
    if (original) assert.deepEqual(animation.frames, original.frames);
    else assert.ok(report.animationFallbacks.some(f => f.id === animation.id));
  }
});
test('Pikachu discovery blocks incomplete state graphs and rejects missing required AIR', () => {
  for (const id of ids) {
    const missing = structuredClone(character);
    missing.states = missing.states.filter(s => s.id !== id);
    const { config, report } = buildPikachuCheckpoint(missing);
    assert.ok(!config.states.some(s => s.id === id));
    assert.ok(report.routes.some(r => !r.supported && r.blockers.some(b => b.reason === `Missing or ambiguous state ${id}`)));
  }
  const missing = structuredClone(character);
  missing.animations = missing.animations.filter(a => a.id !== 500);
  const { config, report } = buildPikachuCheckpoint(missing);
  assert.ok(!config.states.some(s => s.id === 420));
  assert.ok(report.routes.find(r => r.state === 420).blockers.some(b => b.reason.includes('AIR 500')));
});
