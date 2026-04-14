import type { SupabaseClient } from '@supabase/supabase-js'

type Plan = 'free' | 'pro'

interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number
}

const LIMITS: Record<Plan, number> = {
  free: 10,
  pro: Number.POSITIVE_INFINITY,
}

export async function checkRateLimit(supabase: SupabaseClient, userId: string): Promise<RateLimitResult> {
  const { data: profile, error } = await supabase
    .from('users')
    .select('plan,daily_count,last_reset')
    .eq('id', userId)
    .single()

  if (error || !profile) {
    throw new Error('Unable to load usage limits')
  }

  const today = new Date().toISOString().slice(0, 10)
  const needsReset = profile.last_reset !== today

  const plan = (profile.plan as Plan) ?? 'free'
  const limit = LIMITS[plan]
  const currentCount = needsReset ? 0 : profile.daily_count

  if (currentCount >= limit) {
    return { allowed: false, remaining: 0, limit }
  }

  const nextCount = currentCount + 1

  const { error: updateError } = await supabase
    .from('users')
    .update({ daily_count: nextCount, last_reset: today })
    .eq('id', userId)

  if (updateError) {
    throw new Error('Unable to update usage limits')
  }

  return {
    allowed: true,
    remaining: Number.isFinite(limit) ? Math.max(limit - nextCount, 0) : Number.POSITIVE_INFINITY,
    limit,
  }
}
