#!/usr/bin/env node
/** Offline, data-only MUGEN importer. Usage: node tools\mugen-import.mjs [--input chars] [--output generated]
 * No character expressions are evaluated. CNS/CMD controllers are archival metadata, not combat support.
 * Supported images: SFF1 8-bit PCX; SFF2 raw indexed/RGB/RGBA, RLE8/RLE5/LZ5 and noninterlaced PNG.
 * Indexed images use palette entry zero as transparent. External ACT selects the first SFF1 palette;
 * SFF2 uses its embedded sprite palettes. Unsupported/corrupt sprites are omitted with warnings.
 * Repeated unsupported AIR features are summarized with counts and up to five sample lines;
 * malformed data, missing sprites and missing dependencies retain individual diagnostics.
 */
/*
 * SFF/RLE/LZ5 interoperability reference consulted during implementation:
 * https://github.com/ikemen-engine/Ikemen-GO/blob/master/src/image.go
 * Upstream attribution and license retained for reference-derived decoding logic:
 * https://github.com/ikemen-engine/Ikemen-GO/blob/master/LICENCE.txt
 *
 * MIT License
 *
 * Copyright (c) 2016 Suehiro
 * Copyright (c) 2018 K4thos, NeatUnsou, ShinLucho
 * Copyright (c) 2019 Daniel Porto, Gacel, Nikolay Griva
 * Copyright (c) 2020 Wintermourn
 * Copyright (c) 2021 Amavect, BwdYeti, Eiton, Super, two4teezee
 * Copyright (c) 2022 fantasma, GaryCXJk, PotS, Sam Hocevar, Wreq!
 * Copyright (c) 2023 Foobs, RollinJay, Wftk, wily-coyote
 * Copyright (c) 2024 Jesuszilla, Kasasagi, Orange-Dolphin, Rakíel
 * Copyright (c) 2025 Alceris, Kase, Leon Kasovan
 * Copyright (c) 2026 Kokorz
 * Copyright (c) 2016-2026 Ikemen GO contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync, inflateSync } from 'node:zlib';

const MAX_PIXELS = 16 * 1024 * 1024;
const MAX_RECORDS = 100000;
const fail = message => { throw new Error(message); };
function slice(buffer, offset, length) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset < 0 || length < 0 || offset + length > buffer.length) fail(`Truncated data at ${offset} (${length} bytes)`);
  return buffer.subarray(offset, offset + length);
}
function pixels(width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0 || width * height > MAX_PIXELS) fail(`Invalid image dimensions ${width}x${height}`);
  return width * height;
}
function unquote(value = '') {
  const s = value.trim();
  return s.startsWith('"') && s.endsWith('"') ? s.slice(1, -1) : s;
}
export function stripComment(line) {
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') quoted = !quoted;
    if (!quoted && line[i] === ';') return line.slice(0, i).trim();
  }
  return line.trim();
}
export function parseIni(text) {
  const sections = [];
  let current;
  text.replace(/^\uFEFF/, '').split(/\r?\n/).forEach((raw, index) => {
    const line = stripComment(raw);
    const header = line.match(/^\[([^\]]+)\]\s*$/);
    if (header) {
      current = { name: header[1].trim(), line: index + 1, entries: [], raw: [] };
      sections.push(current);
    } else if (current) {
      current.raw.push(raw);
      const assignment = line.match(/^([^=]+)=(.*)$/);
      if (assignment) current.entries.push({ key: assignment[1].trim().toLowerCase(), value: assignment[2].trim(), line: index + 1 });
    }
  });
  return sections;
}
function values(section) {
  return Object.fromEntries((section?.entries ?? []).map(({ key, value }) => [key, value]));
}
export function parseDef(text) {
  const sections = parseIni(text);
  const info = values(sections.find(s => /^info$/i.test(s.name)));
  const files = values(sections.find(s => /^files$/i.test(s.name)));
  let localcoord = (info.localcoord ?? '320,240').split(',').map(Number);
  if (localcoord.length !== 2 || localcoord.some(n => !Number.isFinite(n) || n <= 0)) fail('Invalid DEF localcoord');
  return { name: unquote(info.displayname || info.name), sourceVersion: unquote(info.mugenversion || 'unknown'), localcoord, info, files };
}
function isWithin(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}
/** Resolve case-insensitive MUGEN references, but never escape the character, including via symlinks. */
export async function resolveCharacterFile(root, reference) {
  const name = unquote(reference).replaceAll('\\', '/');
  if (!name || name.includes('\0') || /[:]/.test(name) || name.startsWith('/')) fail(`Unsafe character path: ${reference}`);
  const parts = name.split('/').filter(p => p !== '' && p !== '.');
  if (parts.some(p => p === '..')) fail(`Unsafe character path: ${reference}`);
  root = await fs.realpath(root);
  let current = root;
  for (const part of parts) {
    const names = await fs.readdir(current);
    const matches = names.filter(n => n.toLowerCase() === part.toLowerCase());
    const actual = names.includes(part) ? part : matches.length === 1 ? matches[0] : null;
    if (!actual) fail(`Missing or ambiguous character dependency: ${reference}`);
    current = await fs.realpath(path.join(current, actual));
    if (!isWithin(root, current)) fail(`Character path escapes directory: ${reference}`);
  }
  if (!(await fs.stat(current)).isFile()) fail(`Not a character file: ${reference}`);
  return current;
}

