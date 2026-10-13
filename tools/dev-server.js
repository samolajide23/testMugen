/**
 * Local preview + pack API (same origin — works with zip drop).
 *   npm run dev
 *   open http://127.0.0.1:8787
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");
const JSZip = require("jszip");

const ROOT = path.join(__dirname, "..");
const PORT = Number(process.env.PORT || 8787);
const PACKER = path.join(__dirname, "pack-character.js");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".map": "application/json",
};

function send(res, code, data, type, extraHeaders) {
  const headers = {
    "Content-Type": type || "text/plain",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    ...(extraHeaders || {}),
  };
  res.writeHead(code, headers);
  res.end(data);
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
  for (const name of Object.keys(zip.files)) {
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
      maxBuffer: 16 * 1024 * 1024,
    });
  } catch (err) {
    const msg = `${err.stdout || ""}${err.stderr || ""}${err.message || ""}`;
    fs.rmSync(tmp, { recursive: true, force: true });
    throw new Error(msg.trim() || "Pack failed");
  }
  const hit = log.match(/→ packs\/([a-z0-9_]+)\//i) || log.match(/Packing .+ \(([a-z0-9_]+)\)/i);
  const id = hit ? hit[1] : null;
  if (!id) {
    fs.rmSync(tmp, { recursive: true, force: true });
    throw new Error("Could not detect pack id from packer output");
  }
  const packDir = path.join(ROOT, "packs", id);
  const outZip = new JSZip();
  for (const f of ["character.json", "atlas.png", "atlas.json"]) {
    const fp = path.join(packDir, f);
    if (fs.existsSync(fp)) outZip.file(f, fs.readFileSync(fp));
  }
  const outBuf = await outZip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  fs.rmSync(tmp, { recursive: true, force: true });
  return { id, buf: outBuf };
}

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const rel = clean === "/" ? "/index.html" : clean;
  const full = path.normalize(path.join(ROOT, rel.replace(/^\//, "")));
  if (!full.startsWith(ROOT)) return null;
  return full;
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, "");

  if (req.url === "/health" && req.method === "GET") {
    return send(res, 200, JSON.stringify({ ok: true, packer: true }), "application/json");
  }

  if ((req.url === "/pack" || req.url === "/api/pack") && req.method === "POST") {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const buf = Buffer.concat(chunks);
    if (!buf.length) {
      return send(res, 400, JSON.stringify({ error: "Empty body — POST a .zip" }), "application/json");
    }
    try {
      console.log(`Packing upload (${(buf.length / 1024 / 1024).toFixed(1)} MB)…`);
      const { id, buf: out } = await packZipBuffer(buf);
      console.log(`Packed ${id}`);
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
      return send(res, 500, JSON.stringify({ error: err.message || String(err) }), "application/json");
    }
  }

  const filePath = safePath(req.url || "/");
  if (!filePath) return send(res, 403, "Forbidden");
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return send(res, 404, `Not found: ${req.url}`);
    }
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, MIME[ext] || "application/octet-stream");
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`mugenSkel dev server → http://127.0.0.1:${PORT}`);
  console.log(`  Drop MUGEN .zip on the page to pack`);
  console.log(`  RAR not supported — zip the char folder first`);
});
