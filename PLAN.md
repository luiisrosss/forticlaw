# FORTICLAW — PLAN DE PRODUCTO

> **Documento vivo.** Aquí se acuerdan fases, decisiones y rumbo del proyecto.
> No es un plan de ejecución paso a paso — es el mapa que seguimos y actualizamos a medida que avanzamos.
> Cada tarea tiene estado, y cada decisión queda registrada aquí.

---

## ESTADO GLOBAL

| Fase | Descripción | Estado |
|------|-------------|--------|
| 0 | Landing + Waitlist mode | ✅ Completo |
| 1 | Frontend — Auth, Dashboard, Flujos UI | ⬜ Pendiente |
| 2 | Backend — BD, APIs, Servicios externos | ⬜ Pendiente |
| 3 | Optimización + Seguridad | ⬜ Pendiente |

---

## DECISIONES GLOBALES TOMADAS

| # | Decisión | Detalle |
|---|----------|---------|
| 1 | Auth → Clerk | Sign-in/sign-up gestionados 100% por Clerk. Páginas `/sign-in` y `/sign-up` con componentes nativos Clerk |
| 2 | DB → Supabase | PostgreSQL + Storage + Realtime. RLS activado en todas las tablas |
| 3 | Pagos → Stripe | Subscripciones + créditos. Free plan con límite, Pro ilimitado |
| 4 | Email → Resend | Todos los transaccionales con React Email templates |
| 5 | Scraping → ScrapingBee | Para extraer datos de URLs de producto (Shopify + otras) |
| 6 | AI → OpenAI GPT-4o mini | Extracción de producto + generación de copy + decisiones de diseño |
| 7 | Backgrounds → fal.ai (Flux) | Generación de fondos. Remove.bg para separar producto |
| 8 | Canvas → Fabric.js | Editor de creativos. Renderizado server-side con Puppeteer para exports |
| 9 | Deploy → Vercel | CI/CD automático desde main branch. `.env` en Vercel dashboard |
| 10 | Waitlist mode → env var | `NEXT_PUBLIC_WAITLIST_MODE=true/false`. Cambio instantáneo sin redeploy de código |

---

## FASE 1 — FRONTEND

> Objetivo: Todas las pantallas de la app construidas con datos mock/hardcoded. La app es navegable al 100% antes de conectar ningún backend.

### 1.1 Auth

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| Página `/sign-in` con componente Clerk | ⬜ | Layout dark, centrado, con logo Forticlaw |
| Página `/sign-up` con componente Clerk | ⬜ | Mismo layout que sign-in |
| Middleware de protección de rutas | ⬜ | Todo bajo `(dashboard)/*` requiere auth. Landing y privacy son públicas |
| Redirect post-auth → `/dashboard` o `/onboarding` | ⬜ | Si `onboarding_completed=false` → onboarding. Si true → dashboard |

---

### 1.2 Onboarding

> Primera vez que el usuario entra después de crear cuenta. 3–4 pasos para configurar su primer proyecto.

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| Paso 1 — Nombre del proyecto / marca | ⬜ | Input simple. Ejemplo: "Mi tienda Nike" |
| Paso 2 — Sector y audiencia | ⬜ | Select con opciones predefinidas + campo libre |
| Paso 3 — Brand kit básico (colores + logo) | ⬜ | Puede saltarse, rellenable después |
| Paso 4 — Resumen y CTA "Crear primer proyecto" | ⬜ | Muestra lo que puede hacer con un visual |
| Skip onboarding → dashboard vacío | ⬜ | Siempre posible saltarse |

---

### 1.3 Dashboard principal

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| Layout base: sidebar + topbar | ⬜ | Sidebar colapsable. Logo, nav items, user avatar abajo |
| Página principal `/dashboard` | ⬜ | Lista de proyectos recientes + métricas globales (creativas generadas, créditos usados) |
| Empty state sin proyectos | ⬜ | Ilustración + CTA "Crea tu primer proyecto" |
| Sidebar navigation | ⬜ | Proyectos / Configuración / Créditos |

---

### 1.4 Proyectos

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| `/dashboard/projects/new` — Wizard crear proyecto | ⬜ | Multi-step: nombre → sector → brand kit básico |
| `/dashboard/projects` — Lista de proyectos | ⬜ | Cards con nombre, sector, última actividad, nº creativas |
| `/dashboard/projects/[id]` — Vista proyecto | ⬜ | Pestañas: Productos / Creativos / Brand Kit / Memoria / IA |
| Eliminar / archivar proyecto | ⬜ | Confirmar con modal antes de borrar |

---

### 1.5 Productos (flujo principal de generación)

