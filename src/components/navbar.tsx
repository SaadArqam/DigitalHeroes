'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';

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

  const isActiveRoute = (path: string) => {
    return pathname === path;
  };

  const navLinkClasses = (path: string) => {
    const base = "px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200";
    const active = "text-indigo-600 bg-indigo-50/50";
    const inactive = "text-slate-600 hover:text-indigo-600 hover:bg-slate-50";
    return `${base} ${isActiveRoute(path) ? active : inactive}`;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
            >
              GreenJack
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2">
            {loading ? (
              // Loading state
              <div className="w-20 h-8 bg-slate-100 rounded-xl animate-pulse"></div>
            ) : isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={navLinkClasses("/dashboard")}
                >
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              // Logged out state
              <>
                <Link
                  href="/login"
                  className={navLinkClasses("/login")}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-slate-900 text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
