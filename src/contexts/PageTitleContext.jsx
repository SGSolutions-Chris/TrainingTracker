import { createContext, useContext, useState } from 'react'

const PageTitleContext = createContext(null)

export function PageTitleProvider({ children }) {
  const [title, setTitle] = useState(null)
  const [subtitle, setSubtitle] = useState(null)

  function setPageTitle(t, sub = null) {
    setTitle(t)
    setSubtitle(sub)
  }

  function clearPageTitle() {
    setTitle(null)
    setSubtitle(null)
  }

  return (
    <PageTitleContext.Provider value={{ title, subtitle, setPageTitle, clearPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  )
}

export function usePageTitle() {
  return useContext(PageTitleContext)
}
