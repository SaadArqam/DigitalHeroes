'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Rocket, Target, Globe, ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden md:pt-48 md:pb-40 lg:pt-60 lg:pb-52">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-start/20 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary-end/20 rounded-full blur-[140px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-10 text-[10px] font-black uppercase tracking-[0.3em] border rounded-full bg-card/50 backdrop-blur-md border-card-border text-text-secondary">
            <span className="flex w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></span>
            ₹150,000+ Raised this month
          </div>
          
          <h1 className="max-w-5xl mx-auto text-5xl font-black tracking-[-0.05em] text-white md:text-8xl lg:text-[10rem] mb-10 leading-[0.85] text-center w-full">
            Elevate Your <span className="text-gradient italic">Game.</span> <br />
            Empower the <span className="text-gradient italic">World.</span>
          </h1>
          
          <p className="max-w-3xl mx-auto mb-16 text-lg text-text-secondary md:text-2xl font-bold leading-relaxed">
            The elite citizenship platform where performance meets purpose. Join our global network, access real-time analytics, and drive change for the results you achieve.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/subscribe">
              <Button size="lg" variant="primary" className="rounded-2xl px-12 group" icon={<Rocket className="w-4 h-4" />}>
                Initialize Access <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#protocol">
              <Button size="lg" variant="secondary" className="rounded-2xl px-12" icon={<Target className="w-4 h-4" />}>
                View Protocols
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Global Impact Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-32 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-card-border pt-16"
        >
          {[
            { label: 'Active Citizens', value: '14.2k+' },
            { label: 'Global Charities', value: '45+' },
            { label: 'Total Prize Pool', value: '₹2.4M' },
            { label: 'Earth Impact', value: '100%' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">{stat.label}</p>
              <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
