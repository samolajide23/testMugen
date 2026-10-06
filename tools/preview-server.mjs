import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createMovementBridge, MovementBridgeError, validateMovementRequest } from './movement-bridge.mjs';
import { createSourceCombatBridge, validateSourceCombatRequest } from './source-combat-bridge.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png' };

function contained(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

async function defaultImportZip(buffer, options) {
  const { importCharacterZip } = await import('./zip-import.mjs');
  return importCharacterZip(buffer, options);
}

function readUpload(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let stopped = false;
    const timer = setTimeout(() => stop(408, 'Upload timed out. Try again.'), 120_000);
    const stop = (statusCode, message) => {
      if (stopped) return;
      stopped = true;
      clearTimeout(timer);
      chunks.length = 0;
      reject(Object.assign(new Error(message), { statusCode }));
    };
    req.on('data', (chunk) => {
      if (stopped) return;
      size += chunk.length;
      if (size > limit) { stop(413, 'ZIP exceeds the 50 MiB upload limit.'); return; }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (stopped) return;
      stopped = true;
      clearTimeout(timer);
      resolve(Buffer.concat(chunks));
    });
    req.on('error', () => stop(400, 'Upload interrupted.'));
    req.on('aborted', () => stop(400, 'Upload interrupted.'));
  });
}

export const MAX_MOVEMENT_BYTES = 16 * 1024;
export const MAX_SOURCE_COMBAT_BYTES = 128 * 1024;

function readMovementBody(req, timeoutMs, limit = MAX_MOVEMENT_BYTES) {
  return new Promise((resolve, reject) => {
    let bytes = 0, finished = false;
    const chunks = [];
    const finish = (error) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (error) { chunks.length = 0; reject(error); }
      else resolve(Buffer.concat(chunks).toString('utf8'));
    };
    const timer = setTimeout(() => finish(new MovementBridgeError(408, 'Movement request body timed out.')), timeoutMs);
    req.on('data', chunk => {
      if (finished) return;
      bytes += chunk.length;
      if (bytes > limit) finish(new MovementBridgeError(413, `Diagnostic request exceeds ${limit / 1024} KiB.`));
      else chunks.push(chunk);
    });
    req.on('end', () => finish());
    req.on('error', () => finish(new MovementBridgeError(400, 'Movement request interrupted.')));
    req.on('aborted', () => finish(new MovementBridgeError(400, 'Movement request interrupted.')));
  });
}

