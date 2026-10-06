import test from 'node:test';
import assert from 'node:assert/strict';
import { request } from 'node:http';
import { createPreviewServer } from '../tools/preview-server.mjs';
import { validateZipSelection } from '../preview/upload.mjs';

async function serve(t, options) {
  const server = createPreviewServer(process.cwd(), options);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }));
  const base = `http://127.0.0.1:${server.address().port}`;
  const headers = { Origin: base, 'Content-Type': 'application/zip', 'X-Rift-Import': '1', 'X-Character-Filename': 'Test%20Character.zip' };
  const post = (overrides = {}) => fetch(`${base}/api/import-zip`, { method: 'POST', headers, body: Buffer.from('zip'), ...overrides });
  return { base, headers, post };
}

test('upload requires POST, exact local origin, host, custom header and ZIP content type', async (t) => {
  const { base, headers, post } = await serve(t, { importZip: () => { throw new Error('Must not import'); } });
  assert.equal((await fetch(`${base}/api/import-zip`)).status, 405);
  for (const changed of [{ Origin: 'https://example.com' }, { Origin: '' }, { 'X-Rift-Import': '' }]) {
    assert.equal((await post({ headers: { ...headers, ...changed } })).status, 403);
  }
  const hostStatus = await new Promise((resolve, reject) => {
    const req = request(`${base}/api/import-zip`, { method: 'POST', headers: { ...headers, Host: 'attacker.example' } }, (res) => {
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('error', reject);
    req.end('zip');
  });
  assert.equal(hostStatus, 403);
  assert.equal((await post({ headers: { ...headers, 'Content-Type': 'text/plain' } })).status, 415);
  for (const filename of ['not.rar', '..%2Fbad.zip', 'bad%5Cfile.zip', 'bad%00.zip', '%xx.zip']) {
    assert.equal((await post({ headers: { ...headers, 'X-Character-Filename': filename } })).status, 400);
  }
});

test('upload passes bytes and decoded filename to service and returns saved character', async (t) => {
  const result = { character: { id: 'test-character', name: 'Test', url: 'test-character/character.json' }, savedFolder: 'chars/test-character', warnings: [], counts: {} };
  const { post } = await serve(t, { importZip: async (buffer, options) => {
    assert.equal(buffer.toString(), 'zip');
    assert.equal(options.root, process.cwd());
    assert.equal(options.filename, 'Test Character.zip');
    return result;
  } });
  const response = await post();
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), result);
});

test('upload bounds both declared and chunked bodies before invoking importer', async (t) => {
  let calls = 0;
  const { base, headers, post } = await serve(t, { maxUploadBytes: 2, importZip: () => { calls++; } });
  assert.equal((await post()).status, 413);
  const status = await new Promise((resolve, reject) => {
    const req = request(`${base}/api/import-zip`, { method: 'POST', headers }, (res) => {
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('error', reject);
    req.write('ab');
    req.end('c');
  });
  assert.equal(status, 413);
  assert.equal(calls, 0);
});

test('concurrent uploads are rejected and lock is released after completion', async (t) => {
  let release;
  let entered;
  const started = new Promise((resolve) => { entered = resolve; });
  const gate = new Promise((resolve) => { release = resolve; });
  let calls = 0;
  const { post } = await serve(t, { importZip: async () => { calls++; entered(); await gate; return { character: { id: 'test' } }; } });
  const first = post();
  await started;
  assert.equal((await post()).status, 409);
  release();
  assert.equal((await first).status, 201);
  assert.equal((await post()).status, 201);
  assert.equal(calls, 2);
});

test('service errors preserve expected statuses without leaking internal errors and release lock', async (t) => {
  let statusCode = 422;
  const { post } = await serve(t, { importZip: () => { throw Object.assign(new Error('internal disk path'), { statusCode }); } });
  for (const code of [400, 409, 413, 422, 500]) {
    statusCode = code;
    const response = await post();
    assert.equal(response.status, code);
    const data = await response.json();
    if (code === 500) assert.doesNotMatch(data.error, /internal disk path/);
  }
});

test('file picker validates a single nonempty ZIP within size limit', () => {
  const zip = { name: 'Test.ZIP', size: 10 };
  assert.equal(validateZipSelection([zip]), null);
  for (const files of [[], [zip, zip], [{ ...zip, name: 'test.rar' }], [{ ...zip, size: 0 }], [{ ...zip, size: 50 * 1024 * 1024 + 1 }]]) {
    assert.equal(typeof validateZipSelection(files), 'string');
  }
});
