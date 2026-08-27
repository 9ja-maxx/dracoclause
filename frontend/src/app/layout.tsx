import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/providers/wallet-provider";
import { TransactionProvider } from "@/providers/transaction-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "DracoClause — Autonomous AI Agent Capability Charter & Semantic Guard",
  description: "On-chain semantic control plane for AI agents on GenLayer StudioNet (Chain ID 61999)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8fafc] text-zinc-950 antialiased selection:bg-rose-100 selection:text-rose-900">
        <WalletProvider>
          <TransactionProvider>
            {children}
            <Toaster position="top-right" richColors theme="light" />
          </TransactionProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
