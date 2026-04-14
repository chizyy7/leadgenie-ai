import type { LeadStatus } from '@/types/lead'

const STATUS_STYLES: Record<LeadStatus, { label: string; className: string }> = {
  not_contacted: {
    label: 'Not Contacted',
    className: 'bg-[var(--status-not-contacted-bg)] text-[var(--status-not-contacted)]',
  },
  contacted: {
    label: 'Contacted',
    className: 'bg-[var(--status-contacted-bg)] text-[var(--status-contacted)]',
  },
  replied: {
    label: 'Replied',
    className: 'bg-[var(--status-replied-bg)] text-[var(--status-replied)]',
  },
}

interface LeadStatusBadgeProps {
  status: LeadStatus
}

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const style = STATUS_STYLES[status]
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${style.className}`}>
      {style.label}
    </span>
  )
}
