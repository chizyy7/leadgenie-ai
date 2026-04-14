'use client'

interface GlobalErrorProps {
  error: Error
  reset: () => void
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-[var(--bg-primary)] px-4 text-[var(--text-primary)]">
        <section className="w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center shadow-[var(--shadow-md)]">
          <p className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">Unexpected Error</p>
          <h1 className="mt-2 font-[var(--font-sora)] text-3xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">An unexpected error occurred. Please try again.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-gold)] px-5 text-sm font-medium text-[var(--bg-primary)] transition hover:bg-[var(--accent-gold-dark)]"
          >
            Try Again
          </button>
        </section>
      </body>
    </html>
  )
}
