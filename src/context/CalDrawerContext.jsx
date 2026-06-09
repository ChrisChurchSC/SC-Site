import { createContext, useContext, useState } from 'react'

const CalDrawerContext = createContext(null)

export function CalDrawerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <CalDrawerContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </CalDrawerContext.Provider>
  )
}

export function useCalDrawer() {
  return useContext(CalDrawerContext)
}
