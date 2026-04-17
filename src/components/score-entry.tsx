'use client';

import { useState, useEffect } from 'react';
import { addScore, getUserScores } from '@/app/actions/scores';

interface ScoreEntryProps {
  className?: string;
  onScoreAdded?: () => void;
}

export default function ScoreEntry({ className = '', onScoreAdded }: ScoreEntryProps) {
  const [score, setScore] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [recentScores, setRecentScores] = useState<any[]>([]);

  useEffect(() => {
    fetchRecentScores();
  }, []);

  const fetchRecentScores = async () => {
    try {
      const result = await getUserScores();
      if (result.success) {
        setRecentScores(result.data || []);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch recent scores');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!score || !date) {
      setError('Please enter both score and date');
      return;
    }

    const scoreNum = parseInt(score);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      setError('Score must be between 1 and 45');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await addScore(scoreNum, date);
      if (result.success) {
        setScore('');
        setDate('');
        setError('');
        setRecentScores([result.data!, ...recentScores]);
        onScoreAdded?.();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to add score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Score</h3>
      
      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {/* Recent Scores */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Your Recent Scores (Newest First)</h4>
        <div className="space-y-2">
          {recentScores.slice(0, 5).map((recentScore, index) => (
            <div key={recentScore.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-700">Score:</span>
                <span className="font-bold text-gray-900">{recentScore.score}</span>
                <span className="text-gray-600">({new Date(recentScore.date).toLocaleDateString()})</span>
              </div>
              <div className="text-sm text-gray-500">
                {5 - index} of 5 scores stored
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score Entry Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
            Score (1-45)
          </label>
          <input
            type="number"
            id="score"
            min="1"
            max="45"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding Score...' : 'Add Score'}
        </button>
      </form>

      {/* Instructions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Score Management Rules</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Only 5 scores are stored per user</span>
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Oldest score is automatically deleted when adding a 6th</span>
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Scores must be between 1 and 45</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
