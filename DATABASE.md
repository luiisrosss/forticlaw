# DATABASE.md — Schema & Data Model

> Forticlaw · Supabase (PostgreSQL) · Version 1.0

---

## 1. Entity Relationship Overview

```
users
  └── projects (N)
        ├── brand_kit (1:1)
        ├── ai_settings (1:1)
        ├── memory_items (N)
        ├── shopify_connections (1)
        └── products (N)
              ├── product_images (N)
              └── batches (N)
                    └── creatives (N)
                          └── creative_exports (N, per format)

users
  └── subscriptions (1)
  └── credit_transactions (N)
  └── waitlist_entries (separate, pre-auth)
```

---

## 2. Full Schema (SQL Migrations)

### users

```sql
create table public.users (
  id                  uuid primary key default gen_random_uuid(),
  clerk_user_id       text unique not null,
  email               text unique not null,
  full_name           text,
  avatar_url          text,
  plan                text not null default 'free' check (plan in ('free', 'pro', 'scale')),
  credits_remaining   integer not null default 5,
  credits_reset_at    timestamptz,
  stripe_customer_id  text unique,
  onboarding_completed boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- RLS
alter table public.users enable row level security;
create policy "Users can read own data" on public.users
  for select using (clerk_user_id = auth.jwt() ->> 'sub');
create policy "Users can update own data" on public.users
  for update using (clerk_user_id = auth.jwt() ->> 'sub');
```

### projects

```sql
create table public.projects (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  name            text not null,
  sector          text not null check (sector in (
                    'gadget', 'fashion', 'home', 'beauty',
                    'sports', 'pets', 'food', 'other'
                  )),
  target_audience text,
  brand_description text,
  shopify_domain  text,               -- set when Shopify is connected
  is_shopify_connected boolean not null default false,
  ai_instructions text,               -- free-text AI instructions for the project
  ai_toggles      jsonb not null default '{}', -- quick toggle settings
  default_formats text[] not null default '{1x1,4x5,9x16,landscape}',
  default_variations integer not null default 5,
  default_creative_types text[] not null default '{static}',
  total_creatives_generated integer not null default 0,
  last_active_at  timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Example ai_toggles JSONB structure:
-- {
--   "always_show_crossed_price": true,
--   "always_urgency_cta": false,
--   "always_review_count": false,
--   "never_show_price": false,
--   "no_emojis": false,
--   "generate_english": false
-- }

alter table public.projects enable row level security;
create policy "Users can CRUD own projects" on public.projects
  for all using (user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'));
```

### brand_kit

```sql
create table public.brand_kit (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid unique not null references public.projects(id) on delete cascade,
  logo_url        text,
  logo_position   text not null default 'bottom-right'
                  check (logo_position in ('top-left', 'top-right', 'bottom-left', 'bottom-right')),
  primary_color   text not null default '#000000',
  secondary_color text not null default '#ffffff',
  accent_color    text not null default '#ff0000',
  bg_color        text not null default '#ffffff',
  headline_font   text not null default 'Inter',
  body_font       text not null default 'Inter',
  tone_formal_casual    integer not null default 50 check (tone_formal_casual between 0 and 100),
  tone_serious_playful  integer not null default 50 check (tone_serious_playful between 0 and 100),
  tone_minimal_bold     integer not null default 50 check (tone_minimal_bold between 0 and 100),
  tone_description      text,          -- AI-generated prose description of tone
  positive_words  text[] not null default '{}',
  negative_words  text[] not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.brand_kit enable row level security;
create policy "Users can CRUD own brand_kit via project" on public.brand_kit
  for all using (
    project_id in (
      select id from public.projects
      where user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub')
    )
  );
```

### shopify_connections

