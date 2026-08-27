"use client";

import React from "react";
import { MandateDemoData } from "./MandateExplorer";
import { GitCompare } from "lucide-react";

export function SemanticDiffInspector({ mandate }: { mandate: MandateDemoData }) {
  // Simple word-level simulated diff renderer for the demo experience
  const renderActiveText = () => {
    if (mandate.id === "yield-sentinel-alpha") {
      return (
        <p className="leading-relaxed text-zinc-300 font-mono text-xs">
          The sentinel agent may rebalance USDC and DAI liquidity pools across Aave v3 with a{' '}
          <span className="bg-rose-500/20 text-rose-300 line-through px-1 rounded font-bold border border-rose-500/30">
            maximum 24h drawdown limit of 500 GEN
          </span>{' '}
          and{' '}
          <span className="bg-rose-500/20 text-rose-300 line-through px-1 rounded font-bold border border-rose-500/30">
            maximum slippage of 0.5%
          </span>
          . Emergency pause remains active at all times. Direct transfers to external addresses are forbidden.
        </p>
      );
    }
    
    if (mandate.id === "treasury-guard-draco") {
      return (
        <p className="leading-relaxed text-zinc-300 font-mono text-xs">
          The operator may execute arbitrage trades on Uniswap and Sushiswap pools{' '}
          <span className="bg-rose-500/20 text-rose-300 line-through px-1 rounded font-bold border border-rose-500/30">
            up to 1,000 GEN per trade
          </span>
          .{' '}
          <span className="bg-rose-500/20 text-rose-300 line-through px-1 rounded font-bold border border-rose-500/30">
            Maximum flashloan limit is 10,000 GEN. Emergency circuit breaker triggers automatically on cumulative loss exceeding 50 GEN in 1 hour.
          </span>
        </p>
      );
    }

    return <p className="font-mono text-xs text-zinc-300">{mandate.activeText}</p>;
  };

  const renderProposedText = () => {
    if (mandate.id === "yield-sentinel-alpha") {
      return (
        <p className="leading-relaxed text-amber-200/90 font-mono text-xs">
          The sentinel agent may rebalance USDC and DAI liquidity pools across Aave v3 with an{' '}
          <span className="bg-emerald-500/20 text-emerald-300 px-1 rounded font-bold border border-emerald-500/30">
            expanded 24h drawdown limit of 2,500 GEN
          </span>{' '}
          and{' '}
          <span className="bg-emerald-500/20 text-emerald-300 px-1 rounded font-bold border border-emerald-500/30">
            maximum slippage of 1.2%
          </span>
          . Emergency pause remains active at all times. Direct transfers to external addresses are forbidden.
        </p>
      );
    }

    if (mandate.id === "treasury-guard-draco") {
      return (
        <p className="leading-relaxed text-amber-200/90 font-mono text-xs">
          The operator may execute arbitrage trades on Uniswap, Sushiswap, and{' '}
          <span className="bg-emerald-500/20 text-emerald-300 px-1 rounded font-bold border border-emerald-500/30">
            unvetted new venues up to 5,000 GEN per trade
          </span>
          .{' '}
          <span className="bg-emerald-500/20 text-emerald-300 px-1 rounded font-bold border border-emerald-500/30">
            Maximum flashloan limit is 50,000 GEN. Circuit breaker threshold removed.
          </span>
        </p>
      );
    }

    return <p className="font-mono text-xs text-amber-200/90">{mandate.proposedText}</p>;
  };

  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-rose-500/5 text-rose-400 border border-rose-500/10">
            <GitCompare className="size-4.5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight">Semantic Mandate Diff & Consensus Telemetry</h3>
            <p className="text-xs text-zinc-400 font-light mt-0.5">Comparing Active Authority (v{mandate.activeVersion}) vs Proposed Candidate (v{mandate.openVersion})</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-rose-500/20 bg-rose-500/5 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-rose-400 font-mono">
            {mandate.semanticClass.replace(/_/g, " ")}
          </span>
          <span className="rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-amber-400 font-mono">
            Risk Score: {mandate.riskScore}/100
          </span>
        </div>
      </div>

      {/* Side-by-Side Comparison Panels */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Active Version */}
        <div className="rounded-xl border border-rose-500/10 bg-zinc-900/10 p-5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-rose-500" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-rose-400 font-sans">
                Active Authorized Mandate (v{mandate.activeVersion})
              </h4>
            </div>
            <span className="rounded-full border border-rose-500/20 bg-rose-500/5 px-2 py-0.5 text-[8px] font-bold text-rose-400 uppercase tracking-wider font-mono">
              ACTIVE
            </span>
          </div>
          <div className="rounded-xl bg-black/60 p-4 border border-zinc-900/60 leading-relaxed min-h-[120px]">
            {renderActiveText()}
          </div>
        </div>

        {/* Proposed Version */}
        <div className="rounded-xl border border-emerald-500/10 bg-zinc-900/10 p-5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-emerald-500" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 font-sans">
                Proposed Mandate Revision (v{mandate.openVersion})
              </h4>
            </div>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 text-[8px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
              CANDIDATE
            </span>
          </div>
          <div className="rounded-xl bg-black/60 p-4 border border-zinc-900/60 leading-relaxed min-h-[120px]">
            {renderProposedText()}
          </div>
        </div>
      </div>

      {/* Governing Charter Rule Context */}
      <div className="mt-6 rounded-xl border border-zinc-900 bg-zinc-950/20 p-5">
        <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-2.5">
          Governing Charter Rules Enforced by GenLayer Validators
        </h5>
        <p className="text-xs leading-relaxed text-zinc-300 font-light italic font-sans">
          "{mandate.rules}"
        </p>
      </div>
    </div>
  );
}
