'use client';

import { motion } from 'framer-motion';
import { Trophy, Zap, Info, ArrowRight, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    <Card variant="default" className="relative h-full overflow-hidden !p-0 border-card-border" hoverable>
        {/* Deep Galaxy Gradient */}
        <div className="absolute inset-0 bg-[#0A0D1E]" />
        
        {/* Animated Nebulas */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-[30rem] h-[30rem] bg-primary-start/10 rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-16 -left-16 w-[25rem] h-[25rem] bg-primary-end/10 rounded-full blur-[100px] pointer-events-none"
        />

        <div className="relative z-10 h-full flex flex-col p-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                <Trophy className="w-6 h-6 text-primary-start" />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-1 italic">Royal Lottery Phase</span>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Mega Draw <span className="text-primary-end">#82</span></h2>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live Pool</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-10">
            {/* Current Pool & Potential */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted flex items-center gap-2">
                  Current Draw Pool <Info className="w-3 h-3" />
                </p>
                <div className="text-5xl font-black text-white tracking-tighter">
                  ₹{currentPool.toLocaleString()}
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 2, delay: 1, ease: 'easeOut' }}
                    className="h-full bg-primary-gradient shadow-glow"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Target Probability</p>
                <div className="text-5xl font-black tracking-tighter text-gradient">
                  ₹{(currentPool * 0.4).toLocaleString()}
                </div>
                <p className="text-[10px] font-bold text-text-muted italic">Based on 5-match jackpot prediction</p>
              </div>
            </div>

            {/* Lottery Reveal Animation */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-6 flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" /> Latest Winning Sequence
              </p>
              <div className="flex gap-4 flex-wrap">
                {(latestDraw?.winning_numbers || [7, 14, 28, 32, 41]).map((num, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.5 }}
                    animate={reveal ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ 
                      delay: 0.5 + (i * 0.15), 
                      type: 'spring', 
                      stiffness: 260, 
                      damping: 20 
                    }}
                    className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-2xl relative group
                      ${userResult?.match_count && i < userResult.match_count 
                        ? 'bg-primary-gradient text-white border-none scale-110 z-20 shadow-glow' 
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors'
                      }
                    `}
                  >
                    {num}
                    {userResult?.match_count && i < userResult.match_count && (
                      <div className="absolute -top-2 -right-2 bg-white text-emerald-600 rounded-full p-1 shadow-lg">
                        <CheckCircle className="w-3 h-3" />
                      </div>
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
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#0A0D1E] bg-input-bg flex items-center justify-center text-[10px] font-bold text-white`}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-bold text-text-muted tracking-wide">
                <span className="text-white">14.2k</span> Citizens participating
              </p>
            </div>
            
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary-end hover:text-white transition-colors">
              Protocol Rules <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
    </Card>
  );
}
