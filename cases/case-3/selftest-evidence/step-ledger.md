# MACHINE-GENERATED INTERNAL EVIDENCE — USER MUST NARRATE/REWRITE BEFORE SUBMISSION.

1. Inspected the repository and confirmed no pre-existing Case 3 implementation.
2. Identified the benchmark root and preserved the existing README.
3. Confirmed Node.js and npm are available for a self-contained runner.
4. Selected TypeScript modules with tsx execution to avoid runtime dependencies.
5. Defined synthetic Dialog, Packet, provenance, classification, and capacity types.
6. Chose invented call ID, tags, loopback port, SSRC, and payload bindings.
7. Implemented dialog creation with early-media initial phase.
8. Implemented explicit answer transition to post-answer phase.
9. Implemented explicit SIP termination state transition.
10. Implemented timeout as dialog termination.
11. Implemented socket loss as dialog termination.
12. Implemented PCMU sample decoding.
13. Implemented PCMA sample decoding.
14. Attached 8 kHz mono provenance to every decoded frame.
15. Attached exact dialog key provenance to every decoded frame.
16. Implemented codec-to-static-payload mapping for PCMU and PCMA.
17. Implemented a loopback-only media ingress object.
18. Added exact remote port validation.
19. Added exact SSRC validation.
20. Added exact payload type validation.
21. Added explicit dialog-alive validation.
22. Added external-source rejection behavior.
23. Added wildcard-source rejection behavior.
24. Added duplicate sequence tracking.
25. Added bounded reorder acceptance.
26. Added stale replay rejection.
27. Preserved packet payload length through decoding.
28. Implemented early-media classification.
29. Implemented post-answer confirmed-media classification.
30. Implemented no-media timeout classification.
31. Implemented rejected media after dialog termination.
32. Implemented SIP capacity admission.
33. Implemented media attachment only after SIP admission.
34. Kept media ownership separate from SIP ownership.
35. Implemented owned media release at lifecycle close.
36. Implemented owned SIP release at lifecycle close.
37. Implemented engine orchestration around dialog, media, and capacity.
38. Added a protected 25-gate deterministic certification runner.
39. Added Gate 01 for exact loopback ingress.
40. Added gates for external, wildcard, port, SSRC, and payload mismatches.
41. Added codec and provenance gates for PCMU and PCMA.
42. Added early/post-answer phase gates.
43. Added duplicate, reorder, loss, and stale replay gates.
44. Added timeout, socket-loss, and SIP-termination gates.
45. Added capacity ownership and release gates.
46. Added decoder length and network-scope gates.
47. Deliberately changed the valid loopback predicate to a wildcard baseline defect.
48. Committed the broken baseline as 21f1e8f.
49. Tagged the broken baseline as case-3-baseline.
50. Executed the baseline certification and observed first failure at Gate 01.
51. Confirmed no later baseline gate was allowed to pass silently.
52. Repaired only editable src/media.ts.
53. Restored exact 127.0.0.1 source validation.
54. Re-ran all 25 gates after the repair.
55. Observed Gate 01 pass after the repair.
56. Observed external and wildcard inputs fail closed.
57. Observed codec provenance and mono/8 kHz invariants pass.
58. Observed lifecycle and capacity invariants pass.
59. Added protected-file integrity verification and baseline reset tooling.
60. Captured this report and ledger as machine-generated internal evidence.
