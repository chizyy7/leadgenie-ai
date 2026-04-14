import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import type { ApiResponse, Email } from '@/types'

interface RouteParams {
  params: Promise<{ lead_id: string }>
}

export async function GET(_: Request, { params }: RouteParams): Promise<NextResponse<ApiResponse<Email[]>>> {
  try {
    const { lead_id } = await params
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required', status: 401 } },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .eq('lead_id', lead_id)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data: (data ?? []) as Email[] }, { status: 200 })
  } catch (error) {
    console.error('[GET /api/emails/lead/[lead_id]]', error)
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Something went wrong', status: 500 },
      },
      { status: 500 }
    )
  }
}
