import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';
import { crc32, decodePng, importCharacter } from '../tools/mugen-import.mjs';
import { importCharacterZip, ZIP_LIMITS } from '../tools/zip-import.mjs';

const testsRoot = path.dirname(fileURLToPath(import.meta.url));
async function fixture(t) {
  const root = await fs.mkdtemp(path.join(testsRoot, '.zip-import-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  return root;
}
function zip(records) {
  const locals = [], centrals = [];
  let offset = 0;
  for (const record of records) {
    const filename = Buffer.from(record.name), data = Buffer.from(record.data ?? '');
    const method = record.method ?? 0, flags = record.flags ?? 0x800;
    const payload = record.payload ?? (method === 8 ? deflateRawSync(data) : data);
    const crc = record.crc ?? crc32(data), length = record.length ?? data.length;
    const extra = record.extra ?? Buffer.alloc(0), localExtra = record.localExtra ?? extra;
    const local = Buffer.alloc(30), central = Buffer.alloc(46);
    local.writeUInt32LE(0x04034b50); local.writeUInt16LE(record.version ?? 20, 4); local.writeUInt16LE(flags, 6); local.writeUInt16LE(method, 8);
    if (!(flags & 8)) { local.writeUInt32LE(crc, 14); local.writeUInt32LE(payload.length, 18); local.writeUInt32LE(length, 22); }
    local.writeUInt16LE(filename.length, 26); local.writeUInt16LE(localExtra.length, 28);
    central.writeUInt32LE(0x02014b50); central.writeUInt16LE(0x0314, 4); central.writeUInt16LE(record.version ?? 20, 6);
    central.writeUInt16LE(flags, 8); central.writeUInt16LE(method, 10); central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(payload.length, 20); central.writeUInt32LE(length, 24); central.writeUInt16LE(filename.length, 28); central.writeUInt16LE(extra.length, 30);
    central.writeUInt32LE(record.attributes ?? (record.name.endsWith('/') ? 0x41ed0010 : 0x81a40000), 38); central.writeUInt32LE(offset, 42);
    const descriptor = flags & 8 ? Buffer.alloc(record.unsignedDescriptor ? 12 : 16) : Buffer.alloc(0);
    if (descriptor.length) {
      const start = descriptor.length - 12;
      if (start) descriptor.writeUInt32LE(0x08074b50);
      descriptor.writeUInt32LE(crc, start); descriptor.writeUInt32LE(payload.length, start + 4); descriptor.writeUInt32LE(length, start + 8);
    }
    locals.push(local, filename, localExtra, payload, descriptor); centrals.push(central, filename, extra);
    offset += local.length + filename.length + localExtra.length + payload.length + descriptor.length;
  }
  const directory = Buffer.concat(centrals), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(records.length, 8); end.writeUInt16LE(records.length, 10);
  end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, directory, end]);
}
function sff() {
  const header = Buffer.alloc(512), record = Buffer.alloc(28), rgba = Buffer.from([20, 100, 200, 255]);
  header.write('ElecbyteSpr\0'); header[15] = 2; header[13] = 1;
  header.writeUInt32LE(512, 36); header.writeUInt32LE(1, 40); header.writeUInt32LE(512, 44);
  header.writeUInt32LE(540, 52); header.writeUInt32LE(4, 56); header.writeUInt32LE(544, 60);
  record.writeUInt16LE(1, 4); record.writeUInt16LE(1, 6); record[15] = 32; record.writeUInt32LE(4, 20);
  return Buffer.concat([header, record, rgba]);
}
function character(prefix = '', options = {}) {
  return [
    { name: `${prefix}Hero.def`, data: '[Info]\nname="Zip Hero"\n[Files]\nsprite=assets\\hero.sff\nanim=assets/hero.air\ncns=states/logic.cns', ...options },
    { name: `${prefix}assets/hero.sff`, data: sff(), ...options },
    { name: `${prefix}assets/hero.air`, data: '[Begin Action 0]\n0,0,0,0,-1\n', ...options },
    { name: `${prefix}states/logic.cns`, data: '[Statedef 0]\ntype=S\n[State 0, Data]\ntype=Null\ntrigger1=1\n', ...options },
    { name: `${prefix}script.js`, data: 'throw new Error("uploaded code must not execute");', ...options },
  ];
}
async function assertClean(root, expected = []) {
  assert.deepEqual((await fs.readdir(root)).sort(), [...expected].sort());
}
async function invalid(t, buffer, statusCode = 400, message) {
  const root = await fixture(t);
  await assert.rejects(importCharacterZip(buffer, { root, filename: 'Hero.zip' }), error => error.statusCode === statusCode && (!message || message.test(error.message)));
  await assertClean(root);
}
async function initialManifest(root) {
  await fs.mkdir(path.join(root, 'chars')); await fs.mkdir(path.join(root, 'generated'));
  const manifest = { characters: [{ id: 'existing', name: 'Existing', url: 'existing/character.json', extra: 12 }], custom: { preserve: true }, generatedAt: 'original' };
  const bytes = `${JSON.stringify(manifest)}\n`;
  await fs.writeFile(path.join(root, 'generated', 'characters.json'), bytes);
  return { manifest, bytes };
}

