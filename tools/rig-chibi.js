/**
 * Rough auto-rig for low_poly_chibi_base.glb → R15-named skinned GLB.
 * Distance-to-bone-segment weights (top-4). Not production-quality; good enough to pose.
 */
const fs = require("fs");
const path = require("path");
const { Document, NodeIO, Accessor } = require("@gltf-transform/core");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "chars", "chibi", "low_poly_chibi_base.glb");
const OUT = path.join(ROOT, "chars", "chibi", "low_poly_chibi_rigged.glb");

const JOINT_ORDER = [
  "LowerTorso", "UpperTorso", "Head",
  "LeftUpperArm", "LeftLowerArm", "LeftHand",
  "RightUpperArm", "RightLowerArm", "RightHand",
  "LeftUpperLeg", "LeftLowerLeg", "LeftFoot",
  "RightUpperLeg", "RightLowerLeg", "RightFoot",
];

const PARENT = {
  LowerTorso: null,
  UpperTorso: "LowerTorso",
  Head: "UpperTorso",
  LeftUpperArm: "UpperTorso",
  LeftLowerArm: "LeftUpperArm",
  LeftHand: "LeftLowerArm",
  RightUpperArm: "UpperTorso",
  RightLowerArm: "RightUpperArm",
  RightHand: "RightLowerArm",
  LeftUpperLeg: "LowerTorso",
  LeftLowerLeg: "LeftUpperLeg",
  LeftFoot: "LeftLowerLeg",
  RightUpperLeg: "LowerTorso",
  RightLowerLeg: "RightUpperLeg",
  RightFoot: "RightLowerLeg",
};

function readSourceMesh(filePath) {
  const buf = fs.readFileSync(filePath);
  let offset = 12;
  let json = null;
  let bin = null;
  while (offset < buf.length) {
    const chunkLen = buf.readUInt32LE(offset); offset += 4;
    const chunkType = buf.toString("utf8", offset, offset + 4); offset += 4;
    const data = buf.subarray(offset, offset + chunkLen); offset += chunkLen;
    if (chunkType === "JSON") json = JSON.parse(data.toString("utf8"));
    if (chunkType.startsWith("BIN")) bin = Buffer.from(data);
  }
  const posAcc = json.accessors[0];
  const nrmAcc = json.accessors[1];
  const idxAcc = json.accessors[2];
  const posBv = json.bufferViews[posAcc.bufferView];
  const idxBv = json.bufferViews[idxAcc.bufferView];
  const posOff = (posBv.byteOffset || 0) + (posAcc.byteOffset || 0);
  const nrmOff = (posBv.byteOffset || 0) + (nrmAcc.byteOffset || 0);
  const idxOff = (idxBv.byteOffset || 0) + (idxAcc.byteOffset || 0);

  const positions = [];
  const normals = [];
  for (let i = 0; i < posAcc.count; i++) {
    const o = posOff + i * 12;
    const x = bin.readFloatLE(o);
    const y = bin.readFloatLE(o + 4);
    const z = bin.readFloatLE(o + 8);
    // Cube translate + Sketchfab -90° X, then flip Y so feet sit on ground
    const wx = x;
    const wy = z + 3.79216;
    const wz = y;
    positions.push([wx, wy, wz]);

    const no = nrmOff + i * 12;
    const nx = bin.readFloatLE(no);
    const ny = bin.readFloatLE(no + 4);
    const nz = bin.readFloatLE(no + 8);
    // same rotation on normals: (nx, nz, ny) after flip of previous -Y path
    // Previous path was (x, -(z+t), y) then flipY → (x, z+t, y)
    normals.push([nx, nz, ny]);
  }

  const indices = [];
  for (let i = 0; i < idxAcc.count; i++) {
    indices.push(bin.readUInt32LE(idxOff + i * 4));
  }

  // Normalize length so height ≈ 2 (matches fighter scale roughly)
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of positions) {
    minY = Math.min(minY, p[1]);
    maxY = Math.max(maxY, p[1]);
  }
  const height = maxY - minY || 1;
  const scale = 2 / height;
  for (const p of positions) {
    p[0] *= scale;
    p[1] = (p[1] - minY) * scale;
    p[2] *= scale;
  }

  return { positions, normals, indices, scale, rawHeight: height, extras: json.asset.extras || {} };
}

