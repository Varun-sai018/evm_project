import { format } from 'date-fns';
import { FiCalendar, FiClock, FiEdit, FiTrash } from 'react-icons/fi';
import './EventCard.css';

const EventCard = ({ 
  event, 
  isAdmin = false, 
  isBooked = false,
  onEdit,
  onDelete,
  onBook,
  onCancelBooking
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
      
      {!isAdmin && (
        <div className="event-card-footer">
          {isBooked ? (
            <button 
              onClick={() => onCancelBooking(event.id)} 
              className="btn btn-danger btn-sm"
            >
              Cancel Booking
            </button>
          ) : (
            <button 
              onClick={() => onBook(event)} 
              className="btn btn-primary btn-sm"
            >
              Book Event
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard;