import type { Email } from '@/types/email'

export type LeadStatus = 'not_contacted' | 'contacted' | 'replied'

export interface Lead {
  id: string
  user_id: string
  name: string
  email: string
  company: string
  website: string | null
  notes: string | null
  status: LeadStatus
  created_at: string
  updated_at: string
  emails?: Email[]
}

export interface CreateLeadInput {
  name: string
  email: string
  company: string
  website?: string
  notes?: string
}
