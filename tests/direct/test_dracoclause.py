from __future__ import annotations

import json
import pytest

MANDATE_ID = "yield-sentinel-agent"
CHARTER_RULES = """
The AI agent is an autonomous DeFi treasury rebalancing sentinel.
Re-consent is strictly required whenever the agent increases maximum slippage,
expands the 24-hour spending/drawdown envelope, adds new target protocol adapters,
or modifies safety limits. Any removal of emergency pause or withdrawal limits
is a critical restriction removal requiring a guardian review window.
Wording clarifications, typo fixes, or formatting changes are safe clarifications.
""".strip()

V1_MANDATE = """
The sentinel agent may rebalance USDC and DAI liquidity pools across Aave v3
with a maximum 24h drawdown limit of 500 GEN and maximum slippage of 0.5%.
Emergency pause remains active at all times. Direct transfers to external addresses are forbidden.
""".strip()

V1_REWRITE = """
The sentinel agent is permitted to execute USDC/DAI pool rebalancing on Aave v3.
The daily drawdown limit is 500 GEN and slippage must not exceed 0.5%.
Emergency pause capability is permanently active. External transfers are prohibited.
""".strip()

V2_ECONOMIC_EXPANDED = """
The sentinel agent may rebalance USDC and DAI liquidity pools across Aave v3
with an expanded 24h drawdown limit of 2,500 GEN and maximum slippage of 1.5%.
Emergency pause remains active at all times. Direct transfers to external addresses are forbidden.
""".strip()

V2_CRITICAL_REMOVAL = """
The sentinel agent may rebalance pools across Aave v3 with no daily drawdown limit.
Emergency pause requirements are relaxed.
""".strip()

AUDIT_PROMPT_PATTERN = r"You are DracoClause: the decentralized semantic capability gatekeeper"


def as_hex_address(value) -> str:
    if isinstance(value, (bytes, bytearray)):
        return "0x" + bytes(value).hex()
    as_hex = getattr(value, "as_hex", None)
    if isinstance(as_hex, str):
        return as_hex
    return str(value)


def deploy_draco(direct_deploy):
    return direct_deploy("contracts/draco_clause.py")


def setup_mandate(contract, direct_vm, principal, delegate, guardian):
    direct_vm.sender = principal
    contract.create_mandate(
        MANDATE_ID,
        as_hex_address(delegate),
        as_hex_address(guardian),
        V1_MANDATE,
        CHARTER_RULES,
        3600,
        3600,
        300,
    )


def mock_dragon_audit(
    direct_vm,
    requires_consent: bool,
    requires_guardian_window: bool,
    semantic_class: str,
    risk_score: int,
):
    direct_vm.mock_llm(
        AUDIT_PROMPT_PATTERN,
        json.dumps(
            {
                "requires_consent": requires_consent,
                "requires_guardian_window": requires_guardian_window,
                "semantic_class": semantic_class,
                "risk_score": risk_score,
            }
        ),
    )


# ---------------------------------------------------------------------------
# Test Cases
# ---------------------------------------------------------------------------

def test_create_mandate_initial_active(direct_vm, direct_deploy, direct_owner, direct_alice, direct_bob):
    contract = deploy_draco(direct_deploy)
    setup_mandate(contract, direct_vm, direct_owner, direct_alice, direct_bob)

    meta = contract.get_mandate(MANDATE_ID)
    active = contract.get_active_version(MANDATE_ID)

    assert meta["active_version"] == 1
    assert meta["open_version"] == 0
    assert active["status"] == "ACTIVE"
    assert active["mandate_text"] == V1_MANDATE
    assert contract.is_mandate_authorized(MANDATE_ID, 1) is True


def test_duplicate_mandate_id_rejected(direct_vm, direct_deploy, direct_owner, direct_alice, direct_bob):
    contract = deploy_draco(direct_deploy)
    setup_mandate(contract, direct_vm, direct_owner, direct_alice, direct_bob)

    with direct_vm.prank(direct_owner):
        with direct_vm.expect_revert("MANDATE_ALREADY_EXISTS"):
            contract.create_mandate(
                MANDATE_ID,
                as_hex_address(direct_alice),
                as_hex_address(direct_bob),
                V1_MANDATE,
                CHARTER_RULES,
                3600,
                3600,
                300,
            )


def test_only_delegate_or_principal_can_propose(direct_vm, direct_deploy, direct_owner, direct_alice, direct_bob, direct_charlie):
    contract = deploy_draco(direct_deploy)
    setup_mandate(contract, direct_vm, direct_owner, direct_alice, direct_bob)

    with direct_vm.prank(direct_charlie):
        with direct_vm.expect_revert("ONLY_DELEGATE_OR_PRINCIPAL"):
            contract.propose_mandate_version(MANDATE_ID, V2_ECONOMIC_EXPANDED)


