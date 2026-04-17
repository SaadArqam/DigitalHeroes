'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DrawsCardProps {
  latestDraw?: { winning_numbers: number[]; draw_date: string };
  userResult?: { match_count: number; winnings: number };
}

export function DrawsCard({ latestDraw, userResult }: DrawsCardProps = {}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.005 }}
      className="h-full group"
    >
      {/* Dark glass card */}
      <div className="relative h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-900/30">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#090e24] to-slate-950" />

        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-[80px]"
          />
          <motion.div
            animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute -bottom-16 -left-16 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px]"
          />
          <motion.div
            animate={{ opacity: [0.05, 0.12, 0.05] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-8 right-8 w-48 h-48 bg-emerald-400/10 rounded-full blur-[60px]"
          />
        </div>

        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAlIiBoZWlnaHQ9IjMwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                  <svg className="w-4.5 h-4.5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400">Global Draw System</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Monthly Prize Draw</h2>
            </div>

            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live</span>
              </div>
            </motion.div>
          </div>

          {/* Jackpot amount */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/80 mb-2">
              Estimated Jackpot
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl xl:text-7xl font-black tracking-[-0.04em] leading-none mb-8"
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ₹{(userResult?.winnings || 50000).toLocaleString()}
            </motion.div>

            {/* Winning numbers */}
            {latestDraw?.winning_numbers && (
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60 mb-3">Winning Numbers</p>
                <div className="flex gap-2.5 flex-wrap">
                  {latestDraw.winning_numbers.map((num, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.07 }}
                      className="w-10 h-10 rounded-full bg-white/5 border border-indigo-400/30 flex items-center justify-center font-black text-indigo-100 text-sm shadow-inner"
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm">
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400/70 mb-1">Your Matches</p>
                <p className="text-lg font-black text-white">{userResult?.match_count ?? '—'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 backdrop-blur-sm">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400/70 mb-1">Draw Status</p>
                <p className="text-lg font-black text-emerald-400">Qualified</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Weighted Algorithm Active</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
