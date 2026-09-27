import type { FinishId, ServiceId } from '../salon.ts'

export type Lang = 'bg' | 'en'

type Item = { name: string; text: string }

const bg = {
  meta: {
    title: 'Sugar Nails — студио за маникюр в Овча купел, София',
    description:
      'Маникюр, гел лак, изграждане и nail art в уютно студио в Овча купел, София. Запазете час онлайн в Studio24.',
  },
  common: {
    newTab: '(отваря се в нов раздел)',
    language: 'Език',
    skip: 'Към съдържанието',
    home: 'Sugar Nails — начало',
    menu: 'Отвори менюто',
    close: 'Затвори менюто',
    nav: 'Основна навигация',
  },
  nav: {
    services: 'Услуги',
    finishes: 'Финиши',
    booking: 'Резервация',
    visit: 'Контакти',
    book: 'Запази час',
  },
  hero: {
    label: 'Студио за маникюр · Овча купел, София',
    title: ['Сладка', 'прецизност.'],
    body: 'Уютно студио, в което всеки маникюр получава пълно внимание, премиум продукти и търпението на истинския занаят.',
    cta: 'Запази час',
    secondary: 'Виж услугите',
    note: 'Онлайн резервация в Studio24 · 24/7',
  },
  manifesto: {
    label: 'Философия',
    text: 'Класика, гел лак или смело изкуство — първо слушаме, после създаваме нокти, които ви отиват. Без бързане, прецизно и съвсем мъничко сладко.',
    principles: [
      {
        title: 'Лично внимание',
        text: 'Вашият час е само ваш — спокойно, без бързане и без компромиси.',
      },
      {
        title: 'Премиум продукти',
        text: 'Работим с продукти, на които вярваме — за блясък, който издържа.',
      },
      {
        title: 'Вашата идея',
        text: 'От класически маникюр до авторски дизайн — изпълняваме всяко желание.',
      },
    ],
  },
  services: {
    label: 'Услуги',
    title: ['Сладкото', 'меню.'],
    intro: 'Всички процедури, цени и свободни часове са винаги актуални в Studio24.',
    link: 'Цени и свободни часове',
    book: 'Запази',
    items: {
      classic: {
        name: 'Класически маникюр',
        text: 'Оформяне, грижа за кожичките и лак по ваш избор.',
      },
      gel: {
        name: 'Маникюр с гел лак',
        text: 'Дълготраен блясък, който пази естествения нокът.',
      },
      overlay: {
        name: 'Гел върху естествен нокът',
        text: 'Укрепване, което запазва формата и дължината.',
      },
      extensions: {
        name: 'Изграждане',
        text: 'Форма и дължина по ваш вкус — бадем, овал или квадрат.',
      },
      art: {
        name: 'Декорации и nail art',
        text: 'От деликатен френски маникюр до авторски дизайн.',
      },
      removal: {
        name: 'Сваляне',
        text: 'Щадящо премахване на гел и гел лак.',
      },
    } satisfies Record<ServiceId, Item>,
  },
  finishes: {
    label: 'Финиши',
    title: ['Намерете', 'своя финиш.'],
    intro:
      'Шест настроения, от които да започнем. Донесете снимка или ни доверете идея — ще я превърнем в нокти.',
    swipe: 'Плъзнете',
    instagram: 'Още дизайни в Instagram',
    items: {
      cherry: 'Дълбока череша с огледален блясък.',
      milk: 'Млечна прозрачност, мека като пудра захар.',
      chrome: 'Топъл метален отблясък на карамел.',
      glitter: 'Фини кристали, които улавят всяка светлина.',
      french: 'Класическият френски — по-тих и по-изискан.',
      cateye: 'Магнитен лъч, който се движи с всеки жест.',
    } satisfies Record<FinishId, string>,
  },
  booking: {
    label: 'Резервация',
    title: ['Вашият час', 'ви очаква.'],
    body: 'Резервирайте онлайн в Studio24 — по всяко време и без обаждания.',
    steps: [
      { title: 'Изберете процедура', text: 'Маникюр, гел лак, изграждане или nail art.' },
      { title: 'Изберете час', text: 'Свободните часове се виждат в реално време.' },
      { title: 'Потвърдете', text: 'И оставете останалото на нас.' },
    ],
    cta: 'Резервирай в Studio24',
    alt: 'Как да ни намерите',
  },
  visit: {
    label: 'Контакти',
    title: ['Франк Лойд', 'Райт 4'],
    address: 'ул. „Арх. Франк Лойд Райт“ 4, кв. Овча купел, София',
    maps: 'Отвори в Google Maps',
    hours: 'Работно време',
    hoursNote: 'Свободните часове са винаги актуални в Studio24.',
  },
  footer: {
    tagline: 'Сладка прецизност в Овча купел, София.',
    rights: 'Всички права запазени.',
    top: 'Нагоре',
  },
  sticky: 'Запази час',
}

