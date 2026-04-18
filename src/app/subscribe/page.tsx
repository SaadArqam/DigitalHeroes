'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createCheckoutSession, getUserSubscription } from '@/app/actions/subscriptions';
import { monthlyPlan, yearlyPlan, formatPrice } from '@/lib/pricing';
import PricingCard from '@/components/pricing/PricingCard';
import PricingComparison from '@/components/pricing/PricingComparison';
import TrustBadges from '@/components/pricing/TrustBadges';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/ui/page-container';
import { ShieldCheck, ArrowRight, Zap, Target } from 'lucide-react';

function SubscribePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
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
        setError(result.message ?? 'Unknown error' || 'Failed to create checkout session');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (subscription?.status === 'active') {
    return (
      <PageContainer className="flex items-center justify-center">
        <Card variant="glass" className="w-full max-w-xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-emerald-500 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-4xl">Active Citizenship</CardTitle>
            <CardDescription className="text-lg mt-4">
              Your elite status is verified. Access all network nodes from your player terminal.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="bg-input-bg rounded-[2rem] p-8 border border-input-border relative overflow-hidden group">
               <div className="absolute inset-0 bg-primary-gradient opacity-5 pointer-events-none"></div>
               <div className="relative z-10 flex justify-between items-center">
                  <div>
                     <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Protocol Tier</div>
                     <div className="text-2xl font-black text-white uppercase tracking-tight">{subscription.plan} Elite</div>
                  </div>
                  <div className="text-right">
                     <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">Cycle End</div>
                     <div className="text-lg font-bold text-white">{new Date(subscription.current_period_end).toLocaleDateString()}</div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-4">
               <Button size="lg" variant="primary" onClick={() => router.push('/dashboard')} className="w-full">
                  Enter Player Terminal
               </Button>
               <Button size="md" variant="ghost" onClick={() => router.push('/dashboard')} className="w-full">
                  Manage Billing Schedule
               </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-24">
        {/* Header */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-card border border-card-border rounded-full mb-6">
             <Zap className="w-3 h-3 text-primary-end" />
             <span className="text-[10px] font-black uppercase tracking-widest text-text-muted text-center w-full">Access Protocols Available</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.85]">
            Choose Your <br />
            <span className="text-gradient italic">Power Path</span>
          </h1>
          <p className="text-xl text-text-secondary font-bold leading-relaxed">
            Elevate your journey with elite analytics, instant verification, and exclusive charity impact pairing.
          </p>
        </div>

        {/* Global Messages */}
        {(error || success) && (
          <div className="mb-12 max-w-3xl mx-auto transform animate-in fade-in slide-in-from-top-4">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-rose-500 font-bold flex items-center gap-4">
                <Target className="w-6 h-6 flex-shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-emerald-500 font-bold flex items-center gap-4">
                <ShieldCheck className="w-6 h-6 flex-shrink-0" />
                {success}
              </div>
            )}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-24">
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
        <div className="max-w-5xl mx-auto space-y-24">
           <TrustBadges />
           <PricingComparison />

           {/* Bottom Help */}
           <div className="text-center max-w-2xl mx-auto border-t border-card-border pt-16">
              <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Enterprise Solutions</h4>
              <p className="text-text-secondary font-bold mb-8 italic">Custom packages for tournament organizers and country clubs.</p>
              <Button variant="outline" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Contact Sales Terminal
              </Button>
           </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<PageContainer><div className="animate-pulse h-96 bg-card rounded-[2.5rem]" /></PageContainer>}>
      <SubscribePageContent />
    </Suspense>
  );
}
