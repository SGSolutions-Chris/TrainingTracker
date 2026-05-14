import { useEffect, useRef, useState } from 'react'
import { saveSortOrder } from '../lib/db'

export function useDragSort(initialItems, table, onSaved) {
  const [items, setItems] = useState(initialItems)
  const drag = useRef(null)

  useEffect(() => { setItems(initialItems) }, [initialItems])

  function startDrag(e, itemId) {
    e.preventDefault()
    const handle = e.currentTarget
    const row = handle.closest('[data-drag-id]')
    if (!row) return
    const rect = row.getBoundingClientRect()
    const touch = e.touches?.[0] || e

    const clone = row.cloneNode(true)
    Object.assign(clone.style, {
      position: 'fixed',
      top: rect.top + 'px',
      left: rect.left + 'px',
      width: rect.width + 'px',
      zIndex: '999',
      opacity: '0.9',
      pointerEvents: 'none',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      background: 'var(--bg-card)',
      transition: 'none',
    })
    document.body.appendChild(clone)
    row.style.opacity = '0.35'

    drag.current = { itemId, clone, row, offsetY: touch.clientY - rect.top }

    document.addEventListener('mousemove', onMove, { passive: false })
    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchend', onEnd)
  }

  function onMove(e) {
    if (!drag.current) return
    e.preventDefault()
    const touch = e.touches?.[0] || e
    const y = touch.clientY
    drag.current.clone.style.top = (y - drag.current.offsetY) + 'px'

    document.querySelectorAll('[data-drag-id]').forEach(el => {
      el.classList.remove('drag-over-top', 'drag-over-bottom')
      if (el === drag.current.row) return
      const r = el.getBoundingClientRect()
      const mid = r.top + r.height / 2
      if (y >= r.top - 10 && y < mid) el.classList.add('drag-over-top')
      else if (y >= mid && y < r.bottom + 10) el.classList.add('drag-over-bottom')
    })
  }

  function onEnd(e) {
    if (!drag.current) return
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('mouseup', onEnd)
    document.removeEventListener('touchend', onEnd)

    const { itemId, clone, row } = drag.current
    clone.remove()
    if (row) row.style.opacity = ''
    document.querySelectorAll('[data-drag-id]').forEach(el =>
      el.classList.remove('drag-over-top', 'drag-over-bottom')
    )

    const touch = e.changedTouches?.[0] || e
    const y = touch.clientY
    let targetId = null, before = true

    document.querySelectorAll('[data-drag-id]').forEach(el => {
      if (el === row) return
      const r = el.getBoundingClientRect()
      const mid = r.top + r.height / 2
      if (y >= r.top - 10 && y < mid) { targetId = el.dataset.dragId; before = true }
      else if (y >= mid && y < r.bottom + 10) { targetId = el.dataset.dragId; before = false }
    })

    drag.current = null

    if (!targetId) return

    setItems(prev => {
      const next = [...prev]
      const fromIdx = next.findIndex(i => i.id === itemId)
      const [moved] = next.splice(fromIdx, 1)
      const toIdx = next.findIndex(i => i.id === targetId)
      next.splice(before ? toIdx : toIdx + 1, 0, moved)
      const newOrder = next.map((it, idx) => ({ id: it.id, sort_order: idx }))
      saveSortOrder(table, newOrder).then(() => onSaved?.())
      return next
    })
  }

  return { items, startDrag }
}
