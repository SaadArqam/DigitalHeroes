'use client';

import { useState, useEffect } from 'react';
import { DashboardStats } from '@/lib/types';

interface WinningsOverviewProps {
  className?: string;
}

export default function WinningsOverview({ className = '' }: WinningsOverviewProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchWinnings();
  }, []);

  const fetchWinnings = async () => {
    try {
      // Mock data for demonstration - in real app, fetch from API
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
      setError('Failed to fetch winnings data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'green';
      case 'verified': return 'blue';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'verified': return 'Verified';
      case 'pending': return 'Pending';
      default: return status;
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
        Winnings Overview
      </h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {stats && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">₹{stats.totalWinnings.toLocaleString()}</div>
                <div className="text-gray-600">Total Winnings</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.recentWinnings.length}</div>
                <div className="text-gray-600">Total Wins</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.scoresEntered}</div>
                <div className="text-gray-600">Scores Entered</div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stats.nextDrawDate ? new Date(stats.nextDrawDate).toLocaleDateString() : 'TBD'}</div>
                <div className="text-gray-600">Next Draw</div>
              </div>
            </div>
          </div>

          {/* Recent Winnings Table */}
          <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow-md p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Recent Winnings</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Match Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prize Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentWinnings.map((winning) => (
                    <tr key={winning.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(winning.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className={`font-medium ${winning.match_count === 5 ? 'text-purple-600' : winning.match_count === 4 ? 'text-blue-600' : 'text-green-600'}`}>
                            {winning.match_count}-Match
                          </span>
                          <div className="ml-2 flex">
                            {[...Array(winning.match_count)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-2 0 0l7 7a4 4 0z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{winning.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(winning.status)}`}>
                          {getStatusText(winning.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Legend</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 text-green-500 mr-2"></div>
                <span className="text-gray-600">3-Match (25% prize pool)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 text-blue-600 mr-2"></div>
                <span className="text-gray-600">4-Match (35% prize pool)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 text-purple-600 mr-2"></div>
                <span className="text-gray-600">5-Match (40% prize pool)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
