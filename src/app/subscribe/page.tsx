'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createCheckoutSession, getUserSubscription } from '@/app/actions/subscriptions';
import { monthlyPlan, yearlyPlan, formatPrice } from '@/lib/pricing';

function SubscribePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    // Check for success/canceled parameters
    const successParam = searchParams.get('success');
    const canceledParam = searchParams.get('canceled');
    const sessionId = searchParams.get('session_id');

    if (successParam === 'true' && sessionId) {
      setSuccess('Payment successful! Your subscription is being activated.');
      // Clear URL parameters
      router.replace('/subscribe');
    } else if (canceledParam === 'true') {
      setError('Payment was canceled. You can try again anytime.');
      // Clear URL parameters
      router.replace('/subscribe');
    }

    // Fetch user's current subscription
    fetchSubscription();
  }, [searchParams, router]);

  const fetchSubscription = async () => {
    try {
      const result = await getUserSubscription();
      if (result.success && result.data) {
        setSubscription(result.data);
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
    }
  };

  const handleSubscribe = async (planId: 'monthly' | 'yearly') => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await createCheckoutSession(planId);
      
      if (result.success && result.url) {
        // Redirect to Stripe checkout
        window.location.href = result.url;
      } else {
        setError(result.message || 'Failed to create checkout session');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (subscription?.status === 'active') {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You're already subscribed!</h2>
              <p className="text-gray-600 mb-6">
                You have an active {subscription.plan} subscription. 
                Your current period ends on {new Date(subscription.current_period_end).toLocaleDateString()}.
              </p>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Subscription Details:</h3>
                  <div className="text-left space-y-2">
                    <p><span className="font-medium">Plan:</span> {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}</p>
                    <p><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">{subscription.status}</span></p>
                    <p><span className="font-medium">Next billing:</span> {new Date(subscription.current_period_end).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Golf Platform Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock premium features to enhance your golf scoring experience and participate in exciting charity draws
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700">
              {success}
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[monthlyPlan, yearlyPlan].map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                plan.id === 'yearly' ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {plan.id === 'yearly' && (
                <div className="bg-blue-500 text-white text-center py-2 text-sm font-semibold">
                  MOST POPULAR - Save {plan.savings}%
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{formatPrice(plan.amount)}</span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSubscribe(plan.id as 'monthly' | 'yearly')}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-md font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    plan.id === 'yearly'
                      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                      : 'bg-gray-800 hover:bg-gray-900 focus:ring-gray-500'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Processing...' : `Subscribe to ${plan.name}`}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Our Premium Plans?</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Advanced Scoring Analytics</h4>
                <p className="text-gray-600 text-sm">
                  Track your progress over time with detailed insights and trends
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Charity Draw Participation</h4>
                <p className="text-gray-600 text-sm">
                  Join weekly draws and contribute to charitable causes
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Priority Support</h4>
                <p className="text-gray-600 text-sm">
                  Get help when you need it with our dedicated support team
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Cancel Anytime</h4>
                <p className="text-gray-600 text-sm">
                  No long-term commitments, cancel your subscription at any time
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Can I change my plan later?</h4>
                <p className="text-gray-600 text-sm">
                  Yes, you can upgrade or downgrade your plan at any time from your account settings.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600 text-sm">
                  We accept all major credit cards through our secure payment processor, Stripe.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Is my payment information secure?</h4>
                <p className="text-gray-600 text-sm">
                  Yes, all payments are processed securely through Stripe with industry-standard encryption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-96 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <SubscribePageContent />
    </Suspense>
  );
}
