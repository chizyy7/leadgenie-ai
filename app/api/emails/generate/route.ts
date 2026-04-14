import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateEmail } from '@/lib/ai/parser'
import { checkRateLimit } from '@/lib/rateLimit'
import { generateEmailSchema } from '@/lib/validations/email'
import type { ApiResponse, GeneratedEmail } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<GeneratedEmail>>> {
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

    const rate = await checkRateLimit(supabase, user.id)
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMITED',
            message: 'Daily generation limit reached (10/day on free tier). Upgrade to Pro for higher limits.',
            status: 429,
          },
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parsed = generateEmailSchema.safeParse(body)

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
      .select('id,name,company,website,notes,user_id')
      .eq('id', parsed.data.lead_id)
      .eq('user_id', user.id)
      .single()

    if (leadError || !lead) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Lead not found', status: 404 } },
        { status: 404 }
      )
    }

    const { data: profile } = await supabase.from('users').select('full_name,service').eq('id', user.id).single()

    const generated = await generateEmail({
      userName: profile?.full_name || user.email || 'LeadGenie User',
      userService: profile?.service || 'B2B sales and growth services',
      leadName: lead.name,
      leadCompany: lead.company,
      leadWebsite: lead.website,
      leadNotes: lead.notes,
      tone: parsed.data.tone,
    })

    return NextResponse.json({ success: true, data: generated }, { status: 200 })
  } catch (error) {
    console.error('[POST /api/emails/generate]', error)
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Something went wrong', status: 500 },
      },
      { status: 500 }
    )
  }
}