test('real stored ZIP conversion persists nested source, PNG, JSON and preserves manifest', async t => {
  const root = await fixture(t), { manifest } = await initialManifest(root);
  const records = [...character('Collection/Hero/'), { name: 'Collection/', data: '' }, { name: 'Collection/Hero/', data: '' },
    { name: 'Collection/Hero/other.def', data: 'not the directory-matching DEF' }];
  const response = await importCharacterZip(zip(records), { root, filename: 'different.zip' });
  assert.deepEqual(response.character, { id: 'hero', name: 'Zip Hero', url: 'hero/character.json' });
  assert.equal(response.savedFolder, 'chars/hero'); assert.equal(response.counts.sprites, 1); assert.equal(response.counts.animations, 1);
  assert.ok(response.warnings.some(w => /not evaluated/.test(w)));
  for (const record of records.filter(r => !r.name.endsWith('/'))) {
    assert.deepEqual(await fs.readFile(path.join(root, 'chars', 'hero', ...record.name.slice('Collection/Hero/'.length).split('/'))), Buffer.from(record.data));
  }
  const persisted = JSON.parse(await fs.readFile(path.join(root, 'generated', 'hero', 'character.json')));
  assert.deepEqual(persisted.report.counts, response.counts);
  const png = decodePng(await fs.readFile(path.join(root, 'generated', 'hero', 'sprites', '0_0.png')));
  assert.deepEqual(png.rgba, Buffer.from([20, 100, 200, 255]));
  const index = JSON.parse(await fs.readFile(path.join(root, 'generated', 'characters.json')));
  assert.deepEqual(index.characters, [...manifest.characters, response.character]); assert.deepEqual(index.custom, manifest.custom);
  await assertClean(root, ['chars', 'generated']);
  assert.deepEqual((await fs.readdir(path.join(root, 'generated'))).sort(), ['characters.json', 'hero']);
});

test('flat deflated ZIP supports signed/unsigned descriptors and safe backslash paths', async t => {
  for (const unsignedDescriptor of [false, true]) {
    const root = await fixture(t), records = character('', { method: 8, flags: 0x808, unsignedDescriptor });
    records[1].name = 'assets\\hero.sff';
    const response = await importCharacterZip(zip(records), { root, filename: 'Fíghter HD.zip' });
    assert.equal(response.character.id, 'fi-ghter-hd');
    assert.equal(response.counts.sprites, 1);
    assert.deepEqual(await fs.readFile(path.join(root, 'chars', response.character.id, 'assets', 'hero.sff')), sff());
    await assertClean(root, ['chars', 'generated']);
  }
});

test('one nonmatching DEF and deflated empty directories under a wrapper are supported', async t => {
  const root = await fixture(t);
  const records = [...character('Fancy Name/'), { name: 'Fancy Name/', method: 8 }, { name: 'Fancy Name/empty/', method: 8 }];
  assert.equal((await importCharacterZip(zip(records), { root, filename: 'upload.zip' })).character.id, 'fancy-name');
  assert.deepEqual(await fs.readdir(path.join(root, 'chars', 'fancy-name', 'empty')), []);
});

