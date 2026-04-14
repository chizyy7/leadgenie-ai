import { createServerClient } from '@/lib/supabase/server'
import { ProfileSettingsClient } from '@/components/profile/ProfileSettingsClient'

export default async function ProfilePage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from('users').select('*').eq('id', user?.id).single()

  return (
    <section className="space-y-5">
      <header>
        <p className="font-[var(--font-sora)] text-xs uppercase tracking-[0.08em] text-[var(--accent-gold)]">Profile</p>
        <h1 className="mt-1 font-[var(--font-sora)] text-3xl font-bold">Account profile</h1>
      </header>

      <ProfileSettingsClient
        initialFullName={profile?.full_name ?? null}
        email={profile?.email ?? user?.email ?? ''}
        initialService={profile?.service ?? null}
        plan={profile?.plan ?? 'free'}
        dailyCount={profile?.daily_count ?? 0}
        lastReset={profile?.last_reset ?? new Date().toISOString().slice(0, 10)}
      />
    </section>
  )
}
