import { redirect } from 'next/navigation'
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import { OnboardingForm } from '@/components/auth/OnboardingForm'
import { createServerClient } from '@/lib/supabase/server'

export default async function OnboardingPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('users').select('service').eq('id', user.id).single()

  return (
    <AuthSplitLayout
      title="Tell LeadGenie about your service"
      subtitle="This helps us generate sharper outreach copy for your leads."
    >
      <OnboardingForm initialService={profile?.service ?? null} />
    </AuthSplitLayout>
  )
}
