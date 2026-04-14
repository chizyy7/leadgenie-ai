import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { updateLeadSchema } from '@/lib/validations/lead'
import type { ApiResponse, Lead } from '@/types'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams): Promise<NextResponse<ApiResponse<Lead>>> {
  try {
    const { id } = await params
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
    const parsed = updateLeadSchema.safeParse(body)

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

    const patchPayload = {
      ...parsed.data,
      website: parsed.data.website === '' ? null : parsed.data.website,
      notes: parsed.data.notes === '' ? null : parsed.data.notes,
    }

    const { data, error } = await supabase
      .from('leads')
      .update(patchPayload)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error?.message ?? 'Lead not found',
            status: 404,
          },
        },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: data as Lead }, { status: 200 })
  } catch (error) {
    console.error('[PATCH /api/leads/[id]]', error)
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

export async function DELETE(_: NextRequest, { params }: RouteParams): Promise<NextResponse<ApiResponse<{ id: string }>>> {
  try {
    const { id } = await params
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
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id')
      .single()

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error?.message ?? 'Lead not found',
            status: 404,
          },
        },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: { id: data.id as string } }, { status: 200 })
  } catch (error) {
    console.error('[DELETE /api/leads/[id]]', error)
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
