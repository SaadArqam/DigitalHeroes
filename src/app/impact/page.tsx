import { PageContainer } from '@/components/ui/page-container';
import { Heart, Globe, Users, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function ImpactPage() {
  const stats = [
    { label: 'Total Contribution', value: '₹12,45,000+', icon: Heart, color: 'text-rose-500' },
    { label: 'Lives Impacted', value: '50,000+', icon: Users, color: 'text-indigo-500' },
    { label: 'Environment Nodes', value: '12', icon: Globe, color: 'text-emerald-500' },
    { label: 'Victory Trees', value: '5,000+', icon: Trophy, color: 'text-amber-500' },
  ];

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto py-20 px-6">
        <header className="text-center mb-24 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full mb-6 text-rose-500">
             <Heart className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-widest">Global Impact Report</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 italic">
            Purpose <br />
            <span className="text-gradient">Driven Play</span>
          </h1>
          <p className="text-[#94A3B8] text-xl font-bold max-w-2xl mx-auto leading-relaxed">
            Every score you log contributes to a global fund for environmental and social restoration. Transforming the game of golf into a platform for change.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, i) => (
            <Card key={i} className="p-8 bg-[#151B2A] border-[#1F2937] hover:border-white/10 transition-all group animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex justify-between items-start mb-6">
                 <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform shadow-premium`}>
                    <stat.icon className="w-8 h-8" />
                 </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#64748B] mb-1">{stat.label}</p>
              <h4 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h4>
            </Card>
          ))}
        </div>

        <section className="bg-gradient-to-br from-[#151B2A] to-[#0B1220] border border-white/5 rounded-[4rem] p-12 md:p-24 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary-start/10 blur-[120px] -mr-48 -mt-48" />
           <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
              <div>
                 <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-[0.9]">Supporting 12 impact <span className="text-gradient">partners</span> worldwide.</h2>
                 <p className="text-text-secondary text-lg font-bold mb-12">
                   We partner with verified organizations focusing on reforestation, ocean cleanup, and youth sports development in underserved communities.
                 </p>
                 <div className="flex flex-wrap gap-12 opacity-30 grayscale invert brightness-200">
                    <span className="text-2xl font-black italic tracking-widest">UNICEF</span>
                    <span className="text-2xl font-black italic tracking-widest">WWF</span>
                    <span className="text-2xl font-black italic tracking-widest">GREENPEACE</span>
                 </div>
              </div>
              <div className="relative aspect-square">
                 <div className="absolute inset-0 bg-primary-gradient rounded-[3rem] opacity-20 blur-2xl animate-pulse" />
                 <div className="relative h-full bg-[#0B1220] border border-white/10 rounded-[4rem] flex items-center justify-center">
                    <Heart className="w-32 h-32 text-rose-500 animate-bounce" />
                 </div>
              </div>
           </div>
        </section>
      </div>
    </PageContainer>
  );
}
