import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { usePageTitle } from '../../contexts/PageTitleContext'
import { getStatsData } from '../../lib/db'
import { getWeek, unitBadgeClass } from '../../lib/utils'

export default function Stats() {
  const { user } = useAuth()
  const { clearPageTitle } = usePageTitle()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    clearPageTitle()
    if (user) load()
  }, [user])

  async function load() {
    setLoading(true)
    const result = await getStatsData(user.id)
    setData(result)
    setLoading(false)
  }

  if (loading) return <div className="spinner-wrap" style={{ minHeight: 200 }}><div className="spinner" /></div>
  if (!data) return null

  const { sessions, sets } = data
  const total = sessions.length
  const week = getWeek(new Date())
  const thisWeek = sessions.filter(s => s.week_number === week).length

  // Unit letter counts
  const unitCounts = {}
  sessions.forEach(s => { unitCounts[s.letter] = (unitCounts[s.letter] || 0) + 1 })
  const sortedUnits = Object.entries(unitCounts).sort((a, b) => b[1] - a[1])

  // Top exercises
  const exMap = {}
  sets.forEach(set => {
    if (!exMap[set.exercise_name]) exMap[set.exercise_name] = { count: 0, maxKg: 0 }
    exMap[set.exercise_name].count += 1
    const kg = set.kg_total || 0
    if (kg > exMap[set.exercise_name].maxKg) exMap[set.exercise_name].maxKg = kg
  })
  const topEx = Object.entries(exMap).sort((a, b) => b[1].count - a[1].count).slice(0, 5)

  return (
    <div style={{ padding: '4px 16px 16px' }}>
      <p className="section-label">Übersicht</p>
      <div className="stat-grid">
        <div className="stat-box">
          <div className="stat-val">{total}</div>
          <div className="stat-lbl">Gesamt</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{thisWeek}</div>
          <div className="stat-lbl">Diese Woche</div>
        </div>
      </div>

      {sortedUnits.length > 0 && (
        <>
          <p className="section-label">Einheiten</p>
          <div className="stat-grid">
            {sortedUnits.map(([letter, count], i) => (
              <div key={letter} className="stat-box">
                <span className={`badge ${unitBadgeClass(i)}`} style={{ display: 'inline-block', marginBottom: 6 }}>
                  {letter}
                </span>
                <div className="stat-val">{count}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {topEx.length > 0 && (
        <>
          <p className="section-label">Top Übungen</p>
          <div className="card" style={{ cursor: 'default' }}>
            {topEx.map(([name, d]) => (
              <div key={name} className="ex-row">
                <div style={{ flex: 1 }}>
                  <div className="ex-name">{name}</div>
                  <div className="ex-detail">
                    {d.count}× · {d.maxKg > 0 ? `max ${d.maxKg} kg` : 'Körpergewicht'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {total === 0 && (
        <div className="empty">
          <div className="empty-icon">📊</div>
          <div className="empty-title">Noch keine Daten</div>
          <div className="empty-sub">Starte dein erstes Training</div>
        </div>
      )}
    </div>
  )
}
