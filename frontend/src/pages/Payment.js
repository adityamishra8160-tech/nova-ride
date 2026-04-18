import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

// Payment method options
const METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'cash', label: 'Cash on Ride', icon: '💵' },
];

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState('');
  const [method, setMethod] = useState('card');

  // Card fields
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  // UPI field
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    API.get('/bookings/my')
      .then((r) => {
        const found = r.data.find((b) => b._id === bookingId);
        if (found) setBooking(found);
        else setError('Booking not found');
      })
      .catch(() => setError('Failed to load booking'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const fmtCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExp = (v) => { const c = v.replace(/\D/g, '').slice(0, 4); return c.length >= 3 ? c.slice(0,2)+'/'+c.slice(2) : c; };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    if (name === 'number') setCard({ ...card, number: fmtCard(value) });
    else if (name === 'expiry') setCard({ ...card, expiry: fmtExp(value) });
    else if (name === 'cvv') setCard({ ...card, cvv: value.replace(/\D/g,'').slice(0,3) });
    else setCard({ ...card, [name]: value });
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (method === 'card') {
      if (card.number.replace(/\s/g,'').length < 16) return setError('Enter a valid 16-digit card number');
      if (card.cvv.length < 3) return setError('Enter a valid 3-digit CVV');
      if (!card.name.trim()) return setError('Enter cardholder name');
    }
    if (method === 'upi') {
      if (!upiId.includes('@')) return setError('Enter a valid UPI ID (e.g. name@upi)');
    }

    setPaying(true);
    // Simulate payment delay
    await new Promise((r) => setTimeout(r, 2000));
    try {
      await API.patch(`/bookings/${bookingId}/pay`);
      setPaid(true);
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  // Success screen
  if (paid) return (
    <div style={s.page}>
      <div style={s.successCard}>
        <div style={s.checkCircle}>✓</div>
        <h2 style={s.successTitle}>Payment Successful!</h2>
        <p style={s.successSub}>Your ride is confirmed. Have a safe journey! 🚗</p>
        {booking && (
          <div style={s.receipt}>
            {[
              ['Car', booking.carId?.name],
              ['Pickup', booking.pickup],
              ['Drop', booking.drop],
              ['Date', booking.date],
              ['Payment', method === 'cash' ? 'Cash on Ride' : method === 'upi' ? `UPI — ${upiId}` : 'Card'],
            ].map(([k, v]) => (
              <div key={k} style={s.receiptRow}><span style={{ color: '#6b7280' }}>{k}</span><span>{v}</span></div>
            ))}
            <div style={s.receiptDivider} />
            <div style={{ ...s.receiptRow, fontWeight: 700 }}>
              <span>Amount {method === 'cash' ? '(to pay on ride)' : 'Paid'}</span>
              <span style={{ color: '#16a34a', fontSize: '1.1rem' }}>₹{booking.amount}</span>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
          <button onClick={() => navigate('/my-bookings')} className="btn btn-primary" style={{ padding: '11px 24px' }}>View My Bookings</button>
          <button onClick={() => navigate('/cars')} className="btn btn-outline" style={{ padding: '11px 24px' }}>Book Another</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.inner}>
        {/* Order Summary */}
        <div style={s.summaryCard}>
          <h3 style={s.summaryTitle}>Order Summary</h3>
          {booking && (
            <>
              {booking.carId?.image && (
                <img src={booking.carId.image} alt="" style={s.summaryImg} onError={(e) => { e.target.style.display='none'; }} />
              )}
              <div>
                {[
                  ['Car', booking.carId?.name],
                  ['Pickup', booking.pickup],
                  ['Drop', booking.drop],
                  ['Date', booking.date],
                  ['Distance', `${booking.distance} km`],
                ].map(([k, v]) => (
                  <div key={k} style={s.receiptRow}><span style={{ color: '#6b7280' }}>{k}</span><span>{v}</span></div>
                ))}
                <div style={s.receiptDivider} />
                <div style={{ ...s.receiptRow, fontWeight: 700, fontSize: '1rem' }}>
                  <span>Total</span>
                  <span style={{ color: '#2563eb', fontSize: '1.25rem', fontWeight: 800 }}>₹{booking.amount}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Payment Form */}
        <div style={s.payCard}>
          <h2 style={s.payTitle}>Choose Payment Method</h2>
          <p style={s.paySub}>Demo mode — no real charges will be made</p>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Method Selector */}
          <div style={s.methodGrid}>
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                style={{ ...s.methodBtn, ...(method === m.id ? s.methodActive : {}) }}
              >
                <span style={s.methodIcon}>{m.icon}</span>
                <span style={s.methodLabel}>{m.label}</span>
                {method === m.id && <span style={s.methodCheck}>✓</span>}
              </button>
            ))}
          </div>

          <form onSubmit={handlePay}>
            {/* Card Fields */}
            {method === 'card' && (
              <div>
                <div style={s.cardVisual}>
                  <div style={s.cardChip}>▬▬</div>
                  <div style={s.cardNumDisplay}>{card.number || '•••• •••• •••• ••••'}</div>
                  <div style={s.cardBottom}>
                    <div>
                      <div style={s.cardLbl}>Name</div>
                      <div style={s.cardVal}>{card.name || 'YOUR NAME'}</div>
                    </div>
                    <div>
                      <div style={s.cardLbl}>Expires</div>
                      <div style={s.cardVal}>{card.expiry || 'MM/YY'}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '1rem', fontWeight: 800, fontStyle: 'italic' }}>VISA</div>
                  </div>
                </div>
                <div className="input-group"><label>Card Number</label><input name="number" placeholder="1234 5678 9012 3456" value={card.number} onChange={handleCardChange} required /></div>
                <div className="input-group"><label>Cardholder Name</label><input name="name" placeholder="As on card" value={card.name} onChange={handleCardChange} required /></div>
                <div style={s.twoCol}>
                  <div className="input-group"><label>Expiry</label><input name="expiry" placeholder="MM/YY" value={card.expiry} onChange={handleCardChange} required /></div>
                  <div className="input-group"><label>CVV</label><input name="cvv" placeholder="•••" value={card.cvv} onChange={handleCardChange} type="password" maxLength={3} required /></div>
                </div>
              </div>
            )}

            {/* UPI Fields */}
            {method === 'upi' && (
              <div style={s.upiBox}>
                <div style={s.upiApps}>
                  {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                    <div key={app} style={s.upiApp}>{app}</div>
                  ))}
                </div>
                <div className="input-group">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </div>
                <p style={s.upiNote}>Enter your UPI ID linked to any bank account (e.g. name@okaxis, name@ybl)</p>
              </div>
            )}

            {/* Cash Option */}
            {method === 'cash' && (
              <div style={s.cashBox}>
                <div style={s.cashIcon}>💵</div>
                <h4 style={s.cashTitle}>Pay Cash to Driver</h4>
                <p style={s.cashDesc}>
                  Your ride is confirmed. Pay <strong>₹{booking?.amount}</strong> directly to the driver at the end of your trip. No advance payment required.
                </p>
                <div style={s.cashNote}>
                  <span>✓</span> No advance required
                </div>
                <div style={s.cashNote}>
                  <span>✓</span> Pay at the end of ride
                </div>
                <div style={s.cashNote}>
                  <span>✓</span> Exact change appreciated
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={s.payBtn}
              disabled={paying}
            >
              {paying ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={s.btnSpinner} /> Processing...
                </span>
              ) : method === 'cash' ? (
                `Confirm Booking — Pay ₹${booking?.amount} on Ride`
              ) : (
                `Pay ₹${booking?.amount} Now`
              )}
            </button>
          </form>

          <p style={s.secNote}>🔒 256-bit SSL Encrypted &nbsp;•&nbsp; Demo Mode</p>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { padding: '40px 24px 72px', minHeight: 'calc(100vh - 64px)', background: '#f5f6fa', maxWidth: '1100px', margin: '0 auto' },
  inner: { display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '24px', alignItems: 'start' },

  summaryCard: { background: '#fff', border: '1px solid #e2e4ea', borderRadius: '14px', padding: '24px', position: 'sticky', top: '80px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  summaryTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' },
  summaryImg: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '9px', marginBottom: '14px' },
  receiptRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.87rem', color: '#374151', marginBottom: '9px', gap: '8px' },
  receiptDivider: { height: '1px', background: '#e2e4ea', margin: '12px 0' },

  payCard: { background: '#fff', border: '1px solid #e2e4ea', borderRadius: '14px', padding: '28px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' },
  payTitle: { fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' },
  paySub: { color: '#6b7280', fontSize: '0.85rem', marginBottom: '20px' },

  methodGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '22px' },
  methodBtn: { border: '1.5px solid #e2e4ea', borderRadius: '10px', padding: '14px 10px', background: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative', transition: 'all 0.15s', minHeight: '80px', justifyContent: 'center' },
  methodActive: { border: '1.5px solid #2563eb', background: '#eff6ff' },
  methodIcon: { fontSize: '1.4rem' },
  methodLabel: { fontSize: '0.75rem', fontWeight: 600, color: '#374151', textAlign: 'center' },
  methodCheck: { position: 'absolute', top: '6px', right: '8px', color: '#2563eb', fontSize: '0.8rem', fontWeight: 700 },

  // Card visual
  cardVisual: { background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', borderRadius: '12px', padding: '20px', marginBottom: '18px', minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' },
  cardChip: { color: '#fbbf24', fontSize: '0.9rem', letterSpacing: '2px' },
  cardNumDisplay: { fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '3px', color: '#fff', textAlign: 'center', padding: '8px 0' },
  cardBottom: { display: 'flex', alignItems: 'flex-end', gap: '16px' },
  cardLbl: { fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1px' },
  cardVal: { fontSize: '0.8rem', color: '#fff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' },

  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },

  // UPI
  upiBox: { marginBottom: '4px' },
  upiApps: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' },
  upiApp: { background: '#f5f6fa', border: '1px solid #e2e4ea', borderRadius: '7px', padding: '7px 14px', fontSize: '0.8rem', fontWeight: 600, color: '#374151' },
  upiNote: { fontSize: '0.78rem', color: '#6b7280', marginTop: '6px', lineHeight: 1.5 },

  // Cash
  cashBox: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '24px', marginBottom: '16px', textAlign: 'center' },
  cashIcon: { fontSize: '2.5rem', marginBottom: '10px' },
  cashTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#111827' },
  cashDesc: { fontSize: '0.88rem', color: '#374151', lineHeight: 1.6, marginBottom: '14px' },
  cashNote: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.83rem', color: '#16a34a', fontWeight: 500, justifyContent: 'center', marginBottom: '4px' },

  payBtn: { width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.97rem', marginTop: '8px' },
  btnSpinner: { display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' },
  secNote: { textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', marginTop: '14px' },

  // Success
  successCard: { maxWidth: '460px', margin: '50px auto', background: '#fff', border: '1px solid #e2e4ea', borderRadius: '16px', padding: '40px 32px', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
  checkCircle: { width: '72px', height: '72px', background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#16a34a', margin: '0 auto 20px', fontWeight: 700 },
  successTitle: { fontSize: '1.7rem', fontWeight: 800, color: '#16a34a', marginBottom: '8px' },
  successSub: { color: '#6b7280', marginBottom: '24px', fontSize: '0.93rem' },
  receipt: { background: '#f5f6fa', border: '1px solid #e2e4ea', borderRadius: '10px', padding: '16px', marginBottom: '24px', textAlign: 'left' },
};

export default Payment;
