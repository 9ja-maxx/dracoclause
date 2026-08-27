# DracoClause Reviewer Guide

---

## ⚡ Live StudioNet Deployment Evidence

- **Deployed Contract Address**: `0x2cf548F7Ec57c58b014ee98466852db63d1D9878`
- **Network Name**: `GenLayer StudioNet`
- **Chain ID**: `61999`
- **RPC Endpoint**: `https://studio.genlayer.com/api`
- **Studio Interface**: [https://studio.genlayer.com](https://studio.genlayer.com)
- **StudioNet Explorer**: [https://explorer-studio.genlayer.com/address/0x2cf548F7Ec57c58b014ee98466852db63d1D9878](https://explorer-studio.genlayer.com/address/0x2cf548F7Ec57c58b014ee98466852db63d1D9878)

---

## Quick Evaluation Path (5 Minutes)

1. **Inspect the Intelligent Contract**:
   - Path: `contracts/draco_clause.py`
   - Note the `gl.vm.run_nondet_unsafe()` pattern and the 6-tier Dragon Semantic Taxonomy.

2. **Verify Direct Unit Tests**:
   ```bash
   python -m pytest tests/direct -v
   ```

3. **Static AST Verification**:
   ```bash
   python scripts/verify_static.py
   ```

4. **Frontend Live Workspace**:
   ```bash
   cd frontend && npm install && npm run dev
   ```