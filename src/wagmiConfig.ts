import { createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

const heliosTestnet = {
  id: 4242,
  name: 'Helios Testnet',
  network: 'helios-testnet',
  nativeCurrency: {
    name: 'Helios',
    symbol: 'HLS',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://testnet1.helioschainlabs.org/']
    },
    public: {
      http: ['https://testnet1.helioschainlabs.org/']
    }
  },
  blockExplorers: {
    default: { name: 'Helios Explorer', url: 'https://explorer.helioschainlabs.org/' }
  },
  testnet: true
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [heliosTestnet],
  [publicProvider()]
);

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains })
  ],
  publicClient,
  webSocketPublicClient
});