"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { DragonRadar } from "@/components/DragonRadar";
import { MandateExplorer, DEMO_MANDATES, MandateDemoData } from "@/components/MandateExplorer";
import { SemanticDiffInspector } from "@/components/SemanticDiffInspector";
import { AgentSimulator } from "@/components/AgentSimulator";
import { TransactionCenter } from "@/components/TransactionCenter";
import { Flame, Shield, Activity, ChevronRight } from "lucide-react";
import { DRACO_STUDIO_URL, GENLAYER_STUDIONET_CHAIN_ID } from "@/lib/contract/config";

export default function Home() {
  const [selectedMandate, setSelectedMandate] = useState<MandateDemoData>(DEMO_MANDATES[0]);

  return (
    <div className="min-h-screen bg-[#030407] text-[#f8fafc] selection:bg-rose-500/30 selection:text-rose-200 pb-20">
      {/* Decorative Top Mesh/Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none h-[600px]" />
      
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Dynamic Premium Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-red-950/20 bg-gradient-to-b from-[#0a0b10]/90 to-[#030407]/99 p-8 sm:p-14 shadow-2xl">
          {/* Ambient Glows */}
          <div className="absolute -right-32 -top-32 size-[400px] rounded-full bg-rose-600/5 blur-[120px] pointer-events-none glow-orb" />
          <div className="absolute -left-32 -bottom-32 size-[400px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none glow-orb" />

          <div className="relative max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/10 bg-rose-500/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-rose-400">
              <Flame className="size-3.5 text-rose-500 animate-pulse" />
              <span>StudioNet Active &middot; Chain {GENLAYER_STUDIONET_CHAIN_ID}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] font-sans">
              Autonomous AI Agent<br />
              <span className="bg-gradient-to-r from-rose-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                Capability Charters.
              </span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-zinc-400 font-light max-w-2xl">
              Capability mandates must not silently expand. DracoClause secures natural-language agent parameters 
              through GenLayer multi-validator consensus and guardian challenge windows.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#workspace"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 px-6 py-3 text-xs font-bold text-white shadow-[0_0_30px_rgba(225,29,72,0.25)] transition hover:scale-[1.02]"
              >
                <span>Launch Mandate Workspace</span>
                <ChevronRight className="size-4" />
              </a>

              <a
                href={DRACO_STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-zinc-850 bg-zinc-900/40 px-5 py-3 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-900/80"
              >
                <span>StudioNet RPC & Explorer</span>
              </a>
            </div>
          </div>
        </section>

        {/* Dragon Taxonomy Radar */}
        <DragonRadar />

        {/* Workspace Hub */}
        <div id="workspace" className="space-y-8 pt-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.8)]" />
              <h2 className="text-xl font-extrabold text-white tracking-tight">Sovereign Control Panel</h2>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono tracking-wider uppercase">Decentralized Sentinel v1.0</span>
          </div>

          {/* Mandate selection & full explorer */}
          <MandateExplorer
            selectedMandate={selectedMandate}
            onSelectMandate={setSelectedMandate}
          />
        </div>

        {/* Interactive Diffing and Telemetry Panel */}
        <section className="space-y-6">
          <SemanticDiffInspector mandate={selectedMandate} />
        </section>

        {/* Execution Guard Mock Terminal */}
        <section className="space-y-6">
          <AgentSimulator mandate={selectedMandate} />
        </section>
      </main>

      <TransactionCenter />
    </div>
  );
}
