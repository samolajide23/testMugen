/**
 * Drop a MUGEN char folder (or existing framesheet folder) → slim Roblox-ready pack.
 *
 * Usage:
 *   node tools/pack-character.js "chars/Shinobi Alliance"
 *   node tools/pack-character.js chars/gaara
 *   node tools/pack-character.js "chars/Shinobi Alliance" --all-shinobi
 *
 * Output (per character):
 *   packs/<id>/atlas.png
 *   packs/<id>/character.json
 */
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");
const { buildRobloxFiles, enrichRobloxMeta } = require("./roblox-export");

function getRoot() {
  return process.env.MUGENSKEL_ROOT
    ? path.resolve(process.env.MUGENSKEL_ROOT)
    : path.join(__dirname, "..");
}
function getPacks() {
  return process.env.MUGENSKEL_PACKS
    ? path.resolve(process.env.MUGENSKEL_PACKS)
    : path.join(getRoot(), "packs");
}

/** Core anims we keep for the HTML fighter + Roblox flipbook. */
const CORE_REL = {
  idle: 0,
  hitstun: 5,
  block: 6,
  crouchStart: 10,
  crouch: 11,
  crouchEnd: 12,
  walk: 20,
  walkBack: 21,
  // jump missing on Shinobi Alliance — fall back below
  jumpStart: 40,
  jump: 41,
  jumpFwd: 42,
  jumpBack: 43,
  land: 47,
  dash: 100,
  run: 101,
  dashBack: 105,
  lightPunch: 200,
  heavyKick: 240,
  parry: 230,
};

const FALLBACK_REL = {
  crouchStart: 11,
  crouchEnd: 11,
  jumpStart: 15,
  jump: 16,
  jumpFwd: 41,
  jumpBack: 41,
  run: 100,
  lightPunch: 80,
  heavyKick: 81,
  parry: 6,
  parryStun: 5,
};

/** Shinobi Alliance helper skins (action-number offsets). */
const SHINOBI_SKINS = [
  { id: "shinobi1", name: "Shinobi 1", offset: 1400 },
  { id: "shinobi2", name: "Shinobi 2", offset: 1800 },
  { id: "shinobi3", name: "Shinobi 3", offset: 2200 },
  { id: "shinobi4", name: "Shinobi 4", offset: 2600 },
  { id: "shinobi5", name: "Shinobi 5", offset: 3000 },
  { id: "shinobi6", name: "Shinobi 6", offset: 3400 },
  { id: "shinobi7", name: "Shinobi 7", offset: 3800 },
  { id: "shinobi8", name: "Shinobi 8", offset: 4200 },
  { id: "shinobi9", name: "Shinobi 9", offset: 4600 },
];

/** Loco/idle only — attack/special/VFX anims are never trimmed. */
const MAX_FRAMES_LOCO = 24;
const MAX_ATLAS_EDGE = 2048;
const TARGET_HEIGHT = 88; // per-sprite max height (do NOT global-scale from VFX)
const PREVIEW_PX = 70; // must match index.html PX — world units from screen pixels
const MUGEN_PX_TO_WORLD = 1.5 / 60; // fallback only; prefer atlas.pxToWorld after pack
const SMACK_SLOTS = [
  "jab", "forwardTilt", "upTilt", "downTilt",
  "neutralSpecial", "sideSpecial", "upSpecial", "downSpecial",
];

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "") || "char";
}

function readText(filePath) {
  return fs.readFileSync(filePath, "latin1");
}

function findMugenFiles(dir) {
  const files = fs.readdirSync(dir);
  const byExt = (ext) => files.filter((f) => f.toLowerCase().endsWith(ext));
  const defName = byExt(".def").find((f) => !/^(intro|ending)\.def$/i.test(f)) || byExt(".def")[0];
  const defPath = defName ? path.join(dir, defName) : null;
  let sffName = null;
  let airName = null;
  let cnsName = null;
  if (defPath) {
    const def = parseDef(defPath);
    if (def.files) {
      if (def.files.sprite && files.includes(def.files.sprite)) sffName = def.files.sprite;
      if (def.files.anim && files.includes(def.files.anim)) airName = def.files.anim;
      if (def.files.cns && files.includes(def.files.cns)) cnsName = def.files.cns;
    }
  }
  // Prefer main char SFF over intro/ending storyboard sheets
  if (!sffName) {
    sffName = byExt(".sff").find((f) => !/^(intro|ending)\.sff$/i.test(f)) || byExt(".sff")[0];
  }
  if (!airName) airName = byExt(".air")[0];
  if (!cnsName) cnsName = byExt(".cns").find((f) => !/common/i.test(f)) || byExt(".cns")[0];
  return {
    def: defPath,
    sff: sffName ? path.join(dir, sffName) : null,
    air: airName ? path.join(dir, airName) : null,
    cns: cnsName ? path.join(dir, cnsName) : null,
    atlasJson: files.includes("atlas.json") ? path.join(dir, "atlas.json") : null,
    atlasPng: files.includes("atlas.png") ? path.join(dir, "atlas.png") : null,
  };
}

function parseDef(defPath) {
  if (!defPath) return {};
  const t = readText(defPath);
  const info = {};
  const mName = t.match(/^\s*name\s*=\s*"?([^"\r\n]+)"?/im);
  if (mName) info.name = mName[1].trim();
  const files = {};
  for (const key of ["sprite", "anim", "cmd", "cns", "stcommon"]) {
    const m = t.match(new RegExp(`^\\s*${key}\\s*=\\s*"?([^"\\r\\n]+)"?`, "im"));
    if (m) files[key] = m[1].trim();
  }
  info.files = files;
  return info;
}

function parseCnsPhysics(cnsPath) {
  if (!cnsPath || !fs.existsSync(cnsPath)) {
    return {
      height: 60, walkFwd: 2.4, walkBack: 2.2, jumpY: 8.4,
      jumpFwdX: 2.5, jumpBackX: 2.55, airJumpY: 8.1,
      airJumpFwdX: 2.5, airJumpBackX: 2.5, yaccel: 0.44,
      standFriction: 0.85, crouchFriction: 0.82,
      airJumpNum: 0, airJumpHeight: 35, jumpStartFrames: 3,
    };
  }
  const t = readText(cnsPath);
  const num = (section, key, fallback) => {
    const sec = t.match(new RegExp(`\\[${section}\\]([\\s\\S]*?)(?=\\n\\[|$)`, "i"));
    if (!sec) return fallback;
    const m = sec[1].match(new RegExp(`^\\s*${key}\\s*=\\s*([^;\\r\\n]+)`, "im"));
    if (!m) return fallback;
    const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
    return parts.length === 1 ? parts[0] : parts;
  };
  const walkFwd = Math.abs(num("Velocity", "walk\\.fwd", 2.4));
  const walkBack = Math.abs(num("Velocity", "walk\\.back", 2.2));
  const jumpNeu = num("Velocity", "jump\\.neu", [0, -8.4]);
  const jumpY = Array.isArray(jumpNeu) ? Math.abs(jumpNeu[1] || 8.4) : 8.4;
  const height = num("Size", "height", 60);
  return {
    height,
    walkFwd,
    walkBack,
    jumpY,
    jumpFwdX: Math.abs(num("Velocity", "jump\\.fwd", 2.5)),
    jumpBackX: Math.abs(num("Velocity", "jump\\.back", 2.5)),
    airJumpY: jumpY,
    airJumpFwdX: 2.5,
    airJumpBackX: 2.5,
    yaccel: Math.abs(num("Movement", "yaccel", 0.44)),
    standFriction: 0.85,
    crouchFriction: 0.82,
    airJumpNum: num("Movement", "airjump\\.num", 0) || 0,
    airJumpHeight: num("Movement", "airjump\\.height", 35),
    jumpStartFrames: 3,
  };
}

function parseClsnLine(line) {
  // Clsn1[0] = x1, y1, x2, y2
  const m = line.match(/Clsn[12]\[\d+\]\s*=\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)/i);
  if (!m) return null;
  return {
    x1: Number(m[1]), y1: Number(m[2]), x2: Number(m[3]), y2: Number(m[4]),
  };
}

function parseAirActions(airPath) {
  const t = readText(airPath);
  const actions = new Map();
  const parts = t.split(/\[Begin Action\s+/i);
  for (let i = 1; i < parts.length; i++) {
    const chunk = parts[i];
    const hm = chunk.match(/^(\d+)\]/);
    if (!hm) continue;
    const id = Number(hm[1]);
    const body = chunk.slice(hm[0].length);
    const frames = [];
    let clsn1Default = [];
    let clsn2Default = [];
    let pendingClsn1 = null;
    let pendingClsn2 = null;
    let reading = null; // '1' | '2' | null
    let readingDefault = false;
    let expectBoxes = 0;
    let boxBuf = [];

    for (const raw of body.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith(";")) continue;
      if (line.startsWith("[")) break;

      const def1 = line.match(/^Clsn1Default\s*:\s*(\d+)/i);
      const def2 = line.match(/^Clsn2Default\s*:\s*(\d+)/i);
      const c1 = line.match(/^Clsn1\s*:\s*(\d+)/i);
      const c2 = line.match(/^Clsn2\s*:\s*(\d+)/i);
      if (def1) {
        reading = "1"; readingDefault = true; expectBoxes = Number(def1[1]); boxBuf = [];
        continue;
      }
      if (def2) {
        reading = "2"; readingDefault = true; expectBoxes = Number(def2[1]); boxBuf = [];
        continue;
      }
      if (c1) {
        reading = "1"; readingDefault = false; expectBoxes = Number(c1[1]); boxBuf = [];
        continue;
      }
      if (c2) {
        reading = "2"; readingDefault = false; expectBoxes = Number(c2[1]); boxBuf = [];
        continue;
      }

      if (reading && /Clsn[12]\[/i.test(line)) {
        const box = parseClsnLine(line);
        if (box) boxBuf.push(box);
        if (boxBuf.length >= expectBoxes) {
          if (reading === "1") {
            if (readingDefault) clsn1Default = boxBuf;
            else pendingClsn1 = boxBuf;
          } else {
            if (readingDefault) clsn2Default = boxBuf;
            else pendingClsn2 = boxBuf;
          }
          reading = null;
          boxBuf = [];
        }
        continue;
      }

      if (line.startsWith("Loop")) continue;

      // group, image, xoff, yoff, time [, flip ...]
      const m = line.match(/^(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)/);
      if (!m) continue;
      let ticks = Number(m[5]);
      if (ticks < 0) ticks = 8;
      if (ticks === 0) ticks = 1;
      const flipH = /,\s*H\b/i.test(line);
      const clsn1 = pendingClsn1 != null ? pendingClsn1 : clsn1Default;
      const clsn2 = pendingClsn2 != null ? pendingClsn2 : clsn2Default;
      frames.push({
        group: Number(m[1]),
        image: Number(m[2]),
        xoff: Number(m[3]),
        yoff: Number(m[4]),
        ticks,
        flipH,
        clsn1: clsn1.map((b) => ({ ...b })),
        clsn2: clsn2.map((b) => ({ ...b })),
      });
      pendingClsn1 = null;
      pendingClsn2 = null;
    }
    if (frames.length) actions.set(id, frames);
  }
  return actions;
}

