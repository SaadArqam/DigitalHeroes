'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCharityById, saveCharityPreference, getUserCharityPreference } from '@/app/actions/charities';
import { Charity } from '@/lib/types';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Heart, Sparkles, AlertCircle, Save, Loader2 } from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { Button } from '@/components/ui/button';

export default function CharityDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [charity, setCharity] = useState<Charity | null>(null);
  const [percentage, setPercentage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);

  useEffect(() => {
    async function load() {
      const [charityRes, prefRes] = await Promise.all([
        getCharityById(id as string),
        getUserCharityPreference()
      ]);

      if (charityRes.success) {
        setCharity(charityRes.data);
      }
      
      if (prefRes.success && prefRes.data) {
        if (prefRes.data.charity_id === id) {
          setIsCurrent(true);
          setPercentage(prefRes.data.contribution_percentage);
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const res = await saveCharityPreference(id as string, percentage);
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

  if (!charity) return <div className="text-white p-20 text-center">Protocol Integrity Error: Mission not found.</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      
      <PageContainer className="pt-24 pb-20">
         <div className="max-w-5xl mx-auto px-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors mb-12"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Missions
            </button>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
               {/* Gallery Section */}
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="space-y-8"
               >
                  <div className="aspect-[4/3] rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl relative">
                     <img 
                       src={charity.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb35ec6e?q=80&w=800'} 
                       alt={charity.name} 
                       className="w-full h-full object-cover"
                     />
                     {charity.is_featured && (
                        <div className="absolute top-8 right-8">
                           <div className="bg-primary-gradient px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 shadow-2xl">
                              <Sparkles className="w-4 h-4" /> Platinum Status
                           </div>
                        </div>
                     )}
                  </div>
                  
                  <div className="p-10 bg-card border border-card-border rounded-[3rem] space-y-4">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-2">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Verified Organization</span>
                     </div>
                     <h2 className="text-3xl font-black text-white tracking-tight leading-none">{charity.name}</h2>
                     <p className="text-slate-400 font-bold text-lg leading-relaxed">
                        {charity.description}
                     </p>
                  </div>
               </motion.div>

               {/* Interaction Section */}
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="space-y-8 lg:sticky lg:top-32"
               >
                  <Card className="p-10 bg-[#0c0c12] border-2 border-slate-800 rounded-[3rem] shadow-2xl shadow-indigo-900/10">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                          <Heart className="w-6 h-6 fill-rose-500/10" />
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-white tracking-tight leading-none mb-1">Impact Weight</h3>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Distribution</p>
                        </div>
                     </div>

                     <div className="space-y-12">
                        <div className="space-y-6">
                           <div className="flex justify-between items-end">
                              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Contribution Range</label>
                              <span className="text-4xl font-black text-white leading-none">{percentage}%</span>
                           </div>
                           <input 
                              type="range" 
                              min="10" 
                              max="100" 
                              step="5"
                              value={percentage}
                              onChange={(e) => setPercentage(Number(e.target.value))}
                              className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-primary-end border border-slate-800"
                           />
                           <div className="flex justify-between text-[10px] font-black text-slate-700 uppercase tracking-widest">
                              <span>Minimal Impact</span>
                              <span>Total Sync</span>
                           </div>
                        </div>

                        <div className="bg-slate-950/50 p-6 border border-slate-900 rounded-2xl space-y-4">
                           <div className="flex items-start gap-4">
                              <AlertCircle className="w-5 h-5 text-indigo-500 mt-0.5" />
                              <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">
                                 Your selection dictates the allocation of your protocol fees. Changing partners takes effect in the next billing cycle.
                              </p>
                           </div>
                        </div>

                        <Button 
                           onClick={handleSave}
                           isLoading={saving}
                           variant={isCurrent ? 'secondary' : 'primary'}
                           className="w-full h-[64px] rounded-[2rem] text-sm font-black uppercase tracking-widest"
                           icon={isCurrent ? <ShieldCheck className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        >
                           {isCurrent ? 'Sync Impact Updated' : 'Support This Mission'}
                        </Button>
                     </div>
                  </Card>
               </motion.div>
            </div>
         </div>
      </PageContainer>
    </div>
  );
}
