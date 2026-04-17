'use client';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Join & Subscribe',
      description: "Secure your spot in the elite GreenJack community with a premium membership.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'bg-indigo-500',
    },
    {
      title: 'Play & Submit',
      description: 'Submit your scores from your weekend rounds. Every entry brings you closer to victory.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
    {
      title: 'Win & Give Back',
      description: 'Win exclusive prizes while supporting global causes automatically with every victory.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'bg-emerald-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-4">The Process</h2>
          <h3 className="text-4xl font-extrabold text-slate-900 md:text-5xl mb-6">How it works</h3>
          <p className="text-lg text-slate-600">
            A seamless trifecta of competition, celebration, and contribution.
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-12">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 hidden md:block -z-10"></div>

          {steps.map((step, i) => (
            <div key={i} className="group relative flex flex-col items-center p-8 bg-white rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-500">
              <div className={`relative flex items-center justify-center w-16 h-16 mb-8 rounded-2xl text-white shadow-lg ${step.color} group-hover:scale-110 transition-transform`}>
                <div className="absolute -top-3 -right-3 flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 font-bold border-4 border-white text-xs">
                  {i + 1}
                </div>
                {step.icon}
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{step.title}</h4>
              <p className="text-center text-slate-600 leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
