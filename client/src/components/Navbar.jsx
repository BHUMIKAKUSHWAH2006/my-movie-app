import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Film,
  Search,
  MapPin,
  Bell,
  Ticket,
  Shield,
  LogOut,
  Menu as MenuIcon,
  X,
  Sparkles,
  ChevronDown,
  User,
} from 'lucide-react';
import { logout } from '../features/authSlice';
import { useCity } from '../context/CityContext';
import api from '../api';

const BrandLogo = () => (
  <div className="brand-logo-container">
    <div className="brand-icon-box">
      <Film className="brand-icon" size={20} />
      <span className="brand-glow" />
    </div>
    <div className="brand-text-group">
      <span className="brand-title">
        I<span className="brand-dot">·</span>MOVIES
      </span>
      <span className="brand-sub">CINEMA EXPERIENCE</span>
    </div>
  </div>
);

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const loc = useLocation();
  const { city, setCity, cities } = useCity();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [bell, setBell] = useState(false);
  const [q, setQ] = useState('');
  const [notes, setNotes] = useState({ items: [], unread: 0 });
  const wrap = useRef(null);

  // Close everything on navigation
  useEffect(() => {
    setOpen(false);
    setMenu(false);
    setBell(false);
  }, [loc.pathname]);

  // Close popovers on outside click
  useEffect(() => {
    const h = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) {
        setMenu(false);
        setBell(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Notifications
  useEffect(() => {
    if (!user) return undefined;
    const load = () =>
      api
        .get('/notifications')
        .then((r) => setNotes(r.data))
        .catch(() => {});
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [user, loc.pathname]);

  const openBell = () => {
    setBell((b) => !b);
    setMenu(false);
    if (notes.unread > 0) {
      api
        .put('/notifications/read')
        .then(() => setNotes((n) => ({ ...n, unread: 0 })))
        .catch(() => {});
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      nav(`/movies?search=${encodeURIComponent(q.trim())}`);
      setQ('');
    }
  };

  return (
    <header className={`site-nav ${open ? 'open' : ''}`}>
      <div className="container">
        <div className="bar">
          <Link to="/" className="brand" aria-label="IMovies Home">
            <BrandLogo />
          </Link>

          <button
            className="icon-btn nav-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle Navigation"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <MenuIcon size={20} />}
          </button>

          <nav className="nav-links" aria-label="Main Navigation">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/movies">Movies</NavLink>
            <NavLink to="/movies?status=upcoming">Coming Soon</NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="admin-link">
                <Shield size={14} className="me-1" /> Admin
              </NavLink>
            )}
          </nav>

          <div className="nav-tools" ref={wrap}>
            <form className="nav-search" onSubmit={submit} role="search">
              <Search className="search-icon" size={16} />
              <input
                className="form-control"
                placeholder="Search movies, genres..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search movies"
              />
              <span className="search-badge">⌘K</span>
            </form>

            <div className="city-select-box">
              <MapPin size={15} className="city-pin-icon" />
              <select
                className="form-select city-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                aria-label="Choose your city"
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {user ? (
              <>
                <div className="menu-wrap">
                  <button
                    className="icon-btn notif-btn"
                    onClick={openBell}
                    aria-label={`Notifications, ${notes.unread} unread`}
                  >
                    <Bell size={18} />
                    {notes.unread > 0 && <span className="dot">{notes.unread}</span>}
                  </button>
                  {bell && (
                    <div className="menu-pop notif-pop">
                      <div className="notif-header">
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fw-bold">Notifications</span>
                          <span className="badge bg-danger rounded-pill">{notes.unread} new</span>
                        </div>
                      </div>
                      <div className="notif-list">
                        {notes.items.length === 0 ? (
                          <p className="text-muted-2 p-3 mb-0 text-center small">No notifications yet.</p>
                        ) : (
                          notes.items.map((n) => (
                            <div key={n._id} className={`notif ${n.read ? '' : 'unread'}`}>
                              <b className="d-flex align-items-center gap-1">
                                {!n.read && <span className="unread-dot" />}
                                {n.title}
                              </b>
                              <span className="text-muted-2 small">{n.message}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="menu-wrap">
                  <button
                    className="avatar-btn"
                    onClick={() => {
                      setMenu((m) => !m);
                      setBell(false);
                    }}
                    aria-label="User Account Menu"
                    aria-expanded={menu}
                  >
                    <span className="avatar-letter">{user.name?.[0]?.toUpperCase() || 'U'}</span>
                    <span className="avatar-name d-none d-xl-inline">{user.name?.split(' ')[0]}</span>
                    <ChevronDown size={14} className="avatar-arrow text-muted-2" />
                  </button>

                  {menu && (
                    <div className="menu-pop user-menu-pop">
                      <div className="who">
                        <div className="fw-bold text-white">{user.name}</div>
                        <div className="text-muted-2 small">{user.email}</div>
                        {user.role === 'admin' && <span className="badge bg-warning text-dark mt-1">Admin</span>}
                      </div>
                      <div className="menu-divider" />
                      <Link to="/bookings" className="menu-item">
                        <Ticket size={16} /> My Bookings
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="menu-item">
                          <Shield size={16} /> Admin Dashboard
                        </Link>
                      )}
                      <div className="menu-divider" />
                      <button
                        className="menu-item text-danger"
                        onClick={() => {
                          dispatch(logout());
                          nav('/');
                        }}
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-btns">
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-brand btn-sm">
                  <Sparkles size={14} className="me-1" /> Get VIP Pass
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
