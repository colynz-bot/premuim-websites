import { useRef } from 'react'
import { stagger, useReducedMotion, useScroll, useTransform, type MotionValue, type Variants } from 'motion/react'
import * as m from 'motion/react-m'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { fadeUp, reveal } from '../lib/motion.ts'
import s from './Manifesto.module.css'

const list: Variants = { hidden: {}, visible: { transition: { delayChildren: stagger(0.08) } } }
const rule: Variants = { hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { ...reveal, duration: 1.4 } } }

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <>
      <m.span style={{ opacity }}>{children}</m.span>{' '}
    </>
  )
}

export function Manifesto() {
  const { t } = useI18n()
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  // Each word brightens as the paragraph travels up the screen.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] })
  const words = t.reasons.text.split(' ')

  return (
    <section id="about" className={s.section} aria-labelledby="about-label">
      <div className="container">
        <h2 id="about-label" className="label">
          {t.reasons.label}
        </h2>
        <p ref={ref} className={s.text}>
          {reduce
            ? t.reasons.text
            : words.map((word, i) => (
                <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                  {word}
                </Word>
              ))}
        </p>
        <h3 className={s.heading}>{t.reasons.title}</h3>
        <m.ol
          className={s.reasons}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={list}
        >
          {t.reasons.items.map((item, i) => (
            <m.li key={i} className={s.reason} variants={fadeUp}>
              <m.span className={s.rule} variants={rule} aria-hidden="true" />
              <span className={cx('label', s.index)}>0{i + 1}</span>
              <h4 className={s.title}>{item.title}</h4>
              <p className={s.copy}>{item.text}</p>
            </m.li>
          ))}
        </m.ol>
      </div>
    </section>
  )
}
