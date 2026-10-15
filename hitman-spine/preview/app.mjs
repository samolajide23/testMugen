import {
  createSpinePlayback,
  setSpineAnimation,
  updateSpine,
  drawSpine,
  spineReadout,
  syncSpineAnimationName,
} from './spine.mjs';

const $ = (id) => document.getElementById(id);
const canvas = $('stage');
const ctx = canvas.getContext('2d');
const keys = new Set();

let playback = null;
let character = null;
let skins = [];
let skinsManifest = null;
let activeSkinId = null;
let categories = [];
let activeCategoryId = null;
let activeClipId = null;
let paused = false;
let facing = 1;
let position = canvas.width / 2;
let lastTime = 0;

const MOVE_PX_PER_SEC = 180;

function option(value, text) {
  const node = document.createElement('option');
  node.value = value;
  node.textContent = text;
  return node;
}

function currentCategory() {
  return categories.find((entry) => entry.id === activeCategoryId) ?? null;
}

function currentClip() {
  const category = currentCategory();
  return category?.clips?.find((clip) => clip.id === activeClipId) ?? null;
}

function playClip(clip) {
  if (!playback || !clip?.clip) return;
  activeClipId = clip.id;
  const forceLoop = $('loop-override').checked;
  const wantsLoop = clip.loop !== false;
  const loop = forceLoop || wantsLoop;
  const returnToIdle = !loop && clip.clip !== 'Idle';
  setSpineAnimation(playback, clip.clip, { loop, returnToIdle, idleName: 'Idle' });
  const native = playback.nativeLocoTimeScale ?? 1;
  playback.timeScale = Number(clip.timeScale) > 0 ? Number(clip.timeScale) : native;
  playback.pendingIdleTimeScale = returnToIdle ? native : null;
  // Track Hip travel so jumps/dashes keep their landing X when Idle resets the bone.
  playback.commitRootMotion = returnToIdle;
  playback.rootMotionStartX = null;
  playback.rootMotionLastX = null;
  if (clip.facing === -1 || clip.facing === 1) facing = clip.facing;
  $('animation').value = clip.id;
  highlightClipList();
  render();
}

function restoreIdleAfterOneShot() {
  if (!playback) return;
  syncSpineAnimationName(playback);
  const hip = playback.skeleton.findBone('Hip');
  if (playback.commitRootMotion && playback.animationName !== 'Idle' && hip) {
    if (playback.rootMotionStartX == null) playback.rootMotionStartX = hip.worldX;
    playback.rootMotionLastX = hip.worldX;
  }
  if (!playback.returnToIdle) return;
  if (playback.animationName !== 'Idle') return;
  if (playback.rootMotionStartX != null && playback.rootMotionLastX != null) {
    const zoom = Number($('zoom').value);
    const dx = (playback.rootMotionLastX - playback.rootMotionStartX) * zoom;
    position = Math.max(60, Math.min(canvas.width - 60, position + dx));
  }
  playback.commitRootMotion = false;
  playback.rootMotionStartX = null;
  playback.rootMotionLastX = null;
  if (playback.pendingIdleTimeScale != null) {
    playback.timeScale = playback.pendingIdleTimeScale;
    playback.pendingIdleTimeScale = null;
  }
  playback.returnToIdle = false;
}

function highlightClipList() {
  for (const button of $('clip-list').querySelectorAll('button[data-clip]')) {
    button.classList.toggle('active', button.dataset.clip === activeClipId);
  }
}

function fillAnimationSelect(category) {
  const clips = category?.clips ?? [];
  if (!clips.length) {
    $('animation').replaceChildren(option('', category?.note ? 'None yet' : 'Empty category'));
    $('animation').disabled = true;
    return;
  }
  $('animation').replaceChildren(...clips.map((clip) => {
    const speed = clip.timeScale ? ` ×${clip.timeScale}` : '';
    return option(clip.id, `${clip.label} · ${clip.clip}${speed}`);
  }));
  $('animation').disabled = false;
}

