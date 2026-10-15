import { createPlayback, currentFrame, tickPlayback, frameTransform, characterScale, TICKS_PER_SECOND } from './animation.mjs';
import { renderCommandGuide } from './command-guide.mjs';
import { createMovementClient } from './movement.mjs';
import { createSourceCombatClient, combatInputs, COMBAT_KEYS, sourceFrame, sourceResources, sourceVisualTransform, sourceBlend, combatLayers, superPauseFlash, contactSpark, sparkAtTick, combatResult } from './source-combat.mjs';
import {
  isSpineCharacter, createSpinePlayback, setSpineAnimation, updateSpine, drawSpine, spineReadout,
} from './spine.mjs';
import { profileLabel, applyWalkProfile, walkMoveDelta } from './walk-profiles.mjs';

const $ = (id) => document.getElementById(id);
const canvas = $('stage');
const ctx = canvas.getContext('2d');
const keys = new Set();
const images = new Map();
let character = null;
let characterUrl = null;
let playback = createPlayback(null);
let spinePlayback = null;
let walkProfiles = [];
let paused = false;
let pausedByFocus = false;
let facing = 1;
let position = 480;
let loadGeneration = 0;
let accumulator = 0;
let lastTime = 0;
let movementSnapshot = null;
let movementWarnings = '';
let jumpQueued = false;
const isLuau = () => $('mode').value === 'luau';
const isCombat = () => $('mode').value === 'source-combat';
const isSpine = () => isSpineCharacter(character);
const isHitmanRig = () => character?.rig === 'hitman' || character?.id === 'hitman' || character?.id === 'coral_striker';
let combatSnapshot = null;
let combatEvents = [];
let contactSparks = [];
const combat = createSourceCombatClient({
  timedPlayback: true,
  chordWindowMs: 1000 / 30,
  onSnapshot(snapshot) {
    combatSnapshot = snapshot;
    contactSparks = contactSparks.filter(spark => sparkAtTick(character, spark, snapshot.tick));
    for (const event of snapshot.events) {
      const spark = contactSpark(character, snapshot, event);
      if (spark && !contactSparks.some(item => item.key === spark.key)) contactSparks.push(spark);
    }
    combatEvents = [...combatEvents, ...snapshot.events].slice(-12);
    $('combat-health').textContent = snapshot.fighters.map((fighter, index) =>
      `P${index + 1} LIFE ${fighter.life} · POWER ${fighter.state.power ?? 0} · STATE ${fighter.state.stateNo} · ${fighter.reaction?.kind ?? 'ready'}`).join(' | ');
    $('combat-result').textContent = combatResult(snapshot);
    $('combat-result').hidden = !$('combat-result').textContent;
    $('combat-events').textContent = combatEvents.length ? combatEvents.map(event => JSON.stringify(event)).join('\n') : 'No combat events yet.';
    $('movement-status').textContent = 'Coiny source combat · local Luau bridge · 60 ticks/second · no JavaScript combat fallback';
    render();
  },
  onWarnings(warnings) {
    $('movement-notices').hidden = !warnings.length;
    $('movement-warnings').replaceChildren(...warnings.map(warning => {
      const item = document.createElement('li'); item.textContent = typeof warning === 'string' ? warning : JSON.stringify(warning); return item;
    }));
  },
  onError(error) {
    setPaused(true);
    $('movement-status').textContent = `Source combat unavailable: ${error.message} No JavaScript fallback is used.`;
    syncControls();
  },
});
function resetCombat() {
  keys.clear(); accumulator = 0; combatSnapshot = null; combatEvents = []; contactSparks = [];
  $('combat-health').textContent = 'Connecting…'; $('combat-events').textContent = 'No combat events yet.';
  $('combat-result').hidden = true; $('combat-result').textContent = '';
  $('movement-status').textContent = 'Connecting to local Coiny source combat…';
  if (character?.id !== 'coiny') {
    combat.cancel(true);
    $('movement-status').textContent = 'Source combat is available only for Coiny.';
    syncControls(); return Promise.resolve(false);
  }
  const request = combat.reset(); syncControls();
  return request.finally(syncControls);
}
const movement = createMovementClient({
  onSnapshot(snapshot) {
    const changed = !movementSnapshot || movementSnapshot.state !== snapshot.state || movementSnapshot.animation !== snapshot.animation;
    movementSnapshot = snapshot;
    facing = snapshot.facing;
    if (changed) {
      const index = character.animations.findIndex(animation => animation.id === snapshot.animation);
      $('animation').value = index < 0 ? '' : String(index);
      playback = createPlayback(index < 0 ? null : character.animations[index]);
    } else tickPlayback(playback);
    $('movement-status').textContent = 'Luau core connected · local simulation · 60 ticks/second · source units';
    render();
  },
  onError(error) {
    setPaused(true);
    $('movement-status').textContent = `Luau unavailable: ${error.message} No JavaScript physics fallback is used.`;
  },
  onWarnings(warnings) {
    const signature = JSON.stringify(warnings);
    if (signature === movementWarnings) return;
    movementWarnings = signature;
    $('movement-notices').hidden = !warnings.length;
    $('movement-warnings').replaceChildren(...warnings.map(warning => {
      const item = document.createElement('li'); item.textContent = warning; return item;
    }));
  },
});

