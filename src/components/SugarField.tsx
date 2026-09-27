import { useEffect, useRef } from 'react'
import { useReducedMotion, type MotionValue } from 'motion/react'

/**
 * The signature visual: hundreds of sugar crystals that drift in and crystallise
 * into a glossy pink nail, part around the cursor, and dissolve as you scroll.
 * Canvas 2D with pre-rendered sprites; paused whenever it is off screen.
 */

type Kind = 'diamond' | 'ring' | 'glint'

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
}

const SUGAR = '#f5eee8'
const BLUSH = '#f3a9c8'
const PINK = '#e3568e'
const DEEP = '#a3305f'

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

/** Half-width of the almond silhouette at v ∈ [0, 1], from tip (0) to cuticle (1). */
function halfWidth(v: number) {
  if (v < 0.66) return Math.pow(Math.sin(((v / 0.66) * Math.PI) / 2), 1.05)
  if (v < 0.86) return 1
  const k = (v - 0.86) / 0.14
  return Math.sqrt(Math.max(0, 1 - k * k))
}

function makeSprite(kind: Kind, color: string, size: number, dpr: number) {
  const px = Math.ceil(size * dpr) + 2
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = px
  const g = canvas.getContext('2d')!
  g.translate(px / 2, px / 2)
  g.scale(dpr, dpr)
  const r = size / 2
  g.beginPath()
  if (kind === 'glint') {
    const k = r * 0.2
    g.moveTo(0, -r)
    g.quadraticCurveTo(k, -k, r, 0)
    g.quadraticCurveTo(k, k, 0, r)
    g.quadraticCurveTo(-k, k, -r, 0)
    g.quadraticCurveTo(-k, -k, 0, -r)
  } else {
    g.moveTo(0, -r)
    g.lineTo(r * 0.78, 0)
    g.lineTo(0, r)
    g.lineTo(-r * 0.78, 0)
    g.closePath()
  }
  if (kind === 'ring') {
    g.strokeStyle = color
    g.lineWidth = 1
    g.stroke()
  } else {
    g.fillStyle = color
    g.fill()
  }
  return canvas
}

