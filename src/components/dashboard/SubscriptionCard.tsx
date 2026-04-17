'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createBillingPortalSession } from '@/app/actions/subscriptions';
import { Crown, ShieldCheck, CreditCard, ChevronRight, Zap, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Subscription {
  plan: string;
  status: string;
  current_period_end: string;
  stripe_customer_id?: string;
}

interface SubscriptionCardProps {
  subscription: Subscription | null;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);
  const isActive = subscription?.status === 'active';
  
  const plan = subscription?.plan === 'yearly' ? 'yearly' : 'monthly';
  const price = plan === 'yearly' ? '₹500/yr' : '₹50/mo';
  
  const handleManageBilling = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    try {
      const result = await createBillingPortalSession();
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        alert(result.message || 'Could not open billing portal');
        setLoading(false);
      }
    } catch {
      alert('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <Card variant="glass" className="h-full group" hoverable>
        {/* Header */}
        <div className="flex items-start justify-between relative z-10 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-card border border-card-border flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
              <Crown className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-black text-white text-xl tracking-tight leading-none mb-1">Status</h3>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Membership Protocol</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
            isActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-input-bg text-text-muted border-input-border'
          }`}>
            <ShieldCheck className="w-3 h-3" /> {isActive ? 'Verified' : 'Passive'}
          </div>
        </div>

        <div className="flex-1 flex flex-col relative z-10">
          {subscription ? (
            <div className="flex-1 flex flex-col">
              <div className="p-6 rounded-[2rem] bg-input-bg border border-input-border mb-8 group-hover:border-primary-start/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 rounded-xl bg-card border border-card-border text-primary-end">
                      {plan === 'yearly' ? <Star className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Contract Tier</p>
                      <h4 className="text-xl font-black text-white capitalize tracking-tight">{plan} Elite</h4>
                   </div>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-white tracking-tighter">{price}</span>
                   <span className="text-xs font-bold text-text-muted">Active Cycle</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                 {[
                   'Full Draw Eligibility',
                   'Instant Result Verification',
                   'Impact Partnering'
                 ].map((perk) => (
                   <div key={perk} className="flex items-center gap-3">
                     <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                     </div>
                     <span className="text-sm font-bold text-text-secondary">{perk}</span>
                   </div>
                 ))}
              </div>

              <div className="mb-8 p-4 bg-input-bg rounded-2xl border border-input-border flex justify-between items-center text-xs">
                 <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-text-muted" />
                    <span className="font-black uppercase tracking-widest text-text-muted text-[10px]">Renewal</span>
                 </div>
                 <span className="font-black text-white">
                    {new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                 </span>
              </div>

              <Button
                onClick={handleManageBilling}
                isLoading={loading}
                variant="secondary"
                className="w-full rounded-2xl"
                icon={<ChevronRight className="w-4 h-4" />}
              >
                Manage Citizenship
              </Button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <div className="w-20 h-20 rounded-[2rem] bg-input-bg border-2 border-dashed border-input-border flex items-center justify-center mb-6">
                <Crown className="w-8 h-8 text-text-muted" />
              </div>
              <h4 className="font-black text-white text-xl mb-2">Passive Citizen</h4>
              <p className="text-text-secondary text-sm font-bold mb-8 max-w-[220px]">
                Unlock full participation and begin your progression journey.
              </p>
              <Link href="/subscribe" className="w-full">
                <Button className="w-full rounded-2xl" size="lg">Activate Membership</Button>
              </Link>
            </div>
          )}
        </div>
    </Card>
  );
}
