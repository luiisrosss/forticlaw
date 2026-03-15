# FRONTEND GUIDE — Guía de Diseño del Dashboard

> Versión 1.0 · Marzo 2026 · Forticlaw
> Esta guía define el sistema de diseño del dashboard de la app.
> El dashboard es la continuación natural de la landing — mismo mundo visual, más funcional.

---

## Principio rector

> El dashboard debe sentirse como la continuación natural de la landing. Mismo mundo visual, más funcional.

Cuando el usuario entra al dashboard después de ver la landing, no debe sentir que ha cambiado de producto. Mismos colores, mismas fuentes, mismos patrones de card. La diferencia es que ahora el contenido es funcional y no solo de marketing.

---

## 1. Colores

### Paleta base (idéntica a la landing)

```
Fondo global:      #0a0a0a (bg-zinc-950)
Fondo card:        bg-zinc-950/60 — bg-zinc-900/50
Fondo card hover:  bg-zinc-900/80
Fondo sidebar:     bg-zinc-950

Texto primario:    text-zinc-100  (headings, valores importantes)
Texto secundario:  text-zinc-400  (body, descripción)
Texto terciario:   text-zinc-500  (metadata, fechas, placeholder)
Texto hint:        text-zinc-600  (helper text, caption)

Bordes sutiles:    border-white/10    (cards, inputs — igual que la landing)
Bordes card:       border-zinc-800/50 (cards con menos contraste)
Bordes hover:      border-zinc-700/50 (estado hover de cards)
Bordes sidebar:    border-r border-white/10

Acento blanco:     bg-white text-[#0a0a0a]  (botones CTA primarios)
Acento hover:      bg-zinc-200
Focus ring:        ring-1 ring-zinc-600 / focus:border-zinc-500
```

### Estados de color

```
Éxito:    text-emerald-400 / bg-emerald-950 border-emerald-900
Error:    text-red-400 / bg-red-950 border-red-900
Warning:  text-amber-400 / bg-amber-950 border-amber-900
Info:     text-blue-400 / bg-blue-950 border-blue-900
```

### Badges / Pills de estado

```tsx
// Estado "activo" o "completado"
<span className="rounded-full bg-emerald-950 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-900">
  Active
</span>

// Estado "procesando"
<span className="rounded-full bg-amber-950 px-2 py-0.5 text-xs font-medium text-amber-400 border border-amber-900">
  Processing
</span>

// Estado neutro (ángulo de copy, categoría)
<span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-zinc-400 border border-zinc-800">
  Pain angle
</span>
```

---

## 2. Tipografía

### Familias (mismas que la landing)

```css
font-display  → Cal Sans          (H1 de páginas, grandes titulares)
font-heading  → Instrument Sans   (H2, H3, títulos de sección)
font-sans     → Geist             (body, labels, UI general)
font-mono     → Geist Mono        (IDs, ratios de imagen, código)
```

### Jerarquía en el dashboard

```
Page title (H1):      font-heading text-2xl font-semibold text-zinc-100
Section label:        font-sans text-xs font-medium uppercase tracking-wider text-zinc-500
Section heading (H2): font-heading text-xl font-semibold text-zinc-100
Card title (H3):      font-sans text-base font-medium text-zinc-100
Card subtitle:        font-sans text-sm text-zinc-500
Body copy:            font-sans text-sm text-zinc-400
Metadata / fecha:     font-sans text-xs text-zinc-600
Mono (IDs, ratios):   font-mono text-xs text-zinc-500
```

### Ejemplos de uso

```tsx
// Page header
<h1 className="font-heading text-2xl font-semibold text-zinc-100">Your projects</h1>

// Section label
<p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Recent activity</p>

// Card title
<h3 className="text-base font-medium text-zinc-100">Nike Air Max Store</h3>

// Card meta
<p className="text-sm text-zinc-500">Fashion · 12 creatives · 3 days ago</p>
```

---

## 3. Layout global del dashboard

