import { useEffect, useRef } from 'react'
import { useReducedMotion, type MotionValue } from 'motion/react'
import { BLUSH, DEEP, PINK, SUGAR, pick, rand, spriteCache, type Kind } from '../lib/crystals.ts'

/**
 * The signature visual: hundreds of sugar crystals that drift in and crystallise
 * into a glossy almond French nail, catch the light around the cursor and under
 * a slow gloss sweep, and dissolve as you scroll.
 * Canvas 2D with pre-rendered sprites; paused whenever it is off screen.
 */

type Particle = {
  hx: number
  hy: number
  sx: number
  sy: number
  x: number
  y: number
  dx: number
  dy: number
  sprite: HTMLCanvasElement
  /** The same crystal in sugar white, drawn over it when light touches it. */
  shine: HTMLCanvasElement | null
  half: number
  alpha: number
  delay: number
  amp: number
  f1: number
  f2: number
  p1: number
  p2: number
  spread: number
  rise: number
  twinkle: number
  phase: number
  /** Position across the nail, from the tip (0) to the cuticle (1), for the gloss sweep. */
  sweep: number
}

/** When the crystals have settled, then how often the gloss runs over the nail (ms). */
const SETTLED = 2600
const SWEEP_EVERY = 7200
const SWEEP_FOR = 2100

/** Half-width of the almond silhouette at v ∈ [0, 1], from tip (0) to cuticle (1). */
function halfWidth(v: number) {
  if (v < 0.66) return Math.pow(Math.sin(((v / 0.66) * Math.PI) / 2), 1.05)
  if (v < 0.86) return 1
  const k = (v - 0.86) / 0.14
  return Math.sqrt(Math.max(0, 1 - k * k))
}

/** The French smile line: deeper at the sides than in the middle (u ∈ [-1, 1] across the nail). */
const smile = (u: number) => 0.2 + 0.1 * u * u

type Point = readonly [number, number]
type Glow = { canvas: HTMLCanvasElement; x: number; y: number }

/** A soft nail beneath the crystals: pink body, sugar tip and a gloss streak, blurred. */
function nailGlow(place: (u: number, v: number) => Point): Glow {
  const edge: Point[] = []
  for (let i = 0; i <= 60; i++) edge.push(place(halfWidth(i / 60), i / 60))
  for (let i = 60; i >= 0; i--) edge.push(place(-halfWidth(i / 60), i / 60))
  const tip: Point[] = []
  for (let i = 0; i <= 20; i++) tip.push(place(halfWidth((i / 20) * smile(1)), (i / 20) * smile(1)))
  for (let i = 0; i <= 30; i++) {
    const n = 1 - (i / 30) * 2
    tip.push(place(n * halfWidth(smile(n)), smile(n)))
  }
  for (let i = 20; i >= 0; i--) tip.push(place(-halfWidth((i / 20) * smile(1)), (i / 20) * smile(1)))
  const streak: Point[] = []
  for (let i = 0; i <= 20; i++) streak.push(place(-0.64 * halfWidth(0.24 + i * 0.025), 0.24 + i * 0.025))
  for (let i = 20; i >= 0; i--) streak.push(place(-0.42 * halfWidth(0.24 + i * 0.025), 0.24 + i * 0.025))

  const pad = 48
  const xs = edge.map((p) => p[0])
  const ys = edge.map((p) => p[1])
  const x = Math.min(...xs) - pad
  const y = Math.min(...ys) - pad
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(Math.max(...xs) + pad - x)
  canvas.height = Math.ceil(Math.max(...ys) + pad - y)
  const g = canvas.getContext('2d')!
  // Draw the shapes off canvas and keep only their shadows: shadows blur in every browser.
  const far = canvas.width + 100
  g.translate(-x - far, -y)
  g.shadowOffsetX = far
  const fill = (points: Point[], color: string, blur: number) => {
    g.shadowColor = color
    g.shadowBlur = blur
    g.beginPath()
    points.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py)))
    g.closePath()
    g.fill()
  }
  fill(edge, 'rgb(227 86 142 / 0.11)', 44)
  fill(tip, 'rgb(245 238 232 / 0.07)', 22)
  fill(streak, 'rgb(245 238 232 / 0.06)', 22)
  return { canvas, x, y }
}