> Este es el core de la app. El usuario pega una URL → la app genera las creatividades.

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| `/projects/[id]/products/new` — Input de URL | ⬜ | Campo URL con validación. Botón "Extraer producto" → loading state |
| Vista de extracción en progreso | ⬜ | Skeleton loader con pasos visuales: "Leyendo página → Extrayendo datos → Listo" |
| Pantalla de revisión de producto extraído | ⬜ | Nombre, precio, descripción, imágenes. Todo editable antes de continuar |
| Configuración de campaña | ⬜ | Objetivo (tráfico / conversión), ángulo de copy (dolor / beneficio / urgencia / prueba social), nº de variaciones (4–12), tipos de creativo (estático / video poster) |
| `/projects/[id]/products/[productId]` — Vista producto | ⬜ | Info del producto + historial de batches generados |

---

### 1.6 Revisión de draft (antes de generar el batch completo)

> El usuario aprueba un borrador antes de gastar créditos en el batch completo.

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| Vista de draft — 1 versión preview por ángulo | ⬜ | Muestra 1 creativo representativo por cada ángulo seleccionado |
| Panel de ajustes del draft | ⬜ | Headline, copy, CTA, template, colores. Todo tweakeable |
| Botón "Aprobar draft → Generar batch completo" | ⬜ | Confirma nº de créditos a usar antes de ejecutar |
| Estado de procesamiento del batch | ⬜ | Progress bar en tiempo real. Supabase Realtime para updates |

---

### 1.7 Galería de creativos

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| `/projects/[id]/creatives` — Grid de creativos | ⬜ | Filtros: por batch / ángulo / formato / estado |
| Vista detalle de un creativo | ⬜ | Preview grande + copy + ratios disponibles |
| Acciones por creativo: aprobar / exportar / duplicar / eliminar | ⬜ | Exportar descarga el ZIP con todos los ratios |
| Selección múltiple + exportar selección | ⬜ | Checkbox en hover de cada card |

---

### 1.8 Brand Kit

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| `/projects/[id]/brand-kit` — Editor visual | ⬜ | Colores primario/secundario/acento/fondo, logo upload, tipografías |
| Selector de fuentes (Google Fonts) | ⬜ | Lista curada de ~20 fuentes compatibles con la app |
| Sliders de tono: formal↔casual, serio↔playful, minimal↔bold | ⬜ | Afectan el copy que genera la IA |
| Palabras positivas / negativas de marca | ⬜ | Tags editables. Ejemplo: "premium, exclusivo" / "barato, chino" |
| Preview en tiempo real de cómo queda una creativa con ese brand kit | ⬜ | Mini canvas mock con el creativo de ejemplo |

---

### 1.9 Memoria IA

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| `/projects/[id]/memory` — Gestor de referencias | ⬜ | Lista de items por tipo: creativo referencia / screenshot Meta Ads / copy ejemplo / descripción de estilo |
| Upload de imágenes de referencia | ⬜ | Arrastra o sube. La IA analiza y extrae insights automáticamente |
| Añadir copy de referencia (texto) | ⬜ | Textarea simple. La IA lo usa como ejemplo de tono |
| Activar / desactivar items de memoria | ⬜ | Toggle por item. Solo los activos influyen en la generación |

---

### 1.10 Instrucciones IA

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| `/projects/[id]/ai-settings` — Panel de instrucciones | ⬜ | Textarea libre para instrucciones globales del proyecto |
| Toggles de comportamiento IA | ⬜ | "Incluir precio", "Usar emojis en copy", "Generar CTAs agresivos", etc. |

---

### 1.11 Settings

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| `/dashboard/settings` — Perfil y cuenta | ⬜ | Nombre, email (gestionado por Clerk), avatar |
| Panel de créditos | ⬜ | Créditos restantes, historial de uso, reset mensual |
| Planes y billing | ⬜ | Tabla comparativa free/pro + botón upgrade → Stripe Checkout |
| Conectar Shopify (opcional) | ⬜ | Por proyecto, no global |
| Zona peligrosa — Borrar cuenta | ⬜ | Confirmar con email del usuario |

---

## FASE 2 — BACKEND, BASE DE DATOS Y SERVICIOS

> Objetivo: Conectar toda la UI con datos reales. La app funciona end-to-end.

### 2.1 Base de datos (Supabase)

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| Aplicar migraciones — Crear las 13 tablas | ⬜ | Orden: users → projects → brand_kit → products → batches → creatives → exports |
| Activar RLS en todas las tablas | ⬜ | Cada user solo ve sus datos. Policies por `user_id` y `project_id` |
| Crear Storage Buckets | ⬜ | `creative-exports` (público) + 5 buckets privados (logos, product-images, etc.) |
| Configurar Supabase Realtime | ⬜ | En tabla `batches` y `creatives` para updates en vivo |
| Generar TypeScript types desde schema | ⬜ | `supabase gen types` → `/lib/supabase/types.ts` |
| Crear `lib/supabase/client.ts` y `server.ts` | ⬜ | Client para componentes cliente, server para server components y API routes |

