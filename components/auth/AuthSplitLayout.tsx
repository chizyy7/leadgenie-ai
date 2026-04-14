import type { ReactNode } from 'react'

interface AuthSplitLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  rightFooter?: ReactNode
}

export function AuthSplitLayout({ title, subtitle, children, rightFooter }: AuthSplitLayoutProps) {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <section className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 md:grid-cols-2">
        <aside className="hidden flex-col justify-between border-r border-[var(--border)] bg-[linear-gradient(135deg,var(--bg-primary),var(--bg-surface))] p-10 md:flex">
          <div>
            <p className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">LeadGenie AI</p>
            <h1 className="mt-5 font-[var(--font-sora)] text-4xl font-bold leading-tight">
              Convert cold leads into warm conversations.
            </h1>
            <p className="mt-4 max-w-md text-[var(--text-secondary)]">
              Generate high-performing outreach emails, organize your pipeline, and stay consistent every day.
            </p>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--accent-gold-light)] p-5 shadow-[var(--shadow-gold)]">
            <p className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">
              Built for B2B founders
            </p>
            <p className="mt-2 text-sm text-[var(--text-primary)]">
              Personalized outreach in seconds. CRM clarity in minutes.
            </p>
          </div>
        </aside>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-md)] sm:p-8">
            <p className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)] md:hidden">LeadGenie AI</p>
            <h2 className="mt-2 font-[var(--font-sora)] text-3xl font-bold">{title}</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{subtitle}</p>

            <div className="mt-6">{children}</div>
            {rightFooter ? <div className="mt-5">{rightFooter}</div> : null}
          </div>
        </section>
      </section>
    </main>
  )
}
