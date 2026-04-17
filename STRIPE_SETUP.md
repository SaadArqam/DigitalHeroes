# Stripe Subscription System Setup Guide

## Overview
This guide will help you set up the complete Stripe subscription system for your golf platform.

## Prerequisites
- Stripe account (sign up at [stripe.com](https://stripe.com))
- Active Supabase project with the `subscriptions` table created

## 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key (test mode)
STRIPE_WEBHOOK_SECRET=whsec_...  # Webhook signing secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Your Stripe publishable key

# Stripe Price IDs (create these in your Stripe dashboard)
STRIPE_PRICE_MONTHLY=price_...  # Monthly plan price ID
STRIPE_PRICE_YEARLY=price_...   # Yearly plan price ID

# Optional: Public price IDs (for frontend display)
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_YEARLY=price_...

# Base URL for redirects
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Change to your production domain
```

## 2. Stripe Dashboard Setup

### 2.1 Create Products and Prices

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Products** > **Add product**
3. Create two products:

#### Monthly Plan
- **Name**: Monthly Golf Platform Subscription
- **Description**: Monthly access to premium golf scoring features
- **Price**: ₹499 INR
- **Billing**: Recurring (monthly)
- **Copy the Price ID** and add it to your environment variables as `STRIPE_PRICE_MONTHLY`

#### Yearly Plan
- **Name**: Yearly Golf Platform Subscription
- **Description**: Yearly access to premium golf scoring features (save 17%)
- **Price**: ₹4,999 INR
- **Billing**: Recurring (yearly)
- **Copy the Price ID** and add it to your environment variables as `STRIPE_PRICE_YEARLY`

### 2.2 Configure Webhooks

1. In Stripe Dashboard, go to **Developers** > **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://your-domain.com/api/webhooks/stripe`
   - For development: `http://localhost:3000/api/webhooks/stripe`
4. **Listen for events**: Select these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. **Copy the signing secret** and add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

### 2.3 Test Webhook Endpoint

For local development, use the Stripe CLI to test webhooks:

```bash
# Install Stripe CLI
npm install -g stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will give you a webhook signing secret for testing. Use this in your `.env.local` during development.

## 3. Database Setup

Ensure your Supabase database has the `subscriptions` table with this structure:

```sql
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete', 'incomplete_expired', 'trialing', 'unpaid')),
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
```

## 4. Testing the System

### 4.1 Test Checkout Flow

1. Start your development server: `npm run dev`
2. Navigate to `/subscribe`
3. Click "Subscribe to Monthly Plan" or "Subscribe to Yearly Plan"
4. You'll be redirected to Stripe's checkout page
5. Use Stripe test cards for testing:
   - **Success**: `4242 4242 4242 4242`
   - **Declined**: `4000 0000 0000 0002`
   - **Requires authentication**: `4000 0025 0000 3155`

### 4.2 Test Webhook Events

1. After completing a test payment, check your Supabase `subscriptions` table
2. The webhook should automatically create/update the subscription record
3. Check the webhook logs in your Stripe Dashboard

### 4.3 Test Subscription Management

1. After subscribing, visit `/subscribe` again
2. You should see your active subscription status
3. Test cancellation flow (if implemented)

## 5. Production Deployment

### 5.1 Update Environment Variables

For production, update these variables:

```env
STRIPE_SECRET_KEY=sk_live_...  # Use live keys for production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com
```

### 5.2 Deploy Webhook Endpoint

1. Deploy your application to Vercel or your hosting provider
2. Update the webhook endpoint URL in Stripe Dashboard to your production URL
3. Test the webhook endpoint in production

### 5.3 Security Considerations

- Never expose your Stripe secret key in client-side code
- Use HTTPS for all production endpoints
- Validate webhook signatures (already implemented)
- Monitor webhook delivery logs in Stripe Dashboard

## 6. Troubleshooting

### Common Issues

**Webhook errors:**
- Check that the webhook secret matches exactly
- Ensure your endpoint URL is accessible from Stripe
- Verify the webhook events are properly configured

**Checkout errors:**
- Ensure Stripe price IDs are correct and active
- Check that your Stripe account is properly configured
- Verify environment variables are set correctly

**Database errors:**
- Ensure Supabase connection is working
- Check that the `subscriptions` table exists with correct schema
- Verify user authentication is working

### Debug Mode

Add logging to debug issues:

```typescript
// In webhook handler
console.log('Webhook event type:', event.type);
console.log('Webhook event data:', JSON.stringify(event.data, null, 2));

// In checkout session creation
console.log('Creating checkout session for plan:', plan);
console.log('User ID:', user.id);
```

## 7. File Structure

The Stripe subscription system consists of these files:

```
src/
  app/
    actions/
      subscriptions.ts          # Server actions for checkout and subscription management
    api/
      webhooks/
        stripe/
          route.ts              # Webhook event handler
    subscribe/
      page.tsx                 # Subscription pricing and checkout page
  lib/
    types.ts                   # TypeScript interfaces
    validations.ts            # Zod validation schemas
```

## 8. Next Steps

Once the basic system is working, you can:

1. Add customer portal for subscription management
2. Implement trial periods
3. Add usage-based billing
4. Set up subscription analytics
5. Add email notifications for subscription events
6. Implement dunning management for failed payments

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Next.js App Router Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
