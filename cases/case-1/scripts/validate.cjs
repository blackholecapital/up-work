// Construction-only reference substitution; clean clones run the portable harness checks.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname,'../../..');
const base = path.resolve(__dirname,'..');
const source = path.join(base,'src');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const snapshot = directory => Object.fromEntries(fs.readdirSync(directory).sort().map(name => [name,digest(fs.readFileSync(path.join(directory,name)))]));
const baseline = snapshot(path.join(base,'baseline'));
const execute = args => spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',timeout:30000});
const npm = args => spawnSync('npm',args,{cwd:root,encoding:'utf8',timeout:30000});
const success = result => assert.equal(result.status,0,result.stdout+result.stderr);
const build = () => success(npm(['run','build','--silent']));
const reset = () => success(execute(['cases/case-1/scripts/reset.cjs']));
const gatesPath = path.join(base,'certification/gates.ts');
const protectedOriginal = fs.readFileSync(gatesPath);
require('./verify.cjs').integrity();
try {
  reset(); build();
  let result = execute(['cases/case-1/scripts/verify.cjs']);
  assert.equal(result.status,1); assert.match(result.stdout,/GATE 01\/18 FAIL configuration normalization/);
  assert.equal((result.stdout.match(/^GATE /gm)||[]).length,1);
  console.log('PASS broken baseline compiles and stops at Gate 01');
  fs.appendFileSync(gatesPath,'\n// integrity probe\n');
  result = execute(['cases/case-1/scripts/verify.cjs']);
  assert.equal(result.status,1); assert.match(result.stdout,/INTEGRITY FAIL protected file changed/);
  fs.writeFileSync(gatesPath,protectedOriginal);
  console.log('PASS protected certification modification rejected');
  for (const name of Object.keys(baseline)) fs.appendFileSync(path.join(source,name),'\n// reset probe\n');
  fs.writeFileSync(path.join(source,'extra.ts'),'export const scratch = 1;\n');
  reset(); assert.deepEqual(snapshot(source),baseline);
  reset(); assert.deepEqual(snapshot(source),baseline);
  console.log('PASS deterministic reset restores all seven source files byte-for-byte and removes extras');
  const portable = process.argv[2] === '--portable';
  const reference = process.argv[2] || '/workspace/work/case1-builder-reference';
  if (!portable && fs.existsSync(reference)) {
    const resolved = fs.realpathSync(reference);
    assert.ok(resolved !== root && !resolved.startsWith(root+path.sep),'reference must remain outside the fixture repository');
    for (const name of Object.keys(baseline)) fs.copyFileSync(path.join(resolved,name),path.join(source,name));
    build(); result = execute(['cases/case-1/scripts/verify.cjs']); success(result);
    assert.equal((result.stdout.match(/ PASS /g)||[]).length,18);
    console.log(result.stdout.trim());
    const evidencePath = path.join(base,'output/release-evidence.json');
    const reportPath = path.join(base,'output/RELEASE_REPORT.md');
    const evidenceBytes = fs.readFileSync(evidencePath);
    const reportBytes = fs.readFileSync(reportPath);
    const {sha256,...evidence} = JSON.parse(evidenceBytes);
    assert.equal(digest(JSON.stringify(evidence)),sha256);
    assert.match(reportBytes.toString(),/Certification: 18\/18/);
    assert.ok(reportBytes.toString().includes(sha256));
    result = npm(['run','report:case1','--silent']); success(result);
    assert.ok(fs.readFileSync(evidencePath).equals(evidenceBytes));
    assert.ok(fs.readFileSync(reportPath).equals(reportBytes));
    console.log('PASS external reference 18/18; evidence digest and deterministic report:case1 outputs verified');
    success(npm(['test','--silent']));
    console.log('PASS npm test also accepts repaired reference state');
    const expected = {'config.ts':1,'auth.ts':2,'jobs.ts':4,'route.ts':7,'events.ts':11,'storage.ts':13,'report.ts':17};
    for (const [name,gate] of Object.entries(expected)) {
      fs.copyFileSync(path.join(base,'baseline',name),path.join(source,name)); build();
      result = execute(['cases/case-1/scripts/verify.cjs']);
      assert.equal(result.status,1); assert.match(result.stdout,new RegExp(`GATE ${String(gate).padStart(2,'0')}/18 FAIL`));
      fs.copyFileSync(path.join(resolved,name),path.join(source,name));
      console.log(`PASS module regression blocked at Gate ${String(gate).padStart(2,'0')}`);
    }
  } else {
    assert.ok(portable || process.argv[2] === undefined,'explicit construction reference is missing');
    console.log('PASS portable fixture checks; reference unavailable in clean clone (18/18 construction receipt is committed)');
  }
} finally {
  fs.writeFileSync(gatesPath,protectedOriginal);
  reset();
  assert.deepEqual(snapshot(source),baseline);
  console.log('PASS finally restored broken baseline byte-for-byte; generated outputs removed');
}
