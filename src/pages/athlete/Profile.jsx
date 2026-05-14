import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { usePageTitle } from '../../contexts/PageTitleContext'
import { getProfile, updateProfile, updatePassword } from '../../lib/db'
import { getInitials } from '../../lib/utils'
import Modal from '../../components/Modal'
import { useToast } from '../../contexts/ToastContext'

export default function Profile() {
  const { user, signOut } = useAuth()
  const { clearPageTitle } = usePageTitle()
  const showToast = useToast()
  const [profile, setProfile] = useState(null)

  // Modals
  const [showName, setShowName] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPw, setNewPw] = useState('')
  const [newPw2, setNewPw2] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    clearPageTitle()
    if (user) load()
  }, [user])

  async function load() {
    const { data } = await getProfile(user.id)
    setProfile(data)
  }

  async function handleSaveName() {
    if (!newName.trim()) return
    setSaving(true)
    const { error } = await updateProfile(user.id, { full_name: newName.trim() })
    setSaving(false)
    if (error) { showToast('Fehler: ' + error.message); return }
    setShowName(false)
    showToast('Name geändert')
    load()
  }

  async function handleSavePassword() {
    setPwErr('')
    if (newPw.length < 8) { setPwErr('Mindestens 8 Zeichen.'); return }
    if (newPw !== newPw2) { setPwErr('Passwörter stimmen nicht überein.'); return }
    setSaving(true)
    const { error } = await updatePassword(newPw)
    setSaving(false)
    if (error) { setPwErr(error.message); return }
    setShowPassword(false)
    setNewPw(''); setNewPw2('')
    showToast('Passwort geändert ✓')
  }

  const name = profile?.full_name || '–'
  const initials = getInitials(name)

  return (
    <div style={{ padding: '4px 16px 16px' }}>
      <p className="section-label">Mein Profil</p>
      <div className="card" style={{ cursor: 'default', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="avatar" style={{ width: 48, height: 48, fontSize: 18 }}>{initials}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--heading)' }}>{name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{user?.email}</div>
          </div>
        </div>
      </div>

      <p className="section-label">Einstellungen</p>
      <div className="card" style={{ cursor: 'default' }}>
        <div className="ex-row" style={{ cursor: 'pointer' }} onClick={() => { setNewName(profile?.full_name || ''); setShowName(true) }}>
          <div className="ex-name">Name ändern</div>
          <IconChevron />
        </div>
        <div className="ex-row" style={{ cursor: 'pointer' }} onClick={() => { setNewPw(''); setNewPw2(''); setPwErr(''); setShowPassword(true) }}>
          <div className="ex-name">Passwort ändern</div>
          <IconChevron />
        </div>
      </div>

      <div className="divider" />
      <button className="btn btn-ghost btn-full" onClick={signOut}>Abmelden</button>

      {/* Change name */}
      <Modal isOpen={showName} onClose={() => setShowName(false)} title="Name ändern">
        <div className="modal-field">
          <label>Dein Name</label>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Vor- und Nachname" maxLength={60} autoFocus />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowName(false)}>Abbrechen</button>
          <button className="btn btn-primary" disabled={saving} onClick={handleSaveName}>Speichern</button>
        </div>
      </Modal>

      {/* Change password */}
      <Modal isOpen={showPassword} onClose={() => setShowPassword(false)} title="Passwort ändern">
        <div className="modal-field">
          <label>Neues Passwort</label>
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Mind. 8 Zeichen" autoFocus />
        </div>
        <div className="modal-field">
          <label>Passwort bestätigen</label>
          <input type="password" value={newPw2} onChange={e => setNewPw2(e.target.value)} placeholder="Wiederholen" />
        </div>
        {pwErr && <p className="error-text" style={{ marginBottom: 8 }}>{pwErr}</p>}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowPassword(false)}>Abbrechen</button>
          <button className="btn btn-primary" disabled={saving} onClick={handleSavePassword}>
            {saving ? '...' : 'Speichern'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

function IconChevron() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><path d="M9 18l6-6-6-6"/></svg>
}
