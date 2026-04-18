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
  paid:      { icon: ArrowUpRight, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', label: 'Treasury Paid' },
  completed: { icon: ArrowUpRight, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', label: 'Completed' },
  pending:   { icon: Clock, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', label: 'In Audit' },
  verified:  { icon: History, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', label: 'Verified' },
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
    <Card variant="glass" className="h-full group transition-all hover:shadow-lg hover:-translate-y-1">
        {/* Header */}
        <div className="flex items-start justify-between relative z-10 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-xl tracking-tight leading-none mb-1">Treasury</h3>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Asset Registry</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-card border border-card-border text-white rounded-2xl flex items-center gap-2">
             <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Active Yield</span>
          </div>
        </div>

        {/* Treasury Stats Section */}
        <div className="mb-8 relative z-10">
          <div className="p-8 rounded-[2rem] bg-input-bg border border-input-border shadow-2xl relative overflow-hidden group/box">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-end/10 blur-[50px] -mr-16 -mt-16 pointer-events-none group-hover/box:bg-primary-end/20 transition-colors" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">Portfolio Balance</p>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-8 h-8 text-primary-end" />
                  <h3 className="text-5xl font-black tracking-tighter text-white">
                    {animatedTotal.toLocaleString()}
                  </h3>
                </div>
              </div>
              
              <div className="w-full md:w-auto p-4 rounded-2xl bg-card border border-card-border backdrop-blur-sm">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Awaiting Transfer</p>
                <p className="text-xl font-black text-emerald-500">
                  +₹{animatedPending.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Ledger */}
        <div className="flex-1 overflow-auto space-y-3 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Yield Logs</span>
            <div className="h-[1px] flex-1 bg-card-border" />
          </div>

          <AnimatePresence>
            {safe.length > 0 ? (
              <div className="space-y-3">
                {safe.slice(0, 5).map((result, i) => {
                  const config = STATUS_CONFIG[result.status] || STATUS_CONFIG.pending;
                  const Icon = config.icon;
                  
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group/item flex items-center justify-between p-4 rounded-[1.5rem] bg-card border border-card-border hover:border-primary-start/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-input-bg border border-input-border flex items-center justify-center font-black text-white text-xs shadow-sm">
                          {result.match_count}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white tracking-tight leading-tight">Match Victory</p>
                          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">
                            {new Date(result.date || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-base font-black text-white leading-tight mb-2">₹{Number(result.winnings || 0).toLocaleString()}</p>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${config.color}`}>
                           <Icon className="w-2.5 h-2.5" /> {config.label}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-[2rem] bg-input-bg border-2 border-dashed border-input-border flex items-center justify-center mb-6">
                  <Landmark className="w-8 h-8 text-text-muted" />
                </div>
                <h4 className="font-black text-white text-xl mb-1">Passive Treasury</h4>
                <p className="text-sm text-text-secondary font-bold max-w-[200px] leading-relaxed">Victory assets will materialize after validation.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {safe.length > 0 && (
          <div className="mt-8 pt-6 border-t border-card-border flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Audited Payload</span>
             </div>
             <button className="text-[9px] font-black uppercase tracking-widest text-primary-end hover:text-white transition-colors">Withdraw</button>
          </div>
        )}
    </Card>
  );
}
