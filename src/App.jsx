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
import Thoughts from './pages/Thoughts'
import ThoughtPost from './pages/ThoughtPost'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
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
          <Nav />
          <ThemeToggle />
          <BackButton />
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
