"use client";

import React from "react";
import { useWallet } from "@/providers/wallet-provider";
import { truncateAddress } from "@/lib/utils";
import { Flame, ExternalLink, Wallet } from "lucide-react";
import { DRACO_STUDIO_URL, GENLAYER_STUDIONET_CHAIN_ID } from "@/lib/contract/config";

export function Header() {
  const { address, isConnected, isStudioNet, isConnecting, connectWallet, disconnectWallet, ensureStudioNet } = useWallet();

  return (
    <header className="sticky top-0 z-40 border-b border-red-950/40 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center rounded-xl border border-red-500/30 bg-gradient-to-br from-red-950/80 via-zinc-900 to-black shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <Flame className="size-5 text-red-500 animate-pulse" />
            <div className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-lg">DracoClause</span>
              <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                StudioNet
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Autonomous Agent Capability Guard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300">
            <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span>Chain ID: {GENLAYER_STUDIONET_CHAIN_ID}</span>
          </div>

          <a
            href={DRACO_STUDIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-red-900/50 hover:bg-zinc-800 hover:text-white"
          >
            <span>Studio</span>
            <ExternalLink className="size-3.5" />
          </a>

          {isConnected ? (
            <div className="flex items-center gap-2">
              {!isStudioNet && (
                <button
                  onClick={ensureStudioNet}
                  className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 transition hover:bg-amber-500/20"
                >
                  Switch to StudioNet
                </button>
              )}
              <button
                onClick={disconnectWallet}
                className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-red-500/50 hover:bg-zinc-800 hover:text-white"
              >
                <div className="size-2 rounded-full bg-emerald-400" />
                <span>{truncateAddress(address || "")}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-gradient-to-r from-red-600 to-amber-600 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] transition hover:from-red-500 hover:to-amber-500 disabled:opacity-50"
            >
              <Wallet className="size-3.5" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
