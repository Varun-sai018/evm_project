import React, { useState } from 'react';
import { processPayment } from '../services/eventService';
import { FiCreditCard, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import './Modal.css';

const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.cardNumber || !formData.expiry || !formData.cvv) {
      setError('Please fill in all card details.');
      return;
    }
    
    try {
      setLoading(true);
      // Simulate real credit card string format safely for backend
      const details = `Card ending in ${formData.cardNumber.slice(-4)}`;
      const confirmedBooking = await processPayment(booking.id, details);
      onSuccess(confirmedBooking);
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2>Complete Payment</h2>
          <button className="btn-icon" onClick={onClose}><FiX /></button>
        </div>
        
        <div className="modal-body">
          <p>You are booking: <strong>{booking.event.title}</strong></p>
          <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total: ${booking.amount || booking.event.ticketPrice || 0}</span>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d32f2f', marginBottom: '1rem' }}>
              <FiAlertCircle /> <span>{error}</span>
            </div>
          )}

          <form onSubmit={handlePayment}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name on Card</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Card Number</label>
              <div style={{ position: 'relative' }}>
                <FiCreditCard style={{ position: 'absolute', top: '12px', left: '10px', color: '#6c757d' }} />
                <input type="text" name="cardNumber" className="form-input" value={formData.cardNumber} onChange={handleChange} placeholder="0000 0000 0000 0000" style={{ paddingLeft: '35px' }} required minLength={16} maxLength={19} />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Expiry</label>
                <input type="text" name="expiry" className="form-input" value={formData.expiry} onChange={handleChange} placeholder="MM/YY" required maxLength={5} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>CVV</label>
                <input type="password" name="cvv" className="form-input" value={formData.cvv} onChange={handleChange} placeholder="123" required minLength={3} maxLength={4} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Processing...' : `Pay $${booking.amount || booking.event.ticketPrice || 0}`}
              {!loading && <FiCheckCircle style={{ marginLeft: '8px' }} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