export function parseAir(text, warnings = []) {
  const animations = [], features = new Map();
  let action, defaults, pending, declaration;
  const warn = (line, message) => warnings.push(`AIR line ${line}: ${message}`);
  const unsupported = (line, message, example) => {
    const key = message.toLowerCase().replace(/\s+/g, ' ');
    let feature = features.get(key);
    if (!feature) {
      feature = { message, count: 0, lines: [], examples: new Set() };
      features.set(key, feature);
    }
    feature.count++;
    if (feature.lines.length < 5) feature.lines.push(line);
    if (example && feature.examples.size < 3) feature.examples.add(example);
  };
  const finishBoxes = () => {
    if (declaration && declaration.boxes.length !== declaration.count) warn(declaration.line, `Expected ${declaration.count} collision boxes, found ${declaration.boxes.length}`);
    declaration = null;
  };
  for (const [offset, raw] of text.split(/\r?\n/).entries()) {
    const lineNo = offset + 1, line = stripComment(raw);
    if (!line) continue;
    let match;
    if ((match = line.match(/^\[Begin\s+Action\s+(-?\d+)\]\s*$/i))) {
      finishBoxes();
      action = { id: Number(match[1]), loopStart: 0, frames: [] };
      if (animations.some(a => a.id === action.id)) warn(lineNo, `Duplicate action ${action.id}`);
      animations.push(action);
      defaults = { 1: [], 2: [] }; pending = {};
    } else if (!action) {
      warn(lineNo, `Ignored content outside an action: ${line}`);
    } else if (/^loopstart\s*:?$/i.test(line)) {
      finishBoxes(); action.loopStart = action.frames.length;
    } else if ((match = line.match(/^clsn([12])(default)?\s*:\s*(\d+)\s*$/i))) {
      finishBoxes();
      const kind = match[1], boxes = [];
      (match[2] ? defaults : pending)[kind] = boxes;
      declaration = { kind, boxes, count: Number(match[3]), line: lineNo, indices: new Set() };
    } else if ((match = line.match(/^clsn([12])\s*\[\s*(\d+)\s*\]\s*=\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*$/i))) {
      if (!declaration || declaration.kind !== match[1]) { warn(lineNo, 'Collision box without matching declaration'); continue; }
      const boxIndex = Number(match[2]);
      if (boxIndex >= declaration.count || declaration.indices.has(boxIndex)) warn(lineNo, `Noncanonical collision index ${boxIndex}; preserving declared box order`);
      declaration.indices.add(boxIndex);
      declaration.boxes.push(match.slice(3).map(Number));
    } else if (/^-?\d+\s*,/.test(line)) {
      finishBoxes();
      const fields = line.split(',').map(s => s.trim());
      if (fields.length < 5 || fields.slice(0, 5).some(s => !/^-?\d+$/.test(s)) || Number(fields[4]) < -1) {
        warn(lineNo, `Invalid animation frame: ${line}`); continue;
      }
      const [group, index, x, y, duration] = fields.slice(0, 5).map(Number);
      const flip = (fields[5] || '').toUpperCase();
      if (!/^(H|V|HV|VH)?$/.test(flip)) unsupported(lineNo, 'Unsupported flip', flip);
      const frame = { group, index, x, y, duration, flipH: flip.includes('H'), flipV: flip.includes('V'),
        attackBoxes: (pending[1] ?? defaults[1]).map(b => [...b]), hurtBoxes: (pending[2] ?? defaults[2]).map(b => [...b]) };
      if (fields.slice(6).some(Boolean)) {
        frame.extra = fields.slice(6);
        unsupported(lineNo, 'Frame blending/scale/rotation retained but not implemented', frame.extra.join(','));
      }
      action.frames.push(frame); pending = {};
    } else {
      unsupported(lineNo, `Unsupported animation directive: ${line}`);
    }
  }
  finishBoxes();
  for (const a of animations) if (a.loopStart >= a.frames.length && a.frames.length) {
    warnings.push(`AIR action ${a.id}: LoopStart has no following frame; reset to zero`); a.loopStart = 0;
  }
  for (const feature of features.values()) {
    const examples = feature.examples.size ? `; sample values: ${[...feature.examples].join(' | ')}` : '';
    warnings.push(`AIR: ${feature.message} (${feature.count} occurrence${feature.count === 1 ? '' : 's'}; sample lines: ${feature.lines.join(', ')}${examples})`);
  }
  return animations;
}