function syncControls() {
  const loaded = character !== null;
  const spine = isSpine();
  $('mode').disabled = !loaded || spine;
  $('mode').querySelector('[value="luau"]').disabled = spine;
  $('mode').querySelector('[value="source-combat"]').disabled = spine || character?.id !== 'coiny';
  if (spine && $('mode').value !== 'animation') $('mode').value = 'animation';
  $('combat-panel').hidden = !isCombat();
  $('animation').disabled = !loaded || isLuau() || isCombat() || !(character?.animations?.length);
  $('flip').disabled = !loaded || isLuau() || isCombat();
  $('step').disabled = !loaded || (isLuau() && (!movement.ready || movement.pending)) || (isCombat() && (!combat.ready || combat.pending));
  $('pause').disabled = !loaded;
  $('reset').disabled = !loaded;
  // Collision boxes are AIR metadata; Spine debug bones use the origin checkbox.
  $('boxes').disabled = spine;
  const walkLab = spine && isHitmanRig() && walkProfiles.length > 0;
  $('walk-type-label').hidden = !walkLab;
  $('walk-type').disabled = !walkLab;
}

function resetMovement() {
  keys.clear(); jumpQueued = false; accumulator = 0; movementSnapshot = null; movementWarnings = '';
  playback = createPlayback(null);
  $('movement-status').textContent = 'Connecting to the local Luau core…';
  const request = movement.reset(character.id);
  syncControls();
  return request.finally(syncControls);
}

function movementInput() {
  const queued = jumpQueued;
  jumpQueued = false;
  return {
    left: keys.has('KeyA') || keys.has('ArrowLeft'), right: keys.has('KeyD') || keys.has('ArrowRight'),
    down: keys.has('KeyS') || keys.has('ArrowDown'), jump: queued || keys.has('KeyW') || keys.has('ArrowUp'),
  };
}

function clearInput() {
  keys.clear(); jumpQueued = false; accumulator = 0;
  if (movement.ready) movement.cancel();
  combat.cancel();
  if (isCombat() && !paused) {
    setPaused(true);
    pausedByFocus = true;
  }
  syncControls();
}

