/**
 * Slice Hitman's multi-hit Punch into real separate animations,
 * and author a few extra attack clips from those slices.
 *
 * Usage: node tools/slice-author-attacks.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const skeletonPath = path.join(root, 'assets', 'Hitman.json');
const characterPath = path.join(root, 'assets', 'character.json');

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sampleKeys(keys, time) {
  if (!keys?.length) return null;
  let prev = null;
  let next = null;
  for (const key of keys) {
    const t = key.time ?? 0;
    if (t <= time) prev = key;
    if (t >= time) {
      next = key;
      break;
    }
  }
  if (!prev && next) return deepClone({ ...next, time });
  if (prev && !next) return deepClone({ ...prev, time });
  if (!prev && !next) return null;
  if (prev === next || (prev.curve === 'stepped') || (next.time ?? 0) === (prev.time ?? 0)) {
    return deepClone({ ...prev, time });
  }
  // Linear blend for numeric fields only; keep stepped identity otherwise.
  const out = deepClone({ ...prev, time });
  const span = (next.time ?? 0) - (prev.time ?? 0);
  const alpha = span <= 0 ? 0 : (time - (prev.time ?? 0)) / span;
  for (const field of ['angle', 'x', 'y', 'scaleX', 'scaleY', 'shearX', 'shearY']) {
    if (typeof prev[field] === 'number' && typeof next[field] === 'number') {
      out[field] = prev[field] + (next[field] - prev[field]) * alpha;
    }
  }
  return out;
}

function sliceTimeline(keys, start, end) {
  if (!keys?.length) return undefined;
  const sliced = [];
  const first = sampleKeys(keys, start);
  if (first) {
    const { time, ...rest } = first;
    sliced.push(Object.keys(rest).length ? { time: 0, ...rest } : { time: 0 });
  }
  for (const key of keys) {
    const t = key.time ?? 0;
    if (t <= start || t > end) continue;
    const shifted = deepClone(key);
    shifted.time = Number((t - start).toFixed(4));
    // Avoid duplicating the sampled start key.
    if (Math.abs(shifted.time) < 1e-6) continue;
    sliced.push(shifted);
  }
  const last = sampleKeys(keys, end);
  if (last) {
    const endTime = Number((end - start).toFixed(4));
    const { time, ...rest } = last;
    const already = sliced.some((key) => Math.abs((key.time ?? 0) - endTime) < 1e-6);
    if (!already) sliced.push(Object.keys(rest).length ? { time: endTime, ...rest } : { time: endTime });
  }
  return sliced.length ? sliced : undefined;
}

function sliceAnimation(anim, start, end) {
  const out = {};
  if (anim.bones) {
    out.bones = {};
    for (const [bone, timelines] of Object.entries(anim.bones)) {
      const next = {};
      for (const [type, keys] of Object.entries(timelines)) {
        const sliced = sliceTimeline(keys, start, end);
        if (sliced) next[type] = sliced;
      }
      if (Object.keys(next).length) out.bones[bone] = next;
    }
  }
  if (anim.slots) {
    out.slots = {};
    for (const [slot, timelines] of Object.entries(anim.slots)) {
      const next = {};
      for (const [type, keys] of Object.entries(timelines)) {
        const sliced = sliceTimeline(keys, start, end);
        if (sliced) next[type] = sliced;
      }
      if (Object.keys(next).length) out.slots[slot] = next;
    }
  }
  if (anim.ik) {
    out.ik = {};
    for (const [name, keys] of Object.entries(anim.ik)) {
      const sliced = sliceTimeline(keys, start, end);
      if (sliced) out.ik[name] = sliced;
    }
  }
  if (anim.events?.length) {
    out.events = anim.events
      .filter((event) => (event.time ?? 0) >= start && (event.time ?? 0) <= end)
      .map((event) => {
        const copy = deepClone(event);
        copy.time = Number(((event.time ?? 0) - start).toFixed(4));
        return copy;
      });
    if (!out.events.length) delete out.events;
  }
  if (anim.drawOrder) {
    const sliced = sliceTimeline(anim.drawOrder, start, end);
    if (sliced) out.drawOrder = sliced;
  }
  return out;
}

function amplifyArmAngles(anim, factor = 1.25) {
  const out = deepClone(anim);
  for (const boneName of ['F_UpperArm', 'B_UpperArm', 'F_Forearm', 'B_Forearm']) {
    const rotate = out.bones?.[boneName]?.rotate;
    if (!rotate) continue;
    for (const key of rotate) {
      if (typeof key.angle === 'number') key.angle *= factor;
    }
  }
  return out;
}

function main() {
  const skeleton = JSON.parse(fs.readFileSync(skeletonPath, 'utf8'));
  const punch = skeleton.animations.Punch;
  if (!punch) throw new Error('Punch animation missing');

  // Backup once.
  const backup = path.join(root, 'assets', 'Hitman.pre-attack-author.bak.json');
  if (!fs.existsSync(backup)) fs.writeFileSync(backup, JSON.stringify(skeleton));

  const authored = {
    // Real separate punches sliced from the multi-hit Punch combo.
    Jab: sliceAnimation(punch, 0, 0.22),
    Punch2: sliceAnimation(punch, 0.18, 0.48),
    Punch3: sliceAnimation(punch, 0.42, 0.78),
    PunchUppercut: sliceAnimation(punch, 0.88, 1.4),
    // Extra authored variants derived from slices.
    JabSnap: amplifyArmAngles(sliceAnimation(punch, 0, 0.18), 1.15),
    Cross: amplifyArmAngles(sliceAnimation(punch, 0.18, 0.45), 1.2),
    Hook: amplifyArmAngles(sliceAnimation(punch, 0.4, 0.72), 1.35),
    // Keep a clearly named full combo.
    PunchCombo: deepClone(punch),
  };

  // Single-hit friendly aliases from existing dedicated anims.
  authored.Uppercut = deepClone(skeleton.animations.UpAttack);
  authored.Slam = deepClone(skeleton.animations.DownAttack);
  authored.SlamStartup = sliceAnimation(skeleton.animations.DownAttack, 0, 0.7);
  authored.SlideAttack = deepClone(skeleton.animations.Slide);

  Object.assign(skeleton.animations, authored);
  fs.writeFileSync(skeletonPath, `${JSON.stringify(skeleton, null, '\t')}\n`);

  const character = JSON.parse(fs.readFileSync(characterPath, 'utf8'));
  const attackCategory = {
    id: 'attack',
    label: 'Attacks',
    note: 'Unique Spine clips authored/sliced from Hitman. Punch used to be one multi-hit combo — Jab/Punch2/Punch3/PunchUppercut are separate animations now.',
    clips: [
      { id: 'jab', clip: 'Jab', label: 'Jab', loop: false, timeScale: 1, band: 'light' },
      { id: 'jabSnap', clip: 'JabSnap', label: 'Jab snap', loop: false, timeScale: 1.15, band: 'light' },
      { id: 'punch2', clip: 'Punch2', label: 'Punch 2', loop: false, timeScale: 1, band: 'light' },
      { id: 'cross', clip: 'Cross', label: 'Cross', loop: false, timeScale: 1, band: 'medium' },
      { id: 'punch3', clip: 'Punch3', label: 'Punch 3', loop: false, timeScale: 1, band: 'medium' },
      { id: 'hook', clip: 'Hook', label: 'Hook', loop: false, timeScale: 1, band: 'medium' },
      { id: 'punchUppercut', clip: 'PunchUppercut', label: 'Punch → uppercut', loop: false, timeScale: 1, band: 'heavy' },
      { id: 'uppercut', clip: 'Uppercut', label: 'Uppercut', loop: false, timeScale: 1, band: 'medium' },
      { id: 'upAttack', clip: 'UpAttack', label: 'Up attack (source)', loop: false, timeScale: 1, band: 'medium' },
      { id: 'slam', clip: 'Slam', label: 'Slam', loop: false, timeScale: 1, band: 'heavy' },
      { id: 'slamStartup', clip: 'SlamStartup', label: 'Slam startup', loop: false, timeScale: 1, band: 'heavy' },
      { id: 'downAttack', clip: 'DownAttack', label: 'Down attack (source)', loop: false, timeScale: 1, band: 'heavy' },
      { id: 'slideAttack', clip: 'SlideAttack', label: 'Slide attack', loop: false, timeScale: 1, band: 'special' },
      { id: 'slide', clip: 'Slide', label: 'Slide (source)', loop: false, timeScale: 1, band: 'special' },
      { id: 'punchCombo', clip: 'PunchCombo', label: 'Full punch combo', loop: false, timeScale: 1, band: 'heavy' },
      { id: 'punch', clip: 'Punch', label: 'Punch (original full)', loop: false, timeScale: 1, band: 'heavy' },
      { id: 'nair', clip: 'Jab', label: 'Nair (jab)', loop: false, timeScale: 1.1, band: 'air' },
      { id: 'fair', clip: 'Cross', label: 'Fair (cross)', loop: false, timeScale: 1.05, band: 'air' },
      { id: 'bair', clip: 'Hook', label: 'Bair (hook)', loop: false, timeScale: 1, facing: -1, band: 'air' },
      { id: 'uair', clip: 'Uppercut', label: 'Uair', loop: false, timeScale: 1.1, band: 'air' },
      { id: 'dair', clip: 'SlamStartup', label: 'Dair (slam startup)', loop: false, timeScale: 1.2, band: 'air' },
    ],
  };

  const kickCategory = {
    id: 'kick',
    label: 'Kicks',
    note: 'Still no dedicated kick bones. Stand-ins use Slide/Slam slices until real kicks are authored in Spine.',
    clips: [
      { id: 'lowKick', clip: 'SlamStartup', label: 'Low kick (stand-in)', loop: false, timeScale: 1.4, band: 'kick' },
      { id: 'midKick', clip: 'SlideAttack', label: 'Mid kick (stand-in)', loop: false, timeScale: 1.2, band: 'kick' },
      { id: 'roundhouse', clip: 'Hook', label: 'Roundhouse stand-in (hook)', loop: false, timeScale: 0.9, band: 'kick' },
    ],
  };

  character.anims.categories = character.anims.categories.map((category) => {
    if (category.id === 'attack') return attackCategory;
    if (category.id === 'kick') return kickCategory;
    return category;
  });

  // Refresh map from all category clips.
  const map = { ...character.anims.map };
  for (const category of character.anims.categories) {
    for (const clip of category.clips ?? []) map[clip.id] = clip.clip;
  }
  character.anims.map = map;
  character.report = {
    warnings: [
      'Standalone Hitman Spine project.',
      'Jab/Punch2/Punch3/PunchUppercut are sliced from the original multi-hit Punch animation.',
      'JabSnap/Cross/Hook amplify arm angles on those slices — not Spine-Editor authored.',
    ],
  };

  fs.writeFileSync(characterPath, `${JSON.stringify(character, null, 2)}\n`);
  console.log('Authored animations:', Object.keys(authored).join(', '));
  console.log('Updated', path.relative(root, skeletonPath), 'and character.json');
}

main();
