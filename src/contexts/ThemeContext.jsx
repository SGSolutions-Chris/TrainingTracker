import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('tt_mode') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode)
    localStorage.setItem('tt_mode', mode)
  }, [mode])

  function toggleMode() {
    setMode(m => m === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