/**
 * Pick real attack actions only:
 * 1) Prefer anims that have Clsn1 (actual hit frames)
 * 2) Drop 1-frame VFX stubs
 * 3) Cap per band (normals / specials / hypers / …)
 */
const MAX_NORMALS = 8;
const MAX_SPECIALS = 10; // AIR 1000–1999
const MAX_HYPERS = 6; // AIR 2000–3999
const MAX_COMMANDS = 4; // AIR 300–399
const MAX_THROWS = 2; // AIR 500–599
const MAX_CROUCH_ATTACKS = 6;
const MAX_AIR_ATTACKS = 6;
const MAX_VFX_SPAWNS = 5; // Explod/Helper/Projectile entries packed per attack

/**
 * Simple 6-button kit on J K L U I O. Packer auto-fills from discovered moves.
 * Stick still picks crouch/air variants for the pressed button.
 *
 *   J/K/L Attack 1–3 · U Heavy · I/O Special 1–2
 *   A/D walk · double-tap dash · hold away = block · W jump · S crouch
 */
const AUTO_BIND_HELP =
  "A/D walk · double-tap dash · hold away block · W jump · S crouch · J/K/L attacks · U heavy · I/O specials · Space pause";

function actionHasHitbox(frames) {
  return (frames || []).some((f) => f.clsn1 && f.clsn1.length > 0);
}

