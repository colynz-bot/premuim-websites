import { Fragment, useRef } from 'react'
import { useInView } from 'motion/react'
import * as m from 'motion/react-m'
import { cx } from '../lib/cx.ts'
import { reveal } from '../lib/motion.ts'
import s from './RevealLines.module.css'

type Props = {
  lines: string[]
  as?: 'h1' | 'h2'
  id?: string
  className?: string
  delay?: number
  /** Play on mount (hero) instead of when scrolled into view. */
  onMount?: boolean
}

/** Headline lines rising out of a mask, one after another. */
export function RevealLines({ lines, as: Tag = 'h2', id, className, delay = 0, onMount }: Props) {
  // Watch the heading itself: the lines start clipped by their masks, so they never "enter" the viewport.
  const ref = useRef<HTMLHeadingElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.5 })
  const show = onMount || seen

  return (
    <Tag ref={ref} id={id} className={cx(s.lines, className)}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          <span className={s.mask}>
            <m.span
              className={s.line}
              initial={{ y: '115%' }}
              animate={show ? { y: '0%' } : undefined}
              transition={{ ...reveal, duration: 1.1, delay: delay + i * 0.09 }}
            >
              {line}
            </m.span>
          </span>
          {i < lines.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  )
}