---

### 2.2 Auth + Clerk webhooks

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| `POST /api/webhooks/clerk` — user.created | ⬜ | Insertar en tabla `users` + asignar créditos iniciales + crear proyecto demo |
| `POST /api/webhooks/clerk` — user.deleted | ⬜ | Soft delete o hard delete según decisión de privacidad |
| Sync Clerk → Supabase en cada request | ⬜ | Middleware extrae `clerk_user_id` y lo usa en queries |

---

### 2.3 Extracción de producto (ScrapingBee + OpenAI)

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| `POST /api/scraping/fetch-product` — ScrapingBee | ⬜ | Devuelve HTML limpio de la URL del producto |
| `POST /api/ai/extract-product` — GPT-4o mini | ⬜ | HTML → JSON estructurado (nombre, precio, beneficios, imágenes, reviews) |
| Guardar resultado en tabla `products` | ⬜ | Con `extraction_status` (pending / done / failed) |
| Descarga y upload de imágenes del producto | ⬜ | Descargar imágenes del scraping → subir a Supabase Storage |

---

### 2.4 Procesamiento de imágenes

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| `POST /api/images/remove-bg` — Remove.bg | ⬜ | Producto sin fondo → `product-images-nobg` bucket |
| `POST /api/images/generate-bg` — fal.ai Flux | ⬜ | Generar fondo según brief de la creativa → `generated-backgrounds` bucket |

---

### 2.5 Generación de copy (OpenAI)

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| `POST /api/ai/generate-copy` — Variaciones de copy | ⬜ | Por ángulo (PAIN/BENEFIT/URGENCY/SOCIAL_PROOF/PRICE). Usa brand kit + memoria activa |
| `POST /api/ai/generate-draft` — 1 creativo de prueba | ⬜ | Selecciona template + genera copy para el draft de aprobación |
| Sistema de prompts en `lib/ai/prompts.ts` | ⬜ | Prompts versionados y configurables |
| Context builder `lib/ai/context-builder.ts` | ⬜ | Construye el contexto completo (brand kit + memoria + instrucciones) antes de cada llamada IA |

---

### 2.6 Generación del batch completo

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| `POST /api/ai/generate-batch` — Orquestador | ⬜ | Loop: por cada variación → copy + template + bg → renderiza → guarda en `creatives` |
| Canvas rendering con Fabric.js | ⬜ | Template JSON → canvas → imagen PNG |
| Export rendering server-side (Puppeteer) | ⬜ | Para mayor fidelidad que canvas. A decidir si Fabric o Puppeteer es primary |
| `POST /api/export/render` — Exportar en 4 ratios | ⬜ | Por cada creativo aprobado: 1:1, 4:5, 9:16, landscape → ZIP |
| Actualizar `batches.status` en Realtime | ⬜ | Supabase Realtime notifica al cliente el progreso |

---

### 2.7 Shopify

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| `POST /api/shopify/connect` — Iniciar OAuth | ⬜ | Guardar token en `shopify_connections` (encriptado) |
| `GET /api/shopify/products` — Listar productos | ⬜ | Paginación, búsqueda, sync a tabla `products` |
| Webhook Shopify product.updated | ⬜ | Actualizar datos del producto si cambia en la tienda |

---

### 2.8 Stripe (pagos)

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| Crear productos y precios en Stripe | ⬜ | Free: 20 créditos/mes. Pro: ilimitado. Pack créditos extra |
| Stripe Checkout Session para upgrade | ⬜ | `POST /api/stripe/checkout` |
| `POST /api/webhooks/stripe` — Eventos clave | ⬜ | `checkout.session.completed` / `invoice.paid` / `subscription.deleted` |
| Portal de billing (Customer Portal) | ⬜ | Link a Stripe Portal para gestionar suscripción |
| Sistema de créditos | ⬜ | Consumo por creativa generada. Reset mensual. Pack extra comprables |

---

### 2.9 Resend (emails transaccionales)

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| Template: bienvenida al registrarse | ⬜ | React Email. Incluye CTA al dashboard |
| Template: batch completado | ⬜ | "Tus X creativos están listos" + link directo |
| Template: créditos bajos | ⬜ | Cuando queden <5 créditos → aviso para upgrade |
| Template: factura / confirmación de pago | ⬜ | Triggered por Stripe webhook |
| Template: invitación waitlist → app lanzada | ⬜ | Cuando WAITLIST_MODE pase a false, email masivo a la lista |

---

## FASE 3 — OPTIMIZACIÓN Y SEGURIDAD

> Objetivo: La app es rápida, segura y lista para usuarios reales.

