'use client';

import { useState, Suspense } from 'react';
import AdminOverview from '@/components/admin-overview';
import AdminUsers from '@/components/admin-users';
import AdminDraws from '@/components/admin-draws';
import AdminCharities from '@/components/admin-charities';
import AdminWinners from '@/components/admin-winners';

function AdminContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string>('');

  const tabs = [
    { id: 'overview', label: 'Overview', component: AdminOverview },
    { id: 'users', label: 'Users', component: AdminUsers },
    { id: 'draws', label: 'Draws', component: AdminDraws },
    { id: 'charities', label: 'Charities', component: AdminCharities },
    { id: 'winners', label: 'Winners', component: AdminWinners }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || AdminOverview;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Panel
          </h1>
          <p className="text-xl text-gray-600">
            Manage users, draws, charities, and winnings
          </p>
        </div>

        {error && (
          <div className="mb-6 max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
              {error}
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-32 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <AdminContent />
    </Suspense>
  );
}
