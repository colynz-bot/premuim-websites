import { useRef, type PointerEvent } from 'react'
import { useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from 'motion/react'
import * as m from 'motion/react-m'
import { Button } from '../components/Button.tsx'
import { RevealLines } from '../components/RevealLines.tsx'
import { SugarField } from '../components/SugarField.tsx'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { useFinePointer } from '../lib/hooks.ts'
import { fadeUp, follow, reveal } from '../lib/motion.ts'
import { salon } from '../salon.ts'
import s from './Hero.module.css'

// The five stars light up one after another.
const star: Variants = {
  hidden: { opacity: 0.15, scale: 0.4 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { ...reveal, delay: 1.25 + i * 0.07 } }),
}

export function Hero() {
  const { t, lang } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // The copy sinks slower than the page while the crystals dissolve.
  const y = useTransform(scrollYProgress, [0, 1], [0, 140])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const glow = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const cue = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  // Depth: the nail drifts gently against the cursor, the copy stays put.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const depthX = useSpring(useTransform(pointerX, [-1, 1], [18, -18]), follow)
  const depthY = useSpring(useTransform(pointerY, [-1, 1], [12, -12]), follow)
  const tilt = fine && !reduce

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (!tilt) return
    pointerX.set((event.clientX / window.innerWidth) * 2 - 1)
    pointerY.set((event.clientY / window.innerHeight) * 2 - 1)
  }

  return (
    <section ref={ref} id="top" className={s.hero} aria-labelledby="hero-title" onPointerMove={onPointerMove}>
      <m.div className={s.depth} style={tilt ? { x: depthX, y: depthY } : undefined} aria-hidden="true">
        <m.div className={s.glow} style={reduce ? undefined : { opacity: glow }} />
        <SugarField progress={reduce ? undefined : scrollYProgress} className={s.field} />
      </m.div>
      <m.div className={cx('container', s.content)} style={reduce ? undefined : { y, opacity }}>
        <m.p className="label" initial="hidden" animate="visible" variants={fadeUp} custom={0.15}>
          {t.hero.label}
        </m.p>
        <RevealLines as="h1" id="hero-title" lines={t.hero.title} className={s.title} delay={0.3} onMount />
        <m.p className={s.body} initial="hidden" animate="visible" variants={fadeUp} custom={0.75}>
          {t.hero.body}
        </m.p>
        <m.div className={s.actions} initial="hidden" animate="visible" variants={fadeUp} custom={0.9}>
          <Button href="#booking" size="lg">
            {t.hero.cta}
          </Button>
          <a className="ghost" href="#services">
            {t.hero.secondary}
          </a>
        </m.div>
        <m.a
          className={s.rating}
          href={salon.studio24[lang]}
          target="_blank"
          rel="noopener"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1.05}
        >
          <span className={s.stars} aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <m.span key={i} className={s.star} variants={star} custom={i}>
                ★
              </m.span>
            ))}
          </span>
          {t.hero.rating(salon.rating.score, salon.rating.reviews)}
          <span className="sr-only"> {t.common.newTab}</span>
        </m.a>
      </m.div>
      <m.div className={s.cue} style={reduce ? undefined : { opacity: cue }} aria-hidden="true">
        <m.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...reveal, delay: 1.6 }}>
          {t.hero.scroll}
        </m.span>
        <m.span
          className={s.line}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ ...reveal, duration: 1.2, delay: 1.7 }}
        />
      </m.div>
    </section>
  )
}
