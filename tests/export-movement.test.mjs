import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { buildMovementConfig, exportMovement, toLuau } from '../tools/export-movement.mjs';

function fixture() {
  return { id: 'example', localcoord: [320, 240], movement: {
    size: { xscale: '.2', yscale: '.2' },
    velocity: { 'walk.fwd': '4.5', 'walk.back': '-4.5', 'jump.neu': '0,-9.5', 'jump.fwd': '2.5', 'jump.back': '-2.55' },
    movement: { yaccel: '.44', 'airjump.num': '0' },
  }, animations: [0, 10, 11, 12, 20, 21, 40, 41, 42, 43, 47].map(id => ({ id, frames: [{ group: -1, index: 0, duration: 3, spriteKey: null }] })) };
}
async function library(t, character = fixture()) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'rift-movement-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, character.id));
  await fs.writeFile(path.join(root, character.id, 'character.json'), JSON.stringify(character));
  await fs.writeFile(path.join(root, 'characters.json'), JSON.stringify({ characters: [{ id: character.id, url: `${character.id}/character.json` }] }));
  return root;
}

test('source velocities, neutral Y inheritance, timings, and visual scale independence', () => {
  const source = fixture(), original = structuredClone(source);
  const { config, warnings } = buildMovementConfig(source);
  assert.deepEqual(warnings, []);
  assert.equal(config.walkForward, 4.5);
  assert.equal(config.walkBackward, -4.5);
  assert.deepEqual(config.jumpForward, { x: 2.5, y: -9.5 });
  assert.deepEqual(config.jumpBackward, { x: -2.55, y: -9.5 });
  assert.equal(config.gravity, .44);
  assert.equal(config.jumpStartTicks, 3);
  assert.equal(config.animations.jumpForward, 42);
  assert.deepEqual(source, original);
});

test('explicit directional Y and numeric literals are retained', () => {
  const source = fixture();
  source.movement.velocity['jump.fwd'] = '+3.5e0, -12.5';
  source.movement.velocity['jump.back'] = '-3.5,-12.5';
  source.movement.velocity['walk.fwd'] = 0;
  const { config, warnings } = buildMovementConfig(source);
  assert.deepEqual(warnings, []);
  assert.deepEqual(config.jumpForward, { x: 3.5, y: -12.5 });
  assert.deepEqual(config.jumpBackward, { x: -3.5, y: -12.5 });
  assert.equal(config.walkForward, 0);
});

test('expressions, nonfinite numbers, wrong signs, and bad vectors fall back with notices', () => {
  const source = fixture();
  source.movement.velocity['walk.fwd'] = 'const(velocity.walk.fwd)';
  source.movement.velocity['walk.back'] = '3';
  source.movement.velocity['jump.neu'] = 'NaN,Infinity';
  source.movement.velocity['jump.fwd'] = '-2,5';
  source.movement.velocity['jump.back'] = '1,2,3';
  source.movement.movement.yaccel = '0';
  const { config, warnings } = buildMovementConfig(source);
  assert.equal(config.walkForward, 2.4);
  assert.equal(config.walkBackward, -2.2);
  assert.deepEqual(config.jumpNeutral, { x: 0, y: -8.4 });
  assert.deepEqual(config.jumpForward, { x: 2.5, y: -8.4 });
  assert.deepEqual(config.jumpBackward, { x: -2.55, y: -8.4 });
  assert.equal(config.gravity, .44);
  assert.equal(warnings.length, 8);
  assert.doesNotThrow(() => toLuau(config));
});

test('missing data is explicit, unavailable animations stay absent', () => {
  const { config, warnings } = buildMovementConfig({});
  assert.deepEqual(config.animations, {});
  assert.equal(config.jumpStartTicks, 1);
  assert.equal(config.landTicks, 1);
  assert.ok(warnings.length >= 20);
});

test('duplicate, zero, held, and invalid animation durations use documented rules', () => {
  const source = fixture();
  source.animations.find(a => a.id === 10).frames.push({ group: -1, index: 0, duration: 2 });
  source.animations.find(a => a.id === 12).frames[0].duration = 0;
  source.animations.find(a => a.id === 40).frames[0].duration = -1;
  source.animations.find(a => a.id === 47).frames[0].duration = .5;
  source.animations.push({ id: 10, frames: [{ group: -1, index: 0, duration: 99 }] });
  const { config, warnings } = buildMovementConfig(source);
  assert.equal(config.crouchDownTicks, 5);
  assert.equal(config.crouchUpTicks, 1);
  assert.equal(config.jumpStartTicks, 1);
  assert.equal(config.landTicks, 1);
  assert.equal(warnings.length, 4);
});

