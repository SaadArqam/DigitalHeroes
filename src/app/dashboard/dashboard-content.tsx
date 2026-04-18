'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserSubscription } from '@/app/actions/subscriptions';
import { getScores, deleteScore } from '@/app/actions/scores';
import { getUserCharityPreference } from '@/app/actions/charities';
import { getUserDrawResults } from '@/app/actions/draws';
import { useToast } from '@/hooks/use-toast';

import Navbar from '@/components/navbar';
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
import { Loader2, RefreshCw, Plus, CheckCircle2, Shield } from 'lucide-react';

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
        toast(res.message, 'error');
      }
    }
  };

  if (loading) {
    return (
      <PageContainer className="animate-pulse">
        <div className="h-16 w-64 bg-card rounded-2xl mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-8">
             <div className="h-96 bg-card rounded-[2.5rem]" />
             <div className="grid md:grid-cols-2 gap-8">
               <div className="h-80 bg-card rounded-[2.5rem]" />
               <div className="h-80 bg-card rounded-[2.5rem]" />
             </div>
           </div>
           <div className="lg:col-span-4 space-y-8">
             <div className="h-[500px] bg-card rounded-[2.5rem]" />
             <div className="h-[400px] bg-card rounded-[2.5rem]" />
           </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Navbar />

      {/* Global Sync Indicator */}
      <AnimatePresence>
        {syncing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]"
          >
            <div className="bg-card border border-card-border px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 text-white">
               <Loader2 className="w-4 h-4 animate-spin text-primary-end" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Syncing Ledger</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {/* Success Banner */}
        <AnimatePresence>
          {showSuccessBanner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <div className="bg-card rounded-[2.5rem] border-2 border-primary-start/20 p-8 shadow-glow relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary-gradient opacity-10 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                       <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Active Status Verified</h3>
                      <p className="text-text-secondary font-bold mt-1">Protocol synchronization is complete. Welcome to the elite tier.</p>
                    </div>
                  </div>
                  <Button onClick={() => setShowSuccessBanner(false)} variant="secondary" size="lg">
                    Begin Journey
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!hasSelectedCharity ? (
          <div className="max-w-4xl mx-auto">
             <CharitySelector onComplete={syncData} />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-card border border-card-border rounded-full mb-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Node status: Active</span>
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-black text-white tracking-[ -0.05em] leading-[0.85]">
                    Player <span className="text-gradient italic">Terminal</span>
                  </h1>
               </div>
               
               <div className="flex items-center gap-3">
                  <Button 
                    onClick={syncData} 
                    variant="secondary" 
                    size="icon" 
                    isLoading={syncing}
                    className="rounded-2xl"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </Button>
                  <Button 
                    onClick={() => setShowScoreModal(true)} 
                    variant="primary" 
                    size="lg"
                    icon={<Plus className="w-4 h-4" />}
                    className="rounded-2xl"
                  >
                    New Score
                  </Button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                    preferences={charityPrefs} 
                    onConfigClick={() => router.push('/dashboard/impact')} 
                  />
               </div>
            </div>
          </>
        )}
      </div>

      <Modal 
        isOpen={showScoreModal} 
        onClose={() => { setShowScoreModal(false); setEditingScore(null); }}
        title={editingScore ? "Edit Record" : "Record Score"}
      >
        <ScoreEntry 
          initialData={editingScore}
          onScoreAdded={() => { setShowScoreModal(false); setEditingScore(null); syncData(); }} 
        />
      </Modal>
    </PageContainer>
  );
}

export default function DashboardContent() {
  return (
    <Suspense fallback={<PageContainer><div className="animate-pulse h-96 bg-card rounded-[2.5rem]" /></PageContainer>}>
      <DashboardContentComponent />
    </Suspense>
  );
}