export function parseCmd(text, source = '') {
  const sections = parseIni(text);
  const defaults = values(sections.find(s => /^defaults$/i.test(s.name)));
  const remap = values(sections.find(s => /^remap$/i.test(s.name)));
  return sections.filter(s => /^command$/i.test(s.name)).map(s => {
    const v = values(s);
    return { name: unquote(v.name), command: v.command ?? '', steps: (v.command ?? '').split(',').map(x => x.trim()).filter(Boolean),
      time: v.time ?? defaults['command.time'] ?? '15', bufferTime: v['buffer.time'] ?? defaults['command.buffer.time'] ?? '1',
      remap, source, line: s.line, entries: s.entries, raw: s.raw.join('\n') };
  });
}
export function parseStates(text, source = '') {
  const states = [], constants = {};
  let state;
  for (const section of parseIni(text)) {
    const definition = section.name.match(/^statedef\s+(-?\d+)(?:\s*,.*)?$/i);
    if (definition) {
      state = { id: Number(definition[1]), source, line: section.line, entries: section.entries, raw: section.raw.join('\n'), controllers: [] };
      states.push(state);
    } else if (/^state\s+/i.test(section.name)) {
      if (!state) { state = { id: null, source, entries: [], raw: '', controllers: [], orphan: true }; states.push(state); }
      state.controllers.push({ label: section.name, type: unquote(values(section).type || 'unknown'), source, line: section.line, entries: section.entries, raw: section.raw.join('\n') });
    } else if (/^(data|size|velocity|movement)$/i.test(section.name)) {
      constants[section.name.toLowerCase()] = values(section);
    }
  }
  return { states, constants };
}

export function decodeAct(buffer) {
  if (buffer.length !== 768 && buffer.length !== 772) fail(`Invalid ACT palette size: ${buffer.length}`);
  const palette = Buffer.alloc(1024);
  for (let i = 0; i < 256; i++) {
    buffer.copy(palette, i * 4, (255 - i) * 3, (256 - i) * 3);
    palette[i * 4 + 3] = i ? 255 : 0;
  }
  return palette;
}
function rgbaFromIndices(indices, palette) {
  if (!palette || palette.length % 4) fail('Missing/invalid palette');
  const rgba = Buffer.alloc(indices.length * 4);
  for (let i = 0; i < indices.length; i++) {
    const color = indices[i];
    if (color * 4 + 4 > palette.length) fail(`Palette index ${color} is out of range`);
    palette.copy(rgba, i * 4, color * 4, color * 4 + 4);
    if (color === 0) rgba[i * 4 + 3] = 0;
  }
  return rgba;
}
export function decodePcx(buffer, inheritedPalette) {
  slice(buffer, 0, 128);
  if (buffer[0] !== 10 || buffer[3] !== 8 || buffer[65] !== 1 || ![0, 1].includes(buffer[2])) fail('Unsupported PCX: expected one 8-bit plane, raw or RLE');
  const width = buffer.readUInt16LE(8) - buffer.readUInt16LE(4) + 1;
  const height = buffer.readUInt16LE(10) - buffer.readUInt16LE(6) + 1;
  const count = pixels(width, height), stride = buffer.readUInt16LE(66);
  if (stride < width || stride * height > MAX_PIXELS * 2) fail('Invalid PCX scanline size');
  let palette = inheritedPalette, end = buffer.length;
  if (buffer.length >= 897 && buffer[buffer.length - 769] === 12) {
    end -= 769;
    if (!palette) {
      palette = Buffer.alloc(1024);
      for (let i = 0; i < 256; i++) { buffer.copy(palette, i * 4, end + 1 + i * 3, end + 4 + i * 3); palette[i * 4 + 3] = i ? 255 : 0; }
    }
  }
  if (!palette) fail('PCX palette missing');
  const indices = Buffer.alloc(count);
  let offset = 128, position = 0;
  while (position < stride * height) {
    if (offset >= end) fail('Truncated PCX pixel data');
    let value = buffer[offset++], run = 1;
    if (buffer[2] === 1 && (value & 0xc0) === 0xc0) {
      run = value & 63;
      if (!run || offset >= end) fail('Invalid PCX run');
      value = buffer[offset++];
    }
    if (position + run > stride * height) fail('PCX run exceeds image');
    for (let i = 0; i < run; i++, position++) if (position % stride < width) indices[Math.floor(position / stride) * width + position % stride] = value;
  }
  return { width, height, indices, palette, rgba: rgbaFromIndices(indices, palette) };
}

