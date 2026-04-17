'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/ui/page-container';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  }

  return (
    <PageContainer className="flex items-center justify-center">
      <Card variant="glass" className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary-gradient rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-glow">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your player terminal</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              required
            />
            <Input
              label="Secure Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              required
            />

            {error && (
              <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
              size="lg"
            >
              Authorize Access
            </Button>
          </form>

          <p className="text-center mt-8 text-text-secondary text-[10px] font-black uppercase tracking-widest">
            Don't have a citizenship?{' '}
            <Link href="/signup" className="text-primary-end hover:text-primary-start transition-colors underline decoration-primary-end/30 underline-offset-4">
              Apply Now
            </Link>
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}