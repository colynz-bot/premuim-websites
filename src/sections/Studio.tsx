import { useRef } from 'react'
import { useReducedMotion, useScroll, useTransform, type Variants } from 'motion/react'
import * as m from 'motion/react-m'
import deskLarge from '../assets/img/studio-desk-1080.webp'
import deskSmall from '../assets/img/studio-desk-720.webp'
import portrait from '../assets/img/studio-rosalina-348.webp'
import { RevealLines } from '../components/RevealLines.tsx'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { fadeUp, inView, reveal, ui } from '../lib/motion.ts'
import { salon } from '../salon.ts'
import s from './Studio.module.css'

// The studio photo unveils from the bottom and settles from a slight zoom.
const unveil: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  visible: { clipPath: 'inset(0% 0% 0% 0%)', transition: { ...reveal, duration: 1.4 } },
}
const settle: Variants = {
  hidden: { scale: 1.2 },
  visible: { scale: 1, transition: { ...reveal, duration: 1.8 } },
}

export function Studio() {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Two depths: the studio photo drifts slowly, the polaroid floats a little faster.
  const deskY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const polaroidY = useTransform(scrollYProgress, [0, 1], [70, -70])
  const polaroidRotate = useTransform(scrollYProgress, [0, 1], [-9, 2])

  return (
    <section ref={ref} id="studio" className={s.section} aria-labelledby="studio-title">
      <div className={cx('container', s.grid)}>
        {/* The wrapper watches the viewport: a clipped element reads as invisible to the observer. */}
        <m.div className={s.visual} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
          <m.div className={s.desk} variants={unveil}>
            <m.div className={s.zoom} variants={settle}>
              <m.img
                src={deskSmall}
                srcSet={`${deskSmall} 720w, ${deskLarge} 1080w`}
                sizes="(min-width: 900px) 46vw, 90vw"
                alt={t.studio.desk}
                width="1080"
                height="880"
                loading="lazy"
                decoding="async"
                style={reduce ? undefined : { y: deskY }}
              />
            </m.div>
          </m.div>
          <m.div className={s.polaroid} style={reduce ? undefined : { y: polaroidY, rotate: polaroidRotate }}>
            {/* On hover the polaroid lifts and turns towards the reader. */}
            <m.img
              src={portrait}
              alt={t.studio.portrait}
              width="348"
              height="472"
              loading="lazy"
              decoding="async"
              whileHover={{ rotate: 5, scale: 1.05, y: -8 }}
              transition={ui}
            />
          </m.div>
        </m.div>

        <div className={s.copy}>
          <p className="label">{t.studio.label}</p>
          <RevealLines id="studio-title" lines={t.studio.title} className={cx('h2', s.title)} />
          <m.p className={cx('label', s.role)} initial="hidden" whileInView="visible" viewport={inView} variants={fadeUp} custom={0.1}>
            {t.studio.role}
          </m.p>
          <m.p className={s.body} initial="hidden" whileInView="visible" viewport={inView} variants={fadeUp} custom={0.15}>
            {t.studio.body}
          </m.p>
          <m.p className={s.ask} initial="hidden" whileInView="visible" viewport={inView} variants={fadeUp} custom={0.25}>
            {t.studio.question}{' '}
            <a className="ghost" href={salon.instagram.url} target="_blank" rel="noopener">
              {t.studio.message} ↗<span className="sr-only"> {t.common.newTab}</span>
            </a>
          </m.p>
          <m.div className={s.brands} initial="hidden" whileInView="visible" viewport={inView} variants={fadeUp} custom={0.35}>
            <p className="label">{t.studio.brands}</p>
            <ul>
              {salon.brands.map((brand) => (
                <li key={brand}>{brand}</li>
              ))}
            </ul>
          </m.div>
        </div>
      </div>
    </section>
  )
}
