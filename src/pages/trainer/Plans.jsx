import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { usePageTitle } from '../../contexts/PageTitleContext'
import { useToast } from '../../contexts/ToastContext'
import { getTrainerPlans, createTrainerPlan } from '../../lib/db'
import Modal from '../../components/Modal'

export default function TrainerPlans() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { clearPageTitle } = usePageTitle()
  const showToast = useToast()

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [planName, setPlanName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    clearPageTitle()
    if (user) load()
  }, [user])

  async function load() {
    setLoading(true)
    const { data } = await getTrainerPlans(user.id)
    setPlans(data || [])
    setLoading(false)
  }

  async function handleCreate() {
    if (!planName.trim()) return
    setSaving(true)
    const { error } = await createTrainerPlan(planName.trim(), user.id)
    setSaving(false)
    if (error) { showToast('Fehler: ' + error.message); return }
    setShowNew(false)
    setPlanName('')
    showToast('Plan erstellt')
    load()
  }

  if (loading) return <div className="spinner-wrap" style={{ minHeight: 200 }}><div className="spinner" /></div>

  return (
    <div style={{ padding: '4px 16px 16px' }}>
      <p className="section-label">Meine Trainingspläne</p>

      {plans.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <div className="empty-title">Noch keine Pläne</div>
          <div className="empty-sub">Erstelle deinen ersten Plan</div>
        </div>
      )}

      {plans.map(p => {
        const uc = p.units?.[0]?.count ?? 0
        return (
          <div
            key={p.id}
            className="card"
            onClick={() => navigate(`/trainer/plans/${p.id}`, { state: { plan: p } })}
          >
            <div className="card-row">
              <div>
                <div className="card-title">{p.name}</div>
                <div className="card-sub">{uc} Einheit{uc !== 1 ? 'en' : ''}</div>
              </div>
              <IconChevron />
            </div>
          </div>
        )
      })}

      <button className="btn btn-ghost btn-full" style={{ marginTop: 6 }} onClick={() => { setPlanName(''); setShowNew(true) }}>
        + Neuen Plan erstellen
      </button>

      <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Neuer Trainingsplan">
        <div className="modal-field">
          <label>Name</label>
          <input value={planName} onChange={e => setPlanName(e.target.value)} placeholder="z.B. Ganzkörper 3x" maxLength={60} autoFocus />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowNew(false)}>Abbrechen</button>
          <button className="btn btn-primary" disabled={saving} onClick={handleCreate}>Erstellen</button>
        </div>
      </Modal>
    </div>
  )
}

function IconChevron() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', flexShrink: 0 }}><path d="M9 18l6-6-6-6"/></svg>
}
