import type { GeneratedEmail } from '@/types'
import { geminiModel } from '@/lib/ai/claude'
import { buildUserPrompt, SYSTEM_PROMPT } from '@/lib/ai/prompts'

function parseJsonFromText(text: string): GeneratedEmail {
  let parsed: unknown

  try {
    parsed = JSON.parse(text)
  } catch {
    const firstBrace = text.indexOf('{')
    const lastBrace = text.lastIndexOf('}')
    if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
      throw new Error('Invalid AI response: JSON not found')
    }

    parsed = JSON.parse(text.slice(firstBrace, lastBrace + 1))
  }

  const shape = parsed as {
    subject_lines?: unknown
    email_body?: unknown
  }

  if (
    !Array.isArray(shape.subject_lines) ||
    shape.subject_lines.length !== 3 ||
    !shape.subject_lines.every((entry) => typeof entry === 'string') ||
    typeof shape.email_body !== 'string'
  ) {
    throw new Error('Invalid AI response structure')
  }

  return {
    subject_lines: [shape.subject_lines[0], shape.subject_lines[1], shape.subject_lines[2]],
    email_body: shape.email_body,
  }
}

export async function generateEmail(params: Parameters<typeof buildUserPrompt>[0]): Promise<GeneratedEmail> {
  const result = await geminiModel.generateContent(`${SYSTEM_PROMPT}\n\n${buildUserPrompt(params)}`)
  const text = result.response.text()

  return parseJsonFromText(text)
}
