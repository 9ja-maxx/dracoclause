"use client";

import React from "react";
import { useTransactions, TrackedTx } from "@/providers/transaction-provider";
import { CheckCircle2, Clock, XCircle, ExternalLink, Trash2 } from "lucide-react";
import { DRACO_STUDIO_URL } from "@/lib/contract/config";

export function TransactionCenter() {
  const { transactions, clearTransactions } = useTransactions();

  if (transactions.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-2xl">
      <div className="mb-3 flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-red-500 animate-pulse" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-200">StudioNet Transactions</h4>
        </div>
        <button
          onClick={clearTransactions}
          className="text-zinc-500 transition hover:text-zinc-300"
          title="Clear transaction history"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1 text-xs">
        {transactions.map((tx: TrackedTx) => (
          <div
            key={tx.hash}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3 transition hover:border-zinc-700"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium text-white">{tx.title}</span>
              {tx.status === "PENDING" && (
                <span className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                  <Clock className="size-3 animate-spin" /> Pending
                </span>
              )}
              {tx.status === "ACCEPTED" && (
                <span className="flex items-center gap-1 text-[11px] text-blue-400 font-medium">
                  <Clock className="size-3" /> Accepted
                </span>
              )}
              {tx.status === "FINALIZED_SUCCESS" && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="size-3" /> Finalized
                </span>
              )}
              {tx.status === "FINALIZED_ERROR" && (
                <span className="flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                  <XCircle className="size-3" /> Failed
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="font-mono">{tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}</span>
              <a
                href={DRACO_STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-red-400 hover:underline"
              >
                <span>Explorer</span>
                <ExternalLink className="size-2.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
