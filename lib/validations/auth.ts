import { z } from 'zod'

export const signupSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be 128 characters or less'),
})

export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const onboardingSchema = z.object({
  service: z
    .string()
    .trim()
    .min(10, 'Service description must be at least 10 characters')
    .max(300, 'Service description must be 300 characters or less'),
})

export const updateProfileSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(120, 'Full name must be 120 characters or less')
      .optional(),
    service: z
      .string()
      .trim()
      .min(10, 'Service description must be at least 10 characters')
      .max(300, 'Service description must be 300 characters or less')
      .optional(),
  })
  .refine((value) => value.full_name !== undefined || value.service !== undefined, {
    message: 'At least one field is required',
  })

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type OnboardingInput = z.infer<typeof onboardingSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
