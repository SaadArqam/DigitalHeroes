'use client';

import { Trophy, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';

interface WinningsTableProps {
  results: any[];
}

export function WinningsTable({ results }: WinningsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
      case 'paid':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest"><CheckCircle className="w-3 h-3" /> {status}</span>;
      case 'pending':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[9px] font-black uppercase tracking-widest"><Clock className="w-3 h-3" /> {status}</span>;
      case 'rejected':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full text-[9px] font-black uppercase tracking-widest"><XCircle className="w-3 h-3" /> {status}</span>;
      default:
        return <span className="px-3 py-1 bg-slate-800 text-slate-500 border border-slate-700 rounded-full text-[9px] font-black uppercase tracking-widest">{status}</span>;
    }
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
               <Trophy className="w-6 h-6" />
            </div>
            <div>
               <h3 className="text-xl font-black text-white tracking-tight leading-none mb-1">Victory Ledger</h3>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Winnings Registry</p>
            </div>
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
           <thead>
             <tr className="border-b border-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
               <th className="px-8 py-4">Draw Cycle</th>
               <th className="px-8 py-4">Match Strength</th>
               <th className="px-8 py-4">Vault Payout</th>
               <th className="px-8 py-4">Status</th>
               <th className="px-8 py-4"></th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-800/30">
             {results.length > 0 ? results.map((result, i) => (
               <tr key={i} className="group hover:bg-slate-900/50 transition-colors">
                 <td className="px-8 py-6 text-sm font-black text-white">{result.draws?.month || 'Unspecified'}</td>
                 <td className="px-8 py-6">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{result.match_count}-Match</span>
                 </td>
                 <td className="px-8 py-6 font-black text-white text-base">₹{result.prize_amount.toLocaleString()}</td>
                 <td className="px-8 py-6">{getStatusBadge(result.status)}</td>
                 <td className="px-8 py-6 text-right">
                    <button className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-white group-hover:border-slate-700 transition-all">
                       <ChevronRight className="w-4 h-4" />
                    </button>
                 </td>
               </tr>
             )) : (
               <tr>
                 <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-sm font-bold text-slate-500 mb-2">No winnings yet — keep entering scores!</p>
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Persistence is protocol.</p>
                 </td>
               </tr>
             )}
           </tbody>
        </table>
      </div>
    </div>
  );
}
