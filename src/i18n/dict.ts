import type { ServiceId, WorkId } from '../salon.ts'

export type Lang = 'bg' | 'en'

type Item = { name: string; text: string }

const bg = {
  meta: {
    title: 'Sugar Nails — маникюр и педикюр в Овча купел, София',
    description:
      'Маникюр, гел лак, ноктопластика, спа педикюр и арт дизайн в Овча купел, София. 5.0 ★ от 44 отзива. Запази час онлайн през Studio24.',
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
    gallery: 'Галерия',
    studio: 'Студио',
    visit: 'Контакти',
    book: 'Запази час',
  },
  hero: {
    label: 'Салон за маникюр · Овча купел, София',
    title: ['Сладка', 'прецизност.'],
    body: 'Маникюр, педикюр, ноктопластика, гел лак или артистични декорации — ще превърнем твоето желание в реалност.',
    cta: 'Запази час',
    secondary: 'Виж цените',
    rating: (score: string, reviews: number) => `${score} · ${reviews} отзива в Studio24`,
  },
  reasons: {
    label: 'Защо Sugar Nails',
    text: 'При нас получаваш най-сладките нокти в София — с внимание към всеки детайл и висококачествени продукти.',
    title: '6 причини да дойдеш',
    items: [
      { title: '4+ години опит', text: 'Опит, който личи във всеки детайл.' },
      { title: 'Най-новите техники', text: 'Винаги в крак със занаята.' },
      { title: 'Най-новите тенденции', text: 'От френски до панделки — винаги актуално.' },
      { title: 'Стандарти за безопасност', text: 'Хигиена и грижа при всяка процедура.' },
      { title: 'Екстремна дължина', text: 'Толкова смело, колкото искаш.' },
      { title: 'Всичко е розово', text: 'Буквално.' },
    ],
  },
  services: {
    label: 'Услуги и цени',
    title: ['Сладкото', 'меню.'],
    intro: 'Цените са начални. Точната цена и свободните часове виждаш при резервация в Studio24.',
    from: (price: number) => `от ${price} €`,
    book: 'Запази',
    items: {
      manicure: { name: 'Маникюр', text: 'Оформяне, грижа за кожичките и безупречен завършек.' },
      gel: { name: 'Гел лак', text: 'Дълготраен блясък върху естествения нокът.' },
      extensions: {
        name: 'Ноктопластика',
        text: 'Изграждане във формата, която искаш — бадем, квадрат, балерина или стилето.',
      },
      pedicure: { name: 'Спа педикюр', text: 'Релаксираща грижа за стъпалата с професионални продукти.' },
      art: { name: 'Арт дизайн', text: 'Френски, панделки, камъни или изцяло твой мотив.' },
    } satisfies Record<ServiceId, Item>,
  },
  gallery: {
    label: 'Галерия',
    title: ['Галерията на', 'сладките нокти.'],
    intro: 'Малка част от нашата работа. Още дизайни ще откриеш в Instagram и TikTok.',
    swipe: 'Плъзни',
    follow: 'Последвай ни',
    items: {
      french: 'Бадем с френски',
      stiletto: 'Розово стилето',
      bows: 'Нюд с панделки',
      glitter: 'Захарен блясък',
      cateye: 'Котешко око',
      art: 'Арт дизайн',
      noir: 'Черен френски',
      square: 'Квадратен френски',
    } satisfies Record<WorkId, string>,
  },
  studio: {
    label: 'Студиото',
    title: ['Запознай се', 'с Розалина.'],
    body: 'Над четири години опит, най-новите техники и студио в Овча купел, в което всичко е розово. Тук времето е само за теб.',
    question: 'Имаш въпрос?',
    message: 'Пиши ми в Instagram',
    brands: 'Работим с',
    portrait: 'Розалина в студиото на Sugar Nails',
    desk: 'Работното място в студиото: UV лампа и розови детайли',
  },
  booking: {
    label: 'Резервация',
    title: ['Твоят час', 'те очаква.'],
    body: 'Избери услуга и свободен час направо тук. Резервацията минава през Studio24.',
    steps: [
      { title: 'Избери услуга', text: 'Маникюр, гел лак, ноктопластика, педикюр или арт.' },
      { title: 'Избери час', text: 'Свободните часове се виждат в реално време.' },
      { title: 'Потвърди', text: 'И остави останалото на нас.' },
    ],
    frame: 'Онлайн резервация в Studio24',
    fallback: 'Календарът не се зарежда?',
    open: 'Отвори Studio24',
    call: 'или се обади на',
  },
  visit: {
    label: 'Контакти',
    title: ['Франк Лойд', 'Райт 4'],
    address: 'ул. „Арх. Франк Лойд Райт“ 4, кв. Овча купел, 1618 София',
    maps: 'Отвори в Google Maps',
    hours: 'Работно време',
    phone: 'Телефон',
    follow: 'Последвай ни',
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
    title: 'Sugar Nails — Manicure & pedicure in Ovcha Kupel, Sofia',
    description:
      'Manicure, gel polish, nail extensions, spa pedicure and nail art in Ovcha Kupel, Sofia. Rated 5.0 ★ from 44 reviews. Book online via Studio24.',
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
    gallery: 'Gallery',
    studio: 'Studio',
    visit: 'Visit',
    book: 'Book now',
  },
  hero: {
    label: 'Nail salon · Ovcha Kupel, Sofia',
    title: ['Sweet', 'precision.'],
    body: 'Manicure, pedicure, extensions, gel polish or artistic designs — we turn what you wish for into reality.',
    cta: 'Book a visit',
    secondary: 'See prices',
    rating: (score: string, reviews: number) => `${score} · ${reviews} reviews on Studio24`,
  },
  reasons: {
    label: 'Why Sugar Nails',
    text: 'Here you get the sweetest nails in Sofia — with attention to every detail and high-quality products.',
    title: '6 reasons to come by',
    items: [
      { title: '4+ years of experience', text: 'Experience that shows in every detail.' },
      { title: 'The latest techniques', text: 'Always up to date with the craft.' },
      { title: 'The latest trends', text: 'From French tips to bows — always current.' },
      { title: 'Safety standards', text: 'Hygiene and care at every appointment.' },
      { title: 'Extreme length', text: 'As bold as you want to go.' },
      { title: 'Everything is pink', text: 'Literally.' },
    ],
  },
  services: {
    label: 'Services & prices',
    title: ['The sweet', 'menu.'],
    intro: 'Prices are starting prices. You will see the exact price and free slots when booking on Studio24.',
    from: (price: number) => `from €${price}`,
    book: 'Book',
    items: {
      manicure: { name: 'Manicure', text: 'Shaping, cuticle care and a flawless finish.' },
      gel: { name: 'Gel polish', text: 'Long-lasting shine on your natural nails.' },
      extensions: {
        name: 'Nail extensions',
        text: 'Built in the shape you want — almond, square, ballerina or stiletto.',
      },
      pedicure: { name: 'Spa pedicure', text: 'A relaxing treatment for your feet with professional products.' },
      art: { name: 'Nail art', text: 'French tips, bows, stones or a motif all your own.' },
    },
  },
  gallery: {
    label: 'Gallery',
    title: ['A gallery of', 'sweet nails.'],
    intro: 'A small taste of our work. You will find many more designs on Instagram and TikTok.',
    swipe: 'Swipe',
    follow: 'Follow us',
    items: {
      french: 'Almond French',
      stiletto: 'Pink stiletto',
      bows: 'Nude with bows',
      glitter: 'Sugar glitter',
      cateye: 'Cat eye',
      art: 'Graphic art',
      noir: 'Black French',
      square: 'Square French',
    },
  },
  studio: {
    label: 'The studio',
    title: ['Meet', 'Rosalina.'],
    body: 'Four-plus years of experience, the latest techniques and a studio in Ovcha Kupel where everything is pink. Here, the time is all yours.',
    question: 'Got a question?',
    message: 'Message me on Instagram',
    brands: 'We work with',
    portrait: 'Rosalina in the Sugar Nails studio',
    desk: 'The studio workstation: UV lamp and pink details',
  },
  booking: {
    label: 'Booking',
    title: ['Your chair', 'is waiting.'],
    body: 'Pick a service and a free slot right here. Booking runs through Studio24.',
    steps: [
      { title: 'Choose a service', text: 'Manicure, gel polish, extensions, pedicure or nail art.' },
      { title: 'Pick a time', text: 'Free slots are shown in real time.' },
      { title: 'Confirm', text: 'And leave the rest to us.' },
    ],
    frame: 'Online booking on Studio24',
    fallback: 'Calendar not loading?',
    open: 'Open Studio24',
    call: 'or call',
  },
  visit: {
    label: 'Visit',
    title: ['Frank Lloyd', 'Wright 4'],
    address: '4 Arch. Frank Lloyd Wright St., Ovcha Kupel, 1618 Sofia',
    maps: 'Open in Google Maps',
    hours: 'Opening hours',
    phone: 'Phone',
    follow: 'Follow us',
  },
  footer: {
    tagline: 'Sweet precision in Ovcha Kupel, Sofia.',
    rights: 'All rights reserved.',
    top: 'Back to top',
  },
  sticky: 'Book a visit',
}

export const dictionaries: Record<Lang, Dict> = { bg, en }
