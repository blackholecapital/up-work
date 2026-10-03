# MACHINE-GENERATED INTERNAL EVIDENCE — USER MUST NARRATE/REWRITE BEFORE SUBMISSION

Chronological machine step ledger for the uninterrupted local repair run. Steps are investigation, source repair, integrity checks, or gate validation; no external submission occurred.

1. Confirmed worktree branch `case1/selftest-final` and clean pre-fixture status.
2. Fetched `origin/case1/release-recovery-fixture`.
3. Confirmed fetched head `9f083039abca61a3b8ada811b5b8c97e59323b9d`.
4. Compared job branch against the fixture tree before import.
5. Imported the exact fixture tree from the fetched branch.
6. Read README rules and editable-path restriction.
7. Read operator notes and progressive gate order.
8. Read metadata, rehearsal constraints, and acceptance commands.
9. Read protected-file manifest and trust/integrity behavior.
10. Inspected all seven allowed source modules and certification gates.
11. Committed the fixture checkpoint locally as `c51d740`.
12. Installed pinned dependencies with `npm ci`; audit reported 0 vulnerabilities.
13. Ran baseline `npm test`; harness result was 3 passed, 0 failed.
14. Ran baseline `npm run verify:release`; it stopped at Gate 01 as expected.
15. Investigated Gate 01 and identified origin canonicalization and strict-number defects.
16. Repaired `src/config.ts` origin parsing and strict positive integer validation.
17. Corrected the origin path assumption after the first Gate 01 result.
18. Re-ran certification; Gate 01 passed and Gate 02 failed on tampered signatures.
19. Repaired `src/auth.ts` with length-checked timing-safe HMAC comparison.
20. Repaired same-origin/CSRF mutation logic in `src/auth.ts`.
21. Re-ran certification; Gates 01–03 passed and Gate 04 failed on tenant visibility.
22. Repaired tenant ownership checks in `Registry.get`.
23. Scoped idempotency lookup to tenant and rejected conflicting replay payload/priority.
24. Re-ran certification; Gates 01–05 passed and Gate 06 failed on queue ordering.
25. Repaired queue priority descending and FIFO tie ordering in `src/jobs.ts`.
26. Re-ran certification; Gates 01–06 passed and Gate 07 failed on mutable route snapshots.
27. Repaired `Router.snapshot` to return a copy.
28. Repaired `Router.execute` to use the submitted route, not mutable active routing.
29. Re-ran certification; Gates 01–08 passed and Gate 09 failed on cancellation state.
30. Repaired running-job cancellation to enter `canceling` pending acknowledgement.
31. Re-ran certification; Gates 01–09 passed and Gate 10 failed on retry timing.
32. Repaired exponential retry deadlines using attempt count and retry authority.
33. Re-ran certification; Gates 01–10 passed and Gate 11 failed on event sequence scope.
34. Repaired event sequence allocation to use the global stream length.
35. Re-ran certification; Gates 01–11 passed and Gate 12 failed on cursor inclusivity.
36. Repaired resume cursor semantics to return events strictly after the cursor.
37. Re-ran certification; Gates 01–12 passed and Gate 13 failed on artifact normalization.
38. Repaired exact-content SHA-256 hashing and UTF-8 byte accounting in `src/storage.ts`.
39. Re-ran certification; Gates 01–13 passed and Gate 14 failed on omitted receipts.
40. Repaired artifact manifests to include every job artifact, deterministically sorted.
41. Re-ran certification; Gates 01–15 passed and Gate 16 failed on cleanup boundaries.
42. Repaired cleanup to enforce tenant scope and protected-job retention.
43. Re-ran certification; Gates 01–16 passed and Gate 17 failed on cross-tenant summary counts.
44. Repaired `summary` to count only the requested tenant’s jobs.
45. Re-ran certification; Gates 01–17 passed and Gate 18 failed on digest scope.
46. Repaired release digest binding to hash the complete evidence payload.
47. Re-ran `npm run verify:release`; all 18 gates passed and release outputs were written.
48. Inspected the allowed-only source diff; exactly seven `src/*.ts` files were modified.
49. Recomputed final allowed-source SHA-256 values.
50. Recomputed protected baseline, certification, and protected-manifest SHA-256 values.
51. Ran final `npm test`; TAP reported tests 3, pass 3, fail 0.
52. Ran final `npm run verify:release`; observed 18/18 PASS lines.
53. Ran final `npm run report:case1`; observed 18/18 PASS lines and regenerated outputs.
54. Copied generated release evidence JSON into this evidence directory.
55. Copied generated release report Markdown into this evidence directory.
56. Re-ran `npm test` into the preserved raw command transcript.
57. Re-ran `npm run verify:release` into the preserved raw command transcript.
58. Re-ran `npm run report:case1` into the preserved raw command transcript.
59. Compared generated and copied evidence hashes; both payload copies matched.
60. Compared generated and copied report hashes; both report copies matched.
61. Verified evidence summary: total 4, completed 3, canceled 1, active 0, bytes 215.
62. Verified release payload embedded SHA-256 matched its complete evidence payload.
63. Verified report included the embedded evidence digest and `18/18` certification marker.
64. Verified no baseline, certification, manifest, script, package, or compiler file was edited.
65. Verified no external push, merge, deploy, or submission was performed.

Ledger count: 65 substantive machine steps. Threshold `>=50`: YES.
