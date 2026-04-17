'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface DrawResult {
  id: string;
  winnings: number;
  match_count: number;
  date: string;
  status: string;
}

function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      setValue(Math.round(ease * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);

  return value;
}

const STATUS_STYLES: Record<string, string> = {
  paid:      'bg-emerald-50 text-emerald-600 border-emerald-100',
  completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  pending:   'bg-amber-50 text-amber-600 border-amber-100',
  verified:  'bg-blue-50 text-blue-600 border-blue-100',
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
      className="h-full"
    >
      <div className="h-full rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base tracking-tight">Treasury</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Prize winnings</p>
            </div>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-full border border-emerald-100">Earnings</span>
        </div>

        {/* Stats */}
        <div className="px-7 py-5 grid grid-cols-2 gap-4 border-b border-slate-50">
          <div className="p-4 rounded-2xl bg-slate-900">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Won</p>
            <p className="text-2xl font-black text-white leading-none">
              ₹{animatedTotal.toLocaleString()}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <p className="text-[9px] font-black uppercase tracking-widest text-amber-600/70 mb-2">Pending</p>
            <p className="text-2xl font-black text-amber-700 leading-none">
              ₹{animatedPending.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Transactions */}
        <div className="flex-1 px-7 py-5">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Recent Payouts</p>
          {safe.length > 0 ? (
            <div className="space-y-2.5">
              {safe.slice(0, 4).map((result, i) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-transparent hover:border-slate-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-700 text-xs shadow-sm">
                      {result.match_count}✦
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors leading-tight">
                        {result.match_count} Match Prize
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {new Date(result.date || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">₹{Number(result.winnings || 0).toLocaleString()}</p>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${STATUS_STYLES[result.status] || STATUS_STYLES.pending}`}>
                      {result.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-500 font-bold text-sm mb-1">No winnings yet</p>
              <p className="text-slate-400 text-xs font-medium">Submit scores to enter the monthly draw</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
