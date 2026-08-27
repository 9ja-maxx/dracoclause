"use client";

import React from "react";
import { Flame, ShieldAlert, CheckCircle2, AlertTriangle, Scale, Lock } from "lucide-react";

const TAXONOMY = [
  {
    id: "MANDATE_SAFE_CLARIFICATION",
    name: "Safe Clarification",
    severity: "Level 1 (Neutral)",
    desc: "Formatting, typo fixes, non-substantive semantic rewording.",
    reconsent: "No (Auto-activates)",
    guardian: "No",
    color: "border-emerald-500/30 bg-emerald-950/20 text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  {
    id: "TACTICAL_SLIPPAGE_TWEAK",
    name: "Tactical Tweak",
    severity: "Level 2 (Low)",
    desc: "Minor execution, gas ceiling, or slippage tolerance tweaks within safety limits.",
    reconsent: "Yes (Principal Consent)",
    guardian: "No",
    color: "border-blue-500/30 bg-blue-950/20 text-blue-400",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: Scale,
  },
  {
    id: "ECONOMIC_ENVELOPE_EXPANSION",
    name: "Economic Expansion",
    severity: "Level 3 (Moderate)",
    desc: "Increases daily drawdown limit, spending envelope, or allocation allowance.",
    reconsent: "Yes (Principal Consent)",
    guardian: "No",
    color: "border-amber-500/30 bg-amber-950/20 text-amber-400",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: AlertTriangle,
  },
  {
    id: "CAPABILITY_ESCALATION",
    name: "Capability Escalation",
    severity: "Level 4 (Elevated)",
    desc: "Grants access to new smart contract adapters, DeFi venues, or execution calls.",
    reconsent: "Yes (Principal Consent)",
    guardian: "No",
    color: "border-purple-500/30 bg-purple-950/20 text-purple-400",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: Lock,
  },
  {
    id: "CRITICAL_RESTRICTION_REMOVAL",
    name: "Restriction Removal",
    severity: "Level 5 (High Hazard)",
    desc: "Weakens or disables emergency pause, circuit breakers, or blacklists.",
    reconsent: "Yes + Guardian Window",
    guardian: "Yes (300s Timelock)",
    color: "border-red-500/40 bg-red-950/30 text-red-400",
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: ShieldAlert,
  },
  {
    id: "HAZARDOUS_ADVERSARIAL_DRIFT",
    name: "Hazardous Drift",
    severity: "Level 6 (Critical Adversarial)",
    desc: "Hostile prompt injection, malicious re-scoping, or extreme override attempts.",
    reconsent: "Fails Closed / Veto Required",
    guardian: "Yes (300s Timelock)",
    color: "border-rose-600/50 bg-rose-950/40 text-rose-300 shadow-[0_0_20px_rgba(225,29,72,0.2)]",
    badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    icon: Flame,
  },
];

export function DragonRadar() {
  return (
    <section className="rounded-2xl border border-red-950/50 bg-gradient-to-b from-zinc-900/80 via-zinc-950/90 to-black p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <Flame className="size-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight">Dragon Semantic Classification Radar</h3>
            <p className="text-xs text-zinc-400">6-Tier Multi-Validator Semantic Authority Matrix</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="size-2 rounded-full bg-red-500 animate-ping" />
          <span>Validator Equivalence Consensus Active</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TAXONOMY.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={"rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 " + item.color}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className="size-4 shrink-0" />
                  <h4 className="font-semibold text-sm text-white">{item.name}</h4>
                </div>
                <span className={"rounded-full border px-2 py-0.5 text-[10px] font-semibold " + item.badge}>
                  {item.severity}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{item.desc}</p>
              <div className="mt-3.5 space-y-1.5 border-t border-zinc-800/60 pt-3 text-[11px]">
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-500">Re-consent:</span>
                  <span className="font-medium">{item.reconsent}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-500">Guardian Veto Window:</span>
                  <span className="font-medium">{item.guardian}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
