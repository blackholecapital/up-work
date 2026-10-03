const fs = require('node:fs');
const path = require('node:path');
// Remove stale deliverables even when integrity or subsequent compilation fails.
fs.rmSync(path.resolve(__dirname,'../output'),{recursive:true,force:true});
try {
  require('./verify.cjs').integrity();
} catch (error) {
  console.log(`INTEGRITY FAIL ${error.message}`);
  process.exitCode = 1;
}
