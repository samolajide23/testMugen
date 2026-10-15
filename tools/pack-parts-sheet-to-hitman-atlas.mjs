/**
 * Convert a freeform parts sheet PNG into a Hitman Spine atlas page (1024×512).
 *
 * Usage:
 *   node tools/pack-parts-sheet-to-hitman-atlas.mjs "skins/Futuristic Cyan-Hooded Robot Parts Sheet.png" skins/cyan_robot.png
 */
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hitmanDir = path.join(root, 'packs', 'hitman');
const atlasPathCandidates = [
  path.join(root, '..', 'hitman-spine', 'assets', 'Hitman.atlas'),
  path.join(hitmanDir, 'Hitman.atlas'),
];

function loadPng(filePath) {
  return PNG.sync.read(fs.readFileSync(filePath));
}

function parseAtlas(text) {
  const lines = text.split(/\r?\n/);
  const regions = [];
  let cur = null;
  for (const line of lines) {
    if (!line.trim()) {
      cur = null;
      continue;
    }
    if (!line.startsWith(' ')) {
      if (/\.png$/i.test(line.trim())) continue;
      if (/^(size|format|filter|repeat):/.test(line)) continue;
      cur = { name: line.trim() };
      regions.push(cur);
    } else if (cur) {
      const m = line.trim().match(/^(\w+):\s*(.+)$/);
      if (!m) continue;
      const [, key, val] = m;
      if (key === 'xy' || key === 'size' || key === 'orig' || key === 'offset') {
        cur[key] = val.split(',').map((n) => Number(n.trim()));
      } else if (key === 'rotate') cur.rotate = val.trim() === 'true';
      else cur[key] = val.trim();
    }
  }
  return regions;
}

function packedRect(region) {
  const [x, y] = region.xy;
  const [w, h] = region.size;
  if (region.rotate) return { x, y, w: h, h: w, rotate: true };
  return { x, y, w, h, rotate: false };
}

function sample(img, x, y) {
  const ix = Math.max(0, Math.min(img.width - 1, Math.floor(x)));
  const iy = Math.max(0, Math.min(img.height - 1, Math.floor(y)));
  const i = (img.width * iy + ix) << 2;
  return [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]];
}

function knockBlack(img, lumCut = 28) {
  const out = new PNG({ width: img.width, height: img.height });
  for (let i = 0; i < img.data.length; i += 4) {
    const r = img.data[i];
    const g = img.data[i + 1];
    const b = img.data[i + 2];
    const a = img.data[i + 3];
    const lum = r * 0.3 + g * 0.5 + b * 0.2;
    const keep = a > 8 && lum > lumCut;
    out.data[i] = r;
    out.data[i + 1] = g;
    out.data[i + 2] = b;
    out.data[i + 3] = keep ? 255 : 0;
  }
  return out;
}

function extractPacked(atlas, rect) {
  const out = new PNG({ width: rect.w, height: rect.h });
  for (let py = 0; py < rect.h; py++) {
    for (let px = 0; px < rect.w; px++) {
      const si = (atlas.width * (rect.y + py) + (rect.x + px)) << 2;
      const di = (rect.w * py + px) << 2;
      out.data[di] = atlas.data[si];
      out.data[di + 1] = atlas.data[si + 1];
      out.data[di + 2] = atlas.data[si + 2];
      out.data[di + 3] = atlas.data[si + 3];
    }
  }
  return out;
}

function writePacked(atlas, rect, part) {
  for (let py = 0; py < rect.h; py++) {
    for (let px = 0; px < rect.w; px++) {
      const si = (part.width * py + px) << 2;
      const di = (atlas.width * (rect.y + py) + (rect.x + px)) << 2;
      atlas.data[di] = part.data[si];
      atlas.data[di + 1] = part.data[si + 1];
      atlas.data[di + 2] = part.data[si + 2];
      atlas.data[di + 3] = part.data[si + 3];
    }
  }
}

