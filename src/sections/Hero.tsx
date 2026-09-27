import { useRef } from 'react'
import { useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { Button } from '../components/Button.tsx'
import { RevealLines } from '../components/RevealLines.tsx'
import { SugarField } from '../components/SugarField.tsx'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { fadeUp } from '../lib/motion.ts'
import { salon } from '../salon.ts'
import s from './Hero.module.css'

export function Hero() {
  const { t, lang } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // The copy sinks slower than the page while the crystals dissolve.
  const y = useTransform(scrollYProgress, [0, 1], [0, 140])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const glow = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} id="top" className={s.hero} aria-labelledby="hero-title">
      <m.div className={s.glow} style={reduce ? undefined : { opacity: glow }} aria-hidden="true" />
      <SugarField progress={reduce ? undefined : scrollYProgress} className={s.field} />
      <m.div className={cx('container', s.content)} style={reduce ? undefined : { y, opacity }}>
        <m.p className="label" initial="hidden" animate="visible" variants={fadeUp} custom={0.15}>
          {t.hero.label}
        </m.p>
        <RevealLines as="h1" id="hero-title" lines={t.hero.title} className={s.title} delay={0.3} onMount />
        <m.p className={s.body} initial="hidden" animate="visible" variants={fadeUp} custom={0.75}>
          {t.hero.body}
        </m.p>
        <m.div className={s.actions} initial="hidden" animate="visible" variants={fadeUp} custom={0.9}>
          <Button href={salon.studio24[lang]} external size="lg">
            {t.hero.cta}
          </Button>
          <a className="ghost" href="#services">
            {t.hero.secondary}
          </a>
        </m.div>
        <m.p className={s.note} initial="hidden" animate="visible" variants={fadeUp} custom={1.05}>
          {t.hero.note}
        </m.p>
      </m.div>
    </section>
  )
}
