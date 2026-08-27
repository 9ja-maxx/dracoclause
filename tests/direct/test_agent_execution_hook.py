from __future__ import annotations

import json
import pytest

MANDATE_ID = "autonomous-arbitrage-agent"
CHARTER = "Re-consent required on flashloan limit increase or slippage change."
MANDATE_V1 = "Flashloan limit: 1000 GEN. Slippage: 0.5%."


def as_hex(val):
    if isinstance(val, (bytes, bytearray)):
        return "0x" + bytes(val).hex()
    as_hex_attr = getattr(val, "as_hex", None)
    if isinstance(as_hex_attr, str):
        return as_hex_attr
    return str(val)


def test_agent_execution_hook_verifies_active_mandate(direct_vm, direct_deploy, direct_owner, direct_alice, direct_bob):
    contract = direct_deploy("contracts/draco_clause.py")
    direct_vm.sender = direct_owner

    contract.create_mandate(
        MANDATE_ID,
        as_hex(direct_alice),
        as_hex(direct_bob),
        MANDATE_V1,
        CHARTER,
        3600,
        3600,
        300,
    )

    # Authorized check
    assert contract.is_mandate_authorized(MANDATE_ID, 1) is True
    assert contract.is_mandate_authorized(MANDATE_ID, 2) is False
    assert contract.is_mandate_authorized(MANDATE_ID, 99) is False

    # Proposing v2 does not authorize it
    with direct_vm.prank(direct_alice):
        v2 = contract.propose_mandate_version(MANDATE_ID, "Flashloan limit: 5000 GEN.")

    assert contract.is_mandate_authorized(MANDATE_ID, v2) is False
    assert contract.is_mandate_authorized(MANDATE_ID, 1) is True
