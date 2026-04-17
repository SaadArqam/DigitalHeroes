'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function DrawsCard() {
  return (
    <Card className="h-full flex flex-col bg-brand-indigo text-white border-none overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-900 to-slate-900 z-0"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-500/20 transition-all duration-500"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div>
            <CardTitle className="text-xl text-white">Upcoming Draw</CardTitle>
            <CardDescription className="text-indigo-200">Main Event Participation</CardDescription>
          </div>
          <Badge variant="emerald" className="bg-emerald-500 text-white border-none">Live Status</Badge>
        </CardHeader>
        
        <CardContent className="flex-grow flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-2">Jackpot Est.</div>
            <div className="text-5xl font-black tracking-tighter mb-8">₹25,000</div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                  <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Draw Date</div>
                  <div className="text-sm font-black">May 01, 2024</div>
               </div>
               <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                  <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Entry Status</div>
                  <div className="text-sm font-black text-emerald-400">QUALIFIED</div>
               </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Weighted Algorithm Active</span>
             </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
