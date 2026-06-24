import { FiCheckCircle } from 'react-icons/fi';
import Modal from './Modal';
import './EventForm.css';

const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const reference = booking?.bookingReference || "PENDING";
  const ticketPrice = booking?.event?.ticketPrice || 0;

  const handleClose = () => {
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  return (
    <Modal isOpen={true} onClose={handleClose} title="Reservation Confirmed!">
      <div className="event-form" style={{ textAlign: 'center', padding: '20px' }}>
        <FiCheckCircle size={64} style={{ color: 'var(--success-color)', marginBottom: '15px' }} />
        <h2 style={{ marginBottom: '10px' }}>Your ticket is reserved!</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
          Show this QR Code at the venue counter to pay cash and claim your physical pass.
        </p>

        <div style={{
          background: 'white',
          padding: '20px',
          display: 'inline-block',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          {/* Mock QR Code using CSS grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 20px)',
            gridTemplateRows: 'repeat(5, 20px)',
            gap: '2px',
            background: 'white'
          }}>
            {[...Array(25)].map((_, i) => (
              <div key={i} style={{
                background: Math.random() > 0.4 ? '#000' : '#fff',
                borderRadius: '2px'
              }}></div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--background-color)', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>Booking Reference</p>
          <h3 style={{ margin: '5px 0', letterSpacing: '2px', color: 'var(--primary-color)' }}>{reference}</h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderTop: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <span style={{ fontWeight: '600' }}>{booking?.event?.title}</span>
          <span style={{ fontWeight: 'bold', color: 'var(--success-color)' }}>Due: ₹{Number(ticketPrice).toFixed(2)}</span>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleClose} style={{ width: '100%' }}>
          Done
        </button>
      </div>
    </Modal>
  );
};

export default PaymentModal;
