import { useState } from 'react'
import { stagger, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity, type Variants } from 'motion/react'
import * as m from 'motion/react-m'
import { Marquee } from '../components/Marquee.tsx'
import { RevealLines } from '../components/RevealLines.tsx'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { useFinePointer } from '../lib/hooks.ts'
import { fadeUp, follow, inView, ui } from '../lib/motion.ts'
import { services, type ServiceId } from '../salon.ts'
import s from './Services.module.css'

const list: Variants = { hidden: {}, visible: { transition: { delayChildren: stagger(0.07) } } }

export function Services() {
  const { t } = useI18n()
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState<ServiceId | null>(null)
  // Preview photos load on the first hover over the list, not with the page.
  const [armed, setArmed] = useState(false)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, follow)
  const y = useSpring(pointerY, follow)
  // The photo swings behind fast sideways moves, like a card held by its corner.
  const tilt = useSpring(useTransform(useVelocity(x), [-1600, 0, 1600], [9, 0, -9]), follow)

  return (
    <section id="services" className={s.section} aria-labelledby="services-title">
      <Marquee items={services.map((service) => t.services.items[service.id].name)} />
      <div className={cx('container', s.grid)}>
        <header className={s.head}>
          <p className="label">{t.services.label}</p>
          <RevealLines id="services-title" lines={t.services.title} className={cx('h2', s.title)} />
          <m.p className={s.intro} initial="hidden" whileInView="visible" viewport={inView} variants={fadeUp} custom={0.2}>
            {t.services.intro}
          </m.p>
        </header>

        <m.ol
          className={s.list}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={list}
          onPointerEnter={() => setArmed(true)}
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
                <a className={s.row} href="#booking" onPointerEnter={() => setHovered(service.id)}>
                  <span className={s.num}>{String(i + 1).padStart(2, '0')}</span>
                  <img className={s.thumb} src={service.image} alt="" width="480" height="600" loading="lazy" decoding="async" />
                  <span className={s.name}>{item.name}</span>
                  {service.price !== null && <span className={s.price}>{t.services.from(service.price)}</span>}
                  <span className={s.desc}>{item.text}</span>
                  <span className={s.cta} aria-hidden="true">
                    {t.services.book} →
                  </span>
                </a>
              </m.li>
            )
          })}
        </m.ol>
      </div>

      {/* Desktop: a photo of the hovered treatment trails the cursor. */}
      {fine && !reduce && armed && (
        <m.div
          className={s.preview}
          style={{ x, y, rotate: tilt }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.85 }}
          transition={ui}
          aria-hidden="true"
        >
          {services.map((service) => {
            const active = service.id === hovered
            return (
              <m.img
                key={service.id}
                className={s.photo}
                src={service.image}
                alt=""
                width="480"
                height="600"
                decoding="async"
                initial={false}
                animate={{ opacity: active ? 1 : 0, rotate: active ? -4 : -10, scale: active ? 1 : 0.94 }}
                transition={ui}
              />
            )
          })}
        </m.div>
      )}
    </section>
  )
}
