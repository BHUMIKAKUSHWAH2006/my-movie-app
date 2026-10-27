import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Ticket,
  Star,
  Info,
  Sparkles,
  Compass,
  Film,
  Zap,
  ShieldCheck,
  Headphones,
  Maximize2,
  Armchair,
  Bell,
  Clock,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import api, { errMsg } from '../api';
import Poster from '../components/Poster';
import MovieCard, { MovieGridSkeleton } from '../components/MovieCard';
import TrailerModal from '../components/TrailerModal';
import { useCity } from '../context/CityContext';
import { duration, fmtDate } from '../utils/format';
import { toast } from 'react-toastify';

function Hero({ movies }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduce || movies.length < 2) return undefined;
    const t = setInterval(() => setI((x) => (x + 1) % movies.length), 7500);
    return () => clearInterval(t);
  }, [paused, movies.length]);

  if (!movies.length) return null;
  const m = movies[i];
  const t = m.theme || {};

  return (
    <>
      <section
        className="hero"
        aria-label="Featured Spotlight"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div
          key={`bg-${m._id}`}
          className="hero-bg"
          style={{
            backgroundImage: m.backdropUrl
              ? `linear-gradient(to right, rgba(9, 7, 15, 0.95) 15%, rgba(9, 7, 15, 0.6) 60%, rgba(9, 7, 15, 0.85)), linear-gradient(to top, rgba(9, 7, 15, 1) 0%, transparent 50%), url("${m.backdropUrl}")`
              : `radial-gradient(70% 90% at 75% 30%, ${t.accent || '#ff2a5f'}44, transparent 65%), linear-gradient(150deg, ${t.from || '#1f1335'}, ${t.to || '#09070f'})`,
          }}
        />

        <div className="container hero-inner">
          <div key={`copy-${m._id}`} className="hero-copy">
            <div className="hero-badge-strip">
              <span className="hero-spotlight-pill">
                <Sparkles size={13} className="text-warning" /> CINEMATIC SPOTLIGHT
              </span>
              {m.certificate && <span className="chip cert">{m.certificate}</span>}
              <span className="chip">{m.language}</span>
              {m.durationMins && <span className="chip"><Clock size={12} className="me-1" />{duration(m.durationMins)}</span>}
              {m.formats?.[0] && <span className="chip format-chip">{m.formats[0]}</span>}
            </div>

            <h1 className="hero-title">{m.title}</h1>
            {m.tagline && <p className="hero-tagline">{m.tagline}</p>}
            <p className="hero-desc">{m.description}</p>

            <div className="hero-cta-group">
              <Link to={`/movies/${m._id}`} className="btn btn-brand btn-lg hero-cta-btn">
                <Ticket size={18} className="me-2" /> Book Tickets
              </Link>
              {m.trailerUrl && (
                <button
                  type="button"
                  onClick={() => setActiveTrailer({ url: m.trailerUrl, title: m.title })}
                  className="btn btn-ghost btn-lg hero-trailer-btn"
                >
                  <Play size={18} className="me-2 fill-current" /> Watch Trailer
                </button>
              )}
              <Link to={`/movies/${m._id}#details`} className="btn btn-subtle btn-lg">
                <Info size={17} className="me-1" /> Details
              </Link>

              {m.score > 0 && (
                <div className="hero-score-badge">
                  <Star size={16} className="star-gold fill-current" />
                  <span className="fw-bold">{m.score.toFixed(1)}</span>
                  <span className="score-sub">/ 10</span>
                </div>
              )}
            </div>
          </div>

          <div key={`poster-${m._id}`} className="hero-poster">
            <Poster movie={m} size="lg" />
          </div>
        </div>

        {/* Thumbnail selector */}
        <div className="container hero-picker" role="tablist" aria-label="Featured Movies Carousel">
          {movies.map((x, idx) => (
            <button
              key={x._id}
              role="tab"
              aria-selected={idx === i}
              className={`pick ${idx === i ? 'active' : ''}`}
              onClick={() => setI(idx)}
            >
              <Poster movie={x} size="xs" />
              <div className="pick-info">
                <span className="pick-title">{x.title}</span>
                <span className="pick-genre">{x.genres?.[0] || x.language}</span>
              </div>
              {idx === i && <span className="pick-progress-bar" />}
            </button>
          ))}
        </div>
      </section>

      {activeTrailer && (
        <TrailerModal
          trailerUrl={activeTrailer.url}
          title={activeTrailer.title}
          onClose={() => setActiveTrailer(null)}
        />
      )}
    </>
  );
}

