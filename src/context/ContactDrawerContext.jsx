import { createContext, useContext, useState } from 'react'

const ContactDrawerContext = createContext(null)

export function ContactDrawerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <ContactDrawerContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </ContactDrawerContext.Provider>
  )
}

export function useContactDrawer() {
  return useContext(ContactDrawerContext)
}
