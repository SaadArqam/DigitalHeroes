'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Calendar, CreditCard, ChevronRight, User, Shield, ShieldAlert, Pencil, Trash2 } from 'lucide-react';
import { updateUserScore } from '@/app/actions/admin';
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
    <div className="space-y-6">
      <div className="relative mb-8">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Filter database by email or ID..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition font-bold text-base shadow-sm"
        />
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <motion.div 
            layout
            key={user.id}
            className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white border border-slate-50 rounded-[2.5rem] hover:shadow-xl hover:border-indigo-100 transition-all duration-500 gap-6"
          >
            <div className="flex items-center gap-6 flex-1">
               <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                 {user.email?.charAt(0).toUpperCase()}
               </div>
               <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-black text-slate-900 text-lg tracking-tight">{user.email}</h4>
                    {user.role === 'admin' ? (
                      <div className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5" /> Root
                      </div>
                    ) : (
                      <div className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        <User className="w-2.5 h-2.5" /> Citizen
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                     <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined {new Date(user.created_at).toLocaleDateString()}</span>
                     <span className={`flex items-center gap-1.5 ${getSubStatus(user.id) === 'active' ? 'text-emerald-500' : 'text-slate-300'}`}>
                        <CreditCard className="w-3.5 h-3.5" /> 
                        {getSubStatus(user.id).toUpperCase()}
                     </span>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="text-right mr-4 hidden md:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score Streak</p>
                  <div className="flex gap-1 justify-end">
                     {getUserScores(user.id).slice(0, 5).map((s, idx) => (
                       <div key={idx} className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600">
                         {s.score}
                       </div>
                     ))}
                     {getUserScores(user.id).length === 0 && <span className="text-xs text-slate-300 font-bold italic">No data</span>}
                  </div>
               </div>
               <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all duration-300">
                  <ChevronRight className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 opacity-40">
                <Search className="w-8 h-8 text-slate-400" />
             </div>
             <h3 className="text-xl font-black text-slate-800">No identities found</h3>
             <p className="text-slate-400 font-medium">Try adjusting your filtration criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
