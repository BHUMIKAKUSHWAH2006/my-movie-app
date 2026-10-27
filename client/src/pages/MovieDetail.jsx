import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Play,
  Star,
  Clock,
  Calendar,
  Film,
  MapPin,
  Sparkles,
  Shield,
  Coffee,
  Car,
  QrCode,
  Accessibility,
  ChevronRight,
} from 'lucide-react';
import api, { errMsg } from '../api';
import Poster from '../components/Poster';
import DateStrip from '../components/DateStrip';
import TrailerModal from '../components/TrailerModal';
import { useSelector } from 'react-redux';
import { useCity } from '../context/CityContext';
import { dayKey, duration, fmtDate, fmtTime, rupee } from '../utils/format';

export default function MovieDetail() {
  const { id } = useParams();
  const { city, setCity, cities } = useCity();
  const user = useSelector((s) => s.auth.user);
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [day, setDay] = useState(dayKey(new Date()));
  const [error, setError] = useState('');
  const [loadingShows, setLoadingShows] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    setMovie(null);
    api
      .get(`/movies/${id}`)
      .then((r) => setMovie(r.data))
      .catch((e) => setError(errMsg(e)));
  }, [id]);

  useEffect(() => {
    setLoadingShows(true);
    api
      .get('/shows', { params: { movie: id, city: city || undefined, date: day } })
      .then((r) => setShows(r.data || []))
      .catch(() => setShows([]))
      .finally(() => setLoadingShows(false));
  }, [id, city, day]);

  // Group the day's shows by theatre
  const grouped = useMemo(() => {
    const map = new Map();
    shows.forEach((s) => {
      const k = s.theatre._id || s.theatre.name;
      if (!map.has(k)) map.set(k, { theatre: s.theatre, shows: [] });
      map.get(k).shows.push(s);
    });
    return [...map.values()];
  }, [shows]);

  if (error) {
    return (
      <div className="container page">
        <div className="alert-err">{error}</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container page">
        <div className="skeleton" style={{ height: 420, borderRadius: 20 }} />
      </div>
    );
  }

  const t = movie.theme || {};
  const upcoming = movie.status === 'upcoming';

  return (
    <>
      <section className="detail-hero" id="details">
        <div
          className="hero-bg"
          style={{
            backgroundImage: movie.backdropUrl
              ? `linear-gradient(to right, rgba(9, 7, 15, 0.96) 20%, rgba(9, 7, 15, 0.7) 65%, rgba(9, 7, 15, 0.9)), linear-gradient(to top, rgba(9, 7, 15, 1) 0%, transparent 60%), url("${movie.backdropUrl}")`
              : `radial-gradient(70% 90% at 80% 20%, ${t.accent || '#ff2a5f'}44, transparent 65%), linear-gradient(150deg, ${t.from || '#1f1335'}, ${t.to || '#09070f'})`,
          }}
        />

        <div className="container detail-grid">
          <div className="detail-poster-wrap">
            <Poster movie={movie} size="lg" />
          </div>

          <div className="detail-info-pane">
            <div className="chips">
              {movie.certificate && <span className="chip cert">{movie.certificate}</span>}
              <span className="chip">{movie.language}</span>
              {movie.durationMins && (
                <span className="chip">
                  <Clock size={12} className="me-1" />
                  {duration(movie.durationMins)}
                </span>
              )}
              {movie.genres?.map((g) => (
                <span key={g} className="chip">
                  {g}
                </span>
              ))}
              {movie.formats?.map((f) => (
                <span key={f} className="chip format-chip">
                  {f}
                </span>
              ))}
            </div>

            <h1 className="detail-title">{movie.title}</h1>
            {movie.tagline && <p className="detail-tagline">{movie.tagline}</p>}

            {movie.score > 0 && (
              <div className="detail-score-box">
                <Star size={18} className="star-gold fill-current" />
                <span className="score-num">{movie.score.toFixed(1)}</span>
                <span className="score-label">Audience Rating</span>
              </div>
            )}

            <p className="detail-synopsis">{movie.description}</p>

            <div className="detail-actions">
              {movie.trailerUrl && (
                <button
                  type="button"
                  className="btn btn-brand btn-lg"
                  onClick={() => setShowTrailer(true)}
                >
                  <Play size={18} className="me-2 fill-current" /> Watch Official Trailer
                </button>
              )}
              {!upcoming && (
                <a href="#showtimes" className="btn btn-ghost btn-lg">
                  Select Seats Below
                </a>
              )}
            </div>

            <dl className="facts-grid">
              {movie.director && (
                <div className="fact-item">
                  <dt>Director</dt>
                  <dd>{movie.director}</dd>
                </div>
              )}
              {movie.cast?.length > 0 && (
                <div className="fact-item">
                  <dt>Starring</dt>
                  <dd>{movie.cast.join(', ')}</dd>
                </div>
              )}
              <div className="fact-item">
                <dt>{upcoming ? 'Release Date' : 'Released'}</dt>
                <dd>{fmtDate(movie.releaseDate)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div className="container page" id="showtimes">
        {user?.role === 'admin' && (
          <div className="admin-bar no-print">
            <span className="fw-bold d-flex align-items-center gap-1">
              <Shield size={16} /> Admin Controls
            </span>
            <Link to="/admin?tab=Movies" className="btn btn-brass btn-sm">
              Edit Movies
            </Link>
            <Link to="/admin?tab=Shows" className="btn btn-ghost btn-sm">
              Schedule Show
            </Link>
            <Link to="/admin?tab=Bookings" className="btn btn-ghost btn-sm">
              View Bookings
            </Link>
          </div>
        )}

        {upcoming ? (
          <div className="empty-box">
            <Calendar size={48} className="text-warning mb-3" />
            <h3>Bookings Open Closer to Release</h3>
            <p className="text-muted-2">
              This movie releases on {fmtDate(movie.releaseDate)}. Advance ticket booking will
              commence 4 days prior to premiere.
            </p>
            <Link to="/movies" className="btn btn-brand mt-2">
              Browse Movies Showing Now
            </Link>
          </div>
        ) : (
          <>
            <div className="showtimes-header">
              <div>
                <h2>Select Date & Cinema</h2>
                <p className="text-muted-2 small">
                  {city ? `Showing verified cinemas in ${city}` : 'Showing cinemas in all cities'}
                </p>
              </div>

              <div className="city-filter-dropdown">
                <MapPin size={15} />
                <select
                  className="form-select form-select-sm"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  aria-label="Filter showtimes by city"
                >
                  <option value="">All Cities</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="date-strip-wrapper">
              <DateStrip value={day} onChange={setDay} />
            </div>

            {/* Theatre & Show listing */}
            <div className="theatres-list mt-4">
              {loadingShows ? (
                <div className="theatre-skeleton-list">
                  <div className="skeleton mb-3" style={{ height: 120, borderRadius: 16 }} />
                  <div className="skeleton mb-3" style={{ height: 120, borderRadius: 16 }} />
                </div>
              ) : grouped.length === 0 ? (
                <div className="empty-box">
                  <Film size={40} className="text-muted-2 mb-3" />
                  <h4>No showtimes available for this date</h4>
                  <p className="text-muted-2">
                    Try picking another date from the calendar strip above, or switch city.
                  </p>
                </div>
              ) : (
                grouped.map(({ theatre, shows: tShows }) => (
                  <div key={theatre._id || theatre.name} className="theatre-card">
                    <div className="theatre-meta">
                      <h3>{theatre.name}</h3>
                      <p className="theatre-address">
                        <MapPin size={13} className="me-1 inline" />
                        {theatre.address || theatre.city}
                      </p>
                      <div className="theatre-amenities">
                        <span title="M-Ticket Supported">
                          <QrCode size={13} /> M-Ticket
                        </span>
                        <span title="F&B Available">
                          <Coffee size={13} /> F&B
                        </span>
                        <span title="Parking Available">
                          <Car size={13} /> Parking
                        </span>
                        <span title="Wheelchair Accessible">
                          <Accessibility size={13} /> Wheelchair
                        </span>
                      </div>
                    </div>

                    <div className="slots-pane">
                      <div className="slots">
                        {tShows.map((s) => {
                          const isFilling = s.status === 'filling_fast';
                          return (
                            <Link
                              key={s._id}
                              to={`/shows/${s._id}/seats`}
                              className={`slot ${isFilling ? 'few' : ''}`}
                            >
                              <b className="slot-time">{fmtTime(s.startTime)}</b>
                              <span className="slot-format">{s.format || '2D'}</span>
                              <small className="slot-status">
                                {isFilling ? 'Filling Fast' : 'Available'}
                              </small>
                            </Link>
                          );
                        })}
                      </div>
                      <div className="slot-legend-hint">
                        <span className="dot dot-avail" /> Available
                        <span className="dot dot-few" /> Filling Fast
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {showTrailer && (
        <TrailerModal
          trailerUrl={movie.trailerUrl}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </>
  );
}
