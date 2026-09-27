import type { Lang } from './i18n/dict.ts'
import serviceExtensions from './assets/img/service-extensions-480.webp'
import serviceGel from './assets/img/service-gel-480.webp'
import serviceManicure from './assets/img/service-manicure-480.webp'
import servicePedicure from './assets/img/service-pedicure-480.webp'
import artLarge from './assets/img/work-art-1040.webp'
import artSmall from './assets/img/work-art-560.webp'
import bowsLarge from './assets/img/work-bows-1040.webp'
import bowsSmall from './assets/img/work-bows-560.webp'
import cateyeLarge from './assets/img/work-cateye-1040.webp'
import cateyeSmall from './assets/img/work-cateye-560.webp'
import frenchLarge from './assets/img/work-french-1040.webp'
import frenchSmall from './assets/img/work-french-560.webp'
import glitterLarge from './assets/img/work-glitter-1040.webp'
import glitterSmall from './assets/img/work-glitter-560.webp'
import noirLarge from './assets/img/work-noir-1040.webp'
import noirSmall from './assets/img/work-noir-560.webp'
import squareLarge from './assets/img/work-square-1040.webp'
import squareSmall from './assets/img/work-square-560.webp'
import stilettoLarge from './assets/img/work-stiletto-1040.webp'
import stilettoSmall from './assets/img/work-stiletto-560.webp'

export type ServiceId = 'manicure' | 'gel' | 'extensions' | 'pedicure' | 'art'
export type WorkId = 'french' | 'stiletto' | 'bows' | 'glitter' | 'cateye' | 'art' | 'noir' | 'square'

/**
 * Salon facts shared by both languages, taken from sugarnails.beauty and the
 * salon's Studio24 page (checked September 2026).
 */
export const salon = {
  name: 'Sugar Nails',
  phone: { display: '0899 107 322', href: 'tel:+359899107322' },
  instagram: {
    handle: '@sugar_nails_sofia',
    url: 'https://www.instagram.com/sugar_nails_sofia/',
  },
  tiktok: {
    handle: '@sugarnailssofia',
    url: 'https://www.tiktok.com/@sugarnailssofia',
  },
  studio24: {
    bg: 'https://studio24.bg/sugar-nails-s10645',
    en: 'https://studio24.bg/en/sugar-nails-s10645',
  } satisfies Record<Lang, string>,
  /** The salon's own Studio24 booking widget. */
  bookingWidget: 'https://studio24.bg/studios/iframe?t=fiP613tf87rxesBZ',
  maps: 'https://maps.app.goo.gl/2oy3NFdSP5CrEcs88',
  /** Studio24 rating shown on the salon's website. Update when it changes. */
  rating: { score: '5.0', reviews: 44 },
  hours: {
    bg: [['Всеки ден', '10:00 – 21:00']],
    en: [['Every day', '10:00 – 21:00']],
  } satisfies Record<Lang, [days: string, time: string][]>,
  brands: ['DNKA', 'SNB Professional', 'Mister Nails'],
}

export const NAV_LINKS = ['services', 'gallery', 'studio', 'visit'] as const

/** Starting prices in euros; `null` hides the price. */
export const services: { id: ServiceId; price: number | null; image: string }[] = [
  { id: 'manicure', price: 25, image: serviceManicure },
  { id: 'gel', price: 25, image: serviceGel },
  { id: 'extensions', price: 35, image: serviceExtensions },
  { id: 'pedicure', price: 30, image: servicePedicure },
  { id: 'art', price: null, image: noirSmall },
]

export const works: { id: WorkId; small: string; large: string }[] = [
  { id: 'french', small: frenchSmall, large: frenchLarge },
  { id: 'stiletto', small: stilettoSmall, large: stilettoLarge },
  { id: 'bows', small: bowsSmall, large: bowsLarge },
  { id: 'glitter', small: glitterSmall, large: glitterLarge },
  { id: 'cateye', small: cateyeSmall, large: cateyeLarge },
  { id: 'art', small: artSmall, large: artLarge },
  { id: 'noir', small: noirSmall, large: noirLarge },
  { id: 'square', small: squareSmall, large: squareLarge },
]