function fitCover(src, tw, th) {
  const dst = new PNG({ width: tw, height: th });
  dst.data.fill(0);
  if (!src.width || !src.height) return dst;
  const scale = Math.max(tw / src.width, th / src.height);
  const sw = src.width * scale;
  const sh = src.height * scale;
  const ox = (tw - sw) / 2;
  const oy = (th - sh) / 2;
  for (let y = 0; y < th; y++) {
    for (let x = 0; x < tw; x++) {
      const sx = (x - ox) / scale;
      const sy = (y - oy) / scale;
      if (sx < 0 || sy < 0 || sx >= src.width || sy >= src.height) continue;
      const [r, g, b, a] = sample(src, sx, sy);
      if (a < 8) continue;
      const i = (tw * y + x) << 2;
      dst.data[i] = r;
      dst.data[i + 1] = g;
      dst.data[i + 2] = b;
      dst.data[i + 3] = a;
    }
  }
  return dst;
}

function fitContain(src, tw, th) {
  const dst = new PNG({ width: tw, height: th });
  dst.data.fill(0);
  if (!src.width || !src.height) return dst;
  const scale = Math.min(tw / src.width, th / src.height) * 0.92;
  const sw = src.width * scale;
  const sh = src.height * scale;
  const ox = (tw - sw) / 2;
  const oy = (th - sh) / 2;
  for (let y = 0; y < th; y++) {
    for (let x = 0; x < tw; x++) {
      const sx = (x - ox) / scale;
      const sy = (y - oy) / scale;
      if (sx < 0 || sy < 0 || sx >= src.width || sy >= src.height) continue;
      const [r, g, b, a] = sample(src, sx, sy);
      if (a < 8) continue;
      const i = (tw * y + x) << 2;
      dst.data[i] = r;
      dst.data[i + 1] = g;
      dst.data[i + 2] = b;
      dst.data[i + 3] = a;
    }
  }
  return dst;
}

/** Mask art by Hitman silhouette alpha so joints stay clean. */
function maskWithHitman(art, hitmanMask) {
  const out = new PNG({ width: art.width, height: art.height });
  for (let i = 0; i < art.data.length; i += 4) {
    const a = Math.min(art.data[i + 3], hitmanMask.data[i + 3]);
    out.data[i] = art.data[i];
    out.data[i + 1] = art.data[i + 1];
    out.data[i + 2] = art.data[i + 2];
    out.data[i + 3] = a;
  }
  return out;
}

function findBlobs(img, { minArea = 80 } = {}) {
  const w = img.width;
  const h = img.height;
  const seen = new Uint8Array(w * h);
  const blobs = [];
  const dirs = [1, -1, w, -w];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const start = y * w + x;
      if (seen[start] || img.data[(start << 2) + 3] < 8) continue;
      const stack = [start];
      seen[start] = 1;
      let minX = x;
      let minY = y;
      let maxX = x;
      let maxY = y;
      let area = 0;
      const pixels = [];
      while (stack.length) {
        const idx = stack.pop();
        const px = idx % w;
        const py = (idx / w) | 0;
        pixels.push(idx);
        area++;
        minX = Math.min(minX, px);
        minY = Math.min(minY, py);
        maxX = Math.max(maxX, px);
        maxY = Math.max(maxY, py);
        for (const d of dirs) {
          const n = idx + d;
          if (n < 0 || n >= w * h) continue;
          // prevent wrap on horizontal
          if (d === 1 && px === w - 1) continue;
          if (d === -1 && px === 0) continue;
          if (seen[n] || img.data[(n << 2) + 3] < 8) continue;
          seen[n] = 1;
          stack.push(n);
        }
      }
      if (area < minArea) continue;
      const bw = maxX - minX + 1;
      const bh = maxY - minY + 1;
      const crop = new PNG({ width: bw, height: bh });
      crop.data.fill(0);
      for (const idx of pixels) {
        const px = idx % w;
        const py = (idx / w) | 0;
        const si = idx << 2;
        const di = (bw * (py - minY) + (px - minX)) << 2;
        crop.data[di] = img.data[si];
        crop.data[di + 1] = img.data[si + 1];
        crop.data[di + 2] = img.data[si + 2];
        crop.data[di + 3] = img.data[si + 3];
      }
      blobs.push({
        minX,
        minY,
        maxX,
        maxY,
        w: bw,
        h: bh,
        area,
        cx: (minX + maxX) / 2 / w,
        cy: (minY + maxY) / 2 / h,
        aspect: bw / Math.max(1, bh),
        img: crop,
      });
    }
  }
  blobs.sort((a, b) => b.area - a.area);
  return blobs;
}

