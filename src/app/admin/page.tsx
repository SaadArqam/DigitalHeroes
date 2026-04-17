'use client';

import { useEffect, useState } from 'react';
import { fetchAdminData } from './queries';
import { runDraw } from '@/app/actions/draws';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  CreditCard, 
  Trophy, 
  Heart, 
  Play, 
  RefreshCw, 
  ArrowUpRight, 
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  ShieldAlert,
  Settings
} from 'lucide-react';

import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminCharities } from '@/components/admin/AdminCharities';
import { AdminWinners } from '@/components/admin/AdminWinners';

// --- Components ---

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm hover:shadow-2xl transition-all duration-500 group"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <span className="flex items-center text-xs font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-xl">
          <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> {trend}
        </span>
      )}
    </div>
    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-2">{title}</p>
    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
      {typeof value === 'number' && title.toLowerCase().includes('revenue') ? `₹${value.toLocaleString()}` : value}
    </h3>
  </motion.div>
);

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('users');
  const [isDrawing, setIsDrawing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const { toast } = useToast();

  async function loadData() {
    setSyncing(true);
    try {
      const res = await fetchAdminData();
      setData(res);
    } catch {
      toast('Sync failed', 'error');
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  async function handleRunDraw() {
    if (!confirm('Are you sure you want to execute the monthly draw? This will calculate winners and distribute winnings.')) return;
    setIsDrawing(true);
    try {
      const res = await runDraw();
      if (res.success) {
        toast('Draw executed successfully!', 'success');
        await loadData();
      } else {
        toast('Draw failed: ' + res.message, 'error');
      }
    } catch {
      toast('Critical error during draw execution', 'error');
    } finally {
      setIsDrawing(false);
    }
  }

  if (!data) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center">
        <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Synchronizing Core Ledger...</p>
      </div>
    </div>
  );

  const stats = data.stats;

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-slate-900 font-sans p-6 lg:p-12">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-widest">System Status: Optimal</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-[-0.05em] text-slate-900 leading-[0.85]">
            Control <span className="text-indigo-600 italic">Terminal</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={loadData}
            disabled={syncing}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-5 bg-white border border-slate-200 rounded-[2rem] font-black text-slate-600 hover:bg-slate-50 transition shadow-sm disabled:opacity-50 text-sm uppercase tracking-widest"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            Sync
          </button>
          
          <button 
            onClick={handleRunDraw} 
            disabled={isDrawing}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 text-white font-black rounded-[2rem] shadow-2xl shadow-indigo-200 hover:bg-slate-900 hover:shadow-indigo-300 transition-all duration-500 disabled:opacity-50 text-sm uppercase tracking-widest group"
          >
            <Play className="w-4 h-4 group-hover:scale-125 transition-transform" />
            {isDrawing ? 'Executing...' : 'Run Draw'}
          </button>
        </div>
      </header>

      {/* Stats Cluster */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        <StatCard title="Total Citizens" value={stats.totalUsers} icon={Users} color="bg-blue-600" />
        <StatCard title="Monthly Revenue" value={stats.totalRevenue} icon={CreditCard} color="bg-emerald-600" trend="+12%" />
        <StatCard title="Active Prize Pool" value={stats.totalPrizePool} icon={Trophy} color="bg-indigo-600" />
        <StatCard title="Charity Impact" value={stats.totalCharityImpact} icon={Heart} color="bg-rose-600" />
      </div>

      {/* Workspace */}
      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        {/* Navigation Rail */}
        <nav className="lg:w-72 space-y-3">
          {[
            { id: 'users', label: 'Citizens', icon: Users },
            { id: 'draws', label: 'History', icon: Play },
            { id: 'winners', label: 'Victories', icon: Trophy },
            { id: 'charity', label: 'Impact', icon: Heart },
            { id: 'config', label: 'Protocol', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-5 px-8 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300 translate-x-2' 
                  : 'text-slate-400 hover:bg-white hover:text-indigo-600'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-400' : ''}`} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Viewport */}
        <section className="flex-1 min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'circOut' }}
            >
              {activeTab === 'users' && (
                <AdminUsers 
                   users={data.users} 
                   subscriptions={data.subscriptions}
                   scores={data.scores}
                   onRefresh={loadData} 
                />
              )}

              {activeTab === 'winners' && (
                <AdminWinners 
                   winners={data.winners} 
                   onRefresh={loadData} 
                />
              )}

              {activeTab === 'charity' && (
                <AdminCharities 
                   charities={data.charities} 
                   onRefresh={loadData} 
                />
              )}

              {activeTab === 'draws' && (
                <div className="space-y-6">
                   {(data.draws || []).map((draw:any) => (
                      <div key={draw.id} className="p-10 bg-white border border-slate-50 rounded-[3rem] shadow-sm flex flex-col md:flex-row justify-between items-center gap-10 group hover:shadow-xl transition-all duration-500">
                         <div className="flex gap-8 items-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                               <Play className="w-6 h-6" />
                            </div>
                            <div>
                               <h4 className="font-black text-slate-900 text-xl tracking-tight">Cycle #{draw.id.slice(0, 8)}</h4>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{new Date(draw.created_at).toLocaleDateString()} • {draw.status}</p>
                            </div>
                         </div>
                         
                         <div className="flex gap-3">
                            {draw.winning_numbers.map((num:number, i:number) => (
                               <div key={i} className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-xl shadow-slate-200">
                                  {num}
                               </div>
                            ))}
                         </div>

                         <div className="text-right">
                            <div className="text-2xl font-black text-slate-900">{draw.draw_results?.length || 0} Victors</div>
                            <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Status: Finalized</div>
                         </div>
                      </div>
                   ))}
                </div>
              )}

              {activeTab === 'config' && (
                <div className="p-20 text-center bg-white border border-slate-50 rounded-[3rem] shadow-sm">
                   <Settings className="w-16 h-16 text-slate-200 mx-auto mb-8 animate-spin-slow" />
                   <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Protocol Settings</h3>
                   <p className="text-slate-400 font-bold max-w-md mx-auto">System-wide parameters including draw mode (Algorithmic / Pure Random) and payout thresholds are currently locked by the root kernel.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
