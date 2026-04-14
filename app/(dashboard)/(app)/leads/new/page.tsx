import Link from 'next/link'
import { LeadForm } from '@/components/leads/LeadForm'

export default function NewLeadPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">Leads</p>
        <h1 className="font-[var(--font-sora)] text-3xl font-bold">Add Lead</h1>
        <p className="text-sm text-[var(--text-secondary)]">Capture prospect details and keep your pipeline organized.</p>
      </header>

      <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <LeadForm />
      </div>

      <Link href="/leads" className="text-sm text-[var(--accent-gold)] hover:text-[var(--accent-gold-dark)]">
        Back to leads
      </Link>
    </section>
  )
}