function classifyBlobs(blobs) {
  const pool = [...blobs];
  const take = (pred) => {
    const i = pool.findIndex(pred);
    if (i < 0) return null;
    return pool.splice(i, 1)[0];
  };

  // Head: large, fairly square, lower-leftish of sheet often
  const head = take((b) => b.area > 8000 && b.aspect > 0.7 && b.aspect < 1.4 && b.cy > 0.45)
    ?? take((b) => b.area > 8000 && b.aspect > 0.65 && b.aspect < 1.5);

  // Hair / back fan: wide-ish, upper area
  const hair = take((b) => b.area > 3000 && b.cy < 0.45 && b.aspect > 0.8)
    ?? take((b) => b.area > 2500 && b !== head);

  // Boots / feet: two similar mid-small, bottom
  const feet = [];
  while (feet.length < 2) {
    const f = take((b) => b.area > 800 && b.area < 20000 && b.cy > 0.55 && b.aspect > 0.6 && b.aspect < 1.8);
    if (!f) break;
    feet.push(f);
  }

  // Hands / claws: mid size, complex
  const hands = [];
  while (hands.length < 4) {
    const hnd = take((b) => b.area > 600 && b.area < 18000 && b.aspect > 0.5 && b.aspect < 2.2);
    if (!hnd) break;
    hands.push(hnd);
  }

  // Limbs: elongated
  const limbs = [];
  while (limbs.length < 8) {
    const limb = take((b) => b.area > 500 && (b.aspect > 1.4 || b.aspect < 0.7));
    if (!limb) break;
    limbs.push(limb);
  }

  // leftovers as extra limbs / torso bits
  const rest = pool.splice(0, pool.length);

  return { head, hair, feet, hands, limbs, rest };
}

function pick(list, i, fallback) {
  if (list?.[i]) return list[i].img;
  if (fallback) return fallback;
  if (list?.length) return list[i % list.length].img;
  return null;
}

function regionArt(map, name, classified) {
  const { head, hair, feet, hands, limbs, rest } = classified;
  const torsoBits = rest.filter((b) => b.area > 400);
  if (/^Head$/i.test(name)) return head?.img ?? pick(rest, 0);
  if (/^Hair$/i.test(name)) return hair?.img ?? head?.img ?? pick(rest, 1);
  if (/Torso/i.test(name)) return pick(torsoBits, /Back/i.test(name) ? 1 : 0, hair?.img ?? head?.img);
  if (/Foot/i.test(name)) return pick(feet, /B_/i.test(name) ? 1 : 0, pick(limbs, 0));
  if (/Hand|Fist|Open/i.test(name)) {
    const idx = Math.abs([...name].reduce((s, c) => s + c.charCodeAt(0), 0)) % Math.max(1, hands.length || 1);
    return pick(hands, idx, pick(limbs, 2));
  }
  if (/Shin/i.test(name)) return pick(limbs, /B_/i.test(name) ? 1 : 0, pick(rest, 2));
  if (/Thigh/i.test(name)) return pick(limbs, /B_/i.test(name) ? 3 : 2, pick(rest, 3));
  if (/UpperArm/i.test(name)) return pick(limbs, /B_/i.test(name) ? 5 : 4, pick(rest, 4));
  return pick(rest, 0, head?.img);
}