export function createPreviewServer(root = projectRoot, {
  importZip = defaultImportZip, maxUploadBytes = MAX_UPLOAD_BYTES,
  movement = createMovementBridge(root), sourceCombat = createSourceCombatBridge(root, { persistent: true, powerRegenPerSecond: 1000 }), movementBodyTimeoutMs = 3000,
} = {}) {
  let importing = false;
  let movementRequests = 0;
  const server = createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'");
    const respond = (status, message) => {
      res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : message);
    };
    if (req.url === '/api/movement' || req.url === '/api/source-combat') {
      const combatRequest = req.url === '/api/source-combat';
      const limit = combatRequest ? MAX_SOURCE_COMBAT_BYTES : MAX_MOVEMENT_BYTES;
      const json = (status, body) => {
        if (res.destroyed) return;
        if (status !== 200) { res.setHeader('Connection', 'close'); req.resume(); }
        res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(body));
      };
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        json(405, { error: 'Use POST for local movement diagnostics.' });
        return;
      }
      const localHost = `127.0.0.1:${req.socket.localPort}`;
      if (req.headers.host !== localHost || req.headers.origin !== `http://${localHost}` || req.headers[combatRequest ? 'x-rift-source-combat' : 'x-rift-movement'] !== '1') {
        json(403, { error: 'Open Character Lab at its 127.0.0.1 address to preview movement.' });
        return;
      }
      if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(req.headers['content-type'] ?? '')) {
        json(415, { error: 'Movement requests require application/json.' });
        return;
      }
      if (Number(req.headers['content-length']) > limit) {
        json(413, { error: `Diagnostic request exceeds ${limit / 1024} KiB.` });
        return;
      }
      if (movementRequests >= 2) {
        json(503, { error: 'Movement preview is busy. Retry after the current batches finish.' });
        return;
      }
      movementRequests++;
      try {
        const body = await readMovementBody(req, movementBodyTimeoutMs, limit);
        let payload;
        try { payload = JSON.parse(body); }
        catch { throw new MovementBridgeError(400, 'Movement body must be valid JSON.'); }
        (combatRequest ? validateSourceCombatRequest : validateMovementRequest)(payload);
        json(200, await (combatRequest ? sourceCombat : movement)(payload));
      } catch (error) {
        const expected = error instanceof MovementBridgeError;
        json(expected ? error.statusCode : 500, { error: expected ? error.message : 'Unable to run local Luau movement.' });
      } finally {
        movementRequests--;
      }
      return;
    }
    if (req.url === '/api/import-zip') {
      const json = (status, body) => {
        if (res.destroyed) return;
        res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(body));
      };
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        json(405, { error: 'Use POST to upload a character ZIP.' });
        return;
      }
      const localHost = `127.0.0.1:${req.socket.localPort}`;
      // A custom header plus exact local origin prevents other websites from writing to disk.
      if (req.headers.host !== localHost || req.headers.origin !== `http://${localHost}` || req.headers['x-rift-import'] !== '1') {
        json(403, { error: 'Open Character Lab at its 127.0.0.1 address to import a ZIP.' });
        req.resume();
        return;
      }
      if (req.headers['content-type'] !== 'application/zip') {
        json(415, { error: 'Only ZIP uploads are accepted.' });
        req.resume();
        return;
      }
      if (Number(req.headers['content-length']) > maxUploadBytes) {
        json(413, { error: 'ZIP exceeds the 50 MiB upload limit.' });
        req.resume();
        return;
      }
      if (importing) {
        json(409, { error: 'Another character is being imported. Wait for it to finish.' });
        req.resume();
        return;
      }
      importing = true;
      try {
        const filename = decodeURIComponent(req.headers['x-character-filename'] ?? 'character.zip');
        if (!/\.zip$/i.test(filename) || /[\\/\x00-\x1f]/.test(filename) || filename.length > 240) {
          json(400, { error: 'Choose a valid character ZIP filename.' });
          req.resume();
          return;
        }
        const buffer = await readUpload(req, maxUploadBytes);
        const result = await importZip(buffer, { root, filename });
        json(201, result);
      } catch (error) {
        const status = error instanceof URIError ? 400 : error.statusCode ?? 500;
        json(status, { error: status === 500 ? 'Import failed. No existing character was overwritten.' : error.message });
      } finally {
        importing = false;
      }
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.setHeader('Allow', 'GET, HEAD');
      respond(405, 'Method not allowed');
      return;
    }
    try {
      const requestPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (requestPath === '/') {
        res.writeHead(302, { Location: '/preview/index.html' });
        res.end();
        return;
      }
      // Serve only the harness and generated outputs, never raw character or workspace files.
      if (requestPath.includes('\\') || requestPath.includes('\0')) { respond(400, 'Invalid path'); return; }
      const parts = requestPath.split('/').filter(Boolean);
      if (!['preview', 'generated'].includes(parts[0]) || parts.some((part) => part === '..' || part.includes(':'))) {
        respond(404, 'Not found'); return;
      }
      const allowedRoot = await realpath(path.join(root, parts[0]));
      const candidate = path.resolve(root, ...parts);
      if (!contained(path.join(root, parts[0]), candidate)) { respond(404, 'Not found'); return; }
      const actual = await realpath(candidate);
      if (!contained(allowedRoot, actual) || !(await stat(actual)).isFile()) { respond(404, 'Not found'); return; }
      const contentType = types[path.extname(actual).toLowerCase()];
      if (!contentType) { respond(404, 'Not found'); return; }
      const bytes = await readFile(actual);
      res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': bytes.length });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      if (error instanceof URIError) respond(400, 'Invalid URL');
      else if (['ENOENT', 'ENOTDIR', 'EACCES', 'EPERM'].includes(error.code)) respond(404, 'Not found');
      else respond(500, 'Unable to serve file');
    }
  });
  server.once('close', () => sourceCombat.close?.());
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT ?? 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer between 1 and 65535');
  const server = createPreviewServer();
  server.on('error', (error) => { console.error(`Preview server failed: ${error.message}`); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Character Lab: http://127.0.0.1:${port}/preview/index.html`));
}
