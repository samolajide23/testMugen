import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createSourceCombatClient, combatInputs, sourceFrame, sourceResources, sourceVisualTransform, sourceBlend, combatLayers, superPauseFlash, contactSpark, sparkAtTick, combatResult } from '../preview/source-combat.mjs';

const match = tick => ({ tick, opaqueRuntimeData: { retained: true }, events: [], fighters: [1, -1].map(facing => ({
  life: 1000, state: { stateNo: 0, anim: 0, animElem: 1, x: -20 * facing, y: 0, facing },
})) });
const response = (tick = 0, ticks = 0) => ({ ok: true, json: async () => ({
  snapshot: match(tick), snapshots: Array.from({ length: ticks }, (_, i) => match(tick - ticks + i + 1)),
  ticksPerSecond: 60, warnings: ['checkpoint'],
}) });
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { resolve, promise }; };
function harness(fetchImpl) {
  const snapshots = [], errors = [], warnings = [];
  const client = createSourceCombatClient({ fetchImpl, onSnapshot: s => snapshots.push(s), onError: e => errors.push(e.message), onWarnings: w => warnings.push(w) });
  return { client, snapshots, errors, warnings };
}
const immediate = requests => async (url, options) => {
  const body = JSON.parse(options.body); requests.push({ url, options, ...body });
  return response((body.snapshot?.tick ?? 0) + body.ticks, body.ticks);
};

test('timed playback displays each source tick at 60Hz and supports pause/step/reset', async () => {
  const seen=[],requests=[];
  const client=createSourceCombatClient({fetchImpl:immediate(requests),timedPlayback:true,onSnapshot:s=>seen.push(s.tick)});
  await client.reset(); await client.advance(6);
  assert.deepEqual(seen,[0]); assert.equal(client.bufferedTicks,6);
  client.play(1/60); assert.deepEqual(seen,[0,1]);
  client.play(1/60); assert.deepEqual(seen,[0,1,2]);
  client.cancel(); assert.equal(client.bufferedTicks,4);
  client.play(0,true); assert.deepEqual(seen,[0,1,2,3]);
  client.play(3/60); assert.deepEqual(seen,[0,1,2,3,4,5,6]);
  await client.advance(6); await client.reset(); assert.equal(client.bufferedTicks,0);
});
test('reset uses neutral two-player inputs and zero ticks, then retains the entire opaque match', async () => {
  const requests = [], h = harness(immediate(requests));
  assert.equal(await h.client.advance(), false);
  assert.equal(await h.client.reset(), true);
  assert.equal(requests[0].url, '/api/source-combat');
  assert.equal(requests[0].options.headers['Content-Type'], 'application/json');
  assert.equal(requests[0].options.headers['X-Rift-Source-Combat'], '1');
  assert.equal(requests[0].snapshot, null);
  assert.equal(requests[0].ticks, 0);
  assert.equal(requests[0].inputs.length, 2);
  assert.ok(requests[0].inputs.every(input => Object.values(input).every(value => value === false)));
  assert.equal(h.client.ready, true);
  assert.deepEqual(h.warnings, [['checkpoint']]);
  await h.client.advance(6);
  assert.deepEqual(requests[1].snapshot, match(0));
  assert.deepEqual(h.snapshots.map(s => s.tick), [0, 1, 2, 3, 4, 5, 6]);
  await h.client.reset();
  assert.equal(requests[2].snapshot, null);
});

test('signed bridgeToken and frozen snapshot roundtrip unmodified across batches', async () => {
  const requests = [], accepted = [];
  function freeze(value) {
    if (value && typeof value === 'object') {
      Object.values(value).forEach(freeze); Object.freeze(value);
    }
    return value;
  }
  const client = createSourceCombatClient({ fetchImpl: async (_, options) => {
    const request = JSON.parse(options.body); requests.push(request);
    const tick = (request.snapshot?.tick ?? 0) + request.ticks;
    const snapshot = freeze({ ...match(tick), bridgeToken: `signed.opaque-token_${tick}.+/=` });
    accepted.push(snapshot);
    return { ok: true, json: async () => ({ snapshot,
      snapshots: Array.from({ length: request.ticks }, (_, i) => freeze(match(tick - request.ticks + i + 1))),
      ticksPerSecond: 60, warnings: [],
    }) };
  } });
  await client.reset(); await client.advance(6); await client.advance(1);
  assert.deepEqual(requests[1].snapshot, accepted[0]);
  assert.deepEqual(requests[2].snapshot, accepted[1]);
  assert.equal(requests[2].snapshot.bridgeToken, 'signed.opaque-token_6.+/=');
  assert.equal(accepted[0].fighters[0].life, 1000);
});

