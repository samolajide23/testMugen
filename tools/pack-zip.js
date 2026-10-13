/**
 * Shared: zip bytes (MUGEN char) → packed zip bytes { id, buf }.
 * Used by Vercel /api/pack (and can be used by local servers).
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const JSZip = require("jszip");

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
      const p = path.join(dir, f);
      try {
        if (fs.statSync(p).isDirectory() && f !== "node_modules" && f !== "__MACOSX") {
          stack.push(p);
        }
      } catch (_) {
        /* skip */
      }
    }
  }
  return null;
}

/**
 * @param {Buffer} zipBuf
 * @returns {Promise<{ id: string, buf: Buffer }>}
 */
async function packZipBuffer(zipBuf) {
  const workRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mugenskel-src-"));
  const packsRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mugenskel-packs-"));

  process.env.MUGENSKEL_ROOT = workRoot;
  process.env.MUGENSKEL_PACKS = packsRoot;

  // Load after env is set so any future top-level readers see /tmp paths
  const { packFromMugen, findMugenFiles } = require("./pack-character");

  try {
    const zip = await JSZip.loadAsync(zipBuf);
    for (const name of Object.keys(zip.files)) {
      const entry = zip.files[name];
      if (entry.dir) continue;
      const out = path.join(workRoot, name.replace(/\//g, path.sep));
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, await entry.async("nodebuffer"));
    }

    const charDir = findCharDir(workRoot);
    if (!charDir) throw new Error("No MUGEN char found (need .sff + .air inside the zip)");

    const files = findMugenFiles(charDir);
    if (!files.sff || !files.air) throw new Error("Char folder missing .sff/.air");

    const result = await packFromMugen(charDir, null);
    const id = result.id;
    const packDir = path.join(packsRoot, id);
    const outZip = new JSZip();
    for (const f of ["character.json", "atlas.png", "atlas.json"]) {
      const fp = path.join(packDir, f);
      if (fs.existsSync(fp)) outZip.file(f, fs.readFileSync(fp));
    }
    if (!outZip.files["character.json"]) throw new Error(`Pack incomplete for ${id}`);
    const buf = await outZip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
    return { id, buf };
  } finally {
    try {
      fs.rmSync(workRoot, { recursive: true, force: true });
    } catch (_) {
      /* ignore */
    }
    try {
      fs.rmSync(packsRoot, { recursive: true, force: true });
    } catch (_) {
      /* ignore */
    }
    delete process.env.MUGENSKEL_ROOT;
    delete process.env.MUGENSKEL_PACKS;
  }
}

module.exports = { packZipBuffer, findCharDir };
