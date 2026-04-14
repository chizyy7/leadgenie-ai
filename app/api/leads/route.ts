import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createLeadSchema } from '@/lib/validations/lead'
import type { ApiResponse, Lead } from '@/types'

export async function GET(): Promise<NextResponse<ApiResponse<Lead[]>>> {
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

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data: (data ?? []) as Lead[] }, { status: 200 })
  } catch (error) {
    console.error('[GET /api/leads]', error)
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

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Lead>>> {
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
    const parsed = createLeadSchema.safeParse(body)

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

    const insertPayload = {
      ...parsed.data,
      website: parsed.data.website || null,
      notes: parsed.data.notes || null,
      user_id: user.id,
    }

    const { data, error } = await supabase.from('leads').insert(insertPayload).select('*').single()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data: data as Lead }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/leads]', error)
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
