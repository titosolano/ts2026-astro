---
name: project
description: Context and working conventions for the ts2026 portfolio project (Tito Solano). Use this skill at the start of any new session or when implementing a new section, component, or feature to understand the project structure, CSS architecture, Webflow reference workflow, and established patterns.
---

## Project Overview

Personal portfolio for **Tito Solano** — migrated from Webflow to **Astro + Sanity + Vercel**.

- Live site: titosolano.com
- Stack: Astro (static), React islands (`client:load` for interactive components), Sanity CMS, Vercel deployment
- Repo: `/Users/titosolano/Documents/Tito Solano/website v2/ts2026-astro/`
- Sanity studio: `/Users/titosolano/Documents/Tito Solano/website v2/ts2026-sanity/`

---

## Webflow Reference File

The original Webflow design is the **source of truth** for all visual decisions.

**Location:** `/Users/titosolano/Documents/Tito Solano/website v2/ts2026.webflow/`

```
ts2026.webflow/
  index.html            ← full page HTML with all sections
  css/ts2026.webflow.css ← all styles, responsive included
  images/               ← all image assets (SVG, AVIF, JPG)
```

### How to use it

**Before implementing any section or component:**

1. `grep -n "section-name\|class-pattern" ts2026.webflow/index.html` — find the HTML structure
2. `grep -n "class-name" ts2026.webflow/css/ts2026.webflow.css` — get the exact CSS
3. Check for responsive breakpoints in the CSS (the file uses `@media screen and (max-width: Xpx)`)
4. Note any Webflow-specific patterns (like `w-node-*` grid area IDs, or Finsweet attribute JS)

### Key patterns to watch for

- **Webflow `w-node-*` IDs**: Webflow generates `#w-node-[hash]` selectors with `grid-area` placements in the CSS. When migrating, convert these into class-based CSS properties.
- **Finsweet attributes** (`fs-accordion-element`, etc.): Replace with native React or vanilla JS solutions. Never bring in Finsweet JS.
- **`w-embed w-script` divs**: Contain third-party JS. Extract the logic and reimplement natively.
- **CSS comments from Webflow**: The exported CSS is minified — check the original class names carefully.

---

## CSS Architecture

All CSS lives in `src/styles/`. Import order in `global.css` matters:

```
global.css
  ├── utilities.css    ← design tokens, reset, typography, spacing, layout utilities
  ├── components.css   ← reusable UI components (Navbar, Hero, Footer, Buttons, Slider)
  └── sections.css     ← page section styles (Work, Approach, Capabilities, About, FAQ…)
```

### File responsibilities

| File | Contains | When to add here |
|---|---|---|
| `utilities.css` | CSS tokens (`:root`), reset, `heading-style-*`, `text-size-*`, `spacer-*`, `container-*`, `max-width-*`, `padding-*` | New utility class used in multiple places |
| `components.css` | Navbar, Hero, Buttons, Testimonial, Slider controls, Footer | New reusable UI component |
| `sections.css` | One block per page section — ported directly from Webflow CSS | New page section |

### Rules

- **No CSS modules.** All styles are global. Class naming provides scoping.
- **No inline styles** (except GSAP-applied values at runtime).
- When copying CSS from the Webflow reference file, port it verbatim. Only deviate if something is structurally impossible in Astro (e.g., Webflow proprietary properties).
- Each section in `sections.css` has a comment header documenting its component and class hierarchy.

---

## Client-First Naming Conventions

