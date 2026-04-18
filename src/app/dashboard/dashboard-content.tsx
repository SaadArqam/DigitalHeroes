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
import { PageContainer } from '@/components/ui/page-container';
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

  const hasSelectedCharity = charityPrefs.length > 0;

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
      console.error('[DASHBOARD_SYNC_FAILURE]', err);
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
    if (confirm('Are you sure you want to delete this score record?')) {
      const res = await deleteScore(id);
      if (res.success) {
        toast('Record deleted', 'success');
        syncData();
      } else {
        toast(res.message ?? 'Unknown error', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        <div className="h-16 w-64 bg-card rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-8">
             <div className="h-96 bg-card rounded-[2.5rem] animate-pulse" />
             <div className="grid md:grid-cols-2 gap-8">
               <div className="h-80 bg-card rounded-[2.5rem] animate-pulse" />
               <div className="h-80 bg-card rounded-[2.5rem] animate-pulse" />
             </div>
           </div>
           <div className="lg:col-span-4 space-y-8">
             <div className="h-[500px] bg-card rounded-[2.5rem] animate-pulse" />
             <div className="h-[400px] bg-card rounded-[2.5rem] animate-pulse" />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sync Status Bar */}
      <div className="h-6 mb-4 overflow-hidden">
        <AnimatePresence>
          {syncing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
               <Loader2 className="w-3 h-3 animate-spin text-primary-end" />
               <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Synchronizing Ledger...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        {/* Success Banner */}
        <AnimatePresence>
          {showSuccessBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <div className="bg-card rounded-[2.5rem] border-2 border-primary-start/30 p-8 shadow-glow relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-gradient opacity-10" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                       <Shield className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">Active Status Verified</h3>
                      <p className="text-text-secondary font-medium">Your Elite tier benefits are now active.</p>
                    </div>
                  </div>
                  <Button onClick={() => setShowSuccessBanner(false)} variant="secondary" size="lg">
                    Enter Terminal
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!hasSelectedCharity ? (
          <div className="max-w-4xl mx-auto py-12">
             <div className="text-center mb-12">
               <h1 className="text-5xl font-black text-white mb-4">Select Your <span className="text-gradient">Mission</span></h1>
               <p className="text-text-secondary text-lg">Every play supports a cause. Choose where your impact goes.</p>
             </div>
             <CharitySelector onComplete={syncData} />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-card/50 border border-card-border rounded-full mb-6">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Node Status: Active</span>
                  </div>
                  <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tighter leading-none mb-4">
                    Player <span className="text-gradient">Terminal</span>
                  </h1>
                  <p className="text-text-secondary text-lg font-medium">Synchronized with GreenJack network protocols.</p>
               </div>
               
               <div className="flex items-center gap-4">
                  <Button 
                    onClick={syncData} 
                    variant="secondary" 
                    size="icon" 
                    isLoading={syncing}
                    className="w-14 h-14 rounded-2xl"
                  >
                    <RefreshCw className="w-6 h-6 text-text-secondary" />
                  </Button>
                  <Button 
                    onClick={() => setShowScoreModal(true)} 
                    variant="primary" 
                    size="lg"
                    icon={<Plus className="w-5 h-5" />}
                    className="h-14 px-8 rounded-2xl"
                  >
                    New Score
                  </Button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               <div className="lg:col-span-8 space-y-10">
                  <DrawsCard latestDraw={drawResults[0]?.draws} userResult={drawResults[0]} />
                  <div className="grid md:grid-cols-2 gap-10">
                     <ScoresCard 
                       scores={scores} 
                       onAddClick={() => { setEditingScore(null); setShowScoreModal(true); }} 
                       onEditClick={handleEditScore}
                       onDeleteClick={handleDeleteScore}
                     />
                     <WinningsCard results={drawResults} />
                  </div>
               </div>

               <div className="lg:col-span-4 space-y-10">
                  <SubscriptionCard subscription={subscription} />
                  <CharityCard 
                    preference={charityPrefs[0] || null} 
                    planAmount={subscription?.plan === 'yearly' ? 500 : 50} 
                  />
               </div>
            </div>

            {/* Performance Ledger Section */}
            <div className="mt-16 pt-16 border-t border-card-border">
               <div className="bg-card/20 border border-card-border p-8 lg:p-12 rounded-[2.5rem] backdrop-blur-xl group hover:border-primary-start/30 transition-all duration-500 shadow-premium">
                  <div className="mb-12">
                     <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-4">
                        <Activity className="w-8 h-8 text-primary-end" />
                        Performance <span className="text-gradient">Ledger</span>
                     </h2>
                     <p className="text-text-secondary text-sm font-bold uppercase tracking-widest leading-none">Complete historical data and verification sequence.</p>
                  </div>
                  <ScoreManager />
               </div>
            </div>
          </>
        )}
      </div>

      <Modal 
        isOpen={showScoreModal} 
        onClose={() => { setShowScoreModal(false); setEditingScore(null); }}
        title={editingScore ? "Override Record" : "New Performance Record"}
      >
        <ScoreEntry 
          initialData={editingScore}
          onScoreAdded={() => { setShowScoreModal(false); setEditingScore(null); syncData(); }} 
        />
      </Modal>
    </div>
  );
}

export default function DashboardContent() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-card rounded-[2.5rem]" />}>
      <DashboardContentComponent />
    </Suspense>
  );
}
