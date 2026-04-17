'use client';

import { useState } from 'react';
import { Subscription } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getPlanPrice, formatPrice } from '@/lib/pricing';
import { createBillingPortalSession } from '@/app/actions/subscriptions';

interface SubscriptionCardProps {
  subscription: Subscription | null;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);
  const isActive = subscription?.status === 'active';

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      const result = await createBillingPortalSession();
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        alert(result.message || 'Failed to open billing portal');
      }
    } catch (err) {
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-xl">Membership</CardTitle>
        <Badge variant={isActive ? 'emerald' : 'slate'} className="ml-2">
          {isActive ? 'Active Plan' : 'No Active Plan'}
        </Badge>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col">
        {subscription ? (
          <div className="space-y-6 flex-grow">
            <div>
              <div className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
                {subscription.plan}
              </div>
              <CardDescription className="mt-1">
                {formatPrice(getPlanPrice(subscription.plan)?.amount || 0)} / {subscription.plan === 'monthly' ? 'month' : 'year'}
              </CardDescription>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-500 uppercase tracking-widest text-[10px]">Next Billing</span>
                <span className="text-slate-900">{new Date(subscription.current_period_end).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-500 uppercase tracking-widest text-[10px]">Status</span>
                <span className={isActive ? 'text-brand-emerald' : 'text-slate-400'}>{subscription.status}</span>
              </div>
            </div>

            <div className="pt-6 mt-auto">
              <Button 
                variant="outline" 
                className="w-full" 
                size="sm"
                onClick={handleManageBilling}
                disabled={loading}
              >
                {loading ? 'Opening Portal...' : 'Manage Billing'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-slate-500 font-bold mb-6">Upgrade to unlock premium features and prize draws.</p>
            <Button variant="primary" className="w-full">Upgrade Now</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
