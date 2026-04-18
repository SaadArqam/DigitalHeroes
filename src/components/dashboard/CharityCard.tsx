'use client';

import { Heart, ArrowUpRight, ExternalLink } from 'lucide-react';
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
    <div className="bg-[#0D1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden h-full flex flex-col group transition-all hover:border-red-500/30">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#05070A] border border-white/5 flex items-center justify-center text-red-500 shadow-inner">
            <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight leading-none mb-1 uppercase">Impact</h3>
            <p className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest leading-none">Global Sector</p>
          </div>
        </div>
        <Link 
          href="/modify-impact"
          className="p-2.5 bg-[#05070A] border border-white/5 rounded-lg text-[#8B949E] hover:text-white transition-all"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex-1 space-y-5">
        <div>
           <h4 className="text-lg font-black text-white tracking-tight leading-none mb-1.5 uppercase">
             {preference?.charities?.name || 'Awaiting Selection'}
           </h4>
           <p className="text-[10px] font-black text-[#8B949E] leading-relaxed uppercase tracking-widest min-h-[2.5rem]">
             {preference?.charities?.description || 'Synchronize impact node to initiate mission support.'}
           </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 bg-[#05070A]/50 border border-white/5 rounded-xl">
              <p className="text-[8px] font-black text-[#8B949E] uppercase tracking-widest mb-1 leading-none">Allocation</p>
              <p className="text-xl font-black text-white leading-none">{preference?.contribution_percentage || 0}%</p>
           </div>
           <div className="p-4 bg-[#05070A]/50 border border-white/5 rounded-xl">
              <p className="text-[8px] font-black text-[#8B949E] uppercase tracking-widest mb-1 leading-none">Mthly Est.</p>
              <p className="text-xl font-black text-[#00FFA3] leading-none">₹{estimatedImpact.toFixed(0)}</p>
           </div>
        </div>
      </div>

      <Link 
        href="/modify-impact" 
        className="mt-6 w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] text-center text-[#8B949E] hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 group/btn"
      >
        Modify Protocol <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
      </Link>
    </div>
  );
}
