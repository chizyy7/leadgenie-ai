import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { loginSchema } from '@/lib/validations/auth'
import type { ApiResponse } from '@/types'

interface LoginResult {
  user_id: string
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<LoginResult>>> {
  try {
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
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: error?.message ?? 'Invalid email or password',
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
