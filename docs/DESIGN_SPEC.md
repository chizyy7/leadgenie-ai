# LeadGenie AI — UI/UX Design Specification

**Version:** 1.0.0
**Author:** Chizy (Emmanuel Nnadi)
**Last Updated:** April 2026
**Document Type:** Design System & UX Specification

---

## 1. Design Philosophy

LeadGenie AI follows three core design principles:

**Clarity over complexity** — Every screen has one job. The user always knows what to do next.
**Speed as a feature** — The UI must feel instant. No unnecessary clicks, no loading screens without feedback.
**Trust through polish** — A student built this, but it must look like a funded startup. Every detail matters.

---

## 2. Brand Identity

### 2.1 Logo & Name
- **Wordmark:** LeadGenie AI
- **Symbol:** ⚡ (lightning bolt — speed, intelligence)
- **Tagline:** "Write cold emails in seconds"

### 2.2 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#0A0E1A` | Main dark background |
| `--bg-surface` | `#161E35` | Cards, panels, modals |
| `--bg-surface-2` | `#1E2A45` | Hover states, input backgrounds |
| `--accent-gold` | `#C9A84C` | Primary CTA, highlights, icons |
| `--accent-gold-dark` | `#A88A3A` | Hover state for gold elements |
| `--accent-gold-light` | `#FDF6E3` | Gold tint backgrounds |
| `--text-primary` | `#F5EDD6` | Main body text |
| `--text-secondary` | `#8B8B7A` | Muted labels, captions |
| `--text-placeholder` | `#4A4A5A` | Input placeholders |
| `--border` | `rgba(255,255,255,0.08)` | Subtle borders |
| `--border-active` | `rgba(201,168,76,0.5)` | Focused input borders |
| `--success` | `#22C55E` | Success states, replied badge |
| `--warning` | `#F59E0B` | Warning toasts |
| `--error` | `#EF4444` | Error states, validation |
| `--status-pending` | `#6B7280` | Not contacted badge |
| `--status-contacted` | `#60A5FA` | Contacted badge |
| `--status-replied` | `#34D399` | Replied badge |

### 2.3 Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display / Hero | Sora | 800 | 48–72px |
| Heading 1 | Sora | 700 | 32–40px |
| Heading 2 | Sora | 700 | 24–28px |
| Heading 3 | Sora | 600 | 18–20px |
| Body | DM Sans | 400 | 15–16px |
| Body Small | DM Sans | 400 | 13–14px |
| Label / Cap | Sora | 600 | 11–12px (uppercase, 0.08em tracking) |
| Code | DM Mono | 400 | 13px |

**Google Fonts import:**
```
Sora:wght@400;500;600;700;800
DM+Sans:wght@300;400;500
DM+Mono:wght@400
```

### 2.4 Spacing System (8px grid)

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Icon gaps, tight pairs |
| `--space-2` | 8px | Inner padding small |
| `--space-3` | 12px | Badge padding |
| `--space-4` | 16px | Card inner padding |
| `--space-5` | 20px | Form field gaps |
| `--space-6` | 24px | Section inner padding |
| `--space-8` | 32px | Card padding |
| `--space-10` | 40px | Between sections |
| `--space-12` | 48px | Page padding top |
| `--space-16` | 64px | Large section gaps |

### 2.5 Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Buttons, badges |
| `--radius-md` | 10px | Inputs, small cards |
| `--radius-lg` | 14px | Cards, modals |
| `--radius-xl` | 20px | Large panels |
| `--radius-full` | 9999px | Pills, avatars |

### 2.6 Shadows

```css
--shadow-sm:  0 1px 8px rgba(0,0,0,0.2);
--shadow-md:  0 4px 20px rgba(0,0,0,0.3);
--shadow-lg:  0 8px 40px rgba(0,0,0,0.4);
--shadow-gold: 0 4px 24px rgba(201,168,76,0.25);
```

---

## 3. Component Library

### 3.1 Buttons

**Primary Button (Gold)**
```
Background: --accent-gold
Text: #0A0E1A (dark)
Font: Sora 600, 14px
Padding: 12px 24px
Border Radius: --radius-sm
Hover: translateY(-1px) + --shadow-gold
Active: translateY(0)
Disabled: opacity 0.4, cursor not-allowed
```

**Secondary Button (Ghost)**
```
Background: transparent
Border: 1px solid --border
Text: --text-primary
Font: DM Sans 500, 14px
Padding: 12px 24px
Hover: background --bg-surface-2
```

**Danger Button**
```
Background: transparent
Border: 1px solid rgba(239,68,68,0.3)
Text: --error
Hover: background rgba(239,68,68,0.1)
```

**Icon Button**
```
Size: 36x36px
Border Radius: --radius-sm
Background: --bg-surface-2
Hover: --bg-surface + --shadow-sm
```

### 3.2 Inputs

**Text Input**
```
Background: --bg-surface
Border: 1.5px solid --border
Border Radius: --radius-md
Padding: 12px 16px
Font: DM Sans 400, 15px
Color: --text-primary
Placeholder: --text-placeholder
Focus: border --border-active + shadow 0 0 0 3px rgba(201,168,76,0.12)
Error: border --error + shadow 0 0 0 3px rgba(239,68,68,0.12)
```

