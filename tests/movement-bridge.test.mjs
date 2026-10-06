import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { request } from 'node:http';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { createMovementBridge, MovementBridgeError } from '../tools/movement-bridge.mjs';
import { createPreviewServer, MAX_MOVEMENT_BYTES } from '../tools/preview-server.mjs';
import { buildMovementConfig } from '../tools/export-movement.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const binDir = path.resolve(process.env.LUAU_BIN_DIR ?? path.join(root, '.tools', 'luau-0.741'));
const executableName = process.platform === 'win32' ? 'luau.exe' : 'luau';
const realLuau = { skip: await fs.access(path.join(binDir, executableName), fs.constants.X_OK).then(() => false,
  () => 'Luau CLI not installed: run npm run setup:luau or set LUAU_BIN_DIR; HTTP/mock tests still run.') };
const initial = { tick: 0, state: 'idle', stateTicks: 0, x: 0, y: 0, vx: 0, vy: 0, facing: 1, animation: 0, jumpHeld: false, jumpDirection: 0 };
const payload = (overrides = {}) => ({ characterId: 'coiny', snapshot: null, input: {}, ticks: 0, ...overrides });
const hasStatus = status => error => error instanceof MovementBridgeError && error.statusCode === status;
const protocol = snapshot => `RIFT_MOVEMENT_V1:${JSON.stringify(snapshot)}\n`;

