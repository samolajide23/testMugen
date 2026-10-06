export const TICKS_PER_SECOND = 60;

export function createPlayback(animation) {
  const playback = { animation, frameIndex: 0, elapsed: 0 };
  skipZeroFrames(playback);
  return playback;
}

function nextFrame(playback) {
  const frames = playback.animation.frames;
  const loop = playback.animation.loopStart;
  playback.elapsed = 0;
  playback.frameIndex = playback.frameIndex + 1 < frames.length
    ? playback.frameIndex + 1
    : Number.isInteger(loop) && loop >= 0 && loop < frames.length ? loop : 0;
}

function skipZeroFrames(playback) {
  const frames = playback.animation?.frames ?? [];
  for (let i = 0; i < frames.length && currentFrame(playback)?.duration === 0; i++) {
    nextFrame(playback);
  }
}

export function currentFrame(playback) {
  return playback.animation?.frames[playback.frameIndex] ?? null;
}

export function tickPlayback(playback) {
  const frames = playback.animation?.frames ?? [];
  if (!frames.length) return;
  const frame = currentFrame(playback);
  if (frame.duration < 0 || frame.duration === 0) return;
  if (++playback.elapsed < frame.duration) return;
  nextFrame(playback);
  skipZeroFrames(playback);
}

export function characterScale(character) {
  const parseScale = (value) => {
    if (typeof value !== 'number' && (typeof value !== 'string' || !value.trim())) return 1;
    const number = Number(value);
    return Number.isFinite(number) ? number : 1;
  };
  const size = character?.movement?.size;
  return { x: parseScale(size?.xscale), y: parseScale(size?.yscale) };
}

export function frameTransform(sprite, frame, facing = 1) {
  const scaleX = facing * (frame.flipH ? -1 : 1);
  const scaleY = frame.flipV ? -1 : 1;
  return {
    x: frame.x * facing,
    y: frame.y,
    scaleX,
    scaleY,
    imageX: -sprite.axisX,
    imageY: -sprite.axisY,
  };
}
