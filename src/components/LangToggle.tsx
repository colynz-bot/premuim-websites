import * as m from 'motion/react-m'
import { useI18n } from '../i18n/context.ts'
import type { Lang } from '../i18n/dict.ts'
import { pathFor } from '../i18n/paths.ts'
import { cx } from '../lib/cx.ts'
import { ui } from '../lib/motion.ts'
import s from './LangToggle.module.css'

const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: 'bg', label: 'BG', name: 'Български' },
  { code: 'en', label: 'EN', name: 'English' },
]

/** Real links (they work without JavaScript) with a pill that glides between them. */
export function LangToggle({ id, className }: { id: string; className?: string }) {
  const { lang, setLang, t } = useI18n()
  return (
    <div className={cx(s.toggle, className)} role="group" aria-label={t.common.language}>
      {LANGS.map((item) => {
        const active = item.code === lang
        return (
          <a
            key={item.code}
            href={pathFor(item.code)}
            hrefLang={item.code}
            lang={item.code}
            className={cx(s.option, active && s.active)}
            aria-current={active ? 'true' : undefined}
            onClick={(event) => {
              event.preventDefault()
              setLang(item.code)
            }}
          >
            {active && <m.span layoutId={`lang-${id}`} className={s.pill} transition={ui} />}
            <span className={s.text} aria-hidden="true">
              {item.label}
            </span>
            <span className="sr-only">{item.name}</span>
          </a>
        )
      })}
    </div>
  )
}
