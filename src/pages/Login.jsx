import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import s from '../styles/Login.module.css'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('athlete')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  function reset() { setError(null); setMessage(null) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    reset()
    if (isSignUp) {
      const { error } = await signUp(email, password, role, fullName)
      if (error) setError(error.message)
      else setMessage('Registrierung erfolgreich. Bitte bestätige deine E-Mail.')
    } else {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
    }
    setLoading(false)
  }

  return (
    <div className={s.page}>
      {/* Dark hero panel */}
      <div className={s.hero}>
        <div className={s.glowBlob} />
        <div className={s.logoRow}>
          <div className={s.logoTile}>
            <IconDumbbell />
          </div>
          <span className={s.wordmark}>Trecker</span>
        </div>
        <p className={s.tagline}>Train.</p>
        <p className={s.tagline}>Log.</p>
        <p className={s.tagline}>Repeat.</p>
      </div>

      {/* Auth card — overlaps the hero boundary */}
      <div className={s.card}>
        <h2 className={s.cardTitle}>
          {isSignUp ? 'Konto erstellen' : 'Willkommen zurück'}
        </h2>

        <form onSubmit={handleSubmit} className={s.form}>
          {isSignUp && (
            <input
              className={s.input}
              type="text"
              placeholder="Name (optional)"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          )}

          <input
            className={s.input}
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            className={s.input}
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {isSignUp && (
            <div className={s.roleRow}>
              <button
                type="button"
                className={`${s.roleBtn} ${role === 'athlete' ? s.roleActive : ''}`}
                onClick={() => setRole('athlete')}
              >
                Athlet
              </button>
              <button
                type="button"
                className={`${s.roleBtn} ${role === 'trainer' ? s.roleActive : ''}`}
                onClick={() => setRole('trainer')}
              >
                Trainer
              </button>
            </div>
          )}

          {error && <p className={s.error}>{error}</p>}
          {message && <p className={s.success}>{message}</p>}

          <button type="submit" disabled={loading} className={s.submit}>
            {loading ? 'Laden...' : isSignUp ? 'Registrieren' : 'Anmelden'}
          </button>
        </form>

        <button
          type="button"
          className={s.toggle}
          onClick={() => { setIsSignUp(!isSignUp); reset() }}
        >
          {isSignUp
            ? 'Bereits ein Konto? Anmelden'
            : 'Noch kein Konto? Registrieren'}
        </button>
      </div>
    </div>
  )
}

function IconDumbbell() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11M6.5 17.5h11"/>
      <path d="M3 9.5h2v5H3zM19 9.5h2v5h-2z"/>
      <rect x="5" y="8" width="14" height="8" rx="1"/>
    </svg>
  )
}
