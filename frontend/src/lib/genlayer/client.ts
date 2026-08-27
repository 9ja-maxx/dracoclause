import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';

type ClientConfig = NonNullable<Parameters<typeof createClient>[0]>;
export type BrowserWalletProvider = NonNullable<ClientConfig['provider']>;

export const studioNetChain = {
  ...studionet,
  id: 61999,
  name: 'GenLayer StudioNet',
  rpcUrls: {
    default: { http: ['https://studio.genlayer.com/api'] },
    public: { http: ['https://studio.genlayer.com/api'] },
  },
  nativeCurrency: {
    name: 'GEN',
    symbol: 'GEN',
    decimals: 18,
  },
};

export const readClient = createClient({
  chain: studioNetChain,
});

export function createWriteClient(address: `0x${string}`, provider: BrowserWalletProvider) {
  return createClient({
    chain: studioNetChain,
    account: address,
    provider,
  });
}