test('an empty first duplicate is not silently replaced by a later action', () => {
  const source = fixture();
  source.animations.find(a => a.id === 40).frames = [];
  source.animations.push({ id: 40, frames: [{ group: -1, index: 0, duration: 99 }] });
  const { config, warnings } = buildMovementConfig(source);
  assert.equal(config.animations.jumpStart, undefined);
  assert.equal(config.jumpStartTicks, 1);
  assert.equal(warnings.length, 3);
});

test('missing movement sprites and unsupported air jumps are reported', () => {
  const source = fixture();
  source.animations[0].frames[0] = { group: 0, index: 1, spriteKey: '0,1', duration: 3 };
  source.movement.movement['airjump.num'] = '1';
  const { warnings } = buildMovementConfig(source);
  assert.equal(warnings.length, 2);
  assert.match(warnings.join('\n'), /unresolved sprite/);
  assert.match(warnings.join('\n'), /air jumps/);
});

test('Luau serialization cannot inject code and rejects invalid schema values', () => {
  assert.equal(toLuau('"\n\\é'), '"\\034\\010\\092\\195\\169"');
  assert.equal(toLuau({ 'return 1 --': 2 }), '{\n  ["return 1 --"] = 2,\n}');
  for (const value of [NaN, Infinity, undefined, null, [], true]) assert.throws(() => toLuau(value));
});

test('export is persistent, repeatable, leaves source JSON unchanged, and retains extra files', async t => {
  const root = await library(t), sourceFile = path.join(root, 'example', 'character.json');
  const before = await fs.readFile(sourceFile);
  const report = await exportMovement(root);
  const output = path.join(root, 'luau', 'movement.luau');
  const first = await fs.readFile(output, 'utf8');
  assert.match(first, /return \{/);
  assert.match(first, /\["example"\]/);
  assert.equal(report.characters.length, 1);
  assert.equal(report.ticksPerSecond, 60);
  assert.equal(report.characters[0].warnings.length, 0);
  const extra = path.join(root, 'luau', 'keep.txt');
  await fs.writeFile(extra, 'keep');
  await exportMovement(root);
  assert.equal(await fs.readFile(output, 'utf8'), first);
  assert.deepEqual(await fs.readFile(sourceFile), before);
  assert.equal(await fs.readFile(extra, 'utf8'), 'keep');
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(root, 'luau', 'movement-report.json'), 'utf8')), report);
});

test('unsafe or duplicate manifest IDs and mismatching character IDs are rejected', async t => {
  const root = await library(t), index = path.join(root, 'characters.json');
  for (const characters of [[], [{ id: '../outside', url: '../outside/character.json' }],
    [{ id: 'example', url: 'https://example.com/character.json' }],
    [{ id: 'example', url: 'example/character.json' }, { id: 'example', url: 'example/character.json' }]]) {
    await fs.writeFile(index, JSON.stringify({ characters }));
    await assert.rejects(exportMovement(root));
  }
  await fs.writeFile(index, JSON.stringify({ characters: [{ id: 'example', url: 'example/character.json' }] }));
  await fs.writeFile(path.join(root, 'example', 'character.json'), JSON.stringify({ ...fixture(), id: 'wrong' }));
  await assert.rejects(exportMovement(root), /ID mismatch/);
});

test('output hardlinks cannot overwrite an input or unrelated file', async t => {
  const root = await library(t), source = path.join(root, 'example', 'character.json');
  const before = await fs.readFile(source);
  await fs.mkdir(path.join(root, 'luau'));
  await fs.link(source, path.join(root, 'luau', 'movement.luau'));
  await assert.rejects(exportMovement(root), /Unsafe movement output/);
  assert.deepEqual(await fs.readFile(source), before);
});

test('available real character exports preserve their distinct source constants', async t => {
  const expected = {
    coiny: [2.4, -2.2, -8.4, .44, 5, 5, 1, 1],
    pikachu: [4.5, -4.5, -9.5, .44, 2, 2, 3, 3],
    sylveon: [2.2, -2.2, -8.4, .44, 10, 10, 4, 5],
    tyrone: [3, -2.5, -12.5, .565, 4, 4, 5, 8],
  };
  let checked = 0;
  for (const [id, values] of Object.entries(expected)) {
    let source;
    try { source = JSON.parse(await fs.readFile(new URL(`../generated/${id}/character.json`, import.meta.url), 'utf8')); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    const { config: c } = buildMovementConfig(source);
    assert.deepEqual([c.walkForward, c.walkBackward, c.jumpNeutral.y, c.gravity, c.crouchDownTicks, c.crouchUpTicks, c.jumpStartTicks, c.landTicks], values, id);
    checked++;
  }
  if (!checked) t.skip('No real character data imported');
});
