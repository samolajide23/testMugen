import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ACTIONS = { idle: 0, walkForward: 20, walkBackward: 21, crouchDown: 10, crouch: 11, crouchUp: 12,
  jumpStart: 40, jumpNeutral: 41, jumpForward: 42, jumpBackward: 43, land: 47 };
const LIMITATIONS = [
  'Prototype movement states, not execution of MUGEN CMD/CNS triggers, controllers, or common1.cns.',
  'Transition durations use one AIR pass, not custom state timing. Duplicate movement actions use the first definition.',
  'No running, air jumps, air steering, turn animation, friction/inertia, collisions, or combat.',
  'Positions and velocities use source coordinate units at 60 ticks/second; sprite scale and Roblox studs are rendering concerns.',
];

function numeric(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string' || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim())) return null;
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}

export function buildMovementConfig(character) {
  const warnings = [], velocity = character.movement?.velocity ?? {}, movement = character.movement?.movement ?? {};
  function scalar(value, label, fallback, valid = () => true) {
    const result = numeric(value);
    if (result !== null && valid(result)) return result;
    warnings.push(`${label}: missing/unsupported value; prototype default ${fallback} used.`);
    return fallback;
  }
  function jump(key, fallback, validX = () => true) {
    const raw = velocity[key];
    const parts = typeof raw === 'string' ? raw.split(',').map(s => s.trim()) : typeof raw === 'number' ? [raw] : [];
    if (!parts.length || parts.length > 2) {
      warnings.push(`velocity.${key}: missing/unsupported vector; prototype default ${fallback.x},${fallback.y} used.`);
      return { ...fallback };
    }
    return {
      x: scalar(parts[0], `velocity.${key}.x`, fallback.x, validX),
      y: parts.length === 1 ? fallback.y : scalar(parts[1], `velocity.${key}.y`, fallback.y, y => y < 0),
    };
  }
  const animations = {}, selected = new Map();
  for (const [name, id] of Object.entries(ACTIONS)) {
    const matches = (character.animations ?? []).filter(a => a.id === id);
    if (matches.length > 1) warnings.push(`AIR action ${id}: duplicate definitions; first selected for ${name}.`);
    if (matches[0]?.frames?.length) {
      animations[name] = id;
      selected.set(name, matches[0]);
      if (matches[0].frames.some(f => f.group !== -1 && f.index !== -1 && !character.sprites?.[f.spriteKey ?? `${f.group & 0xffff},${f.index & 0xffff}`])) {
        warnings.push(`AIR action ${id}: contains unresolved sprite references; movement export does not repair artwork.`);
      }
    } else warnings.push(`AIR action ${id}: absent/empty; ${name} state has no animation.`);
  }
  function duration(name) {
    const frames = selected.get(name)?.frames;
    const ticks = frames?.reduce((sum, frame) => sum + frame.duration, 0);
    if (frames?.every(f => Number.isSafeInteger(f.duration) && f.duration >= 0) && Number.isSafeInteger(ticks) && ticks > 0) return ticks;
    warnings.push(`${name}: absent, held, or invalid AIR duration; prototype transition default 1 tick used.`);
    return 1;
  }
  const neutral = jump('jump.neu', { x: 0, y: -8.4 });
  const config = {
    walkForward: scalar(velocity['walk.fwd'], 'velocity.walk.fwd', 2.4, n => n >= 0),
    walkBackward: scalar(velocity['walk.back'], 'velocity.walk.back', -2.2, n => n <= 0),
    jumpNeutral: neutral,
    jumpForward: jump('jump.fwd', { x: 2.5, y: neutral.y }, n => n >= 0),
    jumpBackward: jump('jump.back', { x: -2.55, y: neutral.y }, n => n <= 0),
    gravity: scalar(movement.yaccel, 'movement.yaccel', 0.44, n => n > 0),
    crouchDownTicks: duration('crouchDown'), crouchUpTicks: duration('crouchUp'),
    jumpStartTicks: duration('jumpStart'), landTicks: duration('land'), animations,
  };
  if ((numeric(movement['airjump.num']) ?? 0) > 0) warnings.push('Authored air jumps are not enabled in this ground-jump milestone.');
  return { config, warnings, localcoord: character.localcoord ?? [320, 240] };
}

function quote(value) {
  return '"' + [...Buffer.from(value)].map(byte => byte >= 32 && byte <= 126 && byte !== 34 && byte !== 92
    ? String.fromCharCode(byte) : `\\${String(byte).padStart(3, '0')}`).join('') + '"';
}
export function toLuau(value, depth = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'string') return quote(value);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Movement module supports only finite numbers, strings, and tables');
  const indent = '  '.repeat(depth), entries = Object.entries(value);
  return `{\n${entries.map(([key, entry]) => `${indent}  [${quote(key)}] = ${toLuau(entry, depth + 1)},`).join('\n')}\n${indent}}`;
}

async function safeDestination(root) {
  const destination = path.join(root, 'luau');
  try {
    const stat = await fs.lstat(destination);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('Unsafe movement output directory');
  } catch (error) { if (error.code === 'ENOENT') await fs.mkdir(destination); else throw error; }
  for (const name of ['movement.luau', 'movement-report.json']) {
    try {
      const stat = await fs.lstat(path.join(destination, name));
      if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink > 1) throw new Error(`Unsafe movement output file: ${name}`);
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return destination;
}

export async function exportMovement(input = 'generated') {
  const root = await fs.realpath(input), manifest = JSON.parse(await fs.readFile(path.join(root, 'characters.json'), 'utf8'));
  if (!Array.isArray(manifest.characters) || !manifest.characters.length) throw new Error('Import at least one character before exporting movement');
  const configs = {}, reports = [];
  for (const entry of manifest.characters) {
    if (typeof entry.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id) || Object.hasOwn(configs, entry.id)) throw new Error('Invalid/duplicate movement character ID');
    if (entry.url !== `${entry.id}/character.json`) throw new Error(`Unexpected character URL: ${entry.id}`);
    const file = await fs.realpath(path.join(root, entry.id, 'character.json'));
    const relative = path.relative(root, file);
    if (relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) throw new Error('Character file escapes generated directory');
    const character = JSON.parse(await fs.readFile(file, 'utf8'));
    if (character.id !== entry.id) throw new Error(`Character ID mismatch: ${entry.id}`);
    const result = buildMovementConfig(character);
    Object.defineProperty(configs, entry.id, { value: result.config, enumerable: true });
    reports.push({ id: entry.id, ...result });
  }
  const destination = await safeDestination(root);
  const module = `--!strict\n-- Generated by npm run export:movement; prototype settings, not a MUGEN state interpreter.\nreturn ${toLuau(configs)}\n`;
  const report = { schemaVersion: 1, ticksPerSecond: 60, limitations: LIMITATIONS, characters: reports };
  await fs.writeFile(path.join(destination, 'movement.luau'), module);
  await fs.writeFile(path.join(destination, 'movement-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const report = await exportMovement();
    for (const character of report.characters) console.log(`${character.id}: Luau movement exported (${character.warnings.length} notices)`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
