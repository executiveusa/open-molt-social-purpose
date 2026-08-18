# PAULIS-PLACE ↔ OPEN-MOLT Public Proof Contract
**Status**: DRAFTED — pending fresh-critic pass (Sol) before CANONICAL, same discipline as MISSION_PROTOCOL_v0.1  
**Scope**: The exact envelope that may cross from PAULIS-PLACE's private truth into Open-Molt's public projection. Nothing else.  
**Not a duplicate**: This document defines only the boundary. The full pipeline, gate logic, `VerifiedHumanDecision` primitive, and Distribution Copy Governance rules live in `MISSION_PROTOCOL_v0.1.md` §17 — reconciled here, not restated.

---

## 1. What crosses the boundary

Nothing crosses except a `PublicProofCandidate` that has already cleared every gate in `MISSION_PROTOCOL_v0.1.md` §17.3 on the PAULIS-PLACE/Mission-Control side. Open-Molt never queries, browses, or receives a live connection into PAULIS-PLACE's private Mission Control, OKF knowledge layer, or event stream. It receives finished, governed artifacts — pushed or pulled through an explicit, versioned interface, never inferred or reconstructed from partial private data.

```
PAULIS-PLACE (private)                          OPEN-MOLT (public)
Mission Control + OKF
  │
  ▼
Proof Candidate Builder
  │
  ▼
SANITIZATION → PRIVACY/TENANT REVIEW → DISCLOSURE POLICY
→ CLIENT CAPSULE CONSENT → PAULI PUBLICATION AUTHORITY
→ DISTRIBUTION COPY GOVERNANCE
  │
  │  (§17.3/§17.4 of MISSION_PROTOCOL_v0.1 — all gates cleared)
  ▼
PublicProofCandidate  ─────────────────────────►  receives + projects only
                                                    (never re-derives, never
                                                     reaches back for more)
```

## 2. Envelope

Reconciled against the schema fragments already established in §17.3/§17.4 — not a new invention:

```typescript
interface PublicProofCandidate {
  schema_version: string              // e.g. "public-proof-candidate.v1"
  candidate_id: string
  source_mission_ref: string          // opaque reference — NOT the private mission_id;
                                       // Open-Molt cannot use this to query PAULIS-PLACE

  claim: {
    claim_id: string                  // matches ApprovedClaim.claim_id, §17.4
    layer: 'output' | 'delivery' | 'response' | 'outcome' | 'value'  // §4 Evidence Maturity Chain
    public_text: string                // the ApprovedClaim's public_text — the only wording
                                        // Open-Molt is permitted to display or paraphrase
    must_not_imply: string[]           // carried verbatim from ApprovedClaim (§17.4)
  }

  proof_dimensions: {                  // §3 — independent, no dimension implies another
    claimed: boolean
    verified: boolean
    attested: boolean
  }

  evidence_summary: {
    evidence_count: number
    evidence_types: string[]           // hashes/types only — never raw content (§10)
  }

  sanitization_result: {
    allowlist_version: string
    unknown_field_detected: boolean    // must always be false to cross the boundary — fail closed
  }

  disclosure_policy_version: string

  client_capsule_consent: {
    capsule_hash: string                // sha256 — the exact content this was consented to
    consent_scope: 'THIS_CAPSULE_VERSION_ONLY'
    allows_public_replay: boolean
    allows_agent_display_names: boolean
    allows_client_name: boolean
    allows_artifact_preview: boolean
    verified_human_decision_ref: string // audit receipt ref, §9a — not the raw signature
  }

  pauli_publication_authority: {
    authorized: boolean                 // must be true; §17.3 gate 5
    verified_human_decision_ref: string
  }

  capsule_hash: string                  // top-level integrity hash for this whole candidate
  distribution_policy: 'SYSTEM_GOVERNED' | 'CLIENT_REAPPROVAL_REQUIRED'
}
```

## 3. Hard constraints on the envelope

- **Versioned**: `schema_version` is required on every candidate. Open-Molt rejects any candidate whose version it does not recognize — fail closed, not best-effort parsing.
- **Deterministic where possible**: `proof_dimensions`, `sanitization_result.unknown_field_detected`, and `pauli_publication_authority.authorized` are booleans computed on the PAULIS-PLACE side per §9a/§17.3's discipline — never inferred by Open-Molt from partial data.
- **Fail closed**: any candidate missing a required field, carrying an unrecognized `schema_version`, or with `unknown_field_detected: true` is rejected outright by Open-Molt, not degraded-and-accepted.
- **Tenant scoped**: `source_mission_ref` is opaque and non-queryable; no candidate carries an organization ID, internal tenant ID, or any field enumerated in §17.3's exclusion list.
- **Incapable of carrying prompts/CoT/secrets/raw credentials**: this envelope has no field shaped to hold them. Adding one requires a new schema version and a fresh Gauntlet pass on this document, not a quiet field addition.
- **Independently hashable**: `capsule_hash` is computed over the full candidate content. Open-Molt can independently recompute and compare it against what `client_capsule_consent.capsule_hash` and `pauli_publication_authority` were actually granted for — if they don't match, reject.

## 4. What Open-Molt does with a valid candidate

Projects `claim.public_text` and only `claim.public_text`, bound by `claim.must_not_imply`, through Observatory (§10) and Distribution Copy Governance (§17.4) exactly as already specified. Open-Molt does not re-derive value claims, does not infer proof dimensions beyond what's in `proof_dimensions`, and does not construct distribution copy that exceeds the bound `ApprovedClaim` — same rule as §17.4's invariant, applied at the receiving end of this envelope.

## 5. Reconciliation note

This contract intentionally does not restate the six-gate pipeline, `VerifiedHumanDecision`, or Distribution Copy Governance logic — those are already canonical in `MISSION_PROTOCOL_v0.1.md` §9a/§17.3/§17.4. If those sections change, this envelope's field names and constraints must be re-checked against them before the next version is issued — this document does not independently define behavior, only the wire shape of what crosses the repo boundary.

---

*Status per this repo's own records-integrity law (§0 of MISSION_PROTOCOL_v0.1): DRAFTED, not CANONICAL, until an independent fresh critic re-reads the committed file and confirms fidelity.*
