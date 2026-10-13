/**
 * Browser entry: pack a MUGEN char from an in-memory file map.
 * Bundled to pack-browser.bundle.js (global MugenPacker).
 */
const fs = require("fs");
const path = require("path");
const { packFromMugen, findMugenFiles } = require("./pack-character");
const { buildRobloxFiles, enrichRobloxMeta } = require("./roblox-export");

function findCharDir(rootDir) {
  const stack = [rootDir];
  while (stack.length) {
    const dir = stack.pop();
    let files;
    try {
      files = fs.readdirSync(dir);
    } catch (_) {
      continue;
    }
    const hasSff = files.some((f) => f.toLowerCase().endsWith(".sff"));
    const hasAir = files.some((f) => f.toLowerCase().endsWith(".air"));
    if (hasSff && hasAir) return dir;
    for (const f of files) {
      if (f === "node_modules" || f === "__MACOSX") continue;
      const p = path.join(dir, f);
      try {
        if (fs.statSync(p).isDirectory()) stack.push(p);
      } catch (_) {
        /* skip */
      }
    }
  }
  return null;
}

/**
 * @param {Record<string, ArrayBuffer|Uint8Array|number[]>} fileMap relative paths → bytes
 * @param {{ actions?: Map|object, byKey?: Map|object, engine?: string }|null} preload
 *        Optional JSMugen-decoded AIR + sprites (browser). Prefer this for fidelity.
 * @returns {Promise<{ id: string, character: object, atlasPng: Uint8Array }>}
 */
async function packFromFileMap(fileMap, preload) {
  if (!fileMap || !Object.keys(fileMap).length) {
    throw new Error("No files to pack");
  }

  fs.__reset();
  const workRoot = "/work";
  const packsRoot = "/packs";
  process.env.MUGENSKEL_ROOT = workRoot;
  process.env.MUGENSKEL_PACKS = packsRoot;
  fs.mkdirSync(workRoot, { recursive: true });
  fs.mkdirSync(packsRoot, { recursive: true });

  for (const [relRaw, data] of Object.entries(fileMap)) {
    const rel = String(relRaw).replace(/\\/g, "/").replace(/^\/+/, "");
    if (!rel || rel.includes("..") || /__MACOSX/i.test(rel)) continue;
    const out = path.join(workRoot, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, Buffer.from(data instanceof ArrayBuffer ? new Uint8Array(data) : data));
  }

  const charDir = findCharDir(workRoot);
  if (!charDir) throw new Error("No MUGEN char found (need .sff + .air)");

  const files = findMugenFiles(charDir);
  if (!files.sff || !files.air) throw new Error("Char folder missing .sff/.air");

  let normalizedPreload = null;
  if (preload && preload.actions && preload.byKey) {
    const actions = preload.actions instanceof Map
      ? preload.actions
      : (() => {
        const m = new Map();
        for (const [id, frames] of Object.entries(preload.actions)) m.set(Number(id), frames);
        return m;
      })();
    const byKey = preload.byKey instanceof Map
      ? preload.byKey
      : (() => {
        const m = new Map();
        for (const [key, spr] of Object.entries(preload.byKey)) {
          m.set(key, {
            width: spr.width,
            height: spr.height,
            x: spr.x || 0,
            y: spr.y || 0,
            decodedBuffer: Buffer.from(
              spr.decodedBuffer || spr.rgba || spr.data || []
            ),
          });
        }
        return m;
      })();
    normalizedPreload = { actions, byKey, engine: preload.engine || "jsmugen" };
  }

  const result = await packFromMugen(charDir, null, normalizedPreload);
  const id = result.id;
  const packDir = path.join(packsRoot, id);
  const charPath = path.join(packDir, "character.json");
  const atlasPath = path.join(packDir, "atlas.png");
  if (!fs.existsSync(charPath) || !fs.existsSync(atlasPath)) {
    throw new Error(`Pack incomplete for ${id}`);
  }

  const character = JSON.parse(fs.readFileSync(charPath, "utf8"));
  enrichRobloxMeta(character);
  const robloxFiles = buildRobloxFiles(character);
  const atlasBuf = fs.readFileSync(atlasPath);
  const atlasPng = new Uint8Array(atlasBuf.buffer, atlasBuf.byteOffset, atlasBuf.byteLength);

  return { id, character, atlasPng, robloxFiles };
}

module.exports = { packFromFileMap, buildRobloxFiles };