const srcArg = process.argv[2] ?? path.join(root, 'skins', 'Futuristic Cyan-Hooded Robot Parts Sheet.png');
const outArg = process.argv[3] ?? path.join(root, 'skins', 'cyan_robot.png');
const srcPath = path.isAbsolute(srcArg) ? srcArg : path.join(root, srcArg);
const outPath = path.isAbsolute(outArg) ? outArg : path.join(root, outArg);

if (!fs.existsSync(srcPath)) {
  console.error('Missing source parts sheet:', srcPath);
  process.exit(1);
}

const atlasPath = atlasPathCandidates.find((p) => fs.existsSync(p));
if (!atlasPath) {
  console.error('Missing Hitman.atlas');
  process.exit(1);
}

const hitmanPngPath = path.join(hitmanDir, 'Hitman.png');
const hitmanPng = loadPng(hitmanPngPath);
const regions = parseAtlas(fs.readFileSync(atlasPath, 'utf8'));
const sheet = knockBlack(loadPng(srcPath));
const blobs = findBlobs(sheet, { minArea: 120 });
const classified = classifyBlobs(blobs);

console.log(`Source: ${path.relative(root, srcPath)} (${sheet.width}×${sheet.height})`);
console.log(`Blobs: ${blobs.length} · head=${!!classified.head} hair=${!!classified.hair} feet=${classified.feet.length} hands=${classified.hands.length} limbs=${classified.limbs.length} rest=${classified.rest.length}`);

const outAtlas = new PNG({ width: 1024, height: 512 });
outAtlas.data.fill(0);
const seen = new Set();
const report = [];

for (const region of regions) {
  const rect = packedRect(region);
  const key = `${rect.x},${rect.y},${rect.w},${rect.h}`;
  if (seen.has(key)) {
    report.push({ name: region.name, shared: true });
    continue;
  }
  seen.add(key);

  const srcPart = regionArt(null, region.name, classified);
  const hitMask = extractPacked(hitmanPng, rect);
  let fitted;
  if (srcPart) {
    // Hands/head: contain to keep silhouette readable; limbs: cover
    const useContain = /Head|Hair|Hand|Fist|Open|Foot|Torso/i.test(region.name);
    fitted = useContain ? fitContain(srcPart, rect.w, rect.h) : fitCover(srcPart, rect.w, rect.h);
    fitted = maskWithHitman(fitted, hitMask);
    // If mask wiped everything (rare), fall back to unmasked contain
    let opaque = 0;
    for (let i = 3; i < fitted.data.length; i += 4) if (fitted.data[i] > 8) opaque++;
    if (opaque < 20) fitted = useContain ? fitContain(srcPart, rect.w, rect.h) : fitCover(srcPart, rect.w, rect.h);
  } else {
    // No blob: keep a tinted Hitman silhouette so the slot isn't empty
    fitted = new PNG({ width: rect.w, height: rect.h });
    for (let i = 0; i < hitMask.data.length; i += 4) {
      const a = hitMask.data[i + 3];
      fitted.data[i] = 40;
      fitted.data[i + 1] = 180;
      fitted.data[i + 2] = 220;
      fitted.data[i + 3] = a;
    }
  }
  writePacked(outAtlas, rect, fitted);
  report.push({ name: region.name, shared: false, w: rect.w, h: rect.h, hasArt: Boolean(srcPart) });
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, PNG.sync.write(outAtlas));

// Remove the raw parts sheet from skins/ so auto-skin doesn't load the wrong format
const rawInSkins = path.join(root, 'skins', path.basename(srcPath));
if (path.resolve(rawInSkins) === path.resolve(srcPath) && /\s/.test(path.basename(srcPath))) {
  const archive = path.join(root, 'skins', '_source_parts');
  fs.mkdirSync(archive, { recursive: true });
  const dest = path.join(archive, path.basename(srcPath));
  fs.renameSync(srcPath, dest);
  console.log(`Moved loose parts sheet → ${path.relative(root, dest)}`);
}

console.log(`Wrote Hitman-layout atlas: ${path.relative(root, outPath)} (1024×512)`);
console.log(`Regions painted: ${report.filter((r) => !r.shared).length}`);