async function fixture(t, character = { id: 'fresh', animations: [] }) {
  await fs.mkdir(path.join(root, '.tools'), { recursive: true });
  const directory = await fs.mkdtemp(path.join(root, '.tools', 'bridge-test-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  await fs.mkdir(path.join(directory, 'runtime'));
  await fs.copyFile(path.join(root, 'runtime', 'Movement.luau'), path.join(directory, 'runtime', 'Movement.luau'));
  await fs.mkdir(path.join(directory, 'generated', character.id), { recursive: true });
  await fs.writeFile(path.join(directory, 'generated', 'characters.json'), JSON.stringify({ characters: [
    { id: character.id, url: `${character.id}/character.json` },
    { id: 'unrelated-broken-import', url: 'unrelated-broken-import/character.json' },
  ] }));
  await fs.writeFile(path.join(directory, 'generated', character.id, 'character.json'), JSON.stringify(character));
  return directory;
}

async function mockBin(directory) {
  const bin = path.join(directory, 'mock-bin');
  await fs.mkdir(bin);
  // Access checks still run, but fakeWorker intercepts every spawn; this file is never executed.
  await fs.writeFile(path.join(bin, executableName), 'mock worker placeholder', { mode: 0o700 });
  return bin;
}

for (const id of ['coiny', 'pikachu', 'sylveon', 'tyrone']) {
  test(`real Luau initializes, walks and jumps with imported ${id} config`, realLuau, async () => {
    const bridge = createMovementBridge(root, { binDir });
    const { config, warnings } = buildMovementConfig(JSON.parse(await fs.readFile(path.join(root, 'generated', id, 'character.json'), 'utf8')));
    const reset = await bridge(payload({ characterId: id }));
    assert.deepEqual(reset, { snapshot: { ...initial, animation: config.animations.idle ?? null }, snapshots: [], warnings, ticksPerSecond: 60 });
    const walk = await bridge(payload({ characterId: id, snapshot: reset.snapshot, input: { right: true }, ticks: 6 }));
    assert.equal(walk.snapshots.length, 6);
    assert.deepEqual(walk.snapshots.map(s => s.tick), [1, 2, 3, 4, 5, 6]);
    assert.equal(walk.snapshot.state, 'walk');
    assert.ok(Math.abs(walk.snapshot.x - 6 * config.walkForward) < 1e-10);
    const backward = await bridge(payload({ characterId: id, facing: -1, input: { right: true }, ticks: 1 }));
    assert.equal(backward.snapshot.facing, -1, 'single-character preview never auto-faces an opponent');
    assert.equal(backward.snapshot.vx, -config.walkBackward);
    assert.equal(backward.snapshot.animation, config.animations.walkBackward ?? null);
    let current = reset.snapshot;
    for (let remaining = config.jumpStartTicks + 1; remaining > 0;) {
      const ticks = Math.min(6, remaining);
      const result = await bridge(payload({ characterId: id, snapshot: current, input: { jump: true, right: true }, ticks }));
      current = result.snapshot;
      remaining -= ticks;
    }
    assert.equal(current.state, 'air');
    assert.equal(current.jumpHeld, true);
    assert.equal(current.jumpDirection, 1);
    assert.equal(current.x, config.jumpForward.x);
    assert.equal(current.y, config.jumpForward.y);
    assert.ok(Math.abs(current.vy - (config.jumpForward.y + config.gravity)) < 1e-10);
  });
}

test('new import is read directly each request; nil animations round-trip as null and reset facing is optional', realLuau, async t => {
  const directory = await fixture(t);
  const bridge = createMovementBridge(directory, { binDir });
  const reset = await bridge(payload({ characterId: 'fresh', facing: -1 }));
  assert.equal(reset.snapshot.animation, null);
  assert.equal(reset.snapshot.facing, -1);
  assert.ok(reset.warnings.length > 0);
  assert.deepEqual((await bridge(payload({ characterId: 'fresh', snapshot: reset.snapshot, facing: 1 }))).snapshot, reset.snapshot);
  const character = { id: 'fresh', movement: { velocity: { 'walk.fwd': '7.25', 'jump.neu': '0,-8' } } };
  await fs.writeFile(path.join(directory, 'generated', 'fresh', 'character.json'), JSON.stringify(character));
  const changed = await bridge(payload({ characterId: 'fresh', input: { right: true }, ticks: 1 }));
  assert.equal(changed.snapshot.x, 7.25);
  assert.equal(changed.snapshot.animation, null);
  const continued = await bridge(payload({ characterId: 'fresh', snapshot: changed.snapshot, input: { left: false, right: true, jump: false, down: false }, ticks: 1 }));
  assert.equal(continued.snapshot.x, 14.5);
  assert.equal(await fs.access(path.join(directory, 'generated', 'luau')).then(() => true, () => false), false, 'does not export the library');
  assert.deepEqual(await fs.readdir(path.join(directory, '.tools')), []);
});

test('real Luau clamps fixed bounds and does not auto-face; jump release survives batches', realLuau, async () => {
  const bridge = createMovementBridge(root, { binDir });
  const walk = await bridge(payload({ snapshot: { ...initial, x: 199 }, input: { right: true }, ticks: 6 }));
  assert.equal(walk.snapshot.x, 200);
  assert.equal(walk.snapshot.facing, 1);
  const left = await bridge(payload({ snapshot: { ...initial, x: -199, facing: -1 }, input: { left: true }, ticks: 6 }));
  assert.equal(left.snapshot.x, -200);
  assert.equal(left.snapshot.facing, -1);
  const held = await bridge(payload({ snapshot: { ...initial, jumpHeld: true }, input: { jump: true }, ticks: 1 }));
  assert.equal(held.snapshot.state, 'idle');
  const released = await bridge(payload({ snapshot: held.snapshot, input: {}, ticks: 1 }));
  const pressed = await bridge(payload({ snapshot: released.snapshot, input: { jump: true }, ticks: 1 }));
  assert.equal(pressed.snapshot.state, 'jumpStart');
});

test('rejects malformed scalar fields, unknown fields, nonfinite values and code injection before spawning', async () => {
  let spawned = 0;
  const bridge = createMovementBridge(root, { spawnWorker: () => { spawned++; throw new Error('unexpected worker'); } });
  const bad = [null, [], {}, payload({ characterId: '../../runtime/Movement' }), payload({ characterId: 'coiny\"); error(\"injected' }),
    payload({ ticks: 7 }), payload({ ticks: -1 }), payload({ ticks: 1.5 }), payload({ ticks: '1' }),
    payload({ facing: 0 }), payload({ facing: '1' }), payload({ input: { jump: 1 } }), payload({ input: { right: 'true' } }),
    payload({ input: { opponentX: 2 } }), payload({ world: { minX: -999 } }), payload({ snapshot: {} }),
    ...Object.keys(initial).map(key => { const snapshot = { ...initial }; delete snapshot[key]; return payload({ snapshot }); }),
    ...Object.keys(initial).map(key => payload({ snapshot: { ...initial, [key]: '0); error("injected") --' } })),
    ...[NaN, Infinity, -Infinity, 1e20].map(x => payload({ snapshot: { ...initial, x } })),
    ...[{ tick: -1 }, { stateTicks: 1 }, { state: 'run' }, { x: 201 }, { y: 1 }, { vx: 1e7 }, { vy: -1e7 },
      { animation: 999 }, { jumpDirection: 2 }, { jumpHeld: 0 }, { facing: 0 }, { extra: true }].map(change => payload({ snapshot: { ...initial, ...change } })),
    JSON.parse('{"characterId":"coiny","snapshot":null,"input":{"__proto__":{}},"ticks":0}'),
  ];
  for (const value of bad) await assert.rejects(bridge(value), hasStatus(400));
  assert.equal(spawned, 0);
});

test('manifest URL, duplicates, identity and generated containment are validated', async t => {
  const directory = await fixture(t);
  const bridge = createMovementBridge(directory, { binDir });
  const manifest = path.join(directory, 'generated', 'characters.json');
  for (const entries of [[{ id: 'fresh', url: '../secret.json' }], [{ id: 'fresh', url: 'fresh/character.json' }, { id: 'fresh', url: 'fresh/character.json' }], []]) {
    await fs.writeFile(manifest, JSON.stringify({ characters: entries }));
    await assert.rejects(bridge(payload({ characterId: 'fresh' })), hasStatus(400));
  }
  await fs.writeFile(manifest, JSON.stringify({ characters: [{ id: 'fresh', url: 'fresh/character.json' }] }));
  await fs.writeFile(path.join(directory, 'generated', 'fresh', 'character.json'), '{"id":"other"}');
  await assert.rejects(bridge(payload({ characterId: 'fresh' })), hasStatus(400));
  await fs.mkdir(path.join(directory, 'outside'));
  await fs.writeFile(path.join(directory, 'outside', 'character.json'), '{"id":"escaped"}');
  await fs.symlink(path.join(directory, 'outside'), path.join(directory, 'generated', 'escaped'), process.platform === 'win32' ? 'junction' : 'dir');
  await fs.writeFile(manifest, JSON.stringify({ characters: [{ id: 'escaped', url: 'escaped/character.json' }] }));
  await assert.rejects(bridge(payload({ characterId: 'escaped' })), hasStatus(400));
});

test('imported numeric expressions remain data and extreme config values are rejected', realLuau, async t => {
  const directory = await fixture(t, { id: 'fresh', movement: { velocity: { 'walk.fwd': '0); error("injected") --' } } });
  const bridge = createMovementBridge(directory, { binDir });
  const result = await bridge(payload({ characterId: 'fresh', input: { right: true }, ticks: 1 }));
  assert.equal(result.snapshot.x, 2.4);
  assert.ok(result.warnings.some(warning => warning.includes('velocity.walk.fwd')));
  await fs.writeFile(path.join(directory, 'generated', 'fresh', 'character.json'), JSON.stringify({ id: 'fresh', movement: { velocity: { 'walk.fwd': 1e100 } } }));
  await assert.rejects(bridge(payload({ characterId: 'fresh' })), hasStatus(400));
});

test('missing CLI returns actionable 503 without creating workers', async () => {
  const bridge = createMovementBridge(root, { binDir: path.join(root, '.tools', 'not-installed') });
  await assert.rejects(bridge(payload()), error => hasStatus(503)(error) && /npm run setup:luau/.test(error.message) && /LUAU_BIN_DIR/.test(error.message));
});

function fakeWorker(onStart) {
  return (executable, args, options) => {
    assert.equal(options.shell, false);
    assert.deepEqual(options.stdio, ['ignore', 'pipe', 'pipe']);
    assert.equal(args.length, 1);
    assert.equal(path.dirname(args[0]), options.cwd);
    const child = new EventEmitter();
    child.stdout = new PassThrough();
    child.stderr = new PassThrough();
    child.kill = () => { queueMicrotask(() => child.emit('close', null)); return true; };
    queueMicrotask(() => onStart(child, options.cwd, args[0]));
    return child;
  };
}

test('timeouts, excessive output, worker failure and invalid protocol always clean private scripts', async t => {
  const directory = await fixture(t);
  const binDir = await mockBin(directory);
  const cases = [
    { status: 504, run() {} },
    { status: 500, run(child) { child.stdout.write('x'.repeat(70 * 1024)); } },
    { status: 500, run(child) { child.stderr.write('secret absolute filesystem path'); child.emit('close', 1); } },
    { status: 500, run(child) { child.stdout.write('not JSON or a valid protocol'); child.emit('close', 0); } },
    { status: 500, run(child) { child.stdout.write(protocol({ ...initial, state: 'untrusted' })); child.emit('close', 0); } },
    { status: 503, run(child) { child.emit('error', Object.assign(new Error('secret'), { code: 'ENOENT' })); child.emit('close', -2); } },
  ];
  for (const { status, run } of cases) {
    let workDirectory;
    const bridge = createMovementBridge(directory, { binDir, timeoutMs: 30, spawnWorker: fakeWorker((child, cwd) => { workDirectory = cwd; run(child); }) });
    await assert.rejects(bridge(payload({ characterId: 'fresh' })), error => hasStatus(status)(error) && !/secret/.test(error.message));
    assert.ok(workDirectory.startsWith(path.join(directory, '.tools', 'movement-')));
    assert.equal(await fs.access(workDirectory).then(() => true, () => false), false);
    assert.deepEqual(await fs.readdir(path.join(directory, '.tools')), []);
  }
});

test('real stalled Luau CLI is killed on timeout and its private directory is removed', realLuau, async t => {
  const directory = await fixture(t);
  await fs.writeFile(path.join(directory, 'runtime', 'Movement.luau'), 'while true do end\nreturn {}\n');
  const bridge = createMovementBridge(directory, { binDir, timeoutMs: 500 });
  await assert.rejects(bridge(payload({ characterId: 'fresh' })), hasStatus(504));
  assert.deepEqual(await fs.readdir(path.join(directory, '.tools')), []);
  await fs.copyFile(path.join(root, 'runtime', 'Movement.luau'), path.join(directory, 'runtime', 'Movement.luau'));
  const result = await bridge(payload({ characterId: 'fresh' }));
  assert.equal(result.snapshot.tick, 0);
  assert.deepEqual(await fs.readdir(path.join(directory, '.tools')), []);
});

test('bridge permits at most two concurrent workers and releases slots on completion', async t => {
  const directory = await fixture(t);
  const binDir = await mockBin(directory);
  let started;
  const ready = new Promise(resolve => { started = resolve; });
  const workers = [];
  const bridge = createMovementBridge(directory, { binDir, spawnWorker: fakeWorker(child => { workers.push(child); if (workers.length === 2) started(); }) });
  const first = bridge(payload({ characterId: 'fresh' }));
  const second = bridge(payload({ characterId: 'fresh' }));
  await ready;
  await assert.rejects(bridge(payload({ characterId: 'fresh' })), hasStatus(503));
  for (const child of workers) { child.stdout.write(protocol(initial)); child.emit('close', 0); }
  await Promise.all([first, second]);
  assert.deepEqual(await fs.readdir(path.join(directory, '.tools')), []);
  const third = bridge(payload({ characterId: 'fresh' }));
  while (workers.length < 3) await new Promise(resolve => setTimeout(resolve, 5));
  workers[2].stdout.write(protocol(initial)); workers[2].emit('close', 0);
  await third;
});

async function serve(t, options = {}) {
  const server = createPreviewServer(root, options);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
  const base = `http://127.0.0.1:${server.address().port}`;
  const headers = { Origin: base, 'Content-Type': 'application/json', 'X-Rift-Movement': '1' };
  const post = (overrides = {}) => fetch(`${base}/api/movement`, { method: 'POST', headers, body: JSON.stringify(payload()), ...overrides });
  return { base, headers, post };
}

function rawPost(base, headers, send) {
  return new Promise((resolve, reject) => {
    const req = request(`${base}/api/movement`, { method: 'POST', headers }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => { resolve({ status: res.statusCode, data: JSON.parse(Buffer.concat(chunks).toString()) }); req.destroy(); });
    });
    req.on('error', reject);
    send(req);
  });
}

