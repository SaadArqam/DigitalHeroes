'use client';

import { useState, useEffect } from 'react';
import { Card, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
      toast('Sync Failed', 'error');
      setError('Failed to load partners');
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
      <Loader2 className="animate-spin w-10 h-10 text-[#00FFA3] mx-auto mb-6" />
      <p className="text-[#8B949E] font-black uppercase tracking-[0.5em] text-[10px]">Curating Mission Partners...</p>
    </div>
  );

  return (
    <Card className="max-w-6xl mx-auto overflow-hidden !p-0 border-white/10">
      <div className="p-8 lg:p-12 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-white/[0.02]">
        <div className="max-w-2xl">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00FFA3]/5 border border-[#00FFA3]/20 rounded-full mb-6">
              <Globe className="w-3.5 h-3.5 text-[#00FFA3]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00FFA3]">Impact Choice Required</span>
           </div>
           <CardTitle className="text-4xl lg:text-5xl mb-6 text-white uppercase italic tracking-tighter">Choose Mission <span className="text-[#00FFA3]">Partner</span></CardTitle>
           <CardDescription className="text-sm lg:text-lg text-[#8B949E] font-black uppercase tracking-widest leading-relaxed">
             10% of your citizenship fee is directly allocated to your chosen sector. Select a mission node to proceed.
           </CardDescription>
        </div>
        <Button 
          variant={selectedId ? 'primary' : 'outline'} 
          size="lg" 
          disabled={!selectedId || saving} 
          onClick={handleSelection}
          isLoading={saving}
          className="md:w-72 h-16 rounded-xl uppercase tracking-[0.3em] font-black"
          icon={<Heart className="w-5 h-5" />}
        >
          Initialize Mission
        </Button>
      </div>

      <CardContent className="p-8 lg:p-12">
        {error && (
          <div className="mb-10 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {charities.map((charity) => (
            <div 
              key={charity.id}
              onClick={() => setSelectedId(charity.id)}
              className={`
                group relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer
                ${selectedId === charity.id 
                  ? 'border-[#00FFA3] bg-[#00FFA3]/5 shadow-[0_0_30px_rgba(0,255,163,0.1)]' 
                  : 'border-white/5 bg-[#0D1117] hover:border-white/20 hover:bg-white/[0.03]'
                }
              `}
            >
              {selectedId === charity.id && (
                <div className="absolute -top-3 -right-3 w-9 h-9 bg-[#00FFA3] text-[#05070A] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,163,0.5)] border-4 border-[#05070A] z-20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              )}
              
              <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-[#05070A] relative border border-white/5">
                 {charity.image_url ? (
                   <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-[#8B949E] font-black text-4xl">
                      {charity.name.charAt(0)}
                   </div>
                 )}
                 {charity.is_featured && (
                   <div className="absolute top-4 left-4">
                      <div className="bg-[#7C3AED]/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white flex items-center gap-1.5 shadow-lg border border-white/10">
                        <Sparkles className="w-3 h-3 text-yellow-300" /> Platinum Partner
                      </div>
                   </div>
                 )}
              </div>

              <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tight italic leading-none">{charity.name}</h4>
              <p className="text-[10px] text-[#8B949E] font-black uppercase tracking-widest leading-relaxed line-clamp-2">
                {charity.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
