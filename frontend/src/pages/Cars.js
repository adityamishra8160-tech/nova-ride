import React, { useState, useEffect } from 'react';
import API from '../api';
import CarCard from '../components/CarCard';

const CATS = ['All', 'Sedan', 'SUV', 'Luxury', 'Electric', 'Sports', 'Hatchback'];

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  useEffect(() => {
    API.get('/cars')
      .then((r) => setCars(r.data))
      .catch(() => setError('Failed to load cars. Make sure the backend is running on port 5000.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = cars.filter((c) => {
    return c.name.toLowerCase().includes(search.toLowerCase()) && (cat === 'All' || c.category === cat);
  });

  return (
    <div style={s.page}>
      <div className="container">
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Our Fleet</h1>
            <p style={s.sub}>{cars.length} cars ready to book</p>
          </div>
        </div>

        {/* Search + Filter */}
        <div style={s.filterBar}>
          <input
            type="text"
            placeholder="Search cars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={s.searchInput}
          />
          <div style={s.cats}>
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} style={{ ...s.catBtn, ...(cat === c ? s.catActive : {}) }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {loading && <div className="loading-center"><div className="spinner" /></div>}

        {!loading && !error && (
          filtered.length === 0
            ? <div style={s.empty}><div style={s.emptyIcon}>🔍</div><p style={{ color: '#6b7280' }}>No cars found for "{search}"</p></div>
            : <div style={s.grid}>{filtered.map((car) => <CarCard key={car._id} car={car} />)}</div>
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
  filterBar: { marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '12px' },
  searchInput: { background: '#fff', border: '1.5px solid #e2e4ea', borderRadius: '9px', padding: '11px 16px', color: '#111827', fontSize: '0.93rem', outline: 'none', width: '100%', maxWidth: '420px' },
  cats: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  catBtn: { padding: '7px 16px', borderRadius: '100px', border: '1px solid #e2e4ea', background: '#fff', color: '#6b7280', fontSize: '0.83rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' },
  catActive: { background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))', gap: '20px' },
  empty: { textAlign: 'center', padding: '60px 0' },
  emptyIcon: { fontSize: '2.5rem', marginBottom: '10px' },
};

export default Cars;
