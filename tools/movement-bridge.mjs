import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildMovementConfig, toLuau } from './export-movement.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const fields = ['tick', 'state', 'stateTicks', 'x', 'y', 'vx', 'vy', 'facing', 'animation', 'jumpHeld', 'jumpDirection'];
const states = ['idle', 'walk', 'crouchDown', 'crouch', 'crouchUp', 'jumpStart', 'air', 'land'];
const animationIds = [0, 20, 21, 10, 11, 12, 40, 41, 42, 43, 47];
const animationNames = ['idle', 'walkForward', 'walkBackward', 'crouchDown', 'crouch', 'crouchUp', 'jumpStart', 'jumpNeutral', 'jumpForward', 'jumpBackward', 'land'];
const setupMessage = 'Luau CLI unavailable. On Windows run npm run setup:luau, or set LUAU_BIN_DIR to an official Luau CLI directory.';
const prefix = 'RIFT_MOVEMENT_V1:';

export class MovementBridgeError extends Error {
  constructor(statusCode, message) { super(message); this.statusCode = statusCode; }
}
const fail = (status, message) => { throw new MovementBridgeError(status, message); };
const bounded = (value, min, max) => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
const integer = (value, min, max) => Number.isInteger(value) && bounded(value, min, max);
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
const keysOnly = (value, keys) => record(value) && Object.keys(value).every(key => keys.includes(key));

function validSnapshot(value) {
  return keysOnly(value, fields) && fields.every(key => Object.hasOwn(value, key))
    && integer(value.tick, 0, 1e9) && integer(value.stateTicks, 0, value.tick)
    && states.includes(value.state) && bounded(value.x, -200, 200) && bounded(value.y, -1e9, 0)
    && bounded(value.vx, -1e6, 1e6) && bounded(value.vy, -1e6, 1e6)
    && [1, -1].includes(value.facing) && (value.animation === null || animationIds.includes(value.animation))
    && typeof value.jumpHeld === 'boolean' && [-1, 0, 1].includes(value.jumpDirection);
}

export function validateMovementRequest(value) {
  if (!keysOnly(value, ['characterId', 'snapshot', 'input', 'ticks', 'facing'])
      || typeof value.characterId !== 'string' || value.characterId.length > 120
      || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.characterId)) {
    fail(400, 'Provide a valid imported characterId and movement payload.');
  }
  if (!Object.hasOwn(value, 'snapshot') || (value.snapshot !== null && !validSnapshot(value.snapshot))) {
    fail(400, 'snapshot must be null or a complete bounded Movement snapshot (including animation: null when absent).');
  }
  if (!keysOnly(value.input, ['left', 'right', 'down', 'jump']) || Object.values(value.input).some(v => typeof v !== 'boolean')) {
    fail(400, 'input accepts only optional boolean left, right, down, and jump fields.');
  }
  if (!integer(value.ticks, 0, 6)) fail(400, 'ticks must be an integer from 0 through 6.');
  if (Object.hasOwn(value, 'facing') && ![1, -1].includes(value.facing)) fail(400, 'facing must be 1 or -1.');
  return value;
}

function contained(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

async function selectedConfig(root, id) {
  const generated = await fs.realpath(path.join(root, 'generated'));
  if (!contained(root, generated)) fail(400, 'Imported character directory must remain inside the project.');
  const manifestFile = await fs.realpath(path.join(generated, 'characters.json'));
  if (!contained(generated, manifestFile)) fail(400, 'Character manifest must remain inside generated.');
  const manifest = JSON.parse(await fs.readFile(manifestFile, 'utf8'));
  if (!Array.isArray(manifest.characters)) fail(400, 'Reimport the character: invalid character manifest.');
  const entries = manifest.characters.filter(entry => record(entry) && entry.id === id);
  if (entries.length !== 1 || entries[0].url !== `${id}/character.json`) fail(400, 'Select a uniquely listed imported character with a valid manifest URL.');
  const file = await fs.realpath(path.join(generated, id, 'character.json'));
  if (!contained(generated, file)) fail(400, 'Character file must remain inside generated.');
  const character = JSON.parse(await fs.readFile(file, 'utf8'));
  if (!record(character) || character.id !== id) fail(400, 'Reimport the character: character ID does not match its manifest.');
  const result = buildMovementConfig(character);
  const config = result.config;
  if (!bounded(config.walkForward, 0, 1e6) || !bounded(config.walkBackward, -1e6, 0)
      || !bounded(config.gravity, Number.MIN_VALUE, 1e6)
      || ['jumpNeutral', 'jumpForward', 'jumpBackward'].some(key => !bounded(config[key].x, -1e6, 1e6) || !bounded(config[key].y, -1e6, -Number.MIN_VALUE))
      || ['crouchDownTicks', 'crouchUpTicks', 'jumpStartTicks', 'landTicks'].some(key => !integer(config[key], 1, 1e6))
      || !keysOnly(config.animations, animationNames) || Object.values(config.animations).some(id => !animationIds.includes(id))) {
    fail(400, 'Imported movement settings exceed the bounded diagnostic range.');
  }
  return result;
}

// Only validated, known-schema objects reach this encoder; no request text is executable Luau.
function literal(value) {
  if (value === null) return 'nil';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number' || typeof value === 'string') return toLuau(value);
  return `{${Object.entries(value).map(([key, entry]) => `[${toLuau(key)}]=${literal(entry)}`).join(',')}}`;
}

function script(config, payload) {
  return `local Movement = require("../../runtime/Movement")
local config = ${literal(config)}
local input = ${literal(payload.input)}
local snapshot = ${payload.snapshot === null ? `Movement.new(config, 0, ${literal(payload.facing ?? 1)})` : literal(payload.snapshot)}
local function emit(s)
  local parts = {}
  for _, key in {${fields.map(toLuau).join(',')}} do
    local value = s[key]
    local encoded
    if value == nil then encoded = "null"
    elseif type(value) == "boolean" then encoded = if value then "true" else "false"
    elseif type(value) == "number" then
      assert(value == value and math.abs(value) < math.huge, "Nonfinite result")
      encoded = string.format("%.17g", value)
    else
      assert(key == "state", "Unexpected string field")
      encoded = '"' .. value .. '"'
    end
    table.insert(parts, '"' .. key .. '":' .. encoded)
  end
  print("${prefix}" .. "{" .. table.concat(parts, ",") .. "}")
end
emit(snapshot)
for _ = 1, ${payload.ticks} do
  snapshot = Movement.step(config, snapshot, input, { minX = -200, maxX = 200 })
  emit(snapshot)
end
`;
}

function execute(executable, file, directory, { timeoutMs, maxOutputBytes, spawnWorker }) {
  return new Promise((resolve, reject) => {
    let child;
    try { child = spawnWorker(executable, [file], { cwd: directory, shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] }); }
    catch { reject(new MovementBridgeError(503, setupMessage)); return; }
    let failure, bytes = 0;
    const chunks = [];
    const stop = error => { if (!failure) failure = error; child.kill(); };
    const timer = setTimeout(() => stop(new MovementBridgeError(504, 'Luau movement batch timed out. Retry with fewer ticks.')), timeoutMs);
    const consume = (chunk, stdout) => {
      bytes += chunk.length;
      if (bytes > maxOutputBytes) { stop(new MovementBridgeError(500, 'Luau movement output exceeded the diagnostic limit.')); return; }
      if (stdout && !failure) chunks.push(chunk);
    };
    child.stdout.on('data', chunk => consume(chunk, true));
    child.stderr.on('data', chunk => consume(chunk, false));
    child.once('error', error => { failure ??= new MovementBridgeError(error.code === 'ENOENT' || error.code === 'EACCES' ? 503 : 500, error.code === 'ENOENT' || error.code === 'EACCES' ? setupMessage : 'Unable to execute Luau movement batch.'); });
    child.once('close', code => {
      clearTimeout(timer);
      if (failure) reject(failure);
      else if (code !== 0) reject(new MovementBridgeError(500, 'Luau movement batch failed. Check the imported movement settings and local CLI.'));
      else resolve(Buffer.concat(chunks).toString('utf8'));
    });
  });
}

