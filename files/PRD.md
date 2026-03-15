# PRD — Forticlaw Product Requirements Document

> Version 1.0 · March 2026 · Status: Active

---

## 1. Product Vision

Forticlaw is an AI-powered ad creative platform built specifically for dropshippers and ecommerce sellers. It eliminates the time and skill barrier of producing professional Facebook ad creatives by automating the entire workflow: from product URL to a full batch of brand-consistent, conversion-optimized ad images and copy in under 60 seconds.

**Core design principle:** The user does as little as possible. The AI makes smart decisions by default based on the project's Brand Kit and memory. The user only intervenes to approve or correct.

---

## 2. Target Users

### Primary — Aspiring/intermediate dropshipper
- Age: 22–32, Spain / LATAM
- Revenue: €500–€5,000/month
- Tests 5–20 products per week on Facebook Ads
- Pain: Spends 2–4 hours/week making creatives in Canva
- Doesn't know design but wants professional-looking ads
- **Willingness to pay: $19–$49/month**

### Secondary — Advanced ecommerce seller
- Has own Shopify brand (not just dropshipping)
- Revenue: €3,000–€15,000/month
- Needs to scale creatives without hiring a designer
- Values Shopify integration and Brand Kit consistency
- **Willingness to pay: $49–$99/month**

### Tertiary — Ads agency / media buyer
- Manages 5–20 client stores
- Needs multi-project, white-label, high volume
- **Willingness to pay: $99–$249/month (Phase 3)**

---

## 3. Entity Structure

```
User Account
└── Project (1 per brand/store)
    ├── Brand Kit
    ├── AI Settings (project-level instructions)
    ├── AI Memory (reference creatives + copy examples)
    ├── Shopify Connection (optional)
    └── Products
        ├── Product Data (extracted by AI)
        ├── Product AI Instructions (per-product overrides)
        └── Creatives (batches)
            ├── Draft
            └── Generated batch (5–12 creatives)
                └── Each creative: image variants (4 formats) + copy
```

**Rules:**
- 1 Project = 1 brand/store
- 1 User can have N projects (limited by plan)
- AI Memory is scoped to the project (not per-product)
- Brand Kit settings apply to all products in the project by default

---

## 4. User Flows

### 4.1 New User Onboarding

```
Sign up (Clerk)
  → Welcome screen: "Create your first project"
  → Project creation wizard (5 steps)
  → Brand Kit setup (AI-assisted)
  → Optional: Connect Shopify
  → Dashboard: "Add your first product"
```

### 4.2 Create Project — Brand Kit Wizard

**Step 1 — Basic info**
- Project name (required)
- Sector/niche (required) — triggers AI suggestions for everything else
  - Options: Fashion · Beauty · Home · Gadgets · Pets · Sports · Food · Other
- Target audience (text, AI can suggest based on niche)
- AI generates a 2–3 sentence brand description → user edits or regenerates

**Step 2 — Visual identity**
- Logo upload (PNG/SVG, optional)
  - If uploaded: AI extracts color palette from logo automatically
- Color palette:
  - AI suggests 3 palettes based on sector
  - User can: choose a palette, adjust with color picker, or upload an image to extract colors from
  - Stored as: primary, secondary, accent, background colors
- Typography:
  - AI suggests 2–3 font pairings (headline + body) from Google Fonts
  - User chooses or picks manually from curated list

**Step 3 — Brand tone**
- Tone sliders (AI pre-positions based on sector, user adjusts):
  - Formal ↔ Casual
  - Serious ↔ Playful
  - Minimal ↔ Bold
- Words to NEVER use (tag input) — added to negative prompt
- Words to ALWAYS use (tag input) — added to positive prompt

**Step 4 — Shopify connection (optional)**
- OAuth with Shopify
- If connected: product dropdown in product form instead of URL input
- If skipped: manual URL input per product

**Step 5 — Summary & confirmation**
- AI shows: "Your project is ready. I've set up [name] with [palette], [font], [tone]. All creatives will use these automatically."
- CTA: "Create project" → goes to project dashboard

---

### 4.3 New Product Flow

