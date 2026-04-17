'use client';

import { useState, useEffect } from 'react';
import { AdminStats } from '@/lib/types';
import { formatPrice } from '@/lib/pricing';

interface AdminOverviewProps {
  className?: string;
}

export default function AdminOverview({ className = '' }: AdminOverviewProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const mockStats: AdminStats = {
        totalUsers: 1247,
        activeSubscriptions: 892,
        totalPrizePool: 150000,
        charityTotals: [
          {
            charity_id: '1',
            charity_name: 'Golf Foundation for Youth',
            total_contributions: 45000
          },
          {
            charity_id: '2',
            charity_name: 'Green Earth Golf Initiative',
            total_contributions: 38000
          },
          {
            charity_id: '3',
            charity_name: 'Veterans Golf Rehabilitation Program',
            total_contributions: 67000
          }
        ]
      };
      
      setStats(mockStats);
      setError('');
    } catch (err) {
      setError('Failed to fetch admin statistics');
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
        Admin Overview
      </h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {stats && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-gray-600">Total Users</div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.activeSubscriptions.toLocaleString()}</div>
                <div className="text-gray-600">Active Subscriptions</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{formatPrice(stats.totalPrizePool * 100)}</div>
                <div className="text-gray-600">Total Prize Pool</div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {((stats.activeSubscriptions / stats.totalUsers) * 100).toFixed(1)}%
                </div>
                <div className="text-gray-600">Conversion Rate</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="font-semibold text-gray-900 mb-4">Charity Contributions Total</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.charityTotals.map((charity) => (
                <div key={charity.charity_id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-2">{charity.charity_name}</h5>
                  <div className="text-2xl font-bold text-gray-900">{formatPrice(charity.total_contributions * 100)}</div>
                  <div className="text-sm text-gray-600">Total Contributions</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                View All Users
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                Manage Draws
              </button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                Review Winnings
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                Export Reports
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
