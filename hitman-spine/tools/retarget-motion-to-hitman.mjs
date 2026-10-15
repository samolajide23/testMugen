/**
 * Retarget a *.motion.json clip onto Hitman Spine bones and register it in character.json.
 *
 * Usage:
 *   node tools/retarget-motion-to-hitman.mjs refs/samples/synthetic-jab.motion.json
 *   node tools/retarget-motion-to-hitman.mjs refs/samples/*.motion.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const skeletonPath = path.join(root, 'assets', 'Hitman.json');
const characterPath = path.join(root, 'assets', 'character.json');

/** Brawlhalla-like ref bone id → Hitman bone name */
export const BONE_MAP = {
  TORSO: 'Torso',
  _TORSO: 'Torso',
  NECK: 'Neck',
  HEAD: 'Head',
  HAIR: 'Hair',
  ARM_F: 'F_UpperArm',
  ARM_B: 'B_UpperArm',
  FOREARM_F: 'F_Forearm',
  FOREARM_B: 'B_Forearm',
  SHOULDER_F: 'F_UpperArm',
  SHOULDER_B: 'B_UpperArm',
  LEG_F: 'F_Thigh',
  LEG_B: 'B_Thigh',
  SHIN_F: 'F_Shin',
  SHIN_B: 'B_Shin',
  FOOT_F: 'F_Foot',
  FOOT_B: 'B_Foot',
  // Already-Hitman names pass through.
  Torso: 'Torso',
  Neck: 'Neck',
  Head: 'Head',
  Hair: 'Hair',
  F_UpperArm: 'F_UpperArm',
  B_UpperArm: 'B_UpperArm',
  F_Forearm: 'F_Forearm',
  B_Forearm: 'B_Forearm',
  F_Thigh: 'F_Thigh',
  B_Thigh: 'B_Thigh',
  F_Shin: 'F_Shin',
  B_Shin: 'B_Shin',
  F_Foot: 'F_Foot',
  B_Foot: 'B_Foot',
  Hip: 'Hip',
};

function round4(n) {
  return Number(Number(n).toFixed(4));
}

function toSpineAnim(motion) {
  const bones = {};
  const unknown = [];
  for (const [refName, keys] of Object.entries(motion.bones ?? {})) {
    const hitman = BONE_MAP[refName];
    if (!hitman) {
      unknown.push(refName);
      continue;
    }
    if (!Array.isArray(keys) || !keys.length) continue;
    const rotate = [];
    const translate = [];
    for (const key of keys) {
      const time = round4(key.time ?? 0);
      if (typeof key.angle === 'number') {
        rotate.push({ time, angle: round4(key.angle) });
      }
      if (typeof key.x === 'number' || typeof key.y === 'number') {
        const entry = { time };
        if (typeof key.x === 'number') entry.x = round4(key.x);
        if (typeof key.y === 'number') entry.y = round4(key.y);
        translate.push(entry);
      }
    }
    const timelines = {};
    if (rotate.length) timelines.rotate = rotate;
    if (translate.length) timelines.translate = translate;
    if (Object.keys(timelines).length) bones[hitman] = timelines;
  }
  return { bones, unknown };
}

function ensureRetargetCategory(character, clipName, motion) {
  let category = character.anims.categories.find((entry) => entry.id === 'retarget');
  if (!category) {
    category = {
      id: 'retarget',
      label: 'Retarget',
      note: 'Clips authored via refs/*.motion.json → Hitman bone map. Demo samples are synthetic; swap in real ANM dumps later.',
      clips: [],
    };
    character.anims.categories.push(category);
  }
  const id = motion.id || clipName;
  const existing = category.clips.findIndex((clip) => clip.id === id);
  const entry = {
    id,
    clip: clipName,
    label: motion.name || clipName,
    loop: false,
    timeScale: 1,
    band: 'retarget',
  };
  if (existing >= 0) category.clips[existing] = entry;
  else category.clips.push(entry);
  character.anims.map[id] = clipName;
}

function retargetFile(file) {
  const motion = JSON.parse(fs.readFileSync(file, 'utf8'));
  const skeleton = JSON.parse(fs.readFileSync(skeletonPath, 'utf8'));
  const character = JSON.parse(fs.readFileSync(characterPath, 'utf8'));

  const clipName = String(motion.spineName || motion.id || path.basename(file, '.motion.json'))
    .replace(/[^A-Za-z0-9_]/g, '_')
    .replace(/^(\d)/, '_$1');
  const { bones, unknown } = toSpineAnim(motion);
  if (!Object.keys(bones).length) throw new Error(`No mappable bones in ${file}`);

  skeleton.animations[clipName] = { bones };
  ensureRetargetCategory(character, clipName, motion);

  fs.writeFileSync(skeletonPath, `${JSON.stringify(skeleton, null, '\t')}\n`);
  fs.writeFileSync(characterPath, `${JSON.stringify(character, null, 2)}\n`);

  return {
    file,
    clipName,
    boneCount: Object.keys(bones).length,
    unknown,
  };
}

function expandArgs(args) {
  const files = [];
  for (const arg of args) {
    const full = path.resolve(root, arg);
    if (full.includes('*')) {
      const dir = path.dirname(full);
      const pattern = path.basename(full).replace(/\*/g, '.*');
      const re = new RegExp(`^${pattern}$`, 'i');
      for (const name of fs.readdirSync(dir)) {
        if (re.test(name)) files.push(path.join(dir, name));
      }
    } else if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      files.push(full);
    } else {
      throw new Error(`Not found: ${arg}`);
    }
  }
  return files;
}

const args = process.argv.slice(2);
if (!args.length) {
  console.log('Usage: node tools/retarget-motion-to-hitman.mjs <file.motion.json> [...]');
  process.exit(1);
}

const results = expandArgs(args).map(retargetFile);
for (const result of results) {
  console.log(`OK ${path.relative(root, result.file)} → Spine anim "${result.clipName}" (${result.boneCount} bones)`);
  if (result.unknown.length) console.log(`  skipped unknown bones: ${result.unknown.join(', ')}`);
}
console.log('Refresh preview → category Retarget');
