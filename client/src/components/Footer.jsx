import { Link } from 'react-router-dom';
import { Film, ShieldCheck, Heart, Sparkles, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing to IMovies Premier Club!');
      setEmail('');
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Top newsletter banner */}
        <div className="footer-newsletter">
          <div className="newsletter-text">
            <h4>Never Miss a Premiere</h4>
            <p>Get exclusive early access to blockbuster IMAX & 4DX ticket bookings.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-brand">
              Join VIP Club <Send size={15} className="ms-1" />
            </button>
          </form>
        </div>

        {/* Links grid */}
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="brand-icon-box">
                <Film size={20} className="brand-icon" />
              </div>
              <span className="brand-title fs-4">
                I<span className="brand-dot">·</span>MOVIES
              </span>
            </div>
            <p className="footer-about-text">
              The premier cinema ticketing platform. Experience the magic of movies in IMAX 4K Laser,
              Dolby Atmos 360°, and VIP Recliner Lounges with live real-time seat selection.
            </p>
            <div className="footer-badge-item">
              <ShieldCheck size={16} className="text-success" />
              <span>100% Certified Booking Security</span>
            </div>
          </div>

          <div className="footer-col">
            <h5>Movies</h5>
            <Link to="/movies">Now Showing</Link>
            <Link to="/movies?status=upcoming">Coming Soon</Link>
            <Link to="/movies?genre=Action">Action Blockbusters</Link>
            <Link to="/movies?genre=Sci-Fi">Sci-Fi & IMAX</Link>
          </div>

          <div className="footer-col">
            <h5>Cinema Formats</h5>
            <span>IMAX with Laser</span>
            <span>Dolby Atmos 7.1</span>
            <span>4DX Environmental</span>
            <span>VIP Director’s Cut</span>
          </div>

          <div className="footer-col">
            <h5>Account & Help</h5>
            <Link to="/bookings">My Bookings & Tickets</Link>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Create VIP Account</Link>
            <a href="#support" onClick={(e) => { e.preventDefault(); toast.info('Support: support@imovies.com'); }}>
              24/7 Concierge Support
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="small text-muted-2">
            © {new Date().getFullYear()} IMovies Entertainment Inc. All rights reserved.
          </div>
          <div className="footer-legal-links small">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
