import { useEffect, useState } from 'react'
import { AnimatePresence, useMotionValueEvent, useScroll } from 'motion/react'
import * as m from 'motion/react-m'
import { useI18n } from '../i18n/context.ts'
import { useMedia } from '../lib/hooks.ts'
import { ui } from '../lib/motion.ts'
import { Button } from './Button.tsx'
import s from './StickyBook.module.css'

/** Phones and tablets: booking stays one thumb-tap away once the hero is gone. */
export function StickyBook({ hidden }: { hidden: boolean }) {
  const { t } = useI18n()
  const compact = useMedia('(max-width: 1023px)')
  const { scrollY } = useScroll()
  const [past, setPast] = useState(false)
  const [covered, setCovered] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => setPast(y > window.innerHeight * 0.8))

  // Step back where booking and contact details are already on screen.
  useEffect(() => {
    const visible = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      }
      setCovered(visible.size > 0)
    })
    document.querySelectorAll('#booking, #visit, footer').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {compact && past && !covered && !hidden && (
        <m.div
          className={s.bar}
          initial={{ y: '160%' }}
          animate={{ y: '0%' }}
          exit={{ y: '160%' }}
          transition={ui}
        >
          <Button href="#booking" block>
            {t.sticky}
          </Button>
        </m.div>
      )}
    </AnimatePresence>
  )
}
