import React, { useState, useEffect } from 'react';
import API from '../api';

const TABS = ['Cars', 'Add Car', 'Users', 'Bookings'];

const AdminPanel = () => {
  const [tab, setTab] = useState('Cars');
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [newCar, setNewCar] = useState({ name: '', pricePerKm: '', image: '', category: 'Sedan', availability: true });

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type: '', text: '' }), 3000); };

  const fetchCars = async () => { setLoading(true); try { const r = await API.get('/cars'); setCars(r.data); } catch {} setLoading(false); };
  const fetchUsers = async () => { setLoading(true); try { const r = await API.get('/admin/users'); setUsers(r.data); } catch {} setLoading(false); };
  const fetchBookings = async () => { setLoading(true); try { const r = await API.get('/admin/bookings'); setBookings(r.data); } catch {} setLoading(false); };

  useEffect(() => {
    if (tab === 'Cars' || tab === 'Add Car') fetchCars();
    if (tab === 'Users') fetchUsers();
    if (tab === 'Bookings') fetchBookings();
  }, [tab]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this car?')) return;
    try { await API.delete(`/cars/${id}`); showMsg('success', 'Car deleted'); fetchCars(); }
    catch { showMsg('error', 'Delete failed'); }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      await API.post('/cars', { ...newCar, pricePerKm: parseFloat(newCar.pricePerKm) });
      showMsg('success', `${newCar.name} added!`);
      setNewCar({ name: '', pricePerKm: '', image: '', category: 'Sedan', availability: true });
      fetchCars();
    } catch (err) { showMsg('error', err.response?.data?.message || 'Failed to add car'); }
  };

  const revenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.amount, 0);

  return (
    <div style={s.page}>
      <div className="container">
        <div style={s.header}>
          <div><h1 style={s.title}>Admin Dashboard</h1><p style={s.sub}>Manage your fleet and monitor activity</p></div>
          <span style={s.adminTag}>Admin</span>
        </div>

        {/* Stats */}
        <div style={s.statsGrid}>
          {[['🚗', 'Cars', cars.length], ['👥', 'Users', users.length], ['📋', 'Bookings', bookings.length], ['💰', 'Revenue', `₹${revenue.toLocaleString()}`]].map(([icon, label, val]) => (
            <div key={label} style={s.statCard}>
              <div style={s.statIcon}>{icon}</div>
              <div><div style={s.statVal}>{val}</div><div style={s.statLbl}>{label}</div></div>
            </div>
          ))}
        </div>

        {msg.text && <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>{msg.text}</div>}

        {/* Tabs */}
        <div style={s.tabs}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}>{t}</button>
          ))}
        </div>

        {/* CARS */}
        {tab === 'Cars' && (
          <>
            <h2 style={s.secTitle}>All Cars ({cars.length})</h2>
            {loading ? <div className="loading-center"><div className="spinner" /></div> : (
              <div style={s.carsGrid}>
                {cars.map((car) => (
                  <div key={car._id} style={s.carCard}>
                    <img src={car.image} alt={car.name} style={s.carImg} onError={(e) => { e.target.src='https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80'; }} />
                    <div style={s.carBody}>
                      <span style={s.carCat}>{car.category}</span>
                      <h4 style={s.carName}>{car.name}</h4>
                      <p style={s.carPrice}>₹{car.pricePerKm}/km</p>
                      <div style={s.carFoot}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: car.availability ? '#16a34a' : '#dc2626' }}>
                          {car.availability ? '● Available' : '● Unavailable'}
                        </span>
                        <button onClick={() => handleDelete(car._id)} className="btn btn-danger" style={{ padding: '5px 12px', fontSize: '0.78rem' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ADD CAR */}
        {tab === 'Add Car' && (
          <div style={{ maxWidth: '640px' }}>
            <h2 style={s.secTitle}>Add New Car</h2>
            <div style={s.formCard}>
              <form onSubmit={handleAddCar}>
                <div style={s.twoCol}>
                  <div className="input-group"><label>Car Name</label><input placeholder="e.g. Toyota Camry" value={newCar.name} onChange={(e) => setNewCar({ ...newCar, name: e.target.value })} required /></div>
                  <div className="input-group"><label>Price per KM (₹)</label><input type="number" placeholder="e.g. 15" value={newCar.pricePerKm} onChange={(e) => setNewCar({ ...newCar, pricePerKm: e.target.value })} min="1" required /></div>
                </div>
                <div className="input-group"><label>Image URL</label><input placeholder="https://images.unsplash.com/..." value={newCar.image} onChange={(e) => setNewCar({ ...newCar, image: e.target.value })} required /></div>
                <div style={s.twoCol}>
                  <div className="input-group">
                    <label>Category</label>
                    <select value={newCar.category} onChange={(e) => setNewCar({ ...newCar, category: e.target.value })}>
                      {['Sedan','SUV','Luxury','Electric','Sports','Hatchback'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Availability</label>
                    <select value={newCar.availability} onChange={(e) => setNewCar({ ...newCar, availability: e.target.value === 'true' })}>
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                  </div>
                </div>
                {newCar.image && (
                  <div style={s.preview}>
                    <p style={s.previewLbl}>Preview</p>
                    <img src={newCar.image} alt="preview" style={s.previewImg} onError={(e) => { e.target.style.opacity=0.3; }} />
                  </div>
                )}
                <button type="submit" className="btn btn-primary" style={{ padding: '11px 24px' }}>Add Car</button>
              </form>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'Users' && (
          <>
            <h2 style={s.secTitle}>All Users ({users.length})</h2>
            {loading ? <div className="loading-center"><div className="spinner" /></div> : (
              <div style={s.tableWrap}>
                <table style={s.table}>
                  <thead><tr style={s.thead}><th style={s.th}>#</th><th style={s.th}>Name</th><th style={s.th}>Email</th><th style={s.th}>Joined</th></tr></thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id} style={s.tr}>
                        <td style={s.td}>{i + 1}</td>
                        <td style={s.td}><strong>{u.name}</strong></td>
                        <td style={s.td}>{u.email}</td>
                        <td style={s.td}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <p style={s.empty}>No users registered yet.</p>}
              </div>
            )}
          </>
        )}

        {/* BOOKINGS */}
        {tab === 'Bookings' && (
          <>
            <h2 style={s.secTitle}>All Bookings ({bookings.length})</h2>
            {loading ? <div className="loading-center"><div className="spinner" /></div> : (
              <div style={s.tableWrap}>
                <table style={s.table}>
                  <thead>
                    <tr style={s.thead}>
                      {['User','Car','Pickup','Drop','Date','Amount','Status'].map(h => <th key={h} style={s.th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <tr key={b._id} style={s.tr}>
                        <td style={s.td}>{b.userId?.name || 'N/A'}</td>
                        <td style={s.td}>{b.carId?.name || 'N/A'}</td>
                        <td style={s.td}>{b.pickup}</td>
                        <td style={s.td}>{b.drop}</td>
                        <td style={s.td}>{b.date}</td>
                        <td style={s.td}><strong>₹{b.amount}</strong></td>
                        <td style={s.td}><span className={`badge ${b.paymentStatus === 'paid' ? 'badge-paid' : 'badge-pending'}`}>{b.paymentStatus}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookings.length === 0 && <p style={s.empty}>No bookings yet.</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const s = {
  page: { padding: '40px 0 72px', minHeight: 'calc(100vh - 64px)', background: '#f5f6fa' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' },
  title: { fontSize: '2rem', fontWeight: 800, marginBottom: '4px' },
  sub: { color: '#6b7280' },
  adminTag: { background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 14px', borderRadius: '7px', fontSize: '0.82rem', fontWeight: 700 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px,1fr))', gap: '14px', marginBottom: '28px' },
  statCard: { background: '#fff', border: '1px solid #e2e4ea', borderRadius: '12px', padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' },
  statIcon: { fontSize: '1.7rem' },
  statVal: { fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' },
  statLbl: { fontSize: '0.78rem', color: '#6b7280', fontWeight: 500 },
  tabs: { display: 'flex', gap: '6px', marginBottom: '22px', flexWrap: 'wrap' },
  tab: { padding: '9px 18px', borderRadius: '8px', border: '1px solid #e2e4ea', background: '#fff', color: '#6b7280', fontSize: '0.87rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' },
  tabActive: { background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontWeight: 600 },
  secTitle: { fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' },
  carsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' },
  carCard: { background: '#fff', border: '1px solid #e2e4ea', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' },
  carImg: { width: '100%', height: '130px', objectFit: 'cover' },
  carBody: { padding: '12px' },
  carCat: { fontSize: '0.67rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' },
  carName: { fontSize: '0.92rem', fontWeight: 700, margin: '4px 0' },
  carPrice: { color: '#6b7280', fontSize: '0.82rem', marginBottom: '10px' },
  carFoot: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  formCard: { background: '#fff', border: '1px solid #e2e4ea', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  preview: { marginBottom: '16px' },
  previewLbl: { fontSize: '0.78rem', color: '#6b7280', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' },
  previewImg: { width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e4ea' },
  tableWrap: { overflowX: 'auto', background: '#fff', border: '1px solid #e2e4ea', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' },
  thead: { background: '#f5f6fa', borderBottom: '1px solid #e2e4ea' },
  th: { padding: '12px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: '0.73rem', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f0f1f5', transition: 'background 0.1s' },
  td: { padding: '13px 16px', color: '#374151', verticalAlign: 'middle' },
  empty: { textAlign: 'center', padding: '32px', color: '#6b7280' },
};

export default AdminPanel;
