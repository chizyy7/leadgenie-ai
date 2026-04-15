'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.3 14.8 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 9.6-4.8 9.6-7.3 0-.5-.1-.9-.1-1.3H12z" />
      <path fill="#34A853" d="M3.5 7.4l3.2 2.3C7.5 8 9.6 6.4 12 6.4c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.3 14.8 2.4 12 2.4 8.3 2.4 5.1 4.5 3.5 7.4z" />
      <path fill="#FBBC05" d="M12 21.6c2.7 0 5-1 6.6-2.7l-3-2.4c-.8.6-1.9 1-3.6 1-3.9 0-5.3-2.6-5.5-3.9L3.2 16c1.6 3.2 4.9 5.6 8.8 5.6z" />
      <path fill="#4285F4" d="M21.6 12.3c0-.7-.1-1.2-.2-1.8H12v3.9h5.5c-.3 1.2-1 2.2-2 3l3 2.4c1.8-1.7 3.1-4.1 3.1-7.5z" />
    </svg>
  )
}

interface GoogleAuthButtonProps {
  nextPath?: string
}

export function GoogleAuthButton({ nextPath = '/onboarding' }: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false)

  const onGoogleSignIn = async () => {
    setLoading(true)
    const supabase = createClient()

    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })

    if (error) {
      toast.error(error.message, {
        style: { background: 'var(--error)', color: 'white' },
      })
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onGoogleSignIn}
      disabled={loading}
      className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-4 text-sm text-[var(--text-primary)] transition hover:border-[var(--border-active)] disabled:opacity-60"
    >
      <span className="inline-flex items-center gap-2">
        <GoogleIcon />
        {loading ? 'Redirecting...' : 'Continue with Google'}
      </span>
    </button>
  )
}
