import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import s from '../../styles/Plans.module.css'

export default function Plans() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className={s.container}>

      {loading && (
        <div className={s.spinnerWrap}>
          <div className="spinner" />
        </div>
      )}

      {!loading && plans.length === 0 && (
        <div className={s.empty}>
          <div className={s.emptyIcon}>
            <IconDumbbell />
          </div>
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
              <div className={s.cardArrow}>
                <IconChevron />
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && (
        <button
          className={s.addBtn}
          onClick={() => navigate('/plans/new')}
        >
          + Neuen Trainingsplan anlegen
        </button>
      )}

      {/* FAB — Workout starten */}
      <button
        className={s.fab}
        onClick={() => navigate('/log/new')}
        aria-label="Workout starten"
        title="Workout starten"
      >
        <IconPlay />
      </button>
    </div>
  )
}

/* ── Icons ────────────────────────────────────────── */
function IconPlay() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
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

function IconDumbbell() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11M6.5 17.5h11"/>
      <path d="M3 9.5h2v5H3zM19 9.5h2v5h-2z"/>
      <rect x="5" y="8" width="14" height="8" rx="1"/>
    </svg>
  )
}
