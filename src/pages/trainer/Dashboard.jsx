import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { usePageTitle } from '../../contexts/PageTitleContext'
import { useToast } from '../../contexts/ToastContext'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import {
  getTrainerAthletes, inviteAthlete,
  getAthleteSessions, getAthletePlansForTrainer, getProfile,
} from '../../lib/db'
import { getInitials, formatDate, formatDuration, unitBadgeClass, getWeek } from '../../lib/utils'
import Modal from '../../components/Modal'
import GlowBlob from '../../components/GlowBlob'
import { supabase } from '../../lib/supabase'

export default function TrainerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { clearPageTitle } = usePageTitle()
  const showToast = useToast()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const [athletes, setAthletes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitePw, setInvitePw] = useState('')
  const [inviteErr, setInviteErr] = useState('')
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    clearPageTitle()
    if (user) load()
  }, [user])

  async function load() {
    setLoading(true)
    const { data } = await getTrainerAthletes(user.id)
    setAthletes(data || [])
    setLoading(false)
  }

  async function handleInvite() {
    setInviteErr('')
    if (!inviteEmail || !invitePw) { setInviteErr('Bitte alle Felder ausfüllen.'); return }
    if (invitePw.length < 8) { setInviteErr('Passwort muss mindestens 8 Zeichen haben.'); return }
    setInviting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      await inviteAthlete(inviteEmail, invitePw, inviteName, session.access_token)
      setShowInvite(false)
      setInviteName(''); setInviteEmail(''); setInvitePw('')
      showToast((inviteName || inviteEmail) + ' wurde angelegt')
      load()
    } catch (e) {
      setInviteErr(e.message)
    } finally {
      setInviting(false)
    }
  }

  if (loading) return <div className="spinner-wrap" style={{ minHeight: 200 }}><div className="spinner" /></div>

  const inviteModal = (
    <Modal isOpen={showInvite} onClose={() => setShowInvite(false)} title="Athlete anlegen">
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
        Der Athlete kann sich danach mit diesen Zugangsdaten einloggen und sein Passwort ändern.
      </p>
      <div className="modal-field">
        <label>Name</label>
        <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Max Mustermann" maxLength={60} autoFocus />
      </div>
      <div className="modal-field">
        <label>E-Mail</label>
        <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="athlete@email.de" />
      </div>
      <div className="modal-field">
        <label>Initiales Passwort</label>
        <input type="password" value={invitePw} onChange={e => setInvitePw(e.target.value)} placeholder="Mind. 8 Zeichen" />
      </div>
      {inviteErr && <p className="error-text" style={{ marginBottom: 8 }}>{inviteErr}</p>}
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={() => setShowInvite(false)}>Abbrechen</button>
        <button className="btn btn-primary" disabled={inviting} onClick={handleInvite}>
          {inviting ? '...' : 'Anlegen'}
        </button>
      </div>
    </Modal>
  )

  if (isDesktop) {
    return (
      <>
        <DesktopRoster
          athletes={athletes}
          user={user}
          navigate={navigate}
          onInvite={() => setShowInvite(true)}
        />
        {inviteModal}
      </>
    )
  }

  /* ── Mobile / tablet list ── */
  return (
    <div style={{ padding: '4px 16px 16px' }}>
      <p className="section-label">Meine Athletes</p>

      {athletes.length === 0 && (
        <div className="empty">
          <div className="empty-icon">👥</div>
          <div className="empty-title">Noch keine Athletes</div>
          <div className="empty-sub">Lade deinen ersten Athlete ein</div>
        </div>
      )}

      {athletes.map(rel => {
        const name = rel.profile?.full_name || 'Unbekannt'
        const pending = !rel.accepted_at
        return (
          <div
            key={rel.athlete_id}
            className="athlete-card"
            onClick={() => navigate(`/trainer/athletes/${rel.athlete_id}`, { state: { name } })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="avatar">{getInitials(name)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--heading)' }}>{name}</div>
                <div style={{ fontSize: 12, color: pending ? 'var(--warning)' : 'var(--text-muted)', marginTop: 2 }}>
                  {pending ? 'Einladung ausstehend' : 'Aktiv'}
                </div>
              </div>
              <IconChevron />
            </div>
          </div>
        )
      })}

      <button className="btn btn-ghost btn-full" style={{ marginTop: 8 }} onClick={() => setShowInvite(true)}>
        + Athlete einladen
      </button>

      {inviteModal}
    </div>
  )
}