### Estructura

```
┌──────────────────────────────────────────────────────────────────┐
│ SIDEBAR (240px expandido / 56px colapsado)                       │
│ [Logo] ··········································· [Collapse btn] │
│ ────────────────────────────────────────────────────────────────│
│ [⊞] Dashboard                                                    │
│ [⊟] Projects                                                     │
│    └ Nike Store                                                  │
│    └ Gadgets Shop                                                │
│ [◈] Settings                                                     │
│ ────────────────────────────────────────────────────────────────│
│ [Credits: 87/100]                                                │
│ [●] Luis Rosales ▸                                               │
└──────────────────────────────────────────────────────────────────┘

TOPBAR (56px, fija):
[Sidebar toggle] [Breadcrumb: Dashboard / Projects / Nike Store] ··· [+ New Creative] [🌐 EN] [User avatar]

CONTENT AREA:
  max-w-6xl mx-auto px-6 py-8
  (En páginas con mucho ancho — editor de canvas — max-w-none / full width)
```

### Sidebar specs

```tsx
// Contenedor sidebar
className="fixed left-0 top-0 z-30 flex h-screen w-60 flex-col
           border-r border-white/10 bg-zinc-950
           transition-all duration-300"

// Item nav activo
className="flex items-center gap-3 rounded-lg px-3 py-2
           bg-zinc-900 text-zinc-100 text-sm font-medium"

// Item nav normal
className="flex items-center gap-3 rounded-lg px-3 py-2
           text-zinc-400 text-sm hover:text-zinc-100 hover:bg-zinc-900/50
           transition-colors"

// Sub-item (proyecto en sidebar)
className="flex items-center gap-2 rounded-lg pl-8 pr-3 py-1.5
           text-zinc-500 text-sm hover:text-zinc-100 hover:bg-zinc-900/50
           transition-colors"

// Credits bar
className="mx-3 mb-2 rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-3"

// User area (bottom del sidebar)
className="flex items-center gap-3 rounded-lg mx-3 mb-3 px-3 py-2
           hover:bg-zinc-900/50 transition-colors cursor-pointer"
```

### Topbar specs

```tsx
// Contenedor topbar
className="fixed top-0 right-0 z-20 flex h-14 items-center justify-between
           border-b border-white/10 bg-zinc-950/95 backdrop-blur-sm px-6
           transition-all duration-300"
// (El left se ajusta dinámicamente según si el sidebar está expandido o colapsado)

// Botón "+ New Creative" (siempre visible en topbar)
className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0a0a0a]
           hover:bg-zinc-200 transition-colors"
```

---

## 4. Cards

### Card estándar (proyectos, productos, creativos)

```tsx
className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6
           transition-all duration-300
           hover:border-zinc-700/50 hover:bg-zinc-900/80"
```

### Card métrica / stat

```tsx
className="relative overflow-hidden rounded-2xl border border-zinc-800/50
           bg-zinc-900/50 p-6 text-center
           transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/80"
// Overlay hover (como en impact-section de la landing):
// <div className="absolute inset-0 bg-gradient-to-t from-zinc-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
```

### Card de proyecto (dashboard principal)

```tsx
// Estructura de la card de proyecto:
// [Logo circle] [Nombre + sector]
// [N creatives] [Última actividad]
// [Open] [+ Product]
className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5
           flex flex-col gap-4 group
           transition-all duration-300 hover:border-zinc-700/50"
```

### Card de creativo (galería)

```tsx
// Thumbnail (aspect 1:1) + acciones en hover
className="relative overflow-hidden rounded-xl border border-zinc-800/50
           bg-zinc-900 aspect-square group cursor-pointer
           transition-all duration-300 hover:border-zinc-700/50"
// Hover overlay con acciones:
// <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2" />
```

### Card seleccionada

```tsx
className="rounded-2xl border border-white/20 bg-zinc-900 ring-1 ring-white/10"
```

---

## 5. Botones

