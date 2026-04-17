'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCharities, saveCharityPreference } from '@/app/actions/charities';
import { useToast } from '@/hooks/use-toast';
import { Charity } from '@/lib/types';

interface CharitySelectorProps {
  onComplete: () => void;
}

export function CharitySelector({ onComplete }: CharitySelectorProps) {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      const res = await getCharities();
      if (res.success) {
        setCharities(res.data || []);
      }
    } catch (err) {
      toast('Failed to load partners', 'error');
      setError('Failed to load charities');
    } finally {
      setLoading(false);
    }
  };

  const handleSelection = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      const res = await saveCharityPreference(selectedId, 10);
      if (res.success) {
        toast('Impact partner locked', 'success');
        onComplete();
      } else {
        toast(res.message, 'error');
        setError(res.message);
      }
    } catch (err) {
      toast('Failed to save selection', 'error');
      setError('Failed to save selection');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-12 text-center">
      <div className="animate-spin w-8 h-8 border-4 border-brand-indigo border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Curating Partners...</p>
    </div>
  );

  return (
    <Card variant="glass" className="border-brand-indigo/20 shadow-indigo max-w-4xl mx-auto overflow-hidden">
      <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
           <Badge variant="purple" className="mb-4">Step 1: Impact Choice</Badge>
           <CardTitle className="text-3xl mb-2">Choose Your Charity Partner</CardTitle>
           <CardDescription className="text-lg">
             Select where 10% of your subscription fee will be allocated. 
             Join our mission to support global environmental and social causes.
           </CardDescription>
        </div>
        <Button 
          variant={selectedId ? 'secondary' : 'outline'} 
          size="lg" 
          disabled={!selectedId || saving} 
          onClick={handleSelection}
          loading={saving}
          className="md:w-auto w-full"
        >
          Confirm Selection
        </Button>
      </div>

      <CardContent className="p-8">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-bold text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities.map((charity) => (
            <div 
              key={charity.id}
              onClick={() => setSelectedId(charity.id)}
              className={`
                group relative p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300
                ${selectedId === charity.id 
                  ? 'border-brand-indigo bg-indigo-50/30' 
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg'
                }
              `}
            >
              {selectedId === charity.id && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-brand-indigo text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-50 relative">
                 {charity.image_url ? (
                   <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-200 font-black text-4xl">
                      {charity.name.charAt(0)}
                   </div>
                 )}
                 {charity.is_featured && (
                   <div className="absolute top-3 left-3">
                      <Badge variant="purple" size="xs">Featured Partner</Badge>
                   </div>
                 )}
              </div>

              <h4 className="text-lg font-black text-slate-900 mb-2 truncate">{charity.name}</h4>
              <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                {charity.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
