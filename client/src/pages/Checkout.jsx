import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  CreditCard,
  QrCode,
  Wallet,
  ShieldCheck,
  Clock,
  ChevronLeft,
  Lock,
  Sparkles,
} from 'lucide-react';
import api, { errMsg } from '../api';
import { fmtLong, fmtTime, rupee } from '../utils/format';

const METHODS = [
  { id: 'upi', label: 'UPI / QR', icon: QrCode },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'wallet', label: 'IMovies Wallet', icon: Wallet },
];

const pad = (n) => String(n).padStart(2, '0');

export default function Checkout() {
  const { id } = useParams();
  const nav = useNavigate();
  const [show, setShow] = useState(null);
  const [mine, setMine] = useState([]);
  const [expiresAt, setExpiresAt] = useState(null);
  const [left, setLeft] = useState(null);
  const [method, setMethod] = useState('upi');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upi, setUpi] = useState('user@okaxis');
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [fieldErr, setFieldErr] = useState('');
  const paidRef = useRef(false);

  useEffect(() => {
    api
      .get(`/shows/${id}`)
      .then(({ data }) => {
        const held = data.seats.filter((s) => s.mine);
        if (!held.length) {
          toast.info('Your seat hold has expired. Pick your seats again.');
          return nav(`/shows/${id}/seats`, { replace: true });
        }
        setShow(data.show);
        setMine(held);
        setExpiresAt(new Date(Math.min(...held.map((s) => new Date(s.lockedUntil).getTime()))));
        return undefined;
      })
      .catch((e) => setError(errMsg(e)));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!expiresAt) return undefined;
    const tick = () => {
      const s = Math.max(0, Math.round((expiresAt - Date.now()) / 1000));
      setLeft(s);
      if (s === 0 && !paidRef.current) {
        toast.warn('Time ran out and your seats were released.');
        nav(`/shows/${id}/seats`, { replace: true });
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [expiresAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const subtotal = mine.reduce((n, s) => n + s.price, 0);
  const fee = Math.round(subtotal * 0.05);
  const total = subtotal + fee;

  const validate = () => {
    if (method === 'card') {
      if (card.number.replace(/\s/g, '').length !== 16) return 'Enter a valid 16-digit card number.';
      if (card.name.trim().length < 2) return 'Enter the name on your card.';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) return 'Enter the expiry in MM/YY format.';
      if (!/^\d{3,4}$/.test(card.cvv)) return 'Enter the 3 or 4 digit CVV.';
    }
    if (method === 'upi' && !/^[\w.-]{2,}@\w{2,}$/.test(upi)) return 'Enter a valid UPI ID, like name@okhdfcbank.';
    return '';
  };

  const pay = async (e) => {
    e.preventDefault();
    setError('');
    const v = validate();
    setFieldErr(v);
    if (v) return;
    setPaying(true);
    try {
      const { data } = await api.post('/bookings', {
        showId: id,
        seatIds: mine.map((s) => s._id),
        method: method.toUpperCase(),
        cardNumber: card.number,
        upiId: upi,
      });
      paidRef.current = true;
      toast.success('Booking confirmed! Generating your VIP ticket...');
      nav(`/booking/${data._id}`, { replace: true });
    } catch (err) {
      setError(errMsg(err));
      if (err.response?.status === 409) {
        paidRef.current = true;
        setTimeout(() => nav(`/shows/${id}/seats`, { replace: true }), 1800);
      }
    } finally {
      setPaying(false);
    }
  };

  const fmtCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  if (error && !show) {
    return (
      <div className="container page">
        <div className="alert-err">{error}</div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="container page">
        <div className="skeleton" style={{ height: 420, borderRadius: 20 }} />
      </div>
    );
  }

  return (
    <div className="container page pb-5">
      <div className="checkout-top-bar mb-4">
        <div>
          <Link to={`/shows/${id}/seats`} className="btn btn-ghost btn-sm mb-2">
            <ChevronLeft size={16} className="me-1" /> Change Seat Selection
          </Link>
          <h1 className="h3 fw-bold text-white mb-0">Secure Checkout</h1>
        </div>

        {left !== null && (
          <div className={`timer-badge ${left < 90 ? 'low' : ''}`} role="timer">
            <Clock size={16} />
            <span>
              Seats held for <b>{pad(Math.floor(left / 60))}:{pad(left % 60)}</b>
            </span>
          </div>
        )}
      </div>

      <div className="seat-layout">
        <form className="panel checkout-panel" onSubmit={pay} noValidate>
          <div className="checkout-tabs">
            {METHODS.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  type="button"
                  key={m.id}
                  className={`checkout-tab ${method === m.id ? 'active' : ''}`}
                  onClick={() => {
                    setMethod(m.id);
                    setError('');
                    setFieldErr('');
                  }}
                >
                  <Icon size={18} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {method === 'upi' && (
            <div className="upi-pane mt-4">
              <div className="upi-qr-card">
                <div className="qr-box">
                  <QrCode size={110} className="text-dark" />
                </div>
                <div className="qr-info">
                  <span className="badge bg-success-subtle text-success fw-bold mb-1">
                    Instant UPI QR
                  </span>
                  <div className="fw-bold text-white">Scan with any UPI App</div>
                  <div className="text-muted-2 small">Google Pay, PhonePe, Paytm, BHIM</div>
                </div>
              </div>

              <div className="mt-4">
                <label className="form-label" htmlFor="upi">
                  Or enter your UPI ID
                </label>
                <input
                  id="upi"
                  className="form-control form-control-lg"
                  placeholder="e.g. mobile@upi or name@okaxis"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value.trim())}
                />
              </div>
            </div>
          )}

          {method === 'card' && (
            <div className="card-pane mt-4">
              {/* Virtual Card Preview */}
              <div className="virtual-card-preview mb-4">
                <div className="card-chip" />
                <div className="card-preview-number">
                  {card.number || '•••• •••• •••• ••••'}
                </div>
                <div className="d-flex justify-content-between align-items-end mt-3">
                  <div>
                    <span className="card-preview-label">CARDHOLDER</span>
                    <div className="card-preview-name">{card.name || 'YOUR NAME'}</div>
                  </div>
                  <div>
                    <span className="card-preview-label">EXPIRES</span>
                    <div className="card-preview-expiry">{card.expiry || 'MM/YY'}</div>
                  </div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label" htmlFor="cn">
                    Card Number
                  </label>
                  <input
                    id="cn"
                    className="form-control"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="4242 4242 4242 4242"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: fmtCard(e.target.value) })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="nm">
                    Name on Card
                  </label>
                  <input
                    id="nm"
                    className="form-control"
                    autoComplete="cc-name"
                    placeholder="e.g. Rajesh Kumar"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label" htmlFor="ex">
                    Expiry Date
                  </label>
                  <input
                    id="ex"
                    className="form-control"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: fmtExpiry(e.target.value) })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label" htmlFor="cv">
                    CVV
                  </label>
                  <input
                    id="cv"
                    className="form-control"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    type="password"
                    maxLength={4}
                    placeholder="123"
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
              </div>
            </div>
          )}

          {method === 'wallet' && (
            <div className="wallet-pane mt-4 p-4 rounded-3 border border-secondary border-opacity-25 bg-dark">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <Wallet size={24} className="text-warning" />
                  <div>
                    <h5 className="m-0 text-white">IMovies FastPay Wallet</h5>
                    <small className="text-muted-2">Linked to your registered account</small>
                  </div>
                </div>
                <span className="badge bg-success-subtle text-success fs-6">Balance: ₹5,000</span>
              </div>
              <p className="text-muted-2 small mb-0">
                1-Click checkout with instant automated refunds on cancellation.
              </p>
            </div>
          )}

          {fieldErr && (
            <p className="form-text-err mt-3 mb-0" role="alert">
              {fieldErr}
            </p>
          )}
          {error && (
            <div className="alert-err mt-3" role="alert">
              {error}
            </div>
          )}

          <button className="btn btn-brand btn-lg w-100 mt-4 checkout-pay-btn" disabled={paying}>
            <Lock size={16} className="me-2" />
            {paying ? 'Authorizing Payment…' : `Pay ${rupee(total)} & Confirm Booking`}
          </button>

          <div className="secure-badge-footer mt-3">
            <ShieldCheck size={16} className="text-success" />
            <span>256-bit Bank Grade Encrypted • Simulated Demo Gateway</span>
          </div>
        </form>

        <aside className="summary-dock">
          <div className="summary-head">
            <Sparkles size={20} className="text-warning" />
            <h3 className="m-0 fs-5 fw-bold text-white">Order Summary</h3>
          </div>

          <div className="summary-movie-info mt-3">
            <h4 className="h5 text-white fw-bold mb-1">{show.movie.title}</h4>
            <div className="text-muted-2 small">{show.theatre.name}, {show.theatre.city}</div>
            <div className="text-warning small mt-1">{fmtLong(show.startTime)} at {fmtTime(show.startTime)}</div>
            <div className="badge bg-danger mt-2">{show.screenName} • {show.format}</div>
          </div>

          <div className="summary-divider" />

          <div className="sel-seats-box">
            <span className="text-muted-2 small d-block mb-1">Seats:</span>
            <div className="sel-seats-chips">
              {mine.map((s) => (
                <span className="selected-seat-chip" key={s._id}>
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          <div className="price-breakdown">
            <div className="sum-row">
              <span>{mine.length} {mine.length === 1 ? 'Ticket' : 'Tickets'}</span>
              <span>{rupee(subtotal)}</span>
            </div>
            <div className="sum-row">
              <span>Integrated GST & Fee</span>
              <span>{rupee(fee)}</span>
            </div>
            <div className="sum-row total">
              <span>Total Payable</span>
              <span className="total-amount">{rupee(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
