# OKF Public Boundary — Molt Side
**Status**: DRAFTED — pending fresh-critic pass  
**Scope**: What Open-Molt may never accept from PAULIS-PLACE's private OKF (Open Knowledge Foundation-derived / operational knowledge) layer. Sol owns OKF implementation on the PAULIS-PLACE side; this document is the receiving-side prohibition list only.

---

## The rule

Open-Molt consumes the approved public claim/capsule defined in `PAULIS_PLACE_PUBLIC_PROOF_CONTRACT.md`. It does not browse, query, cache, or index private OKF content in any form.

```
PRIVATE OKF (PAULIS-PLACE)
       ✕
       │  no direct path — none, ever
       ▼
governed sanitized derivative (PublicProofCandidate)
       │
       ▼
OPEN-MOLT
```

## What Open-Molt must never accept, store, or display

- Raw private OKF bundles or exports of any kind
- Credentials, API keys, tokens, or secrets in any field
- Email addresses, unless explicitly present in a `PublicProofCandidate` with `allows_client_name: true` and specifically approved for that field
- Internal tenant identifiers or PAULIS-PLACE organization IDs
- Private agent identity keys (Buzz signing keys, `identity_ref` values, or any cryptographic material)
- Internal storage paths, database identifiers, or file-system references
- Raw evidence references (only hashes and type labels cross, per §10 of the Mission Protocol)
- Prompts, system prompts, or any model-input text
- Chain-of-thought or intermediate reasoning of any agent
- Private conversations, Buzz channel content, or huddle transcripts
- Unapproved customer names or logos — only crosses when `client_capsule_consent.allows_client_name` / equivalent logo-consent flag is explicitly true for that specific capsule

## Enforcement posture

This is a receiving-side constraint, not a request to PAULIS-PLACE. Open-Molt's implementation should treat any inbound payload carrying a field shaped like the above as **malformed input to reject**, not data to sanitize on receipt — sanitization is PAULIS-PLACE's job, upstream of the boundary, per §17.3 of the Mission Protocol. If Open-Molt ever finds itself writing code to *strip* private fields from an inbound payload, that is itself a signal the boundary has already been violated upstream and should be reported, not silently patched over.

---

*Status per this repo's own records-integrity law: DRAFTED, not CANONICAL, until independently reviewed.*
