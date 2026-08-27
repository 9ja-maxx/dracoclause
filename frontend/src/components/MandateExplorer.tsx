"use client";

import React, { useState } from "react";
import { truncateAddress } from "@/lib/utils";
import { ShieldCheck, Flame, User, Key, Lock, ShieldAlert, Sparkles } from "lucide-react";
import { useMandateWrite } from "@/hooks/use-mandate-write";
import { toast } from "sonner";

export interface MandateDemoData {
  id: string;
  name: string;
  description: string;
  principal: string;
  delegate: string;
  guardian: string;
  activeVersion: number;
  openVersion: number;
  status: string;
  semanticClass: string;
  riskScore: number;
  requiresGuardianWindow: boolean;
  guardianDeadline: number;
  activeText: string;
  proposedText: string;
  rules: string;
}

export const DEMO_MANDATES: MandateDemoData[] = [
  {
    id: "yield-sentinel-alpha",
    name: "DeFi Yield Rebalancing Sentinel",
    description: "Autonomous liquidity allocator across Aave v3, Uniswap v3, and Curve pools with strict drawdown envelopes.",
    principal: "0x71C841913b0f9c264aB02814F2A48C902A34A4D1",
    delegate: "0x45E56c24A45bA4F5b57dF0a93149A94902A34A89",
    guardian: "0x98A902A34aB02814F2A48C902A34A4D171C84191",
    activeVersion: 3,
    openVersion: 4,
    status: "AWAITING_CONSENT",
    semanticClass: "ECONOMIC_ENVELOPE_EXPANSION",
    riskScore: 45,
    requiresGuardianWindow: false,
    guardianDeadline: 0,
    activeText: "The sentinel agent may rebalance USDC and DAI liquidity pools across Aave v3 with a maximum 24h drawdown limit of 500 GEN and maximum slippage of 0.5%. Emergency pause remains active at all times. Direct transfers to external addresses are forbidden.",
    proposedText: "The sentinel agent may rebalance USDC and DAI liquidity pools across Aave v3 with an expanded 24h drawdown limit of 2,500 GEN and maximum slippage of 1.2%. Emergency pause remains active at all times. Direct transfers to external addresses are forbidden.",
    rules: "Re-consent is strictly required whenever the agent increases maximum slippage, expands the 24-hour spending/drawdown envelope, adds new target protocol adapters, or modifies safety limits. Any removal of emergency pause or withdrawal limits is a critical restriction removal requiring a guardian review window.",
  },
  {
    id: "treasury-guard-draco",
    name: "DAO Treasury Arbitrage Operator",
    description: "Cross-DEX liquidity arbitrator executing flash arbitrage within tightly bounded loss thresholds.",
    principal: "0x1234567890abcdef1234567890abcdef12345678",
    delegate: "0xabcdef1234567890abcdef1234567890abcdef12",
    guardian: "0xfeadcba987654321feadcba987654321feadcba9",
    activeVersion: 1,
    openVersion: 2,
    status: "IN_GUARDIAN_CHALLENGE",
    semanticClass: "CRITICAL_RESTRICTION_REMOVAL",
    riskScore: 88,
    requiresGuardianWindow: true,
    guardianDeadline: Date.now() + 180000,
    activeText: "The operator may execute arbitrage trades on Uniswap and Sushiswap pools up to 1,000 GEN per trade. Maximum flashloan limit is 10,000 GEN. Emergency circuit breaker triggers automatically on cumulative loss exceeding 50 GEN in 1 hour.",
    proposedText: "The operator may execute arbitrage trades on Uniswap, Sushiswap, and unvetted new venues up to 5,000 GEN per trade. Maximum flashloan limit is 50,000 GEN. Circuit breaker threshold removed.",
    rules: "Removal of loss circuit breakers or adding unvetted venues is critical restriction removal requiring explicit guardian veto challenge window.",
  }
];