function dominantGroup(frames) {
  const counts = {};
  for (const f of frames || []) {
    if (f.group < 0) continue;
    counts[f.group] = (counts[f.group] || 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted.length ? Number(sorted[0][0]) : null;
}

/** Score + pick body attacks from absolute action id list. */
function pickAttackCandidates(actions, candidateIds, maxPick, minFiller) {
  const scored = candidateIds.map((id) => {
    const frames = actions.get(id) || [];
    const hit = actionHasHitbox(frames);
    const frameCount = frames.filter((f) => f.group >= 0).length;
    return { id, hit, frameCount, group: dominantGroup(frames) };
  });

  const real = scored.filter((s) => s.hit && s.frameCount >= 2);
  const filler = scored.filter((s) => !real.some((r) => r.id === s.id) && s.frameCount >= 3);

  const picked = [];
  for (const s of real) {
    if (picked.length >= maxPick) break;
    picked.push(s.id);
  }
  const fillerCap = minFiller != null ? minFiller : Math.min(4, maxPick);
  if (picked.length < Math.min(2, fillerCap)) {
    for (const s of filler) {
      if (picked.length >= fillerCap) break;
      picked.push(s.id);
    }
  }
  return picked;
}

function bandIds(actions, offset, lo, hi) {
  const out = [];
  for (let i = lo; i <= hi; i++) {
    const id = offset + i;
    if (actions.has(id)) out.push(id);
  }
  return out;
}

/** Standing normals: 200–299 (+ Shinobi-style 80–199). */
function discoverNormals(actions, offset, maxPick) {
  const candidates = bandIds(actions, offset, 200, 299);
  for (const id of bandIds(actions, offset, 80, 199)) {
    if (!candidates.includes(id)) candidates.push(id);
  }
  candidates.sort((a, b) => a - b);
  return pickAttackCandidates(actions, candidates, maxPick);
}

function discoverCrouchAttacks(actions, offset, maxPick) {
  return pickAttackCandidates(actions, bandIds(actions, offset, 400, 499), maxPick, Math.min(3, maxPick));
}

function discoverAirAttacks(actions, offset, maxPick) {
  return pickAttackCandidates(actions, bandIds(actions, offset, 600, 699), maxPick, Math.min(3, maxPick));
}

function discoverCommands(actions, offset, maxPick) {
  return pickAttackCandidates(actions, bandIds(actions, offset, 300, 399), maxPick, Math.min(2, maxPick));
}

function discoverThrows(actions, offset, maxPick) {
  return pickAttackCandidates(actions, bandIds(actions, offset, 500, 599), maxPick, Math.min(1, maxPick));
}

/** Real specials / hypers — only for base chars (offset 0). Offset skins share one AIR. */
function discoverSpecials(actions, offset, maxPick) {
  if (offset !== 0) return [];
  return pickAttackCandidates(actions, bandIds(actions, offset, 1000, 1999), maxPick, Math.min(4, maxPick));
}

function discoverHypers(actions, offset, maxPick) {
  if (offset !== 0) return [];
  const a = bandIds(actions, offset, 2000, 2999);
  const b = bandIds(actions, offset, 3000, 3999);
  return pickAttackCandidates(actions, a.concat(b), maxPick, Math.min(2, maxPick));
}

/** @deprecated */
function discoverAttackActions(actions, offset) {
  return discoverNormals(actions, offset, MAX_NORMALS);
}

function firstMove(moves, ids) {
  for (const id of ids) {
    if (moves[id]) return id;
  }
  return null;
}

/**
 * Auto-assign packed moves to J/K/L/U/I/O:
 * Attack1–3, Heavy1, Special1–2. Stick picks crouch/air for that button.
 */
function buildAutoBinds(moves, animMap) {
  const keyboard = {};
  const slots = {};
  const unbound = [];

  function put(code, moveId, slotName) {
    if (!moveId || !moves[moveId]) return false;
    keyboard[code] = { move: moveId, slot: slotName || code };
    return true;
  }

  function variantSlot(neutral, crouchIds, airIds) {
    return {
      neutral,
      forward: neutral,
      up: firstMove(moves, airIds.concat([neutral])),
      down: firstMove(moves, crouchIds.concat([neutral])),
      air: firstMove(moves, airIds.concat([neutral])),
      crouch: firstMove(moves, crouchIds.concat([neutral])),
    };
  }

  const atk1 = firstMove(moves, ["normal1", "special1"]);
  const atk2 = firstMove(moves, ["normal2", "normal1"]);
  const atk3 = firstMove(moves, ["normal3", "command1", "normal2", "normal1"]);
  const heavy1 = firstMove(moves, ["normal4", "normal5", "command1", "normal3", "normal2"]);
  const spec1 = firstMove(moves, ["special1", "hyper1", "command2", "normal3"]);
  const spec2 = firstMove(moves, ["special2", "hyper1", "special3", "special1"]);

  put("KeyJ", atk1, "attack1");
  put("KeyK", atk2, "attack2");
  put("KeyL", atk3, "attack3");
  put("KeyU", heavy1, "heavy1");
  put("KeyI", spec1, "special1");
  put("KeyO", spec2, "special2");

  slots.attack1 = variantSlot(atk1, ["crouchAttack1", "crouchAttack2"], ["airAttack1", "airAttack2"]);
  slots.attack2 = variantSlot(atk2, ["crouchAttack2", "crouchAttack1"], ["airAttack2", "airAttack1"]);
  slots.attack3 = variantSlot(atk3, ["crouchAttack3", "crouchAttack1"], ["airAttack3", "airAttack1"]);
  slots.heavy1 = variantSlot(heavy1, ["crouchAttack3", "crouchAttack2"], ["airAttack3", "airAttack2"]);
  slots.special1 = variantSlot(spec1, ["special1"], ["special1"]);
  slots.special2 = variantSlot(spec2, ["special2"], ["special2"]);

  const bound = new Set();
  Object.values(keyboard).forEach((v) => bound.add(v.move));
  for (const group of Object.values(slots)) {
    Object.values(group).forEach((id) => { if (id) bound.add(id); });
  }
  Object.keys(moves).forEach((id) => {
    if (/^(jab|forwardTilt|upTilt|downTilt|neutralSpecial|sideSpecial|upSpecial|downSpecial|lightPunch|heavyKick|parry)$/.test(id)) return;
    if (bound.has(id)) return;
    unbound.push(id);
  });

  return {
    scheme: "jkluio-v1",
    help: AUTO_BIND_HELP,
    keyboard,
    slots,
    context: {
      crouchLight: slots.attack1.crouch,
      crouchHeavy: slots.heavy1.crouch,
      airLight: slots.attack1.air,
      airHeavy: slots.heavy1.air,
    },
    unbound,
  };
}

/** Score a candidate VFX action for a body attack (higher = better overlay). */
function scoreVfxCandidate(vfxId, bodyAnim, actions) {
  if (vfxId == null || vfxId === bodyAnim || vfxId === 9999) return -1;
  if (!actions.has(vfxId)) return -1;
  const frames = (actions.get(vfxId) || []).filter((f) => f.group >= 0);
  if (!frames.length) return -1;
  const bodyG = dominantGroup(actions.get(bodyAnim) || []);
  const g = dominantGroup(frames);
  let score = frames.length;
  if (bodyG != null && g != null && g !== bodyG) score += 25;
  if (vfxId >= 7000 && vfxId < 9000) score += 18; // shared FX banks (8001, 8103…)
  if (!actionHasHitbox(frames)) score += 6;
  if (frames.length >= 4) score += 4;
  return score;
}

function pickBestVfx(candidates, bodyAnim, actions) {
  let best = null;
  for (const id of candidates) {
    const score = scoreVfxCandidate(id, bodyAnim, actions);
    if (score < 0) continue;
    if (!best || score > best.score) best = { id, score };
  }
  return best ? best.id : null;
}

function pickBestVfxEntry(entries, bodyAnim, actions, postypeFilter) {
  let best = null;
  for (const e of entries) {
    if (postypeFilter && e.postype !== postypeFilter) continue;
    const score = scoreVfxCandidate(e.anim, bodyAnim, actions);
    if (score < 0) continue;
    if (!best || score > best.score) best = { ...e, score };
  }
  return best;
}

/** Parse pair string → [x,y] using first numbers (supports decimals). */
function parseExplodPos(str) {
  if (!str) return [0, 0];
  const parts = String(str).split(",");
  const num = (s) => {
    const m = String(s).match(/-?\d*\.\d+|-?\d+/);
    return m ? Number(m[0]) : 0;
  };
  return [num(parts[0]), num(parts[1] || "0")];
}

function clampScale(pair) {
  const x = Number(pair[0]) || 1;
  const y = Number(pair[1]) || 1;
  // Guard against misparsed / extreme MUGEN scales
  const clamp1 = (v) => {
    if (v > 8) return Math.min(3, v / 10);
    if (v > 3) return 3;
    if (v < 0.05 && v !== 0) return 0.05;
    if (v === 0) return 1;
    return v;
  };
  return [clamp1(x), clamp1(y)];
}

function parseCnsInt(blk, name, fallback) {
  const m = blk.match(new RegExp(`^\\s*${name}\\s*=\\s*(-?\\d+)`, "im"));
  return m ? Number(m[1]) : fallback;
}

function parseCnsPair(blk, name, fallback) {
  const m = blk.match(new RegExp(`^\\s*${name}\\s*=\\s*([^\\n;]+)`, "im"));
  if (!m) return fallback.slice();
  return parseExplodPos(m[1]);
}

/** Delay ticks from trigger lines like `trigger1 = time = 12` / `animelem = 3`. */
function parseTriggerDelay(blk) {
  const timeM = blk.match(/trigger\d+\s*=\s*time\s*=\s*(\d+)/i)
    || blk.match(/trigger\d+\s*=\s*!?\s*time\s*=\s*(\d+)/i);
  if (timeM) return Number(timeM[1]);
  const elemM = blk.match(/trigger\d+\s*=\s*animelem\s*=\s*(\d+)/i);
  if (elemM) return Math.max(0, (Number(elemM[1]) - 1) * 3); // ~3 ticks/elem estimate
  if (/trigger\d+\s*=\s*!time\b/i.test(blk) || /trigger\d+\s*=\s*time\s*=\s*0\b/i.test(blk)) return 0;
  return 0;
}

function normalizePostype(raw, fallback) {
  const t = String(raw || fallback || "p1").toLowerCase().replace(/,.*/, "").trim();
  if (t === "p2" || t === "target" || t === "enemy") return "p2";
  if (t === "front" || t === "back" || t === "left" || t === "right") return t;
  if (t === "p1" || t === "self") return "p1";
  return fallback || "p1";
}

function extractVelFromStateBody(body) {
  const blocks = body.split(/(?=\[State)/i);
  for (const blk of blocks) {
    if (!/^\s*type\s*=\s*VelSet/im.test(blk)) continue;
    const x = (blk.match(/^\s*x\s*=\s*([^\n;]+)/im) || [])[1];
    const y = (blk.match(/^\s*y\s*=\s*([^\n;]+)/im) || [])[1];
    if (x != null || y != null) return parseExplodPos(`${x || 0},${y || 0}`);
  }
  return [0, 0];
}

function makeSpawn(partial) {
  return {
    anim: partial.anim,
    kind: partial.kind || "explod",
    postype: partial.postype || "p1",
    pos: partial.pos || [0, 0],
    vel: partial.vel || [0, 0],
    bindtime: partial.bindtime != null ? partial.bindtime : (partial.kind === "projectile" ? 0 : -1),
    removetime: partial.removetime != null ? partial.removetime : -2,
    scale: clampScale(partial.scale || [1, 1]),
    facing: partial.facing != null ? partial.facing : 1,
    sprpriority: partial.sprpriority != null ? partial.sprpriority : 0,
    delay: partial.delay || 0,
    removeonhit: !!partial.removeonhit,
  };
}

/**
 * Parse CNS/ST: body anim → spawn list with Explod timing + Helper/Projectile motion.
 */
function parseCnsVfxMap(dir) {
  const map = new Map(); // bodyAnim -> [spawn]
  let files = [];
  try {
    files = fs.readdirSync(dir).filter((f) => {
      const l = f.toLowerCase();
      return l.endsWith(".cns") || l.endsWith(".st");
    });
  } catch (_) {
    return map;
  }

  function addEntry(bodyAnim, entry) {
    if (!map.has(bodyAnim)) map.set(bodyAnim, []);
    const list = map.get(bodyAnim);
    const key = `${entry.anim}|${entry.postype}|${entry.kind}|${entry.delay}|${entry.pos[0]},${entry.pos[1]}`;
    if (list.some((e) => `${e.anim}|${e.postype}|${e.kind}|${e.delay}|${e.pos[0]},${e.pos[1]}` === key)) return;
    list.push(entry);
  }

  for (const file of files) {
    const t = readText(path.join(dir, file));
    const parts = t.split(/\[Statedef\s+/i);
    const stateAnim = new Map();
    const stateVel = new Map();
    const bodies = [];
    for (let i = 1; i < parts.length; i++) {
      const hm = parts[i].match(/^(\d+)\]/);
      if (!hm) continue;
      const sid = Number(hm[1]);
      const body = parts[i].slice(hm[0].length);
      bodies.push({ sid, body });
      const am = body.match(/^\s*anim\s*=\s*(\d+)/im);
      if (am) stateAnim.set(sid, Number(am[1]));
      stateVel.set(sid, extractVelFromStateBody(body));
    }
    for (const { body } of bodies) {
      const am = body.match(/^\s*anim\s*=\s*(\d+)/im);
      const bodyAnim = am ? Number(am[1]) : null;
      if (bodyAnim == null) continue;
      const stateBlocks = body.split(/(?=\[State)/i);
      for (const blk of stateBlocks) {
        if (!/\[State/i.test(blk)) continue;
        const typ = blk.match(/^\s*type\s*=\s*(\w+)/im);
        if (!typ) continue;
        const tname = typ[1].toLowerCase();
        const delay = parseTriggerDelay(blk);

        if (tname === "explod") {
          const ea = blk.match(/^\s*anim\s*=\s*(\d+)/im);
          if (!ea) continue;
          addEntry(bodyAnim, makeSpawn({
            anim: Number(ea[1]),
            kind: "explod",
            postype: normalizePostype((blk.match(/^\s*postype\s*=\s*(\S+)/im) || [])[1], "p1"),
            pos: parseCnsPair(blk, "pos", [0, 0]),
            vel: parseCnsPair(blk, "vel", [0, 0]),
            bindtime: parseCnsInt(blk, "bindtime", -1),
            removetime: parseCnsInt(blk, "removetime", -2),
            scale: parseCnsPair(blk, "scale", [1, 1]),
            facing: parseCnsInt(blk, "facing", 1),
            sprpriority: parseCnsInt(blk, "sprpriority", 0),
            delay,
          }));
        } else if (tname === "helper") {
          const sn = blk.match(/^\s*stateno\s*=\s*(\d+)/im);
          if (!sn || !stateAnim.has(Number(sn[1]))) continue;
          const hs = Number(sn[1]);
          const helperVel = stateVel.get(hs) || [0, 0];
          const pos = parseCnsPair(blk, "pos", [0, 0]);
          addEntry(bodyAnim, makeSpawn({
            anim: stateAnim.get(hs),
            kind: "helper",
            postype: normalizePostype((blk.match(/^\s*postype\s*=\s*(\S+)/im) || [])[1], "p1"),
            pos,
            vel: helperVel,
            bindtime: parseCnsInt(blk, "bindtime", 0),
            removetime: parseCnsInt(blk, "removetime", 90),
            scale: parseCnsPair(blk, "scale", [1, 1]),
            facing: parseCnsInt(blk, "facing", 1),
            sprpriority: parseCnsInt(blk, "sprpriority", 1),
            delay,
            removeonhit: true,
          }));
        } else if (tname === "projectile") {
          const ea = blk.match(/^\s*projanim\s*=\s*(\d+)/im);
          if (!ea) continue;
          let spawnPos = [0, -20];
          if (/^\s*offset\s*=/im.test(blk)) spawnPos = parseCnsPair(blk, "offset", spawnPos);
          else if (/^\s*pos\s*=/im.test(blk)) spawnPos = parseCnsPair(blk, "pos", spawnPos);
          addEntry(bodyAnim, makeSpawn({
            anim: Number(ea[1]),
            kind: "projectile",
            postype: "p1", // spawn at attacker + offset, then fly with vel
            pos: spawnPos,
            vel: parseCnsPair(blk, "velocity", [4, 0]),
            bindtime: 0,
            removetime: parseCnsInt(blk, "projremovetime", parseCnsInt(blk, "removetime", 60)),
            scale: (() => {
              if (/^\s*projscale\s*=/im.test(blk)) return parseCnsPair(blk, "projscale", [1, 1]);
              return parseCnsPair(blk, "scale", [1, 1]);
            })(),
            facing: 1,
            sprpriority: parseCnsInt(blk, "projpriority", 3),
            delay,
            removeonhit: true,
          }));
        }
      }
    }
  }
  return map;
}

/** Load packs/<id>/overrides.json and/or <charDir>/overrides.json */
function loadOverrides(dir, packId) {
  const paths = [
    path.join(getPacks(), packId, "overrides.json"),
    path.join(dir, "overrides.json"),
    path.join(dir, `${packId}.overrides.json`),
  ];
  const merged = {
    maxSpecials: null,
    ignoreActions: [],
    attacks: [],
    vfx: {}, // "1480": 8001 or action-id strings
  };
  for (const p of paths) {
    if (!fs.existsSync(p)) continue;
    try {
      const o = JSON.parse(fs.readFileSync(p, "utf8"));
      if (o.maxSpecials != null) merged.maxSpecials = o.maxSpecials;
      if (Array.isArray(o.ignoreActions)) merged.ignoreActions.push(...o.ignoreActions.map(Number));
      if (Array.isArray(o.attacks)) merged.attacks.push(...o.attacks.map(Number));
      if (o.vfx && typeof o.vfx === "object") Object.assign(merged.vfx, o.vfx);
      console.log(`  overrides ← ${path.relative(getRoot(), p)}`);
    } catch (err) {
      console.warn(`  warn: bad overrides ${p}: ${err.message}`);
    }
  }
  return merged;
}

/**
 * VFX companions: overrides > CNS Explod/Helper > AIR neighbors.
 * FX are overlays — not move-pad buttons.
 */
function findAirNeighborVfx(actions, attackIds, attackId, index) {
  const nextId = attackIds[index + 1] != null ? attackIds[index + 1] : attackId + 40;
  const bodyFrames = actions.get(attackId) || [];
  const bodyGroup = dominantGroup(bodyFrames);
  let best = null;
  for (let id = attackId + 1; id < nextId; id++) {
    if (!actions.has(id) || attackIds.includes(id)) continue;
    const frames = (actions.get(id) || []).filter((f) => f.group >= 0);
    if (!frames.length) continue;
    const g = dominantGroup(frames);
    const hit = actionHasHitbox(frames);
    const differentGroup = bodyGroup != null && g != null && g !== bodyGroup;
    if (!differentGroup && hit) continue;
    if (!differentGroup && frames.length < 4) continue;
    const score = scoreVfxCandidate(id, attackId, actions);
    if (score < 0) continue;
    if (!best || score > best.score) best = { id, score, differentGroup };
  }
  return best;
}

function spawnFromEntry(e) {
  return makeSpawn(e);
}

/** Pick up to MAX_VFX_SPAWNS diverse Explod/Helper/Projectile spawns. */
function selectSpawns(entries, actions, attackId, extras) {
  const kindBonus = { projectile: 28, helper: 18, explod: 10, air: 6, override: 40 };
  const scored = (entries || [])
    .filter((e) => e && actions.has(e.anim) && scoreVfxCandidate(e.anim, attackId, actions) >= 0)
    .map((e) => ({
      ...e,
      score: scoreVfxCandidate(e.anim, attackId, actions) + (kindBonus[e.kind] || 0),
    }))
    .sort((a, b) => b.score - a.score);

  const out = [];
  const seen = new Set();
  function push(e) {
    if (!e || !actions.has(e.anim)) return;
    const s = spawnFromEntry(e);
    const key = `${s.anim}|${s.postype}|${s.kind}|${s.delay}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(s);
  }
  for (const e of extras || []) push(e);
  for (const e of scored) {
    if (out.length >= MAX_VFX_SPAWNS) break;
    push(e);
  }
  // Prefer at least one p2 hit if available and missing
  if (!out.some((s) => s.postype === "p2")) {
    const p2 = scored.find((e) => e.postype === "p2");
    if (p2 && out.length < MAX_VFX_SPAWNS) push(p2);
  }
  return out.slice(0, MAX_VFX_SPAWNS);
}

/**
 * Resolve VFX for each attack.
 * Returns { [attackId]: { self, hit, spawns } }
 * spawns = full Explod/Helper/Projectile list for the preview sim.
 */
function findVfxCompanions(actions, attackIds, cnsVfxMap, overrides) {
  const links = {};
  const overrideVfx = overrides && overrides.vfx ? overrides.vfx : {};

  function parseOverride(ov) {
    if (ov == null) return null;
    if (typeof ov === "number" || (typeof ov === "string" && /^\d+$/.test(ov))) {
      const id = Number(ov);
      if (!actions.has(id)) return null;
      return makeSpawn({ anim: id, postype: "p1", kind: "override" });
    }
    if (typeof ov === "object") {
      const id = Number(ov.anim != null ? ov.anim : ov.id);
      if (!actions.has(id)) return null;
      return makeSpawn({
        anim: id,
        postype: normalizePostype(ov.postype, "p1"),
        pos: Array.isArray(ov.pos) ? [Number(ov.pos[0]) || 0, Number(ov.pos[1]) || 0] : [0, 0],
        vel: Array.isArray(ov.vel) ? [Number(ov.vel[0]) || 0, Number(ov.vel[1]) || 0] : [0, 0],
        bindtime: ov.bindtime != null ? Number(ov.bindtime) : undefined,
        removetime: ov.removetime != null ? Number(ov.removetime) : undefined,
        scale: Array.isArray(ov.scale) ? ov.scale : [1, 1],
        facing: ov.facing != null ? Number(ov.facing) : 1,
        delay: ov.delay || 0,
        kind: ov.kind || "override",
      });
    }
    return null;
  }

  for (let i = 0; i < attackIds.length; i++) {
    const attackId = attackIds[i];
    let self = null;
    let hit = null;
    const extras = [];

    const ov = overrideVfx[String(attackId)] != null
      ? overrideVfx[String(attackId)]
      : overrideVfx[attackId];
    const entries = (cnsVfxMap && cnsVfxMap.get(attackId)) || [];
    const cnsP2Early = pickBestVfxEntry(entries, attackId, actions, "p2");

    if (ov != null && typeof ov === "object" && !Array.isArray(ov) && (ov.self != null || ov.hit != null || ov.spawns)) {
      self = parseOverride(ov.self);
      hit = parseOverride(ov.hit);
      if (Array.isArray(ov.spawns)) {
        for (const s of ov.spawns) {
          const p = parseOverride(s);
          if (p) extras.push(p);
        }
      }
      if (self) extras.push(self);
      if (!hit && cnsP2Early) hit = spawnFromEntry(cnsP2Early);
      if (hit) extras.push(hit);
      const spawns = selectSpawns(entries, actions, attackId, extras);
      links[attackId] = { self: self || spawns.find((s) => s.postype !== "p2") || null, hit, spawns };
      continue;
    }
    if (ov != null) {
      const one = parseOverride(ov);
      if (one) {
        if (one.postype === "p2") hit = one;
        else self = one;
        if (self) extras.push(self);
        if (!hit && cnsP2Early) hit = spawnFromEntry(cnsP2Early);
        if (hit) extras.push(hit);
        const spawns = selectSpawns(entries, actions, attackId, extras);
        links[attackId] = { self, hit, spawns };
        continue;
      }
    }

    // Prefer CNS Explod/Helper/Projectile whenever present; AIR neighbors only as fallback.
    const cnsP1 = pickBestVfxEntry(entries, attackId, actions, "p1");
    const cnsProj = entries.filter((e) => e.kind === "projectile");
    const bestProj = cnsProj.length ? pickBestVfxEntry(cnsProj, attackId, actions, null) : null;
    const cnsP2 = pickBestVfxEntry(entries, attackId, actions, "p2");
    const cnsAny = pickBestVfxEntry(entries, attackId, actions, null);
    const cnsSelf = cnsP1 || bestProj || (cnsAny && cnsAny.postype !== "p2" ? cnsAny : null);
    const hasCns = entries.length > 0;

    if (hasCns) {
      if (cnsSelf) self = spawnFromEntry(cnsSelf);
      else if (cnsAny && cnsAny.postype === "p2") hit = spawnFromEntry(cnsAny);
    } else {
      const air = findAirNeighborVfx(actions, attackIds, attackId, i);
      if (air && (air.differentGroup || air.score >= 12)) {
        self = makeSpawn({ anim: air.id, postype: "p1", kind: "air" });
      }
    }

    if (cnsP2 && (!self || cnsP2.anim !== self.anim)) hit = spawnFromEntry(cnsP2);
    if (self) extras.push(self);
    if (hit) extras.push(hit);

    const spawns = selectSpawns(entries, actions, attackId, extras);
    if (self || hit || spawns.length) links[attackId] = { self, hit, spawns };
  }
  return links;
}

/**
 * Attach VFX spawn anim keys onto map for one attack prefix (special / crouchAttack / airAttack).
 */
function mapVfxForAttack(map, prefix, n, link) {
  if (!link) return;
  const actionToKey = new Map();
  let slot = 0;
  for (const sp of link.spawns || []) {
    if (actionToKey.has(sp.anim)) {
      sp.animKey = actionToKey.get(sp.anim);
      continue;
    }
    const key = `${prefix}${n}_s${slot}`;
    slot += 1;
    actionToKey.set(sp.anim, key);
    sp.animKey = key;
    map[key] = sp.anim;
  }
  if (link.self) {
    const k = actionToKey.get(link.self.anim) || (link.spawns[0] && link.spawns[0].animKey);
    if (k) {
      map[`${prefix}${n}_fx`] = link.self.anim;
      link.self.animKey = k;
    }
  }
  if (link.hit) {
    const k = actionToKey.get(link.hit.anim);
    if (k) {
      map[`${prefix}${n}_hitfx`] = link.hit.anim;
      link.hit.animKey = k;
    }
  }
}

function resolveAnimMap(actions, offset, cnsVfxMap, overrides) {
  overrides = overrides || {};
  const map = {};
  /** Required loco — fall back to idle if missing. */
  function pick(name, primary, fallback) {
    const a = offset + primary;
    const b = offset + (fallback != null ? fallback : FALLBACK_REL[name] || primary);
    if (actions.has(a)) { map[name] = a; return true; }
    if (actions.has(b)) { map[name] = b; return true; }
    const idle = offset + 0;
    if (actions.has(idle)) { map[name] = idle; return true; }
    return false;
  }
  /** Optional loco — only pack when AIR has the action (never alias idle). */
  function pickOptional(name, primary, fallback) {
    const a = offset + primary;
    const b = offset + (fallback != null ? fallback : FALLBACK_REL[name] || primary);
    if (actions.has(a)) { map[name] = a; return true; }
    if (fallback != null && b !== a && actions.has(b)) { map[name] = b; return true; }
    return false;
  }

  pick("idle", 0, 0);
  pick("hitstun", 5, 5);
  pick("block", 6, 6);
  pickOptional("crouchStart", 10, 11);
  pick("crouch", 11, 11);
  pickOptional("crouchEnd", 12, 11);
  pick("walk", 20, 20);
  pick("walkBack", 21, 20);
  pick("jumpStart", 40, 15);
  pick("jump", 41, 16);
  pickOptional("jumpFwd", 42, 41);
  pickOptional("jumpBack", 43, 41);
  pick("land", 47, 0);
  pickOptional("dash", 100, 100);
  pickOptional("run", 101, 100);
  pickOptional("dashBack", 105, 105);
  pick("parry", 230, 6);
  pick("parryStun", 5, 5);

  const ignore = new Set((overrides.ignoreActions || []).map(Number));
  const maxN = overrides.maxNormals != null ? overrides.maxNormals : MAX_NORMALS;
  const maxS = overrides.maxSpecials != null ? overrides.maxSpecials : MAX_SPECIALS;
  const maxH = overrides.maxHypers != null ? overrides.maxHypers : MAX_HYPERS;
  const maxCmd = overrides.maxCommands != null ? overrides.maxCommands : MAX_COMMANDS;
  const maxTh = overrides.maxThrows != null ? overrides.maxThrows : MAX_THROWS;
  const maxC = overrides.maxCrouchAttacks != null ? overrides.maxCrouchAttacks : MAX_CROUCH_ATTACKS;
  const maxA = overrides.maxAirAttacks != null ? overrides.maxAirAttacks : MAX_AIR_ATTACKS;

  let normalIds = discoverNormals(actions, offset, maxN).filter((id) => !ignore.has(id));
  let specialIds = discoverSpecials(actions, offset, maxS).filter((id) => !ignore.has(id));
  let hyperIds = discoverHypers(actions, offset, maxH).filter((id) => !ignore.has(id));
  let commandIds = discoverCommands(actions, offset, maxCmd).filter((id) => !ignore.has(id));
  let throwIds = discoverThrows(actions, offset, maxTh).filter((id) => !ignore.has(id));
  let crouchIds = discoverCrouchAttacks(actions, offset, maxC).filter((id) => !ignore.has(id));
  let airIds = discoverAirAttacks(actions, offset, maxA).filter((id) => !ignore.has(id));

  // Force-include override attacks into normals
  for (const id of overrides.attacks || []) {
    if (actions.has(id) && !normalIds.includes(id) && !ignore.has(id)) normalIds.push(id);
  }
  const sortTrim = (arr, max) => {
    arr.sort((a, b) => a - b);
    return arr.length > max ? arr.slice(0, max) : arr;
  };
  normalIds = sortTrim(normalIds, maxN);
  specialIds = sortTrim(specialIds, maxS);
  hyperIds = sortTrim(hyperIds, maxH);
  commandIds = sortTrim(commandIds, maxCmd);
  throwIds = sortTrim(throwIds, maxTh);
  crouchIds = sortTrim(crouchIds, maxC);
  airIds = sortTrim(airIds, maxA);

  const allAttackIds = [
    ...normalIds, ...specialIds, ...hyperIds, ...commandIds, ...throwIds, ...crouchIds, ...airIds,
  ];
  const vfxLinks = findVfxCompanions(actions, allAttackIds, cnsVfxMap, overrides);

  const attackGroups = [
    { prefix: "normal", label: "Normal", ids: normalIds },
    { prefix: "special", label: "Special", ids: specialIds },
    { prefix: "hyper", label: "Hyper", ids: hyperIds },
    { prefix: "command", label: "Command", ids: commandIds },
    { prefix: "throw", label: "Throw", ids: throwIds },
    { prefix: "crouchAttack", label: "Crouch", ids: crouchIds },
    { prefix: "airAttack", label: "Air", ids: airIds },
  ];

  for (const group of attackGroups) {
    group.ids.forEach((actionId, i) => {
      const n = i + 1;
      map[`${group.prefix}${n}`] = actionId;
      mapVfxForAttack(map, group.prefix, n, vfxLinks[actionId]);
    });
  }

  if (normalIds[0] != null) map.lightPunch = normalIds[0];
  if (normalIds[1] != null) map.heavyKick = normalIds[1];
  else if (normalIds[0] != null) map.heavyKick = normalIds[0];

  return {
    map,
    attackIds: normalIds,
    normalIds,
    specialIds,
    hyperIds,
    commandIds,
    throwIds,
    crouchAttackIds: crouchIds,
    airAttackIds: airIds,
    attackGroups,
    vfxLinks,
  };
}

function unionClsn(boxes) {
  if (!boxes.length) return null;
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const b of boxes) {
    x1 = Math.min(x1, b.x1, b.x2);
    y1 = Math.min(y1, b.y1, b.y2);
    x2 = Math.max(x2, b.x1, b.x2);
    y2 = Math.max(y2, b.y1, b.y2);
  }
  return { x1, y1, x2, y2 };
}

/** MUGEN Clsn (axis-relative px, Y up negative in MUGEN) → game hitbox (feet origin, Y up). */
function clsnToHitbox(box) {
  if (!box) return null;
  const s = MUGEN_PX_TO_WORLD;
  // MUGEN: y negative is up. Game: offsetY is bottom of box above feet.
  const left = Math.min(box.x1, box.x2) * s;
  const right = Math.max(box.x1, box.x2) * s;
  const top = -Math.min(box.y1, box.y2) * s; // higher positive
  const bottom = -Math.max(box.y1, box.y2) * s;
  const w = Math.max(0.2, right - left);
  const h = Math.max(0.2, top - bottom);
  return {
    w: Math.round(w * 100) / 100,
    h: Math.round(h * 100) / 100,
    offsetX: Math.round(left * 100) / 100,
    offsetY: Math.round(bottom * 100) / 100,
  };
}

/** When AIR has no Clsn1, extend Clsn2 (hurt) forward into an attack box. */
function inferHitboxFromClsn2(frames) {
  const withBody = frames.filter((f) => f.clsn2 && f.clsn2.length);
  if (!withBody.length) {
    return { w: 0.55, h: 0.5, offsetX: 0.4, offsetY: 0.55 };
  }
  // Use middle third of anim as "active" reach (where attacks usually extend)
  const start = Math.floor(withBody.length * 0.3);
  const end = Math.max(start + 1, Math.ceil(withBody.length * 0.75));
  const slice = withBody.slice(start, end);
  const boxes = [];
  for (const f of slice) boxes.push(...f.clsn2);
  const body = unionClsn(boxes);
  if (!body) return { w: 0.55, h: 0.5, offsetX: 0.4, offsetY: 0.55 };
  const bw = Math.abs(body.x2 - body.x1);
  const bh = Math.abs(body.y2 - body.y1);
  // Reach ahead of the body (MUGEN +X = forward when facing right)
  const x1 = Math.max(body.x1, body.x2) - Math.max(4, bw * 0.15);
  const x2 = Math.max(body.x1, body.x2) + Math.max(12, bw * 0.85);
  const yMid = (body.y1 + body.y2) / 2;
  const y1 = yMid - Math.max(8, bh * 0.35);
  const y2 = yMid + Math.max(8, bh * 0.35);
  return clsnToHitbox({ x1, y1, x2, y2 });
}

function timingFromFrames(frames) {
  let startup = 0;
  let active = 0;
  let recovery = 0;
  let phase = "startup";
  const activeBoxes = [];
  for (const f of frames) {
    const hasHit = f.clsn1 && f.clsn1.length > 0;
    if (phase === "startup") {
      if (hasHit) {
        phase = "active";
        active += f.ticks;
        activeBoxes.push(...f.clsn1);
      } else startup += f.ticks;
    } else if (phase === "active") {
      if (hasHit) {
        active += f.ticks;
        activeBoxes.push(...f.clsn1);
      } else {
        phase = "recovery";
        recovery += f.ticks;
      }
    } else {
      recovery += f.ticks;
    }
  }
  let hitbox = clsnToHitbox(unionClsn(activeBoxes));
  let hitboxSource = "clsn1";
  let hitboxReliable = true;
  if (active === 0 || !hitbox) {
    // No Clsn1 — middle third active + infer reach from Clsn2 (marked unreliable)
    const total = frames.reduce((s, f) => s + f.ticks, 0) || 1;
    startup = Math.max(1, Math.floor(total * 0.25));
    active = Math.max(2, Math.floor(total * 0.35));
    recovery = Math.max(1, total - startup - active);
    hitbox = inferHitboxFromClsn2(frames);
    hitboxSource = "clsn2-inferred";
    hitboxReliable = false;
  }
  return {
    startup: Math.max(1, startup),
    active: Math.max(1, active),
    recovery: Math.max(1, recovery),
    hitbox,
    hitboxSource,
    hitboxReliable,
  };
}

function buildMovesFromPack(animMap, actions, attackGroups, vfxLinks) {
  const moves = {};
  const moveList = [];
  vfxLinks = vfxLinks || {};
  const groups = attackGroups || [{ prefix: "special", label: "Special", ids: [] }];

  for (const group of groups) {
    (group.ids || []).forEach((actionId, i) => {
      const animName = `${group.prefix}${i + 1}`;
      const frames = actions.get(actionId) || [];
      const timing = timingFromFrames(frames);
      const damage = Math.min(120, 28 + i * 8 + (group.prefix === "airAttack" ? 4 : 0));
      const move = {
        label: `${group.label} ${i + 1}`,
        startup: timing.startup,
        active: timing.active,
        recovery: timing.recovery,
        damage,
        hitstun: 10 + Math.min(10, i * 2),
        blockstun: 8 + Math.min(6, i),
        knockback: 0.35 + i * 0.06,
        hitbox: timing.hitbox,
        hitboxSource: timing.hitboxSource || "clsn1",
        hitboxReliable: timing.hitboxReliable !== false,
        animation: animName,
        sourceAction: actionId,
        band: group.prefix,
      };
      const link = vfxLinks[actionId];
      if (link && link.self) {
        move.vfx = link.self.animKey || `${animName}_fx`;
        move.vfxAction = link.self.anim;
        move.vfxPostype = link.self.postype || "p1";
        move.vfxPos = link.self.pos || [0, 0];
      }
      if (link && link.hit) {
        move.vfxHit = link.hit.animKey || `${animName}_hitfx`;
        move.vfxHitAction = link.hit.anim;
        move.vfxHitPostype = "p2";
        move.vfxHitPos = link.hit.pos || [0, 0];
      }
      if (!move.vfx && link && link.hit) {
        move.vfx = move.vfxHit;
        move.vfxAction = move.vfxHitAction;
        move.vfxPostype = "p2";
        move.vfxPos = move.vfxHitPos;
      }
      if (link && link.spawns && link.spawns.length) {
        move.vfxSpawns = link.spawns.map((s) => ({
          anim: s.animKey,
          action: s.anim,
          kind: s.kind,
          postype: s.postype,
          pos: s.pos,
          vel: s.vel,
          bindtime: s.bindtime,
          removetime: s.removetime,
          scale: s.scale,
          facing: s.facing,
          sprpriority: s.sprpriority,
          delay: s.delay,
          removeonhit: !!s.removeonhit,
        }));
      }
      moves[animName] = move;
      moveList.push({ id: animName, label: move.label, band: group.prefix });
    });
  }

  // Smack / simple kit: normals first, then specials, then hypers
  const smackSources = [
    moves.normal1 || moves.special1,
    moves.normal2 || moves.special2 || moves.normal1,
    moves.airAttack1 || moves.normal3 || moves.normal1,
    moves.crouchAttack1 || moves.normal2 || moves.normal1,
    moves.special1 || moves.hyper1 || moves.normal1,
    moves.special2 || moves.special1 || moves.normal2,
    moves.special3 || moves.hyper1 || moves.special1,
    moves.special4 || moves.hyper2 || moves.special2 || moves.special1,
  ];
  SMACK_SLOTS.forEach((slot, i) => {
    const src = smackSources[i] || smackSources[0];
    if (!src) return;
    moves[slot] = {
      ...src,
      label: slot,
      animation: src.animation,
    };
  });

  moves.parry = {
    label: "Parry",
    startup: 1, active: 8, recovery: 10,
    damage: 0, hitstun: 0, blockstun: 0, knockback: 0,
    hitbox: { w: 0.55, h: 0.85, offsetX: 0.45, offsetY: 0.7 },
    animation: "parry",
    isParry: true,
  };

  if (moves.normal1) {
    moves.lightPunch = { ...moves.normal1, label: "Light", animation: moves.normal1.animation };
  } else if (moves.special1) {
    moves.lightPunch = { ...moves.special1, label: "Light", animation: moves.special1.animation };
  }
  if (moves.normal2 || moves.normal1 || moves.special2 || moves.special1) {
    const s = moves.normal2 || moves.special2 || moves.normal1 || moves.special1;
    moves.heavyKick = { ...s, label: "Heavy", animation: s.animation };
  }

  return { moves, moveList };
}

async function loadSffSprites(sffPath) {
  const extract = (await import("sff-extractor")).default;
  const buf = fs.readFileSync(sffPath);
  const data = extract(buf, {
    decodeSpriteBuffer: true,
    spriteBuffer: false,
    paletteBuffer: false,
    paletteTable: false,
  });
  const byKey = new Map();
  for (const s of data.sprites) {
    byKey.set(`${s.group}_${s.number}`, s);
  }
  return { meta: data, byKey };
}

function scaleRgba(src, sw, sh, tw, th) {
  const out = Buffer.alloc(tw * th * 4);
  for (let y = 0; y < th; y++) {
    for (let x = 0; x < tw; x++) {
      const sx = Math.min(sw - 1, Math.floor((x + 0.5) * sw / tw));
      const sy = Math.min(sh - 1, Math.floor((y + 0.5) * sh / th));
      const si = (sy * sw + sx) * 4;
      const di = (y * tw + x) * 4;
      out[di] = src[si];
      out[di + 1] = src[si + 1];
      out[di + 2] = src[si + 2];
      out[di + 3] = src[si + 3];
    }
  }
  return out;
}

/** Knock out plate background (SFF decode often emits opaque white for empty). */
function knockOutBackground(data, w, h) {
  const match = (i, r, g, b) => {
    const o = i * 4;
    return Math.abs(data[o] - r) <= 2 && Math.abs(data[o + 1] - g) <= 2 && Math.abs(data[o + 2] - b) <= 2;
  };
  // Seed from corners — typical MUGEN plate color
  const seeds = [0, w - 1, (h - 1) * w, (h - 1) * w + (w - 1)];
  const key = seeds.map((i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]);
  const visited = new Uint8Array(w * h);
  const stack = [];
  function tryPush(i, r, g, b) {
    if (i < 0 || i >= w * h || visited[i]) return;
    if (!match(i, r, g, b)) return;
    visited[i] = 1;
    stack.push(i);
  }
  for (const i of seeds) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    tryPush(i, r, g, b);
  }
  while (stack.length) {
    const i = stack.pop();
    data[i * 4 + 3] = 0;
    const x = i % w;
    const y = (i / w) | 0;
    for (const [kr, kg, kb] of key) {
      if (x > 0) tryPush(i - 1, kr, kg, kb);
      if (x + 1 < w) tryPush(i + 1, kr, kg, kb);
      if (y > 0) tryPush(i - w, kr, kg, kb);
      if (y + 1 < h) tryPush(i + w, kr, kg, kb);
    }
  }
  // Classic MUGEN chroma keys (not white — flood-fill handles white plates)
  for (let i = 0; i < w * h; i++) {
    if (match(i, 255, 0, 255) || match(i, 0, 255, 0)) data[i * 4 + 3] = 0;
  }
}

function contentBounds(data, w, h) {
  let minX = w, minY = h, maxX = 0, maxY = 0, found = false;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 8) {
        found = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (!found) return { x: 0, y: 0, w, h };
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

function cropRgba(data, w, h, box) {
  const out = Buffer.alloc(box.w * box.h * 4);
  for (let y = 0; y < box.h; y++) {
    const src = ((box.y + y) * w + box.x) * 4;
    data.copy(out, y * box.w * 4, src, src + box.w * 4);
  }
  return out;
}

function packFramesOnce(images, maxEdge) {
  const gap = 2;
  const sorted = images.map((im, i) => ({ ...im, i })).sort((a, b) => b.h - a.h);
  let shelfX = gap, shelfY = gap, shelfH = 0, atlasW = gap, atlasH = gap;
  const placed = new Array(images.length);

  for (const im of sorted) {
    // Single sprite wider than edge: still place, caller will downscale
    if (shelfX + im.w + gap > maxEdge && shelfX > gap) {
      shelfY += shelfH + gap;
      shelfX = gap;
      shelfH = 0;
    }
    placed[im.i] = { x: shelfX, y: shelfY, w: im.w, h: im.h };
    shelfX += im.w + gap;
    shelfH = Math.max(shelfH, im.h);
    atlasW = Math.max(atlasW, shelfX);
    atlasH = Math.max(atlasH, shelfY + shelfH + gap);
  }

  const data = Buffer.alloc(atlasW * atlasH * 4);
  const frames = {};
  images.forEach((im, i) => {
    const p = placed[i];
    for (let y = 0; y < im.h; y++) {
      for (let x = 0; x < im.w; x++) {
        const si = (y * im.w + x) * 4;
        const di = ((p.y + y) * atlasW + (p.x + x)) * 4;
        data[di] = im.data[si];
        data[di + 1] = im.data[si + 1];
        data[di + 2] = im.data[si + 2];
        data[di + 3] = im.data[si + 3];
      }
    }
    frames[im.key] = {
      x: p.x, y: p.y, w: im.w, h: im.h,
      ax: im.ax, ay: im.ay,
    };
  });
  return { width: atlasW, height: atlasH, data, frames };
}

function scalePackedImage(im, factor) {
  if (factor >= 0.999) return im;
  const tw = Math.max(1, Math.round(im.w * factor));
  const th = Math.max(1, Math.round(im.h * factor));
  return {
    ...im,
    data: scaleRgba(im.data, im.w, im.h, tw, th),
    w: tw,
    h: th,
    ax: Math.round(im.ax * (tw / im.w)),
    ay: Math.round(im.ay * (th / im.h)),
  };
}

/** Shelf-pack; auto-shrink sprites until atlas fits MAX_ATLAS_EDGE. */
function packFrames(images) {
  let cur = images;
  let extraScale = 1;
  for (let attempt = 0; attempt < 10; attempt++) {
    const atlas = packFramesOnce(cur, MAX_ATLAS_EDGE);
    if (atlas.width <= MAX_ATLAS_EDGE && atlas.height <= MAX_ATLAS_EDGE) {
      if (extraScale < 0.999) {
        console.log(`  atlas fit: scaled sprites ×${extraScale.toFixed(2)} → ${atlas.width}x${atlas.height}`);
      }
      return { ...atlas, fitScale: extraScale };
    }
    const factor = Math.min(
      MAX_ATLAS_EDGE / Math.max(1, atlas.width),
      MAX_ATLAS_EDGE / Math.max(1, atlas.height),
      0.9
    ) * 0.96;
    extraScale *= factor;
    cur = cur.map((im) => scalePackedImage(im, factor));
  }
  const atlas = packFramesOnce(cur, MAX_ATLAS_EDGE);
  console.warn(`  warn: atlas ${atlas.width}x${atlas.height} still over ${MAX_ATLAS_EDGE} after shrink`);
  return { ...atlas, fitScale: extraScale };
}

function writePng(filePath, img) {
  const png = new PNG({ width: img.width, height: img.height });
  png.data = Buffer.from(img.data);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, PNG.sync.write(png, { colorType: 6 }));
}

function buildCharacterJson({ id, name, physics, frames, anims, scale, pxToWorld, source, moves, moveList, binds }) {
  return {
    id,
    name,
    version: 3,
    style: "framesheet",
    roblox: {
      upload: ["atlas.png"],
      animate: "ImageRectOffset",
      moduleFrom: "character.json",
    },
    skin: {
      style: "framesheet",
      atlasPack: id,
      bone: "#c8d0dc",
      joint: "#7eb8ff",
      accent: null,
    },
    physics,
    moves: moves || {},
    moveList: moveList || [],
    binds: binds || { scheme: "auto-v1", keyboard: {}, context: {}, help: AUTO_BIND_HELP },
    atlas: {
      image: "atlas.png",
      scale,
      // Clsn boxes in character.json are in atlas pixel space; world = atlasPx * pxToWorld
      pxToWorld: pxToWorld != null ? pxToWorld : scale / PREVIEW_PX,
      frames,
    },
    anims,
    source,
  };
}

function scaleClsnBoxes(boxes, sc) {
  if (!boxes || !boxes.length || sc === 1) return boxes || [];
  return boxes.map((b) => ({
    x1: b.x1 * sc,
    y1: b.y1 * sc,
    x2: b.x2 * sc,
    y2: b.y2 * sc,
  }));
}

function atlasClsnToWorldHitbox(box, pxToWorld) {
  if (!box) return null;
  const left = Math.min(box.x1, box.x2) * pxToWorld;
  const right = Math.max(box.x1, box.x2) * pxToWorld;
  const top = -Math.min(box.y1, box.y2) * pxToWorld;
  const bottom = -Math.max(box.y1, box.y2) * pxToWorld;
  return {
    w: Math.round(Math.max(0.15, right - left) * 100) / 100,
    h: Math.round(Math.max(0.15, top - bottom) * 100) / 100,
    offsetX: Math.round(left * 100) / 100,
    offsetY: Math.round(bottom * 100) / 100,
  };
}

/** Rebuild move hitboxes from packed Clsn; attach per-frame Clsn1 for exports. */
function recomputeMoveHitboxes(moves, anims, pxToWorld) {
  if (!moves || !anims) return;
  for (const id of Object.keys(moves)) {
    const move = moves[id];
    if (!move || !move.animation) continue;
    const actionId = anims.map[move.animation];
    if (actionId == null) continue;
    const action = anims.actions[String(actionId)];
    if (!action || !action.frames) continue;

    const activeBoxes = [];
    move.hitboxesPerFrame = action.frames.map((f) => {
      const boxes = (f.clsn1 && f.clsn1.length) ? f.clsn1.map((b) => ({ ...b })) : [];
      if (boxes.length) activeBoxes.push(...boxes);
      return {
        key: f.key,
        ticks: f.ticks,
        clsn1: boxes,
        hitbox: boxes.length ? atlasClsnToWorldHitbox(unionClsn(boxes), pxToWorld) : null,
      };
    });

    const hadRealClsn1 = activeBoxes.length > 0;
    if (hadRealClsn1) {
      const box = unionClsn(activeBoxes);
      move.hitbox = atlasClsnToWorldHitbox(box, pxToWorld);
      move.hitboxSource = "clsn1-atlas";
      move.hitboxReliable = true;
    } else {
      // Keep timing inference but mark unreliable for Roblox / combat export
      move.hitboxReliable = false;
      if (move.hitboxSource !== "clsn2-inferred") {
        move.hitboxSource = move.hitboxSource || "none";
      }
    }
  }
}

/** Pack quality summary attached to character.json */
function buildQualityReport(character, missingSprites) {
  const moves = character.moves || {};
  const attackIds = Object.keys(moves).filter((k) =>
    /^(normal|special|hyper|command|throw|crouchAttack|airAttack)\d+$/.test(k)
  );
  let withClsn1 = 0;
  let inferred = 0;
  let unreliable = 0;
  let withVfx = 0;
  let frameHitboxes = 0;
  for (const id of attackIds) {
    const m = moves[id];
    if (!m) continue;
    if (m.hitboxSource === "clsn1" || m.hitboxSource === "clsn1-atlas") withClsn1 += 1;
    if (m.hitboxSource === "clsn2-inferred") inferred += 1;
    if (m.hitboxReliable === false) unreliable += 1;
    if (m.vfx || (m.vfxSpawns && m.vfxSpawns.length)) withVfx += 1;
    if (m.hitboxesPerFrame && m.hitboxesPerFrame.some((f) => f.hitbox)) frameHitboxes += 1;
  }
  const n = attackIds.length || 1;
  return {
    attackMoves: attackIds.length,
    clsn1Rate: Math.round((withClsn1 / n) * 100) / 100,
    inferredHitboxRate: Math.round((inferred / n) * 100) / 100,
    unreliableHitboxRate: Math.round((unreliable / n) * 100) / 100,
    vfxLinkRate: Math.round((withVfx / n) * 100) / 100,
    movesWithPerFrameHitboxes: frameHitboxes,
    missingSprites: missingSprites || [],
    missingSpriteCount: (missingSprites && missingSprites.length) || 0,
    notes: [
      "Attack/VFX anims keep all AIR frames (not trimmed).",
      "Roblox export omits inferred move hitboxes (hitboxReliable=false).",
      "Prefer packs/<id>/overrides.json vfx{} for stubborn CNS links.",
    ],
  };
}

function isAttackOrFxAnimName(animName) {
  return /^(normal|special|hyper|command|throw|crouchAttack|airAttack)\d+/i.test(animName)
    || /_(fx|hitfx|s\d+)$/i.test(animName);
}

/** Never trim attacks/VFX. Loco/idle may be evenly sampled if extremely long. */
function trimAnimFrames(frames, animName) {
  if (isAttackOrFxAnimName(animName)) return frames;
  if (frames.length <= MAX_FRAMES_LOCO) return frames;
  const out = [];
  for (let i = 0; i < MAX_FRAMES_LOCO; i++) {
    const idx = Math.round((i * (frames.length - 1)) / (MAX_FRAMES_LOCO - 1));
    out.push(frames[idx]);
  }
  return out;
}

/**
 * Optional preload from JSMugen (browser): { actions: Map, byKey: Map, engine: "jsmugen" }
 * When set, skips local AIR parse + sff-extractor — uses the engine that already plays chars correctly.
 */
async function packFromMugen(dir, skin, preload) {
  const files = findMugenFiles(dir);
  if (!files.sff || !files.air) throw new Error(`No .sff/.air in ${dir}`);

  const def = parseDef(files.def);
  const cnsPath = files.cns || (def.files && def.files.cns ? path.join(dir, def.files.cns) : null);
  const physics = parseCnsPhysics(cnsPath);
  const usingJsmugen = !!(preload && preload.actions && preload.byKey);
  const actions = usingJsmugen ? preload.actions : parseAirActions(files.air);
  const offset = skin ? skin.offset : 0;
  const id = skin ? skin.id : slugify(def.name || path.basename(dir));
  const name = skin ? skin.name : (def.name || path.basename(dir));
  const overrides = loadOverrides(dir, id);
  const cnsVfxMap = parseCnsVfxMap(dir);
  console.log(`  CNS VFX map: ${cnsVfxMap.size} body anims with Explod/Helper/Proj`);
  if (usingJsmugen) {
    console.log(`  sprite/AIR source: JSMugen engine (${preload.byKey.size} sprites preloaded)`);
  }

  const {
    map: animMap,
    attackIds,
    normalIds,
    specialIds,
    hyperIds,
    commandIds,
    throwIds,
    crouchAttackIds,
    airAttackIds,
    attackGroups,
    vfxLinks,
  } = resolveAnimMap(actions, offset, cnsVfxMap, overrides);
  const { moves, moveList } = buildMovesFromPack(animMap, actions, attackGroups, vfxLinks);
  const binds = buildAutoBinds(moves, animMap);
  const vfxCount = Object.keys(vfxLinks || {}).length;
  if (vfxCount) {
    const allIds = [
      ...normalIds, ...specialIds, ...hyperIds, ...commandIds, ...throwIds, ...crouchAttackIds, ...airAttackIds,
    ];
    const pairs = allIds.filter((a) => vfxLinks[a]).map((a) => {
      const L = vfxLinks[a];
      const n = (L.spawns || []).length;
      const kinds = [...new Set((L.spawns || []).map((s) => s.kind))].join("+");
      return `${a}×${n}(${kinds || "fx"})`;
    });
    console.log(`  linked ${vfxCount} attack VFX sets: ${pairs.join(", ")}`);
  }

  console.log(`Packing ${name} (${id}) offset=${offset}`);
  console.log(
    `  N=${normalIds.length} S=${specialIds.length} H=${hyperIds.length} cmd=${commandIds.length} thr=${throwIds.length} c=${crouchAttackIds.length} a=${airAttackIds.length} keys=${Object.keys(binds.keyboard).length}`
  );
  console.log(`  →`, Object.keys(animMap).join(", "));

  const { byKey } = usingJsmugen ? { byKey: preload.byKey } : await loadSffSprites(files.sff);

  // Collect unique sprites needed
  const neededKeys = new Set();
  const animActions = {};
  for (const [animName, actionId] of Object.entries(animMap)) {
    let fr = actions.get(actionId) || [];
    // Attacks/VFX keep every frame; loco may sample
    const full = fr;
    fr = trimAnimFrames(fr, animName);
    if (fr.length && full.length > fr.length) {
      fr = fr.map((f) => {
        const match = full.find((x) => x.group === f.group && x.image === f.image) || f;
        return { ...f, clsn1: match.clsn1 || [], clsn2: match.clsn2 || [] };
      });
    }
    fr = fr.filter((f) => f.group >= 0); // skip linked/invalid -1 groups
    animActions[animName] = { actionId, frames: fr };
    fr.forEach((f) => neededKeys.add(`${f.group}_${f.image}`));
  }

  // Decode + crop each sprite; scale PER SPRITE to TARGET_HEIGHT
  // (global maxH scaling crushed bodies when a tall VFX set the factor)
  const imageByKey = new Map();
  const missingSprites = [];
  for (const key of neededKeys) {
    const spr = byKey.get(key);
    if (!spr || !spr.decodedBuffer) {
      console.warn(`  missing sprite ${key}`);
      missingSprites.push(key);
      continue;
    }
    let w = spr.width, h = spr.height;
    let data = Buffer.from(spr.decodedBuffer);
    knockOutBackground(data, w, h);
    // Crop empty plate but always keep the MUGEN axis inside the frame
    // so Clsn (axis-relative) stays aligned with drawn pixels.
    let box = contentBounds(data, w, h);
    const axisX = Math.max(0, Math.min(w - 1, spr.x || 0));
    const axisY = Math.max(0, Math.min(h - 1, spr.y || 0));
    const x1 = Math.min(box.x, axisX);
    const y1 = Math.min(box.y, axisY);
    const x2 = Math.max(box.x + box.w - 1, axisX);
    const y2 = Math.max(box.y + box.h - 1, axisY);
    box = { x: x1, y: y1, w: x2 - x1 + 1, h: y2 - y1 + 1 };
    data = cropRgba(data, w, h, box);
    w = box.w; h = box.h;
    const ax0 = (spr.x || 0) - box.x;
    const ay0 = (spr.y || 0) - box.y;
    const sprScale = Math.min(1, TARGET_HEIGHT / Math.max(1, h));
    let tw = Math.max(1, Math.round(w * sprScale));
    let th = Math.max(1, Math.round(h * sprScale));
    if (sprScale < 1) data = scaleRgba(data, w, h, tw, th);
    else { tw = w; th = h; }
    imageByKey.set(key, {
      data,
      w: tw,
      h: th,
      ax0: ax0 * (tw / Math.max(1, w)),
      ay0: ay0 * (th / Math.max(1, h)),
      sprScale, // original MUGEN px → atlas px
      rawW: spr.width,
      rawH: spr.height,
    });
  }

  const packedImages = [];
  const keyToFrameKey = new Map();
  let fi = 0;
  for (const [key, im] of imageByKey) {
    const frameKey = `1_${fi}`;
    keyToFrameKey.set(key, frameKey);
    packedImages.push({
      key: frameKey,
      data: im.data,
      w: im.w,
      h: im.h,
      ax: Math.round(im.ax0),
      ay: Math.round(im.ay0),
    });
    fi += 1;
  }

  const atlas = packFrames(packedImages);
  const fitScale = atlas.fitScale != null ? atlas.fitScale : 1;
  if (fitScale < 0.999) {
    // Atlas fit shrank sprites — fold into sprScale for Clsn
    for (const im of imageByKey.values()) im.sprScale *= fitScale;
  }

  // Build anims.actions + map (engine expects numeric action ids + map names)
  const actionsOut = {};
  const mapOut = {};
  let syntheticId = 0;
  const nameToSynth = {
    idle: 0, walk: 20, walkBack: 21,
    crouchStart: 10, crouch: 11, crouchEnd: 12,
    jumpStart: 40, jump: 41, jumpFwd: 42, jumpBack: 43, land: 47,
    dash: 100, run: 101, dashBack: 105,
    block: 6, lightPunch: 200, heavyKick: 240, parry: 230, hitstun: 5, parryStun: 5,
  };

  /** Stable synth ids for attack prefixes (avoid colliding with loco / each other). */
  function synthAttackId(animName) {
    const bands = {
      normal: { body: 500, fx: 600, hit: 700, spawn: 800 },
      crouchAttack: { body: 1100, fx: 1150, hit: 1160, spawn: 1170 },
      airAttack: { body: 1200, fx: 1250, hit: 1260, spawn: 1270 },
      special: { body: 1300, fx: 1350, hit: 1360, spawn: 1370 },
      hyper: { body: 1400, fx: 1450, hit: 1460, spawn: 1470 },
      command: { body: 1500, fx: 1550, hit: 1560, spawn: 1570 },
      throw: { body: 1600, fx: 1650, hit: 1660, spawn: 1670 },
    };
    for (const [prefix, ids] of Object.entries(bands)) {
      const mSpawn = new RegExp(`^${prefix}(\\d+)_s(\\d+)$`).exec(animName);
      const mHit = new RegExp(`^${prefix}(\\d+)_hitfx$`).exec(animName);
      const mFx = new RegExp(`^${prefix}(\\d+)_fx$`).exec(animName);
      const m = new RegExp(`^${prefix}(\\d+)$`).exec(animName);
      if (mSpawn) return ids.spawn + Number(mSpawn[1]) * 10 + Number(mSpawn[2]);
      if (mHit) return ids.hit + Number(mHit[1]);
      if (mFx) return ids.fx + Number(mFx[1]);
      if (m) return ids.body + Number(m[1]);
    }
    return null;
  }

  for (const [animName, { frames }] of Object.entries(animActions)) {
    let actionId = nameToSynth[animName];
    if (actionId == null) {
      actionId = synthAttackId(animName);
      if (actionId == null) actionId = 900 + syntheticId++;
    }
    mapOut[animName] = actionId;
    const outFrames = [];
    for (const f of frames) {
      const srcKey = `${f.group}_${f.image}`;
      const frameKey = keyToFrameKey.get(srcKey);
      const im = imageByKey.get(srcKey);
      if (!frameKey || !im) continue;
      const sc = im.sprScale;
      outFrames.push({
        group: 1,
        image: Number(frameKey.split("_")[1]),
        xoff: Math.round(f.xoff * sc),
        yoff: Math.round(f.yoff * sc),
        ticks: f.ticks,
        flipH: !!f.flipH,
        key: frameKey,
        // Clsn in atlas pixel space (matches drawn sprite)
        clsn1: scaleClsnBoxes(f.clsn1, sc),
        clsn2: scaleClsnBoxes(f.clsn2, sc),
      });
    }
    if (!outFrames.length && mapOut.idle != null && actionsOut[String(mapOut.idle)]) {
      actionsOut[String(actionId)] = JSON.parse(JSON.stringify(actionsOut[String(mapOut.idle)]));
      actionsOut[String(actionId)].action = actionId;
    } else {
      actionsOut[String(actionId)] = {
        action: actionId,
        total: outFrames.reduce((s, x) => s + x.ticks, 0),
        frames: outFrames,
      };
    }
  }
  if (mapOut.parryStun == null) mapOut.parryStun = mapOut.hitstun;

  const drawScale = 2.0; // canvas draw scale after atlas is already height-normalized
  const pxToWorld = drawScale / PREVIEW_PX;
  const animsOut = { actions: actionsOut, map: mapOut };
  recomputeMoveHitboxes(moves, animsOut, pxToWorld);

  const character = buildCharacterJson({
    id,
    name,
    physics,
    frames: atlas.frames,
    anims: animsOut,
    scale: drawScale,
    pxToWorld,
    moves,
    moveList,
    binds,
    source: {
      type: "mugen",
      folder: path.relative(getRoot(), dir).replace(/\\/g, "/"),
      offset,
      attackActions: attackIds,
      normalActions: normalIds,
      specialActions: specialIds,
      hyperActions: hyperIds,
      commandActions: commandIds,
      throwActions: throwIds,
      crouchAttackActions: crouchAttackIds,
      airAttackActions: airAttackIds,
      skipped: [".snd", "full CNS state machines", "helper AI beyond VelSet"],
      missingSprites,
    },
  });
  character.quality = buildQualityReport(character, missingSprites);
  if (usingJsmugen) {
    character.quality.spriteEngine = "jsmugen";
    character.quality.notes = [
      "Sprites + AIR/Clsn decoded by JSMugen (same engine as the compare panel).",
      ...(character.quality.notes || []),
    ];
  }
  console.log(
    `  quality: clsn1=${character.quality.clsn1Rate} inferred=${character.quality.inferredHitboxRate}`
    + ` vfx=${character.quality.vfxLinkRate} missingSprites=${character.quality.missingSpriteCount}`
    + (usingJsmugen ? " engine=jsmugen" : "")
  );

  enrichRobloxMeta(character);

  const outDir = path.join(getPacks(), id);
  fs.mkdirSync(outDir, { recursive: true });
  writePng(path.join(outDir, "atlas.png"), atlas);
  fs.writeFileSync(path.join(outDir, "character.json"), JSON.stringify(character, null, 2));
  fs.writeFileSync(path.join(outDir, "quality.json"), JSON.stringify(character.quality, null, 2));

  // Also write atlas.json compatible with current loadAtlasPack
  const atlasJson = {
    mode: "framesheet",
    image: `packs/${id}/atlas.png`,
    width: atlas.width,
    height: atlas.height,
    scale: drawScale,
    frames: atlas.frames,
    anims: character.anims,
  };
  fs.writeFileSync(path.join(outDir, "atlas.json"), JSON.stringify(atlasJson, null, 2));

  const robloxDir = path.join(outDir, "roblox");
  fs.mkdirSync(robloxDir, { recursive: true });
  const robloxFiles = buildRobloxFiles(character);
  for (const [name, body] of Object.entries(robloxFiles)) {
    fs.writeFileSync(path.join(robloxDir, name), body);
  }

  const pngSize = fs.statSync(path.join(outDir, "atlas.png")).size;
  console.log(`  → packs/${id}/  atlas ${atlas.width}x${atlas.height} (${(pngSize / 1024).toFixed(1)} KB), sprites ${packedImages.length}`);
  console.log(`  → packs/${id}/roblox/  CharacterData.luau + MugenSkelFighter.luau + SETUP.txt`);
  return { id, outDir, pngSize, sprites: packedImages.length, robloxFiles, quality: character.quality };
}

function packFromExistingFramesheet(dir) {
  const files = findMugenFiles(dir);
  if (!files.atlasJson || !files.atlasPng) throw new Error(`No atlas.json/png in ${dir}`);
  const meta = JSON.parse(fs.readFileSync(files.atlasJson, "utf8"));
  const id = slugify(path.basename(dir));
  const name = path.basename(dir);
  const physics = parseCnsPhysics(null);
  // Prefer CNS beside folder if present in parent mugen extract — gaara has none

  const existingMoves = (meta.moves) || {};
  const character = buildCharacterJson({
    id,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    physics: {
      ...physics,
      height: 40,
      walkFwd: 2,
      walkBack: 2,
      jumpY: 7.5,
    },
    frames: meta.frames,
    anims: meta.anims,
    scale: meta.scale || 2.35,
    moves: existingMoves,
    moveList: meta.moveList || Object.keys(existingMoves).map((k) => ({ id: k, label: k })),
    source: {
      type: "framesheet",
      folder: path.relative(getRoot(), dir).replace(/\\/g, "/"),
      note: "Slimmed from existing atlas; loose sprites/ not copied",
    },
  });

  enrichRobloxMeta(character);
  const outDir = path.join(getPacks(), id);
  fs.mkdirSync(outDir, { recursive: true });
  fs.copyFileSync(files.atlasPng, path.join(outDir, "atlas.png"));
  fs.writeFileSync(path.join(outDir, "character.json"), JSON.stringify(character, null, 2));
  const atlasJson = {
    mode: "framesheet",
    image: `packs/${id}/atlas.png`,
    width: meta.width,
    height: meta.height,
    scale: character.atlas.scale,
    frames: meta.frames,
    anims: meta.anims,
  };
  fs.writeFileSync(path.join(outDir, "atlas.json"), JSON.stringify(atlasJson, null, 2));
  const robloxDir = path.join(outDir, "roblox");
  fs.mkdirSync(robloxDir, { recursive: true });
  for (const [fname, body] of Object.entries(buildRobloxFiles(character))) {
    fs.writeFileSync(path.join(robloxDir, fname), body);
  }
  const pngSize = fs.statSync(path.join(outDir, "atlas.png")).size;
  console.log(`Slimmed ${name} → packs/${id}/ (${(pngSize / 1024).toFixed(1)} KB atlas)`);
  return { id, outDir, pngSize };
}

async function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("--")));
  if (!args.length) {
    console.log(`Usage: node tools/pack-character.js <charFolder> [--all-shinobi]`);
    process.exit(1);
  }
  const input = path.resolve(args[0]);
  if (!fs.existsSync(input)) throw new Error(`Not found: ${input}`);

  const files = findMugenFiles(input);
  const results = [];

  if (files.atlasJson && files.atlasPng && !files.sff) {
    results.push(packFromExistingFramesheet(input));
  } else if (files.sff && files.air) {
    const isShinobi = /shinobi\s*alliance/i.test(path.basename(input)) || flags.has("--all-shinobi");
    if (isShinobi || flags.has("--all-shinobi")) {
      for (const skin of SHINOBI_SKINS) {
        results.push(await packFromMugen(input, skin));
      }
    } else {
      results.push(await packFromMugen(input, null));
    }
  } else {
    throw new Error(`Unrecognized char folder (need .sff+.air or atlas.json+.png): ${input}`);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: path.relative(getRoot(), input).replace(/\\/g, "/"),
    packs: results.map((r) => ({
      id: r.id,
      path: `packs/${r.id}`,
      atlasKB: Math.round((r.pngSize / 1024) * 10) / 10,
      sprites: r.sprites || null,
    })),
  };
  fs.mkdirSync(getPacks(), { recursive: true });
  const manifestPath = path.join(getPacks(), "manifest.json");
  let prev = { packs: [] };
  if (fs.existsSync(manifestPath)) {
    try { prev = JSON.parse(fs.readFileSync(manifestPath, "utf8")); } catch (_) { /* ignore */ }
  }
  const byId = new Map((prev.packs || []).map((p) => [p.id, p]));
  for (const p of manifest.packs) byId.set(p.id, p);
  const merged = { updatedAt: manifest.generatedAt, packs: [...byId.values()] };
  fs.writeFileSync(manifestPath, JSON.stringify(merged, null, 2));
  console.log("\nDone. Manifest → packs/manifest.json");
  console.log(merged.packs.map((p) => `  ${p.id}: ${p.atlasKB} KB`).join("\n"));
}

module.exports = {
  packFromMugen,
  findMugenFiles,
  getPacks,
  getRoot,
  slugify,
};

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
