# GreenJack

GreenJack is a subscription-based full-stack web application that combines golf performance tracking, a draw-based reward system, and charitable contributions into a single platform.

The system is designed with a strong emphasis on **data correctness, real-time state consistency, and production-grade architecture**, following a detailed product requirements specification.

---

## Overview

The platform enables users to:

* Subscribe via a recurring billing system
* Submit and manage their latest golf scores
* Participate in monthly draw-based prize pools
* Contribute a portion of their subscription to selected charities

The application intentionally avoids traditional golf aesthetics and instead focuses on a modern, impact-driven user experience.

---

## Live Application

https://greenjack.vercel.app

---

## Core Features

### Subscription System

* Monthly and yearly subscription plans via Stripe
* Secure checkout with webhook-based synchronization
* Real-time validation of subscription status
* Access control enforced at middleware and server levels

---

### Score Management

* Users maintain their latest five scores (Stableford format)
* Automatic rolling logic replaces the oldest score
* Validation for score range and unique dates
* Reverse chronological display

---

### Draw and Reward Engine

* Monthly draw execution
* Tiered reward structure:

  * 5-match (jackpot, rollover enabled)
  * 4-match
  * 3-match
* Admin-controlled execution and simulation
* Deterministic and testable logic

---

### Charity Integration

* Charity selection during onboarding
* Minimum 10% contribution from subscription
* Configurable contribution percentage
* Transparent tracking of contributions

---

### User Dashboard

* Subscription status and renewal tracking
* Score entry and management
* Draw participation overview
* Winnings and payout status
* Charity contribution summary

---

### Admin Dashboard

* User and subscription management
* Draw configuration and execution
* Charity CRUD operations
* Winner verification and payout tracking
* Reporting and analytics

---

### Email System

* Transactional emails for winner verification
* Notifications using Resend

---

## Architecture

The application follows a modular full-stack architecture:

* **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
* **Backend:** Supabase (PostgreSQL, Auth, RLS)
* **Payments:** Stripe (Subscriptions, Webhooks)
* **Email:** Resend
* **Deployment:** Vercel

---

## System Design Highlights

* Webhook-driven subscription lifecycle (Stripe → database sync)
* Idempotent event handling to prevent duplicate processing
* Server-side access control for all protected resources
* Consistent state management between Stripe and database
* Graceful handling of webhook delays and retry scenarios

---

## Security and Reliability

* Supabase Row Level Security (RLS) policies enforced
* Stripe webhook signature verification
* Service-role usage restricted to backend operations
* Subscription gating implemented at multiple layers
* Safe handling of failed payments and subscription lapses

---

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

STRIPE_PRICE_MONTHLY=
STRIPE_PRICE_YEARLY=

RESEND_API_KEY=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Local Development

```bash
git clone https://github.com/your-username/greenjack.git
cd greenjack
npm install
npm run dev
```

---

## Deployment

The application is deployed on Vercel with:

* Supabase as the backend
* Stripe webhooks configured for the production domain
* Environment variables managed via Vercel dashboard

---

## Testing Coverage

The system has been validated against the following scenarios:

* User authentication and session handling
* Subscription lifecycle (creation, renewal, cancellation)
* Score entry and rolling logic
* Draw execution and prize distribution
* Charity contribution calculations
* Winner verification workflow
* Access control for protected routes
* Handling of webhook retries and edge cases

---

## Project Context

This project was developed as part of a full-stack evaluation process based on a structured Product Requirements Document. The goal was to assess:

* System design quality
* Data handling accuracy
* UI/UX execution
* Scalability and reliability

---

## Author

Saad Arqam

---

## License

This project is intended for evaluation and demonstration purposes.
