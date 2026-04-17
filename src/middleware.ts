import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log(`MIDDLEWARE: No user found. Redirecting ${request.nextUrl.pathname} to /login`);
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (!user && request.nextUrl.pathname.startsWith('/admin')) {
    console.log(`MIDDLEWARE: No user found. Redirecting ${request.nextUrl.pathname} to /login`);
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
    // Bypass subscription check if returning from a successful checkout session
    // to avoid race conditions with the webhook processing.
    if (request.nextUrl.searchParams.get('success') === 'true') {
      console.log(`MIDDLEWARE: Bypassing subscription check due to ?success=true for user ${user.id}`);
      return supabaseResponse;
    }

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .single();

    if (subError || subscription?.status !== 'active') {
      console.log(`MIDDLEWARE: Missing or inactive subscription for user ${user.id}. Redirecting to /subscribe. Error:`, subError);
      return NextResponse.redirect(new URL('/subscribe', request.url));
    } else {
      console.log(`MIDDLEWARE: Active subscription found for user ${user.id}. Allowing /dashboard access.`);
    }
  }

  if (user && request.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single();

    if (error || !profile?.is_admin) {
      console.log(`MIDDLEWARE: Non-admin user ${user.id} attempting to access /admin. Redirecting to /dashboard.`);
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
