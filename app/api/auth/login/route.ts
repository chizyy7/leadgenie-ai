import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { loginSchema } from '@/lib/validations/auth'
import type { ApiResponse } from '@/types'

interface LoginResult {
  user_id: string
}

function friendlyLoginError(rawMessage: string): string {
  const message = rawMessage.toLowerCase()

  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.'
  }

  if (message.includes('email not confirmed')) {
    return 'Please confirm your email before signing in.'
  }

  return rawMessage
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<LoginResult>>> {
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
    const parsed = loginSchema.safeParse(body)

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

    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (error || !data.user) {
      const message = friendlyLoginError(error?.message ?? 'Invalid email or password')
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message,
            status: 401,
          },
        },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user_id: data.user.id,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[POST /api/auth/login]', error)

    const message = error instanceof Error ? error.message : 'Unknown authentication error'

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: `Unable to sign in. ${message}`,
          status: 500,
        },
      },
      { status: 500 }
    )
  }
}
