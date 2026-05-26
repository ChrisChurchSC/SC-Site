import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { NavProvider } from './context/NavContext'
import { ComingSoonProvider } from './context/ComingSoonContext'
import { ProjectsProvider, useProjects } from './context/ProjectsContext'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import ThemeToggle from './components/ThemeToggle'
import TransitionBar from './components/TransitionBar'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import AboutUs from './pages/AboutUs'
import CaseStudy from './pages/CaseStudy'
import ClientOverview from './pages/ClientOverview'
import ClientLanding from './pages/ClientLanding'
import LandingHub from './pages/LandingHub'
import Capabilities from './pages/Capabilities'
import AgencyCapabilities from './pages/AgencyCapabilities'
import BrandSystems from './pages/BrandSystems'
import ContentPrograms from './pages/ContentPrograms'
import DigitalProducts from './pages/DigitalProducts'
import ContentPackages from './pages/ContentPackages'
import Thoughts from './pages/Thoughts'
import ThoughtPost from './pages/ThoughtPost'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import DeckGate from './components/DeckGate'
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function ChromeGate({ children }) {
  // Hide global chrome (side nav, back button, theme toggle) on full-bleed
  // presentation routes like /capabilities.
  const { pathname } = useLocation()
  const fullBleed = pathname === '/capabilities' || pathname === '/agency-capabilities' || pathname === '/brand-systems' || pathname === '/content-programs' || pathname === '/digital-products' || pathname === '/content-packages'
  if (fullBleed) return null
  return children
}

function BackButton() {
  const location = useLocation()
  const navigate = useNavigate()
  if (location.pathname === '/') return null
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
          <ScrollToTop />
          <TransitionBar />
          <Cursor />
          <ChromeGate>
            <Nav />
            <ThemeToggle />
            <BackButton />
          </ChromeGate>
          <div className="theme-layer">
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
              <Route path="/landing-pages" element={<LandingHub />} />
              <Route path="/capabilities" element={<DeckGate><Capabilities /></DeckGate>} />
              <Route path="/agency-capabilities" element={<DeckGate><AgencyCapabilities /></DeckGate>} />
              <Route path="/brand-systems" element={<DeckGate><BrandSystems /></DeckGate>} />
              <Route path="/content-programs" element={<DeckGate><ContentPrograms /></DeckGate>} />
              <Route path="/digital-products" element={<DeckGate><DigitalProducts /></DeckGate>} />
              <Route path="/content-packages" element={<DeckGate><ContentPackages /></DeckGate>} />
              <Route path="/clients/:slug" element={<ClientLanding />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </ProjectsProvider>
        </ComingSoonProvider>
        </NavProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
