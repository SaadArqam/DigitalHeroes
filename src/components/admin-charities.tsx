'use client';

import { useState, useEffect } from 'react';
import { Charity } from '@/lib/types';

interface AdminCharitiesProps {
  className?: string;
}

export default function AdminCharities({ className = '' }: AdminCharitiesProps) {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [editingCharity, setEditingCharity] = useState<Charity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      // Mock data for demonstration - in real app, fetch from API
      const mockCharities: Charity[] = [
        {
          id: '1',
          name: 'Golf Foundation for Youth',
          description: 'Dedicated to introducing golf to underprivileged youth through education, equipment donations, and mentorship programs.',
          image_url: 'https://images.unsplash.com/photo-1559829269-a783e8e5c756?w=800&h=600&fit=crop',
          is_featured: true,
          created_at: '2024-01-15',
          updated_at: '2024-01-15'
        },
        {
          id: '2',
          name: 'Green Earth Golf Initiative',
          description: 'Environmental organization focused on making golf more sustainable.',
          image_url: 'https://images.unsplash.com/photo-1540206395-68808572932b?w=800&h=600&fit=crop',
          is_featured: true,
          created_at: '2024-02-20',
          updated_at: '2024-02-20'
        },
        {
          id: '3',
          name: 'Veterans Golf Rehabilitation Program',
          description: 'Supporting military veterans through golf therapy and rehabilitation programs.',
          image_url: 'https://images.unsplash.com/photo-1517120191895-7313b4a8c8a6?w=800&h=600&fit=crop',
          is_featured: false,
          created_at: '2024-03-10',
          updated_at: '2024-03-10'
        }
      ];
      
      setCharities(mockCharities);
      setError('');
    } catch (err) {
      setError('Failed to fetch charities');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCharity = (charity: Charity) => {
    setEditingCharity(charity);
  };

  const handleSaveCharity = async (charity: Charity) => {
    try {
      // In real app, this would call the charity API
      alert(`Saving charity: ${charity.name}`);
      
      // Update local state
      setCharities(charities.map(c => 
        c.id === charity.id ? charity : c
      ));
      setEditingCharity(null);
    } catch (err) {
      setError('Failed to save charity');
    }
  };

  const handleDeleteCharity = async (charityId: string) => {
    if (!confirm('Are you sure you want to delete this charity? This action cannot be undone.')) {
      return;
    }

    try {
      // In real app, this would call the charity API
      alert(`Deleting charity: ${charityId}`);
      
      // Update local state
      setCharities(charities.filter(c => c.id !== charityId));
    } catch (err) {
      setError('Failed to delete charity');
    }
  };

  const filteredCharities = charities.filter(charity => 
    charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        Charity Management
      </h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {/* Add Charity Button */}
      <div className="mb-6">
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
          Add New Charity
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search charities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Charities Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Charity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCharities.map((charity) => (
              <tr key={charity.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <img
                      src={charity.image_url}
                      alt={charity.name}
                      className="w-12 h-12 object-cover rounded-md mr-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540206395-68808572932b?w=800&h=600&fit=crop';
                      }}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{charity.name}</div>
                      <div className="text-sm text-gray-600 truncate max-w-xs">
                        {charity.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {charity.is_featured ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      FEATURED
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      REGULAR
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(charity.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCharity(charity)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCharity(charity.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
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
          Showing {filteredCharities.length} of {charities.length} charities
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

      {/* Edit Modal */}
      {editingCharity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Charity
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Charity Name
                </label>
                <input
                  type="text"
                  value={editingCharity.name}
                  onChange={(e) => setEditingCharity({...editingCharity, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingCharity.description}
                  onChange={(e) => setEditingCharity({...editingCharity, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editingCharity.image_url}
                  onChange={(e) => setEditingCharity({...editingCharity, image_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingCharity.is_featured}
                    onChange={(e) => setEditingCharity({...editingCharity, is_featured: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Charity</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingCharity(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveCharity(editingCharity)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