function decoder(buffer, size) {
  if (!Number.isInteger(size) || size < 0 || size > MAX_PIXELS) fail('Invalid decoded size');
  const out = Buffer.alloc(size);
  let input = 0, output = 0;
  return {
    out,
    get done() { return output === size; },
    byte() { if (input >= buffer.length) fail('Truncated compressed sprite'); return buffer[input++]; },
    run(value, length) { if (length < 1 || output + length > size) fail('Compressed run exceeds image'); out.fill(value, output, output + length); output += length; },
    copy(distance, length) {
      if (distance < 1 || distance > output || output + length > size) fail('Invalid compressed back-reference');
      for (let i = 0; i < length; i++, output++) out[output] = out[output - distance];
    }
  };
}
export function decodeRle8(buffer, size) {
  const d = decoder(buffer, size);
  while (!d.done) { const token = d.byte(); if ((token & 0xc0) === 0x40) d.run(d.byte(), token & 63); else d.run(token, 1); }
  return d.out;
}
export function decodeRle5(buffer, size) {
  const d = decoder(buffer, size);
  while (!d.done) {
    const length = d.byte() + 1, header = d.byte();
    d.run(header & 128 ? d.byte() : 0, length);
    for (let i = 0; i < (header & 127); i++) { const packet = d.byte(); d.run(packet & 31, (packet >>> 5) + 1); }
  }
  return d.out;
}
export function decodeLz5(buffer, size) {
  const d = decoder(buffer, size);
  let recycled = 0, shortPackets = 0;
  while (!d.done) {
    const control = d.byte();
    for (let bit = 0; bit < 8 && !d.done; bit++) {
      const packet = d.byte();
      if (!(control & (1 << bit))) {
        d.run(packet & 31, packet >>> 5 || d.byte() + 8);
      } else if ((packet & 63) === 0) {
        const distance = (packet << 2) + d.byte() + 1;
        d.copy(distance, d.byte() + 3);
      } else {
        recycled |= (packet & 192) >>> (shortPackets * 2);
        shortPackets++;
        const distance = shortPackets === 4 ? recycled + 1 : d.byte() + 1;
        d.copy(distance, (packet & 63) + 1);
        if (shortPackets === 4) { shortPackets = 0; recycled = 0; }
      }
    }
  }
  return d.out;
}

