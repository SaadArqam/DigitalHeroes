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

  const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single();
  if (profile?.role !== 'admin') redirect('/dashboard');

  return (
    <div className="flex min-h-screen bg-[#07070a]">
      {/* Access Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-[#0a0a0f] p-6 hidden lg:block">
        <div className="flex items-center gap-3 mb-12">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white" />
           </div>
           <span className="text-xl font-black text-white tracking-widest uppercase">Root</span>
        </div>

        <nav className="space-y-4">
          <NavLink href="/admin" icon={BarChart3}>Overview</NavLink>
          <NavLink href="/admin/users" icon={Users}>Citizens</NavLink>
          <NavLink href="/admin/draws" icon={Play}>Draws</NavLink>
          <NavLink href="/admin/charities" icon={Heart}>Missions</NavLink>
          <NavLink href="/admin/winners" icon={Trophy}>Victories</NavLink>
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-500 hover:text-white transition-all mt-12"
          >
            <LayoutDashboard className="w-4 h-4" /> Exit Terminal
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, icon: Icon, children }: any) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-900 hover:text-white transition-all group"
    >
      <Icon className="w-4 h-4 group-hover:text-indigo-400" />
      {children}
    </Link>
  );
}
