export type EmailTone = 'professional' | 'casual' | 'bold'

export interface Email {
  id: string
  lead_id: string
  user_id: string
  subject: string | null
  body: string | null
  subject_options: string[] | null
  tone: EmailTone
  created_at: string
}

export interface GeneratedEmail {
  subject_lines: [string, string, string]
  email_body: string
}