```sql
create table public.shopify_connections (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid unique not null references public.projects(id) on delete cascade,
  shop_domain     text not null,             -- e.g. "my-store.myshopify.com"
  access_token    text not null,             -- AES-256 encrypted before storing
  scope           text,
  is_active       boolean not null default true,
  connected_at    timestamptz not null default now(),
  last_sync_at    timestamptz
);

alter table public.shopify_connections enable row level security;
create policy "Users can manage own shopify connections" on public.shopify_connections
  for all using (
    project_id in (
      select id from public.projects
      where user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub')
    )
  );
```

### memory_items

```sql
create table public.memory_items (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references public.projects(id) on delete cascade,
  type            text not null check (type in (
                    'reference_creative',   -- uploaded ad image
                    'meta_screenshot',      -- Meta Ads Manager screenshot
                    'copy_example',         -- pasted copy text
                    'style_description'     -- written style description
                  )),
  content         text,                    -- text content (for copy_example, style_description)
  image_url       text,                    -- storage URL (for image types)
  analysis_json   jsonb,                   -- AI-extracted patterns (for image types)
  label           text,                    -- optional user label
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

alter table public.memory_items enable row level security;
create policy "Users can CRUD own memory items" on public.memory_items
  for all using (
    project_id in (
      select id from public.projects
      where user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub')
    )
  );
```

### products

```sql
create table public.products (
  id                    uuid primary key default gen_random_uuid(),
  project_id            uuid not null references public.projects(id) on delete cascade,
  source_url            text,                    -- original URL scraped
  shopify_product_id    text,                    -- if imported from Shopify
  name                  text not null,
  category              text,
  original_price        text,
  sale_price            text,
  discount_percentage   integer,
  short_description     text,
  benefits              text[] not null default '{}',
  pain_point            text,
  top_reviews           text[] not null default '{}',
  extraction_status     text not null default 'pending'
                        check (extraction_status in ('pending', 'processing', 'completed', 'failed')),
  extraction_raw_json   jsonb,                   -- raw GPT output (debug)
  -- Product-level AI instructions
  campaign_goal         text default 'sale'
                        check (campaign_goal in ('sale', 'traffic', 'retargeting', 'awareness', 'launch')),
  copy_angles           text[] not null default '{}',
  additional_instructions text,
  creative_types        text[] not null default '{}',
  requested_variations  integer not null default 5,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.products enable row level security;
create policy "Users can CRUD own products" on public.products
  for all using (
    project_id in (
      select id from public.projects
      where user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub')
    )
  );
```

### product_images

```sql
create table public.product_images (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references public.products(id) on delete cascade,
  original_url    text not null,           -- extracted from product page
  storage_url     text,                    -- our Supabase Storage copy
  nobg_url        text,                    -- background-removed version
  is_selected     boolean not null default false,  -- user selected for generation
  is_primary      boolean not null default false,
  width           integer,
  height          integer,
  created_at      timestamptz not null default now()
);

alter table public.product_images enable row level security;
create policy "Users can access own product images" on public.product_images
  for all using (
    product_id in (
      select p.id from public.products p
      join public.projects pr on p.project_id = pr.id
      where pr.user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub')
    )
  );
```

### batches

```sql
create table public.batches (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references public.products(id) on delete cascade,
  project_id      uuid not null references public.projects(id),
  status          text not null default 'draft'
                  check (status in ('draft', 'approved', 'processing', 'completed', 'failed')),
  draft_config    jsonb,                   -- draft creative config (pre-approval)
  ai_decisions    jsonb,                   -- why the AI made certain choices
  total_requested integer not null default 5,
  total_completed integer not null default 0,
  error_message   text,
  approved_at     timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz not null default now()
);

alter table public.batches enable row level security;
create policy "Users can access own batches" on public.batches
  for all using (
    project_id in (
      select id from public.projects
      where user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub')
    )
  );
```

### creatives