function build(w: number, h: number, dpr: number, settled: boolean) {
  const mobile = w < 900
  const H = mobile ? Math.min(h * 0.44, w * 1.02) : Math.min(h * 0.78, w * 0.46)
  const W = H / 1.72
  const cx = mobile ? w * 0.63 : w * 0.765
  const cy = mobile ? h * 0.29 : h * 0.53
  const cos = Math.cos(-0.3)
  const sin = Math.sin(-0.3)
  const place = (u: number, v: number): Point => {
    const lx = (u * W) / 2
    const ly = (v - 0.5) * H
    return [cx + lx * cos - ly * sin, cy + lx * sin + ly * cos]
  }

  const sprite = spriteCache(dpr)
  const particles: Particle[] = []

  function add(x: number, y: number, kind: Kind, color: string, size: number, alpha: number, delay: number, amp: number, spread: number, twinkle = 0, sweep = Number.NaN) {
    const base = sprite(kind, color, size)
    const ox = x - cx
    const oy = y - cy
    const len = Math.hypot(ox, oy) || 1
    const sx = settled ? x : cx + rand(-0.55, 0.55) * w
    const sy = settled ? y : cy + rand(-0.55, 0.55) * h
    particles.push({
      hx: x, hy: y, sx, sy, x: sx, y: sy,
      dx: ox / len, dy: oy / len,
      sprite: base, shine: Number.isNaN(sweep) ? null : sprite(kind, SUGAR, size), half: base.width / dpr / 2,
      alpha, delay: settled ? -1000 : delay,
      amp, f1: rand(0.0003, 0.0008), f2: rand(0.0003, 0.0008), p1: rand(0, 6.3), p2: rand(0, 6.3),
      spread, rise: rand(60, 260),
      twinkle, phase: rand(0, 6.3),
      sweep,
    })
  }

  // Diagonal coordinate the gloss travels along.
  const across = (u: number, v: number) => 0.78 * v + 0.22 * (u + 1) * 0.5

  const total = Math.round(Math.min(2600, Math.max(460, (w * h) / (mobile ? 460 : 260))))

  // Body: pink crystals, sugar white past the smile line (an almond French).
  for (let i = 0; i < total * 0.46; ) {
    const u = rand(-1, 1)
    const v = Math.random()
    const half = halfWidth(v)
    if (Math.abs(u) > half * 0.94) continue
    i++
    const [x, y] = place(u, v)
    const tip = v < smile(u / (half || 1))
    // Lit from the left: deeper pink towards the right edge.
    const shade = (1 + u) / 2
    const color = tip ? (Math.random() < 0.72 ? SUGAR : BLUSH) : Math.random() < 0.12 + 0.4 * shade ? DEEP : PINK
    add(x, y, 'diamond', color, pick([2.5, 3, 3.5, 4]), tip ? rand(0.45, 0.85) : rand(0.55, 1), rand(250, 950), 0.7, rand(90, 360), 0, across(u, v))
  }

  // Smile line: a crisp seam of crystals where the tip meets the pink.
  for (let i = 0; i < total * 0.04; i++) {
    const n = rand(-0.96, 0.96)
    const v = smile(n)
    const u = n * halfWidth(v)
    const [x, y] = place(u + rand(-0.01, 0.01), v + rand(-0.004, 0.004))
    add(x, y, 'ring', Math.random() < 0.7 ? SUGAR : BLUSH, pick([3, 4]), rand(0.55, 0.95), rand(500, 1000), 0.6, rand(90, 360), 0, across(u, v))
  }

  // Gloss: a bright reflection running down the left of the nail.
  for (let i = 0; i < total * 0.09; ) {
    const u = rand(-0.72, -0.3)
    const v = rand(0.14, 0.72)
    if (Math.abs(u) > halfWidth(v) * 0.9) continue
    i++
    const [x, y] = place(u, v)
    if (Math.random() < 0.14) add(x, y, 'glint', SUGAR, pick([7, 8, 10]), rand(0.6, 1), rand(900, 1400), 0.5, rand(90, 360), rand(0.0015, 0.004), across(u, v))
    else add(x, y, 'diamond', SUGAR, pick([2, 2.5, 3]), rand(0.6, 1), rand(700, 1200), 0.6, rand(90, 360), 0, across(u, v))
  }

  // Edge: the outline crystallises first.
  const outline: { x: number; y: number; u: number; v: number }[] = []
  for (let i = 0; i <= 100; i++) {
    const [x, y] = place(halfWidth(i / 100), i / 100)
    outline.push({ x, y, u: halfWidth(i / 100), v: i / 100 })
  }
  for (let i = 100; i >= 0; i--) {
    const [x, y] = place(-halfWidth(i / 100), i / 100)
    outline.push({ x, y, u: -halfWidth(i / 100), v: i / 100 })
  }
  const lengths = [0]
  for (let i = 1; i < outline.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(outline[i].x - outline[i - 1].x, outline[i].y - outline[i - 1].y))
  }
  const perimeter = lengths[lengths.length - 1]
  for (let i = 0; i < total * 0.23; i++) {
    const target = Math.random() * perimeter
    let j = 1
    while (lengths[j] < target) j++
    const a = outline[j - 1]
    const b = outline[j]
    const f = (target - lengths[j - 1]) / (lengths[j] - lengths[j - 1] || 1)
    const x = a.x + (b.x - a.x) * f + rand(-1.2, 1.2)
    const y = a.y + (b.y - a.y) * f + rand(-1.2, 1.2)
    add(x, y, 'ring', Math.random() < 0.6 ? SUGAR : BLUSH, pick([3, 4, 5]), rand(0.45, 0.95), rand(0, 500), 1.1, rand(90, 360), 0, across(a.u + (b.u - a.u) * f, a.v + (b.v - a.v) * f))
  }

  // Ambient dust across the whole stage.
  for (let i = 0; i < total * 0.18; i++) {
    const x = rand(0, w)
    const y = rand(0, h)
    const color = Math.random() < 0.55 ? SUGAR : Math.random() < 0.67 ? BLUSH : PINK
    if (Math.random() < 0.05) add(x, y, 'glint', SUGAR, pick([6, 7, 9]), rand(0.3, 0.7), rand(0, 1400), rand(4, 8), rand(40, 160), rand(0.001, 0.003))
    else add(x, y, 'ring', color, pick([2, 3, 4]), rand(0.1, 0.35), rand(0, 1400), rand(4, 8), rand(40, 160))
  }

  return { particles, glow: nailGlow(place) }
}

