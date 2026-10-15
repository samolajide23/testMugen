/**
 * Look for a local Brawlhalla install and report .anm paths for the retarget pipeline.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const candidates = [
  path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Steam', 'steamapps', 'common', 'Brawlhalla'),
  path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Steam', 'steamapps', 'common', 'Brawlhalla'),
  'D:\\SteamLibrary\\steamapps\\common\\Brawlhalla',
  'E:\\SteamLibrary\\steamapps\\common\\Brawlhalla',
  'C:\\SteamLibrary\\steamapps\\common\\Brawlhalla',
  path.join(os.homedir(), 'SteamLibrary', 'steamapps', 'common', 'Brawlhalla'),
];

function walkAnm(dir, limit = 40) {
  const found = [];
  const stack = [dir];
  while (stack.length && found.length < limit) {
    const current = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!['Binary', '.git'].includes(entry.name)) stack.push(full);
      } else if (/\.anm$/i.test(entry.name)) {
        found.push(full);
        if (found.length >= limit) break;
      }
    }
  }
  return found;
}

let hit = null;
for (const candidate of candidates) {
  if (fs.existsSync(candidate)) {
    hit = candidate;
    break;
  }
}

if (!hit) {
  console.log('Brawlhalla not found in common Steam paths.');
  console.log('Install via Steam, then re-run: node tools/find-brawlhalla.mjs');
  console.log('Until then, use: node tools/retarget-motion-to-hitman.mjs refs/samples/synthetic-jab.motion.json');
  process.exit(0);
}

console.log('Found:', hit);
const anms = walkAnm(hit);
console.log(`Sample .anm files (${anms.length}):`);
for (const file of anms.slice(0, 20)) console.log(' ', path.relative(hit, file));
console.log('\nNext: export bone frames with BhANMexporter / AnmRender, convert to refs/*.motion.json, then retarget.');
