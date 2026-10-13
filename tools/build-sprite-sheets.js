/**
 * Slice generated short-hop sheets → transparent framesheet atlases + atlas.json
 */
const fs = require("fs");
const path = require("path");
const jpeg = require("jpeg-js");
const { PNG } = require("pngjs");

const ROOT = path.join(__dirname, "..");
const ASSETS = path.join(
  process.env.USERPROFILE || "",
  ".cursor",
  "projects",
  "c-Users-olas-OneDrive-Panasonic-Avionics-Corporation-Attachments-Desktop-Code-mugenSkel",
  "assets"
);

const JOBS = [
  {
    id: "denji",
    src: path.join(ASSETS, "denji_shorthop_sheet.jpg"),
    outDir: path.join(ROOT, "chars", "denji"),
  },
  {
    id: "power",
    src: path.join(ASSETS, "power_shorthop_sheet.jpg"),
    outDir: path.join(ROOT, "chars", "power"),
  },
];

function loadJpeg(filePath) {
  const raw = jpeg.decode(fs.readFileSync(filePath), { useTArray: true, formatAsRGBA: true });
  return { width: raw.width, height: raw.height, data: raw.data };
}

function isGreenScreen(r, g, b) {
  // Chroma: strong green, not character greens (claw VFX is neon — keep if sat high but also has character edge)
  const maxRB = Math.max(r, b);
  return g > 90 && g > maxRB + 35 && g > r * 1.15 && g > b * 1.15;
}

function chromaKey(img) {
  const { width, height, data } = img;
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    if (isGreenScreen(r, g, b)) {
      out[o] = out[o + 1] = out[o + 2] = out[o + 3] = 0;
    } else {
      out[o] = r;
      out[o + 1] = g;
      out[o + 2] = b;
      out[o + 3] = 255;
    }
  }
  return { width, height, data: out };
}

function contentBounds(img, x0, y0, x1, y1) {
  let minX = x1;
  let minY = y1;
  let maxX = x0;
  let maxY = y0;
  let found = false;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const a = img.data[(y * img.width + x) * 4 + 3];
      if (a > 16) {
        found = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (!found) return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  const pad = 2;
  minX = Math.max(x0, minX - pad);
  minY = Math.max(y0, minY - pad);
  maxX = Math.min(x1 - 1, maxX + pad);
  maxY = Math.min(y1 - 1, maxY + pad);
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

function crop(img, box) {
  const { x, y, w, h } = box;
  const data = Buffer.alloc(w * h * 4);
  for (let row = 0; row < h; row++) {
    const src = ((y + row) * img.width + x) * 4;
    img.data.copy(data, row * w * 4, src, src + w * 4);
  }
  return { width: w, height: h, data };
}

function packAtlas(frames) {
  const gap = 2;
  const cellH = Math.max(...frames.map((f) => f.height)) + gap * 2;
  const widths = frames.map((f) => f.width + gap * 2);
  const atlasW = widths.reduce((a, b) => a + b, gap);
  const atlasH = cellH + gap;
  const data = Buffer.alloc(atlasW * atlasH * 4);
  const meta = {};
  let x = gap;
  frames.forEach((fr, i) => {
    const key = `1_${i}`;
    const y = gap + (cellH - gap * 2 - fr.height);
    for (let row = 0; row < fr.height; row++) {
      for (let col = 0; col < fr.width; col++) {
        const si = (row * fr.width + col) * 4;
        const di = ((y + row) * atlasW + (x + col)) * 4;
        data[di] = fr.data[si];
        data[di + 1] = fr.data[si + 1];
        data[di + 2] = fr.data[si + 2];
        data[di + 3] = fr.data[si + 3];
      }
    }
    meta[key] = {
      x,
      y,
      w: fr.width,
      h: fr.height,
      ax: Math.round(fr.width * 0.48),
      ay: fr.height - 2,
    };
    x += fr.width + gap * 2;
  });
  return { width: atlasW, height: atlasH, data, frames: meta };
}

function frameRef(key, ticks) {
  const n = Number(key.split("_")[1]);
  return { group: 1, image: n, xoff: 0, yoff: 0, ticks, flipH: false, key };
}

function buildAnims() {
  const idle = [frameRef("1_0", 8), frameRef("1_5", 8)];
  const crouch = [frameRef("1_1", 6)];
  const walk = [
    frameRef("1_0", 5),
    frameRef("1_1", 5),
    frameRef("1_0", 5),
    frameRef("1_5", 5),
  ];
  const jumpStart = [frameRef("1_1", 3), frameRef("1_2", 3)];
  const jump = [frameRef("1_2", 4), frameRef("1_3", 6), frameRef("1_2", 4)];
  const shortHop = [
    frameRef("1_1", 3),
    frameRef("1_2", 3),
    frameRef("1_3", 5),
    frameRef("1_4", 4),
    frameRef("1_5", 4),
  ];
  const hit = [frameRef("1_4", 4), frameRef("1_5", 6)];
  const block = [frameRef("1_1", 6)];

  function action(id, frames) {
    return {
      action: id,
      total: frames.reduce((s, f) => s + f.ticks, 0),
      frames,
    };
  }

  return {
    actions: {
      0: action(0, idle),
      11: action(11, crouch),
      20: action(20, walk),
      40: action(40, jumpStart),
      41: action(41, jump),
      200: action(200, shortHop),
      240: action(240, shortHop),
      230: action(230, block),
      5: action(5, hit),
      6: action(6, block),
    },
    map: {
      idle: 0,
      walk: 20,
      crouch: 11,
      jumpStart: 40,
      jump: 41,
      block: 6,
      lightPunch: 200,
      heavyKick: 240,
      parry: 230,
      hitstun: 5,
      parryStun: 5,
    },
  };
}

function writePng(filePath, img) {
  const png = new PNG({ width: img.width, height: img.height });
  png.data = img.data;
  fs.writeFileSync(filePath, PNG.sync.write(png));
}

function processJob(job) {
  fs.mkdirSync(job.outDir, { recursive: true });
  const raw = loadJpeg(job.src);
  const keyed = chromaKey(raw);
  const cols = 6;
  const cellW = Math.floor(keyed.width / cols);
  const frames = [];
  for (let i = 0; i < cols; i++) {
    const x0 = i * cellW;
    const x1 = i === cols - 1 ? keyed.width : (i + 1) * cellW;
    const box = contentBounds(keyed, x0, 0, x1, keyed.height);
    frames.push(crop(keyed, box));
  }
  const atlas = packAtlas(frames);
  const atlasPath = path.join(job.outDir, "atlas.png");
  writePng(atlasPath, atlas);

  const meta = {
    mode: "framesheet",
    image: `chars/${job.id}/atlas.png`,
    width: atlas.width,
    height: atlas.height,
    scale: 1.55,
    frames: atlas.frames,
    anims: buildAnims(),
  };
  fs.writeFileSync(path.join(job.outDir, "atlas.json"), JSON.stringify(meta, null, 2));
  console.log(`OK ${job.id}: ${atlas.width}x${atlas.height}, ${frames.length} frames → ${atlasPath}`);
}

JOBS.forEach(processJob);
