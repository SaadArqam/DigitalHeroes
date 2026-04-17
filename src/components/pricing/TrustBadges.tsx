'use client';

export default function TrustBadges() {
  const items = [
    {
      title: 'Secure Payments',
      description: 'Enterprise-grade encryption powered by Stripe.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: 'Cancel Anytime',
      description: 'One-click cancellation directly from your dashboard.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'No Hidden Fees',
      description: 'Simple, transparent pricing. What you see is what you pay.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 mt-16 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-slate-100">
            {item.icon}
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-1">{item.title}</h4>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
