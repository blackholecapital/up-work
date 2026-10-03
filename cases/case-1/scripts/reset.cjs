const fs = require('node:fs');
const path = require('node:path');
const base = path.resolve(__dirname,'..');
require('./verify.cjs').integrity();
fs.rmSync(path.join(base,'src'),{recursive:true,force:true});
fs.cpSync(path.join(base,'baseline'),path.join(base,'src'),{recursive:true});
for (const name of ['output','dist']) fs.rmSync(path.join(base,name),{recursive:true,force:true});
console.log('Case 1 application restored to intentionally broken baseline; generated output removed.');
