import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { usePageTitle } from '../../contexts/PageTitleContext'
import { useToast } from '../../contexts/ToastContext'
import { getTrainerAthletes, inviteAthlete } from '../../lib/db'
import { getInitials } from '../../lib/utils'
import Modal from '../../components/Modal'
import { supabase } from '../../lib/supabase'
import s from '../../styles/Trainer.module.css'

export default function TrainerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { clearPageTitle } = usePageTitle()
  const showToast = useToast()

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
    </div>
  )
}

function IconChevron() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', flexShrink: 0 }}><path d="M9 18l6-6-6-6"/></svg>
}
