import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import { parseIni, parseDef, parseAir, parseCmd, parseStates, resolveCharacterFile, decodeAct,
  decodePcx, decodeRle8, decodeRle5, decodeLz5, decodePng, encodePng, crc32, decodeSff, importCharacter, importCharacters } from '../tools/mugen-import.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function fixture(t) {
  const directory = await fs.mkdtemp(path.join(root, 'tests', '.mugen-import-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  return directory;
}
function palette() {
  const result = Buffer.alloc(1024);
  for (let i = 0; i < 256; i++) result.set([i, 255 - i, i ^ 85, i ? 255 : 0], i * 4);
  return result;
}
function pcx({ width = 3, height = 1, stride = 4, data = [0, 1, 0xc1, 200, 0], includePalette = true, encoding = 1 } = {}) {
  const header = Buffer.alloc(128);
  header[0] = 10; header[1] = 5; header[2] = encoding; header[3] = 8;
  header.writeUInt16LE(width - 1, 8); header.writeUInt16LE(height - 1, 10);
  header[65] = 1; header.writeUInt16LE(stride, 66);
  const rgb = Buffer.alloc(769); rgb[0] = 12;
  for (let i = 0; i < 256; i++) palette().copy(rgb, 1 + i * 3, i * 4, i * 4 + 3);
  return Buffer.concat([header, Buffer.from(data), ...(includePalette ? [rgb] : [])]);
}
function sff1(records) {
  const header = Buffer.alloc(512); header.write('ElecbyteSpr\0'); header[15] = 1;
  header.writeUInt32LE(records.length, 20); header.writeUInt32LE(512, 24); header.writeUInt32LE(32, 28);
  const parts = [header]; let position = 512;
  records.forEach((record, i) => {
    const data = record.data ?? Buffer.alloc(0), h = Buffer.alloc(32);
    h.writeUInt32LE(i + 1 < records.length ? position + 32 + data.length : 0);
    h.writeUInt32LE(data.length, 4); h.writeInt16LE(record.axisX ?? 0, 8); h.writeInt16LE(record.axisY ?? 0, 10);
    h.writeUInt16LE(record.group ?? 0, 12); h.writeUInt16LE(record.index ?? i, 14); h.writeUInt16LE(record.link ?? 0, 16); h[18] = record.shared ? 1 : 0;
    parts.push(h, data); position += 32 + data.length;
  });
  return Buffer.concat(parts);
}
function sff2(records, palettes = [{ data: palette() }], minor = 1) {
  const header = Buffer.alloc(512); header.write('ElecbyteSpr\0'); header[15] = 2; header[13] = minor;
  const palTable = Buffer.alloc(palettes.length * 16), spriteTable = Buffer.alloc(records.length * 28), local = [], translated = [];
  let localSize = 0, translatedSize = 0;
  palettes.forEach((record, i) => {
    const offset = i * 16, data = record.data ?? Buffer.alloc(0);
    palTable.writeUInt16LE(1, offset); palTable.writeUInt16LE(i + 1, offset + 2); palTable.writeUInt16LE(record.colors ?? 256, offset + 4);
    palTable.writeUInt16LE(record.link ?? 0, offset + 6); palTable.writeUInt32LE(localSize, offset + 8); palTable.writeUInt32LE(data.length, offset + 12);
    local.push(data); localSize += data.length;
  });
  records.forEach((record, i) => {
    const offset = i * 28, data = record.data ?? Buffer.alloc(0), translatedBlock = record.flags === 1;
    spriteTable.writeUInt16LE(record.group ?? 0, offset); spriteTable.writeUInt16LE(record.index ?? i, offset + 2);
    spriteTable.writeUInt16LE(record.width ?? 3, offset + 4); spriteTable.writeUInt16LE(record.height ?? 1, offset + 6);
    spriteTable.writeInt16LE(record.axisX ?? 0, offset + 8); spriteTable.writeInt16LE(record.axisY ?? 0, offset + 10); spriteTable.writeUInt16LE(record.link ?? 0, offset + 12);
    spriteTable[offset + 14] = record.format ?? 0; spriteTable[offset + 15] = record.depth ?? 8;
    spriteTable.writeUInt32LE(translatedBlock ? translatedSize : localSize, offset + 16); spriteTable.writeUInt32LE(data.length, offset + 20);
    spriteTable.writeUInt16LE(record.paletteIndex ?? 0, offset + 24); spriteTable.writeUInt16LE(record.flags ?? 0, offset + 26);
    if (translatedBlock) { translated.push(data); translatedSize += data.length; } else { local.push(data); localSize += data.length; }
  });
  header.writeUInt32LE(512 + palTable.length, 36); header.writeUInt32LE(records.length, 40);
  header.writeUInt32LE(512, 44); header.writeUInt32LE(palettes.length, 48);
  header.writeUInt32LE(512 + palTable.length + spriteTable.length, 52); header.writeUInt32LE(localSize, 56);
  header.writeUInt32LE(512 + palTable.length + spriteTable.length + localSize, 60); header.writeUInt32LE(translatedSize, 64);
  return Buffer.concat([header, palTable, spriteTable, ...local, ...translated]);
}
function payload(size, bytes) {
  const length = Buffer.alloc(4); length.writeUInt32LE(size);
  return Buffer.concat([length, Buffer.from(bytes)]);
}
function chunk(type, data) {
  const result = Buffer.alloc(data.length + 12); result.writeUInt32BE(data.length); result.write(type, 4); data.copy(result, 8);
  result.writeUInt32BE(crc32(result.subarray(4, -4)), result.length - 4); return result;
}
function png({ width, height = 1, type = 3, depth = 8, raw, palette: rgb = Buffer.from([0, 0, 0, 255, 0, 0]), interlace = 0 }) {
  const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = depth; header[9] = type; header[12] = interlace;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), ...(type === 3 ? [chunk('PLTE', rgb)] : []), chunk('IDAT', deflateSync(Buffer.from(raw))), chunk('IEND', Buffer.alloc(0))]);
}

