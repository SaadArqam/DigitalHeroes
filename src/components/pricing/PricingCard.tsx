'use client';

import { PricingPlan, formatPrice } from '@/lib/pricing';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PricingCardProps {
  plan: PricingPlan;
  loading: boolean;
  onSubscribe: (planId: 'monthly' | 'yearly') => void;
  isPopular?: boolean;
}

export default function PricingCard({ plan, loading, onSubscribe, isPopular }: PricingCardProps) {
  return (
    <Card 
      variant={isPopular ? 'dark' : 'default'}
      className="relative flex flex-col"
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Badge variant="purple" className="shadow-lg">Most Popular</Badge>
        </div>
      )}

      {plan.savings && (
        <div className="absolute top-8 right-8">
          <Badge variant="emerald" size="xs">Save {plan.savings}%</Badge>
        </div>
      )}

      <CardHeader>
        <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-4 ${isPopular ? 'text-indigo-400' : 'text-slate-400'}`}>
          {plan.name} Choice
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-black tracking-tighter">{formatPrice(plan.amount).split('.')[0]}</span>
          <span className={`text-xl font-bold ${isPopular ? 'text-slate-500' : 'text-slate-400'}`}>
             /{plan.interval === 'month' ? 'mo' : 'yr'}
          </span>
        </div>
        <CardDescription className={isPopular ? 'text-slate-400 mt-4' : 'mt-4'}>
          {plan.interval === 'month' ? 'Perfect for trying things out.' : 'The ultimate package for true enthusiasts.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <ul className="space-y-4 mb-10">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isPopular ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-100 text-slate-600'}`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={`text-sm font-bold ${isPopular ? 'text-slate-300' : 'text-slate-600'}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => onSubscribe(plan.id as 'monthly' | 'yearly')}
          loading={loading}
          variant={isPopular ? 'secondary' : 'primary'}
          className="w-full"
          size="lg"
        >
          {plan.id === 'yearly' ? 'Go Yearly & Save' : 'Start Monthly Plan'}
        </Button>

        <div className="mt-6 flex items-center justify-center gap-2 opacity-50 grayscale contrast-125">
           <svg className="w-12 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-1.35-.14-2.61-.43-3.79-.88l.64-1.95c1.07.41 2.19.67 3.36.78.1-.8-.34-1.46-1.34-1.91-1.63-.73-2.66-1.57-2.66-3.15 0-1.64 1.14-2.82 2.76-3.23V6h2.82v1.8c.87.11 1.7.32 2.45.62l-.63 1.94c-.65-.25-1.33-.42-2.03-.51-.15.82.44 1.5 1.57 2.02 1.56.71 2.65 1.63 2.65 3.33.02 1.68-1.07 2.87-2.92 3.29z" />
           </svg>
           <span className="text-[10px] font-black uppercase tracking-tighter border-b border-white/20">Secure Checkout</span>
        </div>
      </CardContent>
    </Card>
  );
}
