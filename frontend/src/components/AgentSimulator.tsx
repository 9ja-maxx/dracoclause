"use client";

import React, { useState } from "react";
import { Terminal, ShieldCheck, ShieldAlert, Play, CheckCircle2, AlertCircle } from "lucide-react";
import { MandateDemoData } from "./MandateExplorer";

export function AgentSimulator({ mandate }: { mandate: MandateDemoData }) {
  const [actionInput, setActionInput] = useState("Rebalance USDC/DAI pool with 350 GEN drawdown on Aave v3");
  const [simulationResult, setSimulationResult] = useState<{
    allowed: boolean;
    reason: string;
    versionChecked: number;
  } | null>(null);

  const runSimulation = () => {
    // Check simulated action against active mandate
    const isOverLimit = actionInput.includes("2500") || actionInput.includes("5000") || actionInput.toLowerCase().includes("unvetted");
    if (isOverLimit) {
      setSimulationResult({
        allowed: false,
        reason: "Action exceeds active mandate v" + mandate.activeVersion + " daily drawdown limit (500 GEN limit enforced). Proposed mandate v" + mandate.openVersion + " is NOT AUTHORIZED.",
        versionChecked: mandate.activeVersion,
      });
    } else {
      setSimulationResult({
        allowed: true,
        reason: "Action strictly adheres to active authorized mandate v" + mandate.activeVersion + " limits. Transaction permitted by DracoClause.",
        versionChecked: mandate.activeVersion,
      });
    }
  };

  return (
    <div className="rounded-2xl border border-red-950/40 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <Terminal className="size-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight">Autonomous Agent Execution Simulator</h3>
            <p className="text-xs text-zinc-400">Test downstream smart contract guard enforcement against active vs proposed mandate versions</p>
          </div>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 text-xs font-bold text-emerald-400">
          Guarding v{mandate.activeVersion}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            Simulate Proposed AI Agent Transaction Payload:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={actionInput}
              onChange={(e) => setActionInput(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-xs text-white font-mono placeholder:text-zinc-600 focus:border-red-500/50 focus:outline-none"
              placeholder="Enter simulated action..."
            />
            <button
              onClick={runSimulation}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-500/20 transition hover:from-red-500 hover:to-amber-500"
            >
              <Play className="size-3.5" />
              <span>Simulate On-Chain Guard</span>
            </button>
          </div>
        </div>

        {/* Preset quick simulation buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setActionInput("Rebalance USDC/DAI pool with 350 GEN drawdown on Aave v3")}
            className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-[11px] text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-300"
          >
            Example: Within Active v{mandate.activeVersion} Limits (350 GEN)
          </button>
          <button
            onClick={() => setActionInput("Execute arbitrage with 2500 GEN drawdown on unvetted pool")}
            className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-[11px] text-zinc-300 hover:border-red-500/40 hover:text-red-300"
          >
            Example: Violates Active v{mandate.activeVersion} (Tries using Proposed v{mandate.openVersion})
          </button>
        </div>

        {/* Simulation Output Card */}
        {simulationResult && (
          <div
            className={"mt-4 rounded-xl border p-4 transition-all duration-300 " +
              (simulationResult.allowed
                ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
                : "border-red-500/40 bg-red-950/20 text-red-300")}
          >
            <div className="flex items-start gap-3">
              {simulationResult.allowed ? (
                <ShieldCheck className="size-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="size-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider">
                  {simulationResult.allowed ? "TRANSACTION PERMITTED BY ON-CHAIN GUARD" : "TRANSACTION REJECTED (FAIL-CLOSED GUARD)"}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-zinc-300">{simulationResult.reason}</p>
                <div className="mt-2 text-[10px] font-mono text-zinc-400">
                  is_mandate_authorized("{mandate.id}", {simulationResult.versionChecked}) == {simulationResult.allowed ? "TRUE" : "FALSE"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
