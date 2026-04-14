export type Plan = 'free' | 'pro'

export interface User {
  id: string
  email: string
  full_name: string | null
  service: string | null
  plan: Plan
  daily_count: number
  last_reset: string
  created_at: string
  updated_at: string
}
