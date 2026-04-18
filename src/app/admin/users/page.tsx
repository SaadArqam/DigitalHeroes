'use client';

import { useState, useEffect } from 'react';
import { getAllUsers, updateSubscriptionStatus, approveUser, rejectUser } from '@/app/actions/admin';
import { 
  Users, Search, ChevronDown, ChevronUp, Mail, 
  CreditCard, Target, Loader2, ShieldCheck,
  Activity
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
      const res = await getAllUsers();
      if (res.success) {
        setUsers(res.data || []);
      } else {
        toast(res.message, 'error');
      }
    } catch (err: any) {
      toast('Sync failure', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleStatusUpdate = async (userId: string, status: any) => {
    setActionLoading(userId);
    const res = await updateSubscriptionStatus(userId, status);
    if (res.success) {
      toast(res.message, 'success');
      await loadUsers();
    } else {
      toast(res.message ?? 'Update Failed', 'error');
    }
    setActionLoading(null);
  };

  const handleIdentityApproval = async (userId: string, approve: boolean) => {
    setActionLoading(userId);
    const res = approve ? await approveUser(userId) : await rejectUser(userId);
    if (res.success) {
      toast(res.message, 'success');
      await loadUsers();
    } else {
      toast(res.message ?? 'Protocol Error', 'error');
    }
    setActionLoading(null);
  };

  const filteredUsers = (users || []).filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="py-40 text-center">
      <Loader2 className="w-10 h-10 animate-spin text-[#00FFA3] mx-auto mb-6" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B949E]">Decrypting Citizen Database...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B949E]">Node: Citizen Registry</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">Identity <span className="text-gradient">Hub</span></h1>
          <p className="text-[#8B949E] font-black mt-4 uppercase text-[10px] tracking-[0.3em]">{users.length} SECURE NODES SYNCED</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B949E]" />
          <input 
            type="text" 
            placeholder="FILTER BY EMAIL..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-[#0D1117] border border-white/5 rounded-xl text-white font-black uppercase tracking-widest focus:outline-none focus:border-[#00FFA3]/30 transition-all placeholder:text-[#3e454d]"
          />
        </div>
      </header>

      <Card className="overflow-hidden bg-[#0D1117] border-white/5 rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#05070A] text-[9px] font-black text-[#8B949E] uppercase tracking-[0.4em] border-b border-white/5">
                <th className="px-8 py-6">ID Node</th>
                <th className="px-8 py-6">Membership</th>
                <th className="px-8 py-6">Telemetry</th>
                <th className="px-8 py-6">Registered</th>
                <th className="px-8 py-6 text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <div key={user.id} className="contents">
                  <tr className="group hover:bg-white/[0.02] transition-all cursor-pointer" onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg bg-[#05070A] border border-white/5 flex items-center justify-center font-black text-[#8B949E] group-hover:text-white group-hover:border-[#00FFA3]/30 transition-all uppercase italic text-lg`}>
                             {user.email?.[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-white tracking-tight uppercase leading-none mb-1">{user.email ?? 'Unknown'}</span>
                             <div className="flex items-center gap-2">
                                <span className={`text-[8px] font-black uppercase tracking-[0.2em] leading-none px-1.5 py-0.5 rounded border ${
                                   user.status === 'approved' ? 'bg-[#00FFA3]/5 border-[#00FFA3]/20 text-[#00FFA3]' : 
                                   user.status === 'rejected' ? 'bg-red-500/5 border-red-500/20 text-red-500' : 
                                   'bg-amber-500/5 border-amber-500/20 text-amber-500'
                                }`}>
                                   {user.status ?? 'pending'}
                                </span>
                                <span className="text-[8px] font-black text-[#7C3AED] uppercase tracking-widest">{user.is_admin ? 'root' : 'citizen'}</span>
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       {user.subscriptions?.[0] ? (
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{user.subscriptions[0].plan ?? 'Free'}</span>
                             <span className={`text-[8px] font-black uppercase tracking-widest leading-none ${user.subscriptions[0].status === 'active' ? 'text-[#00FFA3]' : 'text-red-500'}`}>
                                {user.subscriptions[0].status ?? 'Inactive'}
                             </span>
                          </div>
                       ) : (
                          <span className="text-[8px] font-black text-[#3e454d] uppercase tracking-[0.2em]">NO PROTOCOL</span>
                       )}
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <Target className="w-3.5 h-3.5 text-[#8B949E]" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">{user.scores?.length || 0}/5 LOGS</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-[9px] font-black text-[#8B949E] uppercase tracking-widest">
                       {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button type="button" className="p-2.5 bg-[#05070A] border border-white/5 rounded-lg text-[#8B949E] hover:text-white transition-all">
                          {expandedId === user.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                       </button>
                    </td>
                  </tr>
                  
                  {expandedId === user.id && (
                    <tr className="bg-[#05070A]/50">
                       <td colSpan={5} className="px-12 py-10">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                             <div>
                                <h4 className="text-[9px] font-black text-[#8B949E] uppercase tracking-[0.4em] mb-6 flex items-center gap-2 italic">
                                   <Activity className="w-3.5 h-3.5 text-[#00FFA3]" /> performance historicals
                                </h4>
                                <div className="space-y-2">
                                   {user.scores?.length > 0 ? (user.scores as any[]).slice(0, 5).map((score: any, i: number) => (
                                      <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                         <span className="text-[10px] font-black text-[#8B949E] uppercase tracking-widest">{new Date(score.date).toLocaleDateString()}</span>
                                         <span className="text-xl font-black text-white italic">{score.score}</span>
                                      </div>
                                   )) : (
                                      <p className="text-[9px] font-black text-[#3e454d] uppercase tracking-[0.3em]">No telemetry detected</p>
                                   )}
                                </div>
                             </div>
                             <div>
                                <h4 className="text-[9px] font-black text-[#8B949E] uppercase tracking-[0.4em] mb-6 flex items-center gap-2 italic">
                                   <CreditCard className="w-3.5 h-3.5 text-[#7C3AED]" /> membership operations
                                </h4>
                                 <div className="grid grid-cols-3 gap-2 mb-8">
                                   {['active', 'lapsed', 'cancelled'].map((status) => (
                                      <button
                                        type="button"
                                        key={status}
                                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(user.id, status as any); }}
                                        disabled={actionLoading === user.id}
                                        className={`py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                          user.subscriptions?.[0]?.status === status 
                                            ? 'bg-[#7C3AED] border-[#7C3AED]/30 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]' 
                                            : 'bg-[#0D1117] border-white/5 text-[#8B949E] hover:border-white/10'
                                        }`}
                                      >
                                        {status}
                                      </button>
                                   ))}
                                </div>

                                <h4 className="text-[9px] font-black text-[#8B949E] uppercase tracking-[0.4em] mb-6 flex items-center gap-2 italic">
                                   <ShieldCheck className="w-3.5 h-3.5 text-[#00FFA3]" /> Identity protocols
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                   <button
                                     type="button"
                                     onClick={(e) => { e.stopPropagation(); handleIdentityApproval(user.id, true); }}
                                     disabled={actionLoading === user.id || user.status === 'approved'}
                                     className="py-4 rounded-xl text-[9px] font-black uppercase tracking-widest bg-[#00FFA3] text-[#05070A] hover:bg-[#00ff8c] disabled:opacity-20 transition-all shadow-[0_0_15px_rgba(0,255,163,0.2)]"
                                   >
                                      Approve Node
                                   </button>
                                   <button
                                     type="button"
                                     onClick={(e) => { e.stopPropagation(); handleIdentityApproval(user.id, false); }}
                                     disabled={actionLoading === user.id || user.status === 'rejected'}
                                     className="py-4 rounded-xl text-[9px] font-black uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 disabled:opacity-20 transition-all font-black"
                                   >
                                      Reject Node
                                   </button>
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
