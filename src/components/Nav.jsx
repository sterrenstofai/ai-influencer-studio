import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth'

const links = [
  { to: '/influencers', label: 'Influencers' },
  { to: '/inspiration', label: 'Inspiratie' },
  { to: '/brand-deals', label: 'Brand Deals' },
  { to: '/pricing',     label: 'Prijzen' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const { session } = useAuth()

  return (
    <nav className="nav-root" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: 'var(--nav-h)',
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      zIndex: 100,
      gap: 0,
    }}>
      {/* Logo */}
      <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginRight: 'auto' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E8152A', flexShrink: 0 }} />
        <span className="nav-brand-label" style={{
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-primary)',
        }}>
          AI Influencer Studio
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600, marginLeft: 4 }}>
          door Sterrenstof
        </span>
      </NavLink>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, height: '100%' }}>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className="nav-link" style={({ isActive }) => ({
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: isActive ? '#E8152A' : 'var(--text-secondary)',
            borderBottom: isActive ? '2px solid #E8152A' : '2px solid transparent',
            transition: 'color 0.12s, border-color 0.12s',
            textDecoration: 'none',
          })}>
            {l.label}
          </NavLink>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16 }}>
        {session ? (
          <>
            <NavLink to="/create" style={({ isActive }) => ({
              padding: '7px 16px',
              background: isActive ? '#111' : '#E8152A',
              color: '#fff',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'background 0.12s',
            })}>
              + Creëren
            </NavLink>
            <NavLink to="/settings" title="Instellingen" style={({ isActive }) => ({
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              textDecoration: 'none',
            })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Inloggen
            </NavLink>
            <NavLink to="/register" style={{
              padding: '7px 16px',
              background: '#E8152A',
              color: '#fff',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}>
              Starten →
            </NavLink>
          </>
        )}
      </div>
    </nav>
  )
}
