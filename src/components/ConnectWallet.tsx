import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useConnect, useAccount } from 'wagmi';
import { useStore } from '../store/useStore';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import Particles from 'react-particles';
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";
import { Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { ethers } from 'ethers';

const ConnectWallet = () => {
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { setStep, setUser } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

  const signMessage = async (address: string): Promise<string> => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const message = `Welcome to Helios! Please sign this message to verify your wallet ownership.\n\nWallet: ${address}`;
      return signer.signMessage(message);
    } catch (error) {
      console.error('Signing error:', error);
      throw new Error('Failed to sign message');
    }
  };

  const handleSignAndLogin = async (walletAddress: string) => {
    try {
      const signature = await signMessage(walletAddress);
      
      try {
        // Try to register first
        const registerResponse = await api.register(walletAddress, signature);
        setUser(registerResponse.user);
        setStep(2);
      } catch (registerError: any) {
        // If registration fails with 400 (wallet already registered), try login
        if (registerError.message === 'Wallet already registered') {
          const loginResponse = await api.login(walletAddress, signature);
          setUser(loginResponse.user);
          setStep(2);
        } else {
          throw registerError;
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign message or authenticate');
    }
  };

  const handleConnect = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // If already connected, proceed with signing
      if (isConnected && address) {
        await handleSignAndLogin(address);
        return;
      }

      // Connect wallet
      const connector = new MetaMaskConnector();
      const result = await connect({ connector });
      
      if (!result?.account) {
        throw new Error('No account found');
      }

      await handleSignAndLogin(result.account);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#040F34] via-[#002DCB] to-[#E2EBFF]">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            opacity: 0
          },
          fpsLimit: 120,
          particles: {
            color: {
              value: "#ffffff"
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1
            },
            move: {
              enable: true,
              outModes: {
                default: "bounce"
              },
              random: true,
              speed: 1,
              straight: false
            },
            number: {
              density: {
                enable: true,
                area: 800
              },
              value: 80
            },
            opacity: {
              value: 0.3
            },
            shape: {
              type: "circle"
            },
            size: {
              value: { min: 1, max: 3 }
            }
          },
          detectRetina: true
        }}
      />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
              Welcome to the
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#E2EBFF] to-white">
                Helios Testnet
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className={`px-12 py-6 bg-white text-[#002DCB] rounded-full text-xl font-semibold 
                       hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 
                       shadow-[0_0_30px_rgba(226,235,255,0.3)] hover:shadow-[0_0_50px_rgba(226,235,255,0.5)]
                       ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Connecting...' : isConnected ? 'Sign Message' : 'Connect Wallet'}
            </button>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 bg-red-400/10 px-4 py-2 rounded-lg"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;