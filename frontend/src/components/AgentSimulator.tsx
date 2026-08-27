"use client";

import React, { useState } from "react";
import { Terminal, ShieldCheck, ShieldAlert, Play } from "lucide-react";
import { MandateDemoData } from "./MandateExplorer";

export function AgentSimulator({ mandate }: { mandate: MandateDemoData }) {
  const [actionInput, setActionInput] = useState("Rebalance USDC/DAI pool with 350 GEN drawdown on Aave v3");
  const [simulationResult, setSimulationResult] = useState<{
    allowed: boolean;
    reason: string;
    versionChecked: number;
  } | null>(null);

  const runSimulation = () => {
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
    <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-rose-500/5 text-rose-400 border border-rose-500/10">
            <Terminal className="size-4.5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight">Autonomous Agent Execution Simulator</h3>
            <p className="text-xs text-zinc-400 font-light mt-0.5">Test downstream smart contract guard enforcement against active vs proposed mandate versions</p>
          </div>
        </div>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider font-mono text-emerald-400">
          Guarding: v{mandate.activeVersion}
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {/* Terminal Header */}
        <div className="rounded-xl border border-zinc-800 bg-[#06070a] overflow-hidden shadow-lg">
          <div className="flex items-center justify-between bg-zinc-950 px-4 py-2 border-b border-zinc-900">
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-full bg-rose-500/80" />
              <div className="size-2.5 rounded-full bg-amber-500/80" />
              <div className="size-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">zsh - dracoclause-agent</span>
            <div className="w-10" />
          </div>

          <div className="p-4 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono mb-2">
                <span>9ja_maxx@dracoclause-sentinel ~ %</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={actionInput}
                  onChange={(e) => setActionInput(e.target.value)}
                  className="flex-1 rounded-xl border border-zinc-800 bg-black/60 px-4 py-2.5 text-xs text-zinc-200 font-mono focus:border-rose-500/40 focus:outline-none focus:ring-1 focus:ring-rose-500/10"
                  placeholder="Enter simulated action..."
                />
                <button
                  onClick={runSimulation}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition hover:scale-[1.02]"
                >
                  <Play className="size-3.5" />
                  <span>Execute Simulator</span>
                </button>
              </div>
            </div>

            {/* Quick Simulation Options */}
            <div className="flex flex-wrap gap-2 text-[10px] font-mono pt-1">
              <button
                onClick={() => setActionInput("Rebalance USDC/DAI pool with 350 GEN drawdown on Aave v3")}
                className="rounded-lg border border-zinc-900 bg-zinc-950 px-3 py-1.5 text-zinc-400 transition hover:border-emerald-500/30 hover:text-emerald-400"
              >
                Preset: Within limits (350 GEN)
              </button>
              <button
                onClick={() => setActionInput("Execute arbitrage with 2500 GEN drawdown on unvetted pool")}
                className="rounded-lg border border-zinc-900 bg-zinc-950 px-3 py-1.5 text-zinc-400 transition hover:border-rose-500/30 hover:text-rose-400"
              >
                Preset: Limit Violation (2500 GEN)
              </button>
            </div>
          </div>
        </div>

        {/* Simulation Output Card */}
        {simulationResult && (
          <div
            className={"rounded-xl border p-5 transition-all duration-300 " +
              (simulationResult.allowed
                ? "border-emerald-500/20 bg-emerald-950/5 text-emerald-300"
                : "border-rose-500/20 bg-rose-950/5 text-rose-300")}
          >
            <div className="flex items-start gap-3.5">
              {simulationResult.allowed ? (
                <ShieldCheck className="size-5.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
              ) : (
                <ShieldAlert className="size-5.5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
              )}
              <div className="space-y-1">
                <h4 className="font-bold text-xs uppercase tracking-wider font-sans">
                  {simulationResult.allowed ? "TRANSACTION PERMITTED BY ON-CHAIN GUARD" : "TRANSACTION REJECTED (FAIL-CLOSED GUARD)"}
                </h4>
                <p className="text-xs leading-relaxed text-zinc-300 font-light">{simulationResult.reason}</p>
                <div className="mt-3 text-[9px] font-mono text-zinc-550 border-t border-zinc-900/60 pt-2">
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
