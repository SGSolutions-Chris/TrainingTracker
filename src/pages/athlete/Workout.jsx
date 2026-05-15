import { useEffect, useRef, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { usePageTitle } from '../../contexts/PageTitleContext'
import { useToast } from '../../contexts/ToastContext'
import { getExercises, insertSession, insertSessionSets, updateExercise } from '../../lib/db'
import { formatDuration, getWeek, repsLabel, EQUIP_LABELS, calcKgTotal } from '../../lib/utils'
import Modal from '../../components/Modal'
import s from '../../styles/Workout.module.css'

const SS_KEY = 'tt_workout'

export default function Workout() {
  const { planId, unitId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { setPageTitle } = usePageTitle()
  const showToast = useToast()

  const planName = state?.planName || ''
  const letter = state?.letter || '?'

  const [exercises, setExercises] = useState([])
  const [exIdx, setExIdx] = useState(0)
  const [sessionData, setSessionData] = useState({})
  const [elapsed, setElapsed] = useState(0)
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)

  const [showAbort, setShowAbort] = useState(false)
  const [showNoData, setShowNoData] = useState(false)
  const [showUpdateKg, setShowUpdateKg] = useState(false)
  const [newKg, setNewKg] = useState('')
  const [newKgTotal, setNewKgTotal] = useState('')

  const startTimeRef = useRef(Date.now())
  const timerRef = useRef(null)

  // Intercept browser back
  useEffect(() => {
    history.pushState({ workout: true }, '')
    function onPop() {
      history.pushState({ workout: true }, '')
      setShowAbort(true)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    setPageTitle(`Training · ${letter}`, planName)
    loadExercises()
    startTimer()
    restoreSession()
    return () => stopTimer()
  }, [])

  async function loadExercises() {
    const { data } = await getExercises(unitId)
    setExercises(data || [])
    setLoading(false)
  }

  function startTimer() {
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
  }

  function stopTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    return Math.floor((Date.now() - startTimeRef.current) / 1000)
  }

  function restoreSession() {
    try {
      const raw = sessionStorage.getItem(SS_KEY)
      if (!raw) return
      const { data, idx, startTime } = JSON.parse(raw)
      if (data) setSessionData(data)
      if (idx !== undefined) setExIdx(idx)
      if (startTime) startTimeRef.current = startTime
    } catch {}
  }

  function saveSession(data, idx) {
    try {
      sessionStorage.setItem(SS_KEY, JSON.stringify({ data, idx, startTime: startTimeRef.current }))
    } catch {}
  }

  function updateData(key, value) {
    setSessionData(prev => {
      const next = { ...prev, [key]: value }
      saveSession(next, exIdx)
      return next
    })
  }

  function navEx(dir) {
    const nextIdx = exIdx + dir
    setExIdx(nextIdx)
    saveSession(sessionData, nextIdx)
    window.scrollTo(0, 0)
  }

  function toggleDone(ei, si) {
    const key = `done_${ei}_${si}`
    updateData(key, !sessionData[key])
  }

  function copyTargetReps(ei, sets, targetReps) {
    const updates = {}
    for (let s = 0; s < sets; s++) updates[`ist_${ei}_${s}`] = String(targetReps)
    setSessionData(prev => {
      const next = { ...prev, ...updates }
      saveSession(next, exIdx)
      return next
    })
    showToast('Ziel-Wdh. übernommen')
  }

  function handleKgInput(ei, val, equipment) {
    updateData(`kg_${ei}`, val)
    if (equipment === 'dumbbell') updateData(`kgtot_${ei}`, calcKgTotal(val, 'dumbbell'))
    else updateData(`kgtot_${ei}`, val)
  }

  async function handleUpdateKg() {
    const ex = exercises[exIdx]
    if (!ex) return
    const isBarbell = ex.equipment_type === 'barbell'
    const kgSide = isBarbell ? null : (parseFloat(newKg) || null)
    const kgTot = isBarbell ? (parseFloat(newKg) || null) : (parseFloat(newKgTotal) || null)
    await updateExercise(ex.id, { target_kg_per_side: kgSide, target_kg_total: kgTot })
    if (newKg) {
      updateData(`kg_${exIdx}`, newKg)
      updateData(`kgtot_${exIdx}`, isBarbell ? newKg : newKgTotal)
    }
    setShowUpdateKg(false)
    showToast('Ziel-KG aktualisiert')
  }

  async function finish() {
    const hasData = Object.keys(sessionData).some(k =>
      (k.startsWith('ist_') || k.startsWith('done_')) && sessionData[k]
    )
    if (!hasData) { setShowNoData(true); return }
    await doFinish()
  }

  async function doFinish() {
    const duration = stopTimer()
    const now = new Date()
    const { data: sess, error } = await insertSession({
      user_id: user?.id,
      plan_id: planId,
      unit_id: unitId,
      letter,
      plan_name: planName,
      trained_at: now.toISOString().slice(0, 10),
      week_number: getWeek(now),
      duration_seconds: duration,
    })
    if (error) { showToast('Fehler beim Speichern'); return }

    const sets = []
    exercises.forEach((ex, ei) => {
      for (let si = 0; si < ex.sets; si++) {
        sets.push({
          session_id: sess.id,
          exercise_name: ex.name,
          set_number: si + 1,
          kg_per_side: parseFloat(sessionData[`kg_${ei}`]) || null,
          kg_total: parseFloat(sessionData[`kgtot_${ei}`]) || null,
          target_reps: ex.target_reps,
          target_reps_unit: ex.target_reps_unit || 'reps',
          actual_reps: parseInt(sessionData[`ist_${ei}_${si}`]) || null,
          done: !!sessionData[`done_${ei}_${si}`],
        })
      }
    })
    if (sets.length) await insertSessionSets(sets)
    sessionStorage.removeItem(SS_KEY)
    setDone(true)
    showToast(`Training gespeichert 💪 ${formatDuration(duration)}`)
    navigate('/plans', { replace: true })
  }

  async function abort() {
    const duration = stopTimer()
    const now = new Date()
    const { data: sess } = await insertSession({
      plan_id: planId, unit_id: unitId, letter, plan_name: planName,
      trained_at: now.toISOString().slice(0, 10),
      week_number: getWeek(now), duration_seconds: duration,
    })
    if (sess) {
      const sets = []
      exercises.forEach((ex, ei) => {
        for (let si = 0; si < ex.sets; si++) {
          if (sessionData[`ist_${ei}_${si}`] || sessionData[`done_${ei}_${si}`]) {
            sets.push({
              session_id: sess.id, exercise_name: ex.name, set_number: si + 1,
              kg_per_side: parseFloat(sessionData[`kg_${ei}`]) || null,
              kg_total: parseFloat(sessionData[`kgtot_${ei}`]) || null,
              target_reps: ex.target_reps, target_reps_unit: ex.target_reps_unit || 'reps',
              actual_reps: parseInt(sessionData[`ist_${ei}_${si}`]) || null,
              done: !!sessionData[`done_${ei}_${si}`],
            })
          }
        }
      })
      if (sets.length) await insertSessionSets(sets)
    }
    sessionStorage.removeItem(SS_KEY)
    showToast('Workout beendet – Fortschritt gespeichert')
    navigate('/plans', { replace: true })
  }

  if (loading) return <div className="spinner-wrap" style={{ minHeight: 200 }}><div className="spinner" /></div>
  if (!exercises.length) return <div className="empty"><div className="empty-title">Keine Übungen in dieser Einheit</div></div>

  const ex = exercises[exIdx]
  const isFirst = exIdx === 0
  const isLast = exIdx === exercises.length - 1
  const equip = ex.equipment_type || 'dumbbell'
  const isBarbell = equip === 'barbell'
  const isBody = equip === 'bodyweight'

  const curKg = sessionData[`kg_${exIdx}`] ?? (isBarbell ? ex.target_kg_total : ex.target_kg_per_side) ?? ''
  const curKgTot = sessionData[`kgtot_${exIdx}`] ?? ex.target_kg_total ?? ''

  return (
    <div className={s.container}>
      {/* Progress bar */}
      <div className={s.progressRow}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Übung {exIdx + 1} von {exercises.length}
        </span>
        <span className={s.timer}>{formatDuration(elapsed)}</span>
      </div>

      <div className="session-card">
        {/* Exercise header */}
        <div className={s.exHeader}>
          <div>
            <div className="session-ex-title" style={{ marginBottom: 2 }}>{ex.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{EQUIP_LABELS[equip]}</div>
          </div>
          {!isBody && (
            <button
              className={s.kgBtn}
              onClick={() => {
                setNewKg(String(curKg))
                setNewKgTotal(String(curKgTot))
                setShowUpdateKg(true)
              }}
            >
              <IconEdit /> Ziel-KG
            </button>
          )}
        </div>

        {/* KG inputs */}
        {isBody && (
          <div className={s.bodyBadge}>
            <IconUser /> Körpergewicht
          </div>
        )}

        {!isBody && (
          <div className={s.kgRow}>
            <div className={s.kgField}>
              <div className={s.kgLabel}>
                {isBarbell ? 'KG gesamt' : 'KG/Seite'}
                {(isBarbell ? ex.target_kg_total : ex.target_kg_per_side)
                  ? <span className={s.kgTarget}> Ziel: {isBarbell ? ex.target_kg_total : ex.target_kg_per_side}</span>
                  : null}
              </div>
              <input
                className="mini-input" style={{ width: '100%' }}
                type="number" step={0.5}
                value={curKg}
                onChange={e => handleKgInput(exIdx, e.target.value, equip)}
                placeholder={isBarbell ? String(ex.target_kg_total || 0) : String(ex.target_kg_per_side || 0)}
              />
            </div>
            {!isBarbell && (
              <div className={s.kgField}>
                <div className={s.kgLabel}>
                  KG gesamt
                  {ex.target_kg_total ? <span className={s.kgTarget}> Ziel: {ex.target_kg_total}</span> : null}
                </div>
                <input
                  className="mini-input" style={{ width: '100%', color: 'var(--text-muted)' }}
                  type="number" step={0.5}
                  value={curKgTot}
                  readOnly
                />
              </div>
            )}
          </div>
        )}

        {/* Copy reps button */}
        {ex.target_reps > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
            <button className={s.copyBtn} onClick={() => copyTargetReps(exIdx, ex.sets, ex.target_reps)}>
              <IconCopy /> Ziel-Wdh. übernehmen
            </button>
          </div>
        )}

        {/* Sets table */}
        <table className="sets-table">
          <thead>
            <tr>
              <th>Satz</th>
              <th>Ziel Wdh.</th>
              <th>Ist Wdh.</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ex.sets }, (_, si) => {
              const isDone = !!sessionData[`done_${exIdx}_${si}`]
              return (
                <tr key={si}>
                  <td><span className="set-num">{si + 1}</span></td>
                  <td>
                    <span className="mono" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {repsLabel(ex.target_reps, ex.target_reps_unit)}
                    </span>
                  </td>
                  <td>
                    <input
                      className="mini-input"
                      type="number"
                      value={sessionData[`ist_${exIdx}_${si}`] || ''}
                      onChange={e => updateData(`ist_${exIdx}_${si}`, e.target.value)}
                      placeholder="–"
                    />
                  </td>
                  <td>
                    <button
                      className={`check-btn${isDone ? ' done' : ''}`}
                      onClick={() => toggleDone(exIdx, si)}
                    >
                      {isDone ? <IconCheckCircle /> : <IconCircle />}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Navigation */}
      <div className={s.navRow}>
        {!isFirst
          ? <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navEx(-1)}>← Zurück</button>
          : <div style={{ flex: 1 }} />
        }
        {isLast
          ? <button className="btn btn-primary" style={{ flex: 1 }} onClick={finish}>Training beenden</button>
          : <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navEx(1)}>Weiter →</button>
        }
      </div>

      {/* Abort */}
      <Modal isOpen={showAbort} onClose={() => setShowAbort(false)} title="Workout abbrechen?">
        <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 16 }}>
          Dein bisheriger Fortschritt wird gespeichert.
        </p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowAbort(false)}>Nein, weiter</button>
          <button className="btn btn-danger" onClick={abort}>Ja, beenden</button>
        </div>
      </Modal>

      {/* No data */}
      <Modal isOpen={showNoData} onClose={() => setShowNoData(false)} title="Keine Daten">
        <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 16 }}>
          Du hast noch keine Wdh. oder Sätze eingetragen. Trotzdem beenden?
        </p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowNoData(false)}>Weiter trainieren</button>
          <button className="btn btn-danger" onClick={() => { setShowNoData(false); doFinish() }}>Trotzdem beenden</button>
        </div>
      </Modal>

      {/* Update target KG */}
      <Modal isOpen={showUpdateKg} onClose={() => setShowUpdateKg(false)} title="Ziel-KG aktualisieren">
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
          Wird für diese und alle zukünftigen Einheiten gespeichert.
        </p>
        <div className="modal-row">
          <div className="modal-field">
            <label>{isBarbell ? 'Ziel KG gesamt' : 'Ziel KG/Seite'}</label>
            <input
              type="number" step={0.5} value={newKg}
              onChange={e => {
                setNewKg(e.target.value)
                if (!isBarbell) setNewKgTotal(calcKgTotal(e.target.value, 'dumbbell'))
              }}
              autoFocus
            />
          </div>
          {!isBarbell && (
            <div className="modal-field">
              <label>Ziel KG gesamt</label>
              <input type="number" step={0.5} value={newKgTotal} readOnly style={{ color: 'var(--text-muted)' }} />
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowUpdateKg(false)}>Abbrechen</button>
          <button className="btn btn-primary" onClick={handleUpdateKg}>Speichern</button>
        </div>
      </Modal>
    </div>
  )
}


function IconPlay()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> }
function IconEdit()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> }
function IconCopy()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> }
function IconUser()  { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function IconCheckCircle() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> }
function IconCircle()      { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/></svg> }
