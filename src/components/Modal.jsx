import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="modal-bg"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal">
        <div className="modal-title">
          <span>{title}</span>
          <button className="icon-btn" onClick={onClose} aria-label="Schließen">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
