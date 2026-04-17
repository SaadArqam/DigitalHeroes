'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

// Very lightweight count up hook
function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
}

interface DrawResult {
  id: string;
  amount: number;
  match_count: number;
  date: string;
  status: string;
}

interface WinningsCardProps {
  results: DrawResult[];
}

export function WinningsCard({ results }: WinningsCardProps) {
  // Gracefully handle undefined amounts/results
  const totalWon = (results || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const pending = (results || []).filter(r => r.status === 'pending' || r.status === 'verified').length;
  const animatedTotal = useCountUp(totalWon);
  
  return (
    <motion.div whileHover={{ y: -4 }} className="h-full">
      <Card className="h-full flex flex-col relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white hover:shadow-2xl transition-shadow duration-500 hover:shadow-emerald-500/10">
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <CardTitle className="text-xl font-black text-slate-800">Treasury</CardTitle>
          </div>
          <Badge variant="emerald" className="shadow-sm font-black tracking-widest uppercase">Earnings</Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
             <div className="flex-[3] p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2rem] shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[40px] -mt-10 -mr-10 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 relative z-10">Total Winnings</div>
                <div className="text-4xl font-black tracking-tighter relative z-10">₹{animatedTotal.toLocaleString()}</div>
             </div>
             <div className="flex-[2] p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/50 rounded-[2rem] shadow-inner group">
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Pending Payouts</div>
                <div className="text-4xl font-black text-emerald-900 tracking-tighter group-hover:scale-110 origin-left transition-transform duration-300">{pending}</div>
             </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Recent Transactions</h4>
            <div className="space-y-3">
               {results && results.length > 0 ? (
                 results.slice(0, 3).map((result, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     key={result.id} 
                     className="group flex items-center justify-between p-4 bg-white/80 border border-slate-100 rounded-2xl hover:border-emerald-200 hover:shadow-md transition-all cursor-default"
                   >
                      <div>
                         <div className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{result.match_count} Match Prize</div>
                         <div className="text-[10px] font-bold text-slate-400">{new Date(result.date || new Date()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-black text-slate-900 group-hover:scale-105 transition-transform origin-right">₹{(result.amount || 0).toLocaleString()}</div>
                         <Badge variant={result.status === 'verified' || result.status === 'paid' ? 'emerald' : 'slate'} size="xs" className="mt-1 shadow-sm font-bold uppercase text-[9px]">{result.status || 'Pending'}</Badge>
                      </div>
                   </motion.div>
                 ))
               ) : (
                 <div className="py-8 text-center border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl">
                    <p className="text-sm font-bold text-slate-400 max-w-[200px] mx-auto leading-relaxed">No winnings yet. Keep submitting scores to enter the draws!</p>
                 </div>
               )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
