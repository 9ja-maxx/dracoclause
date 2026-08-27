"use client";

import React, { useState } from "react";
import { truncateAddress } from "@/lib/utils";
import { ShieldCheck, Flame, ChevronRight, User, Key, Lock, CheckCircle, AlertTriangle, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";
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
    <div className="space-y-6">
      {/* Mandate Selection List */}
      <div className="grid gap-4 md:grid-cols-2">
        {DEMO_MANDATES.map((m) => {
          const isSelected = m.id === selectedMandate.id;
          return (
            <div
              key={m.id}
              onClick={() => onSelectMandate(m)}
              className={"cursor-pointer rounded-2xl border p-5 transition-all duration-300 " + 
                (isSelected
                  ? "border-red-500/60 bg-gradient-to-br from-red-950/40 via-zinc-900/90 to-zinc-950 shadow-[0_0_30px_rgba(239,68,68,0.15)] ring-1 ring-red-500/40"
                  : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70")}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Flame className={"size-4 " + (isSelected ? "text-red-400 animate-pulse" : "text-zinc-500")} />
                    <h4 className="font-bold text-white text-base">{m.name}</h4>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">ID: <span className="font-mono text-zinc-300">{m.id}</span></p>
                </div>
                <span
                  className={"rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider " +
                    (m.status === "AWAITING_CONSENT"
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      : "border-red-500/30 bg-red-500/10 text-red-400 animate-pulse")}
                >
                  {m.status.replace(/_/g, " ")}
                </span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-zinc-400 line-clamp-2">{m.description}</p>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-zinc-800/60 pt-3 text-[11px]">
                <div className="rounded-lg bg-zinc-950/60 p-2 border border-zinc-800/40">
                  <span className="text-zinc-500 block">Active Version</span>
                  <span className="font-bold text-emerald-400 text-sm">v{m.activeVersion} (Authorized)</span>
                </div>
                <div className="rounded-lg bg-zinc-950/60 p-2 border border-zinc-800/40">
                  <span className="text-zinc-500 block">Proposed Candidate</span>
                  <span className="font-bold text-amber-400 text-sm">v{m.openVersion} (Locked)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Selected Mandate Full Dossier */}
      <div className="rounded-2xl border border-red-950/40 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-red-500" />
              <h3 className="text-lg font-bold text-white tracking-tight">{selectedMandate.name}</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">On-Chain Governance & Authority Dossier</p>
          </div>

          <div className="flex items-center gap-2">
            {selectedMandate.status === "AWAITING_CONSENT" && (
              <button
                onClick={() => handleConsent(selectedMandate)}
                disabled={isProcessing || !canWrite}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-500/20 transition hover:from-red-500 hover:to-amber-500 disabled:opacity-50"
              >
                <Sparkles className="size-3.5" />
                <span>Authorize Consent (Principal)</span>
              </button>
            )}

            {selectedMandate.status === "IN_GUARDIAN_CHALLENGE" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVeto(selectedMandate)}
                  disabled={isProcessing || !canWrite}
                  className="flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-950/50 px-4 py-2 text-xs font-bold text-red-200 transition hover:bg-red-900/60 disabled:opacity-50"
                >
                  <ShieldAlert className="size-3.5 text-red-400" />
                  <span>Execute Guardian Veto</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Roles Breakdown */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3.5">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
              <User className="size-3.5 text-emerald-400" />
              <span>Principal (Owner)</span>
            </div>
            <p className="mt-1 font-mono text-xs font-semibold text-zinc-200">{truncateAddress(selectedMandate.principal)}</p>
            <p className="mt-1 text-[10px] text-zinc-500">Holds sole re-consent authority</p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3.5">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
              <Key className="size-3.5 text-blue-400" />
              <span>Delegate (Proposer)</span>
            </div>
            <p className="mt-1 font-mono text-xs font-semibold text-zinc-200">{truncateAddress(selectedMandate.delegate)}</p>
            <p className="mt-1 text-[10px] text-zinc-500">Permitted to propose revisions</p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3.5">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
              <Lock className="size-3.5 text-amber-400" />
              <span>Guardian (Sentinel)</span>
            </div>
            <p className="mt-1 font-mono text-xs font-semibold text-zinc-200">{truncateAddress(selectedMandate.guardian)}</p>
            <p className="mt-1 text-[10px] text-zinc-500">Can veto critical hazard changes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
