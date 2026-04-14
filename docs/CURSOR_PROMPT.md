# LeadGenie AI — Cursor Prompt
## Master Build Prompt for AI-Assisted Development

**Version:** 1.0.0
**Author:** Chizy (Emmanuel Nnadi)
**Last Updated:** April 2026

---

## PROJECT CONTEXT

You are building **LeadGenie AI** — a full-stack AI-powered B2B sales assistant web application. This is a real product being launched in July 2026 by a student founder. Build it with production-quality code.

**Core product:** Users add leads (name, company, website), AI generates personalized cold outreach emails in seconds, and users manage their pipeline in a lightweight CRM dashboard.

**GitHub repo:** `chizyy7/leadgenie-ai`
**Live URL (when deployed):** `https://leadgenie.app`

---

## TECH STACK — USE EXACTLY THIS

```
Frontend:     Next.js 14 (App Router, NOT Pages Router)
Language:     TypeScript (strict mode — no 'any' types)
Styling:      Tailwind CSS v3 + CSS variables for design tokens
Components:   shadcn/ui (Radix UI based)
Icons:        lucide-react
Fonts:        Sora + DM Sans (Google Fonts via next/font)
Database:     Supabase (PostgreSQL)
Auth:         Supabase Auth (email/password)
AI:           Anthropic Claude API (claude-sonnet-4-20250514)
Validation:   Zod (all API inputs + forms)
Forms:        react-hook-form + zod resolver
Toasts:       sonner
HTTP Client:  Native fetch (no axios)
Hosting:      Vercel (frontend + API routes)
```

**NEVER use:**
- Redux, Zustand, or any external state library
- axios (use fetch)
- Pages Router (use App Router only)
- `any` TypeScript type
- class components (functional only)
- inline styles (use Tailwind classes)

---

## DESIGN SYSTEM — APPLY CONSISTENTLY

### Colors (CSS Variables in globals.css)
```css
:root {
  --bg-primary: #0A0E1A;
  --bg-surface: #161E35;
  --bg-surface-2: #1E2A45;
  --accent-gold: #C9A84C;
  --accent-gold-dark: #A88A3A;
  --accent-gold-light: rgba(201,168,76,0.1);
  --text-primary: #F5EDD6;
  --text-secondary: #8B8B7A;
  --text-placeholder: #4A4A5A;
  --border: rgba(255,255,255,0.08);
  --border-active: rgba(201,168,76,0.5);
  --success: #22C55E;
  --error: #EF4444;
  --warning: #F59E0B;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --shadow-sm: 0 1px 8px rgba(0,0,0,0.2);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.3);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.4);
  --shadow-gold: 0 4px 24px rgba(201,168,76,0.25);
}
```

### Typography
- **Display/Hero:** Sora 800
- **Headings:** Sora 700/600
- **Body:** DM Sans 400/500
- **Labels/Caps:** Sora 600, uppercase, 0.08em tracking
- **Code:** DM Mono 400

### Status Colors
- Not Contacted: `#6B7280` background `rgba(107,114,128,0.15)`
- Contacted: `#60A5FA` background `rgba(96,165,250,0.15)`
- Replied: `#34D399` background `rgba(52,211,153,0.15)`

---

## PROJECT STRUCTURE

