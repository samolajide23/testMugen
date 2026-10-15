/**
 * Build walk-type profiles from packs + imported characters so Hitman Spine
 * can preview each character's walk cycle rate and forward speed.
 *
 * Usage: node tools/build-walk-profiles.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const TICKS_PER_SECOND = 60;

function num(value, fallback = null) {
  if (value == null || value === '') return fallback;
  const n = Number(String(value).split(',')[0].trim());
  return Number.isFinite(n) ? n : fallback;
}

function frameDuration(frame) {
  return num(frame?.duration ?? frame?.ticks ?? frame?.time, 0) ?? 0;
}

function walkAction(character) {
  const walkId = character.anims?.map?.walk ?? 20;
  if (Array.isArray(character.animations)) {
    return character.animations.find((anim) => anim.id === walkId || anim.id === 20) ?? null;
  }
  const actions = character.anims?.actions ?? {};
  return actions[String(walkId)] ?? actions[walkId] ?? actions['20'] ?? actions[20] ?? null;
}

function walkVelocity(character) {
  const physics = character.physics ?? {};
  if (physics.walkFwd != null) {
    return {
      walkFwd: num(physics.walkFwd),
      walkBack: num(physics.walkBack ?? Math.abs(num(physics.walkFwd, 0)), null),
    };
  }
  const velocity = character.movement?.velocity ?? character.movement ?? {};
  return {
    walkFwd: num(velocity['walk.fwd'] ?? velocity.walkFwd),
    walkBack: Math.abs(num(velocity['walk.back'] ?? velocity.walkBack, 0)) || null,
  };
}

function profileFromCharacter(character, id, source) {
  const name = character.name || id;
  const velocity = walkVelocity(character);

  if (character.kind === 'spine') {
    const loco = num(character.spine?.locoTimeScale, 1) ?? 1;
    return {
      id,
      name,
      source,
      kind: 'spine',
      clip: character.anims?.map?.walk ?? 'Walk',
      locoTimeScale: loco,
      walkFwd: velocity.walkFwd,
      walkBack: velocity.walkBack,
      cycleTicks: null,
      cycleSeconds: null,
      frames: null,
      note: `Spine loco×${loco.toFixed(2)}`,
    };
  }

  const action = walkAction(character);
  const frames = action?.frames ?? action?.elements ?? null;
  if (!frames?.length) {
    return {
      id,
      name,
      source,
      kind: 'sprite',
      missing: true,
      walkFwd: velocity.walkFwd,
      walkBack: velocity.walkBack,
      note: 'No walk action 20',
    };
  }

  const durations = frames.map(frameDuration);
  const cycleTicks = durations.reduce((sum, ticks) => sum + ticks, 0);
  if (!(cycleTicks > 0)) {
    return {
      id,
      name,
      source,
      kind: 'sprite',
      missing: true,
      walkFwd: velocity.walkFwd,
      walkBack: velocity.walkBack,
      frames: frames.length,
      note: 'Walk frames have zero duration',
    };
  }

  return {
    id,
    name,
    source,
    kind: 'sprite',
    action: 20,
    frames: frames.length,
    cycleTicks,
    cycleSeconds: cycleTicks / TICKS_PER_SECOND,
    loopStart: action.loopStart ?? action.loopstart ?? null,
    walkFwd: velocity.walkFwd,
    walkBack: velocity.walkBack,
    durations,
    note: `${cycleTicks} ticks · ${frames.length} frames`,
  };
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function collect() {
  const profiles = [];
  const seen = new Set();

  const packsDir = path.join(root, 'packs');
  for (const entry of await fs.readdir(packsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = path.join(packsDir, entry.name, 'character.json');
    try {
      const character = await readJson(file);
      const id = character.id || entry.name;
      profiles.push(profileFromCharacter(character, id, `packs/${entry.name}`));
      seen.add(id);
    } catch {
      /* skip incomplete packs */
    }
  }

  const manifestPath = path.join(root, 'generated', 'characters.json');
  try {
    const manifest = await readJson(manifestPath);
    for (const entry of manifest.characters ?? []) {
      if (seen.has(entry.id)) continue;
      const file = path.join(root, 'generated', entry.url);
      try {
        const character = await readJson(file);
        profiles.push(profileFromCharacter(character, entry.id, `generated/${entry.id}`));
        seen.add(entry.id);
      } catch {
        /* skip */
      }
    }
  } catch {
    /* generated library optional */
  }

  profiles.sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
  return profiles;
}

/** Map a source profile onto Hitman Spine Walk. */
export function mapToHitman(profile, hitmanWalkDurationSec = 0.9333, hitmanNativeLoco = 1.35) {
  if (!profile || profile.missing) {
    return { timeScale: hitmanNativeLoco, moveSpeedScale: 1, label: 'unavailable' };
  }

  let timeScale = hitmanNativeLoco;
  if (profile.kind === 'spine') {
    timeScale = profile.locoTimeScale ?? hitmanNativeLoco;
  } else if (profile.cycleSeconds > 0) {
    // Play Hitman Walk so one loop matches the source AIR cycle length.
    timeScale = hitmanWalkDurationSec / profile.cycleSeconds;
  }

  const hitmanWalkFwd = 4.6;
  const moveSpeedScale = profile.walkFwd != null && profile.walkFwd > 0
    ? profile.walkFwd / hitmanWalkFwd
    : 1;

  return {
    timeScale: Number(timeScale.toFixed(4)),
    moveSpeedScale: Number(moveSpeedScale.toFixed(4)),
    targetCycleSeconds: profile.cycleSeconds
      ?? (hitmanWalkDurationSec / (profile.locoTimeScale || hitmanNativeLoco)),
    label: profile.note,
  };
}

function maxKeyTime(node, best = 0) {
  if (!node || typeof node !== 'object') return best;
  if (typeof node.time === 'number') best = Math.max(best, node.time);
  for (const value of Object.values(node)) best = maxKeyTime(value, best);
  return best;
}

async function hitmanWalkDuration() {
  try {
    const skeleton = await readJson(path.join(root, 'packs', 'hitman', 'Hitman.json'));
    const walk = skeleton.animations?.Walk;
    const duration = maxKeyTime(walk);
    return duration > 0 ? duration : 0.9333;
  } catch {
    return 0.9333;
  }
}

async function main() {
  const walkDurationSec = await hitmanWalkDuration();
  const profiles = await collect();
  const mapped = profiles.map((profile) => ({
    ...profile,
    hitman: mapToHitman(profile, walkDurationSec),
  }));

  const out = {
    generatedAt: new Date().toISOString(),
    hitmanReference: {
      walkClip: 'Walk',
      walkDurationSec,
      nativeLocoTimeScale: 1.35,
      nativeWalkFwd: 4.6,
      note: 'Sprite walks map cycle length → Spine timeScale; walk.fwd → move speed vs Hitman 4.6.',
    },
    profiles: mapped,
  };

  const dest = path.join(root, 'generated', 'walk-profiles.json');
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`Wrote ${mapped.length} walk profiles → ${path.relative(root, dest)}`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) await main();
