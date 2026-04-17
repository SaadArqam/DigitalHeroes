'use client';

import { useState, useEffect } from 'react';
import { AdminUser } from '@/lib/types';

interface AdminUsersProps {
  className?: string;
}

export default function AdminUsers({ className = '' }: AdminUsersProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Mock data for demonstration - in real app, fetch from API
      const mockUsers: AdminUser[] = [
        {
          id: '1',
          email: 'admin@golfplatform.com',
          is_admin: true,
          subscription_status: 'active',
          subscription_plan: 'yearly',
          total_scores: 45,
          created_at: '2024-01-15'
        },
        {
          id: '2',
          email: 'user1@example.com',
          is_admin: false,
          subscription_status: 'active',
          subscription_plan: 'monthly',
          total_scores: 12,
          created_at: '2024-02-20'
        },
        {
          id: '3',
          email: 'user2@example.com',
          is_admin: false,
          subscription_status: 'canceled',
          subscription_plan: undefined,
          total_scores: 8,
          created_at: '2024-01-10'
        },
        {
          id: '4',
          email: 'user3@example.com',
          is_admin: false,
          subscription_status: 'active',
          subscription_plan: 'monthly',
          total_scores: 23,
          created_at: '2024-03-05'
        },
        {
          id: '5',
          email: 'user4@example.com',
          is_admin: false,
          subscription_status: 'past_due',
          subscription_plan: 'monthly',
          total_scores: 15,
          created_at: '2024-02-28'
        }
      ];
      
      setUsers(mockUsers);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditScores = (userId: string) => {
    // In real app, this would open a modal to edit scores
    alert(`Edit scores for user ${userId} - Feature coming soon!`);
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.subscription_status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'canceled': return 'red';
      case 'past_due': return 'yellow';
      case 'incomplete': return 'orange';
      case 'trialing': return 'blue';
      default: return 'gray';
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
        User Management
      </h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900">All Users ({users.length})</h4>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scores
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${user.is_admin ? 'bg-purple-500' : 'bg-gray-400'}`}></div>
                    <span className="font-medium">{user.email}</span>
                    {user.is_admin && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        ADMIN
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.subscription_plan ? (
                    <div>
                      <div className="font-medium capitalize">{user.subscription_plan}</div>
                      <div className={`text-sm ${getStatusColor(user.subscription_status)}`}>
                        {user.subscription_status}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">No Subscription</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.total_scores}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.subscription_status)}`}>
                    {user.subscription_status || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditScores(user.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit Scores
                    </button>
                    <button className="text-red-600 hover:text-red-800 font-medium">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
