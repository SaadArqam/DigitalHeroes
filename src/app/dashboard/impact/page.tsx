'use client';

import { useRouter } from 'next/navigation';
import { CharitySelector } from '@/components/dashboard/CharitySelector';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, ShieldCheck, Globe } from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';

export default function ImpactPage() {
  const router = useRouter();

  return (
    <PageContainer>
      
      <div className="max-w-7xl mx-auto pt-12">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="space-y-4">
             <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.back()}
                className="flex items-center gap-2 text-text-muted font-black uppercase tracking-[0.2em] text-[10px] hover:text-primary-end transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Return to Command Center
              </motion.button>
              
              <h1 className="text-4xl lg:text-7xl font-black text-white tracking-[-0.05em] leading-[0.85]">
                Impact <span className="text-gradient italic">Configuration</span>
              </h1>
              <p className="text-text-secondary text-lg font-bold max-w-2xl">
                Redistribute your contribution weight. Your subscription power is currently supporting global transformation initiatives.
              </p>
          </div>

          <div className="flex gap-4">
             <div className="p-6 bg-card border border-card-border rounded-[2.5rem] flex items-center gap-6 shadow-glow">
                <div className="w-12 h-12 rounded-2xl bg-primary-gradient flex items-center justify-center shadow-lg">
                   <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Current Contribution</p>
                  <p className="text-2xl font-black text-white leading-none">10% <span className="text-xs text-emerald-500 ml-1">Fixed</span></p>
                </div>
             </div>
          </div>
        </div>

        {/* Selection Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CharitySelector onComplete={() => router.push('/dashboard')} />
        </motion.div>

        {/* Footer Info */}
        <div className="mt-20 p-12 bg-card/30 border border-card-border/50 rounded-[3rem] text-center backdrop-blur-sm">
           <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
           </div>
           <h3 className="text-2xl font-black text-white mb-4">Verified Allocation</h3>
           <p className="text-text-secondary font-medium max-w-xl mx-auto italic">
             "Every contribution is tracked via the GreenJack Protocol. Changing your partner will take effect in the upcoming billing cycle."
           </p>
        </div>
      </div>
    </PageContainer>
  );
}
