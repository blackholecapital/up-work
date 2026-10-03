const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname,'../../..');
const base = path.join(root,'cases/case-1');
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
function integrity() {
  // In a published clone, Git anchors the bootstrap files as well as the hash manifest.
  // During initial construction these files have not yet been committed.
  for (const file of ['scripts/trust.cjs','scripts/verify.cjs','certification/protected-files.json']) {
    const relative = 'cases/case-1/' + file;
    const committed = spawnSync('git',['show','HEAD:'+relative],{cwd:root});
    if (committed.status === 0 && !committed.stdout.equals(fs.readFileSync(path.join(base,file))))
      throw new Error(`protected bootstrap file changed: ${relative}`);
  }
  const raw = fs.readFileSync(path.join(base,'certification/protected-files.json'));
  const trusted = require('./trust.cjs');
  if (digest(raw) !== trusted.manifestHash) throw new Error('protected manifest changed');
  const manifest = JSON.parse(raw);
  for (const [file,expected] of Object.entries(manifest.files)) {
    if (digest(fs.readFileSync(path.join(root,file))) !== expected) throw new Error(`protected file changed: ${file}`);
  }
  const gates = fs.readFileSync(path.join(base,'certification/gate-manifest.json'));
  const canonical = JSON.parse(gates);
  if (digest(JSON.stringify(canonical.gates)) !== canonical.integrity) throw new Error('gate manifest integrity mismatch');
  return canonical.integrity;
}
function run(emit=console.log) {
  let gateHash;
  // Stale successful deliverables must never survive a failed certification.
  fs.rmSync(path.join(base,'output'),{recursive:true,force:true});
  try { gateHash = integrity(); }
  catch (e) { emit(`INTEGRITY FAIL ${e.message}`); return {ok:false,gate:0}; }
  const {certify,names} = require('../dist/certification/gates.js');
  const manifest = JSON.parse(fs.readFileSync(path.join(base,'certification/gate-manifest.json')));
  if (JSON.stringify(names) !== JSON.stringify(manifest.gates.map(g => g.name))) throw new Error('compiled gate names differ');
  const result = certify(gateHash,emit);
  if (result.ok) {
    fs.mkdirSync(path.join(base,'output'),{recursive:true});
    const evidence = {...result.bundle.evidence,sha256:result.bundle.digest};
    fs.writeFileSync(path.join(base,'output/release-evidence.json'),JSON.stringify(evidence,null,2)+'\n');
    fs.writeFileSync(path.join(base,'output/RELEASE_REPORT.md'),result.bundle.markdown);
    const persisted = JSON.parse(fs.readFileSync(path.join(base,'output/release-evidence.json')));
    const {sha256,...payload} = persisted;
    if (digest(JSON.stringify(payload)) !== sha256 || !fs.readFileSync(path.join(base,'output/RELEASE_REPORT.md'),'utf8').includes(sha256)) throw new Error('persisted evidence mismatch');
  }
  return result;
}
module.exports = {run,integrity};
if (require.main === module) process.exitCode = run().ok ? 0 : 1;
