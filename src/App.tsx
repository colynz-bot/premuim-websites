import { useState } from 'react'
import { LazyMotion, MotionConfig } from 'motion/react'
import { Header } from './components/Header.tsx'
import { StickyBook } from './components/StickyBook.tsx'
import type { Lang } from './i18n/dict.ts'
import { LanguageProvider } from './i18n/LanguageProvider.tsx'
import { Booking } from './sections/Booking.tsx'
import { Finishes } from './sections/Finishes.tsx'
import { Footer } from './sections/Footer.tsx'
import { Hero } from './sections/Hero.tsx'
import { Manifesto } from './sections/Manifesto.tsx'
import { Services } from './sections/Services.tsx'
import { Visit } from './sections/Visit.tsx'

// Animation features arrive in their own chunk, after first paint.
const loadFeatures = () => import('./lib/features.ts').then((mod) => mod.default)

export default function App({ initialLang }: { initialLang: Lang }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <LanguageProvider initial={initialLang}>
      <LazyMotion features={loadFeatures} strict>
        <MotionConfig reducedMotion="user">
          <Header menuOpen={menuOpen} onMenuChange={setMenuOpen} />
          <div id="page">
            <main id="content">
              <Hero />
              <Manifesto />
              <Services />
              <Finishes />
              <Booking />
              <Visit />
            </main>
            <Footer />
          </div>
          <StickyBook hidden={menuOpen} />
        </MotionConfig>
      </LazyMotion>
    </LanguageProvider>
  )
}
