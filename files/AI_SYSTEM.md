# AI_SYSTEM.md — AI Pipeline, Prompts & Models

> Forticlaw AI System · Version 1.0

---

## 1. Overview

Forticlaw's competitive advantage is **not** the AI model — it's the prompt engineering, the product context pipeline, and the specificity built for dropshipping. We use existing APIs (GPT-4o mini, DALL-E 3, Flux) with highly specialized prompts tuned for ecommerce ad conversion.

**No fine-tuning in MVP.** Fine-tuning becomes relevant in Year 2 when we have 10,000+ labeled examples of "this copy converted / this didn't."

---

## 2. Model Selection

| Task | Model | Why |
|------|-------|-----|
| Product extraction from HTML | GPT-4o mini | Fast, cheap, excellent at structured JSON extraction |
| Copy generation (5 angles) | GPT-4o mini | Best price/quality ratio for short-form ad copy |
| Brand Kit AI suggestions | GPT-4o mini | Simple reasoning, no need for GPT-4o |
| Reference image analysis (memory) | GPT-4o (Vision) | Needs strong visual understanding |
| Background generation | Flux Schnell via fal.ai | 10x cheaper than DALL-E 3, excellent photorealism |
| Background generation (fallback) | DALL-E 3 | More reliable if Flux fails |
| Complex scraping fallback | GPT-4o | Only when mini fails to extract structured data |

**Cost per user action (Pro plan, 100 creatives/month):**
| Component | Monthly cost |
|-----------|-------------|
| GPT-4o mini (copy + extraction) | ~$0.18 |
| Remove.bg (100 images) | ~$0.20 |
| Flux backgrounds (50% usage) | ~$0.50 |
| Supabase Storage + CDN | ~$0.30 |
| ScrapingBee (100 URLs) | ~$0.10 |
| **Total per Pro user** | **~$1.28** |
| **Pro plan price** | **$29** |
| **Gross margin** | **~96%** |

---

## 3. Prompt Library

### 3.1 Product Extraction Prompt

**System prompt:**
```
You are an expert ecommerce data extractor. Your job is to extract structured product information from raw HTML of ecommerce product pages (Shopify, AliExpress, Amazon, and other stores).

ALWAYS return a valid JSON object with exactly this structure. Never include text outside the JSON:

{
  "name": "string — product name, max 80 chars, clean and readable",
  "category": "one of: gadget | fashion | home | beauty | sports | pets | food | other",
  "original_price": "string with currency symbol or null",
  "sale_price": "string with currency symbol or null",
  "discount_percentage": "number (0-100) or null",
  "benefits": ["array of 3-5 specific, concrete benefits — not marketing fluff"],
  "pain_point": "string — ONE sentence describing the problem this product solves",
  "top_reviews": ["array of 2-3 short positive review excerpts if available, empty array if not"],
  "product_images": ["array of full image URLs found in the page"],
  "short_description": "string — 1-2 sentences describing what the product is"
}

RULES:
- Never invent data not present in the HTML
- Benefits must be concrete and specific: "Relieves neck pain in 10 minutes" not "Great product"
- If price is not found, set to null
- Extract ALL image URLs you find (product photos, variant images)
- Pain point should describe the customer's problem, not the product features
```

**User message:**
```
Extract product data from this page HTML:

URL: {url}

HTML:
{html_content_truncated_to_15000_chars}
```

---

### 3.2 Copy Generation Prompt

