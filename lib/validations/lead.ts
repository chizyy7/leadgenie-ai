import { z } from 'zod'

export const leadStatusSchema = z.enum(['not_contacted', 'contacted', 'replied'])

const optionalUrl = z
  .string()
  .trim()
  .url('Website must be a valid URL')
  .optional()
  .or(z.literal(''))

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  email: z.email('Enter a valid email address'),
  company: z.string().trim().min(2, 'Company must be at least 2 characters').max(160),
  website: optionalUrl,
  notes: z.string().trim().max(2000).optional().or(z.literal('')),
})

export const updateLeadSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    email: z.email().optional(),
    company: z.string().trim().min(2).max(160).optional(),
    website: optionalUrl,
    notes: z.string().trim().max(2000).optional().or(z.literal('')),
    status: leadStatusSchema.optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field is required',
  })

export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>
