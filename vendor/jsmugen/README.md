# JSMugen (vendored)

Incomplete M.U.G.E.N JavaScript engine from [gitcobra/js-mugen-demo](https://github.com/gitcobra/js-mugen-demo).

Used for:
1. **Live compare** — side-by-side AIR playback vs mugenSkel packs
2. **Pack decode** — browser packer pulls SFF sprites + AIR/Clsn from this engine (same path that plays chars correctly), then builds our atlas / Roblox export

- Upstream demo: https://gitcobra.github.io/js-mugen-demo/demo/
- `bundle.js` is patched by `tools/patch-jsmugen-bridge.js` → `window.JSMugenBridge` (`loadBlob`, `extractAir`, `extractSprites`, `changeAction`, …)
- Re-download upstream `bundle.js` then run `node tools/patch-jsmugen-bridge.js` after refreshing these files.