### Primario (CTA principal)

```tsx
className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0a0a0a]
           hover:bg-zinc-200 transition-colors"
// Versión grande (hero de páginas):
className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#0a0a0a]
           hover:bg-zinc-200 transition-colors"
```

### Secundario

```tsx
className="rounded-full border border-white/10 bg-zinc-900 px-4 py-2
           text-sm font-medium text-zinc-100
           hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
```

### Ghost / navegación

```tsx
className="rounded-full px-3 py-1.5 text-sm text-zinc-400
           hover:text-zinc-100 hover:bg-zinc-900/50 transition-colors"
```

### Icono solo

```tsx
className="rounded-full p-2 text-zinc-400
           hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
```

### Destructivo

```tsx
className="rounded-full border border-red-900 bg-red-950 px-4 py-2
           text-sm font-medium text-red-400
           hover:bg-red-900 transition-colors"
```

### Con icono (patrón group)

```tsx
<button className="group flex items-center gap-2 rounded-full border border-white/10
                   bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100
                   hover:bg-zinc-800 transition-colors">
  <PlusIcon className="h-4 w-4" />
  <span>Add product</span>
</button>
```

---

## 6. Inputs y formularios

### Input de texto

```tsx
className="w-full rounded-full border border-white/10 bg-zinc-950 px-4 py-2.5
           text-sm text-zinc-100 placeholder:text-zinc-600
           focus:border-zinc-500 focus:outline-none transition-colors"
```

### Textarea

```tsx
className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3
           text-sm text-zinc-100 placeholder:text-zinc-600
           focus:border-zinc-500 focus:outline-none resize-none transition-colors"
```

### Select / Dropdown trigger

```tsx
className="w-full rounded-full border border-white/10 bg-zinc-950 px-4 py-2.5
           text-sm text-zinc-100 focus:border-zinc-500 focus:outline-none
           appearance-none cursor-pointer transition-colors"
```

### Label de campo

```tsx
<label className="mb-1.5 block text-sm font-medium text-zinc-300">
  Project name
</label>
```

### Helper text / error

```tsx
// Helper
<p className="mt-1 text-xs text-zinc-600">No spaces or special characters</p>

// Error
<p className="mt-1 text-xs text-red-400">This field is required</p>
```

### Color picker (brand kit)

```tsx
// Swatch clickable con border de selección
className="h-8 w-8 rounded-full border-2 cursor-pointer transition-all
           border-white/10 hover:border-white/30 data-[selected]:border-white"
```

### Slider (brand kit tone)

```tsx
// Range input personalizado via CSS
className="w-full accent-white cursor-pointer"
```

### Toggle (switch)

```tsx
// Usar el componente Switch de Shadcn con estilos oscuros
// checked: bg-white / unchecked: bg-zinc-800
```

---

## 7. Navegación y breadcrumbs

### Breadcrumb en topbar

```tsx
// Dashboard / Projects / Nike Store
<nav className="flex items-center gap-1.5 text-sm">
  <span className="text-zinc-600">Dashboard</span>
  <ChevronRightIcon className="h-3.5 w-3.5 text-zinc-700" />
  <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer">Projects</span>
  <ChevronRightIcon className="h-3.5 w-3.5 text-zinc-700" />
  <span className="text-zinc-100">Nike Store</span>
</nav>
```

### Tabs de proyecto

```tsx
// Tabs horizontales debajo del header de la página
<div className="flex gap-1 border-b border-white/10 mb-8">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      className={cn(
        "px-4 py-2.5 text-sm font-medium transition-colors -mb-px",
        active === tab.id
          ? "border-b-2 border-white text-zinc-100"
          : "text-zinc-500 hover:text-zinc-300"
      )}
    >
      {tab.label}
    </button>
  ))}
</div>
```

### Paginación

```tsx
// Botones prev/next + números de página
className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-zinc-400
           hover:text-zinc-100 hover:bg-zinc-900 transition-colors
           disabled:opacity-30 disabled:cursor-not-allowed"
```

