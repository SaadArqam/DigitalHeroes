'use client';

import { motion } from 'framer-motion';
import { Trophy, Zap, Info, ArrowRight, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

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
    <Card className="relative h-full overflow-hidden !p-0 border-white/10 transition-all hover:border-[#00FFA3]/30">
        <div className="absolute inset-0 bg-[#05070A]" />
        
        {/* Animated Highlights */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-[#00FFA3]/5 rounded-full blur-[100px] pointer-events-none"
        />

        <div className="relative z-10 h-full flex flex-col p-8">
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#0D1117] border border-white/5 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#00FFA3]" />
              </div>
              <div>
                <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-[#8B949E] mb-1">Protocol Phase</span>
                <h2 className="text-xl lg:text-3xl font-black text-white tracking-tighter uppercase leading-none italic">Royal Draw <span className="text-[#00FFA3]">#82</span></h2>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00FFA3]/5 border border-[#00FFA3]/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#00FFA3]">Live Node</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8B949E] flex items-center gap-2">
                  Pool Liquidity <Info className="w-3 h-3" />
                </p>
                <div className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase">
                  ₹{currentPool.toLocaleString()}
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 2, delay: 1, ease: 'easeOut' }}
                    className="h-full bg-[#00FFA3] shadow-[0_0_15px_rgba(0,255,163,0.5)]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8B949E]">Jackpot Target</p>
                <div className="text-4xl lg:text-5xl font-black tracking-tighter text-gradient uppercase">
                  ₹{(currentPool * 0.4).toLocaleString()}
                </div>
                <p className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest leading-none">5-match projection</p>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#8B949E] mb-5 flex items-center gap-2">
                <Zap className="w-3 h-3 text-[#00FFA3] fill-[#00FFA3]" /> Execution Vector
              </p>
              <div className="flex gap-3 flex-wrap">
                {(latestDraw?.winning_numbers || [7, 14, 28, 32, 41, 45]).map((num, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={reveal ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className={`
                      w-11 h-11 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center font-black text-lg relative group transition-all
                      ${userResult?.match_count && i < userResult.match_count 
                        ? 'bg-[#00FFA3] text-[#05070A] shadow-[0_0_20px_rgba(0,255,163,0.4)]' 
                        : 'bg-white/5 border border-white/5 text-white'
                      }
                    `}
                  >
                    {num}
                    {userResult?.match_count && i < userResult.match_count && (
                      <div className="absolute -top-1.5 -right-1.5 bg-white text-emerald-600 rounded-full p-0.5 shadow-lg">
                        <CheckCircle className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full border border-[#05070A] bg-[#0D1117] flex items-center justify-center text-[8px] font-black text-[#8B949E] uppercase">
                    ID-{i}
                  </div>
                ))}
              </div>
              <p className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest">
                <span className="text-white">14.2k</span> PARTICIPANTS
              </p>
            </div>
            
            <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#00FFA3] hover:text-white transition-colors">
              RULES <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
    </Card>
  );
}
