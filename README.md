# ts2026 — titosolano.com

Portfolio personal de Tito Solano. Migrado desde Webflow a un stack propio con CMS headless.

## Tech stack

| Capa | Tecnología |
|---|---|
| Frontend | Astro 6 + TypeScript |
| Estilos | Tailwind v4 + CSS portado de Webflow (Client-First) |
| Componentes interactivos | React (solo donde hay estado) |
| CMS | Sanity (studio en `/ts2026-sanity`) |
| Deploy | Vercel — auto-deploy en cada push a `main` |

## Comandos

```bash
# Instalar dependencias
npm install

# Dev server (localhost:4321)
npm run dev

# Verificar build antes de push
npm run build

# Publicar
git add .
git commit -m "feat: descripción"
git push
```

## Variables de entorno

Crea un archivo `.env` en la raíz con:

```
PUBLIC_SANITY_PROJECT_ID=3i6bh3hq
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=tu_token
```

En Vercel estas mismas variables se agregan en **Settings → Environment Variables**.

## Estructura del proyecto

```
ts2026-astro/
├── public/
│   ├── fonts/          Arimo, Space Mono
│   ├── images/         Assets estáticos
│   └── ts2026.css      CSS portado de Webflow (no modificar directamente)
└── src/
    ├── components/
    │   ├── Nav.astro              Navbar con reloj, scroll-hide, hamburger
    │   ├── Hero.astro             Header con testimonios desde Sanity
    │   ├── Footer.astro           Footer global
    │   ├── ButtonArrow.astro      Botón reutilizable con flecha
    │   ├── ButtonCall.astro       Botón "Book a Call" con foto
    │   ├── SectionHeader.astro    Header de sección (Work, Approach, etc.)
    │   ├── SliderControls.astro   Prev/Next para cualquier slider
    │   ├── TestimonialCard.astro  Tarjeta de testimonio individual
    │   ├── TestimonialSlider.tsx  Slider Swiper (React, datos desde Sanity)
    │   └── NavClock.tsx           Reloj en vivo zona Costa Rica (React)
    ├── layouts/
    │   └── BaseLayout.astro       Layout base con SEO, fonts, CSS global
    ├── lib/
    │   └── sanity.ts              Cliente Sanity + urlFor()
    ├── pages/
    │   └── index.astro            Página principal
    └── styles/
        └── global.css             Tokens de diseño + @font-face
```

## Convención de nombres (Client-First)

Todos los componentes siguen Client-First. El bloque `_component` dicta el prefijo de todos sus hijos:

```
navbar_component
  navbar_container
  navbar_menu
  navbar_link
```

No usar sufijos numéricos de Webflow (`navbar1_`, `header5_`, `testimonial39_`).

## Secciones completadas

- Nav
- Hero (testimonios conectados a Sanity, fallback estático si no hay datos)
- Footer

## Secciones pendientes

- Work — proyectos desde Sanity (`project` schema)
- Approach — estática
- Capabilities — estática
- About — estática
- FAQ — acordeón
- News — posts desde Sanity (`post` schema)
- Páginas dinámicas: `projects/[slug].astro`, `posts/[slug].astro`

## Sanity

El studio está en `/ts2026-sanity`. Schemas disponibles: `project`, `testimonial`, `post`.

Para correr el studio localmente:
```bash
cd ../ts2026-sanity
npm run dev
```

El studio aún no está desplegado en sanity.io — los datos de testimonios usan fallback estático hasta que se carguen datos reales.
