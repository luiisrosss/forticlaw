-- Tabla para la waitlist
-- Ejecutar en el SQL Editor de Supabase Dashboard

create table if not exists public.waitlist (
  id          bigserial primary key,
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- Índice en email para upserts rápidos
create unique index if not exists waitlist_email_idx on public.waitlist (email);

-- Row Level Security: solo el service role puede leer/escribir
alter table public.waitlist enable row level security;

-- Política: nadie accede desde el cliente (solo el API server con service role key)
-- No se necesita política pública — el service role la bypasea automáticamente
