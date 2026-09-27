import type { Lang } from './i18n/dict.ts'

export type Shape = 'almond' | 'oval' | 'square'
export type Finish = 'cherry' | 'milk' | 'chrome' | 'glitter' | 'french' | 'cateye' | 'nude' | 'natural'
export type FinishId = 'cherry' | 'milk' | 'chrome' | 'glitter' | 'french' | 'cateye'
export type ServiceId = 'classic' | 'gel' | 'overlay' | 'extensions' | 'art' | 'removal'

/**
 * Salon facts shared by both languages.
 * `null` marks details not confirmed yet: fill them in and the matching UI appears.
 */
export const salon = {
  name: 'Sugar Nails',
  website: 'https://sugarnails.beauty',
  instagram: {
    handle: '@sugar_nails_sofia',
    url: 'https://www.instagram.com/sugar_nails_sofia/',
  },
  studio24: {
    bg: 'https://studio24.bg/sugar-nails-s10645',
    en: 'https://studio24.bg/en/sugar-nails-s10645',
  } satisfies Record<Lang, string>,
  maps:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Sugar Nails, ул. Арх. Франк Лойд Райт 4, София'),
  /** e.g. { display: '+359 88 123 4567', href: 'tel:+359881234567' } */
  phone: null as { display: string; href: string } | null,
  /** e.g. { bg: [['Пон – Пет', '10:00 – 21:00']], en: [['Mon – Fri', '10:00 – 21:00']] } */
  hours: null as Record<Lang, [days: string, time: string][]> | null,
}

export const NAV_LINKS = ['services', 'finishes', 'booking', 'visit'] as const

export const services: { id: ServiceId; finish: Finish; shape: Shape }[] = [
  { id: 'classic', finish: 'nude', shape: 'oval' },
  { id: 'gel', finish: 'cherry', shape: 'almond' },
  { id: 'overlay', finish: 'milk', shape: 'oval' },
  { id: 'extensions', finish: 'chrome', shape: 'almond' },
  { id: 'art', finish: 'glitter', shape: 'square' },
  { id: 'removal', finish: 'natural', shape: 'oval' },
]

export const finishes: { id: FinishId; name: string; shape: Shape; glow: string }[] = [
  { id: 'cherry', name: 'Cherry Glaze', shape: 'almond', glow: '227 36 63' },
  { id: 'milk', name: 'Milk & Sugar', shape: 'oval', glow: '245 238 232' },
  { id: 'chrome', name: 'Caramel Chrome', shape: 'almond', glow: '233 179 124' },
  { id: 'glitter', name: 'Sugar Sparkle', shape: 'square', glow: '240 170 170' },
  { id: 'french', name: 'French Whisper', shape: 'square', glow: '245 238 232' },
  { id: 'cateye', name: 'Velvet Cat Eye', shape: 'almond', glow: '190 150 255' },
]
