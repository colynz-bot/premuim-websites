import { useEffect, useRef, type MouseEvent } from 'react'
import * as m from 'motion/react-m'
import { useI18n } from '../i18n/context.ts'
import { EASE, reveal } from '../lib/motion.ts'
import { lockScroll, scrollToTarget, unlockScroll } from '../lib/scroll.ts'
import { NAV_LINKS, salon } from '../salon.ts'
import { Button } from './Button.tsx'
import s from './MobileMenu.module.css'

/** Unlocks the page once, whether a link or the closing curtain gets there first. */
function release(held: { current: boolean }) {
  if (!held.current) return
  held.current = false
  unlockScroll()
}

/** Full-screen menu that drops like a curtain; links rise in one after another. */
export function MobileMenu({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const first = useRef<HTMLAnchorElement>(null)
  const held = useRef(false)

  useEffect(() => {
    const page = document.getElementById('page')
    lockScroll()
    held.current = true
    page?.setAttribute('inert', '')
    first.current?.focus({ preventScroll: true })
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      release(held)
      page?.removeAttribute('inert')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  function go(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault()
    onClose()
    // Let the page glide while the curtain rises.
    release(held)
    const section = document.getElementById(id)
    if (section) scrollToTarget(section)
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <m.div
      id="menu"
      className={s.menu}
      role="dialog"
      aria-modal="true"
      aria-label={t.common.nav}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <nav className={s.nav} aria-label={t.common.nav}>
        <ul>
          {NAV_LINKS.map((id, i) => (
            <li key={id} className={s.mask}>
              <m.a
                ref={i === 0 ? first : undefined}
                href={`#${id}`}
                className={s.link}
                onClick={(event) => go(event, id)}
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ ...reveal, delay: 0.18 + i * 0.06 }}
              >
                <span className={s.index}>0{i + 1}</span>
                {t.nav[id]}
              </m.a>
            </li>
          ))}
        </ul>
      </nav>
      <m.div
        className={s.foot}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...reveal, delay: 0.42 }}
      >
        <Button href="#booking" block onClick={(event) => go(event, 'booking')}>
          {t.nav.book}
        </Button>
        <address className={s.address}>{t.visit.address}</address>
        <a className="ghost" href={salon.instagram.url} target="_blank" rel="noopener">
          Instagram {salon.instagram.handle}
          <span className="sr-only"> {t.common.newTab}</span>
        </a>
      </m.div>
    </m.div>
  )
}
