'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Score {
  id: string;
  score: number;
  date: string;
}

interface ScoresCardProps {
  scores: Score[];
  onAddClick: () => void;
}

export function ScoresCard({ scores, onAddClick }: ScoresCardProps) {
  const last5 = scores.slice(0, 5);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div>
          <CardTitle className="text-xl">Your Performance</CardTitle>
          <CardDescription>Last 5 entries for upcoming draws</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onAddClick}>
          Add New
        </Button>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {last5.length > 0 ? (
          <div className="space-y-3">
            {last5.map((score) => (
              <div key={score.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50 group hover:border-brand-indigo/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-900">
                    {score.score}
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recorded Date</div>
                    <div className="text-sm font-bold text-slate-700">{new Date(score.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <Badge variant="slate" size="xs">Verified</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-500 font-bold mb-6">No scores found. Start entering your scores to participate in draws.</p>
            <Button variant="primary" onClick={onAddClick}>Add Your First Score</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
