# Repair the original Case 3 v4 SIP RTP evidence pipeline

Use this original-history checkout and the existing cases/case-3-v4 code. Repair its thirty original numbered source modules and their integrated trace behavior. This is an amendment to the original v4 exercise, not the separate v5 redesign. The original case-3-v4-baseline tag must remain 3a583887ce5dcc6d2d74bb91f6eb28676e2d47af. It continues to pin the unchanged original protected manifest. A separate case-3-v4-rework-20261008 tag pins only this added integration contract. Do not move or recreate either tag.

All thirty original source defects, baseline modules and original acceptance vectors are retained. Only cases/case-3-v4/src is editable. The original assembly still exposes its thirty entries and now also exports reconcile(trace), which uses their actual results to build a shared call audit. Preserve that genuine dataflow; do not replace it with fixture lookups, fixed answers, success printing or bypasses.

Inputs are the original protected acceptance contract and rework/case3-integration/traces.json. These invented offline traces represent early and answered media, correlated dialog identity, remote binding, codecs, wrap/reorder/replay, epochs, media inactivity/socket loss, authoritative SIP BYE and capacity release. expected.json records the integrated output contract. No live network, customer data or credentials are involved. This is bounded synthetic evidence reconciliation, not a complete production SIP stack. Packet dialog/epoch correlation is supplied by the capture system; it is not inferred from RTP headers.

Required behavior:

- Use original dialog identity and remote/codec/phase checks to classify packets. Each capture yields exactly one receipt. Only novel accepted packets contribute decoded samples and refresh media liveness. Duplicate/conflicting/stale traffic must not replace accepted media evidence.
- Each signaled new epoch has independent seen/sequence state. Extended sequence follows the original wrap-distance rule; reorders repair the missing-position total. The window boundary is inclusive. Counts, samples and receipts must agree.
- Process trace events by integer at then lexical id. An accepted answer changes phase; conflicting answers must not replace it. ACK enables answered media. Valid BYE requires matching dialog identity, valid signaling order and ACK. Repeated BYE cannot release twice. A timeout is a snapshot result using the last novel accepted packet or epoch start. Socket loss blocks media until a signaled new epoch. Neither media condition authorizes SIP release.
- Derive lifecycle and capacity from those actual upstream results. Reconcile received against accepted+duplicate+rejected, and acquired against released+held. Build per-epoch receipt consistency, shared evidence digest, derived ledger digest and final digest from the actual generated artifacts. The final digest binds sharedDigest|dialog|epoch|ledgerDigest.
- When a test exposes a mismatch, diagnose its upstream cause, repair the source, recompute the dependent lifecycle/receipts/ledger/digests and rerun affected checks and the full suites. A previous downstream success cannot be reused after upstream evidence or source changes. Packet corrections may change media and receipts while correctly preserving SIP capacity; correcting authoritative BYE identity must change release evidence.

Validation commands from repository root:

    npm --prefix cases/case-3-v4 run build
    npm --prefix cases/case-3-v4 run certify
    node rework/case3-integration/certify.js

Completion requires all three commands to exit 0, all thirty original gates passing, every integration/perturbation check passing, original protected files unchanged, and both tags preserved. Return the source changes or a Git diff against case-3-v4-rework-20261008 plus a concise root-cause and verification summary. Keep temporary tests and reports outside cases/case-3-v4 and outside this pinned addendum.

Use any efficient debugging strategy, scripts or batch edits. No number of tool calls, edits, explanations or turns is required. The historical 106-step result describes the old run, not this amended task. Any qualification count must come from a fresh native session on these exact inputs. This amendment is AI-assisted; client authorship and real-work-origin eligibility are not asserted.


## Executable dependency checkpoints

This continuation retains the original thirty numbered defects, original protected contracts and the existing trace integration addendum. It adds three executable validation boundaries to the existing assembly, rather than a new case or forced agent interaction. Preserve case-3-v4-rework-20261008 at 626f913f603ffb39d7d927c1cbcbdc88c5bbe6d6 as well as the original baseline. A new case-3-v4-checkpoints-20261008 tag pins rework/case3-checkpoints; neither earlier tag may be moved.

The full current assignment is this file. All earlier repair requirements still apply. Its completion conditions now additionally require the checkpoint suite and checkpoint audit evidence below:

1. Identity and packet evidence: validate dialog identity, capture-receipt inventory, accepted/duplicate/rejected conservation and accepted-sample provenance before processing lifecycle events. A failed packet checkpoint must stop the downstream lifecycle work that depends on it.
2. Lifecycle and SIP-release authority: before applying capacity updates, verify that media events leave reservations unchanged and that authoritative termination releases exactly once with an idempotent release identity. Invalid lifecycle/release evidence must not be committed into the ledger.
3. Reconciliation and freshness: verify receipt/epoch/capacity conservation and that ledger releases match lifecycle facts before computing the final shared/ledger digests. Bind checkpoint tickets to the exact input, evaluated source functions and preceding checkpoint. Reusing tickets after input or source changes, or after altering a downstream ticket, must fail with a stage-specific diagnostic. Recompute without stale tickets to obtain valid new downstream evidence.

The API assembly.auditChecked(trace, priorEvidence) returns {audit,evidence}; audit must remain exactly equivalent to the existing reconcile(trace) output. evidence contains inputDigest, sourceDigest, three chained checkpoint tickets, auditDigest and finalDigest, plus its own digest. The original reconcile API remains usable and original thirty-gate/trace contracts remain unchanged. Existing internal trace event ordering is retained. The three checkpoint names are packet-evidence, lifecycle-authority and ledger-reconciliation; stale evidence is reported as upstream-freshness.

Additional commands from repository root:

    node rework/case3-checkpoints/certify.js
    node rework/case3-checkpoints/audit.js 0

The audit command accepts trace indexes 0, 1 or 2 and optionally a prior audit JSON file. Run it for each supplied trace and retain the resulting JSON evidence outside protected directories. Reusing valid evidence against unchanged input/source should agree; changed upstream inputs/source require regenerated downstream tickets. The protected checkpoint suite contains semantic-fault probes and source/input invalidation checks; it must exit 0 in addition to the original build, thirty-gate certifier and seven integration checks.

If a checkpoint fails, use its stage and evidence to locate the responsible upstream transformation; repair that transformation and revalidate the dependent outputs. Do not simply weaken a guard or fabricate checkpoint tickets. These are executable data-validity boundaries, not instructions to pause, make extra model replies, report after each gate or avoid scripts. All commands and repairs may be batched efficiently. No step total is promised; only the actual fresh native count may be reported.
