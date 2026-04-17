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

  // Auto-redirect if already logged in
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

      // If user is auto-confirmed (email confirmation is OFF)
      if (data?.session) {
        setSuccess('Profile initialized successfully. Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 1000);
      } else {
        // If email confirmation is ON
        setSuccess('Verification required. Check your inbox to confirm your account.');
        setLoading(false);
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  }

  return (
    <PageContainer className="flex items-center justify-center">
      <Card variant="glass" className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary-gradient rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-glow">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Join the Elite</CardTitle>
          <CardDescription>Create your player profile to begin your journey</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              required
              disabled={loading}
            />
            <Input
              label="Choose Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              required
              disabled={loading}
            />

            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
              disabled={loading}
              size="lg"
            >
              Initialize Profile
            </Button>
          </form>

          {!loading && (
            <p className="text-center mt-8 text-text-secondary text-[10px] font-black uppercase tracking-widest">
              Already part of the network?{' '}
              <Link href="/login" className="text-primary-end hover:text-primary-start transition-colors underline decoration-primary-end/30 underline-offset-4">
                Authorize Login
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}