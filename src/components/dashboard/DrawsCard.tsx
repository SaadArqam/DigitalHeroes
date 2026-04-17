'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function DrawsCard() {
  return (
    <motion.div whileHover={{ scale: 1.01 }} className="h-full group">
      <Card className="h-full flex flex-col font-sans text-white border-none overflow-hidden relative shadow-2xl shadow-indigo-900/50">
        
        {/* Core Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black z-0"></div>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[50%] -right-[50%] w-[200%] h-[200%] bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50 z-0 mix-blend-screen pointer-events-none"
        ></motion.div>

        {/* Emotive Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-emerald/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-brand-emerald/30 transition-all duration-1000"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div>
              <CardTitle className="text-xl text-white font-black tracking-widest">Global Draw</CardTitle>
              <CardDescription className="text-indigo-300 font-bold tracking-widest uppercase text-[10px] mt-1">Main Event Protocol</CardDescription>
            </div>
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
               <Badge variant="emerald" className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black px-3 py-1 shadow-[0_0_15px_rgba(16,185,129,0.3)]">LIVE RUN</Badge>
            </motion.div>
          </CardHeader>
          
          <CardContent className="flex-grow flex flex-col justify-between">
            <div className="mt-4">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2 drop-shadow-sm">Estimated Jackpot</div>
              <div className="text-6xl md:text-7xl font-black tracking-tighter mb-10 text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-slate-400 drop-shadow-lg">
                ₹50,000
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors">
                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Impact Date</div>
                    <div className="text-sm font-black text-indigo-50">Next Cycle End</div>
                 </div>
                 <div className="p-5 bg-emerald-500/5 backdrop-blur-xl rounded-[2rem] border border-emerald-500/20 shadow-inner group-hover:bg-emerald-500/10 transition-colors">
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400/80 mb-1">Probability Status</div>
                    <div className="text-sm font-black text-emerald-400 drop-shadow-md">QUALIFIED</div>
                 </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="relative flex items-center justify-center">
                     <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-400 absolute animate-ping opacity-75"></div>
                  </div>
                  <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Neural Weights Active</span>
               </div>
               
               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full border border-white/5">
                 Id: SYS-99X
               </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
