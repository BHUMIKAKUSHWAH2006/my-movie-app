import { useEffect, useState } from 'react';
import { Film } from 'lucide-react';

export default function Poster({ movie, size = 'md', className = '' }) {
  const [broken, setBroken] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBroken(false);
    setLoaded(false);
  }, [movie.posterUrl]);

  const t = movie.theme || {};
  const style = {
    '--p-from': t.from || '#2d1547',
    '--p-to': t.to || '#0d0717',
    '--p-accent': t.accent || '#ff2a5f',
  };

  const showImage = movie.posterUrl && !broken;

  return (
    <div
      className={`poster ${size === 'xs' ? 'poster-xs' : ''} ${size === 'lg' ? 'poster-lg' : ''} ${className}`}
      style={style}
      role="img"
      aria-label={`Poster for ${movie.title}`}
    >
      {showImage ? (
        <>
          <img
            src={movie.posterUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className={`poster-img ${loaded ? 'loaded' : 'loading'}`}
            onLoad={() => setLoaded(true)}
            onError={() => setBroken(true)}
          />
          <div className="poster-gradient-bottom" />
        </>
      ) : (
        <div className="poster-fallback-art">
          <Film className="poster-fallback-icon" size={32} />
          {movie.certificate && <span className="poster-cert">{movie.certificate}</span>}
          <span className="poster-title">{movie.title}</span>
          {movie.genres?.[0] && <span className="poster-tag">{movie.genres[0]}</span>}
        </div>
      )}
      <div className="poster-shine" />
    </div>
  );
}
