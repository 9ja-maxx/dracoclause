import { NextResponse } from "next/server";
import { GENLAYER_STUDIONET_CHAIN_ID, GENLAYER_STUDIONET_RPC, GENLAYER_STUDIONET_NAME } from "@/lib/contract/config";

export async function GET() {
  return NextResponse.json({
    status: "online",
    protocol: "DracoClause",
    network: GENLAYER_STUDIONET_NAME,
    chainId: GENLAYER_STUDIONET_CHAIN_ID,
    rpc: GENLAYER_STUDIONET_RPC,
    timestamp: new Date().toISOString(),
  });
}
