import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Public asset bypass
  if (pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/) || pathname.startsWith('/_next')) {
    return supabaseResponse
  }

  // 1. Unauthenticated users seeking protected routes
  if (!user && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Fetch role and subscription status if user exists
  let role = 'user'
  let isAdmin = false
  let subscriptionStatus = 'none'

  if (user) {
    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin, role')
      .eq('user_id', user.id)
      .maybeSingle()

    role = profile?.role || 'user'
    isAdmin = profile?.is_admin || role === 'admin' || user.email === 'admin@gmail.com'

    // Fetch subscription status ONLY if not admin
    if (!isAdmin) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle()
      
      subscriptionStatus = subscription?.status || 'none'
    } else {
      subscriptionStatus = 'active (admin bypass)'
    }

    // DEBUG LOGGING (as requested)
    console.log(`[AUTH_PROT] User: ${user.id} | Email: ${user.email} | Role: ${role} | Admin: ${isAdmin} | Path: ${pathname} | Sub: ${subscriptionStatus}`)
  }

  // 2. Redirect logged in users away from login/signup
  if (user && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 3. Admin Protection: Role Check
  if (pathname.startsWith('/admin')) {
    if (!isAdmin) {
      console.warn(`[AUTH_DENIED] Non-admin access to /admin blocked for ${user?.id}`)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // Allow admins to access /admin freely
    return supabaseResponse
  }

  // 4. Dashboard Protection: Subscription Check
  if (user && pathname.startsWith('/dashboard')) {
    // Bypass for admins
    if (isAdmin) {
      return supabaseResponse
    }

    // Bypass if returning from success
    if (request.nextUrl.searchParams.get('success') === 'true') {
      return supabaseResponse
    }

    // Redirect normal users if no subscription
    if (subscriptionStatus !== 'active') {
      console.log(`[AUTH_SUB_REQUIRED] No active sub for ${user.id}, redirecting to /subscribe`)
      return NextResponse.redirect(new URL('/subscribe', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
