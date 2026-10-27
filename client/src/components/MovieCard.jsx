import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Play, Ticket, Clock, Calendar } from 'lucide-react';
import Poster from './Poster';
import TrailerModal from './TrailerModal';
import { duration, fmtDate } from '../utils/format';

export default function MovieCard({ movie }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const nav = useNavigate();

  const handlePlayTrailer = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (movie.trailerUrl) {
      setShowTrailer(true);
    } else {
      nav(`/movies/${movie._id}`);
    }
  };

  const isUpcoming = movie.status === 'upcoming';

  return (
    <>
      <div className="mcard-container">
        <Link to={`/movies/${movie._id}`} className="mcard" aria-label={`${movie.title}, ${movie.language}`}>
          <div className="mcard-poster-wrap">
            <Poster movie={movie} />

            {/* Badges Overlay */}
            <div className="mcard-top-badges">
              {movie.certificate && <span className="mcard-cert-badge">{movie.certificate}</span>}
              {movie.score > 0 && !isUpcoming && (
                <span className="mcard-rating-badge">
                  <Star size={12} className="star-fill" /> {movie.score.toFixed(1)}
                </span>
              )}
              {isUpcoming && <span className="mcard-upcoming-badge">Coming Soon</span>}
            </div>

            {/* Format tags (e.g. IMAX / 3D) */}
            {movie.formats && movie.formats.length > 0 && (
              <div className="mcard-format-tag">{movie.formats[0]}</div>
            )}

            {/* Hover Actions Overlay */}
            <div className="mcard-overlay">
              {movie.trailerUrl && (
                <button
                  type="button"
                  className="mcard-action-btn trailer-btn"
                  onClick={handlePlayTrailer}
                  title="Watch Trailer"
                >
                  <Play size={16} fill="currentColor" /> Watch Trailer
                </button>
              )}
              <span className="mcard-action-btn book-btn">
                <Ticket size={16} /> {isUpcoming ? 'View Details' : 'Book Now'}
              </span>
            </div>
          </div>

          <div className="mcard-content">
            <h3 className="mcard-title" title={movie.title}>
              {movie.title}
            </h3>
            <div className="mcard-meta">
              <span className="mcard-lang">{movie.language}</span>
              <span className="mcard-dot">•</span>
              <span className="mcard-genres">{movie.genres?.slice(0, 2).join(', ')}</span>
            </div>
            {isUpcoming ? (
              <div className="mcard-release">
                <Calendar size={12} /> {fmtDate(movie.releaseDate)}
              </div>
            ) : movie.durationMins ? (
              <div className="mcard-duration">
                <Clock size={12} /> {duration(movie.durationMins)}
              </div>
            ) : null}
          </div>
        </Link>
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

export function MovieGridSkeleton({ count = 8 }) {
  return (
    <div className="movie-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton sk-poster" />
          <div className="skeleton mt-2" style={{ height: 18, width: '85%', borderRadius: 6 }} />
          <div className="skeleton mt-2" style={{ height: 14, width: '55%', borderRadius: 6 }} />
        </div>
      ))}
    </div>
  );
}
