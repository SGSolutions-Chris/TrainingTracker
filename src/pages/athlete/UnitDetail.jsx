import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { usePageTitle } from '../../contexts/PageTitleContext'
import { useToast } from '../../contexts/ToastContext'
import { useDragSort } from '../../hooks/useDragSort'
import { getExercises, createExercise, updateExercise, deleteExercise } from '../../lib/db'
import { repsLabel, calcKgTotal, EQUIP_LABELS } from '../../lib/utils'
import Modal from '../../components/Modal'
import s from '../../styles/UnitDetail.module.css'

const REPS_UNITS = [
  { value: 'reps', label: 'Wdh.' },
  { value: 'seconds', label: 'Sek.' },
  { value: 'minutes', label: 'Min.' },
]

function ExerciseForm({ defaults, onSubmit, onCancel, submitLabel }) {
  const [name, setName] = useState(defaults?.name || '')
  const [equipment, setEquipment] = useState(defaults?.equipment_type || 'dumbbell')
  const [sets, setSets] = useState(String(defaults?.sets || 3))
  const [isAmrap, setIsAmrap] = useState(defaults?.target_reps === 0)
  const [reps, setReps] = useState(defaults?.target_reps === 0 ? '' : String(defaults?.target_reps || 10))
  const [repsUnit, setRepsUnit] = useState(defaults?.target_reps_unit || 'reps')
  const [kgInput, setKgInput] = useState(() => {
    if (!defaults) return ''
    return defaults.equipment_type === 'barbell'
      ? String(defaults.target_kg_total || '')
      : String(defaults.target_kg_per_side || '')
  })
  const [kgTotal, setKgTotal] = useState(String(defaults?.target_kg_total || ''))

  const isBarbell = equipment === 'barbell'
  const isBody = equipment === 'bodyweight'

  function handleEquip(eq) {
    setEquipment(eq)
    setKgInput('')
    setKgTotal('')
  }

  function handleKgInput(val) {
    setKgInput(val)
    if (equipment === 'dumbbell') setKgTotal(calcKgTotal(val, 'dumbbell'))
  }

  function handleAmrap(checked) {
    setIsAmrap(checked)
    if (checked) setReps('')
  }

  function handleSubmit() {
    if (!name.trim()) return
    const kgSide = isBody ? null : (isBarbell ? null : (parseFloat(kgInput) || null))
    const kgTot = isBody ? null : (isBarbell ? (parseFloat(kgInput) || null) : (parseFloat(kgTotal) || null))
    onSubmit({
      name: name.trim(),
      sets: parseInt(sets) || 3,
      target_reps: isAmrap ? 0 : (parseInt(reps) || 10),
      target_reps_unit: isAmrap ? 'reps' : repsUnit,
      equipment_type: equipment,
      target_kg_per_side: kgSide,
      target_kg_total: kgTot,
    })
  }

  return (
    <>
      <div className="modal-field">
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="z.B. Kniebeuge" maxLength={80} autoFocus />
      </div>
      <div className="modal-field">
        <label>Gerätetyp</label>
        <select value={equipment} onChange={e => handleEquip(e.target.value)} className="input select">
          <option value="dumbbell">Kurzhantel / Kabelzug (×2)</option>
          <option value="barbell">Langhantel / Maschine (×1)</option>
          <option value="bodyweight">Körpergewicht (kein KG)</option>
        </select>
      </div>
      <div className="modal-row">
        <div className="modal-field">
          <label>Sätze</label>
          <input type="number" min={1} max={10} value={sets} onChange={e => setSets(e.target.value)} />
        </div>
        <div className="modal-field">
          <label>Zielwert</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="number" min={1} value={reps}
              onChange={e => setReps(e.target.value)}
              disabled={isAmrap}
              style={{ flex: 1, color: isAmrap ? 'var(--text-muted)' : '' }}
            />
            <select
              value={repsUnit} onChange={e => setRepsUnit(e.target.value)}
              className="input select" style={{ width: 76, padding: '8px 6px' }}
            >
              {REPS_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <input type="checkbox" checked={isAmrap} onChange={e => handleAmrap(e.target.checked)} />
              AMRAP
            </label>
          </div>
        </div>
      </div>

      {!isBody && (
        <div className="modal-row">
          <div className="modal-field">
            <label>{isBarbell ? 'Ziel KG gesamt' : 'Ziel KG/Seite'}</label>
            <input type="number" step={0.5} min={0} value={kgInput} onChange={e => handleKgInput(e.target.value)} placeholder="z.B. 40" />
          </div>
          {!isBarbell && (
            <div className="modal-field">
              <label>Ziel KG gesamt</label>
              <input type="number" step={0.5} value={kgTotal} readOnly style={{ color: 'var(--text-muted)' }} />
            </div>
          )}
        </div>
      )}

      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onCancel}>Abbrechen</button>
        <button className="btn btn-primary" onClick={handleSubmit}>{submitLabel}</button>
      </div>
    </>
  )
}