### 3.1 Seguridad

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| Verificar RLS en todas las tablas Supabase | ⬜ | Audit completo: ningún usuario puede ver datos de otro |
| Rate limiting en API routes | ⬜ | Upstash Redis o middleware de Vercel. Límites por user/IP |
| Validación de inputs con Zod | ⬜ | Todos los endpoints validan payload antes de procesar |
| Variables de entorno — audit | ⬜ | Verificar que nada sensible está en `NEXT_PUBLIC_*` |
| Webhook signature verification | ⬜ | Clerk y Stripe webhooks verifican la firma antes de procesar |
| Tokens de Shopify encriptados en DB | ⬜ | AES-256 o similar. Nunca en texto plano |
| Headers de seguridad HTTP | ⬜ | CSP, X-Frame-Options, HSTS en `next.config.mjs` |

---

### 3.2 Performance

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| Optimización de imágenes | ⬜ | Activar Next.js Image Optimization (actualmente desactivado) |
| Caché de respuestas IA frecuentes | ⬜ | Redis para cachear extracciones de URLs ya visitadas |
| Lazy loading de secciones del dashboard | ⬜ | React.lazy + Suspense en componentes pesados |
| Bundle analysis | ⬜ | `@next/bundle-analyzer` para detectar dependencias pesadas |
| Database indexes | ⬜ | Verificar que todos los índices definidos en el schema están creados |
| Paginación en todas las listas | ⬜ | Productos, creativos, batches → nunca traer todo |

---

### 3.3 Monitoreo y errores

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| Error tracking | ⬜ | Sentry (o Vercel Log Drain). A decidir |
| Analytics de producto | ⬜ | Vercel Analytics ya integrado. Evaluar si necesitamos más (Mixpanel / PostHog) |
| Alertas de fallos en generación | ⬜ | Si un batch falla, notificar al usuario + reintentar automáticamente |
| Logs de uso de IA | ⬜ | Registrar tokens consumidos por request para controlar costes |

---

### 3.4 Pre-launch checklist

| Tarea | Estado | Decisiones |
|-------|--------|-----------|
| Cambiar Clerk a production keys | ⬜ | Actualmente con test keys |
| Dominio personalizado en Vercel | ⬜ | forticlaw.com |
| SSL/HTTPS verificado | ⬜ | Automático con Vercel |
| GDPR — Privacy policy + Cookie banner | ⬜ | Privacy policy ya existe. Cookie banner pendiente |
| Test end-to-end del flujo completo | ⬜ | URL → extracción → draft → batch → export |
| Load test con usuarios concurrentes | ⬜ | k6 o similar. Objetivo: 50 usuarios concurrentes sin degradación |
| Cambiar `NEXT_PUBLIC_WAITLIST_MODE` a `false` | ⬜ | El momento del lanzamiento |

---

## COSAS QUE FALTAN Y AÚN NO ESTÁN DECIDIDAS

> Estas son preguntas abiertas que hay que responder antes de construir esa parte.

| Pregunta | Contexto | Urgencia |
|----------|----------|----------|
| ¿Canvas con Fabric.js o Puppeteer como motor primario? | Fabric.js es más flexible pero Puppeteer da más fidelidad. Ambos tienen pros y contras para el caso de exportar 4 ratios | Alta — bloquea fase 2.6 |
| ¿Templates hardcoded o dinámicos desde BD? | ¿Los templates de creativo son JSON guardados en Supabase (editables) o archivos en código? | Alta — afecta el schema |
| ¿Cuántos templates iniciales en el lanzamiento? | Necesitamos definir el catálogo inicial. ¿5? ¿10? ¿Por vertical? | Media |
| ¿Plan Free con marca de agua o sin? | Common en este tipo de apps pero puede frenar conversión | Media |
| ¿Colaboración en equipos (multi-user por proyecto)? | No está en el schema actual. ¿V1 o V2? | Baja — V2 |
| ¿Editor de canvas en el dashboard? | ¿El usuario puede editar el creativo manualmente o solo la app auto-genera? | Media — afecta UX |
| ¿Shopify en V1 o V2? | El flujo funciona con cualquier URL. Shopify nativo añade complejidad. ¿Lo metemos en lanzamiento? | Media |
| ¿Video en V1? | Docs mencionan "video poster". ¿Generamos GIF / video estático o solo imágenes en lanzamiento? | Media — probable V2 |

---

## HISTORIAL DE CAMBIOS AL PLAN

| Fecha | Cambio | Motivo |
|-------|--------|--------|
| 2026-03-15 | Plan inicial creado | Primera versión del roadmap |
| 2026-03-15 | Landing con WAITLIST_MODE toggle implementado | ✅ Completada fase 0 |

---

*Actualiza este documento cada vez que se tome una decisión, se complete una tarea o cambie el rumbo del proyecto.*
