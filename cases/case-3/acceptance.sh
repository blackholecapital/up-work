#!/bin/sh
set -eu
npm run integrity
npm run certify
printf '%s\n' 'ACCEPTANCE PASS: integrity and all deterministic Case 3 gates passed.'
