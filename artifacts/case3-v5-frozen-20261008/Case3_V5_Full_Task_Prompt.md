# Repair SIP RTP call evidence and capacity reconciliation

Repair the offline audit pipeline in cases/case-3-v5/src so a telecom operations reviewer can reconcile captured media, authoritative call signaling, capacity reservations and reported call receipts at a fixed reference time. Incorrect media accounting must not silently release SIP capacity, and the final evidence digest must bind the complete audited result and input evidence.

Use the supplied JSON captures, ledger observations and receipt observations. CONTRACT.md defines their exact semantics; the synthetic traces deliberately include conflicting or stale evidence. The protected fixtures and tests are the acceptance contract. The source is a starting implementation with defects, not a blank project.

Required result:

1. Reconstruct dialog identity and negotiated media epochs from authoritative signaling. Use the resulting bindings to classify every packet capture once. Handle wraparound, reorder, duplicate/conflicting replay, source generation, remote binding and codec evidence consistently.
2. Derive the media lifecycle snapshot from actual accepted packets in the current epoch. Derive SIP termination only from valid authoritative BYE evidence. Feed those lifecycle facts into the expected capacity ledger, preserving release authority and exactly-once ownership.
3. Reconcile the independently supplied ledger and receipt observations against those derived facts. Report missing, unexpected, conflicting and stale evidence without altering the input to make it agree. Build per-dialog receipts from the actual packet and capacity artifacts.
4. Produce the complete deterministic JSON audit, including the normalized input digest and final digest. Do not substitute fixture names, fixed expected JSON, hard-coded fixture outputs, or printed success text for the required computation.
5. Check the full pipeline. When a check reveals a mismatch, trace it to the responsible upstream evidence or transformation, repair the source, recompute downstream lifecycle/ledger/receipts/digests, and rerun affected checks and the complete certification suite. A passing downstream artifact from an earlier revision is invalid after its upstream inputs change.

Only src/ may change. Preserve the protected contract, both baseline tags and original v4 case. Do not suppress tests, alter expected values, weaken integrity, read an external solution, or modify input fixtures. You may inspect all supplied assets, use scripts and additional temporary tests, and choose your own efficient debugging approach. Do not manufacture a minimum number of steps.

Completion conditions:

- npm run build and npm run certify both exit 0 on the final source.
- CLI audits work for all supplied fixtures and satisfy CONTRACT.md, including generated variants covered by the tests.
- Provide a concise change summary identifying root causes and the upstream-to-downstream effects of each substantive repair, exact verification commands/results, and any remaining limitation.
- Provide the repaired src files or a Git diff against case-3-v5-baseline. Keep audit outputs, scratch files and final notes outside cases/case-3-v5 so the protected inventory stays intact.

The dependency requirement concerns real dataflow and recomputation. A timer-only media change must leave the authoritative SIP reservation ledger unchanged; a corrected valid BYE must update termination and release evidence. Both must flow into the reconciled final audit where relevant.
