import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

const RUN_DIR = join(tmpdir(), `excuse-verify-${randomBytes(4).toString("hex")}`);

function runOnce() {
  execSync("node --experimental-strip-types main.ts", {
    cwd: process.cwd(),
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: RUN_DIR },
    stdio: "pipe",
  });
  return readFileSync(join(RUN_DIR, "entry.txt"), "utf-8");
}

const run1 = runOnce();
const run2 = runOnce();

console.log(`Run 1: "${run1}" (${run1.length} chars)`);
console.log(`Run 2: "${run2}" (${run2.length} chars)`);

if (run1 !== run2) {
  console.error("FAIL: runs not byte-identical");
  process.exit(1);
}

if (run1.length < 1 || run1.length > 200) {
  console.error(`FAIL: length ${run1.length} not in 1..200`);
  process.exit(1);
}

if (!/^\S.*\S$/.test(run1) && run1.length > 0) {
  console.error("FAIL: only whitespace");
  process.exit(1);
}

try {
  new TextEncoder().encode(run1);
} catch {
  console.error("FAIL: not valid UTF-8");
  process.exit(1);
}

console.log("OK: deterministic, 1-200 chars, valid UTF-8, non-whitespace");