/**
 * Local pack helper for the preview site.
 *   node tools/pack-server.js
 *   POST /pack  (body = .zip of a MUGEN char folder) → zip of packs/<id>/
 *   GET  /health
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");
const JSZip = require("jszip");

const ROOT = path.join(__dirname, "..");
const PORT = Number(process.env.PACK_PORT || 8787);
const PACKER = path.join(__dirname, "pack-character.js");

function send(res, code, data, type) {
  const body = typeof data === "string" || Buffer.isBuffer(data) ? data : JSON.stringify(data);
  res.writeHead(code, {
    "Content-Type": type || (Buffer.isBuffer(data) ? "application/zip" : "application/json"),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(body);
}

function findCharDir(rootDir) {
  const stack = [rootDir];
  while (stack.length) {
    const dir = stack.pop();
    let files;
    try { files = fs.readdirSync(dir); } catch (_) { continue; }
    const hasSff = files.some((f) => f.toLowerCase().endsWith(".sff"));
    const hasAir = files.some((f) => f.toLowerCase().endsWith(".air"));
    if (hasSff && hasAir) return dir;
    for (const f of files) {
      const p = path.join(dir, f);
      try {
        if (fs.statSync(p).isDirectory() && f !== "node_modules" && f !== "__MACOSX") stack.push(p);
      } catch (_) { /* skip */ }
    }
  }
  return null;
}

async function packZipBuffer(buf) {
  const zip = await JSZip.loadAsync(buf);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mugenskel-"));
  const entries = Object.keys(zip.files);
  for (const name of entries) {
    const entry = zip.files[name];
    if (entry.dir) continue;
    const out = path.join(tmp, name.replace(/\//g, path.sep));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, await entry.async("nodebuffer"));
  }
  const charDir = findCharDir(tmp);
  if (!charDir) {
    fs.rmSync(tmp, { recursive: true, force: true });
    throw new Error("No MUGEN char found (need .sff + .air inside the zip)");
  }
  let log = "";
  try {
    log = execFileSync(process.execPath, [PACKER, charDir], {
      cwd: ROOT,
      encoding: "utf8",
      timeout: 180000,
      maxBuffer: 8 * 1024 * 1024,
    });
  } catch (err) {
    const msg = (err.stdout || "") + (err.stderr || "") + (err.message || "");
    throw new Error(msg.trim() || "Pack failed");
  }
  const hit = log.match(/→ packs\/([a-z0-9_]+)\//i) || log.match(/Packing .+ \(([a-z0-9_]+)\)/i);
  const id = hit ? hit[1] : null;
  if (!id) throw new Error("Could not detect pack id from packer output");
  const packDir = path.join(ROOT, "packs", id);
  if (!fs.existsSync(path.join(packDir, "character.json"))) {
    throw new Error(`Pack folder missing: packs/${id}`);
  }
  const outZip = new JSZip();
  for (const f of ["character.json", "atlas.png", "atlas.json"]) {
    const fp = path.join(packDir, f);
    if (fs.existsSync(fp)) outZip.file(f, fs.readFileSync(fp));
  }
  const outBuf = await outZip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  fs.rmSync(tmp, { recursive: true, force: true });
  return { id, buf: outBuf };
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, "");
  if (req.url === "/health" && req.method === "GET") {
    return send(res, 200, { ok: true, packer: true });
  }
  if (req.url === "/pack" && req.method === "POST") {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const buf = Buffer.concat(chunks);
    if (!buf.length) return send(res, 400, { error: "Empty body — POST a .zip" });
    try {
      const { id, buf: out } = await packZipBuffer(buf);
      res.writeHead(200, {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${id}.zip"`,
        "X-Pack-Id": id,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "X-Pack-Id",
      });
      return res.end(out);
    } catch (err) {
      console.error(err);
      return send(res, 500, { error: err.message || String(err) });
    }
  }
  send(res, 404, { error: "Not found. POST /pack or GET /health" });
});

server.listen(PORT, () => {
  console.log(`mugenSkel pack-server on http://127.0.0.1:${PORT}`);
  console.log(`  POST /pack  — zip of MUGEN char → packed zip`);
  console.log(`  RAR not supported here — convert to zip first`);
});
