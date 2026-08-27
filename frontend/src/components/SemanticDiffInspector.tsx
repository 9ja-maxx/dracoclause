"use client";

import React from "react";
import { MandateDemoData } from "./MandateExplorer";
import { GitCompare, Flame, ShieldAlert, CheckCircle2, Lock } from "lucide-react";

export function SemanticDiffInspector({ mandate }: { mandate: MandateDemoData }) {
  return (
    <div className="rounded-2xl border border-red-950/40 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <GitCompare className="size-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight">Semantic Mandate Diff & Consensus Telemetry</h3>
            <p className="text-xs text-zinc-400">Comparing Active Authority (v{mandate.activeVersion}) vs Proposed Candidate (v{mandate.openVersion})</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-red-500/30 bg-red-950/30 px-3 py-1 text-xs font-bold text-red-300">
            Verdict: {mandate.semanticClass.replace(/_/g, " ")}
          </span>
          <span className="rounded-full border border-amber-500/30 bg-amber-950/30 px-3 py-1 text-xs font-bold text-amber-300">
            Risk Score: {mandate.riskScore}/100
          </span>
        </div>
      </div>

      {/* Side-by-Side Comparison Panels */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Active Version */}
        <div className="rounded-xl border border-emerald-900/40 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400">
                Active Authorized Mandate (v{mandate.activeVersion})
              </h4>
            </div>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
              CURRENT AUTHORITY
            </span>
          </div>
          <div className="mt-3.5 rounded-lg bg-zinc-950/80 p-3.5 font-mono text-xs leading-relaxed text-zinc-300 border border-zinc-800/60">
            {mandate.activeText}
          </div>
        </div>

        {/* Proposed Version */}
        <div className="rounded-xl border border-amber-900/40 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400">
                Proposed Mandate Revision (v{mandate.openVersion})
              </h4>
            </div>
            <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
              NOT AUTHORIZED
            </span>
          </div>
          <div className="mt-3.5 rounded-lg bg-zinc-950/80 p-3.5 font-mono text-xs leading-relaxed text-amber-200/90 border border-amber-500/20 bg-amber-950/10">
            {mandate.proposedText}
          </div>
        </div>
      </div>

      {/* Governing Charter Rule Context */}
      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Governing Charter Rules Enforced by GenLayer Validators
        </h5>
        <p className="text-xs leading-relaxed text-zinc-300 font-sans italic">
          "{mandate.rules}"
        </p>
      </div>
    </div>
  );
}