```sql
create table public.creatives (
  id              uuid primary key default gen_random_uuid(),
  batch_id        uuid not null references public.batches(id) on delete cascade,
  product_id      uuid not null references public.products(id),
  project_id      uuid not null references public.projects(id),
  template_id     text not null,           -- references template JSON key
  copy_angle      text not null
                  check (copy_angle in ('PAIN', 'BENEFIT', 'URGENCY', 'SOCIAL_PROOF', 'PRICE')),
  headline        text not null,
  body_copy       text not null,
  cta             text not null,
  canvas_json     jsonb not null,          -- Fabric.js canvas serialization
  status          text not null default 'rendering'
                  check (status in ('rendering', 'ready', 'failed')),
  is_approved     boolean not null default false,
  credits_used    integer not null default 1,
  created_at      timestamptz not null default now()
);

alter table public.creatives enable row level security;
create policy "Users can access own creatives" on public.creatives
  for all using (
    project_id in (
      select id from public.projects
      where user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub')
    )
  );
```

### creative_exports

```sql
create table public.creative_exports (
  id              uuid primary key default gen_random_uuid(),
  creative_id     uuid not null references public.creatives(id) on delete cascade,
  format          text not null check (format in ('1x1', '4x5', '9x16', 'landscape')),
  width           integer not null,
  height          integer not null,
  storage_url     text not null,           -- Supabase Storage URL
  file_size_bytes integer,
  created_at      timestamptz not null default now()
);

alter table public.creative_exports enable row level security;
create policy "Users can access own exports" on public.creative_exports
  for all using (
    creative_id in (
      select c.id from public.creatives c
      join public.projects pr on c.project_id = pr.id
      where pr.user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub')
    )
  );
```

### subscriptions

```sql
create table public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid unique not null references public.users(id) on delete cascade,
  stripe_subscription_id  text unique,
  stripe_price_id         text,
  plan                    text not null default 'free'
                          check (plan in ('free', 'pro', 'scale')),
  status                  text not null default 'active'
                          check (status in ('active', 'past_due', 'cancelled', 'trialing')),
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
create policy "Users can read own subscription" on public.subscriptions
  for select using (
    user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub')
  );
```

### credit_transactions

```sql
create table public.credit_transactions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  type            text not null check (type in (
                    'usage',          -- creative generated (negative)
                    'monthly_reset',  -- plan monthly reset (positive)
                    'pack_purchase',  -- extra credit pack (positive)
                    'refund',         -- admin refund (positive)
                    'signup_bonus'    -- initial free credits (positive)
                  )),
  amount          integer not null,    -- positive = credits added, negative = used
  balance_after   integer not null,    -- credits_remaining after transaction
  reference_id    text,                -- creative_id for 'usage', stripe session for 'pack_purchase'
  note            text,
  created_at      timestamptz not null default now()
);

alter table public.credit_transactions enable row level security;
create policy "Users can read own transactions" on public.credit_transactions
  for select using (
    user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub')
  );
```

### waitlist_entries

```sql
create table public.waitlist_entries (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  source          text,                    -- utm_source or referrer
  position        integer,
  referral_code   text unique,
  referred_by     uuid references public.waitlist_entries(id),
  is_launched     boolean not null default false,  -- true when sent launch email
  created_at      timestamptz not null default now()
);

-- No RLS (unauthenticated inserts allowed for waitlist)
-- Service role only for reads
```

---

## 3. Indexes

```sql
-- Performance indexes
create index idx_projects_user_id on public.projects(user_id);
create index idx_products_project_id on public.products(project_id);
create index idx_batches_product_id on public.batches(product_id);
create index idx_batches_status on public.batches(status);
create index idx_creatives_batch_id on public.creatives(batch_id);
create index idx_creatives_project_id on public.creatives(project_id);
create index idx_memory_items_project_id on public.memory_items(project_id);
create index idx_credit_transactions_user_id on public.credit_transactions(user_id);

-- Dashboard query: recent creatives
create index idx_creatives_created_at on public.creatives(created_at desc);
```

---

## 4. Supabase Storage Buckets

