import React from 'react';
import { motion } from 'framer-motion';
import { useConnect } from 'wagmi';
import { useStore } from '../store/useStore';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import Particles from 'react-particles';
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";
import { Sparkles } from 'lucide-react';

const ConnectWallet = () => {
  const { connect } = useConnect();
  const setStep = useStore((state) => state.setStep);

  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

  const handleConnect = async () => {
    try {
      const connector = new MetaMaskConnector();
      await connect({ connector });
      setStep(2);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
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
          >
            <button
              onClick={handleConnect}
              className="px-12 py-6 bg-white text-[#002DCB] rounded-full text-xl font-semibold 
                       hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 
                       shadow-[0_0_30px_rgba(226,235,255,0.3)] hover:shadow-[0_0_50px_rgba(226,235,255,0.5)]"
            >
              Connect Wallet
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;