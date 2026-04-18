// src/app/admin/layout.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, Users, Play, Heart, Trophy, LayoutDashboard, Terminal 
} from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('user_id', user.id).single();
  if (!profile?.is_admin && user.email !== 'admin@gmail.com') redirect('/dashboard');

  return (
    <div className="flex min-h-screen bg-[#05070A]">
      <aside className="w-72 bg-[#0D1117]/80 backdrop-blur-2xl border-r border-white/5 p-8 hidden lg:flex flex-col">
        <div className="flex items-center gap-4 mb-12">
           <div className="w-10 h-10 bg-[#7C3AED] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              <Terminal className="w-5 h-5 text-white" />
           </div>
           <div>
              <span className="text-lg font-black text-white tracking-widest uppercase block leading-none">Root</span>
              <span className="text-[9px] font-black text-[#7C3AED] uppercase tracking-[0.2em] mt-1 block">Terminal API</span>
           </div>
        </div>

        <nav className="space-y-2 flex-1">
          <NavLink href="/admin" icon={BarChart3}>Overview</NavLink>
          <NavLink href="/admin/users" icon={Users}>Citizens</NavLink>
          <NavLink href="/admin/draws" icon={Play}>Draws</NavLink>
          <NavLink href="/admin/charities" icon={Heart}>Missions</NavLink>
          <NavLink href="/admin/winners" icon={Trophy}>Victories</NavLink>
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[#8B949E] hover:text-white transition-all rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            <LayoutDashboard className="w-4 h-4" /> Exit Terminal
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto no-scrollbar pt-24 lg:pt-8 p-8 lg:p-12">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, icon: Icon, children }: any) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-4 px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#8B949E] hover:text-[#00FFA3] hover:bg-[#00FFA3]/5 transition-all group border border-transparent hover:border-[#00FFA3]/20"
    >
      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
      {children}
    </Link>
  );
}
