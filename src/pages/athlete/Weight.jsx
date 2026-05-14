import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { usePageTitle } from '../../contexts/PageTitleContext'
import { useToast } from '../../contexts/ToastContext'
import { getWeightLogs, upsertWeightLog, deleteWeightLog, getProfile, updateProfile } from '../../lib/db'
import { formatDate, displayWeightNum, inputToKg, kgToLbs } from '../../lib/utils'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import Modal from '../../components/Modal'

export default function Weight() {
  const { user } = useAuth()
  const { clearPageTitle } = usePageTitle()
  const showToast = useToast()

  const [logs, setLogs] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLog, setShowLog] = useState(false)
  const [showUnit, setShowUnit] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [inputDate, setInputDate] = useState(today())
  const [saving, setSaving] = useState(false)

  const unit = profile?.weight_unit || 'kg'

  useEffect(() => {
    clearPageTitle()
    if (user) load()
  }, [user])

  async function load() {
    setLoading(true)
    const [{ data: l }, { data: p }] = await Promise.all([
      getWeightLogs(user.id),
      getProfile(user.id),
    ])
    setLogs(l || [])
    setProfile(p)
    setLoading(false)
  }

  async function handleLog() {
    if (!inputVal) return
    setSaving(true)
    const kg = inputToKg(inputVal, unit)
    if (!kg) { showToast('Ungültiger Wert'); setSaving(false); return }
    const { error } = await upsertWeightLog(user.id, inputDate, kg)
    setSaving(false)
    if (error) { showToast('Fehler: ' + error.message); return }
    setShowLog(false)
    setInputVal('')
    showToast('Gewicht gespeichert')
    load()
  }

  async function handleDelete(id) {
    await deleteWeightLog(id)
    showToast('Eintrag gelöscht')
    load()
  }

  async function handleUnitChange(newUnit) {
    await updateProfile(user.id, { weight_unit: newUnit })
    setProfile(p => ({ ...p, weight_unit: newUnit }))
    setShowUnit(false)
    showToast('Einheit geändert')
  }

  function openLog() {
    setInputVal('')
    setInputDate(today())
    setShowLog(true)
  }

  // Chart data — oldest first, last 60 entries
  const chartData = [...logs].slice(0, 60).reverse().map(l => ({
    date: l.logged_at.slice(5),  // MM-DD
    value: unit === 'lbs' ? kgToLbs(l.weight_kg) : l.weight_kg,
  }))

  const latest = logs[0]
  const prev = logs[7]  // ~1 week ago
  const delta = latest && prev
    ? (displayWeightNum(latest.weight_kg, unit) - displayWeightNum(prev.weight_kg, unit)).toFixed(1)
    : null

  if (loading) return <div className="spinner-wrap" style={{ minHeight: 200 }}><div className="spinner" /></div>

  return (
    <div style={{ padding: '4px 16px 24px' }}>

      {/* Hero card */}
      <div className="hero-card" style={{ marginTop: 8 }}>
        <div className="hero-tag">Aktuelles Gewicht</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 48, fontWeight: 700, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--hero-ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {latest ? displayWeightNum(latest.weight_kg, unit) : '–'}
              <span style={{ fontSize: 20, fontWeight: 500, marginLeft: 6, color: 'rgba(236,253,245,0.6)' }}>{unit}</span>
            </div>
            {delta !== null && (
              <div style={{ fontSize: 13, marginTop: 6, color: parseFloat(delta) <= 0 ? 'var(--hero-accent)' : '#fb923c', fontFamily: 'var(--font-mono)' }}>
                {parseFloat(delta) > 0 ? '+' : ''}{delta} {unit} vs. Vorwoche
              </div>
            )}
            {latest && (
              <div style={{ fontSize: 12, color: 'rgba(236,253,245,0.5)', marginTop: 4 }}>
                {formatDate(latest.logged_at)}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowUnit(true)}
            style={{ fontSize: 12, color: 'var(--hero-accent)', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 999, padding: '4px 10px', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600 }}
          >
            {unit.toUpperCase()}
          </button>
        </div>

        {/* Mini chart */}
        {chartData.length > 1 && (
          <div style={{ marginTop: 16, height: 80 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: -32, bottom: 0 }}>
                <XAxis dataKey="date" hide />
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip
                  contentStyle={{ background: 'var(--hero)', border: '1px solid var(--hero-border)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'var(--hero-ink)' }}
                  itemStyle={{ color: 'var(--hero-accent)' }}
                  formatter={v => [`${v} ${unit}`, '']}
                />
                <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <button className="btn btn-primary btn-full" style={{ marginBottom: 16 }} onClick={openLog}>
        + Gewicht eintragen
      </button>

      {/* History */}
      {logs.length === 0 && (
        <div className="empty">
          <div className="empty-icon">⚖️</div>
          <div className="empty-title">Noch keine Einträge</div>
          <div className="empty-sub">Trage dein erstes Gewicht ein</div>
        </div>
      )}

      {logs.length > 0 && (
        <>
          <p className="section-label">Verlauf</p>
          {logs.map((l, i) => {
            const prev = logs[i + 1]
            const curr = displayWeightNum(l.weight_kg, unit)
            const prevVal = prev ? displayWeightNum(prev.weight_kg, unit) : null
            const diff = prevVal !== null ? (curr - prevVal).toFixed(1) : null
            return (
              <div key={l.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 0', borderBottom: '1px solid var(--border)',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
                    {curr} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-muted)' }}>{unit}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>{formatDate(l.logged_at)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {diff !== null && (
                    <span style={{
                      fontSize: 12, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums',
                      color: parseFloat(diff) < 0 ? 'var(--success)' : parseFloat(diff) > 0 ? 'var(--danger)' : 'var(--ink-muted)',
                    }}>
                      {parseFloat(diff) > 0 ? '+' : ''}{diff}
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(l.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' }}
                  >
                    <IconTrash />
                  </button>
                </div>
              </div>
            )
          })}
        </>
      )}

      {/* Log modal */}
      <Modal isOpen={showLog} onClose={() => setShowLog(false)} title="Gewicht eintragen">
        <div className="modal-field">
          <label>Datum</label>
          <input type="date" value={inputDate} onChange={e => setInputDate(e.target.value)} />
        </div>
        <div className="modal-field">
          <label>Gewicht ({unit})</label>
          <input
            type="number" step={0.1} min={20} max={500}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder={unit === 'kg' ? 'z.B. 80.5' : 'z.B. 177.5'}
            autoFocus
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowLog(false)}>Abbrechen</button>
          <button className="btn btn-primary" disabled={saving || !inputVal} onClick={handleLog}>Speichern</button>
        </div>
      </Modal>

      {/* Unit modal */}
      <Modal isOpen={showUnit} onClose={() => setShowUnit(false)} title="Einheit wählen">
        <div className="modal-actions" style={{ flexDirection: 'column' }}>
          <button className={`btn ${unit === 'kg' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => handleUnitChange('kg')}>Kilogramm (kg)</button>
          <button className={`btn ${unit === 'lbs' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => handleUnitChange('lbs')}>Pfund (lbs)</button>
        </div>
      </Modal>
    </div>
  )
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function IconTrash() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
}