---

## 8. Estados vacíos

Patrón estándar para cualquier lista sin contenido:

```tsx
<div className="flex flex-col items-center justify-center py-24 text-center">
  {/* Icono representativo del contenido vacío */}
  <div className="mb-4 rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-5">
    <IconName className="h-10 w-10 text-zinc-700" />
  </div>
  <h3 className="mb-2 text-base font-medium text-zinc-100">No projects yet</h3>
  <p className="mb-6 max-w-xs text-sm text-zinc-500">
    Create your first project to start generating ad creatives.
  </p>
  <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-zinc-200 transition-colors">
    Create project
  </button>
</div>
```

---

## 9. Loading states

### Skeleton loader (listas y cards)

```tsx
// Card skeleton
<div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6 animate-pulse">
  <div className="mb-4 h-4 w-1/3 rounded-full bg-zinc-800" />
  <div className="mb-2 h-3 w-2/3 rounded-full bg-zinc-900" />
  <div className="h-3 w-1/2 rounded-full bg-zinc-900" />
</div>
```

### Spinner inline

```tsx
<Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
```

### Loading de generación (progreso de IA)

```tsx
// Pasos visuales con check cuando se completan
<div className="flex items-center gap-3 text-sm">
  <div className={cn(
    "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
    completed ? "border-white bg-white" : "border-zinc-700 animate-pulse"
  )}>
    {completed && <CheckIcon className="h-3 w-3 text-[#0a0a0a]" />}
  </div>
  <span className={completed ? "text-zinc-100" : "text-zinc-500"}>
    {step.label}
  </span>
</div>
```

### Progress bar (batch generation)

```tsx
<div className="w-full rounded-full bg-zinc-900 h-1.5 overflow-hidden">
  <div
    className="h-full rounded-full bg-white transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>
```

---

## 10. Modales y drawers

### Modal estándar

```tsx
// Usar Dialog de Shadcn con overlay dark
// Overlay: bg-black/60 backdrop-blur-sm
// Panel: rounded-2xl border border-white/10 bg-zinc-950 p-6
```

### Modal de confirmación destructiva

```tsx
// Mismo modal con:
// - Icono de warning (amber) o destructivo (red)
// - Descripción clara de la acción
// - Botón cancel (secundario) + botón confirmar (destructivo)
// - Si es muy destructiva: input donde el usuario escribe el nombre para confirmar
```

### Drawer mobile (sidebar en mobile)

```tsx
// Usar Sheet de Shadcn
// Se abre desde hamburger en topbar mobile
// Mismo contenido que el sidebar desktop
```

---

## 11. Animaciones

### Principios
- **Funcionales, no decorativas:** Las animaciones comunican estado, no son espectáculo.
- **Rápidas:** Entry ≤300ms. Las demoras >500ms se sienten lentas.
- **Suaves:** ease-out para entrances, linear para loops.

### Patterns estándar

```tsx
// Entry de página (wrap el contenido de la página)
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>

// Stagger de lista (cada item)
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25, delay: index * 0.05 }}
>

// Hover de card (CSS, no Framer)
className="transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/80"

// Skeleton pulse
className="animate-pulse"

// Spinner
className="animate-spin"
```

### Cuándo NO animar
- Dentro de formularios (inputs, selects)
- En tablas con muchos rows
- En elementos que el usuario interactúa frecuentemente (botones repetidos)

---

## 12. Responsive

### Breakpoints (mismos que Tailwind default)

```
Mobile:  < 640px  (sm)
Tablet:  640–1024px (sm/md)
Desktop: > 1024px (lg+)
```

### Comportamiento del sidebar

```
Desktop (lg+):   Sidebar fijo de 240px. Content con margin-left: 240px.
Tablet (md):     Sidebar colapsado a 56px (solo iconos). Content con margin-left: 56px.
Mobile (< md):   Sidebar oculto. Sheet (drawer) desde hamburger en topbar.
```

