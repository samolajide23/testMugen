/** Spine 3.8 canvas helper for Character Lab (Hitman and future skeletal packs). */

let spineReady = null;

export function isSpineCharacter(character) {
  return character?.kind === 'spine' && Boolean(character.spine);
}

export function loadSpineRuntime() {
  if (typeof window !== 'undefined' && window.spine?.canvas) return Promise.resolve(window.spine);
  if (spineReady) return spineReady;
  spineReady = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-spine-runtime]');
    if (existing) {
      const done = () => (window.spine?.canvas ? resolve(window.spine) : reject(new Error('Spine runtime missing canvas backend')));
      if (window.spine?.canvas) done();
      else {
        existing.addEventListener('load', done);
        existing.addEventListener('error', () => reject(new Error('Failed to load Spine runtime')));
      }
      return;
    }
    const script = document.createElement('script');
    script.src = new URL('./vendor/spine-canvas-3.8.js', import.meta.url).href;
    script.async = true;
    script.dataset.spineRuntime = '3.8';
    script.onload = () => {
      if (!window.spine?.canvas) reject(new Error('Spine runtime loaded without spine.canvas'));
      else resolve(window.spine);
    };
    script.onerror = () => reject(new Error('Failed to load Spine canvas runtime'));
    document.head.appendChild(script);
  });
  return spineReady;
}

function waitForAssets(assetManager, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const tick = () => {
      if (assetManager.isLoadingComplete()) {
        if (assetManager.hasErrors()) {
          const errors = assetManager.getErrors();
          reject(new Error(`Spine asset errors: ${Object.entries(errors).map(([k, v]) => `${k}: ${v}`).join('; ')}`));
        } else resolve();
      } else if (performance.now() - start > timeoutMs) {
        reject(new Error('Timed out loading Spine assets'));
      } else requestAnimationFrame(tick);
    };
    tick();
  });
}

export async function createSpinePlayback(character, characterUrl, animationName) {
  const spine = await loadSpineRuntime();
  const { skeleton: skeletonFile, atlas: atlasFile, scale = 0.4, defaultAnimation = 'Idle' } = character.spine;
  const prefix = new URL('./', new URL(skeletonFile, characterUrl)).href;
  const assetManager = new spine.canvas.AssetManager(prefix);
  assetManager.loadText(skeletonFile);
  assetManager.loadTextureAtlas(atlasFile);
  await waitForAssets(assetManager);

  const atlas = assetManager.get(atlasFile);
  const skeletonJson = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(atlas));
  skeletonJson.scale = scale;
  const skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile));
  const skeleton = new spine.Skeleton(skeletonData);
  if (skeletonData.skins.length) skeleton.setSkin(skeletonData.skins[0]);
  skeleton.setSlotsToSetupPose();
  // Canvas Y grows downward; Spine is Y-up.
  skeleton.scaleY = -1;

  const state = new spine.AnimationState(new spine.AnimationStateData(skeletonData));
  state.data.defaultMix = 0.15;
  const initial = animationName || defaultAnimation;
  const startName = skeletonData.findAnimation(initial)?.name
    ?? skeletonData.animations[0]?.name;
  if (startName) state.setAnimation(0, startName, true);

  skeleton.updateWorldTransform();
  const offset = new spine.Vector2();
  const size = new spine.Vector2();
  skeleton.getBounds(offset, size, []);

  const nativeLoco = Number(character.spine?.locoTimeScale) || 1;
  const animations = skeletonData.animations.map((anim) => ({
    id: anim.name,
    name: anim.name,
    duration: anim.duration,
  }));

  return {
    kind: 'spine',
    spine,
    skeleton,
    state,
    skeletonData,
    offset,
    size,
    animationName: startName ?? initial,
    timeScale: nativeLoco,
    nativeLocoTimeScale: nativeLoco,
    walkMoveScale: 1,
    walkProfileId: null,
    walkProfile: null,
    baseScaleX: 1,
    animations,
  };
}

export function setSpineAnimation(playback, name, { loop = true } = {}) {
  if (!playback || playback.kind !== 'spine') return;
  if (!playback.skeletonData.findAnimation(name)) return;
  playback.state.setAnimation(0, name, loop);
  playback.animationName = name;
}

export function updateSpine(playback, deltaSeconds) {
  if (!playback || playback.kind !== 'spine') return;
  playback.state.update(deltaSeconds * (playback.timeScale ?? 1));
  playback.state.apply(playback.skeleton);
  playback.skeleton.updateWorldTransform();
}

export function drawSpine(ctx, playback, { x, y, facing = 1, debug = false } = {}) {
  if (!playback || playback.kind !== 'spine') return;
  const { spine, skeleton } = playback;
  skeleton.scaleX = (playback.baseScaleX || 1) * (facing >= 0 ? 1 : -1);
  skeleton.x = 0;
  skeleton.y = 0;
  skeleton.updateWorldTransform();

  const renderer = playback.renderer ?? new spine.canvas.SkeletonRenderer(ctx);
  playback.renderer = renderer;
  renderer.debugRendering = debug;
  renderer.triangleRendering = true;

  ctx.save();
  ctx.translate(x, y);
  renderer.draw(skeleton);
  ctx.restore();
}

export function spineReadout(playback, facing = 1) {
  if (!playback || playback.kind !== 'spine') return 'No Spine playback.';
  const entry = playback.state.getCurrent(0);
  const anim = entry?.animation?.name ?? '—';
  const time = entry ? entry.trackTime.toFixed(2) : '0.00';
  const duration = entry?.animation?.duration?.toFixed(2) ?? '—';
  const loop = entry?.loop ? 'LOOP' : 'ONCE';
  const scale = `timeScale ${Number(playback.timeScale ?? 1).toFixed(2)}`;
  const walk = playback.walkProfile
    ? `  /  WALK ${playback.walkProfile.name} move×${Number(playback.walkMoveScale ?? 1).toFixed(2)}`
    : '';
  return `SPINE ${anim}  /  t=${time}s / ${duration}s  /  ${loop}  /  ${scale}${walk}  /  FACING ${facing === 1 ? 'RIGHT' : 'LEFT'}  /  bones ${playback.skeletonData.bones.length}`;
}
