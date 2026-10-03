import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const dir = dirname(dirname(fileURLToPath(import.meta.url)));
execFileSync("git", ["-C", join(dir, "../.."), "restore", "--source", "case-3-baseline", "--", "cases/case-3/src"], { stdio: "inherit" });
console.log("RESET baseline restored; run npm run certify to observe Gate 01 failure.");
