# Repair SIP/RTP call evidence and capacity reconciliation

Work in this original Git checkout, starting at the `case-3-v4-batch-20261008` tag. This is the original Case 3 v4 with an explicit correction-aware batch continuation. Repair the thirty original modules, the integrated lifecycle defects, and the unimplemented batch reconciler. Preserve the original repository history and baseline tags.

Immutable historical pins:
- case-3-v4-baseline: 3a583887ce5dcc6d2d74bb91f6eb28676e2d47af
- case-3-v4-rework-20261008: 626f913f603ffb39d7d927c1cbcbdc88c5bbe6d6
- case-3-v4-checkpoints-20261008: 3b4397686bf16f6f62be48e98343964ec2de47fb

The new batch tag pins rework/case3-batch/integrity.json. Do not move, replace or recreate tags. This is a transparent author amendment, not a claim that the earlier baseline contained batch requirements.

Only edit the thirty numbered modules and assembly.js under cases/case-3-v4/src. Preserve the exact source-file inventory. All original protected contracts, baseline-src, manifests, fixtures and rework addenda are read-only. Do not modify tests, expected outputs or integrity checks. Do not hardcode fixture results or bypass the real modules/checkpoints. Keep temporary reports/tests outside protected directories.

Read these contracts:
1. cases/case-3-v4/protected/acceptance.json: original thirty module behaviors.
2. rework/case3-integration/TASK.md and traces.json/expected.json: integrated identity, packet, lifecycle, receipt, capacity and digest behavior.
3. rework/case3-checkpoints/TASK.md: three genuine checkpoint boundaries and upstream evidence invalidation.
4. rework/case3-batch/CONTRACT.md: authoritative batch revision semantics, lifecycle precedence, output schema and validation.

This task's starting tag, completion commands and diff target supersede older addendum instructions naming their own starting/diff tag. Earlier behavioral requirements remain in force. The batch contract clarifies terminal-state precedence and adds the new API.

The current integrated implementation is incomplete: media socket loss can be overwritten by a later snapshot, and events following authoritative termination can reopen media state. Diagnose and fix the interacting lifecycle behavior while preserving the protected existing outputs. Implement the batch engine rather than only adding reporting around independent gates.

The capture pipeline may redeliver the same observation, deliver revisions out of order, correct a packet, retract an event or reassign it to another dialog. A valid correction must replace the old observation, not add another packet or release. Correcting a BYE's identity can change capacity authority. Actual packet and lifecycle results must feed the per-call and aggregate ledgers and final digests. After a failure, diagnose the upstream cause, repair it and recompute affected downstream results; stale evidence must not pass as current evidence.

The supplied batch.json is synthetic, offline and contains no customer data or credentials. Its trusted correction authority field is a bounded fixture contract, not a production security protocol. Additional tests generalize identities and ordering. A prior result is an integrity/cache-consistency aid; it is not cryptographically authenticated execution evidence. Full recomputation is allowed, and unchanged calls must yield identical deterministic evidence under the same source.

Run from repository root:

    npm --prefix cases/case-3-v4 run build
    npm --prefix cases/case-3-v4 run certify
    node rework/case3-integration/certify.js
    node rework/case3-checkpoints/certify.js
    node rework/case3-batch/certify.js

Generate a batch audit using:

    node rework/case3-batch/audit.js > /tmp/case3-batch-audit.json
    node rework/case3-batch/audit.js rework/case3-batch/batch.json /tmp/case3-batch-audit.json > /tmp/case3-batch-replay.json
    cmp /tmp/case3-batch-audit.json /tmp/case3-batch-replay.json

Use private temporary paths if those example filenames already exist. Completion requires every command passing, exact replay equivalence, genuine dependency-based recomputation, unchanged protected files and preserved tags. Return a source diff against case-3-v4-batch-20261008 plus a concise root-cause and validation summary.

Use efficient batched reads, edits and commands as appropriate. No number of calls, edits, explanations, responses or turns is required. A qualification count must come from this exact frozen input's fresh native session. Historical counts do not transfer. This author amendment is AI-assisted. No client acceptance, human-only authorship eligibility or verified paid-incident provenance is asserted.
