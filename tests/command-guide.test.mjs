import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { commandGuide, keyboardCommand, renderCommandGuide } from '../preview/command-guide.mjs';
const load = async id => [JSON.parse(await fs.readFile(`generated\\${id}\\character.json`)), JSON.parse(await fs.readFile(`generated\\luau\\${id}-checkpoint-report.json`))];
test('keyboard guide translates motions, simultaneous buttons, modifiers and remaps for both players', () => {
  const command = {command:'~30D, $DF, >F, /x+y',remap:{x:'a'}};
  assert.equal(keyboardCommand(command),'~30↓ → $↓ + forward → >forward → /U + K');
  assert.equal(keyboardCommand(command,1),'~30↓ → $↓ + forward → >forward → /Num 4 + Num 2');
  assert.equal(keyboardCommand({command:'B, B'}),'back → back');
});
test('Coiny commands show actual playable routes and preserve alternate command definitions', async () => {
  const [character,report]=await load('coiny');
  const guide=commandGuide(character,report);
  assert.ok(guide.filter(c=>c.name==='Special1').length>1);
  assert.equal(guide.find(c=>c.name==='Hyper1').p1,'J + K');
  assert.equal(guide.find(c=>c.name==='Hyper1').status,'Available in source combat');
  assert.ok(guide.find(c=>c.name==='x').routes.some(r=>r.state==='200'));
  assert.ok(!guide.some(c=>/^AI_/i.test(c.name)));
});
test('Pikachu specials are Luau-only, hypers blocked, and missing reports never claim support', async () => {
  const [character,report]=await load('pikachu');
  const guide=commandGuide(character,report);
  assert.equal(guide.find(c=>c.name==='b').status,'Luau only · not playable here');
  assert.equal(guide.find(c=>c.name==='RockSquad').status,'Blocked by engine gaps');
  assert.ok(guide.find(c=>c.name==='RockSquad').routes[0].blockers.some(b=>b.includes('p2stateno')));
  assert.equal(commandGuide(character).find(c=>c.name==='b').status,'Not validated / not exported');
});
test('move-only guide hides unused commands and direction modifiers but keeps real move alternatives', async () => {
  const [character, report] = await load('coiny');
  const guide = commandGuide(character, report);
  assert.deepEqual([...new Set(guide.map(command => command.name))],
    ['Hyper1', 'Hyper2', 'Special1', 'Special2', 'FF', 'BB', 'x', 'y', 'z', 's']);
  assert.equal(guide.filter(command => command.name === 'Special1').length, 3);
  assert.equal(guide.filter(command => command.name === 'Special2').length, 3);
  assert.equal(guide.find(command => command.name === 'x').routes.length, 3);
  assert.ok(guide.find(command => command.name === 'x').routes.some(route =>
    route.conditions.includes('triggerall: command = "holddown"')));
  assert.ok(guide.every(command => command.routes.length > 0));
});
function fakeDocument() {
  return {createElement(tag) { return {tag,textContent:'',childNodes:[],append(...nodes){this.childNodes.push(...nodes);},replaceChildren(...nodes){this.childNodes=nodes;}}; }};
}
test('rendering switches characters, clears loading state and treats imported text as text', async () => {
  const doc=fakeDocument(),container=doc.createElement('div');
  const [character,report]=await load('pikachu');
  character.name='<img src=x onerror=alert(1)>';
  renderCommandGuide(container,character,report,doc);
  assert.ok(container.childNodes[0].textContent.startsWith(character.name));
  assert.ok(container.childNodes[3].childNodes.some(n=>n.childNodes[0].textContent.includes('RockSquad')));
  const [coiny,coinyReport]=await load('coiny');
  renderCommandGuide(container,coiny,coinyReport,doc);
  assert.ok(!container.childNodes[3].childNodes.some(n=>n.childNodes[0].textContent.includes('RockSquad')));
  renderCommandGuide(container,null,null,doc);
  assert.equal(container.childNodes.length,1);
  assert.match(container.childNodes[0].textContent,/Select a character/);
});
