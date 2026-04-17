'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createBillingPortalSession } from '@/app/actions/subscriptions';

interface Subscription {
  plan: string;
  status: string;
  current_period_end: string;
  stripe_customer_id?: string;
}

interface SubscriptionCardProps {
  subscription: Subscription | null;
}

const PLAN_PRICE: Record<string, string> = {
  monthly: '₹50 / mo',
  yearly:  '₹500 / yr',
};

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
        alert(result.message || 'Could not open billing portal');
      }
    } catch {
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="h-full"
    >
      <div className="h-full rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base tracking-tight">Membership</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Subscription plan</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
            isActive
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-slate-50 text-slate-400 border-slate-100'
          }`}>
            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 px-7 py-6 flex flex-col">
          {subscription ? (
            <>
              {/* Plan display */}
              <div className="mb-6">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Current Plan</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-black text-slate-900 tracking-tight capitalize">{subscription.plan}</p>
                  <p className="text-sm font-bold text-slate-500 mb-1">{PLAN_PRICE[subscription.plan] || '—'}</p>
                </div>
              </div>

              {/* Period info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Next Billing</p>
                  <p className="text-sm font-bold text-slate-700">
                    {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Perks */}
              <div className="flex-1 space-y-2.5 mb-6">
                {['Draw participation every month', 'Full score history & analytics', 'Priority payout processing'].map((perk) => (
                  <div key={perk} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-xs font-medium text-slate-600">{perk}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={handleManageBilling}
                disabled={loading}
                className="w-full py-3 px-5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-2xl transition-colors disabled:opacity-50 tracking-wide"
              >
                {loading ? 'Opening Portal...' : 'Manage Subscription'}
              </button>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="font-black text-slate-900 text-base mb-1">No Active Plan</p>
              <p className="text-slate-400 text-sm font-medium mb-6 max-w-[200px] leading-relaxed">
                Subscribe to unlock draw access and premium features.
              </p>
              <a
                href="/subscribe"
                className="w-full block text-center py-3 px-5 text-sm font-bold text-white bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all"
              >
                Unlock Platform
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
