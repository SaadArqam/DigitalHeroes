'use client';

import { useState, useEffect } from 'react';
import { getAllWinners, updateWinnerStatus, getWinnerProofUrl } from '@/app/actions/admin';
import { 
  Trophy, CheckCircle, Clock, XCircle, CreditCard, 
  Eye, Loader2, ShieldCheck, Mail, Calendar, X,
  AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [opLoading, setOpLoading] = useState<string | null>(null);
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [isViewingProof, setIsViewingProof] = useState(false);

  // Confirmation States
  const [confirmingAction, setConfirmingAction] = useState<{ id: string, status: string } | null>(null);

  const { toast } = useToast();

  useEffect(() => { loadWinners(); }, []);

  async function loadWinners() {
    setLoading(true);
    try {
      const res = await getAllWinners();
      if (res.success) {
        setWinners(res.data || []);
      } else {
        toast(res.message, 'error');
      }
    } catch (err: any) {
      toast('Victory ledger synchronization failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleViewProof = async (filePath: string) => {
    setOpLoading(filePath);
    const signedUrl = await getWinnerProofUrl(filePath);
    if (signedUrl) {
      setSelectedProofUrl(signedUrl);
      setIsViewingProof(true);
    } else {
      toast('Could not generate secure link', 'error');
    }
    setOpLoading(null);
  };

  const handleExecuteAction = async () => {
    if (!confirmingAction) return;
    const { id, status } = confirmingAction;
    setOpLoading(id);
    const res = await updateWinnerStatus(id, status);
    if (res.success) {
      toast(res.message, 'success');
      await loadWinners();
    }
    setConfirmingAction(null);
    setOpLoading(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest leading-none"><CheckCircle className="w-3 h-3" /> Paid</span>;
      case 'verified': return <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-full text-[9px] font-black uppercase tracking-widest leading-none"><ShieldCheck className="w-3 h-3" /> Verified</span>;
      case 'pending': return <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[9px] font-black uppercase tracking-widest leading-none"><Clock className="w-3 h-3" /> Pending</span>;
      case 'rejected': return <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full text-[9px] font-black uppercase tracking-widest leading-none"><XCircle className="w-3 h-3" /> Rejected</span>;
      default: return <span className="px-3 py-1 bg-slate-800 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest leading-none">{status}</span>;
    }
  };

  if (loading) return (
     <div className="py-40 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Synchronizing Victory Ledger...</p>
     </div>
  );

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-5xl font-black text-white tracking-tight uppercase">Victory <span className="text-amber-500 italic">Ledger</span></h1>
        <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-widest">{winners.length} Claims Protocolled</p>
      </header>

      <Card variant="glass" className="overflow-hidden bg-[#0c0c12] border-slate-800 shadow-2xl rounded-[3rem] isolate">
        <div className="overflow-x-auto safari-scroll-fix">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-slate-900/50">
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Cycle</th>
                <th className="px-8 py-6">Victory Node</th>
                <th className="px-8 py-6">Vault Payout</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {winners.length > 0 ? winners.map((winner) => (
                <tr key={winner.id} className="group hover:bg-slate-900/40 transition-all duration-300">
                  <td className="px-8 py-8">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-white transition-colors">
                           <Mail className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight">{winner.profiles?.email ?? 'Unknown Citizen'}</span>
                     </div>
                  </td>
                  <td className="px-8 py-8">
                     <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs font-black uppercase tracking-tighter">{winner.draws?.month ?? 'N/A'}</span>
                     </div>
                  </td>
                  <td className="px-8 py-8">
                     <span className="text-xs font-black text-indigo-400 uppercase tracking-widest leading-none bg-indigo-500/5 px-2.5 py-1.5 rounded-lg border border-indigo-500/10">{winner.match_count ?? 0}-Match Hit</span>
                  </td>
                  <td className="px-8 py-8">
                     <span className="text-lg font-black text-white tracking-tighter">₹{winner.prize_amount?.toLocaleString() ?? '0'}</span>
                  </td>
                  <td className="px-8 py-8">
                     {getStatusBadge(winner.status)}
                  </td>
                  <td className="px-8 py-8 text-right">
                     <div className="flex items-center justify-end gap-2">
                        {winner.proof_url ? (
                           <button 
                             onClick={() => handleViewProof(winner.proof_url)}
                             disabled={opLoading === winner.proof_url}
                             className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-indigo-400 transition-all"
                           >
                              {opLoading === winner.proof_url ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                           </button>
                        ) : (
                           <span className="text-[10px] font-black text-slate-800 uppercase px-3 py-2 border border-dashed border-slate-800 rounded-xl">No Proof</span>
                        )}
                        
                        <div className="h-4 w-[1px] bg-slate-800 mx-2" />
                        
                        {winner.status === 'pending' && (
                           <div className="flex gap-2">
                              <button 
                                onClick={() => setConfirmingAction({ id: winner.id, status: 'verified' })}
                                className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-indigo-500 hover:border-indigo-500/50 transition-all"
                                title="Approve Verification"
                              >
                                 <ShieldCheck className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setConfirmingAction({ id: winner.id, status: 'rejected' })}
                                className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-rose-500 hover:border-rose-500/50 transition-all"
                                title="Reject Claim"
                              >
                                 <XCircle className="w-4 h-4" />
                              </button>
                           </div>
                        )}
                        
                        {winner.status === 'verified' && (
                           <button 
                             onClick={() => setConfirmingAction({ id: winner.id, status: 'paid' })}
                             className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/10 hover:bg-emerald-700 transition-all flex items-center gap-2"
                           >
                              <CreditCard className="w-4 h-4" /> Disburse
                           </button>
                        )}
                     </div>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={6} className="px-8 py-32 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-slate-900 border border-slate-800 text-slate-700 mb-6">
                         <AlertCircle className="w-8 h-8 opacity-20" />
                      </div>
                      <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">No winners yet. Run a draw to synchronize the ledger.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation Modal */}
      {confirmingAction && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <Card className="p-10 bg-[#0c0c12] border-2 border-slate-800 rounded-[3rem] max-w-md w-full shadow-glow">
               <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 mb-8 mx-auto">
                  <AlertCircle className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-black text-white text-center uppercase tracking-tight mb-4">Protocol Authentication</h3>
               <p className="text-sm font-bold text-slate-500 text-center leading-relaxed uppercase tracking-tighter mb-10">
                  You are about to change this victory status to <span className="text-white">{confirmingAction.status.toUpperCase()}</span>. This operation will be synchronized across the ledger.
               </p>
               <div className="flex gap-4">
                  <Button variant="secondary" onClick={() => setConfirmingAction(null)} className="flex-1 rounded-2xl h-14 border-slate-800">Abort</Button>
                  <Button onClick={handleExecuteAction} isLoading={!!opLoading} className="flex-1 rounded-2xl h-14 bg-indigo-600 hover:bg-indigo-700">Confirm Trace</Button>
               </div>
            </Card>
         </div>
      )}

      {/* Victory Proof Terminal (Signed URL Viewport) */}
      {isViewingProof && selectedProofUrl && (
         <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 md:p-24 bg-black/95 backdrop-blur-2xl animate-in zoom-in duration-500 overflow-hidden">
            <button onClick={() => { setIsViewingProof(false); setSelectedProofUrl(null); }} className="absolute top-12 right-12 p-4 bg-white/10 rounded-full text-white hover:bg-rose-500 transition-all z-[120]">
               <X className="w-8 h-8" />
            </button>
            <div className="relative max-w-7xl w-full h-full p-4 bg-[#0a0a0f] border-2 border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl flex items-center justify-center">
               <img src={selectedProofUrl} className="max-w-full max-h-full object-contain rounded-2xl shadow-inner" alt="Victory Verification Matrix" />
               <div className="absolute bottom-10 left-10 p-6 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-2xl hidden md:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Proof Stream</p>
                  <p className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                     Identity: Root Verified <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  </p>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
