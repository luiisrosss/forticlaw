# TECHNICAL.md — Architecture & Technical Decisions

> Forticlaw · Next.js 14 + Supabase + Clerk + Stripe + Resend

---

## 1. Stack Overview

```
Browser (Next.js App Router)
  │
  ├── Clerk (Auth middleware)
  ├── Fabric.js (Canvas editor, client-side)
  │
  ▼
Next.js API Routes (Edge + Node.js runtime)
  │
  ├── Supabase Postgres (main DB)
  ├── Supabase Storage (images, exports)
  │
  ├── OpenAI API (GPT-4o mini / GPT-4o)
  ├── Remove.bg API
  ├── fal.ai — Flux (background generation)
  ├── ScrapingBee (product scraping)
  │
  ├── Stripe (billing)
  ├── Resend (email)
  │
  └── Shopify OAuth (store connection)
```

---

## 2. Frontend Architecture

### Next.js 14 App Router

- **Route groups:**
  - `(auth)` — Clerk-managed sign-in/sign-up pages
  - `(dashboard)` — Protected app, requires active session
  - `(marketing)` — Public landing + waitlist

- **Layouts:**
  - Root layout: Clerk provider, theme
  - Dashboard layout: sidebar, top nav, project context
  - Project layout: project-scoped navigation tabs

- **Server vs Client components:**
  - Server components for: data fetching, static content, SEO pages
  - Client components for: canvas editor, interactive forms, AI status polling, real-time updates
  - Rule: default to Server, add `"use client"` only when needed

- **Data fetching pattern:**
  - Server components use Supabase server client directly
  - Client components use SWR or React Query for real-time updates
  - API routes for mutations and AI calls

### Canvas Editor (Fabric.js)

- Rendered as Client Component
- Templates defined as JSON → hydrated into Fabric.js objects at runtime
- Brand Kit values injected on canvas init
- Auto-saves state to `localStorage` every 2s (draft recovery)
- Export: serializes canvas to JSON → sent to server for Puppeteer render

### State Management

- No global state library (Redux, Zustand) in MVP
- URL state for filters and pagination (nuqs)
- Server state: SWR for caching and revalidation
- Local state: React useState/useReducer per component

---

## 3. Backend Architecture

### API Routes Structure

All AI-heavy endpoints use **Node.js runtime** (not Edge) because of:
- Puppeteer (needs full Node)
- Long-running AI calls (streaming)
- File processing

**Key endpoints:**

```
POST /api/ai/extract-product
  Body: { url: string }
  → Scrapes URL via ScrapingBee
  → GPT-4o mini extracts structured product JSON
  → Returns: ProductData

POST /api/ai/generate-draft
  Body: { productId, projectId }
  → Builds context block (brand kit + memory + instructions)
  → GPT-4o mini generates copy (5 angles, parallel)
  → Remove.bg removes product image background
  → Selects best template based on product/goal
  → Assembles draft creative config (no render yet)
  → Returns: DraftCreative

POST /api/ai/generate-batch
  Body: { draftId, variations: number }
  → Takes approved draft as base
  → Generates N copy variations (parallel GPT calls)
  → Assigns templates to each variation
  → Queues render jobs
  → Returns: { batchId, status: 'processing' }

GET /api/ai/batch-status/:batchId
  → Returns batch progress and completed creatives
  → Frontend polls every 2s (or use Supabase realtime)

POST /api/export/render
  Body: { canvasJSON, formats: string[] }
  → Puppeteer renders canvas for each format
  → Uploads to Supabase Storage
  → Returns: { urls: { '1x1': string, '4x5': string, ... } }

POST /api/images/remove-bg
  Body: { imageUrl: string }
  → Calls Remove.bg API
  → Uploads result to Supabase Storage
  → Returns: { url: string }

POST /api/images/generate-bg
  Body: { productCategory, style, colors }
  → Generates Flux prompt from category + brand colors
  → Calls fal.ai Flux API
  → Uploads to Supabase Storage
  → Returns: { url: string }

POST /api/shopify/connect
  → Initiates Shopify OAuth flow
  → Stores access token in Supabase (encrypted)

GET /api/shopify/products
  → Fetches products from connected Shopify store
  → Returns product list for dropdown

POST /api/ai/analyze-memory
  Body: { projectId, imageUrls: string[], type: string }
  → GPT-4o Vision analyzes each reference image
  → Stores structured description in DB
  → Updates project memory context
```

### Background Jobs

MVP uses **simple async processing** via Supabase Edge Functions or Next.js background routes. No message queue needed until Phase 2.

For batch generation specifically:
1. API route starts job, returns `batchId` immediately
2. Processes renders asynchronously
3. Updates `batches` table with progress
4. Frontend polls `/api/ai/batch-status/:batchId` every 2s
5. Alternatively: Supabase Realtime subscription on `batches` table

---

## 4. Database (Supabase / Postgres)

See [DATABASE.md](./DATABASE.md) for full schema.

