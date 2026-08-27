"use client";

import React from "react";
import { Header } from "@/components/Header";
import { DragonRadar } from "@/components/DragonRadar";
import { MandateWorkspace } from "@/components/MandateWorkspace";
import { TransactionCenter } from "@/components/TransactionCenter";
import { Flame, ChevronRight } from "lucide-react";
import { DRACO_STUDIO_URL, GENLAYER_STUDIONET_CHAIN_ID } from "@/lib/contract/config";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] selection:bg-rose-100 selection:text-rose-900 pb-20">
      {/* Subtle Light Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none h-[600px]" />
      
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white/70 p-8 sm:p-14 shadow-md">
          <div className="absolute -right-32 -top-32 size-[400px] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />
          <div className="absolute -left-32 -bottom-32 size-[400px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

          <div className="relative max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/10 bg-rose-500/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-rose-600">
              <Flame className="size-3.5 text-rose-500 animate-pulse" />
              <span>StudioNet Active &middot; Chain {GENLAYER_STUDIONET_CHAIN_ID}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 leading-[1.1] font-sans">
              Capability Mandates.<br />
              <span className="bg-gradient-to-r from-rose-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                Dragon-Tier Semantic Guard.
              </span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-zinc-500 font-light max-w-2xl">
              Capability mandates must not silently expand. DracoClause secures natural-language agent parameters 
              through GenLayer multi-validator consensus and guardian challenge windows.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#workspace"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 px-6 py-3 text-xs font-bold text-white shadow-md transition hover:scale-[1.02]"
              >
                <span>Launch Mandate Workspace</span>
                <ChevronRight className="size-4" />
              </a>

              <a
                href={DRACO_STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50"
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
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.5)]" />
              <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Sovereign Control Panel Workspace</h2>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono tracking-wider uppercase">Decentralized Sentinel v1.0</span>
          </div>

          <MandateWorkspace />
        </div>
      </main>

      <TransactionCenter />
    </div>
  );
}
