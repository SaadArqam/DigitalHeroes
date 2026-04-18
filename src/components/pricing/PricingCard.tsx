'use client';

import { PricingPlan, formatPrice } from '@/lib/pricing';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ShieldCheck, Zap, Star, Sparkles } from 'lucide-react';

interface PricingCardProps {
  plan: PricingPlan;
  loading: boolean;
  onSubscribe: (planId: 'monthly' | 'yearly') => void;
  isPopular?: boolean;
}

export default function PricingCard({ plan, loading, onSubscribe, isPopular }: PricingCardProps) {
  return (
    <Card 
      variant={isPopular ? 'glass' : 'default'}
      className={`relative flex flex-col p-8 transition-all hover:shadow-lg hover:-translate-y-1 ${isPopular ? 'border-primary-start/40 shadow-glow' : 'border-card-border'}`}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-gradient px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg flex items-center gap-2">
          <Sparkles className="w-3 h-3" /> Most Popular
        </div>
      )}

      {plan.savings && (
        <div className="absolute top-10 right-10 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest">
          Save {plan.savings}%
        </div>
      )}

      <CardHeader className="!p-0 mb-10">
        <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${isPopular ? 'text-primary-end' : 'text-text-muted'}`}>
          {plan.name} Choice
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-black tracking-tighter text-white">{formatPrice(plan.amount).split('.')[0]}</span>
          <span className={`text-xl font-bold text-text-muted`}>
             /{plan.interval === 'month' ? 'mo' : 'yr'}
          </span>
        </div>
        <CardDescription className="text-text-secondary font-bold mt-4">
          {plan.interval === 'month' ? 'Perfect for trying things out.' : 'The ultimate package for true enthusiasts.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="!p-0 flex-grow flex flex-col">
        <ul className="space-y-4 mb-12">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-4">
              <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center bg-input-bg border border-input-border text-emerald-500 shadow-sm`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={`text-sm font-bold text-text-secondary`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <Button
            onClick={() => onSubscribe(plan.id as 'monthly' | 'yearly')}
            isLoading={loading}
            variant={isPopular ? 'primary' : 'secondary'}
            className="w-full rounded-2xl"
            size="lg"
          >
            {plan.id === 'yearly' ? 'Activate Yearly Access' : 'Begin Monthly Protocol'}
          </Button>

          <div className="mt-8 flex items-center justify-center gap-3">
             <ShieldCheck className="w-4 h-4 text-text-muted" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Secure Ledger Checkout</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
