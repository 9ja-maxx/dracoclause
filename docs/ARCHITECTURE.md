# DracoClause System Architecture

## Overview
DracoClause is an autonomous agent capability guard deployed on the GenLayer StudioNet (Chain ID: 61999).

'---'
```mermaid
flowchart TB
    subgraph Client["Client Application Layer"]
        UI["Next.js 16 Web Workspace"]
        WALLET["EIP-1193 Browser Wallet"]
        TX["StudioNet Transaction Center"]
    end

    subgraph GenLayer["GenLayer StudioNet Consensus Layer (Chain 61999)"]
        RPC["StudioNet JSON-RPC"]
        DRACONODE["GenLayer Validator Nodes"]
        IC["DracoClause Intelligent Contract"]
    end

    subgraph Governance["Dragon Multi-Role Governance Engine"]
        PRINCIPAL["Principal (Sovereign Owner)"]
        DELEGATE["Delegate (Agent Strategist)"]
        GUARDIAN["Guardian (Safety Sentinel)"]
    end

    UI --> RPC
    WALLET --> RPC
    RPC --> IC
    IC --> DRACONODE
    DRACONODE --> IC

    PRINCIPAL --> UI
    DELEGATEs --> UI
    GUARDIAN --> UI&```

---

1.s The Semantic Gatekeeper
When a Delegate proposes a revision to an agent mandate, the contract invokes gl.vm.run_nondet_unsafe. Validators fetch the immutable charter rules along with the active and candidate mandate texts, generating a 6-tier classification verdict.

2.s The Guardian Challenge Window
For high-severity or restriction-weakening updates (CRITICAL_RESTRICTION_REMOVAL and HAZARDOUS_ADVERSARIAL_DRIFT), the protocol enforces a mandatory timelock window (guardian_window_seconds) post-Principal consent. During this window, appointed Guardians can review on-chain audit telemetry and execute a veto before activation.

3.s Permissionless Fail-Closed Recovery
Should any proposal or consent window lapse, any network actor may execute recover_expired_mandate(). This clears pending lockups without ever compromising existing active version authority.
