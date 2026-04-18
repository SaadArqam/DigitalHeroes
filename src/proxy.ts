import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Public asset bypass
  if (pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/) || pathname.startsWith('/_next')) {
    return response
  }

  // 1. Unauthenticated users seeking protected routes
  if (!user && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    const role = profile?.role || 'user'
    const isAdmin = role === 'admin' || user.email === 'admin@gmail.com'

    // 2. Redirect logged in users away from auth pages
    if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // 3. Admin Protection
    if (pathname.startsWith('/admin')) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      return response
    }

    // 4. Dashboard Protection (Subscription check)
    if (pathname.startsWith('/dashboard')) {
      if (isAdmin) return response

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle()

      const hasActiveSub = !!subscription
      const isSuccessReturn = request.nextUrl.searchParams.get('success') === 'true'

      if (!hasActiveSub && !isSuccessReturn) {
        return NextResponse.redirect(new URL('/subscribe', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
