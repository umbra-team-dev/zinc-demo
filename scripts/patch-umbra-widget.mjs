// @umbra-privacy/widget@0.1.0 ships a Vite lib build in which node-fetch's
// `stream` import was stubbed to a frozen empty object. node-fetch reads
// `Stream.Readable.prototype` at module scope, so importing the dist throws
// "Cannot read properties of undefined (reading 'prototype')" in every
// consumer. Until the package ships a fixed dist, swap the stub for a
// shape-correct Stream class (the node-fetch code path is dead in browsers —
// native fetch is used — it only has to survive module evaluation).
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const file = join(
  import.meta.dirname,
  "..",
  "node_modules",
  "@umbra-privacy",
  "widget",
  "dist",
  "umbra-widget.js",
);

const MARKER = "/* zinc-demo stream-stub patch */";
const BROKEN = "const Wa = {}, aSe = ";
const FIXED =
  `const Wa = ${MARKER} (() => { class Stream {} class Readable extends Stream {} ` +
  `class PassThrough extends Stream {} Stream.Readable = Readable; ` +
  `Stream.PassThrough = PassThrough; return Stream; })(), aSe = `;

const src = readFileSync(file, "utf8");
if (src.includes(MARKER)) {
  console.log("umbra-widget already patched");
} else if (src.includes(BROKEN)) {
  writeFileSync(file, src.replace(BROKEN, FIXED));
  console.log("patched umbra-widget stream stub");
} else {
  console.warn(
    "patch-umbra-widget: expected stub not found — widget version changed? " +
      "Verify the dist imports cleanly and update/remove this patch.",
  );
}
