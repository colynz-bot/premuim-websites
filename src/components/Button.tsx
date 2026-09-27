import { useRef, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import { useMotionValue, useReducedMotion, useSpring, type Variants } from 'motion/react'
import * as m from 'motion/react-m'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { useFinePointer } from '../lib/hooks.ts'
import { EASE } from '../lib/motion.ts'
import s from './Button.module.css'

type Props = {
  href: string
  children: ReactNode
  external?: boolean
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  className?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

const pull = { stiffness: 220, damping: 20, mass: 0.6 }

// On hover the arrow slips out to the right and returns from the left.
const arrow: Variants = {
  rest: { x: 0, opacity: 1 },
  hover: {
    x: [0, 14, -14, 0],
    opacity: [1, 0, 0, 1],
    transition: { duration: 0.6, times: [0, 0.4, 0.41, 1], ease: ['easeIn', 'linear', EASE] },
  },
}

/** The primary action: a pink pill with a gentle magnetic pull and a travelling arrow. */
export function Button({ href, children, external, size = 'md', block, className, onClick }: Props) {
  const { t } = useI18n()
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, pull)
  const springY = useSpring(y, pull)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const magnetic = fine && !reduce && !block

  function onPointerMove(event: PointerEvent<HTMLAnchorElement>) {
    const el = ref.current
    if (!magnetic || !el) return
    const rect = el.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * 0.12)
    y.set((event.clientY - rect.top - rect.height / 2) * 0.2)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <m.a
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
      className={cx(s.button, s[size], block && s.block, className)}
      style={{ x: springX, y: springY }}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onClick={onClick}
    >
      <span className={s.label}>{children}</span>
      <span className={s.icon} aria-hidden="true">
        <m.svg variants={arrow} viewBox="0 0 16 16" width="16" height="16">
          <path d="M2.5 8h10.5M9 3.5 13.5 8 9 12.5" />
        </m.svg>
      </span>
      {external && <span className="sr-only"> {t.common.newTab}</span>}
    </m.a>
  )
}
