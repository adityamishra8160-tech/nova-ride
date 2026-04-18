import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/cars');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.logoBox}>🚗</div>
          <h2 style={s.title}>Welcome back</h2>
          <p style={s.sub}>Sign in to your account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email address</label>
            <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary" style={s.submitBtn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

       

        <p style={s.switch}>Don't have an account? <Link to="/signup" style={s.switchLink}>Sign Up</Link></p>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#f5f6fa' },
  card: { background: '#fff', border: '1px solid #e2e4ea', borderRadius: '14px', padding: '36px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' },
  header: { textAlign: 'center', marginBottom: '24px' },
  logoBox: { width: '48px', height: '48px', background: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 14px' },
  title: { fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' },
  sub: { color: '#6b7280', fontSize: '0.88rem' },
  submitBtn: { width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', marginTop: '6px' },
  hint: { background: '#f5f6fa', border: '1px solid #e2e4ea', borderRadius: '8px', padding: '12px 14px', marginTop: '16px' },
  hintTitle: { fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.04em' },
  hintText: { fontSize: '0.8rem', color: '#6b7280' },
  switch: { textAlign: 'center', marginTop: '18px', color: '#6b7280', fontSize: '0.88rem' },
  switchLink: { color: '#2563eb', fontWeight: 600 },
};

export default Login;
