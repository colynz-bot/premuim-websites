import { useState } from 'react'
import { AnimatePresence, stagger, useMotionValue, useReducedMotion, useSpring, type Variants } from 'motion/react'
import * as m from 'motion/react-m'
import { NailArt } from '../components/NailArt.tsx'
import { RevealLines } from '../components/RevealLines.tsx'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { useFinePointer } from '../lib/hooks.ts'
import { fadeUp, inView, ui } from '../lib/motion.ts'
import { salon, services, type ServiceId } from '../salon.ts'
import s from './Services.module.css'

const list: Variants = { hidden: {}, visible: { transition: { delayChildren: stagger(0.07) } } }
const follow = { stiffness: 320, damping: 32, mass: 0.7 }

export function Services() {
  const { t, lang } = useI18n()
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState<ServiceId | null>(null)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, follow)
  const y = useSpring(pointerY, follow)
  const current = services.find((service) => service.id === hovered)
  const book = salon.studio24[lang]

  return (
    <section id="services" className={s.section} aria-labelledby="services-title">
      <div className={cx('container', s.grid)}>
        <header className={s.head}>
          <p className="label">{t.services.label}</p>
          <RevealLines id="services-title" lines={t.services.title} className={cx('h2', s.title)} />
          <m.p className={s.intro} initial="hidden" whileInView="visible" viewport={inView} variants={fadeUp} custom={0.2}>
            {t.services.intro}
          </m.p>
          <a className={cx('ghost', s.link)} href={book} target="_blank" rel="noopener">
            {t.services.link} ↗<span className="sr-only"> {t.common.newTab}</span>
          </a>
        </header>

        <m.ol
          className={s.list}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={list}
          onPointerMove={(event) => {
            pointerX.set(event.clientX)
            pointerY.set(event.clientY)
          }}
          onPointerLeave={() => setHovered(null)}
        >
          {services.map((service, i) => {
            const item = t.services.items[service.id]
            return (
              <m.li key={service.id} variants={fadeUp}>
                <a
                  className={s.row}
                  href={book}
                  target="_blank"
                  rel="noopener"
                  onPointerEnter={() => setHovered(service.id)}
                >
                  <span className={s.num}>{String(i + 1).padStart(2, '0')}</span>
                  <NailArt finish={service.finish} shape={service.shape} className={s.thumb} />
                  <span className={s.name}>{item.name}</span>
                  <span className={s.desc}>{item.text}</span>
                  <span className={s.cta} aria-hidden="true">
                    {t.services.book} →
                  </span>
                  <span className="sr-only"> — {t.nav.book} {t.common.newTab}</span>
                </a>
              </m.li>
            )
          })}
        </m.ol>
      </div>

      {/* Desktop: the hovered treatment's finish trails the cursor. */}
      {fine && !reduce && (
        <m.div
          className={s.preview}
          style={{ x, y }}
          animate={{ opacity: current ? 1 : 0, scale: current ? 1 : 0.8 }}
          transition={ui}
          aria-hidden="true"
        >
          <AnimatePresence initial={false}>
            {current && (
              <m.div
                key={current.id}
                className={s.art}
                initial={{ opacity: 0, rotate: -22, scale: 0.9 }}
                animate={{ opacity: 1, rotate: -12, scale: 1 }}
                exit={{ opacity: 0, rotate: -4, scale: 0.9 }}
                transition={ui}
              >
                <NailArt finish={current.finish} shape={current.shape} />
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </section>
  )
}
