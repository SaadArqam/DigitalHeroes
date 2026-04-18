'use client';

import { Heart, Globe, ArrowUpRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface CharityPreference {
  charity_id: string;
  contribution_percentage: number;
  charities: {
    name: string;
    description: string;
  }
}

export function CharityCard({ 
  preference, 
  planAmount 
}: { 
  preference: CharityPreference | null,
  planAmount: number
}) {
  const estimatedImpact = (planAmount * (preference?.contribution_percentage || 0)) / 100;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden h-full flex flex-col group">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
            <Heart className="w-6 h-6 fill-rose-500/10" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight leading-none mb-1">Impact</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Contribution</p>
          </div>
        </div>
        <Link 
          href="/modify-impact"
          className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-white hover:border-slate-700 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex-1 space-y-6">
        <div>
           <h4 className="text-lg font-black text-white tracking-tight mb-2">
             {preference?.charities?.name || 'Protocol Awaiting Choice'}
           </h4>
           <p className="text-xs font-bold text-slate-500 leading-relaxed line-clamp-2 uppercase tracking-tighter">
             {preference?.charities?.description || 'Synchronize your impact partner to begin mission support.'}
           </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Percentage</p>
              <p className="text-xl font-black text-white">{preference?.contribution_percentage || 0}%</p>
           </div>
           <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Mo. Estimate</p>
              <p className="text-xl font-black text-emerald-500">₹{estimatedImpact.toFixed(2)}</p>
           </div>
        </div>
      </div>

      <Link 
        href="/modify-impact" 
        className="mt-8 w-full py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group/btn"
      >
        Modify Impact <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
      </Link>
    </div>
  );
}