test('fixed batches stay within six ticks and do not mutate inputs or simulate states', async () => {
  const requests = [], h = harness(immediate(requests));
  await h.client.reset();
  const input = combatInputs(new Set(['KeyD', 'Numpad2']));
  h.client.setInputs(input); input[0].right = false;
  assert.equal(h.client.batchSize(6), 6);
  await h.client.advance(6);
  assert.equal(requests[1].ticks, 6);
  assert.equal(requests[1].inputs[0].right, true);
  assert.equal(requests[1].inputs[1].y, true);
  assert.equal(h.client.batchSize(6), 6);
  await h.client.advance(6);
  assert.equal(requests[2].ticks, 6);
  for (const invalid of [0, -1, 7, 1.5, NaN]) assert.equal(await h.client.advance(invalid), false);
});

test('press/release edges and repeated taps survive a pending batch in order', async () => {
  const waiting = deferred(), requests = [];
  const normal = immediate(requests);
  let calls = 0;
  const h = harness(async (url, options) => {
    if (++calls === 2) { requests.push({ ...JSON.parse(options.body), options }); return waiting.promise; }
    return normal(url, options);
  });
  await h.client.reset();
  const pending = h.client.advance(6);
  assert.equal(h.client.pending, true);
  for (const codes of [['KeyJ'], [], ['KeyJ', 'Numpad3'], []]) h.client.setInputs(combatInputs(new Set(codes)));
  assert.equal(await h.client.advance(1), false);
  waiting.resolve(response(6, 6)); await pending;
  for (let i = 0; i < 4; i++) await h.client.advance(6);
  assert.deepEqual(requests.slice(2).map(r => [r.ticks, r.inputs[0].x, r.inputs[1].z]), [
    [6, true, false], [6, false, false], [6, true, true], [6, false, false],
  ]);
  assert.equal(h.client.batchSize(6), 6);
});

test('new attack and taunt edges remain paired and ordered across six-tick requests', async () => {
  const requests = [], h = harness(immediate(requests)); await h.client.reset();
  for (const codes of [['KeyU', 'KeyI', 'Numpad4', 'Numpad5'], [], ['KeyT', 'Numpad0'], []]) {
    h.client.setInputs(combatInputs(new Set(codes)));
  }
  for (let i = 0; i < 4; i++) await h.client.advance(6);
  assert.deepEqual(requests.slice(1).map(r => [r.ticks, r.inputs[0].a, r.inputs[0].b, r.inputs[0].s,
    r.inputs[1].a, r.inputs[1].b, r.inputs[1].s]), [
    [6, true, true, false, true, true, false], [6, false, false, false, false, false, false],
    [6, false, false, true, false, false, true], [6, false, false, false, false, false, false],
  ]);
});

test('browser chord window combines separate J/K keydowns before sending an attack tick', async () => {
  let time = 0;
  const requests = [];
  const client = createSourceCombatClient({ fetchImpl: immediate(requests), chordWindowMs: 1000 / 30, now: () => time });
  await client.reset();
  client.setInputs(combatInputs(new Set(['KeyJ'])));
  time = 10;
  assert.equal(await client.advance(6), false);
  client.setInputs(combatInputs(new Set(['KeyJ', 'KeyK'])));
  time = 34;
  assert.equal(await client.advance(6), true);
  assert.equal(requests[1].inputs[0].x, true);
  assert.equal(requests[1].inputs[0].y, true);
  await client.advance(1);
  assert.equal(requests[2].inputs[0].y, true);
});

test('chord collection preserves releases, separate taps, motion inputs and single punches', async () => {
  let time = 0;
  const requests = [];
  const client = createSourceCombatClient({ fetchImpl: immediate(requests), chordWindowMs: 1000 / 30, now: () => time });
  await client.reset();
  client.setInputs(combatInputs(new Set(['KeyJ'])));
  client.setInputs(combatInputs(new Set()));
  client.setInputs(combatInputs(new Set(['KeyK'])));
  time = 34;
  for (let i = 0; i < 3; i++) await client.advance(1);
  assert.deepEqual(requests.slice(1).map(r => [r.inputs[0].x, r.inputs[0].y]), [[true,false],[false,false],[false,true]]);
  client.setInputs(combatInputs(new Set(['KeyD'])));
  await client.advance(1);
  assert.equal(requests.at(-1).inputs[0].right, true);
  client.setInputs(combatInputs(new Set(['KeyD', 'KeyJ'])));
  assert.equal(await client.advance(1), false);
  time = 68;
  await client.advance(1);
  assert.equal(requests.at(-1).inputs[0].x, true);
  assert.equal(requests.at(-1).inputs[0].right, true);
});

