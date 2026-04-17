'use client';

import { useState, useEffect, Suspense } from 'react';
import SubscriptionStatus from '@/components/subscription-status';
import ScoreEntry from '@/components/score-entry';
import CharityPreference from '@/components/charity-preference';
import UpcomingDraw from '@/components/upcoming-draw';
import WinningsOverview from '@/components/winnings-overview';
import { DashboardStats } from '@/lib/types';

function DashboardContentComponent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const mockStats: DashboardStats = {
        totalScores: 15,
        activeSubscription: true,
        subscriptionPlan: 'monthly',
        subscriptionStatus: 'active',
        nextDrawDate: '2024-05-01',
        scoresEntered: 12,
        totalWinnings: 5000,
        recentWinnings: [
          {
            id: '1',
            amount: 1500,
            match_count: 4,
            date: '2024-04-15',
            status: 'paid'
          },
          {
            id: '2', 
            amount: 1000,
            match_count: 3,
            date: '2024-04-01',
            status: 'verified'
          },
          {
            id: '3',
            amount: 800,
            match_count: 5,
            date: '2024-03-15',
            status: 'verified'
          },
          {
            id: '4',
            amount: 1200,
            match_count: 3,
            date: '2024-02-15',
            status: 'paid'
          },
          {
            id: '5',
            amount: 500,
            match_count: 4,
            date: '2024-01-15',
            status: 'pending'
          }
        ]
      };
      
      setStats(mockStats);
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-32 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Your Golf Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Manage your scores, subscriptions, charity preferences, and track your winnings
          </p>
        </div>

        {error && (
          <div className="mb-6 max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
              {error}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SubscriptionStatus />
          </div>

          <div className="lg:col-span-1">
            <ScoreEntry />
          </div>

          <div className="lg:col-span-1">
            <CharityPreference />
          </div>

          <div className="lg:col-span-1">
            <UpcomingDraw />
          </div>

          <div className="lg:col-span-3">
            <WinningsOverview />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-32 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <DashboardContentComponent />
    </Suspense>
  );
}