test('DEF/INI preserve quoted semicolons, duplicate keys and expression equals', () => {
  const def = parseDef('[INFO]\r\nname = "A;B" ; comment\r\ndisplayname="Shown"\r\nmugenversion=1.1\r\nlocalcoord=640,480\r\n[FILES]\r\nSprite = "Images\\Test.SFF"');
  assert.equal(def.name, 'Shown'); assert.equal(def.sourceVersion, '1.1'); assert.deepEqual(def.localcoord, [640, 480]);
  assert.equal(def.files.sprite, '"Images\\Test.SFF"');
  assert.deepEqual(parseDef('[Info]\nname="A;B"').localcoord, [320, 240]);
  assert.equal(parseDef('[Info]\nname="A;B"').name, 'A;B');
  assert.throws(() => parseDef('[Info]\nlocalcoord=0,240'), /localcoord/);
  const [section] = parseIni('[State 0, x]\ntrigger1=time = 0\ntrigger1=command = "a;b" ; x');
  assert.deepEqual(section.entries.map(e => e.value), ['time = 0', 'command = "a;b"']);
});

test('DEF resolves nested paths case-insensitively and rejects traversal/absolute paths', async t => {
  const dir = await fixture(t); await fs.mkdir(path.join(dir, 'States')); await fs.writeFile(path.join(dir, 'States', 'Logic.ST'), 'data');
  assert.equal(await resolveCharacterFile(dir, '"states\\logic.st"'), await fs.realpath(path.join(dir, 'States', 'Logic.ST')));
  for (const reference of ['../escape', 'States/../../escape', 'C:\\escape', '/escape', '\\\\host\\escape', 'file:stream']) await assert.rejects(resolveCharacterFile(dir, reference), /Unsafe/);
  await assert.rejects(resolveCharacterFile(dir, 'missing.cns'), /Missing/);
  const outside = path.join(dir, 'outside'); const inside = path.join(dir, 'character');
  await fs.mkdir(outside); await fs.mkdir(inside); await fs.writeFile(path.join(outside, 'x.st'), 'data');
  await fs.symlink(outside, path.join(inside, 'linked'), 'junction');
  await assert.rejects(resolveCharacterFile(inside, 'linked/x.st'), /escapes/);
});

