'use client';

export default function PrizePool() {
  const prizes = [
    { name: '3-Match Prize', share: '25%', color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50' },
    { name: '4-Match Prize', share: '35%', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
    { name: '5-Match Jackpot', share: '40%', color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50' },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:order-2 lg:w-1/2">
             <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-4">The Rewards</h2>
             <h3 className="text-4xl font-extrabold text-slate-900 md:text-5xl mb-6">How you win</h3>
             <p className="text-lg text-slate-600 mb-8 leading-relaxed">
               Our prize draws are designed to be fair, transparent, and rewarding for the active golfer.
             </p>
             
             <div className="space-y-6">
                <div className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Algorithmic Precision</h4>
                    <p className="text-slate-500 leading-relaxed">Our system uses a verified random algorithm to ensure every eligible entry has a fair chance.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Scale with Entries</h4>
                    <p className="text-slate-500 leading-relaxed">The more scores you submit, the higher your frequency in the drawing pool.</p>
                  </div>
                </div>
             </div>
          </div>
          
          <div className="lg:order-1 lg:w-1/2">
             <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-32 -mt-32"></div>
                <div className="relative z-10 text-center mb-12">
                   <h4 className="text-3xl font-extrabold text-white mb-2">Weekly Prize Pool</h4>
                   <p className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Revenue Share Model</p>
                </div>
                
                <div className="space-y-4">
                   {prizes.map((prize, i) => (
                     <div key={i} className="group flex items-center justify-between p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-indigo-500 transition-all duration-300">
                        <span className="text-xl font-bold text-white uppercase tracking-tight">{prize.name}</span>
                        <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${prize.color} text-white font-extrabold shadow-lg`}>
                           {prize.share}
                        </div>
                     </div>
                   ))}
                </div>
                
                <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                   <p className="text-emerald-400 font-semibold text-sm">
                     10% of every subscription goes directly to charity!
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
