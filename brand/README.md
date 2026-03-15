# Forticlaw

> AI-powered ad creative generator for dropshippers and ecommerce sellers.

Forticlaw connects to your Shopify store, analyzes your products with AI, and generates scroll-stopping Facebook ad creatives in under 60 seconds. Brand kit, copy, and images — fully automated.

---

## What it does

1. User creates a **Project** (= 1 brand / store)
2. Defines their **Brand Kit** with AI assistance (colors, fonts, tone, logo)
3. Connects **Shopify** (optional) or pastes any product URL
4. AI analyzes the product and generates a **draft creative** in ~15s
5. User approves or adjusts with a single text instruction
6. AI generates a **full batch** of 8–12 ad variations (images + copy)
7. User downloads a ZIP with all formats (1:1, 4:5, 9:16, 1.91:1)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| Canvas editor | Fabric.js |
| Database | Supabase (Postgres) |
| Auth | Clerk |
| Storage | Supabase Storage (S3-compatible) |
| Payments | Stripe |
| Email | Resend |
| AI — Text | OpenAI GPT-4o mini |
| AI — Images | DALL-E 3 / Flux (fal.ai) |
| AI — Vision | GPT-4o (reference image analysis) |
| Background removal | Remove.bg API |
| Scraping | ScrapingBee API |
| Deployment | Vercel |

---

## Project Structure

```
forticlaw/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Clerk auth pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/            # Protected app routes
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Main dashboard
│   │   ├── projects/
│   │   │   ├── new/            # Create project wizard
│   │   │   └── [projectId]/
│   │   │       ├── page.tsx    # Project overview
│   │   │       ├── products/
│   │   │       │   ├── new/    # New product form
│   │   │       │   └── [productId]/
│   │   │       ├── creatives/  # Creative gallery
│   │   │       ├── brand-kit/  # Brand Kit editor
│   │   │       ├── ai-settings/ # AI instructions
│   │   │       └── memory/     # AI memory manager
│   │   └── settings/           # Account & billing
│   ├── api/
│   │   ├── webhooks/
│   │   │   ├── stripe/         # Stripe webhook handler
│   │   │   └── clerk/          # Clerk webhook handler
│   │   ├── ai/
│   │   │   ├── extract-product/ # URL → product data
│   │   │   ├── generate-copy/   # Product → ad copy
│   │   │   ├── generate-draft/  # Full draft creative
│   │   │   ├── generate-batch/  # Full batch generation
│   │   │   └── analyze-memory/  # Analyze reference images
│   │   ├── scraping/
│   │   │   └── fetch-product/   # ScrapingBee integration
│   │   ├── images/
│   │   │   ├── remove-bg/       # Remove.bg integration
│   │   │   └── generate-bg/     # DALL-E / Flux background
│   │   ├── shopify/
│   │   │   ├── connect/         # OAuth flow
│   │   │   └── products/        # List store products
│   │   └── export/
│   │       └── render/          # Server-side canvas render
│   └── (marketing)/            # Public pages
│       ├── page.tsx             # Landing / waitlist
│       └── waitlist/
├── components/
│   ├── ui/                      # Base UI components
│   ├── canvas/                  # Fabric.js canvas editor
│   ├── brand-kit/               # Brand Kit wizard components
│   ├── product/                 # Product form components
│   ├── creative/                # Creative card, gallery, viewer
│   ├── ai/                      # AI status, progress indicators
│   └── layout/                  # Sidebar, nav, dashboard shell
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts             # Generated DB types
│   ├── ai/
│   │   ├── prompts.ts           # All system prompts
│   │   ├── extract.ts           # Product extraction logic
│   │   ├── copy.ts              # Copy generation logic
│   │   └── context-builder.ts   # Builds AI context per project
│   ├── stripe/
│   │   └── client.ts
│   ├── resend/
│   │   └── emails.ts            # All transactional emails
│   └── utils/
│       ├── credits.ts           # Credit calculation logic
│       └── export.ts            # Image export utilities
├── types/
│   └── index.ts                 # Global TypeScript types
├── docs/                        # All documentation
│   ├── README.md                # This file
│   ├── PRD.md                   # Product Requirements
│   ├── TECHNICAL.md             # Architecture & technical decisions
│   ├── AI_SYSTEM.md             # AI features, prompts, models
│   └── DATABASE.md              # Schema & data model
└── supabase/
    ├── migrations/              # DB migrations
    └── seed.ts                  # Dev seed data
```

---

## Getting Started (Development)

```bash
# 1. Clone and install
git clone https://github.com/your-org/forticlaw.git
cd forticlaw
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in all keys (see TECHNICAL.md for full list)

# 3. Set up Supabase
npx supabase start
npx supabase db push

# 4. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

```env
# Clerk (Auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Remove.bg
REMOVEBG_API_KEY=

# fal.ai (Flux image generation)
FAL_KEY=

# ScrapingBee
SCRAPINGBEE_API_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_SCALE_PRICE_ID=

# Resend (Email)
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@forticlaw.com

# Shopify (App credentials)
SHOPIFY_API_KEY=
SHOPIFY_API_SECRET=
```

---

## Key Concepts

### Project
A Project represents one brand/store. It contains a Brand Kit, AI settings, AI memory, and all products. One user can have multiple projects (limited by plan).

### Brand Kit
The visual and tonal identity of a project: logo, color palette, typography, tone sliders, and brand vocabulary. Applied automatically to every creative generated within the project.

### AI Memory
Reference material uploaded by the user (past ad images, copy examples, Meta Ads screenshots, written style descriptions). Analyzed once with GPT-4o Vision and stored as structured descriptions. Injected as context in every generation call.

### Creative
The output unit. A creative = 1 image (with all its format variants: 1:1, 4:5, 9:16, 1.91:1) + associated copy. Generated in batches of 5–12 per product.

### Credits
One credit = one creative generated. Batch of 8 = 8 credits. Credits reset monthly based on plan.

---

## Roadmap

| Phase | Timeline | Goal |
|-------|----------|------|
| MVP | Month 1–3 | Core generation loop, 30 templates, Stripe |
| Growth | Month 4–6 | Shopify integration, Brand Kit wizard, batch gen |
| Scale | Month 7–12 | Agency plan, Meta Ads publish, Creative Score |

See [PRD.md](./PRD.md) for full feature breakdown.

---

## Documentation

- [PRD.md](./PRD.md) — Full product requirements and user flows
- [TECHNICAL.md](./TECHNICAL.md) — Architecture, stack decisions, API integrations
- [AI_SYSTEM.md](./AI_SYSTEM.md) — AI pipeline, prompts, models, cost breakdown
- [DATABASE.md](./DATABASE.md) — Database schema and data model

---

*Built with ❤️ for dropshippers and ecommerce sellers.*
