'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/leads', label: 'Leads' },
  { href: '/profile', label: 'Profile' },
] as const

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    })

    if (!response.ok) {
      toast.error('Unable to logout right now', {
        style: { background: 'var(--error)', color: 'white' },
      })
      setIsLoggingOut(false)
      return
    }

    toast('You have been logged out', {
      style: { background: 'var(--accent-gold)', color: 'var(--bg-primary)' },
    })

    router.push('/login')
    router.refresh()
    setIsLoggingOut(false)
  }

  return (
    <>
      <aside className="hidden w-full border-b border-[var(--border)] bg-[var(--bg-surface)] md:block md:h-screen md:w-60 md:border-b-0 md:border-r">
        <div className="flex h-full flex-col p-4 md:p-5">
          <Link href="/dashboard" className="mb-5 inline-block">
            <p className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">LeadGenie AI</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Sales Assistant</p>
          </Link>

          <nav className="flex gap-2 overflow-x-auto md:flex-1 md:flex-col md:overflow-visible">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-[var(--radius-md)] border px-4 py-2.5 text-sm transition-colors md:w-full',
                    active
                      ? 'border-[var(--border-active)] bg-[var(--accent-gold-light)] text-[var(--accent-gold)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--border)] hover:text-[var(--text-primary)]'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface-2)] px-4 py-2.5 text-left text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] disabled:opacity-50"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-[var(--border)] bg-[var(--bg-surface)]/95 backdrop-blur md:hidden">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-14 items-center justify-center text-xs font-medium',
                active ? 'text-[var(--accent-gold)]' : 'text-[var(--text-secondary)]'
              )}
            >
              {item.label}
            </Link>
          )
        })}

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="h-14 text-xs font-medium text-[var(--text-secondary)] disabled:opacity-50"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </nav>
    </>
  )
}
