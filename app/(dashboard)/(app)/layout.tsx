import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { createServerClient } from '@/lib/supabase/server'

interface DashboardAppLayoutProps {
  children: ReactNode
}

export default async function DashboardAppLayout({ children }: DashboardAppLayoutProps) {
  const supabase = await createServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] md:flex">
      <Sidebar />
      <div className="flex-1 p-4 pb-24 sm:p-6 sm:pb-24 md:p-8 md:pb-8">{children}</div>
    </div>
  )
}