```
leadgenie-ai/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          ← Sidebar + nav layout
│   │   ├── dashboard/page.tsx
│   │   ├── leads/
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── onboarding/page.tsx
│   │   └── profile/page.tsx
│   ├── api/
│   │   ├── auth/profile/route.ts
│   │   ├── leads/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── emails/
│   │   │   ├── generate/route.ts
│   │   │   ├── save/route.ts
│   │   │   └── lead/[lead_id]/route.ts
│   │   └── dashboard/stats/route.ts
│   ├── layout.tsx
│   ├── page.tsx                ← Landing page
│   └── globals.css
├── components/
│   ├── ui/                     ← shadcn/ui components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── leads/
│   │   ├── LeadTable.tsx
│   │   ├── LeadCard.tsx
│   │   ├── LeadForm.tsx
│   │   ├── LeadStatusBadge.tsx
│   │   └── EmptyLeadState.tsx
│   ├── email/
│   │   ├── EmailGenerator.tsx
│   │   ├── SubjectLinePills.tsx
│   │   ├── EmailBodyEditor.tsx
│   │   ├── ToneSelector.tsx
│   │   └── EmailSkeleton.tsx
│   ├── dashboard/
│   │   ├── StatsBar.tsx
│   │   └── LeadFilterBar.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       ├── Navbar.tsx
│       └── PageHeader.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── ai/
│   │   ├── claude.ts
│   │   ├── prompts.ts
│   │   └── parser.ts
│   ├── validations/
│   │   ├── lead.ts
│   │   └── email.ts
│   └── utils.ts
├── hooks/
│   ├── useLeads.ts
│   ├── useEmailGenerator.ts
│   └── useUser.ts
├── types/
│   ├── lead.ts
│   ├── email.ts
│   └── user.ts
└── middleware.ts
```

---

## TYPE DEFINITIONS

```typescript
// types/user.ts
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

// types/lead.ts
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

// types/email.ts
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

// types/api.ts
export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    status: number
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
```

---

## API ROUTE PATTERN

Every API route must follow this exact pattern:

```typescript
// app/api/leads/route.ts
import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { createLeadSchema } from '@/lib/validations/lead'
import type { ApiResponse, Lead } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Lead>>> {
  try {
    // 1. Auth
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required', status: 401 } },
        { status: 401 }
      )
    }

    // 2. Validate
    const body = await request.json()
    const parsed = createLeadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.message, status: 422 } },
        { status: 422 }
      )
    }

    // 3. Database
    const { data, error } = await supabase
      .from('leads')
      .insert({ ...parsed.data, user_id: user.id })
      .select()
      .single()
    if (error) throw error

    // 4. Return
    return NextResponse.json({ success: true, data }, { status: 201 })

  } catch (error) {
    console.error('[POST /api/leads]', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong', status: 500 } },
      { status: 500 }
    )
  }
}
```

---

## AI EMAIL GENERATION

```typescript
// lib/ai/claude.ts
import Anthropic from '@anthropic-ai/sdk'
export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// lib/ai/prompts.ts
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
  tone: 'professional' | 'casual' | 'bold'
}): string {
  const toneMap = {
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

// lib/ai/parser.ts
import { anthropic } from './claude'
import { buildUserPrompt, SYSTEM_PROMPT } from './prompts'
import type { GeneratedEmail } from '@/types'

export async function generateEmail(params: Parameters<typeof buildUserPrompt>[0]): Promise<GeneratedEmail> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(params) }],
  })

  const text = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('')

  const parsed = JSON.parse(text)

  if (!Array.isArray(parsed.subject_lines) || parsed.subject_lines.length !== 3 || typeof parsed.email_body !== 'string') {
    throw new Error('Invalid AI response structure')
  }

  return { subject_lines: parsed.subject_lines as [string, string, string], email_body: parsed.email_body }
}
```

---

## SUPABASE SETUP

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts
import { createServerClient as createSSRClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export function createServerClient() {
  const cookieStore = cookies()
  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )
}
```

---

## MIDDLEWARE (Auth Protection)

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/dashboard', '/leads', '/profile', '/onboarding']
const AUTH_ONLY = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n) => request.cookies.get(n)?.value, set: () => {}, remove: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (PROTECTED.some(r => pathname.startsWith(r)) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (AUTH_ONLY.some(r => pathname.startsWith(r)) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
```

---

## ENVIRONMENT VARIABLES

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**CRITICAL:** `ANTHROPIC_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` must NEVER have `NEXT_PUBLIC_` prefix. They are server-side only.

---