export default function Home() {
  const { genres, city } = useCity();
  const [featured, setFeatured] = useState([]);
  const [genre, setGenre] = useState('');
  const [list, setList] = useState([]);
  const [soon, setSoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/movies', { params: { status: 'now_showing', sort: 'rating', limit: 5 } })
      .then((r) => setFeatured(r.data.items || []))
      .catch((e) => setError(errMsg(e)));

    api
      .get('/movies', { params: { status: 'upcoming', sort: 'newest', limit: 6 } })
      .then((r) => setSoon(r.data.items || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/movies', {
        params: { status: 'now_showing', genre: genre || undefined, limit: 12, sort: 'newest' },
      })
      .then((r) => setList(r.data.items || []))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [genre]);

  const handleNotify = (movieTitle) => {
    toast.success(`You will be notified as soon as bookings open for ${movieTitle}!`);
  };

  return (
    <>
      {featured.length > 0 && <Hero movies={featured} />}

      {/* Cinematic Experience Features Bar */}
      <section className="features-strip">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon-box">
                <Maximize2 size={20} />
              </div>
              <div>
                <h5>IMAX Laser 4K</h5>
                <p>1.43:1 expanded crystal imagery</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-box">
                <Headphones size={20} />
              </div>
              <div>
                <h5>Dolby Atmos 360°</h5>
                <p>Full dimensional spatial audio</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-box">
                <Armchair size={20} />
              </div>
              <div>
                <h5>VIP Luxury Lounges</h5>
                <p>Push-button plush recliners & food</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-box">
                <Zap size={20} />
              </div>
              <div>
                <h5>Instant M-Tickets</h5>
                <p>Zero queues, direct QR entrance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Now Showing */}
        <section className="section" id="now-showing">
          <div className="section-head">
            <div>
              <div className="section-kicker">IN CINEMAS NOW</div>
              <h2>
                Now Showing {city ? <span className="city-accent">in {city}</span> : ''}
              </h2>
            </div>
            <Link to="/movies" className="btn btn-ghost btn-sm see-all-btn">
              Explore All <ChevronRight size={16} />
            </Link>
          </div>

          {/* Genre Filters Bar */}
          <div className="genre-strip" role="group" aria-label="Filter by genre">
            <button
              className={`filter-pill ${genre === '' ? 'active' : ''}`}
              onClick={() => setGenre('')}
            >
              All Genres
            </button>
            {(genres.length ? genres : ['Action', 'Sci-Fi', 'Adventure', 'Drama', 'Thriller', 'Comedy']).map(
              (g) => (
                <button
                  key={g}
                  className={`filter-pill ${genre === g ? 'active' : ''}`}
                  onClick={() => setGenre(g)}
                  aria-pressed={genre === g}
                >
                  {g}
                </button>
              )
            )}
          </div>

          {loading ? (
            <MovieGridSkeleton count={8} />
          ) : list.length ? (
            <div className="movie-grid">
              {list.map((m) => (
                <MovieCard key={m._id} movie={m} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <Film size={40} className="mb-3 text-muted-2" />
              <h3>No {genre} movies currently playing</h3>
              <p>Try switching to another genre or browse the full catalogue.</p>
              <button className="btn btn-ghost mt-2" onClick={() => setGenre('')}>
                Show All Movies
              </button>
            </div>
          )}
        </section>

        {/* Exclusive VIP Promotion Banner */}
        <section className="promo-banner">
          <div className="promo-content">
            <span className="promo-tag">
              <Sparkles size={14} className="me-1" /> EXCLUSIVE PRIVILEGE
            </span>
            <h3>Upgrade to IMovies Gold Pass</h3>
            <p>
              Get unlimited 0% cancellation fees, free popcorn upgrade at PVR & INOX, and priority
              seat access 24 hours before release.
            </p>
            <div className="d-flex gap-3 mt-3">
              <Link to="/register" className="btn btn-brand">
                Claim VIP Pass
              </Link>
              <Link to="/movies" className="btn btn-ghost">
                View Participating Cinemas
              </Link>
            </div>
          </div>
          <div className="promo-art">
            <div className="promo-badge-card">
              <div className="vip-card-chip" />
              <div className="vip-card-title">IMOVIES GOLD</div>
              <div className="vip-card-num">•••• •••• •••• 2026</div>
              <div className="vip-card-tier">VIP ACCESS PASS</div>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        {soon.length > 0 && (
          <section className="section" id="coming-soon">
            <div className="section-head">
              <div>
                <div className="section-kicker">MOST ANTICIPATED</div>
                <h2>Coming Soon to Theatres</h2>
              </div>
              <Link to="/movies?status=upcoming" className="btn btn-ghost btn-sm see-all-btn">
                All Upcoming <ChevronRight size={16} />
              </Link>
            </div>

            <div className="soon-grid">
              {soon.map((m) => (
                <div key={m._id} className="soon-card">
                  <div className="soon-poster-wrap">
                    <Poster movie={m} />
                    <span className="soon-badge">RELEASING {fmtDate(m.releaseDate)}</span>
                  </div>
                  <div className="soon-info">
                    <h4>{m.title}</h4>
                    <p className="soon-genres">{m.genres.join(', ')} • {m.language}</p>
                    <p className="soon-desc">{m.description?.slice(0, 110)}...</p>
                    <div className="soon-actions">
                      <Link to={`/movies/${m._id}`} className="btn btn-ghost btn-sm">
                        View Teaser
                      </Link>
                      <button
                        className="btn btn-brand btn-sm notify-btn"
                        onClick={() => handleNotify(m.title)}
                        title="Get reminded when tickets open"
                      >
                        <Bell size={14} className="me-1" /> Remind Me
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
