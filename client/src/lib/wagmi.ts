import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, polygon, arbitrum, optimism, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'CodeSync Web3',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '5efe6d37647c829578e722a88d57589e',
  chains: [mainnet, sepolia, polygon, arbitrum, optimism, base],
  ssr: false,
});