All CSS classes follow a **Client-First-inspired** naming system (similar to Finsweet's Client-First for Webflow). The key patterns:

### Section and component naming

```
section_[name]           → outermost <section> wrapper
[component]_component    → top-level component div
[component]_wrapper      → direct layout wrapper inside component
[component]_[element]    → specific element within a component
```

### Modifier classes

```
is-[state]               → state modifier (is-active, is-open, is-2, is-right)
has-[feature]            → feature modifier
```

### Utility classes (from utilities.css)

```
padding-global           → standard horizontal padding
container-large          → max-width container (centered)
padding-section-medium   → vertical section padding
spacer-small/medium/large → margin spacers
max-width-small/medium/large → content width constraints
text-color-grey/green    → color utilities
heading-style-h1/h2/h3   → heading sizes
text-size-regular/small  → body text sizes
heading-style-label      → label style (uppercase, letter-spacing, small caps)
heading-cards            → card heading style (uppercase, letter-spacing 0.1em)
```

### Important: never invent class names

If a section already exists in the Webflow reference, **use its class names exactly**. Do not rename or invent alternatives. The CSS in `sections.css` is already keyed to these names.

---

## Component Architecture

### Astro components (`.astro`) — server-rendered, static

Used for: sections, layouts, headers, static content.

```astro
---
// data fetching, imports, props
---
<section class="section_[name]">
  ...
</section>
```

### React components (`.tsx`) — interactive islands

Used for: anything with JS interactivity (sliders, accordions, toggles).

- Always add `client:load` in Astro when using React
- React components receive data as props from the parent `.astro` file
- The `.astro` file handles Sanity fetching; React gets clean data arrays

### Pattern: Astro fetches → React renders

```astro
<!-- MySection.astro -->
---
const data = await client?.fetch(GROQ_QUERY)
const items = data?.length ? data : FALLBACK_DATA
---
<MyComponent client:load items={items} />
```

```tsx
// MyComponent.tsx
export default function MyComponent({ items }) {
  // interactive logic
}
```

### Fallback data

Every Sanity-connected component has a hardcoded fallback array. If Sanity is not configured or returns no data, the fallback is used. This ensures the site always renders correctly.

---

## Sanity CMS Integration

- Client: `src/lib/sanity.ts` — exports `client` and `urlFor`
- Schemas: `ts2026-sanity/schemas/` — one file per content type
- Current types: `project`, `testimonial`, `post`, `faq`

### GROQ query pattern

```ts
const data = await client?.fetch(`
  *[_type == "faq"] | order(order asc) {
    question,
    answer,
  }
`)
```

Always use `coalesce()` for optional fields:
```ts
"coverImageAlt": coalesce(coverImageAlt, title)
```

### Deploying CMS changes

The site is statically built on Vercel. Content changes require a rebuild:
- Manual: `vercel --prod` from `ts2026-astro/`
- Automated: Sanity webhook → Vercel deploy hook

---

## Animation System

See the `animate` skill for full documentation. Summary:

- Animations are applied via `data-anim="[type]"` attributes — no JS imports needed in components
- Types: `fade`, `blur-fade`, `slide-up`, `slide-down`, `slide-left`, `slide-right`, `slide-blur`
- Desktop only (≥992px + hover/fine pointer)
- For staggered lists: add `data-anim` directly on each child with `data-anim-delay={String(i * 0.06)}` — **do not rely on `data-anim-stagger` on the parent**, as it can fail to trigger
- `data-anim-no-opacity="true"` — for elements with `backdrop-filter` (avoids stacking context conflict)
- `slide-blur` — used for Swiper slides; managed via `initSlideBlurScope()`, not `data-anim`

---

## Working Principles

1. **Always check the Webflow reference first.** Before writing HTML or CSS for a section, grep the `.webflow` files. Class names, structure, and responsive behavior are all there.
2. **Port CSS verbatim.** Do not reinterpret or simplify Webflow CSS unless there is a clear technical reason.
3. **No invented solutions.** If the original used a Finsweet plugin or Webflow interaction, replace it with the smallest native equivalent — not a different pattern.
4. **Prefer Astro for static, React for interactive.** Use `client:load` only when the component genuinely needs JS.
5. **Reusable components receive data as props.** Components should not fetch their own data; the parent `.astro` file does.
6. **No extra abstractions.** Don't add helper utilities, HOCs, or wrappers unless the task explicitly requires them.
7. **One CSS block per section in `sections.css`.** Add new sections at the end with the standard comment header block.
