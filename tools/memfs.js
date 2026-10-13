/**
 * Minimal in-memory fs for browser packer (esbuild aliases Node `fs` here).
 */
const path = require("path");

/** @type {Map<string, Buffer | { __dir: true }>} */
const store = new Map();

function norm(p) {
  let s = String(p).replace(/\\/g, "/");
  if (!s.startsWith("/")) s = `/${s}`;
  s = s.replace(/\/+/g, "/");
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s;
}

function ensureParentDirs(filePath) {
  const parts = norm(filePath).split("/").filter(Boolean);
  let cur = "";
  for (let i = 0; i < parts.length - 1; i++) {
    cur += `/${parts[i]}`;
    if (!store.has(cur)) store.set(cur, { __dir: true });
  }
}

function isDir(entry) {
  return entry && typeof entry === "object" && entry.__dir === true;
}

const fs = {
  __reset() {
    store.clear();
  },

  existsSync(p) {
    return store.has(norm(p));
  },

  mkdirSync(p, opts) {
    const n = norm(p);
    if (opts && opts.recursive) {
      const parts = n.split("/").filter(Boolean);
      let cur = "";
      for (const part of parts) {
        cur += `/${part}`;
        if (!store.has(cur)) store.set(cur, { __dir: true });
        else if (!isDir(store.get(cur)) && store.get(cur)) {
          /* file in the way — ignore for packer */
        }
      }
      return;
    }
    if (!store.has(n)) store.set(n, { __dir: true });
  },

  writeFileSync(p, data) {
    const n = norm(p);
    ensureParentDirs(n);
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
    store.set(n, buf);
  },

  readFileSync(p, encoding) {
    const n = norm(p);
    const entry = store.get(n);
    if (!entry || isDir(entry)) {
      const err = new Error(`ENOENT: no such file '${p}'`);
      err.code = "ENOENT";
      throw err;
    }
    if (encoding === "utf8" || encoding === "utf-8") return entry.toString("utf8");
    if (encoding === "latin1" || encoding === "binary" || encoding === "ascii") {
      return entry.toString(encoding === "ascii" ? "ascii" : "latin1");
    }
    return entry;
  },

  copyFileSync(src, dest) {
    const data = fs.readFileSync(src);
    fs.writeFileSync(dest, data);
  },

  readdirSync(p) {
    const n = norm(p);
    const prefix = n === "/" ? "/" : `${n}/`;
    const names = new Set();
    for (const key of store.keys()) {
      if (!key.startsWith(prefix)) continue;
      const rest = key.slice(prefix.length);
      if (!rest) continue;
      const name = rest.split("/")[0];
      if (name) names.add(name);
    }
    return [...names];
  },

  statSync(p) {
    const n = norm(p);
    const entry = store.get(n);
    if (!entry) {
      const err = new Error(`ENOENT: no such file '${p}'`);
      err.code = "ENOENT";
      throw err;
    }
    if (isDir(entry)) {
      return { isDirectory: () => true, isFile: () => false, size: 0 };
    }
    return { isDirectory: () => false, isFile: () => true, size: entry.length };
  },

  rmSync(p, opts) {
    const n = norm(p);
    if (opts && opts.recursive) {
      for (const key of [...store.keys()]) {
        if (key === n || key.startsWith(`${n}/`)) store.delete(key);
      }
      return;
    }
    store.delete(n);
  },
};

module.exports = fs;
