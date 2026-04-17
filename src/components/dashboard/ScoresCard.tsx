'use client';

import { motion } from 'framer-motion';

interface Score {
  id: string;
  score: number;
  date: string;
}

interface ScoresCardProps {
  scores: Score[];
  onAddClick: () => void;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

export function ScoresCard({ scores, onAddClick }: ScoresCardProps) {
  const last5 = (scores || []).slice(0, 5);
  const best = last5.length > 0 ? Math.min(...last5.map(s => s.score)) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full"
    >
      <div className="h-full rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-7 pt-7 pb-5 flex items-start justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base tracking-tight">Your Scores</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Last 5 entries</p>
            </div>
          </div>
          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>

        {/* Best score badge */}
        {best !== null && (
          <div className="px-7 py-4 bg-gradient-to-r from-indigo-50/80 to-violet-50/50 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Personal Best</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-700">{best}</span>
                <div className="w-6 h-6 rounded-lg bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center">
                  <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scores list */}
        <div className="flex-1 overflow-auto px-7 py-5">
          {last5.length > 0 ? (
            <motion.ul variants={container} initial="hidden" animate="show" className="space-y-2.5">
              {last5.map((score, i) => (
                <motion.li
                  key={score.id}
                  variants={item}
                  className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-transparent hover:border-indigo-100 transition-all cursor-default"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 group-hover:border-indigo-200 shadow-sm flex items-center justify-center font-black text-slate-800 text-sm transition-colors">
                      {score.score}
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Date</p>
                      <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">
                        {new Date(score.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {score.score === best && (
                      <span className="text-[8px] font-black uppercase tracking-widest text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">Best</span>
                    )}
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Verified</span>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-500 font-bold text-sm mb-1">No scores yet</p>
              <p className="text-slate-400 text-xs mb-6 font-medium">Add your first score to enter the draw</p>
              <button
                onClick={onAddClick}
                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all"
              >
                Add First Score
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