function build(w: number, h: number, dpr: number, settled: boolean) {
  const mobile = w < 900
  const H = mobile ? Math.min(h * 0.44, w * 1.02) : Math.min(h * 0.78, w * 0.46)
  const W = H / 1.72
  const cx = mobile ? w * 0.63 : w * 0.765
  const cy = mobile ? h * 0.29 : h * 0.53
  const cos = Math.cos(-0.3)
  const sin = Math.sin(-0.3)
  const place = (u: number, v: number) => {
    const lx = (u * W) / 2
    const ly = (v - 0.5) * H
    return [cx + lx * cos - ly * sin, cy + lx * sin + ly * cos] as const
  }

  const sprites = new Map<string, HTMLCanvasElement>()
  const particles: Particle[] = []

  function add(x: number, y: number, kind: Kind, color: string, size: number, alpha: number, delay: number, amp: number, spread: number, twinkle = 0) {
    const key = kind + color + size
    let sprite = sprites.get(key)
    if (!sprite) sprites.set(key, (sprite = makeSprite(kind, color, size, dpr)))
    const ox = x - cx
    const oy = y - cy
    const len = Math.hypot(ox, oy) || 1
    const sx = settled ? x : cx + rand(-0.55, 0.55) * w
    const sy = settled ? y : cy + rand(-0.55, 0.55) * h
    particles.push({
      hx: x, hy: y, sx, sy, x: sx, y: sy,
      dx: ox / len, dy: oy / len,
      sprite, half: sprite.width / dpr / 2,
      alpha, delay: settled ? -1000 : delay,
      amp, f1: rand(0.0003, 0.0008), f2: rand(0.0003, 0.0008), p1: rand(0, 6.3), p2: rand(0, 6.3),
      spread, rise: rand(60, 260),
      twinkle, phase: rand(0, 6.3),
    })
  }

  const total = Math.round(Math.min(2200, Math.max(460, (w * h) / (mobile ? 480 : 300))))

  // Pink body, filled crystals.
  for (let i = 0; i < total * 0.42; ) {
    const u = rand(-1, 1)
    const v = Math.random()
    if (Math.abs(u) > halfWidth(v) * 0.94) continue
    i++
    const [x, y] = place(u, v)
    add(x, y, 'diamond', Math.random() < 0.32 ? DEEP : PINK, pick([2, 2.5, 3, 3.5]), rand(0.5, 0.95), rand(250, 950), 0.7, rand(90, 360))
  }

  // Gloss: a bright reflection running down the left of the nail.
  for (let i = 0; i < total * 0.1; ) {
    const u = rand(-0.72, -0.3)
    const v = rand(0.14, 0.72)
    if (Math.abs(u) > halfWidth(v) * 0.9) continue
    i++
    const [x, y] = place(u, v)
    if (Math.random() < 0.14) add(x, y, 'glint', SUGAR, pick([7, 8, 10]), rand(0.6, 1), rand(900, 1400), 0.5, rand(90, 360), rand(0.0015, 0.004))
    else add(x, y, 'diamond', SUGAR, pick([2, 2.5, 3]), rand(0.6, 1), rand(700, 1200), 0.6, rand(90, 360))
  }

  // Edge: the outline crystallises first.
  const outline: (readonly [number, number])[] = []
  for (let i = 0; i <= 100; i++) outline.push(place(halfWidth(i / 100), i / 100))
  for (let i = 100; i >= 0; i--) outline.push(place(-halfWidth(i / 100), i / 100))
  const lengths = [0]
  for (let i = 1; i < outline.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(outline[i][0] - outline[i - 1][0], outline[i][1] - outline[i - 1][1]))
  }
  const perimeter = lengths[lengths.length - 1]
  for (let i = 0; i < total * 0.26; i++) {
    const target = Math.random() * perimeter
    let j = 1
    while (lengths[j] < target) j++
    const f = (target - lengths[j - 1]) / (lengths[j] - lengths[j - 1] || 1)
    const x = outline[j - 1][0] + (outline[j][0] - outline[j - 1][0]) * f + rand(-1.2, 1.2)
    const y = outline[j - 1][1] + (outline[j][1] - outline[j - 1][1]) * f + rand(-1.2, 1.2)
    add(x, y, 'ring', Math.random() < 0.6 ? SUGAR : BLUSH, pick([3, 4, 5]), rand(0.45, 0.95), rand(0, 500), 1.1, rand(90, 360))
  }

  // Ambient dust across the whole stage.
  for (let i = 0; i < total * 0.22; i++) {
    const x = rand(0, w)
    const y = rand(0, h)
    const color = Math.random() < 0.55 ? SUGAR : Math.random() < 0.67 ? BLUSH : PINK
    if (Math.random() < 0.05) add(x, y, 'glint', SUGAR, pick([6, 7, 9]), rand(0.3, 0.7), rand(0, 1400), rand(4, 8), rand(40, 160), rand(0.001, 0.003))
    else add(x, y, 'ring', color, pick([2, 3, 4]), rand(0.1, 0.35), rand(0, 1400), rand(4, 8), rand(40, 160))
  }

  return particles
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
    let particles: Particle[] = []
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
      ctx!.clearRect(0, 0, w, h)
      for (const p of particles) {
        const arrived = t >= p.delay
        let tx = (arrived ? p.hx : p.sx) + Math.sin(t * p.f1 + p.p1) * p.amp
        let ty = (arrived ? p.hy : p.sy) + Math.cos(t * p.f2 + p.p2) * p.amp
        if (scatter > 0) {
          tx += p.dx * p.spread * scatter
          ty += p.dy * p.spread * scatter - p.rise * scatter
        }
        if (pointer.active) {
          const ox = tx - pointer.x
          const oy = ty - pointer.y
          const d2 = ox * ox + oy * oy
          if (d2 < radius * radius) {
            const d = Math.sqrt(d2) || 1
            const push = (1 - d / radius) ** 2 * 26
            tx += (ox / d) * push
            ty += (oy / d) * push
          }
        }
        p.x += (tx - p.x) * k
        p.y += (ty - p.y) * k
        let a = p.alpha * Math.min(1, Math.max(0, (t - p.delay) / 700)) * fade
        if (p.twinkle) {
          const s = 0.5 + 0.5 * Math.sin(t * p.twinkle + p.phase)
          a *= 0.2 + 0.8 * s * s * s
        }
        if (a < 0.02) continue
        ctx!.globalAlpha = a
        ctx!.drawImage(p.sprite, p.x - p.half, p.y - p.half, p.half * 2, p.half * 2)
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
      particles = build(w, h, dpr, Boolean(reduce) || performance.now() - start > 2500)
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
