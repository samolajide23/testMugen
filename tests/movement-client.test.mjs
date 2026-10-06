import test from 'node:test';
import assert from 'node:assert/strict';
import { createMovementClient } from '../preview/movement.mjs';

const state = tick => ({ tick, state: 'idle', x: 0, y: 0, facing: 1, animation: 0 });
const result = (tick = 0, ticks = 0) => ({ ok: true, json: async () => ({ snapshot: state(tick), snapshots: Array.from({ length: ticks }, (_, i) => state(tick - ticks + i + 1)), warnings: ['notice'], ticksPerSecond: 60 }) });
function harness(fetchImpl) {
  const snapshots = [], errors = [], warnings = [];
  const client = createMovementClient({ fetchImpl, onSnapshot: s => snapshots.push(s), onError: e => errors.push(e.message), onWarnings: w => warnings.push(w) });
  return { client, snapshots, errors, warnings };
}
function deferred() {
  let resolve;
  const promise = new Promise(r => { resolve = r; });
  return { promise, resolve };
}

test('reset initializes the bridge and sends protected JSON, not executable code', async () => {
  let request;
  const h = harness(async (url, options) => { request = { url, ...options }; return result(); });
  assert.equal(await h.client.advance({}, 1), false);
  assert.equal(await h.client.reset('pikachu'), true);
  assert.equal(request.url, '/api/movement');
  assert.equal(request.headers['X-Rift-Movement'], '1');
  assert.equal(request.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(request.body), { characterId: 'pikachu', snapshot: null, input: {}, ticks: 0, facing: 1 });
  assert.equal(h.client.ready, true);
  assert.equal(h.client.pending, false);
  assert.equal(h.snapshots[0].tick, 0);
  assert.deepEqual(h.warnings, [['notice']]);
});

test('batched snapshots reach playback in tick order using the last accepted snapshot', async () => {
  const requests = [];
  const h = harness(async (_, options) => {
    const request = JSON.parse(options.body); requests.push(request);
    return result((request.snapshot?.tick ?? 0) + request.ticks, request.ticks);
  });
  await h.client.reset('coiny');
  await h.client.advance({ right: true }, 3);
  await h.client.advance({ jump: true }, 2);
  assert.deepEqual(h.snapshots.map(s => s.tick), [0, 1, 2, 3, 4, 5]);
  assert.equal(requests[2].snapshot.tick, 3);
  assert.deepEqual(requests[2].input, { jump: true });
});

test('only one request can be in flight', async () => {
  const waiting = deferred();
  const h = harness(async () => waiting.promise);
  const reset = h.client.reset('pikachu');
  assert.equal(h.client.pending, true);
  assert.equal(await h.client.advance({}, 1), false);
  waiting.resolve(result());
  await reset;
  assert.equal(h.client.pending, false);
});

test('character changes ignore old responses even if transport ignores abort', async () => {
  const old = deferred();
  let calls = 0, oldSignal;
  const h = harness(async (_, options) => {
    if (++calls === 1) { oldSignal = options.signal; return old.promise; }
    return result(100);
  });
  const first = h.client.reset('pikachu');
  await h.client.reset('tyrone');
  old.resolve(result(1));
  assert.equal(await first, false);
  assert.equal(oldSignal.aborted, true);
  assert.deepEqual(h.snapshots.map(s => s.tick), [100]);
});

test('obsolete completion cannot unlock a newer in-flight request', async () => {
  const first = deferred(), second = deferred();
  let calls = 0;
  const h = harness(async () => ++calls === 1 ? first.promise : second.promise);
  const older = h.client.reset('coiny');
  const newer = h.client.reset('pikachu');
  first.resolve(result());
  await older;
  assert.equal(h.client.pending, true);
  second.resolve(result());
  await newer;
  assert.equal(h.client.pending, false);
  assert.equal(h.snapshots.length, 1);
});

test('late failed requests do not report errors after cancellation', async () => {
  const waiting = deferred();
  const h = harness(async () => waiting.promise);
  const request = h.client.reset('coiny');
  h.client.cancel(true);
  waiting.resolve({ ok: false, json: async () => ({ error: 'obsolete failure' }) });
  await request;
  assert.deepEqual(h.errors, []);
  assert.equal(h.client.ready, false);
});

test('pause cancellation preserves accepted state and rejects stale advance', async () => {
  const waiting = deferred();
  let calls = 0;
  const h = harness(async (_, options) => {
    if (++calls === 2) return waiting.promise;
    const body = JSON.parse(options.body);
    return result((body.snapshot?.tick ?? 0) + body.ticks, body.ticks);
  });
  await h.client.reset('sylveon');
  const old = h.client.advance({}, 3);
  h.client.cancel();
  waiting.resolve(result(3, 3));
  assert.equal(await old, false);
  assert.equal(h.client.ready, true);
  await h.client.advance({}, 1);
  assert.deepEqual(h.snapshots.map(s => s.tick), [0, 1]);
  h.client.cancel(true);
  assert.equal(h.client.ready, false);
});

test('server failures remain visible without a simulated fallback', async () => {
  const h = harness(async () => ({ ok: false, status: 503, json: async () => ({ error: 'Run npm run setup:luau' }) }));
  assert.equal(await h.client.reset('coiny'), false);
  assert.deepEqual(h.errors, ['Run npm run setup:luau']);
  assert.equal(h.client.ready, false);
  assert.equal(h.snapshots.length, 0);
});

test('outdated server and malformed batch responses produce actionable errors', async () => {
  const h = harness(async () => ({ ok: false, json: async () => { throw new Error('Invalid JSON'); } }));
  await h.client.reset('coiny');
  assert.match(h.errors[0], /Restart the local preview server/);
  const invalid = harness(async () => ({ ok: true, json: async () => ({ snapshot: state(0), snapshots: [], ticksPerSecond: 30 }) }));
  await invalid.client.reset('coiny');
  assert.match(invalid.errors[0], /Invalid movement bridge response/);
  assert.equal(invalid.client.ready, false);
});
