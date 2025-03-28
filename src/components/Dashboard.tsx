import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Award, ArrowRight, Share2, Github, Twitter, Clock, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAccount } from 'wagmi';
import { api } from '../services/api';

interface XPHistoryItem {
  _id: string;
  amount: number;
  type: string;
  description: string;
  timestamp: string;
}

interface XPLevelInfo {
  currentLevel: number;
  totalXP: number;
  nextLevelXP: number;
  xpForCurrentLevel: number;
  xpNeededForNextLevel: number;
  progressToNextLevel: number;
  isMaxLevel: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const Dashboard = () => {
  const { address } = useAccount();
  const [xpHistory, setXPHistory] = useState<XPHistoryItem[]>([]);
  const [xpLevelInfo, setXPLevelInfo] = useState<XPLevelInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyResponse, levelResponse] = await Promise.all([
          api.getUserXPHistory(),
          api.getUserXPLevel()
        ]);

        if (historyResponse.success) {
          setXPHistory(historyResponse.xpHistory);
        }
        if (levelResponse.success) {
          setXPLevelInfo({
            currentLevel: levelResponse.currentLevel,
            totalXP: levelResponse.totalXP,
            nextLevelXP: levelResponse.nextLevelXP,
            xpForCurrentLevel: levelResponse.xpForCurrentLevel,
            xpNeededForNextLevel: levelResponse.xpNeededForNextLevel,
            progressToNextLevel: levelResponse.progressToNextLevel,
            isMaxLevel: levelResponse.isMaxLevel
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const shortenedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#040F34] via-[#002DCB] to-[#E2EBFF] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="bg-white rounded-2xl p-8 mb-8 shadow-xl"
          {...fadeInUp}
        >
          <div className="flex items-center gap-6">
            <motion.div 
              className="relative"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-[#002DCB] to-[#0045FF] rounded-full flex items-center justify-center">
                <Sun className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                {xpLevelInfo && (
                  <div className="bg-[#002DCB] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {xpLevelInfo.currentLevel}
                  </div>
                )}
              </div>
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-[#040F34]">{shortenedAddress}</h2>
                <span className="px-3 py-1 bg-[#E2EBFF] text-[#002DCB] rounded-full text-sm font-medium">
                  Level {xpLevelInfo?.currentLevel || 0}
                </span>
              </div>
              
              <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#002DCB] to-[#0045FF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpLevelInfo?.progressToNextLevel || 0}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-[#002DCB] font-medium flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {xpLevelInfo?.totalXP || 0} XP Total
                </span>
                {!xpLevelInfo?.isMaxLevel && (
                  <span className="text-[#5C6584]">
                    {xpLevelInfo?.xpNeededForNextLevel || 0} XP to Level {(xpLevelInfo?.currentLevel || 0) + 1}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* XP History */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-xl"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-[#040F34] mb-4">XP History</h3>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002DCB]"></div>
                </div>
              ) : (
                xpHistory.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 p-3 bg-[#E2EBFF]/20 rounded-lg">
                    <div className="w-10 h-10 bg-[#002DCB]/10 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#002DCB]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[#040F34] font-medium">{item.description}</p>
                      <p className="text-sm text-[#5C6584]">{formatDate(item.timestamp)}</p>
                    </div>
                    <span className="text-[#002DCB] font-bold">+{item.amount} XP</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Next Actions */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-xl"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-[#040F34] mb-4">Daily Missions</h3>
            <div className="space-y-4">
              {[
                { title: 'Bridge assets from another chain', xp: 15, action: 'Bridge' },
                { title: 'Delegate your tokens to a validator', xp: 20, action: 'Stake' },
                { title: 'Vote on a governance proposal', xp: 10, action: 'Vote' }
              ].map((mission, index) => (
                <div key={index} className="p-4 border border-[#E2EBFF] rounded-xl hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-[#040F34]">{mission.title}</h4>
                    <span className="text-sm text-[#002DCB]">+{mission.xp} XP</span>
                  </div>
                  <button className="w-full mt-2 px-4 py-2 bg-[#002DCB] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#0045FF] transition-colors duration-200">
                    {mission.action}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-xl"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-bold text-[#040F34] mb-4">Top Explorers</h3>
            <div className="space-y-4">
              {[
                { address: '0x1a2...3b4c', xp: 250, rank: 1 },
                { address: '0x4d5...6e7f', xp: 180, rank: 2 },
                { address: '0x7g8...9h0i', xp: 150, rank: 3 },
                { address: '0xj1k...2l3m', xp: 120, rank: 4 },
                { address: '0xn4o...5p6q', xp: 100, rank: 5 }
              ].map((explorer, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gradient-to-r from-[#E2EBFF]/20 to-transparent rounded-lg">
                  <div className="w-8 h-8 bg-[#002DCB] rounded-full flex items-center justify-center text-white font-bold">
                    {explorer.rank}
                  </div>
                  <span className="flex-1 font-medium text-[#040F34]">{explorer.address}</span>
                  <span className="text-[#002DCB] font-bold">{explorer.xp} XP</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Badges & Contributor */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-xl"
            {...fadeInUp}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#040F34]">Badges & Contributions</h3>
              <button className="flex items-center gap-2 text-[#002DCB] hover:text-[#0045FF]">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 border border-[#E2EBFF] rounded-xl text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-[#002DCB] to-[#0045FF] rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-medium text-[#040F34]">Early Explorer</h4>
              </div>
              <div className="p-4 border border-[#E2EBFF] rounded-xl text-center opacity-50">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-400">Bridge Master</h4>
              </div>
            </div>

            <div className="p-4 bg-[#E2EBFF]/20 rounded-xl">
              <h4 className="font-medium text-[#040F34] mb-3">Become a Contributor</h4>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-[#002DCB] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#0045FF] transition-colors duration-200">
                  <Github className="w-4 h-4" />
                  GitHub
                </button>
                <button className="flex-1 px-4 py-2 bg-[#002DCB] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#0045FF] transition-colors duration-200">
                  <Twitter className="w-4 h-4" />
                  Twitter
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;