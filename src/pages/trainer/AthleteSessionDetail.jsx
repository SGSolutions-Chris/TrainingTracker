import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { usePageTitle } from '../../contexts/PageTitleContext'
import { getSession, getSessionSets } from '../../lib/db'
import { formatDuration } from '../../lib/utils'

export default function AthleteSessionDetail() {
  const { sessionId } = useParams()
  const { state } = useLocation()
  const { setPageTitle } = usePageTitle()

  const [session, setSession] = useState(state?.session || null)
  const [byExercise, setByExercise] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [sessionId])

  async function load() {
    setLoading(true)
    const [{ data: sess }, { data: sets }] = await Promise.all([
      session ? { data: session } : getSession(sessionId),
      getSessionSets(sessionId),
    ])
    const s = sess || session
    setSession(s)
    setPageTitle(s ? `${s.trained_at} · ${s.letter}` : 'Training', s?.plan_name || '')
    const grouped = {}
    ;(sets || []).forEach(set => {
      if (!grouped[set.exercise_name]) grouped[set.exercise_name] = []
      grouped[set.exercise_name].push(set)
    })
    setByExercise(grouped)
    setLoading(false)
  }

  if (loading) return <div className="spinner-wrap" style={{ minHeight: 200 }}><div className="spinner" /></div>

  return (
    <div style={{ padding: '14px 14px 24px' }}>
      {session?.duration_seconds && (
        <div className="card" style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span style={{ fontSize: 14 }}>Trainingsdauer: <strong>{formatDuration(session.duration_seconds)}</strong></span>
        </div>
      )}

      {Object.keys(byExercise).length === 0 && (
        <div className="empty"><div className="empty-title">Keine Daten</div></div>
      )}

      {Object.entries(byExercise).map(([name, sets]) => (
        <div key={name} className="session-card" style={{ cursor: 'default' }}>
          <div className="session-ex-title">{name}</div>
          <table className="sets-table">
            <thead>
              <tr><th>Satz</th><th>KG/S</th><th>KG ges.</th><th>Ziel</th><th>Ist</th><th>✓</th></tr>
            </thead>
            <tbody>
              {sets.map(set => (
                <tr key={set.set_number}>
                  <td><span className="set-num">{set.set_number}</span></td>
                  <td className="mono" style={{ fontSize: 13 }}>{set.kg_per_side ?? '–'}</td>
                  <td className="mono" style={{ fontSize: 13 }}>{set.kg_total ?? '–'}</td>
                  <td className="mono" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {set.target_reps === 0 ? 'AMRAP' : (set.target_reps ?? '–')}
                  </td>
                  <td className="mono" style={{ fontSize: 13, color: 'var(--accent)' }}>{set.actual_reps ?? '–'}</td>
                  <td style={{ fontSize: 16 }}>{set.done ? '✅' : '○'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
