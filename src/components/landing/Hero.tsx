'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Rocket, Target, ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden md:pt-48 md:pb-40 lg:pt-60 lg:pb-52 bg-[#05070A]">
      {/* Stochastic Background Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#00FFA3]/20 rounded-full blur-[160px]" 
        />
        <motion.div 
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 18, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-[#7C3AED]/20 rounded-full blur-[160px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 mb-10 text-[9px] font-black uppercase tracking-[0.4em] border rounded-full bg-white/[0.02] border-white/5 text-[#8B949E] shadow-inner">
            <span className="flex w-1.5 h-1.5 bg-[#00FFA3] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,163,0.5)]"></span>
            ₹150,000+ Distributed Protocolled
          </div>
          
          <h1 className="max-w-6xl mx-auto text-6xl font-black tracking-tighter text-white md:text-8xl lg:text-[11rem] mb-12 leading-none text-center w-full uppercase italic">
            Performance <span className="text-gradient leading-normal">meets</span> <br className="hidden lg:block" />
            Impact <span className="text-gradient opacity-60">Control.</span>
          </h1>
          
          <p className="max-w-3xl mx-auto mb-16 text-sm text-[#8B949E] md:text-xl font-black uppercase tracking-[0.3em] leading-relaxed">
            The elite citizenship platform where telemetry meets mission. Join the global registry, monitor results, and drive high-fidelity change across the planet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/subscribe" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-72 h-16 rounded-xl group uppercase tracking-[0.3em] font-black" icon={<Rocket className="w-4 h-4" />}>
                Sync Profile <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#protocol" className="w-full sm:w-auto">
              <button className="w-full sm:w-72 h-16 rounded-xl font-black uppercase tracking-[0.3em] text-[10px] bg-[#0D1117] border border-white/10 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3">
                <Target className="w-4 h-4 text-[#7C3AED]" /> View Logic
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Global Registry Metrics */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-32 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-white/5 pt-16"
        >
          {[
            { label: 'Active Citizens', value: '14.2k+', iconColor: 'text-[#7C3AED]' },
            { label: 'Global Charities', value: '45+', iconColor: 'text-[#00FFA3]' },
            { label: 'Total Prize Pool', value: '₹2.4M', iconColor: 'text-amber-400' },
            { label: 'Planet Impact', value: '100%', iconColor: 'text-red-400' },
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#565f6a] mb-2 leading-none">{stat.label}</p>
              <p className={`text-4xl font-black text-white tracking-tighter uppercase italic ${stat.iconColor} group-hover:scale-110 transition-transform cursor-default`}>
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
