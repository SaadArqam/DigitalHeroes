import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 500 }}>Dashboard</h1>
      <p style={{ color: '#888', marginTop: 8 }}>Logged in as: {user.email}</p>
    </div>
  )
}