**Textarea**
```
Same as text input
Min height: 140px
Resize: vertical only
Line height: 1.7
```

**Select / Dropdown**
```
Same as text input
Arrow icon: Chevron Down (lucide)
```

### 3.3 Cards

**Standard Card**
```
Background: --bg-surface
Border: 1px solid --border
Border Radius: --radius-lg
Padding: 24px
Shadow: --shadow-sm
Hover: --shadow-md + border rgba(201,168,76,0.15)
Transition: 0.2s ease
```

**Highlighted Card (Gold accent)**
```
Same as standard + left border: 3px solid --accent-gold
```

### 3.4 Badges / Status Pills

**Not Contacted**
```
Background: rgba(107,114,128,0.15)
Text: #9CA3AF
Border: 1px solid rgba(107,114,128,0.2)
```

**Contacted**
```
Background: rgba(96,165,250,0.15)
Text: #60A5FA
Border: 1px solid rgba(96,165,250,0.2)
```

**Replied**
```
Background: rgba(52,211,153,0.15)
Text: #34D399
Border: 1px solid rgba(52,211,153,0.2)
```

All badges: `font: Sora 600, 11px uppercase` | `padding: 4px 10px` | `border-radius: --radius-full`

### 3.5 Toast Notifications

```
Position: bottom-right, 16px from edges
Width: 320px max
Border Radius: --radius-md
Padding: 14px 16px
Shadow: --shadow-lg
Animation: slide in from right, fade out after 3s
```

Types: Success (green left border) | Error (red left border) | Info (gold left border)

### 3.6 Sidebar Navigation

```
Width: 240px (desktop) | 0px collapsed (mobile)
Background: --bg-surface
Border Right: 1px solid --border
Padding: 20px 12px
```

Nav items:
```
Padding: 10px 12px
Border Radius: --radius-sm
Font: DM Sans 500, 14px
Color: --text-secondary
Active: background rgba(201,168,76,0.1) + color --accent-gold + left border 2px solid --accent-gold
Hover: background --bg-surface-2 + color --text-primary
```

---

## 4. Page-by-Page UX Specification

### 4.1 Landing Page (/)

**Layout:** Single column, centered, max-width 1100px

**Sections in order:**
1. Sticky navbar (logo left, CTA button right)
2. Hero (badge + headline + subheadline + email form + mockup)
3. Problem section (dark background, 3 pain cards)
4. Solution section (4 feature cards with arrows)
5. How it works (3 numbered steps)
6. Social proof (stats + testimonials)
7. Final CTA (dark, gold button)
8. Footer

**Key interactions:**
- Email input: validates on blur, error shake animation on invalid submit
- CTA button: loading spinner while EmailJS sends, success state after
- Mockup: subtle float animation (translateY -6px, 3s ease infinite)
- Sections: fade-up on scroll via IntersectionObserver

---

### 4.2 Signup Page (/signup)

**Layout:** Split — left brand panel (40%) + right form (60%)

**Left panel:**
- Logo + tagline
- 3 benefit bullets with checkmarks
- Subtle background pattern

**Right form:**
- Heading: "Create your account"
- Fields: Full Name, Email, Password
- Password strength indicator (weak/medium/strong)
- Submit button: "Create Account"
- Link: "Already have an account? Log in"
- Google OAuth button (Phase 2)

**Validation:**
- Email: format check on blur
- Password: min 8 chars, show/hide toggle
- All: inline error below field, not alert boxes

---

### 4.3 Login Page (/login)

**Layout:** Same split as signup

**Right form:**
- Heading: "Welcome back"
- Fields: Email, Password
- "Forgot password?" link (right-aligned under password)
- Submit: "Sign In"
- Link: "Don't have an account? Sign up"

---

### 4.4 Onboarding (/onboarding)

**Layout:** Centered card, max-width 560px

**Content:**
- Progress indicator: Step 1 of 1
- Heading: "What do you offer?"
- Subtext: "We use this to personalize your AI emails. Be specific — the more detail, the better the emails."
- Textarea: large, placeholder "e.g. I build custom Shopify stores for e-commerce brands in the fashion industry"
- Character count: shown bottom right (max 300)
- Button: "Start Generating Emails →"
- Skip link: "I'll add this later" (muted, small)

---

### 4.5 Dashboard (/dashboard)

**Layout:** Sidebar (240px) + main content area

**Top of main content:**
- Page title: "Dashboard"
- Stats bar: 4 cards (Total Leads | Not Contacted | Contacted | Replied)
- Stats cards: number large + label small + subtle icon

**Lead list area:**
- Toolbar: Search input (left) + Filter by status dropdown + "Add Lead" button (right, gold)
- Table headers: Name | Company | Status | Date Added | Actions
- Table rows: hover highlight, click anywhere to open lead
- Status: inline badge, click to cycle status
- Actions column: Edit icon + Delete icon
- Empty state: centered illustration + "Add your first lead" + CTA button

**Sidebar nav items:**
- Dashboard (grid icon)
- Leads (users icon)
- Profile (user icon)
- Divider
- Docs link (external)
- Logout (bottom)

