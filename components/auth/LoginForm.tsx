'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'

export function LoginForm() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null)

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    const json = (await response.json()) as { success: boolean; error?: { message: string } }

    if (!response.ok || !json.success) {
      setSubmitError(json.error?.message ?? 'Unable to sign in')
      toast.error(json.error?.message ?? 'Unable to sign in', {
        style: { background: 'var(--error)', color: 'white' },
      })
      return
    }

    toast.success('Signed in successfully', {
      style: { background: 'var(--success)', color: 'white' },
    })
    router.push('/onboarding')
    router.refresh()
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div className="space-y-1.5">
        <label htmlFor="email" className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)] focus:border-[var(--border-active)]"
          placeholder="founder@company.com"
          {...form.register('email')}
        />
        {form.formState.errors.email ? <p className="text-xs text-[var(--error)]">{form.formState.errors.email.message}</p> : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)] focus:border-[var(--border-active)]"
          placeholder="Enter your password"
          {...form.register('password')}
        />
        {form.formState.errors.password ? <p className="text-xs text-[var(--error)]">{form.formState.errors.password.message}</p> : null}
      </div>

      {submitError ? <p className="rounded-[var(--radius-sm)] border border-[var(--error)]/40 bg-[var(--error)]/10 px-3 py-2 text-sm text-[var(--error)]">{submitError}</p> : null}

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="h-11 w-full rounded-[var(--radius-md)] bg-[var(--accent-gold)] text-[var(--bg-primary)] hover:bg-[var(--accent-gold-dark)]"
      >
        {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>

      <p className="text-center text-sm text-[var(--text-secondary)]">
        New to LeadGenie AI?{' '}
        <Link href="/signup" className="text-[var(--accent-gold)] hover:text-[var(--accent-gold-dark)]">
          Create an account
        </Link>
      </p>
    </form>
  )
}
