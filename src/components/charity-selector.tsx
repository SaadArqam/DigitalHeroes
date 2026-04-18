'use client';

import { useState, useEffect } from 'react';
import { getCharities, saveCharityPreference, getUserCharityPreference } from '@/app/actions/charities';
import { Charity, UserCharityPreference } from '@/lib/types';

interface CharitySelectorProps {
  onCharitySelected?: (charity: Charity, percentage: number) => void;
  showAllCharities?: boolean;
  className?: string;
}

export default function CharitySelector({ 
  onCharitySelected, 
  showAllCharities = true,
  className = ''
}: CharitySelectorProps) {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserCharityPreference[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<string>('');
  const [contributionPercentage, setContributionPercentage] = useState('10');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchCharities();
    fetchUserPreferences();
  }, []);

  const fetchCharities = async () => {
    try {
      const result = await getCharities();
      if (result.success) {
        setCharities(result.data || []);
        setError('');
      } else {
        setError(result.message ?? 'Unknown error');
      }
    } catch (err) {
      setError('Failed to fetch charities');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const result = await getUserCharityPreference();
      if (result.success) {
        setUserPreferences(result.data ? [result.data] : []);
      }
    } catch (err) {
      console.error('Failed to fetch user preferences:', err);
    }
  };

  const handleCharitySelect = (charityId: string) => {
    setSelectedCharity(charityId);
    setError('');
    setSuccess('');
  };

  const handleSavePreference = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCharity) {
      setError('Please select a charity');
      return;
    }

    const percentage = parseInt(contributionPercentage);
    if (isNaN(percentage) || percentage < 10 || percentage > 100) {
      setError('Contribution percentage must be between 10 and 100');
      return;
    }

    setSaving(true);
    try {
      const result = await saveCharityPreference(selectedCharity, percentage);
      if (result.success) {
        setSuccess(result.message ?? 'Partner selection verified.');
        setError('');
        setSelectedCharity('');
        setContributionPercentage('10');
        
        // Refresh user preferences
        fetchUserPreferences();
        
        // Call parent callback if provided
        if (onCharitySelected) {
          const charity = charities.find(c => c.id === selectedCharity);
          if (charity) {
            onCharitySelected(charity, percentage);
          }
        }
      } else {
        setError(result.message ?? 'Unknown error');
      }
    } catch (err) {
      setError('Failed to save charity preference');
    } finally {
      setSaving(false);
    }
  };

  const existingPreference = userPreferences.find(pref => pref.charity_id === selectedCharity);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-gray-600">Loading charities...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Select Your Charity
      </h3>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
          {success}
        </div>
      )}

      {/* Current Preferences Summary */}
      {userPreferences.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-semibold text-blue-800 mb-3">Your Current Charity Preferences</h4>
          <div className="space-y-2">
            {userPreferences.map((pref) => {
              const charity = charities.find(c => c.id === pref.charity_id);
              if (!charity) return null;
              
              return (
                <div key={pref.id} className="flex justify-between items-center text-sm">
                  <span className="text-blue-700 font-medium">{charity.name}</span>
                  <span className="text-blue-600">{pref.contribution_percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Charity Selection Form */}
      <form onSubmit={handleSavePreference} className="space-y-4">
        <div>
          <label htmlFor="charity" className="block text-sm font-medium text-gray-700 mb-2">
            Choose Charity
          </label>
          <select
            id="charity"
            value={selectedCharity}
            onChange={(e) => handleCharitySelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a charity...</option>
            {charities.map((charity) => {
              const hasPreference = userPreferences.some(pref => pref.charity_id === charity.id);
              return (
                <option 
                  key={charity.id} 
                  value={charity.id}
                  disabled={!showAllCharities && !hasPreference}
                >
                  {charity.is_featured && '⭐ '}
                  {charity.name}
                  {hasPreference && ' (Already selected)'}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 mb-2">
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
            Minimum 10%, maximum 100% of your winnings
          </p>
        </div>

        <button
          type="submit"
          disabled={saving || !selectedCharity}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : existingPreference ? 'Update Preference' : 'Save Preference'}
        </button>
      </form>

      {/* Instructions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">How Charity Support Works</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Select charities you want to support</span>
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Set contribution percentage (10-100%)</span>
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Winnings are automatically distributed</span>
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Change preferences anytime</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
