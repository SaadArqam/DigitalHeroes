// src/components/dashboard/WinningsCard.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface DrawResult {
  id: string;
  winnings: number;
  match_count: number;
  date: string;
  status: string;
}

export function WinningsCard({ results }: { results: DrawResult[] }) {
  const safeResults = results || [];
  
  const totalWinnings = safeResults
    .filter(r => r.status === 'paid' || r.status === 'completed')
    .reduce((acc, curr) => acc + Number(curr.winnings || 0), 0);
    
  const pendingPayouts = safeResults
    .filter(r => r.status === 'pending' || r.status === 'verified')
    .reduce((acc, curr) => acc + Number(curr.winnings || 0), 0);
  
  return (
    <motion.div whileHover={{ y: -4 }} className="h-full">
      <Card className="h-full flex flex-col bg-white border border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-xl font-black text-slate-800">Treasury</CardTitle>
          <Badge variant="emerald" className="uppercase font-bold tracking-widest text-[10px]">Earnings</Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
             <div className="flex-[3] p-6 bg-slate-900 text-white rounded-3xl">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Winnings</div>
                <div className="text-4xl font-black tracking-tighter">₹{totalWinnings.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
             </div>
             <div className="flex-[2] p-6 bg-emerald-50 border border-emerald-100 rounded-3xl">
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Pending Payouts</div>
                <div className="text-4xl font-black text-emerald-900 tracking-tighter">₹{pendingPayouts.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
             </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Recent Transactions</h4>
            <div className="space-y-3">
               {safeResults.length > 0 ? (
                 safeResults.slice(0, 3).map((result) => (
                   <div key={result.id} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div>
                         <div className="text-sm font-black text-slate-900">{result.match_count} Match Output</div>
                         <div className="text-[10px] font-bold text-slate-500">{new Date(result.date || new Date()).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-black text-slate-900">₹{Number(result.winnings || 0).toLocaleString()}</div>
                         <Badge variant={result.status === 'pending' ? 'slate' : 'emerald'} size="xs" className="mt-1 text-[9px] uppercase">
                            {result.status}
                         </Badge>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="py-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                    <p className="text-sm font-bold text-slate-400 max-w-[200px] mx-auto">No winnings yet. Enter scores to participate.</p>
                 </div>
               )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
