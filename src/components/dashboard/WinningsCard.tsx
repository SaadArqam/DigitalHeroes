'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, TrendingUp, Clock, History, IndianRupee, ArrowUpRight, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DrawResult {
  id: string;
  winnings: number;
  match_count: number;
  date: string;
  status: string;
}

function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 5); 
      setValue(Math.floor(ease * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current!); };
  }, [target, duration]);

  return value;
}

const STATUS_CONFIG: Record<string, { icon: any, color: string, label: string }> = {
  paid:      { icon: ArrowUpRight, color: 'text-[#00FFA3] bg-[#00FFA3]/5 border-[#00FFA3]/20', label: 'Paid' },
  completed: { icon: ArrowUpRight, color: 'text-[#00FFA3] bg-[#00FFA3]/5 border-[#00FFA3]/20', label: 'Settled' },
  pending:   { icon: Clock, color: 'text-amber-500 bg-amber-500/5 border-amber-500/20', label: 'Audit' },
  verified:  { icon: History, color: 'text-[#7C3AED] bg-[#7C3AED]/5 border-[#7C3AED]/20', label: 'Verified' },
};

export function WinningsCard({ results }: { results: DrawResult[] }) {
  const safe = results || [];

  const totalWon = safe
    .filter(r => r.status === 'paid' || r.status === 'completed')
    .reduce((a, b) => a + Number(b.winnings || 0), 0);

  const pendingTotal = safe
    .filter(r => r.status === 'pending' || r.status === 'verified')
    .reduce((a, b) => a + Number(b.winnings || 0), 0);

  const animatedTotal = useCountUp(totalWon);
  const animatedPending = useCountUp(pendingTotal);

  return (
    <Card className="p-6 h-full flex flex-col group transition-all hover:border-[#00FFA3]/30">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#05070A] border border-white/5 flex items-center justify-center text-[#00FFA3] shadow-inner group-hover:scale-110 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg tracking-tight uppercase leading-none mb-1">Treasury</h3>
              <p className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest leading-none">Asset Registry</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-[#00FFA3]/5 border border-[#00FFA3]/20 rounded-lg flex items-center gap-2">
             <TrendingUp className="w-3 h-3 text-[#00FFA3]" />
             <span className="text-[8px] font-black uppercase tracking-widest text-[#00FFA3]">Yield</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="p-6 rounded-xl bg-[#05070A]/50 border border-white/5 relative overflow-hidden">
            <div className="flex flex-col gap-4 relative z-10">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8B949E] mb-2 leading-none">Net Balance</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-black text-[#8B949E]">₹</span>
                  <h3 className="text-4xl font-black tracking-tighter text-white uppercase">
                    {animatedTotal.toLocaleString()}
                  </h3>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <p className="text-[8px] font-black uppercase tracking-widest text-[#8B949E] mb-1.5 leading-none">Pending Protocol</p>
                <p className="text-lg font-black text-[#00FFA3] uppercase tracking-tighter">
                  +₹{animatedPending.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <AnimatePresence>
            {safe.length > 0 ? (
              <div className="space-y-2">
                {safe.slice(0, 3).map((result) => {
                  const config = STATUS_CONFIG[result.status] || STATUS_CONFIG.pending;
                  const Icon = config.icon;
                  
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#05070A] border border-white/5 flex items-center justify-center font-black text-white text-[10px]">
                          {result.match_count}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase tracking-tight leading-none mb-1">Match</p>
                          <p className="text-[8px] text-[#8B949E] font-black uppercase tracking-widest">
                            {new Date(result.date || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-black text-white uppercase leading-none mb-2 tracking-tighter">₹{Number(result.winnings || 0).toLocaleString()}</p>
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest border ${config.color}`}>
                           <Icon className="w-2.5 h-2.5" /> {config.label}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center opacity-20">
                <Landmark className="w-8 h-8 text-[#8B949E] mb-3" />
                <p className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest">No assets logged</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {safe.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-[#00FFA3]" />
                <span className="text-[8px] font-black uppercase tracking-widest text-[#8B949E]">Verified Node</span>
             </div>
             <button className="text-[8px] font-black uppercase tracking-widest text-[#00FFA3] hover:text-white transition-colors">Withdraw</button>
          </div>
        )}
    </Card>
  );
}