export type Dict = typeof bg

const en: Dict = {
  meta: {
    title: 'Sugar Nails — Nail studio in Ovcha Kupel, Sofia',
    description:
      'Manicure, gel polish, extensions and nail art in a cosy studio in Ovcha Kupel, Sofia. Book online via Studio24.',
  },
  common: {
    newTab: '(opens in a new tab)',
    language: 'Language',
    skip: 'Skip to content',
    home: 'Sugar Nails — home',
    menu: 'Open menu',
    close: 'Close menu',
    nav: 'Main navigation',
  },
  nav: {
    services: 'Services',
    finishes: 'Finishes',
    booking: 'Booking',
    visit: 'Visit',
    book: 'Book now',
  },
  hero: {
    label: 'Nail studio · Ovcha Kupel, Sofia',
    title: ['Sweet', 'precision.'],
    body: 'A cosy studio where every manicure gets undivided attention, premium products and the patience of true craft.',
    cta: 'Book a visit',
    secondary: 'See services',
    note: 'Online booking via Studio24 · 24/7',
  },
  manifesto: {
    label: 'Philosophy',
    text: 'Classic, gel or bold artistry — we listen first, then create nails that feel like you. Unhurried, precise and just a little bit sweet.',
    principles: [
      {
        title: 'Personal attention',
        text: 'Your appointment is yours alone — calm, unhurried, uncompromising.',
      },
      {
        title: 'Premium products',
        text: 'We work with products we trust — for shine that lasts.',
      },
      {
        title: 'Your idea',
        text: 'From a classic manicure to bespoke art — we bring every wish to life.',
      },
    ],
  },
  services: {
    label: 'Services',
    title: ['The sweet', 'menu.'],
    intro: 'Every treatment, price and free slot is always up to date on Studio24.',
    link: 'Prices & free slots',
    book: 'Book',
    items: {
      classic: {
        name: 'Classic manicure',
        text: 'Shaping, cuticle care and a polish of your choice.',
      },
      gel: {
        name: 'Gel polish manicure',
        text: 'Long-lasting shine that respects the natural nail.',
      },
      overlay: {
        name: 'Gel overlay',
        text: 'Strength that keeps your natural shape and length.',
      },
      extensions: {
        name: 'Nail extensions',
        text: 'Your shape, your length — almond, oval or square.',
      },
      art: {
        name: 'Nail art',
        text: 'From a delicate French tip to one-of-a-kind designs.',
      },
      removal: {
        name: 'Removal',
        text: 'Gentle removal of gel and gel polish.',
      },
    },
  },
  finishes: {
    label: 'Finishes',
    title: ['Find your', 'finish.'],
    intro:
      'Six moods to start from. Bring a photo or trust us with an idea — we will turn it into nails.',
    swipe: 'Swipe',
    instagram: 'More designs on Instagram',
    items: {
      cherry: 'Deep cherry with a mirror-like gloss.',
      milk: 'Milky translucence, soft as powdered sugar.',
      chrome: 'The warm metallic glint of caramel.',
      glitter: 'Fine crystals that catch every light.',
      french: 'The classic French — quieter, more refined.',
      cateye: 'A magnetic beam that moves with every gesture.',
    },
  },
  booking: {
    label: 'Booking',
    title: ['Your chair', 'is waiting.'],
    body: 'Book online via Studio24 — any time, no phone calls.',
    steps: [
      { title: 'Choose a treatment', text: 'Manicure, gel polish, extensions or nail art.' },
      { title: 'Pick a time', text: 'Free slots are shown in real time.' },
      { title: 'Confirm', text: 'And leave the rest to us.' },
    ],
    cta: 'Book on Studio24',
    alt: 'How to find us',
  },
  visit: {
    label: 'Visit',
    title: ['Frank Lloyd', 'Wright 4'],
    address: '4 Arch. Frank Lloyd Wright St., Ovcha Kupel, Sofia',
    maps: 'Open in Google Maps',
    hours: 'Opening hours',
    hoursNote: 'Free slots are always up to date on Studio24.',
  },
  footer: {
    tagline: 'Sweet precision in Ovcha Kupel, Sofia.',
    rights: 'All rights reserved.',
    top: 'Back to top',
  },
  sticky: 'Book a visit',
}

export const dictionaries: Record<Lang, Dict> = { bg, en }
