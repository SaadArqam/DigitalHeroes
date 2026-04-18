'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Rocket } from 'lucide-react';

export default function Navbar() {
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveRoute = (path: string) => pathname === path;

  const navLinkClasses = (path: string) => {
    const base = "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300";
    const active = "text-white bg-white/10 shadow-sm";
    const inactive = "text-text-secondary hover:text-white hover:bg-white/5";
    return `${base} ${isActiveRoute(path) ? active : inactive}`;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-card-border py-3 safari-blur-fix' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-primary-gradient rounded-xl flex items-center justify-center shadow-glow group-hover:rotate-12 transition-transform duration-500">
               <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter">
              Green<span className="text-primary-end">Jack</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-24 h-10 bg-card rounded-xl animate-pulse border border-card-border"></div>
            ) : isAuthenticated ? (
              <>
                 <Link href="/dashboard" className={navLinkClasses("/dashboard")}>
                   Terminal
                 </Link>
                 {(user?.email === 'admin@gmail.com' || user?.email === 'your@email.com') && (
                   <Link href="/admin" className={navLinkClasses("/admin")}>
                     Admin
                   </Link>
                 )}
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 p-3 rounded-xl bg-card border border-card-border text-text-secondary hover:text-rose-500 transition-colors group"
                >
                  <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={navLinkClasses("/login")}>
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-3 bg-primary-gradient text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-glow hover:scale-105 active:scale-95 transition-all"
                >
                  Join Elite
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
