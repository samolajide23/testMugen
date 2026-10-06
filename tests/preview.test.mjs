import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createPlayback, currentFrame, tickPlayback, frameTransform, characterScale } from '../preview/animation.mjs';
import { createPreviewServer } from '../tools/preview-server.mjs';

const animation = (durations, loopStart = 0) => ({ frames: durations.map((duration) => ({ duration })), loopStart });

test('playback advances on exact tick durations and honors loopstart', () => {
  const state = createPlayback(animation([2, 1, 3], 1));
  tickPlayback(state);
  assert.equal(state.frameIndex, 0);
  tickPlayback(state);
  assert.equal(state.frameIndex, 1);
  tickPlayback(state);
  assert.equal(state.frameIndex, 2);
  for (let i = 0; i < 3; i++) tickPlayback(state);
  assert.equal(state.frameIndex, 1);
});

test('negative duration holds until external state logic changes animation', () => {
  const state = createPlayback(animation([1, -1, 1]));
  for (let i = 0; i < 100; i++) tickPlayback(state);
  assert.equal(state.frameIndex, 1);
});

test('zero-duration frames are skipped without consuming ticks', () => {
  const state = createPlayback(animation([0, 2, 0, 1]));
  assert.equal(state.frameIndex, 1);
  tickPlayback(state);
  assert.equal(state.frameIndex, 1);
  tickPlayback(state);
  assert.equal(state.frameIndex, 3);
  tickPlayback(state);
  assert.equal(state.frameIndex, 1);
});

test('empty, all-zero animations and invalid loop indices are bounded', () => {
  const empty = createPlayback(animation([]));
  tickPlayback(empty);
  assert.equal(currentFrame(empty), null);
  const zero = createPlayback(animation([0, 0]));
  tickPlayback(zero);
  assert.equal(zero.frameIndex, 0);
  const invalid = createPlayback(animation([1], 9));
  tickPlayback(invalid);
  assert.equal(invalid.frameIndex, 0);
});

test('sprite axes, offsets and flips stay independent of actor facing', () => {
  const sprite = { axisX: 12, axisY: 30 };
  const frame = { x: 3, y: -4, flipH: false, flipV: false };
  assert.deepEqual(frameTransform(sprite, frame, -1), { x: -3, y: -4, scaleX: -1, scaleY: 1, imageX: -12, imageY: -30 });
  assert.equal(frameTransform(sprite, { ...frame, flipH: true, flipV: true }, -1).scaleX, 1);
  assert.equal(frameTransform(sprite, { ...frame, flipV: true }).scaleY, -1);
});

test('character size uses independent original CNS scales, including leading decimals', () => {
  for (const value of ['1', '1.2', '0.7', '.2']) {
    assert.deepEqual(characterScale({ movement: { size: { xscale: value, yscale: value } } }), { x: Number(value), y: Number(value) });
  }
  assert.deepEqual(characterScale({ movement: { size: { xscale: ' 0.5 ', yscale: 2 } } }), { x: 0.5, y: 2 });
  assert.deepEqual(characterScale({ movement: { size: { xscale: '0', yscale: '-1' } } }), { x: 0, y: -1 });
});

test('missing or malformed character scales fall back per axis without mutating imported data', () => {
  assert.deepEqual(characterScale(null), { x: 1, y: 1 });
  assert.deepEqual(characterScale({}), { x: 1, y: 1 });
  for (const invalid of [undefined, null, '', ' ', 'NaN', 'Infinity', '0.2junk', '1/2', false, [], Infinity]) {
    const size = Object.freeze({ xscale: invalid, yscale: '.7' });
    assert.deepEqual(characterScale({ movement: { size } }), { x: 1, y: 0.7 });
  }
});

test('server serves only preview/generated files and handles methods and bad URLs', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'rift-preview-'));
  await mkdir(path.join(root, 'preview'));
  await mkdir(path.join(root, 'generated'));
  await writeFile(path.join(root, 'preview', 'index.html'), '<h1>Character Lab</h1>');
  await writeFile(path.join(root, 'generated', 'characters.json'), '{"characters":[]}');
  await writeFile(path.join(root, 'secret.json'), '{"private":true}');
  const server = createPreviewServer(root);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await rm(root, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const rootResponse = await fetch(base, { redirect: 'manual' });
  assert.equal(rootResponse.status, 302);
  assert.equal(rootResponse.headers.get('location'), '/preview/index.html');
  const page = await fetch(`${base}/preview/index.html`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-type'), /text\/html/);
  assert.equal(await page.text(), '<h1>Character Lab</h1>');
  assert.equal((await fetch(`${base}/generated/characters.json`)).status, 200);
  for (const route of ['/secret.json', '/chars/Pikachu/Pikachu.def', '/preview/%2e%2e%2fsecret.json', '/preview/no-such-file']) {
    assert.equal((await fetch(`${base}${route}`)).status, 404, route);
  }
  assert.equal((await fetch(`${base}/preview/%zz`)).status, 400);
  assert.equal((await fetch(`${base}/preview/%5csecret.json`)).status, 400);
  assert.equal((await fetch(`${base}/preview/index.html`, { method: 'POST' })).status, 405);
  const head = await fetch(`${base}/preview/index.html`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
});
