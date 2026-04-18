'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Target, TrendingDown, Star, Calendar, ArrowRight, Activity, Plus, Pencil, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
    <Card variant="glass" className="h-full flex flex-col overflow-hidden relative group" hoverable>
        {/* Header */}
        <div className="flex items-start justify-between relative z-10 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-gradient flex items-center justify-center shadow-glow group-hover:rotate-6 transition-transform duration-500">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-xl tracking-tight leading-none mb-1">Performance</h3>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Citizenship Data</p>
            </div>
          </div>
          <Button
            onClick={onAddClick}
            variant="secondary"
            size="sm"
            className="rounded-xl font-black"
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Entry
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="p-4 rounded-3xl bg-background border border-card-border flex items-center gap-4">
              <div className="p-2 bg-card rounded-xl shadow-sm">
                 <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Best</p>
                <p className="text-xl font-black text-white leading-none">{best ?? '--'}</p>
              </div>
           </div>
           <div className="p-4 rounded-3xl bg-background border border-card-border flex items-center gap-4">
              <div className="p-2 bg-card rounded-xl shadow-sm">
                 <Activity className="w-4 h-4 text-primary-end" />
              </div>
              <div>
                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Avg</p>
                <p className="text-xl font-black text-white leading-none">{average ?? '--'}</p>
              </div>
           </div>
        </div>

        {/* Visual Trend List */}
        <div className="flex-1 overflow-auto space-y-3">
          <AnimatePresence>
            {last5.length > 0 ? (
              last5.map((score, i) => (
                <motion.div
                  key={score.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center p-4 rounded-[1.5rem] bg-card border border-card-border hover:border-primary-start/30 transition-all duration-300 group/item"
                >
                  <div className="flex-1 flex items-center gap-5">
                     <div className={`
                       w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black transition-all
                       ${score.score === best 
                         ? 'bg-primary-gradient text-white shadow-glow' 
                         : 'bg-background text-white border border-card-border'
                       }
                     `}>
                        <span className="text-lg leading-none">{score.score}</span>
                     </div>
                     
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                           <Calendar className="w-3 h-3 text-text-muted" />
                           <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                              {new Date(score.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                           </span>
                        </div>
                        <div className="h-1.5 bg-input-bg rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(score.score / 45) * 100}%` }}
                            className="h-full bg-primary-end" 
                          />
                        </div>
                     </div>

                     {/* Action Buttons */}
                     <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditClick(score)}
                          className="p-2 rounded-lg bg-card border border-card-border text-text-secondary hover:text-primary-end hover:border-primary-end/30 transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteClick(score.id)}
                          className="p-2 rounded-lg bg-card border border-card-border text-text-secondary hover:text-rose-500 hover:border-rose-500/30 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                     </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center opacity-40">
                <Target className="w-10 h-10 text-text-muted mb-4" />
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Awaiting primary data upload</p>
              </div>
            )}
          </AnimatePresence>
        </div>
    </Card>
  );
}
