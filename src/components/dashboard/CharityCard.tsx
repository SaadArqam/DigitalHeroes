'use client';

import { motion } from 'framer-motion';
import { Heart, Globe, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function CharityCard({
  preferences,
  onConfigClick,
  totalDonated = 0
}: {
  preferences: any[];
  onConfigClick: () => void;
  totalDonated?: number;
}) {
  const hasSelection = preferences && preferences.length > 0;
  const selected = hasSelection ? preferences[0] : null;

  return (
    <Card variant="glass" className="h-full group" hoverable>
        {/* Header */}
        <div className="flex items-start justify-between relative z-10 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-500">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-xl tracking-tight leading-none mb-1">Impact</h3>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Global Legacy</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-card-border text-rose-500 rounded-full text-[9px] font-black uppercase tracking-widest">
             <Globe className="w-3 h-3" /> Earth Positive
          </div>
        </div>

        <div className="flex-1 flex flex-col relative z-10">
          {hasSelection && selected ? (
            <div className="flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-5 rounded-3xl bg-input-bg border border-input-border">
                  <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-2">Total Donated</p>
                  <span className="text-2xl font-black text-white">₹{totalDonated.toLocaleString()}</span>
                </div>
                <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/20">
                  <p className="text-[9px] font-black uppercase tracking-widest text-rose-500 mb-2">Benefit</p>
                  <span className="text-2xl font-black text-rose-500">10%</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Linked to</span>
                  <div className="h-[1px] flex-1 bg-card-border" />
                </div>
                <div className="flex items-start gap-4 p-4 rounded-3xl bg-input-bg border border-input-border group-hover:border-rose-500/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-card border border-card-border flex items-center justify-center font-black text-text-muted flex-shrink-0 shadow-sm overflow-hidden">
                    {selected.charities?.image_url ? (
                      <img src={selected.charities.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      selected.charities?.name?.charAt(0) || '?'
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-white tracking-tight flex items-center gap-2">
                       {selected.charities?.name || 'Partner'} <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </h4>
                    <p className="text-xs text-text-secondary font-bold line-clamp-2 mt-1 leading-relaxed">
                      {selected.charities?.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <Button
                  onClick={onConfigClick}
                  variant="secondary"
                  className="w-full rounded-2xl"
                  icon={<ArrowUpRight className="w-4 h-4" />}
                >
                  Modify Impact
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <div className="w-20 h-20 rounded-[2rem] bg-input-bg border-2 border-dashed border-input-border flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-text-muted" />
              </div>
              <h4 className="font-black text-white text-xl mb-2 text-center w-full">Passive Player</h4>
              <p className="text-text-secondary text-sm font-bold mb-8 max-w-[220px]">
                Connect your participation to causes that change the world.
              </p>
              <Button
                onClick={onConfigClick}
                className="w-full rounded-2xl"
                size="lg"
              >
                Become a Hero
              </Button>
            </div>
          )}
        </div>
    </Card>
  );
}
