'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  Menu, X, LogOut, LayoutDashboard, ShieldCheck, 
  Gamepad2, Heart, Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) checkAdmin(session.user.id, session.user.email || '');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) checkAdmin(session.user.id, session.user.email || '');
      else setIsAdmin(false);
    });

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  async function checkAdmin(userId: string, email: string) {
    if (email === 'admin@gmail.com') return setIsAdmin(true);
    const { data: profile } = await supabase.from('profiles').select('is_admin, role').eq('user_id', userId).maybeSingle();
    if (profile?.is_admin || profile?.role === 'admin') setIsAdmin(true);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const dashboardLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Impact', href: '/dashboard/impact', icon: Heart },
    { name: 'Trophy', href: '/leaderboard', icon: Trophy },
  ];

  const publicLinks = [
    { name: 'Protocol', href: '/how-it-works' },
    { name: 'Impact', href: '/impact' },
    { name: 'Archive', href: '/leaderboard' },
  ];

  // Hide Navbar on Login/Signup only. Keep on Admin for consistent navigation if needed, 
  // but if the user wants a sidebar only on Admin, we hide it there too.
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isAdminPage = pathname?.startsWith('/admin');
  if (isAuthPage || isAdminPage) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 py-6 px-4 md:px-8`}>
      <div className={`max-w-7xl mx-auto rounded-2xl transition-all duration-500 border border-white/5 flex items-center justify-between px-6 py-4 ${
        isScrolled ? 'bg-[#0D1117]/80 backdrop-blur-xl border-white/10 shadow-premium' : 'bg-transparent'
      }`}>
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00FFA3] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,163,0.3)]">
              <Gamepad2 className="w-6 h-6 text-[#05070A]" />
            </div>
            <span className="text-xl font-black text-white tracking-widest uppercase">Green<span className="text-[#00FFA3]">Jack</span></span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {(session ? dashboardLinks : publicLinks).map((link) => (
              <Link key={link.name} href={link.href} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-[#00FFA3] ${
                pathname === link.href ? 'text-[#00FFA3]' : 'text-[#8B949E]'
              }`}>
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7C3AED] hover:text-white border border-[#7C3AED]/30 px-3 py-1.5 rounded-lg bg-[#7C3AED]/5">
                Terminal
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!session ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login"><Button variant="ghost" size="sm">Auth</Button></Link>
              <Link href="/signup"><Button size="sm">Initialize</Button></Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#8B949E] hover:text-red-500 transition-all">
              <LogOut className="w-5 h-5" />
            </button>
          )}

          <button className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute top-28 left-4 right-4 lg:hidden bg-[#0D1117] border border-white/10 rounded-2xl p-8 shadow-2xl z-[101]">
            <div className="flex flex-col gap-6">
               {(session ? [...dashboardLinks, ...(isAdmin ? [{name: 'Terminal', href: '/admin'}] : [])] : publicLinks).map((link: any) => (
                 <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-black text-white hover:text-[#00FFA3] uppercase tracking-widest">
                   {link.name}
                 </Link>
               ))}
               {!session && (
                 <div className="grid grid-cols-2 gap-4 mt-4">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}><Button variant="secondary" className="w-full">Auth</Button></Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}><Button className="w-full">Initiate</Button></Link>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
