import { useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import * as m from 'motion/react-m'
import { NailArt } from '../components/NailArt.tsx'
import { RevealLines } from '../components/RevealLines.tsx'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { useMedia } from '../lib/hooks.ts'
import { fadeUp, inView } from '../lib/motion.ts'
import { finishes, salon } from '../salon.ts'
import s from './Finishes.module.css'

function Intro() {
  const { t } = useI18n()
  return (
    <div className={s.intro}>
      <p className="label">{t.finishes.label}</p>
      <RevealLines id="finishes-title" lines={t.finishes.title} className={cx('h2', s.title)} />
      <m.p className={s.lead} initial="hidden" whileInView="visible" viewport={inView} variants={fadeUp} custom={0.2}>
        {t.finishes.intro}
      </m.p>
    </div>
  )
}

function Card({ finish, drift }: { finish: (typeof finishes)[number]; drift?: MotionValue<number> }) {
  const { t } = useI18n()
  return (
    <figure className={s.card} style={{ '--glow': finish.glow } as CSSProperties}>
      <div className={s.frame}>
        <m.div className={s.drift} style={drift ? { x: drift } : undefined}>
          <NailArt finish={finish.id} shape={finish.shape} interactive className={s.art} />
        </m.div>
      </div>
      <figcaption className={s.caption}>
        <span className={s.name}>{finish.name}</span>
        <span className={s.desc}>{t.finishes.items[finish.id]}</span>
      </figcaption>
    </figure>
  )
}

function Instagram() {
  const { t } = useI18n()
  return (
    <a className={s.end} href={salon.instagram.url} target="_blank" rel="noopener">
      <span className="label">Instagram</span>
      <span className={s.handle}>{salon.instagram.handle}</span>
      <span className="ghost">{t.finishes.instagram} ↗</span>
      <span className="sr-only"> {t.common.newTab}</span>
    </a>
  )
}

/** Desktop: vertical scrolling drives a horizontal gallery pinned to the screen. */
function Pinned({ section }: { section: RefObject<HTMLElement | null> }) {
  const track = useRef<HTMLDivElement>(null)
  const distance = useMotionValue(0)
  const [runway, setRunway] = useState(0)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(() => -scrollYProgress.get() * distance.get())
  // Artworks travel a little slower than their frames: a quiet parallax.
  const drift = useTransform(scrollYProgress, [0, 1], [36, -36])

  useLayoutEffect(() => {
    const el = track.current!
    const measure = () => {
      const d = Math.max(0, el.scrollWidth - window.innerWidth)
      distance.set(d)
      setRunway(d)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [distance])

  return (
    <>
      <div className={s.sticky}>
        <m.div ref={track} className={s.track} style={{ x }}>
          <Intro />
          {finishes.map((finish) => (
            <Card key={finish.id} finish={finish} drift={drift} />
          ))}
          <Instagram />
        </m.div>
        <div className={s.progress} aria-hidden="true">
          <m.span style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
      {/* Extra scroll length: the distance the gallery travels sideways. */}
      <div style={{ height: runway }} aria-hidden="true" />
    </>
  )
}

/** Touch screens and reduced motion: a native, snapping swipe gallery. */
function Swipe() {
  const { t } = useI18n()
  return (
    <>
      <div className="container">
        <Intro />
      </div>
      <div className={s.scroller} role="group" aria-labelledby="finishes-title" tabIndex={0}>
        {finishes.map((finish) => (
          <Card key={finish.id} finish={finish} />
        ))}
        <Instagram />
      </div>
      <p className={cx('container', s.hint)} aria-hidden="true">
        {t.finishes.swipe} →
      </p>
    </>
  )
}

export function Finishes() {
  const section = useRef<HTMLElement>(null)
  const wide = useMedia('(min-width: 1024px) and (min-height: 600px)')
  const reduce = useReducedMotion()
  const pinned = wide && !reduce

  return (
    <section
      ref={section}
      id="finishes"
      className={pinned ? s.pinned : s.swipe}
      aria-labelledby="finishes-title"
    >
      {pinned ? <Pinned section={section} /> : <Swipe />}
    </section>
  )
}
