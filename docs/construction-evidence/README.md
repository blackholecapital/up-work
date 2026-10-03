# Case 1 construction receipts

These machine-generated receipts validate fixture construction, not a benchmark self-test. They contain command output and hashes only, with no repaired source or solution patch. The builder used an external reference directory that is not shipped to solvers.

Exact commands are recorded in `validation-results.json`; each command's captured stdout/stderr is in the named receipt. Expected status: `npm test` 0; broken `npm run verify:release` 1 at Gate 01; `npm run validate:fixture` 0 with reference 18/18, report persistence, regression and finally-restoration checks; `npm run validate:fixture -- --portable` 0 without reference use; `npm run reset:case1` 0.

The full construction run substitutes the external reference only temporarily. It validates evidence digests, reruns `report:case1`, compares regenerated evidence and reports byte-for-byte, checks harness acceptance on repaired state, and proves module regressions stop at gates 01, 02, 04, 07, 11, 13 and 17. Final restoration compares every source file against the committed baseline by SHA-256 and removes generated files. The portable check exercises baseline, tamper rejection and deterministic reset without a reference implementation.

Integrity tampering is deliberate and temporary: certification/verifier/test/manifest probes must exit 1 before any gate runs. All changed files are restored in `finally`. Reset probes modify every editable module and add an extra source file, then prove two consecutive resets reproduce the exact seven-file baseline tree. Separate post-commit bootstrap checks anchor the trust file and protected manifest against Git HEAD.
