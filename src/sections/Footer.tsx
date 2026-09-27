import { useRef } from 'react'
import { useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { LangToggle } from '../components/LangToggle.tsx'
import { Logo } from '../components/Logo.tsx'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { salon } from '../salon.ts'
import s from './Footer.module.css'

export function Footer() {
  const { t, lang } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  // The wordmark rises out of the floor as the page comes to rest.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['55%', '0%'])
  const newTab = <span className="sr-only"> {t.common.newTab}</span>

  return (
    <footer ref={ref} className={s.footer}>
      <div className={cx('container', s.top)}>
        <p className={s.tagline}>{t.footer.tagline}</p>
        <ul className={s.links}>
          <li>
            <a className="ghost" href={salon.studio24[lang]} target="_blank" rel="noopener">
              Studio24 ↗{newTab}
            </a>
          </li>
          <li>
            <a className="ghost" href={salon.instagram.url} target="_blank" rel="noopener">
              Instagram ↗{newTab}
            </a>
          </li>
          <li>
            <a className="ghost" href={salon.maps} target="_blank" rel="noopener">
              Google Maps ↗{newTab}
            </a>
          </li>
        </ul>
      </div>
      <div className={s.markWrap} aria-hidden="true">
        <m.div className={s.mark} style={reduce ? undefined : { y }}>
          <Logo className={s.logo} />
        </m.div>
      </div>
      <div className={cx('container', s.bottom)}>
        <span>
          © {new Date().getFullYear()} {salon.name}. {t.footer.rights}
        </span>
        <LangToggle id="footer" />
        <a className="ghost" href="#top">
          {t.footer.top} ↑
        </a>
      </div>
    </footer>
  )
}
