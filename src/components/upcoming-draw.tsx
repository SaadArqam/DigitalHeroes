'use client';

import { useState, useEffect } from 'react';
import { DashboardStats } from '@/lib/types';

interface UpcomingDrawProps {
  className?: string;
}

export default function UpcomingDraw({ className = '' }: UpcomingDrawProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchDrawStats();
  }, []);

  const fetchDrawStats = async () => {
    try {
      // Mock data for demonstration - in real app, fetch from API
      const mockStats: DashboardStats = {
        totalScores: 12,
        activeSubscription: true,
        subscriptionPlan: 'monthly',
        subscriptionStatus: 'active',
        nextDrawDate: '2024-05-01',
        scoresEntered: 8,
        totalWinnings: 2500,
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
          }
        ]
      };
      
      setStats(mockStats);
      setError('');
    } catch (err) {
      setError('Failed to fetch draw statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-32 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upcoming Draw
      </h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {stats && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Draw Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-800 mb-3">Next Draw Information</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-700">Draw Date:</span>
                <span className="font-medium text-blue-900">{stats.nextDrawDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Draw Mode:</span>
                <span className="font-medium text-blue-900 capitalize">Algorithmic (Weighted)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Jackpot:</span>
                <span className="font-medium text-blue-900">₹4,000</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Your Participation</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex justify-between">
                  <span>Scores Entered:</span>
                  <span className="font-medium text-blue-900">{stats.scoresEntered}/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Draw Numbers:</span>
                  <span className="font-medium text-blue-900">12, 23, 31, 45</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-3">Draw Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.totalScores}</div>
                <div className="text-gray-600">Total Scores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.recentWinnings.length}</div>
                <div className="text-gray-600">Total Winnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">₹{stats.totalWinnings.toLocaleString()}</div>
                <div className="text-gray-600">Total Amount Won</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3">Prize Distribution</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>3-Match (25%):</span>
                  <span className="font-medium text-gray-900">₹1,000</span>
                </div>
                <div className="flex justify-between">
                  <span>4-Match (35%):</span>
                  <span className="font-medium text-gray-900">₹1,400</span>
                </div>
                <div className="flex justify-between">
                  <span>5-Match (40%):</span>
                  <span className="font-medium text-gray-900">₹1,600</span>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
                  <span className="text-blue-700">Jackpot (40%):</span>
                  <span className="font-medium text-gray-900">₹1,600</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
