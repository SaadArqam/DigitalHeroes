'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Target, TrendingDown, Star, Calendar, ArrowRight, Activity } from 'lucide-react';

interface Score {
  id: string;
  score: number;
  date: string;
}

interface ScoresCardProps {
  scores: Score[];
  onAddClick: () => void;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
};

export function ScoresCard({ scores, onAddClick }: ScoresCardProps) {
  const last5 = (scores || []).slice(0, 5);
  const best = last5.length > 0 ? Math.min(...last5.map(s => s.score)) : null;
  const average = last5.length > 0 ? Math.round(last5.reduce((a, b) => a + b.score, 0) / last5.length) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full group"
    >
      <div className="h-full rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden relative">
        {/* Subtle Gradient Header */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="px-8 pt-10 pb-6 flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-xl tracking-tight">Citizenship Data</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Performance Analytics</p>
            </div>
          </div>
          <button
            onClick={onAddClick}
            className="group/add flex items-center gap-2 px-5 py-3 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm"
          >
            Add Record <ArrowRight className="w-3.5 h-3.5 group-hover/add:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick Stats Banner */}
        <div className="px-8 mb-8 relative z-10">
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                   <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Lifetime Best</p>
                  <p className="text-xl font-black text-slate-800 leading-none">{best ?? '--'}</p>
                </div>
             </div>
             <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                   <Activity className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">MA Avg</p>
                  <p className="text-xl font-black text-slate-800 leading-none">{average ?? '--'}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Visual Trend List */}
        <div className="flex-1 px-8 pb-8 overflow-auto relative z-10">
          <AnimatePresence>
            {last5.length > 0 ? (
              <div className="space-y-3">
                {last5.map((score, i) => (
                  <motion.div
                    key={score.id}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="group/item flex items-center p-4 rounded-3xl bg-white border border-slate-50 hover:border-indigo-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex-1 flex items-center gap-5">
                       <div className={`
                         w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black transition-all
                         ${score.score === best 
                           ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                           : 'bg-slate-50 text-slate-800 group-hover/item:bg-indigo-50 group-hover/item:text-indigo-700'
                         }
                       `}>
                          <span className="text-xl leading-none">{score.score}</span>
                          <span className="text-[8px] opacity-40 uppercase tracking-tighter">pts</span>
                       </div>
                       
                       <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                             <Calendar className="w-3 h-3 text-slate-300" />
                             <span className="text-xs font-bold text-slate-700">
                                {new Date(score.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                             </span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-slate-200 group-hover/item:bg-indigo-200 transition-colors" 
                                  style={{ width: `${(score.score / 45) * 100}%` }} 
                                />
                             </div>
                             {score.score < (average || 0) && (
                               <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                             )}
                          </div>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-50">
                <div className="w-20 h-20 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-slate-200" />
                </div>
                <h4 className="font-black text-slate-900 mb-2">Passive History</h4>
                <p className="text-sm text-slate-400 font-medium max-w-[200px] mx-auto">Upload your first data point to start trending.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Footer */}
        {last5.length > 0 && (
          <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-50 flex items-center justify-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Verifying synchronization across ledger nodes</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
