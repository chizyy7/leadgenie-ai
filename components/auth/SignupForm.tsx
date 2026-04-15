'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { signupSchema, type SignupInput } from '@/lib/validations/auth'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { Button } from '@/components/ui/button'

export function SignupForm() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null)

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    const json = (await response.json()) as { success: boolean; error?: { message: string }; data?: { needsEmailConfirmation: boolean } }

    if (!response.ok || !json.success) {
      setSubmitError(json.error?.message ?? 'Unable to create account')
      toast.error(json.error?.message ?? 'Unable to create account', {
        style: { background: 'var(--error)', color: 'white' },
      })
      return
    }

    if (json.data?.needsEmailConfirmation) {
      toast('Check your inbox to confirm your email before signing in.', {
        style: { background: 'var(--accent-gold)', color: 'var(--bg-primary)' },
      })
      router.push('/login')
      return
    }

    toast.success('Account created successfully', {
      style: { background: 'var(--success)', color: 'white' },
    })
    router.push('/onboarding')
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <GoogleAuthButton nextPath="/onboarding" />
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-xs uppercase tracking-[0.08em] text-[var(--text-secondary)]">or</span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="full_name" className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">
          Full Name
        </label>
        <input
          id="full_name"
          type="text"
          autoComplete="name"
          className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)] focus:border-[var(--border-active)]"
          placeholder="Ada Lovelace"
          {...form.register('full_name')}
        />
        {form.formState.errors.full_name ? <p className="text-xs text-[var(--error)]">{form.formState.errors.full_name.message}</p> : null}
      </div>

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
          autoComplete="new-password"
          className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-placeholder)] focus:border-[var(--border-active)]"
          placeholder="At least 8 characters"
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
        {form.formState.isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-[var(--text-secondary)]">
        Already have an account?{' '}
        <Link href="/login" className="text-[var(--accent-gold)] hover:text-[var(--accent-gold-dark)]">
          Sign in
        </Link>
      </p>
    </form>
  )
}
