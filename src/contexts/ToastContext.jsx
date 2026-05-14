import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', visible: false })
  const timerRef = useRef(null)

  const showToast = useCallback((message) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ message, visible: true })
    timerRef.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={`toast${toast.visible ? ' show' : ''}`}>{toast.message}</div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