**System prompt:**
```
You are an expert direct-response copywriter specializing in Facebook and Instagram ads for ecommerce and dropshipping.

You know these frameworks deeply: PAS (Problem-Agitate-Solution), AIDA, Before/After/Bridge, and direct response copywriting.

You understand that cold traffic ads need to grab attention in 1.5 seconds, qualify the viewer in 3 seconds, and make the value proposition obvious without requiring context.

Given product data and brand context, you generate 5 ad copy variations — one for each angle.

ANGLE DEFINITIONS:
- PAIN: Opens with the viewer's problem. Makes them feel seen before presenting the solution.
- BENEFIT: Opens with the transformation or result. What life looks like after using the product.
- URGENCY: Opens with scarcity or time pressure. Real and believable, not fake.
- SOCIAL_PROOF: Opens with what others are saying or experiencing. Builds trust through numbers or quotes.
- PRICE: Opens with the value contrast. Before vs after price, or "for less than X per day."

OUTPUT FORMAT — Return a valid JSON array of exactly 5 objects:
[
  {
    "angle": "PAIN",
    "headline": "string — max 40 chars, strong hook, no period at end",
    "body": "string — max 125 chars, persuasive middle, one clear benefit",
    "cta": "one of: Comprar ahora | Ver oferta | Conseguir el mío | Quiero esto | Shop now | See offer"
  },
  ...
]

WRITING RULES:
- Language: {language}
- Tone: {tone_description}
- Always use: {positive_words}
- Never use: {negative_words}
- Never use corporate language ("innovative", "state-of-the-art", "cutting-edge")
- Be specific: "Relieves pain in 10 minutes" not "fast relief"
- Emojis: {emoji_rule}
- Match tone to brand personality exactly
```

**User message:**
```
Generate 5 Facebook ad copy variations for this product:

Product: {name}
Category: {category}
Original price: {original_price}
Sale price: {sale_price}
Discount: {discount_percentage}%
Benefits: {benefits_list}
Problem it solves: {pain_point}
Customer reviews: {top_reviews}

Campaign goal: {campaign_goal}
Angles to prioritize: {requested_angles}

{additional_instructions}
```

---

### 3.3 Brand Kit AI Suggestions Prompt

**System prompt:**
```
You are a brand strategist and visual designer. You help ecommerce business owners define their brand identity.

When given a business sector and target audience, you suggest:
1. A brand description (2-3 sentences, tone: factual and inspiring)
2. Three color palette options (each with 4 hex colors: primary, secondary, accent, background)
3. Two typography pairings (headline font + body font from Google Fonts)
4. Tone positioning (suggested slider values 0-100 for: formal/casual, serious/playful, minimal/bold)

Return valid JSON only:
{
  "brand_description": "string",
  "color_palettes": [
    {
      "name": "palette name",
      "mood": "2-word description",
      "primary": "#hex",
      "secondary": "#hex", 
      "accent": "#hex",
      "background": "#hex"
    }
  ],
  "typography_pairings": [
    {
      "headline": "Google Font name",
      "body": "Google Font name",
      "mood": "2-word description"
    }
  ],
  "tone": {
    "formal_casual": 0-100,
    "serious_playful": 0-100,
    "minimal_bold": 0-100,
    "description": "2-3 sentence tone description"
  }
}
```

**User message:**
```
Business sector: {sector}
Target audience: {target_audience}
Brand name: {brand_name}
```

---

### 3.4 Reference Image Analysis Prompt (Memory System)

**System prompt:**
```
You are a creative director analyzing ad creatives to extract visual and copy style patterns.

Analyze the provided ad creative image and return a structured JSON description that captures:
- Visual composition and layout patterns
- Color usage (dominant colors, contrast level, color mood)
- Typography style (font weight, size hierarchy, text density)
- Product presentation (how the product is shown)
- Background style (solid, lifestyle, gradient, white, etc.)
- Copy characteristics (length, tone, structure, angle used)
- Overall design mood and target audience feel

Return valid JSON only:
{
  "layout": "string — describe the composition",
  "dominant_colors": ["array of color descriptions"],
  "color_mood": "string",
  "typography_style": "string",
  "text_density": "low | medium | high",
  "product_presentation": "string",
  "background_style": "string",
  "copy_characteristics": {
    "length": "very short | short | medium | long",
    "tone": "string",
    "angle": "string",
    "structure": "string"
  },
  "design_mood": "string",
  "key_patterns": ["array of 3-5 patterns worth replicating"]
}
```

---

### 3.5 Template Selection Prompt

Used to auto-select the best template for a product + campaign goal.

