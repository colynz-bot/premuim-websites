import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { I18nContext } from './context.ts'
import { dictionaries, type Lang } from './dict.ts'
import { langFromPath, pathFor } from './paths.ts'

const SITE = 'https://sugarnails.beauty'

export function LanguageProvider({ initial, children }: { initial: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState(initial)
  const t = dictionaries[lang]

  // The lang attribute drives Bulgarian letterforms and screen reader voices.
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', SITE + pathFor(lang))
  }, [lang, t])

  useEffect(() => {
    const onPopState = () => setLangState(langFromPath(window.location.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const setLang = useCallback(
    (next: Lang) => {
      if (next === lang) return
      const swap = () => {
        flushSync(() => setLangState(next))
        window.history.pushState(null, '', pathFor(next) + window.location.hash)
      }
      const root = document.getElementById('root')
      if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return swap()

      // A short dip to velvet hides the text swap; the reader stays where they were.
      const out = root.animate({ opacity: [1, 0] }, { duration: 180, easing: 'ease-in', fill: 'forwards' })
      out.finished.then(() => {
        swap()
        root.animate({ opacity: [0, 1] }, { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' })
        out.cancel()
      })
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t, setLang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
