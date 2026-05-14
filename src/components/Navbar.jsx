import { NavLink } from 'react-router-dom'
import styles from '../styles/Navbar.module.css'

const links = [
  { to: '/plans', label: 'Pläne' },
  { to: '/log', label: 'Log' },
  { to: '/stats', label: 'Stats' },
  { to: '/profile', label: 'Profil' },
]

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