function renderClipList(category) {
  const note = $('category-note');
  if (category?.note) {
    note.hidden = false;
    note.textContent = category.note;
  } else {
    note.hidden = true;
    note.textContent = '';
  }

  const list = $('clip-list');
  list.replaceChildren();
  const clips = category?.clips ?? [];
  if (!clips.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = category?.note || 'No clips in this category yet. Add them under anims.categories in character.json.';
    list.append(empty);
    return;
  }

  for (const clip of clips) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.clip = clip.id;
    const speed = clip.timeScale ? ` ×${clip.timeScale}` : '';
    button.textContent = `${clip.label}  ·  ${clip.clip}${speed}`;
    button.addEventListener('click', () => playClip(clip));
    item.append(button);
    list.append(item);
  }
  highlightClipList();
}

function chooseCategory() {
  activeCategoryId = $('category').value;
  const category = currentCategory();
  fillAnimationSelect(category);
  renderClipList(category);
  const first = category?.clips?.[0] ?? null;
  if (first) playClip(first);
  else {
    activeClipId = null;
    $('readout').textContent = category
      ? `Category ${category.label}: no clips yet`
      : 'No category selected';
  }
}

function chooseAnimation() {
  const category = currentCategory();
  const clip = category?.clips?.find((entry) => entry.id === $('animation').value);
  if (clip) playClip(clip);
}

function currentSkin() {
  return skins.find((entry) => entry.id === activeSkinId) ?? skins[0] ?? null;
}

function rigUrls(skin) {
  const assets = new URL('../assets/', import.meta.url);
  const rig = skinsManifest?.rig ?? {};
  return {
    skeletonUrl: new URL(rig.skeleton ?? 'Hitman.json', assets),
    atlasUrl: new URL(rig.atlas ?? 'Hitman.atlas', assets),
    textureUrl: new URL(skin.texture ?? `skins/${skin.id}.png`, assets),
  };
}

async function loadSkinPlayback(skin, preferClip = true) {
  if (!character || !skin) return;
  $('readout').textContent = `Loading skin: ${skin.name}…`;
  const keepCategory = activeCategoryId;
  const keepClip = activeClipId;
  // Shared Hitman.json + Hitman.atlas; only the PNG changes per skin.
  playback = await createSpinePlayback(character, {
    ...rigUrls(skin),
    animationName: character.spine?.defaultAnimation ?? 'Idle',
  });
  activeSkinId = skin.id;
  document.querySelector('.stage-label').textContent = `${skin.name.toUpperCase()} · SPINE 3.8`;

  if (keepCategory && categories.some((entry) => entry.id === keepCategory)) {
    $('category').value = keepCategory;
    activeCategoryId = keepCategory;
    const category = currentCategory();
    fillAnimationSelect(category);
    renderClipList(category);
    const clip = preferClip
      ? (category?.clips?.find((entry) => entry.id === keepClip) ?? category?.clips?.[0] ?? null)
      : (category?.clips?.[0] ?? null);
    if (clip) playClip(clip);
    else $('readout').textContent = `Skin ${skin.name} · no clip selected`;
  } else {
    chooseCategory();
  }
  render();
}

async function chooseSkin() {
  const skin = skins.find((entry) => entry.id === $('skin').value);
  if (!skin || skin.id === activeSkinId) return;
  try {
    await loadSkinPlayback(skin, true);
  } catch (error) {
    $('readout').textContent = `Skin failed: ${error.message}`;
    console.error(error);
  }
}

