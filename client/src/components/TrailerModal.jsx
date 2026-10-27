import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function TrailerModal({ trailerUrl, title, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!trailerUrl) return null;

  // Extract YouTube ID from url
  let embedId = '';
  if (trailerUrl.includes('youtube.com/watch?v=')) {
    embedId = trailerUrl.split('watch?v=')[1]?.split('&')[0];
  } else if (trailerUrl.includes('youtu.be/')) {
    embedId = trailerUrl.split('youtu.be/')[1]?.split('?')[0];
  } else {
    embedId = trailerUrl;
  }

  const embedUrl = embedId.includes('http') ? embedId : `https://www.youtube.com/embed/${embedId}?autoplay=1&rel=0`;

  return (
    <div className="trailer-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Trailer for ${title}`}>
      <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="trailer-modal-header">
          <div className="d-flex align-items-center gap-2">
            <span className="trailer-badge">OFFICIAL TRAILER</span>
            <h4 className="m-0 text-truncate text-white fw-bold">{title}</h4>
          </div>
          <button className="trailer-close-btn" onClick={onClose} aria-label="Close trailer">
            <X size={20} />
          </button>
        </div>
        <div className="trailer-video-wrapper">
          <iframe
            src={embedUrl}
            title={`${title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
