export function getWeek(d) {
  const jan1 = new Date(d.getFullYear(), 0, 1)
  return Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7)
}

export function formatDate(ds) {
  const d = new Date(ds + 'T12:00:00')
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDuration(secs) {
  if (!secs) return '–'
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${h}h ${m}min ${s}sek`
  if (m > 0) return `${m}min ${s}sek`
  return `${s}sek`
}

export function repsLabel(targetReps, unit) {
  if (targetReps === 0) return 'AMRAP'
  const unitMap = { reps: 'Wdh.', seconds: 'Sek.', minutes: 'Min.' }
  return `${targetReps} ${unitMap[unit] || 'Wdh.'}`
}

export function unitBadgeClass(index) {
  return `bc${index % 8}`
}

export function getInitials(name) {
  if (!name || name === '–') return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export function calcKgTotal(kgSide, equipment) {
  if (equipment === 'dumbbell' && kgSide) {
    const v = parseFloat(kgSide)
    return v > 0 ? (v * 2).toFixed(1).replace(/\.0$/, '') : ''
  }
  return ''
}

export const EQUIP_LABELS = {
  dumbbell: 'Kurzhantel / Kabelzug',
  barbell: 'Langhantel / Maschine',
  bodyweight: 'Körpergewicht',
}
