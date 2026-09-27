import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import {
  AnimatePresence,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'motion/react'
import * as m from 'motion/react-m'
import { Lightbox, type Rect } from '../components/Lightbox.tsx'
import { RevealLines } from '../components/RevealLines.tsx'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { useFinePointer, useMedia } from '../lib/hooks.ts'
import { fadeUp, follow, inView, reveal, ui } from '../lib/motion.ts'
import { scrollToTarget } from '../lib/scroll.ts'
import { salon, works } from '../salon.ts'
import s from './Gallery.module.css'

type Work = (typeof works)[number]

type CardProps = {
  work: Work
  index: number
  /** Hidden while its photo is out in the viewer. */
  away: boolean
  onOpen: (index: number) => void
  onHover: (hovering: boolean) => void
}

// Photos unveil from the bottom as they arrive, settling from a slight zoom.
const unveil: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: { ...reveal, duration: 1.3 } },
}
const settle: Variants = {
  hidden: { scale: 1.18 },
  visible: { scale: 1, transition: { ...reveal, duration: 1.6 } },
}

const preloaded = new Set<string>()
function preload(src: string) {
  if (preloaded.has(src)) return
  preloaded.add(src)
  new Image().src = src
}

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

function Card({ work, index, away, onOpen, onHover }: CardProps) {
  const { t } = useI18n()
  const name = t.gallery.items[work.id]

  // A soft light follows the pointer across the gloss.
  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <figure className={s.card} data-index={index}>
      {/* The button watches the viewport: the clipped frame reads as invisible to the observer. */}
      <m.button
        type="button"
        className={s.open}
        data-work={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        aria-label={t.gallery.open(name)}
        aria-haspopup="dialog"
        onClick={() => onOpen(index)}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'mouse') return
          onHover(true)
          preload(work.large)
        }}
        onPointerLeave={() => onHover(false)}
        onPointerMove={onPointerMove}
      >
        <m.span className={s.frame} style={away ? { visibility: 'hidden' } : undefined} variants={unveil}>
          <m.img
            className={s.photo}
            variants={settle}
            src={work.small}
            srcSet={`${work.small} 560w, ${work.large} 1040w`}
            sizes="(min-width: 1024px) 30vw, 76vw"
            alt={name}
            width="560"
            height="700"
            loading="lazy"
            decoding="async"
          />
        </m.span>
      </m.button>
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

type LayoutProps = { away: number | null; onOpen: (index: number) => void; onHover: (hovering: boolean) => void }

