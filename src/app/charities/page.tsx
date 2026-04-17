'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { getCharities, searchCharities } from '@/app/actions/charities';
import { Charity } from '@/lib/types';

function CharitiesPageContent() {
  const router = useRouter();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [filteredCharities, setFilteredCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchCharities();
  }, []);

  useEffect(() => {
    filterCharities();
  }, [charities, showFeaturedOnly]);

  const fetchCharities = async () => {
    try {
      const result = await getCharities();
      if (result.success) {
        setCharities(result.data || []);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch charities');
    } finally {
      setLoading(false);
    }
  };

  const filterCharities = () => {
    let filtered = charities;
    
    if (showFeaturedOnly) {
      filtered = filtered.filter(charity => charity.is_featured);
    }
    
    setFilteredCharities(filtered);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      filterCharities();
      return;
    }

    setSearchLoading(true);
    try {
      const result = await searchCharities(searchQuery);
      if (result.success) {
        setFilteredCharities(result.data || []);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to search charities');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCharityClick = (charityId: string) => {
    router.push(`/charities/${charityId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600">Loading charities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Support a Charity
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our featured charities and make a difference in the community through your golf participation
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
              {error}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Charities
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Show featured charities only
              </label>
            </div>
          </form>
        </div>

        {/* Results Summary */}
        {!searchQuery && (
          <div className="text-center mb-6">
            <p className="text-gray-600">
              {showFeaturedOnly 
                ? `Showing ${filteredCharities.length} featured charities`
                : `Showing ${filteredCharities.length} charities`
              }
            </p>
          </div>
        )}

        {/* Search Results */}
        {searchQuery && (
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Found {filteredCharities.length} charities matching "{searchQuery}"
            </p>
          </div>
        )}

        {/* Charities Grid */}
        {filteredCharities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {searchQuery ? 'No charities found matching your search.' : 'No charities available.'}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredCharities.map((charity) => (
              <div
                key={charity.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCharityClick(charity.id)}
              >
                {charity.is_featured && (
                  <div className="bg-yellow-400 text-white text-center py-2 text-sm font-semibold">
                    FEATURED
                  </div>
                )}
                
                <div className="p-6">
                  <div className="mb-4">
                    <img
                      src={charity.image_url}
                      alt={charity.name}
                      className="w-full h-48 object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540206395-68808572932b?w=800&h=600&fit=crop';
                      }}
                    />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {charity.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {charity.description}
                  </p>
                  
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CharitiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <CharitiesPageContent />
    </Suspense>
  );
}
