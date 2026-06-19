import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
    supabaseUrl = 'https://placeholder-project.supabase.co'
    supabaseKey = 'placeholder-anon-key'
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not intercept the auth callback route
  if (request.nextUrl.pathname.startsWith('/api/auth/callback')) {
    return supabaseResponse
  }

  // --- DEMO MODE BYPASS ---
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your-supabase-project-url'
  if (isDemoMode) {
    const demoSession = request.cookies.get('demo_session')
    const isLoggedIn = !!demoSession

    // Protect dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard') && !isLoggedIn) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      if (request.nextUrl.searchParams.has('next')) {
        url.searchParams.set('next', request.nextUrl.searchParams.get('next')!)
      } else {
        url.searchParams.set('next', request.nextUrl.pathname)
      }
      return NextResponse.redirect(url)
    }

    // Redirect logged-in users away from landing/auth page to dashboard
    if (request.nextUrl.pathname === '/' && isLoggedIn) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }
  // ------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    if (request.nextUrl.searchParams.has('next')) {
      url.searchParams.set('next', request.nextUrl.searchParams.get('next')!)
    } else {
      url.searchParams.set('next', request.nextUrl.pathname)
    }
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from landing/auth page to dashboard
  if (request.nextUrl.pathname === '/' && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
