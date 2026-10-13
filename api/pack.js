/**
 * Vercel Serverless Function: POST raw .zip (MUGEN char) → packed zip.
 * Hobby body limit ~4.5MB — larger chars need npm run dev locally.
 */
const { packZipBuffer } = require("../tools/pack-zip");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Expose-Headers", "X-Pack-Id");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: "POST a .zip body" }));
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buf = Buffer.concat(chunks);

    if (!buf.length) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ error: "Empty body" }));
    }

    // Soft warning under platform hard-limit (~4.5MB)
    if (buf.length > 4.4 * 1024 * 1024) {
      res.statusCode = 413;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({
        error: "Zip too large for Vercel Hobby (~4.5MB max). Use npm run dev locally for big chars, or trim the zip to .sff+.air+.def+.cns only.",
        bytes: buf.length,
      }));
    }

    const result = await packZipBuffer(buf);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${result.id}-pack.zip"`);
    res.setHeader("X-Pack-Id", result.id);
    return res.end(result.zip);
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: err.message || String(err) }));
  }
};