test('existing source/output folders and manifest IDs are never overwritten, case-insensitively', async t => {
  for (const location of ['chars', 'generated', 'manifest']) {
    const root = await fixture(t), { bytes } = await initialManifest(root);
    if (location === 'manifest') {
      await fs.writeFile(path.join(root, 'generated', 'characters.json'), JSON.stringify({ characters: [{ id: 'hero', name: 'Old', url: 'hero/character.json' }] }));
    } else {
      await fs.mkdir(path.join(root, location, 'HeRo'));
      await fs.writeFile(path.join(root, location, 'HeRo', 'sentinel'), 'keep');
    }
    const before = await fs.readFile(path.join(root, 'generated', 'characters.json'));
    await assert.rejects(importCharacterZip(zip(character()), { root, filename: 'Hero.zip' }), { statusCode: 409 });
    assert.deepEqual(await fs.readFile(path.join(root, 'generated', 'characters.json')), before);
    if (location !== 'manifest') {
      assert.equal(await fs.readFile(path.join(root, location, 'HeRo', 'sentinel'), 'utf8'), 'keep');
      assert.equal(before.toString(), bytes);
    }
    await assertClean(root, ['chars', 'generated']);
  }
});

test('a repeated upload conflicts without altering the first import', async t => {
  const root = await fixture(t), buffer = zip(character());
  await importCharacterZip(buffer, { root, filename: 'Hero.zip' });
  const before = await fs.readFile(path.join(root, 'generated', 'characters.json'));
  await assert.rejects(importCharacterZip(buffer, { root, filename: 'Hero.zip' }), { statusCode: 409 });
  assert.deepEqual(await fs.readFile(path.join(root, 'generated', 'characters.json')), before);
});

test('all ZIP paths are checked before any write, including unused outside assets', async t => {
  for (const name of ['../escape', '/absolute', 'C:/drive', 'C:drive', '\\\\host\\share', 'ok/../../escape', 'ok\\..\\escape', 'x:stream', 'NUL', 'aux.txt',
    'COM1.png', 'lpt²', 'CONIN$', 'trailing.', 'trailing ', 'a//b', './a', 'a\0b', 'x?y', 'a/PRN .txt']) {
    await invalid(t, zip([...character(), { name, data: 'unsafe' }]));
  }
});

test('duplicate, case-alias and file/directory conflicts are rejected', async t => {
  for (const names of [['x', 'x'], ['x', 'X'], ['A/x', 'a/y'], ['x', 'x/y'], ['x/', 'x'], ['é', 'e\u0301']]) {
    await invalid(t, zip([...character(), ...names.map(name => ({ name }))]));
  }
});

test('symlinks and special ZIP metadata are rejected', async t => {
  for (const attributes of [0xa1ff0000, 0x11a40000, 0x21a40000, 0x61a40000, 0xc1a40000, 0x81a40040, 0x81a40008, 0x41ed0010]) {
    await invalid(t, zip([...character(), { name: 'link', data: 'target', attributes }]));
  }
  for (const tag of [0x0001, 0x0017, 0x9901, 0x000d, 0x756e]) {
    const extra = Buffer.alloc(4); extra.writeUInt16LE(tag);
    await invalid(t, zip(character('', { extra })));
    await invalid(t, zip(character('', { localExtra: extra })));
  }
});

test('encryption, unsupported flags/methods, malformed extras and ZIP64 are rejected', async t => {
  for (const options of [{ flags: 1 }, { flags: 0x40 }, { flags: 0x2000 }, { method: 9 }, { method: 99 }, { flags: 2 }, { version: 45 },
    { length: 0xffffffff }, { extra: Buffer.from([1]) }, { extra: Buffer.from([2, 0, 5, 0]) }, { extra: Buffer.from([0x75, 0x70, 0, 0]) }]) {
    await invalid(t, zip(character('', options)));
  }
  const buffer = zip(character()); buffer.writeUInt16LE(0xffff, buffer.length - 12);
  await invalid(t, buffer, 400, /ZIP64/);
});

