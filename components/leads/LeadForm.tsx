'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createLeadSchema, type CreateLeadInput } from '@/lib/validations/lead'

export function LeadForm() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      website: '',
      notes: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null)

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    const json = (await response.json()) as { success: boolean; error?: { message: string } }

    if (!response.ok || !json.success) {
      setSubmitError(json.error?.message ?? 'Unable to add lead')
      toast.error(json.error?.message ?? 'Unable to add lead', {
        style: { background: 'var(--error)', color: 'white' },
      })
      return
    }

    toast.success('Lead added successfully', {
      style: { background: 'var(--success)', color: 'white' },
    })
    router.push('/leads')
    router.refresh()
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="name" className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)] focus:border-[var(--border-active)]"
            placeholder="Jane Doe"
            {...form.register('name')}
          />
          {form.formState.errors.name ? <p className="text-xs text-[var(--error)]">{form.formState.errors.name.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)] focus:border-[var(--border-active)]"
            placeholder="jane@company.com"
            {...form.register('email')}
          />
          {form.formState.errors.email ? <p className="text-xs text-[var(--error)]">{form.formState.errors.email.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="company" className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">
            Company
          </label>
          <input
            id="company"
            type="text"
            className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)] focus:border-[var(--border-active)]"
            placeholder="Acme Inc."
            {...form.register('company')}
          />
          {form.formState.errors.company ? <p className="text-xs text-[var(--error)]">{form.formState.errors.company.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="website" className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">
            Website (optional)
          </label>
          <input
            id="website"
            type="url"
            className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)] focus:border-[var(--border-active)]"
            placeholder="https://example.com"
            {...form.register('website')}
          />
          {form.formState.errors.website ? <p className="text-xs text-[var(--error)]">{form.formState.errors.website.message}</p> : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={5}
          className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)] focus:border-[var(--border-active)]"
          placeholder="Context that helps personalize outreach"
          {...form.register('notes')}
        />
        {form.formState.errors.notes ? <p className="text-xs text-[var(--error)]">{form.formState.errors.notes.message}</p> : null}
      </div>

      {submitError ? <p className="rounded-[var(--radius-sm)] border border-[var(--error)]/40 bg-[var(--error)]/10 px-3 py-2 text-sm text-[var(--error)]">{submitError}</p> : null}

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="h-11 rounded-[var(--radius-md)] bg-[var(--accent-gold)] px-5 text-sm font-medium text-[var(--bg-primary)] transition hover:bg-[var(--accent-gold-dark)] disabled:opacity-50"
      >
        {form.formState.isSubmitting ? 'Saving lead...' : 'Save lead'}
      </button>
    </form>
  )
}
