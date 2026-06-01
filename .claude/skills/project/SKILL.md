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
padding-global               → standard horizontal padding
container-large              → max-width container (centered)
padding-section-medium       → vertical section padding
spacer-small/medium/large    → margin spacers
max-width-small/medium/large → content width constraints
text-color-grey/green        → color utilities
heading-style-h1/h2/h3       → heading sizes
text-size-regular/small      → body text sizes
heading-style-label          → label style (fantasy font, uppercase, .6rem, weight 600)
text-style-section-subtitle  → section subtitle (fantasy font, uppercase, .75rem) — used on subtitle in SectionHeader and SectionHeaderImage
heading-cards                → card heading style (uppercase, letter-spacing 0.1em, 1rem)
text-style-muted             → opacity: .6 for secondary text
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
- React components rendered without `client:load` produce static HTML only — use this for reusing a React component in a static page context (e.g. `ProjectCard` in a case study page)

### Context-aware components — the `standalone` prop pattern

When a component is used in two different contexts that require different behavior (e.g. inside a Swiper slider vs. as a standalone page section), add a `standalone` boolean prop rather than creating a separate component. The prop should adjust: animation types, heading levels, visible buttons, and any other context-dependent details.

```tsx
export default function ProjectCard({ project, standalone = false }: Props) {
  const anim = standalone ? 'blur-fade' : 'slide-blur'
  const Title = standalone ? 'h1' : 'h3'
  // standalone hides the "Case study" button (would link to current page)
  // standalone changes spacer size (one button vs two)
}
```

Only use this pattern when the two contexts share the vast majority of their layout. If they diverge significantly, create separate components.

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
- Current types: `project`, `testimonial`, `post`, `faq`, `milestone`

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

### Shared data files

When the same fallback data and GROQ query are needed in multiple places (e.g. a section component AND a dynamic page), centralize them in `src/data/[type].ts`. Never duplicate fallback arrays across files.

```ts
// src/data/projects.ts
export const PROJECTS_QUERY = `*[_type == "project"] | order(order asc) { ... }`
export const FALLBACK_PROJECTS: Project[] = [ ... ]
```

Both the section component (`Work.astro`) and the dynamic page (`case-studies/[slug].astro`) import from this file.

### `getStaticPaths` with Sanity

For dynamic pages (`[slug].astro`), fetch all items in `getStaticPaths` and pass each as a `prop` — the page component receives it directly without a second fetch. Module-level imports (`client`, shared data) are accessible inside `getStaticPaths`.

```ts
export async function getStaticPaths() {
  try {
    const data = await client?.fetch(PROJECTS_QUERY)
    if (data?.length) {
      return data.map(item => ({ params: { slug: item.slug }, props: { item } }))
    }
  } catch {}
  return FALLBACK_ITEMS.map(item => ({ params: { slug: item.slug }, props: { item } }))
}

const { item } = Astro.props
```

### Deploying CMS changes

The site is statically built on Vercel. Content changes require a rebuild:
- Manual: `vercel --prod` from `ts2026-astro/`
- Automated: Sanity webhook → Vercel deploy hook (not yet configured)

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

## Swiper Slider Patterns

