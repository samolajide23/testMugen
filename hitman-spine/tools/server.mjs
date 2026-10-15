import { createServer } from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.env.PORT ?? 5180);
const skinsDir = path.join(root, 'assets', 'skins');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.atlas': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
};

const allowed = new Set(['preview', 'assets', 'vendor']);

function contained(base, target) {
  const relative = path.relative(base, target);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function titleCaseId(id) {
  return id
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** Scan assets/skins/*.png — drop a PNG in and it appears in the Skin dropdown. */
async function listSkinPngs() {
  let entries = [];
  try {
    entries = await readdir(skinsDir, { withFileTypes: true });
  } catch {
    return [];
  }
  const skins = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const match = /^(.*)\.png$/i.exec(entry.name);
    if (!match) continue;
    const id = match[1];
    if (!id || /[\\/]/.test(id)) continue;
    skins.push({
      id,
      name: titleCaseId(id),
      texture: `skins/${entry.name}`,
    });
  }
  skins.sort((a, b) => {
    if (a.id === 'hitman') return -1;
    if (b.id === 'hitman') return 1;
    return a.name.localeCompare(b.name);
  });
  return skins;
}

function sendJson(res, status, body) {
  const bytes = Buffer.from(JSON.stringify(body), 'utf8');
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': bytes.length,
  });
  res.end(bytes);
}

const server = createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const url = new URL(req.url ?? '/', `http://127.0.0.1:${port}`);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === '/' || pathname === '/index.html') {
      res.writeHead(302, { Location: '/preview/index.html' });
      res.end();
      return;
    }

    if (pathname === '/api/skins') {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.setHeader('Allow', 'GET, HEAD');
        sendJson(res, 405, { error: 'Use GET' });
        return;
      }
      let overrides = {};
      try {
        const raw = JSON.parse(await readFile(path.join(root, 'assets', 'skins.json'), 'utf8'));
        overrides = raw;
      } catch {
        overrides = {};
      }
      const discovered = await listSkinPngs();
      const nameById = new Map((overrides.skins ?? []).map((skin) => [skin.id, skin.name]));
      const skins = discovered.map((skin) => ({
        ...skin,
        name: nameById.get(skin.id) ?? skin.name,
      }));
      const body = {
        default: overrides.default && skins.some((s) => s.id === overrides.default)
          ? overrides.default
          : (skins.find((s) => s.id === 'hitman')?.id ?? skins[0]?.id ?? null),
        rig: overrides.rig ?? {
          skeleton: 'Hitman.json',
          atlas: 'Hitman.atlas',
        },
        skins,
        source: 'assets/skins/*.png',
      };
      if (req.method === 'HEAD') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end();
        return;
      }
      sendJson(res, 200, body);
      return;
    }

    const parts = pathname.split('/').filter(Boolean);
    if (!allowed.has(parts[0]) || parts.some((part) => part === '..' || part.includes(':'))) {
      res.writeHead(404).end('Not found');
      return;
    }
    const file = path.resolve(root, ...parts);
    if (!contained(path.join(root, parts[0]), file) || !(await stat(file)).isFile()) {
      res.writeHead(404).end('Not found');
      return;
    }
    const type = types[path.extname(file).toLowerCase()];
    if (!type) {
      res.writeHead(404).end('Not found');
      return;
    }
    const bytes = await readFile(file);
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': bytes.length });
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch {
    res.writeHead(500).end('Server error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Hitman Spine → http://127.0.0.1:${port}/`);
  console.log(`Skins auto-read from ${path.relative(root, skinsDir)}/*.png → /api/skins`);
});
