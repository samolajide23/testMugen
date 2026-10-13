/** Audit packs/<id>/character.json - run after pack-character.js */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PACKS = path.join(ROOT, "packs");
const manifestPath = path.join(PACKS, "manifest.json");

function main() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.packs = (manifest.packs || []).filter((p) =>
    fs.existsSync(path.join(PACKS, p.id, "character.json"))
  );
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  const report = {
    generatedAt: new Date().toISOString(),
    packs: [],
    issues: [],
    improvements: [],
  };

  for (const p of manifest.packs) {
    const c = JSON.parse(fs.readFileSync(path.join(PACKS, p.id, "character.json"), "utf8"));
    const map = (c.anims && c.anims.map) || {};
    const normals = Object.keys(c.moves || {}).filter((k) => /^normal\d+$/.test(k));
    const specs = Object.keys(c.moves || {}).filter((k) => /^special\d+$/.test(k));
    const hypers = Object.keys(c.moves || {}).filter((k) => /^hyper\d+$/.test(k));
    const crouchAtk = Object.keys(c.moves || {}).filter((k) => /^crouchAttack\d+$/.test(k));
    const airAtk = Object.keys(c.moves || {}).filter((k) => /^airAttack\d+$/.test(k));
    const attackMoves = [
      ...normals, ...specs, ...hypers, ...crouchAtk, ...airAtk,
      ...Object.keys(c.moves || {}).filter((k) => /^(command|throw)\d+$/.test(k)),
    ];
    const withVfx = attackMoves.filter((k) => c.moves[k].vfx);
    const placeholderHB = attackMoves.filter((k) => {
      const h = c.moves[k].hitbox || {};
      return h.w === 0.7 && h.h === 0.45 && h.offsetX === 0.85;
    });
    const inferredHB = attackMoves.filter((k) => c.moves[k].hitboxSource === "clsn2-inferred").length;
    let atlasW = 0;
    let atlasH = 0;
    try {
      const aj = JSON.parse(fs.readFileSync(path.join(PACKS, p.id, "atlas.json"), "utf8"));
      atlasW = aj.width || 0;
      atlasH = aj.height || 0;
    } catch (_) { /* missing atlas.json */ }
    const entry = {
      id: p.id,
      atlasKB: p.atlasKB,
      atlasW,
      atlasH,
      sprites: Object.keys(c.atlas.frames || {}).length,
      normals: normals.length,
      specials: specs.length,
      hypers: hypers.length,
      crouchAttacks: crouchAtk.length,
      airAttacks: airAtk.length,
      bindKeys: c.binds && c.binds.keyboard ? Object.keys(c.binds.keyboard).length : 0,
      dash: !!(map.dash || map.run),
      dashBack: !!map.dashBack,
      vfxLinked: withVfx.length,
      vfxRate: attackMoves.length ? +(withVfx.length / attackMoves.length).toFixed(2) : 0,
      placeholderHitboxes: placeholderHB.length,
      inferredHitboxes: inferredHB,
      anims: Object.keys(map).length,
      source: c.source,
    };
    report.packs.push(entry);
    if (entry.sprites < 10) {
      report.issues.push({ id: p.id, issue: "too few sprites - wrong SFF or decode fail" });
    }
    if (entry.vfxRate < 0.5 && attackMoves.length >= 2 && p.id !== "kung_fu_man") {
      report.issues.push({
        id: p.id,
        issue: `low VFX link rate (${Math.round(entry.vfxRate * 100)}%) - need CNS Helper/Explod or baked-in FX`,
      });
    }
    if (entry.placeholderHitboxes) {
      report.issues.push({
        id: p.id,
        issue: `${entry.placeholderHitboxes} specials using placeholder hitboxes`,
      });
    }
    if (atlasW > 2048 || atlasH > 2048) {
      report.issues.push({
        id: p.id,
        issue: `atlas ${atlasW}x${atlasH} exceeds 2048`,
      });
    }
  }

  report.improvements = [
    "Done: Explod bind/remove/scale/facing/delay + Helper/Projectile vel + preview spawn sim",
    "Done: packs/<id>/overrides.json (see _overrides.example.json)",
    "Done: dash/run/dashBack + crouchStart/End + jumpFwd/Back + crouch/air attack bands",
    "Kung Fu Man: no Explod VFX in CNS — FX baked into body frames (expected 0%)",
  ];

  fs.writeFileSync(path.join(PACKS, "audit.json"), JSON.stringify(report, null, 2));
  console.log("Packs:");
  console.table(report.packs.map(({ id, atlasKB, sprites, normals, specials, hypers, crouchAttacks, airAttacks, bindKeys, vfxRate }) => ({
    id, atlasKB, sprites, normals, specials, hypers, crouchAttacks, airAttacks, bindKeys, vfxRate,
  })));
  console.log("\nIssues:");
  report.issues.forEach((i) => console.log(`  - [${i.id}] ${i.issue}`));
  console.log("\nImprovements:");
  report.improvements.forEach((i) => console.log(`  - ${i}`));
  console.log("\nWrote packs/audit.json");
}

main();
