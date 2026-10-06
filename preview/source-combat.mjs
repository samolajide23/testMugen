const BUTTONS = ['left', 'right', 'up', 'down', 'x', 'y', 'z', 'a', 'b', 'c', 's'];
export const COMBAT_KEYS = [
  { KeyA: 'left', KeyD: 'right', KeyW: 'up', KeyS: 'down', KeyJ: 'x', KeyK: 'y', KeyL: 'z', KeyU: 'a', KeyI: 'b', KeyO: 'c', KeyT: 's' },
  { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', Numpad1: 'x', Numpad2: 'y', Numpad3: 'z', Numpad4: 'a', Numpad5: 'b', Numpad6: 'c', Numpad0: 's' },
];
const neutral = () => [{}, {}].map(() => Object.fromEntries(BUTTONS.map(key => [key, false])));
export function combatInputs(keys) {
  return COMBAT_KEYS.map(mapping => Object.fromEntries(BUTTONS.map(button => [button,
    Object.entries(mapping).some(([code, value]) => value === button && keys.has(code))])));
}
export function sourceResources(character, state) {
  return state.resource === 'common' ? character?.common ?? null : character;
}
export function sourceFrame(character, state) {
  const resource = sourceResources(character, state);
  const id = state.resource === 'common' ? state.anim : character?.sourceAnimationFallbacks?.find(item => item.id === state.anim)?.fallback ?? state.anim;
  return resource?.animations?.find(animation => animation.id === id)?.frames[state.animElem - 1] ?? null;
}
export function combatLayers(snapshot) {
  return [
    ...(snapshot.effects ?? []).map(state => ({ kind: 'effect', state, priority: state.sprpriority ?? 0 })),
    ...snapshot.fighters.map(fighter => ({ kind: 'fighter', state: fighter.state, priority: fighter.state.sprpriority ?? 0 })),
    ...(snapshot.projectiles ?? []).map(state => ({ kind: 'projectile', state, priority: state.sprpriority ?? 0 })),
  ].sort((a, b) => a.priority - b.priority);
}
export function sourceVisualTransform(state, scale = { x: 1, y: 1 }) {
  return { x: scale.x * (state.visual?.scale?.x ?? 1), y: scale.y * (state.visual?.scale?.y ?? 1),
    radians: -(state.visual?.angle ?? 0) * (state.facing ?? 1) * Math.PI / 180 };
}
export function sourceBlend(frame) {
  const value = (frame.extra ?? []).find(value => /^A(?:1|S\d+D\d+)?$/i.test(value));
  const source = /^AS(\d+)D\d+$/i.exec(value ?? '');
  return { operation: value ? 'lighter' : 'source-over', alpha: source ? Math.min(1, Number(source[1]) / 256) : 1 };
}
export function superPauseFlash(snapshot) {
  const pause = snapshot.superPause;
  if (!pause || pause.remaining <= 0 || pause.anim !== 100 || !pause.origin || !pause.pos) return null;
  const facing = snapshot.fighters[pause.owner - 1]?.state.facing ?? 1;
  return { owner: pause.owner, resource: 'common', anim: 100, animElem: 1, elemTime: pause.age,
    x: pause.origin.x + pause.pos.x * facing, y: pause.origin.y + pause.pos.y, facing,
    space: 'world', scale: { x: 1, y: 1 }, sprpriority: 4, age: pause.age, flags: { procedural: true } };
}
export function contactSpark(character, snapshot, event) {
  const guarded = event.kind === 'guard';
  if (!guarded && event.kind !== 'hit') return null;
  const reference = event.presentation?.[guarded ? 'guardSpark' : 'spark'];
  const attacker = snapshot.fighters[event.attacker - 1]?.state;
  const target = snapshot.fighters[event.target - 1]?.state;
  if (!reference || !attacker || !target) return null;
  const defaultAction = character?.movement?.data?.[reference.defaultKey];
  const anim = reference.source === 'playerDefault' ? Number(defaultAction) : reference.action;
  if (!Number.isInteger(anim) || anim < 0) return null;
  const offset = event.presentation.sparkOffset ?? { x: 0, y: 0 };
  // Contact metadata has no exact collision point; target origin + source sparkxy is explicit approximation.
  return { owner: event.attacker, kind: guarded ? 'guard' : 'hit', resource: reference.source === 'self' ? 'self' : 'common',
    anim, animElem: 1, elemTime: 0, x: target.x + offset.x * attacker.facing, y: target.y + offset.y,
    facing: attacker.facing, space: 'world', scale: { x: 1, y: 1 }, sprpriority: 3, age: 0, birthTick: event.tick,
    key: `${event.tick}:${event.attacker}:${event.target}:${event.serial}:${event.kind}` };
}
export function sparkAtTick(character, spark, tick) {
  const age = Math.max(0, tick - spark.birthTick);
  const frames = sourceResources(character, spark)?.animations?.find(animation => animation.id === spark.anim)?.frames;
  if (!frames) return age < 16 ? { ...spark, age } : null;
  let time = age;
  for (let i = 0; i < frames.length; i++) {
    const duration = frames[i].duration;
    if (duration < 0 || time < duration) return { ...spark, age, animElem: i + 1, elemTime: time };
    time -= duration;
  }
  return null;
}
export function combatResult(snapshot) {
  const defeated = snapshot.fighters.map(fighter => fighter.life <= 0);
  if (defeated.every(Boolean)) return 'Draw · double KO';
  if (defeated[0]) return 'P2 wins · KO';
  if (defeated[1]) return 'P1 wins · KO';
  return '';
}
function validMatch(match) {
  return match && Array.isArray(match.fighters) && match.fighters.length === 2 && Array.isArray(match.events)
    && match.fighters.every(fighter => fighter && Number.isFinite(fighter.life) && fighter.state
      && ['anim', 'animElem', 'x', 'y', 'facing', 'stateNo'].every(key => Number.isFinite(fighter.state[key]))
      && Number.isInteger(fighter.state.animElem) && fighter.state.animElem >= 1
      && Math.abs(fighter.state.facing) === 1);
}
export function createSourceCombatClient({ fetchImpl = fetch, onSnapshot = () => {}, onError = () => {}, onWarnings = () => {}, timedPlayback = false, chordWindowMs = 0, now = () => performance.now() } = {}) {
  let generation = 0, pending = null, snapshot = null;
  let frames = [], playbackTime = 0;
  let held = neutral(), queue = [];
  function clearInput() { held = neutral(); queue = []; }
  function cancel(forget = false) {
    generation++;
    pending?.controller.abort();
    pending = null;
    clearInput();
        if (forget) { snapshot = null; frames = []; playbackTime = 0; }
  }
  function setInputs(inputs) {
    const next = [0, 1].map(index => Object.fromEntries(BUTTONS.map(key => [key, Boolean(inputs[index]?.[key])])));
    if (JSON.stringify(next) !== JSON.stringify(held)) {
      const previous = held;
      held = next;
      const attackButtons = ['x', 'y', 'z', 'a', 'b', 'c', 's'];
      const pressOnly = next.every((input, player) => BUTTONS.every(button =>
        input[button] === previous[player][button] || (attackButtons.includes(button) && input[button] && !previous[player][button])));
      const last = queue.at(-1);
      // Keyboard chord events arrive separately; collect added buttons before committing a normal.
      if (chordWindowMs > 0 && pressOnly && last?.collecting && now() - last.at < chordWindowMs) {
        last.inputs = next;
      } else {
        queue.push({ inputs: next, at: now(), collecting: chordWindowMs > 0 && pressOnly });
      }
    }
  }
  function batchSize(ticks) {
    return Math.max(1, Math.min(6, Math.floor(ticks)));
  }
  async function request(inputs, ticks) {
    const current = { generation, controller: new AbortController() };
    pending = current;
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; current.controller.abort(); }, 5000);
    try {
      const response = await fetchImpl('/api/source-combat', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Rift-Source-Combat': '1' },
        body: JSON.stringify({ snapshot, inputs, ticks, ...(snapshot === null ? { intro: true } : {}) }), signal: current.controller.signal,
      });
      const body = await response.json().catch(() => { throw new Error('Source combat bridge unavailable. Restart the local preview server.'); });
      if (generation !== current.generation) return false;
      if (!response.ok) throw new Error(body.error ?? `Source combat request failed (${response.status})`);
      if (!validMatch(body.snapshot) || !Array.isArray(body.snapshots) || body.snapshots.length !== ticks
        || !body.snapshots.every(validMatch) || body.ticksPerSecond !== 60 || !Array.isArray(body.warnings)) {
        throw new Error('Invalid source combat bridge response. Restart the local preview server.');
      }
      snapshot = body.snapshot;
      onWarnings(body.warnings);
      if (timedPlayback && ticks) frames.push(...body.snapshots);
            else for (const state of ticks ? body.snapshots : [snapshot]) {
              if (generation !== current.generation) return false;
              onSnapshot(state);
            }
      return true;
    } catch (error) {
      if (generation === current.generation && (!current.controller.signal.aborted || timedOut)) {
        onError(timedOut ? new Error('Source combat bridge timed out. Restart the local server.') : error);
      }
      return false;
    } finally {
      clearTimeout(timer);
      if (pending === current) pending = null;
    }
  }
  return {
    get ready() { return snapshot !== null; },
    get pending() { return pending !== null; },
    setInputs, batchSize, cancel,
        get bufferedTicks() { return frames.length; },
        play(delta, singleStep = false) {
          playbackTime = Math.min(playbackTime + delta, 0.1);
          if (singleStep && frames.length) { onSnapshot(frames.shift()); playbackTime = 0; return; }
          while (frames.length && playbackTime >= 1 / 60) {
            playbackTime -= 1 / 60; onSnapshot(frames.shift());
          }
          if (!frames.length) playbackTime = 0;
        },
        reset() { cancel(true); return request(neutral(), 0); },
    advance(ticks = 1) {
      if (pending || !snapshot) return Promise.resolve(false);
      if (!Number.isInteger(ticks) || ticks < 1 || ticks > 6) return Promise.resolve(false);
      const count = batchSize(ticks);
      if (queue[0]?.collecting && now() - queue[0].at < chordWindowMs) return Promise.resolve(false);
      const inputs = queue.length ? queue.shift().inputs : held;
      return request(inputs, count);
    },
  };
}
