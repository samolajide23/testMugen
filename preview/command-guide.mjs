import { COMBAT_KEYS } from './source-combat.mjs';

const directions = { D: '↓', U: '↑', F: 'forward', B: 'back', DF: '↓ + forward', DB: '↓ + back', UF: '↑ + forward', UB: '↑ + back' };
const keyLabel = code => code.startsWith('Key') ? code.slice(3) : code.startsWith('Numpad') ? `Num ${code.slice(6)}` : ({ArrowLeft:'←',ArrowRight:'→',ArrowUp:'↑',ArrowDown:'↓'}[code] ?? code);
export function keyboardCommand(command, player = 0) {
  return String(command.command ?? '').split(',').map(step => step.trim().split('+').map(token => {
    return token.replace(/[A-Za-z]+/g, symbol => {
      if (directions[symbol]) return directions[symbol];
      const button = command.remap?.[symbol] ?? symbol;
      const code = Object.keys(COMBAT_KEYS[player]).find(code => COMBAT_KEYS[player][code] === button);
      return code ? keyLabel(code) : symbol;
    });
  }).join(' + ')).join(' → ');
}
export function commandGuide(character, report) {
  const routes = (character.states ?? []).find(state => state.id === -1)?.controllers ?? [];
  return (character.commands ?? []).filter(command => !/^(?:ai(?:_|\d|$)|cpu)/i.test(command.name)).map(command => {
    const matches = routes.filter(controller => controller.type?.toLowerCase() === 'changestate' && controller.entries?.some(entry =>
      entry.key.startsWith('trigger') && [...entry.value.matchAll(/command\s*(?:=|!=)\s*"([^"]+)"/gi)].some(match => match[1] === command.name)));
    const positive = matches.filter(controller => {
      const names = controller.entries.filter(entry => entry.key.startsWith('trigger'))
        .flatMap(entry => [...entry.value.matchAll(/command\s*=\s*"([^"]+)"/gi)].map(match => match[1]));
      // A held direction is a move condition, not a separate attack binding.
      const directionModifier = String(command.command).startsWith('/') &&
        !/[a-z]/.test(String(command.command)) && names.some(name => name !== command.name);
      return names.includes(command.name) && !directionModifier;
    });
    const routeInfo = positive.map(controller => {
      const state = controller.entries.find(entry => entry.key === 'value')?.value ?? '?';
      const discovered = report?.routes?.find(route => route.source === controller.source && route.line === controller.line);
      const selected = report?.selectedControllers?.some(item => item.state === -1 && item.source === controller.source && item.line === controller.line);
      return {state, conditions:controller.entries.filter(entry => entry.key.startsWith('trigger')).map(entry => `${entry.key}: ${entry.value}`),
        status: discovered ? (discovered.supported ? 'supported' : 'blocked') : selected ? 'supported' : 'unverified',
        blockers: discovered?.blockers?.map(blocker => blocker.reason) ?? []};
    });
    const supported = routeInfo.some(route => route.status === 'supported');
    return {name:command.name, source:command.command, p1:keyboardCommand(command,0), p2:keyboardCommand(command,1),
      time:command.time, bufferTime:command.bufferTime, routes:routeInfo,
      status: supported ? (character.id === 'coiny' ? 'Available in source combat' : 'Luau only · not playable here')
        : routeInfo.some(route => route.status === 'blocked') ? 'Blocked by engine gaps'
        : routeInfo.length ? 'Not validated / not exported' : 'Input definition · no direct move route'};
  }).filter(command => command.routes.length > 0);
}
export function renderCommandGuide(container, character, report, doc = document) {
  const element = (tag, text) => { const node = doc.createElement(tag); if (text != null) node.textContent = text; return node; };
  if (!character) { container.replaceChildren(element('p','Select a character to see its imported commands.')); return; }
  const intro = element('p', `${character.name} · move keybinds only. Unused inputs and standalone direction modifiers are hidden. Only Coiny is playable in browser source combat; other characters retain support labels.`);
  const bindings = element('p', COMBAT_KEYS.map((mapping,index) => `P${index+1}: ${Object.entries(mapping).map(([code,button]) => `${keyLabel(code)} = ${button}`).join(' · ')}`).join(' | '));
  const legend = element('p','Read left to right: → means next input; + means together. Forward/back follow fighter facing (P1 starts facing right, P2 left). ~ = release, ~number = hold that many ticks then release, / = hold, $ = direction with diagonals allowed, > = strict sequence. Timings are 60 Hz ticks. Source trigger conditions determine standing/crouching, power and cancel requirements.');
  const list = element('div'); list.className = 'command-list';
  for (const command of commandGuide(character, report)) {
    const item = element('details');
    item.append(element('summary', `${command.name} · P1 ${command.p1} · P2 ${command.p2} — ${command.status}`));
    item.append(element('p', `Source: ${command.source} · Window: ${command.time ?? '?'} ticks · Buffer: ${command.bufferTime ?? '?'} ticks`));
    for (const route of command.routes) {
      item.append(element('p', `State ${route.state} · ${route.status}${route.blockers.length ? ` · ${[...new Set(route.blockers)].join('; ')}` : ''}`));
      item.append(element('pre',route.conditions.join('\n')));
    }
    list.append(item);
  }
  if (!list.childNodes.length) list.append(element('p','No directly command-triggered moves found in this import.'));
  container.replaceChildren(intro,bindings,legend,list);
}