test('HTTP requires POST, exact 127 host/origin, custom header and JSON content type', async t => {
  let calls = 0;
  const { base, headers, post } = await serve(t, { movement: () => { calls++; return {}; } });
  const get = await fetch(`${base}/api/movement`);
  assert.equal(get.status, 405);
  assert.equal(get.headers.get('allow'), 'POST');
  assert.match(get.headers.get('content-type'), /application\/json/);
  for (const change of [{ Origin: '' }, { Origin: 'https://example.com' }, { Origin: base.replace('127.0.0.1', 'localhost') }, { Origin: `${base}/` }, { 'X-Rift-Movement': '' }, { 'X-Rift-Movement': 'true' }]) {
    assert.equal((await post({ headers: { ...headers, ...change } })).status, 403);
  }
  const host = await rawPost(base, { ...headers, Host: 'attacker.example' }, req => req.end('{}'));
  assert.equal(host.status, 403);
  assert.equal((await post({ headers: { ...headers, 'Content-Type': 'text/plain' } })).status, 415);
  assert.equal(calls, 0);
});

test('HTTP bounds declared and chunked JSON, rejects malformed payloads, and times out slow bodies', async t => {
  let calls = 0;
  const { base, headers, post } = await serve(t, { movementBodyTimeoutMs: 50, movement: () => { calls++; return {}; } });
  assert.equal((await post({ body: ' '.repeat(MAX_MOVEMENT_BYTES + 1) })).status, 413);
  const chunked = await rawPost(base, headers, req => { req.write(' '.repeat(MAX_MOVEMENT_BYTES)); req.end('x'); });
  assert.equal(chunked.status, 413);
  const slow = await rawPost(base, headers, req => { req.flushHeaders(); req.write('{'); });
  assert.equal(slow.status, 408);
  for (const body of ['{', 'null', JSON.stringify(payload({ snapshot: {} })), JSON.stringify(payload({ input: { left: 'true' } }))]) {
    assert.equal((await post({ body })).status, 400);
  }
  assert.equal(calls, 0);
  const exact = JSON.stringify(payload()).padEnd(MAX_MOVEMENT_BYTES, ' ');
  assert.equal((await post({ body: exact, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } })).status, 200);
});

