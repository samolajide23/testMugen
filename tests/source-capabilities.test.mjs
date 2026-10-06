import test from 'node:test';
import assert from 'node:assert/strict';
import { readCharacter } from '../tools/audit-compatibility.mjs';
import { buildAutomaticCheckpoint, exportMugenCheckpoint } from '../tools/export-mugen-checkpoint.mjs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { discoverSourceRoutes } from '../tools/source-capabilities.mjs';
const character = await readCharacter('chars\\Pikachu');
test('generic file export accepts new IDs safely without a character-specific exporter', async () => {
  const destination = await fs.mkdtemp(path.join(os.tmpdir(), 'rift-auto-export-'));
  try {
    const result = await exportMugenCheckpoint('chars\\Pikachu', destination, 'new-character');
    assert.ok(result.report.routes.some(r => r.state === 1000 && r.supported));
    assert.match(await fs.readFile(path.join(destination, 'luau', 'new-character-checkpoint.luau'), 'utf8'), /return config/);
    await assert.rejects(exportMugenCheckpoint('chars\\Pikachu', destination, '..\\escape'), /Invalid checkpoint character ID/);
  } finally { await fs.rm(destination, {recursive:true,force:true}); }
});
const entry = (key, value) => ({key, value});
const controller = (type, values, line) => ({type,source:'fixture.cns',line,entries:[entry('type',type),entry('trigger1','1'),...Object.entries(values).map(([k,v])=>entry(k,v))]});
function fixture() {
  const source = structuredClone(character);
  source.states.push({id:9000,source:'fixture.cns',entries:[entry('type','S'),entry('movetype','A'),entry('physics','N'),entry('anim','0')],controllers:[controller('Helper',{id:'9001',stateno:'9001',pos:'10,0'},1)]});
  source.states.push({id:9001,source:'fixture.cns',entries:[entry('type','S'),entry('movetype','A'),entry('physics','N'),entry('anim','0')],controllers:[controller('DestroySelf',{},2)]});
  source.commands.push({...source.commands.find(c=>c.name==='b'),name:'Fixture'});
  source.states.find(s=>s.id===-1).controllers.push({...controller('ChangeState',{value:'9000'},3),entries:[entry('type','ChangeState'),entry('trigger1','command = "Fixture"'),entry('value','9000')]});
  return source;
}
test('new human route and helper dependency import without a character move list', () => {
  const source=fixture(), before=structuredClone(source);
  const {config,report}=buildAutomaticCheckpoint(source);
  assert.deepEqual(source,before);
  assert.ok(config.states.some(s=>s.id===9000));
  assert.ok(config.states.some(s=>s.id===9001));
  assert.ok(config.commands.some(c=>c.name==='Fixture'));
  assert.ok(report.routes.find(r=>r.state===9000).supported);
});
test('nested helpers block whole routes instead of advertising unimplemented execution', () => {
  const source=fixture();
  source.states.find(s=>s.id===9001).controllers.unshift(controller('Helper',{id:'9001',stateno:'9001'},4));
  const {config,report}=buildAutomaticCheckpoint(source);
  assert.ok(!config.states.some(s=>s.id===9000));
  assert.ok(report.routes.find(r=>r.state===9000).blockers.some(b=>b.reason==='Nested helpers are unsupported'));
});
test('unsupported visual lifetime and ambiguous artwork are explicit omissions, not invented effects', () => {
  const report=discoverSourceRoutes(character);
  assert.ok(report.omitted.some(o=>o.reasons.some(r=>r.includes('bindtime=anim'))));
  assert.ok(report.omitted.some(o=>o.reasons.some(r=>r.includes('ambiguous Explod AIR 1001'))));
  assert.ok(report.routes.find(r=>r.state===1000).supported);
});
test('missing helpers and unsupported custom victim states block their complete source route', () => {
  const source=fixture(); source.states=source.states.filter(s=>s.id!==9001);
  assert.ok(discoverSourceRoutes(source).routes.find(r=>r.state===9000).blockers.some(b=>b.reason.includes('9001')));
  for(const id of [3000,4000]) assert.ok(discoverSourceRoutes(character).routes.find(r=>r.state===id).blockers.some(b=>b.reason.includes('p2stateno')));
});
