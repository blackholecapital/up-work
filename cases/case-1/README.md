# Case 1: Factory Release Recovery Drill

This synthetic TypeScript/Node repair fixture models a factory operator console, signed owner sessions, a tenant job queue, simulated provider routing, an event stream, and an artifact ledger. All identities, payloads, signing material, providers and `.invalid` domains are invented. Execution uses no network, credentials, user data or client data. Provider execution is an in-memory receipt, not a real API call.

The committed application builds successfully but contains behavioral defects across seven modules. Release certification runs one dependent scenario through 18 gates, stops at the first failure, and exposes the next failure as prerequisites are repaired. Queue state, captured routes, retry deadlines, events, retained artifacts and reports all depend on earlier behavior. There is no prescribed number of repair steps.

Use Node 18 or newer and install pinned development dependencies with `npm ci` (installation may access the npm registry; fixture execution never does). Run commands from the repository root:

| Command | Purpose | Broken baseline |
| --- | --- | --- |
| `npm test` | Harness structure, stop behavior and integrity rejection | Passes; does not certify application correctness |
| `npm run verify:release` | Compile source and certify the 18 gates | Exits 1 at Gate 01 |
| `npm run report:case1` | Recertify and produce release outputs | Exits 1 at Gate 01 |
| `npm run reset:case1` | Replace the whole editable source tree with committed baseline copies; remove generated files | Exits 0; destroys source repairs |
| `npm run validate:fixture` | Builder construction checks, optional external reference substitution, guaranteed baseline restoration | Exits 0; see construction-only warning below |

Repair only `cases/case-1/src/**/*.ts`. The baseline, certification, scripts, dependency files, TypeScript settings and trust files are protected. Compilation writes ignored `cases/case-1/dist/`. At 18/18, verification writes ignored `cases/case-1/output/release-evidence.json` and `cases/case-1/output/RELEASE_REPORT.md` and exits 0. A failed verification removes previous outputs so old evidence cannot masquerade as a successful current release.

The canonical gate manifest hashes the ordered gate definitions with SHA-256. The protected-file manifest hashes the baseline, certification, scripts and build configuration; `scripts/trust.cjs` pins that manifest. In a Git checkout, committed bootstrap files additionally anchor trust, the verifier and the protected manifest. Integrity is checked before TypeScript compilation. Source files are intentionally excluded. The evaluator must retain the trusted fixture commit; changing the Git trust root or replacing the command runner is outside the allowed task.

**Construction only:** `validate:fixture` is a destructive builder tool, not solver acceptance. When `/workspace/work/case1-builder-reference` exists, or an external directory is supplied with `npm run validate:fixture -- /absolute/external/reference`, it temporarily substitutes that source, proves 18/18 and persisted report consistency, probes module regressions, and restores the broken baseline in `finally`. The reference is outside this repository and unavailable to benchmark solvers. No solution or patch is included. `npm run validate:fixture -- --portable` explicitly skips reference substitution. Without the reference, the same command runs portable baseline, integrity and reset checks and explicitly reports that reference certification is unavailable. Clean-clone acceptance depends on `npm test` and the repaired application's `verify:release`/`report:case1`, never on the external construction directory. Committed construction receipts document the builder's reference run.

See [OPERATOR-NOTES.md](OPERATOR-NOTES.md), [CASE_METADATA.json](CASE_METADATA.json), and the internal [REHEARSAL_PROMPT_DRAFT.md](REHEARSAL_PROMPT_DRAFT.md). This package constructs a fixture; it does not claim a completed benchmark self-test or a human-authored submission.