test('malformed headers, offsets, disk fields, descriptors and CRC are rejected', async t => {
  await invalid(t, Buffer.from('not zip'));
  await invalid(t, zip([]));
  await invalid(t, zip(character()).subarray(0, -1));
  const mutations = [
    b => b.writeUInt16LE(1, b.length - 18),
    b => b.writeUInt16LE(1, b.length - 14),
    b => b.writeUInt32LE(1, b.length - 6),
    b => b.writeUInt16LE(8, 8),
    b => b.writeUInt32LE(1234, 14),
    b => b.writeUInt32LE(0xffffffff, 18),
    b => { b[30] = 88; },
    b => { const central = b.readUInt32LE(b.length - 6); b.writeUInt32LE(1, central + 42); },
    b => { const central = b.readUInt32LE(b.length - 6); b.writeUInt32LE(0x12345678, central); },
    b => b.writeUInt16LE(65535, 28),
  ];
  for (const mutate of mutations) { const buffer = zip(character()); mutate(buffer); await invalid(t, buffer); }
  await invalid(t, zip(character('', { crc: 123 })), 400, /CRC/);
  const descriptor = zip([{ name: 'Hero.def', data: 'test', flags: 8 }]); descriptor[30 + 8 + 4 + 4] ^= 1;
  await invalid(t, descriptor, 400, /descriptor/);
  await invalid(t, zip([{ name: 'Hero.def', method: 8, payload: Buffer.from([255, 255]) }]));
  await invalid(t, zip([{ name: 'Hero.def', method: 8, data: 'test', payload: Buffer.concat([deflateRawSync('test'), Buffer.from([0])]) }]), 400, /trailing/);
});

test('bounded compressed, expanded, entry, per-file and inflation limits reject before writes', async t => {
  await invalid(t, Buffer.alloc(ZIP_LIMITS.compressed + 1), 413);
  const entries = zip(character()); entries.writeUInt16LE(5001, entries.length - 14); entries.writeUInt16LE(5001, entries.length - 12);
  await invalid(t, entries, 413);
  await invalid(t, zip([{ name: 'Hero.def', length: ZIP_LIMITS.file + 1 }]), 413);
  await invalid(t, zip(Array.from({ length: 5 }, (_, index) => ({ name: `${index}.def`, length: ZIP_LIMITS.file }))), 413);
  await invalid(t, zip([{ name: 'Hero.def', method: 8, data: Buffer.alloc(65536), length: 1 }]), 413, /inflation/);
  await invalid(t, zip([{ name: `${'a'.repeat(256)}.def` }]), 413);
});

test('missing and ambiguous character roots fail clearly', async t => {
  await invalid(t, zip([{ name: 'readme.txt' }]), 400, /no character DEF/);
  await invalid(t, zip([{ name: 'a.def' }, { name: 'b.def' }]), 400, /Ambiguous/);
  await invalid(t, zip([...character('A/'), ...character('B/')]), 400, /Ambiguous/);
  await invalid(t, zip([...character('Hero/'), { name: 'outside.txt' }]), 400, /outside/);
});

test('unsupported real import and injected failure clean staging and preserve prior entries', async t => {
  for (const inject of [false, true]) {
    const root = await fixture(t), { bytes } = await initialManifest(root);
    const records = character();
    if (!inject) records[1].data = 'unsupported SFF';
    const importer = inject ? async (_source, output, id) => {
      await fs.mkdir(path.join(output, id), { recursive: true });
      await fs.writeFile(path.join(output, id, 'partial'), 'partial');
      throw new Error('injected conversion failure');
    } : undefined;
    await assert.rejects(importCharacterZip(zip(records), { root, filename: 'Hero.zip', importer }), { statusCode: 422 });
    assert.equal(await fs.readFile(path.join(root, 'generated', 'characters.json'), 'utf8'), bytes);
    await assertClean(root, ['chars', 'generated']);
    assert.deepEqual(await fs.readdir(path.join(root, 'chars')), []);
    assert.deepEqual(await fs.readdir(path.join(root, 'generated')), ['characters.json']);
  }
});