function boneBindPositions() {
  // Authored in height-2 space from measured mesh bands
  return {
    LowerTorso: [0, 0.82, 0],
    UpperTorso: [0, 1.18, 0.02],
    Head: [0, 1.66, 0.03],
    LeftUpperArm: [-0.30, 1.42, 0.02],
    LeftLowerArm: [-0.49, 1.14, 0.0],
    LeftHand: [-0.70, 0.89, 0.0],
    RightUpperArm: [0.30, 1.42, 0.02],
    RightLowerArm: [0.49, 1.14, 0.0],
    RightHand: [0.70, 0.89, 0.0],
    LeftUpperLeg: [-0.13, 0.78, -0.03],
    LeftLowerLeg: [-0.13, 0.38, -0.05],
    LeftFoot: [-0.13, 0.04, -0.08],
    RightUpperLeg: [0.13, 0.78, -0.03],
    RightLowerLeg: [0.13, 0.38, -0.05],
    RightFoot: [0.13, 0.04, -0.08],
  };
}

function tipOf(name, bind) {
  const tips = {
    Head: [0, 1.98, 0.03],
    LeftHand: [-0.78, 0.84, 0.0],
    RightHand: [0.78, 0.84, 0.0],
    LeftFoot: [-0.13, 0.0, -0.12],
    RightFoot: [0.13, 0.0, -0.12],
  };
  if (tips[name]) return tips[name];
  // tip = first child bind, else slight offset from self
  const child = JOINT_ORDER.find((n) => PARENT[n] === name);
  if (child) return bind[child];
  const p = bind[name];
  return [p[0], p[1] + 0.08, p[2]];
}

function distPointSegment(p, a, b) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ap = [p[0] - a[0], p[1] - a[1], p[2] - a[2]];
  const ab2 = ab[0] * ab[0] + ab[1] * ab[1] + ab[2] * ab[2] || 1e-8;
  let t = (ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / ab2;
  t = Math.max(0, Math.min(1, t));
  const cx = a[0] + ab[0] * t;
  const cy = a[1] + ab[1] * t;
  const cz = a[2] + ab[2] * t;
  const dx = p[0] - cx;
  const dy = p[1] - cy;
  const dz = p[2] - cz;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function regionBias(name, p) {
  const x = p[0];
  const y = p[1];
  const ax = Math.abs(x);
  // Soft priors so head/hands/feet don't steal torso weights
  if (name === "Head" && y > 1.55) return 3.5;
  if (name === "UpperTorso" && y > 1.05 && y < 1.55 && ax < 0.35) return 2.2;
  if (name === "LowerTorso" && y > 0.65 && y < 1.1 && ax < 0.35) return 2.0;
  if (name.includes("Hand") && ax > 0.55 && y > 0.7 && y < 1.1) return 4.0;
  if (name.includes("LowerArm") && ax > 0.35 && y > 0.95 && y < 1.35) return 2.4;
  if (name.includes("UpperArm") && ax > 0.18 && y > 1.2 && y < 1.55) return 2.2;
  if (name.includes("Foot") && y < 0.18 && ax > 0.05) return 4.0;
  if (name.includes("LowerLeg") && y > 0.15 && y < 0.55 && ax > 0.05) return 2.4;
  if (name.includes("UpperLeg") && y > 0.5 && y < 0.9 && ax > 0.05 && ax < 0.4) return 2.2;
  // Side lock
  if (name.startsWith("Left") && x > 0.05) return 0.15;
  if (name.startsWith("Right") && x < -0.05) return 0.15;
  return 1.0;
}

function computeWeights(positions, bind) {
  const segments = JOINT_ORDER.map((name) => ({
    name,
    a: bind[name],
    b: tipOf(name, bind),
    sigma: name === "Head" || name.includes("Hand") || name.includes("Foot") ? 0.14 : 0.18,
  }));

  const joints = new Uint16Array(positions.length * 4);
  const weights = new Float32Array(positions.length * 4);

  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    const scored = segments.map((seg, ji) => {
      const d = distPointSegment(p, seg.a, seg.b);
      const bias = regionBias(seg.name, p);
      const w = bias * Math.exp(-(d * d) / (2 * seg.sigma * seg.sigma));
      return { ji, w };
    });
    scored.sort((a, b) => b.w - a.w);
    const top = scored.slice(0, 4);
    let sum = top.reduce((s, t) => s + t.w, 0) || 1;
    for (let k = 0; k < 4; k++) {
      joints[i * 4 + k] = top[k] ? top[k].ji : 0;
      weights[i * 4 + k] = top[k] ? top[k].w / sum : 0;
    }
  }
  return { joints, weights };
}

function mat4Translation(x, y, z) {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1,
  ];
}

function mat4InvertTRS(tx, ty, tz) {
  // Pure translation inverse
  return mat4Translation(-tx, -ty, -tz);
}

function mat4Multiply(a, b) {
  const out = new Array(16).fill(0);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      out[c * 4 + r] =
        a[0 * 4 + r] * b[c * 4 + 0] +
        a[1 * 4 + r] * b[c * 4 + 1] +
        a[2 * 4 + r] * b[c * 4 + 2] +
        a[3 * 4 + r] * b[c * 4 + 3];
    }
  }
  return out;
}

