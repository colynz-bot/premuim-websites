import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { RevealLines } from '../components/RevealLines.tsx'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { fadeUp, inView, ui } from '../lib/motion.ts'
import { salon } from '../salon.ts'
import s from './Visit.module.css'

const minutes = (time: string) => {
  const [h, min] = time.split(':').map(Number)
  return h * 60 + min
}

/** Whether the studio is open right now, in Sofia time. Rechecked every minute. */
function useOpenNow() {
  const [open, setOpen] = useState<boolean | null>(null)
  useEffect(() => {
    const format = new Intl.DateTimeFormat('en-GB', {
      timeZone: salon.open.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
    const check = () => {
      const now = minutes(format.format(new Date()))
      setOpen(now >= minutes(salon.open.from) && now < minutes(salon.open.to))
    }
    check()
    const timer = window.setInterval(check, 60_000)
    return () => window.clearInterval(timer)
  }, [])
  return open
}

/** Copies the address; the label rolls over to a confirmation for a moment. */
function CopyAddress() {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(t.visit.address)
    } catch {
      return
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2200)
  }

  return (
    <button type="button" className={cx('ghost', s.copy)} onClick={copy}>
      <span className={s.swap}>
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={copied ? 'done' : 'copy'}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={ui}
          >
            {copied ? `${t.visit.copied} ✓` : t.visit.copy}
          </m.span>
        </AnimatePresence>
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? t.visit.copied : ''}
      </span>
    </button>
  )
}

export function Visit() {
  const { t, lang } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const open = useOpenNow()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [-40, 50])
  const newTab = <span className="sr-only"> {t.common.newTab}</span>

  return (
    <section ref={ref} id="visit" className={s.section} aria-labelledby="visit-title">
      <div className={cx('container', s.grid)}>
        <div>
          <p className="label">{t.visit.label}</p>
          <RevealLines id="visit-title" lines={t.visit.title} className={cx('h2', s.title)} />
          <m.address className={s.address} initial="hidden" whileInView="visible" viewport={inView} variants={fadeUp} custom={0.15}>
            {t.visit.address}
          </m.address>
          <m.div className={s.links} initial="hidden" whileInView="visible" viewport={inView} variants={fadeUp} custom={0.25}>
            <CopyAddress />
            <a className="ghost" href={salon.maps} target="_blank" rel="noopener">
              {t.visit.maps} ↗{newTab}
            </a>
            <a className="ghost" href={salon.instagram.url} target="_blank" rel="noopener">
              Instagram ↗{newTab}
            </a>
            <a className="ghost" href={salon.tiktok.url} target="_blank" rel="noopener">
              TikTok ↗{newTab}
            </a>
          </m.div>
        </div>

        <div className={s.side}>
          <m.svg className={s.star} viewBox="0 0 100 100" style={reduce ? undefined : { rotate }} aria-hidden="true">
            <path d="M50 2c3.6 27.6 18.6 42.6 48 48-29.4 5.4-44.4 20.4-48 48-3.6-27.6-18.6-42.6-48-48 29.4-5.4 44.4-20.4 48-48Z" />
          </m.svg>
          <m.div className={s.details} initial="hidden" whileInView="visible" viewport={inView} variants={fadeUp} custom={0.2}>
            {open !== null && (
              <p className={cx(s.status, open && s.open)}>
                <span className={s.pulse} aria-hidden="true" />
                {open ? t.visit.open(salon.open.to) : t.visit.closed(salon.open.from)}
              </p>
            )}
            <dl className={s.list}>
              <div className={s.block}>
                <dt className="label">{t.visit.hours}</dt>
                {salon.hours[lang].map(([days, time]) => (
                  <dd key={days} className={s.row}>
                    <span>{days}</span>
                    <span className={s.time}>{time}</span>
                  </dd>
                ))}
              </div>
              <div className={s.block}>
                <dt className="label">{t.visit.phone}</dt>
                <dd>
                  <a className={s.phone} href={salon.phone.href}>
                    {salon.phone.display}
                  </a>
                </dd>
              </div>
            </dl>
          </m.div>
        </div>
      </div>
    </section>
  )
}
