import { useCallback, useState } from 'react'
import { AnimatePresence, useMotionValueEvent, useScroll } from 'motion/react'
import * as m from 'motion/react-m'
import { useI18n } from '../i18n/context.ts'
import { cx } from '../lib/cx.ts'
import { useActiveSection } from '../lib/hooks.ts'
import { ui } from '../lib/motion.ts'
import { NAV_LINKS } from '../salon.ts'
import { Button } from './Button.tsx'
import { LangToggle } from './LangToggle.tsx'
import { Logo } from './Logo.tsx'
import { MobileMenu } from './MobileMenu.tsx'
import s from './Header.module.css'

type Props = { menuOpen: boolean; onMenuChange: (open: boolean) => void }

export function Header({ menuOpen, onMenuChange }: Props) {
  const { t } = useI18n()
  const active = useActiveSection()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const closeMenu = useCallback(() => onMenuChange(false), [onMenuChange])

  // Step aside while reading down, come back the moment the reader scrolls up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    setSolid(y > 24)
    setHidden(y > (scrollY.getPrevious() ?? 0) && y > 400)
  })

  return (
    <>
      <a className="skip" href="#content">
        {t.common.skip}
      </a>
      <m.header
        className={cx(s.header, solid && !menuOpen && s.solid)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: hidden && !menuOpen ? '-100%' : '0%' }}
        transition={{ opacity: { duration: 0.8, delay: 0.5 }, y: ui }}
      >
        <div className={s.inner}>
          <a href="#top" className={s.brand} aria-label={t.common.home} onClick={closeMenu}>
            <Logo />
          </a>
          <nav className={s.nav} aria-label={t.common.nav}>
            <ul>
              {NAV_LINKS.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={cx(s.link, active === id && s.current)}
                    aria-current={active === id ? 'location' : undefined}
                  >
                    {t.nav[id]}
                    {active === id && <m.span layoutId="nav-mark" className={s.mark} transition={ui} />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={s.actions}>
            <LangToggle id="header" />
            <Button href="#booking" size="sm" className={s.book}>
              {t.nav.book}
            </Button>
            <button
              type="button"
              className={s.menuButton}
              aria-expanded={menuOpen}
              aria-controls="menu"
              aria-label={menuOpen ? t.common.close : t.common.menu}
              onClick={() => onMenuChange(!menuOpen)}
            >
              <m.span className={s.bar} animate={menuOpen ? { y: 0, rotate: 45 } : { y: -4, rotate: 0 }} transition={ui} />
              <m.span className={s.bar} animate={menuOpen ? { y: 0, rotate: -45 } : { y: 4, rotate: 0 }} transition={ui} />
            </button>
          </div>
        </div>
      </m.header>
      <AnimatePresence>{menuOpen && <MobileMenu onClose={closeMenu} />}</AnimatePresence>
    </>
  )
}