---

### 4.6 Add Lead Form (/leads/new)

**Layout:** Centered card, max-width 600px

**Fields:**
- Contact Name (required)
- Email Address (required)
- Company Name (required)
- Company Website (optional) — with https:// auto-prepend
- Notes (optional) — textarea, 3 rows

**Behavior:**
- Real-time validation on blur
- Submit disabled until required fields valid
- On success: redirect to /leads/:id (email generator)
- Cancel button: goes back to dashboard

---

### 4.7 Lead Detail + Email Generator (/leads/:id)

**Layout:** Two-panel — lead info (left 35%) + email generator (right 65%)

**Left panel — Lead Info:**
- Avatar (initials, colored)
- Name, Email, Company, Website (clickable link)
- Status badge (click to change)
- Notes (if any)
- Edit button
- Delete button (with confirmation modal)

**Right panel — Email Generator:**
- Section label: "AI Generated Email"
- Tone selector: 3 toggle buttons (Professional | Casual | Bold)
- Generate button (large, gold, full width)

**After generation:**
- 3 subject line pills (click to select, gold highlight on selected)
- Email body: editable textarea (pre-filled with AI output)
- Word count: live, turns red if over 120
- Action row: Copy Email (primary) | Regenerate (ghost) | Save (ghost)
- Copy confirmation: button text changes to "✓ Copied!" for 2s

**Loading state:**
- Skeleton lines for subject pills
- Skeleton block for email body
- "Generating your email..." text with animated dots

**Email history:**
- Below generator: collapsible "Previous emails" section
- Shows last 3 emails with date + subject

---

### 4.8 Profile Page (/profile)

**Layout:** Centered, max-width 640px, two cards

**Card 1 — Personal Info:**
- Full Name (editable)
- Email (read-only, from auth)
- Save button

**Card 2 — Your Service:**
- Textarea: "What do you offer?"
- Character count
- Save button
- Note: "This is used to personalize your AI emails"

**Card 3 — Plan & Usage:**
- Current plan badge (Free / Pro)
- Daily generations used: progress bar (3/10)
- Upgrade CTA (if free tier)

---

## 5. Responsive Design

### 5.1 Breakpoints

| Name | Width | Layout |
|---|---|---|
| Mobile | < 640px | Single column, no sidebar |
| Tablet | 640–1024px | Sidebar collapses to icon-only |
| Desktop | > 1024px | Full sidebar + content |

### 5.2 Mobile-specific rules
- Sidebar becomes bottom tab bar (4 icons)
- Tables become stacked cards
- Two-panel layouts become single column (generator below lead info)
- Touch targets minimum 44x44px
- No hover states — use active states instead

---

## 6. Animation & Motion

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Page load | Fade in + slide up (staggered) | 0.4s | ease-out |
| Card hover | translateY(-2px) + shadow | 0.2s | ease |
| Button hover | translateY(-1px) | 0.15s | ease |
| Toast enter | Slide in from right | 0.3s | spring |
| Toast exit | Fade out | 0.2s | ease |
| Skeleton | Shimmer (left to right) | 1.5s | infinite |
| Success copy | Scale 1 → 1.05 → 1 | 0.2s | ease |
| Modal open | Fade + scale 0.95 → 1 | 0.2s | ease-out |
| Status badge change | Crossfade | 0.15s | ease |

**Rule:** Never animate more than 2 properties at once. Keep motion subtle — this is a productivity tool, not a game.

---

## 7. Accessibility

- All interactive elements have visible focus rings (gold outline, 2px offset)
- Color is never the only indicator (always pair with icon or text)
- Form errors announced via `aria-live="polite"`
- All images have descriptive `alt` text
- Keyboard navigation: Tab through all interactive elements in logical order
- Contrast ratio: minimum 4.5:1 for all text
- Modal traps focus when open, returns focus on close

---

## 8. Empty & Error States

| State | Illustration | Message | CTA |
|---|---|---|---|
| No leads | Person at desk icon | "No leads yet. Add your first one." | "Add Lead" button |
| No emails for lead | Email icon | "No email generated yet." | "Generate Email" button |
| API error | Warning icon | "Something went wrong. Try again." | "Retry" button |
| Rate limit | Lock icon | "Daily limit reached. Upgrade for unlimited." | "Upgrade to Pro" |
| 404 | Lost icon | "This page doesn't exist." | "Go to Dashboard" |

---

## 9. Microcopy Guidelines

- **Buttons:** Action verbs. "Generate Email" not "Submit". "Add Lead" not "Create".
- **Errors:** Specific and helpful. "Enter a valid email" not "Invalid input".
- **Empty states:** Encouraging. "Add your first lead" not "No data found".
- **Loading:** Active. "Generating your email..." not "Loading..."
- **Success:** Celebratory but brief. "Email copied!" not "The email has been successfully copied to your clipboard."
- **Tone:** Friendly professional. Contractions are fine. Never corporate.

---

*Document maintained by: Emmanuel Nnadi (Chizy)*
*Design System version: 1.0.0*
*Next review: June 2026*
