import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Check Auth 
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // 2. Check DB Role Logic 
  const isAdminEmail = user.email === 'admin@gmail.com' || user.email === 'your@email.com';

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!isAdminEmail && (!profile || !profile.is_admin)) {
    // Kick out non-admin users instantly on the server side
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-indigo/30">
      <div className="bg-slate-900 border-b border-indigo-500/20 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shadow-inner shadow-emerald-500/10">A</div>
             <span className="text-white font-black uppercase tracking-widest text-sm">System Command Center</span>
          </div>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-slate-800 rounded-full border border-slate-700">Access: Level 4 (Admin)</span>
        </div>
      </div>
      {children}
    </div>
  );
}
