'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Subscription } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
    <motion.div whileHover={{ y: -4 }} className="h-full">
      <Card className="h-full flex flex-col relative overflow-hidden border border-white/40 shadow-2xl shadow-indigo-500/10 bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-3xl">
        {isActive && (
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
        )}
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
             </div>
             <CardTitle className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Elite Access</CardTitle>
          </div>
          <Badge variant={isActive ? 'emerald' : 'slate'} className="ml-2 shadow-sm font-black tracking-widest uppercase">
            {isActive ? 'Active' : 'Locked'}
          </Badge>
        </CardHeader>
        
        <CardContent className="flex-grow flex flex-col relative z-10">
          {subscription ? (
            <div className="space-y-6 flex-grow">
              <div className="group relative pointer-events-none mt-4">
                <div className="text-5xl font-black text-slate-900 uppercase tracking-tighter drop-shadow-sm group-hover:scale-105 origin-left transition-transform duration-500">
                  {subscription.plan}
                </div>
                <div className="mt-2 text-slate-500 font-bold bg-white/50 backdrop-blur-sm inline-block px-3 py-1 rounded-full border border-slate-200/50 shadow-sm">
                  {formatPrice(getPlanPrice(subscription.plan)?.amount || 0)} / {subscription.plan === 'monthly' ? 'month' : 'year'}
                </div>
              </div>

              <div className="space-y-4 pt-10">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/60 border border-white/40 shadow-sm backdrop-blur-md hover:bg-white transition-colors">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">Next Billing</span>
                  <span className="text-slate-800 font-bold">{new Date(subscription.current_period_end).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="pt-8 mt-auto">
                <Button 
                  variant="outline" 
                  className="w-full relative overflow-hidden group border-indigo-200 text-indigo-700 hover:border-indigo-500 hover:text-indigo-900 hover:bg-indigo-50 font-bold py-6 text-sm uppercase tracking-widest shadow-sm hover:shadow-md transition-all rounded-xl"
                  onClick={handleManageBilling}
                  disabled={loading}
                >
                  <span className="relative z-10">{loading ? 'Accessing Portal...' : 'Manage Subscription'}</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center py-12 text-center relative mt-4">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"
              ></motion.div>
              
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center text-slate-400 mb-6 shadow-inner border border-white">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-slate-800 font-black text-xl mb-2">Claim Your Identity</p>
              <p className="text-slate-500 font-medium mb-8 text-sm max-w-[200px] leading-relaxed">Upgrade to unlock premium prize pools and track your legacy.</p>
              <Button variant="primary" className="w-full py-6 rounded-xl font-black tracking-widest uppercase shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform bg-gradient-to-r from-brand-indigo to-indigo-500 border-none text-white">Unlock Platform</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
