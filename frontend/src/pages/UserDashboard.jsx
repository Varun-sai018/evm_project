import { useState, useEffect } from 'react';
import { FiLoader, FiAlertCircle, FiCalendar } from 'react-icons/fi';
import EventCard from '../components/EventCard';
import { useAuth } from '../contexts/AuthContext';
import { getAllEvents, getUserBookedEvents, bookEvent, cancelBooking } from '../services/eventService';
import './Dashboard.css';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [bookedEvents, setBookedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('available');

  // Fetch events and booked events on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch all events
        const eventsData = await getAllEvents();
        setEvents(eventsData);
        
        // Get booked events from API
        if (currentUser) {
          const userBookings = await getUserBookedEvents(currentUser.id);
          setBookedEvents(userBookings);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser]);

  // Handler for booking an event
  const handleBookEvent = async (event) => {
    try {
      await bookEvent(currentUser.id, event.id);
      const updatedBookings = await getUserBookedEvents(currentUser.id);
      setBookedEvents(updatedBookings);
    } catch(err) {
      console.error(err);
    }
  };

  // Handler for canceling a booking
  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      const updatedBookings = await getUserBookedEvents(currentUser.id);
      setBookedEvents(updatedBookings);
    } catch(err) {
      console.error(err);
    }
  };

  // Get IDs of booked events for easy checking
  const bookedEventIds = bookedEvents.map(booking => booking.event.id);

  return (
    <div className="dashboard user-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">User Dashboard</h1>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Events
          </button>
          <button 
            className={`tab ${activeTab === 'booked' ? 'active' : ''}`}
            onClick={() => setActiveTab('booked')}
          >
            My Bookings
            {bookedEvents.length > 0 && (
              <span className="tab-badge">{bookedEvents.length}</span>
            )}
          </button>
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
            <span>Loading events...</span>
          </div>
        )}

        {activeTab === 'available' && !loading && !error && events.length === 0 && (
          <div className="dashboard-empty">
            <h3>No events available</h3>
            <p>Check back later for upcoming events.</p>
          </div>
        )}

        {activeTab === 'booked' && !loading && !error && bookedEvents.length === 0 && (
          <div className="dashboard-empty">
            <h3>No booked events</h3>
            <p>You haven't booked any events yet. Browse available events to book.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => setActiveTab('available')}
            >
              <FiCalendar className="btn-icon" />
              View Available Events
            </button>
          </div>
        )}

        {activeTab === 'available' && events.length > 0 && (
          <div className="events-grid">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isBooked={bookedEventIds.includes(event.id)}
                onBook={handleBookEvent}
              />
            ))}
          </div>
        )}

        {activeTab === 'booked' && bookedEvents.length > 0 && (
          <div className="events-grid">
            {bookedEvents.map(booking => (
              <EventCard
                key={booking.event.id}
                event={booking.event}
                isBooked={true}
                onCancelBooking={() => handleCancelBooking(booking.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;