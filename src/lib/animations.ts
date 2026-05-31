/**
 * Sistema de animaciones on-scroll basado en atributos data-anim.
 *
 * Uso en HTML:
 *   <div data-anim="fade">...</div>
 *   <div data-anim="blur-fade" data-anim-delay="0.5" data-anim-duration="1">...</div>
 *   <div data-anim="slide-up" data-anim-stagger="0.1" data-anim-children=".item">...</div>
 *
 * Tipos de animación:
 *   fade         → opacidad
 *   blur-fade    → opacidad + blur + scale
 *   slide-up     → sube desde abajo + fade
 *   slide-down   → baja desde arriba + fade
 *   slide-left   → se mueve a la izquierda (entra desde la derecha) + fade
 *   slide-right  → se mueve a la derecha (entra desde la izquierda) + fade
 *
 * Atributos opcionales:
 *   data-anim-delay      → segundos de retraso (default: 0)
 *   data-anim-duration   → duración en segundos (default: 0.7)
 *   data-anim-stagger    → delay entre hijos en cascada (default: null)
 *   data-anim-children   → selector CSS de hijos para stagger (default: ":scope > *")
 *   data-anim-trigger    → cuándo animar: "enter" | "load" | "both" (default: "enter")
 *   data-anim-threshold  → fracción visible para disparar (default: 0.15)
 *   data-anim-distance   → distancia de desplazamiento en px (default: 32)
 *   data-anim-ease       → curva de easing GSAP (default: "power2.inOut")
 *
 * Solo activo en desktop con mouse (≥992px + hover: hover + pointer: fine).
 * En mobile/touch los elementos siempre son visibles.
 * Respeta prefers-reduced-motion.
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Tipos ─────────────────────────────────────────────────────

type AnimType = 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'fade' | 'blur-fade'
type AnimTrigger = 'enter' | 'load' | 'both'

interface AnimConfig {
  type: AnimType
  trigger: AnimTrigger
  once: boolean
  duration: number
  delay: number
  distance: number
  ease: string
  stagger: number | null
  children: string | null
  threshold: number
  start: string | null
  end: string | null
  noOpacity: boolean
}

interface AnimControl {
  play: () => void
  restart: () => void
  kill: () => void
}

// ── Defaults ──────────────────────────────────────────────────

const DEFAULTS: Omit<AnimConfig, 'type'> = {
  trigger:    'enter',
  once:       true,
  duration:   0.7,
  delay:      0,
  distance:   32,
  ease:       'power2.inOut',
  stagger:    null,
  children:   null,
  threshold:  0.15,
  start:      null,
  end:        null,
  noOpacity:  false,
}

// ── Helpers ───────────────────────────────────────────────────

function toNum(v: string | undefined, fallback: number): number {
  const n = parseFloat(v ?? '')
  return Number.isFinite(n) ? n : fallback
}

function toBool(v: string | undefined, fallback: boolean): boolean {
  if (v === undefined) return fallback
  return ['true', '1', 'yes', 'y'].includes(v.toLowerCase())
}

function parseConfig(el: HTMLElement): AnimConfig {
  const d = el.dataset
  return {
    type:      (d.anim ?? 'fade') as AnimType,
    trigger:   (d.animTrigger ?? DEFAULTS.trigger) as AnimTrigger,
    once:      toBool(d.animOnce, DEFAULTS.once),
    duration:  toNum(d.animDuration, DEFAULTS.duration),
    delay:     toNum(d.animDelay, DEFAULTS.delay),
    distance:  toNum(d.animDistance, DEFAULTS.distance),
    ease:      d.animEase ?? DEFAULTS.ease,
    stagger:   d.animStagger !== undefined ? toNum(d.animStagger, 0) : DEFAULTS.stagger,
    children:  d.animChildren ?? DEFAULTS.children,
    threshold: toNum(d.animThreshold, DEFAULTS.threshold),
    start:     d.animStart ?? DEFAULTS.start,
    end:       d.animEnd ?? DEFAULTS.end,
    noOpacity: toBool(d.animNoOpacity, DEFAULTS.noOpacity),
  }
}

function getTargets(el: HTMLElement, cfg: AnimConfig): HTMLElement[] {
  if (cfg.stagger !== null) {
    const selector = cfg.children ?? ':scope > *'
    const children = Array.from(el.querySelectorAll<HTMLElement>(selector))
    if (children.length) return children
  }
  return [el]
}

function initialFrom(cfg: AnimConfig): gsap.TweenVars {
  const base = cfg.noOpacity ? {} : { opacity: 0.001 }
  switch (cfg.type) {
    case 'slide-up':    return { ...base, y:  cfg.distance }
    case 'slide-down':  return { ...base, y: -cfg.distance }
    case 'slide-left':  return { ...base, x:  cfg.distance }
    case 'slide-right': return { ...base, x: -cfg.distance }
    case 'blur-fade':   return { ...base, filter: 'blur(18px)', scale: 0.96 }
    case 'fade':
    default:            return base
  }
}

function getFinalState(cfg: AnimConfig): gsap.TweenVars {
  if (cfg.noOpacity) return { x: 0, y: 0, opacity: 1 }
  return { x: 0, y: 0, opacity: 1, filter: 'blur(0px)', scale: 1 }
}

function computeStart(cfg: AnimConfig): string {
  if (cfg.start) return cfg.start
  const pct = Math.max(0, Math.min(100, 100 - cfg.threshold * 100))
  return `top ${pct}%`
}

// ── Core ──────────────────────────────────────────────────────

function buildTween(
  el: HTMLElement,
  cfg: AnimConfig,
  prefersReduced: boolean,
  played: WeakSet<HTMLElement>
): AnimControl {
  const targets = getTargets(el, cfg)

  const finalState = getFinalState(cfg)

  if (prefersReduced) {
    gsap.set(targets, finalState)
    played.add(el)
    return { play: () => {}, restart: () => {}, kill: () => {} }
  }

  gsap.set(targets, initialFrom(cfg))

  const tween = gsap.to(targets, {
    ...finalState,
    duration: cfg.duration,
    delay:    cfg.delay,
    ease:     cfg.ease,
    stagger:  cfg.stagger ?? undefined,
    onStart:    () => targets.forEach(t => { t.style.willChange = 'transform, opacity, filter' }),
    onComplete: () => targets.forEach(t => { t.style.willChange = '' }),
    paused: true,
  })

  return {
    play:    () => tween.play(),
    restart: () => tween.restart(),
    kill:    () => tween.kill(),
  }
}

function attachScrollTrigger(
  el: HTMLElement,
  cfg: AnimConfig,
  control: AnimControl,
  played: WeakSet<HTMLElement>
): void {
  ScrollTrigger.create({
    trigger: el,
    start:   computeStart(cfg),
    end:     cfg.end ?? 'bottom top',
    onEnter: () => {
      if (cfg.once && played.has(el)) return
      cfg.once ? control.play() : control.restart()
      if (cfg.once) played.add(el)
    },
    onEnterBack: () => {
      if (cfg.once && played.has(el)) return
      cfg.once ? control.play() : control.restart()
      if (cfg.once) played.add(el)
    },
  })
}

// ── Init ──────────────────────────────────────────────────────

const VALID_TYPES = new Set<AnimType>([
  'slide-up', 'slide-down', 'slide-left', 'slide-right', 'fade', 'blur-fade',
])

export function initAnimations(selector = '[data-anim]'): void {
  const isDesktop = window.matchMedia(
    '(min-width: 992px) and (hover: hover) and (pointer: fine)'
  ).matches

  // En mobile/touch no se anima — los elementos son visibles por CSS
  if (!isDesktop) return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const played = new WeakSet<HTMLElement>()

  gsap.utils.toArray<HTMLElement>(selector).forEach(el => {
    const cfg = parseConfig(el)

    if (!VALID_TYPES.has(cfg.type)) return

    const control = buildTween(el, cfg, prefersReduced, played)

    if (cfg.trigger === 'load' || cfg.trigger === 'both') {
      requestAnimationFrame(() => {
        if (cfg.once && played.has(el)) return
        control.play()
        if (cfg.once) played.add(el)
      })
    }

    if (cfg.trigger === 'enter' || cfg.trigger === 'both') {
      attachScrollTrigger(el, cfg, control, played)
    }
  })
}