export default function UnitDetail() {
  const { planId, unitId } = useParams()
  const location = useLocation()
  const { setPageTitle } = usePageTitle()
  const showToast = useToast()

  const unit = location.state?.unit
  const planName = location.state?.planName || ''

  const [rawExercises, setRawExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)

  const { items: exercises, startDrag } = useDragSort(rawExercises, 'exercises', load)

  useEffect(() => {
    const title = unit ? `Einheit ${unit.letter}${unit.name ? ' – ' + unit.name : ''}` : 'Einheit'
    setPageTitle(title, planName)
    load()
  }, [unitId])

  async function load() {
    setLoading(true)
    const { data } = await getExercises(unitId)
    setRawExercises(data || [])
    setLoading(false)
  }

  async function handleAdd(data) {
    setSaving(true)
    const { error } = await createExercise(unitId, data)
    setSaving(false)
    if (error) { showToast('Fehler: ' + error.message); return }
    setShowAdd(false)
    showToast('Übung hinzugefügt')
    load()
  }

  async function handleEdit(data) {
    if (!editTarget) return
    setSaving(true)
    const { error } = await updateExercise(editTarget.id, data)
    setSaving(false)
    if (error) { showToast('Fehler: ' + error.message); return }
    setEditTarget(null)
    showToast('Übung gespeichert')
    load()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    await deleteExercise(deleteTarget.id)
    setDeleteTarget(null)
    showToast('Übung entfernt')
    load()
  }

  return (
    <div className={s.container}>
      <p className="section-label">Übungen</p>

      {loading && <div className="spinner-wrap" style={{ minHeight: 120 }}><div className="spinner" /></div>}

      {!loading && exercises.length === 0 && (
        <div className="empty">
          <div className="empty-icon">🏋</div>
          <div className="empty-title">Noch keine Übungen</div>
        </div>
      )}

      {!loading && exercises.length > 0 && (
        <div className="card" style={{ cursor: 'default' }}>
          {exercises.map(ex => (
            <div key={ex.id} className="ex-row sortable-item" data-drag-id={ex.id}>
              <div
                className="drag-handle"
                onMouseDown={(e) => startDrag(e, ex.id)}
                onTouchStart={(e) => startDrag(e, ex.id)}
              >
                <IconGrip />
              </div>
              <div style={{ flex: 1 }}>
                <div className="ex-name">{ex.name}</div>
                <div className="ex-detail">
                  {ex.sets} Sätze · {repsLabel(ex.target_reps, ex.target_reps_unit)} · {EQUIP_LABELS[ex.equipment_type]}
                  {ex.target_kg_per_side ? ` · Ziel: ${ex.target_kg_per_side} kg/S` : ''}
                  {!ex.target_kg_per_side && ex.target_kg_total ? ` · Ziel: ${ex.target_kg_total} kg` : ''}
                </div>
              </div>
              <button className="icon-btn" onClick={() => setEditTarget(ex)}>
                <IconEdit />
              </button>
              <button className="icon-btn" style={{ color: 'var(--danger)' }} onClick={() => setDeleteTarget(ex)}>
                <IconTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <button className="btn btn-ghost btn-full" style={{ marginTop: 8 }} onClick={() => setShowAdd(true)}>
          + Übung hinzufügen
        </button>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Übung hinzufügen">
        <ExerciseForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} submitLabel="Hinzufügen" />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Übung bearbeiten">
        {editTarget && (
          <ExerciseForm
            defaults={editTarget}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
            submitLabel="Speichern"
          />
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Übung löschen?">
        <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>
          <strong>{deleteTarget?.name}</strong> wirklich löschen?
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          Die Trainingshistorie bleibt erhalten.
        </p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Abbrechen</button>
          <button className="btn btn-danger" onClick={handleDelete}>Ja, löschen</button>
        </div>
      </Modal>
    </div>
  )
}

function IconGrip() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/></svg>
}
function IconEdit() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
}
function IconTrash() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 6m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 6h16"/></svg>
}
