import { useEffect, lazy, Suspense } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import CookieBanner from './components/CookieBanner'
import { BrowserRouter, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { NavProvider } from './context/NavContext'
import { ComingSoonProvider } from './context/ComingSoonContext'
import { ProjectsProvider, useProjects } from './context/ProjectsContext'
import { ContactDrawerProvider } from './context/ContactDrawerContext'
import Nav from './components/Nav'
import ContactDrawer from './components/ContactDrawer'
import Cursor from './components/Cursor'
import ThemeToggle from './components/ThemeToggle'
import TransitionBar from './components/TransitionBar'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import AboutUs from './pages/AboutUs'
import CaseStudy from './pages/CaseStudy'
import ClientOverview from './pages/ClientOverview'
import Thoughts from './pages/Thoughts'
import ThoughtPost from './pages/ThoughtPost'
import Contact from './pages/Contact'
import LandingPage from './pages/LandingPage'
import NotFound from './pages/NotFound'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import BookingConfirmed from './pages/BookingConfirmed'
import DeckGate from './components/DeckGate'

// Heavy deck pages — lazy loaded so they don't bloat the initial bundle
const LandingHub      = lazy(() => import('./pages/LandingHub'))
const LandingIndex    = lazy(() => import('./pages/LandingIndex'))
const Capabilities    = lazy(() => import('./pages/Capabilities'))
const AgencyCapabilities = lazy(() => import('./pages/AgencyCapabilities'))
const BrandSystems    = lazy(() => import('./pages/BrandSystems'))
const ContentPrograms = lazy(() => import('./pages/ContentPrograms'))
const DigitalProducts = lazy(() => import('./pages/DigitalProducts'))
const ContentPackages = lazy(() => import('./pages/ContentPackages'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function ChromeGate({ children }) {
  const { pathname } = useLocation()
  const fullBleed = pathname === '/capabilities' || pathname === '/agency-capabilities' || pathname === '/brand-systems' || pathname === '/content-programs' || pathname === '/digital-products' || pathname === '/content-packages'
  if (fullBleed) return null
  return children
}

function BackButton() {
  const location = useLocation()
  const navigate = useNavigate()
  if (location.pathname === '/' || location.pathname === '/lp' || location.pathname.startsWith('/lp/')) return null
  const handleBack = () => {
    const parts = location.pathname.split('/').filter(Boolean)
    if (parts.length > 1) {
      navigate('/' + parts.slice(0, -1).join('/'))
    } else {
      navigate('/')
    }
  }
  return (
    <button className="back-btn-global" onClick={handleBack}>← Back</button>
  )
}

function WorkRouter() {
  const { slug } = useParams()
  const projects = useProjects()
  if (projects.isMulti(slug)) return <ClientOverview />
  return <CaseStudy />
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <NavProvider>
        <ComingSoonProvider>
        <ProjectsProvider>
        <ContactDrawerProvider>
          <ScrollToTop />
          <TransitionBar />
          <Cursor />
          <ChromeGate>
            <Nav />
            <ThemeToggle />
            <BackButton />
          </ChromeGate>
          <ContactDrawer />
          <div className="theme-layer">
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/work" element={<Work />} />
                <Route path="/work/:slug" element={<WorkRouter />} />
                <Route path="/work/:clientSlug/:workSlug" element={<CaseStudy />} />
                <Route path="/about" element={<About />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/thoughts" element={<Thoughts />} />
                <Route path="/thoughts/:slug" element={<ThoughtPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/landing-pages" element={<Suspense fallback={null}><LandingHub /></Suspense>} />
                <Route path="/capabilities" element={<DeckGate><Suspense fallback={null}><Capabilities /></Suspense></DeckGate>} />
                <Route path="/agency-capabilities" element={<DeckGate><Suspense fallback={null}><AgencyCapabilities /></Suspense></DeckGate>} />
                <Route path="/brand-systems" element={<DeckGate><Suspense fallback={null}><BrandSystems /></Suspense></DeckGate>} />
                <Route path="/content-programs" element={<DeckGate><Suspense fallback={null}><ContentPrograms /></Suspense></DeckGate>} />
                <Route path="/digital-products" element={<DeckGate><Suspense fallback={null}><DigitalProducts /></Suspense></DeckGate>} />
                <Route path="/content-packages" element={<DeckGate><Suspense fallback={null}><ContentPackages /></Suspense></DeckGate>} />
                <Route path="/lp" element={<Suspense fallback={null}><LandingIndex /></Suspense>} />
                <Route path="/lp/:slug" element={<Suspense fallback={null}><LandingPage /></Suspense>} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/booking-confirmed" element={<BookingConfirmed />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </ContactDrawerProvider>
        </ProjectsProvider>
        </ComingSoonProvider>
        </NavProvider>
      </BrowserRouter>
      <CookieBanner />
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  )
}
