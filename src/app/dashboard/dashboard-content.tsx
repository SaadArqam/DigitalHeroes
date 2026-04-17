'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserSubscription } from '@/app/actions/subscriptions';
import { getUserScores } from '@/app/actions/scores';
import { getUserCharityPreferences } from '@/app/actions/charities';
import { getWinnerDrawResults } from '@/app/actions/winners';
import { useToast } from '@/hooks/use-toast';

import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { ScoresCard } from '@/components/dashboard/ScoresCard';
import { CharityCard } from '@/components/dashboard/CharityCard';
import { WinningsCard } from '@/components/dashboard/WinningsCard';
import { DrawsCard } from '@/components/dashboard/DrawsCard';
import { CharitySelector } from '@/components/dashboard/CharitySelector';
import ScoreEntry from '@/components/score-entry';
import { Loader2, RefreshCw, Plus, CheckCircle2 } from 'lucide-react';

// ─── Skeleton Loader ───
function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-[2.5rem] bg-white border border-slate-100 overflow-hidden ${className}`}>
      <div className="p-8 space-y-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-100 rounded-full w-1/3" />
            <div className="h-3 bg-slate-50 rounded-full w-1/4" />
          </div>
        </div>
        <div className="h-32 bg-slate-50 rounded-3xl" />
        <div className="space-y-3">
          <div className="h-4 bg-slate-50 rounded-full w-full" />
          <div className="h-4 bg-slate-50 rounded-full w-5/6" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───
function DashboardContentComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string>('');
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const [subscription, setSubscription] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [charityPrefs, setCharityPrefs] = useState<any[]>([]);
  const [drawResults, setDrawResults] = useState<any[]>([]);

  const hasSelectedCharity = charityPrefs.length > 0;

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccessBanner(true);
      toast('Elite Status Activated', 'success');
      // Clean URL
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
        getUserScores(),
        getUserCharityPreferences(),
        getWinnerDrawResults(),
      ]);
      
      if (subRes.success) setSubscription(subRes.data);
      if (scoreRes.success) setScores(scoreRes.data || []);
      if (charityRes.success) setCharityPrefs(charityRes.data || []);
      if (drawRes.success) setDrawResults(drawRes.data || []);
      
      setError('');
    } catch (err: any) {
      console.error('[DASHBOARD_SYNC_FAILURE]', err);
      setError('System synchronization failed. Data may be out of date.');
      toast('Sync Failed', 'error');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] p-6 lg:p-12 pt-28">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="h-20 w-1/3 bg-slate-200/50 animate-pulse rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <CardSkeleton className="h-[400px]" />
              <div className="grid md:grid-cols-2 gap-8">
                <CardSkeleton className="h-[350px]" />
                <CardSkeleton className="h-[350px]" />
              </div>
            </div>
            <div className="lg:col-span-4 space-y-8">
              <CardSkeleton className="h-[450px]" />
              <CardSkeleton className="h-[450px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] pb-24 relative overflow-x-hidden">
      <Navbar />

      {/* Global Sync State */}
      <AnimatePresence>
        {syncing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]"
          >
            <div className="bg-slate-900 border border-white/10 px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 text-white">
               <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronising Ledger...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32">
        {/* Success Banner */}
        <AnimatePresence>
          {showSuccessBanner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <div className="bg-slate-900 rounded-[2.5rem] border border-indigo-500/30 p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/20">
                       <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Active Citizenship Confirmed</h3>
                      <p className="text-indigo-300 font-medium mt-1">Access to all network nodes and draw protocols is now live.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSuccessBanner(false)}
                    className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95"
                  >
                    Enter Terminal
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!hasSelectedCharity ? (
          <CharitySelector onComplete={syncData} />
        ) : (
          <>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Node Status: Active</span>
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.85]">
                    Player <span className="text-indigo-600 italic">Terminal</span>
                  </h1>
               </div>
               
               <div className="flex items-center gap-3">
                  <button 
                    onClick={syncData}
                    disabled={syncing}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all hover:shadow-xl hover:shadow-indigo-100/50 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                  </button>
                  <button 
                    onClick={() => setShowScoreModal(true)}
                    className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> New Score
                  </button>
               </div>
            </div>

            {/* Dashboard Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Primary Nodes */}
               <div className="lg:col-span-8 space-y-8">
                  <DrawsCard latestDraw={drawResults[0]?.draws} userResult={drawResults[0]} />
                  <div className="grid md:grid-cols-2 gap-8">
                     <ScoresCard scores={scores} onAddClick={() => setShowScoreModal(true)} />
                     <WinningsCard results={drawResults} />
                  </div>
               </div>

               {/* Secondary Nodes */}
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

      {/* Modals */}
      <AnimatePresence>
        {showScoreModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScoreModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="relative z-10 w-full max-w-xl"
            >
              <ScoreEntry onScoreAdded={() => { setShowScoreModal(false); syncData(); }} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DashboardContent() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FF]" />}>
      <DashboardContentComponent />
    </Suspense>
  );
}
