import { format } from 'date-fns';
import { FiCalendar, FiClock, FiEdit, FiTrash, FiList } from 'react-icons/fi';
import EventSchedule from './EventSchedule';
import './EventCard.css';

const EventCard = ({ 
  event, 
  isAdmin = false, 
  isBooked = false,
  bookingStatus = null,
  onEdit,
  onDelete,
  onBook,
  onCancelBooking,
  onPayNow,
  onManageSchedule
}) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="event-card">
      <div className="event-card-header">
        <h3 className="event-card-title">{event.title}</h3>
        
        {isAdmin && (
          <div className="event-card-actions">
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
        <div className="event-card-footer">
          {isBooked && onCancelBooking ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px', width: '100%'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span className={`badge ${bookingStatus === 'PENDING' ? 'badge-warning' : 'badge-success'}`} style={{
                  padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', 
                  backgroundColor: bookingStatus === 'PENDING' ? '#fff3cd' : '#d4edda',
                  color: bookingStatus === 'PENDING' ? '#856404' : '#155724'
                }}>
                  {bookingStatus || 'CONFIRMED'}
                </span>
                <button onClick={() => onCancelBooking(event.id)} className="btn btn-danger btn-sm">
                  Cancel
                </button>
              </div>
              {bookingStatus === 'PENDING' && onPayNow && (
                <button onClick={() => onPayNow()} className="btn btn-primary btn-sm" style={{width: '100%'}}>
                  Pay Now
                </button>
              )}
            </div>
          ) : isBooked ? (
            <button 
              className="btn btn-secondary btn-sm"
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed', width: '100%' }}
            >
              {bookingStatus === 'PENDING' ? 'Pending Payment' : 'Already Booked'}
            </button>
          ) : (
            <button 
              onClick={() => onBook(event)} 
              className="btn btn-primary btn-sm"
            >
              Book Event {event.ticketPrice > 0 ? `($${event.ticketPrice})` : ''}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard;