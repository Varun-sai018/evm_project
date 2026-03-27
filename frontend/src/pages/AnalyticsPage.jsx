import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventAnalytics, getEventById } from '../services/eventService';
import { FiArrowLeft, FiPieChart, FiDollarSign, FiUsers, FiXCircle } from 'react-icons/fi';
import './Dashboard.css';

const AnalyticsPage = () => {
  const { eventId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventData, analyticsData] = await Promise.all([
          getEventById(eventId),
          getEventAnalytics(eventId)
        ]);
        setEvent(eventData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  if (loading) return <div className="container" style={{padding: '40px'}}>Loading Analytics...</div>;
  if (!analytics || !event) return <div className="container" style={{padding: '40px'}}>Failed to load data.</div>;

  const maxAttendees = Math.max(analytics.totalBookings, 10);
  const maxRevenue = Math.max(analytics.totalRevenue, 100);

  const Bar = ({ label, value, max, color, prefix = '', suffix = '' }) => (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 'bold' }}>
        <span>{label}</span>
        <span>{prefix}{value}{suffix}</span>
      </div>
      <div style={{ height: '30px', background: '#e9ecef', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(100, (value/max)*100)}%`, height: '100%', background: color, transition: 'width 1s' }}></div>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/admin" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <FiArrowLeft /> Back to Dashboard
        </Link>
      </div>

      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: '#333' }}>
          <FiPieChart /> Analytics for: {event.title}
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ padding: '20px', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
            <FiUsers size={32} color="#1976d2" style={{ marginBottom: '10px' }} />
            <h3 style={{ margin: 0, fontSize: '2rem', color: '#1976d2' }}>{analytics.totalBookings}</h3>
            <p style={{ margin: '5px 0 0 0', color: '#555' }}>Total Bookings</p>
          </div>
          <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
            <FiDollarSign size={32} color="#2e7d32" style={{ marginBottom: '10px' }} />
            <h3 style={{ margin: 0, fontSize: '2rem', color: '#2e7d32' }}>${analytics.totalRevenue}</h3>
            <p style={{ margin: '5px 0 0 0', color: '#555' }}>Total Revenue</p>
          </div>
          <div style={{ padding: '20px', background: '#ffebee', borderRadius: '8px', textAlign: 'center' }}>
            <FiXCircle size={32} color="#c62828" style={{ marginBottom: '10px' }} />
            <h3 style={{ margin: 0, fontSize: '2rem', color: '#c62828' }}>{analytics.cancellationCount}</h3>
            <p style={{ margin: '5px 0 0 0', color: '#555' }}>Cancellations</p>
          </div>
        </div>

        <h3 style={{ marginBottom: '20px' }}>Visual Breakdown</h3>
        <Bar label="Bookings Volume" value={analytics.totalBookings} max={maxAttendees} color="#4dabf7" />
        <Bar label="Total Revenue Collected" value={analytics.totalRevenue} max={maxRevenue} color="#69db7c" prefix="$" />
        <Bar label="Attendance Rate" value={Math.round(analytics.attendanceRate)} max={100} color="#ffd43b" suffix="%" />
        <Bar label="Lost from Cancellations" value={analytics.cancellationCount} max={analytics.totalBookings + analytics.cancellationCount || 10} color="#ff8787" />
      </div>
    </div>
  );
};

export default AnalyticsPage;