**Triggered by:**
- "+ New product" button in project view
- "+ New creative" quick button in main dashboard (modal)

**Product form sections:**

**Section 1 — Product source**
- If Shopify connected: dropdown of store products
- If not: URL input field + "Analyze with AI" button
- Supported URLs: Shopify stores, AliExpress, Amazon, any public product page
- On analyze → spinner with steps: "Fetching page... Extracting data... Done"

**Section 2 — Product data (auto-filled by AI, all editable)**
- Product name
- Original price + sale price (if available)
- Benefits (3–5 tags, editable)
- Problem it solves (1 sentence)
- Product images (grid of extracted images, user selects which to use)
- User can upload additional images

**Section 3 — Creative instructions (optional overrides)**
- Campaign goal: Sale · Traffic · Retargeting · Brand awareness · Launch
- Copy angles to prioritize (multi-select): Pain · Benefit · Urgency · Social proof · Price · Story · Curiosity
  - Default: AI picks the best angles automatically
- Additional instructions (free text): product-specific notes that override project AI settings
- Creative types (multi-select): Static image · Carousel · Story vertical · Banner · Copy only
  - Default: uses project settings
- Number of variations: 3 / 5 / 8 / 12 (default: project setting)

**CTA:** "Generate creatives →"

---

### 4.4 Creative Generation Flow

**Phase 1 — Analysis & draft (automatic, ~15s)**

1. User hits "Generate creatives"
2. Progress animation with visible steps:
   - "Fetching product data..." (if not already done)
   - "Removing product background..."
   - "Analyzing brand kit..."
   - "Generating copy..."
   - "Building draft creative..."
3. Draft shown: 1 complete creative with:
   - Product image (background removed, placed on template)
   - Brand colors and logo applied
   - Best-angle copy (headline + body + CTA)
   - Template auto-selected based on product category
4. AI decision panel shown alongside draft:
   - "I chose the PAIN angle because this product solves a physical problem."
   - "I highlighted the 56% discount because price contrast drives clicks."
   - "I applied your casual tone setting and excluded your blacklist words."

**Phase 2 — Approval & adjustment**

User has 4 actions on the draft:
- ✅ **"Approve & generate batch"** → goes to Phase 3
- ✏️ **"Edit copy manually"** → inline text editing on the creative
- 🔄 **"Adjust with AI"** → text input appears: "Tell the AI what to change"
  - Examples: "Make it more aggressive on price", "Remove emojis", "Shorter copy"
  - AI regenerates only the draft (unlimited iterations, no credit cost)
- 🎨 **"Change template"** → shows template picker grid (same product/copy, different layout)

**Phase 3 — Batch generation (~30–60s)**

1. User approves → batch generation starts
2. AI generates N variations in parallel:
   - Different copy angles × different templates × same brand kit
   - All 4 format variants per creative (1:1, 4:5, 9:16, 1.91:1)
3. Progress bar visible, estimated time shown
4. Results grid shown when done

**Phase 4 — Results & export**

- Masonry/grid view of all generated creatives
- Each card shows: thumbnail, copy angle label, format selector
- Actions per creative: view full size · edit in canvas · delete · regenerate variation
- Bulk actions: select all · download selected · download all as ZIP
- ZIP structure: `/creative-name/1x1.png`, `/creative-name/4x5.png`, etc.
- Copy-to-clipboard button for each copy variant

---

### 4.5 Dashboard — Main View

**Header (always visible):**
- "+ New creative" primary button → opens quick modal (project selector → URL → generate)
- Active project selector
- Credits remaining indicator
- User menu

**Body:**
- Project cards: name, logo, N creatives, last active, "Open" + "+ Product" buttons
- Recent activity: last 6 creatives across all projects (thumbnails, clickable)

**Quick modal flow (+ New creative):**
1. "Which project?" → project selector or "Create new project"
2. Shopify product selector OR paste URL field
3. "Analyze & generate →" → goes directly to generation flow
- Max time from dashboard to first draft: **45 seconds**

---

## 5. Project Settings

### Brand Kit (editable anytime)
- All fields from the creation wizard
- Changes apply to future generations (not retroactive)

