import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { usePageTitle } from '../contexts/PageTitleContext'
import s from '../styles/Layout.module.css'

const ATHLETE_TABS = [
  { to: '/plans',   label: 'Pläne',     icon: IconPlans },
  { to: '/log',     label: 'Verlauf',   icon: IconLog },
  { to: '/stats',   label: 'Statistik', icon: IconStats },
  { to: '/profile', label: 'Profil',    icon: IconProfile },
]

const TRAINER_TABS = [
  { to: '/trainer/athletes', label: 'Athletes', icon: IconProfile },
  { to: '/trainer/plans',    label: 'Pläne',    icon: IconPlans },
]

const ATHLETE_ROOT = ['/plans', '/log', '/stats', '/profile']
const TRAINER_ROOT = ['/trainer/athletes', '/trainer/plans']

const STATIC_TITLES = {
  '/plans':            'Trainingspläne',
  '/log':              'Verlauf',
  '/stats':            'Statistik',
  '/profile':          'Profil',
  '/trainer/athletes': 'Athletes',
  '/trainer/plans':    'Pläne',
}

export default function Layout() {
  const { signOut, role } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { title: ctxTitle, subtitle: ctxSub } = usePageTitle()

  const isTrainer = role === 'trainer'
  const rootTabs = isTrainer ? TRAINER_ROOT : ATHLETE_ROOT
  const navTabs  = isTrainer ? TRAINER_TABS : ATHLETE_TABS

  const isRootTab = rootTabs.includes(location.pathname)
  const staticTitle = STATIC_TITLES[location.pathname]
  const title = ctxTitle || staticTitle || 'Training Tracker'
  const subtitle = ctxSub || ''

  return (
    <div className={s.layout}>
      {/* ── Topbar ── */}
      <header className={s.topbar}>
        <div className={s.topbarLeft}>
          {!isRootTab ? (
            <button className={s.iconBtn} onClick={() => navigate(-1)} aria-label="Zurück">
              <IconBack />
            </button>
          ) : (
            <div className={s.iconBtnPlaceholder} />
          )}
        </div>

        <div className={s.topbarCenter}>
          <h1 className={s.topbarTitle}>{title}</h1>
          {subtitle && <p className={s.topbarSub}>{subtitle}</p>}
        </div>

        <div className={s.topbarRight}>
          <button className={s.iconBtn} onClick={signOut} aria-label="Abmelden">
            <IconLogout />
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className={s.content}>
        <Outlet />
      </main>

      {/* ── Bottom Navigation ── */}
      <nav className={s.bottomNav}>
        {navTabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${s.navBtn} ${isActive ? s.navBtnActive : ''}`}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

/* ── SVG Icons ───────────────────────────────────── */
function IconPlans() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  )
}

function IconLog() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

function IconStats() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )
}

function IconProfile() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  )
}

function IconLogout() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}