const CRC_TABLE = Uint32Array.from({ length: 256 }, (_, n) => {
  for (let bit = 0; bit < 8; bit++) n = (n >>> 1) ^ (n & 1 ? 0xedb88320 : 0);
  return n >>> 0;
});
export function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ byte) & 255];
  return (crc ^ 0xffffffff) >>> 0;
}
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
function pngChunk(type, data) {
  const chunk = Buffer.alloc(data.length + 12);
  chunk.writeUInt32BE(data.length); chunk.write(type, 4, 4, 'ascii'); data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(chunk.subarray(4, -4)), chunk.length - 4);
  return chunk;
}
export function encodePng(width, height, rgba) {
  if (rgba.length !== pixels(width, height) * 4) fail('RGBA size does not match dimensions');
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6;
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) rgba.copy(scanlines, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  return Buffer.concat([PNG_SIGNATURE, pngChunk('IHDR', header), pngChunk('IDAT', deflateSync(scanlines)), pngChunk('IEND', Buffer.alloc(0))]);
}
function paeth(a, b, c) {
  const p = a + b - c, da = Math.abs(p - a), db = Math.abs(p - b), dc = Math.abs(p - c);
  return da <= db && da <= dc ? a : db <= dc ? b : c;
}
export function decodePng(buffer) {
  if (!slice(buffer, 0, 8).equals(PNG_SIGNATURE)) fail('Invalid PNG signature');
  let offset = 8, header, palette, transparency, ended = false;
  const compressed = [];
  while (offset < buffer.length) {
    const length = slice(buffer, offset, 8).readUInt32BE(0), type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = slice(buffer, offset + 8, length);
    const checksum = slice(buffer, offset + 8 + length, 4).readUInt32BE();
    if (crc32(buffer.subarray(offset + 4, offset + 8 + length)) !== checksum) fail(`Invalid PNG ${type} CRC`);
    if (!header && type !== 'IHDR') fail('PNG IHDR must be first');
    if (type === 'IHDR') { if (header || length !== 13) fail('Invalid PNG IHDR'); header = data; }
    else if (type === 'PLTE') palette = data;
    else if (type === 'tRNS') transparency = data;
    else if (type === 'IDAT') compressed.push(data);
    else if (type === 'IEND') { ended = true; break; }
    else if (!(type.charCodeAt(0) & 32)) fail(`Unsupported critical PNG chunk ${type}`);
    offset += length + 12;
  }
  if (!header || !ended || !compressed.length) fail('Incomplete PNG');
  const width = header.readUInt32BE(), height = header.readUInt32BE(4), count = pixels(width, height);
  const depth = header[8], type = header[9], channels = ({ 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 })[type];
  if (!channels || header[10] || header[11] || header[12] || !(depth === 8 || ((type === 0 || type === 3) && [1, 2, 4].includes(depth)))) fail(`Unsupported PNG mode: type=${type}, depth=${depth}, interlace=${header[12]}`);
  const stride = Math.ceil(width * channels * depth / 8), bpp = Math.max(1, Math.ceil(channels * depth / 8));
  const raw = inflateSync(Buffer.concat(compressed), { maxOutputLength: (stride + 1) * height });
  if (raw.length !== (stride + 1) * height) fail('Incorrect PNG decompressed size');
  const scan = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    if (filter > 4) fail(`Invalid PNG filter ${filter}`);
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? scan[y * stride + x - bpp] : 0, b = y ? scan[(y - 1) * stride + x] : 0, c = y && x >= bpp ? scan[(y - 1) * stride + x - bpp] : 0;
      const predictors = [0, a, b, Math.floor((a + b) / 2), paeth(a, b, c)];
      scan[y * stride + x] = (raw[y * (stride + 1) + x + 1] + predictors[filter]) & 255;
    }
  }
  const rgba = Buffer.alloc(count * 4), indices = type === 3 ? Buffer.alloc(count) : undefined;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = y * width + x, p = y * stride + x * channels;
    const sample = depth === 8 ? scan[p] : (scan[y * stride + Math.floor(x * depth / 8)] >>> (8 - depth - x * depth % 8)) & ((1 << depth) - 1);
    let r, g, b, a = 255;
    if (type === 3) {
      indices[i] = sample;
      if (!palette || sample * 3 + 3 > palette.length) fail('Missing PNG palette entry');
      [r, g, b] = palette.subarray(sample * 3, sample * 3 + 3); a = transparency?.[sample] ?? 255;
    } else if (type === 0 || type === 4) {
      r = g = b = Math.round(sample * 255 / ((1 << depth) - 1));
      if (type === 4) a = scan[p + 1];
      else if (transparency && sample === slice(transparency, 0, 2).readUInt16BE()) a = 0;
    } else {
      [r, g, b] = scan.subarray(p, p + 3);
      if (type === 6) a = scan[p + 3];
      else if (transparency && r === slice(transparency, 0, 2).readUInt16BE() && g === slice(transparency, 2, 2).readUInt16BE() && b === slice(transparency, 4, 2).readUInt16BE()) a = 0;
    }
    rgba.set([r, g, b, a], i * 4);
  }
  return { width, height, rgba, indices };
}

