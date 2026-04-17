'use client';

import { useState, Suspense } from 'react';
import AdminOverview from '@/components/admin-overview';
import AdminUsers from '@/components/admin-users';
import { AdminDrawPanel } from '@/components/admin-draw-panel';
import AdminCharities from '@/components/admin-charities';
import AdminWinners from '@/components/admin-winners';

function AdminContent() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Platform Pulse', component: AdminOverview, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { id: 'users', label: 'User Index', component: AdminUsers, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'draws', label: 'Draw Engine', component: AdminDrawPanel, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'winners', label: 'Winner Payouts', component: AdminWinners, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'charities', label: 'Charity Governance', component: AdminCharities, icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || AdminOverview;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Modern Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-4 border border-slate-100 flex flex-col gap-2 sticky top-8">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-4 mb-4 mt-2">Core Modules</h2>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-indigo text-white shadow-md shadow-brand-indigo/20 scale-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 scale-[0.98]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} />
                  </svg>
                </div>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Master Content Area */}
        <div className="flex-grow min-w-0">
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             {/* AdminOverview handles "View Users", "View Subscriptions", and "View Scores" summarizations */}
             {/* The robust components inside ActiveComponent implement the actual tables */}
             <ActiveComponent />
          </div>
        </div>

      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-all bg-slate-50">
           <div className="w-16 h-16 bg-slate-200/50 rounded-2xl mx-auto flex items-center justify-center">
             <div className="w-8 h-8 rounded-full border-4 border-slate-300 border-t-slate-500 animate-spin"></div>
           </div>
      </div>
    }>
      <AdminContent />
    </Suspense>
  );
}
