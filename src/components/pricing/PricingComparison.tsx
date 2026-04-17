'use client';

export default function PricingComparison() {
  const features = [
    { name: 'Unlimited score entries', monthly: true, yearly: true },
    { name: 'Monthly draws participation', monthly: true, yearly: true },
    { name: 'Charity contribution matching', monthly: true, yearly: true },
    { name: 'Priority customer support', monthly: 'Standard', yearly: 'VIP' },
    { name: 'Advanced analytics dashboard', monthly: false, yearly: true },
    { name: 'Exclusive tournament access', monthly: false, yearly: true },
    { name: 'Early feature access', monthly: false, yearly: true },
  ];

  return (
    <div className="mt-24">
      <div className="text-center mb-12">
        <h3 className="text-2xl font-black uppercase tracking-widest text-slate-900 mb-4">Plan Comparison</h3>
        <p className="text-slate-500 font-medium">Find the perfect fit for your golf journey.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-slate-400">Feature</th>
              <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-slate-900 border-l border-slate-200">Monthly</th>
              <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-indigo-600 border-l border-slate-200 bg-indigo-50/30">Yearly</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {features.map((feature, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5 text-sm font-bold text-slate-700">{feature.name}</td>
                <td className="px-8 py-5 text-sm font-bold text-slate-600 border-l border-slate-200">
                  {typeof feature.monthly === 'boolean' ? (
                    feature.monthly ? (
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )
                  ) : (
                    <span>{feature.monthly}</span>
                  )}
                </td>
                <td className="px-8 py-5 text-sm font-bold text-indigo-600 border-l border-slate-200 bg-indigo-50/10">
                  {typeof feature.yearly === 'boolean' ? (
                    feature.yearly ? (
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )
                  ) : (
                    <span>{feature.yearly}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
