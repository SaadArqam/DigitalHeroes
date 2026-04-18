'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserCharityPreference, saveCharityPreference } from '@/app/actions/charities';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShieldCheck, Sparkles, AlertCircle, Save, Loader2, RefreshCw, Globe } from 'lucide-react';
import Navbar from '@/components/navbar';
import { PageContainer } from '@/components/ui/page-container';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function ModifyImpactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preference, setPreference] = useState<any>(null);
  const [percentage, setPercentage] = useState(10);

  useEffect(() => {
    async function load() {
      const res = await getUserCharityPreference();
      if (res.success && res.data) {
        setPreference(res.data);
        setPercentage(res.data.contribution_percentage);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleUpdate = async () => {
    setSaving(true);
    const res = await saveCharityPreference(preference.charity_id, percentage);
    if (res.success) {
      router.push('/dashboard');
    }
    setSaving(false);
  };

  if (loading) return (
     <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-end" />
     </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <Navbar />
      
      <PageContainer className="pt-24 pb-20">
         <div className="max-w-4xl mx-auto px-4">
            <header className="mb-16">
               <button 
                 onClick={() => router.back()}
                 className="flex items-center gap-2 text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] hover:text-white transition-colors mb-8 group"
               >
                 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
               </button>
               
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-4">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-end/10 border border-primary-end/20 rounded-full mb-2">
                        <Sparkles className="w-3 h-3 text-primary-end" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary-end">Impact Orchestration</span>
                     </div>
                     <h1 className="text-5xl lg:text-7xl font-black text-white tracking-[-0.05em] leading-[0.85]">
                       Modify <span className="text-gradient italic">Impact</span>
                     </h1>
                  </div>
                  
                  <Link href="/charities">
                     <Button variant="secondary" className="rounded-2xl border-slate-800 text-xs font-black uppercase tracking-widest px-8">
                        Change Partner
                     </Button>
                  </Link>
               </div>
            </header>

            {preference ? (
               <div className="grid gap-12">
                  {/* Current Partner Context */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                     <Card className="p-8 bg-card border border-card-border rounded-[3rem] shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-gradient opacity-[0.03] blur-[100px] pointer-events-none" />
                        <div className="flex flex-col md:flex-row items-center gap-10">
                           <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-2 border-slate-800 shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-700">
                              <img src={preference.charities?.image_url} alt={preference.charities?.name} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1 text-center md:text-left">
                              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                 <Globe className="w-3.5 h-3.5 text-primary-end" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Impact Partner</span>
                              </div>
                              <h3 className="text-3xl font-black text-white tracking-tight mb-3">{preference.charities?.name}</h3>
                              <p className="text-sm font-bold text-slate-500 leading-relaxed max-w-xl line-clamp-2 uppercase tracking-tighter">
                                 {preference.charities?.description}
                              </p>
                           </div>
                        </div>
                     </Card>
                  </motion.div>

                  {/* Weight Configuration */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                     <Card className="p-12 bg-[#0c0c12] border-2 border-slate-800 rounded-[3rem] shadow-2xl">
                        <div className="flex items-center justify-between mb-12">
                           <div>
                              <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1">Contribution Weight</h3>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Adjust Allocation Density</p>
                           </div>
                           <div className="text-6xl font-black text-primary-end tracking-tighter leading-none">
                              {percentage}%
                           </div>
                        </div>

                        <div className="space-y-12">
                           <div className="space-y-6">
                              <input 
                                 type="range" 
                                 min="10" 
                                 max="100" 
                                 step="5"
                                 value={percentage}
                                 onChange={(e) => setPercentage(Number(e.target.value))}
                                 className="w-full h-4 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-primary-end border border-slate-800 shadow-inner"
                              />
                              <div className="flex justify-between text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">
                                 <span>Protocol Baseline (10%)</span>
                                 <span>Total Allocation (100%)</span>
                              </div>
                           </div>

                           <div className="p-8 bg-slate-950/50 border border-slate-900 rounded-2xl flex items-start gap-6">
                              <AlertCircle className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                              <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                                 Modifying your impact weight redirects current protocol fees. This change will be final and active for the upcoming cycle.
                              </p>
                           </div>

                           <div className="flex gap-4">
                              <Button 
                                onClick={handleUpdate}
                                isLoading={saving}
                                className="flex-1 h-[64px] rounded-[2rem] font-black text-sm uppercase tracking-widest"
                                icon={<Save className="w-4 h-4" />}
                              >
                                Confirm Impact Update
                              </Button>
                           </div>
                        </div>
                     </Card>
                  </motion.div>
               </div>
            ) : (
               <div className="p-20 text-center border-2 border-dashed border-slate-800 rounded-[3rem]">
                  <h3 className="text-xl font-bold text-slate-500 mb-6 uppercase tracking-widest">Awaiting Initial Mission Sync</h3>
                  <Link href="/charities">
                     <Button variant="primary" className="rounded-2xl px-12">Choose Partner</Button>
                  </Link>
               </div>
            )}
         </div>
      </PageContainer>
    </div>
  );
}
