import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { monadTestnet } from './monadChain';

export const config = createConfig({
  chains: [monadTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [monadTestnet.id]: http(),
  },
});
