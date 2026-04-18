'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/ui/page-container';
import { Mail, Lock, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin@123');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push('/dashboard');
    }
    checkUser();
  }, [router, supabase]);

  async function handleLogin() {
    if (!email || !password) {
      setError('Credentials required.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (loginError) throw loginError;

      if (data?.session) {
        setSuccess('Identity verified. Accessing terminal...');
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message ?? 'Access denied. Please check your credentials.');
      setLoading(false);
    }
  }

  return (
    <PageContainer className="flex items-center justify-center min-h-[90vh]">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-gradient rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-glow">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Access <span className="text-gradient">Terminal</span></h1>
          <p className="text-text-secondary font-medium">Authentication required for player data synchronization.</p>
        </div>

        <Card variant="glass" className="border-card-border p-2">
          <CardContent className="pt-6">
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-5 h-5 text-text-muted" />}
                required
                disabled={loading}
                className="bg-background/50"
              />
              <Input
                label="Security Key"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5 text-text-muted" />}
                required
                disabled={loading}
                className="bg-background/50"
              />

              {error && (
                <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold animate-in zoom-in-95">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-xs font-bold animate-in zoom-in-95">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <p>{success}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl"
                isLoading={loading}
                disabled={loading}
                size="lg"
              >
                Sync Identity
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-card-border/50 text-center">
              <p className="text-text-secondary text-xs font-bold uppercase tracking-widest">
                New to the network?{' '}
                <Link href="/signup" className="text-primary-end hover:text-primary-start transition-colors underline decoration-primary-end/30 underline-offset-4">
                  Apply for Citizenship
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}