async function readJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${response.status}: ${url.pathname}`);
  return response.json();
}

function option(value, text) {
  const node = document.createElement('option');
  node.value = value;
  node.textContent = text;
  return node;
}

function showWarnings(warnings) {
  $('warning-title').textContent = `Import warnings (${warnings.length})`;
  $('warnings').replaceChildren(...warnings.map((warning) => {
    const item = document.createElement('li');
    item.textContent = typeof warning === 'string' ? warning : JSON.stringify(warning);
    return item;
  }));
}

function chooseWalkType() {
  if (!spinePlayback || !isHitmanRig()) return;
  const id = $('walk-type').value;
  const profile = walkProfiles.find((entry) => entry.id === id) ?? null;
  applyWalkProfile(spinePlayback, profile, { forceWalk: true });
  if (profile && !profile.missing) {
    const walkIndex = character.animations.findIndex((anim) => anim.id === 'Walk');
    if (walkIndex >= 0) $('animation').value = String(walkIndex);
  }
  const map = profile?.hitman;
  $('movement-status').textContent = profile && !profile.missing
    ? `Walk type · ${profile.name} · ${profile.note} · Hitman timeScale ${map.timeScale} · move×${map.moveSpeedScale} · hold A/D to compare stride`
    : 'Spine preview: A/D move · F flip · Space pause. Origin checkbox draws bone debug.';
  render();
}

function chooseAnimation() {
  const animation = character?.animations[Number($('animation').value)];
  accumulator = 0;
  if (isSpine()) {
    if (spinePlayback && animation?.id) setSpineAnimation(spinePlayback, animation.id, { loop: true });
    // Keep walk-type timeScale even when scrubbing other clips.
    if (isHitmanRig() && $('walk-type').value) {
      const profile = walkProfiles.find((entry) => entry.id === $('walk-type').value);
      if (profile?.hitman && !profile.missing) {
        spinePlayback.timeScale = profile.hitman.timeScale;
        spinePlayback.walkMoveScale = profile.hitman.moveSpeedScale;
        spinePlayback.walkProfile = profile;
        spinePlayback.walkProfileId = profile.id;
      }
    }
    render();
    return;
  }
  playback = createPlayback(animation);
  render();
}

function setPaused(value) {
  pausedByFocus = false;
  paused = value;
  accumulator = 0;
  if (value) {
    jumpQueued = false; if (movement.ready) movement.cancel();
    combat.cancel(); if (isCombat()) keys.clear();
  }
  $('pause').textContent = paused ? 'Play' : 'Pause';
  syncControls();
}

async function loadCharacter(url) {
  const generation = ++loadGeneration;
  movement.cancel(true);
  combat.cancel(true); combatSnapshot = null; combatEvents = []; contactSparks = [];
  movementSnapshot = null;
  movementWarnings = '';
  $('movement-notices').hidden = true;
  $('mode').disabled = true;
  keys.clear();
  character = null;
  characterUrl = null;
  spinePlayback = null;
  images.clear();
  playback = createPlayback(null);
  $('status').textContent = 'Reading character and decoding sprite images…';
  $('name').textContent = 'Loading…';
  $('stats').replaceChildren();
  showWarnings([]);
  $('controllers').textContent = '—';
  renderCommandGuide($('command-guide'), null);
  $('walk-type-label').hidden = true;
  $('walk-type').disabled = true;
  for (const id of ['animation', 'pause', 'step', 'reset', 'flip']) $(id).disabled = true;
  try {
    const data = await readJson(url);
    if (generation !== loadGeneration) return;

    if (isSpineCharacter(data)) {
      $('status').textContent = 'Loading Spine skeleton, atlas, and textures…';
      const loadedSpine = await createSpinePlayback(data, url, data.spine.defaultAnimation);
      if (generation !== loadGeneration) return;
      data.animations = loadedSpine.animations;
      character = data;
      characterUrl = url;
      spinePlayback = loadedSpine;
      $('mode').value = 'animation';
      position = canvas.width / 2;
      facing = 1;
      $('animation').replaceChildren(...data.animations.map((anim, index) =>
        option(index, `${anim.name ?? anim.id}`)));
      const idleIndex = data.animations.findIndex((anim) => anim.id === (data.spine.defaultAnimation ?? 'Idle'));
      if (idleIndex >= 0) $('animation').value = String(idleIndex);
      $('name').textContent = data.name;
      $('status').textContent = `Spine ${data.spine.runtime} skeleton ready · ${data.animations.length} animations · skeletal preview only.`;
      const stats = {
        'Source': data.sourceVersion ?? 'Spine',
        'Kind': 'Spine skeletal',
        'Animations': data.animations.length,
        'Bones': loadedSpine.skeletonData.bones.length,
        'Slots': loadedSpine.skeletonData.slots.length,
        'Display scale': data.spine.scale,
      };
      if ((data.rig === 'hitman' || data.id === 'hitman' || data.id === 'coral_striker') && walkProfiles.length) {
        stats['Walk types'] = walkProfiles.filter((entry) => !entry.missing).length;
      }
      $('stats').replaceChildren(...Object.entries(stats).flatMap(([label, value]) => {
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = label;
        dd.textContent = String(value);
        return [dt, dd];
      }));
      showWarnings([...(data.report?.warnings ?? [])]);
      $('controllers').textContent = 'Spine AnimationState (no MUGEN controllers)';
      renderCommandGuide($('command-guide'), null);
      for (const id of ['animation', 'pause', 'step', 'reset', 'flip']) $(id).disabled = !data.animations.length;
      populateWalkTypeSelect(data.id);
      setPaused(false);
      chooseAnimation();
      if ((data.rig === 'hitman' || data.id === 'hitman' || data.id === 'coral_striker') && walkProfiles.length) chooseWalkType();
      else {
        $('movement-status').textContent = 'Spine preview: A/D move · F flip · Space pause. Origin checkbox draws bone debug.';
      }
      syncControls();
      return true;
    }

    let checkpointReport = null;
    if (/^[a-z0-9][a-z0-9_-]{0,63}$/.test(data.id)) {
      try {
        checkpointReport = await readJson(new URL(`/generated/luau/${data.id}-checkpoint-report.json`, location.href));
      } catch { /* Characters without an exported checkpoint remain unverified. */ }
    }
    if (data.id === 'coiny') {
      try {
        if (!checkpointReport) throw new Error('Missing checkpoint report');
        const report = checkpointReport;
        data.sourceAnimationFallbacks = report.animationFallbacks ?? [];
        const missing = (report.animations ?? []).filter(animation => !data.animations.some(item => item.id === animation.id)
          && !data.sourceAnimationFallbacks.some(item => item.id === animation.id && data.animations.some(animation => animation.id === item.fallback)));
        if (missing.length) data.report = { ...data.report, warnings: [...(data.report?.warnings ?? []),
          `Exported actions lack imported visual metadata: ${missing.map(animation => animation.id).join(', ')}.`] };
      } catch {
        data.report = { ...data.report, warnings: [...(data.report?.warnings ?? []), 'Source visual fallback metadata unavailable. Re-export the Coiny checkpoint.'] };
      }
    }
    const loaded = new Map();
    const failed = [];
    const spriteEntries = [...Object.entries(data.sprites),
      ...Object.entries(data.common?.sprites ?? {}).map(([key, sprite]) => [`common:${key}`, sprite])];
    await Promise.all(spriteEntries.map(async ([key, sprite]) => {
      try {
        const image = new Image();
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = () => reject(new Error('Image load failed'));
          image.src = new URL(sprite.url, url).href;
        });
        loaded.set(key, image);
      } catch {
        failed.push(`Could not load sprite ${key}.`);
      }
    }));
    if (generation !== loadGeneration) return;
    character = data;
    characterUrl = url;
    renderCommandGuide($('command-guide'), data, checkpointReport);
    if (isCombat() && data.id !== 'coiny') $('mode').value = 'animation';
    for (const entry of loaded) images.set(...entry);
    position = canvas.width / 2;
    facing = 1;
    const names = { 0: 'Idle', 5: 'Turn', 10: 'Crouch transition', 11: 'Crouch', 12: 'Stand up', 20: 'Walk forward', 21: 'Walk backward', 40: 'Jump start', 41: 'Jump', 42: 'Jump forward', 43: 'Jump backward', 47: 'Land', 100: 'Run forward', 105: 'Run backward' };
    $('animation').replaceChildren(...data.animations.map((anim, index) => option(index, `${anim.id} · ${names[anim.id] ?? 'Action'} · ${anim.frames.length} frames`)));
    const idleIndex = data.animations.findIndex((anim) => anim.id === 0);
    if (idleIndex >= 0) $('animation').value = String(idleIndex);
    $('name').textContent = data.name;
    $('status').textContent = `${loaded.size} sprite images ready. Coiny supports the local source combat checkpoint; other characters support inspection and Luau movement.`;
    const stats = { 'MUGEN version': data.sourceVersion ?? 'Unknown', 'Animations': data.animations.length, 'Sprites decoded': loaded.size, 'Command definitions': data.commands?.length ?? 0, 'State definitions': data.states?.length ?? 0, 'Coordinate space': (data.localcoord ?? [320, 240]).join(' × ') };
    const scale = characterScale(data);
    stats['Source scale (X / Y)'] = `${scale.x}× / ${scale.y}×`;
    $('stats').replaceChildren(...Object.entries(stats).flatMap(([label, value]) => {
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = label;
      dd.textContent = String(value);
      return [dt, dd];
    }));
    showWarnings([...(data.report?.warnings ?? []), ...failed]);
    $('controllers').textContent = (data.report?.controllerTypes ?? []).join(', ') || 'None found';
    for (const id of ['animation', 'pause', 'step', 'reset', 'flip']) $(id).disabled = !data.animations.length;
    setPaused(false);
    chooseAnimation();
    if (isLuau()) void resetMovement();
    else if (isCombat()) void resetCombat();
    else $('movement-status').textContent = 'Animation inspector: fixed-speed preview movement.';
    syncControls();
    return true;
  } catch (error) {
    if (generation !== loadGeneration) return;
    $('name').textContent = 'Import unavailable';
    $('status').textContent = `Unable to load character: ${error.message}. Run npm run import:chars and reload.`;
    return false;
  }
}

function drawBoxes(boxes, color, strokeScale) {
  ctx.strokeStyle = color;
  ctx.fillStyle = `${color}25`;
  ctx.lineWidth = 1 / Math.max(strokeScale, 0.001);
  for (const [x1, y1, x2, y2] of boxes ?? []) {
    ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  }
}

function drawSourceSprite(state, scale, strokeScale, debug = true) {
  const frame = sourceFrame(character, state);
  if (!frame) return false;
  const key = Object.hasOwn(frame, 'spriteKey') ? frame.spriteKey
    : frame.group === -1 || frame.index === -1 ? null : `${frame.group},${frame.index}`;
  const resource = sourceResources(character, state);
  const sprite = resource?.sprites?.[key], image = images.get(state.resource === 'common' ? `common:${key}` : key);
  ctx.save(); ctx.translate(state.x, state.y);
  ctx.save(); ctx.scale(scale.x, scale.y);
  if (sprite && image && !state.presentation?.flags?.invisible) {
    const transform = frameTransform(sprite, frame, state.facing ?? 1);
    const visual = sourceVisualTransform(state);
    const blend = sourceBlend(frame);
    ctx.save(); ctx.rotate(visual.radians); ctx.scale(visual.x, visual.y);
    ctx.globalCompositeOperation = blend.operation; ctx.globalAlpha = blend.alpha;
    ctx.translate(transform.x, transform.y); ctx.scale(transform.scaleX, transform.scaleY);
    ctx.drawImage(image, transform.imageX, transform.imageY); ctx.restore();
  }
  if (debug && $('boxes').checked) {
    ctx.save(); ctx.scale(state.facing, 1);
    drawBoxes(frame.hurtBoxes, '#61b8ff', strokeScale);
    drawBoxes(frame.attackBoxes, '#ff647e', strokeScale); ctx.restore();
  }
  ctx.restore();
  if (debug && $('origin').checked) {
    ctx.strokeStyle = '#70e0ce'; ctx.lineWidth = Math.max(Math.abs(scale.x), Math.abs(scale.y)) / strokeScale;
    ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(3, 0); ctx.moveTo(0, -3); ctx.lineTo(0, 3); ctx.stroke();
  }
  ctx.restore();
  return key === null || Boolean(sprite && image);
}

function drawCommonFallback(effect) {
  // These geometric placeholders are not MUGEN fightfx artwork; see the combat panel.
  const age = Math.max(0, effect.age ?? 0);
  ctx.save(); ctx.translate(effect.x, effect.y);
  ctx.scale((effect.scale?.x ?? 1) * (effect.facing ?? 1), (effect.scale?.y ?? 1) * (effect.vfacing ?? 1));
  if (effect.space === 'screen' && effect.anim === 40) {
    ctx.globalAlpha = Math.max(0, Math.min(1, (160 - age) / 20));
    ctx.fillStyle = '#122442'; ctx.fillRect(-320, -240, 960, 720);
    ctx.strokeStyle = '#eebf62'; ctx.lineWidth = 2;
    for (let y = 25; y < 210; y += 24) {
      ctx.beginPath(); ctx.moveTo(-320, y); ctx.lineTo(640, y - 45); ctx.stroke();
    }
  } else {
    const superSpark = effect.kind === 'superpause' || effect.anim === 100;
    const guarded = effect.kind === 'guard' || effect.anim === 40;
    const radius = (superSpark ? 12 : 4) + Math.min(age, 20) * (superSpark ? 1.5 : 0.7);
    ctx.globalAlpha = Math.max(0.15, 1 - age / (superSpark ? 30 : 16));
    ctx.strokeStyle = guarded ? '#74d9ff' : '#ffe08a'; ctx.lineWidth = guarded ? 2 : 1.5;
    ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.stroke();
    if (!guarded) for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4;
      ctx.beginPath(); ctx.moveTo(Math.cos(angle) * radius * 0.45, Math.sin(angle) * radius * 0.45);
      ctx.lineTo(Math.cos(angle) * radius * 1.5, Math.sin(angle) * radius * 1.5); ctx.stroke();
    }
  }
  ctx.restore();
}

function renderCombat() {
  if (!character || !combatSnapshot) {
    $('readout').textContent = 'Waiting for Coiny source combat snapshot.';
    return;
  }
  const viewport = Math.min(canvas.width / 320, canvas.height / 240);
  const zoom = Number($('zoom').value) / 2;
  const scale = characterScale(character);
  if (combatSnapshot.superPause?.darken && combatSnapshot.superPause.remaining > 0) {
    ctx.fillStyle = '#000000a6'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.imageSmoothingEnabled = false;
  const missing = new Set(), authored = new Set(), procedural = new Set();
  const sparkVisuals = [...contactSparks.map(spark => sparkAtTick(character, spark, combatSnapshot.tick)), superPauseFlash(combatSnapshot)].filter(Boolean);
  for (const { kind, state } of combatLayers({ ...combatSnapshot, effects: [...(combatSnapshot.effects ?? []), ...sparkVisuals] })) {
    ctx.save();
    if (kind === 'effect' && state.space === 'screen') {
      // HUD/full-screen AIR uses source screen coordinates, never the world camera zoom.
      ctx.translate((canvas.width - 320 * viewport) / 2, (canvas.height - 240 * viewport) / 2);
      ctx.scale(viewport, viewport);
    } else {
      ctx.translate(canvas.width / 2, 200 * viewport);
      ctx.scale(viewport * zoom, viewport * zoom);
    }
    const entityScale = kind === 'effect' ? { x: state.scale?.x ?? 1, y: (state.scale?.y ?? 1) * (state.vfacing ?? 1) }
      : kind === 'projectile' ? { x: scale.x * (state.scale?.[0] ?? 1), y: scale.y * (state.scale?.[1] ?? 1) } : scale;
    const drawn = !state.flags?.procedural && drawSourceSprite(state, entityScale,
      viewport * zoom * Math.max(Math.abs(entityScale.x), Math.abs(entityScale.y)), kind !== 'effect');
    if (drawn && kind === 'effect' && state.resource !== 'common') authored.add(`self AIR ${state.anim}`);
    if (!drawn) {
      missing.add(`${state.resource ?? 'self'} action ${state.anim}`);
      if (kind === 'effect' && state.resource === 'common') {
        drawCommonFallback(state); procedural.add(`common action ${state.anim}`);
      }
    }
    ctx.restore();
  }
  $('combat-health').hidden = Boolean(combatSnapshot.presentation?.flags?.nobardisplay);
  const fallbacks = combatSnapshot.fighters.map(({ state }) => character.sourceAnimationFallbacks?.find(item => item.id === state.anim))
    .filter(Boolean).map(item => `action ${item.id} → ${item.fallback}`);
  $('visual-status').textContent = (missing.size ? `Missing artwork: ${[...missing].join(', ')}. Common effects use labeled procedural placeholders.`
    : 'Authored Coiny AIR visuals · no audio. Common fightfx fallbacks are procedural, not original artwork.')
    + (authored.size ? ` Authored sprite effects: ${[...authored].join(', ')}.` : '')
    + (procedural.size ? ` Active procedural fallback: ${[...procedural].join(', ')}; original fightfx unavailable.` : '')
    + (fallbacks.length ? ` Exported visual fallback: ${fallbacks.join(', ')}.` : '');
  $('readout').textContent = `SOURCE TICK ${combatSnapshot.tick ?? '—'} / EFFECTS ${combatSnapshot.effects?.length ?? 0} / PROJECTILES ${combatSnapshot.projectiles?.length ?? 0} / ` + combatSnapshot.fighters.map(({ state }, index) =>
    `P${index + 1} STATE ${state.stateNo} ACTION ${state.anim} ELEMENT ${state.animElem} X ${state.x.toFixed(1)} Y ${state.y.toFixed(1)} FACING ${state.facing}`).join(' / ');
}

function render() {
  const w = canvas.width;
  const h = canvas.height;
  const floor = isCombat() ? 200 * Math.min(w / 320, h / 240) : 420;
  const zoom = Number($('zoom').value);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0c1526';
  ctx.fillRect(0, 0, w, h);
  const presentation = isCombat() ? combatSnapshot?.presentation?.flags : null;
  if (!presentation?.nobg) {
    ctx.strokeStyle = '#16263c';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < w; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = 20; y < h; y += 40) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();
    ctx.fillStyle = '#111e30';
    ctx.fillRect(0, floor, w, h - floor);
  }
  if (!presentation?.nofg) {
    ctx.strokeStyle = '#3b706f';
    ctx.beginPath(); ctx.moveTo(0, floor); ctx.lineTo(w, floor); ctx.stroke();
  }
  $('combat-health').hidden = Boolean(presentation?.nobardisplay);
  $('victory-quote').textContent = isCombat() ? combatSnapshot?.victoryQuote ?? '' : '';
  $('victory-quote').hidden = !$('victory-quote').textContent;
  if (isCombat()) { renderCombat(); return; }
  if (isSpine()) {
    if (!spinePlayback) {
      ctx.fillStyle = '#6e88a6'; ctx.font = '16px Segoe UI'; ctx.textAlign = 'center';
      ctx.fillText('Loading Spine skeleton…', w / 2, h / 2);
      $('readout').textContent = 'Waiting for Spine assets.';
      return;
    }
    ctx.save();
    ctx.translate(position, floor);
    ctx.scale(zoom, zoom);
    ctx.imageSmoothingEnabled = true;
    drawSpine(ctx, spinePlayback, {
      x: 0,
      y: 0,
      facing,
      debug: $('origin').checked,
    });
    ctx.restore();
    $('readout').textContent = spineReadout(spinePlayback, facing);
    return;
  }
  const frame = currentFrame(playback);
  if (!character || !frame) {
    ctx.fillStyle = '#6e88a6'; ctx.font = '16px Segoe UI'; ctx.textAlign = 'center';
    ctx.fillText(isLuau() ? 'Waiting for Luau or no animation mapped to this state.' : character ? 'This character has no parsed animations.' : 'Waiting for imported character data…', w / 2, h / 2);
    $('readout').textContent = movementSnapshot ? `LUAU ${movementSnapshot.state} / TICK ${movementSnapshot.tick} / No mapped animation` : 'No active animation.';
    return;
  }
  const key = Object.hasOwn(frame, 'spriteKey') ? frame.spriteKey
    : frame.group === -1 || frame.index === -1 ? null : `${frame.group},${frame.index}`;
  const sprite = character.sprites[key];
  const image = images.get(key);
  ctx.save();
  ctx.translate(isLuau() ? w / 2 + (movementSnapshot?.x ?? 0) * zoom : position, floor + (isLuau() ? (movementSnapshot?.y ?? 0) * zoom : 0));
  ctx.scale(zoom, zoom);
  ctx.save();
  const scale = characterScale(character);
  ctx.scale(scale.x, scale.y);
  ctx.imageSmoothingEnabled = false;
  if (sprite && image) {
    const transform = frameTransform(sprite, frame, facing);
    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scaleX, transform.scaleY);
    ctx.drawImage(image, transform.imageX, transform.imageY);
    ctx.restore();
  } else if (key !== null) {
    ctx.fillStyle = '#e8b666'; ctx.font = '9px monospace'; ctx.textAlign = 'center';
    ctx.fillText(`Missing sprite ${key}`, 0, -35);
  }
  if ($('boxes').checked) {
    ctx.save();
    // AIR collision coordinates are relative to the character, not sprite axes.
    ctx.scale(facing, 1);
    const strokeScale = zoom * Math.max(Math.abs(scale.x), Math.abs(scale.y));
    drawBoxes(frame.hurtBoxes, '#61b8ff', strokeScale);
    drawBoxes(frame.attackBoxes, '#ff647e', strokeScale);
    ctx.restore();
  }
  ctx.restore();
  if ($('origin').checked) {
    ctx.strokeStyle = '#70e0ce'; ctx.lineWidth = 1 / zoom;
    ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(7, 0); ctx.moveTo(0, -7); ctx.lineTo(0, 7); ctx.stroke();
  }
  ctx.restore();
  const stateInfo = isLuau() && movementSnapshot ? `LUAU ${movementSnapshot.state.toUpperCase()} / TICK ${movementSnapshot.tick} / X ${movementSnapshot.x.toFixed(1)} Y ${movementSnapshot.y.toFixed(1)} / ` : '';
  $('readout').textContent = stateInfo + `ACTION ${playback.animation.id}  /  FRAME ${playback.frameIndex + 1} OF ${playback.animation.frames.length}  /  SPRITE ${key ?? 'BLANK'}  /  ${frame.duration < 0 ? 'HOLD' : `${frame.duration} TICKS`}  /  FACING ${facing === 1 ? 'RIGHT' : 'LEFT'}`;
}

function simulateTick() {
  tickPlayback(playback);
  const direction = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft'));
  position = Math.max(40, Math.min(canvas.width - 40, position + direction * 3));
}

function populateWalkTypeSelect(characterId) {
  const hitmanRig = characterId === 'hitman' || characterId === 'coral_striker' || character?.rig === 'hitman';
  if (!hitmanRig || !walkProfiles.length) {
    $('walk-type').replaceChildren(option('', 'Hitman only'));
    return;
  }
  $('walk-type').replaceChildren(...walkProfiles.map((profile) =>
    option(profile.id, profileLabel(profile))));
  const preferred = walkProfiles.find((profile) => profile.id === 'hitman') ?? walkProfiles[0];
  if (preferred) $('walk-type').value = preferred.id;
}

function simulateSpine(delta) {
  updateSpine(spinePlayback, delta);
  const direction = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft'));
  position = Math.max(40, Math.min(canvas.width - 40, position + walkMoveDelta(spinePlayback, direction, delta)));
}

function loop(now) {
  const delta = Math.min((now - (lastTime || now)) / 1000, 0.1);
  lastTime = now;
  if (!paused && !document.hidden) {
    accumulator = Math.min(accumulator + delta, 0.1);
    if (isCombat()) {
      combat.play(delta);
            accumulator = 0;
            if (combat.ready && !combat.pending && combat.bufferedTicks <= 2) {
              void combat.advance(6).finally(syncControls); syncControls();
      }
    } else if (isLuau()) {
      if (movement.ready && !movement.pending && accumulator >= 1 / TICKS_PER_SECOND) {
        const ticks = Math.min(6, Math.floor(accumulator * TICKS_PER_SECOND));
        accumulator -= ticks / TICKS_PER_SECOND;
        void movement.advance(movementInput(), ticks).finally(syncControls);
        syncControls();
      }
    } else if (isSpine()) {
      simulateSpine(accumulator);
      accumulator = 0;
    } else {
      while (accumulator >= 1 / TICKS_PER_SECOND) {
        simulateTick();
        accumulator -= 1 / TICKS_PER_SECOND;
      }
    }
  }
  render();
  requestAnimationFrame(loop);
}

for (const id of ['pause', 'step', 'reset']) $(id).addEventListener('pointerdown', event => {
  if (isCombat()) event.preventDefault();
});
$('animation').addEventListener('change', chooseAnimation);
$('walk-type').addEventListener('change', chooseWalkType);
$('character').addEventListener('change', () => loadCharacter(new URL($('character').value, location.href)));
$('pause').addEventListener('click', () => {
  setPaused(!paused);
  if (!paused && isCombat() && !combat.ready && !combat.pending) void resetCombat();
});
$('step').addEventListener('click', () => {
  const inputs = combatInputs(keys);
  setPaused(true);
  if (isCombat()) {
    combat.setInputs(inputs);
    if (combat.bufferedTicks) combat.play(0, true);
    else void combat.advance(1).then(() => combat.play(0, true)).finally(syncControls);
    syncControls();
  } else if (isLuau()) { void movement.advance(movementInput(), 1).finally(syncControls); syncControls(); }
  else if (isSpine()) { updateSpine(spinePlayback, 1 / TICKS_PER_SECOND); render(); }
  else { tickPlayback(playback); render(); }
});
$('reset').addEventListener('click', () => {
  keys.clear(); position = canvas.width / 2; facing = 1;
  if (isCombat()) void resetCombat();
  else if (isLuau()) void resetMovement();
  else chooseAnimation();
});
$('mode').addEventListener('change', () => {
  movement.cancel(true); combat.cancel(true); combatSnapshot = null; combatEvents = []; contactSparks = [];
  movementSnapshot = null; keys.clear(); accumulator = 0;
  $('movement-notices').hidden = true;
  position = canvas.width / 2; facing = 1;
  if (isCombat()) void resetCombat();
  else if (isLuau()) void resetMovement();
  else {
    $('movement-status').textContent = 'Animation inspector: fixed-speed preview movement.';
    $('movement-notices').hidden = true;
    $('animation').value = String(Math.max(0, character.animations.findIndex(animation => animation.id === 0)));
    chooseAnimation();
  }
  syncControls();
});
$('flip').addEventListener('click', () => { if (!isLuau() && !isCombat()) facing *= -1; render(); });
for (const id of ['zoom', 'boxes', 'origin']) $(id).addEventListener('change', render);
canvas.addEventListener('keydown', (event) => {
  if (!['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight', 'KeyS', 'ArrowDown', 'KeyW', 'ArrowUp', 'KeyF', 'Space', ...(isCombat() ? COMBAT_KEYS.flatMap(Object.keys) : [])].includes(event.code)) return;
  event.preventDefault();
  keys.add(event.code);
  if (isCombat()) combat.setInputs(combatInputs(keys));
  if (!event.repeat && ['KeyW', 'ArrowUp'].includes(event.code) && isLuau()) jumpQueued = true;
  if (!event.repeat && event.code === 'Space') setPaused(!paused);
  if (!event.repeat && event.code === 'KeyF' && !isLuau() && !isCombat()) facing *= -1;
});
window.addEventListener('keyup', (event) => {
  keys.delete(event.code);
  if (isCombat()) combat.setInputs(combatInputs(keys));
});
canvas.addEventListener('pointerdown', () => canvas.focus());
canvas.addEventListener('focus', () => {
  if (pausedByFocus && isCombat() && !document.hidden) setPaused(false);
});
canvas.addEventListener('blur', clearInput);
window.addEventListener('blur', clearInput);
document.addEventListener('visibilitychange', () => { clearInput(); lastTime = 0; });

async function refreshLibrary(preferredId) {
  const manifestUrl = new URL('/generated/characters.json', location.href);
  const manifest = await readJson(manifestUrl);
  if (!manifest.characters?.length) throw new Error('No characters were successfully imported');
  $('character').replaceChildren(...manifest.characters.map((entry) => option(new URL(entry.url, manifestUrl).href, entry.name)));
  const selected = manifest.characters.find((entry) => entry.id === preferredId);
  if (selected) $('character').value = new URL(selected.url, manifestUrl).href;
  $('character').disabled = false;
  if (await loadCharacter(new URL($('character').value)) === false) throw new Error('Character preview unavailable');
}

requestAnimationFrame(loop);
// ZIP upload UI is hidden — Hitman Spine is the only character.
try {
  try {
    const catalog = await readJson(new URL('/generated/walk-profiles.json', location.href));
    walkProfiles = catalog.profiles ?? [];
  } catch {
    walkProfiles = [];
  }
  await refreshLibrary('hitman');
} catch (error) {
  $('character').replaceChildren(option('', 'Hitman missing'));
  $('name').textContent = 'Hitman Spine needed';
  $('status').textContent = `${error.message}. Run npm run sync:hitman, then reload.`;
}
