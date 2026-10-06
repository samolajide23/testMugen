import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { request } from 'node:http';
import { createSourceCombatBridge, validateSourceCombatRequest } from '../tools/source-combat-bridge.mjs';
import { createPreviewServer, MAX_SOURCE_COMBAT_BYTES } from '../tools/preview-server.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const binDir = path.resolve(process.env.LUAU_BIN_DIR ?? path.join(root, '.tools', 'luau-0.741'));
const real = { skip: await fs.access(path.join(binDir, process.platform === 'win32' ? 'luau.exe' : 'luau')).then(() => false, () => 'Install official Luau CLI') };
const payload = (snapshot = null, inputs = [{}, {}], ticks = 0) => ({ snapshot, inputs, ticks });
const status = expected => error => error.statusCode === expected;
const unsigned = snapshot => { const result = structuredClone(snapshot); delete result.bridgeToken; return result; };
test('source combat validates bounded requests before running Luau', () => {
  assert.equal(validateSourceCombatRequest(payload()).ticks, 0);
  for (const body of [null, {}, payload(null, [{}]), payload(null, [{x:1}, {}]), payload(null, [{unknown:true}, {}]), payload(null, [{},{}], 7), payload('injected'), {...payload(), file:'other'}]) {
    assert.throws(() => validateSourceCombatRequest(body), status(400));
  }
});
test('preview training power regenerates both players per tick, caps and refills after a hyper', real, async t => {
  const bridge=createSourceCombatBridge(root,{binDir,persistent:true,powerRegenPerSecond:1000});
  t.after(()=>bridge.close());
  let snapshot=(await bridge(payload())).snapshot;
  for(let i=0;i<10;i++) snapshot=(await bridge(payload(snapshot,[{},{}],6))).snapshot;
  for(const fighter of snapshot.fighters) assert.ok(Math.abs(fighter.state.power-1000)<1e-8);
  for(let i=0;i<25;i++) snapshot=(await bridge(payload(snapshot,[{},{}],6))).snapshot;
  assert.deepEqual(snapshot.fighters.map(f=>f.state.power),[3000,3000]);
  snapshot=(await bridge(payload(snapshot,[{x:true,y:true},{}],1))).snapshot;
  assert.equal(snapshot.fighters[0].state.stateNo,3000);
  assert.ok(Math.abs(snapshot.fighters[0].state.power-(2000+1000/60))<1e-8);
  for(let i=0;i<10;i++) snapshot=(await bridge(payload(snapshot,[{},{}],6))).snapshot;
  assert.equal(snapshot.fighters[0].state.power,3000);
  const intro=await bridge({...payload(null,[{},{}],6),intro:true});
  assert.deepEqual(intro.snapshot.fighters.map(f=>f.state.power),[0,0]);
  assert.match(intro.warnings.join(' '),/1000 per simulated second/);
  assert.throws(()=>createSourceCombatBridge(root,{powerRegenPerSecond:-1}),TypeError);
});
test('persistent worker matches disposable execution and reuses compiled source', real, async t => {
  const persistent=createSourceCombatBridge(root,{binDir,persistent:true});
  const disposable=createSourceCombatBridge(root,{binDir});
  t.after(()=>persistent.close());
  let a=null,b=null;
  for(const inputs of [[{},{}],[{down:true,x:true},{}],[{},{}]]) {
    const ra=await persistent(payload(a,inputs,6));
    const rb=await disposable(payload(b,inputs,6));
    assert.deepEqual(unsigned(ra.snapshot),unsigned(rb.snapshot));
    a=ra.snapshot; b=rb.snapshot;
  }
});
test('optional browser intro round-trips and locks player inputs', real, async () => {
  const bridge=createSourceCombatBridge(root,{binDir});
  let snapshot=(await bridge({...payload(),intro:true})).snapshot;
  assert.equal(snapshot.intro,true);
    assert.deepEqual(snapshot.effects,[]);
    assert.deepEqual(snapshot.projectiles,[]);
    const held=[{right:true,x:true},{left:true,x:true}];
  for(let batch=0;batch<600 && snapshot.intro;batch++) {
      snapshot=(await bridge(payload(snapshot,held,1))).snapshot;
    assert.deepEqual(snapshot.fighters.map(f=>f.state.x),[-20,20]);
  }
  assert.equal(snapshot.intro,false);
  assert.ok(snapshot.fighters.every(f=>f.state.ctrl));
  assert.throws(()=>validateSourceCombatRequest({...payload(),intro:1}),status(400));
});
test('real source normals produce contact, guard and hit-confirm chains in both slots', real, async () => {
  for (const attacker of [0,1]) {
    const bridge = createSourceCombatBridge(root, {binDir});
    const reset = await bridge(payload());
    assert.deepEqual(reset.snapshots, []);
    assert.deepEqual(reset.snapshot.fighters.map(f => f.life), [1000,1000]);
    let snapshot = reset.snapshot;
    const events = [];
    for (const button of ['x','y','z']) {
      const inputs = [{},{}]; inputs[attacker][button] = true;
      const result = await bridge(payload(snapshot, inputs, 6));
      events.push(...result.snapshots.flatMap(s => s.events)); snapshot=result.snapshot;
      for (let wait = 0; wait < 4 && events.length < ['x','y','z'].indexOf(button) + 1; wait++) {
        const continued = await bridge(payload(snapshot, [{},{}], 2));
        events.push(...continued.snapshots.flatMap(s => s.events)); snapshot=continued.snapshot;
      }
    }
    assert.deepEqual(events.map(e => [e.stateNo,e.damage,e.attacker]), [[200,20,attacker+1],[210,20,attacker+1],[220,20,attacker+1]]);
    assert.equal(snapshot.fighters[1-attacker].life,940);
    const guarding=[{},{}]; guarding[attacker].x=true; guarding[1-attacker][attacker===0 ? 'right':'left']=true;
    const guard = await bridge(payload(null,guarding,6));
    assert.equal(guard.snapshot.fighters[1-attacker].life,990);
    assert.equal(guard.snapshots.flatMap(s=>s.events)[0].kind,'guard');
  }
});
test('serialized batches preserve original state clocks, hitpause and crouching attacks', real, async () => {
  const bridge=createSourceCombatBridge(root,{binDir});
  const start=(await bridge(payload())).snapshot;
  const batch=await bridge(payload(start,[{down:true,x:true},{}],6));
  let split=start;
  for(let i=0;i<6;i++) split=(await bridge(payload(split,[{down:true,x:true},{}],1))).snapshot;
  assert.deepEqual(unsigned(split),unsigned(batch.snapshot));
  assert.equal(batch.snapshot.fighters[0].state.stateNo,400);
  assert.equal(batch.snapshot.fighters[1].life,980);
  assert.ok(batch.snapshots.some(s=>s.fighters[0].state.hitPause>0));
});
test('real input jump enters authored air normal and lands back under common control', real, async () => {
  const bridge=createSourceCombatBridge(root,{binDir});
  let snapshot=(await bridge(payload(null,[{up:true},{}],6))).snapshot;
  assert.equal(snapshot.fighters[0].state.stateType,'A');
  snapshot=(await bridge(payload(snapshot,[{z:true},{}],1))).snapshot;
  assert.equal(snapshot.fighters[0].state.stateNo,620);
  assert.equal(snapshot.fighters[0].state.animElem,1);
  for(let wait=0;wait<24 && (snapshot.fighters[0].state.y<0 || !snapshot.fighters[0].state.ctrl);wait++) {
    snapshot=(await bridge(payload(snapshot,[{},{}],6))).snapshot;
  }
  assert.equal(snapshot.fighters[0].state.y,0);
  assert.equal(snapshot.fighters[0].state.ctrl,true);
});
test('snapshot changes and old-server snapshots reject without executing client state', real, async () => {
  const bridge=createSourceCombatBridge(root,{binDir});
  const snapshot=(await bridge(payload())).snapshot;
  const tampered=structuredClone(snapshot);tampered.fighters[0].life=999999;
  await assert.rejects(bridge(payload(tampered)),status(400));
  await assert.rejects(createSourceCombatBridge(root,{binDir})(payload(snapshot)),status(400));
  const bad=structuredClone(snapshot);bad.bridgeToken='not a signature';
  await assert.rejects(bridge(payload(bad)),status(400));
});
test('missing CLI errors explicitly and disposes temporary scripts', async () => {
  const bridge=createSourceCombatBridge(root,{binDir:path.join(root,'.tools','absent-source-cli')});
  const before=(await fs.readdir(path.join(root,'.tools'))).filter(n=>n.startsWith('source-combat-'));
  await assert.rejects(bridge(payload()),status(503));
  assert.deepEqual((await fs.readdir(path.join(root,'.tools'))).filter(n=>n.startsWith('source-combat-')),before);
});
test('timed-out or output-limited workers clean scripts and release the bridge slot', real, async () => {
  const before=(await fs.readdir(path.join(root,'.tools'))).filter(n=>n.startsWith('source-combat-'));
  for(const options of [{timeoutMs:1},{maxOutputBytes:1}]) {
    const bridge=createSourceCombatBridge(root,{binDir,...options});
    for(let attempt=0;attempt<3;attempt++) await assert.rejects(bridge(payload()),status(504));
  }
  assert.deepEqual((await fs.readdir(path.join(root,'.tools'))).filter(n=>n.startsWith('source-combat-')),before);
});
test('HTTP default source route executes Luau and preserves signed snapshots across requests', real, async t => {
  const server=createPreviewServer(root,{sourceCombat:createSourceCombatBridge(root,{binDir})});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();}));
  const base=`http://127.0.0.1:${server.address().port}`;
  const post=async body=>{
    const response=await fetch(`${base}/api/source-combat`,{method:'POST',headers:{Origin:base,'Content-Type':'application/json','X-Rift-Source-Combat':'1'},body:JSON.stringify(body)});
    assert.equal(response.status,200);return response.json();
  };
  const reset=await post(payload());
  const result=await post(payload(reset.snapshot,[{x:true},{}],6));
  assert.equal(result.snapshot.fighters[1].life,980);
  assert.equal(result.snapshots.flatMap(s=>s.events)[0].kind,'hit');
  assert.equal(result.ticksPerSecond,60);
});
test('source combat HTTP requires local origin, its own header, bounded JSON and valid payload', async t => {
  let calls=0;
  const server=createPreviewServer(root,{sourceCombat:async body=>{calls++;return {received:body.ticks};}});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();}));
  const base=`http://127.0.0.1:${server.address().port}`;
  const headers={Origin:base,'Content-Type':'application/json','X-Rift-Source-Combat':'1'};
  const post=(body=payload(),extra={})=>fetch(`${base}/api/source-combat`,{method:'POST',headers:{...headers,...extra},body:typeof body==='string'?body:JSON.stringify(body)});
  assert.equal((await fetch(`${base}/api/source-combat`)).status,405);
  for(const extra of [{Origin:''},{Origin:'https://example.com'},{'X-Rift-Source-Combat':''}]) assert.equal((await post(payload(),extra)).status,403);
  const hostStatus=await new Promise((resolve,reject)=>{
    const req=request(`${base}/api/source-combat`,{method:'POST',headers:{...headers,Host:'example.com'}},res=>{res.resume();res.on('end',()=>resolve(res.statusCode));});
    req.on('error',reject);req.end(JSON.stringify(payload()));
  });
  assert.equal(hostStatus,403);
  assert.equal((await post(payload(),{'Content-Type':'text/plain'})).status,415);
  assert.equal((await post('{')).status,400);
  assert.equal((await post({...payload(),ticks:100})).status,400);
  assert.equal((await post(' '.repeat(MAX_SOURCE_COMBAT_BYTES+1))).status,413);
  const response=await post();assert.equal(response.status,200);assert.deepEqual(await response.json(),{received:0});assert.equal(calls,1);
});
