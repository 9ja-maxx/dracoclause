"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { BrowserWalletProvider, createWriteClient } from "@/lib/genlayer/client";
import { GENLAYER_STUDIONET_CHAIN_ID, GENLAYER_STUDIONET_RPC, GENLAYER_STUDIONET_NAME, GENLAYER_SYMBOL } from "@/lib/contract/config";
import { toast } from "sonner";

interface WalletContextType {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isStudioNet: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  ensureStudioNet: () => Promise<void>;
  prepareWriteClient: () => Promise<any>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isStudioNet = chainId === GENLAYER_STUDIONET_CHAIN_ID;
  const isConnected = Boolean(address);

  const updateAccountAndChain = useCallback(async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) return;
    try {
      const accounts = (await (window as any).ethereum.request({ method: "eth_accounts" })) as string[];
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      } else {
        setAddress(null);
      }
      const rawChainId = (await (window as any).ethereum.request({ method: "eth_chainId" })) as string;
      setChainId(parseInt(rawChainId, 16));
    } catch {
      // Ignored
    }
  }, []);

  useEffect(() => {
    updateAccountAndChain();
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        setAddress(accounts.length > 0 ? accounts[0] : null);
      };
      const handleChainChanged = (rawChainId: string) => {
        setChainId(parseInt(rawChainId, 16));
      };
      (window as any).ethereum.on?.("accountsChanged", handleAccountsChanged);
      (window as any).ethereum.on?.("chainChanged", handleChainChanged);
      return () => {
        (window as any).ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
        (window as any).ethereum.removeListener?.("chainChanged", handleChainChanged);
      };
    }
  }, [updateAccountAndChain]);

  const ensureStudioNet = useCallback(async () => {
    if (!(window as any).ethereum) {
      toast.error("No Web3 wallet detected. Please install Metamask or an EIP-1193 compatible wallet.");
      return;
    }
    const hexChain = "0x" + GENLAYER_STUDIONET_CHAIN_ID.toString(16);
    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChain }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: hexChain,
                chainName: GENLAYER_STUDIONET_NAME,
                rpcUrls: [GENLAYER_STUDIONET_RPC],
                nativeCurrency: { name: GENLAYER_SYMBOL, symbol: GENLAYER_SYMBOL, decimals: 18 },
              },
            ],
          });
        } catch {
          toast.error("Could not add GenLayer StudioNet network to wallet.");
        }
      } else {
        toast.error("Failed to switch to GenLayer StudioNet.");
      }
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!(window as any).ethereum) {
      toast.error("Please install an EIP-1193 compatible browser wallet.");
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = (await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        toast.success("Wallet connected to StudioNet");
      }
      await updateAccountAndChain();
    } catch (err: any) {
      toast.error(err?.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, [updateAccountAndChain]);

  const disconnectWallet = useCallback(() => {
    setAddress(null);
    toast.info("Wallet disconnected");
  }, []);

  const prepareWriteClient = useCallback(async () => {
    if (!address || !(window as any).ethereum) {
      throw new Error("Wallet is not connected");
    }
    if (!isStudioNet) {
      await ensureStudioNet();
    }
    return createWriteClient(address as any, (window as any).ethereum as BrowserWalletProvider);
  }, [address, isStudioNet, ensureStudioNet]);

  return (
    <WalletContext.Provider
      value={{
        address,
        chainId,
        isConnected,
        isStudioNet,
        isConnecting,
        connectWallet,
        disconnectWallet,
        ensureStudioNet,
        prepareWriteClient,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
