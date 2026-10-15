/**
 * Hitman Spine Character Lab — serves only /preview and /generated on 127.0.0.1.
 * Default: http://127.0.0.1:5180/preview/index.html
 */
import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.atlas': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function contained(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

export function createPreviewServer(root = projectRoot) {
  const server = createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'",
    );
    const respond = (status, message) => {
      res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : message);
    };
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
      if (requestPath.includes('\\') || requestPath.includes('\0')) {
        respond(400, 'Invalid path');
        return;
      }
      const parts = requestPath.split('/').filter(Boolean);
      if (!['preview', 'generated'].includes(parts[0]) || parts.some((part) => part === '..' || part.includes(':'))) {
        respond(404, 'Not found');
        return;
      }
      const allowedRoot = await realpath(path.join(root, parts[0]));
      const candidate = path.resolve(root, ...parts);
      if (!contained(path.join(root, parts[0]), candidate)) {
        respond(404, 'Not found');
        return;
      }
      const actual = await realpath(candidate);
      if (!contained(allowedRoot, actual) || !(await stat(actual)).isFile()) {
        respond(404, 'Not found');
        return;
      }
      const contentType = types[path.extname(actual).toLowerCase()];
      if (!contentType) {
        respond(404, 'Not found');
        return;
      }
      const bytes = await readFile(actual);
      res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': bytes.length });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      if (error instanceof URIError) respond(400, 'Invalid URL');
      else if (['ENOENT', 'ENOTDIR', 'EACCES', 'EPERM'].includes(error.code)) respond(404, 'Not found');
      else respond(500, 'Unable to serve file');
    }
  });
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT ?? 5180);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer between 1 and 65535');
  const server = createPreviewServer();
  server.on('error', (error) => {
    console.error(`Preview server failed: ${error.message}`);
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () => {
    console.log(`Hitman Spine Lab: http://127.0.0.1:${port}/preview/index.html`);
  });
}
