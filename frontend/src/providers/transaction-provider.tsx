"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { readClient } from "@/lib/genlayer/client";
import { toast } from "sonner";

export interface TrackedTx {
  hash: string;
  title: string;
  mandateId?: string;
  version?: number;
  functionName: string;
  status: "PENDING" | "ACCEPTED" | "FINALIZED_SUCCESS" | "FINALIZED_ERROR";
  timestamp: number;
  errorMessage?: string;
}

interface TransactionContextType {
  transactions: TrackedTx[];
  trackTransaction: (tx: Omit<TrackedTx, "status" | "timestamp">) => void;
  clearTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextType | null>(null);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<TrackedTx[]>([]);

  const trackTransaction = useCallback((txData: Omit<TrackedTx, "status" | "timestamp">) => {
    const newTx: TrackedTx = {
      ...txData,
      status: "PENDING",
      timestamp: Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    toast.loading("Transaction submitted to StudioNet: " + txData.title, { id: txData.hash });
  }, []);

  const clearTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  // Polling transaction receipts
  useEffect(() => {
    const pending = transactions.filter((t) => t.status === "PENDING" || t.status === "ACCEPTED");
    if (pending.length === 0) return;

    const interval = setInterval(async () => {
      for (const tx of pending) {
        try {
          const res: any = await (readClient as any).getTransaction?.({ hash: tx.hash });
          if (!res) continue;
          
          if (res.status === "FINALIZED" || res.statusCode === 7) {
            const isSuccess = res.executionResult === "FINISHED_WITH_RETURN" || res.result === "SUCCESS" || !res.error;
            setTransactions((prev) =>
              prev.map((item) =>
                item.hash === tx.hash
                  ? {
                      ...item,
                      status: isSuccess ? "FINALIZED_SUCCESS" : "FINALIZED_ERROR",
                      errorMessage: isSuccess ? undefined : "Execution error in GenVM",
                    }
                  : item
              )
            );
            if (isSuccess) {
              toast.success("Finalized on StudioNet: " + tx.title, { id: tx.hash });
            } else {
              toast.error("Transaction execution failed: " + tx.title, { id: tx.hash });
            }
          } else if (res.status === "ACCEPTED") {
            setTransactions((prev) =>
              prev.map((item) => (item.hash === tx.hash ? { ...item, status: "ACCEPTED" } : item))
            );
          }
        } catch {
          // Continue polling
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [transactions]);

  return (
    <TransactionContext.Provider value={{ transactions, trackTransaction, clearTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactions must be used inside TransactionProvider");
  return ctx;
}
