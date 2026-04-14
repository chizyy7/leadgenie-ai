import Link from 'next/link'

export function EmptyLeadState() {
  return (
    <section className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center shadow-[var(--shadow-sm)]">
      <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full border border-[var(--border-active)] bg-[var(--accent-gold-light)]">
        <div className="h-10 w-10 rounded-[var(--radius-sm)] border border-[var(--accent-gold)] bg-transparent" />
      </div>
      <h3 className="font-[var(--font-sora)] text-xl font-bold text-[var(--text-primary)]">No leads yet</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">
        Add your first lead and start generating personalized outreach emails right away.
      </p>
      <Link
        href="/leads/new"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-gold)] px-5 text-sm font-medium text-[var(--bg-primary)] transition hover:bg-[var(--accent-gold-dark)]"
      >
        Add your first lead
      </Link>
    </section>
  )
}
