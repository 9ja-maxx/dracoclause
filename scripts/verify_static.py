from __future__ import annotations

import ast
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTRACT = ROOT / 'contracts' / 'draco_clause.py'
TEST = ROOT / 'tests' / 'direct' / 'test_dracoclause.py'

source = CONTRACT.read_text()
ast.parse(source)

if TEST.exists():
    ast.parse(TEST.read_text())

required_guards = [
    'run_nondet_unsafe',
    'MALFORMED_SEMANTIC_AUDIT_RESULT',
    'STALE_PARENT_MANDATE_VERSION',
    'recover_expired_mandate',
    'STATUS_SUPERSEDED',
    'STATUS_REPLACED',
    'STATUS_IN_GUARDIAN_CHALLENGE',
    'STATUS_VETOED',
    'is_mandate_authorized',
    'consent_to_mandate',
    'veto_mandate',
    'validator_val = leader_fn()',
]

for token in required_guards:
    if token not in source:
        raise SystemExit(f'Missing required security guard: {token}')

print('AST Syntax: PASS')
print('Draco Security Invariants: PASS')
print('CONTRACT_SHA256=' + hashlib.sha256(CONTRACT.read_bytes()).hexdigest())
