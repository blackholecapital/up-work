# Case 2 — synthetic long-horizon response repair

This fixture models a fictional contractor, customer, offer, and scheduling tools. It contains no network calls, credentials, client records, or real identities. The editable implementation is in `src/`; certification, fixtures, scripts, and protected manifests are in `protected/`.

The baseline intentionally fails Gate 01. `npm run reset` restores that baseline. A repaired checkout is expected to pass every gate with `npm test`, `npm run verify`, and `npm run report`.

Evidence under `selftest-evidence/` is machine-generated internal evidence. **MACHINE-GENERATED INTERNAL EVIDENCE — USER MUST NARRATE/REWRITE BEFORE SUBMISSION.**
