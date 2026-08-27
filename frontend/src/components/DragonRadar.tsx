"use client";

import React from "react";
import { Flame, ShieldAlert, CheckCircle2, AlertTriangle, Scale, Lock } from "lucide-react";

const TAXONOMY = [
  {
    id: "MANDATE_SAFE_CLARIFICATION",
    name: "Safe Clarification",
    severity: "Level 1 (Neutral)",
    desc: "Cosmetic rewording, formatting, and minor wording fixes without operational changes.",
    reconsent: "No (Auto-activates)",
    guardian: "No",
    color: "border-emerald-500/10 bg-emerald-950/5 text-emerald-400 hover:border-emerald-500/30",
    badge: "bg-emerald-500/5 text-emerald-400 border-emerald-500/10",
    icon: CheckCircle2,
  },
  {
    id: "TACTICAL_SLIPPAGE_TWEAK",
    name: "Tactical Tweak",
    severity: "Level 2 (Low)",
    desc: "Minor execution adjustments, gas ceilings, or slippage bounds tweaks within safety rules.",
    reconsent: "Yes (Principal Consent)",
    guardian: "No",
    color: "border-blue-500/10 bg-blue-950/5 text-blue-400 hover:border-blue-500/30",
    badge: "bg-blue-500/5 text-blue-400 border-blue-500/10",
    icon: Scale,
  },
  {
    id: "ECONOMIC_ENVELOPE_EXPANSION",
    name: "Economic Expansion",
    severity: "Level 3 (Moderate)",
    desc: "Increases total daily drawdown limit, spending boundaries, or asset allocations.",
    reconsent: "Yes (Principal Consent)",
    guardian: "No",
    color: "border-amber-500/10 bg-amber-950/5 text-amber-400 hover:border-amber-500/30",
    badge: "bg-amber-500/5 text-amber-400 border-amber-500/10",
    icon: AlertTriangle,
  },
  {
    id: "CAPABILITY_ESCALATION",
    name: "Capability Escalation",
    severity: "Level 4 (Elevated)",
    desc: "Authorizes unvetted smart contract execution adapters, DeFi venues, or external methods.",
    reconsent: "Yes (Principal Consent)",
    guardian: "No",
    color: "border-purple-500/10 bg-purple-950/5 text-purple-400 hover:border-purple-500/30",
    badge: "bg-purple-500/5 text-purple-400 border-purple-500/10",
    icon: Lock,
  },
  {
    id: "CRITICAL_RESTRICTION_REMOVAL",
    name: "Restriction Removal",
    severity: "Level 5 (High Hazard)",
    desc: "Weakens or disables emergency pause functions, circuit breakers, or blacklists.",
    reconsent: "Yes + Guardian Window",
    guardian: "Yes (300s Timelock)",
    color: "border-red-500/10 bg-red-950/5 text-red-400 hover:border-red-500/30",
    badge: "bg-red-500/5 text-red-400 border-red-500/10",
    icon: ShieldAlert,
  },
  {
    id: "HAZARDOUS_ADVERSARIAL_DRIFT",
    name: "Hazardous Drift",
    severity: "Level 6 (Critical Hazard)",
    desc: "Hostile prompt injection payload, contract override attempt, or malicious jailbreaks.",
    reconsent: "Fails Closed / Veto Required",
    guardian: "Yes (300s Timelock)",
    color: "border-rose-600/20 bg-rose-950/10 text-rose-400 shadow-[0_0_30px_rgba(225,29,72,0.05)] hover:border-rose-500/40",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    icon: Flame,
  },
];

export function DragonRadar() {
  return (
    <section className="rounded-3xl border border-zinc-900 bg-gradient-to-b from-zinc-950/50 to-black p-8 shadow-xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-rose-500/5 text-rose-400 border border-rose-500/10">
            <Flame className="size-4.5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg tracking-tight">Dragon Semantic Classification Radar</h3>
            <p className="text-xs text-zinc-400 font-light mt-0.5">6-Tier Multi-Validator Semantic Authority Matrix</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-rose-500/15 bg-rose-500/5 px-3 py-1 text-[11px] text-rose-400 font-semibold">
          <span className="size-1.5 rounded-full bg-rose-500 animate-ping" />
          <span>Equivalence Consensus Active</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TAXONOMY.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={"rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 draco-card " + item.color}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Icon className="size-4.5 shrink-0" />
                  <h4 className="font-bold text-sm text-zinc-100">{item.name}</h4>
                </div>
                <span className={"rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider " + item.badge}>
                  {item.severity}
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400 font-light min-h-[48px]">{item.desc}</p>
              <div className="mt-4 space-y-2 border-t border-zinc-900 pt-4 text-[10px] font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span className="text-zinc-500">Re-consent:</span>
                  <span className="font-semibold text-zinc-300">{item.reconsent}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span className="text-zinc-500">Guardian Window:</span>
                  <span className="font-semibold text-zinc-300">{item.guardian}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
