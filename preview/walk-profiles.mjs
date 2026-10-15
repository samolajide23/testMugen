/** Apply mapped walk-type profiles onto Hitman (or any) Spine playback. */

const HITMAN_WALK_FWD = 4.6;
const BASE_MOVE_PX_PER_SEC = 180;

export function profileLabel(profile) {
  if (!profile) return '—';
  if (profile.missing) return `${profile.name} · unavailable`;
  const speed = profile.walkFwd != null ? ` · spd ${profile.walkFwd}` : '';
  if (profile.kind === 'spine') {
    return `${profile.name} · Spine loco×${profile.locoTimeScale ?? 1}${speed}`;
  }
  return `${profile.name} · ${profile.cycleTicks}t / ${profile.frames}f${speed}`;
}

export function applyWalkProfile(playback, profile, { forceWalk = true } = {}) {
  if (!playback || playback.kind !== 'spine') return null;
  const mapping = profile?.hitman;
  if (!mapping || profile.missing) {
    playback.timeScale = playback.nativeLocoTimeScale ?? 1.35;
    playback.walkMoveScale = 1;
    playback.walkProfileId = null;
    return null;
  }

  playback.timeScale = mapping.timeScale;
  playback.walkMoveScale = mapping.moveSpeedScale;
  playback.walkProfileId = profile.id;
  playback.walkProfile = profile;

  if (forceWalk) {
    const clip = 'Walk';
    if (playback.skeletonData.findAnimation(clip)) {
      playback.state.setAnimation(0, clip, true);
      playback.animationName = clip;
    }
  }
  return mapping;
}

export function walkMoveDelta(playback, direction, deltaSeconds) {
  const scale = playback?.walkMoveScale ?? 1;
  return direction * BASE_MOVE_PX_PER_SEC * scale * deltaSeconds;
}

export function walkProfileReadout(playback) {
  const profile = playback?.walkProfile;
  if (!profile) return '';
  const map = profile.hitman ?? {};
  const cycle = profile.cycleSeconds != null
    ? `${profile.cycleSeconds.toFixed(2)}s source cycle`
    : `loco×${profile.locoTimeScale ?? 1}`;
  return `WALK TYPE ${profile.name} · ${cycle} · timeScale ${map.timeScale} · move×${map.moveSpeedScale}`;
}

export { HITMAN_WALK_FWD, BASE_MOVE_PX_PER_SEC };