export function decodeSff(buffer, { palette: externalPalette, warnings = [] } = {}) {
  slice(buffer, 0, 32);
  if (buffer.toString('ascii', 0, 12) !== 'ElecbyteSpr\0') fail('Invalid SFF signature');
  const version = `${buffer[15]}.${buffer[14]}.${buffer[13]}.${buffer[12]}`;
  const records = [], decoded = new Map(), active = new Set();
  let paletteCount = 0;
  if (buffer[15] === 1) {
    const count = buffer.readUInt32LE(20), headerSize = buffer.readUInt32LE(28);
    if (count > MAX_RECORDS || headerSize < 32) fail('Invalid SFF1 table');
    let offset = buffer.readUInt32LE(24), lastPalette;
    const visited = new Set();
    for (let i = 0; i < count; i++) {
      if (!offset || visited.has(offset)) fail('Invalid/cyclic SFF1 subheader chain');
      visited.add(offset);
      const h = slice(buffer, offset, headerSize), size = h.readUInt32LE(4);
      const record = { group: h.readUInt16LE(12), index: h.readUInt16LE(14), axisX: h.readInt16LE(8), axisY: h.readInt16LE(10), link: h.readUInt16LE(16), size, format: 'PCX' };
      try {
        if (size) {
          const data = slice(buffer, offset + headerSize, size);
          const shared = h[18] !== 0;
          // SFF1 shares the previous non-linked palette. ACT replaces only the first palette chain.
          const image = decodePcx(data, shared ? lastPalette : i === 0 ? externalPalette : undefined);
          if (!shared) paletteCount++;
          lastPalette = image.palette; record.image = image;
        }
      } catch (error) { record.error = error.message; if (size) lastPalette = undefined; }
      records.push(record); offset = h.readUInt32LE();
    }
  } else if (buffer[15] === 2) {
    slice(buffer, 0, 68);
    const table = buffer.readUInt32LE(36), count = buffer.readUInt32LE(40), palTable = buffer.readUInt32LE(44);
    paletteCount = buffer.readUInt32LE(48);
    if (count > MAX_RECORDS || paletteCount > MAX_RECORDS) fail('SFF2 table is too large');
    slice(buffer, table, count * 28); slice(buffer, palTable, paletteCount * 16);
    const blocks = [[buffer.readUInt32LE(52), buffer.readUInt32LE(56)], [buffer.readUInt32LE(60), buffer.readUInt32LE(64)]];
    for (const [start, length] of blocks) slice(buffer, start, length);
    const paletteCache = new Map(), paletteActive = new Set();
    const loadPalette = index => {
      if (paletteCache.has(index)) return paletteCache.get(index);
      if (index >= paletteCount || paletteActive.has(index)) fail(`Invalid/cyclic SFF2 palette link ${index}`);
      paletteActive.add(index);
      try {
        const h = slice(buffer, palTable + index * 16, 16), length = h.readUInt32LE(12);
        let result;
        if (!length) result = loadPalette(h.readUInt16LE(6));
        else {
          const colors = h.readUInt16LE(4), offset = h.readUInt32LE(8);
          if (!colors || colors > 256 || length < colors * 4 || offset + length > blocks[0][1]) fail(`Invalid SFF2 palette ${index}`);
          result = Buffer.from(slice(buffer, blocks[0][0] + offset, colors * 4));
          // SFF 2.0 reserves the fourth palette byte; 2.1 stores alpha there.
          if (buffer[14] === 0 && buffer[13] === 0) for (let i = 0; i < colors; i++) result[i * 4 + 3] = 255;
          result[3] = 0;
        }
        paletteCache.set(index, result); return result;
      } finally { paletteActive.delete(index); }
    };
    for (let i = 0; i < count; i++) {
      const h = slice(buffer, table + i * 28, 28);
      records.push({ group: h.readUInt16LE(), index: h.readUInt16LE(2), width: h.readUInt16LE(4), height: h.readUInt16LE(6), axisX: h.readInt16LE(8), axisY: h.readInt16LE(10),
        link: h.readUInt16LE(12), format: h[14], depth: h[15], offset: h.readUInt32LE(16), size: h.readUInt32LE(20), paletteIndex: h.readUInt16LE(24), flags: h.readUInt16LE(26) });
    }
    for (const record of records) record.load = () => {
      const count = pixels(record.width, record.height), block = blocks[record.flags & 1];
      if (record.flags & ~1) fail(`Unsupported SFF2 flags ${record.flags}`);
      if (record.offset + record.size > block[1]) fail('SFF2 sprite exceeds data block');
      const data = slice(buffer, block[0] + record.offset, record.size);
      let indices, rgba;
      if ([10, 11, 12].includes(record.format)) {
        const png = decodePng(slice(data, 4, data.length - 4));
        if (png.width !== record.width || png.height !== record.height) fail('SFF2 PNG dimensions mismatch');
        if (record.format === 10) { if (!png.indices) fail('SFF2 format 10 requires indexed PNG'); indices = png.indices; }
        else rgba = png.rgba;
      } else if ([2, 3, 4].includes(record.format)) {
        if (slice(data, 0, 4).readUInt32LE() !== count) fail('SFF2 decoded size mismatch');
        indices = ({ 2: decodeRle8, 3: decodeRle5, 4: decodeLz5 })[record.format](data.subarray(4), count);
      } else if (record.format === 0) {
        if (record.depth === 8) { if (data.length !== count) fail('SFF2 raw indexed size mismatch'); indices = data; }
        else if ([24, 32].includes(record.depth)) {
          const channels = record.depth / 8;
          if (data.length !== count * channels) fail('SFF2 raw image size mismatch');
          rgba = Buffer.alloc(count * 4, 255);
          for (let p = 0; p < count; p++) data.copy(rgba, p * 4, p * channels, (p + 1) * channels);
        } else fail(`Unsupported SFF2 raw depth ${record.depth}`);
      } else fail(`Unsupported SFF2 format ${record.format}`);
      return { width: record.width, height: record.height, indices, rgba: rgba ?? rgbaFromIndices(indices, loadPalette(record.paletteIndex)) };
    };
    // Linked indexed sprites can select a different palette without changing the pixel indices.
    for (const record of records) record.repalette = image => image.indices ? { ...image, rgba: rgbaFromIndices(image.indices, loadPalette(record.paletteIndex)) } : image;
  } else fail(`Unsupported SFF version ${version}`);
  const loadSprite = index => {
    if (decoded.has(index)) return decoded.get(index);
    const record = records[index];
    if (!record || active.has(index)) fail(`Invalid/cyclic SFF sprite link ${index}`);
    if (record.error) fail(record.error);
    active.add(index);
    try {
      let image = record.size ? record.image ?? record.load() : loadSprite(record.link);
      if (!record.size && record.repalette) image = record.repalette(image);
      decoded.set(index, image); return image;
    } finally { active.delete(index); }
  };
  const sprites = [], keys = new Set();
  for (const [index, record] of records.entries()) {
    const key = `${record.group},${record.index}`;
    try {
      const image = loadSprite(index);
      if (keys.has(key)) { warnings.push(`Duplicate SFF sprite ${key}; keeping first successfully decoded image`); continue; }
      keys.add(key);
      sprites.push({ group: record.group, index: record.index, axisX: record.axisX, axisY: record.axisY, width: image.width, height: image.height, rgba: image.rgba });
    } catch (error) { warnings.push(`SFF sprite ${key} (#${index}) omitted: ${error.message}`); }
  }
  return { version, sprites, spriteCount: records.length, paletteCount, formats: [...new Set(records.map(r => r.format))] };
}

