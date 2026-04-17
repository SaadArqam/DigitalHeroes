'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function CharityCard({ preferences, onConfigClick }: { preferences: any[], onConfigClick: () => void }) {
  const hasSelection = preferences && preferences.length > 0;

  return (
    <motion.div whileHover={{ y: -4 }} className="h-full">
      <Card className="h-full flex flex-col relative overflow-hidden bg-white/70 backdrop-blur-xl border border-rose-100 hover:shadow-2xl transition-shadow duration-500 hover:shadow-rose-500/10">
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 rounded-full blur-[40px] -mt-10 -mr-10 pointer-events-none"></div>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
             </div>
             <CardTitle className="text-xl font-black text-slate-800">Philanthropy</CardTitle>
          </div>
          <Badge variant="emerald" className="bg-rose-100 text-rose-700 shadow-sm font-black tracking-widest uppercase border-rose-200">Impact</Badge>
        </CardHeader>
        
        <CardContent className="flex-grow flex flex-col relative z-10">
          {hasSelection ? (
            <div className="space-y-6 flex-grow mt-4">
              <div className="group">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Active Beneficiary</div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter drop-shadow-sm transition-transform duration-500 origin-left group-hover:scale-105">
                  {preferences[0].charities?.name || 'Selected Cause'}
                </div>
              </div>

              <div className="p-5 mt-6 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200/50 rounded-2xl shadow-inner">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs font-black text-rose-900 tracking-widest uppercase">Allocation</div>
                  <div className="text-sm font-black text-rose-600">{preferences[0].percentage}%</div>
                </div>
                <div className="w-full bg-rose-200/50 rounded-full h-2">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${preferences[0].percentage}%` }} 
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="bg-gradient-to-r from-rose-400 to-pink-500 h-2 rounded-full shadow-[0_0_10px_rgba(2fb,113,133,0.5)]"
                  ></motion.div>
                </div>
              </div>

              <div className="pt-8 mt-auto">
                <Button 
                  variant="outline" 
                  onClick={onConfigClick}
                  className="w-full font-bold py-6 text-sm uppercase tracking-widest text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 rounded-xl transition-all shadow-sm"
                >
                  Modify Configuration
                </Button>
              </div>
            </div>
          ) : (
             <div className="flex-grow flex flex-col items-center justify-center py-6 mt-4 text-center group cursor-pointer" onClick={onConfigClick}>
              <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-rose-50 rounded-3xl flex items-center justify-center text-rose-300 mb-6 shadow-inner border border-white group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-slate-600 font-bold mb-8 text-sm">Direct your winnings output to a cause of your choice.</p>
              <Button className="w-full py-6 rounded-xl font-black tracking-widest uppercase bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 group-hover:shadow-rose-500/20 transition-all">Establish Impact</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
