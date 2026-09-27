import { useRef } from 'react'
import { useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import * as m from 'motion/react-m'
import { RevealLines } from '../components/RevealLines.tsx'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { fadeUp, inView } from '../lib/motion.ts'
import { salon } from '../salon.ts'
import s from './Booking.module.css'

type StepProps = { index: number; total: number; progress: MotionValue<number>; still: boolean; title: string; text: string }

function Step({ index, total, progress, still, title, text }: StepProps) {
  const at = index / (total - 1)
  const lit = useTransform(progress, [at - 0.04, at], [0, 1])
  return (
    <li className={s.step}>
      <span className={s.dot} aria-hidden="true">
        <m.span className={s.dotFill} style={still ? undefined : { opacity: lit, scale: lit }} />
      </span>
      <span className={cx('label', s.stepNum)}>0{index + 1}</span>
      <h3 className={s.stepTitle}>{title}</h3>
      <p className={s.stepText}>{text}</p>
    </li>
  )
}

export function Booking() {
  const { t, lang } = useI18n()
  const section = useRef<HTMLElement>(null)
  const steps = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  // The rail fills step by step as the reader moves through the section.
  const { scrollYProgress: progress } = useScroll({ target: steps, offset: ['start 0.8', 'end 0.5'] })
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] })
  const ghostY = useTransform(scrollYProgress, [0, 1], ['-14%', '14%'])

  return (
    <section ref={section} id="booking" className={s.section} aria-labelledby="booking-title">
      <m.span className={s.ghost} style={reduce ? undefined : { y: ghostY }} aria-hidden="true">
        24/7
      </m.span>
      <div className={cx('container', s.grid)}>
        <div>
          <p className="label">{t.booking.label}</p>
          <RevealLines id="booking-title" lines={t.booking.title} className={cx('h2', s.title)} />
          <m.p className={s.body} initial="hidden" whileInView="visible" viewport={inView} variants={fadeUp} custom={0.2}>
            {t.booking.body}
          </m.p>
          <div ref={steps} className={s.steps}>
            <span className={s.rail} aria-hidden="true">
              <m.span className={s.fill} style={reduce ? undefined : { scaleY: progress }} />
            </span>
            <ol className={s.list}>
              {t.booking.steps.map((step, i) => (
                <Step
                  key={i}
                  index={i}
                  total={t.booking.steps.length}
                  progress={progress}
                  still={Boolean(reduce)}
                  {...step}
                />
              ))}
            </ol>
          </div>
          <p className={s.fallback}>
            {t.booking.fallback}{' '}
            <a className="ghost" href={salon.studio24[lang]} target="_blank" rel="noopener">
              {t.booking.open} ↗<span className="sr-only"> {t.common.newTab}</span>
            </a>{' '}
            {t.booking.call}{' '}
            <a className="ghost" href={salon.phone.href}>
              {salon.phone.display}
            </a>
          </p>
        </div>

        {/* The salon's own Studio24 widget, loaded only when it nears the viewport. */}
        <m.div
          className={s.widget}
          data-loading="Studio24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
        >
          <iframe src={salon.bookingWidget} title={t.booking.frame} loading="lazy" />
        </m.div>
      </div>
    </section>
  )
}
