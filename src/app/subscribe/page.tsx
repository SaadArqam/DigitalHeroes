'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createCheckoutSession, getUserSubscription } from '@/app/actions/subscriptions';
import { monthlyPlan, yearlyPlan, formatPrice } from '@/lib/pricing';
import PricingCard from '@/components/pricing/PricingCard';
import PricingComparison from '@/components/pricing/PricingComparison';
import TrustBadges from '@/components/pricing/TrustBadges';
import Navbar from '@/components/navbar';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function SubscribePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    // Check for canceled parameter
    const canceledParam = searchParams.get('canceled');

    if (canceledParam === 'true') {
      setError('Payment was canceled. You can try again anytime.');
      router.replace('/subscribe');
    }

    fetchSubscription();
  }, [searchParams, router]);

  const fetchSubscription = async () => {
    try {
      const result = await getUserSubscription();
      if (result.success && result.data) {
        setSubscription(result.data);
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
    }
  };

  const handleSubscribe = async (planId: 'monthly' | 'yearly') => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await createCheckoutSession(planId);
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        setError(result.message || 'Failed to create checkout session');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (subscription?.status === 'active') {
    return (
      <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 relative overflow-hidden">
        <Navbar />
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-xl mx-auto">
            <Card variant="glass" className="border-indigo-500/20 shadow-indigo">
              <CardHeader className="text-center pb-10">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-in zoom-in duration-500">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <Badge variant="emerald" className="mb-4">Live Membership</Badge>
                <CardTitle className="text-4xl">You are already subscribed</CardTitle>
                <CardDescription className="text-lg mt-4 px-4">
                  Manage your elite membership, scores, and charity preferences directly from your player terminal.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
                   <div className="relative z-10 flex justify-between items-center">
                      <div>
                         <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-1">Current Tier</div>
                         <div className="text-2xl font-black uppercase tracking-tight">{subscription.plan}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-1">Renewal Date</div>
                         <div className="text-lg font-bold">{new Date(subscription.current_period_end).toLocaleDateString()}</div>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                   <Button size="xl" variant="primary" onClick={() => router.push('/dashboard')} className="w-full">
                      Enter Player Dashboard
                   </Button>
                   <Button size="md" variant="ghost" className="text-slate-400">
                      Need to cancel? Visit standard billing
                   </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 overflow-hidden relative">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/4 left-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">
        {/* Header */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <h2 className="text-sm font-black tracking-[0.3em] uppercase text-indigo-600 mb-4">Pricing & Access</h2>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter">
            Choose Your <br />
            <span className="bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">Power Path</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Elevate your golfing experience with elite analytics and exclusive community access. Select the plan that fits your ambition.
          </p>
        </div>

        {/* Global Messages */}
        {(error || success) && (
          <div className="mb-12 max-w-3xl mx-auto transform animate-in fade-in slide-in-from-top-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 font-bold flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-emerald-700 font-bold flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {success}
              </div>
            )}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <PricingCard 
             plan={monthlyPlan} 
             loading={loading} 
             onSubscribe={handleSubscribe} 
          />
          <PricingCard 
             plan={yearlyPlan} 
             loading={loading} 
             onSubscribe={handleSubscribe} 
             isPopular 
          />
        </div>

        {/* Trust Elements */}
        <div className="max-w-5xl mx-auto">
           <TrustBadges />
           <PricingComparison />
        </div>

        {/* Bottom Help */}
        <div className="mt-32 text-center max-w-2xl mx-auto border-t border-slate-100 pt-16">
           <h4 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">Need a Custom Package?</h4>
           <p className="text-slate-500 font-medium mb-8">For tournament organizers or country clubs, we offer specialized enterprise solutions.</p>
           <a href="mailto:sales@greenjack.com" className="text-indigo-600 font-black text-sm uppercase tracking-widest hover:text-indigo-500 transition-colors">
             Contact Sales Team →
           </a>
        </div>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white py-40 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-slate-100 rounded-2xl w-96 mx-auto mb-8"></div>
            <div className="h-4 bg-slate-100 rounded-2xl w-64 mx-auto mb-20"></div>
            <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
               <div className="h-[500px] bg-slate-50 rounded-[2rem]"></div>
               <div className="h-[500px] bg-slate-50 rounded-[2rem]"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <SubscribePageContent />
    </Suspense>
  );
}
