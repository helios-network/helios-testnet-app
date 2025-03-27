import React from 'react';
import { WagmiConfig } from 'wagmi';
import { config } from './wagmiConfig';
import { useStore } from './store/useStore';
import ConnectWallet from './components/ConnectWallet';
import OnboardingFlow from './components/OnboardingFlow';
import Dashboard from './components/Dashboard';

function App() {
  const step = useStore((state) => state.step);

  return (
    <WagmiConfig config={config}>
      {step === 0 && <ConnectWallet />}
      {step >= 2 && step <= 6 && <OnboardingFlow />}
      {step === 7 && <Dashboard />}
    </WagmiConfig>
  );
}

export default App;