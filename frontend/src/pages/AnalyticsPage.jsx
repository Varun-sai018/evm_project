import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLoader, FiAlertCircle, FiUsers, FiDollarSign, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { getEventAnalytics } from '../services/eventService';
import './Dashboard.css';

const AnalyticsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getEventAnalytics(eventId);
        setAnalytics(data);
      } catch (err) {
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [eventId]);

  if (loading) return <div className="dashboard-loading"><FiLoader className="spinner" /></div>;
  if (error) return <div className="dashboard-error"><FiAlertCircle /> <span>{error}</span></div>;
  if (!analytics) return null;

  const total = analytics.totalBookings || 1; // avoid divide by zero
  const confWidth = `${(analytics.confirmedBookings / total) * 100}%`;
  const pendWidth = `${(analytics.pendingBookings / total) * 100}%`;
  const cancWidth = `${(analytics.cancelledBookings / total) * 100}%`;

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="btn btn-outline" onClick={() => navigate('/admin')}>
            <FiArrowLeft /> Back
          </button>
          <h1 className="dashboard-title">Analytics: {analytics.eventTitle}</h1>
        </div>

        <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="stat-card" style={{ padding: '20px', background: 'var(--card-bg)', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
            <FiUsers size={24} style={{ color: 'var(--primary-color)' }} />
            <h3>{analytics.totalBookings}</h3>
            <p style={{ color: 'var(--text-light)' }}>Total Bookings</p>
          </div>
          <div className="stat-card" style={{ padding: '20px', background: 'var(--card-bg)', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
            <FiCheckCircle size={24} style={{ color: 'var(--success-color)' }} />
            <h3>{analytics.confirmedBookings}</h3>
            <p style={{ color: 'var(--text-light)' }}>Confirmed</p>
          </div>
          <div className="stat-card" style={{ padding: '20px', background: 'var(--card-bg)', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
            <FiClock size={24} style={{ color: 'var(--warning-color)' }} />
            <h3>{analytics.pendingBookings}</h3>
            <p style={{ color: 'var(--text-light)' }}>Pending</p>
          </div>
          <div className="stat-card" style={{ padding: '20px', background: 'var(--card-bg)', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
            <FiXCircle size={24} style={{ color: 'var(--danger-color)' }} />
            <h3>{analytics.cancelledBookings}</h3>
            <p style={{ color: 'var(--text-light)' }}>Cancelled</p>
          </div>
          <div className="stat-card" style={{ padding: '20px', background: 'var(--card-bg)', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
            <FiDollarSign size={24} style={{ color: 'var(--success-color)' }} />
            <h3>₹{analytics.totalRevenue.toFixed(2)}</h3>
            <p style={{ color: 'var(--text-light)' }}>Total Revenue</p>
          </div>
          <div className="stat-card" style={{ padding: '20px', background: 'var(--card-bg)', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
            <FiUsers size={24} style={{ color: '#8b5cf6' }} />
            <h3>{analytics.attendanceRate}%</h3>
            <p style={{ color: 'var(--text-light)' }}>Attendance Rate</p>
          </div>
        </div>

        <div className="chart-container" style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
          <h3>Bookings Breakdown</h3>
          <div style={{ height: '30px', width: '100%', display: 'flex', borderRadius: '15px', overflow: 'hidden', marginTop: '20px' }}>
            <div style={{ width: confWidth, background: 'var(--success-color)' }} title={`Confirmed: ${analytics.confirmedBookings}`}></div>
            <div style={{ width: pendWidth, background: 'var(--warning-color)' }} title={`Pending: ${analytics.pendingBookings}`}></div>
            <div style={{ width: cancWidth, background: 'var(--danger-color)' }} title={`Cancelled: ${analytics.cancelledBookings}`}></div>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '15px', justifyContent: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--success-color)' }}></div> Confirmed</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--warning-color)' }}></div> Pending</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--danger-color)' }}></div> Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
