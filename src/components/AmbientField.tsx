import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { BLUSH, PINK, SUGAR, pick, rand, spriteCache, type Kind } from '../lib/crystals.ts'
import s from './AmbientField.module.css'

type Mote = {
  /** Position in the field, 0–1 of the viewport. */
  nx: number
  ny: number
  /** 0 = far away, 1 = close: nearer crystals are larger, brighter and move more. */
  depth: number
  sprite: HTMLCanvasElement
  half: number
  alpha: number
  rise: number
  sway: number
  freq: number
  phase: number
  twinkle: number
}

const MARGIN = 24

function build(w: number, h: number, dpr: number) {
  const sprite = spriteCache(dpr)
  const count = Math.round(Math.min(90, Math.max(18, (w * h) / 16000)))
  const motes: Mote[] = []
  for (let i = 0; i < count; i++) {
    const depth = pick([0.15, 0.15, 0.5, 0.5, 0.9])
    const glint = depth > 0.8 && Math.random() < 0.3
    const kind: Kind = glint ? 'glint' : Math.random() < 0.7 ? 'ring' : 'diamond'
    const color = glint ? SUGAR : Math.random() < 0.6 ? SUGAR : Math.random() < 0.7 ? BLUSH : PINK
    const size = glint ? pick([7, 9]) : depth < 0.3 ? 2 : depth < 0.7 ? pick([2.5, 3]) : pick([3.5, 4, 5])
    const image = sprite(kind, color, size)
    motes.push({
      nx: Math.random(),
      ny: Math.random(),
      depth,
      sprite: image,
      half: image.width / dpr / 2,
      alpha: (glint ? rand(0.35, 0.6) : rand(0.1, 0.22)) * (0.6 + depth * 0.5),
      rise: rand(3, 9) * (0.5 + depth),
      sway: rand(4, 14) * depth,
      freq: rand(0.00015, 0.0004),
      phase: rand(0, 6.3),
      twinkle: glint ? rand(0.0008, 0.002) : 0,
    })
  }
  return motes
}

/**
 * Sugar dust that stays with the reader once the hero dissolves: a sparse, fixed
 * field of crystals on three depths. Nearer crystals slide further with the
 * scroll, so the velvet feels deep. Paused over the hero and in hidden tabs; a
 * still frame for reduced motion.
 */
export function AmbientField() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let motes: Mote[] = []
    let w = 0
    let h = 0
    let raf = 0
    let running = false
    let visible = false
    let last = performance.now()
    let time = 0

    function draw() {
      const scroll = reduce ? 0 : window.scrollY
      const span = h + MARGIN * 2
      ctx!.clearRect(0, 0, w, h)
      for (const mote of motes) {
        const drift = mote.ny * span - scroll * (0.04 + mote.depth * 0.2)
        const y = (((drift % span) + span) % span) - MARGIN
        const x = mote.nx * w + Math.sin(time * mote.freq + mote.phase) * mote.sway
        let a = mote.alpha
        if (mote.twinkle) {
          const s = 0.5 + 0.5 * Math.sin(time * mote.twinkle + mote.phase)
          a *= 0.25 + 0.75 * s * s * s
        }
        ctx!.globalAlpha = a
        ctx!.drawImage(mote.sprite, x - mote.half, y - mote.half, mote.half * 2, mote.half * 2)
      }
      ctx!.globalAlpha = 1
    }

    function loop(now: number) {
      const dt = Math.min(64, now - last)
      last = now
      time += dt
      for (const mote of motes) mote.ny -= (mote.rise * dt) / 1000 / (h + MARGIN * 2)
      draw()
      raf = requestAnimationFrame(loop)
    }

    function play() {
      if (running || reduce || !visible || document.hidden) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }

    function pause() {
      running = false
      cancelAnimationFrame(raf)
    }

    // Fade in as the hero's own crystals dissolve.
    function onScroll() {
      const opacity = Math.min(1, Math.max(0, (window.scrollY - h * 0.35) / (h * 0.5)))
      canvas!.style.opacity = String(opacity)
      visible = opacity > 0
      if (visible) play()
      else pause()
    }

    function layout() {
      const width = window.innerWidth
      const height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, width < 900 ? 1.5 : 2)
      // Mobile toolbars change the height while scrolling: keep the field, only resize it.
      if (!motes.length || Math.abs(width - w) > 1) motes = build(width, height, dpr)
      w = width
      h = height
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw()
      onScroll()
    }

    function onVisibility() {
      if (document.hidden) pause()
      else play()
    }

    layout()
    window.addEventListener('resize', layout)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      pause()
      window.removeEventListener('resize', layout)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduce])

  return <canvas ref={ref} className={s.field} aria-hidden="true" />
}
