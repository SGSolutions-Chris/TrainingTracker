import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

// Apply saved theme before first render to avoid flash
const savedMode = localStorage.getItem('tt_mode') || 'dark'
document.documentElement.setAttribute('data-mode', savedMode)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
