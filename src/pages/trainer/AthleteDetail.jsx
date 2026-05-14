import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { usePageTitle } from '../../contexts/PageTitleContext'
import { useToast } from '../../contexts/ToastContext'
import {
  getAthleteSessions, getAthletePlansForTrainer, getTrainerOwnPlans, getAssignedPlans,
  assignPlan, unassignPlan, removeAthlete, createPlanForAthlete, getProfile, getAthleteWeightLogs,
} from '../../lib/db'
import { formatDate, formatDuration, getWeek, unitBadgeClass } from '../../lib/utils'
import Modal from '../../components/Modal'

export default function AthleteDetail() {
  const { athleteId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { setPageTitle } = usePageTitle()
  const showToast = useToast()

  const athleteName = state?.name || 'Athlete'

  const [sessions, setSessions] = useState([])
  const [assignedPlans, setAssignedPlans] = useState([])
  const [athleteProfile, setAthleteProfile] = useState(null)
  const [weightLogs, setWeightLogs] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [showAssign, setShowAssign] = useState(false)
  const [showNewPlan, setShowNewPlan] = useState(false)
  const [showRemove, setShowRemove] = useState(false)
  const [trainerPlans, setTrainerPlans] = useState([])
  const [assignedIds, setAssignedIds] = useState(new Set())
  const [newPlanName, setNewPlanName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setPageTitle(athleteName, 'Athlete Übersicht')
    load()
  }, [athleteId])

  async function load() {
    setLoading(true)
    const [{ data: sess }, { data: plans }, { data: ap }, { data: wl }] = await Promise.all([
      getAthleteSessions(athleteId, 5),
      getAthletePlansForTrainer(user.id, athleteId),
      getProfile(athleteId),
      getAthleteWeightLogs(athleteId, 5),
    ])
    setSessions(sess || [])
    setAssignedPlans((plans || []).filter(p => p.assigned_to === athleteId))
    setAthleteProfile(ap)
    setWeightLogs(wl || [])
    setLoading(false)
  }

  async function openAssign() {
    const [{ data: plans }, { data: assigned }] = await Promise.all([
      getTrainerOwnPlans(user.id),
      getAssignedPlans(athleteId),
    ])
    setTrainerPlans(plans || [])
    setAssignedIds(new Set((assigned || []).map(p => p.id)))
    setShowAssign(true)
  }

  async function handleAssign(planId) {
    await assignPlan(planId, athleteId, user.id)
    setAssignedIds(prev => new Set([...prev, planId]))
    showToast('Plan zugewiesen')
    load()
  }

  async function handleUnassign(planId) {
    await unassignPlan(planId, athleteId)
    showToast('Plan entfernt')
    load()
  }

  async function handleCreatePlan() {
    if (!newPlanName.trim()) return
    setSaving(true)
    const { error } = await createPlanForAthlete(newPlanName.trim(), user.id, athleteId)
    setSaving(false)
    if (error) { showToast('Fehler: ' + error.message); return }
    setShowNewPlan(false)
    setNewPlanName('')
    showToast('Plan erstellt und ' + athleteName + ' zugewiesen')
    load()
  }

  async function handleRemove() {
    await removeAthlete(user.id, athleteId)
    showToast('Athlete entfernt')
    navigate('/trainer/athletes')
  }

  const week = getWeek(new Date())
  const thisWeek = sessions.filter(s => s.week_number === week).length
  const LETTERS = ['A','B','C','D','E','F','G','H']

  if (loading) return <div className="spinner-wrap" style={{ minHeight: 200 }}><div className="spinner" /></div>

  return (
    <div style={{ padding: '4px 16px 16px' }}>
      <p className="section-label">Stammdaten</p>
      <div className="card" style={{ cursor: 'default', marginBottom: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <InfoRow label="E-Mail" value={athleteProfile?.email || '–'} />
          <InfoRow label="Telefon" value={athleteProfile?.phone || '–'} />
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-box">
          <div className="stat-val">{sessions.length}</div>
          <div className="stat-lbl">Sessions (letzte 5)</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{thisWeek}</div>
          <div className="stat-lbl">Diese Woche</div>
        </div>
      </div>

      <p className="section-label">Aktionen</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={openAssign}>Plan zuweisen</button>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => { setNewPlanName(''); setShowNewPlan(true) }}>Neuen Plan erstellen</button>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate(`/trainer/athletes/${athleteId}/log`, { state: { name: athleteName } })}>Verlauf ansehen</button>
      </div>

      <p className="section-label">Zugewiesene Pläne</p>
      {assignedPlans.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', paddingBottom: 14 }}>Noch keine Pläne zugewiesen</p>
      )}
      {assignedPlans.map(p => (
        <div key={p.id} className="card" style={{ cursor: 'default', marginBottom: 8 }}>
          <div className="card-row">
            <div className="card-title">{p.name}</div>
            <button className="btn btn-danger btn-sm" onClick={() => handleUnassign(p.id)}>Entfernen</button>
          </div>
        </div>
      ))}

      <p className="section-label">Gewichtsverlauf</p>
      {weightLogs.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', paddingBottom: 14 }}>Noch keine Einträge</p>
      ) : (
        <div className="card" style={{ cursor: 'default', marginBottom: 8 }}>
          {weightLogs.map((l, i) => (
            <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < weightLogs.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{l.logged_at}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--heading)', fontFamily: 'var(--font-mono)' }}>{l.weight_kg} kg</span>
            </div>
          ))}
        </div>
      )}

      <p className="section-label">Letzte Sessions</p>
      {sessions.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Noch keine Sessions</p>
      )}
      {sessions.map(s => {
        const bc = unitBadgeClass(Math.max(0, LETTERS.indexOf(s.letter)))
        const dur = s.duration_seconds ? ` · ${formatDuration(s.duration_seconds)}` : ''
        return (
          <div
            key={s.id}
            className="log-item"
            onClick={() => navigate(`/trainer/athletes/${athleteId}/log/${s.id}`, { state: { session: s } })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`badge ${bc}`}>{s.letter}</span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{s.plan_name}</span>
            </div>
            <div className="log-meta">{formatDate(s.trained_at)}{dur}</div>
          </div>
        )
      })}

      <div className="divider" />
      <button className="btn btn-danger" onClick={() => setShowRemove(true)}>Athlete entfernen</button>

      {/* Assign plan modal */}
      <Modal isOpen={showAssign} onClose={() => setShowAssign(false)} title="Plan zuweisen">
        {trainerPlans.length === 0 && (
          <div className="empty" style={{ padding: 16 }}>
            <div className="empty-title">Keine Pläne vorhanden</div>
            <div className="empty-sub">Erstelle zuerst einen Plan im "Pläne"-Tab</div>
          </div>
        )}
        {trainerPlans.map(p => (
          <div key={p.id} className="card" style={{ cursor: 'default', marginBottom: 8 }}>
            <div className="card-row">
              <div className="card-title">{p.name}</div>
              {assignedIds.has(p.id)
                ? <button className="btn btn-ghost btn-sm" onClick={() => handleUnassign(p.id)}>Entfernen</button>
                : <button className="btn btn-primary btn-sm" onClick={() => handleAssign(p.id)}>Zuweisen</button>
              }
            </div>
          </div>
        ))}
      </Modal>

      {/* New plan modal */}
      <Modal isOpen={showNewPlan} onClose={() => setShowNewPlan(false)} title={`Neuer Plan für ${athleteName}`}>
        <div className="modal-field">
          <label>Name des Plans</label>
          <input value={newPlanName} onChange={e => setNewPlanName(e.target.value)} placeholder="z.B. Ganzkörper 3x" maxLength={60} autoFocus />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowNewPlan(false)}>Abbrechen</button>
          <button className="btn btn-primary" disabled={saving} onClick={handleCreatePlan}>Erstellen</button>
        </div>
      </Modal>

      {/* Remove athlete modal */}
      <Modal isOpen={showRemove} onClose={() => setShowRemove(false)} title="Athlete entfernen?">
        <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 16 }}>
          <strong>{athleteName}</strong> aus deiner Athlete-Liste entfernen?
        </p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowRemove(false)}>Abbrechen</button>
          <button className="btn btn-danger" onClick={handleRemove}>Entfernen</button>
        </div>
      </Modal>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color: 'var(--text)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}
