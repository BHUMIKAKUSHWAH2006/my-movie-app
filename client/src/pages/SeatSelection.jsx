import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Zap,
  Armchair,
  Clock,
  ArrowRight,
  Ticket as TicketIcon,
} from 'lucide-react';
import api, { errMsg } from '../api';
import { socket } from '../socket';
import { fmtLong, fmtTime, rupee } from '../utils/format';

const TIER_NAMES = { standard: 'Classic', premium: 'Prime Club', recliner: 'Royal Recliner' };

export default function SeatSelection() {
  const { id } = useParams();
  const nav = useNavigate();
  const user = useSelector((s) => s.auth.user);

  const [data, setData] = useState(null);
  const [seats, setSeats] = useState([]);
  const [sel, setSel] = useState([]); // selected seat ids
  const [live, setLive] = useState(socket.connected);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const selRef = useRef([]);
  selRef.current = sel;
  const lockingRef = useRef(false);

  const load = () =>
    api
      .get(`/shows/${id}`)
      .then(({ data: d }) => {
        setData(d);
        setSeats(d.seats);
        setSel(d.seats.filter((s) => s.mine).map((s) => s._id));
      })
      .catch((e) => setError(errMsg(e)));

  useEffect(() => {
    load();
  }, [id, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onUpdate = ({ showId, seats: ids, status }) => {
      if (showId !== id) return;
      setSeats((prev) =>
        prev.map((s) => (ids.includes(s._id) ? { ...s, status, mine: false } : s))
      );
      if (status !== 'available' && !lockingRef.current) {
        const lost = selRef.current.filter((x) => ids.includes(x));
        if (lost.length) {
          setSel((p) => p.filter((x) => !lost.includes(x)));
          toast.warn('A seat you picked was just taken. Choose another.');
        }
      }
    };
    const onConnect = () => {
      setLive(true);
      socket.emit('show:join', id);
      load();
    };
    const onDisconnect = () => setLive(false);

    socket.on('seats:update', onUpdate);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.connect();
    if (socket.connected) socket.emit('show:join', id);

    return () => {
      socket.emit('show:leave', id);
      socket.off('seats:update', onUpdate);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = useMemo(() => {
    const map = new Map();
    seats.forEach((s) => {
      if (!map.has(s.row)) map.set(s.row, []);
      map.get(s.row).push(s);
    });
    return [...map.entries()].map(([name, list]) => ({
      name,
      list,
      tier: list[0].tier,
      price: list[0].price,
    }));
  }, [seats]);

  const maxSeats = data?.maxSeats || 8;
  const chosen = seats
    .filter((s) => sel.includes(s._id))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
  const subtotal = chosen.reduce((n, s) => n + s.price, 0);
  const fee = Math.round(subtotal * 0.05);

  const toggle = (seat) => {
    if (seat.status === 'booked' || (seat.status === 'locked' && !seat.mine)) return;
    setSel((prev) => {
      if (prev.includes(seat._id)) return prev.filter((x) => x !== seat._id);
      if (prev.length >= maxSeats) {
        toast.info(`You can book up to ${maxSeats} seats at a time.`);
        return prev;
      }
      return [...prev, seat._id];
    });
  };

  const proceed = async () => {
    if (!user) {
      toast.info('Sign in to hold your seats.');
      return nav('/login', { state: { from: `/shows/${id}/seats` } });
    }
    setBusy(true);
    lockingRef.current = true;
    try {
      await api.post(`/shows/${id}/lock`, { seatIds: sel });
      nav(`/checkout/${id}`);
    } catch (e) {
      toast.error(errMsg(e));
      lockingRef.current = false;
      await load();
    } finally {
      setBusy(false);
    }
  };

  if (error) {
    return (
      <div className="container page">
        <div className="alert-err" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container page">
        <div className="skeleton" style={{ height: 520, borderRadius: 20 }} />
      </div>
    );
  }

  const { show } = data;
  const started = new Date(show.startTime) < new Date();
  const half = Math.floor((show.seatsPerRow || 12) / 2);

  const seatState = (s) => {
    if (sel.includes(s._id)) return 'is-selected';
    if (s.status === 'booked') return 'is-booked';
    if (s.status === 'locked' && !s.mine) return 'is-held';
    return '';
  };

  return (
    <div className="container page pb-5">
      {/* Show header banner */}
      <div className="show-header-card">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <Link to={`/movies/${show.movie._id}`} className="btn btn-ghost btn-sm">
            <ChevronLeft size={16} className="me-1" /> Back to Movie
          </Link>
          <div>
            <h1 className="h3 mb-1 text-white fw-bold">{show.movie.title}</h1>
            <div className="text-muted-2 small d-flex align-items-center gap-2 flex-wrap">
              <span>{show.theatre.name}, {show.theatre.city}</span>
              <span>•</span>
              <span className="text-info">{show.screenName}</span>
              <span>•</span>
              <span className="badge bg-danger">{show.format || 'IMAX 3D'}</span>
            </div>
          </div>
        </div>

        <div className="show-header-timing">
          <div className="fw-bold fs-5 text-warning">{fmtLong(show.startTime)}</div>
          <div className="d-flex gap-2 justify-content-md-end align-items-center mt-1">
            <span className="chip brass fw-bold">{fmtTime(show.startTime)}</span>
            <span className={`live-badge ${live ? 'live' : 'off'}`}>
              <span className="live-ping" /> {live ? 'Real-Time Sync' : 'Reconnecting'}
            </span>
          </div>
        </div>
      </div>

      {started && (
        <div className="alert-err mt-3">
          This show has already started, so seats can no longer be booked.
        </div>
      )}

      <div className="seat-layout">
        <section className="seatmap-section" aria-label="Seat map">
          {/* Cinema Screen with Light Projection Beam */}
          <div className="screen-3d-wrap">
            <div className="screen-beam" />
            <div className="screen-curve" />
            <div className="screen-caption">ALL EYES THIS WAY • CINEMA SCREEN</div>
          </div>

          <div className="seatmap">
            <div className="seatmap-inner" role="group" aria-label="Seats">
              {rows.map((r, idx) => (
                <div key={r.name} className="d-contents">
                  {(idx === 0 || rows[idx - 1].tier !== r.tier) && (
                    <div className="tier-label">
                      <span className="tier-tag">
                        <Armchair size={13} className="me-1 inline" />
                        <b>{TIER_NAMES[r.tier] || r.tier}</b> — {rupee(r.price)}
                      </span>
                    </div>
                  )}
                  <div className="seat-row">
                    <span className="row-name" aria-hidden="true">
                      {r.name}
                    </span>
                    {r.list.map((s) => (
                      <button
                        key={s._id}
                        type="button"
                        className={`seat tier-${s.tier} ${seatState(s)} ${
                          s.number === half ? 'gap-after' : ''
                        }`}
                        onClick={() => toggle(s)}
                        disabled={started || s.status === 'booked' || (s.status === 'locked' && !s.mine)}
                        aria-pressed={sel.includes(s._id)}
                        title={`${s.label} (${TIER_NAMES[s.tier]}) - ${rupee(s.price)}`}
                      >
                        {s.status === 'booked' ? '' : s.number}
                      </button>
                    ))}
                    <span className="row-name" aria-hidden="true">
                      {r.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aesthetic Seat Legend */}
          <div className="legend-strip" aria-label="Legend">
            <span className="legend-item">
              <i className="seat tier-standard legend-sample" /> Available
            </span>
            <span className="legend-item">
              <i className="seat is-selected legend-sample" /> Selected
            </span>
            <span className="legend-item">
              <i className="seat is-held tier-standard legend-sample" /> Held
            </span>
            <span className="legend-item">
              <i className="seat is-booked tier-standard legend-sample" /> Sold Out
            </span>
          </div>
        </section>

        {/* Sidebar Summary Dock */}
        <aside className="summary-dock" aria-label="Booking summary">
          <div className="summary-head">
            <TicketIcon size={20} className="text-warning" />
            <h3 className="m-0 fs-5 fw-bold text-white">Booking Summary</h3>
          </div>

          <div className="summary-movie-info mt-3">
            <div className="fw-bold text-white">{show.movie.title}</div>
            <div className="text-muted-2 small">{show.theatre.name}</div>
            <div className="text-warning small mt-1">{fmtTime(show.startTime)} • {show.format}</div>
          </div>

          <div className="summary-divider" />

          <div className="sel-seats-box">
            <span className="text-muted-2 small d-block mb-1">
              Selected Seats ({chosen.length}/{maxSeats}):
            </span>
            {chosen.length === 0 ? (
              <span className="text-muted-2 fst-italic small">Click seats on the cinema layout</span>
            ) : (
              <div className="sel-seats-chips">
                {chosen.map((s) => (
                  <span key={s._id} className="selected-seat-chip">
                    {s.label} <small>({rupee(s.price)})</small>
                  </span>
                ))}
              </div>
            )}
          </div>

          {chosen.length > 0 && (
            <div className="price-breakdown">
              <div className="sum-row">
                <span>
                  Ticket Price ({chosen.length} {chosen.length === 1 ? 'seat' : 'seats'})
                </span>
                <span>{rupee(subtotal)}</span>
              </div>
              <div className="sum-row">
                <span>Integrated GST & Convenience</span>
                <span>{rupee(fee)}</span>
              </div>
              <div className="sum-row total">
                <span>Grand Total</span>
                <span className="total-amount">{rupee(subtotal + fee)}</span>
              </div>
            </div>
          )}

          <button
            className="btn btn-brand w-100 btn-lg proceed-checkout-btn mt-3"
            disabled={!chosen.length || busy || started}
            onClick={proceed}
          >
            {busy ? (
              'Holding seats…'
            ) : (
              <>
                Proceed to Checkout <ArrowRight size={18} className="ms-2" />
              </>
            )}
          </button>

          <p className="hint text-center mt-3 mb-0 small">
            <ShieldCheck size={14} className="text-success me-1 inline" /> Seats held exclusively for 8 minutes once you proceed.
          </p>
        </aside>
      </div>
    </div>
  );
}
