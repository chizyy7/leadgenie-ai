# LeadGenie AI
## System Architecture Document

**Version:** 1.0.0
**Status:** Active — MVP Build Phase
**Author:** Chizy (Emmanuel Nnadi)
**Last Updated:** April 2026
**Target Launch:** July – August 2026
**Document Type:** Technical Architecture Specification

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Components](#3-system-components)
4. [Directory Structure](#4-directory-structure)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Database Architecture](#7-database-architecture)
8. [AI Service Layer](#8-ai-service-layer)
9. [Authentication Flow](#9-authentication-flow)
10. [Data Flow Diagrams](#10-data-flow-diagrams)
11. [API Layer Design](#11-api-layer-design)
12. [State Management](#12-state-management)
13. [Environment Configuration](#13-environment-configuration)
14. [Deployment Architecture](#14-deployment-architecture)
15. [Security Architecture](#15-security-architecture)
16. [Performance Strategy](#16-performance-strategy)
17. [Error Handling Strategy](#17-error-handling-strategy)
18. [Scalability Plan](#18-scalability-plan)

---

## 1. Architecture Overview

LeadGenie AI follows a modern **3-tier serverless architecture**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                             │
│            Next.js 14 App Router — Vercel CDN                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────────┐
│                 API LAYER (Server-Side)                         │
│         Next.js API Routes (Vercel Serverless Functions)        │
│                                                                 │
│   /api/auth    /api/leads    /api/emails    /api/dashboard      │
└────────┬───────────────────────────────┬────────────────────────┘
         │                              │
┌────────▼──────────┐        ┌──────────▼──────────────────────── ┐
│  SUPABASE          │        │  ANTHROPIC CLAUDE API              │
│  - Auth (JWT)      │        │  - claude-sonnet-4-20250514        │
│  - PostgreSQL DB   │        │  - Email generation                │
│  - Row Level Sec.  │        │  - JSON structured output          │
│  - Realtime        │        │                                    │
└────────────────────┘        └────────────────────────────────────┘
```

### 1.1 Architecture Principles

| Principle | Implementation |
|---|---|
| **Serverless-first** | No dedicated server — Vercel functions scale automatically |
| **Security by default** | RLS at database level, API key never exposed to client |
| **AI as a service** | Claude API called only server-side, never from browser |
| **Data isolation** | Every user sees only their own data, enforced at DB level |
| **Fail gracefully** | Every external call has error handling and user-friendly fallback |
| **Type safety** | TypeScript throughout — frontend and backend |

---

## 2. Technology Stack

### 2.1 Core Stack

| Layer | Technology | Version | Reason |
|---|---|---|---|
| Frontend Framework | Next.js (App Router) | 14.x | SSR/SSG, API routes, Vercel-native |
| Language | TypeScript | 5.x | Type safety, better DX, fewer runtime bugs |
| Styling | Tailwind CSS | 3.x | Utility-first, fast to build, responsive |
| UI Components | shadcn/ui | Latest | Accessible, unstyled, built on Radix UI |
| Database | Supabase (PostgreSQL) | Latest | Free tier, built-in auth, RLS, realtime |
| Authentication | Supabase Auth | Built-in | No extra service, JWT-based, Google OAuth ready |
| AI Provider | Anthropic Claude API | claude-sonnet-4-20250514 | Better tone than GPT, JSON output, fast |
| Hosting (Frontend) | Vercel | — | Native Next.js, CDN, free tier, auto-deploys |
| Hosting (Backend) | Vercel Serverless | — | Same platform, zero config |
| Version Control | GitHub | — | CI/CD via Vercel integration |

### 2.2 Supporting Libraries

| Library | Purpose |
|---|---|
| `@supabase/supabase-js` | Supabase client SDK |
| `@supabase/ssr` | Supabase SSR helpers for Next.js App Router |
| `@anthropic-ai/sdk` | Official Claude API SDK |
| `zod` | Schema validation for API inputs |
| `react-hook-form` | Form state management and validation |
| `lucide-react` | Icon library (consistent, lightweight) |
| `sonner` | Toast notifications |
| `clsx` | Conditional className utility |

---

## 3. System Components

```
LeadGenie AI
├── Frontend (Next.js)
│   ├── Pages & Routing (App Router)
│   ├── UI Components (shadcn/ui + custom)
│   ├── Client State (React hooks + Context)
│   └── Supabase Client (browser-side, anon key only)
│
├── API Layer (Next.js API Routes)
│   ├── Auth routes
│   ├── Leads routes
│   ├── Email generation routes
│   └── Dashboard routes
│
├── AI Service
│   ├── Prompt builder
│   ├── Claude API caller
│   └── Response parser + validator
│
├── Database (Supabase / PostgreSQL)
│   ├── users table
│   ├── leads table
│   ├── emails table
│   └── Row Level Security policies
│
└── Auth (Supabase Auth)
    ├── Email/password signup & login
    ├── JWT token management
    └── Session handling (SSR-compatible)
```

---

## 4. Directory Structure

```
leadgenie-ai/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Route group — no layout
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/              # Route group — dashboard layout
│   │   ├── layout.tsx            # Sidebar + nav layout
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── leads/
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── onboarding/
│   │   │   └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   ├── api/                      # Server-side API routes
│   │   ├── auth/
│   │   │   ├── profile/
│   │   │   │   └── route.ts
│   │   ├── leads/
│   │   │   ├── route.ts          # GET all, POST create
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET one, PATCH, DELETE
│   │   ├── emails/
│   │   │   ├── generate/
│   │   │   │   └── route.ts      # POST — Claude API call
│   │   │   ├── save/
│   │   │   │   └── route.ts      # POST — save email
│   │   │   └── lead/
│   │   │       └── [lead_id]/
│   │   │           └── route.ts  # GET emails for lead
│   │   └── dashboard/
│   │       └── stats/
│   │           └── route.ts      # GET dashboard stats
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css
│
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── leads/
│   │   ├── LeadCard.tsx
│   │   ├── LeadTable.tsx
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
│
├── lib/                          # Utility functions and config
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server Supabase client (SSR)
│   │   └── middleware.ts         # Auth middleware
│   ├── ai/
│   │   ├── claude.ts             # Anthropic SDK instance
│   │   ├── prompts.ts            # System + user prompt builders
│   │   └── parser.ts             # Parse + validate Claude response
│   ├── validations/
│   │   ├── lead.ts               # Zod schemas for lead inputs
│   │   └── email.ts              # Zod schemas for email inputs
│   └── utils.ts                  # General utility functions
│
├── hooks/                        # Custom React hooks
│   ├── useLeads.ts
│   ├── useEmailGenerator.ts
│   ├── useDashboardStats.ts
│   └── useUser.ts
│
├── types/                        # TypeScript type definitions
│   ├── lead.ts
│   ├── email.ts
│   ├── user.ts
│   └── api.ts
│
├── middleware.ts                  # Next.js middleware (auth protection)
├── .env.local                    # Environment variables (never commit)
├── .env.example                  # Template for env vars (commit this)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 5. Frontend Architecture

### 5.1 Routing Strategy (Next.js App Router)

```
/ (public)              → Landing page
/login (public)         → Login form
/signup (public)        → Signup form
/onboarding (protected) → First-time setup
/dashboard (protected)  → Main dashboard
/leads/new (protected)  → Add lead form
/leads/:id (protected)  → Lead detail + email generator
/profile (protected)    → User profile
```

Protected routes are enforced by Next.js middleware that checks for a valid Supabase session. Unauthenticated users are redirected to `/login`.

### 5.2 Component Architecture

**Pattern: Atomic Design**
- `components/ui/` — Base elements (Button, Input, Badge, Card) from shadcn/ui
- `components/*/` — Feature-specific composed components
- `app/**/page.tsx` — Page components that compose feature components

**Example — Email Generator Page:**
```
EmailGeneratorPage (app/leads/[id]/page.tsx)
├── PageHeader (lead name + company)
├── LeadInfoCard (name, email, company, website)
├── EmailGenerator
│   ├── ToneSelector (Professional | Casual | Bold)
│   ├── GenerateButton (triggers API call)
│   ├── EmailSkeleton (loading state)
│   ├── SubjectLinePills (3 clickable options)
│   ├── EmailBodyEditor (editable textarea + word count)
│   └── EmailActions (Copy | Regenerate | Save)
└── LeadStatusUpdate (prompt to update status after copying)
```

### 5.3 Data Fetching Strategy

| Data Type | Fetch Method | Reason |
|---|---|---|
| Dashboard stats | Server Component fetch | No client JS needed, fast initial load |
| Leads list | Server Component fetch | SEO-friendly, no loading flash |
| Lead detail | Server Component fetch | Pre-render on server |
| Email generation | Client-side fetch (useState) | Interactive, needs loading state |
| Status updates | Client-side fetch (optimistic) | Instant UI feedback |

---

## 6. Backend Architecture

### 6.1 API Routes (Next.js Route Handlers)

All API logic lives in `app/api/` as Next.js Route Handlers. Each route:
1. Validates the JWT from the Authorization header
2. Validates the request body using Zod
3. Performs the database operation via Supabase server client
4. Returns a standardized JSON response

### 6.2 Request Lifecycle

```
HTTP Request
      │
      ▼
Next.js Middleware
  └── Check Supabase session
  └── Redirect to /login if missing
      │
      ▼
Route Handler (app/api/.../route.ts)
  └── Extract JWT from header
  └── Validate with Supabase server client
  └── Validate request body with Zod
  └── Execute business logic
  └── Return JSON response
```

### 6.3 Standard Route Handler Pattern

```typescript
// app/api/leads/route.ts
import { createServerClient } from '@/lib/supabase/server'
import { leadSchema } from '@/lib/validations/lead'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required', status: 401 } },
        { status: 401 }
      )
    }

    // 2. Validate input
    const body = await request.json()
    const validation = leadSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: validation.error.message, status: 422 } },
        { status: 422 }
      )
    }

    // 3. Database operation
    const { data, error } = await supabase
      .from('leads')
      .insert({ ...validation.data, user_id: user.id })
      .select()
      .single()

    if (error) throw error

    // 4. Return success
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

## 7. Database Architecture

### 7.1 Entity Relationship Diagram

```
users (managed by Supabase Auth)
  │ id (UUID, PK)
  │ email
  │ full_name
  │ service
  │ plan
  │ daily_count
  │ last_reset
  │ created_at
  │ updated_at
  │
  ├──< leads (one user has many leads)
  │     │ id (UUID, PK)
  │     │ user_id (FK → users.id)
  │     │ name
  │     │ email
  │     │ company
  │     │ website
  │     │ notes
  │     │ status ('not_contacted' | 'contacted' | 'replied')
  │     │ created_at
  │     │ updated_at
  │     │
  │     └──< emails (one lead has many emails)
  │           id (UUID, PK)
  │           lead_id (FK → leads.id)
  │           user_id (FK → users.id)
  │           subject
  │           body
  │           subject_options (JSONB)
  │           tone
  │           created_at
```

### 7.2 Full SQL Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
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

-- Leads table
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

-- Emails table
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

-- Indexes
CREATE INDEX idx_leads_user_id   ON public.leads(user_id);
CREATE INDEX idx_leads_status    ON public.leads(status);
CREATE INDEX idx_leads_created   ON public.leads(created_at DESC);
CREATE INDEX idx_emails_lead_id  ON public.emails(lead_id);
CREATE INDEX idx_emails_user_id  ON public.emails(user_id);

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 7.3 Row Level Security Policies

```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- Users: can only read/update their own row
CREATE POLICY "users_own_row" ON public.users
  FOR ALL USING (auth.uid() = id);

-- Leads: users access only their own leads
CREATE POLICY "leads_own_data" ON public.leads
  FOR ALL USING (auth.uid() = user_id);

-- Emails: users access only their own emails
CREATE POLICY "emails_own_data" ON public.emails
  FOR ALL USING (auth.uid() = user_id);

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 8. AI Service Layer

### 8.1 Claude API Integration

```typescript
// lib/ai/claude.ts
import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Server-side only
})
```

### 8.2 Prompt Builder

```typescript
// lib/ai/prompts.ts

export const SYSTEM_PROMPT = `
You are an expert B2B sales copywriter with 10+ years of experience writing cold outreach emails.
Your emails achieve 30-40% reply rates because they are short, personalized, and human.

Rules you NEVER break:
1. Email body must be under 120 words
2. Never use: synergy, leverage, circle back, touch base, game-changer
3. Never start with "I hope this email finds you well"
4. Always focus on the recipient's world, not the sender's features
5. End with exactly one simple CTA — not multiple asks
6. Sound like a human wrote this, not an AI

Output ONLY valid JSON — no preamble, no explanation, no markdown fences:
{
  "subject_lines": ["Option 1", "Option 2", "Option 3"],
  "email_body": "Full email text here"
}
`

export function buildUserPrompt({
  userName,
  userService,
  leadName,
  leadCompany,
  leadWebsite,
  leadNotes,
  tone,
}: {
  userName: string
  userService: string
  leadName: string
  leadCompany: string
  leadWebsite?: string
  leadNotes?: string
  tone: 'professional' | 'casual' | 'bold'
}): string {
  const toneInstructions = {
    professional: 'Use a formal but warm business tone. No slang.',
    casual: 'Use a relaxed, friendly tone like messaging a colleague. Short sentences.',
    bold: 'Use a direct, confident tone. Lead with a bold claim or question. No fluff.',
  }

  return `
Write a personalized B2B cold outreach email:

SENDER:
- Name: ${userName}
- Offers: ${userService}

RECIPIENT:
- Name: ${leadName}
- Company: ${leadCompany}
- Website: ${leadWebsite || 'not provided'}
- Notes: ${leadNotes || 'none'}

TONE: ${tone} — ${toneInstructions[tone]}

INSTRUCTIONS:
- Personalize the opening to reference something specific about ${leadCompany}
- If website provided, reference their product or service naturally
- State value proposition in one sentence
- End with one simple CTA: suggest a 15-min call or ask a yes/no question
- Keep body under 120 words
- Output JSON only
  `.trim()
}
```

### 8.3 AI Service Function

```typescript
// lib/ai/parser.ts
import { anthropic } from './claude'
import { buildUserPrompt, SYSTEM_PROMPT } from './prompts'

export interface EmailGenerationResult {
  subject_lines: [string, string, string]
  email_body: string
}

export async function generateEmail(params: {
  userName: string
  userService: string
  leadName: string
  leadCompany: string
  leadWebsite?: string
  leadNotes?: string
  tone: 'professional' | 'casual' | 'bold'
}): Promise<EmailGenerationResult> {

  const userPrompt = buildUserPrompt(params)

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const rawText = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')

  // Parse and validate JSON output
  const parsed = JSON.parse(rawText)

  if (
    !Array.isArray(parsed.subject_lines) ||
    parsed.subject_lines.length !== 3 ||
    typeof parsed.email_body !== 'string'
  ) {
    throw new Error('Invalid AI response structure')
  }

  return {
    subject_lines: parsed.subject_lines as [string, string, string],
    email_body: parsed.email_body,
  }
}
```

---

## 9. Authentication Flow

### 9.1 Signup Flow

```
User fills signup form
      │
      ▼
Client calls supabase.auth.signUp({ email, password, options: { data: { full_name } } })
      │
      ▼
Supabase creates auth.users record + sends confirmation email
      │
      ▼
Supabase trigger fires: handle_new_user()
→ Creates public.users row with id, email, full_name
      │
      ▼
Client receives session + JWT
      │
      ▼
Redirect to /onboarding
→ User enters their service description
→ PATCH /api/auth/profile saves service to public.users
      │
      ▼
Redirect to /dashboard
```

### 9.2 Protected Route Middleware

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/leads', '/profile', '/onboarding']
const AUTH_ROUTES = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* cookie handlers */ } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r))
  const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r))

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}
```

### 9.3 Supabase Client Setup

```typescript
// lib/supabase/client.ts — Browser client (uses anon key only)
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts — Server client (can use service role key)
import { createServerClient as createSSRClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerClient() {
  const cookieStore = cookies()
  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* cookie handlers */ } }
  )
}
```

---

## 10. Data Flow Diagrams

### 10.1 Email Generation Flow

```
User clicks "Generate Email"
      │
      ▼
EmailGenerator component sets loading = true
Shows skeleton UI
      │
      ▼
POST /api/emails/generate
  Body: { lead_id, tone }
      │
      ▼
Route Handler:
  1. Validate JWT → get user
  2. Fetch lead from DB (verify ownership)
  3. Fetch user profile (get service description)
  4. Check daily_count vs plan limit
  5. Call generateEmail() → Claude API
  6. Parse + validate JSON response
  7. Increment user daily_count in DB
  8. Return { subject_lines, email_body }
      │
      ▼
Client receives response
  loading = false
  Display: 3 subject line pills + email body textarea
      │
      ▼
User selects subject, edits body (optional)
      │
      ▼
User clicks "Copy Email"
  → Copy to clipboard
  → Button shows "✓ Copied!" for 2 seconds
      │
      ▼
POST /api/emails/save
  Body: { lead_id, subject, body, subject_options, tone }
      │
      ▼
Prompt: "Did you send this? Update lead status →"
```

### 10.2 Lead Status Update Flow

```
User clicks status badge on lead card
      │
      ▼
Optimistic UI update (instant visual change)
      │
      ▼
PATCH /api/leads/:id
  Body: { status: 'contacted' }
      │
      ▼
Route Handler:
  1. Validate JWT
  2. Verify lead belongs to user
  3. Update status in DB
  4. Return updated lead
      │
      ▼
Success: UI confirms (already showing new status)
Error: Revert optimistic update + show toast error
```

---

## 11. API Layer Design

### 11.1 Input Validation Schemas (Zod)

```typescript
// lib/validations/lead.ts
import { z } from 'zod'

export const createLeadSchema = z.object({
  name:    z.string().min(1, 'Name is required').max(100),
  email:   z.string().email('Invalid email address'),
  company: z.string().min(1, 'Company is required').max(100),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  notes:   z.string().max(500).optional(),
})

export const updateLeadSchema = z.object({
  status: z.enum(['not_contacted', 'contacted', 'replied']).optional(),
  name:   z.string().min(1).max(100).optional(),
  notes:  z.string().max(500).optional(),
})

export const generateEmailSchema = z.object({
  lead_id: z.string().uuid('Invalid lead ID'),
  tone:    z.enum(['professional', 'casual', 'bold']).default('professional'),
})
```

### 11.2 Rate Limiting Logic

```typescript
// lib/rateLimit.ts
const FREE_DAILY_LIMIT = 10
const PRO_DAILY_LIMIT = Infinity

export async function checkAndIncrementDailyCount(
  supabase: SupabaseClient,
  userId: string,
  plan: 'free' | 'pro'
): Promise<{ allowed: boolean; remaining: number }> {

  const { data: user } = await supabase
    .from('users')
    .select('daily_count, last_reset, plan')
    .eq('id', userId)
    .single()

  const today = new Date().toISOString().split('T')[0]
  const needsReset = user.last_reset !== today

  const currentCount = needsReset ? 0 : user.daily_count
  const limit = plan === 'pro' ? PRO_DAILY_LIMIT : FREE_DAILY_LIMIT

  if (currentCount >= limit) {
    return { allowed: false, remaining: 0 }
  }

  await supabase
    .from('users')
    .update({
      daily_count: needsReset ? 1 : currentCount + 1,
      last_reset: today
    })
    .eq('id', userId)

  return { allowed: true, remaining: limit - (currentCount + 1) }
}
```

---

## 12. State Management

### 12.1 Strategy

LeadGenie AI uses **React built-in state only** — no Redux or Zustand. The app is simple enough that component-level state + custom hooks cover all needs.

| Data | State Location | Method |
|---|---|---|
| Auth session | Global | Supabase `onAuthStateChange` in layout |
| Leads list | Page-level | Server Component fetch or `useLeads` hook |
| Email generator | Component-level | `useState` in EmailGenerator |
| Dashboard stats | Page-level | Server Component fetch |
| UI state (modals, loading) | Component-level | `useState` |

### 12.2 Custom Hooks

```typescript
// hooks/useEmailGenerator.ts
export function useEmailGenerator(leadId: string) {
  const [result, setResult] = useState<EmailResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tone, setTone] = useState<Tone>('professional')

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/emails/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: leadId, tone }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error.message)
      setResult(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  return { result, loading, error, tone, setTone, generate }
}
```

---

## 13. Environment Configuration

### 13.1 Required Environment Variables

```bash
# .env.local (never commit — add to .gitignore)

# Supabase (public — safe for browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase (private — server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Anthropic Claude API (private — server-side only, NEVER expose to browser)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

```bash
# .env.example (commit this — no real values)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_APP_URL=
NODE_ENV=
```

### 13.2 Critical Security Rule
`ANTHROPIC_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` must **never** be prefixed with `NEXT_PUBLIC_`. This ensures they are only available in server-side code and never bundled into the browser JavaScript.

---

## 14. Deployment Architecture

### 14.1 Infrastructure

```
GitHub Repository (main branch)
      │
      │ Push to main triggers auto-deploy
      ▼
Vercel (Frontend + API Routes)
  ├── CDN: Static assets globally distributed
  ├── Serverless: API routes run on-demand
  └── Domain: leadgenie.app (custom domain)

Supabase (Database + Auth)
  ├── PostgreSQL database
  ├── Auth service
  └── Realtime (future use)
```

### 14.2 Deployment Steps

```bash
# 1. Connect GitHub repo to Vercel
# 2. Add all environment variables in Vercel dashboard
# 3. Set production domain
# 4. Every push to main auto-deploys

# Supabase setup:
# 1. Create project at supabase.com
# 2. Run SQL schema (from Section 7.2) in SQL editor
# 3. Copy URL and keys to Vercel env vars
```

### 14.3 CI/CD Pipeline

```
Developer pushes to feature branch
      │
      ▼
Vercel creates Preview Deployment
  → Unique URL for testing
      │
      ▼
PR reviewed + merged to main
      │
      ▼
Vercel auto-deploys to Production
  → Zero downtime deployment
  → Previous deployment kept as rollback
```

---

## 15. Security Architecture

### 15.1 Defense in Depth

```
Layer 1: HTTPS
  All traffic encrypted in transit

Layer 2: Supabase Auth (JWT)
  Every API request validates JWT
  Tokens expire — no permanent sessions

Layer 3: Next.js Middleware
  Protected routes blocked before page loads
  Redirect to /login if no valid session

Layer 4: API Route Validation
  Zod validates all request bodies
  User ownership verified before any DB operation

Layer 5: Supabase RLS
  Database enforces user isolation
  Even if API is bypassed, DB rejects unauthorized queries

Layer 6: Environment Variables
  API keys never in client code
  .env.local never committed to Git
```

### 15.2 OWASP Top 10 Mitigations

| Threat | Mitigation |
|---|---|
| Injection | Supabase parameterized queries, Zod input validation |
| Broken Auth | Supabase JWT, short expiry, RLS |
| Sensitive Data Exposure | API keys server-side only, HTTPS enforced |
| Broken Access Control | RLS at DB level, ownership checks in API |
| Security Misconfiguration | Environment variables, no debug in production |
| XSS | React escapes output by default, no dangerouslySetInnerHTML |
| CSRF | Supabase JWT-based auth (not cookies by default) |

---

## 16. Performance Strategy

### 16.1 Frontend Performance
- Server Components for data-heavy pages (dashboard, lead list) — zero client JS for data fetching
- Streaming with `Suspense` for slower data (email history)
- Image optimization via `next/image`
- Font optimization via `next/font` (Inter loaded once, cached)
- Code splitting automatic via Next.js App Router

### 16.2 Database Performance
- Indexes on `user_id`, `status`, `created_at` for all common queries
- Limit queries to user-scoped data (RLS does this automatically)
- Pagination on lead list if >100 records

### 16.3 AI Performance
- Show skeleton loading UI immediately on generate click (perceived performance)
- Set 10-second timeout on Claude API calls
- Cache nothing — every generation is unique by design

---

## 17. Error Handling Strategy

### 17.1 Error Categories

| Category | Example | User Experience |
|---|---|---|
| Validation error | Empty required field | Inline field error, red border |
| Auth error | JWT expired | Redirect to /login with message |
| Not found | Lead doesn't exist | 404 page with "Go to dashboard" link |
| Rate limit | 10 generations used | Banner: "Limit reached — upgrade to Pro" |
| AI error | Claude API down | "Email generation failed — try again" with retry button |
| Server error | DB write failed | Toast: "Something went wrong. Please try again." |

### 17.2 Error Boundary
Wrap dashboard and lead detail pages in React Error Boundary to catch unexpected client errors without crashing the full app.

### 17.3 Toast Notifications
Use `sonner` for all non-blocking feedback:
- Success: green — "Lead added", "Email copied", "Status updated"
- Error: red — "Failed to save lead", "Generation failed"
- Info: blue — "Generating your email..."

---

## 18. Scalability Plan

### 18.1 Current Capacity (Free Tiers)
- Supabase Free: 500MB DB, 50,000 rows, 2GB bandwidth
- Vercel Free: 100GB bandwidth, unlimited deployments
- Anthropic API: Pay-per-use ($3/million input tokens)

### 18.2 Scaling Triggers

| Trigger | Action | Cost |
|---|---|---|
| >500 users | Upgrade Supabase to Pro | $25/month |
| >1M API tokens/month | Claude API costs ~$3-5 | Pass to paid users |
| >100GB Vercel bandwidth | Upgrade Vercel Pro | $20/month |

### 18.3 Phase 2 Scaling Additions
- Connection pooling via Supabase PgBouncer (auto-enabled on Pro)
- Redis caching layer for dashboard stats (if DB reads become expensive)
- Background jobs for email scheduling (Phase 2 follow-up feature)

---

*Document maintained by: Emmanuel Nnadi (Chizy)*
*Next review: June 2026 (pre-launch)*
