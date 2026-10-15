/** Spine 3.8 canvas helper — shared skeleton/atlas, swappable skin PNG. */

let spineReady = null;

export function loadSpineRuntime() {
  if (typeof window !== 'undefined' && window.spine?.canvas) return Promise.resolve(window.spine);
  if (spineReady) return spineReady;
  spineReady = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL('../vendor/spine-canvas-3.8.js', import.meta.url).href;
    script.async = true;
    script.onload = () => {
      if (!window.spine?.canvas) reject(new Error('Spine runtime loaded without canvas backend'));
      else resolve(window.spine);
    };
    script.onerror = () => reject(new Error('Failed to load Spine canvas runtime'));
    document.head.appendChild(script);
  });
  return spineReady;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load skin texture: ${url}`));
    image.src = url;
  });
}

/**
 * @param {object} character character.json (spine scale / default anim)
 * @param {{ skeletonUrl: string|URL, atlasUrl: string|URL, textureUrl: string|URL, animationName?: string }} assets
 *   skeleton + atlas are the shared rig; textureUrl is the skin PNG only.
 */
export async function createSpinePlayback(character, assets, animationName) {
  const spine = await loadSpineRuntime();
  const {
    skeletonUrl,
    atlasUrl,
    textureUrl,
  } = typeof assets === 'string' || assets instanceof URL
    // Legacy: third-arg style was (character, assetBaseUrl, animationName)
    ? {
      skeletonUrl: new URL(character.spine.skeleton, assets),
      atlasUrl: new URL(character.spine.atlas, assets),
      textureUrl: new URL(character.spine.skeleton.replace(/\.json$/i, '.png'), assets),
    }
    : assets;

  const startAnim = animationName
    ?? (typeof assets === 'object' && !(assets instanceof URL) ? assets.animationName : null)
    ?? character.spine?.defaultAnimation
    ?? 'Idle';

  const { scale = 0.16 } = character.spine ?? {};

  const [skeletonRaw, atlasText, image] = await Promise.all([
    fetch(skeletonUrl, { cache: 'no-store' }).then(async (response) => {
      if (!response.ok) throw new Error(`Skeleton ${response.status}`);
      return response.json();
    }),
    fetch(atlasUrl, { cache: 'no-store' }).then(async (response) => {
      if (!response.ok) throw new Error(`Atlas ${response.status}`);
      return response.text();
    }),
    loadImage(String(textureUrl)),
  ]);

  const texture = new spine.canvas.CanvasTexture(image);
  // Ignore atlas page filename — always use the selected skin PNG.
  const atlas = new spine.TextureAtlas(atlasText, () => texture);
  const skeletonJson = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(atlas));
  skeletonJson.scale = scale;
  const skeletonData = skeletonJson.readSkeletonData(skeletonRaw);
  const skeleton = new spine.Skeleton(skeletonData);
  if (skeletonData.skins.length) skeleton.setSkin(skeletonData.skins[0]);
  skeleton.setSlotsToSetupPose();
  skeleton.scaleY = -1;

  const state = new spine.AnimationState(new spine.AnimationStateData(skeletonData));
  state.data.defaultMix = 0.12;
  const startName = skeletonData.findAnimation(startAnim)?.name ?? skeletonData.animations[0]?.name;
  if (startName) state.setAnimation(0, startName, true);

  skeleton.updateWorldTransform();
  const offset = new spine.Vector2();
  const size = new spine.Vector2();
  skeleton.getBounds(offset, size, []);

  const loco = Number(character.spine?.locoTimeScale) || 1;
  return {
    kind: 'spine',
    spine,
    skeleton,
    state,
    skeletonData,
    offset,
    size,
    animationName: startName ?? startAnim,
    timeScale: loco,
    baseScaleX: 1,
    textureUrl: String(textureUrl),
    animations: skeletonData.animations.map((anim) => ({
      id: anim.name,
      name: anim.name,
      duration: anim.duration,
    })),
  };
}

export function setSpineAnimation(playback, name, {
  loop = true,
  returnToIdle = false,
  idleName = 'Idle',
} = {}) {
  if (!playback?.skeletonData.findAnimation(name)) return;
  playback.state.clearTracks();
  playback.state.setAnimation(0, name, loop);
  playback.animationName = name;
  playback.returnToIdle = Boolean(returnToIdle && !loop);
  if (playback.returnToIdle && playback.skeletonData.findAnimation(idleName)) {
    playback.state.addAnimation(0, idleName, true, 0);
  }
}

export function syncSpineAnimationName(playback) {
  if (!playback) return;
  const entry = playback.state.getCurrent(0);
  const name = entry?.animation?.name;
  if (name) playback.animationName = name;
}

export function updateSpine(playback, deltaSeconds) {
  if (!playback) return;
  playback.state.update(deltaSeconds * (playback.timeScale ?? 1));
  playback.state.apply(playback.skeleton);
  playback.skeleton.updateWorldTransform();
}

export function drawSkeletonBones(ctx, skeleton, {
  line = '#6ee0c8',
  joint = '#e8eef6',
  root = '#ff8a6a',
} = {}) {
  ctx.save();
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = line;
  for (const bone of skeleton.bones) {
    if (!bone.active || !bone.parent) continue;
    ctx.beginPath();
    ctx.moveTo(bone.parent.worldX, bone.parent.worldY);
    ctx.lineTo(bone.worldX, bone.worldY);
    ctx.stroke();
  }
  for (const bone of skeleton.bones) {
    if (!bone.active) continue;
    const isRoot = !bone.parent;
    ctx.fillStyle = isRoot ? root : joint;
    ctx.beginPath();
    ctx.arc(bone.worldX, bone.worldY, isRoot ? 3.2 : 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function drawSpine(ctx, playback, {
  x, y, facing = 1, debug = false, skeletonOnly = false,
} = {}) {
  if (!playback) return;
  const { spine, skeleton } = playback;
  skeleton.scaleX = (playback.baseScaleX || 1) * (facing >= 0 ? 1 : -1);
  skeleton.x = 0;
  skeleton.y = 0;
  skeleton.updateWorldTransform();

  ctx.save();
  ctx.translate(x, y);

  if (skeletonOnly) {
    drawSkeletonBones(ctx, skeleton);
  } else {
    const renderer = playback.renderer ?? new spine.canvas.SkeletonRenderer(ctx);
    playback.renderer = renderer;
    renderer.debugRendering = debug;
    renderer.triangleRendering = true;
    renderer.draw(skeleton);
    if (debug) drawSkeletonBones(ctx, skeleton, { line: '#70e0ce88', joint: '#ffffffcc', root: '#ff8a6acc' });
  }

  ctx.restore();
}

export function spineReadout(playback, facing = 1) {
  if (!playback) return 'Loading…';
  const entry = playback.state.getCurrent(0);
  const anim = entry?.animation?.name ?? '—';
  const time = entry ? entry.trackTime.toFixed(2) : '0.00';
  const duration = entry?.animation?.duration?.toFixed(2) ?? '—';
  const loop = entry?.loop ? 'LOOP' : 'ONCE';
  return `HITMAN  ${anim}  ·  t=${time}s / ${duration}s  ·  ${loop}  ·  timeScale ${Number(playback.timeScale).toFixed(2)}  ·  facing ${facing === 1 ? 'RIGHT' : 'LEFT'}`;
}