### AI Settings
**Free text instructions:**
- Large textarea: user describes how they want the AI to behave for this project
- Example: "My brand targets women over 50. Use warm, conversational tone. Always mention free shipping. Avoid anglicisms. My customers respond to emotional storytelling."
- Injected into every generation prompt for this project

**Quick toggles:**
- Always include crossed-out original price
- Always include urgency CTA
- Always include review count
- Never show price
- Never use emojis in copy
- Also generate English version

**Default output settings:**
- Default formats: checkboxes for 1:1, 4:5, 9:16, 1.91:1
- Default number of variations: slider (3 / 5 / 8 / 12)
- Default creative types: static · carousel · story

### AI Memory
(See Section 6)

### Integrations
- Shopify: connect / disconnect / re-authenticate
- Meta Ads: connect (Phase 2)
- WooCommerce: connect (Phase 2)

---

## 6. AI Memory System

**Scope:** Project-level. All memory feeds into every generation within the project.

**Memory types:**

| Type | Format | How it's used |
|------|--------|---------------|
| Reference creatives | JPG/PNG (up to 20 per project on Pro) | Analyzed once with GPT-4o Vision → stored as structured visual description → influences template choice, composition, visual density |
| Meta Ads screenshots | JPG/PNG | Same as above + notes on results context |
| Copy examples | Plain text (paste) | Analyzed for length, structure, vocabulary, aggressiveness level → becomes copy style guide |
| Written style description | Plain text (textarea) | Added directly to project system prompt |

**Processing:**
- Images analyzed once on upload (GPT-4o Vision) → stored as JSON description in DB
- Not re-analyzed on each generation (cost saving)
- Descriptions injected into context block at generation time

**Context block structure (injected in every generation):**
```
[BRAND KIT]
Name: ... | Sector: ... | Colors: ... | Fonts: ... | Tone: ...
Vocabulary: always=[...] never=[...]

[PROJECT AI INSTRUCTIONS]
{user's free-text instructions}

[AI MEMORY SUMMARY]
Visual references: {extracted descriptions from uploaded images}
Copy style learned: {extracted patterns from copy examples}

[PRODUCT DATA]
Name: ... | Price: ... | Benefits: [...] | Problem: ...

[PRODUCT INSTRUCTIONS]
Goal: ... | Angles: [...] | Additional: ...
```

**Memory management UI:**
- List of all memory items with type badge, upload date, "remove" button
- User can see exactly what the AI knows about their brand
- "Clear all memory" option

---

## 7. Templates

### MVP: 30 templates, hand-crafted for dropshipping conversion

**Template categories (by proven ad format):**
- Before/After (6 templates)
- Problem → Solution (5 templates)
- Price reveal / discount (5 templates)
- UGC-style / testimonial (4 templates)
- Product feature highlight (4 templates)
- Urgency / scarcity (3 templates)
- Lifestyle / aspirational (3 templates)

**Template format:**
- Defined in JSON with named slots: `product_image`, `headline`, `body`, `cta`, `price`, `logo`, `badge`
- Rendered via Fabric.js on canvas
- Brand Kit values (colors, fonts) injected at render time
- All templates available in all 4 aspect ratios

**Template selection logic:**
- AI auto-selects based on: product category + campaign goal + copy angle
- User can override via template picker

---

## 8. Canvas Editor

**Philosophy:** Functional, not full Canva. The user should rarely need to touch the editor. It exists for fine-tuning after AI generation.

**Capabilities:**
- Drag and reposition any element
- Resize elements (with aspect ratio lock option)
- Edit text inline (click to edit)
- Change font size / weight / color per element
- Swap product image
- Change background color or background image
- Move logo position
- Undo/redo

**Not in MVP:**
- Adding new elements (shapes, icons, stickers)
- Animation or video
- Multi-page / slide decks

---

## 9. Export System

**Formats exported per creative:**
- 1:1 (1080×1080px) — Feed
- 4:5 (1080×1350px) — Feed portrait
- 9:16 (1080×1920px) — Stories/Reels
- 1.91:1 (1200×628px) — Link ads / banner

