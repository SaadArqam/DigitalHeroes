'use client';

import { Clock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Subscription {
  plan: string;
  status: string;
  current_period_end: string | null;
}

export function SubscriptionCard({ subscription }: { subscription: Subscription | null }) {
  const isActive = subscription?.status === 'active';
  const isLapsed = subscription?.status === 'lapsed';
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    if (isNaN(date.getTime()) || date.getFullYear() <= 1970) return "Not available";
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active': return 'text-[#00FFA3] bg-[#00FFA3]/5 border-[#00FFA3]/20';
      case 'lapsed': return 'text-red-500 bg-red-500/5 border-red-500/20';
      default: return 'text-[#8B949E] bg-white/5 border-white/10';
    }
  };

  return (
    <div className="bg-[#0D1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-premium group hover:border-[#00FFA3]/30 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#05070A] border border-white/5 flex items-center justify-center text-[#7C3AED] shadow-inner">
            <Crown className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight leading-none mb-1 uppercase">Subscription</h3>
            <p className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest leading-none">Citizenship Node</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(subscription?.status || 'none')}`}>
          {subscription?.status || 'Inactive'}
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-[#05070A]/50 border border-white/5 rounded-xl">
          <p className="text-[9px] font-black text-[#8B949E] uppercase tracking-widest mb-1.5 leading-none">Active Tier</p>
          <div className="flex justify-between items-center">
             <span className="text-xl font-black text-white uppercase tracking-tighter">{subscription?.plan || 'Free'}</span>
             <span className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest">{subscription?.plan === 'yearly' ? '₹500/yr' : '₹50/mo'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] px-1">
          <span className="font-black text-[#8B949E] uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" /> Next Cycle
          </span>
          <span className="font-black text-white tracking-widest">
            {formatDate(subscription?.current_period_end || null)}
          </span>
        </div>

        {isLapsed && (
          <Link href="/subscribe" className="block w-full">
            <Button className="w-full bg-red-500 text-white" variant="danger">
              Renew Membership
            </Button>
          </Link>
        )}
        
        {!subscription && (
          <Link href="/subscribe" className="block w-full">
            <Button className="w-full" variant="primary">
              Initialize Account
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