test('HTTP limits concurrency to two and sanitizes unknown errors while returning controlled statuses', async t => {
  let release, entered, calls = 0;
  const gate = new Promise(resolve => { release = resolve; });
  const ready = new Promise(resolve => { entered = resolve; });
  let failure;
  const { post } = await serve(t, { movement: async () => { calls++; if (calls === 2) entered(); await gate; if (failure) throw failure; return { snapshot: initial, snapshots: [], warnings: [], ticksPerSecond: 60 }; } });
  const first = post(), second = post();
  await ready;
  assert.equal((await post()).status, 503);
  release();
  assert.equal((await first).status, 200);
  assert.equal((await second).status, 200);
  for (const status of [400, 503, 500, 504]) {
    failure = new MovementBridgeError(status, 'Controlled movement error.');
    const response = await post();
    assert.equal(response.status, status);
    assert.deepEqual(await response.json(), { error: 'Controlled movement error.' });
  }
  failure = Object.assign(new Error('secret filesystem path'), { statusCode: 503 });
  const response = await post();
  assert.equal(response.status, 500);
  assert.doesNotMatch((await response.json()).error, /secret/);
});

test('HTTP default route executes actual Luau and returns exact stateless contract', realLuau, async t => {
  const { post } = await serve(t);
  const response = await post({ body: JSON.stringify(payload({ ticks: 2, input: { right: true } })) });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.deepEqual(Object.keys(result).sort(), ['snapshot', 'snapshots', 'ticksPerSecond', 'warnings']);
  assert.equal(result.snapshot.x, 4.8);
  assert.deepEqual(result.snapshot, result.snapshots[1]);
  assert.equal(result.snapshots.length, 2);
  assert.equal(result.ticksPerSecond, 60);
  assert.ok(result.warnings.every(warning => typeof warning === 'string'));
  const reset = await post();
  assert.deepEqual((await reset.json()).snapshot, initial);
});