test('AIR keeps defaults, one-frame overrides, zero boxes, durations, flips and loopstart', () => {
  const warnings = [];
  const [a, b] = parseAir(`[Begin Action 5]
Clsn2Default: 1
Clsn2[0] = -4,-8,4,0
Clsn1Default: 1
Clsn1[0] = 0,-5,9,1
0,0, 1,-2, 4, H
LoopStart
Clsn2: 0
Clsn1: 1
Clsn1[0] = 1,2,3,4
0,1, 0,0, 0, HV
0,2, 0,0, -1, V
[Begin Action 6]
-1,0, 0,0, 1`, warnings);
  assert.equal(a.loopStart, 1); assert.deepEqual(a.frames.map(f => f.duration), [4, 0, -1]);
  assert.deepEqual(a.frames[0].hurtBoxes, [[-4, -8, 4, 0]]); assert.deepEqual(a.frames[1].hurtBoxes, []); assert.deepEqual(a.frames[2].hurtBoxes, [[-4, -8, 4, 0]]);
  assert.deepEqual(a.frames[1].attackBoxes, [[1, 2, 3, 4]]); assert.deepEqual(a.frames[2].attackBoxes, [[0, -5, 9, 1]]);
  assert.equal(a.frames[0].flipH, true); assert.equal(a.frames[0].flipV, false); assert.equal(a.frames[1].flipV, true); assert.equal(a.frames[2].flipH, false);
  assert.deepEqual([a.frames[0].x, a.frames[0].y], [1, -2]); assert.deepEqual(b.frames[0].hurtBoxes, []); assert.equal(b.loopStart, 0); assert.deepEqual(warnings, []);
  a.frames[0].hurtBoxes[0][0] = 100; assert.equal(a.frames[2].hurtBoxes[0][0], -4);
});

test('AIR duplicate IDs remain independently inspectable in source order with precise warnings', () => {
  const warnings = [];
  const actions = parseAir('[Begin Action 1001]\n0,0,0,0,1\n[Begin Action 1001]\n0,1,0,0,2\n[Begin Action 34688]\n0,2,0,0,3\n[Begin Action 34688]\n0,3,0,0,4', warnings);
  assert.deepEqual(actions.map(a => a.id), [1001, 1001, 34688, 34688]);
  assert.deepEqual(actions.map(a => a.frames[0].duration), [1, 2, 3, 4]);
  assert.deepEqual(warnings, ['AIR line 3: Duplicate action 1001', 'AIR line 7: Duplicate action 34688']);
  actions[0].frames[0].duration = 99;
  assert.equal(actions[1].frames[0].duration, 2);
});

test('AIR malformed boxes, incomplete loops, invalid durations and unsupported effects are reported', () => {
  const warnings = [];
  const [a] = parseAir('[Begin Action 0]\nClsn2: 2\nClsn2[2]=1,2,3,4\n0,0,0,0,1,,AS128D128\n0,1,0,0,-2\nInterpolate Offset\nLoopStart', warnings);
  assert.equal(a.frames.length, 1); assert.equal(a.loopStart, 0); assert.deepEqual(a.frames[0].hurtBoxes, [[1, 2, 3, 4]]);
  for (const text of ['Noncanonical', 'Expected 2', 'blending', 'Invalid animation frame', 'Unsupported animation directive', 'LoopStart']) assert.ok(warnings.some(w => w.includes(text)), text);
});

test('AIR groups repeated unsupported features with bounded samples without losing frame data or errors', () => {
  const warnings = ['dependency diagnostic'];
  const lines = ['[Begin Action 0]'];
  for (let i = 0; i < 8; i++) {
    lines.push(`0,${i},0,0,1,,AS${i}D256`, i % 2 ? 'interpolate   offset' : 'Interpolate Offset');
  }
  lines.push('[Begin Action 1]', '0,0,0,0,-2', '0,0,0,0,-2', '0,0,0,0,1,Q');
  const actions = parseAir(lines.join('\n'), warnings);
  assert.equal(actions[0].frames.length, 8);
  assert.deepEqual(actions[0].frames[7].extra, ['AS7D256']);
  assert.equal(warnings[0], 'dependency diagnostic');
  assert.equal(warnings.length, 6);
  const effects = warnings.find(w => w.includes('blending'));
  assert.match(effects, /8 occurrences; sample lines: 2, 4, 6, 8, 10;/);
  assert.match(effects, /sample values: AS0D256 \| AS1D256 \| AS2D256\)/);
  assert.ok(!effects.includes('AS3D256'));
  const directives = warnings.filter(w => w.includes('Unsupported animation directive'));
  assert.equal(directives.length, 1);
  assert.match(directives[0], /Interpolate Offset \(8 occurrences; sample lines: 3, 5, 7, 9, 11\)/);
  assert.match(warnings.find(w => w.includes('Unsupported flip')), /1 occurrence; sample lines: 21; sample values: Q/);
  assert.deepEqual(warnings.filter(w => w.includes('Invalid animation frame')), [
    'AIR line 19: Invalid animation frame: 0,0,0,0,-2', 'AIR line 20: Invalid animation frame: 0,0,0,0,-2'
  ]);
  const nextWarnings = [];
  parseAir('[Begin Action 0]\n0,0,0,0,1', nextWarnings);
  assert.deepEqual(nextWarnings, []);
});

