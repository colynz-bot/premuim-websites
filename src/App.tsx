import { useEffect, useState } from 'react'
import { LazyMotion, MotionConfig, useReducedMotion } from 'motion/react'
import { AmbientField } from './components/AmbientField.tsx'
import { Header } from './components/Header.tsx'
import { StickyBook } from './components/StickyBook.tsx'
import type { Lang } from './i18n/dict.ts'
import { LanguageProvider } from './i18n/LanguageProvider.tsx'
import { useFinePointer } from './lib/hooks.ts'
import { startSmoothScroll } from './lib/scroll.ts'
import { Booking } from './sections/Booking.tsx'
import { Footer } from './sections/Footer.tsx'
import { Gallery } from './sections/Gallery.tsx'
import { Hero } from './sections/Hero.tsx'
import { Manifesto } from './sections/Manifesto.tsx'
import { Services } from './sections/Services.tsx'
import { Studio } from './sections/Studio.tsx'
import { Visit } from './sections/Visit.tsx'

// Animation features arrive in their own chunk, after first paint.
const loadFeatures = () => import('./lib/features.ts').then((mod) => mod.default)

export default function App({ initialLang }: { initialLang: Lang }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const fine = useFinePointer()
  const reduce = useReducedMotion()

  useEffect(() => (fine && !reduce ? startSmoothScroll() : undefined), [fine, reduce])

  return (
    <LanguageProvider initial={initialLang}>
      <LazyMotion features={loadFeatures} strict>
        <MotionConfig reducedMotion="user">
          <AmbientField />
          <Header menuOpen={menuOpen} onMenuChange={setMenuOpen} />
          <div id="page">
            <main id="content">
              <Hero />
              <Manifesto />
              <Services />
              <Gallery />
              <Studio />
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
