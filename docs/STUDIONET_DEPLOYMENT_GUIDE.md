# 🐉 DracoClause — StudioNet Deployment Guide

This guide walks through deploying the DracoClause Intelligent Contract on the GenLayer StudioNet.

---

## 1. Network Parameters

- **Network Name**: GenLayer StudioNet
- **Chain ID**: `61999`
- **RPC URL**: `https://studio.genlayer.com/api`
- **Studio Interface**: [https://studio.genlayer.com](https://studio.genlayer.com)
- **Native Currency**: `GEN`

---

## 2. Deployment via GenLayer Studio

1. Open [https://studio.genlayer.com](https://studio.genlayer.com).
2. Create a new contract file named `draco_clause.py`.
3. Copy the entire contents of [`contracts/draco_clause.py`](../contracts/draco_clause.py) into the editor.
4. Ensure the dependency header is intact:
   ```python
   # { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
   ```
5. Click **Deploy**.
6. Once deployed on StudioNet, copy the deployed contract address (e.g. `0x...`).
7. Provide the contract address in `frontend/.env.local`:
   ```bash
   NEXT_PUBLIC_DRACO_CLAUSE_ADDRESS=0xYourDeployedContractAddress
   ```

---

## 3. Initializing a Reference Mandate

After deployment, invoke `create_mandate` with:
- `mandate_id`: `"yield-sentinel-alpha"`
- `delegate`: `0xYourDelegateAddress`
- `guardian`: `0xYourGuardianAddress`
- `initial_mandate_text`: Daily drawdown 500 GEN limit on Aave v3.
- `charter_rules`: Spending limit hikes require re-consent.
- `review_ttl_seconds`: `3600`
- `consent_ttl_seconds`: `3600`
- `guardian_window_seconds`: `300`