### Key decisions:
- All AI-generated content stored as JSONB (flexible schema for evolving AI outputs)
- Images stored in Supabase Storage, URLs in DB
- Clerk `userId` stored in `users` table for cross-referencing
- Row Level Security (RLS) enabled on all tables
- Each user can only see their own projects/products/creatives

### Supabase Storage buckets:
- `product-images` — extracted and user-uploaded product images
- `product-images-nobg` — background-removed versions
- `generated-backgrounds` — AI-generated backgrounds
- `creative-exports` — final exported creatives (per format)
- `memory-uploads` — user-uploaded reference images
- `logos` — project logos

---

## 5. Auth (Clerk)

### Setup:
- Clerk middleware protects all `/dashboard/*` routes
- Webhook `clerk/user.created` → creates row in `users` table + sends welcome email via Resend
- Clerk `userId` is the foreign key linking all user data

### Auth flow:
```
/sign-up → Clerk hosted page → webhook fires → user row created → redirect to /onboarding
/sign-in → Clerk hosted page → redirect to /dashboard
```

### Session in API routes:
```typescript
import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })
  // ...
}
```

---

## 6. Payments (Stripe)

### Products & prices:
- `prod_free` — Free plan (no Stripe product needed, default on signup)
- `prod_pro` — Pro $29/month (Stripe product + recurring price)
- `prod_scale` — Scale $79/month (Stripe product + recurring price)
- `prod_credit_pack` — Credit pack $9 one-time (50 credits)

### Billing flow:
```
User clicks "Upgrade to Pro"
  → Create Stripe Checkout Session (hosted page)
  → User completes payment
  → Stripe webhook: checkout.session.completed
  → Update user plan in DB
  → Send upgrade confirmation email (Resend)
  → Redirect to dashboard with success toast
```

### Webhook events handled:
- `checkout.session.completed` — activate plan
- `customer.subscription.updated` — plan changes
- `customer.subscription.deleted` — downgrade to free
- `invoice.payment_failed` — send payment failure email

### Credits:
- Stored in `users.credits_remaining` column
- Decremented on each creative generation
- Reset to plan allowance on each billing cycle (`invoice.payment_succeeded`)
- Extra credit packs: one-time payment → add credits to `users.credits_remaining`

---

## 7. Email (Resend)

### Setup:
- Domain: `@forticlaw.com` (verify in Resend dashboard)
- From address: `Forticlaw <hello@forticlaw.com>`
- React Email templates for all transactional emails

### Email templates (React Email):
```
emails/
├── welcome.tsx              # New signup
├── first-project.tsx        # First project created
├── first-creative.tsx       # First creative generated
├── credits-low.tsx          # 20% credits remaining
├── credits-exhausted.tsx    # Zero credits
├── upgrade-confirmation.tsx # Plan upgraded
├── payment-failed.tsx       # Stripe payment failure
├── subscription-cancelled.tsx
├── waitlist-welcome.tsx     # Waitlist signup
└── waitlist-launch.tsx      # Launch announcement to waitlist
```

### Sending pattern:
```typescript
import { Resend } from 'resend'
import { WelcomeEmail } from '@/emails/welcome'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'Forticlaw <hello@forticlaw.com>',
  to: user.email,
  subject: 'Welcome to Forticlaw 🎨',
  react: WelcomeEmail({ userName: user.name }),
})
```

---

## 8. Scraping (ScrapingBee)

### Why ScrapingBee over Playwright:
- No infrastructure to manage
- Handles anti-bot (Cloudflare, AliExpress JS rendering)
- JavaScript rendering included
- $0.001 per API credit (very cheap for MVP)

### Scraping flow:
```typescript
// lib/scraping/fetch-product.ts
export async function fetchProductPage(url: string): Promise<string> {
  const response = await fetch(
    `https://app.scrapingbee.com/api/v1/?` +
    new URLSearchParams({
      api_key: process.env.SCRAPINGBEE_API_KEY!,
      url,
      render_js: 'true',        // For AliExpress / JS-heavy pages
      premium_proxy: 'false',   // Enable if getting blocked
    })
  )
  return response.text() // Raw HTML
}
```

Then HTML is passed to GPT-4o mini for extraction (see AI_SYSTEM.md).

### Supported sources:
- Any public Shopify store product page
- AliExpress product pages
- Amazon product pages
- Any public ecommerce product page

---

## 9. Image Pipeline

```
User uploads / URL detected
         │
         ▼
Supabase Storage (product-images/)
         │
         ▼
Remove.bg API
  → Input: image URL
  → Output: PNG with transparent background
         │
         ▼
Supabase Storage (product-images-nobg/)
         │
         ▼ (optional)
fal.ai Flux
  → Input: auto-generated prompt from product category + brand colors
  → Output: lifestyle background image
         │
         ▼
Supabase Storage (generated-backgrounds/)
         │
         ▼
Fabric.js canvas composition
  → Template JSON + product PNG + background + brand kit values
  → Canvas state JSON
         │
         ▼
Puppeteer render (server-side)
  → 4 formats rendered
         │
         ▼
