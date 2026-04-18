// src/app/admin/page.tsx
import { createClient } from '@/lib/supabase/server';
import { 
  Users, Trophy, Heart, ArrowUpRight, 
  Activity, ShieldCheck, Mail
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Parallel Telemetry Fetching
  const [
    { count: subscriberCount },
    { data: drawStats },
    { data: recentUsers }
  ] = await Promise.all([
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('draws').select('total_pool, jackpot_rollover'),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5)
  ]);

  const totalPool = (drawStats || []).reduce((acc, curr) => acc + (Number(curr.total_pool) || 0), 0);
  const charityEstimate = totalPool * 0.15; // Platform logic: 15% to impact partners

  const stats = [
    { label: 'Active Citizens', value: subscriberCount || 0, icon: Users, color: 'text-[#7C3AED]' },
    { label: 'Vault Liquidity', value: `₹${totalPool.toLocaleString()}`, icon: Trophy, color: 'text-[#00FFA3]' },
    { label: 'Mission Support', value: `₹${charityEstimate.toLocaleString()}`, icon: Heart, color: 'text-red-500' },
    { label: 'System Uptime', value: '99.9%', icon: Activity, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-12">
      <header>
        <div className="flex items-center gap-2 mb-3">
           <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B949E]">Node Status: Administrative Root</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">System <span className="text-gradient">Registry</span></h1>
      </header>

      {/* Metric Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 bg-[#0D1117] border-white/5 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-6">
               <div className={`w-12 h-12 rounded-xl bg-[#05070A] border border-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform shadow-inner`}>
                  <stat.icon className="w-6 h-6" />
               </div>
               <ArrowUpRight className="w-4 h-4 text-[#8B949E]" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-[#8B949E] mb-1.5">{stat.label}</p>
            <h4 className="text-3xl font-black text-white tracking-tighter uppercase">{stat.value}</h4>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-12 p-8 bg-[#0D1117] border-white/5">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3 italic">
                <ShieldCheck className="w-6 h-6 text-[#7C3AED]" />
                Recent Recruitment Stream
             </h3>
             <button className="text-[10px] font-black uppercase tracking-widest text-[#7C3AED] hover:text-white transition-colors">Manifest Logic</button>
          </div>
          
          <div className="divide-y divide-white/5">
            {recentUsers?.map((user: any) => (
              <div key={user.id} className="py-5 flex items-center justify-between group">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 rounded-xl bg-[#05070A] border border-white/5 flex items-center justify-center text-[#8B949E] group-hover:text-white group-hover:border-[#00FFA3]/30 transition-all font-black uppercase text-xl italic">
                      {user.email?.[0].toUpperCase()}
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1.5">
                         <Mail className="w-3.5 h-3.5 text-[#8B949E]" />
                         <span className="text-sm font-black text-white tracking-tight leading-none">{user.email}</span>
                      </div>
                      <span className="text-[9px] font-black text-[#565f6a] uppercase tracking-widest">
                         Registered: {new Date(user.created_at).toLocaleDateString()}
                      </span>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest leading-none border ${user.is_admin ? 'text-[#7C3AED] border-[#7C3AED]/20 bg-[#7C3AED]/5' : 'text-[#8B949E] border-white/10 bg-white/5'}`}>
                      {user.is_admin ? 'root' : 'citizen'}
                   </span>
                   <button className="p-2 rounded-lg bg-[#05070A] border border-white/5 text-[#8B949E] hover:text-white transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
