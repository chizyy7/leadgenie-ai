import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { LeadDetailClient } from '@/components/leads/LeadDetailClient'
import type { Email, Lead } from '@/types'

interface LeadDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params
  const supabase = await createServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (leadError || !lead) {
    redirect('/leads')
  }

  const { data: emails } = await supabase
    .from('emails')
    .select('*')
    .eq('lead_id', id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const latestEmail = (emails?.[0] as Email | undefined) ?? null
  const previousEmails = (emails ?? []) as Email[]

  return <LeadDetailClient initialLead={lead as Lead} latestEmail={latestEmail} previousEmails={previousEmails} />
}
