import type { EmailTone } from '@/types'

export const SYSTEM_PROMPT = `
You are an expert B2B sales copywriter. Write cold outreach emails that achieve 30-40% reply rates.

Rules you NEVER break:
1. Email body must be under 120 words
2. Never use: synergy, leverage, circle back, touch base, game-changer
3. Never start with "I hope this email finds you well"
4. Focus on the recipient's world, not the sender's features
5. End with exactly one simple CTA
6. Sound human, not like AI

Output ONLY valid JSON — no preamble, no markdown:
{
  "subject_lines": ["Option 1", "Option 2", "Option 3"],
  "email_body": "Full email text here"
}
`

export function buildUserPrompt(params: {
  userName: string
  userService: string
  leadName: string
  leadCompany: string
  leadWebsite?: string | null
  leadNotes?: string | null
  tone: EmailTone
}): string {
  const toneMap: Record<EmailTone, string> = {
    professional: 'Formal but warm. No slang.',
    casual: 'Relaxed and friendly. Short sentences.',
    bold: 'Direct and confident. Lead with a bold claim.',
  }

  return `Write a personalized B2B cold email:
SENDER: ${params.userName} | Offers: ${params.userService}
RECIPIENT: ${params.leadName} at ${params.leadCompany}
WEBSITE: ${params.leadWebsite || 'not provided'}
NOTES: ${params.leadNotes || 'none'}
TONE: ${params.tone} — ${toneMap[params.tone]}
Keep body under 120 words. Output JSON only.`
}
