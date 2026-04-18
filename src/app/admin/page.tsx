// src/app/admin/page.tsx
import { createClient } from '@/lib/supabase/server';
import { 
  Users, Trophy, Heart, TrendingUp, ArrowUpRight, 
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
    { label: 'Active Citizens', value: subscriberCount || 0, icon: Users, color: 'text-indigo-500' },
    { label: 'Vault Liquidity', value: `₹${totalPool.toLocaleString()}`, icon: Trophy, color: 'text-amber-500' },
    { label: 'Mission Support', value: `₹${charityEstimate.toLocaleString()}`, icon: Heart, color: 'text-rose-500' },
    { label: 'System Uptime', value: '99.9%', icon: Activity, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-12">
      <header>
        <div className="flex items-center gap-2 mb-2">
           <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Node Status: Administrative Root</span>
        </div>
        <h1 className="text-5xl font-black text-white tracking-tight uppercase">System <span className="text-indigo-600 italic">Overview</span></h1>
      </header>

      {/* Metric Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-8 bg-[#0c0c12] border-slate-800 hover:border-slate-700 transition-all group shadow-2xl">
            <div className="flex justify-between items-start mb-6">
               <div className={`p-4 rounded-2xl bg-slate-900 border border-slate-800 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
               </div>
               <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
            <h4 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h4>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Recruitment Stream */}
        <Card className="lg:col-span-12 p-8 bg-[#0c0c12] border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                Recent Access Requests
             </h3>
             <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">Manifest Logic</button>
          </div>
          
          <div className="divide-y divide-slate-800">
            {recentUsers?.map((user: any) => (
              <div key={user.id} className="py-6 flex items-center justify-between group">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:border-indigo-500 transition-all font-black">
                      {user.email?.[0].toUpperCase()}
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <Mail className="w-3 h-3 text-slate-500" />
                         <span className="text-sm font-bold text-white tracking-tight">{user.email}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                         Registered: {new Date(user.created_at).toLocaleDateString()}
                      </span>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                      {user.role}
                   </span>
                   <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-white transition-all">
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
