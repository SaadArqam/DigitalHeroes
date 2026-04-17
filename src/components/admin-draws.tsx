'use client';

import { useState, useEffect } from 'react';
import { AdminDraw } from '@/lib/types';

interface AdminDrawsProps {
  className?: string;
}

export default function AdminDraws({ className = '' }: AdminDrawsProps) {
  const [draws, setDraws] = useState<AdminDraw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedDraw, setSelectedDraw] = useState<AdminDraw | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  const [drawMode, setDrawMode] = useState<'random' | 'algorithmic' | 'all'>('all');

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      // Mock data for demonstration - in real app, fetch from API
      const mockDraws: AdminDraw[] = [
        {
          id: '1',
          month: '2024-04',
          draw_numbers: [12, 23, 31, 45, 38],
          mode: 'algorithmic',
          status: 'completed',
          total_pool: 10000,
          jackpot_rollover: 1600,
          created_at: '2024-04-01'
        },
        {
          id: '2',
          month: '2024-03',
          draw_numbers: [8, 15, 22, 36, 41],
          mode: 'random',
          status: 'completed',
          total_pool: 8000,
          jackpot_rollover: 3200,
          created_at: '2024-03-01'
        },
        {
          id: '3',
          month: '2024-05',
          draw_numbers: [],
          mode: 'algorithmic',
          status: 'active',
          total_pool: 0,
          jackpot_rollover: 4800,
          created_at: '2024-05-01'
        }
      ];
      
      setDraws(mockDraws);
      setError('');
    } catch (err) {
      setError('Failed to fetch draws');
    } finally {
      setLoading(false);
    }
  };

  const handleRunDraw = async (drawId: string) => {
    if (!simulationMode) {
      if (!confirm('Are you sure you want to run this draw? This cannot be undone.')) {
        return;
      }
    }

    try {
      // In real app, this would call the draw engine
      alert(`Running draw ${drawId} in ${simulationMode ? 'simulation' : 'production'} mode`);
      
      // Update draw status in local state
      setDraws(draws.map(draw => 
        draw.id === drawId 
          ? { ...draw, status: 'completed' as const }
          : draw
      ));
    } catch (err) {
      setError('Failed to run draw');
    }
  };

  const handleRunSimulation = async (drawId: string) => {
    try {
      // In real app, this would call the draw engine with simulation mode
      alert(`Running simulation for draw ${drawId}`);
    } catch (err) {
      setError('Failed to run simulation');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'blue';
      case 'completed': return 'green';
      default: return 'gray';
    }
  };

  const filteredDraws = draws.filter(draw => 
    draw.mode === drawMode || drawMode === 'all'
  );

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-32 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Draw Management
      </h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-4">Draw Controls</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Draw Mode
            </label>
            <select
              value={drawMode}
              onChange={(e) => setDrawMode(e.target.value as 'random' | 'algorithmic' | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Draws</option>
              <option value="random">Random Mode</option>
              <option value="algorithmic">Algorithmic Mode</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Simulation Mode
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="simulation"
                checked={simulationMode}
                onChange={(e) => setSimulationMode(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="simulation" className="ml-2 text-sm text-gray-700">
                Enable simulation (no database changes)
              </label>
            </div>
          </div>

          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            Create New Draw
          </button>
        </div>
      </div>

      {/* Draw Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Month
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numbers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prize Pool
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rollover
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDraws.map((draw) => (
              <tr key={draw.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {draw.month}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="capitalize">{draw.mode}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {draw.draw_numbers.length > 0 ? draw.draw_numbers.join(', ') : 'Not generated'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(draw.status)}`}>
                    {draw.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{draw.total_pool.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{draw.jackpot_rollover.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex space-x-2">
                    {draw.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleRunSimulation(draw.id)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
                        >
                          Simulate
                        </button>
                        <button
                          onClick={() => handleRunDraw(draw.id)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                        >
                          Run Draw
                        </button>
                      </>
                    )}
                    {draw.status === 'completed' && (
                      <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded-md">
                        Completed
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Draw Details */}
      {selectedDraw && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3">Selected Draw Details</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Draw ID:</span>
              <span className="font-medium text-blue-900">{selectedDraw.id}</span>
            </div>
            <div>
              <span className="text-blue-700">Mode:</span>
              <span className="font-medium text-blue-900">{selectedDraw.mode}</span>
            </div>
            <div>
              <span className="text-blue-700">Numbers:</span>
              <span className="font-medium text-blue-900">
                {selectedDraw.draw_numbers.join(', ')}
              </span>
            </div>
            <div>
              <span className="text-blue-700">Status:</span>
              <span className={`font-medium ${getStatusColor(selectedDraw.status)}`}>
                {selectedDraw.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
