# FUNCTIONALITY — Documento de Funcionalidades

> Versión 1.0 · Marzo 2026 · Forticlaw
> Este documento define qué construimos, por qué existe cada funcionalidad y cómo funciona.

---

## Índice

1. [Auth](#1-auth)
2. [Onboarding](#2-onboarding)
3. [Dashboard principal](#3-dashboard-principal)
4. [Proyectos](#4-proyectos)
5. [Brand Kit](#5-brand-kit)
6. [Extracción de producto (URL / Shopify)](#6-extracción-de-producto)
7. [Flujo de generación](#7-flujo-de-generación)
8. [Canvas Editor](#8-canvas-editor)
9. [Galería de creativos](#9-galería-de-creativos)
10. [Memoria IA](#10-memoria-ia)
11. [Instrucciones IA](#11-instrucciones-ia)
12. [Shopify OAuth](#12-shopify-oauth)
13. [Sistema de créditos](#13-sistema-de-créditos)
14. [Billing (Stripe)](#14-billing-stripe)
15. [i18n — Idiomas](#15-i18n--idiomas)
16. [Emails transaccionales (Resend)](#16-emails-transaccionales)
17. [Templates de creativos](#17-templates-de-creativos)
18. [Export system](#18-export-system)
19. [Platform targeting — Distinción por red social](#19-platform-targeting--distinción-por-red-social)

---

## 1. Auth

**¿Qué es?**
Páginas de registro e inicio de sesión usando Clerk como proveedor de autenticación.

**¿Por qué existe?**
El acceso seguro es el prerequisito de todo. Clerk nos da OAuth social (Google, Apple), magic links, MFA y gestión de sesiones sin implementar auth desde cero. El tiempo que no gastamos en auth lo invertimos en producto.

**¿Cómo funciona?**
- `/sign-in` y `/sign-up` usan los componentes `<SignIn>` y `<SignUp>` de Clerk embebidos en un layout propio (no el hosted de Clerk), manteniendo la estética de la app.
- El middleware de Next.js protege todas las rutas bajo `(app)/*` y redirige a `/sign-in` si no hay sesión válida.
- Post-sign-up: si `onboarding_completed=false` en metadata de Clerk → redirige a `/onboarding`. Si ya completó → `/dashboard`.
- Post-sign-in: siempre redirige a `/dashboard` (el onboarding ya se hizo).

**Decisiones:**
- Layout propio (dark, con logo Forticlaw) para consistencia de marca
- OAuth providers: Google + email/password en V1. Apple en V2.
- Sin número de teléfono obligatorio

---

## 2. Onboarding

**¿Qué es?**
Wizard de 4 pasos que aparece la primera vez que el usuario entra después de registrarse. Guía al usuario para crear su primer proyecto y brand kit básico.

**¿Por qué existe?**
Apps con onboarding guiado tienen 3× más tasa de activación que las que van directo al dashboard vacío. El "aha moment" de Forticlaw es el primer creativo generado — el onboarding acorta ese camino eliminando fricción de setup.

**¿Cómo funciona?**

```
Paso 1 — Nombre del proyecto
  Input: "How do you call your brand or store?" + ejemplo placeholder
  Mínimo: 2 caracteres. No requiere ser el nombre oficial.

Paso 2 — Sector y audiencia
  Select: Fashion · Beauty · Home · Gadgets · Pets · Sports · Food · Other
  Campo libre: "Describe your target audience" (opcional, sugerencias de IA)

Paso 3 — Brand kit básico
  Logo upload (PNG/SVG, opcional)
  Color primario (color picker, opcional — sugerencia automática basada en sector)
  Puede saltarse completamente. Editable después desde Brand Kit.

Paso 4 — Resumen
  Muestra: "Your project [nombre] is ready. Add your first product to start generating ads."
  CTA: "Add your first product →" → va a /dashboard/projects/[id]/products/new
  Opción secundaria: "Go to dashboard" → /dashboard
```

**Reglas:**
- Siempre saltable con "Skip for now" en pasos 2, 3 y 4
- El paso 4 siempre muestra el CTA aunque los pasos anteriores estuvieran vacíos
- `onboarding_completed=true` se marca en metadata de Clerk al llegar al paso 4 (independientemente de si saltó pasos)
- Si el usuario cierra la ventana antes del paso 4, vuelve al onboarding en el siguiente login

---

## 3. Dashboard principal

**¿Qué es?**
La pantalla principal de la app. Muestra los proyectos del usuario, actividad reciente y métricas globales.

**¿Por qué existe?**
Es el "home" al que el usuario vuelve cada vez. Necesita responder en 3 segundos: "¿Qué hice antes? ¿Qué puedo hacer ahora?". Sin un dashboard claro, los usuarios se pierden y abandonan.

**¿Cómo funciona?**

```
Header (fijo en toda la app):
  [☰ mobile] [Breadcrumb: Dashboard] ··· [+ New Creative] [User avatar]
  Nota: el selector de idioma NO está en la topbar — está en /dashboard/settings

Body:
  Sección "Your projects" → cards de proyectos (max 6, "Ver todos" si hay más)
  Sección "Recent activity" → últimas 6 creatividades generadas (thumbnails clickables)
  Métricas rápidas: "Creatives generated this month" / "Credits used" / "Active projects"

Empty state (sin proyectos):
  Ilustración + "Create your first project" CTA
```

**Botón "+ New Creative" (always visible):**
Abre un modal rápido con flujo acelerado:
1. Selector de proyecto (o "Create new project")
2. Shopify product selector O paste URL field
3. "Analyze & generate →" → va al flujo de generación
- Objetivo: de dashboard a primer draft en máximo 45 segundos

---

## 4. Proyectos

**¿Qué es?**
Un proyecto representa una marca o tienda. Es la unidad de aislamiento de brand kit, memoria IA e instrucciones para la IA.

**¿Por qué existe?**
Los dropshippers suelen tener 2–5 tiendas simultáneas. Sin proyectos, el brand kit se mezcla y la IA pierde contexto entre productos de distintas marcas. Los proyectos son la unidad fundamental de personalización de la IA.

**¿Cómo funciona?**

```
/dashboard/projects → Lista de todos los proyectos
  Cards con: nombre, sector, logo, nº creativos, última actividad
  Acciones: "Open" (→ vista proyecto) | "+ Product" (→ nuevo producto) | "Settings" (→ brand kit)

/dashboard/projects/new → Wizard de creación
  Paso 1: Nombre + sector + descripción (mismos campos que onboarding)
  Paso 2: Visual identity (logo + colores + fuentes)
  Paso 3: Brand tone (sliders formal↔casual, serio↔playful, minimal↔bold)
  Paso 4: Shopify connection (opcional)
  Paso 5: Summary + "Create project"

/dashboard/projects/[id] → Vista de proyecto con pestañas:
  Pestaña Products:     lista de productos + CTA añadir producto
  Pestaña Creatives:    galería de todos los creativos del proyecto
  Pestaña Brand Kit:    editor visual de identidad
  Pestaña Memory:       gestor de memoria IA
  Pestaña AI Settings:  instrucciones IA del proyecto
```

**Reglas:**
- Free plan: máximo 1 proyecto activo
- Pro plan: hasta 5 proyectos
- Scale plan: ilimitado
- Eliminar proyecto: confirmación con modal + nombre del proyecto escrito a mano
- Archivar proyecto: lo oculta del dashboard pero conserva los datos

---

## 5. Brand Kit

**¿Qué es?**
El conjunto de parámetros visuales y de tono que definen la identidad de una marca en Forticlaw. Se aplica automáticamente a todos los creativos generados en ese proyecto.

**¿Por qué existe?**
Sin brand kit, todos los creativos salen genéricos e intercambiables con los de cualquier otro usuario. El brand kit es lo que hace que Forticlaw genere creativos que "parecen suyos". Es el corazón del producto y el principal argumento de retención.

**¿Cómo funciona?**

```
/dashboard/projects/[id]/brand-kit

Sección 1 — Visual identity:
  Logo: upload PNG/SVG. Preview circular + rectangular.
  Colores: primary, secondary, accent, background. Color picker + código hex.
    → "Extract from logo" auto-extrae la paleta del logo subido
    → "AI suggest" sugiere 3 paletas según el sector del proyecto
  Tipografías: headline font + body font. Lista curada de 20 Google Fonts compatibles.
    → "AI suggest" sugiere 2–3 pairings según sector

Sección 2 — Brand tone:
  Sliders (range 1–10):
    Formal ← → Casual
    Serious ← → Playful
    Minimal ← → Bold
  La posición de los sliders se traduce a instrucciones de tono para la IA.
  La IA pre-posiciona los sliders según el sector al crear el proyecto.

Sección 3 — Vocabulary:
  Words to ALWAYS use: tag input (ej: "premium", "exclusive", "handmade")
  Words to NEVER use: tag input (ej: "cheap", "fast", "generic")
  Ambas listas se inyectan como restricciones en cada prompt de generación.

Vista previa:
  Mini canvas mock que muestra cómo quedaría un creativo de ejemplo con los valores actuales.
  Se actualiza en tiempo real al cambiar colores/fuentes.
  Nota: en Fase 1 (mock), la preview es una representación estática.
```

**Reglas:**
- Los cambios en brand kit aplican a las generaciones futuras, no retroactivamente
- Siempre hay valores por defecto (para que la app funcione sin setup manual)
- El logo es siempre opcional

---

## 6. Extracción de producto

**¿Qué es?**
El usuario pega una URL de producto (Shopify, AliExpress, Amazon, cualquier tienda) o selecciona un producto de su tienda Shopify conectada. La IA extrae automáticamente todos los datos relevantes.

**¿Por qué existe?**
Es el diferenciador más visible respecto a Canva. El usuario no tiene que escribir nada sobre su producto — la información ya está en su tienda. La extracción automática es el primer "wow moment" que convierte a los escépticos.

**¿Cómo funciona?**

```
Si Shopify conectado:
  Dropdown de productos de la tienda + búsqueda
  Los datos se importan directamente via API de Shopify (sin scraping)

Si URL manual:
  Campo de texto "Paste your product URL"
  Botón "Analyze with AI" → inicia el proceso
  Pasos visibles con progress animation:
    ✓ "Fetching page..." (ScrapingBee)
    ✓ "Extracting product data..." (GPT-4o mini)
    ✓ "Processing images..."
    ✓ "Done! Review your product below."

Pantalla de revisión del producto extraído:
  Todos los campos son editables antes de continuar:
  - Nombre del producto
  - Precio original + precio de oferta
  - 3–5 beneficios (tags editables)
  - Problema que resuelve (1 frase)
  - Grid de imágenes extraídas → el usuario selecciona cuáles usar
  - Upload de imágenes adicionales

CTA: "Continue to campaign settings →"
```

**Reglas:**
- Si la extracción falla, se muestra un formulario manual con los mismos campos
- Re-analizar la URL es gratuito (no consume créditos)
- Las imágenes seleccionadas se suben al Storage de Supabase al avanzar

---

## 7. Flujo de generación

**¿Qué es?**
El flujo completo desde que el usuario tiene los datos del producto hasta que obtiene el batch de creativos descargable. Se divide en 4 fases con estados visuales claros.

**¿Por qué existe?**
Este es el core del producto. Todo lo demás (brand kit, memoria, instrucciones) existe para alimentar este flujo. La separación draft → batch es la decisión de UX más importante: el usuario aprueba antes de gastar créditos.

**¿Cómo funciona?**

```
FASE 1 — Configuración de campaña:
  Plataformas destino (nuevo — ver Sección 19):
    ☑ Meta (Facebook + Instagram)  ← checked por defecto
    ☑ TikTok
    ☐ Pinterest
    ☐ Google Display
  Objetivo: Sale · Traffic · Retargeting · Brand awareness · Launch
  Copy angles (multi-select):
    Pain · Benefit · Urgency · Social proof · Price · Story · Curiosity
    Default: "AI picks the best angles" (recomendado)
  Número de variaciones: 3 / 5 / 8 / 12 (default: 5)
  Tipos de creativo: Static · Story vertical · Carousel · Copy only
  Idioma del copy: English · Spanish · Both (default: proyecto setting)

FASE 2 — Draft automático (~15s):
  Loading animation con pasos visibles:
    "Removing product background..."
    "Analyzing brand kit..."
    "Generating copy..."
    "Building your draft..."
  Resultado: 1 creativo completo (producto + brand colors + logo + copy)
  Panel IA al lado: explica las decisiones tomadas
    "I chose the PAIN angle because this product solves a physical problem."
    "I highlighted the 56% discount because price contrast drives clicks."
    "I applied your casual tone and excluded your blacklist words."

FASE 3 — Revisión y ajuste del draft:
  4 acciones disponibles (sin coste, repetibles ilimitado):
  ✅ "Approve & generate batch" → Fase 4
  ✏️ "Edit copy manually" → edición inline del texto del creativo
  🔄 "Adjust with AI" → input libre: "Make it more aggressive on price" → regenera solo el draft
  🎨 "Change template" → grid de templates alternativos (mismo producto/copy, distinto layout)

FASE 4 — Generación del batch (~30–60s):
  Confirmación: "This will use X credits. You have Y remaining."
  Progress bar en tiempo real (Supabase Realtime)
  Estimación de tiempo visible
  La IA genera en paralelo:
    N variaciones × (diferentes angles × templates) × brand kit
    Cada variación se renderiza en los 4 formatos de ratio
  Resultado: galería de N × 4 creativos

FASE 5 — Resultados:
  Grid/masonry de todos los creativos generados
  Cada card: thumbnail + ángulo de copy + selector de ratio
  Acciones por creativo: ver full size · editar en canvas · duplicar · eliminar · regenerar variación
  Bulk: seleccionar todos · descargar selección · descargar todo como ZIP
```

**Reglas:**
- El draft NO consume créditos (ni las iteraciones del draft)
- 1 creativo generado en el batch = 1 crédito (independientemente de los 4 ratios)
- Si el batch falla a mitad: los créditos de los creativos no generados se devuelven
- El usuario puede volver a editar el draft sin penalización

---

## 8. Canvas Editor

**¿Qué es?**
Editor visual basado en Fabric.js que permite al usuario hacer ajustes finos a un creativo generado por la IA.

**¿Por qué existe?**
La IA no siempre acierta al 100%. El editor existe para el 20% de casos donde el usuario quiere un ajuste fino sin volver a generar. Sin editor, el flujo es completamente inflexible y el usuario tendría que regenerar (gastando crédito) para cada pequeño cambio.

**¿Cómo funciona?**

```
Se abre desde la galería: "Edit in canvas" en cualquier creativo

Capabilities en V1:
  ✓ Arrastrar y reposicionar cualquier elemento
  ✓ Redimensionar con aspect ratio lock opcional
  ✓ Editar texto inline (click → tipo directamente)
  ✓ Cambiar font size / weight / color por elemento de texto
  ✓ Swapear imagen del producto (upload o elegir de las extraídas)
  ✓ Cambiar color de fondo
  ✓ Mover posición del logo
  ✓ Undo/redo (Ctrl+Z / Ctrl+Y)
  ✓ Export del estado editado (sobreescribe el creativo original)

NOT in V1:
  ✗ Añadir nuevos elementos (shapes, icons, stickers)
  ✗ Animaciones o video
  ✗ Multi-página
  ✗ Filtros fotográficos avanzados

Toolbar layout:
  [Undo] [Redo] | [Select] [Text] | [Zoom] | [Export] [Save]
```

**Motor:** Fabric.js en browser. Export via `canvas.toDataURL('image/png')`.

**Reglas:**
- Editar un creativo NO consume créditos adicionales
- Los cambios se guardan automáticamente (autosave cada 30 segundos)
- El canvas siempre trabaja en el formato 1:1. Los otros ratios se derivan server-side al exportar.

---

## 9. Galería de creativos

**¿Qué es?**
Vista de grid/masonry de todos los creativos generados en un proyecto o en un batch específico.

**¿Por qué existe?**
Los usuarios generan 5–12 creativos por batch y múltiples batches por producto. Sin galería navegable, no pueden encontrar qué ya generaron y acaban regenerando (gasto innecesario de créditos). La galería también es el lugar donde el usuario toma las decisiones de qué usar en sus campañas.

**¿Cómo funciona?**

```
/dashboard/projects/[id]/creatives

Filtros:
  Por batch (selector dropdown)
  Por ángulo de copy (Pain / Benefit / Urgency / etc.)
  Por formato (1:1 / 4:5 / 9:16 / landscape)
  Por estado (todos / aprobados / en edición)

Cards (hover state muestra acciones):
  Thumbnail del creativo
  Badge del ángulo de copy
  Badge del template usado
  Fecha de generación
  Acciones en hover:
    [View] [Edit in canvas] [Download] [Duplicate] [Delete]

Selección múltiple:
  Checkbox en hover de cada card
  Barra de acciones bulk al seleccionar ≥1:
    "Download selected" (ZIP con todos los ratios)
    "Delete selected"
    "Approve selected"

Detalle de un creativo (click en card):
  Panel lateral o modal:
    Preview grande con selector de ratio (1:1 / 4:5 / 9:16 / landscape)
    Copy completo (headline + body + CTA) con botón "Copy to clipboard"
    Metadata: batch, ángulo, template, fecha
    Acciones: "Edit in canvas" | "Download all formats" | "Regenerate variation"
```

---

## 10. Memoria IA

**¿Qué es?**
Sistema de referencias visuales y de copy que el usuario sube por proyecto. La IA las analiza una vez y las usa como contexto en todas las generaciones futuras de ese proyecto.

**¿Por qué existe?**
El brand kit captura identidad visual estructurada. La memoria IA captura estilo y preferencias que el usuario no puede verbalizar con campos de formulario. "Quiero que mis ads se parezcan a este ejemplo" es más fácil de mostrar que de describir.

**¿Cómo funciona?**

```
/dashboard/projects/[id]/memory

Tipos de memoria:

  1. Reference creatives (imágenes JPG/PNG)
     → Upload de ads que le gustaron al usuario
     → La IA los analiza con GPT-4o Vision y extrae: composición, densidad visual,
       balance texto/imagen, tratamiento del color, estilo fotográfico
     → Guardado como JSON descriptivo en DB (no se re-analiza en cada generación)
     → Máximo: 5 imágenes en Free / 20 en Pro

  2. Meta Ads screenshots (imágenes)
     → Screenshots de ads que el usuario ha corrido con buenos resultados
     → Campo adicional: "Context" (ej: "Este ad tuvo 3.2x ROAS en retargeting")
     → Mismo análisis que reference creatives + notas de contexto de rendimiento

  3. Copy examples (texto)
     → Textarea: el usuario pega ejemplos de copy que le gustaron
     → La IA extrae: longitud media, estructura (pregunta/respuesta, lista, story),
       nivel de agresividad en precio, uso de emojis, vocabulario recurrente
     → Guardado como análisis de estilo en DB

  4. Written style description (texto libre)
     → Textarea: descripción directa de cómo quiere que la IA se comporte
     → Ej: "My audience are women 45+. Warm, conversational tone. No anglicisms."
     → Se inyecta directamente en el system prompt de generación

Lista de items de memoria:
  Type badge | Thumbnail (si es imagen) | Preview del análisis | Fecha | Toggle activo/inactivo | [Remove]

Toggle activo/inactivo:
  Solo los items activos se inyectan en el contexto de generación
  "Clear all memory" borra todos los items del proyecto
```

**Reglas:**
- Subir imágenes a memoria no consume créditos (solo la generación de creativos)
- El análisis de visión se hace una vez al subir, no en cada generación
- El usuario puede ver el análisis generado ("Esto es lo que la IA aprendió de esta imagen")

---

## 11. Instrucciones IA

**¿Qué es?**
Panel de instrucciones a texto libre + toggles de comportamiento que el usuario configura por proyecto. Se inyectan en cada generación de ese proyecto.

**¿Por qué existe?**
Los usuarios avanzados quieren control fino sobre el comportamiento de la IA sin que eso cambie el brand kit visual. Instrucciones como "Siempre menciona envío gratis", "Nunca uses anglicismos" o "Mis clientes responden mejor al storytelling" no caben en campos estructurados.

**¿Cómo funciona?**

```
/dashboard/projects/[id]/ai-settings

Sección 1 — Free text instructions:
  Label: "Tell the AI how to behave for this project"
  Textarea grande (500 chars máximo)
  Placeholder con ejemplos:
    "My brand targets women over 50. Use warm, conversational tone.
     Always mention free shipping. Avoid anglicisms. My customers
     respond to emotional storytelling."
  Se inyecta directamente en el system prompt como [PROJECT AI INSTRUCTIONS]

Sección 2 — Quick toggles:
  ✓ Always include crossed-out original price (when discount exists)
  ✓ Always include urgency CTA ("Limited stock", "Today only")
  ✓ Always include review count ("4.8★ from 2,400+ reviews")
  ✗ Never show price in copy
  ✗ Never use emojis in copy
  ✓ Generate copy in English
  ✓ Generate copy in Spanish
  ✓ Generate copy in both (EN + ES)

Sección 3 — Default output settings:
  Default formats: checkboxes 1:1 / 4:5 / 9:16 / landscape (1.91:1)
  Default number of variations: slider 3 / 5 / 8 / 12
  Default creative types: static / story / carousel
```

---

## 12. Shopify OAuth

**¿Qué es?**
Integración nativa con Shopify que permite al usuario conectar su tienda y elegir productos directamente en Forticlaw sin copiar URLs.

**¿Por qué existe?**
El target principal son dropshippers de Shopify. Reducir el paso de pegar URL (aunque parezca pequeño) elimina fricción en el flujo más repetido. Además, los datos de Shopify son más limpios y completos que cualquier scraping externo.

**¿Cómo funciona?**

```
Conexión (desde Brand Kit → Integrations o durante el wizard de proyecto):
  Botón "Connect Shopify store"
  → Redirige a OAuth de Shopify con los permisos mínimos necesarios
    (read_products, read_product_listings)
  → El token se guarda cifrado (AES-256) en DB
  → Confirmación: "Connected: mi-tienda.myshopify.com"

En el flujo de extracción de producto:
  Aparece tab "From Shopify" si hay conexión activa
  Buscador de productos con: nombre + imagen + precio
  Paginación (no traemos todo el catálogo de una)
  Al seleccionar → los datos se importan directamente via API de Shopify

Gestión:
  /dashboard/projects/[id]/brand-kit → pestaña Integrations
  "Disconnect" elimina el token de DB (no de Shopify)
  "Re-authenticate" si el token expira
```

**Reglas:**
- La conexión Shopify es por proyecto, no global (diferentes tiendas para diferentes proyectos)
- Los tokens de Shopify NUNCA se guardan en texto plano en DB
- Si la conexión falla o el token expira, el flujo fallback es URL manual automáticamente

---

## 13. Sistema de créditos

**¿Qué es?**
La unidad de consumo de Forticlaw. Cada creativo generado en el batch final cuesta 1 crédito. El draft y las iteraciones son gratuitas.

**¿Por qué existe?**
El modelo de créditos alinea el coste para el usuario con el valor recibido (solo paga por los creativos que aprueba). Es más honesto que cobrar por "usos de IA" o por re-generaciones, y resuelve el problema #1 de los competidores.

**¿Cómo funciona?**

| Acción | Coste en créditos |
|--------|-------------------|
| Generar 1 creativo en el batch aprobado | 1 crédito |
| Regenerar el draft (iteración) | 0 créditos |
| Re-analizar URL de producto | 0 créditos |
| Analizar imagen de memoria | 0 créditos |
| Editar en canvas | 0 créditos |
| Duplicar creativo existente | 0 créditos |

**Planes:**

| Plan | Precio | Créditos/mes | Proyectos | Templates |
|------|--------|--------------|-----------|-----------|
| Free | $0 | 5 | 1 | 10 básicos |
| Pro | $29/mes | 100 | 5 | Todos (30+) |
| Scale | $79/mes | Ilimitados | Ilimitados | Todos + priority |

**Cuando se agotan los créditos:**
- Soft block: upsell modal al intentar generar batch
- Free users: "Upgrade to Pro" con lista de beneficios
- Pro users: opción de comprar pack extra ($9 por 50 créditos adicionales sin cambiar de plan)

**Reglas:**
- Los créditos se resetean el día 1 de cada mes (no se acumulan)
- Los packs de créditos extra no expiran (se consumen antes de los del plan)
- Los créditos de un batch fallido se devuelven automáticamente

---

## 14. Billing (Stripe)

**¿Qué es?**
Integración con Stripe para gestionar planes de suscripción, packs de créditos extra y el portal de billing del usuario.

**¿Por qué existe?**
Monetización. Sin pagos, no hay negocio. Stripe es el estándar de la industria y nos da webhooks fiables, Customer Portal nativo y gestión de subscriptions sin implementar nada desde cero.

**¿Cómo funciona?**

```
Upgrade a Pro/Scale:
  Desde /dashboard/settings/billing → botón "Upgrade"
  → Stripe Checkout Session (hosted)
  → Webhook checkout.session.completed → actualiza plan en DB + asigna créditos
  → Confirmación email via Resend

Pack de créditos extra:
  Solo disponible para usuarios Pro (no Free)
  Cobro único ($9 por 50 créditos)
  Sin cambio de plan ni ciclo de facturación

Customer Portal:
  Botón "Manage subscription" → Stripe Customer Portal
  El usuario puede: cambiar plan / cancelar / actualizar tarjeta / ver historial

Webhooks procesados:
  checkout.session.completed  → activar plan / asignar créditos
  invoice.paid                → renovación mensual / reset créditos
  customer.subscription.deleted → downgrade a Free
  payment_intent.payment_failed → notificación al usuario
```

**Reglas:**
- Cancel anytime: no penalizaciones por cancelar antes del fin del ciclo
- El plan sigue activo hasta el final del período pagado tras cancelar
- Billing completamente transparente (sin auto-renews trampa)

---

## 15. i18n — Idiomas

**¿Qué es?**
Soporte de la app en dos idiomas: inglés (primario) y español. Incluye tanto la UI de la app como el copy de los creativos generados.

**¿Por qué existe?**
El target principal son dropshippers de España y LATAM. Ningún competidor directo hace bien el mercado hispanohablante. El inglés como primario da credibilidad internacional; el español como opción captura el mercado LATAM que prefiere operar en su idioma.

**¿Cómo funciona?**

```
Idioma de la UI:
  Librería: next-intl
  Archivos: /messages/en.json (primario) + /messages/es.json
  Persistencia: localStorage + cookie
  Selector: SOLO en /dashboard/settings (no en la topbar)
  Decisión de diseño: la topbar es para acciones frecuentes (+ New Creative, avatar).
  El idioma es una preferencia de cuenta — va en Settings, no en la barra de navegación.

Idioma del copy de los creativos:
  Opción separada del idioma de la UI (independiente)
  Configurado por proyecto en AI Settings:
    → English only
    → Spanish only
    → Both (genera headline/copy en los dos idiomas, 2 archivos por creativo)
  La IA adapta no solo el idioma sino el registro cultural
    (ej: "shipping gratis" en español, no "free shipping" traducido literal)
```

**Reglas:**
- Un usuario puede tener la UI en inglés y generar copy en español (o viceversa)
- El idioma de los creativos se hereda del proyecto setting, pero se puede sobrescribir por generación
- Todos los strings de la UI que aparecen al usuario deben estar en ambos archivos de mensajes

---

## 16. Emails transaccionales

**¿Qué es?**
Sistema de emails automáticos enviados en los momentos clave del ciclo de vida del usuario, usando Resend + React Email.

**¿Por qué existe?**
Los emails transaccionales son el canal de comunicación más fiable. Un email bien ejecutado en el momento correcto (primer creativo generado, créditos bajos) puede ser la diferencia entre un usuario activo y uno churneado.

**Emails en V1:**

| Trigger | Asunto | Contenido |
|---------|--------|-----------|
| Sign up completado | "Welcome to Forticlaw" | Quick start guide + CTA al dashboard |
| Primer proyecto creado | "Your brand kit is ready" | Tips para mejores resultados + CTA añadir producto |
| Primer creativo generado | "Your first ad is ready 🎯" | Felicitación + tips para mejores resultados + CTA a la galería |
| Créditos al 20% restante | "You're running low on credits" | Warning + upgrade CTA + beneficios del Pro |
| Créditos agotados | "You've used all your credits" | Upgrade prompt + comparativa Free vs Pro |
| Subscription activa | "You're now on [Pro/Scale]" | Confirmación + créditos disponibles + CTA |
| Subscription cancelada | "We're sorry to see you go" | Offboarding + feedback request + "Come back anytime" |
| Waitlist signup | "You're on the list 🎉" | Confirmación + posición en la lista |
| Launch (WAITLIST_MODE → false) | "Forticlaw is live — you're in" | Email masivo a toda la lista waitlist |

---

## 17. Templates de creativos

**¿Qué es?**
Colección de 30 templates prediseñados para distintos tipos de ads de dropshipping. Definidos en JSON, renderizados con Fabric.js.

**¿Por qué existe?**
Los templates son la estructura visual sobre la que la IA coloca el contenido de cada producto. Sin templates, la IA tendría que diseñar desde cero, lo que sería inconsistente e impredecible. Los templates garantizan salidas profesionales y conversion-optimized.

**¿Cómo funciona?**

```
Formato del template (JSON):
  {
    "id": "before-after-01",
    "name": "Before / After — Split",
    "category": "before-after",
    "preview_url": "/templates/before-after-01.png",
    "plan_tier": "free" | "pro",
    "slots": {
      "product_image": { "x", "y", "width", "height", "fit" },
      "headline": { "x", "y", "width", "fontSlot": "headline", "defaultSize": 32 },
      "body": { "x", "y", "width", "fontSlot": "body", "defaultSize": 16 },
      "cta": { "x", "y", "width", "height", "style": "button" },
      "price": { "x", "y", "visible": true },
      "logo": { "x", "y", "width", "height" },
      "badge": { "x", "y", "text": "56% OFF" }
    },
    "aspect_ratios": ["1:1", "4:5", "9:16", "1.91:1"]
  }

Ubicación: /templates/[nombre].json en el repo
La IA selecciona el template basándose en: categoría del producto + objetivo de campaña + copy angle
El usuario puede sobreescribir vía "Change template" en la revisión del draft
```

**Catálogo MVP (30 templates):**
- Before/After: 6 templates
- Problem → Solution: 5 templates
- Price reveal / discount: 5 templates
- UGC-style / testimonial: 4 templates
- Product feature highlight: 4 templates
- Urgency / scarcity: 3 templates
- Lifestyle / aspirational: 3 templates

**Reglas:**
- 10 templates básicos disponibles en Free (uno por categoría)
- Todos los templates en Pro y Scale
- Todos los templates tienen los 4 ratios disponibles

---

## 18. Export system

**¿Qué es?**
Sistema que convierte los creativos aprobados en archivos PNG/JPG descargables, organizados por plataforma de destino y ratio.

**¿Cómo funciona?**

```
Ratios soportados (actualizado con plataformas):
  1:1     (1080×1080px)  → Meta Feed, Pinterest, Google Display
  4:5     (1080×1350px)  → Meta Feed portrait (mejor alcance en Instagram)
  9:16    (1080×1920px)  → Meta Stories/Reels, TikTok In-Feed
  2:3     (1000×1500px)  → Pinterest Standard Pin ← NUEVO en V1.1
  1.91:1  (1200×628px)   → Google Display, Meta Link Ads

Proceso:
  1. Canvas Fabric.js renderiza en el ratio nativo de cada plataforma
  2. Safe zones aplicadas según la plataforma (TikTok: 130px top/bottom)
  3. Export: canvas.toDataURL('image/png') → buffer → Supabase Storage
  4. ZIP assembly: estructura de carpetas por plataforma

  Si se generó para Meta únicamente:
    /meta/creative-name/feed_1x1.png
    /meta/creative-name/feed_4x5.png
    /meta/creative-name/stories_9x16.png

  Si se generó para múltiples plataformas:
    /meta/creative-name/feed_1x1.png, feed_4x5.png, stories_9x16.png
    /tiktok/creative-name/infeed_9x16.png
    /pinterest/creative-name/standard_2x3.png, square_1x1.png
    /google/creative-name/landscape_1.91x1.png, square_1x1.png

Opciones de descarga:
  Creativo individual → ZIP con todos los ratios de sus plataformas
  Selección múltiple → ZIP organizado por plataforma
  Batch completo → ZIP completo con toda la estructura

Calidad: 72 DPI para Meta/TikTok/Pinterest, 96 DPI para Google Display
Formato: PNG (default) o JPG (archivos más pequeños, útil para Google)
```

---

## 19. Platform targeting — Distinción por red social

**¿Qué es?**
Sistema que permite al usuario seleccionar las plataformas de destino de sus creativos antes de generar. Forticlaw adapta automáticamente los ratios, los límites de copy, la estructura visual y las zonas seguras según cada plataforma.

**¿Por qué existe?**
Cada red social tiene especificaciones técnicas, algoritmos de distribución y expectativas visuales radicalmente diferentes. Un creativo que funciona en Meta Feed falla en TikTok porque TikTok penaliza el contenido "publicitario polished" en favor del estilo UGC nativo. Pinterest requiere un ratio 2:3 que no existe en los 4 ratios actuales. Google Display necesita composiciones legibles a 300×250px. Sin distinción por plataforma, el usuario recibe creativos genéricos que no están optimizados para ningún canal específico — exactamente el problema que tienen AdCreative.ai y Predis.ai.

**Plataformas soportadas en V1:**

| Plataforma | Subcanales | Ratios principales | Stilo visual esperado |
|-----------|-----------|-------------------|----------------------|
| **Meta** | Facebook Feed, Instagram Feed, Stories, Reels | 1:1, 4:5, 9:16 | Limpio, producto protagonista, texto con CTA/precio |
| **TikTok** | In-Feed Ads, Spark Ads | 9:16 | UGC nativo, hook en primeros 3s, texto superpuesto |
| **Pinterest** | Standard Pin, Shopping Pin | 2:3 (nuevo), 1:1 | Lifestyle/aspiracional, poca texto, alta calidad visual |
| **Google Display** | Responsive Display Ads, Standard | 1.91:1, 1:1 | Simple, legible a tamaño pequeño, CTA claro |

**Plataformas V2 (roadmap):** Snapchat, YouTube Shorts, X/Twitter

---

### Especificaciones técnicas por plataforma (referencia para el sistema de generación)

#### META (Facebook + Instagram)
```
Formatos de imagen:
  Feed (Facebook + Instagram):  1:1 (1080×1080), 4:5 (1080×1350) ← mejor alcance
  Stories / Reels:               9:16 (1080×1920) ← full-screen vertical

Límites de archivo:
  Imagen: máx 30MB (JPG/PNG)
  Video: máx 4GB

Límites de copy:
  Primary text:    125 chars visibles (se trunca con "... más")
  Headline:        40 chars
  Description:     30 chars (solo en algunos placements)
  CTA:             botón estándar de dropdown (Shop Now, Learn More, etc.)

Zonas seguras (Safe zones):
  Stories/Reels: reservar 250px top y bottom para UI de Instagram
  Feed: sin zona segura crítica, pero texto en zona central

Overlay de texto:
  Meta eliminó la regla del 20% en 2021, pero el algoritmo sigue
  favoreciendo creativos con menos texto. Guía: máx 20% del área.

Características especiales:
  Advantage+ Creative: Meta puede modificar el creativo automáticamente
  (añadir marcos, variantes de color). Opción en Campaign Settings.
  Dynamic Creative: múltiples assets → Meta los combina automáticamente
  Carousel: 2–10 tarjetas, cada una 1:1
```

#### TIKTOK
```
Formatos:
  In-Feed Ads:    9:16 (1080×1920) ← formato principal
  Square:         1:1 (720×720) ← soporte secundario
  Landscape:      16:9 (1280×720) ← para ciertas superficies

Límites de archivo:
  Video: máx 500MB
  Duración: 5–60s (In-Feed), hasta 60s Branded
  Imagen: máx 100KB por frame

Límites de copy:
  Caption/texto del ad: 12–100 chars (EN) / 12–150 chars (JPN)
  No hay headline separado en In-Feed — el texto va como caption

Zonas seguras — CRÍTICO:
  Reservar 130px (12%) en el BOTTOM: username, descripción, música, CTA nativo
  Reservar 130px (12%) en el TOP: barra de estado
  Zona activa: 130px – 1790px (de 1920px total)
  Texto, logos y CTAs deben estar en la zona central activa

Estilo visual que funciona:
  × EVITAR: look "publicitario" con logos grandes y texto polished
  ✓ USAR: estilo UGC (User-Generated Content) — parece grabado por un creador
  ✓ USAR: hook de texto en primeros 3 segundos ("POV:", "This changed my life", etc.)
  ✓ USAR: subtítulos/captions en pantalla (texto superpuesto animado)
  ✓ USAR: colores vibrantes, high contrast en el frame inicial
  El algoritmo de TikTok da prioridad al Watch Time → el hook visual es crítico

Características especiales:
  Spark Ads: impulsar un post orgánico existente como ad (requiere cuenta TikTok)
  TopView: primer video mostrado al abrir app, hasta 60s
  TikTok Shop: para sellers con tienda en TikTok
```

#### PINTEREST
```
Formatos:
  Standard Pin:    2:3 (1000×1500) ← FORMATO DOMINANTE, muy diferente de Meta
  Square Pin:      1:1 (1000×1000)
  Video Pin:       2:3 o 1:1, 4s–15min

Límites de archivo:
  Imagen: máx 20MB (PNG/JPG)
  Video: máx 2GB

Límites de copy:
  Title:        100 chars (se muestra en el feed)
  Description:  500 chars (se usa para SEO en Pinterest Search)
  CTA:          texto libre del campo + botón nativo

Zonas seguras:
  Bottom right: el botón "Save" de Pinterest puede solapar 60×60px
  Evitar texto crítico en bottom-right de la imagen

Estilo visual:
  × EVITAR: texto agresivo de precio/descuento ("¡OFERTA!")
  × EVITAR: composición apretada con muchos elementos
  ✓ USAR: fotografía de alta calidad, lifestyle, aspiracional
  ✓ USAR: paletas de color suaves/estéticas, bien curadas
  ✓ USAR: poca o ninguna superpoisición de texto (la imagen habla sola)
  ✓ USAR: description rico en keywords (Pinterest es un motor de búsqueda)
  El usuario de Pinterest está en modo descubrimiento, no compra reactiva

Características especiales:
  Shopping Ads: conectar catálogo de productos → Pinterest genera pins automáticos
  Idea Pins: formato multi-página (stories), no enlaza externamente
  Pinterest Lens: search visual — imágenes con alta calidad visual rankean mejor
```

#### GOOGLE DISPLAY ADS
```
Formatos (Responsive Display Ads — el sistema actual de Google):
  Google recibe múltiples assets y los ensambla automáticamente:
  - Imágenes landscape: 1.91:1 mín 1200×628 (recomendado)
  - Imágenes cuadradas: 1:1 mín 1200×1200 (recomendado)
  - Logo cuadrado: 1:1, mín 128×128
  - Logo landscape: 4:1, mín 512×128
  El sistema genera combinaciones para los cientos de formatos de banner del GDN

Límites de archivo: máx 5MB por imagen

Límites de copy (Responsive Display):
  Headlines: hasta 5, máx 30 chars cada uno
  Long headline: 1, máx 90 chars
  Descriptions: hasta 5, máx 90 chars cada uno
  Business name: máx 25 chars
  Google testa combinaciones y optimiza automáticamente

Estilo visual:
  × EVITAR: composiciones complejas (el ad se muestra en cientos de tamaños)
  ✓ USAR: fondo sólido o simple (la imagen debe funcionar recortada)
  ✓ USAR: producto centrado y grande, claramente visible
  ✓ USAR: contraste alto, legibilidad en tamaño pequeño (300×250 es el más común)
  ✓ USAR: la imagen debe funcionar SIN texto (Google puede ensamblarla sin copy)
  La imagen landing page debe coincidir con el creativo (relevance score)

Características especiales:
  Dynamic Display Ads: conectar feed de productos → Google genera creativos automáticamente
  Smart Display: Google gestiona todo (assets, targets, bids)
  Performance Max: cross-channel con assets de Display
```

---

### Cómo funciona la selección de plataformas en el flujo

```
FASE 1 — Configuración de campaña (actualización):
  Nueva sección "Target platforms" (antes de los copy angles):

  Checkboxes con iconos:
  ☑ Meta (Facebook + Instagram)     ← checked por defecto
  ☑ TikTok
  ☐ Pinterest
  ☐ Google Display

  Al seleccionar una plataforma:
  → El sistema activa los ratios correspondientes automáticamente:
    Meta → 1:1, 4:5, 9:16
    TikTok → 9:16 (o 1:1 como secundario)
    Pinterest → 2:3, 1:1
    Google → 1.91:1, 1:1
  → Se muestran los límites de copy activos (el más restrictivo de todas las seleccionadas)
  → Se activa el modo de estilo correspondiente en el prompt de generación

  Si se seleccionan múltiples plataformas:
  → Para plataformas que comparten ratio (ej: Meta 9:16 y TikTok 9:16):
    Se genera 1 imagen base + variante de copy/estilo por plataforma
  → Para plataformas con ratio único (ej: Pinterest 2:3):
    Se genera una versión nueva en ese ratio

NUEVA SECCIÓN en FASE 1 — "Platform-specific adjustments" (expandible):
  Para Meta: toggle "Enable Advantage+ creative variations"
  Para TikTok: toggle "UGC-style overlay text" + "Add hook text frame"
  Para Pinterest: toggle "Keyword-rich description (SEO)"
  Para Google: toggle "Multiple headline variants for A/B"
```

---

### Adaptaciones de copy por plataforma

La IA adapta la estructura y tono del copy según la plataforma destino:

| Elemento | Meta | TikTok | Pinterest | Google Display |
|---------|------|--------|-----------|----------------|
| Headline | Beneficio + urgencia ("Get 50% off today") | Hook + engagement ("POV: you found...") | Descriptivo + aspiracional ("The bag that...") | Conciso + CTA ("Shop Sale — 50% Off") |
| Body | Beneficio principal + prueba social | No existe (caption es el body) | Keywords + descripción de producto | Breve (90 chars max) |
| CTA visible | "Shop Now", "Get Yours" en imagen | Superpuesto en el video con arrow | Minimal o ninguno en imagen | "Shop Now" claro |
| Emojis | Moderado (1–2 relevantes) | Abundante (estilo nativo) | Ninguno (aesthetic) | Ninguno |
| Límite operativo | 125 chars primary | 100 chars | 100 chars title | 30 chars headline |

---

### Export organizado por plataforma

```
Estructura del ZIP actualizada:
  /batch-[id]/
    /meta/
      /creativo-01/
        feed_1x1.png          (1080×1080)
        feed_4x5.png          (1080×1350)
        stories_9x16.png      (1080×1920)
    /tiktok/
      /creativo-01/
        infeed_9x16.png       (1080×1920)
    /pinterest/
      /creativo-01/
        standard_2x3.png      (1000×1500)
        square_1x1.png        (1000×1000)
    /google/
      /creativo-01/
        landscape_1.91x1.png  (1200×628)
        square_1x1.png        (1200×1200)

Cada archivo viene renombrado con el nombre de plataforma/ratio para
facilitar la subida directa al Ads Manager correspondiente.
```

**Reglas:**
- Si el usuario selecciona solo Meta: el ZIP tiene la estructura anterior (backward compatible)
- Un creativo con adaptaciones para 2 plataformas = 1 crédito (no 2). El ratio/estilo es variante, no creativo nuevo.
- Pinterest (2:3) sí cuenta como creativo adicional si Meta no tiene ese ratio
- La selección de plataformas se puede cambiar por generación, aunque el proyecto tenga un default

---

### Plantillas específicas por plataforma

Los templates ahora tienen una propiedad `platform_tags` que indica para qué plataformas están optimizados:

```json
{
  "id": "tiktok-ugc-hook-01",
  "name": "TikTok UGC Hook",
  "platform_tags": ["tiktok"],
  "safe_zones": {
    "tiktok": { "top": 130, "bottom": 130 }
  },
  "aspect_ratios": ["9:16"],
  "style": "ugc_native"
}

{
  "id": "pinterest-lifestyle-01",
  "name": "Pinterest Lifestyle",
  "platform_tags": ["pinterest"],
  "aspect_ratios": ["2:3", "1:1"],
  "style": "minimal_aesthetic"
}

{
  "id": "meta-price-reveal-01",
  "name": "Meta Price Reveal",
  "platform_tags": ["meta", "google"],
  "safe_zones": {
    "meta_stories": { "top": 250, "bottom": 250 }
  },
  "aspect_ratios": ["1:1", "4:5", "9:16", "1.91:1"],
  "style": "conversion_focused"
}
```

**Catálogo MVP actualizado (30 templates → 38 templates con versiones por plataforma):**
- Meta-focused (conversion):     10 templates (before/after, price reveal, benefit)
- TikTok-native (UGC hook):       8 templates (hook opener, POV style, trending overlay)
- Pinterest-aesthetic:             6 templates (lifestyle, minimal, product hero)
- Google Display (simple/bold):   6 templates (product + CTA, single benefit)
- Multi-platform (universal):      8 templates (works across all, conservative style)

---

*Actualizar este documento a medida que las funcionalidades evolucionen durante el desarrollo.*
