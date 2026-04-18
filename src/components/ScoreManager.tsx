'use client';

import { useState, useEffect } from 'react';
import { addScore, editScore, deleteScore, getScores } from '@/app/actions/scores';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Calendar, Trash2, Pencil, Save, X, Activity, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function ScoreManager() {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newScore, setNewScore] = useState('');
  const [newDate, setNewDate] = useState('');
  const [editFormData, setEditFormData] = useState({ score: '', date: '' });

  const { toast } = useToast();

  useEffect(() => { fetchScores(); }, []);

  const fetchScores = async () => {
    setLoading(true);
    const data = await getScores();
    setScores(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const res = await addScore(Number(newScore), newDate);
    if (res.success) {
      toast('Entry Secured', 'success');
      setNewScore(''); setNewDate('');
      await fetchScores();
    } else {
      toast(res.message, 'error');
    }
    setActionLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Purge record?')) return;
    setActionLoading(true);
    const res = await deleteScore(id);
    if (res.success) {
      toast('Record Purged', 'success');
      await fetchScores();
    }
    setActionLoading(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const res = await editScore(editingId!, Number(editFormData.score), editFormData.date);
    if (res.success) {
      toast('Registry Updated', 'success');
      setEditingId(null);
      await fetchScores();
    } else {
      toast(res.message, 'error');
    }
    setActionLoading(false);
  };

  if (loading) return <div className="p-12 text-center animate-pulse text-slate-500 font-black uppercase text-xs">Syncing Ledger...</div>;

  return (
    <div className="space-y-8">
      {/* Capacity HUD */}
      <div className="flex justify-between items-center bg-slate-900/40 p-6 border border-slate-800 rounded-3xl">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Capacity Status</p>
          <p className="text-3xl font-black text-white">{scores.length}/5</p>
        </div>
        <div className="w-32 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${(scores.length / 5) * 100}%` }} 
            className="h-full bg-gradient-to-r from-indigo-500 to-primary-end" 
          />
        </div>
      </div>

      {/* Manual Entry */}
      <Card variant="glass" className="p-8 border-2 border-slate-800 bg-slate-950/50">
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-5">
            <Input label="Verification Score" type="number" placeholder="01-45" value={newScore} onChange={e => setNewScore(e.target.value)} icon={<Target className="w-5 h-5" />} required />
          </div>
          <div className="md:col-span-4">
            <Input label="Operation Date" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} icon={<Calendar className="w-5 h-5" />} required />
          </div>
          <div className="md:col-span-3">
            <Button type="submit" isLoading={actionLoading} className="w-full h-[52px] rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black">
              Log Result
            </Button>
          </div>
        </form>
      </Card>

      {/* Records Registry */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {scores.map(score => (
            <motion.div layout key={score.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="group">
              <Card variant="glass" className={`p-6 border-slate-800 bg-slate-900/10 transition-all ${editingId === score.id ? 'border-indigo-500 shadow-glow' : 'hover:border-slate-700'}`}>
                {editingId === score.id ? (
                  <form onSubmit={handleEdit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-4"><Input label="Update Score" type="number" value={editFormData.score} onChange={e => setEditFormData({...editFormData, score: e.target.value})} required className="bg-slate-950" /></div>
                    <div className="md:col-span-4"><Input label="Update Date" type="date" value={editFormData.date} onChange={e => setEditFormData({...editFormData, date: e.target.value})} required className="bg-slate-950" /></div>
                    <div className="md:col-span-4 flex gap-2">
                      <Button type="submit" isLoading={actionLoading} className="flex-1 rounded-xl"><Save className="w-4 h-4 mr-2" /> Commit</Button>
                      <Button type="button" variant="secondary" onClick={() => setEditingId(null)} className="rounded-xl"><X className="w-4 h-4" /></Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-2xl text-white shadow-inner group-hover:text-indigo-400 transition-colors">{score.score}</div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">Auth Date</p>
                        <p className="font-bold text-white text-lg tracking-tight">{new Date(score.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingId(score.id); setEditFormData({ score: score.score.toString(), date: score.date }); }} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-white transition-all"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(score.id)} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-rose-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {scores.length === 0 && <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-[3rem] opacity-30 text-slate-500 font-bold uppercase tracking-widest text-xs">No records synchronized.</div>}
      </div>
    </div>
  );
}
