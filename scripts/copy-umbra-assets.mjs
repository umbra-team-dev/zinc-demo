// The widget's dist spawns its ZK-proof worker from the site root
// (`new URL("/assets/zk-proof-worker-<hash>.js", import.meta.url)`), so the
// host app must serve that file at /assets/. Copy it (hash changes per
// widget release, hence the glob + postinstall hook).
import { cpSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const src = join(
  import.meta.dirname,
  "..",
  "node_modules",
  "@umbra-privacy",
  "widget",
  "dist",
  "assets",
);
const dest = join(import.meta.dirname, "..", "public", "assets");

mkdirSync(dest, { recursive: true });
for (const file of readdirSync(src)) {
  cpSync(join(src, file), join(dest, file));
  console.log(`copied ${file} -> public/assets/`);
}
