import { useState, useEffect } from 'react';
import { FiLoader, FiAlertCircle, FiCalendar } from 'react-icons/fi';
import EventCard from '../components/EventCard';
import PaymentModal from '../components/PaymentModal';
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
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  
  // Search and Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

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
      const newBooking = await bookEvent(currentUser.id, event.id);
      setSelectedBookingForPayment(newBooking);
      // We don't refresh booked list here to let them finish payment first,
      // or refresh happens after modal is closed.
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
  const bookedEventIds = Array.isArray(bookedEvents) 
    ? bookedEvents.filter(b => b && b.event).map(booking => booking.event.id) 
    : [];

  // Compute Upcoming and Completed Events
  const now = new Date();
  
  // Set to start of day so events happening today are still considered "Available" all day
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const safeEvents = Array.isArray(events) ? events : [];
  
  // Safe date parser: if date is missing or invalid, default to future so it remains in Events tab
  const getSafeDate = (dateString) => {
    if (!dateString) return new Date(todayStart.getTime() + 86400000); 
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? new Date(todayStart.getTime() + 86400000) : d;
  };

  // Compare against todayStart instead of the exact current millisecond
  const upcomingEvents = safeEvents.filter(e => getSafeDate(e.endTime) >= todayStart);
  const completedEvents = safeEvents.filter(e => getSafeDate(e.endTime) < todayStart);

  // Filter the currently displayed list
  const getFilteredEvents = (list) => {
    return list.filter(e => {
      const title = String((e && e.title) || '');
      const location = String((e && e.location) || '');
      const matchesSearch = title.toLowerCase().includes(String(searchTerm || '').toLowerCase());
      const matchesLocation = filterLocation ? location.includes(String(filterLocation || '')) : true;
      return matchesSearch && matchesLocation;
    });
  };

  const filteredUpcoming = getFilteredEvents(upcomingEvents);
  const filteredCompleted = getFilteredEvents(completedEvents);

  // Extract unique locations for the filter dropdown
  const uniqueLocations = [...new Set(safeEvents.map(e => e && e.location).filter(Boolean))];

  return (
    <div className="dashboard user-dashboard">
      <div className="container">
        {/* Hero Section */}
        <div className="dashboard-hero">
          <h1>Welcome back, {currentUser?.name}!</h1>
          <p>Discover and manage your incredible events.</p>
        </div>

        {/* Modern Tabs */}
        <div className="modern-tabs">
          <button 
            className={`modern-tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Events
          </button>
          <button 
            className={`modern-tab ${activeTab === 'booked' ? 'active' : ''}`}
            onClick={() => setActiveTab('booked')}
          >
            My Reservations
            {Array.isArray(bookedEvents) && bookedEvents.length > 0 && (
              <span className="tab-badge" style={{ background: activeTab === 'booked' ? 'rgba(255,255,255,0.2)' : 'var(--primary-color)' }}>
                {bookedEvents.length}
              </span>
            )}
          </button>
          <button 
            className={`modern-tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed Events
            {Array.isArray(completedEvents) && completedEvents.length > 0 && (
              <span className="tab-badge" style={{ background: activeTab === 'completed' ? 'rgba(255,255,255,0.2)' : '#6c757d' }}>
                {completedEvents.length}
              </span>
            )}
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="search-filter-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search for amazing events by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-wrapper">
            <select 
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="">🗺️ All Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
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

        {activeTab === 'available' && !loading && !error && filteredUpcoming.length === 0 && (
          <div className="dashboard-empty">
            <h3>No events available</h3>
            <p>Try adjusting your search or check back later.</p>
          </div>
        )}

        {activeTab === 'completed' && !loading && !error && filteredCompleted.length === 0 && (
          <div className="dashboard-empty">
            <h3>No completed events</h3>
            <p>There are no past events to display.</p>
          </div>
        )}

        {activeTab === 'booked' && Array.isArray(bookedEvents) && bookedEvents.length === 0 && (
          <div className="dashboard-empty">
            <h3>No reservations</h3>
            <p>You haven't reserved any events yet. Browse available events to book.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => setActiveTab('available')}
            >
              <FiCalendar className="btn-icon" />
              View Available Events
            </button>
          </div>
        )}

        {activeTab === 'available' && filteredUpcoming.length > 0 && (
          <div className="events-grid">
            {filteredUpcoming.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isBooked={bookedEventIds.includes(event.id)}
                onBook={handleBookEvent}
              />
            ))}
          </div>
        )}

        {activeTab === 'completed' && filteredCompleted.length > 0 && (
          <div className="events-grid">
            {filteredCompleted.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isBooked={bookedEventIds.includes(event.id)}
                onBook={() => {}} // Can't book completed
              />
            ))}
          </div>
        )}

        {activeTab === 'booked' && Array.isArray(bookedEvents) && bookedEvents.length > 0 && (
          <div className="events-grid">
            {bookedEvents.filter(b => b && b.event).map(booking => (
              <EventCard
                key={booking.event.id}
                event={booking.event}
                isBooked={true}
                bookingStatus={booking.status}
                onCancelBooking={() => handleCancelBooking(booking.id)}
                onPayNow={booking.status === 'RESERVED' ? () => setSelectedBookingForPayment(booking) : undefined}
              />
            ))}
          </div>
        )}

        {selectedBookingForPayment && (
          <PaymentModal
            booking={selectedBookingForPayment}
            onClose={() => {
              setSelectedBookingForPayment(null);
              getUserBookedEvents(currentUser.id).then(setBookedEvents).catch(console.error);
            }}
            onSuccess={() => {
              setSelectedBookingForPayment(null);
              getUserBookedEvents(currentUser.id).then(setBookedEvents).catch(console.error);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
