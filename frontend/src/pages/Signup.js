import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await API.post('/auth/signup', { name: form.name, email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      navigate('/cars');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.logoBox}>✨</div>
          <h2 style={s.title}>Create account</h2>
          <p style={s.sub}>Join Nova Ride today — it's free</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group"><label>Full Name</label><input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required /></div>
          <div className="input-group"><label>Email Address</label><input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required /></div>
          <div className="input-group"><label>Password</label><input type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required /></div>
          <div className="input-group"><label>Confirm Password</label><input type="password" name="confirm" placeholder="Re-enter password" value={form.confirm} onChange={handleChange} required /></div>
          <button type="submit" className="btn btn-primary" style={s.submitBtn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={s.switch}>Already have an account? <Link to="/login" style={s.switchLink}>Sign In</Link></p>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#f5f6fa' },
  card: { background: '#fff', border: '1px solid #e2e4ea', borderRadius: '14px', padding: '36px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' },
  header: { textAlign: 'center', marginBottom: '24px' },
  logoBox: { width: '48px', height: '48px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 14px' },
  title: { fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' },
  sub: { color: '#6b7280', fontSize: '0.88rem' },
  submitBtn: { width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', marginTop: '6px' },
  switch: { textAlign: 'center', marginTop: '18px', color: '#6b7280', fontSize: '0.88rem' },
  switchLink: { color: '#2563eb', fontWeight: 600 },
};

export default Signup;