test('cancel preserves accepted state but clears held input, queued edges and stale responses', async () => {
  const waiting = deferred(), requests = []; let calls = 0;
  const normal = immediate(requests);
  const h = harness(async (url, options) => ++calls === 2 ? waiting.promise : normal(url, options));
  await h.client.reset();
  const old = h.client.advance(6);
  h.client.setInputs(combatInputs(new Set(['KeyJ'])));
  h.client.cancel();
  waiting.resolve(response(6, 6));
  assert.equal(await old, false);
  assert.equal(h.client.ready, true);
  await h.client.advance(1);
  assert.deepEqual(h.snapshots.map(s => s.tick), [0, 1]);
  assert.equal(requests[1].inputs[0].x, false);
  h.client.cancel(true); assert.equal(h.client.ready, false);
});

test('reset aborts old transport, ignores its errors and cannot unlock a newer request', async () => {
  const first = deferred(), second = deferred(); let calls = 0, oldSignal;
  const h = harness(async (_, options) => {
    if (++calls === 1) { oldSignal = options.signal; return first.promise; }
    return second.promise;
  });
  const old = h.client.reset(), newer = h.client.reset();
  assert.equal(oldSignal.aborted, true);
  first.resolve({ ok: false, json: async () => ({ error: 'obsolete' }) });
  assert.equal(await old, false);
  assert.equal(h.client.pending, true);
  second.resolve(response(100)); assert.equal(await newer, true);
  assert.deepEqual(h.snapshots.map(s => s.tick), [100]); assert.deepEqual(h.errors, []);
});

test('network, HTTP, invalid JSON and malformed batches report errors without a fallback', async () => {
  const cases = [
    [async () => { throw new Error('offline'); }, /offline/],
    [async () => ({ ok: false, status: 503, json: async () => ({ error: 'Luau missing' }) }), /Luau missing/],
    [async () => ({ ok: false, json: async () => { throw new Error('HTML'); } }), /Restart the local preview server/],
    [async () => ({ ok: true, json: async () => ({ snapshot: {}, snapshots: [], ticksPerSecond: 60, warnings: [] }) }), /Invalid source combat/],
  ];
  for (const [fetchImpl, message] of cases) {
    const h = harness(fetchImpl); assert.equal(await h.client.reset(), false);
    assert.match(h.errors[0], message); assert.equal(h.client.pending, false);
    assert.equal(h.client.ready, false); assert.deepEqual(h.snapshots, []);
  }
  let calls = 0;
  const h = harness(async () => ++calls === 1 ? response() : response(3, 2));
  await h.client.reset(); assert.equal(await h.client.advance(3), false);
  assert.match(h.errors[0], /Invalid source combat/);
  assert.deepEqual(h.snapshots.map(s => s.tick), [0]);
});

