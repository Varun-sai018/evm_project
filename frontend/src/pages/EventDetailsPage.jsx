import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiUsers, FiDollarSign, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { getAllEvents, bookEvent } from '../services/eventService';
import { useAuth } from '../contexts/AuthContext';
import PaymentModal from '../components/PaymentModal'; // This is actually our ReservationModal now
import '../pages/Dashboard.css';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isReserving, setIsReserving] = useState(false);
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const events = await getAllEvents();
        const foundEvent = events.find(e => e.id.toString() === id);
        
        if (foundEvent) {
          setEvent(foundEvent);
          
          if (currentUser) {
            import('../services/eventService').then(({ getUserBookedEvents }) => {
              getUserBookedEvents(currentUser.id)
                .then(bookings => {
                  const alreadyBooked = bookings.find(b => b.event && b.event.id.toString() === id);
                  if (alreadyBooked) {
                    setIsAlreadyBooked(true);
                    setCurrentBooking(alreadyBooked);
                  }
                })
                .catch(console.error);
            });
          }
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id, currentUser]);

  const handleReserve = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (isAlreadyBooked) {
      setReservationModalOpen(true);
      return;
    }
    
    try {
      setIsReserving(true);
      const newBooking = await bookEvent(currentUser.id, event.id);
      setCurrentBooking(newBooking);
      setIsAlreadyBooked(true);
      setReservationModalOpen(true);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to reserve ticket. Event might be sold out.');
    } finally {
      setIsReserving(false);
    }
  };

  if (loading) return <div className="dashboard-loading"><FiLoader className="spinner" /></div>;
  if (error) return <div className="dashboard-error"><FiAlertCircle /> <span>{error}</span></div>;
  if (!event) return null;


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
    return `url(https://source.unsplash.com/random/1200x400/?${kw}&sig=${event.id})`;
  };

  return (
    <div className="dashboard">
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px' }}>
        <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
          <FiArrowLeft /> Back
        </button>

        <div style={{ background: 'var(--card-bg)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          <div style={{ 
            backgroundImage: `linear-gradient(135deg, rgba(124, 58, 237, 0.8), rgba(14, 165, 233, 0.8)), ${getImageUrl()}`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '60px 30px', 
            color: 'white',
            textAlign: 'center'
          }}>
            <h1 style={{ margin: 0, fontSize: '2.8rem', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{event.title}</h1>
            {event.location && <p style={{ marginTop: '15px', fontSize: '1.2rem', opacity: 0.9, textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}><FiMapPin style={{marginRight: '5px'}}/> {event.location}</p>}
          </div>
          
          <div style={{ padding: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                  <FiCalendar size={20} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>Start Date</p>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{new Date(event.startTime).toLocaleDateString()}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                  <FiClock size={20} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>Time</p>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{new Date(event.startTime).toLocaleTimeString()}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success-color)' }}>
                  <FiDollarSign size={20} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>Ticket Price</p>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>₹{Number(event.ticketPrice || 0).toFixed(2)}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning-color)' }}>
                  <FiUsers size={20} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>Capacity</p>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{event.capacity || 'Unlimited'}</p>
                </div>
              </div>
            </div>

            <h3 style={{ marginBottom: '15px' }}>About this Event</h3>
            <p style={{ lineHeight: '1.6', color: 'var(--text-light)', marginBottom: '30px' }}>
              {event.description}
            </p>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', textAlign: 'center' }}>
              {(() => {
                const isCompleted = new Date(event.endTime) < new Date();
                
                if (isCompleted && !isAlreadyBooked) {
                  return (
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '15px 40px', fontSize: '1.1rem', opacity: 0.6, cursor: 'not-allowed', background: '#6c757d', border: 'none', color: 'white' }}
                      disabled
                    >
                      Event Completed
                    </button>
                  );
                }
                
                return (
                  <button 
                    className={`btn ${event.bookedCount >= event.capacity && !isAlreadyBooked ? 'btn-secondary' : 'btn-primary'}`} 
                    style={{ 
                      padding: '15px 40px', 
                      fontSize: '1.1rem',
                      opacity: (event.bookedCount >= event.capacity && !isAlreadyBooked) ? 0.6 : 1,
                      cursor: (event.bookedCount >= event.capacity && !isAlreadyBooked) ? 'not-allowed' : 'pointer',
                      background: (event.bookedCount >= event.capacity && !isAlreadyBooked) ? '#dc3545' : '',
                      border: (event.bookedCount >= event.capacity && !isAlreadyBooked) ? 'none' : ''
                    }}
                    onClick={handleReserve}
                    disabled={isReserving || (event.bookedCount >= event.capacity && !isAlreadyBooked)}
                  >
                    {isReserving ? 'Processing...' : isAlreadyBooked ? 'View Reservation Pass' : event.bookedCount >= event.capacity ? 'Fully Booked / Sold Out' : 'Reserve Ticket (Pay at Venue)'}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {reservationModalOpen && currentBooking && (
        <PaymentModal 
          booking={currentBooking} 
          onClose={() => setReservationModalOpen(false)}
        />
      )}
    </div>
  );
};

export default EventDetailsPage;
