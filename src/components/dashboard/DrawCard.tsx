'use client';

import { Trophy, Target, Play, Calendar } from 'lucide-react';

interface Draw {
  winning_numbers: number[];
  total_pool: number;
  month: string;
}

interface DrawResult {
  match_count: number;
}

export function DrawCard({ draw, userResult }: { draw: Draw | null; userResult: DrawResult | null }) {
  if (!draw) return (
    <div className="bg-[#111827] border border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center">
       <Play className="w-12 h-12 text-slate-700 mb-4" />
       <h3 className="text-xl font-black text-white mb-2">Awaiting Draw</h3>
       <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Protocol initialization sequence pending.</p>
    </div>
  );

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-primary-gradient opacity-[0.03] pointer-events-none" />
      
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-primary-end">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight leading-none mb-1">Current Draw</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{draw.month}</p>
          </div>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Pool</p>
           <p className="text-2xl font-black text-white tracking-tighter">₹{draw.total_pool.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex justify-between items-center gap-2 mb-10 relative z-10">
        {draw.winning_numbers.map((num, i) => (
          <div key={i} className="flex-1 aspect-square rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl font-black text-white shadow-inner group-hover:scale-105 transition-transform duration-500 hover:border-primary-end/50">
            {num}
          </div>
        ))}
      </div>

      <div className="relative z-10 p-5 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${userResult ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-600'}`}>
               <Target className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Your Result</span>
         </div>
         <span className={`text-sm font-black uppercase tracking-widest ${userResult ? (userResult.match_count >= 3 ? 'text-emerald-500' : 'text-primary-end') : 'text-slate-600'}`}>
            {userResult ? `${userResult.match_count}-Match` : 'No Entry'}
         </span>
      </div>
    </div>
  );
}
