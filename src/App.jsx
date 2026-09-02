import { useEffect, lazy, Suspense } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { NavProvider } from './context/NavContext'
import { ComingSoonProvider } from './context/ComingSoonContext'
import { ProjectsProvider, useProjects } from './context/ProjectsContext'
import { CalDrawerProvider } from './context/CalDrawerContext'
import Nav from './components/Nav'
import About from './pages/About'
import AudiencePage from './pages/AudiencePage'
import CalDrawer from './components/CalDrawer'
import Cursor from './components/Cursor'
import ThemeToggle from './components/ThemeToggle'
import TransitionBar from './components/TransitionBar'
import HomeV2 from './pages/HomeV2'
import HomeV3 from './pages/HomeV3'
import PricingV3 from './pages/PricingV3'
import ServiceV3 from './pages/ServiceV3'
import Work from './pages/Work'
import Services from './pages/Services'
import AboutUs from './pages/AboutUs'
import Disciplines from './pages/Disciplines'
import Discipline from './pages/Discipline'
import CaseStudy from './pages/CaseStudy'
import ClientOverview from './pages/ClientOverview'
import Thoughts from './pages/Thoughts'
import ThoughtPost from './pages/ThoughtPost'
import Contact from './pages/Contact'
import LandingPage from './pages/LandingPage'
import NotFound from './pages/NotFound'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
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

/* The v3-family pages bring their own top bar (V3Nav), so they run without
   the side nav — two navigations on one page is worse than either. Gated
   here rather than through ChromeGate, which would take the theme toggle
   down with it: the deck pages want all the chrome gone, these want only the
   nav gone. */
const V3_PAGES = ['/', '/pricing', '/work', '/thoughts']

const isV3Page = (pathname) =>
  V3_PAGES.includes(pathname) ||
  pathname.startsWith('/services/') ||
  pathname.startsWith('/industries/') ||
  pathname.startsWith('/stages/') ||
  pathname.startsWith('/outcomes/') ||
  pathname === '/studio' ||
  /* The careers page. It carries V3Nav now like the rest of the family, and
     this gate is what takes the side nav and the floating back button off it —
     two navigations on one page is worse than either. */
  pathname === '/about-us' ||
  pathname.startsWith('/disciplines')

function NavGate() {
  const { pathname } = useLocation()
  if (isV3Page(pathname)) return null
  return <Nav />
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
  // /v2 is a homepage, so it gets the homepage treatment: no back button.
  // The v3-family pages have a full nav bar of their own; a floating back
  // button on top of it is a second way to leave, offered twice.
  if (location.pathname === '/' || location.pathname === '/v2' || isV3Page(location.pathname) || location.pathname === '/lp' || location.pathname.startsWith('/lp/')) return null
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
        <NavProvider>
        <ComingSoonProvider>
        <ProjectsProvider>
        <CalDrawerProvider>
          <ScrollToTop />
          <TransitionBar />
          <Cursor />
          <ChromeGate>
            <NavGate />
            <ThemeToggle />
            <BackButton />
          </ChromeGate>
          <CalDrawer />
          <div className="theme-layer">
            <Suspense fallback={null}>
              <Routes>
                {/* THE V3 HOMEPAGE IS THE HOMEPAGE (2026-09-02). It ran at /v3
                    beside the old one while it was built; the old Home is
                    no longer routed. /v3 redirects here so anything holding
                    the old address — a shared preview link, a bookmark —
                    still lands on the page. */}
                <Route path="/" element={<HomeV3 />} />
                <Route path="/v3" element={<Navigate to="/" replace />} />
                {/* The design-canvas homepage, kept for comparison. */}
                <Route path="/v2" element={<HomeV2 />} />
        <Route path="/pricing" element={<PricingV3 />} />
        <Route path="/services/:slug" element={<ServiceV3 />} />
                <Route path="/work" element={<Work />} />
                {/* NOT UNDER /work. It was /work/industry/:slug, which matches
                    the legacy redirect "/work/:client/:sub" in vercel.json and
                    was 301'd to /work/industry-technology — a page that renders
                    "Case study not found". Excluding the segment with a regex
                    in that rule did not take effect on Vercel, so the route
                    moved somewhere it cannot collide instead of fighting the
                    matcher. Only bites in production: the dev server does not
                    read vercel.json. */}
                <Route path="/industries/:slug" element={<AudiencePage kind="industry" />} />
                <Route path="/stages/:slug" element={<AudiencePage kind="stage" />} />
                <Route path="/outcomes/:slug" element={<AudiencePage kind="outcome" />} />
                {/* NOT /about. That path is 301d to /services by vercel.json —
                    capabilities lived there before the Services rename — so a
                    page mounted on it would never reach React in production,
                    the same way /work/industry/:slug never did. /about-us stays
                    the careers page, which is what it actually is. */}
                <Route path="/studio" element={<About />} />
                <Route path="/work/:slug" element={<WorkRouter />} />
                <Route path="/work/:clientSlug/:workSlug" element={<CaseStudy />} />
                <Route path="/services" element={<Services />} />
                {/* Capabilities lived at /about until the Services rename.
                    vercel.json 301s it, but that only fires on a request to
                    the server — an in-app <NavLink to="/about"> never leaves
                    the client, so without this the old path would fall through
                    to NotFound for anyone still linking it internally. */}
                <Route path="/about" element={<Navigate to="/services" replace />} />
                <Route path="/about-us" element={<AboutUs />} />
                {/* MAIN'S ADDRESSES FOR THE SAME PAGES. main (PR #137) put the
                    careers page at /careers and the studio page at
                    /who-we-are; this branch keeps them at /about-us and
                    /studio, and the merge was resolved that way on
                    2026-09-02. Anything holding main's addresses lands on
                    the page it meant. */}
                <Route path="/careers" element={<Navigate to="/about-us" replace />} />
                <Route path="/who-we-are" element={<Navigate to="/studio" replace />} />
                {/* Where the nav's "View all disciplines" lands: the twelve
                    from /services, on their own page. */}
                <Route path="/disciplines" element={<Disciplines />} />
                {/* One discipline. Only the slugs in Discipline.jsx's LIVE set
                    render; the rest redirect back to the grid. */}
                <Route path="/disciplines/:slug" element={<Discipline />} />
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </CalDrawerProvider>
        </ProjectsProvider>
        </ComingSoonProvider>
        </NavProvider>
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  )
}