test('manifest changes during conversion are preserved and cause conflict', async t => {
  const root = await fixture(t); await initialManifest(root);
  const changed = JSON.stringify({ characters: [{ id: 'other', name: 'Other', url: 'other/character.json' }] });
  const importer = async (...args) => {
    const result = await importCharacter(...args);
    await fs.writeFile(path.join(root, 'generated', 'characters.json'), changed);
    return result;
  };
  await assert.rejects(importCharacterZip(zip(character()), { root, filename: 'Hero.zip', importer }), { statusCode: 409 });
  assert.equal(await fs.readFile(path.join(root, 'generated', 'characters.json'), 'utf8'), changed);
  assert.deepEqual(await fs.readdir(path.join(root, 'chars')), []);
  await assertClean(root, ['chars', 'generated']);
});

test('failure after source publishing rolls back only newly owned paths', async t => {
  const root = await fixture(t), { bytes } = await initialManifest(root);
  const importer = async (...args) => {
    const result = await importCharacter(...args);
    await fs.rm(path.join(args[1], args[2]), { recursive: true });
    return result;
  };
  await assert.rejects(importCharacterZip(zip(character()), { root, filename: 'Hero.zip', importer }));
  assert.equal(await fs.readFile(path.join(root, 'generated', 'characters.json'), 'utf8'), bytes);
  assert.deepEqual(await fs.readdir(path.join(root, 'chars')), []);
  assert.deepEqual(await fs.readdir(path.join(root, 'generated')), ['characters.json']);
  await assertClean(root, ['chars', 'generated']);
});

test('manifest replacement failure rolls back both published directories', async t => {
  const root = await fixture(t), { bytes } = await initialManifest(root);
  const rename = fs.rename, manifestPath = path.join(root, 'generated', 'characters.json');
  fs.rename = async (source, target) => {
    if (target === manifestPath) throw Object.assign(new Error('injected rename failure'), { code: 'EACCES' });
    return rename(source, target);
  };
  try { await assert.rejects(importCharacterZip(zip(character()), { root, filename: 'Hero.zip' }), { statusCode: 500 }); }
  finally { fs.rename = rename; }
  assert.equal(await fs.readFile(manifestPath, 'utf8'), bytes);
  assert.deepEqual(await fs.readdir(path.join(root, 'chars')), []);
  assert.deepEqual(await fs.readdir(path.join(root, 'generated')), ['characters.json']);
  await assertClean(root, ['chars', 'generated']);
});

test('late output collision never rolls back a directory owned by another writer', async t => {
  const root = await fixture(t), { bytes } = await initialManifest(root);
  const mkdir = fs.mkdir, target = path.join(root, 'generated', 'hero');
  fs.mkdir = async (directory, options) => {
    if (directory === target) {
      await mkdir(directory); await fs.writeFile(path.join(directory, 'sentinel'), 'other writer');
      throw Object.assign(new Error('injected collision'), { code: 'EEXIST' });
    }
    return mkdir(directory, options);
  };
  try { await assert.rejects(importCharacterZip(zip(character()), { root, filename: 'Hero.zip' }), { statusCode: 409 }); }
  finally { fs.mkdir = mkdir; }
  assert.equal(await fs.readFile(path.join(target, 'sentinel'), 'utf8'), 'other writer');
  assert.equal(await fs.readFile(path.join(root, 'generated', 'characters.json'), 'utf8'), bytes);
  assert.deepEqual(await fs.readdir(path.join(root, 'chars')), []);
  await assertClean(root, ['chars', 'generated']);
});

test('symlink roots and source/generated junctions cannot redirect writes', async t => {
  for (const child of ['root', 'chars', 'generated']) {
    const base = await fixture(t), real = path.join(base, 'real'), target = path.join(base, 'target');
    await fs.mkdir(real); await fs.mkdir(target);
    const link = child === 'root' ? path.join(base, 'linked') : path.join(real, child);
    await fs.symlink(target, link, 'junction');
    await assert.rejects(importCharacterZip(zip(character()), { root: child === 'root' ? link : real, filename: 'Hero.zip' }), { statusCode: 400 });
    assert.deepEqual(await fs.readdir(target), []);
    assert.ok(!(await fs.readdir(real)).some(name => name.startsWith('.zip-import-')));
  }
});

