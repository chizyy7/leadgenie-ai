import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { signupSchema } from '@/lib/validations/auth'
import type { ApiResponse } from '@/types'

interface SignupResult {
  user_id: string | null
  needsEmailConfirmation: boolean
}

function friendlySignupError(rawMessage: string): string {
  const message = rawMessage.toLowerCase()

  if (message.includes('user already registered')) {
    return 'An account with this email already exists. Please sign in instead.'
  }

  if (message.includes('redirect_to is not allowed') || message.includes('redirect url')) {
    return 'Auth redirect URL is not configured in Supabase. Add your Vercel URLs to Authentication > URL Configuration.'
  }

  return rawMessage
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<SignupResult>>> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_CONFIG_MISSING',
            message: 'Authentication is not configured on the server. Set Supabase environment variables in Vercel.',
            status: 500,
          },
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: parsed.error.issues[0]?.message ?? 'Invalid input',
            status: 422,
          },
        },
        { status: 422 }
      )
    }

    const supabase = await createServerClient()

    const requestOrigin = request.nextUrl.origin
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || requestOrigin
    const emailRedirectTo = `${appUrl}/auth/callback?next=%2Fonboarding`

    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          full_name: parsed.data.full_name,
        },
        emailRedirectTo,
      },
    })

    if (error) {
      const message = friendlySignupError(error.message)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SIGNUP_FAILED',
            message,
            status: 400,
          },
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user_id: data.user?.id ?? null,
          needsEmailConfirmation: !data.session,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/auth/signup]', error)

    const message = error instanceof Error ? error.message : 'Unknown signup error'

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: `Unable to create account. ${message}`,
          status: 500,
        },
      },
      { status: 500 }
    )
  }
}