function parseOutput(output, ticks) {
  const lines = output.trim().split(/\r?\n/);
  if (lines.length !== ticks + 1) fail(500, 'Invalid Luau movement response.');
  const snapshots = lines.map(line => {
    if (!line.startsWith(prefix)) fail(500, 'Invalid Luau movement response.');
    let snapshot;
    try { snapshot = JSON.parse(line.slice(prefix.length)); } catch { fail(500, 'Invalid Luau movement response.'); }
    if (!validSnapshot(snapshot)) fail(500, 'Luau returned a snapshot outside the diagnostic range.');
    return snapshot;
  });
  for (let i = 1; i < snapshots.length; i++) {
    if (snapshots[i].tick !== snapshots[0].tick + i) fail(500, 'Invalid Luau movement tick sequence.');
  }
  return { snapshot: snapshots.at(-1), snapshots: snapshots.slice(1) };
}

/** Stateless local diagnostic, not multiplayer authority. Each call runs the real core in a disposable CLI. */
export function createMovementBridge(root = projectRoot, {
  binDir = process.env.LUAU_BIN_DIR ?? path.join(root, '.tools', 'luau-0.741'),
  timeoutMs = 2000, maxOutputBytes = 64 * 1024, spawnWorker = spawn,
} = {}) {
  let active = 0;
  const executable = path.join(path.resolve(binDir), process.platform === 'win32' ? 'luau.exe' : 'luau');
  return async payload => {
    // Copy before awaiting so a caller cannot mutate validated data during file reads.
    validateMovementRequest(payload);
    payload = structuredClone(payload);
    if (active >= 2) fail(503, 'Movement preview is busy. Retry after the current batches finish.');
    active++;
    let directory;
    try {
      const actualRoot = await fs.realpath(root);
      let result;
      try { result = await selectedConfig(actualRoot, payload.characterId); }
      catch (error) {
        if (error instanceof MovementBridgeError) throw error;
        fail(400, 'Unable to read imported movement data. Import the selected character again.');
      }
      try { await fs.access(executable, fs.constants.X_OK); } catch { fail(503, setupMessage); }
      const tools = path.join(actualRoot, '.tools');
      await fs.mkdir(tools, { recursive: true, mode: 0o700 });
      const info = await fs.lstat(tools);
      if (!info.isDirectory() || info.isSymbolicLink() || await fs.realpath(tools) !== tools) fail(500, 'Unsafe local movement work directory.');
      directory = await fs.mkdtemp(path.join(tools, 'movement-'));
      await fs.chmod(directory, 0o700);
      const file = path.join(directory, 'batch.luau');
      await fs.writeFile(file, script(result.config, payload), { flag: 'wx', mode: 0o600 });
      const output = await execute(executable, file, directory, { timeoutMs, maxOutputBytes, spawnWorker });
      return { ...parseOutput(output, payload.ticks), warnings: result.warnings, ticksPerSecond: 60 };
    } catch (error) {
      if (error instanceof MovementBridgeError) throw error;
      fail(500, 'Unable to run local Luau movement. Check the project work directory and CLI setup.');
    } finally {
      try { if (directory) await fs.rm(directory, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 }); }
      finally { active--; }
    }
  };
}
