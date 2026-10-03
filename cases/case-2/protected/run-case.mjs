import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gateDefinitions, runGates } from './gates.mjs';

const root = new URL('..', import.meta.url);
const evidence = new URL('../selftest-evidence/', import.meta.url);
const hash = (text) => createHash('sha256').update(text).digest('hex');

async function integrity() {
  const manifest = JSON.parse(await readFile(new URL('./protected-manifest.json', import.meta.url), 'utf8'));
  for (const [file, expected] of Object.entries(manifest)) {
    const actual = hash(await readFile(new URL(`./${file}`, import.meta.url)));
    if (actual !== expected) throw new Error(`protected integrity mismatch: ${file}`);
  }
  return true;
}

async function main(mode) {
  const integrityOk = await integrity();
  const results = runGates();
  const allPassed = results.length === gateDefinitions.length && results.every((result) => result.passed);
  const report = { generatedAt: new Date().toISOString(), machineGenerated: true, integrityOk, gateCount: gateDefinitions.length, executed: results.length, allPassed, results };
  await mkdir(evidence, { recursive: true });
  await writeFile(new URL('./gate-report.json', evidence), JSON.stringify(report, null, 2) + '\n');
  if (mode === 'report') { console.log(JSON.stringify(report, null, 2)); return; }
  if (!allPassed) { console.error(`FAIL: ${results.at(-1).id} ${results.at(-1).name}`); process.exitCode = 1; return; }
  console.log(`PASS: ${gateDefinitions.length}/${gateDefinitions.length} gates; protected integrity verified`);
}
await main(process.argv[2] ?? 'test');
