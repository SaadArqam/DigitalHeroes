'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getUserSubscription } from '@/app/actions/subscriptions';
import { getUserScores } from '@/app/actions/scores';
import { getUserCharityPreferences } from '@/app/actions/charities';
import { getWinnerDrawResults } from '@/app/actions/winners';

import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Modular Dashboard Sub-Sections
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { ScoresCard } from '@/components/dashboard/ScoresCard';
import { CharityCard } from '@/components/dashboard/CharityCard';
import { WinningsCard } from '@/components/dashboard/WinningsCard';
import { DrawsCard } from '@/components/dashboard/DrawsCard';
import { CharitySelector } from '@/components/dashboard/CharitySelector';
import ScoreEntry from '@/components/score-entry';

function DashboardContentComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string>('');
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  
  const [showScoreModal, setShowScoreModal] = useState(false);

  // Core Data States
  const [subscription, setSubscription] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [charityPrefs, setCharityPrefs] = useState<any[]>([]);
  const [drawResults, setDrawResults] = useState<any[]>([]);

  const hasSelectedCharity = charityPrefs.length > 0;

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
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
      // Parallelize all Supabase network requests for speed
      const [subRes, scoreRes, charityRes, drawRes] = await Promise.all([
        getUserSubscription(),
        getUserScores(),
        getUserCharityPreferences(),
        getWinnerDrawResults()
      ]);

      if (subRes.success) setSubscription(subRes.data);
      if (scoreRes.success) setScores(scoreRes.data || []);
      if (charityRes.success) setCharityPrefs(charityRes.data || []);
      if (drawRes.success) setDrawResults(drawRes.data || []);

      setError('');
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to aggregate dashboard data. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] py-12 px-4 flex items-center justify-center z-50 fixed inset-0">
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative"
         >
           <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full"></div>
           <div className="w-20 h-20 bg-white/50 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl flex items-center justify-center relative z-10 overflow-hidden">
             <div className="w-10 h-10 border-[5px] border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
           </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 selection:bg-indigo-100 pb-24 relative overflow-hidden">
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none -z-10"></div>
      
      <Navbar />
      
      {/* Dynamic Overlay: Score Entry Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm shadow-2xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowScoreModal(false)}
              className="absolute -top-4 -right-4 w-8 h-8 flex items-center justify-center bg-white rounded-full text-slate-500 hover:text-slate-900 shadow-md z-10 transition-transform hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <ScoreEntry 
              onScoreAdded={() => {
                setShowScoreModal(false);
                syncData(); 
              }} 
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 z-10 relative">
        {showSuccessBanner && (
          <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <Card variant="dark" className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 border-indigo-500/30 overflow-hidden relative group">
              <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] translate-x-1/2 rounded-full"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 py-4">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-white mb-2">Elite Status Unlocked</CardTitle>
                    <p className="text-indigo-200 font-medium font-sans">Welcome to the inner circle. Your subscription is active and ready.</p>
                  </div>
                </div>
                <Button variant="emerald" onClick={() => setShowSuccessBanner(false)} className="md:w-auto w-full">
                  Begin Journey
                </Button>
              </div>
            </Card>
          </div>
        )}

        {!hasSelectedCharity ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
             <CharitySelector onComplete={syncData} />
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col lg:flex-row justify-between items-end mb-14 gap-6"
            >
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm text-xs font-black uppercase tracking-widest text-slate-500 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Network Linked
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase drop-shadow-sm">
                  Player <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-800">Terminal</span>
                </h1>
              </div>
              <div className="flex gap-3">
                 <Button variant="outline" size="sm" onClick={syncData} disabled={syncing}>
                   {syncing ? 'Syncing...' : 'Sync Action'}
                 </Button>
                 <Button variant="primary" size="sm" onClick={() => setShowScoreModal(true)} className="shadow-lg shadow-brand-indigo/30 hover:scale-105 transition-transform">
                   New Entry
                 </Button>
              </div>
            </motion.div>

            {error && (
              <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-3xl text-red-700 font-bold flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </div>
                {error}
              </div>
            )}

            {/* Cinematic Grid Layout */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
               {/* Left Feature Column */}
               <div className="col-span-1 lg:col-span-8 space-y-8">
                  <div className="h-[400px]">
                    <DrawsCard />
                  </div>
                  <div className="grid md:grid-cols-2 gap-8 h-auto md:h-[450px]">
                     <ScoresCard scores={scores} onAddClick={() => setShowScoreModal(true)} />
                     <WinningsCard results={drawResults} />
                  </div>
               </div>

               {/* Right Utility Column */}
               <div className="col-span-1 lg:col-span-4 space-y-8 flex flex-col h-full lg:h-[882px]">
                  <div className="flex-1">
                     <SubscriptionCard subscription={subscription} />
                  </div>
                  <div className="flex-1">
                     <CharityCard preferences={charityPrefs} onConfigClick={() => router.push('/dashboard/charity')} />
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrapper for optimal Next.js SSR boundaries and fallback behavior
export default function DashboardContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 py-24 px-4 text-center z-50 fixed inset-0 flex items-center justify-center">
         <div className="w-20 h-20 bg-white/50 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl flex items-center justify-center relative z-10 overflow-hidden">
             <div className="w-10 h-10 border-[5px] border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
         </div>
      </div>
    }>
      <DashboardContentComponent />
    </Suspense>
  );
}
