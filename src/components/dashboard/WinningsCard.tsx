'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DrawResult {
  id: string;
  amount: number;
  match_count: number;
  date: string;
  status: string;
}

interface WinningsCardProps {
  results: DrawResult[];
}

export function WinningsCard({ results }: WinningsCardProps) {
  const totalWon = results.reduce((acc, curr) => acc + curr.amount, 0);
  const pending = results.filter(r => r.status === 'pending' || r.status === 'verified').length;
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-xl">Treasury</CardTitle>
        <Badge variant="emerald">Earnings</Badge>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex gap-4">
           <div className="flex-1 p-6 bg-slate-900 text-white rounded-[2rem] shadow-premium">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Winnings</div>
              <div className="text-3xl font-black tracking-tighter">₹{totalWon.toLocaleString()}</div>
           </div>
           <div className="flex-1 p-6 bg-emerald-50 border border-emerald-100/50 rounded-[2rem]">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 mb-2">Pending Payouts</div>
              <div className="text-3xl font-black text-emerald-900 tracking-tighter">{pending}</div>
           </div>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Recent Transactions</h4>
          <div className="space-y-3">
             {results.length > 0 ? (
               results.slice(0, 3).map(result => (
                 <div key={result.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                    <div>
                       <div className="text-sm font-black text-slate-900">{result.match_count} Match Prize</div>
                       <div className="text-[10px] font-bold text-slate-400">{new Date(result.date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-black text-slate-900">₹{result.amount.toLocaleString()}</div>
                       <Badge variant={result.status === 'paid' ? 'emerald' : 'slate'} size="xs">{result.status}</Badge>
                    </div>
                 </div>
               ))
             ) : (
               <div className="py-6 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                  <p className="text-sm font-bold text-slate-400">No winnings yet. Win big by entering scores!</p>
               </div>
             )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
