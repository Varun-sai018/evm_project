import { useState, useEffect } from 'react';
import { FiLoader, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';
import { getPendingEvents, approveEvent, rejectEvent } from '../services/eventService';
import './Dashboard.css';

const AdminApprovals = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      setLoading(true);
      const data = await getPendingEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching pending events:', err);
      setError('Failed to load pending events.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveEvent(id);
      fetchPendingEvents();
    } catch (err) {
      alert('Failed to approve event.');
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }
    try {
      await rejectEvent(id, rejectionReason);
      setRejectingId(null);
      setRejectionReason('');
      fetchPendingEvents();
    } catch (err) {
      alert('Failed to reject event.');
    }
  };

  return (
    <div className="dashboard admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Pending Event Approvals</h1>
        </div>

        {error && (
          <div className="dashboard-error">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        {loading && !error && (
          <div className="dashboard-loading">
            <FiLoader className="spinner" />
            <span>Loading pending events...</span>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="dashboard-empty">
            <h3>No pending events</h3>
            <p>All events have been reviewed.</p>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="events-grid">
            {events.map(event => (
              <div key={event.id} className="event-card" style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--card-bg)' }}>
                <h3>{event.title}</h3>
                <p><strong>Date:</strong> {new Date(event.startTime).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Organizer ID:</strong> {event.organizerId}</p>
                
                {rejectingId === event.id ? (
                  <div style={{ marginTop: '15px' }}>
                    <textarea 
                      placeholder="Reason for rejection" 
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className="btn btn-danger" onClick={() => handleReject(event.id)}>Confirm Reject</button>
                      <button className="btn btn-outline" onClick={() => { setRejectingId(null); setRejectionReason(''); }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button className="btn btn-primary" onClick={() => handleApprove(event.id)}>
                      <FiCheck /> Approve
                    </button>
                    <button className="btn btn-danger" onClick={() => setRejectingId(event.id)}>
                      <FiX /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovals;
