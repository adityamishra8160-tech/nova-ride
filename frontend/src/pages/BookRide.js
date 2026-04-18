import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

const BookRide = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [form, setForm] = useState({ pickup: '', drop: '', date: '', distance: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/cars/${carId}`)
      .then((r) => setCar(r.data))
      .catch(() => setError('Car not found'))
      .finally(() => setLoading(false));
  }, [carId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const amount = car && form.distance ? car.pricePerKm * parseFloat(form.distance) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.distance || parseFloat(form.distance) <= 0) return setError('Enter a valid distance');
    setSubmitting(true);
    try {
      const res = await API.post('/bookings', { carId, ...form, distance: parseFloat(form.distance), amount });
      navigate(`/payment/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!car) return <div className="container" style={{ padding: '40px 0' }}><div className="alert alert-error">Car not found.</div></div>;

  return (
    <div style={s.page}>
      <div className="container" style={s.inner}>
        {/* Left */}
        <div style={s.left}>
          <img src={car.image} alt={car.name} style={s.carImg} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'; }} />
          <div style={s.carInfo}>
            <span style={s.catTag}>{car.category}</span>
            <h2 style={s.carName}>{car.name}</h2>
            <p style={s.carRate}>₹{car.pricePerKm} <span style={{ fontWeight: 400, fontSize: '0.9rem', color: '#6b7280' }}>per km</span></p>
          </div>
          {form.distance && (
            <div style={s.summary}>
              <div style={s.sumRow}><span>Distance</span><span>{form.distance} km</span></div>
              <div style={s.sumRow}><span>Rate</span><span>₹{car.pricePerKm}/km</span></div>
              <div style={s.sumDivider} />
              <div style={{ ...s.sumRow, fontWeight: 700, color: '#111827' }}>
                <span>Total Fare</span>
                <span style={{ color: '#2563eb', fontSize: '1.2rem' }}>₹{amount.toFixed(0)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right */}
        <div style={s.formCard}>
          <h2 style={s.formTitle}>Book this car</h2>
          <p style={s.formSub}>Fill in your ride details below</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group"><label>Pickup Location</label><input name="pickup" placeholder="e.g. Ahmedabad Railway Station" value={form.pickup} onChange={handleChange} required /></div>
            <div className="input-group"><label>Drop Location</label><input name="drop" placeholder="e.g. Gandhinagar Bus Stand" value={form.drop} onChange={handleChange} required /></div>
            <div style={s.twoCol}>
              <div className="input-group"><label>Date</label><input type="date" name="date" value={form.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required /></div>
              <div className="input-group"><label>Distance (km)</label><input type="number" name="distance" placeholder="e.g. 25" value={form.distance} onChange={handleChange} min="1" step="0.5" required /></div>
            </div>
            <button type="submit" className="btn btn-primary" style={s.submitBtn} disabled={submitting}>
              {submitting ? 'Confirming...' : `Confirm Booking${amount ? ` — ₹${amount.toFixed(0)}` : ''}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { padding: '40px 0 72px', minHeight: 'calc(100vh - 64px)', background: '#f5f6fa' },
  inner: { display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '28px', alignItems: 'start' },
  left: { position: 'sticky', top: '80px' },
  carImg: { width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  carInfo: { marginBottom: '16px' },
  catTag: { background: '#eff6ff', color: '#2563eb', fontSize: '0.7rem', fontWeight: 700, padding: '3px 9px', borderRadius: '5px', textTransform: 'uppercase', letterSpacing: '0.04em', border: '1px solid #bfdbfe' },
  carName: { fontSize: '1.5rem', fontWeight: 800, marginTop: '10px', marginBottom: '4px' },
  carRate: { fontSize: '1.4rem', fontWeight: 800, color: '#2563eb' },
  summary: { background: '#fff', border: '1px solid #e2e4ea', borderRadius: '10px', padding: '16px' },
  sumRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.87rem', color: '#6b7280', marginBottom: '8px' },
  sumDivider: { height: '1px', background: '#e2e4ea', margin: '10px 0' },
  formCard: { background: '#fff', border: '1px solid #e2e4ea', borderRadius: '14px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' },
  formTitle: { fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' },
  formSub: { color: '#6b7280', fontSize: '0.88rem', marginBottom: '22px' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  submitBtn: { width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.95rem', marginTop: '6px' },
};

export default BookRide;
