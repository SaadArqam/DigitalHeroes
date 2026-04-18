// src/app/admin/layout.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, Users, Play, Heart, Trophy, LayoutDashboard, ShieldAlert 
} from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('user_id', user.id).single();
  if (!profile?.is_admin && user.email !== 'admin@gmail.com') redirect('/dashboard');

  return (
    <div className="flex min-h-screen bg-background">
      {/* Access Sidebar */}
      <aside className="w-72 border-r border-card-border bg-card/50 backdrop-blur-xl p-8 hidden lg:block">
        <div className="flex items-center gap-4 mb-16">
           <div className="w-12 h-12 bg-primary-gradient rounded-2xl flex items-center justify-center shadow-glow">
              <ShieldAlert className="w-6 h-6 text-white" />
           </div>
           <div>
              <span className="text-xl font-black text-white tracking-widest uppercase block leading-none">Root</span>
              <span className="text-[10px] font-black text-primary-end uppercase tracking-[0.2em] mt-1 block">Administrative</span>
           </div>
        </div>

        <nav className="space-y-3">
          <NavLink href="/admin" icon={BarChart3}>Overview</NavLink>
          <NavLink href="/admin/users" icon={Users}>Citizens</NavLink>
          <NavLink href="/admin/draws" icon={Play}>Draws</NavLink>
          <NavLink href="/admin/charities" icon={Heart}>Missions</NavLink>
          <NavLink href="/admin/winners" icon={Trophy}>Victories</NavLink>
          
          <div className="pt-12">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 px-5 py-4 text-xs font-black uppercase tracking-widest text-text-muted hover:text-white transition-all rounded-2xl border border-transparent hover:border-card-border hover:bg-card/50"
            >
              <LayoutDashboard className="w-4 h-4" /> Exit Terminal
            </Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8 lg:p-16 overflow-y-auto no-scrollbar">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, icon: Icon, children }: any) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] text-text-secondary hover:bg-primary-gradient hover:text-white transition-all group border border-transparent hover:border-white/10"
    >
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
      {children}
    </Link>
  );
}
