import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')
  const allowedNext = new Set(['/dashboard', '/onboarding'])

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_oauth_code', origin))
  }

  const supabase = await createServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, origin))
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.redirect(new URL('/login?error=missing_user', origin))
  }

  const { data: profile, error: profileError } = await supabase.from('users').select('service').eq('id', user.id).single()
  const isNewUser = Boolean(profileError || !profile?.service)
  const safeNext = next && allowedNext.has(next) ? next : null
  const redirectTo = isNewUser ? '/onboarding' : safeNext ?? '/dashboard'

  return NextResponse.redirect(new URL(redirectTo, origin))
}