async function main() {
  const mesh = readSourceMesh(SRC);
  const bind = boneBindPositions();
  const { joints, weights } = computeWeights(mesh.positions, bind);

  // Local translations relative to parent
  const local = {};
  for (const name of JOINT_ORDER) {
    const p = PARENT[name];
    const w = bind[name];
    if (!p) local[name] = [...w];
    else {
      const pw = bind[p];
      local[name] = [w[0] - pw[0], w[1] - pw[1], w[2] - pw[2]];
    }
  }

  const ibm = [];
  for (const name of JOINT_ORDER) {
    const w = bind[name];
    ibm.push(...mat4InvertTRS(w[0], w[1], w[2]));
  }

  const document = new Document();
  const buffer = document.createBuffer();
  const material = document.createMaterial("chibi")
    .setMetallicFactor(0)
    .setRoughnessFactor(0.65)
    .setDoubleSided(true);

  const pos = new Float32Array(mesh.positions.length * 3);
  const nrm = new Float32Array(mesh.normals.length * 3);
  for (let i = 0; i < mesh.positions.length; i++) {
    pos[i * 3] = mesh.positions[i][0];
    pos[i * 3 + 1] = mesh.positions[i][1];
    pos[i * 3 + 2] = mesh.positions[i][2];
    nrm[i * 3] = mesh.normals[i][0];
    nrm[i * 3 + 1] = mesh.normals[i][1];
    nrm[i * 3 + 2] = mesh.normals[i][2];
  }
  const idx = new Uint32Array(mesh.indices);

  const posAcc = document.createAccessor("POSITION")
    .setType(Accessor.Type.VEC3)
    .setArray(pos)
    .setBuffer(buffer);
  const nrmAcc = document.createAccessor("NORMAL")
    .setType(Accessor.Type.VEC3)
    .setArray(nrm)
    .setBuffer(buffer);
  const idxAcc = document.createAccessor("INDICES")
    .setType(Accessor.Type.SCALAR)
    .setArray(idx)
    .setBuffer(buffer);
  const jointsAcc = document.createAccessor("JOINTS_0")
    .setType(Accessor.Type.VEC4)
    .setArray(joints)
    .setBuffer(buffer);
  const weightsAcc = document.createAccessor("WEIGHTS_0")
    .setType(Accessor.Type.VEC4)
    .setArray(weights)
    .setBuffer(buffer);
  const ibmAcc = document.createAccessor("INV_BIND")
    .setType(Accessor.Type.MAT4)
    .setArray(new Float32Array(ibm))
    .setBuffer(buffer);

  const prim = document.createPrimitive()
    .setAttribute("POSITION", posAcc)
    .setAttribute("NORMAL", nrmAcc)
    .setAttribute("JOINTS_0", jointsAcc)
    .setAttribute("WEIGHTS_0", weightsAcc)
    .setIndices(idxAcc)
    .setMaterial(material)
    .setMode(4);

  const meshNode = document.createMesh("ChibiMesh").addPrimitive(prim);

  const jointNodes = {};
  for (const name of JOINT_ORDER) {
    const [x, y, z] = local[name];
    jointNodes[name] = document.createNode(name).setTranslation([x, y, z]);
  }
  for (const name of JOINT_ORDER) {
    const p = PARENT[name];
    if (p) jointNodes[p].addChild(jointNodes[name]);
  }

  const skin = document.createSkin("ChibiSkin")
    .setInverseBindMatrices(ibmAcc)
    .setSkeleton(jointNodes.LowerTorso);
  for (const name of JOINT_ORDER) skin.addJoint(jointNodes[name]);

  const skinned = document.createNode("Chibi")
    .setMesh(meshNode)
    .setSkin(skin);

  const root = document.createNode("Root")
    .addChild(jointNodes.LowerTorso)
    .addChild(skinned);

  document.createScene("ChibiRigged").addChild(root);
  document.getRoot().getAsset().extras = {
    ...mesh.extras,
    rig: "rough-auto-r15",
    note: "Generated by tools/rig-chibi.js — distance weights, R15 joint names",
  };

  const io = new NodeIO();
  await io.write(OUT, document);

  // Sidecar bind pose for the HTML fighter / preview
  const meta = {
    joints: JOINT_ORDER,
    parent: PARENT,
    bind,
    local,
    height: 2,
    source: "low_poly_chibi_base.glb",
    license: mesh.extras.license || "CC-BY-4.0",
    author: mesh.extras.author || "torchwurm",
  };
  fs.writeFileSync(
    path.join(ROOT, "chars", "chibi", "rig.json"),
    JSON.stringify(meta, null, 2)
  );
  console.log("Wrote", OUT);
  console.log("Wrote rig.json —", JOINT_ORDER.length, "bones,", mesh.positions.length, "verts");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
