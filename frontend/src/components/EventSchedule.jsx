import React, { useState, useEffect } from 'react';
import { getEventSessions } from '../services/scheduleService';
import { format } from 'date-fns';
import { FiClock, FiUser, FiInfo } from 'react-icons/fi';

const EventSchedule = ({ eventId }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, [eventId]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await getEventSessions(eventId);
      setSessions(data);
    } catch (err) {
      console.error('Failed to load sessions', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      return format(new Date(timeString), 'h:mm a');
    } catch (e) {
      return timeString;
    }
  };

  if (loading) return <div style={{ fontSize: '0.9rem', color: '#666', padding: '10px 0' }}>Loading Schedule...</div>;
  if (!sessions || sessions.length === 0) return null; // Hide if no schedule exists

  return (
    <div style={{ marginTop: '15px', background: '#f8f9fa', borderRadius: '8px', padding: '15px' }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <FiInfo /> Event Agenda
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sessions.map(session => (
          <div key={session.id} style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '6px', padding: '10px' }}>
            <h5 style={{ margin: '0 0 5px 0', color: '#0056b3', fontSize: '0.95rem' }}>{session.sessionTitle}</h5>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#555' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiUser /> {session.speaker || 'TBD'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiClock /> {formatTime(session.startTime)} - {formatTime(session.endTime)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSchedule;
