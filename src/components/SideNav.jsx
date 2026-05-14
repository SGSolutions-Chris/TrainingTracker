import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getInitials } from '../lib/utils'

const ATHLETE_ITEMS = [
  { to: '/plans',   label: 'Pläne',     Icon: IconPlans },
  { to: '/weight',  label: 'Gewicht',   Icon: IconWeight },
  { to: '/log',     label: 'Verlauf',   Icon: IconLog },
  { to: '/stats',   label: 'Statistik', Icon: IconStats },
  { to: '/profile', label: 'Profil',    Icon: IconUser },
]

const TRAINER_ITEMS = [
  { to: '/trainer/athletes', label: 'Athletes', Icon: IconUsers },
  { to: '/trainer/plans',    label: 'Pläne',    Icon: IconPlans },
  { to: '/trainer/profile',  label: 'Profil',   Icon: IconUser },
]

export default function SideNav({ collapsed = false }) {
  const { role, signOut, user } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const items = role === 'trainer' ? TRAINER_ITEMS : ATHLETE_ITEMS
  const userName = user?.user_metadata?.full_name || user?.email || ''
  const initials = getInitials(userName) || '?'

  function isActive(to) {
    return pathname === to || pathname.startsWith(to + '/')
  }

  const width = collapsed ? 88 : 240

  return (
    <nav style={{
      width,
      minWidth: width,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 14px',
      height: '100svh',
      position: 'sticky',
      top: 0,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        paddingInline: 6,
        marginBottom: 24,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        {collapsed ? (
          <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>TT</span>
        ) : (
          <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            Training Tracker
          </span>
        )}
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(({ to, label, Icon }) => {
          const active = isActive(to)
          return (
            <button
              key={to}
              onClick={() => navigate(to)}
              style={{
                height: 40,
                paddingInline: 10,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? 0 : 12,
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: active ? 'var(--accent-soft)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--ink-soft)',
                fontSize: 14,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.15s, color 0.15s',
                width: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
              title={collapsed ? label : undefined}
            >
              <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <Icon active={active} />
              </span>
              {!collapsed && <span>{label}</span>}
            </button>
          )
        })}
      </div>

      {/* Footer user card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : 10,
        padding: '10px 8px',
        borderRadius: 12,
        background: 'var(--surface-alt)',
        justifyContent: collapsed ? 'center' : 'flex-start',
        overflow: 'hidden',
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'var(--accent-soft)',
          color: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {initials}
        </div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--ink)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {userName}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>
              {role}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

/* ── Icons ────────────────────────────────────── */
function IconPlans() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  )
}

function IconWeight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3"/>
      <path d="M6.5 8a2 2 0 00-1.905 1.38L2.5 17A2 2 0 004.405 19.5h15.19A2 2 0 0021.5 17l-2.095-7.62A2 2 0 0017.5 8z"/>
    </svg>
  )
}

function IconLog() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

function IconStats() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )
}
