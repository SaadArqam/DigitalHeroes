'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Heart, ExternalLink, Globe, Image as ImageIcon, Check, X } from 'lucide-react';
import { upsertCharity, deleteCharity } from '@/app/actions/admin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminCharitiesProps {
  charities: any[];
  onRefresh: () => void;
}

export function AdminCharities({ charities, onRefresh }: AdminCharitiesProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
    website_url: '',
    is_active: true
  });

  const handleEdit = (charity: any) => {
    setEditingId(charity.id);
    setFormData({
      name: charity.name,
      description: charity.description || '',
      logo_url: charity.logo_url || '',
      website_url: charity.website_url || '',
      is_active: charity.is_active ?? true
    });
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await upsertCharity({ id: editingId, ...formData });
      if (res.success) {
        toast('Impact Partner Ledger Updated', 'success');
        setIsAdding(false);
        setEditingId(null);
        onRefresh();
      } else {
        toast(res.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will remove the impact partner from the system.')) return;
    const res = await deleteCharity(id);
    if (res.success) {
      toast('Partner Removed', 'success');
      onRefresh();
    } else {
      toast(res.message, 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Impact Partners</h3>
           <p className="text-xs font-bold text-slate-400">Total verified organizations: {charities?.length || 0}</p>
        </div>
        <Button 
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', description: '', logo_url: '', website_url: '', is_active: true }); }}
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          className="rounded-2xl"
        >
          Add Partner
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] border border-slate-800 shadow-2xl mb-12">
               <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <Input 
                       label="Organization Name"
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       required
                       className="bg-[#1e293b]"
                     />
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Mission Description</label>
                        <textarea 
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="w-full h-32 bg-[#1e293b] border-2 border-slate-700 text-white rounded-2xl p-4 focus:outline-none focus:border-indigo-500 transition font-bold"
                        />
                     </div>
                  </div>
                  <div className="space-y-6">
                     <Input 
                       label="Logo URL"
                       icon={<ImageIcon className="w-4 h-4" />}
                       value={formData.logo_url}
                       onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                       className="bg-[#1e293b]"
                     />
                     <Input 
                       label="Official Website"
                       icon={<Globe className="w-4 h-4" />}
                       value={formData.website_url}
                       onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                       className="bg-[#1e293b]"
                     />
                     <div className="flex items-center gap-4 pt-4">
                        <Button type="submit" isLoading={loading} className="flex-1">
                           {editingId ? 'Update Partner' : 'Confirm Addition'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => setIsAdding(false)} className="px-8">
                           Cancel
                        </Button>
                     </div>
                  </div>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charities.map((charity) => (
          <motion.div 
            layout
            key={charity.id}
            className="group relative p-6 bg-white border border-slate-50 rounded-[2.5rem] hover:shadow-xl hover:border-indigo-100 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-6">
               <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center p-3 border border-slate-100 overflow-hidden group-hover:scale-110 transition-transform duration-500">
                  {charity.logo_url ? (
                    <img src={charity.logo_url} alt={charity.name} className="w-full h-full object-contain" />
                  ) : (
                    <Heart className="w-8 h-8 text-rose-500" />
                  )}
               </div>
               <div className="flex gap-2">
                  <button onClick={() => handleEdit(charity)} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                     <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(charity.id)} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all">
                     <Trash2 className="w-3.5 h-3.5" />
                  </button>
               </div>
            </div>

            <h4 className="font-black text-slate-900 text-lg tracking-tight mb-2">{charity.name}</h4>
            <p className="text-xs font-medium text-slate-500 line-clamp-2 mb-6 h-8">{charity.description}</p>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
               <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${charity.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                     {charity.is_active ? 'Active Partner' : 'On Hold'}
                  </span>
               </div>
               {charity.website_url && (
                 <a href={charity.website_url} target="_blank" className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-all">
                    <ExternalLink className="w-4 h-4" />
                 </a>
               )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