test('unsafe manifest paths and malformed manifest data are not replaced', async t => {
  for (const content of ['{', '{"characters":{}}', '{"characters":[{"id":"../bad","name":"Bad","url":"../bad/character.json"}]}']) {
    const root = await fixture(t); await initialManifest(root);
    await fs.writeFile(path.join(root, 'generated', 'characters.json'), content);
    await assert.rejects(importCharacterZip(zip(character()), { root, filename: 'Hero.zip' }), { statusCode: 400 });
    assert.equal(await fs.readFile(path.join(root, 'generated', 'characters.json'), 'utf8'), content);
    await assertClean(root, ['chars', 'generated']);
  }
  const base = await fixture(t), root = path.join(base, 'root'), outside = path.join(base, 'outside');
  await fs.mkdir(root); await fs.mkdir(outside); await fs.mkdir(path.join(root, 'generated'));
  await fs.symlink(outside, path.join(root, 'generated', 'characters.json'), 'junction');
  await assert.rejects(importCharacterZip(zip(character()), { root, filename: 'Hero.zip' }), { statusCode: 400 });
  assert.deepEqual(await fs.readdir(outside), []);
});

test('failed imports leave a previously empty root unchanged', async t => {
  const root = await fixture(t), records = character(); records[1].data = 'unsupported';
  await assert.rejects(importCharacterZip(zip(records), { root, filename: 'Hero.zip' }), { statusCode: 422 });
  await assertClean(root);
  assert.equal((await importCharacterZip(zip(character()), { root, filename: 'Hero.zip' })).character.id, 'hero');
});

test('invalid filenames and missing roots have explicit invalid-input status', async t => {
  const root = await fixture(t), buffer = zip(character());
  for (const filename of ['../Hero.zip', 'C:\\Hero.zip', 'Hero.txt', '.zip', 'NUL.zip', undefined]) {
    await assert.rejects(importCharacterZip(buffer, { root, filename }), { statusCode: 400 });
    await assertClean(root);
  }
  await assert.rejects(importCharacterZip(buffer, { root: path.join(root, 'missing'), filename: 'Hero.zip' }), { statusCode: 400 });
});

test('an invalid manifest is checked before creating any missing source directory', async t => {
  const root = await fixture(t); await fs.mkdir(path.join(root, 'generated'));
  await fs.writeFile(path.join(root, 'generated', 'characters.json'), '{}');
  await assert.rejects(importCharacterZip(zip(character()), { root, filename: 'Hero.zip' }), { statusCode: 400 });
  await assertClean(root, ['generated']);
});

test('an actual file symlink manifest is rejected without modifying its target', async t => {
  const root = await fixture(t); await fs.mkdir(path.join(root, 'generated'));
  const target = path.join(root, 'outside.json'); await fs.writeFile(target, '{"characters":[]}');
  try { await fs.symlink(target, path.join(root, 'generated', 'characters.json'), 'file'); }
  catch (error) { if (error.code === 'EPERM') { t.skip('File symlink creation requires Windows Developer Mode or elevated privileges'); return; } throw error; }
  await assert.rejects(importCharacterZip(zip(character()), { root, filename: 'Hero.zip' }), { statusCode: 400 });
  assert.equal(await fs.readFile(target, 'utf8'), '{"characters":[]}');
  await assertClean(root, ['generated', 'outside.json']);
});

test('same-root imports cannot race while conversion is active', async t => {
  const root = await fixture(t), buffer = zip(character());
  let entered, release;
  const started = new Promise(resolve => { entered = resolve; }), paused = new Promise(resolve => { release = resolve; });
  const first = importCharacterZip(buffer, { root, filename: 'Hero.zip', importer: async (...args) => { entered(); await paused; return importCharacter(...args); } });
  await started;
  try { await assert.rejects(importCharacterZip(buffer, { root, filename: 'Other.zip' }), { statusCode: 409 }); }
  finally { release(); }
  await first;
  await assertClean(root, ['chars', 'generated']);
});
