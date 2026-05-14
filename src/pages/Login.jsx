import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import styles from '../styles/Login.module.css'

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

  function reset() {
    setError(null)
    setMessage(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    reset()

    if (isSignUp) {
      const { error } = await signUp(email, password, role, fullName)
      if (error) setError(error.message)
      else setMessage('Registrierung erfolgreich! Bitte bestätige deine E-Mail.')
    } else {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
    }

    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>TT</div>
        <h1 className={styles.title}>Training Tracker</h1>
        <p className={styles.subtitle}>
          {isSignUp ? 'Konto erstellen' : 'Willkommen zurück'}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {isSignUp && (
            <input
              className={styles.input}
              type="text"
              placeholder="Name (optional)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}

          <input
            className={styles.input}
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignUp && (
            <div className={styles.roleRow}>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === 'athlete' ? styles.roleActive : ''}`}
                onClick={() => setRole('athlete')}
              >
                Athlet
              </button>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === 'trainer' ? styles.roleActive : ''}`}
                onClick={() => setRole('trainer')}
              >
                Trainer
              </button>
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.success}>{message}</p>}

          <button type="submit" disabled={loading} className={styles.submit}>
            {loading ? 'Laden...' : isSignUp ? 'Registrieren' : 'Anmelden'}
          </button>
        </form>

        <button
          type="button"
          className={styles.toggle}
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
