import Link from 'next/link'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,168,76,0.14),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(201,168,76,0.1),transparent_38%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-20 sm:px-10">
        <p className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">LeadGenie AI</p>

        <h1 className="mt-5 max-w-4xl font-[var(--font-sora)] text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
          Convert cold leads into warm conversations
        </h1>

        <p className="mt-5 max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg">
          Generate personalized outreach emails in seconds, track your lead pipeline, and turn consistency into replies.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-gold)] px-6 text-sm font-semibold text-[var(--bg-primary)] transition hover:bg-[var(--accent-gold-dark)]"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] px-6 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            Sign In
          </Link>
        </div>
      </section>
    </main>
  )
}
