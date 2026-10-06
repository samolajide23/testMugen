import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { exportMovement } from './export-movement.mjs';
import { exportMugenCheckpoint } from './export-mugen-checkpoint.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bin = path.resolve(process.env.LUAU_BIN_DIR ?? path.join(root, '.tools', 'luau-0.741'));
const executable = name => path.join(bin, name + (process.platform === 'win32' ? '.exe' : ''));
function run(name, files) {
  const result = spawnSync(executable(name), files, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${name} failed (exit ${result.status}, signal ${result.signal})`);
}
try {
  for (const name of ['luau', 'luau-analyze']) {
    try { await fs.access(executable(name)); }
    catch { throw new Error(`Missing ${name}. On Windows run npm run setup:luau, or set LUAU_BIN_DIR to an official Luau CLI directory.`); }
  }
  await exportMovement(path.join(root, 'generated'));
  await exportMugenCheckpoint(path.join(root, 'chars', 'coiny'), path.join(root, 'generated'));
  await exportMugenCheckpoint(path.join(root, 'chars', 'Pikachu'), path.join(root, 'generated'), 'pikachu');
  const tests = (await fs.readdir(path.join(root, 'tests', 'luau'))).filter(name => name.endsWith('.test.luau')).sort()
    .map(name => path.join('tests', 'luau', name));
  if (!tests.length) throw new Error('No Luau test files found');
  const runtime = (await fs.readdir(path.join(root, 'runtime'))).filter(name => name.endsWith('.luau')).sort()
    .map(name => path.join('runtime', name));
  run('luau-analyze', [...runtime, path.join('generated', 'luau', 'movement.luau'), path.join('generated', 'luau', 'coiny-checkpoint.luau'), path.join('generated', 'luau', 'pikachu-checkpoint.luau'), ...tests]);
  console.log('Luau strict analysis passed.');
  for (const test of tests) run('luau', [test]);
} catch (error) { console.error(error.message); process.exitCode = 1; }
