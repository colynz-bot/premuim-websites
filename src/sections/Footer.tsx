import { useRef } from 'react'
import { useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import logoLarge from '../assets/img/logo-sugar-nails-1600.webp'
import logoSmall from '../assets/img/logo-sugar-nails-800.webp'
import { LangToggle } from '../components/LangToggle.tsx'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { salon } from '../salon.ts'
import s from './Footer.module.css'

export function Footer() {
  const { t, lang } = useI18n()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  // The salon's logo rises out of the floor as the page comes to rest.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['45%', '0%'])
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
            <a className="ghost" href={salon.tiktok.url} target="_blank" rel="noopener">
              TikTok ↗{newTab}
            </a>
          </li>
          <li>
            <a className="ghost" href={salon.phone.href}>
              {salon.phone.display}
            </a>
          </li>
        </ul>
      </div>
      <div className={cx('container', s.markWrap)}>
        <m.img
          className={s.mark}
          src={logoSmall}
          srcSet={`${logoSmall} 800w, ${logoLarge} 1600w`}
          sizes="(min-width: 900px) 60vw, 90vw"
          alt={salon.name}
          width="1600"
          height="856"
          loading="lazy"
          decoding="async"
          style={reduce ? undefined : { y }}
        />
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
