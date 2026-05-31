---
name: animate
description: Apply on-scroll and on-load animations to elements in ts2026-astro using the data-anim attribute system defined in src/lib/animations.ts. Use this skill whenever the user asks to animate, add motion, or add scroll effects to HTML elements in this project.
---

This skill documents the animation system in `src/lib/animations.ts` — a GSAP + ScrollTrigger utility that works entirely through HTML `data-*` attributes. No JS imports needed in components; just add attributes to elements.

**Only active on desktop** (≥992px, hover: hover, pointer: fine). On mobile/touch, elements are always visible. Respects `prefers-reduced-motion`.

## Core attribute

```html
<div data-anim="fade">...</div>
```

`data-anim` is the only required attribute. Everything else is optional.

## Animation types

| Value | Effect |
|---|---|
| `fade` | Opacity only |
| `blur-fade` | Opacity + blur(18px) + scale(0.96) |
| `slide-up` | Rises from below + fade |
| `slide-down` | Falls from above + fade |
| `slide-left` | Moves left (enters from the right) + fade |
| `slide-right` | Moves right (enters from the left) + fade |

## Optional attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `data-anim-trigger` | `enter` \| `load` \| `both` | `enter` | When to play: on scroll enter, on page load, or both |
| `data-anim-delay` | number (s) | `0` | Seconds before animation starts |
| `data-anim-duration` | number (s) | `0.7` | Animation duration |
| `data-anim-distance` | number (px) | `32` | Travel distance for slide types |
| `data-anim-ease` | GSAP ease string | `power2.inOut` | Easing curve |
| `data-anim-once` | boolean | `true` | Play once or replay every time element enters |
| `data-anim-threshold` | number (0–1) | `0.15` | Fraction of element visible before triggering |
| `data-anim-stagger` | number (s) | — | Delay between child elements (enables stagger mode) |
| `data-anim-children` | CSS selector | `:scope > *` | Which children to stagger |
| `data-anim-start` | ScrollTrigger start string | — | Override the scroll start position |
| `data-anim-end` | ScrollTrigger end string | — | Override the scroll end position |
| `data-anim-no-opacity` | boolean | `false` | Animate transform only, skip opacity — use when the element or a descendant has `backdrop-filter` |

## Common patterns

**Single element fade in on scroll:**
```html
<p data-anim="fade">Hello</p>
```

**Slide up with delay:**
```html
<h1 data-anim="slide-up" data-anim-delay="0.2">Title</h1>
```

**Staggered list (children animate in sequence):**
```html
<ul data-anim="slide-up" data-anim-stagger="0.08">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

**Animate on page load (hero elements):**
```html
<section data-anim="blur-fade" data-anim-trigger="load">Hero</section>
```

**Replay every time it enters the viewport:**
```html
<div data-anim="slide-left" data-anim-once="false">Repeats</div>
```

**Stagger specific children (not all direct children):**
```html
<div data-anim="fade" data-anim-stagger="0.1" data-anim-children=".card">
  <div class="card">A</div>
  <div class="card">B</div>
</div>
```

## Animation principles to follow

When deciding what and how to animate, apply these principles:

- **Animate meaning, not decoration.** Animate things the user's eye should follow: headings, CTAs, key images. Don't animate everything.
- **Hierarchy through timing.** The most important element animates first or with less delay. Supporting elements follow with stagger.
- **One entrance per section.** A section intro (`blur-fade` or `slide-up` on the heading) sets the tone. List items stagger below it. Avoid stacking multiple independent scroll triggers in the same visual area.
- **Hero elements use `trigger="load"`.** Anything above the fold should animate on load, not on scroll — the user is already looking at it.
- **Keep durations tight.** 0.5–0.8s for most elements. Reserve 1s+ for full-page or theatrical moments.
- **Ease matters.** `power2.inOut` is the default and works for most cases. `power3.out` feels snappier for slides. `expo.out` is dramatic — use sparingly.
- **Stagger rhythm.** 0.06–0.1s between items feels natural for lists. Under 0.05s is too fast to perceive; over 0.15s feels sluggish.
- **Distance is subtle.** The default 32px is intentional. Going above 60px starts to feel heavy unless it's a dramatic hero entrance.

## Initialization

`initAnimations()` must be called once per page. In Astro, this is typically done in a `<script>` tag in a layout or page:

```astro
<script>
  import { initAnimations } from '../lib/animations'
  document.addEventListener('DOMContentLoaded', () => initAnimations())
</script>
```

If using Astro view transitions, re-call on `astro:page-load` instead of `DOMContentLoaded`.
