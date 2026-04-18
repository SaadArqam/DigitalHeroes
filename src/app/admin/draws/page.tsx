'use client';

import { useState, useEffect } from 'react';
import { createDraw, simulateDraw, publishDraw, getDrawHistory } from '@/app/actions/draws';
import { 
  Play, FlaskConical, Trophy, 
  Settings, Loader2, AlertCircle, CheckCircle2 
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
        <Loader2 className="w-10 h-10 animate-spin text-[#00FFA3] mx-auto mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B949E]">Synchronizing Draw Registry...</p>
     </div>
  );

  return (
    <div className="space-y-12">
      <header>
        <div className="flex items-center gap-2 mb-3">
           <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B949E]">Phase: Terminal Executive</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">Draw <span className="text-gradient">Protocol</span></h1>
      </header>

      <div className="grid grid-cols-1 gap-12">
         {/* Creation Deck */}
         <Card className="p-8 lg:p-12 bg-[#0D1117] border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED]/5 rounded-full blur-[100px] pointer-events-none" />
            
            <h3 className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest mb-10 flex items-center gap-2 leading-none">
               <Settings className="w-4 h-4 text-[#7C3AED]" /> Initialize New Cycle
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative z-10">
               <div className="lg:col-span-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8B949E] block mb-3 leading-none italic">Target Cycle Month</label>
                  <input 
                    type="month" 
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-6 py-5 bg-[#05070A] border border-white/10 rounded-xl text-white font-black uppercase tracking-widest focus:outline-none focus:border-[#7C3AED] transition-all [color-scheme:dark]"
                  />
               </div>
               <div className="lg:col-span-5">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8B949E] block mb-3 leading-none italic">Generation Logic</label>
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#05070A] border border-white/10 rounded-xl">
                    <button 
                      onClick={() => setMode('random')}
                      className={`py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'random' ? 'bg-[#7C3AED] text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]' : 'text-[#8B949E] hover:text-white'}`}
                    >
                      Stochastic (7)
                    </button>
                    <button 
                      onClick={() => setMode('algorithmic')}
                      className={`py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mode === 'algorithmic' ? 'bg-[#7C3AED] text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]' : 'text-[#8B949E] hover:text-white'}`}
                    >
                      Weighted (Θ)
                    </button>
                  </div>
               </div>
               <div className="lg:col-span-3">
                  <Button onClick={handleCreate} isLoading={opLoading} className="w-full h-16 rounded-xl font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(0,255,163,0.1)]">
                    Create Draw
                  </Button>
               </div>
            </div>
         </Card>

         {/* Simulation Viewport */}
         {simulation && (
            <Card className="p-8 lg:p-12 bg-[#00FFA3]/5 border border-[#00FFA3]/30 rounded-2xl animate-in fade-in slide-in-from-top-6 duration-500">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12">
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 bg-[#05070A] border border-[#00FFA3]/30 rounded-2xl flex items-center justify-center text-[#00FFA3] shadow-[0_0_15px_rgba(0,255,163,0.1)]">
                        <FlaskConical className="w-7 h-7" />
                     </div>
                     <div>
                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none mb-1.5">Simulation <span className="text-[#00FFA3]">Output</span></h4>
                        <p className="text-[10px] font-black text-[#00FFA3] uppercase tracking-[0.4em]">Stochastic Validation Node</p>
                     </div>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                     <button onClick={() => setSimulation(null)} className="flex-1 md:flex-none h-14 px-8 rounded-xl font-black uppercase tracking-widest text-[#8B949E] border border-white/10 bg-[#05070A] hover:text-white">Abort</button>
                     <Button onClick={handlePublish} isLoading={opLoading} className="flex-1 md:flex-none h-14 px-8 rounded-xl bg-[#00FFA3] text-[#05070A] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,163,0.3)]">Sync Ledger</Button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-[#05070A] border border-white/5 rounded-2xl flex flex-col justify-between">
                     <p className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest mb-6 italic">Outcome Seq.</p>
                     <div className="flex gap-1.5 flex-wrap">
                        {simulation.drawNumbers.map((num: number, i: number) => (
                           <div key={i} className="w-8 h-8 rounded-lg bg-[#00FFA3]/10 border border-[#00FFA3]/30 flex items-center justify-center font-black text-[#00FFA3] text-xs">
                              {num}
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="p-6 bg-[#05070A] border border-white/5 rounded-2xl flex flex-col justify-between">
                     <p className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest mb-6 italic">Victors</p>
                     <p className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{simulation.winners.length}</p>
                  </div>
                  <div className="p-6 bg-[#05070A] border border-white/5 rounded-2xl flex flex-col justify-between">
                     <p className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest mb-6 italic">Execution Pool</p>
                     <p className="text-4xl font-black text-white tracking-tighter uppercase leading-none">₹{simulation.totalPool.toLocaleString()}</p>
                  </div>
                  <div className="p-6 bg-[#05070A] border border-white/5 rounded-2xl flex flex-col justify-between">
                     <p className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest mb-6 italic">Rollover</p>
                     <p className="text-4xl font-black text-[#00FFA3] tracking-tighter uppercase leading-none">₹{simulation.jackpotRollover.toLocaleString()}</p>
                  </div>
               </div>
            </Card>
         )}

         {/* History Stream */}
         <Card className="overflow-hidden bg-[#0D1117] border-white/5 rounded-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
               <div className="flex items-center gap-4">
                  <Trophy className="w-6 h-6 text-[#7C3AED]" />
                  <div>
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1.5 italic">Manifest <span className="text-[#7C3AED]">History</span></h3>
                     <p className="text-[10px] font-black text-[#8B949E] uppercase tracking-[0.3em]">Registry Ledger</p>
                  </div>
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                     <tr className="border-b border-white/5 bg-[#05070A] text-[9px] font-black text-[#8B949E] uppercase tracking-[0.4em]">
                        <th className="px-8 py-6">Month Cycle</th>
                        <th className="px-8 py-6">Logic Logic</th>
                        <th className="px-8 py-6">Execution Vector</th>
                        <th className="px-8 py-6">Liquidity Pool</th>
                        <th className="px-8 py-6">Registry Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {history.length > 0 ? history.map((draw, i) => (
                        <tr key={i} className="group hover:bg-white/[0.02] transition-all">
                           <td className="px-8 py-8 font-black text-white uppercase tracking-tighter text-xl italic">{draw.month ?? 'NULL'}</td>
                           <td className="px-8 py-8">
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#8B949E] py-1.5 px-3 bg-[#05070A] border border-white/5 rounded-lg">{draw.mode || 'STOCH'}</span>
                           </td>
                           <td className="px-8 py-8">
                              <div className="flex gap-1.5">
                                 {draw.draw_numbers.map((num: number, j: number) => (
                                    <div key={j} className="w-9 h-9 rounded-lg bg-[#05070A] border border-white/5 flex items-center justify-center text-[10px] font-black text-[#8B949E] group-hover:text-white group-hover:border-[#00FFA3]/30 transition-all">
                                       {num}
                                    </div>
                                 ))}
                              </div>
                           </td>
                           <td className="px-8 py-8 font-black text-white text-lg uppercase tracking-tighter">₹{draw.total_pool?.toLocaleString() ?? '0'}</td>
                           <td className="px-8 py-8">
                              <span className="flex items-center gap-2 px-3 py-1.5 bg-[#00FFA3]/5 text-[#00FFA3] border border-[#00FFA3]/20 rounded-lg text-[8px] font-black uppercase tracking-widest">
                                 <CheckCircle2 className="w-3.5 h-3.5" /> Published
                              </span>
                           </td>
                        </tr>
                     )) : (
                        <tr>
                           <td colSpan={5} className="px-8 py-40 text-center">
                              <AlertCircle className="w-10 h-10 text-[#8B949E] mx-auto mb-6 opacity-20" />
                              <p className="text-[#8B949E] font-black uppercase tracking-[0.4em] text-[10px]">Awaiting Core Execution Protocol</p>
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
