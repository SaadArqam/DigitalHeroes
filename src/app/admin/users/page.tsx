'use client';

import { useState, useEffect } from 'react';
import { getAllUsers, updateSubscriptionStatus } from '@/app/actions/admin';
import { 
  Users, Search, ChevronDown, ChevronUp, Mail, 
  Calendar, CreditCard, Target, Loader2, ShieldCheck,
  AlertCircle, Activity
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      toast('Sync Failure', 'error');
    }
    setLoading(false);
  }

  const handleStatusUpdate = async (userId: string, status: any) => {
    setActionLoading(userId);
    const res = await updateSubscriptionStatus(userId, status);
    if (res.success) {
      toast('Status Propagated', 'success');
      await loadUsers();
    } else {
      toast(res.message || 'Update Failed', 'error');
    }
    setActionLoading(null);
  };

  const filteredUsers = (users || []).filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="py-40 text-center">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-6" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Decrypting Citizen Database...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tight uppercase">Citizen <span className="text-indigo-600 italic">Registry</span></h1>
          <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-widest">{users.length} Identities Synchronized</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-[#0c0c12] border border-slate-800 rounded-[2rem] text-white font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-600 shadow-xl"
          />
        </div>
      </header>

      <Card variant="glass" className="overflow-hidden bg-[#0c0c12] border-slate-800 shadow-2xl rounded-[3rem] isolate">
        <div className="overflow-x-auto safari-scroll-fix">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Membership</th>
                <th className="px-8 py-6">Telemetry</th>
                <th className="px-8 py-6">Registered</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {filteredUsers.map((user) => (
                <div key={user.id} className="contents">
                  <tr className="group hover:bg-slate-900/40 transition-all cursor-pointer" onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-slate-500 group-hover:text-white group-hover:border-indigo-500 transition-all`}>
                             {user.email?.[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-bold text-white tracking-tight">{user.email}</span>
                             <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest leading-none mt-1">{user.role}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       {user.subscriptions?.[0] ? (
                          <div className="flex flex-col">
                             <span className="text-xs font-black text-white uppercase tracking-widest">{user.subscriptions[0].plan}</span>
                             <span className={`text-[9px] font-black uppercase tracking-widest leading-none mt-1 ${user.subscriptions[0].status === 'active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {user.subscriptions[0].status}
                             </span>
                          </div>
                       ) : (
                          <span className="text-[10px] font-black text-slate-700 uppercase">Unsubbed</span>
                       )}
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-slate-600" />
                          <span className="text-xs font-black text-white">{user.scores?.length || 0}/5 Logged</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                       {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-all">
                          {expandedId === user.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                       </button>
                    </td>
                  </tr>
                  
                  {expandedId === user.id && (
                    <tr className="bg-slate-950/50">
                       <td colSpan={5} className="px-12 py-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                             <div>
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                   <Activity className="w-3 h-3" /> Historical Performance Streaks
                                </h4>
                                <div className="space-y-3">
                                   {user.scores?.length > 0 ? (user.scores as any[]).slice(0, 5).map((score: any, i: number) => (
                                      <div key={i} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                                         <span className="text-xs font-bold text-slate-400 capitalize">{new Date(score.date).toLocaleDateString()}</span>
                                         <span className="text-lg font-black text-white">{score.score}</span>
                                      </div>
                                   )) : (
                                      <p className="text-xs font-bold text-slate-700 uppercase">No telemetry detected for this identity.</p>
                                   )}
                                </div>
                             </div>
                             <div>
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                   <CreditCard className="w-3 h-3" /> Membership Operations
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                   {['active', 'lapsed', 'cancelled'].map((status) => (
                                      <button
                                        key={status}
                                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(user.id, status as any); }}
                                        disabled={actionLoading === user.id}
                                        className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                          user.subscriptions?.[0]?.status === status 
                                            ? 'bg-indigo-600 border-indigo-500 text-white' 
                                            : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600'
                                        }`}
                                      >
                                        {status}
                                      </button>
                                   ))}
                                </div>
                             </div>
                          </div>
                       </td>
                    </tr>
                  )}
                </div>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
