import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import * as m from 'motion/react-m'
import { RevealLines } from '../components/RevealLines.tsx'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { useMedia } from '../lib/hooks.ts'
import { fadeUp, inView } from '../lib/motion.ts'
import { salon, works } from '../salon.ts'
import s from './Gallery.module.css'

function Intro() {
  const { t } = useI18n()
  return (
    <div className={s.intro}>
      <p className="label">{t.gallery.label}</p>
      <RevealLines id="gallery-title" lines={t.gallery.title} className={cx('h2', s.title)} />
      <m.p className={s.lead} initial="hidden" whileInView="visible" viewport={inView} variants={fadeUp} custom={0.2}>
        {t.gallery.intro}
      </m.p>
    </div>
  )
}

function Card({ work, index, drift }: { work: (typeof works)[number]; index: number; drift?: MotionValue<number> }) {
  const { t } = useI18n()
  const name = t.gallery.items[work.id]
  return (
    <figure className={s.card}>
      <div className={s.frame}>
        <m.div className={s.drift} style={drift ? { x: drift } : undefined}>
          <img
            className={s.photo}
            src={work.small}
            srcSet={`${work.small} 560w, ${work.large} 1040w`}
            sizes="(min-width: 1024px) 26vw, 76vw"
            alt={name}
            width="560"
            height="700"
            loading="lazy"
            decoding="async"
          />
        </m.div>
      </div>
      <figcaption className={s.caption}>
        <span className={s.index}>{String(index + 1).padStart(2, '0')}</span>
        {name}
      </figcaption>
    </figure>
  )
}

function Follow() {
  const { t } = useI18n()
  const newTab = <span className="sr-only"> {t.common.newTab}</span>
  return (
    <div className={s.end}>
      <span className="label">{t.gallery.follow}</span>
      <a className={s.handle} href={salon.instagram.url} target="_blank" rel="noopener">
        {salon.instagram.handle}
        <span className={s.network}>Instagram ↗</span>
        {newTab}
      </a>
      <a className={s.handle} href={salon.tiktok.url} target="_blank" rel="noopener">
        {salon.tiktok.handle}
        <span className={s.network}>TikTok ↗</span>
        {newTab}
      </a>
    </div>
  )
}

/** Desktop: vertical scrolling drives a horizontal gallery pinned to the screen. */
function Pinned({ section }: { section: RefObject<HTMLElement | null> }) {
  const track = useRef<HTMLDivElement>(null)
  const distance = useMotionValue(0)
  const [runway, setRunway] = useState(0)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(() => -scrollYProgress.get() * distance.get())
  // Photos travel a little slower than their frames: a quiet parallax.
  const drift = useTransform(scrollYProgress, [0, 1], [32, -32])

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
          {works.map((work, i) => (
            <Card key={work.id} work={work} index={i} drift={drift} />
          ))}
          <Follow />
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
      <div className={s.scroller} role="group" aria-labelledby="gallery-title" tabIndex={0}>
        {works.map((work, i) => (
          <Card key={work.id} work={work} index={i} />
        ))}
        <Follow />
      </div>
      <p className={cx('container', s.hint)} aria-hidden="true">
        {t.gallery.swipe} →
      </p>
    </>
  )
}

export function Gallery() {
  const section = useRef<HTMLElement>(null)
  const wide = useMedia('(min-width: 1024px) and (min-height: 600px)')
  const reduce = useReducedMotion()
  const pinned = wide && !reduce

  return (
    <section ref={section} id="gallery" className={pinned ? s.pinned : s.swipe} aria-labelledby="gallery-title">
      {pinned ? <Pinned section={section} /> : <Swipe />}
    </section>
  )
}