test('CMD defaults/remaps and duplicate commands are data, not executed expressions', () => {
  const commands = parseCmd('[Remap]\nx=y\n[Defaults]\ncommand.time=25\ncommand.buffer.time=3\n[Command]\nname="dash"\ncommand=~30$D, DF, F, x+y\n[Command]\nname="dash"\ncommand=/F\ntime=8\nbuffer.time=2', 'a.cmd');
  assert.equal(commands.length, 2); assert.equal(commands[0].time, '25'); assert.equal(commands[0].bufferTime, '3'); assert.deepEqual(commands[0].steps, ['~30$D', 'DF', 'F', 'x+y']);
  assert.equal(commands[0].remap.x, 'y'); assert.equal(commands[1].time, '8'); assert.equal(commands[1].bufferTime, '2'); assert.equal(commands[1].source, 'a.cmd');
});

test('CNS/ST metadata preserves controller order, repeats, state association, constants and raw expressions', () => {
  const text = '[Movement]\nyaccel=.44\n[Statedef -1]\ntype=S\n[State 999, test]\ntype=ChangeState\ntrigger1=time=0\ntrigger1=command="a"\nvalue=ifelse(var(0),200,300)\n[State -1, x]\ntype=VelSet\nx=2\n[Statedef 200]\nanim=200';
  const { states, constants } = parseStates(text, 'logic.st');
  assert.equal(constants.movement.yaccel, '.44'); assert.deepEqual(states.map(s => s.id), [-1, 200]);
  assert.equal(states[0].controllers.length, 2); assert.equal(states[0].controllers[0].type, 'ChangeState');
  assert.equal(states[0].controllers[0].entries.filter(e => e.key === 'trigger1').length, 2);
  assert.match(states[0].controllers[0].raw, /ifelse\(var\(0\),200,300\)/);
  assert.equal(parseStates('[State 0, x]\ntype=Null').states[0].orphan, true);
});

test('CNS labeled Statedef headers retain numeric IDs and correct controller ownership', () => {
  const { states } = parseStates('[Statedef 191,intro 1]\ntype=S\n[State 191, anim]\ntype=ChangeAnim\nvalue=191\n[Statedef 220,Slash]\n[State 220, hit]\ntype=HitDef\n[Statedef -2,]\n[State -2]\ntype=VarSet\n[Statedef 1000,electric shot <stand><inicio>]\n[State 1000]\ntype=Helper', 'character.cns');
  assert.deepEqual(states.map(s => s.id), [191, 220, -2, 1000]);
  assert.deepEqual(states.map(s => s.controllers[0].type), ['ChangeAnim', 'HitDef', 'VarSet', 'Helper']);
  assert.equal(states[0].entries[0].value, 'S');
  assert.equal(states[1].controllers[0].source, 'character.cns');
  assert.equal(parseStates('[Statedef 200abc]').states.length, 0);
});

test('ACT ordering, PCX scanline padding/RLE and transparent palette index zero', () => {
  const act = Buffer.alloc(768); act.set([3, 4, 5], 765); act.set([8, 9, 10], 762);
  const pal = decodeAct(act); assert.deepEqual([...pal.subarray(0, 8)], [3, 4, 5, 0, 8, 9, 10, 255]); assert.throws(() => decodeAct(Buffer.alloc(2)), /ACT/);
  const image = decodePcx(pcx()); assert.deepEqual([image.width, image.height], [3, 1]); assert.deepEqual([...image.indices], [0, 1, 200]); assert.equal(image.rgba[3], 0); assert.equal(image.rgba[7], 255);
  const shared = decodePcx(pcx({ includePalette: false }), pal); assert.deepEqual([...shared.rgba.subarray(4, 8)], [8, 9, 10, 255]);
  assert.deepEqual([...decodePcx(pcx({ data: [1, 200, 0, 0], encoding: 0 })).indices], [1, 200, 0]);
  assert.throws(() => decodePcx(pcx({ includePalette: false })), /palette/);
  assert.throws(() => decodePcx(pcx({ data: [0xc5, 1] })), /exceeds/);
  assert.throws(() => decodePcx(pcx({ data: [0xc0] })), /Invalid PCX run/);
  assert.throws(() => decodePcx(pcx({ data: [1] })), /Truncated/);
});