async function boot() {
  $('readout').textContent = 'Loading character.json + skins…';
  const characterUrl = new URL('../assets/character.json', import.meta.url);
  const response = await fetch(characterUrl, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to load character.json (${response.status})`);
  character = await response.json();
  categories = character.anims?.categories ?? [];
  if (!categories.length) throw new Error('character.json has no anims.categories');

  // Auto-discovered from assets/skins/*.png (drop a PNG in → appears here).
  const skinsResponse = await fetch(new URL('/api/skins', location.origin), { cache: 'no-store' });
  if (!skinsResponse.ok) throw new Error(`Failed to list skins (${skinsResponse.status})`);
  skinsManifest = await skinsResponse.json();
  skins = skinsManifest.skins ?? [];
  if (!skins.length) throw new Error('No PNGs in assets/skins/ — drop hitman.png (etc.) there');

  $('skin').replaceChildren(...skins.map((skin) => option(skin.id, skin.name)));
  $('skin').disabled = false;
  const preferredSkin = skins.find((skin) => skin.id === skinsManifest.default) ?? skins[0];
  $('skin').value = preferredSkin.id;

  $('category').replaceChildren(...categories.map((category) =>
    option(category.id, `${category.label} (${category.clips?.length ?? 0})`)));
  $('category').disabled = false;
  for (const id of ['pause', 'reset', 'flip']) $(id).disabled = false;

  const preferred = categories.find((category) => category.id === 'idle') ?? categories[0];
  $('category').value = preferred.id;
  activeCategoryId = preferred.id;
  await loadSkinPlayback(preferredSkin, true);
  canvas.focus();
}

function render() {
  const w = canvas.width;
  const h = canvas.height;
  const floor = 420;
  const zoom = Number($('zoom').value);

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0c121c';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#162030';
  ctx.beginPath();
  for (let x = 0; x < w; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
  for (let y = 20; y < h; y += 40) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
  ctx.stroke();
  ctx.fillStyle = '#101820';
  ctx.fillRect(0, floor, w, h - floor);
  ctx.strokeStyle = '#3b706f';
  ctx.beginPath();
  ctx.moveTo(0, floor);
  ctx.lineTo(w, floor);
  ctx.stroke();

  if (!playback) {
    ctx.fillStyle = '#6e88a6';
    ctx.font = '16px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Loading Hitman…', w / 2, h / 2);
    return;
  }

  ctx.save();
  ctx.translate(position, floor);
  ctx.scale(zoom, zoom);
  const skeletonOnly = $('skeleton-only').checked;
  drawSpine(ctx, playback, {
    x: 0,
    y: 0,
    facing,
    debug: $('debug').checked,
    skeletonOnly,
  });
  ctx.restore();

  const category = currentCategory();
  const clip = currentClip();
  const base = spineReadout(playback, facing);
  const mode = skeletonOnly ? ' · SKELETON ONLY' : '';
  $('readout').textContent = category && clip
    ? `${base}  ·  ${category.label} / ${clip.label}${mode}`
    : `${base}${mode}`;
}

function loop(now) {
  const delta = Math.min((now - (lastTime || now)) / 1000, 0.1);
  lastTime = now;
  if (!paused && !document.hidden && playback) {
    updateSpine(playback, delta);
    restoreIdleAfterOneShot();
    const direction = Number(keys.has('KeyD') || keys.has('ArrowRight'))
      - Number(keys.has('KeyA') || keys.has('ArrowLeft'));
    position = Math.max(60, Math.min(canvas.width - 60, position + direction * MOVE_PX_PER_SEC * delta));
  }
  render();
  requestAnimationFrame(loop);
}

$('skin').addEventListener('change', () => { void chooseSkin(); });
$('category').addEventListener('change', chooseCategory);
$('animation').addEventListener('change', chooseAnimation);
$('zoom').addEventListener('change', render);
$('skeleton-only').addEventListener('change', () => {
  $('debug').disabled = $('skeleton-only').checked;
  render();
});
$('debug').addEventListener('change', render);
$('loop-override').addEventListener('change', () => {
  const clip = currentClip();
  if (clip) playClip(clip);
});
$('pause').addEventListener('click', () => {
  paused = !paused;
  $('pause').textContent = paused ? 'Resume' : 'Pause';
});
$('reset').addEventListener('click', () => {
  position = canvas.width / 2;
  facing = 1;
  paused = false;
  $('pause').textContent = 'Pause';
  const clip = currentClip();
  if (clip) playClip(clip);
  else chooseCategory();
});
$('flip').addEventListener('click', () => { facing *= -1; render(); });

canvas.addEventListener('pointerdown', () => canvas.focus());
canvas.addEventListener('keydown', (event) => {
  if (!['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight', 'KeyF', 'Space'].includes(event.code)) return;
  event.preventDefault();
  keys.add(event.code);
  if (!event.repeat && event.code === 'Space') {
    paused = !paused;
    $('pause').textContent = paused ? 'Resume' : 'Pause';
  }
  if (!event.repeat && event.code === 'KeyF') facing *= -1;
});
window.addEventListener('keyup', (event) => keys.delete(event.code));
window.addEventListener('blur', () => keys.clear());

requestAnimationFrame(loop);
try {
  await boot();
} catch (error) {
  $('readout').textContent = `Failed: ${error.message}`;
  console.error(error);
}