/* ── Desktop 2-column roster view ──────────────────── */
function DesktopRoster({ athletes, user, navigate, onInvite }) {
  const [selectedId, setSelectedId] = useState(athletes[0]?.athlete_id || null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const activeCount = athletes.filter(r => r.accepted_at).length

  useEffect(() => {
    if (selectedId) loadDetail(selectedId)
  }, [selectedId])

  async function loadDetail(athleteId) {
    setDetail(null)
    setDetailLoading(true)
    const [{ data: sessions }, { data: plans }, { data: profile }] = await Promise.all([
      getAthleteSessions(athleteId, 5),
      getAthletePlansForTrainer(user.id, athleteId),
      getProfile(athleteId),
    ])
    setDetail({
      sessions: sessions || [],
      plans: (plans || []).filter(p => p.assigned_to === athleteId),
      profile,
    })
    setDetailLoading(false)
  }

  const selectedRel = athletes.find(r => r.athlete_id === selectedId)
  const selectedName = selectedRel?.profile?.full_name || 'Unbekannt'

  const week = getWeek(new Date())

  return (
    <div style={{ padding: '28px 32px 40px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Hero band */}
      <div className="hero-card" style={{ marginBottom: 24, padding: '24px 28px', position: 'relative', overflow: 'hidden' }}>
        <GlowBlob size={380} top={-100} right={-60} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 36 }}>
          <div style={{ flex: 1 }}>
            <div className="hero-tag">ROSTER · KW {week}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--hero-ink)', letterSpacing: '-0.02em', marginTop: 4 }}>
              Athletes Übersicht
            </div>
            <div style={{ fontSize: 14, color: 'rgba(236,253,245,0.7)', marginTop: 4 }}>
              {activeCount} von {athletes.length} Athletes aktiv
            </div>
          </div>
          <div style={{ display: 'flex', gap: 40 }}>
            {[
              { label: 'Total', value: athletes.length },
              { label: 'Aktiv', value: activeCount },
              { label: 'Ausstehend', value: athletes.length - activeCount },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 10, color: 'var(--hero-accent)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</div>
                <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--hero-ink)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        {/* Roster column */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <p className="section-label" style={{ margin: 0 }}>Athletes</p>
            <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', fontWeight: 700 }}>{athletes.length}</span>
          </div>

          {athletes.length === 0 && (
            <div className="empty" style={{ padding: '24px 0' }}>
              <div className="empty-title">Noch keine Athletes</div>
            </div>
          )}

          <div style={{ display: 'grid', gap: 8 }}>
            {athletes.map(rel => {
              const name = rel.profile?.full_name || 'Unbekannt'
              const pending = !rel.accepted_at
              const selected = rel.athlete_id === selectedId
              return (
                <button
                  key={rel.athlete_id}
                  onClick={() => setSelectedId(rel.athlete_id)}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 'var(--r-md)',
                    background: selected ? 'var(--accent-soft)' : 'var(--bg-card)',
                    border: `1px solid ${selected ? 'transparent' : 'var(--border)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    textAlign: 'left',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                >
                  <div className="avatar" style={{
                    background: selected ? 'var(--accent)' : 'var(--accent-soft)',
                    color: selected ? 'var(--accent-ink)' : 'var(--accent)',
                  }}>
                    {getInitials(name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: selected ? 'var(--accent)' : 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {name}
                    </div>
                    <div style={{ fontSize: 11, color: pending ? 'var(--warning)' : 'var(--ink-muted)', marginTop: 2 }}>
                      {pending ? 'Ausstehend' : 'Aktiv'}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <button className="btn btn-ghost btn-full" style={{ marginTop: 12 }} onClick={onInvite}>
            + Athlete einladen
          </button>
        </div>

        {/* Detail panel */}
        <div>
          {!selectedId && (
            <div className="empty" style={{ paddingTop: 60 }}>
              <div className="empty-title">Athlete auswählen</div>
              <div className="empty-sub">Klicke links auf einen Athlete um Details zu sehen</div>
            </div>
          )}

          {selectedId && detailLoading && (
            <div className="spinner-wrap" style={{ minHeight: 200 }}><div className="spinner" /></div>
          )}

          {selectedId && detail && (
            <>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div className="avatar" style={{ width: 56, height: 56, fontSize: 18, flexShrink: 0 }}>
                  {getInitials(selectedName)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--heading)', letterSpacing: '-0.02em' }}>
                    {selectedName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                    {detail.profile?.email || ''}
                    {detail.profile?.phone ? ` · ${detail.profile.phone}` : ''}
                  </div>
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate(`/trainer/athletes/${selectedId}`, { state: { name: selectedName } })}
                >
                  Vollständiges Profil →
                </button>
              </div>

              {/* Stats strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Letzte Sessions', value: detail.sessions.length },
                  { label: 'Aktive Pläne', value: detail.plans.length },
                  { label: 'Status', value: selectedRel?.accepted_at ? 'Aktiv' : 'Ausstehend' },
                ].map((s, i) => (
                  <div key={i} className="stat-box">
                    <div className="stat-val" style={{ fontSize: i === 2 ? 14 : 28 }}>{s.value}</div>
                    <div className="stat-lbl">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Plans */}
              <p className="section-label">Zugewiesene Pläne</p>
              {detail.plans.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>Noch keine Pläne zugewiesen</p>
              )}
              {detail.plans.map(p => (
                <div key={p.id} className="card" style={{ cursor: 'default', marginBottom: 8 }}>
                  <div className="card-row">
                    <div className="card-title">{p.name}</div>
                  </div>
                </div>
              ))}

              {/* Recent sessions */}
              <p className="section-label">Letzte Sessions</p>
              {detail.sessions.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Noch keine Sessions</p>
              )}
              {detail.sessions.map(sess => {
                const dur = sess.duration_seconds ? ` · ${formatDuration(sess.duration_seconds)}` : ''
                return (
                  <div
                    key={sess.id}
                    className="log-item"
                    onClick={() => navigate(`/trainer/athletes/${selectedId}/log/${sess.id}`, { state: { session: sess } })}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{sess.plan_name}</span>
                    </div>
                    <div className="log-meta">{formatDate(sess.trained_at)}{dur}</div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function IconChevron() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', flexShrink: 0 }}><path d="M9 18l6-6-6-6"/></svg>
}
