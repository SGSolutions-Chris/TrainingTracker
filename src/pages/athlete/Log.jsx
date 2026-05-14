import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { usePageTitle } from '../../contexts/PageTitleContext'
import { getSessions } from '../../lib/db'
import { formatDate, formatDuration, unitBadgeClass } from '../../lib/utils'

export default function Log() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { clearPageTitle } = usePageTitle()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    clearPageTitle()
    if (user) load()
  }, [user])

  async function load() {
    setLoading(true)
    const { data } = await getSessions(user.id)
    setSessions(data || [])
    setLoading(false)
  }

  const LETTERS = ['A','B','C','D','E','F','G','H']

  if (loading) return <div className="spinner-wrap" style={{ minHeight: 200 }}><div className="spinner" /></div>

  if (!sessions.length) {
    return (
      <div className="empty">
        <div className="empty-icon">📅</div>
        <div className="empty-title">Noch kein Training</div>
        <div className="empty-sub">Starte deine erste Einheit</div>
      </div>
    )
  }

  let lastWeek = ''

  return (
    <div style={{ padding: '4px 16px 16px' }}>
      <p className="section-label">Trainingsprotokoll</p>
      {sessions.map(s => {
        const wk = `KW ${s.week_number} · ${s.trained_at.slice(0, 4)}`
        const showWeek = wk !== lastWeek
        lastWeek = wk
        const bc = unitBadgeClass(Math.max(0, LETTERS.indexOf(s.letter)))
        const dur = s.duration_seconds ? ` · ${formatDuration(s.duration_seconds)}` : ''
        return (
          <div key={s.id}>
            {showWeek && <div className="week-head">{wk}</div>}
            <div className="log-item" onClick={() => navigate(`/log/${s.id}`, { state: { session: s } })}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`badge ${bc}`}>{s.letter}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--heading)' }}>{s.plan_name}</span>
              </div>
              <div className="log-meta">{formatDate(s.trained_at)}{dur}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