test('SFF1 loads shared/private palettes, external ACT, linked pixels and separate axes', () => {
  const external = palette(); external.set([123, 45, 67, 255], 4);
  const buffer = sff1([{ data: pcx(), axisX: -7, axisY: 9 }, { data: pcx({ includePalette: false }), shared: true }, { link: 1, axisX: 20 }, { data: pcx() }]);
  const warnings = [], result = decodeSff(buffer, { palette: external, warnings });
  assert.equal(result.sprites.length, 4); assert.deepEqual(warnings, []); assert.equal(result.paletteCount, 2);
  assert.deepEqual([...result.sprites[1].rgba.subarray(4, 8)], [123, 45, 67, 255]); assert.deepEqual(result.sprites[2].rgba, result.sprites[1].rgba); assert.equal(result.sprites[2].axisX, 20);
  assert.equal(result.sprites[0].axisX, -7); assert.notDeepEqual(result.sprites[3].rgba, result.sprites[0].rgba);
});

test('RLE8 and RLE5 packets decode exact pixels and reject truncated/oversized runs', () => {
  assert.deepEqual([...decodeRle8(Buffer.from([0, 0x43, 7, 0xc4]), 5)], [0, 7, 7, 7, 196]);
  assert.deepEqual([...decodeRle5(Buffer.from([1, 0x82, 4, 0x21, 0x02]), 5)], [4, 4, 1, 1, 2]);
  assert.deepEqual([...decodeRle5(Buffer.from([2, 0]), 3)], [0, 0, 0]);
  assert.throws(() => decodeRle8(Buffer.from([0x40, 1]), 1), /run/); assert.throws(() => decodeRle8(Buffer.from([0x43, 1]), 2), /exceeds/);
  assert.throws(() => decodeRle5(Buffer.from([0, 128]), 1), /Truncated/);
});

test('LZ5 short/long RLE, overlapping backreferences and recycled fourth offset', () => {
  assert.deepEqual([...decodeLz5(Buffer.from([0, 0x61]), 3)], [1, 1, 1]);
  assert.deepEqual([...decodeLz5(Buffer.from([0, 2, 0]), 8)], Array(8).fill(2));
  assert.deepEqual([...decodeLz5(Buffer.from([2, 0x21, 2, 0]), 4)], [1, 1, 1, 1]);
  assert.deepEqual([...decodeLz5(Buffer.from([2, 0x21, 0, 0, 0]), 4)], [1, 1, 1, 1]);
  assert.deepEqual([...decodeLz5(Buffer.from([30, 0x21, 1, 0, 1, 0, 1, 0, 1]), 9)], Array(9).fill(1));
  // Four short packets contribute two high bits apiece: 0,0,0,1 -> recycled distance 2.
  const alternating = [0xfc, 0x21, 0x22, 1, 1, 1, 1, 1, 1, 0x41];
  assert.deepEqual([...decodeLz5(Buffer.from(alternating), 10)], [1, 2, 1, 2, 1, 2, 1, 2, 1, 2]);
  assert.deepEqual([...decodeLz5(Buffer.from([0, ...Array(8).fill(0x21), 0, 0x42]), 10)], [...Array(8).fill(1), 2, 2]);
  assert.deepEqual([...decodeLz5(Buffer.from([2, 1, 249, 0x40, 0, 0]), 260)], Array(260).fill(1));
  assert.throws(() => decodeLz5(Buffer.from([1, 1, 0]), 2), /back-reference/);
  assert.throws(() => decodeLz5(Buffer.from([0]), 2), /Truncated/);
  assert.throws(() => decodeLz5(Buffer.from([0, 0xe1]), 2), /exceeds/);
});

