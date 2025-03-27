import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import Mascot from './Mascot';
import XPToast from './XPToast';

const TOTAL_STEPS = 5;

const OnboardingFlow = () => {
  const { step, setStep, addXP } = useStore();
  const [showXPToast, setShowXPToast] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const checkNetworkExists = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId === '0x1092') {
        return true;
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1092' }],
      });
      return true;
    } catch (error: any) {
      if (error.code === 4902 || error.code === -32603) {
        return false;
      }
      throw error;
    }
  };

  const handleAddNetwork = async () => {
    try {
      const exists = await checkNetworkExists();
      
      if (!exists) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x1092',
            chainName: 'Helios Testnet',
            nativeCurrency: {
              name: 'Helios',
              symbol: 'HLS',
              decimals: 18
            },
            rpcUrls: ['https://testnet1.helioschainlabs.org/'],
            blockExplorerUrls: ['https://explorer.helioschainlabs.org/']
          }]
        });
      }

      addXP(10);
      setShowXPToast(true);
      setTimeout(() => setShowXPToast(false), 3000);
      setStep(4);
    } catch (error) {
      console.error('Failed to add network:', error);
    }
  };

  const handleClaimTokens = async () => {
    addXP(5);
    setShowXPToast(true);
    setTimeout(() => setShowXPToast(false), 3000);
    setStep(5);
  };

  const handleMintNFT = async () => {
    addXP(5);
    setShowXPToast(true);
    setTimeout(() => setShowXPToast(false), 3000);
    setStep(6);
  };

  React.useEffect(() => {
    setIsTypingComplete(false);
  }, [step]);

  const handleTypingComplete = () => {
    setIsTypingComplete(true);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-[#040F34] via-[#002DCB] to-[#E2EBFF] p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto pt-32">
        {step === 2 && (
          <>
            <Mascot 
              text="Hey, I'm Phaeton, official mascot of Helios — who also happens to be my father ☀️. You've just entered our interchain testnet... and I'm here to guide you through your first steps."
              onTypingComplete={handleTypingComplete}
              currentStep={1}
              totalSteps={TOTAL_STEPS}
            />
            <motion.button
              onClick={() => setStep(3)}
              disabled={!isTypingComplete}
              className={`w-full max-w-md mx-auto px-8 py-4 bg-white text-[#002DCB] rounded-full text-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
                isTypingComplete 
                  ? 'hover:bg-opacity-90 hover:scale-105 hover:shadow-xl' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              whileHover={isTypingComplete ? { scale: 1.05 } : {}}
              whileTap={isTypingComplete ? { scale: 0.95 } : {}}
            >
              Let's Begin
            </motion.button>
          </>
        )}

        {step === 3 && (
          <>
            <Mascot 
              text="Before we light up the sky together, you need to connect to the Helios network. It's EVM-compatible, so MetaMask will work just fine. Ready to ride the chain?"
              onTypingComplete={handleTypingComplete}
              currentStep={2}
              totalSteps={TOTAL_STEPS}
            />
            <motion.button
              onClick={handleAddNetwork}
              disabled={!isTypingComplete}
              className={`w-full max-w-md mx-auto px-8 py-4 bg-white text-[#002DCB] rounded-full text-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
                isTypingComplete 
                  ? 'hover:bg-opacity-90 hover:scale-105 hover:shadow-xl' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              whileHover={isTypingComplete ? { scale: 1.05 } : {}}
              whileTap={isTypingComplete ? { scale: 0.95 } : {}}
            >
              Add Helios Network
            </motion.button>
          </>
        )}

        {step === 4 && (
          <>
            <Mascot 
              text="Every explorer needs some solar fuel. Let me beam some $HLS tokens your way so you can start exploring."
              onTypingComplete={handleTypingComplete}
              currentStep={3}
              totalSteps={TOTAL_STEPS}
            />
            <motion.button
              onClick={handleClaimTokens}
              disabled={!isTypingComplete}
              className={`w-full max-w-md mx-auto px-8 py-4 bg-white text-[#002DCB] rounded-full text-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
                isTypingComplete 
                  ? 'hover:bg-opacity-90 hover:scale-105 hover:shadow-xl' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              whileHover={isTypingComplete ? { scale: 1.05 } : {}}
              whileTap={isTypingComplete ? { scale: 0.95 } : {}}
            >
              Claim from Faucet
            </motion.button>
          </>
        )}

        {step === 5 && (
          <>
            <Mascot 
              text="You've made it through the gates of Helios. To mark your arrival, you've earned a Testnet Explorer badge — minted directly to your wallet."
              onTypingComplete={handleTypingComplete}
              currentStep={4}
              totalSteps={TOTAL_STEPS}
            />
            <motion.button
              onClick={handleMintNFT}
              disabled={!isTypingComplete}
              className={`w-full max-w-md mx-auto px-8 py-4 bg-white text-[#002DCB] rounded-full text-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
                isTypingComplete 
                  ? 'hover:bg-opacity-90 hover:scale-105 hover:shadow-xl' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              whileHover={isTypingComplete ? { scale: 1.05 } : {}}
              whileTap={isTypingComplete ? { scale: 0.95 } : {}}
            >
              Mint Testnet NFT
            </motion.button>
          </>
        )}

        {step === 6 && (
          <>
            <Mascot 
              text="From here, your journey truly begins. Check your XP, explore the network, and rise in the ranks. I'll be watching from above… unless you summon me again 🪐"
              onTypingComplete={handleTypingComplete}
              currentStep={5}
              totalSteps={TOTAL_STEPS}
            />
            <motion.button
              onClick={() => setStep(7)}
              disabled={!isTypingComplete}
              className={`w-full max-w-md mx-auto px-8 py-4 bg-white text-[#002DCB] rounded-full text-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
                isTypingComplete 
                  ? 'hover:bg-opacity-90 hover:scale-105 hover:shadow-xl' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              whileHover={isTypingComplete ? { scale: 1.05 } : {}}
              whileTap={isTypingComplete ? { scale: 0.95 } : {}}
            >
              Enter My Dashboard
            </motion.button>
          </>
        )}
      </div>

      {showXPToast && (
        <XPToast 
          amount={step === 3 ? 10 : 5} 
          message={
            step === 3 ? "Network added successfully!" :
            step === 4 ? "Tokens claimed!" :
            "NFT minted successfully!"
          }
        />
      )}
    </motion.div>
  );
};

export default OnboardingFlow;