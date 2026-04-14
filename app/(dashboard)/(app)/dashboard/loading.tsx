export default function DashboardLoading() {
  return (
    <section className="space-y-6 animate-pulse">
      <div className="h-16 rounded-[var(--radius-lg)] bg-[var(--bg-surface)]" />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="h-24 rounded-[var(--radius-lg)] bg-[var(--bg-surface)]" />
        <div className="h-24 rounded-[var(--radius-lg)] bg-[var(--bg-surface)]" />
        <div className="h-24 rounded-[var(--radius-lg)] bg-[var(--bg-surface)]" />
        <div className="h-24 rounded-[var(--radius-lg)] bg-[var(--bg-surface)]" />
      </div>

      <div className="space-y-3">
        <div className="h-14 rounded-[var(--radius-lg)] bg-[var(--bg-surface)]" />
        <div className="h-14 rounded-[var(--radius-lg)] bg-[var(--bg-surface)]" />
        <div className="h-14 rounded-[var(--radius-lg)] bg-[var(--bg-surface)]" />
      </div>
    </section>
  )
}
