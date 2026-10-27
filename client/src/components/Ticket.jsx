import { fmtLong, fmtTime, rupee } from '../utils/format';
import { Film, Sparkles, QrCode } from 'lucide-react';

// Decorative deterministic QR pattern
function Pattern({ code }) {
  const N = 21;
  let seed = [...code].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const inFinder = (x, y) =>
    [[0, 0], [N - 7, 0], [0, N - 7]].some(
      ([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7
    );
  const cells = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!inFinder(x, y) && rnd() > 0.52) {
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
      }
    }
  }
  const finder = (fx, fy) => (
    <g key={`${fx}${fy}`}>
      <rect x={fx} y={fy} width="7" height="7" />
      <rect x={fx + 1} y={fy + 1} width="5" height="5" fill="#fef8ec" />
      <rect x={fx + 2} y={fy + 2} width="3" height="3" />
    </g>
  );
  return (
    <svg
      viewBox={`0 0 ${N} ${N}`}
      fill="#1a1424"
      role="img"
      aria-label="Security verification code"
      shapeRendering="crispEdges"
      className="ticket-qr-svg"
    >
      {cells}
      {finder(0, 0)}
      {finder(N - 7, 0)}
      {finder(0, N - 7)}
    </svg>
  );
}

export default function Ticket({ booking }) {
  const { movie, theatre, show } = booking;
  const seats = booking.seats.map((s) => s.label).sort();
  const isCancelled = booking.status === 'cancelled';

  return (
    <article
      className={`ticket ${isCancelled ? 'cancelled' : ''}`}
      aria-label={`Ticket ${booking.code}`}
    >
      {/* Golden top highlight bar */}
      <div className="ticket-top-band">
        <div className="d-flex align-items-center gap-2">
          <Film size={15} />
          <span>IMOVIES VIP BOARDING PASS</span>
        </div>
        <span className="badge-exclusive">
          <Sparkles size={12} className="me-1" /> VERIFIED M-TICKET
        </span>
      </div>

      <div className="ticket-body">
        <div className="ticket-main">
          <div className="ticket-kicker">
            {isCancelled ? 'CANCELLED RESERVATION' : `${show.format || 'IMAX 3D'} • ${show.language}`}
          </div>
          <h2 className="ticket-movie-title">{movie.title}</h2>

          <dl className="ticket-grid">
            <div className="ticket-cell">
              <dt>DATE</dt>
              <dd>{fmtLong(show.startTime)}</dd>
            </div>
            <div className="ticket-cell">
              <dt>TIME</dt>
              <dd className="highlight-time">{fmtTime(show.startTime)}</dd>
            </div>
            <div className="ticket-cell">
              <dt>CINEMA</dt>
              <dd>{theatre.name}</dd>
            </div>
            <div className="ticket-cell">
              <dt>AUDITORIUM</dt>
              <dd>{show.screenName}</dd>
            </div>
            <div className="ticket-cell seat-cell">
              <dt>SEATS</dt>
              <dd className="highlight-seats">{seats.join(', ')}</dd>
            </div>
            <div className="ticket-cell">
              <dt>TOTAL AMOUNT</dt>
              <dd>{rupee(booking.total)}</dd>
            </div>
          </dl>

          <div className="ticket-barcode-wrap">
            <div className="ticket-barcode-lines" />
            <span className="ticket-barcode-num">REF: {booking.code}</span>
          </div>
        </div>

        {/* Notched perforated ticket stub */}
        <div className="ticket-stub">
          <div className="stub-notch notch-top" />
          <div className="stub-notch notch-bottom" />
          
          <div className="qr-container">
            <Pattern code={booking.code} />
          </div>
          
          <div className="stub-details">
            <div className="ticket-code-badge">{booking.code}</div>
            <span className="seats-count-tag">
              {seats.length} {seats.length === 1 ? 'SEAT' : 'SEATS'}
            </span>
            <small className="scan-hint">Scan at Cinema Turnstile</small>
          </div>
        </div>
      </div>
    </article>
  );
}
