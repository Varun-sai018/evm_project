import { useState, useEffect } from 'react';
import { FiX, FiUsers, FiMail, FiLoader, FiAlertCircle } from 'react-icons/fi';
import './AttendeesModal.css';
import { API_BASE_URL } from '../config';

const AttendeesModal = ({ eventId, eventTitle, onClose }) => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/bookings/event/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to load attendees');
        }
        
        const bookings = await response.json();
        // Extract users from bookings and filter out duplicates if needed
        const usersMap = new Map();
        bookings.forEach(b => {
          if (b.user && b.status !== 'CANCELLED') {
            usersMap.set(b.user.id, { ...b.user, status: b.status, bookingId: b.id, bookedAt: b.bookedAt });
          }
        });
        
        setAttendees(Array.from(usersMap.values()));
      } catch (err) {
        console.error(err);
        setError('Failed to fetch attendee list.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendees();
  }, [eventId]);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content attendees-modal">
          <button className="modal-close" onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px' }}>
            <FiX size={24} />
          </button>
          
          <div className="modal-header" style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '15px' }}>
            <h2><FiUsers /> Attendees List</h2>
            <p className="modal-subtitle">{eventTitle}</p>
          </div>
          
          <div className="modal-body" style={{ marginTop: '20px' }}>
            {loading ? (
              <div className="attendees-loading">
                <FiLoader className="spinner" />
                <span>Loading attendees...</span>
              </div>
            ) : error ? (
              <div className="attendees-error">
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            ) : attendees.length === 0 ? (
              <div className="attendees-empty">
                <div className="empty-icon"><FiUsers size={40} /></div>
                <h3>No attendees yet</h3>
                <p>When users reserve tickets, they will appear here.</p>
              </div>
            ) : (
              <div className="attendees-list">
                <div className="attendees-count">
                  <span className="badge badge-primary">{attendees.length} Total Attendees</span>
                </div>
                {attendees.map(user => (
                  <div key={user.id} className="attendee-item">
                    <div className="attendee-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="attendee-info">
                      <h4>{user.name}</h4>
                      <span className="attendee-email"><FiMail size={12} /> {user.email}</span>
                    </div>
                    <div className="attendee-status">
                      <span className={`badge ${user.status === 'RESERVED' ? 'badge-warning' : 'badge-success'}`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="modal-footer" style={{ borderTop: '1px solid #eaeaea', paddingTop: '15px', marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeesModal;
