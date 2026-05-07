import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertContext';
import { Shield, Menu, X, LayoutDashboard, User, LogOut, ShieldAlert, MapPin } from 'lucide-react';

const navStyles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'rgba(10, 14, 26, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '72px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: '#f1f5f9',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
    fontSize: '1.25rem',
  },
  logoIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '10px',
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 200ms ease',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  linkActive: {
    color: '#f1f5f9',
    background: 'rgba(59, 130, 246, 0.12)',
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '9999px',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.25)',
    fontSize: '0.78rem',
    color: '#22c55e',
    fontWeight: 500,
  },
  zipBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '9999px',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.25)',
    fontSize: '0.78rem',
    color: '#38bdf8',
    fontWeight: 500,
  },
  menuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '8px',
  },
  mobileMenu: {
    position: 'fixed',
    top: '72px',
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(10, 14, 26, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 999,
  },
};

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { connected, stats } = useAlerts();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = isAuthenticated ? [
    { path: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { path: '/contacts', icon: <ShieldAlert size={18} />, label: 'Contacts' },
    { path: '/profile', icon: <User size={18} />, label: 'Profile' },
    ...(isAdmin ? [{ path: '/admin', icon: <ShieldAlert size={18} />, label: 'Admin' }] : []),
  ] : [];

  return (
    <nav style={navStyles.nav}>
      <div style={navStyles.container}>
        {/* Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} style={navStyles.logo}>
          <div style={navStyles.logoIcon}>
            <Shield size={20} color="#fff" />
          </div>
          <span>DisasterGuard</span>
        </Link>

        {/* Desktop Links */}
        <div style={navStyles.links} className="desktop-nav">
          {isAuthenticated && user?.zipCode && (
            <div style={navStyles.zipBadge}>
              <MapPin size={14} />
              ZIP: {user.zipCode}
            </div>
          )}

          {isAuthenticated && (
            <div style={navStyles.liveIndicator}>
              <span className="pulse-dot" style={{
                width: '8px',
                height: '8px',
                background: connected ? '#22c55e' : '#ef4444',
              }} />
              {connected ? 'Live' : 'Offline'}
              {stats.total > 0 && <span>({stats.total})</span>}
            </div>
          )}

          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...navStyles.link,
                ...(isActive(link.path) ? navStyles.linkActive : {}),
              }}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <button onClick={handleLogout} style={{ ...navStyles.link, color: '#f87171' }}>
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" style={{ ...navStyles.link, ...(isActive('/login') ? navStyles.linkActive : {}) }}>
                Login
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary btn-sm"
                style={{ marginLeft: '4px' }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          style={navStyles.menuBtn}
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={navStyles.mobileMenu} className="mobile-menu">
          {isAuthenticated && user?.zipCode && (
            <div style={{ ...navStyles.zipBadge, justifyContent: 'center' }}>
              <MapPin size={14} />
              ZIP: {user.zipCode}
            </div>
          )}
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...navStyles.link,
                padding: '14px 16px',
                ...(isActive(link.path) ? navStyles.linkActive : {}),
              }}
              onClick={() => setMobileOpen(false)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button onClick={handleLogout} style={{ ...navStyles.link, padding: '14px 16px', color: '#f87171' }}>
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" style={{ ...navStyles.link, padding: '14px 16px' }} onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/signup" style={{ ...navStyles.link, padding: '14px 16px' }} onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        .mobile-menu-btn { display: none; }
        a:hover, button:hover {
          color: #f1f5f9 !important;
          background: rgba(148, 163, 184, 0.08);
        }
      `}</style>
    </nav>
  );
}
