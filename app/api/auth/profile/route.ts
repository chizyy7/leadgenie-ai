import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { updateProfileSchema } from '@/lib/validations/auth'
import type { ApiResponse, User } from '@/types'

export async function GET(): Promise<NextResponse<ApiResponse<User>>> {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            status: 401,
          },
        },
        { status: 401 }
      )
    }

    const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single()

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: error?.message ?? 'Profile not found',
            status: 404,
          },
        },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error('[GET /api/auth/profile]', error)
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

export async function PATCH(request: NextRequest): Promise<NextResponse<ApiResponse<User>>> {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            status: 401,
          },
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = updateProfileSchema.safeParse(body)

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

    const { data, error } = await supabase
      .from('users')
      .update({
        ...(parsed.data.full_name !== undefined ? { full_name: parsed.data.full_name } : {}),
        ...(parsed.data.service !== undefined ? { service: parsed.data.service } : {}),
      })
      .eq('id', user.id)
      .select('*')
      .single()

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UPDATE_FAILED',
            message: error?.message ?? 'Unable to update profile',
            status: 400,
          },
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error('[PATCH /api/auth/profile]', error)
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
