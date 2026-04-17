'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CharityPreference {
  id: string;
  charity_id: string;
  contribution_percentage: number;
  charities: {
    name: string;
    image_url: string;
  };
}

interface CharityCardProps {
  preferences: CharityPreference[];
  onConfigClick: () => void;
}

export function CharityCard({ preferences, onConfigClick }: CharityCardProps) {
  const active = preferences[0];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-xl">Impact</CardTitle>
        <Badge variant="purple">Giving</Badge>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col">
        {active ? (
          <div className="space-y-6 flex-grow">
            <div className="flex items-center gap-4">
              {active.charities.image_url ? (
                <img src={active.charities.image_url} alt={active.charities.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm" />
              ) : (
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black">
                  {active.charities.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-xl font-black text-slate-900 tracking-tight">{active.charities.name}</div>
                <Badge variant="purple" size="xs" className="mt-1">{active.contribution_percentage}% Allocation</Badge>
              </div>
            </div>

            <div className="p-5 bg-purple-50 rounded-[2rem] border border-purple-100/50">
               <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-purple-400">Total Impact Contribution</div>
                  <div className="text-sm font-black text-purple-900">₹1,250.00</div>
               </div>
               <div className="pt-4 border-t border-purple-200/50">
                  <p className="text-[11px] font-bold text-purple-600 leading-relaxed italic">
                    "10% of your monthly subscription is automatically donated to {active.charities.name} to fuel their mission."
                  </p>
               </div>
            </div>

            <div className="pt-6 mt-auto">
              <Button variant="outline" className="w-full" size="sm" onClick={onConfigClick}>
                Update Preferences
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-slate-500 font-bold mb-6">You haven't selected a charity yet. Part of your fee goes to a good cause.</p>
            <Button variant="primary" onClick={onConfigClick} className="w-full">Select Charity</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
