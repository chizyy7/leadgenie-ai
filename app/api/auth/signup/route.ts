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

  if (message.includes('email already') || message.includes('already exists')) {
    return 'An account with this email already exists. Please sign in instead.'
  }

  if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
    return 'Invalid email or password. Please use a valid email and a password with at least 8 characters.'
  }

  if (message.includes('invalid email')) {
    return 'Enter a valid email address.'
  }

  if (message.includes('password') && (message.includes('weak') || message.includes('least'))) {
    return 'Password is too weak. Please use at least 8 characters.'
  }

  if (message.includes('signups not allowed') || message.includes('signup is disabled')) {
    return 'Signups are disabled for this project. Please contact support.'
  }

  if (message.includes('redirect_to is not allowed') || message.includes('redirect url')) {
    return 'Auth redirect URL is not configured in Supabase. Add your Vercel URLs to Authentication > URL Configuration.'
  }

  return rawMessage
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<SignupResult>>> {
  try {
    const missingEnv = [
      { name: 'NEXT_PUBLIC_SUPABASE_URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL },
      { name: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', value: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY },
    ]
      .filter((entry) => !entry.value)
      .map((entry) => entry.name)

    if (missingEnv.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_CONFIG_MISSING',
            message: `Authentication is not configured on the server. Missing: ${missingEnv.join(', ')}.`,
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
      const rawMessage = error.message.toLowerCase()
      const status = rawMessage.includes('user already registered') || rawMessage.includes('email already') ? 409 : 400
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SIGNUP_FAILED',
            message,
            status,
          },
        },
        { status }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SIGNUP_FAILED',
            message: 'Unable to create account. Please try again.',
            status: 500,
          },
        },
        { status: 500 }
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
