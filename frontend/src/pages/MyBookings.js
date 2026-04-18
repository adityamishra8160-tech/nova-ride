import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/bookings/my')
      .then((r) => setBookings(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div style={s.page}>
      <div className="container">
        <div style={s.header}>
          <h1 style={s.title}>My Bookings</h1>
          <p style={s.sub}>{bookings.length} ride{bookings.length !== 1 ? 's' : ''} booked</p>
        </div>

        {bookings.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}>🚗</div>
            <h3 style={s.emptyTitle}>No bookings yet</h3>
            <p style={s.emptySub}>Book your first ride from our fleet.</p>
            <button onClick={() => navigate('/cars')} className="btn btn-primary" style={{ marginTop: '18px' }}>Browse Cars</button>
          </div>
        ) : (
          <div style={s.list}>
            {bookings.map((b) => (
              <div key={b._id} style={s.card}>
                <div style={s.imgBox}>
                  <img src={b.carId?.image} alt={b.carId?.name} style={s.img}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80'; }} />
                </div>
                <div style={s.details}>
                  <div style={s.topRow}>
                    <h3 style={s.carName}>{b.carId?.name || 'Car'}</h3>
                    <span className={`badge ${b.paymentStatus === 'paid' ? 'badge-paid' : 'badge-pending'}`}>
                      {b.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                    </span>
                  </div>
                  <div style={s.infoGrid}>
                    <div style={s.infoItem}><span style={s.infoLbl}>Pickup</span><span style={s.infoVal}>{b.pickup}</span></div>
                    <div style={s.infoItem}><span style={s.infoLbl}>Drop</span><span style={s.infoVal}>{b.drop}</span></div>
                    <div style={s.infoItem}><span style={s.infoLbl}>Date</span><span style={s.infoVal}>{b.date}</span></div>
                    <div style={s.infoItem}><span style={s.infoLbl}>Distance</span><span style={s.infoVal}>{b.distance} km</span></div>
                  </div>
                </div>
                <div style={s.rightCol}>
                  <span style={s.amtLbl}>Total Fare</span>
                  <span style={s.amt}>₹{b.amount}</span>
                  {b.paymentStatus === 'pending' && (
                    <button onClick={() => navigate(`/payment/${b._id}`)} className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '0.83rem', marginTop: '12px' }}>
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  page: { padding: '40px 0 72px', minHeight: 'calc(100vh - 64px)', background: '#f5f6fa' },
  header: { marginBottom: '24px' },
  title: { fontSize: '2rem', fontWeight: 800, marginBottom: '4px' },
  sub: { color: '#6b7280' },
  list: { display: 'flex', flexDirection: 'column', gap: '14px' },
  card: { background: '#fff', border: '1px solid #e2e4ea', borderRadius: '12px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '150px 1fr auto', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' },
  imgBox: { background: '#f5f6fa' },
  img: { width: '100%', height: '100%', objectFit: 'cover', minHeight: '130px' },
  details: { padding: '18px 20px' },
  topRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '10px', flexWrap: 'wrap' },
  carName: { fontSize: '1rem', fontWeight: 700 },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '1px' },
  infoLbl: { fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 },
  infoVal: { fontSize: '0.87rem', color: '#374151', fontWeight: 500 },
  rightCol: { padding: '18px 20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', borderLeft: '1px solid #f0f1f5', minWidth: '130px' },
  amtLbl: { fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, marginBottom: '2px' },
  amt: { fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' },
  empty: { textAlign: 'center', padding: '64px 0' },
  emptyIcon: { fontSize: '3rem', marginBottom: '12px' },
  emptyTitle: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' },
  emptySub: { color: '#6b7280', fontSize: '0.93rem' },
};

export default MyBookings;
