'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createBillingPortalSession } from '@/app/actions/subscriptions';
import { Crown, ShieldCheck, CreditCard, ChevronRight, Zap, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';

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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full group"
    >
      <div className="h-full rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="px-8 pt-10 pb-6 flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200">
              <Crown className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-xl tracking-tight">Citizen Status</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Membership Protocol</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
            isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
          }`}>
            {isActive && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
            <ShieldCheck className="w-3 h-3" /> {isActive ? 'Verified' : 'Unverified'}
          </div>
        </div>

        <div className="flex-1 px-8 py-6 flex flex-col relative z-10">
          {subscription ? (
            <div className="flex-1 flex flex-col">
              <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 mb-8 hover:border-indigo-100 transition-all">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
                      {plan === 'yearly' ? <Star className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Contract Tier</p>
                      <h4 className="text-xl font-black text-slate-900 capitalize tracking-tight">{plan} Elite</h4>
                   </div>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-slate-900 tracking-tighter">{price}</span>
                   <span className="text-xs font-bold text-slate-400">Next Cycle</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                 {[
                   'Full Draw Eligibility',
                   'Instant Result Verification',
                   'Earth Impact Partnering'
                 ].map((perk) => (
                   <div key={perk} className="flex items-center gap-3">
                     <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                     </div>
                     <span className="text-sm font-bold text-slate-600">{perk}</span>
                   </div>
                 ))}
              </div>

              <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                 <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span className="font-black uppercase tracking-widest text-slate-500 text-[10px]">Renewal</span>
                 </div>
                 <span className="font-black text-slate-900">
                    {new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                 </span>
              </div>

              <button
                onClick={handleManageBilling}
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Manage Citizenship <ChevronRight className="w-4 h-4" /></>}
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-50 border-2 border-dashed border-indigo-200 flex items-center justify-center mb-6">
                <Crown className="w-10 h-10 text-indigo-300" />
              </div>
              <h4 className="font-black text-slate-900 text-xl mb-2">Passive Citizen</h4>
              <p className="text-slate-500 text-sm font-medium mb-8 max-w-[220px]">
                Unlock full participation and begin your progression journey.
              </p>
              <Link
                href="/subscribe"
                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all"
              >
                Activate Membership
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