test('both keyboard layouts map independently and source frames use exact one-based elements', () => {
  const inputs = combatInputs(new Set(['KeyA', 'KeyW', 'KeyK', 'ArrowRight', 'ArrowDown', 'Numpad1', 'Numpad3']));
  assert.deepEqual(inputs[0], { left: true, right: false, up: true, down: false, x: false, y: true, z: false, a: false, b: false, c: false, s: false });
  assert.deepEqual(inputs[1], { left: false, right: true, up: false, down: true, x: true, y: false, z: true, a: false, b: false, c: false, s: false });
  const extras = combatInputs(new Set(['KeyU', 'KeyI', 'KeyO', 'KeyT', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad0']));
  for (const input of extras) for (const button of ['a', 'b', 'c', 's']) assert.equal(input[button], true);
  const first = { duration: 0 }, second = { duration: -1 };
  const character = { animations: [{ id: 200, frames: [first, second] }] };
  assert.equal(sourceFrame(character, { anim: 200, animElem: 1 }), first);
  assert.equal(sourceFrame(character, { anim: 200, animElem: 2 }), second);
  assert.equal(sourceFrame(character, { anim: 0, animElem: 1 }), null);
  assert.equal(sourceFrame(character, { anim: 200, animElem: 3 }), null);
});

test('visual actions use complete imported AIR, explicit resource namespaces and stable priority layers', () => {
  const frame = { group: 3999, index: 0 }, common = { animations: [{ id: 40, frames: [{}] }] };
  const character = { common, animations: [{ id: 3999, frames: [frame] }] };
  assert.equal(sourceFrame(character, { anim: 3999, animElem: 1 }), frame);
  character.sourceAnimationFallbacks = [{ id: 106, fallback: 3999 }];
  assert.equal(sourceFrame(character, { anim: 106, animElem: 1 }), frame);
  assert.equal(sourceFrame(character, { resource: 'common', anim: 3999, animElem: 1 }), null);
  assert.equal(sourceResources(character, { resource: 'common' }), common);
  const snapshot = { fighters: [{ state: { anim: 0 } }], projectiles: [{ anim: 200, sprpriority: 2 }],
    effects: [{ anim: 3999, sprpriority: -3 }, { anim: 4050, sprpriority: -7 }, { anim: 40, sprpriority: 3 }] };
  const original = JSON.stringify(snapshot);
  assert.deepEqual(combatLayers(snapshot).map(layer => layer.state.anim), [4050, 3999, 0, 200, 40]);
  assert.equal(JSON.stringify(snapshot), original);
  assert.deepEqual(sourceVisualTransform({ facing: -1, visual: { scale: { x: 1.5, y: 0.5 }, angle: 90 } }, { x: 0.2, y: 0.2 }),
    { x: 0.30000000000000004, y: 0.1, radians: Math.PI / 2 });
  assert.deepEqual(sourceBlend({ extra: ['A1'] }), { operation: 'lighter', alpha: 1 });
  assert.deepEqual(sourceBlend({ extra: ['AS128D256'] }), { operation: 'lighter', alpha: 0.5 });
});

test('SuperPause common100 flash uses activation origin, facing-relative offset and runtime age, never self run100', () => {
  const snapshot = match(50);
  snapshot.superPause = { owner: 2, remaining: 20, moveRemaining: 0, unhittable: true, darken: true,
    anim: 100, pos: { x: 7, y: -30 }, origin: { x: 12, y: -5 }, age: 10 };
  const before = JSON.stringify(snapshot);
  const flash = superPauseFlash(snapshot);
  assert.equal(flash.x, 5); assert.equal(flash.y, -35); assert.equal(flash.age, 10);
  assert.equal(flash.resource, 'common'); assert.equal(flash.flags.procedural, true);
  const character = { animations: [{ id: 100, frames: [{ duration: 6 }] }] };
  assert.equal(sourceFrame(character, flash), null);
  assert.equal(JSON.stringify(snapshot), before);
  snapshot.superPause.anim = -1; assert.equal(superPauseFlash(snapshot), null);
  snapshot.superPause.anim = 100; snapshot.superPause.remaining = 0; assert.equal(superPauseFlash(snapshot), null);
  snapshot.superPause.remaining = 10; snapshot.superPause.darken = false;
  assert.ok(superPauseFlash(snapshot));
});

test('contact presentation resolves defaults, suppresses disabled sparks and uses runtime tick visual lifetime', () => {
  const character = { movement: { data: { sparkno: '2', 'guard.sparkno': '40' } }, animations: [] };
  const snapshot = match(10);
  const event = { kind: 'hit', tick: 10, attacker: 1, target: 2, serial: 1,
    presentation: { spark: { source: 'playerDefault', defaultKey: 'sparkno' }, guardSpark: { source: 'common', action: 40 }, sparkOffset: { x: 5, y: -20 } } };
  const original = JSON.stringify(event);
  const spark = contactSpark(character, snapshot, event);
  assert.equal(spark.anim, 2); assert.equal(spark.resource, 'common');
  assert.equal(spark.x, 25); assert.equal(spark.y, -20);
  assert.equal(sparkAtTick(character, spark, 25).age, 15);
  assert.equal(sparkAtTick(character, spark, 26), null);
  assert.equal(contactSpark(character, snapshot, { ...event, kind: 'guard' }).anim, 40);
  assert.equal(contactSpark(character, snapshot, { ...event, presentation: { spark: { source: 'common', action: -1 } } }), null);
  assert.equal(JSON.stringify(event), original);
  character.animations = [{ id: 2, frames: [{ duration: 2 }, { duration: 3 }] }];
  const self = { ...spark, resource: 'self' };
  assert.equal(sparkAtTick(character, self, 12).animElem, 2);
  assert.equal(sparkAtTick(character, self, 15), null);
});

test('generated Coiny imported visuals cover every exported action through explicit fallback metadata', async () => {
  const character = JSON.parse(await readFile(new URL('../generated/coiny/character.json', import.meta.url), 'utf8'));
  const report = JSON.parse(await readFile(new URL('../generated/luau/coiny-checkpoint-report.json', import.meta.url), 'utf8'));
  character.sourceAnimationFallbacks = report.animationFallbacks;
  for (const animation of report.animations) {
    for (let elem = 1; elem <= animation.durations.length; elem++) {
      assert.ok(sourceFrame(character, { anim: animation.id, animElem: elem }), `Missing action ${animation.id}, element ${elem}`);
    }
  }
  for (const id of [3999, 4050]) {
    const animation = character.animations.find(animation => animation.id === id);
    assert.ok(animation?.frames.length);
    for (const frame of animation.frames) if (frame.spriteKey !== null) assert.ok(character.sprites[frame.spriteKey]);
  }
});

test('life-based KO and double-KO results do not mutate the match', () => {
  for (const [life, result] of [[[1000, 1000], ''], [[1000, 0], 'P1 wins · KO'], [[0, 1000], 'P2 wins · KO'], [[0, 0], 'Draw · double KO']]) {
    const snapshot = Object.freeze({ fighters: life.map(life => Object.freeze({ life })) });
    assert.equal(combatResult(snapshot), result);
  }
});

test('cancellation from a snapshot consumer prevents remaining batch callbacks', async () => {
  const snapshots = []; let client;
  client = createSourceCombatClient({ fetchImpl: async (_, options) => {
    const request = JSON.parse(options.body); return response(request.ticks, request.ticks);
  }, onSnapshot(snapshot) {
    snapshots.push(snapshot.tick);
    if (snapshot.tick === 1) client.cancel();
  } });
  await client.reset();
  assert.equal(await client.advance(6), false);
  assert.deepEqual(snapshots, [0, 1]);
  assert.equal(client.pending, false);
});

test('actual app integrates exact two-fighter rendering, transport, buffered keys and legacy modes', async () => {
  const descriptors = new Map(['document', 'window', 'location', 'Image', 'fetch', 'requestAnimationFrame', 'performance'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const draws = [], transforms = [], canvasCalls = [], requests = [], elements = new Map();
  class Element {
    constructor() { this.listeners = {}; this.children = []; this.value = ''; this.hidden = false; this.disabled = false; this.checked = true; this.textContent = ''; this.classList = { remove() {}, add() {}, toggle() {} }; }
    addEventListener(type, handler) { (this.listeners[type] ??= []).push(handler); }
    dispatch(type, properties = {}) { for (const handler of this.listeners[type] ?? []) handler({ code: '', repeat: false, preventDefault() {}, ...properties }); }
    replaceChildren(...children) { this.children = children; if (children.length && !this.value) this.value = children[0].value; }
    append(...children) { this.children.push(...children); }
    get childNodes() { return this.children; }
    querySelector() { return get('source-option'); }
    setAttribute() {}
  }
  const get = id => { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); };
  const ctx = new Proxy({}, { get(target, key) {
    if (key === 'drawImage') return (...args) => draws.push(args);
    if (key === 'translate' || key === 'scale' || key === 'rotate') return (...args) => transforms.push([key, ...args]);
    return target[key] ?? ((...args) => canvasCalls.push([key, ...args]));
  }, set(target, key, value) { canvasCalls.push(['set', key, value]); target[key] = value; return true; } });
  const canvas = get('stage'); canvas.width = 960; canvas.height = 540; canvas.getContext = () => ctx;
  get('mode').value = 'animation'; get('zoom').value = '2';
  const document = new Element(); document.getElementById = get; document.createElement = () => new Element(); document.hidden = false;
  const window = new Element(); let raf, clock = 100, blocked = null, failing = false, knockedOut = false, visuals = false;
  const character = { id: 'coiny', name: 'Coiny', localcoord: [320, 240], movement: { size: { xscale: '.2', yscale: '.2' } },
    sprites: { '0,0': { url: 'first.png', axisX: 1, axisY: 2 }, '0,1': { url: 'second.png', axisX: 3, axisY: 4 },
      '3999,0': { url: 'portrait.png', axisX: 0, axisY: 0 }, '4050,0': { url: 'hyper.png', axisX: 0, axisY: 0 } },
    animations: [{ id: 3999, frames: [{ group: 3999, index: 0, x: -200, y: 0, duration: 1, extra: ['A1'] }] },
      { id: 4050, frames: [{ group: 4050, index: 0, x: 0, y: 0, duration: 3 }] }, { id: 0, frames: [
      { group: 0, index: 0, x: 0, y: 0, duration: 0 },
      { group: 0, index: 1, x: 0, y: 0, duration: -1 },
    ] }], commands: [], states: [], report: {} };
  const settle = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
  const frame = async delta => { clock += delta; const callback = raf; callback(clock); await settle(); };
  function frozen(value) { if (value && typeof value === 'object') { Object.values(value).forEach(frozen); Object.freeze(value); } return value; }
  globalThis.document = document; globalThis.window = window; globalThis.location = { href: 'http://localhost/preview/index.html' };
  globalThis.Image = class { set src(value) { this.url = value; this.onload(); } };
  globalThis.performance = { now: () => clock };
  globalThis.requestAnimationFrame = callback => { raf = callback; };
  globalThis.fetch = async (url, options) => {
    if (options?.method !== 'POST') return { ok: true, json: async () => String(url).endsWith('characters.json')
      ? { characters: [{ id: 'coiny', name: 'Coiny', url: './coiny/character.json' }] }
      : String(url).endsWith('coiny-checkpoint-report.json') ? { animations: [{ id: 0 }, { id: 106 }, { id: 3999 }, { id: 4050 }],
        animationFallbacks: [{ id: 106, fallback: 0 }] } : character };
    const request = { url, ...JSON.parse(options.body), signal: options.signal }; requests.push(request);
    if (blocked) { const waiting = blocked; blocked = null; return waiting.promise; }
    if (failing) return { ok: false, json: async () => ({ error: 'bridge unavailable' }) };
    if (url === '/api/movement') {
      const tick = (request.snapshot?.tick ?? 0) + request.ticks;
      const state = tick => ({ tick, state: 'idle', animation: 0, x: 4, y: 0, facing: 1 });
      return { ok: true, json: async () => ({ snapshot: state(tick), snapshots: Array.from({ length: request.ticks }, (_, i) => state(tick - request.ticks + i + 1)), ticksPerSecond: 60, warnings: [] }) };
    }
    const tick = (request.snapshot?.tick ?? 0) + request.ticks;
    const state = tick => frozen({ ...match(tick), bridgeToken: `signed-${tick}`, victoryQuote: knockedOut ? 'Source victory quote' : undefined,
      events: visuals ? [{ kind: 'guard', attacker: 1, target: 2, serial: tick, damage: 0, tick,
        presentation: { guardSpark: { source: 'common', action: 40 }, sparkOffset: { x: 0, y: -20 } } }]
        : tick ? [{ kind: 'hit', damage: 20, tick }] : [],
      effects: visuals ? [
        { resource: 'self', anim: 3999, animElem: 1, x: 0, y: 0, space: 'screen', scale: { x: 1, y: 1 }, sprpriority: -3 },
        { resource: 'self', anim: 4050, animElem: 1, x: 0, y: 0, space: 'screen', scale: { x: 1, y: 1 }, sprpriority: -7 },
        { resource: 'common', anim: 40, animElem: 1, x: -30, y: 10, space: 'screen', age: 2, sprpriority: -3, flags: { procedural: true } },
      ] : [],
      presentation: { flags: { nobg: visuals, nofg: visuals, nobardisplay: visuals } },
      superPause: { owner: 2, remaining: visuals ? 30 : 0, darken: visuals, anim: visuals ? 100 : -1,
        pos: { x: 7, y: -30 }, origin: { x: 12, y: -5 }, age: 10 },
      projectiles: tick ? [{ owner: 1, id: 1, anim: 0, animElem: 1, x: 33, y: -11, facing: -1, scale: [2, 3], removing: true }] : [],
      fighters: match(tick).fighters.map((fighter, i) => ({ ...fighter, life: i ? knockedOut ? 0 : 980 : 1000,
        state: { ...fighter.state, animElem: i + 1, stateNo: i ? 5000 : 200, x: i ? 22 : -19, y: i ? -3 : 0,
          visual: { scale: { x: visuals ? 1.5 : 1, y: visuals ? 0.5 : 1 }, angle: visuals ? 90 : 0 } } })) });
    return { ok: true, json: async () => ({ snapshot: state(tick), snapshots: Array.from({ length: request.ticks }, (_, i) => state(tick - request.ticks + i + 1)), ticksPerSecond: 60, warnings: ['No body push, stage bounds or specials.'] }) };
  };
  try {
    await import(`../preview/app.mjs?integration=${Date.now()}`);
    assert.equal(get('mode').disabled, false);
    get('mode').value = 'source-combat'; get('mode').dispatch('change'); await settle();
    assert.equal(requests.at(-1).ticks, 0); assert.equal(requests.at(-1).snapshot, null);
    assert.equal(get('animation').disabled, true); assert.equal(get('flip').disabled, true);
    assert.match(get('combat-health').textContent, /P1 LIFE 1000.*P2 LIFE 980/);
    draws.length = 0; transforms.length = 0; canvasCalls.length = 0;
    await frame(0);
    assert.ok(!canvasCalls.some(call => call[0] === 'set' && call[1] === 'fillStyle' && call[2] === '#000000a6'));
    assert.equal(draws.length, 2);
    assert.match(draws[0][0].url, /first\.png$/); assert.match(draws[1][0].url, /second\.png$/);
    assert.deepEqual(draws.map(args => args.slice(1)), [[-1, -2], [-3, -4]]);
    assert.ok(transforms.some(value => JSON.stringify(value) === JSON.stringify(['translate', -19, 0])));
    assert.ok(transforms.some(value => JSON.stringify(value) === JSON.stringify(['translate', 22, -3])));
    assert.ok(transforms.some(value => JSON.stringify(value) === JSON.stringify(['scale', .2, .2])));
    assert.ok(transforms.some(value => JSON.stringify(value) === JSON.stringify(['scale', -1, 1])));
    assert.equal(requests.at(-1).snapshot.bridgeToken, 'signed-0');
        await frame(100); assert.equal(requests.at(-1).ticks, 6);
        assert.equal(requests.at(-1).snapshot.bridgeToken, 'signed-6');
    assert.match(get('combat-events').textContent, /"damage":20/);
    draws.length = 0; transforms.length = 0; await frame(0);
    assert.equal(draws.length, 3); assert.match(draws[2][0].url, /first\.png$/);
    assert.ok(transforms.some(value => JSON.stringify(value) === JSON.stringify(['translate', 33, -11])));
    assert.ok(transforms.some(value => value[0] === 'scale' && value[1] === .4 && Math.abs(value[2] - .6) < 1e-10));
    assert.match(get('readout').textContent, /PROJECTILES 1/);
    get('pause').dispatch('click');
    for (let i=0;i<6;i++) get('step').dispatch('click');
    visuals = true; get('step').dispatch('click'); await settle();
    draws.length = 0; transforms.length = 0; canvasCalls.length = 0; await frame(0);
    assert.equal(draws.length, 5);
    assert.match(draws[0][0].url, /hyper\.png$/); assert.match(draws[1][0].url, /portrait\.png$/);
    assert.ok(canvasCalls.some(call => call[0] === 'set' && call[1] === 'globalCompositeOperation' && call[2] === 'lighter'));
    assert.ok(transforms.some(call => call[0] === 'translate' && call[1] === 120 && call[2] === 0));
    assert.ok(transforms.some(call => call[0] === 'rotate' && Math.abs(call[1]) === Math.PI / 2));
    assert.ok(transforms.some(call => call[0] === 'scale' && call[1] === 1.5 && call[2] === 0.5));
    assert.ok(canvasCalls.some(call => call[0] === 'arc')); // Guard fallback, no authored common sprites.
    assert.ok(canvasCalls.some(call => call[0] === 'set' && call[1] === 'fillStyle' && call[2] === '#000000a6'));
    assert.ok(!canvasCalls.some(call => call[0] === 'set' && call[1] === 'strokeStyle' && ['#16263c', '#3b706f'].includes(call[2])));
    assert.equal(get('combat-health').hidden, true);
    assert.match(get('visual-status').textContent, /common action 40.*procedural placeholders/);
    assert.match(get('visual-status').textContent, /Authored sprite effects: self AIR 4050, self AIR 3999/);
    assert.match(get('visual-status').textContent, /Active procedural fallback: common action 40, common action 100; original fightfx unavailable/);
    assert.doesNotMatch(get('visual-status').textContent, /darkening\/flash metadata unavailable/);
    assert.ok(transforms.some(call => call[0] === 'translate' && call[1] === 5 && call[2] === -35));
    assert.ok(canvasCalls.some(call => call[0] === 'arc' && call[3] === 27)); // Flash radius uses age10, not renderer time.
    const spriteCall = canvasCalls.findIndex(call => call[0] === 'set' && call[1] === 'globalCompositeOperation');
    assert.ok(spriteCall >= 0);
    assert.ok(canvasCalls.slice(spriteCall).some(call => call[0] === 'restore'));
    visuals = false; get('pause').dispatch('click');
    const waiting = deferred(); blocked = waiting;
    await frame(100); const pendingRequest = requests.at(-1);
    assert.equal(pendingRequest.snapshot.bridgeToken, 'signed-13');
    assert.deepEqual(pendingRequest.snapshot.projectiles, [{ owner: 1, id: 1, anim: 0, animElem: 1, x: 33, y: -11, facing: -1, scale: [2, 3], removing: true }]);
    canvas.dispatch('keydown', { code: 'KeyJ' }); window.dispatch('keyup', { code: 'KeyJ' });
    canvas.dispatch('keydown', { code: 'Numpad2' }); window.dispatch('keyup', { code: 'Numpad2' });
    waiting.resolve(response(12, 6)); await settle();
    await frame(100); assert.equal(requests.at(-1).inputs[0].x, true); assert.equal(requests.at(-1).ticks, 6);
    await frame(100); assert.equal(requests.at(-1).inputs[0].x, false);
    await frame(100); assert.equal(requests.at(-1).inputs[1].y, true);
    await frame(100); assert.equal(requests.at(-1).inputs[1].y, false);
    const extraCodes = ['KeyU', 'KeyI', 'KeyO', 'KeyT', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad0'];
    const extraStart = requests.length;
    for (const code of extraCodes) canvas.dispatch('keydown', { code });
    await frame(100); assert.equal(requests.at(-1).inputs[0].a, true);
    for (const code of extraCodes) window.dispatch('keyup', { code });
    for (let i = 0; i < 15; i++) await frame(100);
    const extraRequests = requests.slice(extraStart);
    assert.equal(extraRequests.length, 16);
    for (const input of extraRequests[0].inputs) for (const button of ['a', 'b', 'c', 's']) assert.equal(input[button], true);
    for (const input of extraRequests.at(-1).inputs) for (const button of ['a', 'b', 'c', 's']) assert.equal(input[button], false);
    get('pause').dispatch('click'); const count = requests.length;
    canvas.dispatch('focus');
    await frame(100); assert.equal(requests.length, count); assert.equal(get('pause').textContent, 'Play');
    for (let i=0;i<6;i++) get('step').dispatch('click');
        knockedOut = true;
        get('step').dispatch('click'); await settle(); assert.equal(requests.at(-1).ticks, 1);
    assert.equal(get('combat-result').hidden, false); assert.match(get('combat-result').textContent, /P1 wins/);
    assert.equal(get('victory-quote').textContent, 'Source victory quote'); assert.equal(get('victory-quote').hidden, false);
    knockedOut = false;
    get('reset').dispatch('click'); await settle(); assert.equal(requests.at(-1).snapshot, null);
    assert.equal(requests.at(-1).ticks, 0); assert.equal(get('pause').textContent, 'Play');
    get('pause').dispatch('click'); await frame(100);
    const stale = deferred(); blocked = stale; await frame(100);
    const before = get('combat-health').textContent;
    window.dispatch('blur'); assert.equal(requests.at(-1).signal.aborted, true);
    stale.resolve(response(999, 6)); await settle();
    assert.equal(get('combat-health').textContent, before); assert.equal(get('pause').textContent, 'Play');
    assert.equal(pendingRequest.signal.aborted, false);
    canvas.dispatch('focus'); assert.equal(get('pause').textContent, 'Pause');
    canvas.dispatch('keydown', {code:'KeyD'}); await frame(100);
    assert.equal(requests.at(-1).inputs[0].right,true);
    window.dispatch('keyup',{code:'KeyD'});
    get('mode').value = 'animation'; get('mode').dispatch('change');
    assert.equal(get('animation').disabled, false); assert.equal(get('flip').disabled, false);
    assert.equal(get('combat-panel').hidden, true);
    const inspectorRequests = requests.length; get('step').dispatch('click'); await frame(100);
    assert.equal(requests.length, inspectorRequests);
    get('mode').value = 'luau'; get('mode').dispatch('change'); await settle();
    assert.equal(requests.at(-1).url, '/api/movement');
    assert.equal(get('animation').disabled, true); get('step').dispatch('click'); await settle();
    assert.equal(requests.at(-1).ticks, 1); assert.match(get('readout').textContent, /LUAU/);
    get('mode').value = 'source-combat'; get('mode').dispatch('change'); await settle();
    failing = true; get('step').dispatch('click'); await settle();
    assert.match(get('movement-status').textContent, /bridge unavailable/);
    assert.equal(get('pause').textContent, 'Play');
    character.id = 'other'; get('mode').dispatch('change'); await settle();
    assert.equal(get('source-option').disabled, true);
    assert.match(get('movement-status').textContent, /only for Coiny/);
  } finally {
    for (const [key, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key];
    }
  }
});

test('frontend keeps separate modes and source-driven canvas coordinates', async () => {
  const app = await readFile(new URL('../preview/app.mjs', import.meta.url), 'utf8');
  const html = await readFile(new URL('../preview/index.html', import.meta.url), 'utf8');
  for (const mode of ['animation', 'luau', 'source-combat']) assert.match(html, new RegExp(`value="${mode}"`));
  assert.match(html, /<option value="1" selected>1×<\/option><option value="2">2×<\/option>/);
  assert.match(app, /character\?\.id !== 'coiny'/);
  assert.match(app, /sourceFrame\(character, state\)/);
  assert.match(app, /ctx\.translate\(state\.x, state\.y\)/);
  assert.match(app, /canvas\.width \/ 320, canvas\.height \/ 240/);
  const renderer = app.slice(app.indexOf('function renderCombat()'), app.indexOf('function render()'));
  assert.doesNotMatch(renderer, /tickPlayback|createPlayback|simulateTick/);
});
