import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { signupSchema } from '@/lib/validations/auth'
import type { ApiResponse } from '@/types'

interface SignupResult {
  user_id: string | null
  needsEmailConfirmation: boolean
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<SignupResult>>> {
  try {
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

    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          full_name: parsed.data.full_name,
        },
      },
    })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SIGNUP_FAILED',
            message: error.message,
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
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Something went wrong',
          status: 500,
        },
      },
      { status: 500 }
    )
  }
}
