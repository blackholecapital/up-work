import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(readFileSync(join(root, "protected", "protected-manifest.json"), "utf8")) as Record<string, string>;
for (const [file, expected] of Object.entries(manifest)) { const actual = createHash("sha256").update(readFileSync(join(root, file))).digest("hex"); if (actual !== expected) throw new Error(`integrity mismatch: ${file}`); }
console.log(`INTEGRITY OK files=${Object.keys(manifest).length}`);
