'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Target, Star, Calendar, Activity, Plus, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Score {
  id: string;
  score: number;
  date: string;
}

interface ScoresCardProps {
  scores: Score[];
  onAddClick: () => void;
  onEditClick: (score: Score) => void;
  onDeleteClick: (id: string) => void;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
};

export function ScoresCard({ scores, onAddClick, onEditClick, onDeleteClick }: ScoresCardProps) {
  const last5 = (scores || []).slice(0, 5);
  const best = last5.length > 0 ? Math.min(...last5.map(s => s.score)) : null;
  const average = last5.length > 0 ? Math.round(last5.reduce((a, b) => a + b.score, 0) / last5.length) : null;

  return (
    <Card className="p-6 h-full flex flex-col group transition-all hover:border-[#00FFA3]/30">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#05070A] border border-white/5 flex items-center justify-center text-[#00FFA3] group-hover:rotate-6 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg tracking-tight uppercase leading-none mb-1">Performance</h3>
              <p className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest leading-none">Telemetry Node</p>
            </div>
          </div>
          <Button onClick={onAddClick} variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
            Log
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="p-4 rounded-xl bg-[#05070A]/50 border border-white/5 flex items-center gap-4">
              <Star className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-[8px] font-black text-[#8B949E] uppercase tracking-widest leading-none mb-1.5">Best</p>
                <p className="text-xl font-black text-white leading-none">{best ?? '--'}</p>
              </div>
           </div>
           <div className="p-4 rounded-xl bg-[#05070A]/50 border border-white/5 flex items-center gap-4">
              <Activity className="w-4 h-4 text-[#7C3AED]" />
              <div>
                <p className="text-[8px] font-black text-[#8B949E] uppercase tracking-widest leading-none mb-1.5">Avg</p>
                <p className="text-xl font-black text-white leading-none">{average ?? '--'}</p>
              </div>
           </div>
        </div>

        <div className="flex-1 space-y-3">
          <AnimatePresence>
            {last5.length > 0 ? (
              last5.map((score, i) => (
                <motion.div
                  key={score.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00FFA3]/20 transition-all duration-300 group/item"
                >
                  <div className="flex-1 flex items-center gap-4">
                     <div className={`
                       w-10 h-10 rounded-lg flex items-center justify-center font-black transition-all
                       ${score.score === best 
                         ? 'bg-[#00FFA3] text-[#05070A] shadow-[0_0_15px_rgba(0,255,163,0.3)]' 
                         : 'bg-[#05070A] text-white border border-white/5'
                       }
                     `}>
                        <span className="text-base leading-none">{score.score}</span>
                     </div>
                     
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                           <Calendar className="w-3 h-3 text-[#8B949E]" />
                           <span className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest">
                              {new Date(score.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                           </span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(score.score / 45) * 100}%` }}
                            className={`h-full ${score.score === best ? 'bg-[#00FFA3]' : 'bg-[#7C3AED]'}`} 
                          />
                        </div>
                     </div>

                     <div className="flex items-center gap-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <button onClick={() => onEditClick(score)} className="p-2 rounded-lg bg-[#0D1117] border border-white/5 text-[#8B949E] hover:text-[#00FFA3] transition-colors">
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button onClick={() => onDeleteClick(score.id)} className="p-2 rounded-lg bg-[#0D1117] border border-white/5 text-[#8B949E] hover:text-red-500 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                     </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-center opacity-20">
                <Target className="w-8 h-8 text-[#8B949E] mb-3" />
                <p className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest">No metrics protocolled</p>
              </div>
            )}
          </AnimatePresence>
        </div>
    </Card>
  );
}
