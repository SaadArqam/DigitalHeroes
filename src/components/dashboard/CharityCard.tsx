'use client';

import { motion } from 'framer-motion';
import { Heart, Globe, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CharityCard({
  preferences,
  onConfigClick,
  totalDonated = 12450 // Default mock for demo if no real data
}: {
  preferences: any[];
  onConfigClick: () => void;
  totalDonated?: number;
}) {
  const hasSelection = preferences && preferences.length > 0;
  const selected = hasSelection ? preferences[0] : null;
  const pct = selected?.percentage ?? 10; // Default 10%

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full group"
    >
      <div className="h-full rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-rose-100 transition-all duration-500 flex flex-col overflow-hidden relative">
        
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-50 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none group-hover:bg-rose-100 transition-colors duration-500" />
        
        {/* Header */}
        <div className="px-8 pt-10 pb-6 flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-200 group-hover:scale-110 transition-transform duration-500">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-xl tracking-tight">Global Impact</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Your Hero Legacy</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-100">
             <Globe className="w-3 h-3" /> Earth Positive
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 px-8 py-4 flex flex-col relative z-10">
          {hasSelection && selected ? (
            <div className="flex-1 flex flex-col">
              {/* Impact Stats Section */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-200">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Donated</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black">₹{totalDonated.toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-5 rounded-3xl bg-rose-50 border border-rose-100">
                  <p className="text-[9px] font-black uppercase tracking-widest text-rose-600/70 mb-2">Allocation</p>
                  <div className="flex items-baseline gap-1 text-rose-700">
                    <span className="text-2xl font-black">{pct}%</span>
                  </div>
                </div>
              </div>

              {/* Active Cause */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pledged To</span>
                  <div className="h-[1px] flex-1 bg-slate-100" />
                </div>
                <div className="flex items-start gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 group-hover:border-rose-200 transition-colors duration-500">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-400 flex-shrink-0 shadow-sm overflow-hidden">
                    {selected.charities?.image_url ? (
                      <img src={selected.charities.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      selected.charities?.name?.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
                      {selected.charities?.name} <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </h4>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                      {selected.charities?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progression Tracker */}
              <div className="mb-8 space-y-3">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Impact Milestone</span>
                    <span className="text-rose-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Earth Guardian
                    </span>
                 </div>
                 <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 rounded-full"
                    />
                 </div>
                 <p className="text-[9px] font-bold text-slate-400 text-center italic">₹7,550 more to reach next tier</p>
              </div>

              <div className="mt-auto">
                <button
                  onClick={onConfigClick}
                  className="w-full py-4.5 px-6 group/btn relative overflow-hidden bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:text-white hover:border-transparent transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Modify Impact <ArrowUpRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-24 h-24 rounded-[2rem] bg-rose-50 border-2 border-dashed border-rose-200 flex items-center justify-center mb-6 animate-pulse">
                <Heart className="w-10 h-10 text-rose-300" />
              </div>
              <h4 className="font-black text-slate-900 text-xl mb-2">Passive Player</h4>
              <p className="text-slate-500 text-sm font-medium mb-8 max-w-[220px] leading-relaxed">
                Connect your participation to a causes that change the world.
              </p>
              <Button
                onClick={onConfigClick}
                className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest shadow-xl shadow-rose-200 hover:scale-[1.02] transition-all"
              >
                Become a Hero
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
