import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const stateRuntime = fs.readFileSync(fileURLToPath(new URL('../runtime/MugenState.luau', import.meta.url)), 'utf8');
const hitRuntime = fs.readFileSync(fileURLToPath(new URL('../runtime/MugenHitDef.luau', import.meta.url)), 'utf8');
const allowedText = stateRuntime.slice(stateRuntime.indexOf('local ALLOWED:'), stateRuntime.indexOf('local PROJECTILE'));
const controllers = new Map([...allowedText.matchAll(/(\w+)\s*=\{([^}]*)\}/g)].map(([,name,params]) => [name, new Set([...params.matchAll(/(\w+)\s*=true/g)].map(m => m[1]))]));
const headerParameters = new Set(['type','movetype','physics','anim','ctrl','velset','poweradd','juggle','sprpriority']);
const hitParameters = new Set([...hitRuntime.slice(hitRuntime.indexOf('local NUMERIC:'), hitRuntime.indexOf('local function trim')).matchAll(/(?:\['([^']+)'\]|\b(\w+))\s*=\s*(?:\{|true)/g)].map(m => m[1] ?? m[2]));
const hostStates = new Set([0,10,11,12,20,40,50,52,100,105,106,120,130,131,132,150,151,152,5000,5010,5020,5030,5050,5100,5110,5120,5150]);
const visualTypes = new Set(['explod','palfx','afterimage','envcolor','bgpalfx','angledraw','assertspecial']);
const supportedTriggers = new Set(['command','time','statetime','stateno','prevstateno','anim','animelem','animelemtime','animtime','animexist','selfanimexist','ctrl','statetype','movetype','movecontact','movehit','moveguarded','power','numhelper','numexplod','vel','pos','p2bodydist','random','var','fvar','facing','hitpausetime','roundstate','life','win','wintime','numenemy','enemyname','s','c','a','l','i','h','n','x','y']);
function triggers(controller) {
  const result=[];
  for (const e of controller.entries.filter(e => e.key.startsWith('trigger'))) {
    const text=e.value.replace(/"[^"]*"/g,'');
    for (const match of text.matchAll(/\b[a-z_][a-z_0-9]*\b/gi)) {
      const name=match[0].toLowerCase();
      if (!supportedTriggers.has(name)) result.push(`Unsupported trigger ${name}`);
    }
  }
  return [...new Set(result)];
}
function issues(controller) {
  const kind=controller.type.toLowerCase(), entries=controller.entries;
  const result=triggers(controller);
  if (!controllers.has(kind) && kind!=='playsnd') result.push(`Unsupported controller ${kind}`);
  if (entries.filter(e=>e.key==='type').length>1) result.push('Conflicting/duplicate controller types');
  const params=new Map();
  for(const e of entries) if(!params.has(e.key)) params.set(e.key,e.value);
  if(controllers.has(kind)) for(const [key,value] of params) {
    if(['type','persistent','ignorehitpause'].includes(key)||key.startsWith('trigger')) continue;
    if(!((kind==='hitdef' ? hitParameters : controllers.get(kind)).has(key))) result.push(`Unsupported ${kind} parameter ${key}`);
    if(kind==='explod' && ['bindtime','removetime'].includes(key) && !/^-?\d+$/.test(value.trim())) result.push(`Unsupported Explod lifetime ${key}=${value}`);
  }
  if(kind==='nothitby' && params.get('value')?.replace(/\s+/g,'').toUpperCase()!=='SCA') result.push('Only unqualified NotHitBy SCA is supported');
  if(kind==='superpause' && params.has('anim') && !/^-?\d+$/.test(params.get('anim').trim())) result.push('Qualified or dynamic SuperPause artwork is unsupported');
  if(kind==='helper') {
    for(const key of ['stateno','id']) if(!/^-?\d+$/.test(params.get(key)??'')) result.push(`Helper requires literal ${key}`);
    if(params.get('keyctrl') && params.get('keyctrl')!=='0') result.push('Helper keyctrl is unsupported');
    if(params.get('helpertype') && params.get('helpertype').toLowerCase()!=='normal') result.push('Only normal helpers are supported');
  }
  return [...new Set(result)];
}
export function discoverSourceRoutes(character) {
  const commandState=character.states.find(s=>s.id===-1);
  if(!commandState) throw new Error('Missing command state -1');
  const states=new Set(), commands=new Set(['holddown','recovery']), selected=new Set(), omitted=[], routes=[];
  function visit(id, found, blockers, seen, helper = false) {
      const scope = `${id}:${helper}`;
      if(hostStates.has(id)||seen.has(scope)) return;
      seen.add(scope);
    const candidates=character.states.filter(s=>s.id===id);
    if(candidates.length!==1) { blockers.push({state:id,reason:`Missing or ambiguous state ${id}`}); return; }
    const s=candidates[0];found.add(id);
        const headers=new Set();
        for(const e of s.entries) {
          if(!headerParameters.has(e.key)||headers.has(e.key)) blockers.push({state:id,source:s.source,line:e.line,reason:`Unsupported or duplicate Statedef parameter ${e.key}`});
          headers.add(e.key);
          if(e.key==='anim' && (!/^\d+$/.test(e.value.trim()) || character.animations.filter(a=>a.id===Number(e.value)).length!==1)) blockers.push({state:id,source:s.source,line:e.line,reason:`Missing, ambiguous or dynamic AIR ${e.value}`});
        }
        for(const c of s.controllers) {
      const kind=c.type.toLowerCase(), errors=issues(c);
            if(helper && kind==='helper') errors.push('Nested helpers are unsupported');
            if(!helper && kind==='destroyself') errors.push('DestroySelf requires helper context');
            if(helper && ['projectile','superpause','poweradd','powerset'].includes(kind)) errors.push(`Unsupported helper controller ${kind}`);
            if(kind==='explod') {
        const raw=c.entries.find(e=>e.key==='anim')?.value;
        const id=Number(raw?.replace(/^[sS]/,''));
        if(!Number.isInteger(id)||character.animations.filter(a=>a.id===id).length!==1) errors.push(`Missing or ambiguous Explod AIR ${raw}`);
      }
      if(kind==='playsnd'||visualTypes.has(kind)&&errors.length) {
        if(!omitted.some(o=>o.source===c.source&&o.line===c.line)) omitted.push({state:id,type:c.type,source:c.source,line:c.line,reasons:kind==='playsnd'?['Audio deferred']:errors});
        continue;
      }
      for(const reason of errors) blockers.push({state:id,source:c.source,line:c.line,reason});
      if(kind==='changeanim' || kind==='changestate' && c.entries.some(e=>e.key==='anim')) {
        const raw=c.entries.find(e=>e.key===(kind==='changeanim'?'value':'anim'))?.value;
        if(!/^\d+$/.test(raw?.trim()??'') || character.animations.filter(a=>a.id===Number(raw)).length!==1) blockers.push({state:id,source:c.source,line:c.line,reason:`Missing, ambiguous or dynamic controller AIR ${raw}`});
      }
      if(kind==='hitdef') {
        const destination=c.entries.find(e=>e.key==='p1stateno')?.value;
        if(destination!=null) {
          if(!/^-?\d+$/.test(destination.trim())) blockers.push({state:id,source:c.source,line:c.line,reason:'Dynamic p1stateno is unsupported'});
          else if(Number(destination)>=0) visit(Number(destination),found,blockers,seen,helper);
        }
      }
      if(['changestate','selfstate','helper'].includes(kind)) {
        const key=kind==='helper'?'stateno':'value';const value=c.entries.find(e=>e.key===key)?.value;
        if(!/^-?\d+$/.test(value??'')) blockers.push({state:id,source:c.source,line:c.line,reason:`Dynamic ${kind} destination is unsupported`});
        else visit(Number(value),found,blockers,seen,helper || kind==='helper');
      }
    }
  }
  for(const c of commandState.controllers) {
    if(c.type.toLowerCase()!=='changestate') continue;
    const names=c.entries.filter(e=>e.key.startsWith('trigger')).flatMap(e=>[...e.value.matchAll(/command\s*(?:=|!=)\s*"([^"]+)"/gi)].map(m=>m[1]));
    if(!names.length||names.some(n=>/^cpu/i.test(n))||c.entries.some(e=>e.key.startsWith('trigger')&&/\b(?:var|ailevel)\b/i.test(e.value))) continue;
    const destination=c.entries.find(e=>e.key==='value')?.value;
    const blockers=issues(c).map(reason=>({source:c.source,line:c.line,reason}));
    const found=new Set();
    if(!/^-?\d+$/.test(destination??'')) blockers.push({source:c.source,line:c.line,reason:'Dynamic command destination is unsupported'});
    else visit(Number(destination),found,blockers,new Set());
    const route={state:Number(destination),commands:names,source:c.source,line:c.line,reachableStates:[...found],supported:blockers.length===0,blockers};
    routes.push(route);
    if(route.supported) {selected.add(c);for(const id of found)states.add(id);for(const name of names)commands.add(name);}
  }
  return {states,commands,selected,omitted,routes};
}