Supabase Storage (creative-exports/)
  → Final PNG files per format
```

---

## 10. AI Context Builder

The most important function in the codebase. Builds the context block injected into every AI generation call.

```typescript
// lib/ai/context-builder.ts
export async function buildProjectContext(
  projectId: string,
  productId: string
): Promise<string> {
  const [project, product, memory] = await Promise.all([
    getProject(projectId),    // includes brand kit + AI settings
    getProduct(productId),    // includes extracted data + instructions
    getMemorySummary(projectId), // pre-computed memory descriptions
  ])

  return `
[BRAND KIT]
Brand: ${project.name} | Sector: ${project.sector}
Colors: Primary=${project.brand_kit.primary_color}, Secondary=${project.brand_kit.secondary_color}
Fonts: Headline=${project.brand_kit.headline_font}, Body=${project.brand_kit.body_font}
Tone: ${project.brand_kit.tone_description}
Always use: ${project.brand_kit.positive_words.join(', ')}
Never use: ${project.brand_kit.negative_words.join(', ')}

[PROJECT AI INSTRUCTIONS]
${project.ai_instructions || 'No custom instructions set.'}

[AI MEMORY]
${memory.visual_style || 'No visual references uploaded.'}
${memory.copy_style || 'No copy examples provided.'}

[PRODUCT DATA]
Name: ${product.name}
Original price: ${product.original_price} | Sale price: ${product.sale_price}
Discount: ${product.discount_percentage}%
Benefits: ${product.benefits.join(', ')}
Problem solved: ${product.pain_point}
Customer reviews: ${product.top_reviews.join(' | ')}

[PRODUCT AD INSTRUCTIONS]
Goal: ${product.campaign_goal}
Angles to prioritize: ${product.copy_angles.join(', ')}
Additional: ${product.additional_instructions || 'None'}
`.trim()
}
```

---

## 11. Rendering Architecture

### Why server-side rendering (Puppeteer) vs client-side (html2canvas):

| | Puppeteer (server) | html2canvas (client) |
|---|---|---|
| Quality | Pixel-perfect | Often glitchy with custom fonts |
| Speed | 2–5s per format | 1–3s per format |
| Custom fonts | ✅ Always loads correctly | ❌ Often fails |
| Infrastructure | Needs Node.js server | Client-only |
| Scaling | Needs worker pool | Free (client resources) |

**Decision:** Puppeteer for MVP. Run on Vercel with increased memory (1GB function). If cost becomes an issue at scale, migrate to a dedicated render worker (Railway/Fly.io).

### Render worker:
```typescript
// app/api/export/render/route.ts
export async function POST(req: Request) {
  const { canvasJSON, formats } = await req.json()

  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  const urls: Record<string, string> = {}

  for (const format of formats) {
    const { width, height } = FORMAT_DIMENSIONS[format]
    await page.setViewport({ width, height })
    await page.setContent(buildCanvasHTML(canvasJSON, width, height))
    await page.waitForSelector('#canvas-ready') // canvas fires event when rendered

    const screenshot = await page.screenshot({ type: 'png' })
    const url = await uploadToStorage(screenshot, `${format}.png`)
    urls[format] = url
  }

  await browser.close()
  return Response.json({ urls })
}
```

---

## 12. Security

- **Row Level Security (RLS):** All Supabase tables have RLS policies. Users can only read/write their own data.
- **API auth:** All API routes verify Clerk session. No unauthenticated writes.
- **Shopify tokens:** Encrypted with AES-256 before storing in DB (using `crypto` module).
- **Webhooks:** Stripe and Clerk webhooks verified with their respective secrets.
- **Rate limiting:** Upstash Redis rate limiting on AI endpoints (max 10 req/min per user in free plan).
- **Input validation:** All API inputs validated with Zod.
- **SSRF protection:** ScrapingBee acts as a proxy, preventing direct SSRF from our server. We validate URL format before sending to ScrapingBee.

---

## 13. Performance Targets

| Metric | Target |
|--------|--------|
| Product extraction (URL → data) | < 8s |
| Remove.bg processing | < 3s |
| Copy generation (5 angles, parallel) | < 4s |
| Draft creative ready | < 15s total |
| Batch generation (8 creatives) | < 60s |
| Single creative render (1 format) | < 5s |
| Page load (dashboard) | < 1.5s |

---

## 14. Deployment

- **Hosting:** Vercel (Pro plan for 60s function timeout needed)
- **Database:** Supabase (cloud, eu-west region for Spanish market)
- **CDN:** Vercel Edge Network + Supabase Storage CDN
- **Monitoring:** Vercel Analytics + Sentry for error tracking
- **CI/CD:** GitHub Actions → Vercel preview deployments on PRs

### Vercel config:
```json
{
  "functions": {
    "app/api/export/render/route.ts": {
      "maxDuration": 60,
      "memory": 1024
    },
    "app/api/ai/generate-batch/route.ts": {
      "maxDuration": 60
    }
  }
}
```
