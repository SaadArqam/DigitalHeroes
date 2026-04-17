'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <Link 
              href="/" 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6 inline-block"
            >
              GreenJack
            </Link>
            <p className="text-slate-500 leading-relaxed mb-8 max-w-xs">
              The elite platform for golfers who play with purpose. Drive change, win big, and join the mission.
            </p>
            <div className="flex gap-4">
              {/* Simple Social Icons */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Product</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/subscribe" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/charities" className="hover:text-white transition-colors">Causes</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Legal</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Stay Updated</h4>
            <p className="text-sm mb-4">Join our newsletter for weekly tournament results and impact reports.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 flex-grow"
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest">
          <p>© 2024 GreenJack. Built for champions.</p>
          <div className="flex gap-8">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
