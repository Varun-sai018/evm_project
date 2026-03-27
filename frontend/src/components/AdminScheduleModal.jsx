import React, { useState, useEffect } from 'react';
import { getEventSessions, addSession, deleteSession } from '../services/scheduleService';
import { FiX, FiTrash2, FiPlus } from 'react-icons/fi';
import '../components/Modal.css';

const AdminScheduleModal = ({ isOpen, onClose, event }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sessionTitle: '',
    speaker: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    if (isOpen && event) {
      fetchSessions();
    }
  }, [isOpen, event]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await getEventSessions(event.id);
      setSessions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sessionTitle || !formData.startTime || !formData.endTime) return;
    try {
      setLoading(true);
      await addSession(event.id, formData);
      setFormData({ sessionTitle: '', speaker: '', startTime: '', endTime: '' });
      fetchSessions(); // refresh
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId) => {
    try {
      setLoading(true);
      await deleteSession(sessionId);
      fetchSessions();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2>Manage Schedule: {event.title}</h2>
          <button className="btn-icon" onClick={onClose}><FiX /></button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: '20px' }}>
            <h4>Existing Sessions</h4>
            {loading && sessions.length === 0 ? <p>Loading...</p> : null}
            {!loading && sessions.length === 0 ? <p style={{ color: '#666' }}>No sessions added yet.</p> : null}
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {sessions.map(s => (
                <li key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '10px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                  <div>
                    <strong>{s.sessionTitle}</strong> <span style={{ color: '#555', fontSize: '0.9rem' }}>({s.speaker || 'No speaker'})</span>
                    <br />
                    <small style={{ color: '#888' }}>
                      {new Date(s.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(s.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </small>
                  </div>
                  <button onClick={() => handleDelete(s.id)} className="btn-icon" style={{ color: '#d32f2f' }}>
                    <FiTrash2 />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

          <form onSubmit={handleSubmit}>
            <h4>Add New Session</h4>
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label>Session Title *</label>
              <input type="text" name="sessionTitle" className="form-input" value={formData.sessionTitle} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label>Speaker Name</label>
              <input type="text" name="speaker" className="form-input" value={formData.speaker} onChange={handleChange} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Start Time *</label>
                <input type="datetime-local" name="startTime" className="form-input" value={formData.startTime} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>End Time *</label>
                <input type="datetime-local" name="endTime" className="form-input" value={formData.endTime} onChange={handleChange} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiPlus /> Add Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminScheduleModal;