## DATABASE SCHEMA (Run in Supabase SQL Editor)

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE public.users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT UNIQUE NOT NULL,
  full_name     TEXT,
  service       TEXT,
  plan          TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  daily_count   INTEGER NOT NULL DEFAULT 0,
  last_reset    DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  company       TEXT NOT NULL,
  website       TEXT,
  notes         TEXT,
  status        TEXT NOT NULL DEFAULT 'not_contacted'
                CHECK (status IN ('not_contacted', 'contacted', 'replied')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.emails (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id         UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject         TEXT,
  body            TEXT,
  subject_options JSONB,
  tone            TEXT NOT NULL DEFAULT 'professional'
                  CHECK (tone IN ('professional', 'casual', 'bold')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_user_id ON public.leads(user_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_emails_lead_id ON public.emails(lead_id);
CREATE INDEX idx_emails_user_id ON public.emails(user_id);

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own" ON public.users FOR ALL USING (auth.uid() = id);
CREATE POLICY "leads_own" ON public.leads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "emails_own" ON public.emails FOR ALL USING (auth.uid() = user_id);

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## RATE LIMITING LOGIC

```typescript
// lib/rateLimit.ts
const LIMITS = { free: 10, pro: Infinity }

export async function checkRateLimit(supabase: any, userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const { data: user } = await supabase.from('users').select('daily_count, last_reset, plan').eq('id', userId).single()
  const today = new Date().toISOString().split('T')[0]
  const needsReset = user.last_reset !== today
  const count = needsReset ? 0 : user.daily_count
  const limit = LIMITS[user.plan as 'free' | 'pro']

  if (count >= limit) return { allowed: false, remaining: 0 }

  await supabase.from('users').update({ daily_count: count + 1, last_reset: today }).eq('id', userId)
  return { allowed: true, remaining: limit - (count + 1) }
}
```

---

## CODING STANDARDS

1. **Every component** must have explicit TypeScript props interface
2. **Every API route** must return typed `ApiResponse<T>`
3. **Every form** must use react-hook-form + zod
4. **Every Supabase call** must handle the error case
5. **No hardcoded strings** — use constants file for repeated values
6. **Loading states** — every async action must show loading feedback
7. **Error states** — every async action must handle and display errors
8. **Empty states** — every list must have a designed empty state
9. **Mobile first** — build mobile layout first, then expand
10. **Accessibility** — every input needs a label, every button needs aria if icon-only

---

## BUILD ORDER (Follow This Sequence)

```
Phase 1 — Foundation
1. Next.js project setup + TypeScript config
2. Tailwind + globals.css with design tokens
3. shadcn/ui installation + component setup
4. Supabase project + run SQL schema
5. Environment variables setup
6. Supabase client (browser + server)
7. Middleware (auth protection)

Phase 2 — Auth
8. Signup page + form + API
9. Login page + form
10. Onboarding page
11. Auth flow testing

Phase 3 — Core Features
12. Dashboard layout + sidebar
13. Stats bar component
14. Lead list (table + cards)
15. Add lead form + API
16. Lead detail page
17. Email generator + Claude API integration
18. Subject line pills + tone selector
19. Copy + save email flow
20. Lead status update

Phase 4 — Polish
21. Profile page
22. Empty states
23. Error handling + toasts
24. Loading skeletons
25. Mobile responsive pass
26. Rate limiting
27. Final QA pass

Phase 5 — Launch
28. Deploy to Vercel
29. Custom domain
30. Production testing
```

---

## IMPORTANT REMINDERS

- The Claude API key goes in `.env.local` as `ANTHROPIC_API_KEY` — server-side only
- Use `claude-sonnet-4-20250514` as the model — not claude-3 or any other version
- Always parse Claude's JSON response safely with try/catch
- Supabase RLS handles data isolation — don't add extra user checks beyond the initial auth verify
- Test the email generation with a real lead before deploying
- The free tier limit is 10 generations/day — enforce this in the generate API route

---

*Cursor Prompt maintained by: Emmanuel Nnadi (Chizy)*
*Version: 1.0.0 | Last updated: April 2026*
