'use client';

import { useState, useEffect } from 'react';
import { addScore, editScore, deleteScore, getUserScores } from '@/app/actions/scores';
import { Score } from '@/lib/types';

interface ScoreFormData {
  score: string;
  date: string;
}

export default function ScoreManager() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ScoreFormData>({ score: '', date: '' });

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const result = await getUserScores();
      if (result.success) {
        setScores(result.data || []);
        setError('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch scores');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const scoreNum = parseInt(formData.score);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      setError('Score must be between 1 and 45');
      return;
    }

    if (!formData.date || !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      setError('Please enter a valid date in YYYY-MM-DD format');
      return;
    }

    let result;
    if (editingId) {
      result = await editScore(editingId, scoreNum, formData.date);
    } else {
      result = await addScore(scoreNum, formData.date);
    }

    if (result.success) {
      setSuccess(result.message);
      setFormData({ score: '', date: '' });
      setIsAdding(false);
      setEditingId(null);
      fetchScores();
    } else {
      setError(result.message);
    }
  };

  const handleEdit = (score: Score) => {
    setEditingId(score.id);
    setFormData({
      score: score.score.toString(),
      date: score.date
    });
    setIsAdding(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this score?')) {
      return;
    }

    setError('');
    setSuccess('');

    const result = await deleteScore(id);
    if (result.success) {
      setSuccess(result.message);
      fetchScores();
    } else {
      setError(result.message);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ score: '', date: '' });
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-600">Loading scores...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Score Management</h2>
        
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

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Score' : 'Add New Score'}
            </h3>
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
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
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
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {editingId ? 'Update Score' : 'Add Score'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Button */}
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add New Score
          </button>
        )}

        {/* Scores List */}
        <div className="space-y-3">
          {scores.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No scores recorded yet. Add your first score above!
            </div>
          ) : (
            scores.map((score) => (
              <div
                key={score.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-800">
                      Score: {score.score}
                    </span>
                    <span className="text-gray-600">
                      Date: {new Date(score.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Added: {new Date(score.created_at).toLocaleString()}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(score)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(score.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h4 className="font-semibold text-blue-800 mb-2">Score Management Rules:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li> Scores must be between 1 and 45</li>
            <li> Only one score per date is allowed</li>
            <li> Maximum of 5 scores are stored</li>
            <li> Adding a 6th score automatically removes the oldest</li>
            <li> Scores are displayed newest first</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
