'use client';

import { useEffect, useState } from 'react';
import { fetchAdminData } from './queries';
import { runDraw } from '@/app/actions/draws';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('users');
  const [isDrawing, setIsDrawing] = useState(false);

  async function loadData() {
    const res = await fetchAdminData();
    setData(res);
  }

  useEffect(() => { loadData(); }, []);

  async function handleRunDraw() {
    setIsDrawing(true);
    await runDraw();
    await loadData();
    setIsDrawing(false);
  }

  if (!data) return <div className="p-10 font-bold">Loading System Data...</div>;

  const tabs = ['users', 'subscriptions', 'scores', 'draws', 'charities'];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Admin Control Panel</h1>
          <p className="text-slate-500 font-bold">Secure Zone</p>
        </div>
        <button 
          onClick={handleRunDraw} 
          disabled={isDrawing}
          className="bg-red-500 text-white font-black px-6 py-3 rounded-xl shadow-lg hover:bg-red-600 transition"
        >
          {isDrawing ? 'Executing Draw...' : 'FORCE RUN DRAW'}
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold capitalize rounded-lg ${activeTab === tab ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-auto">
        <h2 className="text-xl font-black mb-4 capitalize">{activeTab} Database</h2>
        <pre className="text-xs bg-slate-900 text-emerald-400 p-4 rounded-xl overflow-x-auto">
          {JSON.stringify(data[activeTab as keyof typeof data], null, 2)}
        </pre>
      </div>
    </div>
  );
}
