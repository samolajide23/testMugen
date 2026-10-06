import fs from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { inflateRaw } from 'node:zlib';
import { promisify } from 'node:util';
import { importCharacter, crc32 } from './mugen-import.mjs';

export const ZIP_LIMITS = Object.freeze({ compressed: 50 * 1024 ** 2, expanded: 200 * 1024 ** 2, entries: 5000, file: 50 * 1024 ** 2 });
const inflate = promisify(inflateRaw);
const activeRoots = new Set();
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const key = value => value.normalize('NFC').toLowerCase();
function fail(message, statusCode = 400) { throw Object.assign(new Error(message), { statusCode }); }
function take(buffer, offset, length) {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset < 0 || length < 0 || offset + length > buffer.length) fail('Malformed ZIP: truncated data');
  return buffer.subarray(offset, offset + length);
}
function decodeName(bytes, utf8) {
  if (!utf8 && bytes.some(byte => byte > 127)) fail('ZIP filenames must be ASCII or explicitly UTF-8');
  try { return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes); }
  catch { fail('Malformed ZIP filename encoding'); }
}
function safePath(name) {
  const normalized = name.replaceAll('\\', '/');
  const directory = normalized.endsWith('/');
  const parts = (directory ? normalized.slice(0, -1) : normalized).split('/');
  if (normalized.length > 1024 || parts.length > 64) fail('ZIP path is too long', 413);
  for (const part of parts) {
    const stem = part.split('.')[0].trimEnd();
    if (!part || part === '.' || part === '..' || /[\x00-\x1f\x7f<>:"|?*]/.test(part) || /[. ]$/.test(part)
      || /^(?:con|prn|aux|nul|clock\$|conin\$|conout\$|com[1-9¹²³]|lpt[1-9¹²³])$/i.test(stem)) fail(`Unsafe ZIP path: ${name}`);
    if (Buffer.byteLength(part) > 255) fail('ZIP path component is too long', 413);
  }
  return { name: parts.join('/'), directory };
}
function extras(bytes, filename) {
  for (let offset = 0; offset < bytes.length;) {
    const header = take(bytes, offset, 4), type = header.readUInt16LE(), length = header.readUInt16LE(2);
    const data = take(bytes, offset + 4, length);
    if ([0x0001, 0x0017, 0x9901, 0x000d, 0x756e].includes(type)) fail('Unsupported ZIP64, encrypted, or Unix link metadata');
    if (type === 0x7075) {
      if (data.length < 5 || data[0] !== 1 || data.readUInt32LE(1) !== crc32(filename)
        || decodeName(data.subarray(5), true) !== filename.toString('utf8')) fail('Conflicting ZIP Unicode path metadata');
    }
    offset += 4 + length;
  }
}

// Parse every record before extraction; local records must cover exactly the data area.
async function readArchive(buffer) {
  if (!Buffer.isBuffer(buffer)) fail('ZIP upload must be a Buffer');
  if (buffer.length > ZIP_LIMITS.compressed) fail('ZIP upload exceeds 50 MiB', 413);
  let end = -1;
  for (let offset = buffer.length - 22; offset >= Math.max(0, buffer.length - 65557); offset--) {
    if (buffer.readUInt32LE(offset) === 0x06054b50 && offset + 22 + buffer.readUInt16LE(offset + 20) === buffer.length) { end = offset; break; }
  }
  if (end < 0) fail('Malformed ZIP: missing end record');
  const eocd = take(buffer, end, 22), count = eocd.readUInt16LE(10), size = eocd.readUInt32LE(12), start = eocd.readUInt32LE(16);
  if (count === 0xffff || size === 0xffffffff || start === 0xffffffff) fail('ZIP64 is unsupported');
  if (eocd.readUInt16LE(4) || eocd.readUInt16LE(6) || eocd.readUInt16LE(8) !== count) fail('Multipart ZIP archives are unsupported');
  if (!count) fail('ZIP archive is empty');
  if (count > ZIP_LIMITS.entries) fail('ZIP exceeds 5000 entries', 413);
  if (start + size !== end) fail('Malformed ZIP central directory');
  take(buffer, start, size);
  let offset = start, expanded = 0;
  const entries = [], names = new Set(), nodes = new Map();
  for (let index = 0; index < count; index++) {
    const h = take(buffer, offset, 46);
    if (h.readUInt32LE() !== 0x02014b50) fail('Malformed ZIP central header');
    const version = h.readUInt16LE(6), flags = h.readUInt16LE(8), method = h.readUInt16LE(10);
    const crc = h.readUInt32LE(16), compressed = h.readUInt32LE(20), length = h.readUInt32LE(24);
    const nameLength = h.readUInt16LE(28), extraLength = h.readUInt16LE(30), commentLength = h.readUInt16LE(32), local = h.readUInt32LE(42);
    if ([compressed, length, local].includes(0xffffffff) || version === 45) fail('ZIP64 is unsupported');
    if (flags & 1) fail('Encrypted ZIP archives are unsupported');
    if (version > 20 || flags & ~0x080e || ![0, 8].includes(method) || (method === 0 && flags & 6)) fail('Unsupported ZIP compression or flags');
    if (h.readUInt16LE(34)) fail('Multipart ZIP archives are unsupported');
    const filename = take(buffer, offset + 46, nameLength);
    const entryPath = safePath(decodeName(filename, !!(flags & 0x800)));
    extras(take(buffer, offset + 46 + nameLength, extraLength), filename);
    take(buffer, offset + 46 + nameLength + extraLength, commentLength);
    offset += 46 + nameLength + extraLength + commentLength;
    if (offset > end) fail('Malformed ZIP central directory length');
    const attributes = h.readUInt32LE(38), type = (attributes >>> 16) & 0xf000;
    if ((attributes & 0x48) || (type && type !== 0x8000 && type !== 0x4000)
      || (type === 0x4000 && !entryPath.directory) || (type === 0x8000 && entryPath.directory)
      || ((attributes & 0x10) && !entryPath.directory)) fail('ZIP symlinks, special files, or inconsistent directory attributes are unsupported');
    if (entryPath.directory && (length || crc)) fail('Malformed ZIP directory entry');
    if (length > ZIP_LIMITS.file || compressed > ZIP_LIMITS.compressed) fail('ZIP file exceeds 50 MiB', 413);
    expanded += length;
    if (expanded > ZIP_LIMITS.expanded) fail('ZIP expanded data exceeds 200 MiB', 413);
    const folded = key(entryPath.name);
    if (names.has(folded)) fail(`Duplicate ZIP path: ${entryPath.name}`);
    names.add(folded);
    const parts = entryPath.name.split('/');
    for (let depth = 1; depth <= parts.length; depth++) {
      const name = parts.slice(0, depth).join('/'), directory = depth < parts.length || entryPath.directory;
      const prior = nodes.get(key(name));
      if (prior && (prior.name !== name || prior.directory !== directory)) fail(`Conflicting ZIP path: ${name}`);
      nodes.set(key(name), { name, directory });
    }
    entries.push({ ...entryPath, filename, version, flags, method, crc, compressed, length, local });
  }
  if (offset !== end) fail('Malformed ZIP central directory size');
  let cursor = 0;
  for (const entry of [...entries].sort((a, b) => a.local - b.local)) {
    if (entry.local !== cursor) fail('Malformed ZIP: overlapping or unlisted local records');
    const h = take(buffer, cursor, 30);
    if (h.readUInt32LE() !== 0x04034b50 || h.readUInt16LE(4) !== entry.version || h.readUInt16LE(6) !== entry.flags
      || h.readUInt16LE(8) !== entry.method) fail('ZIP local/central header mismatch');
    const nameLength = h.readUInt16LE(26), extraLength = h.readUInt16LE(28);
    if (!take(buffer, cursor + 30, nameLength).equals(entry.filename)) fail('ZIP local/central path mismatch');
    extras(take(buffer, cursor + 30 + nameLength, extraLength), entry.filename);
    const expected = [entry.crc, entry.compressed, entry.length];
    for (let field = 0; field < 3; field++) {
      const value = h.readUInt32LE(14 + field * 4);
      if (value !== expected[field] && (!(entry.flags & 8) || value !== 0)) fail('ZIP local/central size or CRC mismatch');
    }
    cursor += 30 + nameLength + extraLength;
    entry.payload = take(buffer, cursor, entry.compressed);
    cursor += entry.compressed;
    if (entry.flags & 8) {
      // A descriptor can be unsigned even when its CRC happens to equal the signature.
      const matches = at => at + 12 <= start && expected.every((value, field) => buffer.readUInt32LE(at + field * 4) === value);
      if (matches(cursor)) cursor += 12;
      else if (cursor + 4 <= start && buffer.readUInt32LE(cursor) === 0x08074b50 && matches(cursor + 4)) cursor += 16;
      else fail('Malformed ZIP data descriptor');
    }
    if (cursor > start) fail('Malformed ZIP: data overlaps central directory');
  }
  if (cursor !== start) fail('Malformed ZIP data area');
  for (const entry of entries) {
    if (entry.method === 0) {
      if (entry.compressed !== entry.length) fail('Malformed stored ZIP size');
      entry.data = entry.payload;
    } else {
      try {
        const result = await inflate(entry.payload, { maxOutputLength: Math.max(1, entry.length), info: true });
        if (result.engine.bytesWritten !== entry.compressed) fail('Malformed ZIP: trailing compressed data');
        entry.data = result.buffer;
      } catch (error) {
        if (error.statusCode) throw error;
        if (error.code === 'ERR_BUFFER_TOO_LARGE') fail('ZIP inflation exceeds declared size', 413);
        fail('Malformed ZIP deflate stream');
      }
    }
    if (entry.data.length !== entry.length || crc32(entry.data) !== entry.crc) fail('ZIP size or CRC validation failed');
  }
  return entries;
}
function selectCharacter(entries, filename) {
  if (typeof filename !== 'string' || !/\.zip$/i.test(filename) || filename.includes('/') || filename.includes('\\')) fail('Expected a ZIP filename');
  safePath(filename);
  const uploadName = filename.slice(0, -4);
  safePath(uploadName);
  const groups = new Map();
  for (const entry of entries.filter(e => !e.directory && /\.def$/i.test(e.name))) {
    const at = entry.name.lastIndexOf('/'), directory = entry.name.slice(0, at + 1);
    if (!groups.has(directory)) groups.set(directory, []);
    groups.get(directory).push(entry.name.slice(at + 1));
  }
  if (!groups.size) fail('ZIP contains no character DEF');
  if (groups.size !== 1) fail('Ambiguous ZIP: multiple character/DEF directories; upload one character');
  const [[prefix, defs]] = groups;
  const folder = prefix ? prefix.slice(0, -1).split('/').at(-1) : uploadName;
  if (defs.length !== 1 && !defs.some(def => key(def) === key(`${folder}.def`))) fail('Ambiguous ZIP: expected one DEF or a directory-matching DEF');
  if (entries.some(entry => !entry.directory && !entry.name.startsWith(prefix))) fail('ZIP contains files outside the character directory');
  const id = folder.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'character';
  if (id.length > 200) fail('Character folder name is too long', 413);
  return { prefix, folder, id };
}
async function statOrNull(target) {
  try { return await fs.lstat(target); } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
async function safeDirectory(target) {
  const stat = await fs.lstat(target);
  if (stat.isSymbolicLink() || !stat.isDirectory()) fail(`Unsafe directory: ${path.basename(target)}`);
  if (key(path.resolve(await fs.realpath(target))) !== key(path.resolve(target))) fail('Root paths must not traverse symlinks');
  return stat;
}
async function safeAncestors(target) {
  for (let current = target;; current = path.dirname(current)) {
    await safeDirectory(current);
    if (current === path.dirname(current)) break;
  }
}
async function checkName(directory, name, allowed = false) {
  for (const existing of await fs.readdir(directory)) {
    if (key(existing) === key(name) && (!allowed || existing !== name)) fail(`Character path already exists: ${name}`, 409);
  }
}
async function readManifest(generated) {
  await checkName(generated, 'characters.json', true);
  const target = path.join(generated, 'characters.json'), stat = await statOrNull(target);
  if (!stat) return { bytes: null, value: { characters: [] } };
  if (!stat.isFile() || stat.isSymbolicLink()) fail('Unsafe character manifest');
  if (stat.size > 8 * 1024 ** 2) fail('Character manifest is too large');
  const handle = await fs.open(target, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  let bytes;
  try {
    const actual = await handle.stat();
    if (actual.dev !== stat.dev || actual.ino !== stat.ino || actual.size !== stat.size) fail('Character manifest changed', 409);
    bytes = await handle.readFile();
  } finally { await handle.close(); }
  let value;
  try { value = JSON.parse(bytes.toString('utf8')); } catch { fail('Invalid character manifest JSON'); }
  if (!value || Array.isArray(value) || typeof value !== 'object' || !Array.isArray(value.characters)) fail('Invalid character manifest');
  const ids = new Set();
  for (const entry of value.characters) {
    if (!entry || typeof entry.id !== 'string' || !idPattern.test(entry.id) || typeof entry.name !== 'string'
      || entry.url !== `${entry.id}/character.json` || ids.has(entry.id)) fail('Invalid or duplicate character manifest entry');
    ids.add(entry.id);
  }
  return { bytes, value };
}
async function sameManifest(generated, snapshot) {
  const current = await readManifest(generated);
  if (snapshot.bytes === null ? current.bytes !== null : current.bytes === null || !snapshot.bytes.equals(current.bytes)) fail('Character manifest changed during import', 409);
}
async function publishFolder(source, target, owned) {
  try { await fs.mkdir(target); } catch (error) { if (error.code === 'EEXIST') fail('Character folder already exists', 409); throw error; }
  const identity = await fs.lstat(target);
  owned.push({ target, identity });
  for (const name of await fs.readdir(source)) await fs.rename(path.join(source, name), path.join(target, name));
}

/** Data-only, single-character upload. importer is a trusted server-side test seam, never upload input.
 * Limits: 50 MiB ZIP/file, 200 MiB expanded, 5000 entries. Errors expose statusCode (400/409/413/422).
 * The caller should serialize all other manifest writers; this module serializes its own imports per root.
 */
export async function importCharacterZip(buffer, { root, filename, importer = importCharacter } = {}) {
  const entries = await readArchive(buffer), selected = selectCharacter(entries, filename);
  if (typeof root !== 'string') fail('An existing import root is required');
  root = path.resolve(root);
  try { await safeAncestors(root); }
  catch (error) { if (error.statusCode) throw error; fail('Import root must be an existing, accessible real directory'); }
  const lock = key(root);
  if (activeRoots.has(lock)) fail('An import is already in progress', 409);
  activeRoots.add(lock);
  let staging, committed = false;
  const owned = [], initialized = [];
  try {
    const present = new Set(), { id, prefix, folder } = selected;
    const chars = path.join(root, 'chars'), generated = path.join(root, 'generated');
    for (const name of ['chars', 'generated']) {
      await checkName(root, name, true);
      const target = path.join(root, name);
      if (await statOrNull(target)) {
        await safeDirectory(target); await checkName(target, id);
        present.add(name);
      }
    }
    const snapshot = present.has('generated') ? await readManifest(generated) : { bytes: null, value: { characters: [] } };
    if (snapshot.value.characters.some(entry => entry.id === id)) fail('Character is already in the manifest', 409);
    // Validation (including CRC, destination paths and the manifest) precedes the first write.
    for (const name of ['chars', 'generated']) {
      const target = path.join(root, name);
      if (!present.has(name)) {
        try { await fs.mkdir(target); }
        catch (error) { if (error.code === 'EEXIST') fail('Import directories changed during validation', 409); throw error; }
        initialized.push({ target, identity: await fs.lstat(target) });
      }
      await safeDirectory(target);
    }
    const checkCollision = async () => {
      await safeAncestors(root); await safeDirectory(chars); await safeDirectory(generated);
      await checkName(chars, id); await checkName(generated, id);
      if (snapshot.value.characters.some(entry => entry.id === id)) fail('Character is already in the manifest', 409);
      await sameManifest(generated, snapshot);
    };
    await checkCollision();
    staging = await fs.mkdtemp(path.join(root, '.zip-import-'));
    const source = path.join(staging, 'source', folder), output = path.join(staging, 'output');
    await fs.mkdir(source, { recursive: true });
    for (const entry of entries) {
      if (!entry.name.startsWith(prefix)) continue;
      const relative = entry.name.slice(prefix.length);
      if (!relative) continue;
      const target = path.join(source, ...relative.split('/'));
      if (entry.directory) await fs.mkdir(target, { recursive: true });
      else { await fs.mkdir(path.dirname(target), { recursive: true }); await fs.writeFile(target, entry.data, { flag: 'wx' }); }
    }
    let result;
    try { result = await importer(source, output, id); }
    catch (error) { fail(`Character import unsupported: ${error.message}`, 422); }
    const character = { id, name: result.name, url: `${id}/character.json` };
    const response = { character, savedFolder: `chars/${id}`, warnings: result.report.warnings, counts: result.report.counts };
    const manifest = { ...snapshot.value, characters: [...snapshot.value.characters, character], generatedAt: new Date().toISOString() };
    const stagedManifest = path.join(staging, 'characters.json');
    await fs.writeFile(stagedManifest, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
    await checkCollision();
    await publishFolder(source, path.join(chars, id), owned);
    await publishFolder(path.join(output, id), path.join(generated, id), owned);
    await safeDirectory(chars); await safeDirectory(generated);
    await sameManifest(generated, snapshot);
    await fs.rename(stagedManifest, path.join(generated, 'characters.json'));
    committed = true;
    return response;
  } catch (error) {
    error.statusCode ??= ['EEXIST', 'ENOTEMPTY'].includes(error.code) ? 409 : 500;
    throw error;
  } finally {
    try {
      if (!committed) for (const { target, identity } of owned.reverse()) {
        const current = await statOrNull(target);
        if (current && !current.isSymbolicLink() && current.dev === identity.dev && current.ino === identity.ino) await fs.rm(target, { recursive: true, force: true });
      }
    } finally {
      try {
        if (staging) await fs.rm(staging, { recursive: true, force: true });
      } finally {
        try {
          if (!committed) for (const { target, identity } of initialized.reverse()) {
            const current = await statOrNull(target);
            if (current && !current.isSymbolicLink() && current.dev === identity.dev && current.ino === identity.ino) {
              try { await fs.rmdir(target); } catch (error) { if (!['ENOENT', 'ENOTEMPTY', 'EEXIST'].includes(error.code)) throw error; }
            }
          }
        } finally { activeRoots.delete(lock); }
      }
    }
  }
}
