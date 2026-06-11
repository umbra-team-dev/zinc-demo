// Node globals the Umbra SDK/crypto graph expects in the browser.
// Must evaluate before any `@umbra-privacy/*` import — keep this the first
// import of every module that touches the widget.
import { Buffer } from "buffer";
import processShim from "process/browser";

const g = globalThis as typeof globalThis & {
  Buffer?: typeof Buffer;
  process?: NodeJS.Process;
  global?: typeof globalThis;
};

if (typeof g.Buffer === "undefined") g.Buffer = Buffer;
if (typeof g.process === "undefined") g.process = processShim;
else if (typeof g.process.nextTick !== "function") {
  g.process = Object.assign(processShim, g.process);
}
if (typeof g.global === "undefined") g.global = globalThis;

export {};
