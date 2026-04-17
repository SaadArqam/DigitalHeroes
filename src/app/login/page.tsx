'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>Sign in</h1>
      <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>
        Don't have an account? <a href="/signup" style={{ color: 'inherit', textDecoration: 'underline' }}>Sign up</a>
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}
        />
        {error && <p style={{ color: 'red', fontSize: 13 }}>{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ padding: '10px', borderRadius: 8, background: '#111', color: '#fff', border: 'none', fontSize: 14, cursor: 'pointer' }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </div>
  )
}