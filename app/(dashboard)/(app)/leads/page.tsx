import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import type { Lead } from '@/types'
import { LeadListClient } from '@/components/leads/LeadListClient'

export default async function LeadsPage() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })

  const leads = error ? [] : ((data ?? []) as Lead[])

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">Leads</p>
          <h1 className="mt-1 font-[var(--font-sora)] text-3xl font-bold">Manage leads</h1>
        </div>
        <Link
          href="/leads/new"
          className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-gold)] px-5 text-sm font-medium text-[var(--bg-primary)] transition hover:bg-[var(--accent-gold-dark)]"
        >
          Add Lead
        </Link>
      </header>

      <LeadListClient initialLeads={leads} />
    </section>
  )
}
