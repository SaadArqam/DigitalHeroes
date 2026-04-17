'use client';

import { motion } from 'framer-motion';

export function CharityCard({
  preferences,
  onConfigClick,
}: {
  preferences: any[];
  onConfigClick: () => void;
}) {
  const hasSelection = preferences && preferences.length > 0;
  const selected = hasSelection ? preferences[0] : null;
  const pct = selected?.percentage ?? 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full"
    >
      <div className="h-full rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-rose-500/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center shadow-md shadow-rose-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base tracking-tight">Philanthropy</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Impact allocation</p>
            </div>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-full border border-rose-100">Impact</span>
        </div>

        {/* Body */}
        <div className="flex-1 px-7 py-6 flex flex-col">
          {hasSelection && selected ? (
            <>
              {/* Cause */}
              <div className="mb-6">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Active Beneficiary</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {selected.charities?.name || 'Selected Cause'}
                </p>
                {selected.charities?.description && (
                  <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed line-clamp-2">
                    {selected.charities.description}
                  </p>
                )}
              </div>

              {/* Allocation bar */}
              <div className="mb-6 p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-rose-600/70">Winnings Allocation</p>
                  <p className="text-sm font-black text-rose-600">{pct}%</p>
                </div>
                <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>
              </div>

              {/* Impact stat */}
              <div className="flex-1 flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-rose-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Impact</p>
                  <p className="text-base font-black text-slate-800">Active & Contributing</p>
                </div>
              </div>

              <button
                onClick={onConfigClick}
                className="w-full py-3 px-5 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-2xl transition-colors tracking-wide"
              >
                Change Beneficiary
              </button>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
                  <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <p className="font-black text-slate-900 text-base mb-1">No Cause Selected</p>
              <p className="text-slate-400 text-sm font-medium mb-6 max-w-[190px] leading-relaxed">
                Direct a portion of your winnings to a cause you believe in.
              </p>
              <button
                onClick={onConfigClick}
                className="w-full py-3 px-5 text-sm font-bold text-white bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-md shadow-rose-500/20 hover:shadow-rose-500/35 hover:scale-[1.02] transition-all"
              >
                Choose a Cause
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
