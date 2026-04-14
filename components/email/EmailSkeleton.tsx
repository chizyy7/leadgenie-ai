export function EmailSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="h-8 w-32 rounded-full bg-[var(--bg-surface-2)]" />
        <div className="h-8 w-28 rounded-full bg-[var(--bg-surface-2)]" />
        <div className="h-8 w-36 rounded-full bg-[var(--bg-surface-2)]" />
      </div>
      <div className="h-72 rounded-[var(--radius-md)] bg-[var(--bg-surface-2)]" />
    </div>
  )
}
