import { useRef } from 'react'
import { useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { RevealLines } from '../components/RevealLines.tsx'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { fadeUp, inView } from '../lib/motion.ts'
import { salon } from '../salon.ts'
import s from './Visit.module.css'

export function Visit() {
  const { t, lang } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
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
            <a className="ghost" href={salon.maps} target="_blank" rel="noopener">
              {t.visit.maps} ↗{newTab}
            </a>
            <a className="ghost" href={salon.instagram.url} target="_blank" rel="noopener">
              Instagram {salon.instagram.handle} ↗{newTab}
            </a>
            {salon.phone && (
              <a className="ghost" href={salon.phone.href}>
                {salon.phone.display}
              </a>
            )}
          </m.div>
        </div>

        <div className={s.side}>
          <m.svg className={s.star} viewBox="0 0 100 100" style={reduce ? undefined : { rotate }} aria-hidden="true">
            <path d="M50 2c3.6 27.6 18.6 42.6 48 48-29.4 5.4-44.4 20.4-48 48-3.6-27.6-18.6-42.6-48-48 29.4-5.4 44.4-20.4 48-48Z" />
          </m.svg>
          <m.div className={s.hours} initial="hidden" whileInView="visible" viewport={inView} variants={fadeUp} custom={0.2}>
            <p className="label">{t.visit.hours}</p>
            {salon.hours ? (
              <dl className={s.table}>
                {salon.hours[lang].map(([days, time]) => (
                  <div key={days} className={s.row}>
                    <dt>{days}</dt>
                    <dd>{time}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className={s.note}>
                {t.visit.hoursNote}{' '}
                <a className="ghost" href={salon.studio24[lang]} target="_blank" rel="noopener">
                  Studio24 ↗{newTab}
                </a>
              </p>
            )}
          </m.div>
        </div>
      </div>
    </section>
  )
}
