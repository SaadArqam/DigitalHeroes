'use client';

import { useRouter } from 'next/navigation';
import { CharitySelector } from '@/components/dashboard/CharitySelector';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function ImpactPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CharitySelector onComplete={() => router.push('/dashboard')} />
        </motion.div>
      </div>
    </div>
  );
}
