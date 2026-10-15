/**
 * Source of truth: packs/hitman → generated/spine/hitman
 * Skins for the live preview live in the hitman-spine project (PNG only).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'packs', 'hitman');
const dest = path.join(root, 'generated', 'spine', 'hitman');
const files = ['Hitman.json', 'Hitman.atlas', 'Hitman.png', 'character.json', 'LICENSE.txt'];

fs.mkdirSync(dest, { recursive: true });
for (const name of files) {
  const from = path.join(src, name);
  if (!fs.existsSync(from)) throw new Error(`Missing ${from}`);
  fs.copyFileSync(from, path.join(dest, name));
}

const manifest = {
  characters: [{ id: 'hitman', name: 'Hitman', url: 'spine/hitman/character.json', rig: 'hitman', skin: 'hitman' }],
  generatedAt: new Date().toISOString(),
};
fs.writeFileSync(path.join(root, 'generated', 'characters.json'), `${JSON.stringify(manifest, null, 2)}\n`);

fs.writeFileSync(
  path.join(root, 'packs', 'manifest.json'),
  `${JSON.stringify({
    updatedAt: new Date().toISOString(),
    sourceOfTruth: 'packs/hitman',
    packs: [{ id: 'hitman', path: 'packs/hitman', kind: 'spine', rig: 'hitman', skin: 'hitman' }],
  }, null, 2)}\n`,
);

console.log('Synced packs/hitman → generated/spine/hitman');
