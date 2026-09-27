import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, type PanInfo, type Variants } from 'motion/react'
import * as m from 'motion/react-m'
import { useI18n } from '../i18n/context.ts'
import { ui } from '../lib/motion.ts'
import { lockScroll, unlockScroll } from '../lib/scroll.ts'
import { works } from '../salon.ts'
import s from './Lightbox.module.css'

export type Rect = { left: number; top: number; width: number; height: number }

type Props = {
  index: number
  /** The card the photo lifts off from; null when it is out of view. */
  origin: Rect | null
  onIndex: (index: number) => void
  onClose: () => void
  /** Called once the viewer is gone, to hand focus back to the gallery. */
  onDone: () => void
}

const RADIUS = 24
const pad = (n: number) => String(n).padStart(2, '0')

/** The largest 4:5 frame that fits between the controls. */
function fit(vw: number, vh: number): Rect {
  const compact = vw < 768
  // Room kept for the top bar, caption and arrows; less on short landscape screens.
  const chrome = vh < 560 ? 110 : compact ? 210 : 180
  const width = Math.min(compact ? vw - 32 : vw - 280, (vh - chrome) * 0.8, 820)
  const height = width * 1.25
  return { left: (vw - width) / 2, top: (vh - height) / 2 - (compact ? 20 : 4), width, height }
}

// Photos pass through the window like a filmstrip: no double exposure.
const slide: Variants = {
  enter: (direction: number) => ({ x: `${direction * 100}%` }),
  center: { x: '0%' },
  leave: (direction: number) => ({ x: `${direction * -100}%` }),
}

const chrome: Variants = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0, transition: { ...ui, delay: 0.15 } },
  gone: { opacity: 0, transition: { duration: 0.15 } },
}

/**
 * Full-screen photo viewer. The photo lifts off its card and settles in the
 * middle, then glides back to its card on close. Arrows, swipe and keyboard.
 */
export function Lightbox({ index, origin, onIndex, onClose, onDone }: Props) {
  const { t } = useI18n()
  const [box, setBox] = useState(() => fit(window.innerWidth, window.innerHeight))
  const [direction, setDirection] = useState(1)
  const closeButton = useRef<HTMLButtonElement>(null)
  const done = useRef(onDone)
  const work = works[index]
  const name = t.gallery.items[work.id]

  const go = (step: number) => {
    setDirection(step)
    onIndex((index + step + works.length) % works.length)
  }

  // A rect in the viewport, expressed as a transform of the centred frame.
  const frame: Variants = {
    card: (from: Rect | null) =>
      from
        ? {
            x: from.left + from.width / 2 - (box.left + box.width / 2),
            y: from.top + from.height / 2 - (box.top + box.height / 2),
            scale: from.width / box.width,
            borderRadius: (RADIUS * box.width) / from.width,
            opacity: 1,
          }
        : { x: 0, y: 40, scale: 0.92, borderRadius: RADIUS, opacity: 0 },
    open: { x: 0, y: 0, scale: 1, borderRadius: RADIUS, opacity: 1 },
  }

  useEffect(() => {
    done.current = onDone
  })

  useEffect(() => {
    const root = document.getElementById('root')
    lockScroll()
    root?.setAttribute('inert', '')
    closeButton.current?.focus({ preventScroll: true })
    const onResize = () => setBox(fit(window.innerWidth, window.innerHeight))
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      root?.removeAttribute('inert')
      unlockScroll()
      // Runs once the exit animation has finished.
      done.current()
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight') go(1)
      else if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -64 || info.velocity.x < -480) go(1)
    else if (info.offset.x > 64 || info.velocity.x > 480) go(-1)
  }

  return (
    <div className={s.lightbox} role="dialog" aria-modal="true" aria-label={t.gallery.viewer}>
      <m.div
        className={s.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={ui}
        onClick={onClose}
      />

      <m.div
        className={s.frame}
        style={{ left: box.left, top: box.top, width: box.width, height: box.height, backgroundImage: `url(${work.small})` }}
        custom={origin}
        variants={frame}
        initial="card"
        animate="open"
        exit="card"
        transition={ui}
        drag="x"
        dragSnapToOrigin
        dragElastic={0.3}
        onDragEnd={onDragEnd}
      >
        <AnimatePresence initial={false} custom={direction}>
          <m.img
            key={work.id}
            className={s.photo}
            src={work.large}
            alt={name}
            width="1040"
            height="1300"
            decoding="async"
            draggable={false}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="leave"
            transition={ui}
          />
        </AnimatePresence>
      </m.div>

      <m.div className={s.bar} variants={chrome} initial="hidden" animate="shown" exit="gone">
        <span className={s.count} aria-live="polite">
          {pad(index + 1)} <span className={s.of}>/ {pad(works.length)}</span>
          <span className="sr-only"> — {name}</span>
        </span>
        <button ref={closeButton} type="button" className={s.control} aria-label={t.gallery.close} onClick={onClose}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
          </svg>
        </button>
      </m.div>

      <m.p
        className={s.caption}
        style={{ top: box.top + box.height + 18 }}
        variants={chrome}
        initial="hidden"
        animate="shown"
        exit="gone"
        aria-hidden="true"
      >
        {name}
      </m.p>

      <m.div className={s.nav} variants={chrome} initial="hidden" animate="shown" exit="gone">
        <button type="button" className={s.control} aria-label={t.gallery.prev} onClick={() => go(-1)}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M13.5 8H3M7 3.5 2.5 8 7 12.5" />
          </svg>
        </button>
        <button type="button" className={s.control} aria-label={t.gallery.next} onClick={() => go(1)}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2.5 8h10.5M9 3.5 13.5 8 9 12.5" />
          </svg>
        </button>
      </m.div>
    </div>
  )
}
