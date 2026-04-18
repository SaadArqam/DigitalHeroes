'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserSubscription } from '@/app/actions/subscriptions';
import { getScores, deleteScore } from '@/app/actions/scores';
import { getUserCharityPreference } from '@/app/actions/charities';
import { getUserDrawResults } from '@/app/actions/draws';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { ScoresCard } from '@/components/dashboard/ScoresCard';
import { CharityCard } from '@/components/dashboard/CharityCard';
import { WinningsCard } from '@/components/dashboard/WinningsCard';
import { DrawsCard } from '@/components/dashboard/DrawsCard';
import { CharitySelector } from '@/components/dashboard/CharitySelector';
import ScoreEntry from '@/components/score-entry';
import ScoreManager from '@/components/score-manager';
import { Loader2, RefreshCw, Plus, Shield, Activity } from 'lucide-react';

function DashboardContentComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [editingScore, setEditingScore] = useState<any>(null);

  const [subscription, setSubscription] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [charityPrefs, setCharityPrefs] = useState<any[]>([]);
  const [drawResults, setDrawResults] = useState<any[]>([]);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccessBanner(true);
      toast('Elite Status Activated', 'success');
      router.replace('/dashboard');
    }
    fetchAllData();
  }, [searchParams]);

  const fetchAllData = async () => {
    setLoading(true);
    await syncData();
    setLoading(false);
  };

  const syncData = async () => {
    setSyncing(true);
    try {
      const [subRes, scoreRes, charityRes, drawRes] = await Promise.all([
        getUserSubscription(),
        getScores(),
        getUserCharityPreference(),
        getUserDrawResults(),
      ]);
      
      if (subRes.success) setSubscription(subRes.data);
      setScores(scoreRes || []);
      if (charityRes.success) setCharityPrefs(charityRes.data ? [charityRes.data] : []);
      setDrawResults(drawRes || []);
      
    } catch (err: any) {
      toast('Sync Failed', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleEditScore = (score: any) => {
    setEditingScore(score);
    setShowScoreModal(true);
  };

  const handleDeleteScore = async (id: string) => {
    if (confirm('Verify: Permanent Deletion of Score Protocol. Execute?')) {
      const res = await deleteScore(id);
      if (res.success) {
        toast('Ledger entry purged', 'success');
        syncData();
      } else {
        toast(res.message ?? 'Purge failure', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#00FFA3] mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#8B949E]">Synchronizing Interface...</p>
      </div>
    );
  }

  const hasSelectedCharity = charityPrefs.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 lg:py-12 animate-in fade-in duration-700">
      {!hasSelectedCharity ? (
        <div className="max-w-4xl mx-auto pt-12">
          <header className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-none">Choose Your <span className="text-[#00FFA3]">Impact</span></h1>
            <p className="text-[#8B949E] text-lg font-bold tracking-tight uppercase tracking-widest">Every performance contributes to a global cause.</p>
          </header>
          <CharitySelector onComplete={syncData} />
        </div>
      ) : (
        <div className="space-y-12">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00FFA3]/5 border border-[#00FFA3]/20 rounded-full mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#00FFA3]">Protocol Status: Active</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-4 uppercase">
                Terminal <span className="text-gradient">Registry</span>
              </h1>
              <p className="text-[#8B949E] text-sm font-black uppercase tracking-[0.2em]">Connected to decentralized prize node.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button onClick={syncData} variant="secondary" size="icon" isLoading={syncing} className="w-14 h-14 rounded-xl">
                <RefreshCw className="w-5 h-5 text-[#8B949E]" />
              </Button>
              <Button onClick={() => setShowScoreModal(true)} variant="primary" size="lg" className="h-14 px-10 rounded-xl" icon={<Plus className="w-5 h-5" />}>
                Log Metric
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showSuccessBanner && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-50">
                <div className="bg-[#00FFA3] rounded-2xl p-8 shadow-[0_0_50px_rgba(0,255,163,0.3)] flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-xl bg-[#05070A] flex items-center justify-center shadow-inner"><Shield className="w-7 h-7 text-[#00FFA3]" /></div>
                    <div>
                      <h3 className="text-2xl font-black text-[#05070A] uppercase tracking-tighter">Elite Verification Confirmed</h3>
                      <p className="text-[#05070A]/70 font-black uppercase text-[10px] tracking-widest mt-1">Terminal protocols fully authorized for payout participation.</p>
                    </div>
                  </div>
                  <Button onClick={() => setShowSuccessBanner(false)} variant="ghost" className="text-[#05070A] hover:bg-black/5 border-2 border-black/10">Acknowledge</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-8">
              <DrawsCard latestDraw={drawResults[0]?.draws} userResult={drawResults[0]} />
              <div className="grid md:grid-cols-2 gap-8">
                <ScoresCard 
                  scores={scores} 
                  onAddClick={() => { setEditingScore(null); setShowScoreModal(true); }}
                  onEditClick={handleEditScore}
                  onDeleteClick={handleDeleteScore}
                />
                <WinningsCard results={drawResults} />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <SubscriptionCard subscription={subscription} />
              <CharityCard 
                preference={charityPrefs[0] || null} 
                planAmount={subscription?.plan === 'yearly' ? 500 : 50} 
              />
            </div>
          </div>

          {/* Historical Ledger */}
          <section className="pt-16 border-t border-white/5">
            <div className="flex items-center gap-4 mb-8">
               <Activity className="w-7 h-7 text-[#7C3AED]" />
               <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Temporal <span className="text-gradient">Ledger</span></h2>
            </div>
            <ScoreManager />
          </section>
        </div>
      )}

      <Modal isOpen={showScoreModal} onClose={() => { setShowScoreModal(false); setEditingScore(null); }} title={editingScore ? "Override Metric" : "New Performance Metric"}>
        <ScoreEntry initialData={editingScore} onScoreAdded={() => { setShowScoreModal(false); setEditingScore(null); syncData(); }} />
      </Modal>
    </div>
  );
}

export default function DashboardContent() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#00FFA3]" /></div>}>
      <DashboardContentComponent />
    </Suspense>
  );
}
