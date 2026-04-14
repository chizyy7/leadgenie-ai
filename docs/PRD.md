# LeadGenie AI
## Product Requirements Document (PRD)

**Version:** 1.0.0
**Status:** Active — MVP Build Phase
**Author:** Chizy (Emmanuel Nnadi)
**Last Updated:** April 2026
**Target Launch:** July – August 2026
**Document Type:** Internal Product Specification

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision & Strategy](#3-product-vision--strategy)
4. [Target Users & Personas](#4-target-users--personas)
5. [User Journey & Flow](#5-user-journey--flow)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [AI Functionality Specification](#8-ai-functionality-specification)
9. [Data Models](#9-data-models)
10. [API Specification](#10-api-specification)
11. [UI/UX Requirements](#11-uiux-requirements)
12. [Security Requirements](#12-security-requirements)
13. [MVP Scope & Phase Roadmap](#13-mvp-scope--phase-roadmap)
14. [Success Metrics & KPIs](#14-success-metrics--kpis)
15. [Monetization Strategy](#15-monetization-strategy)
16. [Risk Assessment](#16-risk-assessment)
17. [Glossary](#17-glossary)

---

## 1. Executive Summary

LeadGenie AI is a web-based AI-powered sales assistant designed for freelancers, agencies, and early-stage SaaS founders who need to do cold outreach but lack the time, expertise, or resources for a full sales team.

The product solves a specific, painful problem: writing personalized cold emails is slow, hard, and produces low response rates when done poorly. LeadGenie AI uses the Claude API (Anthropic) to generate high-converting, personalized outreach emails in seconds — and pairs this with a lightweight CRM to track leads through the pipeline.

**Core differentiator:** Unlike generic AI writing tools (ChatGPT, Jasper), LeadGenie AI is purpose-built for B2B cold outreach — with opinionated prompts, structured output, and a built-in lead management system in one cohesive product.

**Business model:** Freemium — free tier with daily limits, paid Pro tier for unlimited usage.

**Target:** Acquire 10–50 real users within 30 days of launch. Validate product-market fit. Iterate.

---

## 2. Problem Statement

### 2.1 The Core Problem

Cold outreach is one of the most effective ways for freelancers and small businesses to acquire clients — but most people do it poorly or not at all because:

| Problem | Root Cause | Current Workaround |
|---|---|---|
| Don't know who to target | No sales background | Random LinkedIn browsing |
| Don't know what to write | No copywriting skill | Copy-paste generic templates |
| Takes too much time | Manual, repetitive work | Outsource or skip outreach |
| Low response rates | Generic, impersonal emails | Send more emails (shotgun approach) |
| No tracking system | No CRM | Spreadsheet or nothing |

### 2.2 Market Gap

Existing tools fall into two categories:
- **Too complex/expensive:** Salesforce, HubSpot, Apollo — enterprise-grade, priced out of reach for freelancers
- **Too generic:** ChatGPT, Jasper — not purpose-built for cold outreach, requires the user to craft their own prompts

LeadGenie AI fills the gap: a simple, affordable, purpose-built outreach tool for the solo operator and small team.

### 2.3 User Pain Quote (Hypothesis)
> "I know I should be doing more outreach. I just don't know what to say, and writing emails takes me forever. By the time I've written one, I've lost the motivation to send ten."

---

## 3. Product Vision & Strategy

### 3.1 Vision Statement
Build the simplest, fastest way for a freelancer or small business to go from "I need clients" to "personalized email ready to send" in under 60 seconds.

### 3.2 Mission
Reduce the time and effort of cold outreach while increasing response rates through intelligent, context-aware AI personalization.

### 3.3 Strategic Pillars

| Pillar | Description |
|---|---|
| **Speed** | Zero to first email in under 60 seconds |
| **Simplicity** | One screen to add a lead, one click to generate |
| **Intelligence** | AI that sounds human, not robotic |
| **Actionability** | Everything leads to a sent email or a next step |

### 3.4 Positioning
- **For** freelancers and small SaaS founders
- **Who** struggle with cold outreach
- **LeadGenie AI is** an AI-powered sales email generator and lead tracker
- **That** writes personalized cold emails in seconds
- **Unlike** generic AI tools or complex CRMs
- **We are** purpose-built for B2B cold outreach with structured AI output and a built-in pipeline

---

## 4. Target Users & Personas

### 4.1 Persona 1 — The Freelancer

**Name:** Sarah, 26 | Freelance Web Developer | Lagos, Nigeria

**Goals:**
- Land 2–3 new clients per month
- Spend less time on admin, more time on code
- Build a predictable client pipeline

**Frustrations:**
- Writing cold emails feels awkward and time-consuming
- Generic templates get ignored
- Loses track of who she has contacted

**How LeadGenie AI helps:**
- Types in a prospect's company name → gets a personalized email in 10 seconds
- Tracks all leads in one place with status updates
- Feels confident in her outreach without being a salesperson

---

### 4.2 Persona 2 — The Early-Stage Founder

**Name:** Marcus, 31 | Solo SaaS Founder | Pre-revenue B2B productivity tool

**Goals:**
- Get first 20 paying customers
- Validate product-market fit through direct sales
- Move fast without hiring a sales team

**Frustrations:**
- No sales background
- Cannot afford Apollo.io or a sales rep
- Spends hours researching prospects and writing emails

**How LeadGenie AI helps:**
- Generates targeted, relevant emails based on company context
- Manages his small lead list without a complex CRM
- Ships fast — from idea to sent email in minutes

---

### 4.3 Persona 3 — The Agency Owner

**Name:** David, 34 | Digital Marketing Agency | 5–10 person team

**Goals:**
- Scale client acquisition without scaling the team
- Standardize outreach quality across the team
- Track which leads are in progress

**Frustrations:**
- Team writes inconsistent outreach emails
- No central place to manage prospect pipeline
- Needs a tool the team can share

**How LeadGenie AI helps:**
- Consistent, high-quality emails across the team
- Centralized lead dashboard
- Saves hours per week per team member

---

## 5. User Journey & Flow

### 5.1 New User Journey

```
[Landing Page]
      │
      ▼
[Sign Up with Email + Password]
      │
      ▼
[Onboarding — Enter Your Service Description]
  "What do you offer? e.g. I build Shopify stores for e-commerce brands"
      │
      ▼
[Dashboard — Empty State with CTA: Add Your First Lead]
      │
      ▼
[Add Lead Form]
  Name | Email | Company | Website (optional) | Notes (optional)
      │
      ▼
[Email Generator View]
  AI generates: 3 subject lines + email body
      │
      ├── Copy Email → Send manually in Gmail
      ├── Regenerate → New AI output
      └── Save → Stored in lead record
      │
      ▼
[Lead Status Updated: Not Contacted → Contacted]
      │
      ▼
[Dashboard — Lead visible with status badge]
```

### 5.2 Returning User Journey

```
[Login]
      │
      ▼
[Dashboard — Sees all leads with statuses]
      │
      ├── Click lead → View/edit email → Update status
      ├── Add new lead → Generate email
      └── Filter by status → Focus on follow-ups
```

### 5.3 Error States to Handle
- Claude API timeout → Show retry button, do not crash page
- Supabase auth error → Clear error message with retry link
- Form validation errors → Inline, real-time field validation
- Empty dashboard → Friendly empty state with CTA, never a blank screen
- Rate limit hit → "Daily limit reached" message with upgrade CTA

---

## 6. Functional Requirements

### 6.1 Authentication

| ID | Requirement | Priority |
|---|---|---|
| AUTH-01 | User can sign up with email and password | Must Have |
| AUTH-02 | User can log in with email and password | Must Have |
| AUTH-03 | User can log out from any page | Must Have |
| AUTH-04 | Session persists across browser refresh | Must Have |
| AUTH-05 | Protected routes redirect unauthenticated users to /login | Must Have |
| AUTH-06 | User can update their service description in profile | Must Have |
| AUTH-07 | Password reset via email link | Should Have |
| AUTH-08 | Google OAuth login | Nice to Have |

---

### 6.2 Lead Management

| ID | Requirement | Priority |
|---|---|---|
| LEAD-01 | User can create a new lead with: name, email, company, website, notes | Must Have |
| LEAD-02 | All leads are scoped to the authenticated user only | Must Have |
| LEAD-03 | User can view all leads in a dashboard table/card view | Must Have |
| LEAD-04 | User can filter leads by status | Must Have |
| LEAD-05 | User can search leads by name or company | Should Have |
| LEAD-06 | User can update lead status: Not Contacted / Contacted / Replied | Must Have |
| LEAD-07 | User can delete a lead with confirmation dialog | Must Have |
| LEAD-08 | User can edit lead details after creation | Should Have |
| LEAD-09 | Lead shows date added and last updated timestamp | Should Have |
| LEAD-10 | Lead list is sortable by date, status, company name | Nice to Have |

---

### 6.3 AI Email Generation

| ID | Requirement | Priority |
|---|---|---|
| EMAIL-01 | User can trigger AI email generation for any lead | Must Have |
| EMAIL-02 | AI returns 3 subject line options | Must Have |
| EMAIL-03 | AI returns 1 email body under 120 words | Must Have |
| EMAIL-04 | User can select one of the 3 subject lines | Must Have |
| EMAIL-05 | Email body is editable in a textarea before copying | Must Have |
| EMAIL-06 | User can copy email to clipboard with one click | Must Have |
| EMAIL-07 | User can regenerate with same inputs | Must Have |
| EMAIL-08 | User can change tone (Professional / Casual / Bold) and regenerate | Should Have |
| EMAIL-09 | Word count is displayed with warning if over 120 words | Should Have |
| EMAIL-10 | Generated email is saved to the lead record | Must Have |
| EMAIL-11 | User can view email history per lead | Should Have |
| EMAIL-12 | Loading skeleton shown while Claude API responds | Must Have |

---

### 6.4 Dashboard

| ID | Requirement | Priority |
|---|---|---|
| DASH-01 | Dashboard shows total leads count | Must Have |
| DASH-02 | Dashboard shows count by status (Not Contacted / Contacted / Replied) | Must Have |
| DASH-03 | Dashboard shows all leads in a list/table | Must Have |
| DASH-04 | Empty state shown when no leads exist with CTA | Must Have |
| DASH-05 | Quick action button: "+ Add New Lead" always visible | Must Have |
| DASH-06 | Click lead row to open detail/email view | Must Have |
| DASH-07 | Daily AI generation count displayed (free tier) | Must Have |

---

## 7. Non-Functional Requirements

### 7.1 Performance
- Page load time under 2 seconds on average connection
- AI email generation response under 8 seconds (Claude API SLA)
- Dashboard renders up to 500 leads without pagination lag

### 7.2 Scalability
- Architecture supports horizontal scaling via Vercel serverless functions
- Supabase handles up to 50,000 database rows on free tier
- Claude API calls are rate-limited per user to prevent abuse

### 7.3 Reliability
- Target 99.5% uptime (Vercel + Supabase SLA)
- Graceful degradation if Claude API is unavailable — clear error, app does not crash
- All form submissions validated client-side AND server-side

### 7.4 Accessibility
- WCAG 2.1 AA compliance
- All interactive elements keyboard-navigable
- Colour contrast ratio minimum 4.5:1
- Screen reader compatible labels on all form inputs

### 7.5 Browser Support
- Chrome 110+, Firefox 110+, Safari 16+, Edge 110+
- Mobile: iOS Safari, Chrome Android

---

## 8. AI Functionality Specification

### 8.1 Model Configuration
- **Provider:** Anthropic
- **Model:** `claude-sonnet-4-20250514`
- **Max tokens:** 1000
- **Temperature:** 0.7

### 8.2 System Prompt

```
You are an expert B2B sales copywriter with 10+ years of experience writing cold outreach emails.
Your emails consistently achieve 30-40% reply rates because they are short, hyper-personalized,
human in tone, and focused on the recipient's world — not the sender's features.

Rules you NEVER break:
1. Never exceed 120 words in the email body
2. Never use: synergy, leverage, circle back, touch base, game-changer, revolutionary, disruptive
3. Never start with "I hope this email finds you well" or any variation
4. Never make it about the sender — focus on the recipient's world
5. Always end with a single, simple CTA — not multiple asks
6. Sound like a real person wrote this, not an AI

Output ONLY valid JSON in this exact format, no preamble, no explanation, no markdown:
{
  "subject_lines": ["Subject option 1", "Subject option 2", "Subject option 3"],
  "email_body": "Full email text here"
}
```

### 8.3 User Prompt Template

```
Write a personalized B2B cold outreach email using these details:

SENDER CONTEXT:
- My name: {user_name}
- What I offer: {user_service}

RECIPIENT CONTEXT:
- Contact name: {lead_name}
- Company: {lead_company}
- Company website: {lead_website or "not provided"}
- Additional notes: {lead_notes or "none"}

TONE: {selected_tone}

INSTRUCTIONS:
- Personalize the opening line to reference something specific about {lead_company}
- If website is provided, reference their product or service naturally
- Make the value proposition clear in one sentence
- End with a simple CTA: suggest a 15-minute call or a single yes/no question
- Keep the email body under 120 words
- Output JSON only
```

### 8.4 Tone Variations

| Tone | Additional Instruction |
|---|---|
| Professional | "Use a formal but warm business tone. No slang." |
| Casual | "Use a relaxed, friendly tone like messaging a colleague. Short sentences." |
| Bold | "Use a direct, confident tone. Lead with a bold claim or question. No fluff." |

### 8.5 AI Error Handling
- Invalid JSON returned → retry once automatically → if still invalid, show error with retry button
- API timeout (>10s) → show timeout message with retry button
- 429 rate limit → show "Daily limit reached" with upgrade CTA
- Never expose raw API errors to users — always show friendly messages

---

## 9. Data Models

### 9.1 Users Table
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  full_name     TEXT,
  service       TEXT,
  plan          TEXT DEFAULT 'free',
  daily_count   INTEGER DEFAULT 0,
  last_reset    DATE DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### 9.2 Leads Table
```sql
CREATE TABLE leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  company       TEXT NOT NULL,
  website       TEXT,
  notes         TEXT,
  status        TEXT DEFAULT 'not_contacted',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_status ON leads(status);
```

### 9.3 Emails Table
```sql
CREATE TABLE emails (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id         UUID REFERENCES leads(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  subject         TEXT,
  body            TEXT,
  subject_options JSONB,
  tone            TEXT DEFAULT 'professional',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_emails_lead_id ON emails(lead_id);
CREATE INDEX idx_emails_user_id ON emails(user_id);
```

### 9.4 Row Level Security (Supabase RLS)
```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own leads" ON leads
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own emails" ON emails
  FOR ALL USING (auth.uid() = user_id);
```

---

## 10. API Specification

### 10.1 Base URL
```
Production:  https://api.leadgenie.app/v1
Development: http://localhost:3001/v1
```

### 10.2 Authentication Header
```
Authorization: Bearer {supabase_jwt_token}
Content-Type: application/json
```

### 10.3 Auth Endpoints

**POST /auth/signup**
```json
Request:  { "email": "user@example.com", "password": "securepassword", "full_name": "John Doe" }
Response: { "success": true, "user": { "id": "uuid", "email": "..." }, "token": "jwt" }
```

**POST /auth/login**
```json
Request:  { "email": "user@example.com", "password": "securepassword" }
Response: { "success": true, "user": { "id": "uuid", "service": "..." }, "token": "jwt" }
```

**PATCH /auth/profile**
```json
Request:  { "full_name": "John Doe", "service": "I build custom web apps for SaaS startups" }
Response: { "success": true, "user": { "full_name": "...", "service": "..." } }
```

### 10.4 Leads Endpoints

**GET /leads** — `?status=not_contacted&search=stripe&sort=created_at&order=desc`

**POST /leads**
```json
Request:
{
  "name": "John Smith",
  "email": "john@stripe.com",
  "company": "Stripe",
  "website": "https://stripe.com",
  "notes": "Met at ProductHunt launch"
}
Response 201: { "success": true, "data": { ...lead_object } }
```

**GET /leads/:id** — Returns lead object + array of associated emails

**PATCH /leads/:id**
```json
Request:  { "status": "contacted" }
Response: { "success": true, "data": { ...updated_lead } }
```

**DELETE /leads/:id**
```json
Response: { "success": true, "message": "Lead deleted successfully" }
```

### 10.5 Email Generation Endpoints

**POST /emails/generate**
```json
Request:  { "lead_id": "uuid", "tone": "professional" }
Response:
{
  "success": true,
  "data": {
    "subject_lines": ["Option 1", "Option 2", "Option 3"],
    "email_body": "Hi John,\n\nI noticed Stripe recently..."
  }
}
```

**POST /emails/save**
```json
Request:
{
  "lead_id": "uuid",
  "subject": "Selected subject line",
  "body": "Final email body text",
  "subject_options": ["opt1", "opt2", "opt3"],
  "tone": "professional"
}
Response 201: { "success": true, "data": { ...email_object } }
```

**GET /emails/lead/:lead_id** — Returns array of all emails for a lead

### 10.6 Dashboard Endpoint

**GET /dashboard/stats**
```json
Response:
{
  "success": true,
  "data": {
    "total_leads": 24,
    "not_contacted": 10,
    "contacted": 11,
    "replied": 3,
    "emails_generated": 47,
    "daily_generations_used": 3,
    "daily_limit": 10
  }
}
```

### 10.7 Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have reached your daily limit of 10 email generations. Upgrade to Pro for unlimited access.",
    "status": 429
  }
}
```

---

## 11. UI/UX Requirements

### 11.1 Routes

| Route | Page | Auth Required |
|---|---|---|
| / | Landing Page | No |
| /login | Login | No |
| /signup | Sign Up | No |
| /onboarding | Service Setup (new users only) | Yes |
| /dashboard | Main Dashboard | Yes |
| /leads/new | Add Lead Form | Yes |
| /leads/:id | Lead Detail + Email Generator | Yes |
| /profile | User Profile Settings | Yes |

### 11.2 Design Tokens

| Token | Value |
|---|---|
| Primary Background | #0A0E1A |
| Surface / Card | #161E35 |
| Accent Gold | #C9A84C |
| Text Primary | #F5EDD6 |
| Text Secondary | #8B8B7A |
| Success | #22C55E |
| Warning | #F59E0B |
| Error | #EF4444 |
| Border | rgba(255,255,255,0.08) |
| Font | Inter (Google Fonts) |
| Border Radius | 8px cards, 6px buttons, 4px inputs |

### 11.3 Key UX Rules
- Zero to first generated email in under 60 seconds — measure this in user testing
- Never show a blank state — always show empty state illustration + CTA
- Celebrate micro-wins — checkmark animation on copy, success toast on save
- Progressive disclosure — hide advanced settings until user needs them
- Mobile-first responsive — freelancers work on phones

---

## 12. Security Requirements

### 12.1 Environment Variables (Never Expose to Client)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # Server-side only
ANTHROPIC_API_KEY=             # Server-side only — NEVER in client code
NEXT_PUBLIC_APP_URL=
NODE_ENV=
```

### 12.2 Security Rules
- Supabase RLS enforced at database level — not just API layer
- All inputs sanitized and validated before any database write
- Claude API key never exposed to browser — all AI calls go through server-side API route
- JWT tokens expire after 1 hour with 7-day refresh
- CORS restricted to production domain only
- Rate limiting: 10 AI generations/day for free tier users

---

## 13. MVP Scope & Phase Roadmap

### Phase 1 — MVP (July 2026)
Email/password auth | Lead input form | AI email generation | 3 subject line options | Copy/regenerate/edit | Lead status tracking | Dashboard with stats | Free tier limit | Responsive design

### Phase 2 — Growth (September–October 2026)
Gmail/SMTP send integration | Website scraping for personalization | Auto follow-up generation | Stripe payment for Pro tier | CSV lead import | Email history per lead

### Phase 3 — Scale (Q1 2027)
Team accounts | Chrome extension for LinkedIn | AI lead suggestions | Analytics dashboard | CRM integrations (HubSpot, Notion, Airtable)

---

## 14. Success Metrics & KPIs

| Metric | Target (Day 30) |
|---|---|
| Signed-up users | 50+ |
| Active users (generated 1+ email) | 20+ |
| Total emails generated | 200+ |
| Day-7 retention | > 30% |
| Time to first email (new user) | < 60 seconds |
| Free-to-paid conversion (Month 3) | > 5% |

---

## 15. Monetization Strategy

| Feature | Free | Pro ($12/month) |
|---|---|---|
| AI email generations | 10/day | Unlimited |
| Lead storage | 50 leads | Unlimited |
| Email history | Last 3 | Full history |
| Tone selection | Professional only | All 3 tones |
| CSV import | No | Yes (Phase 2) |
| Gmail integration | No | Yes (Phase 2) |
| Priority support | No | Yes |

---

## 16. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Claude API downtime | Low | High | Graceful error handling, retry logic |
| Low user adoption | Medium | High | Launch on ProductHunt, Twitter/X, indie communities |
| AI output quality issues | Medium | Medium | Refined system prompt, user can edit before sending |
| API key exposure | Low | Critical | Server-side only, env variables, never in client code |
| Supabase free tier limits | Low | Medium | Monitor usage, upgrade at scale |
| Spam/abuse misuse | Medium | Medium | Rate limiting, ToS enforcement |

---

## 17. Glossary

| Term | Definition |
|---|---|
| Lead | A potential client the user wants to contact |
| Cold Email | Unsolicited outreach email to someone who doesn't know the sender |
| CRM | Customer Relationship Management — system to track prospect interactions |
| Tone | Stylistic register of an email: Professional, Casual, or Bold |
| System Prompt | Instructions given to Claude API defining its role and output format |
| RLS | Row Level Security — Supabase feature restricting data access at database level |
| JWT | JSON Web Token — used to authenticate API requests |
| Generation | One Claude API call producing subject lines + email body for one lead |

---

*Document maintained by: Emmanuel Nnadi (Chizy)*
*Next review: June 2026 (pre-launch)*
