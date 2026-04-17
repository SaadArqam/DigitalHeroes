'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserSubscription } from '@/app/actions/subscriptions';
import { getUserScores } from '@/app/actions/scores';
import { getUserCharityPreferences } from '@/app/actions/charities';
import { getWinnerDrawResults } from '@/app/actions/winners';

import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { ScoresCard } from '@/components/dashboard/ScoresCard';
import { CharityCard } from '@/components/dashboard/CharityCard';
import { WinningsCard } from '@/components/dashboard/WinningsCard';
import { DrawsCard } from '@/components/dashboard/DrawsCard';
import { CharitySelector } from '@/components/dashboard/CharitySelector';
import ScoreEntry from '@/components/score-entry';

// ─── Skeleton Loader ─────────────────────────────────────────────────────────

function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-3xl bg-white/60 border border-slate-100 overflow-hidden ${className}`}>
      <div className="p-8 space-y-5 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-200/70" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200/70 rounded-full w-1/3" />
            <div className="h-3 bg-slate-100 rounded-full w-1/4" />
          </div>
        </div>
        <div className="h-14 bg-slate-100 rounded-2xl" />
        <div className="h-10 bg-slate-100 rounded-2xl" />
        <div className="h-10 bg-slate-100 rounded-2xl" />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
      <div className="lg:col-span-8 space-y-6 xl:space-y-8">
        <CardSkeleton className="h-[420px]" />
        <div className="grid md:grid-cols-2 gap-6 xl:gap-8">
          <CardSkeleton className="h-[420px]" />
          <CardSkeleton className="h-[420px]" />
        </div>
      </div>
      <div className="lg:col-span-4 space-y-6 xl:space-y-8">
        <CardSkeleton className="h-[400px]" />
        <CardSkeleton className="h-[400px]" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function DashboardContentComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

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
      window.history.replaceState({}, '', '/dashboard');
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
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard data. Please refresh.');
    } finally {
      setSyncing(false);
    }
  };

  // ─── Global Loading Screen ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F8F9FF] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-400/20 blur-2xl rounded-full scale-150" />
            <div className="relative w-16 h-16 rounded-2xl bg-white shadow-xl border border-indigo-100 flex items-center justify-center">
              <div className="w-8 h-8 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Initialising Terminal</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] selection:bg-indigo-100 pb-32 relative">
      {/* Background texture */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-indigo-50 via-violet-50/30 to-transparent" />
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-indigo-300/10 rounded-full blur-[120px]" />
        <div className="absolute top-80 right-1/4 w-80 h-80 bg-purple-300/10 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      {/* ── Score Entry Modal ── */}
      <AnimatePresence>
        {showScoreModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg"
            >
              <button
                onClick={() => setShowScoreModal(false)}
                className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:scale-110 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <ScoreEntry onScoreAdded={() => { setShowScoreModal(false); syncData(); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">

        {/* ── Success Banner ── */}
        <AnimatePresence>
          {showSuccessBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-10"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-6 shadow-2xl shadow-indigo-500/10">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 right-1/3 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full" />
                  <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full" />
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-black text-lg tracking-tight">Elite Status Unlocked</h3>
                      <p className="text-indigo-300 text-sm font-medium mt-0.5">Welcome to the inner circle. Your subscription is live.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSuccessBanner(false)}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-bold rounded-xl transition-colors tracking-wide flex-shrink-0"
                  >
                    Begin Journey
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Error Banner ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 p-5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-700 font-bold text-sm flex-1">{error}</p>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 transition-colors text-xs font-bold uppercase tracking-widest">Dismiss</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Charity Gate ── */}
        {!hasSelectedCharity ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <CharitySelector onComplete={syncData} />
          </motion.div>
        ) : (
          <>
            {/* ── Page Header ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 xl:mb-14"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/80 rounded-full shadow-sm mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Network Linked</span>
                </div>
                <h1 className="text-4xl sm:text-5xl xl:text-[4rem] font-black text-slate-900 tracking-[-0.03em] leading-[0.9]">
                  Player{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-violet-700">
                    Terminal
                  </span>
                </h1>
                <p className="mt-3 text-slate-500 font-medium text-sm">Your command centre for scores, draws, and winnings.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={syncData}
                  disabled={syncing}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all disabled:opacity-50"
                >
                  <svg className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {syncing ? 'Syncing' : 'Refresh'}
                </button>
                <button
                  onClick={() => setShowScoreModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  New Score
                </button>
              </div>
            </motion.div>

            {/* ── Dashboard Grid ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8"
            >
              {/* Left column */}
              <div className="lg:col-span-8 space-y-6 xl:space-y-8">
                <div className="h-[420px]">
                  <DrawsCard />
                </div>
                <div className="grid md:grid-cols-2 gap-6 xl:gap-8">
                  <ScoresCard scores={scores} onAddClick={() => setShowScoreModal(true)} />
                  <WinningsCard results={drawResults} />
                </div>
              </div>

              {/* Right column */}
              <div className="lg:col-span-4 flex flex-col gap-6 xl:gap-8">
                <SubscriptionCard subscription={subscription} />
                <CharityCard
                  preferences={charityPrefs}
                  onConfigClick={() => router.push('/dashboard/charity')}
                />
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default function DashboardContent() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 bg-[#F8F9FF] flex items-center justify-center">
          <div className="relative w-14 h-14 rounded-2xl bg-white shadow-xl border border-indigo-100 flex items-center justify-center">
            <div className="w-7 h-7 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        </div>
      }
    >
      <DashboardContentComponent />
    </Suspense>
  );
}
