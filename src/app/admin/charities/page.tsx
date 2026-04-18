'use client';

import { useState, useEffect } from 'react';
import { getCharities } from '@/app/actions/charities';
import { upsertCharity, deleteCharity } from '@/app/actions/admin';
import { 
  Heart, Plus, Pencil, Trash2, Globe, Sparkles, 
  Image as ImageIcon, Loader2, Save, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [opLoading, setOpLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    is_featured: false
  });

  const { toast } = useToast();

  useEffect(() => { loadCharities(); }, []);

  async function loadCharities() {
    setLoading(true);
    const res = await getCharities();
    if (res.success) setCharities(res.data || []);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setOpLoading(true);
    const res = await upsertCharity({
      id: editingId || undefined,
      ...formData
    });
    if (res.success) {
      toast('Partner Registry Updated', 'success');
      resetForm();
      await loadCharities();
    } else {
      toast(res.message ?? 'Unknown error' ?? 'Operation Error', 'error');
    }
    setOpLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanent Deletion. Execute?')) return;
    setOpLoading(true);
    const res = await deleteCharity(id);
    if (res.success) {
      toast('Partner Purged', 'success');
      await loadCharities();
    }
    setOpLoading(false);
  };

  const startEdit = (charity: any) => {
    setEditingId(charity.id);
    setFormData({
      name: charity.name,
      description: charity.description,
      image_url: charity.image_url,
      is_featured: charity.is_featured
    });
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', description: '', image_url: '', is_featured: false });
  };

  if (loading) return (
     <div className="py-40 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Decrypting Mission Registry...</p>
     </div>
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tight uppercase">Mission <span className="text-rose-500 italic">Control</span></h1>
          <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-widest">{charities.length} Verified Partners Active</p>
        </div>
        <Button 
          onClick={() => setIsAdding(true)} 
          className="rounded-2xl px-10 h-16 bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-900/10"
          icon={<Plus className="w-4 h-4" />}
        >
          Tactical Deployment
        </Button>
      </header>

      {isAdding && (
         <Card className="p-10 bg-[#0c0c12] border-2 border-slate-800 rounded-[3rem] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <Globe className="w-5 h-5 text-rose-500" />
                  {editingId ? 'Modify Mission Profile' : 'Deploy New Mission'}
               </h3>
               <button onClick={resetForm} className="p-2 rounded-lg hover:bg-slate-900 text-slate-500 transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>
            
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-8">
                  <Input 
                    label="Partner Identity (Name)"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block mb-3">Mission Protocol (Description)</label>
                     <textarea 
                       value={formData.description}
                       onChange={(e) => setFormData({...formData, description: e.target.value})}
                       className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white font-bold h-32 focus:outline-none focus:border-rose-500/50 transition-all resize-none placeholder:text-slate-700"
                       required
                       placeholder="Detail the operational scale and impact focus..."
                     />
                  </div>
               </div>
               <div className="space-y-8">
                  <Input 
                    label="Visual Matrix (Image URL)"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    icon={<ImageIcon className="w-4 h-4" />}
                    required
                  />
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                          <Sparkles className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                           <p className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1">Platinum Status</p>
                           <p className="text-[10px] font-bold text-slate-600 uppercase">Featured in prime discovery nodes</p>
                        </div>
                     </div>
                     <input 
                       type="checkbox"
                       checked={formData.is_featured}
                       onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                       className="w-8 h-8 rounded-xl bg-slate-950 border-slate-800 accent-rose-500 cursor-pointer"
                     />
                  </div>
                  <Button type="submit" isLoading={opLoading} className="w-full h-16 rounded-2xl bg-rose-600 font-black uppercase tracking-widest shadow-xl shadow-rose-900/10 hover:bg-rose-700">
                     <Save className="w-4 h-4 mr-2" /> Sync Mission
                  </Button>
               </div>
            </form>
         </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {charities.map((charity) => (
            <Card key={charity.id} className="group relative bg-[#0c0c12] border border-slate-800 rounded-[2.5rem] p-6 h-full flex flex-col hover:border-slate-700 transition-all duration-500 shadow-2xl">
               <div className="aspect-video rounded-2xl overflow-hidden mb-8 relative border border-slate-800 shadow-inner group-hover:border-rose-500/30 transition-colors">
                  <img src={charity.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" alt={charity.name} />
                  {charity.is_featured && (
                     <div className="absolute top-4 left-4">
                        <div className="bg-primary-gradient px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-1.5 shadow-2xl border border-white/10">
                           <Sparkles className="w-3 h-3 text-yellow-300" /> Platinum
                        </div>
                     </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               </div>
               
               <div className="flex-1 space-y-3 mb-8">
                  <h3 className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-rose-500 transition-colors uppercase">{charity.name ?? 'Mission Identity Unknown'}</h3>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed line-clamp-2 uppercase tracking-tighter">
                     {charity.description ?? 'Mission protocol details currently classified.'}
                  </p>
               </div>

               <div className="flex gap-3 pt-6 border-t border-slate-800/50">
                  <button onClick={() => startEdit(charity)} className="flex-1 py-4 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2 hover:text-white hover:border-slate-600 transition-all">
                     <Pencil className="w-3 h-3" /> Edit Profile
                  </button>
                  <button onClick={() => handleDelete(charity.id)} className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-rose-500 hover:border-rose-500/50 transition-all">
                     <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </Card>
         ))}
      </div>
    </div>
  );
}
