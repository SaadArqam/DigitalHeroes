'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/ui/page-container';
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  async function handleSignup() {
    if (!email || !password) {
      setError('Required fields missing.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error: signupError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (signupError) throw signupError;

      if (data?.session) {
        setSuccess('Profile initialized. Entering terminal...');
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 1000);
      } else {
        setSuccess('Verification required. Check your inbox to confirm citizenship.');
        setLoading(false);
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  }

  return (
    <PageContainer className="flex items-center justify-center min-h-[90vh]">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-gradient rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-glow">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Request <span className="text-gradient">Citizenship</span></h1>
          <p className="text-text-secondary font-medium">Initialize your profile to join the network.</p>
        </div>

        <Card variant="glass" className="border-card-border p-2">
          <CardContent className="pt-6">
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
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
                label="Create Security Key"
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
                Initialize Profile
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-card-border/50 text-center">
              <p className="text-text-secondary text-xs font-bold uppercase tracking-widest">
                Already part of the network?{' '}
                <Link href="/login" className="text-primary-end hover:text-primary-start transition-colors underline decoration-primary-end/30 underline-offset-4">
                  Authorize Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}