**Rendering:**
- Server-side via Puppeteer screenshot of the Fabric.js canvas (headless Chrome)
- 72 DPI for ads (standard for Facebook)
- Output: PNG (lossless) or JPG (smaller file, option)

**Export options:**
- Download single creative (all formats as ZIP)
- Download batch (all creatives, all formats, organized in folders)
- Copy copy text to clipboard
- Phase 2: Publish directly to Meta Ads Manager

---

## 10. Credit System

| Action | Credit cost |
|--------|-------------|
| Generate 1 creative (any format) | 1 credit |
| Regenerate draft (adjustment loop) | 0 credits |
| Re-analyze product URL | 0 credits |
| Analyze memory image (upload) | 0 credits |

**Plans:**

| Plan | Price | Credits/month | Projects | Templates |
|------|-------|---------------|----------|-----------|
| Free | $0 | 5 | 1 | 10 (basic only) |
| Pro | $29/month | 100 | 5 | All 30+ |
| Scale | $79/month | Unlimited | Unlimited | All + priority |

**When credits run out:**
- Soft block: upsell modal shown, generation disabled
- Free users: "Upgrade to Pro" CTA with benefit list
- Pro users: "Add credits pack" option ($9 for 50 extra credits, no plan change required)

---

## 11. Email Flows (Resend)

| Trigger | Email |
|---------|-------|
| Sign up | Welcome + quick start guide |
| First project created | "Your brand kit is ready" tips |
| First creative generated | Celebration + tips for better results |
| Credits at 20% remaining | Usage warning + upgrade CTA |
| Credits exhausted | Upgrade prompt |
| Subscription active | Payment confirmation |
| Subscription cancelled | Offboarding + feedback request |
| Waitlist signup | Welcome to waitlist + position number |
| Waitlist launch | "You're in" early access email |

---

## 12. Phases & Scope

### Phase 1 — MVP (Month 1–3)
**Goal: validate core loop, get first 30 paying users**

- [ ] Auth (Clerk) + basic account
- [ ] Project creation wizard with AI-assisted Brand Kit
- [ ] Product form + URL scraping (ScrapingBee)
- [ ] AI product extraction (GPT-4o mini)
- [ ] AI copy generation — 5 angles (GPT-4o mini)
- [ ] Remove.bg integration
- [ ] 30 Fabric.js templates
- [ ] Draft → approval → batch generation flow
- [ ] Canvas editor (basic)
- [ ] Export as ZIP (all formats)
- [ ] Stripe billing (Free + Pro plans)
- [ ] Credit system
- [ ] Resend transactional emails
- [ ] Waitlist landing page

### Phase 2 — Growth (Month 4–7)
**Goal: reduce churn, increase activation**

- [ ] Shopify OAuth integration (import products)
- [ ] AI Memory system (upload + analysis)
- [ ] DALL-E 3 / Flux background generation
- [ ] Creative Score (AI rates each creative 1–100)
- [ ] Scale plan launch
- [ ] WooCommerce integration
- [ ] 20 additional templates

### Phase 3 — Scale (Month 8–12)
**Goal: agency market, $15K MRR**

- [ ] Agency plan (multi-account, white-label)
- [ ] Meta Ads Manager direct publish
- [ ] Affiliate program (20% recurring)
- [ ] Performance analytics (connect to Meta for ROAS data)
- [ ] Fine-tuning exploration (if sufficient data)
- [ ] API access for Scale plan

---

## 13. Success Metrics

| Metric | Target (Month 3) | Target (Month 6) | Target (Month 12) |
|--------|-----------------|-----------------|-------------------|
| Registered users | 500 | 2,000 | 8,000 |
| Paying users | 30 | 200 | 600 |
| MRR | $870 | $6,000 | $20,000 |
| Activation rate (1st creative) | >60% | >70% | >75% |
| Monthly churn | <10% | <7% | <5% |
| Time to first draft | <45s | <30s | <20s |

---

## 14. Out of Scope (MVP)

- Video / animated creatives
- Google Ads formats
- Collaboration / team members per project
- White-label (Phase 3)
- Mobile app
- AI model fine-tuning (Phase 3+)
- Marketplace of user-created templates
