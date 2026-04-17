'use client';

import { useState } from 'react';
import { executeMonthlyDraw } from '@/app/actions/draws';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AdminDrawPanel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const triggerDraw = async () => {
    if (!confirm('WARNING: Are you sure you want to trigger the official draw? This will calculate real winners based on active scores.')) {
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const res = await executeMonthlyDraw();
    
    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message);
    }
    
    setLoading(false);
  };

  return (
    <Card className="max-w-2xl mx-auto border-brand-indigo/20 shadow-xl">
      <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
        <CardTitle className="text-2xl font-black text-slate-900 uppercase">Draw Engine Control</CardTitle>
        <CardDescription>Manually trigger the monthly number generation and calculate winners instantly.</CardDescription>
      </CardHeader>
      
      <CardContent className="p-8 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-bold text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <h3 className="text-emerald-800 font-bold mb-4 uppercase text-xs tracking-widest">Draw Successful</h3>
            
            <div className="mb-6">
              <span className="text-slate-500 font-bold block mb-2 text-sm">Winning Numbers:</span>
              <div className="flex gap-3">
                {result.winningNumbers.map((num: number, i: number) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-white border-2 border-emerald-400 flex items-center justify-center font-black text-emerald-700 text-lg shadow-sm">
                    {num}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-emerald-100">
              <span className="font-bold text-slate-600">Total Winners Found</span>
              <span className="text-xl font-black text-brand-emerald">{result.winnerCount}</span>
            </div>
          </div>
        )}

        <Button 
          variant="primary" 
          className="w-full py-6 text-lg tracking-wider font-black shadow-lg shadow-brand-indigo/20"
          onClick={triggerDraw}
          disabled={loading}
        >
          {loading ? 'CALCULATING RESULTS...' : 'INITIATE MONTHLY DRAW'}
        </Button>
      </CardContent>
    </Card>
  );
}
