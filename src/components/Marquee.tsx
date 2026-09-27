import { Fragment, useRef } from 'react'
import {
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'motion/react'
import * as m from 'motion/react-m'
import { follow } from '../lib/motion.ts'
import s from './Marquee.module.css'

/** Share of the ribbon travelled per second at rest. */
const SPEED = 1.1

/**
 * A slow ribbon of words that speeds up with the scroll and turns around when
 * the reader scrolls back. Decorative: the same words follow as real content.
 */
export function Marquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const visible = useInView(ref)
  const { scrollY } = useScroll()
  const boost = useTransform(useSpring(useVelocity(scrollY), follow), [-2400, 0, 2400], [-5, 0, 5], { clamp: false })
  const offset = useMotionValue(0)
  const direction = useRef(-1)
  // Two copies side by side: moving by exactly one copy loops without a seam.
  const x = useTransform(offset, (value) => `${wrap(-50, 0, value)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce || !visible) return
    const extra = boost.get()
    if (extra > 0.05) direction.current = -1
    else if (extra < -0.05) direction.current = 1
    offset.set(offset.get() + (direction.current * SPEED * (1 + Math.abs(extra)) * delta) / 1000)
  })

  return (
    <div ref={ref} className={s.marquee} aria-hidden="true">
      <m.div className={s.track} style={{ x }}>
        {[0, 1].map((copy) => (
          <span key={copy} className={s.group}>
            {items.map((item) => (
              <Fragment key={item}>
                <span className={s.item}>{item}</span>
                <svg className={s.glint} viewBox="0 0 12 12">
                  <path d="M6 0c.45 3.3 2.2 5.2 6 6-3.8.8-5.55 2.7-6 6-.45-3.3-2.2-5.2-6-6 3.8-.8 5.55-2.7 6-6Z" />
                </svg>
              </Fragment>
            ))}
          </span>
        ))}
      </m.div>
    </div>
  )
}
