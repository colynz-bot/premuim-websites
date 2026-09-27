import type { Transition, Variants } from 'motion/react'

/** The one easing curve behind every reveal: soft, decisive ease-out. */
export const EASE = [0.22, 1, 0.36, 1] as const

/** Entrances: long enough to feel composed, never slow. */
export const reveal: Transition = { duration: 0.9, ease: EASE }

/** Interface feedback and layout changes: critically damped, no bounce. */
export const ui: Transition = { type: 'spring', visualDuration: 0.45, bounce: 0 }

/** Pass a delay in seconds through the `custom` prop. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { ...reveal, delay } }),
}

export const inView = { once: true, amount: 0.35 } as const
