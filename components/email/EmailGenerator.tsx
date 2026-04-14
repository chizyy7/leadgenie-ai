'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { Email, EmailTone, GeneratedEmail } from '@/types'
import { EmailBodyEditor } from '@/components/email/EmailBodyEditor'
import { EmailSkeleton } from '@/components/email/EmailSkeleton'
import { SubjectLinePills } from '@/components/email/SubjectLinePills'
import { ToneSelector } from '@/components/email/ToneSelector'

interface EmailGeneratorProps {
  leadId: string
  initialEmail?: Email | null
  previousEmails?: Email[]
}

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(isoDate))
}

function extractSubjectLines(email: Email | null | undefined): [string, string, string] {
  const fallback: [string, string, string] = ['', '', '']
  if (!email || !email.subject_options || email.subject_options.length !== 3) {
    return fallback
  }

  return [email.subject_options[0] ?? '', email.subject_options[1] ?? '', email.subject_options[2] ?? '']
}

export function EmailGenerator({ leadId, initialEmail = null, previousEmails = [] }: EmailGeneratorProps) {
  const [tone, setTone] = useState<EmailTone>(initialEmail?.tone ?? 'professional')
  const [subjectLines, setSubjectLines] = useState<[string, string, string]>(extractSubjectLines(initialEmail))
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(0)
  const [body, setBody] = useState(initialEmail?.body ?? '')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null)
  const [history, setHistory] = useState<Email[]>(previousEmails)
  const [error, setError] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const selectedSubject = useMemo(() => subjectLines[selectedSubjectIndex] ?? '', [subjectLines, selectedSubjectIndex])

  const applyGenerated = (generated: GeneratedEmail) => {
    setSubjectLines(generated.subject_lines)
    setSelectedSubjectIndex(0)
    setBody(generated.email_body)
  }

  const generate = async () => {
    setError(null)
    setSaveMessage(null)
    setIsGenerating(true)

    const response = await fetch('/api/emails/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_id: leadId, tone }),
    })

    const json = (await response.json()) as { success: boolean; data?: GeneratedEmail; error?: { message: string } }

    if (!response.ok || !json.success || !json.data) {
      setError(json.error?.message ?? 'Failed to generate email')
      toast.error(json.error?.message ?? 'Failed to generate email', {
        style: { background: 'var(--error)', color: 'white' },
      })
      setIsGenerating(false)
      return
    }

    applyGenerated(json.data)
    toast.success('Email generated', {
      style: { background: 'var(--success)', color: 'white' },
    })
    setIsGenerating(false)
  }

  const save = async () => {
    setError(null)
    setSaveMessage(null)

    if (!selectedSubject || !body.trim()) {
      setError('Generate an email first, then choose a subject line before saving')
      toast('Generate email content before saving', {
        style: { background: 'var(--accent-gold)', color: 'var(--bg-primary)' },
      })
      return
    }

    setIsSaving(true)

    const response = await fetch('/api/emails/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_id: leadId,
        subject: selectedSubject,
        body,
        subject_options: subjectLines,
        tone,
      }),
    })

    const json = (await response.json()) as { success: boolean; data?: Email; error?: { message: string } }

    if (!response.ok || !json.success) {
      setError(json.error?.message ?? 'Failed to save email')
      toast.error(json.error?.message ?? 'Failed to save email', {
        style: { background: 'var(--error)', color: 'white' },
      })
      setIsSaving(false)
      return
    }

    if (json.data) {
      setHistory((current) => [json.data!, ...current].slice(0, 3))
    }

    setSaveMessage('Saved to lead')
    toast.success('Email saved to lead', {
      style: { background: 'var(--success)', color: 'white' },
    })
    setIsSaving(false)
  }

  const copy = async () => {
    if (!selectedSubject && !body.trim()) {
      setError('Nothing to copy yet')
      toast('Generate an email before copying', {
        style: { background: 'var(--accent-gold)', color: 'var(--bg-primary)' },
      })
      return
    }

    setIsCopying(true)

    const fullEmail = `Subject: ${selectedSubject}\n\n${body}`.trim()
    await navigator.clipboard.writeText(fullEmail)

    setCopied(true)
    toast('Email copied to clipboard', {
      style: { background: 'var(--accent-gold)', color: 'var(--bg-primary)' },
    })
    setIsCopying(false)

    window.setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <section className="space-y-5 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <header className="space-y-1">
        <p className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">Email Generator</p>
        <h2 className="font-[var(--font-sora)] text-2xl font-bold">Craft personalized outreach</h2>
      </header>

      <ToneSelector value={tone} onChange={setTone} disabled={isGenerating || isSaving} />

      <button
        type="button"
        onClick={generate}
        disabled={isGenerating}
        className="h-12 w-full rounded-[var(--radius-md)] bg-[var(--accent-gold)] text-sm font-semibold text-[var(--bg-primary)] transition hover:bg-[var(--accent-gold-dark)] disabled:opacity-60"
      >
        {isGenerating ? 'Generating...' : 'Generate Email'}
      </button>

      {isGenerating ? (
        <EmailSkeleton />
      ) : (
        <div className="space-y-4">
          <SubjectLinePills
            subjectLines={subjectLines}
            selectedIndex={selectedSubjectIndex}
            onSelect={setSelectedSubjectIndex}
            disabled={isSaving}
          />

          <EmailBodyEditor value={body} onChange={setBody} disabled={isSaving} />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copy}
              disabled={isCopying}
              className="h-10 rounded-[var(--radius-md)] bg-[var(--accent-gold)] px-4 text-sm font-medium text-[var(--bg-primary)] transition hover:bg-[var(--accent-gold-dark)] disabled:opacity-60"
            >
              {copied ? '✓ Copied!' : isCopying ? 'Copying...' : 'Copy Email'}
            </button>
            <button
              type="button"
              onClick={generate}
              disabled={isGenerating}
              className="h-10 rounded-[var(--radius-md)] border border-[var(--border)] bg-transparent px-4 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] disabled:opacity-60"
            >
              Regenerate
            </button>
            <button
              type="button"
              onClick={save}
              disabled={isSaving}
              className="h-10 rounded-[var(--radius-md)] border border-[var(--border)] bg-transparent px-4 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save to Lead'}
            </button>
          </div>
        </div>
      )}

      {error ? <p className="rounded-[var(--radius-sm)] border border-[var(--error)]/40 bg-[var(--error)]/10 px-3 py-2 text-sm text-[var(--error)]">{error}</p> : null}
      {saveMessage ? (
        <p className="rounded-[var(--radius-sm)] border border-[var(--success)]/40 bg-[var(--success)]/10 px-3 py-2 text-sm text-[var(--success)]">
          {saveMessage}
        </p>
      ) : null}

      <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface-2)] p-4">
        <button
          type="button"
          onClick={() => setHistoryOpen((open) => !open)}
          className="flex w-full items-center justify-between text-left"
        >
          <p className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">Previous Emails</p>
          <span className="text-xs text-[var(--text-secondary)]">{historyOpen ? 'Hide' : 'Show'}</span>
        </button>

        {historyOpen ? (
          history.length > 0 ? (
            <div className="mt-3 space-y-2">
              {history.map((email) => {
                const expanded = expandedHistoryId === email.id

                return (
                  <article key={email.id} className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-[var(--text-secondary)]">{formatDate(email.created_at)}</p>
                        <p className="mt-1 text-sm text-[var(--text-primary)]">{email.subject || 'Untitled subject'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedHistoryId(expanded ? null : email.id)}
                        className="h-8 rounded-[var(--radius-sm)] border border-[var(--border)] px-3 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      >
                        {expanded ? 'Hide' : 'View'}
                      </button>
                    </div>

                    {expanded ? <p className="mt-3 whitespace-pre-wrap text-sm text-[var(--text-primary)]">{email.body || ''}</p> : null}
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[var(--text-secondary)]">No saved emails yet.</p>
          )
        ) : null}
      </section>
    </section>
  )
}