test('PNG encoding is lossless and decoder handles all five PNG scanline filters', () => {
  const rgba = Buffer.from([0, 0, 0, 0, 1, 200, 3, 128, 255, 4, 6, 255, 5, 6, 7, 0]);
  assert.deepEqual(decodePng(encodePng(2, 2, rgba)).rgba, rgba);
  // Grayscale rows: [10,20,30], [15,25,35], [20,30,40], [25,35,45], [30,40,50].
  const raw = [0, 10, 20, 30, 1, 15, 10, 10, 2, 5, 5, 5, 3, 15, 8, 8, 4, 5, 5, 5];
  const decoded = decodePng(png({ width: 3, height: 5, type: 0, raw }));
  assert.deepEqual([...decoded.rgba].filter((_, i) => i % 4 === 0), [10, 20, 30, 15, 25, 35, 20, 30, 40, 25, 35, 45, 30, 40, 50]);
  assert.deepEqual([...decodePng(png({ width: 3, depth: 1, raw: [0, 0b01000000] })).indices], [0, 1, 0]);
  const broken = encodePng(2, 2, rgba); broken[20] ^= 1; assert.throws(() => decodePng(broken), /CRC/);
  assert.throws(() => decodePng(png({ width: 1, raw: [0, 0], interlace: 1 })), /Unsupported PNG/);
  assert.throws(() => decodePng(png({ width: 1, raw: [5, 0] })), /filter/);
});

test('SFF2 palette links, sprite links with repalette, translated block and raw RGB/RGBA', () => {
  const alternative = palette(); alternative.set([90, 80, 70, 123], 4);
  const warnings = [];
  const result = decodeSff(sff2([
    { data: Buffer.from([0, 1, 2]), flags: 1, axisX: -5 },
    { link: 0, paletteIndex: 1, axisY: -9 },
    { link: 1, paletteIndex: 2 },
    { data: Buffer.from([1, 2, 3]), width: 1, depth: 24 },
    { data: Buffer.from([4, 5, 6, 7]), width: 1, depth: 32 }
  ], [{ data: palette() }, { data: alternative }, { link: 1 }]), { warnings });
  assert.deepEqual(warnings, []); assert.equal(result.sprites.length, 5); assert.equal(result.sprites[0].axisX, -5); assert.equal(result.sprites[1].axisY, -9);
  assert.deepEqual([...result.sprites[1].rgba.subarray(4, 8)], [90, 80, 70, 123]); assert.deepEqual(result.sprites[1].rgba, result.sprites[2].rgba);
  assert.deepEqual([...result.sprites[3].rgba], [1, 2, 3, 255]); assert.deepEqual([...result.sprites[4].rgba], [4, 5, 6, 7]);
  const v20 = decodeSff(sff2([{ data: Buffer.from([0, 1, 2]) }], [{ data: Buffer.alloc(1024) }], 0)); assert.equal(v20.sprites[0].rgba[7], 255);
});

test('SFF2 decodes all implemented compression formats including indexed and truecolor PNG', () => {
  const rgba = Buffer.from([10, 20, 30, 40]);
  const result = decodeSff(sff2([
    { format: 2, data: payload(3, [0x43, 1]) },
    { format: 3, depth: 5, data: payload(3, [2, 128, 1]) },
    { format: 4, depth: 5, data: payload(3, [0, 0x61]) },
    { format: 10, data: payload(3, png({ width: 3, raw: [0, 0, 1, 0] })) },
    { format: 11, depth: 24, width: 1, data: payload(3, png({ width: 1, type: 2, raw: [0, 9, 8, 7] })) },
    { format: 12, depth: 32, width: 1, data: payload(4, encodePng(1, 1, rgba)) }
  ]));
  assert.equal(result.sprites.length, 6); assert.deepEqual(result.sprites[0].rgba, result.sprites[1].rgba); assert.deepEqual(result.sprites[1].rgba, result.sprites[2].rgba);
  assert.deepEqual([...result.sprites[3].rgba.subarray(4, 8)], [...palette().subarray(4, 8)]);
  assert.deepEqual([...result.sprites[4].rgba], [9, 8, 7, 255]); assert.deepEqual(result.sprites[5].rgba, rgba);
});

