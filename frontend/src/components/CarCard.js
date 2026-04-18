import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBook = () => {
    if (!user) navigate('/login');
    else navigate(`/book/${car._id}`);
  };

  return (
    <div style={s.card}>
      <div style={s.imgWrap}>
        <img
          src={car.image}
          alt={car.name}
          style={s.img}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'; }}
        />
        <span style={s.catTag}>{car.category || 'Car'}</span>
        <span style={{ ...s.availTag, background: car.availability ? '#f0fdf4' : '#fef2f2', color: car.availability ? '#16a34a' : '#dc2626', border: `1px solid ${car.availability ? '#bbf7d0' : '#fecaca'}` }}>
          {car.availability ? '● Available' : '● Booked'}
        </span>
      </div>

      <div style={s.body}>
        <h3 style={s.name}>{car.name}</h3>
        <div style={s.priceRow}>
          <div>
            <div style={s.priceLabel}>Per KM</div>
            <div style={s.price}>₹{car.pricePerKm}</div>
          </div>
          <div style={s.divider} />
          <div>
            <div style={s.priceLabel}>Est. 10 km</div>
            <div style={s.estPrice}>₹{car.pricePerKm * 10}</div>
          </div>
        </div>
        <button
          onClick={handleBook}
          disabled={!car.availability}
          style={{ ...s.bookBtn, opacity: car.availability ? 1 : 0.5, cursor: car.availability ? 'pointer' : 'not-allowed' }}
        >
          {car.availability ? 'Book Now' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

const s = {
  card: { background: '#fff', border: '1px solid #e2e4ea', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s, transform 0.2s' },
  imgWrap: { position: 'relative', height: '185px', overflow: 'hidden', background: '#f5f6fa' },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
  catTag: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.92)', color: '#2563eb', fontSize: '0.7rem', fontWeight: 700, padding: '3px 9px', borderRadius: '5px', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid #bfdbfe' },
  availTag: { position: 'absolute', top: '10px', right: '10px', fontSize: '0.72rem', fontWeight: 600, padding: '3px 9px', borderRadius: '5px' },
  body: { padding: '16px' },
  name: { fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '12px' },
  priceRow: { display: 'flex', alignItems: 'center', gap: '16px', background: '#f5f6fa', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px' },
  priceLabel: { fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' },
  price: { fontSize: '1.15rem', fontWeight: 700, color: '#2563eb' },
  estPrice: { fontSize: '1rem', fontWeight: 600, color: '#374151' },
  divider: { width: '1px', height: '28px', background: '#e2e4ea' },
  bookBtn: { width: '100%', padding: '11px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, transition: 'background 0.15s' },
};

export default CarCard;
