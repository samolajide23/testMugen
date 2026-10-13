/**
 * Injected by esbuild so Buffer + process (incl. nextTick) exist in the browser.
 * Avoid bare `void` — esbuild inject parsing treats it specially.
 */
import { Buffer as NodeBuffer } from "buffer";

if (typeof globalThis.Buffer === "undefined") {
  globalThis.Buffer = NodeBuffer;
}

const existing = typeof globalThis.process !== "undefined" ? globalThis.process : null;
const proc = existing && typeof existing === "object" ? existing : {};

if (!proc.env) proc.env = {};
if (typeof proc.cwd !== "function") {
  proc.cwd = function cwd() {
    return "/";
  };
}
if (typeof proc.nextTick !== "function") {
  proc.nextTick = function nextTick(fn) {
    const args = Array.prototype.slice.call(arguments, 1);
    setTimeout(function () {
      fn.apply(null, args);
    }, 0);
  };
}
proc.browser = true;

globalThis.process = proc;

export { NodeBuffer as Buffer };
