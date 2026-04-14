'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { onboardingSchema, type OnboardingInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'

interface OnboardingFormProps {
  initialService: string | null
}

export function OnboardingForm({ initialService }: OnboardingFormProps) {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      service: initialService ?? '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null)

    const response = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    const json = (await response.json()) as { success: boolean; error?: { message: string } }

    if (!response.ok || !json.success) {
      setSubmitError(json.error?.message ?? 'Unable to save your service description')
      toast.error(json.error?.message ?? 'Unable to save your service description', {
        style: { background: 'var(--error)', color: 'white' },
      })
      return
    }

    toast.success('Onboarding saved', {
      style: { background: 'var(--success)', color: 'white' },
    })
    router.push('/dashboard')
    router.refresh()
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div className="space-y-1.5">
        <label htmlFor="service" className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">
          What service do you offer?
        </label>
        <textarea
          id="service"
          rows={6}
          className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)] focus:border-[var(--border-active)]"
          placeholder="Example: We help SaaS startups increase demo bookings through outbound email campaigns and landing page optimization."
          {...form.register('service')}
        />
        {form.formState.errors.service ? <p className="text-xs text-[var(--error)]">{form.formState.errors.service.message}</p> : null}
      </div>

      {submitError ? <p className="rounded-[var(--radius-sm)] border border-[var(--error)]/40 bg-[var(--error)]/10 px-3 py-2 text-sm text-[var(--error)]">{submitError}</p> : null}

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="h-11 w-full rounded-[var(--radius-md)] bg-[var(--accent-gold)] text-[var(--bg-primary)] hover:bg-[var(--accent-gold-dark)]"
      >
        {form.formState.isSubmitting ? 'Saving...' : 'Continue to dashboard'}
      </Button>
    </form>
  )
}
