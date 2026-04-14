'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'

interface ProfileSettingsClientProps {
  initialFullName: string | null
  email: string
  initialService: string | null
  plan: 'free' | 'pro'
  dailyCount: number
  lastReset: string
}

function usageToday(dailyCount: number, lastReset: string) {
  const today = new Date().toISOString().slice(0, 10)
  return lastReset === today ? dailyCount : 0
}

export function ProfileSettingsClient({
  initialFullName,
  email,
  initialService,
  plan,
  dailyCount,
  lastReset,
}: ProfileSettingsClientProps) {
  const [fullName, setFullName] = useState(initialFullName ?? '')
  const [service, setService] = useState(initialService ?? '')
  const [savingPersonal, setSavingPersonal] = useState(false)
  const [savingService, setSavingService] = useState(false)

  const used = useMemo(() => usageToday(dailyCount, lastReset), [dailyCount, lastReset])
  const limit = plan === 'free' ? 10 : Number.POSITIVE_INFINITY
  const progress = Number.isFinite(limit) ? Math.min((used / limit) * 100, 100) : 0

  const savePersonal = async () => {
    setSavingPersonal(true)

    const response = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName }),
    })

    const json = (await response.json()) as { success: boolean; error?: { message: string } }

    if (!response.ok || !json.success) {
      toast.error(json.error?.message ?? 'Unable to save personal info', {
        style: { background: 'var(--error)', color: 'white' },
      })
      setSavingPersonal(false)
      return
    }

    toast.success('Personal info saved', {
      style: { background: 'var(--success)', color: 'white' },
    })
    setSavingPersonal(false)
  }

  const saveService = async () => {
    setSavingService(true)

    const response = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service }),
    })

    const json = (await response.json()) as { success: boolean; error?: { message: string } }

    if (!response.ok || !json.success) {
      toast.error(json.error?.message ?? 'Unable to save service', {
        style: { background: 'var(--error)', color: 'white' },
      })
      setSavingService(false)
      return
    }

    toast.success('Service updated', {
      style: { background: 'var(--success)', color: 'white' },
    })
    setSavingService(false)
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">Daily Usage</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {plan === 'free' ? `${used}/10 generations used today` : `${used} generations used today`}
            </p>
          </div>
          {plan === 'free' ? (
            <button
              type="button"
              onClick={() =>
                toast('Upgrade to Pro to unlock unlimited generations', {
                  style: { background: 'var(--accent-gold)', color: 'var(--bg-primary)' },
                })
              }
              className="h-9 rounded-[var(--radius-md)] border border-[var(--border-active)] bg-[var(--accent-gold-light)] px-3 text-xs font-medium text-[var(--accent-gold)]"
            >
              Upgrade CTA
            </button>
          ) : null}
        </div>

        {plan === 'free' ? (
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-surface-2)]">
            <div className="h-full bg-[var(--accent-gold)]" style={{ width: `${progress}%` }} />
          </div>
        ) : null}
      </div>

      <article className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <h2 className="font-[var(--font-sora)] text-xl font-bold">Personal Info</h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]" htmlFor="full-name">
              Name
            </label>
            <input
              id="full-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-1 h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 text-sm"
            />
          </div>
          <div>
            <label className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]" htmlFor="email-readonly">
              Email (read-only)
            </label>
            <input
              id="email-readonly"
              value={email}
              readOnly
              className="mt-1 h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-secondary)]"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={savePersonal}
          disabled={savingPersonal}
          className="mt-4 h-10 rounded-[var(--radius-md)] bg-[var(--accent-gold)] px-4 text-sm font-medium text-[var(--bg-primary)] disabled:opacity-60"
        >
          {savingPersonal ? 'Saving...' : 'Save Personal Info'}
        </button>
      </article>

      <article className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <h2 className="font-[var(--font-sora)] text-xl font-bold">Your Service</h2>
        <div className="mt-4">
          <textarea
            value={service}
            onChange={(event) => setService(event.target.value.slice(0, 300))}
            rows={6}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 py-2.5 text-sm"
            placeholder="Describe your offer"
          />
          <p className="mt-1 text-right text-xs text-[var(--text-secondary)]">{service.length}/300</p>
        </div>
        <button
          type="button"
          onClick={saveService}
          disabled={savingService}
          className="mt-4 h-10 rounded-[var(--radius-md)] bg-[var(--accent-gold)] px-4 text-sm font-medium text-[var(--bg-primary)] disabled:opacity-60"
        >
          {savingService ? 'Saving...' : 'Save Service'}
        </button>
      </article>
    </section>
  )
}
