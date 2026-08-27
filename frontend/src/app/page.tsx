"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { DragonRadar } from "@/components/DragonRadar";
import { MandateExplorer, DEMO_MANDATES, MandateDemoData } from "@/components/MandateExplorer";
import { SemanticDiffInspector } from "@/components/SemanticDiffInspector";
import { TransactionCenter } from "@/components/TransactionCenter";
import { Flame, Shield, Sparkles, Terminal, Activity, ArrowRight } from "lucide-react";
import { DRACO_STUDIO_URL, GENLAYER_STUDIONET_CHAIN_ID } from "@/lib/contract/config";

export default function Home() {
  const [selectedMandate, setSelectedMandate] = useState<MandateDemoData>(DEMO_MANDATES[0]);

  return (
    <div className="min-h-screen bg-[#08090c] text-zinc-100 selection:bg-red-500/30 selection:text-red-200">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-red-950/60 bg-gradient-to-b from-red-950/20 via-zinc-900/60 to-black p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="absolute -right-20 -top-20 size-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 size-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-red-400">
              <Flame className="size-3.5 animate-pulse text-red-400" />
              <span>StudioNet Deployment &middot; Chain {GENLAYER_STUDIONET_CHAIN_ID}</span>
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Capability Mandates.<br />
              <span className="bg-gradient-to-r from-red-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Dragon-Tier Semantic Guard.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-zinc-300">
              When autonomous AI agents evolve their operating policies, consent must not silently drift.
              DracoClause binds agent permissions to on-chain GenLayer multi-validator equivalence consensus
              and guardian challenge windows.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#explorer"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(239,68,68,0.3)] transition hover:from-red-500 hover:to-amber-500 hover:scale-[1.02]"
              >
                <span>Explore Mandate Control Plane</span>
                <ArrowRight className="size-4" />
              </a>

              <a
                href={DRACO_STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800"
              >
                <span>StudioNet RPC & Explorer</span>
              </a>
            </div>
          </div>
        </section>

        {/* Dragon Semantic Radar */}
        <DragonRadar />

        {/* Interactive Mandate Explorer */}
        <section id="explorer" className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Shield className="size-5 text-red-500" />
              <h2 className="text-xl font-bold text-white tracking-tight">Live Mandate Workspace</h2>
            </div>
            <span className="text-xs text-zinc-400 font-mono">Fail-Closed Invariant Active</span>
          </div>

          <MandateExplorer
            selectedMandate={selectedMandate}
            onSelectMandate={setSelectedMandate}
          />
        </section>

        {/* Semantic Diff & Inspector */}
        <section className="space-y-6">
          <SemanticDiffInspector mandate={selectedMandate} />
        </section>
      </main>

      <TransactionCenter />

      {/* Footer */}
      <footer className="mt-20 border-t border-zinc-900 bg-black/80 py-8 text-center text-xs text-zinc-500">
        <p>DracoClause &middot; Autonomous AI Agent Capability Charter & Semantic Guard &middot; GenLayer StudioNet (Chain ID: 61999)</p>
      </footer>
    </div>
  );
}