def test_identical_text_activates_deterministically(direct_vm, direct_deploy, direct_owner, direct_alice, direct_bob):
    contract = deploy_draco(direct_deploy)
    setup_mandate(contract, direct_vm, direct_owner, direct_alice, direct_bob)

    with direct_vm.prank(direct_alice):
        ver = contract.propose_mandate_version(MANDATE_ID, V1_MANDATE)

    contract.review_mandate_version(MANDATE_ID, ver)

    reviewed = contract.get_version(MANDATE_ID, ver)
    prev = contract.get_version(MANDATE_ID, 1)

    assert reviewed["requires_consent"] is False
    assert reviewed["semantic_class"] == "MANDATE_SAFE_CLARIFICATION"
    assert reviewed["status"] == "ACTIVE"
    assert prev["status"] == "REPLACED"
    assert contract.is_mandate_authorized(MANDATE_ID, ver) is True
    assert contract.is_mandate_authorized(MANDATE_ID, 1) is False


def test_semantic_safe_clarification_activates_immediately(direct_vm, direct_deploy, direct_owner, direct_alice, direct_bob):
    direct_vm.strict_mocks = True
    contract = deploy_draco(direct_deploy)
    setup_mandate(contract, direct_vm, direct_owner, direct_alice, direct_bob)

    with direct_vm.prank(direct_alice):
        ver = contract.propose_mandate_version(MANDATE_ID, V1_REWRITE)

    mock_dragon_audit(direct_vm, False, False, "MANDATE_SAFE_CLARIFICATION", 5)
    contract.review_mandate_version(MANDATE_ID, ver)

    direct_vm.clear_mocks()
    mock_dragon_audit(direct_vm, False, False, "MANDATE_SAFE_CLARIFICATION", 5)
    assert direct_vm.run_validator() is True

    reviewed = contract.get_version(MANDATE_ID, ver)
    assert reviewed["status"] == "ACTIVE"
    assert contract.get_mandate(MANDATE_ID)["active_version"] == ver
    assert contract.is_mandate_authorized(MANDATE_ID, ver) is True


def test_economic_expansion_requires_consent_and_preserves_active_authority(direct_vm, direct_deploy, direct_owner, direct_alice, direct_bob):
    direct_vm.strict_mocks = True
    contract = deploy_draco(direct_deploy)
    setup_mandate(contract, direct_vm, direct_owner, direct_alice, direct_bob)

    with direct_vm.prank(direct_alice):
        ver = contract.propose_mandate_version(MANDATE_ID, V2_ECONOMIC_EXPANDED)

    mock_dragon_audit(direct_vm, True, False, "ECONOMIC_ENVELOPE_EXPANSION", 45)
    contract.review_mandate_version(MANDATE_ID, ver)

    direct_vm.clear_mocks()
    mock_dragon_audit(direct_vm, True, False, "ECONOMIC_ENVELOPE_EXPANSION", 45)
    assert direct_vm.run_validator() is True

    reviewed = contract.get_version(MANDATE_ID, ver)
    assert reviewed["status"] == "AWAITING_CONSENT"
    assert reviewed["requires_consent"] is True
    assert contract.is_mandate_authorized(MANDATE_ID, ver) is False
    assert contract.is_mandate_authorized(MANDATE_ID, 1) is True


def test_principal_can_consent_to_economic_expansion(direct_vm, direct_deploy, direct_owner, direct_alice, direct_bob):
    contract = deploy_draco(direct_deploy)
    setup_mandate(contract, direct_vm, direct_owner, direct_alice, direct_bob)

    with direct_vm.prank(direct_alice):
        ver = contract.propose_mandate_version(MANDATE_ID, V2_ECONOMIC_EXPANDED)

    mock_dragon_audit(direct_vm, True, False, "ECONOMIC_ENVELOPE_EXPANSION", 45)
    contract.review_mandate_version(MANDATE_ID, ver)

    with direct_vm.prank(direct_owner):
        contract.consent_to_mandate(MANDATE_ID, ver)

    assert contract.get_mandate(MANDATE_ID)["active_version"] == ver
    assert contract.get_version(MANDATE_ID, ver)["status"] == "ACTIVE"
    assert contract.is_mandate_authorized(MANDATE_ID, ver) is True
    assert contract.is_mandate_authorized(MANDATE_ID, 1) is False


