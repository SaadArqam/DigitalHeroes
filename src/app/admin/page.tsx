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
  ChevronRight
} from 'lucide-react';

// --- Components ---

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
          <ArrowUpRight className="w-3 h-3 mr-1" /> {trend}
        </span>
      )}
    </div>
    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">{title}</p>
    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
      {typeof value === 'number' && value >= 1000 ? `₹${value.toLocaleString()}` : value}
    </h3>
  </motion.div>
);

const SectionHeader = ({ title, description, badge }: any) => (
  <div className="mb-8">
    {badge && <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">{badge}</span>}
    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
    <p className="text-slate-500 font-medium">{description}</p>
  </div>
);

// --- Main Admin Dashboard ---

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('users');
  const [isDrawing, setIsDrawing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [syncing, setSyncing] = useState(false);

  const { toast } = useToast();

  async function loadData() {
    setSyncing(true);
    try {
      const res = await fetchAdminData();
      setData(res);
      if (data) toast('System ledger synchronized', 'success');
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Secure Data...</p>
      </div>
    </div>
  );

  const stats = data.stats;

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-slate-900 font-sans p-6 lg:p-12">
      {/* Navbar / Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <span className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px] mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" /> Admin Terminal v2.0
          </span>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">Control <span className="text-indigo-600">Central</span></h1>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={loadData}
            disabled={syncing}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            Sync Data
          </button>
          
          <button 
            onClick={handleRunDraw} 
            disabled={isDrawing}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition active:scale-95 disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {isDrawing ? 'Executing...' : 'Run Monthly Draw'}
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Citizens" value={stats.totalUsers} icon={Users} color="bg-blue-500" />
        <StatCard title="Monthly Revenue" value={stats.totalRevenue} icon={CreditCard} color="bg-emerald-500" trend="+12%" />
        <StatCard title="Active Prize Pool" value={stats.totalPrizePool} icon={Trophy} color="bg-indigo-500" />
        <StatCard title="Charity Impact" value={stats.totalCharityImpact} icon={Heart} color="bg-rose-500" />
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Sidebar Nav */}
        <nav className="lg:w-64 space-y-2">
          {[
            { id: 'users', label: 'Citizens', icon: Users },
            { id: 'subscriptions', label: 'Treasury', icon: CreditCard },
            { id: 'draws', label: 'Draw History', icon: Play },
            { id: 'winners', label: 'Victories', icon: Trophy },
            { id: 'charity', label: 'Impact Partner', icon: Heart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-xl' 
                  : 'text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Dynamic Table Section */}
        <section className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{activeTab} Ledger</h2>
              <p className="text-xs font-bold text-slate-400">Viewing all records within the {activeTab} domain.</p>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search database..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-bold text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto max-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-4"
              >
                {/* Dynamic Content based on tab */}
                {activeTab === 'users' && (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50">
                        <th className="px-6 py-4">User Identity</th>
                        <th className="px-6 py-4">Join Date</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(data.users || []).filter((u:any) => u.email?.includes(searchTerm)).map((user:any) => (
                        <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                {user.email?.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold text-slate-700">{user.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm font-medium text-slate-500">{new Date(user.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                              {user.role === 'admin' ? 'Admin' : 'Citizen'}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 transition">
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'winners' && (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50">
                        <th className="px-6 py-4">Victor</th>
                        <th className="px-6 py-4">Prize</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(data.winners || []).map((winner:any) => (
                        <tr key={winner.id} className="group hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-5">
                            <div className="font-bold text-slate-700">{winner.profiles?.email || 'Unknown'}</div>
                            <div className="text-[10px] font-bold text-slate-400">{winner.match_count} Matches</div>
                          </td>
                          <td className="px-6 py-5 font-black text-slate-800">₹{winner.winnings.toLocaleString()}</td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              {winner.status === 'verified' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-amber-500" />}
                              <span className={`text-[10px] font-black uppercase tracking-widest ${winner.status === 'verified' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {winner.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex gap-2">
                              {winner.status === 'pending' && (
                                <button className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition">Approve</button>
                              )}
                              <button className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition">View</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'draws' && (
                  <div className="space-y-4 p-4">
                    {(data.draws || []).map((draw:any) => (
                      <div key={draw.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex gap-4 items-center">
                          <div className="p-4 bg-white rounded-2xl shadow-sm">
                            <Play className="w-6 h-6 text-indigo-500" />
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 tracking-tight">Cycle #{draw.id.slice(0, 8)}</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(draw.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {draw.winning_numbers.map((num:number, i:number) => (
                            <div key={i} className="w-10 h-10 rounded-full bg-white border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-sm shadow-sm">
                              {num}
                            </div>
                          ))}
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-black text-slate-800">{draw.draw_results?.length || 0} Winners</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payout Pending</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(activeTab === 'subscriptions' || activeTab === 'charity') && (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                       <RefreshCw className="w-8 h-8 text-slate-200 animate-spin" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">Detail View Pending</h3>
                    <p className="text-slate-400 font-medium max-w-sm mx-auto">This ledger module is currently synchronizing with the primary database infrastructure.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
