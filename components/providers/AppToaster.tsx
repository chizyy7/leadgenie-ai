'use client'

import { Toaster } from 'sonner'

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)]',
        style: {
          fontFamily: 'var(--font-dm-sans), sans-serif',
        },
      }}
    />
  )
}