async function readText(file) { return (await fs.readFile(file)).toString('utf8'); }
async function safeOutputDirectory(directory) {
  const absolute = path.resolve(directory), parsed = path.parse(absolute);
  let current = parsed.root;
  for (const part of absolute.slice(parsed.root.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    try {
      const stat = await fs.lstat(current);
      if (stat.isSymbolicLink() || !stat.isDirectory()) fail(`Unsafe output directory: ${current}`);
    } catch (error) { if (error.code === 'ENOENT') await fs.mkdir(current); else throw error; }
  }
  return absolute;
}
async function writeOutput(file, data) {
  // Never follow a preexisting output symlink (including a symlink to a source asset).
  try {
    const stat = await fs.lstat(file);
    if (!stat.isFile() || stat.nlink > 1) fail(`Unsafe output file: ${file}`);
  }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await fs.writeFile(file, data);
}
async function chooseDef(directory) {
  const names = (await fs.readdir(directory)).filter(n => /\.def$/i.test(n)).sort();
  const match = names.find(n => n.toLowerCase() === `${path.basename(directory).toLowerCase()}.def`);
  if (!match && names.length !== 1) fail(`Expected one DEF or a directory-matching DEF in ${directory}`);
  return resolveCharacterFile(directory, match ?? names[0]);
}
export async function importCharacter(directory, output, id) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) fail(`Unsafe character id: ${id}`);
  directory = await fs.realpath(directory);
  output = path.resolve(output);
  if (isWithin(directory, output) || isWithin(output, directory)) fail('Input and output directories must not overlap');
  const warnings = ['Preview/data import only: no executable combat support. Commands, triggers and controllers are not evaluated.',
    'Sound playback, state-driven animation changes, palette effects, helpers and projectiles are not implemented.'];
  const defFile = await chooseDef(directory), def = parseDef(await readText(defFile));
  const dependency = async (key, required = false) => {
    const reference = def.files[key];
    if (!reference) { if (required) fail(`DEF missing required ${key} dependency`); return null; }
    try { return await resolveCharacterFile(directory, reference); }
    catch (error) { if (required) throw error; warnings.push(`${key}: ${error.message}`); return null; }
  };
  const spriteFile = await dependency('sprite', true), airFile = await dependency('anim', true);
  const paletteFile = await dependency('pal1');
  let palette;
  if (paletteFile) { try { palette = decodeAct(await fs.readFile(paletteFile)); } catch (error) { warnings.push(`pal1: ${error.message}`); } }
  const sff = decodeSff(await fs.readFile(spriteFile), { palette, warnings });
  if (!sff.sprites.length) fail(`No sprites could be decoded: ${warnings.join('; ')}`);
  if (sff.version.startsWith('2.') && paletteFile) warnings.push('SFF2 uses embedded sprite palettes; external ACT files and alternate palette selection are not applied.');
  const animations = parseAir(await readText(airFile), warnings), commands = [], states = [], movement = {};
  const loaded = new Set(), dependencies = [];
  for (const key of Object.keys(def.files).filter(k => /^(cmd|cns|st\d*|stcommon)$/.test(k))) {
    const file = await dependency(key);
    if (!file || loaded.has(file.toLowerCase())) continue;
    loaded.add(file.toLowerCase());
    const source = path.relative(directory, file).split(path.sep).join('/'), text = await readText(file);
    dependencies.push(source);
    if (key === 'cmd') commands.push(...parseCmd(text, source));
    const parsed = parseStates(text, source); states.push(...parsed.states); Object.assign(movement, parsed.constants);
  }
  for (const key of Object.keys(def.files).filter(k => /^(sound|pal\d+)$/.test(k) && k !== 'pal1')) await dependency(key);
  const controllerTypes = [...new Set(states.flatMap(s => s.controllers.map(c => c.type.toLowerCase())))].sort();
  const sprites = {}, destination = await safeOutputDirectory(path.join(output, id));
  await safeOutputDirectory(path.join(destination, 'sprites'));
  for (const sprite of sff.sprites) {
    const filename = `${sprite.group}_${sprite.index}.png`;
    await writeOutput(path.join(destination, 'sprites', filename), encodePng(sprite.width, sprite.height, sprite.rgba));
    sprites[`${sprite.group},${sprite.index}`] = { url: `sprites/${filename}`, width: sprite.width, height: sprite.height, axisX: sprite.axisX, axisY: sprite.axisY };
  }
  const missing = new Set();
  for (const animation of animations) for (const frame of animation.frames) {
    // MUGEN reserves -1 for blank frames; other IDs wrap to SFF's unsigned 16-bit fields.
    frame.spriteKey = frame.group === -1 || frame.index === -1 ? null : `${frame.group & 0xffff},${frame.index & 0xffff}`;
    if (frame.spriteKey !== null && !sprites[frame.spriteKey]) missing.add(frame.spriteKey);
  }
  for (const key of missing) warnings.push(`Animation references missing sprite ${key}`);
  const character = { id, name: def.name || path.basename(directory), sourceVersion: def.sourceVersion, localcoord: def.localcoord, sprites, animations, commands, states, movement,
    report: { warnings, unsupportedControllers: controllerTypes, controllerTypes, combatSupported: false, sffVersion: sff.version, spriteFormats: sff.formats, dependencies,
      counts: { sourceSprites: sff.spriteCount, sprites: Object.keys(sprites).length, palettes: sff.paletteCount, animations: animations.length, frames: animations.reduce((n, a) => n + a.frames.length, 0), commands: commands.length, states: states.length,
        controllers: states.reduce((n, s) => n + s.controllers.length, 0), missingSprites: missing.size } } };
  await writeOutput(path.join(destination, 'character.json'), `${JSON.stringify(character, null, 2)}\n`);
  return character;
}
export async function importCharacters({ input = 'chars', output = 'generated' } = {}) {
  const inputRoot = await fs.realpath(path.resolve(input)), outputPath = path.resolve(output);
  if (isWithin(inputRoot, outputPath) || isWithin(outputPath, inputRoot)) fail('Input and output directories must not overlap');
  const outputRoot = await safeOutputDirectory(outputPath);
  const entries = (await fs.readdir(inputRoot, { withFileTypes: true })).filter(e => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));
  const characters = [], failures = [], reports = [], ids = new Set();
  for (const entry of entries) {
    let id = entry.name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'character';
    const base = id; let suffix = 2;
    while (ids.has(id)) id = `${base}-${suffix++}`;
    ids.add(id);
    try {
      const character = await importCharacter(path.join(inputRoot, entry.name), outputRoot, id);
      characters.push({ id, name: character.name, url: `${id}/character.json` }); reports.push(character.report);
    } catch (error) { failures.push({ character: entry.name, error: error.message }); }
  }
  const index = { characters, generatedAt: new Date().toISOString() };
  await writeOutput(path.join(outputRoot, 'characters.json'), `${JSON.stringify(index, null, 2)}\n`);
  return { ...index, failures, reports };
}
export async function main(args = process.argv.slice(2)) {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help') { console.log('Usage: node tools\\mugen-import.mjs [--input chars] [--output generated]\nOffline preview/data importer; no combat execution.'); return; }
    if (!['--input', '--output'].includes(args[i]) || !args[i + 1] || args[i + 1].startsWith('--')) fail(`Invalid argument: ${args[i]}`);
    options[args[i].slice(2)] = args[++i];
  }
  const result = await importCharacters(options);
  for (let i = 0; i < result.characters.length; i++) {
    const c = result.characters[i], r = result.reports[i];
    console.log(`${c.name}: ${r.counts.sprites}/${r.counts.sourceSprites} sprites, ${r.counts.animations} animations, ${r.counts.commands} commands, ${r.counts.states} states; ${r.warnings.length} warnings (see character.json)`);
  }
  for (const failure of result.failures) console.error(`${failure.character}: ${failure.error}`);
  if (!result.characters.length && !result.failures.length) console.error('No character directories found in the input directory.');
  if (result.failures.length || !result.characters.length) process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(`Import failed: ${error.message}`); process.exitCode = 1; });
}
