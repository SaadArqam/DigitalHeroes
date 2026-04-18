'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCharities, saveCharityPreference, getUserCharityPreference } from '@/app/actions/charities';
import { useToast } from '@/hooks/use-toast';
import { Charity } from '@/lib/types';
import { Globe, Heart, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

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
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [charityRes, prefRes] = await Promise.all([
        getCharities(),
        getUserCharityPreference()
      ]);
      
      if (charityRes.success) {
        setCharities(charityRes.data || []);
      }
      
      if (prefRes.success && prefRes.data) {
        setSelectedId(prefRes.data.charity_id);
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
        toast(res.message ?? 'Unknown error', 'error');
        setError(res.message ?? 'Unknown error');
      }
    } catch (err) {
      toast('Failed to save selection', 'error');
      setError('Failed to save selection');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center">
      <Loader2 className="animate-spin w-10 h-10 text-primary-end mx-auto mb-6" />
      <p className="text-text-muted font-black uppercase tracking-[0.2em] text-xs">Curating Global Partners...</p>
    </div>
  );

  return (
    <Card variant="glass" className="max-w-5xl mx-auto overflow-hidden !p-0">
      <div className="p-10 border-b border-card-border flex flex-col md:flex-row md:items-center justify-between gap-8 bg-card/30">
        <div className="max-w-xl">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-start/10 border border-primary-start/20 rounded-full mb-4">
              <Globe className="w-3 h-3 text-primary-start" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-start">Step 1: Impact Choice</span>
           </div>
           <CardTitle className="text-4xl mb-4 text-white">Choose Your Partner</CardTitle>
           <CardDescription className="text-lg text-text-secondary font-bold">
             Select where 10% of your subscription fee will be allocated. 
             Join our mission to support global environmental and social causes.
           </CardDescription>
        </div>
        <Button 
          variant={selectedId ? 'primary' : 'secondary'} 
          size="lg" 
          disabled={!selectedId || saving} 
          onClick={handleSelection}
          isLoading={saving}
          className="md:w-64 w-full rounded-2xl"
          icon={<Heart className="w-4 h-4" />}
        >
          Lock Partner
        </Button>
      </div>

      <CardContent className="p-10">
        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 font-bold text-xs uppercase tracking-widest">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {charities.map((charity) => (
            <div 
              key={charity.id}
              onClick={() => setSelectedId(charity.id)}
              className={`
                group relative p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500
                ${selectedId === charity.id 
                  ? 'border-primary-start bg-primary-start/5 shadow-glow' 
                  : 'border-card-border bg-card/50 hover:border-card-border/80 hover:bg-card'
                }
              `}
            >
              {selectedId === charity.id && (
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary-gradient text-white rounded-full flex items-center justify-center shadow-lg border-4 border-background animate-in zoom-in duration-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              )}
              
              <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-6 bg-background relative border border-card-border">
                 {charity.image_url ? (
                   <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-text-muted font-black text-5xl">
                      {charity.name.charAt(0)}
                   </div>
                 )}
                 {charity.is_featured && (
                   <div className="absolute top-4 left-4">
                      <div className="bg-primary-gradient/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-1.5 shadow-lg">
                        <Sparkles className="w-3 h-3 text-yellow-300" /> Platinum Partner
                      </div>
                   </div>
                 )}
              </div>

              <h4 className="text-xl font-black text-white mb-2 tracking-tight">{charity.name}</h4>
              <p className="text-xs text-text-muted font-bold line-clamp-2 leading-relaxed uppercase tracking-tighter">
                {charity.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
