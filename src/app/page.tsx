'use client';

import Link from 'next/link';
import Hero from '@/components/landing/Hero';
import SocialProof from '@/components/landing/SocialProof';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import PrizePool from '@/components/landing/PrizePool';
import CharityImpact from '@/components/landing/CharityImpact';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <SocialProof />
      <HowItWorks />
      
      <Features />
      <PrizePool />
      <CharityImpact />

      {/* Modern CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-start/10 blur-[160px] rounded-full pointer-events-none" />
         
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="bg-card border border-card-border rounded-[3rem] p-12 md:p-24 text-white text-center shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-end/10 blur-[120px] -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-start/10 blur-[120px] -ml-40 -mb-40" />
             
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter">
              Ready to <span className="text-gradient italic">Elevate</span> <br />
              your game?
            </h2>
            <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Join thousands of elite golfers who are transforming their performance into purpose. The terminal is waiting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/signup">
                <Button size="lg" className="h-16 px-12 rounded-2xl text-lg shadow-glow">
                  Initialize Profile
                </Button>
              </Link>
              <Link href="/subscribe">
                <Button variant="secondary" size="lg" className="h-16 px-12 rounded-2xl text-lg hover:border-text-muted">
                  View Protocols
                </Button>
              </Link>
            </div>
            
            <div className="mt-20 pt-12 border-t border-card-border flex flex-wrap justify-center gap-12 opacity-30 grayscale contrast-125">
               <span className="font-black text-xl tracking-[0.3em] text-white">PREMIUM</span>
               <span className="font-black text-xl tracking-[0.3em] text-white">ELITE</span>
               <span className="font-black text-xl tracking-[0.3em] text-white">IMPACT</span>
               <span className="font-black text-xl tracking-[0.3em] text-white">GLOBAL</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
