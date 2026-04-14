'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Email, Lead, LeadStatus } from '@/types'
import { EmailGenerator } from '@/components/email/EmailGenerator'
import { LeadStatusBadge } from '@/components/leads/LeadStatusBadge'

interface LeadDetailClientProps {
  initialLead: Lead
  latestEmail: Email | null
  previousEmails: Email[]
}

function initialsFor(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function LeadDetailClient({ initialLead, latestEmail, previousEmails }: LeadDetailClientProps) {
  const router = useRouter()
  const [lead, setLead] = useState(initialLead)
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [draftName, setDraftName] = useState(initialLead.name)
  const [draftEmail, setDraftEmail] = useState(initialLead.email)
  const [draftCompany, setDraftCompany] = useState(initialLead.company)
  const [draftWebsite, setDraftWebsite] = useState(initialLead.website ?? '')
  const [draftNotes, setDraftNotes] = useState(initialLead.notes ?? '')

  const initials = useMemo(() => initialsFor(lead.name), [lead.name])

  const patchLead = async (patch: Partial<Lead>) => {
    setBusy(true)
    setError(null)

    const response = await fetch(`/api/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })

    const json = (await response.json()) as { success: boolean; data?: Lead; error?: { message: string } }

    if (!response.ok || !json.success || !json.data) {
      setError(json.error?.message ?? 'Unable to update lead')
      toast.error(json.error?.message ?? 'Unable to update lead', {
        style: { background: 'var(--error)', color: 'white' },
      })
      setBusy(false)
      return
    }

    setLead(json.data)
    toast.success('Lead updated', {
      style: { background: 'var(--success)', color: 'white' },
    })
    setBusy(false)
  }

  const updateStatus = async (status: LeadStatus) => {
    await patchLead({ status })
  }

  const saveEdits = async () => {
    await patchLead({
      name: draftName,
      email: draftEmail,
      company: draftCompany,
      website: draftWebsite,
      notes: draftNotes,
    })

    setEditing(false)
  }

  const deleteLead = async () => {
    setBusy(true)

    const response = await fetch(`/api/leads/${lead.id}`, {
      method: 'DELETE',
    })

    const json = (await response.json()) as { success: boolean; error?: { message: string } }
    if (!response.ok || !json.success) {
      setError(json.error?.message ?? 'Unable to delete lead')
      toast.error(json.error?.message ?? 'Unable to delete lead', {
        style: { background: 'var(--error)', color: 'white' },
      })
      setBusy(false)
      return
    }

    toast.success('Lead deleted', {
      style: { background: 'var(--success)', color: 'white' },
    })
    router.push('/leads')
    router.refresh()
  }

  return (
    <section className="grid gap-4 md:grid-cols-[35%_65%]">
      <div className="space-y-4">
        <article className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-[var(--border-active)] bg-[var(--accent-gold-light)] font-[var(--font-sora)] text-sm font-bold text-[var(--accent-gold)]">
                {initials}
              </div>
              <div>
                <h1 className="font-[var(--font-sora)] text-2xl font-bold">{lead.name}</h1>
                <p className="text-sm text-[var(--text-secondary)]">{lead.email}</p>
              </div>
            </div>
            <LeadStatusBadge status={lead.status} />
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">Company</dt>
              <dd className="mt-1 text-[var(--text-primary)]">{lead.company}</dd>
            </div>
            <div>
              <dt className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">Website</dt>
              <dd className="mt-1">
                {lead.website ? (
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-gold)] hover:text-[var(--accent-gold-dark)]">
                    {lead.website}
                  </a>
                ) : (
                  <span className="text-[var(--text-secondary)]">Not provided</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">Notes</dt>
              <dd className="mt-1 whitespace-pre-wrap text-[var(--text-primary)]">{lead.notes || 'No notes yet'}</dd>
            </div>
          </dl>

          <div className="mt-5 space-y-2">
            <p className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">Update Status</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => updateStatus('not_contacted')}
                disabled={busy}
                className="h-9 rounded-[var(--radius-sm)] border border-[var(--border)] text-xs text-[var(--text-secondary)] disabled:opacity-50"
              >
                Not Contacted
              </button>
              <button
                type="button"
                onClick={() => updateStatus('contacted')}
                disabled={busy}
                className="h-9 rounded-[var(--radius-sm)] border border-[var(--border)] text-xs text-[var(--text-secondary)] disabled:opacity-50"
              >
                Contacted
              </button>
              <button
                type="button"
                onClick={() => updateStatus('replied')}
                disabled={busy}
                className="h-9 rounded-[var(--radius-sm)] border border-[var(--border)] text-xs text-[var(--text-secondary)] disabled:opacity-50"
              >
                Replied
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="h-10 rounded-[var(--radius-md)] border border-[var(--border)] px-4 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="h-10 rounded-[var(--radius-md)] border border-[var(--error)]/40 bg-[var(--error)]/10 px-4 text-sm text-[var(--error)]"
            >
              Delete
            </button>
          </div>

          {error ? <p className="mt-3 text-sm text-[var(--error)]">{error}</p> : null}
        </article>
      </div>

      <EmailGenerator leadId={lead.id} initialEmail={latestEmail} previousEmails={previousEmails} />

      {editing ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] p-5">
            <h2 className="font-[var(--font-sora)] text-xl font-bold">Edit Lead</h2>
            <div className="mt-4 space-y-3">
              <input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 text-sm"
                placeholder="Name"
              />
              <input
                value={draftEmail}
                onChange={(e) => setDraftEmail(e.target.value)}
                className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 text-sm"
                placeholder="Email"
              />
              <input
                value={draftCompany}
                onChange={(e) => setDraftCompany(e.target.value)}
                className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 text-sm"
                placeholder="Company"
              />
              <input
                value={draftWebsite}
                onChange={(e) => setDraftWebsite(e.target.value)}
                className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 text-sm"
                placeholder="Website"
              />
              <textarea
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                rows={5}
                className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 py-2 text-sm"
                placeholder="Notes"
              />
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={saveEdits}
                className="h-10 rounded-[var(--radius-md)] bg-[var(--accent-gold)] px-4 text-sm font-medium text-[var(--bg-primary)]"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="h-10 rounded-[var(--radius-md)] border border-[var(--border)] px-4 text-sm text-[var(--text-secondary)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmDelete ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] p-5">
            <h2 className="font-[var(--font-sora)] text-xl font-bold">Delete Lead?</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">This action cannot be undone.</p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={deleteLead}
                className="h-10 rounded-[var(--radius-md)] border border-[var(--error)]/40 bg-[var(--error)]/10 px-4 text-sm text-[var(--error)]"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="h-10 rounded-[var(--radius-md)] border border-[var(--border)] px-4 text-sm text-[var(--text-secondary)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
