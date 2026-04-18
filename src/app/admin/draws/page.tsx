'use client';

import { useState, useEffect } from 'react';
import { createDraw, simulateDraw, publishDraw, getDrawHistory } from '@/app/actions/draws';
import { 
  Play, FlaskConical, Target, Trophy, Calendar, 
  Settings, Loader2, Sparkles, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function AdminDrawsPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Interaction States
  const [month, setMonth] = useState('');
  const [mode, setMode] = useState<'random' | 'algorithmic'>('random');
  const [opLoading, setOpLoading] = useState(false);
  const [simulation, setSimulation] = useState<any>(null);

  const { toast } = useToast();

  useEffect(() => { loadHistory(); }, []);

  async function loadHistory() {
    setLoading(true);
    const data = await getDrawHistory();
    setHistory(data);
    setLoading(false);
  }

  const handleCreate = async () => {
    if (!month) return toast('Protocol Error: Month required', 'error');
    setOpLoading(true);
    
    // Format to full date YYYY-MM-01 for DB compatibility
    const formattedMonth = month.length === 7 ? `${month}-01` : month;
    
    const res = await createDraw(formattedMonth, mode);
    if (res.success) {
      toast(res.message, 'success');
      setMonth('');
      await loadHistory();
    } else {
      toast(res.message ?? 'Creation Error', 'error');
    }
    setOpLoading(false);
  };

  const handleSimulate = async (drawId: string) => {
    setOpLoading(true);
    const res = await simulateDraw(drawId, mode);
    if (res.success) {
      setSimulation({ ...res.data, drawId });
      toast(res.message, 'success');
    } else {
      toast(res.message ?? 'Sim Error', 'error');
    }
    setOpLoading(false);
  };

  const handlePublish = async () => {
    if (!simulation?.drawId) return;
    if (!confirm('Permanent Ledger Synchronization. Execute?')) return;
    setOpLoading(true);
    const res = await publishDraw(simulation.drawId, mode);
    if (res.success) {
      toast(res.message, 'success');
      setSimulation(null);
      await loadHistory();
    } else {
      toast(res.message ?? 'Publish Error', 'error');
    }
    setOpLoading(false);
  };

  if (loading) return (
     <div className="py-40 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Synchronizing Draw Registry...</p>
     </div>
  );

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-5xl font-black text-white tracking-tight uppercase">Draw <span className="text-indigo-600 italic">Protocol</span></h1>
      </header>

      <div className="grid grid-cols-1 gap-8 items-start">
         {/* Creation Deck */}
         <Card className="p-10 bg-[#0c0c12] border-slate-800 shadow-2xl rounded-[3rem]">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-10 flex items-center gap-2">
               <Settings className="w-4 h-4 text-indigo-500" /> Initialize New Cycle
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
               <div className="md:col-span-12 lg:col-span-5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block mb-3">Target Cycle Month</label>
                  <input 
                    type="month" 
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white font-bold focus:outline-none focus:border-indigo-500 transition-all [color-scheme:dark]"
                  />
               </div>
               <div className="md:col-span-12 lg:col-span-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block mb-3">Generation Logic</label>
                  <select 
                    value={mode}
                    onChange={(e: any) => setMode(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white font-bold focus:outline-none focus:border-indigo-500 transition-all uppercase text-xs"
                  >
                     <option value="random">Pure Random (True Stochastic)</option>
                     <option value="algorithmic">Algorithmic (Frequency Weighted)</option>
                  </select>
               </div>
               <div className="md:col-span-12 lg:col-span-3">
                  <Button onClick={handleCreate} isLoading={opLoading} className="w-full h-[58px] rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-900/10">
                    Create Draw
                  </Button>
               </div>
            </div>
         </Card>

         {/* Simulation Viewport */}
         {simulation && (
            <Card className="p-10 bg-indigo-950/20 border-2 border-indigo-500/40 shadow-glow rounded-[3rem] animate-in slide-in-from-top-4 duration-500">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                        <FlaskConical className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1">Simulation Results</h4>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Protocol: {mode} Logic</p>
                     </div>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                     <Button variant="secondary" onClick={() => setSimulation(null)} className="flex-1 md:flex-none h-14 rounded-xl border-slate-800 bg-slate-900">Clear</Button>
                     <Button onClick={handlePublish} isLoading={opLoading} className="flex-1 md:flex-none h-14 rounded-xl bg-indigo-600 shadow-xl shadow-indigo-500/20">Sync Ledger</Button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="space-y-4">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Outcome Mapping</span>
                     <div className="flex gap-2">
                        {simulation.drawNumbers.map((num: number, i: number) => (
                           <div key={i} className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-white text-sm shadow-xl">
                              {num}
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-6">Victors Detected</p>
                     <p className="text-3xl font-black text-white leading-none">{simulation.winners.length}</p>
                  </div>
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-6">Execution Pool</p>
                     <p className="text-3xl font-black text-white leading-none">₹{simulation.totalPool.toLocaleString()}</p>
                  </div>
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-6">Jackpot Rollover</p>
                     <p className="text-3xl font-black text-emerald-500 leading-none">₹{simulation.jackpotRollover.toLocaleString()}</p>
                  </div>
               </div>
            </Card>
         )}

         {/* History Stream */}
         <Card className="overflow-hidden bg-[#0c0c12] border-slate-800 shadow-2xl rounded-[3rem] isolate">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  <div>
                     <h3 className="text-xl font-black text-white uppercase tracking-tight leading-none mb-1">Registry history</h3>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Draw Completion Ledger</p>
                  </div>
               </div>
            </div>
            <div className="overflow-x-auto safari-scroll-fix">
               <table className="w-full text-left border-separate border-spacing-0 text-white">
                  <thead>
                     <tr className="border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        <th className="px-8 py-6">Month Cycle</th>
                        <th className="px-8 py-6">Logic Mode</th>
                        <th className="px-8 py-6">Result Set</th>
                        <th className="px-8 py-6">Liquidity Pool</th>
                        <th className="px-8 py-6">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                     {history.length > 0 ? history.map((draw, i) => (
                        <tr key={i} className="group hover:bg-slate-900/20 transition-all">
                           <td className="px-8 py-8 font-black text-white uppercase tracking-tighter text-xl">{draw.month ?? 'N/A'}</td>
                           <td className="px-8 py-8">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-1.5 px-3 bg-slate-900 border border-slate-800 rounded-lg">{draw.mode ?? 'MODE'}</span>
                           </td>
                           <td className="px-8 py-8">
                              <div className="flex gap-2">
                                 {draw.draw_numbers.map((num: number, j: number) => (
                                    <div key={j} className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sm font-black text-white shadow-inner">
                                       {num}
                                    </div>
                                 ))}
                              </div>
                           </td>
                           <td className="px-8 py-8 font-black text-white text-lg">₹{draw.total_pool?.toLocaleString() ?? '0'}</td>
                           <td className="px-8 py-8">
                              <span className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                                 <CheckCircle2 className="w-3 h-3" /> Published
                              </span>
                           </td>
                        </tr>
                     )) : (
                        <tr>
                           <td colSpan={5} className="px-8 py-32 text-center">
                              <AlertCircle className="w-8 h-8 text-slate-700 mx-auto mb-4 opacity-50" />
                              <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Protocol Awaiting Initial Cycle Execution.</p>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </Card>
      </div>
    </div>
  );
}
