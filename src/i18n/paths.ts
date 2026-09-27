import type { Lang } from './dict.ts'

const BASE = import.meta.env.BASE_URL

export const pathFor = (lang: Lang) => (lang === 'en' ? `${BASE}en/` : BASE)

export const langFromPath = (pathname: string): Lang =>
  pathname.startsWith(`${BASE}en`) ? 'en' : 'bg'
