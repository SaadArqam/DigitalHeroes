'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Score {
  id: string;
  score: number;
  date: string;
}

interface ScoresCardProps {
  scores: Score[];
  onAddClick: () => void;
}

export function ScoresCard({ scores, onAddClick }: ScoresCardProps) {
  // Extract up to 5
  const last5 = (scores || []).slice(0, 5);
  
  return (
    <motion.div whileHover={{ y: -4 }} className="h-full">
      <Card className="h-full flex flex-col relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white hover:shadow-2xl transition-shadow duration-500 hover:shadow-indigo-500/10">
        
        {/* Subtle decorative reflection top right */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/5 rounded-full blur-[40px] -mt-10 -mr-10 pointer-events-none"></div>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 relative z-10">
          <div>
            <CardTitle className="text-xl font-black text-slate-800">Your Arsenal</CardTitle>
            <CardDescription className="font-bold text-slate-400">Weaponry for the next draw</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onAddClick} className="shadow-sm font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors">
            Add New
          </Button>
        </CardHeader>
        
        <CardContent className="flex-grow relative z-10">
          {last5.length > 0 ? (
            <div className="space-y-3">
              {last5.map((score, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={score.id} 
                  className="flex items-center justify-between p-4 bg-white/80 rounded-2xl border border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 flex items-center justify-center font-black text-indigo-900 shadow-inner group-hover:scale-110 transition-transform origin-left">
                      {score.score}
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recorded Date</div>
                      <div className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">{new Date(score.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <Badge variant="slate" size="xs" className="shadow-sm text-[9px] uppercase font-bold tracking-widest">Verified</Badge>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center py-10 text-center relative group">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mb-4 shadow-inner border border-white group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-500 font-bold mb-6 text-sm max-w-[200px] leading-relaxed">No scores locked in. Begin logging scores to conquer draws.</p>
              <Button variant="primary" onClick={onAddClick} className="w-full py-6 rounded-xl font-black tracking-widest uppercase shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform">Mount Attack</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
