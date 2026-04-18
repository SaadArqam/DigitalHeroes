'use client';

import { CheckCircle, XCircle, Clock, CreditCard, ChevronRight, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';

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
    return format(date, "MMM d, yyyy");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'lapsed': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'cancelled': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl group hover:border-slate-700 transition-all">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-primary-end">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight leading-none mb-1">Subscription</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Membership Protocol</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(subscription?.status || 'none')}`}>
          {subscription?.status || 'Inactive'}
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Active Plan</p>
          <div className="flex justify-between items-center">
             <span className="text-2xl font-black text-white capitalize">{subscription?.plan || 'Free'} Citizen</span>
             <span className="text-sm font-bold text-slate-400">{subscription?.plan === 'yearly' ? '₹500/yr' : '₹50/mo'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 text-sm">
          <span className="font-bold text-slate-400 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-500" /> Next Renewal
          </span>
          <span className="font-black text-white">
            {formatDate(subscription?.current_period_end || null)}
          </span>
        </div>

        {isLapsed && (
          <Link href="/subscribe" className="block w-full">
            <Button variant="primary" className="w-full rounded-2xl py-6 bg-rose-500 hover:bg-rose-600 shadow-rose-500/20">
              Renew Membership Now
            </Button>
          </Link>
        )}
        
        {!subscription && (
          <Link href="/subscribe" className="block w-full">
            <Button variant="primary" className="w-full rounded-2xl py-6">
              Activate Citizenship
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
