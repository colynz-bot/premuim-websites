import Lenis from 'lenis'
import { cubicBezier } from 'motion/react'
import { EASE } from './motion.ts'

let lenis: Lenis | null = null
let locks = 0

const ease = cubicBezier(...EASE)
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Smooth wheel scrolling for mouse and trackpad. Touch screens and reduced
 * motion keep native scrolling. Returns the cleanup.
 */
export function startSmoothScroll() {
  lenis = new Lenis({ autoRaf: true, lerp: 0.1 })
  if (locks > 0) lenis.stop()
  document.addEventListener('click', onAnchorClick)
  return () => {
    document.removeEventListener('click', onAnchorClick)
    lenis?.destroy()
    lenis = null
  }
}

/** Glide to a section or offset; jumps when motion is reduced. */
export function scrollToTarget(target: HTMLElement | number, { immediate = false } = {}) {
  // While a menu or the viewer holds the page, Lenis is stopped and restarting it
  // would cancel its own glide, so scroll natively instead.
  if (lenis && locks === 0) {
    lenis.scrollTo(target, { immediate, duration: 1.4, easing: ease })
    return
  }
  const behavior = immediate || reduced() ? 'instant' : 'smooth'
  if (typeof target === 'number') window.scrollTo({ top: target, behavior })
  else target.scrollIntoView({ behavior, block: 'start' })
}

/** Freeze the page behind menus and overlays; nested calls are counted. */
export function lockScroll() {
  if (locks++ > 0) return
  document.documentElement.style.overflow = 'hidden'
  lenis?.stop()
}

export function unlockScroll() {
  if (locks === 0 || --locks > 0) return
  document.documentElement.style.overflow = ''
  lenis?.start()
}

// Pointer clicks on in-page links glide with the page. Keyboard activation keeps
// the native jump, which also moves focus to the section.
function onAnchorClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.detail === 0) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const link = (event.target as Element | null)?.closest?.('a[href^="#"]')
  const hash = link?.getAttribute('href')
  if (!hash || hash === '#') return
  const section = document.getElementById(hash.slice(1))
  if (!section) return
  event.preventDefault()
  scrollToTarget(hash === '#top' ? 0 : section)
  window.history.replaceState(null, '', hash)
}