export function SugarField({ progress, className }: { progress?: MotionValue<number>; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const start = performance.now()
    const pointer = { x: 0, y: 0, active: false }
    const radius = 120
    const reach = radius * 1.5
    let particles: Particle[] = []
    let glow: Glow | null = null
    let w = 0
    let h = 0
    let raf = 0
    let last = start
    let running = false
    let inView = true

    function draw(now: number) {
      const dt = Math.min(64, now - last)
      last = now
      const k = reduce ? 1 : 1 - Math.pow(0.9, dt / 16.67)
      const t = now - start
      const scatter = progress?.get() ?? 0
      const fade = 1 - scatter * 0.92
      // The gloss band travels from the tip to the cuticle, then rests.
      const cycle = (t - SETTLED) % SWEEP_EVERY
      const sweeping = !reduce && t > SETTLED && cycle < SWEEP_FOR
      const band = -0.3 + (cycle / SWEEP_FOR) * 1.6
      ctx!.clearRect(0, 0, w, h)
      if (glow) {
        const settle = reduce ? 1 : Math.min(1, Math.max(0, (t - 600) / 1600))
        const a = settle * settle * (3 - 2 * settle) * fade * fade
        if (a > 0.01) {
          ctx!.globalAlpha = a
          ctx!.drawImage(glow.canvas, glow.x, glow.y)
        }
      }
      for (const p of particles) {
        const arrived = t >= p.delay
        let tx = (arrived ? p.hx : p.sx) + Math.sin(t * p.f1 + p.p1) * p.amp
        let ty = (arrived ? p.hy : p.sy) + Math.cos(t * p.f2 + p.p2) * p.amp
        if (scatter > 0) {
          tx += p.dx * p.spread * scatter
          ty += p.dy * p.spread * scatter - p.rise * scatter
        }
        let light = 0
        if (pointer.active) {
          const ox = tx - pointer.x
          const oy = ty - pointer.y
          const d2 = ox * ox + oy * oy
          if (d2 < reach * reach) {
            const d = Math.sqrt(d2) || 1
            light = (1 - d / reach) ** 2
            if (d < radius) {
              const push = (1 - d / radius) ** 2 * 26
              tx += (ox / d) * push
              ty += (oy / d) * push
            }
          }
        }
        if (p.shine && sweeping) {
          const off = (p.sweep - band) / 0.07
          if (off > -3 && off < 3) light = Math.max(light, Math.exp(-off * off) * 0.9)
        }
        p.x += (tx - p.x) * k
        p.y += (ty - p.y) * k
        let a = p.alpha * Math.min(1, Math.max(0, (t - p.delay) / 700)) * fade
        if (p.twinkle) {
          const s = 0.5 + 0.5 * Math.sin(t * p.twinkle + p.phase)
          a *= 0.2 + 0.8 * s * s * s
        }
        if (a < 0.02) continue
        ctx!.globalAlpha = Math.min(1, a + light * 0.35)
        ctx!.drawImage(p.sprite, p.x - p.half, p.y - p.half, p.half * 2, p.half * 2)
        // Light catches the crystal: sugar white laid over its colour.
        if (p.shine && light > 0.04) {
          const r = p.half * (1 + light * 0.7)
          ctx!.globalAlpha = Math.min(1, light * fade * 0.9)
          ctx!.drawImage(p.shine, p.x - r, p.y - r, r * 2, r * 2)
        }
      }
      ctx!.globalAlpha = 1
    }

    function loop(now: number) {
      draw(now)
      raf = requestAnimationFrame(loop)
    }

    function play() {
      if (running || reduce || !inView || document.hidden) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }

    function pause() {
      running = false
      cancelAnimationFrame(raf)
    }

    function layout() {
      const rect = canvas!.getBoundingClientRect()
      w = rect.width
      h = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, w < 900 ? 1.5 : 2)
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ;({ particles, glow } = build(w, h, dpr, Boolean(reduce) || performance.now() - start > SETTLED))
      if (!running) draw(performance.now())
    }

    function onPointerMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active = pointer.y > 0 && pointer.y < rect.height
    }

    function onPointerLeave() {
      pointer.active = false
    }

    function onVisibility() {
      if (document.hidden) pause()
      else play()
    }

    const resizer = new ResizeObserver(layout)
    resizer.observe(canvas)
    const watcher = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) play()
      else pause()
    })
    watcher.observe(canvas)
    document.addEventListener('visibilitychange', onVisibility)
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce
    if (fine) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onPointerLeave)
    }
    play()

    return () => {
      pause()
      resizer.disconnect()
      watcher.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [progress, reduce])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
