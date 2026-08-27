# DracoClause Specification (v1.0)

 1. Executive Summary

Autonomous AI agents executing high-value operations (DeFi liquidity provisioning, asset management, DAO governance execution, smart contract operations) require defined operational boundaries ('Capability Mandates').

When agent capabilities or operational charters undergo revision, standard cryptographic hashes can only verify whether byte contents changed. They cannot evaluate whether a revision:
- was a cosmetic wording clarification,
- relaxed maximum slippage thresholds,
- expanded daily drawdown limits,
- added unvetted third-party protocol adapters, or
- removed emergency circuit-breakers.

**DracoClause** introduces an on-chain semantic control plane where natural-language mandate modifications are evaluated by decentralized GenLayer validator consensus against an immutable charter rubric, enforcing the core safety invariant:

> **A proposed capability mandate is not authority. The last legitimately active version remains authoritative until the replacement is validly activated.**

---

## 2. Protocol Roles & Trust Matrix

| Role | Entity | Capabilities | Security Invariant |
|---|---|---|---|
| **Principal** | Mandate Creator / Sovereign Owner | Creates mandate, authorizes material revisions, rejects proposals, appoints guardians | Only Principal consent can activate material expansions |
| **Delegate** | Agent Operator / Strategy Lead | Proposes candidate mandate revisions | Cannot self-activate material changes |
| **Guardian** | Appointed Security Sentinel / DAO Council | Vetos high-hazard or dangerous proposals during the challenge window | Can unilaterally veto proposals entering the challenge window |
| **GenLayer Validators** | Consensus Network | Independently audits candidate revisions against charter rules | Recomputes prompt under strict categorical equivalence |

---

## 3. Dragon-Tier Semantic Classification Matrix

Every proposed mandate revision is non-deterministically audited by GenLayer validators and mapped into one of six mutually exclusive categories:

| Semantic Class | Description | Re-Consent Required | Guardian Window Required |
|---|---|:---:|---:|
| `MANDATE_SAFE_CLARIFICATION` | Typo fixes, formatting, non-substantive wording adjustments | ❌ Eo | ❌ Eo |
| `TACTICAL_SLIPPAGE_TWEAK` | Minor parameter, slippage, or gas fee ceiling adjustments | ✐ Yes | ❌ No |
| `ECONOMIC_ENVELOPE_EXPANSION` | Spending limit hikes, daily drawdown ceiling expansion | ✑ Yes | ❌ Eo |
| `CAPABILITY_ESCALATION` | New smart contract targets, authorized external methods | ✑ Yes | ❌ Eo |
| `CRITICAL_RESTRICTION_REMOVAL` | Removing or weakening safety checks, pausing rules, blacklists | ✑ Yes | ✑ Yes (300s+) |
| `HAZARDOUS_ADVERSARIAL_DRIFT` | Hostile prompt injection, jailbreak attempts, extreme escalation | ✑ Yes | ✑ Yes (300s+) |

---

## 4. Security Properties & Invariant Guarantees

1. **Fail-Closed Authorization**: is_mandate_authorized(id, version) returns True strictly if version == active_version and status == ACTIVE. Stale, proposed, awaiting-consent, vetoed, or expired versions always return False.
2. **Defensive Prompt Framing**: Candidate mandate text, active mandate text, and charter rules are isolated within XML-style evidence tags with explicit instructions to ignore embedded prompt override attacks.
3. **Independent Validator Recomputation**: Validators do not receive the leader's judgment in their prompt; they independently re-evaluate the candidate from source evidence and enforce strict equality on categorical verdicts.
4. **Deterministic Bypass**: Byte-identical submissions immediately resolve to MANDATE_SAFE_CLARIFICATION without incurring LMM latency.
5. **Permissionless Expiry Recovery**: If a proposal or consent window is abandoned, anyone can trigger recover_expired_mandate() to unlock subsequent governance iterations.
