import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Film, Sparkles } from 'lucide-react';
import api, { errMsg } from '../api';
import MovieCard, { MovieGridSkeleton } from '../components/MovieCard';
import Pager from '../components/Pager';
import DateStrip from '../components/DateStrip';
import { useCity } from '../context/CityContext';

export default function Movies() {
  const [params, setParams] = useSearchParams();
  const { genres, languages, cities, city, setCity } = useCity();
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState(params.get('search') || '');

  const get = (k) => params.get(k) || '';
  const set = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!('page' in patch)) next.delete('page');
    setParams(next, { replace: true });
  };

  useEffect(() => {
    setSearchText(get('search'));
  }, [params.get('search')]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = setTimeout(() => searchText !== get('search') && set({ search: searchText.trim() }), 300);
    return () => clearTimeout(t);
  }, [searchText]); // eslint-disable-line react-hooks/exhaustive-deps

  const query = params.toString();
  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get('/movies', {
        params: {
          search: get('search') || undefined,
          genre: get('genre') || undefined,
          language: get('language') || undefined,
          status: get('status') || undefined,
          date: get('date') || undefined,
          sort: get('sort') || 'newest',
          city: city || undefined,
          page: get('page') || 1,
          limit: 12,
        },
      })
      .then((r) => setData(r.data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [query, city]); // eslint-disable-line react-hooks/exhaustive-deps

  const status = get('status');
  const activeFilters = ['search', 'genre', 'language', 'date'].some((k) => get(k)) || city;

  return (
    <div className="container page pb-5">
      {/* Header section with status tabs */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="page-title mb-1">
            {status === 'upcoming' ? 'Coming Soon to Cinemas' : 'Explore All Movies'}
          </h1>
          <p className="text-muted-2 mb-0">
            {loading ? 'Curating films…' : `Showing ${data.total} ${data.total === 1 ? 'title' : 'titles'}`}
            {city ? ` available in ${city}` : ''}
          </p>
        </div>

        {/* Quick status toggle */}
        <div className="status-toggle-pills">
          <button
            className={`status-pill ${status !== 'upcoming' ? 'active' : ''}`}
            onClick={() => set({ status: '' })}
          >
            Now Showing
          </button>
          <button
            className={`status-pill ${status === 'upcoming' ? 'active' : ''}`}
            onClick={() => set({ status: 'upcoming' })}
          >
            Coming Soon
          </button>
        </div>
      </div>

      {/* Aesthetic Filter Bar */}
      <div className="filter-bar-card">
        <div className="search-field-box">
          <Search size={16} className="search-field-icon" />
          <input
            id="f-search"
            className="form-control"
            placeholder="Search by title, actor, genre..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button
              className="clear-search-btn"
              onClick={() => {
                setSearchText('');
                set({ search: '' });
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-dropdown-group">
          <select
            id="f-genre"
            className="form-select"
            value={get('genre')}
            onChange={(e) => set({ genre: e.target.value })}
            aria-label="Filter by genre"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            id="f-lang"
            className="form-select"
            value={get('language')}
            onChange={(e) => set({ language: e.target.value })}
            aria-label="Filter by language"
          >
            <option value="">All Languages</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <select
            id="f-city"
            className="form-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="Filter by city"
          >
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            id="f-sort"
            className="form-select"
            value={get('sort') || 'newest'}
            onChange={(e) => set({ sort: e.target.value })}
            aria-label="Sort movies"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="rating">Sort: Top Rated (★)</option>
            <option value="title">Sort: Title A–Z</option>
          </select>

          {activeFilters && (
            <button
              className="btn btn-ghost btn-sm clear-filters-btn"
              onClick={() => {
                setParams({}, { replace: true });
                setCity('');
                setSearchText('');
              }}
              title="Reset all filters"
            >
              <X size={14} className="me-1" /> Reset
            </button>
          )}
        </div>
      </div>

      {status !== 'upcoming' && (
        <div className="mb-4">
          <div className="form-label text-muted-2 small fw-bold">SELECT SHOW DATE</div>
          <DateStrip value={get('date')} onChange={(d) => set({ date: d })} allowAny />
        </div>
      )}

      {error && (
        <div className="alert-err mb-3" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <MovieGridSkeleton count={12} />
      ) : data.items.length ? (
        <div className="movie-grid">
          {data.items.map((m) => (
            <MovieCard key={m._id} movie={m} />
          ))}
        </div>
      ) : (
        <div className="empty-box py-5">
          <Film size={48} className="text-muted-2 mb-3" />
          <h3>No Movies Found</h3>
          <p className="text-muted-2">Try adjusting your filters, searching another keyword, or resetting.</p>
          {activeFilters && (
            <button
              className="btn btn-brand mt-2"
              onClick={() => {
                setParams({}, { replace: true });
                setCity('');
                setSearchText('');
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      <Pager
        page={Number(get('page') || 1)}
        pages={data.pages}
        onChange={(p) => set({ page: String(p) })}
      />
    </div>
  );
}
