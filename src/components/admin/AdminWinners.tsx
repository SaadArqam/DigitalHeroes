'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle, XCircle, Clock, Eye, Download, Search, Mail, ExternalLink, ShieldCheck, Calendar } from 'lucide-react';
import { updateWinnerStatus } from '@/app/actions/admin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface AdminWinnersProps {
  winners: any[];
  onRefresh: () => void;
}

export function AdminWinners({ winners, onRefresh }: AdminWinnersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpdateStatus = async (id: string, status: 'verified' | 'rejected' | 'paid') => {
    setLoadingId(id);
    try {
      const res = await updateWinnerStatus(id, status);
      if (res.success) {
        toast(`Winner status updated: ${status}`, 'success');
        onRefresh();
      } else {
        toast(res.message ?? 'Unknown error', 'error');
      }
    } finally {
      setLoadingId(null);
    }
  };

  const filteredWinners = (winners || []).filter(w => 
    w.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="relative mb-8">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search victors by email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-base shadow-sm"
        />
      </div>

      <div className="grid gap-6">
        {filteredWinners.map((winner) => (
          <motion.div 
            layout
            key={winner.id}
            className="group p-8 bg-white border border-slate-50 rounded-[3rem] hover:shadow-2xl transition-all duration-500"
          >
            <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center">
               <div className="flex items-center gap-6 flex-1">
                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center font-black shadow-lg shadow-indigo-100 ${
                    winner.match_count === 5 ? 'bg-primary-gradient text-white' : 'bg-slate-50 text-indigo-600'
                  }`}>
                     <div className="flex flex-col items-center leading-none">
                        <span className="text-2xl">{winner.match_count}</span>
                        <span className="text-[9px] uppercase tracking-widest mt-1">Hits</span>
                     </div>
                  </div>
                  <div>
                     <div className="flex items-center gap-3 mb-1.5">
                        <h4 className="font-black text-slate-900 text-xl tracking-tight">{winner.profiles?.email}</h4>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                           Tier: {winner.prize_tier}
                        </span>
                     </div>
                     <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-amber-500" /> ₹{winner.winnings.toLocaleString()}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(winner.created_at).toLocaleDateString()}</span>
                     </div>
                  </div>
               </div>

               <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                  {/* Status Indicator */}
                  <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-black text-xs uppercase tracking-widest ${
                    winner.status === 'verified' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                    winner.status === 'paid' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                    winner.status === 'rejected' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                    'bg-amber-50 border-amber-100 text-amber-600'
                  }`}>
                     {winner.status === 'verified' ? <CheckCircle className="w-4 h-4" /> :
                      winner.status === 'paid' ? <ShieldCheck className="w-4 h-4" /> :
                      winner.status === 'rejected' ? <XCircle className="w-4 h-4" /> :
                      <Clock className="w-4 h-4" />}
                     {winner.status}
                  </div>

                  {/* Proof Check */}
                  {winner.proof_url && (
                    <a 
                      href={winner.proof_url} 
                      target="_blank" 
                      className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                    >
                      <Eye className="w-4 h-4" /> View Proof
                    </a>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                     {winner.status === 'pending' && (
                       <>
                         <Button 
                           onClick={() => handleUpdateStatus(winner.id, 'verified')}
                           disabled={loadingId === winner.id}
                           variant="secondary"
                           className="rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600 border-none"
                         >
                            Approve
                         </Button>
                         <Button 
                           onClick={() => handleUpdateStatus(winner.id, 'rejected')}
                           disabled={loadingId === winner.id}
                           variant="secondary"
                           className="rounded-2xl border-rose-100 text-rose-500 hover:bg-rose-50"
                         >
                            Reject
                         </Button>
                       </>
                     )}
                     {winner.status === 'verified' && (
                       <Button 
                         onClick={() => handleUpdateStatus(winner.id, 'paid')}
                         disabled={loadingId === winner.id}
                         variant="primary"
                         className="rounded-2xl"
                       >
                          Mark Paid
                       </Button>
                     )}
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
        {filteredWinners.length === 0 && (
          <div className="py-20 text-center opacity-40">
             <Trophy className="w-16 h-16 mx-auto mb-6 text-slate-300" />
             <h3 className="text-xl font-black text-slate-800">No victory records</h3>
             <p className="text-slate-400 font-medium">Victories will materialize once the next draw is complete.</p>
          </div>
        )}
      </div>
    </div>
  );
}
