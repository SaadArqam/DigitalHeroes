'use client';

const charities = [
  {
    id: '1',
    name: 'Golf Foundation for Youth',
    description: 'Dedicated to introducing golf to underprivileged youth through education and equipment.',
    image: 'https://images.unsplash.com/photo-1559829269-a783e8e5c756?w=800&h=600&fit=crop',
    raised: '₹45,000'
  },
  {
    id: '2',
    name: 'Green Earth Golf Initiative',
    description: 'Environmental organization focused on making golf more sustainable.',
    image: 'https://images.unsplash.com/photo-1540206395-68808572932b?w=800&h=600&fit=crop',
    raised: '₹38,000'
  },
  {
    id: '3',
    name: 'Veterans Golf Rehab',
    description: 'Supporting military veterans through golf therapy and rehabilitation.',
    image: 'https://images.unsplash.com/photo-1517120191895-7313b4a8c8a6?w=800&h=600&fit=crop',
    raised: '₹67,000'
  }
];

export default function CharityImpact() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-64 -mt-64 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full"></div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-sm font-bold tracking-widest text-emerald-600 uppercase mb-4">The Impact</h2>
          <h3 className="text-4xl font-extrabold text-slate-900 md:text-5xl mb-6">Changing the world <br />one swing at a time</h3>
          <p className="text-lg text-slate-600">
            A portion of every victory is shared with organizations making a real difference. Choose your cause.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {charities.map((charity) => (
            <div key={charity.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100">
               <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img 
                    src={charity.image} 
                    alt={charity.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                     <span className="px-3 py-1 bg-white text-slate-900 font-bold rounded-full text-xs">Partner Charity</span>
                  </div>
               </div>
               <div className="p-8 flex flex-col flex-grow">
                  <h4 className="text-2xl font-bold text-slate-900 mb-3">{charity.name}</h4>
                  <p className="text-slate-500 mb-8 leading-relaxed line-clamp-2">{charity.description}</p>
                  
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                     <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">Raised so far</span>
                     <span className="text-xl font-extrabold text-emerald-600">{charity.raised}</span>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
