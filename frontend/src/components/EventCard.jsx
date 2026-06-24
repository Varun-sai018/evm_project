import { format } from 'date-fns';
import { FiCalendar, FiClock, FiEdit, FiTrash, FiList, FiPieChart, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import EventSchedule from './EventSchedule';
import './EventCard.css';

const EventCard = ({ 
  event, 
  isAdmin = false, 
  isBooked = false,
  bookingStatus = null,
  onEdit,
  onDelete,
  onCancelBooking,
  onPayNow,
  onManageSchedule,
  onAnalytics,
  onViewAttendees
}) => {
  const navigate = useNavigate();
  const isCompleted = new Date(event.endTime) < new Date();
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'h:mm a');
    } catch {
      return dateString;
    }
  };

  const getImageUrl = () => {
    const category = event.category || 'technology';
    const keywordMap = {
      'technology': 'technology,conference',
      'music': 'concert,music',
      'business': 'business,networking',
      'sports': 'sports,stadium',
      'arts': 'art,gallery',
      'food': 'food,dining',
      'education': 'education,seminar',
      'other': 'event,celebration'
    };
    const kw = keywordMap[category] || 'event';
    // Adding event.id to ensure different events with same category get different random images
    return `url(https://source.unsplash.com/random/800x600/?${kw}&sig=${event.id})`;
  };

  const getCategoryLabel = () => {
    const categoryMap = {
      'technology': '💻 Technology',
      'music': '🎵 Music',
      'business': '💼 Business',
      'sports': '⚽ Sports',
      'arts': '🎨 Arts',
      'food': '🍔 Food',
      'education': '📚 Education',
      'other': '✨ Event'
    };
    return categoryMap[event.category || 'technology'] || 'Event';
  };

  return (
    <div className="event-card modern-event-card">
      <div 
        className="event-card-image" 
        style={{ 
          backgroundImage: getImageUrl()
        }}
      >
        <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', backdropFilter: 'blur(4px)', zIndex: 5 }}>
          {getCategoryLabel()}
        </div>
        <div className="event-card-image-overlay">
          <div className="event-date-badge">
            <span className="month">{formatDate(event.startTime).split(' ')[0]}</span>
            <span className="day">{formatDate(event.startTime).split(' ')[1]?.replace(',', '') || ''}</span>
          </div>
          {isCompleted && (
            <div className="completed-stamp">
              COMPLETED
            </div>
          )}
        </div>
      </div>
      
      <div className="event-card-content">
        <div className="event-card-header" style={{ alignItems: 'flex-start' }}>
          <div>
            <h3 className="event-card-title" style={{ cursor: 'pointer', color: 'var(--primary-color)' }} onClick={() => navigate(`/event/${event.id}`)}>
              {event.title}
            </h3>
            {event.capacity && (
              <span className="capacity-badge">
                <FiUsers size={12} /> Capacity: {event.capacity}
              </span>
            )}
          </div>
        
        {isAdmin && (
          <div className="event-card-actions">
            <button 
              onClick={() => onViewAttendees && onViewAttendees(event.id)} 
              className="btn-icon event-action-btn"
              title="View Attendees"
              style={{ color: '#17a2b8' }}
            >
              <FiUsers />
            </button>
            <button 
              onClick={() => onAnalytics && onAnalytics(event.id)} 
              className="btn-icon event-action-btn"
              title="View Analytics"
              style={{ color: '#28a745' }}
            >
              <FiPieChart />
            </button>
            <button 
              onClick={() => onManageSchedule && onManageSchedule(event)} 
              className="btn-icon event-action-btn"
              title="Manage Schedule"
              style={{ color: '#0056b3' }}
            >
              <FiList />
            </button>
            <button 
              onClick={() => onEdit(event)} 
              className="btn-icon event-action-btn edit"
              title="Edit event"
            >
              <FiEdit />
            </button>
            <button 
              onClick={() => onDelete(event.id)} 
              className="btn-icon event-action-btn delete"
              title="Delete event"
            >
              <FiTrash />
            </button>
          </div>
        )}
      </div>
      
      <p className="event-card-description">{event.description}</p>
      
      <div className="event-card-meta">
        <div className="event-card-meta-item">
          <FiCalendar className="event-card-icon" />
          <span>{formatDate(event.startTime)}</span>
        </div>
        <div className="event-card-meta-item">
          <FiClock className="event-card-icon" />
          <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
        </div>
      </div>
      
      <EventSchedule eventId={event.id} />
      
      {!isAdmin && (
        <div className="event-card-footer" style={{ gap: '10px', marginTop: '15px' }}>
          {isCompleted ? (
            <button 
              className="btn btn-secondary btn-sm"
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed', width: '100%' }}
            >
              Event Completed
            </button>
          ) : isBooked && onCancelBooking ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px', width: '100%'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span className={`badge ${bookingStatus === 'RESERVED' ? 'badge-warning' : 'badge-success'}`} style={{
                  padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', 
                  backgroundColor: bookingStatus === 'RESERVED' ? '#fff3cd' : '#d4edda',
                  color: bookingStatus === 'RESERVED' ? '#856404' : '#155724'
                }}>
                  {bookingStatus || 'CONFIRMED'}
                </span>
                <button onClick={() => onCancelBooking(event.id)} className="btn btn-danger btn-sm">
                  Cancel
                </button>
              </div>
              {bookingStatus === 'RESERVED' && onPayNow && (
                <button onClick={() => onPayNow()} className="btn btn-outline btn-sm" style={{width: '100%'}}>
                  View Pass / QR
                </button>
              )}
            </div>
          ) : isBooked ? (
            <button 
              className="btn btn-secondary btn-sm"
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed', width: '100%' }}
            >
              {bookingStatus === 'RESERVED' ? 'Reserved' : 'Already Booked'}
            </button>
          ) : event.bookedCount >= event.capacity ? (
            <button 
              className="btn btn-secondary btn-sm"
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed', width: '100%', background: '#dc3545', color: 'white', border: 'none' }}
            >
              Fully Booked / Sold Out
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button 
                onClick={() => navigate(`/event/${event.id}`)} 
                className="btn btn-outline btn-sm"
                style={{ flex: 1 }}
              >
                View Details
              </button>
              <button 
                onClick={() => navigate(`/event/${event.id}`)} 
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
              >
                Reserve
              </button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default EventCard;
