import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { usePageTitle } from '../../contexts/PageTitleContext'
import { useTheme } from '../../contexts/ThemeContext'
import { getProfile, updateProfile, updatePassword } from '../../lib/db'
import { getInitials } from '../../lib/utils'
import Modal from '../../components/Modal'
import { useToast } from '../../contexts/ToastContext'

export default function TrainerProfile() {
  const { user, signOut } = useAuth()
  const { clearPageTitle } = usePageTitle()
  const { mode, toggleMode } = useTheme()
  const showToast = useToast()
  const [profile, setProfile] = useState(null)

  const [showName, setShowName] = useState(false)
  const [showPhone, setShowPhone] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
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

  async function handleSavePhone() {
    setSaving(true)
    const { error } = await updateProfile(user.id, { phone: newPhone.trim() || null })
    setSaving(false)
    if (error) { showToast('Fehler: ' + error.message); return }
    setShowPhone(false)
    showToast('Telefonnummer gespeichert')
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div className="avatar" style={{ width: 48, height: 48, fontSize: 18 }}>{initials}</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--heading)' }}>{name}</div>
              <span className="trainer-badge">Trainer</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{user?.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <InfoRow label="E-Mail" value={user?.email} />
          <InfoRow label="Telefon" value={profile?.phone || '–'} />
        </div>
      </div>

      <p className="section-label">Einstellungen</p>
      <div className="card" style={{ cursor: 'default' }}>
        <div className="ex-row" style={{ cursor: 'pointer' }} onClick={() => { setNewName(profile?.full_name || ''); setShowName(true) }}>
          <div className="ex-name">Namen ändern</div>
          <IconChevron />
        </div>
        <div className="ex-row" style={{ cursor: 'pointer' }} onClick={() => { setNewPhone(profile?.phone || ''); setShowPhone(true) }}>
          <div className="ex-name">Telefonnummer ändern</div>
          <IconChevron />
        </div>
        <div className="ex-row" style={{ cursor: 'pointer' }} onClick={() => { setNewPw(''); setNewPw2(''); setPwErr(''); setShowPassword(true) }}>
          <div className="ex-name">Passwort ändern</div>
          <IconChevron />
        </div>
      </div>

      <p className="section-label">Darstellung</p>
      <div className="card" style={{ cursor: 'default' }}>
        <div className="ex-row" style={{ borderBottom: 'none' }}>
          <div className="ex-name">Dunkelmodus</div>
          <ThemeSwitch on={mode === 'dark'} onToggle={toggleMode} />
        </div>
      </div>

      <div className="divider" />
      <button className="btn btn-ghost btn-full" onClick={signOut}>Abmelden</button>

      <Modal isOpen={showName} onClose={() => setShowName(false)} title="Namen ändern">
        <div className="modal-field">
          <label>Dein Name</label>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Vor- und Nachname" maxLength={60} autoFocus />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowName(false)}>Abbrechen</button>
          <button className="btn btn-primary" disabled={saving} onClick={handleSaveName}>Speichern</button>
        </div>
      </Modal>

      <Modal isOpen={showPhone} onClose={() => setShowPhone(false)} title="Telefonnummer ändern">
        <div className="modal-field">
          <label>Telefonnummer</label>
          <input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+49 123 456789" maxLength={30} autoFocus />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => setShowPhone(false)}>Abbrechen</button>
          <button className="btn btn-primary" disabled={saving} onClick={handleSavePhone}>Speichern</button>
        </div>
      </Modal>

      <Modal isOpen={showPassword} onClose={() => setShowPassword(false)} title="Passwort ändern">
        <div className="modal-field">
          <label>Neues Passwort</label>
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Mind. 8 Zeichen" autoFocus />
        </div>
        <div className="modal-field">
          <label>Passwort bestätigen</label>
          <input type="password" value={newPw2} onChange={e => setNewPw2(e.target.value)} placeholder="Wiederholen" />
        </div>
        {pwErr && <p style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 8 }}>{pwErr}</p>}
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

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color: 'var(--text)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function ThemeSwitch({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 44, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer',
        background: on ? 'var(--accent)' : 'var(--surface-alt)',
        position: 'relative', flexShrink: 0,
        transition: 'background 0.2s',
        outline: 'none',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 20, height: 20, borderRadius: '50%',
        background: on ? 'var(--accent-ink)' : 'var(--ink-muted)',
        transition: 'left 0.2s, background 0.2s',
      }} />
    </button>
  )
}

function IconChevron() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><path d="M9 18l6-6-6-6"/></svg>
}
