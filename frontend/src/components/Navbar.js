import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        <Link to="/" style={s.logo}>
          <div style={s.logoIcon}>🚗</div>
          <span>Nova<span style={s.logoBlue}>Ride</span></span>
        </Link>

        <div style={s.links}>
          <Link to="/cars" style={{ ...s.link, ...(isActive('/cars') ? s.linkActive : {}) }}>Browse Cars</Link>
          {user && user.role !== 'admin' && (
            <Link to="/my-bookings" style={{ ...s.link, ...(isActive('/my-bookings') ? s.linkActive : {}) }}>My Bookings</Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/admin" style={{ ...s.link, ...(isActive('/admin') ? s.linkActive : {}) }}>Admin Panel</Link>
          )}
        </div>

        <div style={s.auth}>
          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline" style={s.smallBtn}>Login</Link>
              <Link to="/signup" className="btn btn-primary" style={s.smallBtn}>Sign Up</Link>
            </>
          ) : (
            <div style={s.userRow}>
              <div style={s.avatar}>{user.name[0].toUpperCase()}</div>
              <span style={s.userName}>{user.name.split(' ')[0]}</span>
              {user.role === 'admin' && <span style={s.adminTag}>Admin</span>}
              <button onClick={handleLogout} className="btn btn-outline" style={s.smallBtn}>Logout</button>
            </div>
          )}
        </div>

        <button style={s.ham} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div style={s.mobile}>
          <Link to="/cars" style={s.mLink} onClick={() => setMenuOpen(false)}>Browse Cars</Link>
          {user && user.role !== 'admin' && <Link to="/my-bookings" style={s.mLink} onClick={() => setMenuOpen(false)}>My Bookings</Link>}
          {user && user.role === 'admin' && <Link to="/admin" style={s.mLink} onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
          {!user ? (
            <>
              <Link to="/login" style={s.mLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" style={s.mLink} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout} style={{ ...s.mLink, border: 'none', background: 'none', textAlign: 'left', width: '100%' }}>Logout</button>
          )}
        </div>
      )}
    </nav>
  );
};

const s = {
  nav: { background: '#fff', borderBottom: '1px solid #e2e4ea', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  inner: { maxWidth: '1160px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', gap: '20px' },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.25rem', color: '#111827', textDecoration: 'none', flexShrink: 0 },
  logoIcon: { width: '32px', height: '32px', background: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' },
  logoBlue: { color: '#2563eb' },
  links: { display: 'flex', alignItems: 'center', gap: '2px', flex: 1 },
  link: { padding: '6px 14px', borderRadius: '7px', fontSize: '0.88rem', color: '#6b7280', fontWeight: 500, transition: 'all 0.15s' },
  linkActive: { color: '#2563eb', background: '#eff6ff', fontWeight: 600 },
  auth: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  smallBtn: { padding: '7px 16px', fontSize: '0.85rem' },
  userRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  avatar: { width: '30px', height: '30px', background: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 700 },
  userName: { fontSize: '0.88rem', color: '#374151', fontWeight: 500 },
  adminTag: { background: '#eff6ff', color: '#2563eb', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', border: '1px solid #bfdbfe' },
  ham: { display: 'none', background: 'none', border: 'none', fontSize: '1.2rem', color: '#374151' },
  mobile: { borderTop: '1px solid #e2e4ea', padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: '2px', background: '#fff' },
  mLink: { padding: '10px 12px', borderRadius: '7px', color: '#374151', fontSize: '0.93rem', display: 'block' },
};

export default Navbar;