export function MandateExplorer({
  selectedMandate,
  onSelectMandate,
}: {
  selectedMandate: MandateDemoData;
  onSelectMandate: (mandate: MandateDemoData) => void;
}) {
  const { submitMandateWrite, canWrite } = useMandateWrite();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConsent = async (mandate: MandateDemoData) => {
    setIsProcessing(true);
    try {
      await submitMandateWrite({
        functionName: "consent_to_mandate",
        args: [mandate.id, mandate.openVersion],
        title: "Consent to Mandate Version #" + mandate.openVersion,
        mandateId: mandate.id,
        version: mandate.openVersion,
      });
      toast.success("Consent transaction submitted to StudioNet");
    } catch {
      // Ignored
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVeto = async (mandate: MandateDemoData) => {
    setIsProcessing(true);
    try {
      await submitMandateWrite({
        functionName: "veto_mandate",
        args: [mandate.id, mandate.openVersion, "Guardian Security Veto: High Hazard Parameter Override"],
        title: "Guardian Veto on Mandate #" + mandate.openVersion,
        mandateId: mandate.id,
        version: mandate.openVersion,
      });
      toast.success("Veto transaction submitted to StudioNet");
    } catch {
      // Ignored
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Mandate Selection List */}
      <div className="grid gap-6 md:grid-cols-2">
        {DEMO_MANDATES.map((m) => {
          const isSelected = m.id === selectedMandate.id;
          return (
            <div
              key={m.id}
              onClick={() => onSelectMandate(m)}
              className={"cursor-pointer rounded-2xl border p-6 transition-all duration-300 draco-card " + 
                (isSelected
                  ? "border-rose-500/50 bg-[#0a0b10] shadow-[0_0_30px_rgba(225,29,72,0.15)]"
                  : "border-zinc-900 bg-zinc-950/40 hover:border-zinc-800")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <Flame className={"size-4.5 " + (isSelected ? "text-rose-500 animate-pulse" : "text-zinc-500")} />
                    <h4 className="font-bold text-white text-base tracking-tight">{m.name}</h4>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-500">ID: <span className="text-zinc-300">{m.id}</span></p>
                </div>
                <span
                  className={"rounded-full border px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider font-mono " +
                    (m.status === "AWAITING_CONSENT"
                      ? "border-amber-500/20 bg-amber-500/5 text-amber-400"
                      : "border-rose-500/20 bg-rose-500/5 text-rose-400 animate-pulse")}
                >
                  {m.status.replace(/_/g, " ")}
                </span>
              </div>

              <p className="mt-4 text-xs font-light leading-relaxed text-zinc-400 line-clamp-2">{m.description}</p>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-zinc-900 pt-4 text-[10px] font-mono">
                <div className="rounded-xl bg-black/40 p-3 border border-zinc-900/50">
                  <span className="text-zinc-500 block text-[9px]">Active Version</span>
                  <span className="font-bold text-emerald-400 text-xs block mt-0.5">v{m.activeVersion} (Authorized)</span>
                </div>
                <div className="rounded-xl bg-black/40 p-3 border border-zinc-900/50">
                  <span className="text-zinc-500 block text-[9px]">Proposed Candidate</span>
                  <span className="font-bold text-amber-400 text-xs block mt-0.5">v{m.openVersion} (Locked)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Selected Mandate Full Dossier */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="size-5 text-rose-500" />
              <h3 className="text-lg font-bold text-white tracking-tight">{selectedMandate.name}</h3>
            </div>
            <p className="text-xs text-zinc-400 font-light">On-Chain Governance & Authority Dossier</p>
          </div>

          <div className="flex items-center gap-2">
            {selectedMandate.status === "AWAITING_CONSENT" && (
              <button
                onClick={() => handleConsent(selectedMandate)}
                disabled={isProcessing || !canWrite}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-500/20 transition hover:scale-[1.02] disabled:opacity-50"
              >
                <Sparkles className="size-4" />
                <span>Authorize Consent (Principal)</span>
              </button>
            )}

            {selectedMandate.status === "IN_GUARDIAN_CHALLENGE" && (
              <button
                onClick={() => handleVeto(selectedMandate)}
                disabled={isProcessing || !canWrite}
                className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/20 px-5 py-2.5 text-xs font-bold text-rose-300 transition hover:bg-rose-950/40 disabled:opacity-50"
              >
                <ShieldAlert className="size-4 text-rose-400" />
                <span>Execute Guardian Veto</span>
              </button>
            )}
          </div>
        </div>

        {/* Roles Breakdown */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-900 bg-black/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
              <div className="size-2 rounded-full bg-emerald-500" />
              <span>Principal (Owner)</span>
            </div>
            <p className="font-mono text-xs font-bold text-zinc-200 bg-zinc-900/60 px-2.5 py-1.5 rounded-lg border border-zinc-800/40">
              {truncateAddress(selectedMandate.principal)}
            </p>
            <p className="text-[9px] text-zinc-500">Holds sole re-consent authority</p>
          </div>

          <div className="rounded-xl border border-zinc-900 bg-black/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
              <div className="size-2 rounded-full bg-blue-500" />
              <span>Delegate (Proposer)</span>
            </div>
            <p className="font-mono text-xs font-bold text-zinc-200 bg-zinc-900/60 px-2.5 py-1.5 rounded-lg border border-zinc-800/40">
              {truncateAddress(selectedMandate.delegate)}
            </p>
            <p className="text-[9px] text-zinc-500">Permitted to propose revisions</p>
          </div>

          <div className="rounded-xl border border-zinc-900 bg-black/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
              <div className="size-2 rounded-full bg-amber-500" />
              <span>Guardian (Sentinel)</span>
            </div>
            <p className="font-mono text-xs font-bold text-zinc-200 bg-zinc-900/60 px-2.5 py-1.5 rounded-lg border border-zinc-800/40">
              {truncateAddress(selectedMandate.guardian)}
            </p>
            <p className="text-[9px] text-zinc-500">Can veto critical hazard changes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