```sql
-- Public bucket for final exports (served via CDN)
insert into storage.buckets (id, name, public) values ('creative-exports', 'creative-exports', true);

-- Private buckets (served via signed URLs)
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', false);
insert into storage.buckets (id, name, public) values ('product-images-nobg', 'product-images-nobg', false);
insert into storage.buckets (id, name, public) values ('generated-backgrounds', 'generated-backgrounds', false);
insert into storage.buckets (id, name, public) values ('memory-uploads', 'memory-uploads', false);
insert into storage.buckets (id, name, public) values ('logos', 'logos', false);
```

---

## 5. Key Queries

### Dashboard: get all projects with stats
```sql
select
  p.*,
  bk.primary_color,
  bk.logo_url,
  count(distinct pr.id) as total_products,
  count(distinct c.id) as total_creatives,
  max(c.created_at) as last_creative_at
from projects p
left join brand_kit bk on bk.project_id = p.id
left join products pr on pr.project_id = p.id
left join creatives c on c.project_id = p.id
where p.user_id = $1
group by p.id, bk.primary_color, bk.logo_url
order by p.last_active_at desc;
```

### Build generation context (single query)
```sql
select
  p.name, p.sector, p.ai_instructions, p.ai_toggles, p.default_formats,
  bk.*,
  json_agg(mi.*) filter (where mi.id is not null) as memory_items
from projects p
join brand_kit bk on bk.project_id = p.id
left join memory_items mi on mi.project_id = p.id and mi.is_active = true
where p.id = $1
group by p.id, bk.id;
```

### Get batch with all creatives and exports
```sql
select
  b.*,
  json_agg(
    json_build_object(
      'id', c.id,
      'template_id', c.template_id,
      'copy_angle', c.copy_angle,
      'headline', c.headline,
      'body_copy', c.body_copy,
      'cta', c.cta,
      'status', c.status,
      'exports', (
        select json_agg(e.*) from creative_exports e where e.creative_id = c.id
      )
    )
  ) as creatives
from batches b
left join creatives c on c.batch_id = b.id
where b.id = $1
group by b.id;
```

---

## 6. Realtime Subscriptions

Enable Supabase Realtime on these tables for live UI updates:

```sql
alter publication supabase_realtime add table public.batches;
alter publication supabase_realtime add table public.creatives;
```

Frontend subscribes to batch status changes:
```typescript
supabase
  .channel(`batch-${batchId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'batches',
    filter: `id=eq.${batchId}`,
  }, (payload) => {
    updateBatchProgress(payload.new)
  })
  .subscribe()
```

---

## 7. TypeScript Types

Generated via Supabase CLI:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
```

Key manual types to maintain:
```typescript
// types/index.ts

export type Plan = 'free' | 'pro' | 'scale'
export type CopyAngle = 'PAIN' | 'BENEFIT' | 'URGENCY' | 'SOCIAL_PROOF' | 'PRICE'
export type ProductCategory = 'gadget' | 'fashion' | 'home' | 'beauty' | 'sports' | 'pets' | 'food' | 'other'
export type ExportFormat = '1x1' | '4x5' | '9x16' | 'landscape'
export type CreativeType = 'static' | 'carousel' | 'story'
export type MemoryItemType = 'reference_creative' | 'meta_screenshot' | 'copy_example' | 'style_description'

export interface BrandKitValues {
  logoUrl: string | null
  primaryColor: string
  secondaryColor: string
  accentColor: string
  bgColor: string
  headlineFont: string
  bodyFont: string
  toneDescription: string
  positiveWords: string[]
  negativeWords: string[]
}

export interface ProductData {
  name: string
  category: ProductCategory
  originalPrice: string | null
  salePrice: string | null
  discountPercentage: number | null
  benefits: string[]
  painPoint: string
  topReviews: string[]
  productImages: string[]
  shortDescription: string
}

export interface CopyVariation {
  angle: CopyAngle
  headline: string
  bodyCopy: string
  cta: string
}

export interface GenerationContext {
  systemContext: string
  productData: ProductData
  brandKit: BrandKitValues
  tone: {
    description: string
    emojiRule: string
    positiveWords: string[]
    negativeWords: string[]
  }
}
```
