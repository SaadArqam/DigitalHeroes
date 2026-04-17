'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, TrendingUp, Clock, History, IndianRupee, ArrowUpRight } from 'lucide-react';

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
      const ease = 1 - Math.pow(1 - progress, 5); // easeOutQuint
      setValue(Math.floor(ease * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current!); };
  }, [target, duration]);

  return value;
}

const STATUS_CONFIG: Record<string, { icon: any, color: string, label: string }> = {
  paid:      { icon: ArrowUpRight, color: 'text-emerald-500 bg-emerald-50 border-emerald-100', label: 'Treasury Paid' },
  completed: { icon: ArrowUpRight, color: 'text-emerald-500 bg-emerald-50 border-emerald-100', label: 'Completed' },
  pending:   { icon: Clock, color: 'text-amber-500 bg-amber-50 border-amber-100', label: 'In Audit' },
  verified:  { icon: History, color: 'text-blue-500 bg-blue-50 border-blue-100', label: 'Verified' },
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="h-full group"
    >
      <div className="h-full rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="px-8 pt-10 pb-6 flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform duration-500">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-xl tracking-tight">Royal Treasury</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Asset Management</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-slate-900 text-white rounded-2xl flex items-center gap-2">
             <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
             <span className="text-[9px] font-black uppercase tracking-widest text-white">Active Growth</span>
          </div>
        </div>

        {/* Treasury Stats Section */}
        <div className="px-8 mb-8 relative z-10">
          <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group/box">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] -mr-16 -mt-16 pointer-events-none group-hover/box:bg-indigo-500/20 transition-colors" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Portfolio Balance</p>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-8 h-8 text-indigo-400" />
                  <h3 className="text-5xl font-black tracking-tighter">
                    {animatedTotal.toLocaleString()}
                  </h3>
                </div>
              </div>
              
              <div className="w-full md:w-auto p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Awaiting Transfer</p>
                <p className="text-xl font-black text-indigo-400">
                  +₹{animatedPending.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Ledger */}
        <div className="flex-1 px-8 pb-8 overflow-auto relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Yield Logs</span>
            <div className="h-[1px] flex-1 bg-slate-100" />
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
                      transition={{ delay: i * 0.1 }}
                      className="group/item flex items-center justify-between p-4 rounded-[1.5rem] bg-white border border-slate-50 hover:border-indigo-100 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-700 text-xs shadow-sm group-hover/item:border-indigo-100 transition-colors">
                          {result.match_count}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 tracking-tight leading-tight">Match Victory #{i+1}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {new Date(result.date || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-base font-black text-slate-900 leading-tight mb-1">₹{Number(result.winnings || 0).toLocaleString()}</p>
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
                <div className="w-20 h-20 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mb-6">
                  <Landmark className="w-8 h-8 text-slate-200" />
                </div>
                <h4 className="font-black text-slate-900 text-xl mb-1">Passive Treasury</h4>
                <p className="text-sm text-slate-400 font-medium max-w-[200px] leading-relaxed">Your victory assets will materialize here once the ledger validates your entries.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Premium Footer */}
        {safe.length > 0 && (
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Audited Payout Protocol</span>
             </div>
             <button className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors">Withdraw Assets</button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

const ShieldCheck = ({ className }: any) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
  </svg>
);
