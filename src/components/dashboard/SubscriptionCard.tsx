'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createBillingPortalSession } from '@/app/actions/subscriptions';
import { Crown, ShieldCheck, CreditCard, ChevronRight, Zap, Star } from 'lucide-react';

interface Subscription {
  plan: string;
  status: string;
  current_period_end: string;
  stripe_customer_id?: string;
}

interface SubscriptionCardProps {
  subscription: Subscription | null;
}

const PLAN_CONFIG: Record<string, { price: string, color: string, icon: any }> = {
  monthly: { price: '₹50/mo', color: 'indigo', icon: Zap },
  yearly:  { price: '₹500/yr', color: 'purple', icon: Star },
};

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);
  const isActive = subscription?.status === 'active';
  const config = subscription ? PLAN_CONFIG[subscription.plan] || PLAN_CONFIG.monthly : PLAN_CONFIG.monthly;
  const Icon = config.icon;

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
      className="h-full group"
    >
      <div className="h-full rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden relative">
        
        {/* Subtle Background Accent */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${config.color}-50 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none group-hover:bg-${config.color}-100 transition-colors duration-500`} />

        {/* Header */}
        <div className="px-8 pt-10 pb-6 flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform duration-500`}>
              <Crown className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-xl tracking-tight">Citizen Status</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Membership Protocol</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-500 ${
            isActive
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-50'
              : 'bg-slate-50 text-slate-400 border-slate-100'
          }`}>
            {isActive && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
            <ShieldCheck className="w-3 h-3" /> {isActive ? 'Verified' : 'Unverified'}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 px-8 py-6 flex flex-col relative z-10">
          {subscription ? (
            <div className="flex-1 flex flex-col">
              {/* Plan display Card */}
              <div className={`p-6 rounded-[2rem] bg-slate-50 border border-slate-100 mb-8 transition-all duration-500 group-hover:border-${config.color}-200 group-hover:bg-${config.color}-50/30`}>
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-xl bg-${config.color}-100 text-${config.color}-600`}>
                      <Icon className="w-5 h-5" />
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Contract Tier</p>
                      <h4 className="text-xl font-black text-slate-900 capitalize tracking-tight">{subscription.plan} Elite</h4>
                   </div>
                </div>
                
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-slate-900 tracking-tighter">{config.price}</span>
                   <span className="text-xs font-bold text-slate-400">Locked In</span>
                </div>
              </div>

              {/* Perks / Benefits */}
              <div className="space-y-4 mb-8">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 pb-2">Active Privileges</p>
                 {[
                   'Full Draw Eligibility',
                   'Instant Result Verification',
                   'Premium Support Access'
                 ].map((perk, i) => (
                   <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    key={perk} 
                    className="flex items-center gap-3"
                   >
                     <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                     </div>
                     <span className="text-sm font-bold text-slate-600">{perk}</span>
                   </motion.div>
                 ))}
              </div>

              {/* Billing Info Pill */}
              <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Next Cycle</span>
                 </div>
                 <span className="text-xs font-black text-slate-900">
                    {new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                 </span>
              </div>

              {/* CTA */}
              <button
                onClick={handleManageBilling}
                disabled={loading}
                className="w-full py-5 px-6 group/btn relative overflow-hidden bg-slate-900 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-indigo-600 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? 'Decrypting Portal...' : 'Manage Citizenship'} <ChevronRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 border-2 border-dashed border-indigo-200 flex items-center justify-center mb-6 animate-pulse">
                <Crown className="w-10 h-10 text-indigo-300" />
              </div>
              <h4 className="font-black text-slate-900 text-xl mb-2">Passive Citizen</h4>
              <p className="text-slate-500 text-sm font-medium mb-8 max-w-[220px] leading-relaxed">
                Unlock full participation and begin your progression journey.
              </p>
              <a
                href="/subscribe"
                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-all"
              >
                Activate Membership
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