### Grids responsive

```
Cards de proyectos:   grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
Cards de creativos:   grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
Métricas:             grid-cols-2 lg:grid-cols-4
Formularios wizard:   max-w-lg mx-auto (siempre columna única, centrado)
```

---

## 13. Iconografía

**Librería:** Lucide React (ya instalada)
**Tamaños estándar:**

```
Iconos en sidebar nav:    h-4 w-4
Iconos en botones:        h-4 w-4
Iconos en empty states:   h-10 w-10
Iconos en badges/pills:   h-3 w-3
Iconos de acción en card: h-4 w-4
```

**Color:** Hereda del texto contenedor o `text-zinc-400` como default.

---

## 14. Toasts y notificaciones

**Librería:** Sonner (ya instalada)

```tsx
// Éxito
toast.success("Project created successfully")

// Error
toast.error("Failed to generate. Please try again.")

// Info
toast("Copied to clipboard")

// Loading (promise)
toast.promise(generationPromise, {
  loading: "Generating your draft...",
  success: "Draft ready! Review it below.",
  error: "Generation failed. No credits were charged."
})
```

**Posición:** `bottom-right` en desktop / `bottom-center` en mobile.

---

## 15. Selector de idioma

```tsx
// En la topbar (siempre visible en dashboard)
<button className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors">
  <GlobeIcon className="h-3.5 w-3.5" />
  <span>EN</span>
  <ChevronDownIcon className="h-3 w-3" />
</button>

// Dropdown con opciones:
// 🇺🇸 English
// 🇪🇸 Español
```

---

## 16. Patrón de página de settings / wizard

```tsx
// Wizard multi-step (onboarding, nuevo proyecto, brand kit)
// El contenido siempre está centrado y es de ancho limitado:

<div className="mx-auto max-w-lg py-12">
  {/* Step indicator */}
  <div className="mb-8 flex items-center gap-2">
    {steps.map((step, i) => (
      <div key={i} className={cn(
        "h-1 flex-1 rounded-full transition-all",
        i <= currentStep ? "bg-white" : "bg-zinc-800"
      )} />
    ))}
  </div>

  {/* Step content */}
  <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
    <h2 className="mb-1 font-heading text-xl font-semibold text-zinc-100">{step.title}</h2>
    <p className="mb-8 text-sm text-zinc-500">{step.description}</p>
    {/* Fields */}
  </motion.div>

  {/* Navigation */}
  <div className="mt-8 flex items-center justify-between">
    <button onClick={goBack} className="...secondary...">Back</button>
    <button onClick={goNext} className="...primary...">Continue</button>
  </div>
  <button className="mt-4 w-full text-center text-sm text-zinc-600 hover:text-zinc-400">
    Skip for now
  </button>
</div>
```

---

## 17. Canvas editor layout

```
┌────────────────────────────────────────────────────────────────┐
│ TOOLBAR (fija arriba, 48px)                                    │
│ [← Back] [Undo] [Redo] ··· [Zoom: 100%] ··· [Save] [Export] │
├───────────────────────────┬────────────────────────────────────┤
│                           │  PANEL DERECHO (320px)             │
│  CANVAS AREA              │  ────────────────────────────────  │
│  (fondo: zinc-900)        │  [Element properties]              │
│                           │    Font size / weight / color      │
│  [Fabric.js canvas        │    Position X / Y                  │
│   centrado, con shadow    │    Width / Height                  │
│   sutil]                  │    Lock aspect ratio               │
│                           │  ────────────────────────────────  │
│                           │  [Swap product image]              │
│                           │  [Change background]               │
│                           │  [Move logo position]              │
└───────────────────────────┴────────────────────────────────────┘
```

El canvas editor es full-width (max-w-none) para maximizar el área de trabajo.

---

*Esta guía se actualiza cada vez que se establece un nuevo patrón de diseño durante el desarrollo.*
