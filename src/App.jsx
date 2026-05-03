import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
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
import Thoughts from './pages/Thoughts'

function BackButton() {
  const location = useLocation()
  const navigate = useNavigate()
  if (location.pathname === '/') return null
  return (
    <button className="back-btn-global" onClick={() => navigate('/')}>← Back</button>
  )
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
              <Route path="/work/:slug" element={<CaseStudy />} />
              <Route path="/about" element={<About />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/thoughts" element={<Thoughts />} />
            </Routes>
          </div>
        </ContactProvider>
        </NavProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
