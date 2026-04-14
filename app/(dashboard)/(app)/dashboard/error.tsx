'use client'

import Link from 'next/link'

interface DashboardErrorProps {
  error: Error
  reset: () => void
}

export default function DashboardError({ reset }: DashboardErrorProps) {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-sm)]">
      <p className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">Dashboard Error</p>
      <h2 className="mt-2 font-[var(--font-sora)] text-2xl font-bold">Something went wrong</h2>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">Try reloading this section or return to dashboard.</p>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={reset}
          className="h-10 rounded-[var(--radius-md)] bg-[var(--accent-gold)] px-4 text-sm font-medium text-[var(--bg-primary)]"
        >
          Retry
        </button>
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center rounded-[var(--radius-md)] border border-[var(--border)] px-4 text-sm text-[var(--text-secondary)]"
        >
          Go to Dashboard
        </Link>
      </div>
    </section>
  )
}
