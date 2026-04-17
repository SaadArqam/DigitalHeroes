'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getUserSubscription } from '@/app/actions/subscriptions';
import { getUserScores } from '@/app/actions/scores';
import { getUserCharityPreferences } from '@/app/actions/charities';
import { getWinnerDrawResults } from '@/app/actions/winners';

import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// New Modular Dashboard Components
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { ScoresCard } from '@/components/dashboard/ScoresCard';
import { CharityCard } from '@/components/dashboard/CharityCard';
import { WinningsCard } from '@/components/dashboard/WinningsCard';
import { DrawsCard } from '@/components/dashboard/DrawsCard';

import { CharitySelector } from '@/components/dashboard/CharitySelector';

function DashboardContentComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Real Data State
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
    try {
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
      setError('Failed to aggregate dashboard data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center animate-pulse">
           <div className="w-16 h-16 bg-slate-200 rounded-2xl mx-auto mb-6"></div>
           <div className="h-6 bg-slate-200 rounded-full w-48 mx-auto mb-4"></div>
           <div className="h-4 bg-slate-200 rounded-full w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 pb-24">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Success Banner */}
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

        {/* Charity Selector for First Visit */}
        {!hasSelectedCharity ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
             <CharitySelector onComplete={fetchAllData} />
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <Badge variant="indigo" className="mb-4">Live Dashboard</Badge>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase">
                  Player <span className="text-brand-indigo">Terminal</span>
                </h1>
              </div>
              <div className="flex gap-3">
                 <Button variant="outline" size="sm" onClick={fetchAllData}>Sync Actions</Button>
                 <Button variant="primary" size="sm">New Entry</Button>
              </div>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-8">
                  <DrawsCard />
                  <div className="grid md:grid-cols-2 gap-8">
                     <ScoresCard scores={scores} onAddClick={() => router.push('/dashboard#score-entry')} />
                     <WinningsCard results={drawResults} />
                  </div>
               </div>

               <div className="space-y-8">
                  <SubscriptionCard subscription={subscription} />
                  <CharityCard preferences={charityPrefs} onConfigClick={() => router.push('/dashboard#charity-preference')} />
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function DashboardContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 py-24 px-4 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-slate-200 rounded-3xl w-64 mx-auto"></div>
          <div className="h-4 bg-slate-200 rounded-3xl w-96 mx-auto"></div>
        </div>
      </div>
    }>
      <DashboardContentComponent />
    </Suspense>
  );
}
