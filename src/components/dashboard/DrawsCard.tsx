'use client';

import { motion } from 'framer-motion';
import { Trophy, Zap, Info, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DrawsCardProps {
  latestDraw?: { winning_numbers: number[]; draw_date: string };
  userResult?: { match_count: number; winnings: number };
  currentPool?: number;
}

export function DrawsCard({ latestDraw, userResult, currentPool = 125000 }: DrawsCardProps = {}) {
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReveal(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.005 }}
      className="h-full group"
    >
      <div className="relative h-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/20">
        {/* Deep Galaxy Gradient */}
        <div className="absolute inset-0 bg-[#0A0D1E]" />
        
        {/* Animated Nebulas */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-16 -left-16 w-[25rem] h-[25rem] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none"
        />

        {/* Gloss Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col p-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center backdrop-blur-xl">
                <Trophy className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/80 mb-1 italic">Royal Lottery Phase</span>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Mega Draw <span className="text-indigo-400">#82</span></h2>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live Pool</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-10">
            {/* Current Pool & Potential */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/60 flex items-center gap-2">
                  Current Draw Pool <Info className="w-3 h-3" />
                </p>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-5xl font-black text-white tracking-tighter"
                >
                  ₹{currentPool.toLocaleString()}
                </motion.div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 2, delay: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/60">Your Potential Win</p>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring' }}
                  className="text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent"
                >
                  ₹{(currentPool * 0.4).toLocaleString()}
                </motion.div>
                <p className="text-[10px] font-bold text-slate-500 italic">Based on 5-match jackpot prediction</p>
              </div>
            </div>

            {/* Lottery Reveal Animation */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60 mb-4 flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-400" /> Latest Winning Sequence
              </p>
              <div className="flex gap-4 flex-wrap">
                {(latestDraw?.winning_numbers || [7, 14, 28, 32, 41]).map((num, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.5, rotate: -45 }}
                    animate={reveal ? { opacity: 1, y: 0, scale: 1, rotate: 0 } : {}}
                    transition={{ 
                      delay: 1 + (i * 0.15), 
                      type: 'spring', 
                      stiffness: 260, 
                      damping: 20 
                    }}
                    className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-2xl relative group
                      ${userResult?.match_count && i < userResult.match_count 
                        ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white border-none scale-110 z-20 shadow-emerald-500/50' 
                        : 'bg-white/5 border border-white/10 text-indigo-100 hover:bg-white/10 transition-colors'
                      }
                    `}
                  >
                    {num}
                    {userResult?.match_count && i < userResult.match_count && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-2 -right-2 bg-white text-emerald-600 rounded-full p-1 shadow-lg"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </motion.div>
                    )}
                    
                    {/* Glow effect for matches */}
                    {userResult?.match_count && i < userResult.match_count && (
                      <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-40 animate-pulse -z-10 rounded-full" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#0A0D1E] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white`}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wide">
                <span className="text-white">14.2k</span> Citizens participating in this cycle
              </p>
            </div>
            
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">
              Draw Rules <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Add missing icon
const CheckCircle = ({ className }: any) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
  </svg>
);
