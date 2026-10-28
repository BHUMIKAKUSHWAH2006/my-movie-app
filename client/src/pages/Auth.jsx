import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Film, Sparkles, Mail, Lock, User as UserIcon, Phone, CheckCircle } from 'lucide-react';
import { login, register } from '../features/authSlice';

function AuthShell({ title, lead, children }) {
  return (
    <div className="auth-wrapper">
      <div className="auth-art-pane">
        <div className="auth-art-glow" />
        <div className="auth-art-content">
          <div className="brand-logo-container mb-4">
            <div className="brand-icon-box">
              <Film size={20} className="brand-icon" />
            </div>
            <span className="brand-title fs-3">
              I<span className="brand-dot">·</span>MOVIES
            </span>
          </div>

          <h1 className="auth-headline">{title}</h1>
          <p className="auth-subline">{lead}</p>

          <div className="auth-perks mt-4">
            <div className="auth-perk-item">
              <CheckCircle size={16} className="text-warning" />
              <span>Real-time instant seat reservation</span>
            </div>
            <div className="auth-perk-item">
              <CheckCircle size={16} className="text-warning" />
              <span>Free cancellation up to 2 hours prior</span>
            </div>
            <div className="auth-perk-item">
              <CheckCircle size={16} className="text-warning" />
              <span>Direct WhatsApp & Apple Wallet M-Tickets</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-pane">
        <div className="auth-glass-card">{children}</div>
      </div>
    </div>
  );
}

function useAfterAuth() {
  const loc = useLocation();
  const user = useSelector((s) => s.auth.user);
  const to = loc.state?.from || '/';
  return { user, to };
}

export function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const loading = useSelector((s) => s.auth.loading);
  const { user, to } = useAfterAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (user) return <Navigate to={to} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await dispatch(login(form));
    if (login.fulfilled.match(res)) {
      toast.success(`Welcome back, ${res.payload.user.name.split(' ')[0]}!`);
      nav(res.payload.user.role === 'admin' && to === '/' ? '/admin' : to, { replace: true });
    } else {
      setError(res.payload);
    }
  };

  return (
    <AuthShell
      title="Experience Cinema Like Never Before."
      lead="Sign in to unlock exclusive member pricing, instant seat locking, and seamless digital boarding passes."
    >
      <form onSubmit={submit} noValidate>
        <div className="text-center mb-4">
          <h2 className="h3 fw-bold text-white">Welcome Back</h2>
          <p className="text-muted-2 small">Sign in to manage your bookings and passes</p>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <div className="input-group-custom">
            <input
              id="email"
              type="email"
              className="form-control"
              autoComplete="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="pw">
            Password
          </label>
          <div className="input-group-custom">
            <input
              id="pw"
              type="password"
              className="form-control"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
        </div>

        {error && (
          <div className="alert-err mb-3" role="alert">
            {error}
          </div>
        )}

        <button className="btn btn-brand w-100 btn-lg auth-submit-btn" disabled={loading}>
          {loading ? 'Authenticating…' : 'Sign In to IMovies'}
        </button>

        <div className="demo-credentials-box mt-3 p-2 text-center rounded border border-secondary border-opacity-25 bg-dark">
          <span className="small text-muted-2 d-block">Quick Demo Accounts:</span>
          <div className="d-flex justify-content-center gap-2 mt-1">
            <button
              type="button"
              className="btn btn-subtle btn-sm"
              onClick={() => setForm({ email: 'bhumika@imovies.com', password: 'User@123' })}
            >
              Demo User
            </button>
            <button
              type="button"
              className="btn btn-subtle btn-sm"
              onClick={() => setForm({ email: 'admin@imovies.com', password: 'Admin@123' })}
            >
              Demo Admin
            </button>
          </div>
        </div>

        <p className="text-muted-2 text-center mt-4 mb-0 small">
          Don’t have an account?{' '}
          <Link to="/register" state={{ from: to }} className="text-warning fw-bold">
            Create VIP Account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const loading = useSelector((s) => s.auth.loading);
  const { user, to } = useAfterAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');

  if (user) return <Navigate to={to} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2) return setError('Enter your full name.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    const res = await dispatch(register(form));
    if (register.fulfilled.match(res)) {
      toast.success('Account created! Welcome to IMovies Premier Club.');
      nav(to, { replace: true });
    } else {
      setError(res.payload);
    }
    return undefined;
  };

  const f = (k) => ({
    value: form[k],
    onChange: (e) => setForm({ ...form, [k]: e.target.value }),
  });

  return (
    <AuthShell
      title="Reserve Prime Seats with Zero Queues."
      lead="Create your complimentary account to access IMAX Laser early bookings, contactless food orders, and instant refunds."
    >
      <form onSubmit={submit} noValidate>
        <div className="text-center mb-4">
          <h2 className="h3 fw-bold text-white">Join Premier Club</h2>
          <p className="text-muted-2 small">Free lifetime membership & perks</p>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            className="form-control"
            placeholder="e.g. Bhumika Kushwah"
            autoComplete="name"
            {...f('name')}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="remail">
            Email Address
          </label>
          <input
            id="remail"
            type="email"
            className="form-control"
            placeholder="name@example.com"
            autoComplete="email"
            {...f('email')}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="phone">
            Mobile Number (Optional)
          </label>
          <input
            id="phone"
            type="tel"
            className="form-control"
            placeholder="e.g. 9876543210"
            autoComplete="tel"
            {...f('phone')}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="rpw">
            Create Password
          </label>
          <input
            id="rpw"
            type="password"
            className="form-control"
            placeholder="Min 6 characters"
            autoComplete="new-password"
            {...f('password')}
          />
        </div>

        {error && (
          <div className="alert-err mb-3" role="alert">
            {error}
          </div>
        )}

        <button className="btn btn-brand w-100 btn-lg auth-submit-btn" disabled={loading}>
          {loading ? 'Creating Member Pass…' : 'Create VIP Account'}
        </button>

        <p className="text-muted-2 text-center mt-4 mb-0 small">
          Already a member?{' '}
          <Link to="/login" state={{ from: to }} className="text-warning fw-bold">
            Sign In
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