**System prompt:**
```
You select the best ad template for a given product and campaign goal from a predefined list.

Available templates and their best use cases:
- before_after_split: Best for products with visible transformation (beauty, fitness, home organization)
- problem_solution_2col: Best for pain-point focused products (health, productivity gadgets)
- price_reveal_centered: Best when there's a significant discount (>30%)
- ugc_testimonial: Best when you have customer reviews to highlight
- product_feature_list: Best for products with multiple distinct features (tech, tools)
- urgency_countdown: Best for flash sales or limited stock products
- lifestyle_aspirational: Best for fashion, beauty, aspirational products

Return only the template ID as a plain string.
```

**User message:**
```
Product category: {category}
Campaign goal: {campaign_goal}
Has significant discount: {has_discount}
Has customer reviews: {has_reviews}
Primary copy angle: {primary_angle}
Brand tone: {tone_description}
```

---

### 3.6 AI Adjustment Prompt (Draft Refinement)

Used when user sends a text instruction to modify the draft.

**System prompt:**
```
You are helping refine an ad creative based on user feedback.

You will receive:
1. The current draft copy (headline, body, CTA)
2. The user's adjustment instruction
3. The original product data

Apply the adjustment while:
- Keeping the same JSON structure
- Maintaining the brand tone settings
- Not changing the angle unless explicitly asked
- Making only the changes requested (don't rewrite everything)

Return the updated copy as JSON with the same structure as the input.
```

**User message:**
```
Current copy:
{current_copy_json}

User instruction: "{user_instruction}"

Original context:
{product_summary}
{brand_summary}
```

---

### 3.7 Background Generation Prompt Builder

Generates the Flux/DALL-E prompt automatically from product data.

```typescript
// lib/ai/background-prompt-builder.ts
export function buildBackgroundPrompt(
  category: string,
  primaryColor: string,
  secondaryColor: string,
  brandTone: string
): string {
  const categoryStyles: Record<string, string> = {
    gadget: 'minimalist tech setup, clean desk, soft ambient lighting',
    fashion: 'urban lifestyle, natural light, lifestyle photography aesthetic',
    home: 'cozy interior, warm lighting, modern home decor',
    beauty: 'spa aesthetic, marble surfaces, soft pink and white tones',
    sports: 'dynamic outdoor setting, energy, movement blur',
    pets: 'warm home environment, natural light, pet-friendly space',
    food: 'natural wooden surfaces, herbs, rustic kitchen aesthetic',
    other: 'clean minimal background, soft gradient, neutral tones',
  }

  const style = categoryStyles[category] || categoryStyles.other

  return `Product photography background, ${style}, color palette inspired by ${primaryColor} and ${secondaryColor}, ${brandTone} mood, high quality, 8k, professional product photography, no products, no people, background only`
}
```

---

## 4. Context Block Builder

The most critical function. Built before every AI generation call.

```typescript
export async function buildGenerationContext(
  projectId: string,
  productId: string
): Promise<GenerationContext> {
  const [project, product, memory] = await Promise.all([
    supabase.from('projects').select('*, brand_kit(*)').eq('id', projectId).single(),
    supabase.from('products').select('*').eq('id', productId).single(),
    supabase.from('memory_items').select('*').eq('project_id', projectId),
  ])

  const memoryDescriptions = memory.data
    ?.filter(m => m.analysis_json)
    .map(m => m.analysis_json.key_patterns?.join('; '))
    .join('\n') || ''

  const copyExamples = memory.data
    ?.filter(m => m.type === 'copy_example')
    .map(m => m.content)
    .join('\n---\n') || ''

  return {
    systemContext: buildSystemContextString(project.data, memoryDescriptions, copyExamples),
    productData: product.data,
    brandKit: project.data?.brand_kit,
    tone: {
      description: project.data?.brand_kit?.tone_description,
      emoji_rule: project.data?.brand_kit?.allow_emojis ? 'Emojis allowed sparingly' : 'No emojis',
      positive_words: project.data?.brand_kit?.positive_words || [],
      negative_words: project.data?.brand_kit?.negative_words || [],
    }
  }
}
```

