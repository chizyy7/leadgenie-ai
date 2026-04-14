import Link from 'next/link'
import type { Lead, LeadStatus } from '@/types'
import { LeadStatusBadge } from '@/components/leads/LeadStatusBadge'

interface LeadTableProps {
  leads: Lead[]
  busyLeadId: string | null
  onStatusChange: (id: string, status: LeadStatus) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(isoDate))
}

export function LeadTable({ leads, busyLeadId, onStatusChange, onDelete }: LeadTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] md:block">
        <table className="w-full bg-[var(--bg-surface)]">
          <thead className="bg-[var(--bg-surface-2)] text-left text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date Added</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const isBusy = busyLeadId === lead.id
              return (
                <tr key={lead.id} className="border-t border-[var(--border)] text-sm text-[var(--text-primary)]">
                  <td className="px-4 py-3">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{lead.email}</p>
                  </td>
                  <td className="px-4 py-3">{lead.company}</td>
                  <td className="px-4 py-3">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{formatDate(lead.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="rounded-[var(--radius-sm)] border border-[var(--border-active)] bg-[var(--accent-gold-light)] px-2.5 py-1 text-xs text-[var(--accent-gold)]"
                      >
                        Open
                      </Link>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onStatusChange(lead.id, 'not_contacted')}
                        className="rounded-[var(--radius-sm)] border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50"
                      >
                        Not Contacted
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onStatusChange(lead.id, 'contacted')}
                        className="rounded-[var(--radius-sm)] border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50"
                      >
                        Contacted
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onStatusChange(lead.id, 'replied')}
                        className="rounded-[var(--radius-sm)] border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50"
                      >
                        Replied
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onDelete(lead.id)}
                        className="rounded-[var(--radius-sm)] border border-[var(--error)]/40 bg-[var(--error)]/10 px-2.5 py-1 text-xs text-[var(--error)] disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {leads.map((lead) => {
          const isBusy = busyLeadId === lead.id
          return (
            <article key={lead.id} className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-[var(--font-sora)] text-base font-semibold">{lead.name}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">{lead.company}</p>
                </div>
                <LeadStatusBadge status={lead.status} />
              </div>
              <p className="mt-3 text-xs text-[var(--text-secondary)]">Added {formatDate(lead.created_at)}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href={`/leads/${lead.id}`}
                  className="rounded-[var(--radius-sm)] border border-[var(--border-active)] bg-[var(--accent-gold-light)] px-2.5 py-2 text-center text-xs text-[var(--accent-gold)]"
                >
                  Open
                </Link>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => onStatusChange(lead.id, 'not_contacted')}
                  className="rounded-[var(--radius-sm)] border border-[var(--border)] px-2.5 py-2 text-xs text-[var(--text-secondary)] disabled:opacity-50"
                >
                  Not Contacted
                </button>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => onStatusChange(lead.id, 'contacted')}
                  className="rounded-[var(--radius-sm)] border border-[var(--border)] px-2.5 py-2 text-xs text-[var(--text-secondary)] disabled:opacity-50"
                >
                  Contacted
                </button>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => onStatusChange(lead.id, 'replied')}
                  className="rounded-[var(--radius-sm)] border border-[var(--border)] px-2.5 py-2 text-xs text-[var(--text-secondary)] disabled:opacity-50"
                >
                  Replied
                </button>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => onDelete(lead.id)}
                  className="rounded-[var(--radius-sm)] border border-[var(--error)]/40 bg-[var(--error)]/10 px-2.5 py-2 text-xs text-[var(--error)] disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}
