# ts2026 — titosolano.com

Portfolio personal de Tito Solano. Migrado desde Webflow a un stack propio con CMS headless.

## Tech stack

| Capa | Tecnología |
|---|---|
| Frontend | Astro 6 + TypeScript |
| Estilos | CSS global Client-First (sin frameworks) |
| Componentes interactivos | React (islas, solo donde hay JS) |
| Animaciones | GSAP + ScrollTrigger (sistema `data-anim`) |
| Sliders | Swiper.js |
| CMS | Sanity v5 — studio en `titosolano.sanity.studio` |
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
git push
```

## Variables de entorno

Crea un archivo `.env` en la raíz con:

```
PUBLIC_SANITY_PROJECT_ID=3i6bh3hq
PUBLIC_SANITY_DATASET=production
```

En Vercel estas mismas variables se agregan en **Settings → Environment Variables**.

> `.env` está en `.gitignore` — nunca sube a GitHub.

## Estructura del proyecto

```
ts2026-astro/
├── public/
│   ├── fonts/          Arimo, Space Mono (woff2)
│   └── images/         Assets estáticos
└── src/
    ├── components/
    │   ├── Nav.astro                 Navbar (scroll-hide, hamburger, reloj)
    │   ├── Hero.astro                Hero con testimonios desde Sanity
    │   ├── Work.astro                Sección Work (slider de proyectos)
    │   ├── Approach.astro            Sección Approach (4 pasos)
    │   ├── Capabilities.astro        Sección Capabilities (sticky scroll)
    │   ├── About.astro               Sección About
    │   ├── FAQ.astro                 Sección FAQ (accordion)
    │   ├── News.astro                Sección News/Milestones (slider)
    │   ├── Footer.astro              Footer global
    │   ├── SectionHeader.astro       Header de sección reutilizable
    │   ├── SectionHeaderImage.astro  Header con imagen de fondo
    │   ├── ButtonArrow.tsx           Botón con flecha animada (React)
    │   ├── ButtonCall.astro          Botón "Book a Call" con foto
    │   ├── WorkSlider.tsx            Slider de proyectos (Swiper + slide-blur)
    │   ├── ProjectCard.tsx           Card de proyecto (slider y standalone)
    │   ├── TestimonialSlider.tsx     Slider de testimonios (Swiper fade)
    │   ├── TestimonialCard.astro     Card de testimonio
    │   ├── NewsSlider.tsx            Slider de milestones (Swiper loop)
    │   ├── MilestoneCard.tsx         Card de milestone
    │   ├── SliderButtons.tsx         Controles prev/next reutilizables
    │   ├── Accordion.tsx             FAQ accordion (GSAP height)
    │   └── NavClock.tsx              Reloj en vivo zona Costa Rica
    ├── data/
    │   └── projects.ts               Fallback data + GROQ query centralizados
    ├── layouts/
    │   └── BaseLayout.astro          Layout base (SEO, fonts, animaciones)
    ├── lib/
    │   ├── animations.ts             Sistema data-anim (GSAP + ScrollTrigger)
    │   └── sanity.ts                 Cliente Sanity + urlFor()
    ├── pages/
    │   ├── index.astro               Homepage
    │   └── case-studies/
    │       └── [slug].astro          Páginas de case study (generadas desde Sanity)
    └── styles/
        ├── global.css                Punto de entrada + resets + fonts
        ├── utilities.css             Tokens, tipografía, spacing, layout
        ├── components.css            Navbar, Hero, Buttons, Slider, Footer
        └── sections.css              Estilos por sección de página
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

- **Nav** — reloj en vivo, scroll-hide, hamburger mobile, animaciones load
- **Hero** — testimonios desde Sanity, fallback estático, slide-blur
- **Work** — slider Swiper con slide-blur, 7 proyectos desde Sanity
- **Approach** — 4 pasos + 3 columnas, animaciones blur-fade
- **Capabilities** — sticky scroll stacking, 4 items
- **About** — grid complejo, imagen + quote
- **FAQ** — accordion nativo React + GSAP, datos desde Sanity
- **News/Milestones** — Swiper loop + autoplay, datos desde Sanity
- **Footer** — año dinámico, links con color inherit
- **Case studies** — páginas dinámicas por slug desde Sanity (`/case-studies/[slug]`)

## Sanity CMS

- Studio en producción: [titosolano.sanity.studio](https://titosolano.sanity.studio)
- Studio local: `cd ../ts2026-sanity && npm run dev`
- Schemas: `project`, `testimonial`, `faq`, `milestone`, `post`

Cambios de contenido en Sanity requieren un nuevo build para reflejarse (el sitio es estático):

```bash
# Deploy manual tras cambios de contenido
vercel --prod
```

> El webhook Sanity → Vercel está pendiente de configurar para auto-deploy.

### Re-deployar el studio

```bash
cd ../ts2026-sanity
npx sanity deploy
```

## Sistema de animaciones

Las animaciones usan atributos `data-anim` — no requieren imports en los componentes:

```html
<div data-anim="fade">...</div>
<div data-anim="blur-fade" data-anim-delay="0.2">...</div>
<div data-anim="slide-up" data-anim-stagger="0.08">...</div>
```

Solo activo en desktop (≥992px + mouse). Ver `.claude/skills/animate/SKILL.md` para documentación completa.
