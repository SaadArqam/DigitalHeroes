'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      console.log(`[AUTH] Attempting signup for: ${email}`);
      const { data, error: signupError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (signupError) {
        console.error('[AUTH_ERROR] Supabase signup failed:', signupError);
        setError(signupError.message);
        setLoading(false);
        return;
      }

      console.log('[AUTH] Signup successful:', data.user?.id);
      
      if (data.session) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Verification email sent. Please check your inbox.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('[AUTH_CRITICAL] Unexpected signup failure:', err);
      setError('An unexpected system error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex items-center justify-center p-6 selection:bg-indigo-100 relative">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-indigo-50 via-violet-50/30 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-10 xl:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none" />

          <div className="relative z-10 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl mb-8">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Join the Elite</h1>
            <p className="text-slate-500 font-medium text-sm mt-3 leading-relaxed">
              Create your citizenship profile to begin your progression journey.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5 relative z-10">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Official Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none font-bold text-sm text-slate-900 placeholder:text-slate-400"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Secure Access Key (min 6 chars)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none font-bold text-sm text-slate-900 placeholder:text-slate-400"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-2xl border flex items-center gap-3 ${
                    error.includes('sent') ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-xs font-bold leading-tight">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-slate-100"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>Initialize Profile <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="text-center mt-10 text-slate-400 text-xs font-bold tracking-tight">
            ALREADY PART OF THE NETWORK?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 underline underline-offset-4 ml-1">
              LOGIN ACCESS
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}