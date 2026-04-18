'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  Menu, X, LogOut, LayoutDashboard, ShieldCheck, 
  Gamepad2, Info, Heart, Trophy, User
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
      if (session?.user) {
        checkAdmin(session.user.id, session.user.email || '');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        checkAdmin(session.user.id, session.user.email || '');
      } else {
        setIsAdmin(false);
      }
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  async function checkAdmin(userId: string, email: string) {
    if (email === 'admin@gmail.com') {
      setIsAdmin(true);
      return;
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, role')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (profile?.is_admin || profile?.role === 'admin') setIsAdmin(true);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isAdminPage = pathname?.startsWith('/admin');
  if (isAuthPage || isAdminPage) return null;

  const dashboardLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Impact', href: '/dashboard/impact', icon: Heart },
    { name: 'Rules', href: '/how-it-works', icon: Info },
  ];

  const adminLinks = [
    { name: 'Users', href: '/admin/users', icon: User },
    { name: 'Draws', href: '/admin/draws', icon: Gamepad2 },
    { name: 'Winners', href: '/admin/winners', icon: Trophy },
  ];

  const publicLinks = [
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Impact', href: '/impact' },
    { name: 'Leaderboard', href: '/leaderboard' },
  ];

  return (
    <nav 
      className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'py-4 px-6 md:px-12' 
          : 'py-8 px-6 md:px-16'
      }`}
    >
      <div 
        className={`max-w-7xl mx-auto rounded-[2rem] transition-all duration-500 border border-white/5 flex items-center justify-between px-8 py-4 ${
          isScrolled 
            ? 'bg-[#0B0F1A]/80 backdrop-blur-2xl shadow-premium border-white/10' 
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary-gradient rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase italic">Green<span className="text-primary-end">Jack</span></span>
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {!session ? (
              publicLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))
            ) : (
              <>
                {dashboardLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-2 ${
                      pathname === link.href ? 'text-primary-end' : 'text-text-muted hover:text-white'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                ))}
                {isAdmin && (
                  <Link 
                    href="/admin"
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-2 px-4 py-2 bg-primary-gradient/10 rounded-xl border border-primary-start/20 ${
                      pathname.startsWith('/admin') ? 'text-white border-primary-start/50' : 'text-primary-end hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Terminal
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {!session ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px]">Portal Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px] shadow-glow">Initialize</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
               <button 
                 onClick={handleLogout}
                 className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text-muted hover:text-rose-500 hover:border-rose-500/20 transition-all"
                 title="Disconnect Terminal"
               >
                 <LogOut className="w-5 h-5" />
               </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-32 left-6 right-6 lg:hidden bg-[#0B0F1A]/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl z-[101]"
          >
            <div className="flex flex-col gap-6">
               {(session ? [...dashboardLinks, ...(isAdmin ? [{name: 'Admin', href: '/admin', icon: ShieldCheck}] : [])] : publicLinks).map((link: any) => (
                 <Link 
                   key={link.name} 
                   href={link.href}
                   onClick={() => setMobileMenuOpen(false)}
                   className="text-xl font-black text-white hover:text-primary-end transition-colors flex items-center gap-4"
                 >
                   {link.icon && <link.icon className="w-6 h-6 text-primary-end" />}
                   {link.name}
                 </Link>
               ))}
               <hr className="border-white/5" />
               {!session ? (
                 <div className="flex flex-col gap-4">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="secondary" className="w-full py-6 rounded-2xl font-black uppercase tracking-widest">Login</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full py-6 rounded-2xl font-black uppercase tracking-widest shadow-glow">Sign Up</Button>
                    </Link>
                 </div>
               ) : (
                 <button 
                   onClick={handleLogout}
                   className="flex items-center gap-4 text-rose-500 font-black text-xl"
                 >
                   <LogOut className="w-6 h-6" /> Logout
                 </button>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
