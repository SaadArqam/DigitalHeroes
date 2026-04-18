'use client';

import { useState, useEffect } from 'react';
import { getCharities } from '@/app/actions/charities';
import { Charity } from '@/lib/types';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Sparkles, ArrowRight, Loader2, Globe } from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getCharities();
      if (res.success) setCharities(res.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = charities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      
      <PageContainer className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16 px-4">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full mb-2">
                 <Heart className="w-3 h-3 text-rose-500 fill-rose-500/20" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-rose-500">Global Impact Ledger</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-[-0.05em] leading-[0.85]">
                Choose Your <span className="text-gradient italic">Mission</span>
              </h1>
              <p className="text-text-secondary text-lg font-bold">
                10% of every subscription cycle is autonomously distributed to verified impact partners. Select the organization you wish to support.
              </p>
            </div>
            
            <div className="relative w-full md:w-96">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
               <input 
                 type="text" 
                 placeholder="Search missions..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-16 pr-8 py-5 bg-card border border-card-border rounded-[2rem] text-white font-bold focus:outline-none focus:ring-4 focus:ring-primary-end/10 transition-all placeholder:text-slate-600 shadow-xl"
               />
            </div>
          </div>

          {loading ? (
             <div className="py-40 text-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary-end mx-auto mb-6" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Synchronizing Partner Registry...</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
               <AnimatePresence>
                  {filtered.map((charity, index) => (
                    <motion.div
                      layout
                      key={charity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/charities/${charity.id}`}>
                        <div className="group relative bg-card border border-card-border rounded-[2.5rem] p-6 h-full flex flex-col hover:border-primary-end/50 transition-all duration-500 cursor-pointer shadow-2xl">
                           {/* Image Container */}
                           <div className="aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-8 relative">
                              <img 
                                src={charity.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb35ec6e?q=80&w=800'} 
                                alt={charity.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                              />
                              {charity.is_featured && (
                                <div className="absolute top-4 left-4">
                                   <div className="bg-primary-gradient/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-1.5 shadow-lg">
                                      <Sparkles className="w-3 h-3 text-yellow-300" /> Platinum Partner
                                   </div>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                 <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">View Mission Profile <ArrowRight className="w-4 h-4" /></span>
                              </div>
                           </div>

                           <div className="flex-1 space-y-3 px-2">
                              <h3 className="text-2xl font-black text-white tracking-tight leading-none">{charity.name}</h3>
                              <p className="text-sm font-bold text-slate-500 leading-relaxed line-clamp-2 uppercase tracking-tighter">
                                 {charity.description}
                              </p>
                           </div>

                           <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between px-2">
                              <div className="flex items-center gap-2">
                                 <Globe className="w-4 h-4 text-primary-end" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Verified Organization</span>
                              </div>
                              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-primary-gradient group-hover:text-white transition-all">
                                 <ArrowRight className="w-5 h-5" />
                              </div>
                           </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
