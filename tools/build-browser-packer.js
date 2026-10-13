/**
 * Bundle browser packer → pack-browser.bundle.js
 *   node tools/build-browser-packer.js
 */
const path = require("path");
const esbuild = require("esbuild");

const ROOT = path.join(__dirname, "..");

esbuild
  .build({
    entryPoints: [path.join(__dirname, "pack-browser-entry.js")],
    bundle: true,
    outfile: path.join(ROOT, "pack-browser.bundle.js"),
    format: "iife",
    globalName: "MugenPacker",
    platform: "browser",
    target: ["es2020"],
    sourcemap: false,
    logLevel: "info",
    inject: [path.join(__dirname, "browser-shims.js")],
    define: {
      "process.env.NODE_DEBUG": "false",
      global: "globalThis",
    },
    alias: {
      fs: path.join(__dirname, "memfs.js"),
      path: require.resolve("path-browserify"),
      buffer: require.resolve("buffer/"),
      util: require.resolve("util/"),
      stream: require.resolve("stream-browserify"),
      zlib: require.resolve("browserify-zlib"),
      assert: require.resolve("assert/"),
      events: require.resolve("events/"),
      process: require.resolve("process/browser.js"),
    },
    banner: {
      // Guarantee nextTick before any module init (pngjs streams need it)
      js: 'var process=globalThis.process||{};process.browser=true;process.env=process.env||{};process.cwd=process.cwd||function(){return"/"};process.nextTick=process.nextTick||function(fn){var a=[].slice.call(arguments,1);setTimeout(function(){fn.apply(null,a)},0)};globalThis.process=process;',
    },
    mainFields: ["browser", "module", "main"],
  })
  .then(() => {
    console.log("→ pack-browser.bundle.js");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
