import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { randomBytes, createHmac, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { StringDecoder } from 'node:string_decoder';
import { toLuau } from './export-movement.mjs';
import { MovementBridgeError } from './movement-bridge.mjs';

const rootDefault = fileURLToPath(new URL('../', import.meta.url));
const prefix = 'RIFT_SOURCE_COMBAT_V1:';
const keys = ['left', 'right', 'up', 'down', 'x', 'y', 'z', 'a', 'b', 'c', 's'];
const fail = (status, message) => { throw new MovementBridgeError(status, message); };
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
export function validateSourceCombatRequest(value) {
  if (!record(value) || Object.keys(value).some(key => !['snapshot', 'inputs', 'ticks', 'intro'].includes(key))
      || (Object.hasOwn(value, 'intro') && typeof value.intro !== 'boolean')
      || !Number.isInteger(value.ticks) || value.ticks < 0 || value.ticks > 6
      || !Array.isArray(value.inputs) || value.inputs.length !== 2
      || value.inputs.some(input => !record(input) || Object.entries(input).some(([key, held]) => !keys.includes(key) || typeof held !== 'boolean'))
      || !Object.hasOwn(value, 'snapshot') || (value.snapshot !== null && !record(value.snapshot))) {
    fail(400, 'Provide two boolean fighter inputs, ticks from 0 through 6, and the previous source-combat snapshot or null.');
  }
  return value;
}
function literal(value) {
  if (value === null) return 'nil';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'string' || typeof value === 'number') return toLuau(value);
  return `{${Object.entries(value).map(([key, item]) => {
    const index = Array.isArray(value) ? Number(key) + 1 : /^(?:0|[1-9]\d*)$/.test(key) ? Number(key) : key;
    return `[${toLuau(index)}]=${literal(item)}`;
  }).join(',')}}`;
}
function script(payload, persistent = false, powerRegenPerSecond = 0) {
  return `local Combat = require('../../runtime/MugenCombat')
local config = require('../../generated/luau/coiny-checkpoint')
local program = Combat.compile({config, config})
local snapshot = nil
local inputs = nil
local function quote(s)
  return '"' .. string.gsub(s, '[%z\\1-\\31"\\\\]', function(c)
    if c == '"' then return '\\\\"' end
    if c == '\\\\' then return '\\\\\\\\' end
    return string.format('\\\\u%04x', string.byte(c))
  end) .. '"'
end
local function json(value)
  local kind = type(value)
  if kind == 'number' then
    assert(value == value and math.abs(value) < math.huge, 'Nonfinite result')
    return string.format('%.17g', value)
  elseif kind == 'boolean' then return if value then 'true' else 'false'
  elseif kind == 'string' then return quote(value)
  elseif kind == 'nil' then return 'null' end
  assert(kind == 'table', 'Unsupported output')
  local count, array = 0, #value > 0
  for key in value do
    count += 1
    if type(key) ~= 'number' or key % 1 ~= 0 or key < 1 or key > #value then array = false end
  end
  array = array and count == #value
  local parts = {}
  if array then
    for _, item in value do table.insert(parts, json(item)) end
  else
    for key, item in value do table.insert(parts, quote(tostring(key)) .. ':' .. json(item)) end
  end
  return (if array then '[' else '{') .. table.concat(parts, ',') .. (if array then ']' else '}')
end
local function emit() print('${prefix}' .. json(snapshot)) end
local function advance()
 local regenerate = not snapshot.intro and not snapshot.finished
 snapshot = Combat.step(program, snapshot, inputs)
 if regenerate and not snapshot.finished then
  for _, fighter in snapshot.fighters do
   fighter.state.power = math.min(3000, fighter.state.power + ${powerRegenPerSecond} / Combat.TICKS_PER_SECOND)
  end
 end
 emit()
end
${persistent ? `return function(previous, input, ticks, intro)
 snapshot = previous or Combat.new(program, {-20,20}, intro)
 inputs = input
 emit()
 for _ = 1, ticks do advance() end
 print('RIFT_SOURCE_DONE')
  -- The CLI buffers piped stdout; padding flushes the completed response without closing stdin.
  print(string.rep(' ', 8192))
 end` : `snapshot = ${payload.snapshot === null ? `Combat.new(program, {-20,20}, ${payload.intro === true})` : literal(payload.snapshot)}
inputs = ${literal(payload.inputs)}
emit()
for _ = 1, ${payload.ticks} do advance() end`}
`;
}
function execute(executable, file, timeoutMs, maxOutputBytes) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, [file], { shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let error, size = 0;
    const chunks = [];
    const stop = message => { error ??= new MovementBridgeError(504, message); child.kill(); };
    const timer = setTimeout(() => stop('Source combat batch timed out.'), timeoutMs);
    for (const [stream, collect] of [[child.stdout, true], [child.stderr, false]]) stream.on('data', chunk => {
      size += chunk.length;
      if (size > maxOutputBytes) stop('Source combat output exceeded its limit.');
      else if (collect) chunks.push(chunk);
    });
    child.once('error', () => { error = new MovementBridgeError(503, 'Luau unavailable. Run npm run setup:luau or set LUAU_BIN_DIR.'); });
    child.once('close', code => {
      clearTimeout(timer);
      if (error) reject(error);
      else if (code !== 0) reject(new MovementBridgeError(500, 'Source combat execution failed. Regenerate the checkpoint with npm run export:mugen-checkpoint.'));
      else resolve(Buffer.concat(chunks).toString('utf8'));
    });
  });
}

