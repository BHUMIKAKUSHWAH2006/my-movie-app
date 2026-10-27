import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  CheckCircle2,
  Printer,
  Share2,
  Ticket as TicketIcon,
  XCircle,
  Film,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import api, { errMsg } from '../api';
import Ticket from '../components/Ticket';
import Modal from '../components/Modal';
import { rupee } from '../utils/format';

export default function BookingView() {
  const { id } = useParams();
  const [b, setB] = useState(null);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get(`/bookings/${id}`)
      .then((r) => setB(r.data))
      .catch((e) => setError(errMsg(e)));
  }, [id]);

  const cancel = async () => {
    setBusy(true);
    try {
      const { data } = await api.put(`/bookings/${id}/cancel`);
      setB({ ...b, ...data, canCancel: false });
      toast.success('Booking cancelled. Your refund has been initiated.');
      setConfirm(false);
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Movie Ticket - ${b.movie.title}`,
        text: `I'm watching ${b.movie.title} at ${b.theatre.name}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Ticket link copied to clipboard!');
    }
  };

  if (error) {
    return (
      <div className="container page">
        <div className="alert-err">{error}</div>
      </div>
    );
  }

  if (!b) {
    return (
      <div className="container page">
        <div className="skeleton" style={{ height: 320, borderRadius: 20 }} />
      </div>
    );
  }

  const cancelled = b.status === 'cancelled';

  return (
    <div className="container page" style={{ maxWidth: 860 }}>
      {/* Confirmation Banner */}
      <div className={`booking-status-banner mb-4 ${cancelled ? 'status-cancelled' : 'status-confirmed'}`}>
        <div className="d-flex align-items-center gap-3">
          {cancelled ? (
            <XCircle size={36} className="text-danger flex-shrink-0" />
          ) : (
            <CheckCircle2 size={36} className="text-success flex-shrink-0" />
          )}
          <div>
            <h1 className="h3 fw-bold text-white mb-1">
              {cancelled ? 'Booking Cancelled' : 'Booking Confirmed! You’re All Set'}
            </h1>
            <p className="text-muted-2 mb-0 small">
              {cancelled
                ? `${rupee(b.total)} will be refunded to your original payment method in 2–4 hours.`
                : 'Present this digital pass at the cinema turnstile. A copy has been saved to My Bookings.'}
            </p>
          </div>
        </div>
      </div>

      {/* Aesthetic Ticket Card */}
      <Ticket booking={b} />

      {/* Payment details */}
      <div className="panel payment-summary-panel mt-4">
        <h4 className="h6 fw-bold text-white mb-3 d-flex align-items-center gap-2">
          <ShieldCheck size={16} className="text-warning" /> Payment & Billing Details
        </h4>
        <div className="sum-row">
          <span>Tickets Subtotal</span>
          <span>{rupee(b.subtotal)}</span>
        </div>
        <div className="sum-row">
          <span>Convenience Fee & Taxes</span>
          <span>{rupee(b.convenienceFee)}</span>
        </div>
        <div className="sum-row total">
          <span>Total Paid</span>
          <span className="text-warning">{rupee(b.total)}</span>
        </div>
        {b.payment && (
          <div className="payment-meta-badge mt-3">
            <span>Payment Mode: <b>{b.payment.method}</b></span>
            {b.payment.last4 && <span>Card Ending: <b>{b.payment.last4}</b></span>}
            <span>Ref No: <code>{b.payment.transactionId}</code></span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="d-flex flex-wrap gap-2 mt-4 no-print align-items-center">
        <Link to="/bookings" className="btn btn-ghost">
          <TicketIcon size={16} className="me-1" /> My Bookings
        </Link>
        {!cancelled && (
          <>
            <button className="btn btn-ghost" onClick={() => window.print()}>
              <Printer size={16} className="me-1" /> Print / Save Ticket
            </button>
            <button className="btn btn-ghost" onClick={handleShare}>
              <Share2 size={16} className="me-1" /> Share
            </button>
          </>
        )}
        {b.canCancel && (
          <button className="btn btn-ghost text-danger border-danger border-opacity-25" onClick={() => setConfirm(true)}>
            Cancel Booking
          </button>
        )}
        <Link to="/movies" className="btn btn-brand ms-auto">
          Explore More Movies <ArrowRight size={16} className="ms-1" />
        </Link>
      </div>

      {!cancelled && !b.canCancel && (
        <p className="hint text-center mt-3 text-muted-2 small">
          Cancellation policy: Free cancellation closes 2 hours prior to showtime.
        </p>
      )}

      {confirm && (
        <Modal title="Cancel this reservation?" onClose={() => setConfirm(false)}>
          <p className="text-muted-2">
            Are you sure you want to cancel? Your {b.seats.length}{' '}
            {b.seats.length === 1 ? 'seat' : 'seats'} will be released for others, and {rupee(b.total)} will be refunded immediately.
          </p>
          <div className="d-flex gap-2 justify-content-end mt-4">
            <button className="btn btn-ghost" onClick={() => setConfirm(false)}>
              Keep My Seats
            </button>
            <button className="btn btn-brand" disabled={busy} onClick={cancel}>
              {busy ? 'Processing Refund…' : 'Yes, Cancel Reservation'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
