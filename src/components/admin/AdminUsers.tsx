'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Calendar, CreditCard, ChevronRight, User, Shield, ShieldAlert, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminUsersProps {
  users: any[];
  subscriptions: any[];
  scores: any[];
  onRefresh: () => void;
}

export function AdminUsers({ users, subscriptions, scores, onRefresh }: AdminUsersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredUsers = (users || []).filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSubStatus = (userId: string) => {
    const sub = subscriptions?.find(s => s.user_id === userId);
    return sub?.status || 'none';
  };

  const getUserScores = (userId: string) => {
    return scores?.filter(s => s.user_id === userId) || [];
  };

  return (
    <div className="space-y-8">
      <div className="relative mb-10">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted" />
        <input 
          type="text" 
          placeholder="Filter citizen database by email or ID..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-16 pr-8 py-6 bg-card border border-card-border rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-primary-start/10 transition font-black text-lg text-white shadow-premium placeholder:text-text-muted"
        />
      </div>

      <div className="grid gap-6">
        {filteredUsers.map((user) => (
          <motion.div 
            layout
            key={user.id}
            className="group flex flex-col md:flex-row items-center justify-between p-8 bg-card/10 border border-card-border rounded-[2.5rem] hover:shadow-glow hover:border-primary-start/30 transition-all duration-500 gap-8 backdrop-blur-sm"
          >
            <div className="flex items-center gap-8 flex-1">
               <div className="w-20 h-20 rounded-3xl bg-background border border-card-border flex items-center justify-center font-black text-2xl text-text-muted group-hover:bg-primary-gradient group-hover:text-white transition-all duration-500 shadow-inner">
                 {user.email?.charAt(0).toUpperCase()}
               </div>
               <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-black text-white text-xl tracking-tighter leading-none">{user.email}</h4>
                    {user.is_admin ? (
                      <div className="px-3 py-1 bg-primary-gradient/10 text-primary-end border border-primary-end/20 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-3 h-3" /> Root
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-background border border-card-border text-text-muted rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <User className="w-3 h-3" /> Citizen
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-text-muted">
                     <span className="flex items-center gap-2 underline decoration-white/10 underline-offset-4"><Calendar className="w-4 h-4 text-primary-start" /> {new Date(user.created_at).toLocaleDateString()}</span>
                     <span className={`flex items-center gap-2 ${getSubStatus(user.id) === 'active' ? 'text-emerald-500' : ''}`}>
                        <CreditCard className="w-4 h-4" /> 
                        {getSubStatus(user.id)}
                     </span>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="text-right mr-4 hidden md:block">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Auth Sequence</p>
                  <div className="flex gap-2 justify-end">
                     {getUserScores(user.id).slice(0, 5).map((s, idx) => (
                       <div key={idx} className="w-8 h-8 rounded-xl bg-background border border-card-border flex items-center justify-center text-[11px] font-black text-white shadow-inner">
                         {s.score}
                       </div>
                     ))}
                     {getUserScores(user.id).length === 0 && <span className="text-[10px] text-text-muted font-black uppercase tracking-widest">N/A</span>}
                  </div>
               </div>
               <button className="w-14 h-14 bg-background border border-card-border text-text-muted rounded-2xl hover:bg-primary-gradient hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 outline-none" />
               </button>
            </div>
          </motion.div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="py-32 text-center border-2 border-dashed border-card-border rounded-[3rem] opacity-40">
             <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-8">
                <Search className="w-10 h-10 text-text-muted" />
             </div>
             <h3 className="text-2xl font-black text-white tracking-widest uppercase">No identities found</h3>
          </div>
        )}
      </div>
    </div>
  );
}