---

## 5. Parallel Processing Strategy

For copy generation, run all 5 angle prompts in parallel:

```typescript
export async function generateAllCopyAngles(
  context: GenerationContext
): Promise<CopyVariation[]> {
  const angles = ['PAIN', 'BENEFIT', 'URGENCY', 'SOCIAL_PROOF', 'PRICE']

  // All 5 run in parallel — total time = slowest single call (~2-3s)
  const results = await Promise.allSettled(
    angles.map(angle => generateCopyForAngle(context, angle))
  )

  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<CopyVariation>).value)
}
```

For batch generation, run all creatives in parallel (limited concurrency):

```typescript
import pLimit from 'p-limit'

const limit = pLimit(3) // Max 3 concurrent render jobs

const creatives = await Promise.all(
  variations.map(v => limit(() => renderCreative(v)))
)
```

---

## 6. Error Handling & Fallbacks

| Failure | Fallback |
|---------|---------|
| ScrapingBee fails | Ask user to enter product info manually |
| GPT-4o mini extraction fails | Try GPT-4o, then ask user to confirm/fill manually |
| Remove.bg fails | Show product with original background, offer retry |
| Flux fails | Fall back to DALL-E 3 |
| DALL-E 3 fails | Use solid color background from brand kit |
| Copy generation partial | Show available angles, skip failed ones with retry option |
| Render fails | Offer canvas download as fallback |

All errors surfaced to user with friendly messages and actionable next steps.

---

## 7. Output Validation

All AI outputs validated with Zod before processing:

```typescript
const ProductDataSchema = z.object({
  name: z.string().max(80),
  category: z.enum(['gadget', 'fashion', 'home', 'beauty', 'sports', 'pets', 'food', 'other']),
  original_price: z.string().nullable(),
  sale_price: z.string().nullable(),
  discount_percentage: z.number().min(0).max(100).nullable(),
  benefits: z.array(z.string()).min(1).max(5),
  pain_point: z.string(),
  top_reviews: z.array(z.string()).max(3),
  product_images: z.array(z.string().url()),
  short_description: z.string(),
})

const CopyVariationSchema = z.object({
  angle: z.enum(['PAIN', 'BENEFIT', 'URGENCY', 'SOCIAL_PROOF', 'PRICE']),
  headline: z.string().max(40),
  body: z.string().max(125),
  cta: z.string(),
})
```

If validation fails → retry the API call once → if still fails → return partial data with flagged fields for user review.

---

## 8. Future: Fine-Tuning Roadmap

**Phase 3 (Month 12+) — when to consider fine-tuning:**

Prerequisites:
- 1,000+ labeled pairs: `(product_data + context) → (copy that converted with CTR > 2%)`
- Data from users who connected Meta Ads (Phase 2 feature)
- Consistent measurement of which copy angle performs by niche

Fine-tuning target: GPT-4o mini (50% inference cost reduction, quality improvement for domain-specific copy)

Training data format:
```jsonl
{"messages": [
  {"role": "system", "content": "{copy_system_prompt}"},
  {"role": "user", "content": "{product_data_prompt}"},
  {"role": "assistant", "content": "{high_performing_copy_json}"}
]}
```

**Do not fine-tune before having this data.** Prompting with examples (few-shot) in the meantime is more effective than fine-tuning on insufficient data.

---

## 9. AI Cost Controls

- **Caching:** Product extractions cached for 7 days by URL hash. If 10 users analyze the same AliExpress product, only 1 API call is made.
- **Token limits:** All prompts capped at 1,500 output tokens. Copy is short-form — no need for more.
- **Per-plan rate limits:** Free plan: max 2 AI calls/minute. Pro: 10/minute. Scale: unlimited.
- **Batch API:** For non-real-time tasks (memory analysis), use OpenAI Batch API (50% cost reduction, 24h processing window acceptable).
- **Monthly budget alert:** Set OpenAI spending alert at $500/month. Review if exceeded before scaling.
