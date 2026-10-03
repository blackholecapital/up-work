# Case 3 — synthetic isolated SIP/SDP media diagnosis

This fixture is entirely invented, local, and deterministic. It models one SIP dialog whose RTP ingress is accepted only from the exact loopback endpoint negotiated in the synthetic dialog. PCMU and PCMA decode to 8 kHz mono frames with dialog/codec/sequence provenance. Early media is classified separately from post-answer media. Duplicates are rejected idempotently, modest reordering is accepted, stale replay is rejected, and loss creates no synthetic frame. Timeout, socket loss, and SIP termination fail closed; media does not release SIP capacity.

Editable implementation is `src/` (nine modules). Certification and integrity tooling is protected under `protected/`. No carrier, PSTN, AI admission, external network, or privileged namespace is used.

Commands:

```sh
npm run integrity
npm run certify
./acceptance.sh
npm run reset
```

Evidence under `selftest-evidence/` is machine-generated internal evidence. The user must narrate/rewrite it before any submission.
