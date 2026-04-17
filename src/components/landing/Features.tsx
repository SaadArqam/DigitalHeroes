'use client';

export default function Features() {
  const features = [
    {
      title: 'Real-time Analytics',
      description: 'Track your handicap and performance trends with professional-grade insights.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: 'Automated Giving',
      description: 'Choose your charities once, and we handle the donations with full transparency.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Elite Network',
      description: 'Connect with hundreds of like-minded golfers who share your passion for the game.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'Secure Payments',
      description: 'Enterprise-grade security for all transactions powered by industry leaders.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-sm font-bold tracking-widest text-emerald-400 uppercase mb-4">Excellence Preferred</h2>
            <h3 className="text-4xl font-extrabold md:text-5xl lg:text-6xl mb-8 leading-tight">
              Why choose <br />
              <span className="text-indigo-400">GreenJack?</span>
            </h3>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-xl">
              We've combined the thrill of competition with the power of modern philanthropy to create something truly unique.
            </p>
            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                    <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full -z-10 animate-pulse"></div>
            <div className="bg-slate-800/50 backdrop-blur-3xl p-4 rounded-[2rem] border border-slate-700 shadow-2xl overflow-hidden group">
               <div className="aspect-video rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-700">
                  <div className="text-center group-hover:scale-110 transition-transform duration-500">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4 border border-indigo-500/50">
                      <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="font-bold text-slate-400">Watch Platform Overview</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
