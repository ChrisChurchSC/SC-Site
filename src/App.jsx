import { BrowserRouter, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ContactProvider } from './context/ContactContext'
import { ThemeProvider } from './context/ThemeContext'
import { NavProvider } from './context/NavContext'
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
import { projects as staticProjects } from './data/projects'

function BackButton() {
  const location = useLocation()
  const navigate = useNavigate()
  if (location.pathname === '/') return null
  const handleBack = () => {
    const parts = location.pathname.split('/').filter(Boolean)
    if (parts.length > 2) {
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
  const project = staticProjects.find(p => p.slug === slug)
  if (project?.work?.length > 1) return <ClientOverview />
  return <CaseStudy />
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={import.meta.env.PROD ? '/SC-Site' : ''}>
        <NavProvider>
        <ContactProvider>
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
            </Routes>
          </div>
        </ContactProvider>
        </NavProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