test('SFF corrupt links, palettes, unsupported compression and truncation fail transparently', () => {
  const warnings = [];
  const result = decodeSff(sff2([{ link: 1 }, { link: 0 }, { format: 99, data: Buffer.from([0]) }, { data: Buffer.from([1, 2, 3]), paletteIndex: 9 }]), { warnings });
  assert.equal(result.sprites.length, 0); assert.equal(warnings.length, 4); assert.ok(warnings.some(w => w.includes('cyclic'))); assert.ok(warnings.some(w => w.includes('format 99')));
  const paletteWarnings = []; decodeSff(sff2([{ data: Buffer.from([1, 2, 3]) }], [{ link: 0 }]), { warnings: paletteWarnings }); assert.match(paletteWarnings[0], /cyclic.*palette/);
  assert.throws(() => decodeSff(Buffer.alloc(31)), /Truncated/);
  const truncated = sff2([{ data: Buffer.from([1, 2, 3]) }]); assert.throws(() => decodeSff(truncated.subarray(0, -1)), /Truncated/);
  const cycle = sff1([{ link: 0 }]); const cyclicWarnings = []; assert.equal(decodeSff(cycle, { warnings: cyclicWarnings }).sprites.length, 0); assert.match(cyclicWarnings[0], /cyclic/);
  const badChain = sff1([{ data: pcx() }, { data: pcx() }]); badChain.writeUInt32LE(512, 512); assert.throws(() => decodeSff(badChain), /cyclic/);
});

test('Importer indexes only successful characters and warns about absent images/dependencies', async t => {
  const dir = await fixture(t), input = path.join(dir, 'chars'), output = path.join(dir, 'generated');
  await fs.mkdir(path.join(input, 'Good'), { recursive: true }); await fs.mkdir(path.join(input, 'Bad'));
  await fs.writeFile(path.join(input, 'Good', 'good.def'), '[Info]\nname="Good"\n[Files]\nsprite=s.sff\nanim=a.air\nstcommon=missing.cns');
  await fs.writeFile(path.join(input, 'Good', 's.sff'), sff1([{ data: pcx() }]));
  await fs.writeFile(path.join(input, 'Good', 'a.air'), '[Begin Action 0]\n0,0,0,0,1\n5,3,0,0,1\n-1,0,0,0,-1');
  await fs.writeFile(path.join(input, 'Bad', 'bad.def'), '[Info]\nname="Bad"\n[Files]\nsprite=absent.sff\nanim=absent.air');
  const result = await importCharacters({ input, output }); assert.deepEqual(result.characters.map(c => c.id), ['good']); assert.equal(result.failures.length, 1);
  const character = JSON.parse(await fs.readFile(path.join(output, 'good', 'character.json')));
  assert.equal(character.report.counts.missingSprites, 1); assert.ok(character.report.warnings.some(w => w.includes('missing.cns'))); assert.ok(character.report.warnings.some(w => w.includes('5,3')));
  assert.equal(character.report.combatSupported, false); assert.equal(character.sprites['0,0'].url, 'sprites/0_0.png');
  await assert.rejects(importCharacters({ input, output: path.join(input, 'generated') }), /overlap/);
  await fs.symlink(input, path.join(dir, 'linked-output'), 'junction'); await assert.rejects(importCharacters({ input, output: path.join(dir, 'linked-output') }), /Unsafe/);
  await assert.rejects(importCharacter(path.join(input, 'Good'), output, '../escape'), /Unsafe/);
  const original = path.join(input, 'Good', 'good.def'), outputSprite = path.join(output, 'good', 'sprites', '0_0.png');
  const originalBytes = await fs.readFile(original);
  await fs.rm(outputSprite); await fs.link(original, outputSprite);
  const blocked = await importCharacters({ input, output });
  assert.equal(blocked.characters.length, 0); assert.ok(blocked.failures.some(f => /Unsafe output file/.test(f.error)));
  assert.deepEqual(await fs.readFile(original), originalBytes);
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(output, 'characters.json'))).characters, []);
});

