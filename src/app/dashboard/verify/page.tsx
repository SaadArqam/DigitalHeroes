'use client';

import { useState, useEffect } from 'react';
import { getPendingVerifications, uploadProof } from '@/app/actions/verification';
import { 
  ShieldCheck, Upload, Image as ImageIcon, CheckCircle, 
  Loader2, Trophy, Clock, XCircle, ChevronRight, AlertCircle,
  FileSearch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PageContainer } from '@/components/ui/page-container';
import Link from 'next/link';

export default function VerificationPage() {
  const [wins, setWins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => { loadWins(); }, []);

  async function loadWins() {
    setLoading(true);
    const data = await getPendingVerifications();
    setWins(data);
    setLoading(false);
  }

  const handleUpload = async (drawResultId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(drawResultId);
    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadProof(drawResultId, formData);
    if (res.success) {
      toast('Verification Matrix Synchronized', 'success');
      await loadWins();
    } else {
      toast(res.message ?? 'Unknown error', 'error');
    }
    setUploading(null);
  };

  if (loading) return (
     <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
     </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      
      <PageContainer className="pt-24 pb-20">
         <div className="max-w-4xl mx-auto px-4">
            <header className="mb-16">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Node Status: Secure Verification</span>
               </div>
               <h1 className="text-5xl lg:text-7xl font-black tracking-[-0.05em] leading-[0.85] text-white">
                 Victory <span className="text-emerald-500 italic">Auth</span>
               </h1>
            </header>

            <div className="space-y-8">
               {wins.length > 0 ? wins.map((win) => (
                  <Card key={win.id} className="p-8 bg-[#0c0c12] border-2 border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden relative group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] pointer-events-none" />
                     
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                              <Trophy className="w-8 h-8" />
                           </div>
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cycle: {win.draws?.month}</span>
                                 {win.proof_url ? (
                                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md text-[8px] font-black uppercase">Pending Approval</span>
                                 ) : (
                                    <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-md text-[8px] font-black uppercase">Action Required</span>
                                 )}
                              </div>
                              <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1">₹{win.prize_amount.toLocaleString()} Payout</h3>
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{win.match_count}-Match Performance Hit</p>
                           </div>
                        </div>

                        <div className="w-full md:w-auto">
                           {win.proof_url ? (
                              <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 font-black text-xs uppercase tracking-widest">
                                 <ShieldCheck className="w-4 h-4" /> Proof Synchronized
                              </div>
                           ) : (
                              <div className="relative">
                                 <input 
                                   type="file" 
                                   id={`file-${win.id}`}
                                   accept="image/*"
                                   onChange={(e) => handleUpload(win.id, e)}
                                   className="hidden"
                                 />
                                 <label 
                                   htmlFor={`file-${win.id}`}
                                   className="flex items-center justify-center gap-3 px-8 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest cursor-pointer shadow-xl shadow-indigo-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                 >
                                    {uploading === win.id ? (
                                       <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                       <>
                                          <Upload className="w-4 h-4" /> Upload Verification Proof
                                       </>
                                    )}
                                 </label>
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="mt-8 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                        <div className="flex items-start gap-3 max-w-lg">
                           <AlertCircle className="w-5 h-5 text-slate-600 mt-0.5" />
                           <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-tighter">
                              Upload a high-fidelity image reflecting your winning performance ledger or streak. Verification protocols typically require 24-48 hours.
                           </p>
                        </div>
                        {win.status === 'rejected' && (
                           <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                              <XCircle className="w-4 h-4" /> Previous Proof Rejected. Re-upload Required.
                           </div>
                        )}
                     </div>
                  </Card>
               )) : (
                  <div className="py-32 text-center border-2 border-dashed border-slate-800 rounded-[3rem]">
                     <FileSearch className="w-12 h-12 text-slate-700 mx-auto mb-6 opacity-30" />
                     <h3 className="text-xl font-bold text-slate-500 mb-2 uppercase tracking-widest">No Pending Auth Requests</h3>
                     <p className="text-slate-700 font-bold uppercase tracking-widest text-[10px] mb-8">Maintain performance streaks to identify victory nodes.</p>
                     <Link href="/dashboard">
                        <Button variant="secondary" className="rounded-2xl px-12 border-slate-800">Return to Terminal</Button>
                     </Link>
                  </div>
               )}
            </div>
         </div>
      </PageContainer>
    </div>
  );
}
