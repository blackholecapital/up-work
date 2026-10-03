const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const base = path.resolve(__dirname,'..');
const root = path.resolve(base,'../..');
const probe = () => spawnSync(process.execPath,['cases/case-1/scripts/verify.cjs'],{cwd:root,encoding:'utf8'});
test('canonical manifest has 18 ordered, dependent gates',() => {
  const verifier = require('../scripts/verify.cjs');
  const hash = verifier.integrity();
  assert.match(hash,/^[a-f0-9]{64}$/);
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname,'gate-manifest.json')));
  assert.deepEqual(require('../dist/certification/gates.js').names,manifest.gates.map(g => g.name));
  assert.equal(manifest.gates.length,18);
  manifest.gates.forEach((g,i) => {
    assert.equal(g.id,i+1);
    assert.deepEqual(g.requires,Array.from({length:i},(_,j) => j+1));
  });
});
test('certification stops at its first failure or writes a complete release',() => {
  const result = probe();
  assert.equal(result.stderr,'');
  const lines = result.stdout.trim().split('\n');
  const failed = lines.findIndex(line => /GATE \d+\/18 FAIL/.test(line));
  if (failed >= 0) {
    assert.equal(result.status,1);
    assert.equal(lines.filter(line => / FAIL /.test(line)).length,1);
    assert.ok(lines.slice(failed+1).every(line => !/^GATE /.test(line)));
    assert.equal(fs.existsSync(path.join(base,'output')),false);
  } else {
    assert.equal(result.status,0,result.stdout);
    assert.equal(lines.filter(line => / PASS /.test(line)).length,18);
    assert.ok(fs.existsSync(path.join(base,'output/release-evidence.json')));
    assert.ok(fs.existsSync(path.join(base,'output/RELEASE_REPORT.md')));
  }
});
test('protected certification, test, manifest and bootstrap tampering is rejected',() => {
  for (const relative of ['scripts/verify.cjs','certification/gates.ts','certification/release.test.cjs','certification/gate-manifest.json','certification/protected-files.json']) {
    const file = path.join(base,relative);
    const original = fs.readFileSync(file);
    try {
      fs.appendFileSync(file,'\n');
      const result = probe();
      assert.equal(result.status,1);
      assert.match(result.stdout,/INTEGRITY FAIL/);
      assert.doesNotMatch(result.stdout,/^GATE /m);
    } finally { fs.writeFileSync(file,original); }
  }
});
