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
    setScores(data || []);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
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
    if (e) e.preventDefault();
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

  if (loading) return (
    <div className="py-20 text-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary-end mx-auto mb-6" />
      <p className="text-xs font-black uppercase tracking-[0.3em] text-text-muted">Decrypting Performance Ledger...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Capacity HUD */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-card/50 p-8 border border-card-border rounded-3xl backdrop-blur-md gap-6 text-center md:text-left">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-gradient/10 border border-primary-start/30 flex items-center justify-center">
             <Activity className="w-8 h-8 text-primary-end" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-1">Telemetry Capacity</p>
            <p className="text-4xl font-black text-white">{scores.length} <span className="text-xl text-text-muted">/ 5</span></p>
          </div>
        </div>
        <div className="w-full md:w-64 h-3 bg-background rounded-full overflow-hidden border border-card-border shadow-inner">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${(Math.min(scores.length / 5, 1)) * 100}%` }} 
            className="h-full bg-primary-gradient shadow-glow" 
          />
        </div>
      </div>

      {/* Manual Entry */}
      <div className="bg-card/30 border border-card-border p-8 rounded-[2.5rem]">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
           <Plus className="w-5 h-5 text-primary-end" />
           New Data Ingestion
        </h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-5">
            <Input label="Verification Score" type="number" placeholder="01-45" value={newScore} onChange={e => setNewScore(e.target.value)} icon={<Target className="w-5 h-5 text-text-muted" />} required />
          </div>
          <div className="md:col-span-4">
            <Input label="Operation Date" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} icon={<Calendar className="w-5 h-5 text-text-muted" />} required />
          </div>
          <div className="md:col-span-3">
            <Button type="submit" isLoading={actionLoading} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-premium">
              Log Result
            </Button>
          </div>
        </form>
      </div>

      {/* Records Registry */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <p className="text-xs font-black uppercase tracking-widest text-text-muted">History Log</p>
           <p className="text-xs font-bold text-primary-end uppercase tracking-widest">{scores.length} Records Found</p>
        </div>
        
        <AnimatePresence mode="popLayout" initial={false}>
          {scores.map(score => (
            <motion.div layout key={score.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
              <div className={`p-6 border rounded-[1.5rem] transition-all bg-card/10 backdrop-blur-sm ${editingId === score.id ? 'border-primary-start shadow-glow ring-1 ring-primary-start/50' : 'border-card-border hover:border-primary-start/30'}`}>
                {editingId === score.id ? (
                  <form onSubmit={handleEdit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                    <div className="md:col-span-4"><Input label="Override Score" type="number" value={editFormData.score} onChange={e => setEditFormData({...editFormData, score: e.target.value})} required /></div>
                    <div className="md:col-span-4"><Input label="Override Date" type="date" value={editFormData.date} onChange={e => setEditFormData({...editFormData, date: e.target.value})} required /></div>
                    <div className="md:col-span-4 flex gap-3">
                      <Button type="submit" isLoading={actionLoading} className="flex-1 rounded-2xl"><Save className="w-4 h-4 mr-2" /> Commit</Button>
                      <Button type="button" variant="secondary" onClick={() => setEditingId(null)} className="px-5 rounded-2xl"><X className="w-5 h-5" /></Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-2xl bg-background border border-card-border flex items-center justify-center font-black text-3xl text-white shadow-inner group-hover:text-primary-end transition-colors">{score.score}</div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-1">Auth Date</p>
                        <p className="font-bold text-white text-xl tracking-tight leading-none">{new Date(score.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => { setEditingId(score.id); setEditFormData({ score: score.score.toString(), date: score.date }); }} className="w-12 h-12 flex items-center justify-center rounded-xl bg-background border border-card-border text-text-muted hover:text-white hover:border-primary-start/50 transition-all"><Pencil className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(score.id)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-background border border-card-border text-text-muted hover:text-rose-500 hover:border-rose-500/50 transition-all"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {scores.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-card-border rounded-[3rem] opacity-40">
             <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-text-muted" />
             </div>
             <p className="text-text-muted font-black uppercase tracking-widest text-xs">No records synchronized.</p>
          </div>
        )}
      </div>
    </div>
  );
}
