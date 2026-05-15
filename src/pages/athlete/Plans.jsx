import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { getUnits } from '../../lib/db'
import { unitBadgeClass } from '../../lib/utils'
import Modal from '../../components/Modal'
import s from '../../styles/Plans.module.css'

export default function Plans() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  // Workout-start modal state
  const [showStart, setShowStart] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [units, setUnits] = useState([])
  const [unitsLoading, setUnitsLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    loadPlans()
  }, [user])

  async function loadPlans() {
    setLoading(true)
    const { data, error } = await supabase
      .from('plans')
      .select('id, name, user_id, assigned_to, units(count)')
      .or(`user_id.eq.${user.id},assigned_to.eq.${user.id}`)
      .order('created_at', { ascending: false })
    if (!error) setPlans(data ?? [])
    setLoading(false)
  }

  function getUnitCount(plan) {
    return plan.units?.[0]?.count ?? 0
  }

  function isTrainerPlan(plan) {
    return plan.user_id !== user.id
  }

  async function handleSelectPlan(plan) {
    setSelectedPlan(plan)
    setUnitsLoading(true)
    const { data } = await getUnits(plan.id)
    setUnits(data || [])
    setUnitsLoading(false)
  }

  function startWorkout(unit) {
    navigate(`/workout/${selectedPlan.id}/${unit.id}`, {
      state: { planName: selectedPlan.name, letter: unit.letter },
    })
  }

  function closeModal() {
    setShowStart(false)
    setSelectedPlan(null)
    setUnits([])
  }

  return (
    <div className={s.container}>

      {loading && (
        <div className={s.spinnerWrap}>
          <div className="spinner" />
        </div>
      )}

      {!loading && plans.length === 0 && (
        <div className={s.empty}>
          <div className={s.emptyIcon}><IconDumbbell /></div>
          <p className={s.emptyTitle}>Noch keine Pläne</p>
          <p className={s.emptyText}>Erstelle deinen ersten Trainingsplan oder warte auf eine Zuweisung durch deinen Trainer.</p>
        </div>
      )}

      {!loading && plans.length > 0 && (
        <div className={s.list}>
          {plans.map((plan) => (
            <button
              key={plan.id}
              className={s.card}
              onClick={() => navigate(`/plans/${plan.id}`)}
            >
              <div className={s.cardHeader}>
                <span className={s.cardName}>{plan.name}</span>
                {isTrainerPlan(plan) && (
                  <span className={s.trainerBadge}>Trainer</span>
                )}
              </div>
              <p className={s.cardMeta}>
                {getUnitCount(plan)} {getUnitCount(plan) === 1 ? 'Einheit' : 'Einheiten'}
              </p>
              <div className={s.cardArrow}><IconChevron /></div>
            </button>
          ))}
        </div>
      )}

      {!loading && (
        <button className={s.addBtn} onClick={() => navigate('/plans/new')}>
          + Neuen Trainingsplan anlegen
        </button>
      )}

      {/* FAB — Workout starten */}
      <button
        className={s.fab}
        onClick={() => setShowStart(true)}
        aria-label="Workout starten"
        title="Workout starten"
      >
        <IconPlay />
      </button>

      {/* ── Workout-Start Modal ── */}
      <Modal
        isOpen={showStart}
        onClose={closeModal}
        title={selectedPlan ? selectedPlan.name : 'Workout starten'}
      >
        {!selectedPlan ? (
          /* Step 1 — Wähle Plan */
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
              Wähle einen Trainingsplan:
            </p>
            {plans.length === 0 && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Noch keine Pläne vorhanden.</p>
            )}
            {plans.map(plan => (
              <button
                key={plan.id}
                onClick={() => handleSelectPlan(plan)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  marginBottom: 8,
                  background: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font)',
                  transition: 'border-color 0.15s',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{plan.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {getUnitCount(plan)} {getUnitCount(plan) === 1 ? 'Einheit' : 'Einheiten'}
                    {isTrainerPlan(plan) && ' · Trainer'}
                  </div>
                </div>
                <IconChevron />
              </button>
            ))}
          </div>
        ) : (
          /* Step 2 — Wähle Einheit */
          <div>
            <button
              onClick={() => setSelectedPlan(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--ink-muted)',
                fontSize: 13,
                fontFamily: 'var(--font)',
                fontWeight: 600,
                marginBottom: 14,
                padding: 0,
              }}
            >
              <IconBack /> Zurück zu Plänen
            </button>

            {unitsLoading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
                <div className="spinner" />
              </div>
            )}

            {!unitsLoading && units.length === 0 && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                Dieser Plan hat noch keine Einheiten.
              </p>
            )}

            {!unitsLoading && units.map((unit, i) => (
              <button
                key={unit.id}
                onClick={() => startWorkout(unit)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  marginBottom: 8,
                  background: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font)',
                  textAlign: 'left',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                <span className={`badge ${unitBadgeClass(i)}`} style={{ flexShrink: 0, minWidth: 28, textAlign: 'center' }}>
                  {unit.letter}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                    {unit.name || 'Einheit ' + unit.letter}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {unit.exercises?.[0]?.count ?? 0} Übung{(unit.exercises?.[0]?.count ?? 0) !== 1 ? 'en' : ''}
                  </div>
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--accent)', color: 'var(--accent-ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <IconPlay />
                </div>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}

/* ── Icons ────────────────────────────────────────── */
function IconPlay() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}

function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function IconBack() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}

function IconDumbbell() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11M6.5 17.5h11"/>
      <path d="M3 9.5h2v5H3zM19 9.5h2v5h-2z"/>
      <rect x="5" y="8" width="14" height="8" rx="1"/>
    </svg>
  )
}
