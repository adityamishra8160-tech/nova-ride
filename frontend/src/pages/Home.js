import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    { icon: '🚗', title: 'Big Fleet', desc: '15+ cars — sedans, SUVs, luxury and electric vehicles to choose from.' },
    { icon: '📍', title: 'Easy Booking', desc: 'Enter pickup, drop and date. Done in under a minute.' },
    { icon: '💳', title: 'Multiple Payments', desc: 'Pay by card, UPI, or cash — whatever works for you.' },
    { icon: '📋', title: 'Ride History', desc: 'All your past bookings and payment status in one place.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={s.hero}>
        <div className="container" style={s.heroInner}>
          <div style={s.heroLeft}>
            <div style={s.pill}>🇮🇳 &nbsp;Made for India</div>
            <h1 style={s.heroTitle}>Book a Ride,<br />Go Anywhere</h1>
            <p style={s.heroSub}>
              Simple car booking with transparent pricing. Choose your car, set your route, and go.
            </p>
            <div style={s.heroBtns}>
              <Link to="/cars" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
                See All Cars →
              </Link>
              {!user && (
                <Link to="/signup" className="btn btn-outline" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
                  Create Account
                </Link>
              )}
              {user && user.role !== 'admin' && (
                <Link to="/my-bookings" className="btn btn-outline" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
                  My Bookings
                </Link>
              )}
            </div>

            {/* Stats row */}
            <div style={s.statsRow}>
              {[['15+', 'Cars'], ['3', 'Payment Modes'], ['24/7', 'Support']].map(([v, l]) => (
                <div key={l} style={s.statItem}>
                  <span style={s.statVal}>{v}</span>
                  <span style={s.statLbl}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={s.heroRight}>
            <img
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=700&q=85"
              alt="Car"
              style={s.heroImg}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=700&q=80'; }}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={s.featSec}>
        <div className="container">
          <h2 style={s.secTitle}>Why use Nova Ride?</h2>
          <p style={s.secSub}>Fast, simple, and reliable car booking</p>
          <div style={s.featGrid}>
            {features.map((f) => (
              <div key={f.title} style={s.featCard}>
                <div style={s.featIcon}>{f.icon}</div>
                <h3 style={s.featTitle}>{f.title}</h3>
                <p style={s.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={s.cta}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.9rem', marginBottom: '10px' }}>Ready to book?</h2>
          <p style={{ color: '#6b7280', marginBottom: '28px' }}>Browse our fleet and book your ride in minutes.</p>
          <Link to="/cars" className="btn btn-primary" style={{ padding: '13px 32px', fontSize: '0.95rem' }}>
            Browse All Cars →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <div className="container" style={s.footerInner}>
          <span style={s.footerLogo}>🚗 Nova Ride Easily</span>
          <span style={{ color: '#9ca3af', fontSize: '0.83rem' }}>© 2026 Nova Ride. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

const s = {
  hero: { background: '#fff', borderBottom: '1px solid #e2e4ea', padding: '60px 0 0' },
  heroInner: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', paddingBottom: '60px' },
  heroLeft: {},
  pill: { display: 'inline-block', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '5px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '20px' },
  heroTitle: { fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#111827', lineHeight: 1.15, marginBottom: '16px' },
  heroSub: { fontSize: '1rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '28px', maxWidth: '420px' },
  heroBtns: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '36px' },
  statsRow: { display: 'flex', gap: '28px' },
  statItem: { display: 'flex', flexDirection: 'column', gap: '2px' },
  statVal: { fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' },
  statLbl: { fontSize: '0.78rem', color: '#6b7280', fontWeight: 500 },
  heroRight: { borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' },
  heroImg: { width: '100%', height: '340px', objectFit: 'cover', display: 'block' },
  featSec: { padding: '64px 0' },
  secTitle: { fontSize: '1.9rem', fontWeight: 800, textAlign: 'center', marginBottom: '8px' },
  secSub: { color: '#6b7280', textAlign: 'center', marginBottom: '40px' },
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  featCard: { background: '#fff', border: '1px solid #e2e4ea', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' },
  featIcon: { fontSize: '1.7rem', marginBottom: '12px' },
  featTitle: { fontSize: '1rem', fontWeight: 700, marginBottom: '6px' },
  featDesc: { fontSize: '0.87rem', color: '#6b7280', lineHeight: 1.6 },
  cta: { background: '#eff6ff', borderTop: '1px solid #bfdbfe', borderBottom: '1px solid #bfdbfe', padding: '64px 0' },
  footer: { padding: '22px 0', borderTop: '1px solid #e2e4ea', background: '#fff' },
  footerInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
  footerLogo: { fontWeight: 700, color: '#111827', fontSize: '0.95rem' },
};

export default Home;
