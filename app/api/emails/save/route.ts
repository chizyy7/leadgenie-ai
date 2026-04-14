import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { saveEmailSchema } from '@/lib/validations/email'
import type { ApiResponse, Email } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Email>>> {
  try {
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

    const body = await request.json()
    const parsed = saveEmailSchema.safeParse(body)

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

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id')
      .eq('id', parsed.data.lead_id)
      .eq('user_id', user.id)
      .single()

    if (leadError || !lead) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Lead not found', status: 404 } },
        { status: 404 }
      )
    }

    const { data, error } = await supabase
      .from('emails')
      .insert({
        lead_id: parsed.data.lead_id,
        user_id: user.id,
        subject: parsed.data.subject,
        body: parsed.data.body,
        subject_options: parsed.data.subject_options,
        tone: parsed.data.tone,
      })
      .select('*')
      .single()

    if (error || !data) {
      throw error
    }

    return NextResponse.json({ success: true, data: data as Email }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/emails/save]', error)
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Something went wrong', status: 500 },
      },
      { status: 500 }
    )
  }
}
