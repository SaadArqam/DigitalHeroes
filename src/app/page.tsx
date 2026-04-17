'use client';

import Link from 'next/link';
import Hero from '@/components/landing/Hero';
import SocialProof from '@/components/landing/SocialProof';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import PrizePool from '@/components/landing/PrizePool';
import CharityImpact from '@/components/landing/CharityImpact';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100">
      <Hero />
      <SocialProof />
      <HowItWorks />
      
      {/* New Section: Why Choose GreenJack */}
      <Features />
      
      {/* New Section: How You Win */}
      <PrizePool />
      
      {/* New Section: Impact on Charity */}
      <CharityImpact />

      {/* Modern CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
         
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 text-white text-center shadow-2xl overflow-hidden relative border border-slate-800">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -ml-32 -mb-32"></div>
             
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Ready to elevate <br />
              <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                your game?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
              Join thousands of elite golfers who are turning their passion into purpose.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/signup" 
                className="px-10 py-5 bg-white text-slate-900 font-black text-xl rounded-2xl hover:bg-indigo-400 hover:text-white hover:shadow-xl hover:shadow-indigo-500/20 transition-all active:scale-95"
              >
                Join the Mission
              </Link>
              <Link 
                href="/subscribe" 
                className="px-10 py-5 bg-slate-800 text-white font-black text-xl rounded-2xl border border-slate-700 hover:bg-slate-700 transition-all active:scale-95"
              >
                View Plans
              </Link>
            </div>
            
            <div className="mt-16 pt-12 border-t border-slate-800 flex flex-wrap justify-center gap-12 opacity-50 grayscale contrast-125">
               {/* Placeholders for partner logos/trust badges */}
               <span className="font-black text-2xl tracking-tighter">PREMIUM</span>
               <span className="font-black text-2xl tracking-tighter">ELITE</span>
               <span className="font-black text-2xl tracking-tighter">IMPACT</span>
               <span className="font-black text-2xl tracking-tighter">GLOBAL</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
