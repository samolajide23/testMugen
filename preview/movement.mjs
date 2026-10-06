export function createMovementClient({ fetchImpl = fetch, onSnapshot, onError, onWarnings = () => {} }) {
  let generation = 0, pending = null, snapshot = null, characterId = null;
  function cancel(forget = false) {
    generation++;
    pending?.controller.abort();
    pending = null;
    if (forget) { snapshot = null; characterId = null; }
  }
  async function request(input, ticks, facing = 1) {
    if (pending || !characterId) return false;
    const current = { generation, controller: new AbortController() };
    pending = current;
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; current.controller.abort(); }, 5000);
    try {
      const response = await fetchImpl('/api/movement', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Rift-Movement': '1' },
        body: JSON.stringify({ characterId, snapshot, input, ticks, facing }), signal: current.controller.signal,
      });
      const body = await response.json().catch(() => { throw new Error('Movement bridge unavailable. Restart the local preview server.'); });
      if (generation !== current.generation) return false;
      if (!response.ok) throw new Error(body.error ?? `Movement request failed (${response.status})`);
      if (!body.snapshot || !Array.isArray(body.snapshots) || body.snapshots.length !== ticks || body.ticksPerSecond !== 60) throw new Error('Invalid movement bridge response. Restart the local server.');
      snapshot = body.snapshot;
      onWarnings(body.warnings ?? []);
      for (const state of ticks ? body.snapshots : [snapshot]) onSnapshot(state);
      return true;
    } catch (error) {
      if (generation === current.generation && (!current.controller.signal.aborted || timedOut)) {
        onError(timedOut ? new Error('Luau bridge timed out. Restart the local server.') : error);
      }
      return false;
    } finally {
      clearTimeout(timer);
      if (pending === current) pending = null;
    }
  }
  return {
    get pending() { return pending !== null; },
    get ready() { return snapshot !== null; },
    cancel,
    reset(id, facing = 1) { cancel(true); characterId = id; return request({}, 0, facing); },
    advance(input, ticks = 1) { return snapshot ? request(input, ticks) : Promise.resolve(false); },
  };
}
