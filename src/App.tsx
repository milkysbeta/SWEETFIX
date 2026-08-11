import { lazy, Suspense, useEffect, useState } from 'react'
import { useReducedMotion } from './lib/hooks'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { Work } from './components/Work'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { EnquiryModal } from './components/Enquiry'
import { ReviewQuestionnaire } from './pages/ReviewQuestionnaire'
import { AboutQuestionnaire } from './pages/AboutQuestionnaire'
import { Column } from './components/Column'
import { ScrollDots, SideWordmark } from './components/Rails'

// three.js is the bulk of the bundle — split out so the page paints first.
const ParticleField = lazy(() =>
  import('./components/ParticleField').then((m) => ({ default: m.ParticleField })),
)

/**
 * Hash routing on purpose. GitHub Pages has no server to rewrite paths, so
 * `#/reviews` works everywhere with no 404 workaround. Anchors like
 * `#services` are left alone — only hashes starting with `#/` are routes.
 */
function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash)

  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash)
      if (window.location.hash.startsWith('#/')) window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return route.startsWith('#/') ? route.slice(1) : '/'
}

function Home() {
  const [enquiry, setEnquiry] = useState(false)
  const open = () => setEnquiry(true)

  return (
    <>
      <Header onEnquire={open} />
      <ScrollDots />
      <SideWordmark />
      <main className="pb-16 pt-24 sm:pt-28">
        <Column>
          <Hero onEnquire={open} />
          <Services onEnquire={open} />
          <Work />
          <About />
          <Contact />
        </Column>
      </main>
      <Footer />
      <EnquiryModal open={enquiry} onClose={() => setEnquiry(false)} />
    </>
  )
}

export default function App() {
  const route = useHashRoute()
  const reduced = useReducedMotion()

  return (
    <div className="grain">
      {/* One field behind the entire page, not just the hero. */}
      <Suspense fallback={null}>
        <ParticleField reduced={reduced} />
      </Suspense>
      {route === '/reviews' ? (
        <ReviewQuestionnaire />
      ) : route === '/about-questions' ? (
        <AboutQuestionnaire />
      ) : (
        <Home />
      )}
    </div>
  )
}
