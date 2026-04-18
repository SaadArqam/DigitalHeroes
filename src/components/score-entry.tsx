'use client';

import { useState, useEffect } from 'react';
import { addScore, editScore, getScores } from '@/app/actions/scores';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Target, Calendar, History, TrendingUp, AlertCircle } from 'lucide-react';

export default function ScoreEntry({ 
  onScoreAdded, 
  initialData,
  onCancel
}: { 
  onScoreAdded?: () => void;
  initialData?: { id: string; score: number; date: string };
  onCancel?: () => void;
}) {
  const [score, setScore] = useState(initialData?.score.toString() || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentScores, setRecentScores] = useState<any[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    fetchRecentScores();
  }, []);

  const fetchRecentScores = async () => {
    const data = await getScores();
    setRecentScores(data || []);
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

    const result = initialData 
      ? await editScore(initialData.id, scoreNum, date)
      : await addScore(scoreNum, date);

    if (result.success) {
      toast(initialData ? 'Records updated' : 'Performance data uploaded', 'success');
      if (!initialData) {
        setScore('');
        setDate('');
      }
      onScoreAdded?.(); 
    } else {
      toast(result.message, 'error');
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      {/* Visual Analytics Preview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-input-bg rounded-[2rem] border border-input-border">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary-start/10 rounded-lg">
                <TrendingUp className="w-4 h-4 text-primary-start" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Average Score</span>
           </div>
           <p className="text-2xl font-black text-white">
             {recentScores.length > 0 
               ? Math.round(recentScores.reduce((acc, s) => acc + s.score, 0) / recentScores.length)
               : '--'
             }
           </p>
        </div>
        <div className="p-4 bg-input-bg rounded-[2rem] border border-input-border">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <History className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Total Records</span>
           </div>
           <p className="text-2xl font-black text-white">{recentScores.length}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Verification Score (1-45)"
          type="number"
          placeholder="Enter points"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          icon={<Target className="w-5 h-5" />}
          required
          className="group"
        />

        <Input
          label="Incident Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          icon={<Calendar className="w-5 h-5" />}
          required
        />

        {error && (
          <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={loading}
          size="lg"
        >
          Submit Records
        </Button>
      </form>

      {/* Internal Recent Display */}
      <div className="pt-6 border-t border-card-border">
        <h4 className="font-black text-text-muted uppercase tracking-[0.2em] text-[10px] mb-4">Chronological Registry</h4>
        <div className="space-y-3">
          {recentScores.slice(0, 3).map((rs) => (
             <div key={rs.id} className="flex items-center justify-between p-4 bg-input-bg/50 rounded-2xl border border-input-border/30">
               <div className="flex gap-4 items-center">
                 <div className="w-10 h-10 rounded-xl bg-card border border-card-border flex items-center justify-center font-black text-white shadow-sm">
                   {rs.score}
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Score Event Verified</span>
                    <span className="text-[10px] font-bold text-text-muted">{new Date(rs.date).toLocaleDateString()}</span>
                 </div>
               </div>
             </div>
          ))}
          {recentScores.length === 0 && (
            <div className="py-8 text-center bg-input-bg/20 rounded-3xl border border-dashed border-input-border">
              <p className="text-text-muted text-xs font-bold">Awaiting primary data upload...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
