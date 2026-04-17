'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div 
            key={t.id}
            className={`
              pointer-events-auto px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-4 animate-in slide-in-from-right-10 duration-300
              ${t.type === 'success' ? 'bg-white border-emerald-100 text-emerald-900' : ''}
              ${t.type === 'error' ? 'bg-white border-red-100 text-red-900' : ''}
              ${t.type === 'info' ? 'bg-white border-indigo-100 text-indigo-900' : ''}
            `}
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              t.type === 'success' ? 'bg-emerald-500' : 
              t.type === 'error' ? 'bg-red-500' : 'bg-indigo-500'
            }`} />
            <p className="font-bold text-sm tracking-tight">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
