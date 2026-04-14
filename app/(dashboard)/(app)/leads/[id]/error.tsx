'use client'

import Link from 'next/link'

interface LeadDetailErrorProps {
  error: Error
  reset: () => void
}

export default function LeadDetailError({ reset }: LeadDetailErrorProps) {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-sm)]">
      <p className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">Lead Detail Error</p>
      <h2 className="mt-2 font-[var(--font-sora)] text-2xl font-bold">Unable to load lead</h2>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">Try again or return to your leads list.</p>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={reset}
          className="h-10 rounded-[var(--radius-md)] bg-[var(--accent-gold)] px-4 text-sm font-medium text-[var(--bg-primary)]"
        >
          Retry
        </button>
        <Link
          href="/leads"
          className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--border)] px-4 text-sm text-[var(--text-secondary)]"
        >
          Back to Leads
        </Link>
      </div>
    </section>
  )
}
