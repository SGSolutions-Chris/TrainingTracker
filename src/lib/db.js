import { supabase } from './supabase'

// ── Plans ──────────────────────────────────────────────────────
export const getAthletePlans = (userId) =>
  supabase.from('plans')
    .select('id, name, user_id, assigned_to, created_by, units(count)')
    .or(`user_id.eq.${userId},assigned_to.eq.${userId}`)
    .order('created_at')

export const getTrainerPlans = (trainerId) =>
  supabase.from('plans')
    .select('id, name, user_id, units(count)')
    .eq('user_id', trainerId)
    .order('created_at')

export const getPlan = (planId) =>
  supabase.from('plans').select('*').eq('id', planId).single()

export const createPlan = (name, userId) =>
  supabase.from('plans').insert({ name, user_id: userId }).select().single()

export const createTrainerPlan = (name, trainerId) =>
  supabase.from('plans').insert({ name, user_id: trainerId, created_by: trainerId }).select().single()

export const createPlanForAthlete = (name, trainerId, athleteId) =>
  supabase.from('plans')
    .insert({ name, user_id: trainerId, created_by: trainerId, assigned_to: athleteId })
    .select().single()

export const deletePlan = (planId) =>
  supabase.from('plans').delete().eq('id', planId)

export const assignPlan = (planId, athleteId, trainerId) =>
  supabase.from('plans')
    .update({ assigned_to: athleteId, created_by: trainerId })
    .eq('id', planId)

export const unassignPlan = (planId, athleteId) =>
  supabase.from('plans')
    .update({ assigned_to: null })
    .eq('id', planId)
    .eq('assigned_to', athleteId)

// ── Units ──────────────────────────────────────────────────────
export const getUnits = (planId) =>
  supabase.from('units')
    .select('id, letter, name, sort_order, exercises(count)')
    .eq('plan_id', planId)
    .order('sort_order')

export const createUnit = async (planId, letter, name) => {
  const { data: existing } = await supabase.from('units')
    .select('sort_order').eq('plan_id', planId)
    .order('sort_order', { ascending: false }).limit(1)
  const sort = (existing?.[0]?.sort_order ?? -1) + 1
  return supabase.from('units').insert({ plan_id: planId, letter, name: name || null, sort_order: sort })
}

export const deleteUnit = (unitId) =>
  supabase.from('units').delete().eq('id', unitId)

// ── Exercises ──────────────────────────────────────────────────
export const getExercises = (unitId) =>
  supabase.from('exercises').select('*').eq('unit_id', unitId).order('sort_order')

export const createExercise = async (unitId, data) => {
  const { data: existing } = await supabase.from('exercises')
    .select('sort_order').eq('unit_id', unitId)
    .order('sort_order', { ascending: false }).limit(1)
  const sort = (existing?.[0]?.sort_order ?? -1) + 1
  return supabase.from('exercises').insert({ ...data, unit_id: unitId, sort_order: sort })
}

export const updateExercise = (exId, data) =>
  supabase.from('exercises').update(data).eq('id', exId)

export const deleteExercise = (exId) =>
  supabase.from('exercises').delete().eq('id', exId)

export const saveSortOrder = (table, items) =>
  Promise.all(items.map(({ id, sort_order }) =>
    supabase.from(table).update({ sort_order }).eq('id', id)
  ))

// ── Sessions ───────────────────────────────────────────────────
export const getSessions = (userId, limit = 100) =>
  supabase.from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('trained_at', { ascending: false })
    .limit(limit)

export const getSession = (sessionId) =>
  supabase.from('sessions').select('*').eq('id', sessionId).single()

export const getSessionSets = (sessionId) =>
  supabase.from('session_sets').select('*').eq('session_id', sessionId).order('set_number')

export const insertSession = (data) =>
  supabase.from('sessions').insert(data).select().single()

export const insertSessionSets = (sets) =>
  supabase.from('session_sets').insert(sets)

// ── Stats ──────────────────────────────────────────────────────
export const getStatsData = async (userId) => {
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, letter, week_number, duration_seconds, trained_at')
    .eq('user_id', userId)

  const sessionIds = (sessions || []).map(s => s.id)
  let sets = []
  if (sessionIds.length > 0) {
    const { data } = await supabase
      .from('session_sets')
      .select('exercise_name, actual_reps, kg_total, kg_per_side, done, session_id')
      .in('session_id', sessionIds)
    sets = data || []
  }
  return { sessions: sessions || [], sets }
}

// ── Profiles ───────────────────────────────────────────────────
export const getProfile = (userId) =>
  supabase.from('profiles').select('*').eq('id', userId).single()

export const updateProfile = (userId, data) =>
  supabase.from('profiles').upsert({ id: userId, ...data }).select().single()

export const updatePassword = (password) =>
  supabase.auth.updateUser({ password })

export const getAthleteTrainer = async (athleteId) => {
  const { data, error } = await supabase
    .from('trainer_athletes')
    .select('trainer_id')
    .eq('athlete_id', athleteId)
    .limit(1)
    .maybeSingle()
  if (error || !data) return { data: null, error: error || null }
  return supabase.from('profiles').select('full_name, email, phone').eq('id', data.trainer_id).maybeSingle()
}

// ── Trainer - Athletes ──────────────────────────────────────────
export const getTrainerAthletes = async (trainerId) => {
  const { data: relations, error } = await supabase
    .from('trainer_athletes').select('*').eq('trainer_id', trainerId)
  if (error) return { data: [], error }
  if (!relations?.length) return { data: [], error: null }

  const athleteIds = relations.map(r => r.athlete_id)
  const { data: profiles } = await supabase
    .from('profiles').select('id, full_name').in('id', athleteIds)

  const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]))
  return {
    data: relations.map(r => ({ ...r, profile: profileMap[r.athlete_id] || null })),
    error: null,
  }
}

export const getAthleteSessions = (athleteId, limit = 5) =>
  supabase.from('sessions')
    .select('*').eq('user_id', athleteId)
    .order('trained_at', { ascending: false }).limit(limit)

export const getAthleteAllSessions = (athleteId) =>
  supabase.from('sessions')
    .select('*').eq('user_id', athleteId)
    .order('trained_at', { ascending: false }).limit(50)

export const getAthletePlansForTrainer = (trainerId, athleteId) =>
  supabase.from('plans')
    .select('*')
    .or(`user_id.eq.${trainerId},assigned_to.eq.${athleteId}`)

export const getTrainerOwnPlans = (trainerId) =>
  supabase.from('plans').select('*').eq('user_id', trainerId).order('created_at')

export const getAssignedPlans = (athleteId) =>
  supabase.from('plans').select('id').eq('assigned_to', athleteId)

export const removeAthlete = (trainerId, athleteId) =>
  supabase.from('trainer_athletes')
    .delete().eq('trainer_id', trainerId).eq('athlete_id', athleteId)

export const inviteAthlete = async (email, password, fullName, accessToken) => {
  const res = await fetch(
    'https://sgrqyfhofhnqyqcfppdh.supabase.co/functions/v1/bright-action',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
      },
      body: JSON.stringify({ email, password, full_name: fullName }),
    }
  )
  const result = await res.json()
  if (!res.ok) throw new Error(result.error || 'Unbekannter Fehler')
  return result
}
