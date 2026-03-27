import { useState } from 'react';
import Modal from './Modal';
import { processPayment } from '../services/eventService';
import './EventForm.css';

const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const ticketPrice = booking?.event?.ticketPrice || 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (paymentError) setPaymentError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s+/g, ''))) newErrors.cardNumber = 'Card number must be 16 digits';
    if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) newErrors.expiry = 'Expiry must be MM/YY';
    if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'CVV must be 3 or 4 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await processPayment(booking.id, ticketPrice);
      alert('Payment processed successfully!');
      onSuccess();
    } catch (err) {
      console.error('Payment failed:', err);
      setPaymentError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Process Payment">
      <form onSubmit={handleSubmit} className="event-form">
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h4>Paying for: {booking?.event?.title}</h4>
          <h3>Amount Due: ${ticketPrice.toFixed(2)}</h3>
        </div>

        {paymentError && <div className="form-error" style={{ marginBottom: '15px' }}>{paymentError}</div>}

        <div className="form-group">
          <label className="form-label">Cardholder Name</label>
          <input type="text" name="cardName" className={`form-input ${errors.cardName ? 'error' : ''}`} value={formData.cardName} onChange={handleChange} placeholder="John Doe" />
          {errors.cardName && <p className="form-error">{errors.cardName}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Card Number</label>
          <input type="text" name="cardNumber" className={`form-input ${errors.cardNumber ? 'error' : ''}`} value={formData.cardNumber} onChange={handleChange} placeholder="1234 5678 9101 1121" maxLength="19" />
          {errors.cardNumber && <p className="form-error">{errors.cardNumber}</p>}
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Expiry (MM/YY)</label>
            <input type="text" name="expiry" className={`form-input ${errors.expiry ? 'error' : ''}`} value={formData.expiry} onChange={handleChange} placeholder="12/26" maxLength="5" />
            {errors.expiry && <p className="form-error">{errors.expiry}</p>}
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">CVV</label>
            <input type="text" name="cvv" className={`form-input ${errors.cvv ? 'error' : ''}`} value={formData.cvv} onChange={handleChange} placeholder="123" maxLength="4" />
            {errors.cvv && <p className="form-error">{errors.cvv}</p>}
          </div>
        </div>

        <div className="event-form-actions">
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Processing...' : `Pay $${ticketPrice.toFixed(2)}`}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;