test('sprite lookup wraps AIR IDs to unsigned 16-bit values but preserves blank sentinels and source IDs', async t => {
  const directory = await fixture(t);
  const source = path.join(directory, 'wrapped');
  await fs.mkdir(source);
  await fs.writeFile(path.join(source, 'wrapped.def'), '[Info]\nname=Wrapped IDs\n[Files]\nsprite=hero.sff\nanim=hero.air');
  const ids = [[-30872, -2], [34664, 65534], [100200, 131070], [-65536, 65536], [-1, 0], [0, -1], [65535, 65535], [-30871, -2], [34665, 65534]];
  await fs.writeFile(path.join(source, 'hero.air'), '[Begin Action 0]\n' + ids.map(([g, i]) => `${g},${i},0,0,1`).join('\n'));
  const records = [{ group: 34664, index: 65534 }, { group: 0, index: 0 }, { group: 65535, index: 65535 }];
  for (const version of [1, 2]) {
    const sff = version === 1 ? sff1(records.map(record => ({ ...record, data: pcx() })))
      : sff2(records.map(record => ({ ...record, data: Buffer.from([0, 1, 2]) })));
    await fs.writeFile(path.join(source, 'hero.sff'), sff);
    const character = await importCharacter(source, path.join(directory, 'out'), `wrapped-${version}`);
    assert.deepEqual(character.animations[0].frames.map(frame => [frame.group, frame.index]), ids);
    assert.deepEqual(character.animations[0].frames.map(frame => frame.spriteKey),
      ['34664,65534', '34664,65534', '34664,65534', '0,0', null, null, '65535,65535', '34665,65534', '34665,65534']);
    assert.equal(character.report.counts.missingSprites, 1);
    assert.deepEqual(character.report.warnings.filter(w => w.startsWith('Animation references missing sprite')),
      ['Animation references missing sprite 34665,65534']);
    const saved = JSON.parse(await fs.readFile(path.join(directory, 'out', `wrapped-${version}`, 'character.json')));
    assert.deepEqual(saved.animations, character.animations);
  }
});

async function snapshot(directory) {
  const result = {};
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (entry.isFile()) result[path.relative(directory, file)] = createHash('sha256').update(await fs.readFile(file)).digest('hex');
    }
  }
  await walk(directory); return result;
}

test('Real Pikachu and Tyrone import every SFF image and preserve originals', async t => {
  const directory = await fixture(t), input = path.join(root, 'chars');
  const folders = { pikachu: 'Pikachu', tyrone: 'Tyrone' };
  const originals = async () => Promise.all(Object.values(folders).map(folder => snapshot(path.join(input, folder))));
  const before = await originals();
  const expected = { pikachu: { sprites: 544, animations: 158, frames: 1138, commands: 33, states: 93 }, tyrone: { sprites: 511, animations: 203, frames: 1107, commands: 55, states: 145 } };
  for (const id of Object.keys(expected)) {
    await importCharacter(path.join(input, folders[id]), path.join(directory, 'generated'), id);
    const entry = { id };
    const file = path.join(directory, 'generated', id, 'character.json');
    const character = JSON.parse(await fs.readFile(file));
    assert.equal(character.id, entry.id); assert.deepEqual(character.localcoord, [320, 240]);
    for (const [name, count] of Object.entries(expected[entry.id])) assert.equal(character.report.counts[name], count, `${entry.id} ${name}`);
    assert.equal(character.report.counts.sprites, character.report.counts.sourceSprites);
    assert.deepEqual(character.report.unsupportedControllers, character.report.controllerTypes);
    assert.equal(character.report.combatSupported, false); assert.ok(character.report.counts.controllers > 500);
    assert.equal(character.report.warnings.filter(w => w.startsWith('Animation references missing sprite ')).length, character.report.counts.missingSprites);
    assert.equal(character.report.warnings.filter(w => w.includes('Frame blending/scale/rotation')).length, 1);
    assert.ok(character.report.warnings.filter(w => w.startsWith('AIR:')).every(w => /occurrences?; sample lines:/.test(w)));
    for (const sprite of Object.values(character.sprites)) {
      const decoded = decodePng(await fs.readFile(path.join(path.dirname(file), ...sprite.url.split('/'))));
      assert.equal(decoded.width, sprite.width); assert.equal(decoded.height, sprite.height);
    }
    if (entry.id === 'tyrone') {
      assert.deepEqual(character.report.spriteFormats.sort((a, b) => a - b), [4, 10, 11, 12]);
      assert.equal(character.report.counts.missingSprites, 0); assert.ok(character.report.warnings.some(w => w.includes('stcommon') && w.includes('common1.cns')));
    } else {
      assert.equal(character.report.counts.missingSprites, 96); assert.ok(character.report.warnings.some(w => w.includes('193,7')));
      const wrapped = character.animations.flatMap(animation => animation.frames).filter(frame => frame.group === -30872);
      assert.equal(new Set(wrapped.map(frame => frame.spriteKey)).size, 225);
      assert.ok(wrapped.every(frame => character.sprites[frame.spriteKey]));
      for (const id of [1001, 34688]) {
        assert.equal(character.animations.filter(a => a.id === id).length, 2);
        assert.equal(character.report.warnings.filter(w => w.endsWith(`Duplicate action ${id}`)).length, 1);
      }
    }
  }
  assert.deepEqual(await originals(), before, 'Original files must remain byte-identical');
});