function persistentWorker(executable, file, cwd, timeoutMs, maxOutputBytes, dispose) {
  const child = spawn(executable, [], { cwd, shell: false, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
  let pending = null, closed = false, idleTimer;
  const decoder = new StringDecoder('utf8');
  const close = () => {
    if (closed) return;
    closed = true; clearTimeout(idleTimer);
    child.kill();
  };
  child.stdin.on('error', () => {});
  child.stdout.on('data', chunk => {
      const text = decoder.write(chunk);
      if (!pending) return;
    pending.size += chunk.length;
    if (pending.size > maxOutputBytes) { pending.reject(new MovementBridgeError(504, 'Source combat output exceeded its limit.')); close(); return; }
    pending.output += text.replace(/^ +$/gm, '');
    if (pending.output.includes('RIFT_SOURCE_DONE')) {
      const current = pending; pending = null; clearTimeout(current.timer);
      current.resolve(current.output.split(/\r?\n/).filter(line => line.startsWith(prefix)).join('\n'));
      idleTimer = setTimeout(close, 10000); idleTimer.unref();
    }
  });
  child.stderr.on('data', () => {
    if (pending) pending.reject(new MovementBridgeError(500, 'Source combat execution failed. Regenerate the checkpoint.'));
    close();
  });
  child.once('error', () => {
    if (pending) pending.reject(new MovementBridgeError(503, 'Luau unavailable. Run npm run setup:luau or set LUAU_BIN_DIR.'));
    close();
  });
  child.once('close', () => {
    closed = true; clearTimeout(idleTimer);
    if (pending) { clearTimeout(pending.timer); pending.reject(new MovementBridgeError(500, 'Source combat worker stopped.')); pending = null; }
    void dispose();
  });
  child.stdin.write(`riftBatch = require(${toLuau('.\\' + path.basename(path.dirname(file)) + '\\batch')})\n`);
  return {
    get closed() { return closed; }, get busy() { return pending !== null; }, close,
    run(payload) {
      clearTimeout(idleTimer);
      return new Promise((resolve, reject) => {
        pending = { resolve, reject, output: '', size: 0, timer: setTimeout(() => {
          reject(new MovementBridgeError(504, 'Source combat batch timed out.')); close();
        }, timeoutMs) };
        child.stdin.write(`riftBatch(${literal(payload.snapshot)}, ${literal(payload.inputs)}, ${payload.ticks}, ${payload.intro === true})\n`);
      });
    },
  };
}

/** Local diagnostic bridge with reusable compiled workers; snapshots are not multiplayer authority. */
export function createSourceCombatBridge(root = rootDefault, {
  binDir = process.env.LUAU_BIN_DIR ?? path.join(root, '.tools', 'luau-0.741'), timeoutMs = 2000,
  maxOutputBytes = 1024 * 1024, persistent = false, powerRegenPerSecond = 0,
} = {}) {
    if (!Number.isFinite(powerRegenPerSecond) || powerRegenPerSecond < 0) throw new TypeError('Invalid preview power regeneration rate.');
    const secret = randomBytes(32);
  const sign = snapshot => createHmac('sha256', secret).update(JSON.stringify(snapshot)).digest('hex');
  const executable = path.join(path.resolve(binDir), process.platform === 'win32' ? 'luau.exe' : 'luau');
  let active = 0;
    const workers = new Set();
    const bridge = async request => {
    validateSourceCombatRequest(request);
    const payload = structuredClone(request);
    if (payload.snapshot !== null) {
      const token = payload.snapshot.bridgeToken;
      delete payload.snapshot.bridgeToken;
      const expected = sign(payload.snapshot);
      if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)
          || !timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'))) {
        fail(400, 'Source combat snapshot is invalid or from an old server. Reset the match.');
      }
    }
    if (active >= 2) fail(503, 'Source combat preview is busy.');
    active++;
    let directory;
    try {
      const actualRoot = await fs.realpath(root);
      const tools = path.join(actualRoot, '.tools');
      await fs.mkdir(tools, { recursive: true });
      const stat = await fs.lstat(tools);
      if (!stat.isDirectory() || stat.isSymbolicLink() || await fs.realpath(tools) !== tools) fail(500, 'Unsafe local combat work directory.');
      let worker = persistent ? [...workers].find(item => !item.closed && !item.busy) : null;
            let output;
            if (!worker) {
              directory = await fs.mkdtemp(path.join(tools, 'source-combat-'));
              const file = path.join(directory, 'batch.luau');
              await fs.writeFile(file, script(payload, persistent, powerRegenPerSecond), { flag: 'wx', mode: 0o600 });
              if (persistent) {
                const ownedDirectory = directory;
                worker = persistentWorker(executable, file, tools, timeoutMs, maxOutputBytes, async () => {
                  workers.delete(worker);
                  await fs.rm(ownedDirectory, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
                });
                workers.add(worker); directory = null;
              } else output = await execute(executable, file, timeoutMs, maxOutputBytes);
            }
            if (worker) output = await worker.run(payload);
      const lines = output.trim().split(/\r?\n/);
      if (lines.length !== payload.ticks + 1 || lines.some(line => !line.startsWith(prefix))) fail(500, 'Invalid source combat response.');
      const results = lines.map(line => JSON.parse(line.slice(prefix.length)));
      for (const [index, match] of results.entries()) {
        if (!record(match) || !Array.isArray(match.fighters) || match.fighters.length !== 2
            || match.tick !== (payload.snapshot?.tick ?? 0) + index) fail(500, 'Invalid source combat tick sequence.');
        for (const key of ['events', 'projectiles', 'effects']) if (!Array.isArray(match[key])) match[key] = [];
        for (const fighter of match.fighters) if (!Array.isArray(fighter.state.events)) fighter.state.events = [];
      }
      const snapshot = results.at(-1);
      snapshot.bridgeToken = sign(snapshot);
      return { snapshot, snapshots: results.slice(1), ticksPerSecond: 60,
        warnings: [...(powerRegenPerSecond ? [`Preview training power: both players regenerate ${powerRegenPerSecond} per simulated second, capped at 3000.`] : []), 'Coiny player gameplay with source visuals; audio is disabled. Missing common fightfx artwork uses procedural visual fallbacks. No body pushing or multiplayer authority; screen bounds are approximate.'] };
    } catch (error) {
      if (error instanceof MovementBridgeError) throw error;
      fail(500, 'Unable to run source combat. Check the exported checkpoint and local Luau setup.');
    } finally {
      try { if (directory) await fs.rm(directory, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 }); }
      finally { active--; }
    }
  };
        bridge.close = () => { for (const worker of workers) worker.close(); };
        return bridge;
      }
