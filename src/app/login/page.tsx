'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return setError('All credentials are required.');

    setLoading(true);
    setError('');

    try {
      const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) throw loginError;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', authData.user?.id)
        .maybeSingle();

      const isAdmin = profile?.role === 'admin' || email === 'admin@gmail.com';
      
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? 'Access Denied: Verification failure.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Authorize <span className="text-gradient">Session</span></h1>
          <p className="text-[#94A3B8] font-bold">Secure terminal access protocol.</p>
        </div>

        <Card variant="glass">
          <CardContent className="pt-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <Input
                label="Identity Email"
                type="email"
                placeholder="commander@greenjack.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                required
              />
              <Input
                label="Security Key"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                required
              />

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-black uppercase tracking-tight">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" isLoading={loading}>
                Access Terminal
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-[#64748B] text-xs font-black uppercase tracking-widest">
                First time at the terminal?{' '}
                <Link href="/signup" className="text-blue-500 hover:text-white transition-colors underline decoration-blue-500/30 underline-offset-4">
                  Register Citizenship
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}