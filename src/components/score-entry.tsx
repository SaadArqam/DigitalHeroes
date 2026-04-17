'use client';

import { useState, useEffect } from 'react';
import { addScore, getUserScores } from '@/app/actions/scores';
import { useToast } from '@/hooks/use-toast';

export default function ScoreEntry({ onScoreAdded }: { onScoreAdded?: () => void }) {
  const [score, setScore] = useState('');
  const [date, setDate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentScores, setRecentScores] = useState<any[]>([]);

  useEffect(() => {
    fetchRecentScores();
  }, []);

  const { toast } = useToast();

  const fetchRecentScores = async () => {
    const result = await getUserScores();
    if (result.success) setRecentScores(result.data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    const scoreNum = parseInt(score);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 45) {
      toast('Invalid score (must be 1-45)', 'error');
      setError('Score must be between 1 and 45.');
      return;
    }

    setLoading(true);
    setError('');

    const result = await addScore(scoreNum, date);
    if (result.success) {
      toast('Performance data uploaded', 'success');
      setScore('');
      setDate('');
      setRecentScores([result.data!, ...recentScores].slice(0, 5)); 
      onScoreAdded?.(); 
    } else {
      toast(result.message, 'error');
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 w-full max-w-md mx-auto">
      <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Record Score</h3>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-bold text-sm">
          {error}
        </div>
      )}

      {/* Internal Recent Display */}
      <div className="mb-6">
        <h4 className="font-bold text-slate-500 uppercase tracking-widest text-xs mb-3">Your Track Record</h4>
        <div className="space-y-3">
          {recentScores.slice(0,5).map((rs) => (
             <div key={rs.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
               <div className="flex gap-4 items-center">
                 <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center font-black">
                   {rs.score}
                 </div>
                 <span className="text-sm font-bold text-slate-600">{new Date(rs.date).toLocaleDateString()}</span>
               </div>
             </div>
          ))}
          {recentScores.length === 0 && <p className="text-slate-400 text-sm">No scores submitted yet.</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Score (1-45)</label>
          <input
            type="number"
            min="1" max="45"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo outline-none transition font-bold"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Date Played</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-indigo outline-none transition font-medium"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-brand-indigo text-white font-bold rounded-xl hover:bg-brand-indigo/90 shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Submit Entry'}
        </button>
      </form>
    </div>
  );
}
