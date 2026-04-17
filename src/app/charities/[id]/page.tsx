'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCharityById, saveCharityPreference, deleteCharityPreference, getUserCharityPreferences } from '@/app/actions/charities';
import { Charity, UserCharityPreference } from '@/lib/types';

function CharityProfilePageContent() {
  const router = useRouter();
  const params = useParams();
  const [charity, setCharity] = useState<Charity | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserCharityPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [preferenceLoading, setPreferenceLoading] = useState(false);
  const [showPreferenceForm, setShowPreferenceForm] = useState(false);
  const [contributionPercentage, setContributionPercentage] = useState('10');

  const charityId = params.id as string;

  useEffect(() => {
    fetchCharity();
    fetchUserPreferences();
  }, [charityId]);

  const fetchCharity = async () => {
    try {
      const result = await getCharityById(charityId);
      if (result.success) {
        setCharity(result.data || null);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch charity details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const result = await getUserCharityPreferences();
      if (result.success) {
        setUserPreferences(result.data || []);
        
        // Check if user already has preference for this charity
        const existingPreference = result.data?.find(pref => pref.charity_id === charityId);
        if (existingPreference) {
          setContributionPercentage(existingPreference.contribution_percentage.toString());
          setShowPreferenceForm(false);
        }
      }
    } catch (err) {
      console.error('Failed to fetch user preferences:', err);
    }
  };

  const handleSavePreference = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const percentage = parseInt(contributionPercentage);
    if (isNaN(percentage) || percentage < 10 || percentage > 100) {
      setError('Contribution percentage must be between 10 and 100');
      return;
    }

    setPreferenceLoading(true);
    setError('');

    try {
      const result = await saveCharityPreference(charityId, percentage);
      if (result.success) {
        setError('');
        setShowPreferenceForm(false);
        fetchUserPreferences(); // Refresh preferences
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to save charity preference');
    } finally {
      setPreferenceLoading(false);
    }
  };

  const handleDeletePreference = async () => {
    if (!confirm('Are you sure you want to remove this charity preference?')) {
      return;
    }

    setPreferenceLoading(true);
    try {
      const result = await deleteCharityPreference(charityId);
      if (result.success) {
        setError('');
        setShowPreferenceForm(true);
        setContributionPercentage('10');
        fetchUserPreferences(); // Refresh preferences
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to delete charity preference');
    } finally {
      setPreferenceLoading(false);
    }
  };

  const currentPreference = userPreferences.find(pref => pref.charity_id === charityId);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600">Loading charity details...</div>
      </div>
    );
  }

  if (error && !charity) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-red-700">
            {error}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/charities')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Back to Charities
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!charity) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-gray-600">Charity not found</div>
          <button
            onClick={() => router.push('/charities')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back to Charities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Messages */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
              {error}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/charities')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            ← Back to Charities
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Charity Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {charity.is_featured && (
                <div className="bg-yellow-400 text-white text-center py-3 text-lg font-semibold">
                  ⭐ FEATURED CHARITY
                </div>
              )}
              
              <div className="p-8">
                <img
                  src={charity.image_url}
                  alt={charity.name}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540206395-68808572932b?w=800&h=600&fit=crop';
                  }}
                />
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {charity.name}
                </h1>
                
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {charity.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    About This Charity
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Status</h4>
                      <p className="text-gray-600">
                        {charity.is_featured ? (
                          <span className="text-green-600 font-medium">Featured Partner</span>
                        ) : (
                          <span className="text-blue-600 font-medium">Verified Charity</span>
                        )}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Founded</h4>
                      <p className="text-gray-600">
                        {new Date(charity.created_at).getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charity Preference */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Support This Charity
              </h2>
              
              {currentPreference ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">
                      You're Supporting This Charity
                    </h3>
                    <p className="text-green-700">
                      Contribution: {currentPreference.contribution_percentage}%
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowPreferenceForm(!showPreferenceForm)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {showPreferenceForm ? 'Cancel' : 'Update Contribution'}
                    </button>
                    
                    <button
                      onClick={handleDeletePreference}
                      disabled={preferenceLoading}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {preferenceLoading ? 'Removing...' : 'Remove Support'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSavePreference} className="space-y-4">
                  {showPreferenceForm ? (
                    <>
                      <div>
                        <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 mb-1">
                          Contribution Percentage
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            id="percentage"
                            min="10"
                            max="100"
                            value={contributionPercentage}
                            onChange={(e) => setContributionPercentage(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                          <span className="absolute right-3 top-2 text-gray-500">%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Minimum 10%, maximum 100%
                        </p>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={preferenceLoading}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {preferenceLoading ? 'Saving...' : 'Support This Charity'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowPreferenceForm(true)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Support This Charity
                    </button>
                  )}
                </form>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">How It Works</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Set your contribution percentage</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Participate in golf draws</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Charity receives automatic contributions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CharityProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <CharityProfilePageContent />
    </Suspense>
  );
}