def test_critical_restriction_removal_triggers_guardian_challenge_window(direct_vm, direct_deploy, direct_owner, direct_alice, direct_bob):
    direct_vm.warp("2026-08-27T10:00:00+00:00")
    contract = deploy_draco(direct_deploy)
    setup_mandate(contract, direct_vm, direct_owner, direct_alice, direct_bob)

    with direct_vm.prank(direct_alice):
        ver = contract.propose_mandate_version(MANDATE_ID, V2_CRITICAL_REMOVAL)

    mock_dragon_audit(direct_vm, True, True, "CRITICAL_RESTRICTION_REMOVAL", 90)
    contract.review_mandate_version(MANDATE_ID, ver)

    with direct_vm.prank(direct_owner):
        contract.consent_to_mandate(MANDATE_ID, ver)

    reviewed = contract.get_version(MANDATE_ID, ver)
    assert reviewed["status"] == "IN_GUARDIAN_CHALLENGE"
    assert contract.is_mandate_authorized(MANDATE_ID, ver) is False
    assert contract.is_mandate_authorized(MANDATE_ID, 1) is True

    # Cannot finalize before guardian window expires
    with direct_vm.expect_revert("GUARDIAN_CHALLENGE_WINDOW_STILL_ACTIVE"):
        contract.finalize_guardian_challenge(MANDATE_ID, ver)

    # Warp past guardian window
    direct_vm.warp("2026-08-27T10:06:00+00:00")
    contract.finalize_guardian_challenge(MANDATE_ID, ver)

    assert contract.get_version(MANDATE_ID, ver)["status"] == "ACTIVE"
    assert contract.is_mandate_authorized(MANDATE_ID, ver) is True


def test_guardian_veto_blocks_activation(direct_vm, direct_deploy, direct_owner, direct_alice, direct_bob):
    direct_vm.warp("2026-08-27T10:00:00+00:00")
    contract = deploy_draco(direct_deploy)
    setup_mandate(contract, direct_vm, direct_owner, direct_alice, direct_bob)

    with direct_vm.prank(direct_alice):
        ver = contract.propose_mandate_version(MANDATE_ID, V2_CRITICAL_REMOVAL)

    mock_dragon_audit(direct_vm, True, True, "CRITICAL_RESTRICTION_REMOVAL", 90)
    contract.review_mandate_version(MANDATE_ID, ver)

    with direct_vm.prank(direct_owner):
        contract.consent_to_mandate(MANDATE_ID, ver)

    with direct_vm.prank(direct_bob):
        contract.veto_mandate(MANDATE_ID, ver, "Emergency pause relaxation is dangerous")

    reviewed = contract.get_version(MANDATE_ID, ver)
    assert reviewed["status"] == "VETOED"
    assert reviewed["veto_reason"] == "Emergency pause relaxation is dangerous"
    assert contract.is_mandate_authorized(MANDATE_ID, ver) is False
    assert contract.is_mandate_authorized(MANDATE_ID, 1) is True


def test_validator_rejects_class_divergence(direct_vm, direct_deploy, direct_owner, direct_alice, direct_bob):
    direct_vm.strict_mocks = True
    contract = deploy_draco(direct_deploy)
    setup_mandate(contract, direct_vm, direct_owner, direct_alice, direct_bob)

    with direct_vm.prank(direct_alice):
        ver = contract.propose_mandate_version(MANDATE_ID, V2_ECONOMIC_EXPANDED)

    mock_dragon_audit(direct_vm, True, False, "ECONOMIC_ENVELOPE_EXPANSION", 50)
    contract.review_mandate_version(MANDATE_ID, ver)

    direct_vm.clear_mocks()
    mock_dragon_audit(direct_vm, True, False, "CAPABILITY_ESCALATION", 50)
    assert direct_vm.run_validator() is False


def test_permissionless_expiry_recovery(direct_vm, direct_deploy, direct_owner, direct_alice, direct_bob, direct_charlie):
    direct_vm.warp("2026-08-27T12:00:00+00:00")
    contract = deploy_draco(direct_deploy)
    setup_mandate(contract, direct_vm, direct_owner, direct_alice, direct_bob)

    with direct_vm.prank(direct_alice):
        ver = contract.propose_mandate_version(MANDATE_ID, V2_ECONOMIC_EXPANDED)

    # Warp past review deadline
    direct_vm.warp("2026-08-27T13:00:01+00:00")
    with direct_vm.prank(direct_charlie):
        contract.recover_expired_mandate(MANDATE_ID, ver)

    assert contract.get_version(MANDATE_ID, ver)["status"] == "EXPIRED"
    assert contract.get_mandate(MANDATE_ID)["active_version"] == 1
    assert contract.is_mandate_authorized(MANDATE_ID, ver) is False
