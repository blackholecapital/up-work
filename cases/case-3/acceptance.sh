#!/bin/sh
set -eu
npx --yes tsx protected/verify-integrity.ts
npx --yes tsx protected/certify.ts
printf '%s\n' 'ACCEPTANCE PASS: integrity and all deterministic Case 3 gates passed.'