/** Desktop: vertical scrolling drives a horizontal gallery pinned to the screen. */
function Pinned({ section, ...cards }: LayoutProps & { section: RefObject<HTMLElement | null> }) {
  const track = useRef<HTMLDivElement>(null)
  const distance = useMotionValue(0)
  const [runway, setRunway] = useState(0)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(() => -scrollYProgress.get() * distance.get())

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
            <Card key={work.id} work={work} index={i} away={cards.away === i} onOpen={cards.onOpen} onHover={cards.onHover} />
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

/** Touch screens and reduced motion: a native, snapping swipe gallery with position dots. */
function Swipe(cards: LayoutProps) {
  const { t } = useI18n()
  const scroller = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const el = scroller.current!
    const onScroll = () => {
      const items = el.querySelectorAll<HTMLElement>('[data-index]')
      const step = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : 1
      const end = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4
      setCurrent(end ? works.length - 1 : Math.min(works.length - 1, Math.round(el.scrollLeft / step)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="container">
        <Intro />
      </div>
      <div ref={scroller} className={s.scroller} role="group" aria-labelledby="gallery-title" tabIndex={0}>
        {works.map((work, i) => (
          <Card key={work.id} work={work} index={i} away={cards.away === i} onOpen={cards.onOpen} onHover={cards.onHover} />
        ))}
        <Follow />
      </div>
      <div className={cx('container', s.meta)} aria-hidden="true">
        <span className={s.hint}>{t.gallery.swipe} →</span>
        <span className={s.dots}>
          {works.map((work, i) => (
            <span key={work.id} className={cx(s.dot, i === current && s.on)} />
          ))}
        </span>
      </div>
    </>
  )
}

/** Desktop pointer: a pink disc that says "View" follows the cursor over the photos. */
function ViewCursor({ active }: { active: boolean }) {
  const { t } = useI18n()
  const pointerX = useMotionValue(-200)
  const pointerY = useMotionValue(-200)
  const x = useSpring(pointerX, follow)
  const y = useSpring(pointerY, follow)

  useEffect(() => {
    const onMove = (event: globalThis.PointerEvent) => {
      pointerX.set(event.clientX)
      pointerY.set(event.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [pointerX, pointerY])

  // Appear right under the pointer rather than flying in from the last spot.
  useEffect(() => {
    if (!active) return
    x.jump(pointerX.get())
    y.jump(pointerY.get())
  }, [active, x, y, pointerX, pointerY])

  return (
    <m.div className={s.cursor} style={{ x, y }} aria-hidden="true">
      <m.span
        className={s.disc}
        initial={false}
        animate={active ? { scale: 1, opacity: 1 } : { scale: 0.3, opacity: 0 }}
        transition={ui}
      >
        {t.gallery.view}
      </m.span>
    </m.div>
  )
}

export function Gallery() {
  const section = useRef<HTMLElement>(null)
  const wide = useMedia('(min-width: 1024px) and (min-height: 600px)')
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const pinned = wide && !reduce
  const [hovering, setHovering] = useState(false)
  // The photo in the viewer, the card it lifted off, and where it lands on close.
  const [open, setOpen] = useState<number | null>(null)
  const [away, setAway] = useState<number | null>(null)
  const [origin, setOrigin] = useState<Rect | null>(null)
  const [landing, setLanding] = useState<Rect | null>(null)
  const last = useRef(0)

  const cardAt = (index: number) => section.current?.querySelector<HTMLElement>(`[data-work="${index}"]`) ?? null

  function rectOf(index: number): Rect | null {
    const rect = cardAt(index)?.getBoundingClientRect()
    if (!rect || rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) return null
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
  }

  // Keep the gallery in step with the viewer, out of sight behind it.
  function bringIntoView(index: number) {
    const card = cardAt(index)?.closest('figure')
    const el = section.current
    if (!card || !el) return
    const center = card.offsetLeft + card.offsetWidth / 2
    if (pinned) {
      const runway = el.offsetHeight - window.innerHeight
      const top = el.getBoundingClientRect().top + window.scrollY
      scrollToTarget(top + Math.min(Math.max(center - window.innerWidth / 2, 0), runway), { immediate: true })
    } else if (card.parentElement) {
      card.parentElement.scrollLeft = center - card.parentElement.clientWidth / 2
    }
  }

  function onOpen(index: number) {
    setOrigin(rectOf(index))
    setLanding(null)
    setAway(index)
    setOpen(index)
    setHovering(false)
    last.current = index
  }

  function onIndex(index: number) {
    bringIntoView(index)
    setAway(index)
    setOpen(index)
    last.current = index
  }

  function onClose() {
    if (open === null) return
    setLanding(rectOf(open))
    setOpen(null)
  }

  const cards = { away, onOpen, onHover: setHovering }

  return (
    <section
      ref={section}
      id="gallery"
      className={cx(pinned ? s.pinned : s.swipe, fine && !reduce && s.cursorless)}
      aria-labelledby="gallery-title"
    >
      {pinned ? <Pinned section={section} {...cards} /> : <Swipe {...cards} />}
      {fine && !reduce && <ViewCursor active={hovering && open === null} />}
      {createPortal(
        <AnimatePresence custom={landing} onExitComplete={() => setAway(null)}>
          {open !== null && (
            <Lightbox
              key="viewer"
              index={open}
              origin={origin}
              onIndex={onIndex}
              onClose={onClose}
              onDone={() => cardAt(last.current)?.focus({ preventScroll: true })}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  )
}
