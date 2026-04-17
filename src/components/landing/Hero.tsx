'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative pt-20 pb-16 overflow-hidden md:pt-32 md:pb-32 lg:pt-48 lg:pb-48">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[35%] bg-purple-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] right-[10%] w-[25%] h-[25%] bg-emerald-500/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center px-3 py-1 mb-8 text-sm font-medium transition-colors border rounded-full bg-white/50 backdrop-blur-sm border-indigo-100/50 text-indigo-900/80 hover:bg-white/80">
            <span className="flex w-2 h-2 mr-2 bg-emerald-500 rounded-full animate-pulse"></span>
            ₹150,000+ raised for charities this month
          </div>
          
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl lg:text-8xl mb-6">
            Elevate Your Game. <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent">
              Empower the World.
            </span>
          </h1>
          
          <p className="max-w-2xl mb-12 text-lg text-slate-600 md:text-xl lg:text-2xl leading-relaxed">
            The premium golf platform where every swing matters. Join an elite community, win exclusive prizes, and drive real change for the causes you love.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/subscribe" passHref>
              <Button size="xl" variant="primary" className="shadow-indigo">
                Get Started Today
              </Button>
            </Link>
            <Link href="#how-it-works" passHref>
              <Button size="xl" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
