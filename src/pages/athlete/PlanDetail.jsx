import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { usePageTitle } from '../../contexts/PageTitleContext'
import { useToast } from '../../contexts/ToastContext'
import { useDragSort } from '../../hooks/useDragSort'
import { getUnits, createUnit, deleteUnit, updateUnit, getPlan, updatePlan, deletePlan } from '../../lib/db'
import { unitBadgeClass } from '../../lib/utils'
import Modal from '../../components/Modal'
import s from '../../styles/PlanDetail.module.css'

export default function PlanDetail() {
  const { planId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { setPageTitle } = usePageTitle()
  const showToast = useToast()
  const isTrainer = location.pathname.startsWith('/trainer')

  const [plan, setPlan] = useState(location.state?.plan || null)
  const [rawUnits, setRawUnits] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [showAddUnit, setShowAddUnit] = useState(false)
  const [showDeletePlan, setShowDeletePlan] = useState(false)
  const [deleteUnitTarget, setDeleteUnitTarget] = useState(null)

  // Rename plan
  const [showRenamePlan, setShowRenamePlan] = useState(false)
  const [renamePlanValue, setRenamePlanValue] = useState('')

  // Rename unit
  const [renameUnitTarget, setRenameUnitTarget] = useState(null)
  const [renameUnitLetter, setRenameUnitLetter] = useState('')
  const [renameUnitName, setRenameUnitName] = useState('')

  // Add unit form
  const [letter, setLetter] = useState('')
  const [unitName, setUnitName] = useState('')
  const [saving, setSaving] = useState(false)

  const { items: units, startDrag } = useDragSort(rawUnits, 'units', load)

  useEffect(() => { load() }, [planId])

  useEffect(() => {
    setPageTitle(plan?.name || 'Plan', 'Einheiten')
  }, [plan])

  async function load() {
    setLoading(true)
    if (!plan) {
      const { data } = await getPlan(planId)
      if (data) { setPlan(data); setPageTitle(data.name, 'Einheiten') }
    }
    const { data } = await getUnits(planId)
    setRawUnits(data || [])
    setLoading(false)
  }

  async function handleRenamePlan() {
    if (!renamePlanValue.trim()) return
    setSaving(true)
    const { error } = await updatePlan(planId, { name: renamePlanValue.trim() })
    setSaving(false)
    if (error) { showToast('Fehler: ' + error.message); return }
    const updated = { ...plan, name: renamePlanValue.trim() }
    setPlan(updated)
    setPageTitle(updated.name, 'Einheiten')
    setShowRenamePlan(false)
    showToast('Plan umbenannt')
  }

  async function handleRenameUnit() {
    if (!renameUnitLetter.trim()) return
    setSaving(true)
    const { error } = await updateUnit(renameUnitTarget.id, {
      letter: renameUnitLetter.trim().toUpperCase(),
      name: renameUnitName.trim() || null,
    })
    setSaving(false)
    if (error) { showToast('Fehler: ' + error.message); return }
    setRenameUnitTarget(null)
    showToast('Einheit umbenannt')
    load()
  }

  async function handleAddUnit() {
    const l = letter.trim().toUpperCase()
    if (!l) return
    setSaving(true)
    const { error } = await createUnit(planId, l, unitName)
    setSaving(false)
    if (error) { showToast('Fehler: ' + error.message); return }
    setShowAddUnit(false); setLetter(''); setUnitName('')
    showToast('Einheit hinzugefügt')
    load()
  }

  async function handleDeleteUnit() {
    if (!deleteUnitTarget) return
    await deleteUnit(deleteUnitTarget.id)
    setDeleteUnitTarget(null)
    showToast('Einheit gelöscht')
    load()
  }

  async function handleDeletePlan() {
    await deletePlan(planId)
    setShowDeletePlan(false)
    showToast('Plan gelöscht')
    navigate(isTrainer ? '/trainer/plans' : '/plans')
  }

  function startWorkout(unit) {
    navigate(`/workout/${planId}/${unit.id}`, {
      state: { planName: plan?.name, letter: unit.letter }
    })
  }

  function openUnit(unit) {
    const base = isTrainer ? `/trainer/plans/${planId}` : `/plans/${planId}`
    navigate(`${base}/units/${unit.id}`, {
      state: { unit, planName: plan?.name }
    })
  }

  return (
    <div className={s.container}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <p className="section-label" style={{ margin: 0, flex: 1 }}>Einheiten</p>
        {plan && (
          <button
            className="icon-btn"
            title="Plan umbenennen"
            onClick={() => { setRenamePlanValue(plan.name); setShowRenamePlan(true) }}
          >
            <IconEdit />
          </button>
        )}
      </div>

      {loading && <div className="spinner-wrap" style={{ minHeight: 120 }}><div className="spinner" /></div>}

      {!loading && units.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <div className="empty-title">Noch keine Einheiten</div>
          <div className="empty-sub">Füge deine erste Einheit hinzu</div>
        </div>
      )}

      {!loading && units.map((unit, i) => (
        <div key={unit.id} className={`card sortable-item ${s.unitCard}`} data-drag-id={unit.id}>
          <div className="card-row">
            <div
              className="drag-handle"
              onMouseDown={(e) => startDrag(e, unit.id)}
              onTouchStart={(e) => startDrag(e, unit.id)}
            >
              <IconGrip />
            </div>

            <div className={s.unitInfo} onClick={() => openUnit(unit)}>
              <span className={`badge ${unitBadgeClass(i)}`}>{unit.letter}</span>
              <div>
                <div className="card-title">{unit.name || 'Einheit ' + unit.letter}</div>
                <div className="card-sub">
                  {unit.exercises?.[0]?.count ?? 0} Übung{(unit.exercises?.[0]?.count ?? 0) !== 1 ? 'en' : ''}
                </div>
              </div>
            </div>

            {!isTrainer && (
              <button
                className={s.playBtn}
                onClick={() => startWorkout(unit)}
                title="Workout starten"
              >
                <IconPlay />
              </button>
            )}

            <button
              className="icon-btn"
              title="Einheit umbenennen"
              onClick={() => {
                setRenameUnitTarget(unit)
                setRenameUnitLetter(unit.letter)
                setRenameUnitName(unit.name || '')
              }}
            >
              <IconEdit />
            </button>

            <button
              className="icon-btn"
              style={{ color: 'var(--danger)' }}
              onClick={() => setDeleteUnitTarget(unit)}
            >
              <IconTrash />
            </button>
          </div>
        </div>
      ))}

      {!loading && (
        <>
          <button className="btn btn-ghost btn-full" style={{ marginBottom: 8 }} onClick={() => setShowAddUnit(true)}>
            + Einheit hinzufügen
          </button>
          <div className="divider" />
          <button className="btn btn-danger" onClick={() => setShowDeletePlan(true)}>
            Plan löschen
          </button>
        </>
      )}

      {/* Rename Plan Modal */}
      <Modal isOpen={showRenamePlan} onClose={() => setShowRenamePlan(false)} title="Plan umbenennen">
        <div className="modal-field">
          <label>Name</label>
          <input
            value={renamePlanValue}
            onChange={e => setRenamePlanValue(e.target.value)}
            maxLength={60}
            autoFocus
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowRenamePlan(false)}>Abbrechen</button>
          <button className="btn btn-primary" disabled={saving} onClick={handleRenamePlan}>Speichern</button>
        </div>
      </Modal>

      {/* Rename Unit Modal */}
      <Modal isOpen={!!renameUnitTarget} onClose={() => setRenameUnitTarget(null)} title="Einheit umbenennen">
        <div className="modal-row">
          <div className="modal-field">
            <label>Kürzel (1–2 Zeichen)</label>
            <input
              value={renameUnitLetter}
              onChange={e => setRenameUnitLetter(e.target.value.toUpperCase())}
              maxLength={2}
              style={{ fontFamily: 'DM Mono, monospace', fontSize: 16 }}
              autoFocus
            />
          </div>
          <div className="modal-field">
            <label>Name</label>
            <input
              value={renameUnitName}
              onChange={e => setRenameUnitName(e.target.value)}
              placeholder="z.B. Push"
              maxLength={60}
            />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setRenameUnitTarget(null)}>Abbrechen</button>
          <button className="btn btn-primary" disabled={saving} onClick={handleRenameUnit}>Speichern</button>
        </div>
      </Modal>

      {/* Add Unit Modal */}
      <Modal isOpen={showAddUnit} onClose={() => setShowAddUnit(false)} title="Neue Einheit">
        <div className="modal-row">
          <div className="modal-field">
            <label>Kürzel (1–2 Zeichen)</label>
            <input
              value={letter}
              onChange={e => setLetter(e.target.value.toUpperCase())}
              placeholder="z.B. PU"
              maxLength={2}
              style={{ fontFamily: 'DM Mono, monospace', fontSize: 16 }}
              autoFocus
            />
          </div>
          <div className="modal-field">
            <label>Name</label>
            <input value={unitName} onChange={e => setUnitName(e.target.value)} placeholder="z.B. Push" maxLength={60} />
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
          Beispiele: PU/Push, PL/Pull, BE/Beine
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowAddUnit(false)}>Abbrechen</button>
          <button className="btn btn-primary" disabled={saving} onClick={handleAddUnit}>Hinzufügen</button>
        </div>
      </Modal>

      {/* Delete Unit Modal */}
      <Modal isOpen={!!deleteUnitTarget} onClose={() => setDeleteUnitTarget(null)} title="Einheit löschen?">
        <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>
          Einheit <strong>{deleteUnitTarget?.letter}{deleteUnitTarget?.name ? ' – ' + deleteUnitTarget.name : ''}</strong> wirklich löschen?
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          Alle Übungen werden entfernt. Die Trainingshistorie bleibt erhalten.
        </p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setDeleteUnitTarget(null)}>Abbrechen</button>
          <button className="btn btn-danger" onClick={handleDeleteUnit}>Ja, löschen</button>
        </div>
      </Modal>

      {/* Delete Plan Modal */}
      <Modal isOpen={showDeletePlan} onClose={() => setShowDeletePlan(false)} title="Plan löschen?">
        <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>
          Plan <strong>{plan?.name}</strong> wirklich löschen?
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          Alle Einheiten und Übungen werden entfernt. Die Trainingshistorie bleibt erhalten.
        </p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowDeletePlan(false)}>Abbrechen</button>
          <button className="btn btn-danger" onClick={handleDeletePlan}>Ja, löschen</button>
        </div>
      </Modal>
    </div>
  )
}

function IconEdit() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
}
function IconPlay() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
}
function IconTrash() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 6m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 6h16"/></svg>
}
function IconGrip() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/></svg>
}
