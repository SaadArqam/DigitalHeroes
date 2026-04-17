'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-start/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary-end/10 rounded-full blur-[120px]" />
      </div>

      <main className={`max-w-7xl mx-auto px-6 lg:px-12 py-32 relative z-10 ${className}`}>
        {children}
      </main>
    </div>
  );
}
