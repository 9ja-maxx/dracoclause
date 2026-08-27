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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-red-500/30 selection:text-red-200">
        <WalletProvider>
          <TransactionProvider>
            {children}
            <Toaster position="top-right" richColors theme="dark" />
          </TransactionProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
