import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout'
import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <AuthSplitLayout title="Create your account" subtitle="Start building personalized outreach flows in minutes.">
      <SignupForm />
    </AuthSplitLayout>
  )
}
