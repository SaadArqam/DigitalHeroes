'use client';

import { CheckCircle, XCircle, Clock, CreditCard, ChevronRight, Zap, Crown } from 'lucide-react';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'lapsed': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'cancelled': return 'text-text-muted bg-card border-card-border';
      default: return 'text-text-muted bg-card border-card-border';
    }
  };

  return (
    <div className="bg-card border border-card-border rounded-[2.5rem] p-8 shadow-premium group hover:border-primary-start/30 transition-all">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-background border border-card-border flex items-center justify-center text-primary-end shadow-inner">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight leading-none mb-1">Subscription</h3>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Membership Protocol</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(subscription?.status || 'none')}`}>
          {subscription?.status || 'Inactive'}
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-5 bg-background/50 border border-card-border rounded-2xl">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Active Plan</p>
          <div className="flex justify-between items-center">
             <span className="text-2xl font-black text-white capitalize">{subscription?.plan || 'Free'} Citizen</span>
             <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{subscription?.plan === 'yearly' ? '₹500/yr' : '₹50/mo'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 text-sm">
          <span className="font-bold text-text-secondary flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-muted" /> Next Renewal
          </span>
          <span className="font-black text-white">
            {formatDate(subscription?.current_period_end || null)}
          </span>
        </div>

        {isLapsed && (
          <Link href="/subscribe" className="block w-full">
            <Button className="w-full rounded-2xl py-6 bg-rose-500 hover:bg-rose-600 shadow-premium">
              Renew Membership Now
            </Button>
          </Link>
        )}
        
        {!subscription && (
          <Link href="/subscribe" className="block w-full">
            <Button className="w-full rounded-2xl py-6 shadow-glow">
              Activate Citizenship
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
