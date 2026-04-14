interface StatsBarProps {
  total: number
  notContacted: number
  contacted: number
  replied: number
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-[var(--shadow-sm)]">
      <p className="font-[var(--font-sora)] text-[11px] uppercase tracking-[0.08em] text-[var(--text-secondary)]">{label}</p>
      <p className="mt-2 font-[var(--font-sora)] text-2xl font-bold text-[var(--text-primary)]">{value}</p>
    </div>
  )
}

export function StatsBar({ total, notContacted, contacted, replied }: StatsBarProps) {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatCard label="Total Leads" value={total} />
      <StatCard label="Not Contacted" value={notContacted} />
      <StatCard label="Contacted" value={contacted} />
      <StatCard label="Replied" value={replied} />
    </section>
  )
}