All sliders use [Swiper.js](https://swiperjs.com/) initialized inside a React `useEffect`. There are established architectural patterns and known CSS conflicts that must be respected across all slider implementations.

### Component split — slider vs card

Every slider is split into two files: one that handles Swiper orchestration and one that handles the card layout. The slider component is responsible for initializing Swiper, configuring breakpoints, and creating the `swiper-slide` wrappers. The card component is a pure layout component that receives a single item as a prop and has no awareness of Swiper. This separation keeps the card reusable outside of a slider context.

The slide wrapper (with the `swiper-slide` class) is always created in the slider component, never inside the card. The card is mounted inside that wrapper as a child.

### Swiper CSS is global

`import 'swiper/css'` loads Swiper's core CSS globally, affecting every element with a `.swiper-*` class on the page — regardless of which component imported it. This means Swiper's base styles apply to all sliders simultaneously.

### Never style `.swiper-*` classes

`.swiper`, `.swiper-wrapper`, `.swiper-slide` and all `.swiper-*` classes are Swiper identifiers only — they must not carry visual or layout properties in our CSS. All styling belongs on the component-specific classes that sit alongside the Swiper classes on the same elements (e.g. a slide element has both `swiper-slide` and a project-specific class; all CSS targets the project-specific class only).

### Swiper CSS conflicts and how to resolve them

Swiper's core CSS sets properties on `.swiper-slide` and `.swiper` that can override our component styles when Swiper's stylesheet loads after ours. Since both are single-class selectors with equal specificity, source order determines which wins. The correct fix is to add `!important` to the property on our component class — never on a `.swiper-*` class.

Two known conflicts in this project:

- `.swiper-slide` sets `height: 100%` — this interferes with equal-height card layouts. Override with `height: auto !important` on the component's slide class.
- `.swiper` sets `margin-right: auto` — this overrides the `-1px` right margin used to prevent double borders. Override with `margin-right: -1px !important` on the component's list wrapper class.

### The -1px border collapse trick

When slides have a `border-right` and the slider wrapper also has a `border-right`, the last slide and the wrapper create a visible double border. The fix is to give the inner swiper element a `margin-right: -1px`, which extends it 1px past the wrapper's inner edge. Combined with `overflow: clip` on the wrapper, that 1px is clipped and only the wrapper's border remains visible. This margin must be set with `!important` because Swiper's CSS overrides it (see above).

### Equal-height cards

When all cards in a slider must share the same height, the correct approach is to make the slide element a column flex container and have the card fill it with `flex: 1`. Do not use `align-items: stretch` on the swiper wrapper (a Swiper class) and do not use `height: 100%` on the card — percentage heights require a defined height on the parent, which `height: auto` does not provide.

The chain that works: slide element is `display: flex; flex-direction: column` → card has `flex: 1` → card's content wrapper has `flex: 1` to push optional elements (like a link) to the bottom.

---

## Nav Variants

The `Nav` component accepts a `variant` prop that controls its positioning behavior:

- `variant="fixed"` (default) — navbar is `position: fixed`, overlays page content. Used on the homepage where the hero covers the initial viewport.
- `variant="sticky"` — navbar is `position: sticky; top: 0`. Used on inner pages (case studies, etc.) where content starts at the top and fixed positioning would overlap it.

```astro
<Nav />                    <!-- home — fixed, overlays content -->
<Nav variant="sticky" />   <!-- inner pages — sticky, flows with content -->
```

---

## Page and Section Wrappers

### Always wrap full-section components in a semantic tag

When a component covers an entire page section or the full content area of a page, the consuming `.astro` file must wrap it in a `<section>` or `<header>` tag with a descriptive class. Never mount a component directly inside `<main>` or another layout element without a semantic wrapper.

Use `<section>` for content sections, `<header>` for introductory or hero areas.

```astro
<!-- Correct -->
<main class="main-wrapper">
  <section class="section_case-study">
    <ProjectCard project={project} standalone />
  </section>
</main>

<!-- Wrong — component mounted directly without semantic wrapper -->
<main class="main-wrapper">
  <ProjectCard project={project} standalone />
</main>
```

The class on the wrapper (`section_case-study`, `section_about`, etc.) follows the same Client-First naming convention as all other sections, and serves as the CSS scoping anchor for any page-level overrides.

---

## CSS Conventions

### Links must use `color: inherit`

All anchor elements (`<a>`) must use `color: inherit` — never a hardcoded color token. This ensures links automatically pick up the color of their parent component, making them work correctly across sections with different color schemes (dark footer, light sections, etc.) without needing overrides.

Never do: `color: var(--some-token)` or `color: #fff` on a link class.
Always do: `color: inherit` and let the component or section define the text color.

### Dynamic values in a static site

The site is statically built — any value computed at build time (like `new Date()` in Astro frontmatter) is baked into the HTML and becomes stale until the next deploy. For values that must stay current regardless of deploy frequency, resolve them in the browser via an inline `<script>` tag in the Astro component.

```astro
<span id="some-value"></span>
<script>
  document.getElementById('some-value').textContent = new Date().getFullYear()
</script>
```

This pattern applies to: current year in copyright notices, any date-relative content, or anything that would look wrong if the site goes months without a rebuild.

### box-sizing reset is mandatory

The CSS system requires `*, *::before, *::after { box-sizing: border-box }` to function correctly. Without it, elements with `width: 100%` and explicit padding overflow their containers — for example `navbar_navbar` with `width: 100%` and `padding: 2.5rem` would be `viewport + 5rem` wide, pushing content off-screen.

This reset lives at the top of the RESET section in `utilities.css`. It must not be removed. It was previously provided implicitly by Tailwind's preflight; after removing Tailwind it must be explicit.

### Webflow `w-*` classes are dead in Astro

`w-inline-block`, `w-embed`, `w-variant-*`, `w--open`, `w--current` are Webflow runtime classes — they are either added by Webflow.js (which is not loaded) or carry no CSS in this project. They do nothing and should not appear in components. Their functional behavior must be replicated natively:

- `w-inline-block` → `width: fit-content` on the component wrapper, or rely on flex/block intrinsic sizing
- `w-embed` → plain `<div>` wrapper for inline SVG, no class needed
- `w-variant-[hash]` → rename to a semantic Client-First modifier (e.g. `is-navbar`, `is-vertical`)
- `w--open`, `w--current` → never apply; state is managed by JS class toggling on semantic classes

### Webflow `<deleted|...>` CSS variables are dead

Variables like `--base-color-neutral--black<deleted|variable-...>` are Webflow export artifacts. They have garbage names and are only referenced by other dead code (form kit, semantic color utilities, generic button variants). Do not use them in new code — use the clean `--brand--*` tokens instead. When removing dead CSS blocks, their entire chain of variable definitions can be removed safely.

### Webflow export cleanup checklist

When migrating or cleaning up a Webflow export in this stack, check for and remove:

- `w-layout-grid`, `w-checkbox*`, `w-form-formradioinput*` — Webflow form primitives
- `.global-styles`, `.project-settings_*` — hiders for Webflow proprietary script elements
- `@keyframes loop-left/loop-right` + classes — ticker/marquee if not used
- `video-background_*` — if no video elements in design
- `#w-node-[hash]` ID selectors — grid-area placements from Webflow designer, only needed if the corresponding `id="w-node-*"` attribute is still in the HTML
- `<deleted|...>` variable chains — see above
- `w-*` classes in HTML — see above

---

## Working Principles

1. **Always check the Webflow reference first.** Before writing HTML or CSS for a section, grep the `.webflow` files. Class names, structure, and responsive behavior are all there.
2. **Port CSS verbatim.** Do not reinterpret or simplify Webflow CSS unless there is a clear technical reason.
3. **No invented solutions.** If the original used a Finsweet plugin or Webflow interaction, replace it with the smallest native equivalent — not a different pattern.
4. **Prefer Astro for static, React for interactive.** Use `client:load` only when the component genuinely needs JS.
5. **Reusable components receive data as props.** Components should not fetch their own data; the parent `.astro` file does.
6. **No extra abstractions.** Don't add helper utilities, HOCs, or wrappers unless the task explicitly requires them.
7. **One CSS block per section in `sections.css`.** Add new sections at the end with the standard comment header block.
