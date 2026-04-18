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
      case 'paid': return <span className="flex items-center gap-1.5 px-3 py-1 bg-[#00FFA3]/5 text-[#00FFA3] border border-[#00FFA3]/20 rounded-lg text-[8px] font-black uppercase tracking-widest leading-none"><CheckCircle className="w-3.5 h-3.5" /> Paid</span>;
      case 'verified': return <span className="flex items-center gap-1.5 px-3 py-1 bg-[#7C3AED]/5 text-[#7C3AED] border border-[#7C3AED]/20 rounded-lg text-[8px] font-black uppercase tracking-widest leading-none"><ShieldCheck className="w-3.5 h-3.5" /> Verified</span>;
      case 'pending': return <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/5 text-amber-500 border border-amber-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest leading-none"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case 'rejected': return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/5 text-red-500 border border-red-500/20 rounded-lg text-[8px] font-black uppercase tracking-widest leading-none"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
      default: return <span className="px-3 py-1 bg-[#05070A] text-[#8B949E] rounded-lg text-[8px] font-black uppercase tracking-widest leading-none border border-white/5">{status}</span>;
    }
  };

  if (loading) return (
     <div className="py-40 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#00FFA3] mx-auto mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B949E]">Synchronizing Victory Ledger...</p>
     </div>
  );

  return (
    <div className="space-y-12">
      <header>
        <div className="flex items-center gap-2 mb-3">
           <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B949E]">Status: Claims Registry Active</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">Victory <span className="text-gradient">Ledger</span></h1>
        <p className="text-[#8B949E] font-black mt-4 uppercase text-[10px] tracking-[0.3em] font-black">{winners.length} SECURE CLAIMS LOGGED</p>
      </header>

      <Card className="overflow-hidden bg-[#0D1117] border-white/5 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#05070A] text-[9px] font-black text-[#8B949E] uppercase tracking-[0.4em] border-b border-white/5">
                <th className="px-8 py-6">Identity Node</th>
                <th className="px-8 py-6">Cycle</th>
                <th className="px-8 py-6">Match Vector</th>
                <th className="px-8 py-6">Vault Payout</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Registry Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {winners.length > 0 ? winners.map((winner) => (
                <tr key={winner.id} className="group hover:bg-white/[0.02] transition-all duration-300">
                  <td className="px-8 py-8">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#05070A] border border-white/5 flex items-center justify-center text-[#8B949E] group-hover:text-white group-hover:border-[#00FFA3]/30 transition-all">
                           <Mail className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-black text-white tracking-tight uppercase italic leading-none">{winner.profiles?.email ?? 'Unknown'}</span>
                     </div>
                  </td>
                  <td className="px-8 py-8">
                     <div className="flex items-center gap-2 text-[#8B949E]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">{winner.draws?.month ?? 'NULL'}</span>
                     </div>
                  </td>
                  <td className="px-8 py-8">
                     <span className="text-[9px] font-black text-[#7C3AED] uppercase tracking-widest leading-none bg-[#7C3AED]/5 px-2.5 py-1.5 rounded-lg border border-[#7C3AED]/20">{winner.match_count ?? 0}-Match Vector</span>
                  </td>
                  <td className="px-8 py-8">
                     <span className="text-xl font-black text-white tracking-tighter uppercase leading-none">₹{winner.prize_amount?.toLocaleString() ?? '0'}</span>
                  </td>
                  <td className="px-8 py-8">
                     {getStatusBadge(winner.status)}
                  </td>
                  <td className="px-8 py-8 text-right">
                     <div className="flex items-center justify-end gap-3">
                        {winner.proof_url ? (
                           <button 
                             onClick={() => handleViewProof(winner.proof_url)}
                             disabled={opLoading === winner.proof_url}
                             className="p-2.5 bg-[#05070A] border border-white/5 rounded-lg text-[#8B949E] hover:text-[#00FFA3] hover:border-[#00FFA3]/30 transition-all shadow-inner"
                           >
                              {opLoading === winner.proof_url ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                           </button>
                        ) : (
                           <span className="text-[8px] font-black text-[#3e454d] uppercase tracking-[0.3em] px-3 py-2 border border-dashed border-white/5 rounded-lg">No Evidence</span>
                        )}
                        
                        <div className="h-4 w-[1px] bg-white/5 mx-1" />
                        
                        {winner.status === 'pending' && (
                           <div className="flex gap-2">
                              <button 
                                onClick={() => setConfirmingAction({ id: winner.id, status: 'verified' })}
                                className="p-2.5 bg-[#05070A] border border-white/5 rounded-lg text-[#8B949E] hover:text-[#7C3AED] hover:border-[#7C3AED]/30 transition-all shadow-inner"
                                title="Approve Verification"
                              >
                                 <ShieldCheck className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setConfirmingAction({ id: winner.id, status: 'rejected' })}
                                className="p-2.5 bg-[#05070A] border border-white/5 rounded-lg text-[#8B949E] hover:text-red-500 hover:border-red-500/30 transition-all shadow-inner"
                                title="Reject Claim"
                              >
                                 <XCircle className="w-4 h-4" />
                              </button>
                           </div>
                        )}
                        
                        {winner.status === 'verified' && (
                           <button 
                             onClick={() => setConfirmingAction({ id: winner.id, status: 'paid' })}
                             className="px-6 h-12 bg-[#00FFA3] text-[#05070A] rounded-lg text-[9px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,255,163,0.2)] hover:bg-[#00ff8c] transition-all flex items-center gap-2"
                           >
                              <CreditCard className="w-4 h-4" /> Disburse
                           </button>
                        )}
                     </div>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={6} className="px-8 py-40 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0D1117] border border-white/5 text-[#8B949E] mb-6 shadow-inner">
                         <AlertCircle className="w-8 h-8 opacity-20" />
                      </div>
                      <p className="text-[#8B949E] font-black uppercase tracking-[0.4em] text-[10px]">No Victory Nodes Detected In Ledger</p>
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
            <Card className="p-8 lg:p-12 bg-[#0D1117] border border-white/10 rounded-2xl max-w-lg w-full shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/5 rounded-full blur-[60px] pointer-events-none" />
               <div className="w-16 h-16 rounded-xl bg-[#05070A] border border-white/5 flex items-center justify-center text-[#7C3AED] mb-8 mx-auto shadow-inner">
                  <AlertCircle className="w-8 h-8" />
               </div>
               <h3 className="text-3xl font-black text-white text-center uppercase tracking-tighter mb-4 italic leading-none">Registry <span className="text-[#7C3AED]">Override</span></h3>
               <p className="text-[10px] font-black text-[#8B949E] text-center leading-relaxed uppercase tracking-[0.2em] mb-10">
                  You are about to modify claim status to <span className="text-white bg-white/5 px-2 py-0.5 rounded italic">{confirmingAction.status.toUpperCase()}</span>. This operation is definitive and ledger-synchronized.
               </p>
               <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setConfirmingAction(null)} className="h-14 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#8B949E] border border-white/5 bg-[#05070A] hover:text-white">Abort</button>
                  <Button onClick={handleExecuteAction} isLoading={!!opLoading} className="h-14 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[#7C3AED] text-white">Execute Sync</Button>
               </div>
            </Card>
         </div>
      )}

      {/* Victory Proof Terminal */}
      {isViewingProof && selectedProofUrl && (
         <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#05070A]/95 backdrop-blur-xl animate-in fade-in duration-500 overflow-hidden">
            <button onClick={() => { setIsViewingProof(false); setSelectedProofUrl(null); }} className="absolute top-8 right-8 p-3 bg-white/5 border border-white/10 rounded-full text-[#8B949E] hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all z-[120]">
               <X className="w-8 h-8" />
            </button>
            <div className="relative max-w-7xl w-full h-[90vh] p-4 bg-[#0D1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center relative">
               <img src={selectedProofUrl} className="max-w-full max-h-full object-contain rounded-lg opacity-90" alt="Victory Verification Matrix" />
               <div className="absolute bottom-10 left-10 p-6 bg-[#05070A]/90 backdrop-blur-md border border-white/5 rounded-xl hidden md:block">
                  <p className="text-[9px] font-black text-[#565f6a] uppercase tracking-[0.4em] mb-2 leading-none italic">Evidence Stream</p>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 italic">
                     Identity: Root Verified <ShieldCheck className="w-4 h-4 text-[#00FFA3]" />
                  </p>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
