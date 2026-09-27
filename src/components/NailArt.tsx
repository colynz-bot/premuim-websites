import { useId, type PointerEvent } from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'motion/react'
import * as m from 'motion/react-m'
import type { Finish, Shape } from '../salon.ts'

type Props = {
  finish: Finish
  shape?: Shape
  /** Let the highlight (and the cat-eye beam) follow the pointer. */
  interactive?: boolean
  className?: string
}

// Tip at the top, cuticle at the bottom, in a 100 × 160 box.
const SHAPES: Record<Shape, string> = {
  almond: 'M50 2C68 4 96 40 96 88v42c0 18-20 28-46 28S4 148 4 130V88C4 40 32 4 50 2Z',
  oval: 'M50 4c30 0 46 26 46 58v68c0 18-20 28-46 28S4 148 4 130V62C4 30 20 4 50 4Z',
  square: 'M16 6h68c7 0 12 5 12 12v112c0 18-20 28-46 28S4 148 4 130V18C4 11 9 6 16 6Z',
}

const soft = { stiffness: 150, damping: 20 }

/** Pre-computed glitter, identical on every render. */
const SPARKLES = (() => {
  let seed = 11
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const groups = ['', '', '']
  for (let i = 0; i < 120; i++) {
    const r = 0.5 + rand() * 1.5
    const x = (4 + rand() * 92).toFixed(1)
    const y = (6 + rand() * 150 - r).toFixed(1)
    const d = r.toFixed(2)
    groups[i % 3] += `M${x} ${y}l${d} ${d}-${d} ${d}-${d}-${d}Z`
  }
  return groups
})()

function Base({ finish, id }: { finish: Finish; id: string }) {
  switch (finish) {
    case 'cherry':
      return (
        <radialGradient id={id} cx="0.34" cy="0.3" r="0.95">
          <stop offset="0" stopColor="#ff5b70" />
          <stop offset="0.42" stopColor="#e3243f" />
          <stop offset="1" stopColor="#7d0d22" />
        </radialGradient>
      )
    case 'milk':
      return (
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf6" />
          <stop offset="0.7" stopColor="#f3e3dc" />
          <stop offset="1" stopColor="#ebcfc8" />
        </linearGradient>
      )
    case 'chrome':
      return (
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0" stopColor="#4a3226" />
          <stop offset="0.2" stopColor="#c98f5c" />
          <stop offset="0.36" stopColor="#fff1dd" />
          <stop offset="0.5" stopColor="#d9a06a" />
          <stop offset="0.66" stopColor="#5a3a27" />
          <stop offset="0.82" stopColor="#f1c894" />
          <stop offset="1" stopColor="#6b452d" />
        </linearGradient>
      )
    case 'glitter':
      return (
        <radialGradient id={id} cx="0.4" cy="0.35" r="0.9">
          <stop offset="0" stopColor="#f8d6d2" />
          <stop offset="1" stopColor="#c98680" />
        </radialGradient>
      )
    case 'french':
      return (
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6dcd5" />
          <stop offset="1" stopColor="#e8b9ae" />
        </linearGradient>
      )
    case 'cateye':
      return (
        <radialGradient id={id} cx="0.5" cy="0.45" r="0.8">
          <stop offset="0" stopColor="#2b1422" />
          <stop offset="1" stopColor="#080405" />
        </radialGradient>
      )
    case 'nude':
      return (
        <radialGradient id={id} cx="0.36" cy="0.3" r="0.95">
          <stop offset="0" stopColor="#f1d2c3" />
          <stop offset="0.5" stopColor="#d9aa94" />
          <stop offset="1" stopColor="#a8765f" />
        </radialGradient>
      )
    case 'natural':
      return (
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7e6e0" />
          <stop offset="0.18" stopColor="#f2d0c7" />
          <stop offset="1" stopColor="#e6b2a6" />
        </linearGradient>
      )
  }
}

function Overlay({ finish, beamId, beamX }: { finish: Finish; beamId: string; beamX: MotionValue<number> }) {
  switch (finish) {
    case 'milk':
      return <ellipse cx="50" cy="118" rx="42" ry="52" fill="#efbcb8" opacity="0.28" />
    case 'glitter':
      return (
        <>
          <path d={SPARKLES[0]} fill="#fff" opacity="0.95" />
          <path d={SPARKLES[1]} fill="#fff" opacity="0.55" />
          <path d={SPARKLES[2]} fill="#e9b37c" opacity="0.85" />
        </>
      )
    case 'french':
      return <path d="M0 0h100v62C86 44 68 36 50 36S14 44 0 62Z" fill="#fffaf7" />
    case 'natural':
      return (
        <>
          <path d="M0 0h100v20C84 14 66 12 50 12S16 14 0 20Z" fill="#fff6f2" opacity="0.85" />
          <ellipse cx="50" cy="158" rx="28" ry="20" fill="#fff" opacity="0.3" />
        </>
      )
    case 'cateye':
      return (
        <g transform="rotate(14 50 80)">
          <m.ellipse cx={beamX} cy="80" rx="13" ry="110" fill={`url(#${beamId})`} />
        </g>
      )
    default:
      return null
  }
}

/** A procedural nail: shape, finish, gloss and a soft inner rim. */
export function NailArt({ finish, shape = 'almond', interactive, className }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = (name: string) => `${name}-${uid}`
  const glossX = useMotionValue(30)
  const glossY = useMotionValue(52)
  const beam = useMotionValue(60)
  const x = useSpring(glossX, soft)
  const y = useSpring(glossY, soft)
  const beamX = useSpring(beam, soft)
  const path = SHAPES[shape]

  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    glossX.set(12 + px * 76)
    glossY.set(16 + py * 128)
    beam.set(10 + px * 80)
  }

  function onPointerLeave() {
    glossX.set(30)
    glossY.set(52)
    beam.set(60)
  }

  return (
    <svg
      viewBox="0 0 100 160"
      className={className}
      aria-hidden="true"
      onPointerMove={interactive ? onPointerMove : undefined}
      onPointerLeave={interactive ? onPointerLeave : undefined}
    >
      <defs>
        <clipPath id={id('clip')}>
          <path d={path} />
        </clipPath>
        <Base finish={finish} id={id('base')} />
        <radialGradient id={id('gloss')}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('beam')}>
          <stop offset="0" stopColor="#fff4e6" />
          <stop offset="0.35" stopColor="#d7b0ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#8a5cff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g clipPath={`url(#${id('clip')})`}>
        <path d={path} fill={`url(#${id('base')})`} />
        <Overlay finish={finish} beamId={id('beam')} beamX={beamX} />
        <m.ellipse
          cx={x}
          cy={y}
          rx="13"
          ry="30"
          fill={`url(#${id('gloss')})`}
          opacity={finish === 'cateye' ? 0.3 : finish === 'chrome' ? 0.95 : 0.7}
        />
        <path
          d="M17 44c-2 20-2 46 2 66"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.4"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path d={path} fill="none" stroke="#000" strokeOpacity="0.3" strokeWidth="5" />
      </g>
    </svg>
  )
}
