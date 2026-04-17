// Pricing configuration for the golf platform
// Centralized source of truth for all pricing information

export interface PricingPlan {
  id: string;
  name: string;
  amount: number; // in cents (Stripe format)
  currency: string;
  interval: 'month' | 'year';
  stripePriceId: string;
  features: string[];
  savings?: number; // percentage saved compared to monthly
}

export interface PricingConfig {
  currency: string;
  currencySymbol: string;
  locale: string;
  plans: {
    monthly: PricingPlan;
    yearly: PricingPlan;
  };
}

export const pricingConfig: PricingConfig = {
  currency: 'EUR',
  currencySymbol: 'EUR',
  locale: 'en-IE', // Ireland locale
  plans: {
    monthly: {
      id: 'monthly',
      name: 'Monthly',
      amount: 999, // 9.99 EUR in cents
      currency: 'eur',
      interval: 'month',
      stripePriceId: process.env.STRIPE_PRICE_MONTHLY!,
      features: [
        'Unlimited score entries',
        'Monthly draws participation',
        'Charity contribution matching',
        'Priority customer support',
        'Mobile app access'
      ]
    },
    yearly: {
      id: 'yearly',
      name: 'Yearly',
      amount: 9990, // 99.90 EUR in cents (2 months free)
      currency: 'eur',
      interval: 'year',
      stripePriceId: process.env.STRIPE_PRICE_YEARLY!,
      savings: 17, // Save ~17% with yearly plan
      features: [
        'Everything in Monthly',
        '12 months for the price of 10',
        'Exclusive tournament access',
        'Advanced analytics dashboard',
        'Premium customer support',
        'Early feature access'
      ]
    }
  }
};

// Helper functions for pricing display
export function formatPrice(amount: number, currency: string = pricingConfig.currency): string {
  return new Intl.NumberFormat(pricingConfig.locale, {
    style: 'currency',
    currency: currency.toLowerCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount / 100); // Convert from cents to euros
}

export function getPlanPrice(planId: string): PricingPlan | null {
  return pricingConfig.plans[planId as keyof typeof pricingConfig.plans] || null;
}

export function getMonthlyEquivalent(yearlyPlan: PricingPlan): number {
  return yearlyPlan.amount / 12; // Monthly equivalent in cents
}

export function calculateSavings(monthlyPlan: PricingPlan, yearlyPlan: PricingPlan): number {
  const yearlyMonthly = getMonthlyEquivalent(yearlyPlan);
  const monthlyPrice = monthlyPlan.amount;
  return Math.round(((monthlyPrice - yearlyMonthly) / monthlyPrice) * 100);
}

// Export individual plans for easy access
export const monthlyPlan = pricingConfig.plans.monthly;
export const yearlyPlan = pricingConfig.plans.yearly;
