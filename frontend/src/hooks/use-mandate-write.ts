"use client";

import { DRACO_CLAUSE_ADDRESS } from "@/lib/contract/config";
import { useTransactions } from "@/providers/transaction-provider";
import { useWallet } from "@/providers/wallet-provider";
import { useCallback } from "react";
import { toast } from "sonner";

export type MandateFunctionName =
  | "create_mandate"
  | "propose_mandate_version"
  | "review_mandate_version"
  | "consent_to_mandate"
  | "finalize_guardian_challenge"
  | "veto_mandate"
  | "reject_mandate"
  | "recover_expired_mandate";

interface SubmitMandateWriteArgs {
  functionName: MandateFunctionName;
  args: any[];
  title: string;
  mandateId?: string;
  version?: number;
}

export function useMandateWrite() {
  const { address, isConnected, prepareWriteClient } = useWallet();
  const { trackTransaction } = useTransactions();

  const submitMandateWrite = useCallback(
    async ({ functionName, args, title, mandateId, version }: SubmitMandateWriteArgs) => {
      if (!isConnected || !address) {
        const msg = "Please connect your Web3 wallet on GenLayer StudioNet.";
        toast.error(msg);
        throw new Error(msg);
      }

      try {
        const client = await prepareWriteClient();
        const hash = await client.writeContract({
          address: DRACO_CLAUSE_ADDRESS,
          functionName,
          args,
          value: BigInt(0),
        });

        trackTransaction({
          hash,
          title,
          functionName,
          mandateId,
          version,
        });

        return hash;
      } catch (err: any) {
        const msg = err?.message || "Failed to execute mandate transaction on StudioNet";
        toast.error(msg);
        throw err;
      }
    },
    [address, isConnected, prepareWriteClient, trackTransaction]
  );

  return {
    canWrite: isConnected,
    submitMandateWrite,
  };
}
