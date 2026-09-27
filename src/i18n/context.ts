import { createContext, useContext } from 'react'
import type { Dict, Lang } from './dict.ts'

export type I18n = { lang: Lang; t: Dict; setLang: (lang: Lang) => void }

export const I18nContext = createContext<I18n | null>(null)

export function useI18n() {
  const i18n = useContext(I18nContext)
  if (!i18n) throw new Error('useI18n must be used inside <LanguageProvider>')
  return i18n
}
