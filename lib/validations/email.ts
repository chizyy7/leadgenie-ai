import { z } from 'zod'

export const emailToneSchema = z.enum(['professional', 'casual', 'bold'])

export const generateEmailSchema = z.object({
  lead_id: z.uuid('Lead id must be a valid UUID'),
  tone: emailToneSchema,
})

export const saveEmailSchema = z.object({
  lead_id: z.uuid('Lead id must be a valid UUID'),
  subject: z.string().trim().min(1, 'Subject is required').max(180),
  body: z.string().trim().min(1, 'Email body is required').max(4000),
  subject_options: z.array(z.string()).length(3, 'Exactly 3 subject options are required'),
  tone: emailToneSchema,
})
