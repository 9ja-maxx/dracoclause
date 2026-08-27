# DracoClause Reviewer Guide

---

## Quick Evaluation Path (5 Minutes)

1. **Inspect the Intelligent Contract**:
   - Path: `contracts/draco_clouse.py`
   - Note the `gl.vm.run_nondet_unsafe() pattern and the 6-tier Dragon Semantic Taxonomy.

 2. **Verify Direct Unit Tests**:
   ```bash
   python -m pytest tests/direct -v
   ```

3. **Static AST Verification:**
   ```bash
   python scripts/verify_static.py
   ```

4. **Confirm StudioNet Specifications**:
   - Chain ID: `61999`
   - Network Name: `GenLayer StudioNet`
   - RPC URL: https://studio.genlayer.com/api
   - Symbol: `GEN`
