'use client';

import { useState, useEffect } from 'react';
import { getUserSubscription } from '@/app/actions/subscriptions';
import { Subscription } from '@/lib/types';
import { getPlanPrice, formatPrice } from '@/lib/pricing';

interface SubscriptionStatusProps {
  className?: string;
}

export default function SubscriptionStatus({ className = '' }: SubscriptionStatusProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const result = await getUserSubscription();
      if (result.success) {
        setSubscription(result.data || null);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch subscription status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!subscription) return 'gray';
    switch (subscription.status) {
      case 'active': return 'green';
      case 'cancelled': return 'red';
      case 'lapsed': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusText = () => {
    if (!subscription) return 'No Subscription';
    switch (subscription.status) {
      case 'active': return 'Active';
      case 'cancelled': return 'Cancelled';
      case 'lapsed': return 'Lapsed';
      default: return subscription.status;
    }
  };

  const getRenewalDate = () => {
    if (!subscription || subscription.status !== 'active') return null;
    return new Date(subscription.current_period_end);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-32 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Subscription Status</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>

      {subscription ? (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Current Plan</h4>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900 capitalize">
                {subscription.plan}
              </span>
              <span className="text-gray-600">
                ({formatPrice(getPlanPrice(subscription.plan)?.amount || 0)}/{subscription.plan === 'monthly' ? 'month' : 'year'})
              </span>
            </div>
            
            <div className="text-sm text-gray-600 mb-3">
              <p>Next billing date: {new Date(subscription.current_period_end).toLocaleDateString()}</p>
              <p>Status: <span className={`font-medium ${getStatusColor()}`}>{getStatusText()}</span></p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Quick Actions</h4>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Manage Subscription
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                Upgrade Plan
              </button>
            </div>
          </div>

          {getRenewalDate() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Renewal Notice</h4>
              <p className="text-sm text-yellow-700">
                Your subscription will renew on {getRenewalDate()?.toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 6h2v6a2 2 0 00-2-2V4a2 2 0 00-2 2H4a2 2 0 00-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Subscription</h3>
          <p className="text-gray-600 mb-6">
            Subscribe to access premium features and participate in charity draws
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Subscribe Now
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
