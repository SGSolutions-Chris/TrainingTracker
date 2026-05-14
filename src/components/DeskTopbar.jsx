import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

export default function DeskTopbar() {
  const { mode, toggleMode } = useTheme()
  const { role, signOut } = useAuth()

  return (
    <div style={{
      height: 60,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 24px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
      flexShrink: 0,
    }}>
      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        paddingInline: 12,
        height: 36,
        borderRadius: 10,
        background: 'var(--surface-alt)',
        width: 300,
        flexShrink: 0,
      }}>
        <IconSearch />
        <input
          placeholder={role === 'trainer' ? 'Suche Athletes, Pläne…' : 'Suche Pläne, Übungen…'}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: 'var(--ink)',
            fontFamily: 'var(--font)',
            fontSize: 13,
            minWidth: 0,
          }}
        />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          padding: '2px 6px',
          background: 'var(--surface)',
          borderRadius: 4,
          border: '1px solid var(--border)',
          color: 'var(--ink-muted)',
          flexShrink: 0,
        }}>⌘K</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Dark / light mode toggle */}
      <button
        onClick={toggleMode}
        aria-label="Farbschema wechseln"
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'var(--surface-alt)',
          color: 'var(--ink)',
          display: 'grid',
          placeItems: 'center',
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {mode === 'dark' ? <IconSun /> : <IconMoon />}
      </button>

      {/* Notifications */}
      <button
        aria-label="Benachrichtigungen"
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'var(--surface-alt)',
          color: 'var(--ink)',
          display: 'grid',
          placeItems: 'center',
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <IconBell />
      </button>

      {/* Sign out */}
      <button
        onClick={signOut}
        style={{
          height: 36,
          paddingInline: 14,
          borderRadius: 10,
          background: 'transparent',
          color: 'var(--ink-muted)',
          border: '1px solid var(--border)',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'var(--font)',
          flexShrink: 0,
        }}
      >
        Abmelden
      </button>
    </div>
  )
}

/* ── Icons ────────────────────────────────────── */
function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

function IconSun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  )
}
