import { useState, useEffect } from 'react';
import { FiPlus, FiLoader, FiAlertCircle } from 'react-icons/fi';
import EventCard from '../components/EventCard';
import Modal from '../components/Modal';
import EventForm from '../components/EventForm';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService';
import './Dashboard.css';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Open modal for creating a new event
  const handleAddEvent = () => {
    setCurrentEvent(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing event
  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  // Submit handler for event form (create or update)
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
      if (currentEvent) {
        // Update existing event
        await updateEvent(currentEvent.id, formData);
      } else {
        // Create new event
        await createEvent(formData);
      }
      
      // Refresh events list and close modal
      await fetchEvents();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation
  const handleDeleteClick = (eventId) => {
    setConfirmDelete(eventId);
  };

  // Handle confirming deletion
  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteEvent(confirmDelete);
      setEvents(events.filter(event => event.id !== confirmDelete));
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <button className="btn btn-primary" onClick={handleAddEvent}>
            <FiPlus className="btn-icon" />
            Add Event
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

        {!loading && !error && events.length === 0 && (
          <div className="dashboard-empty">
            <h3>No events found</h3>
            <p>Get started by creating your first event.</p>
            <button className="btn btn-primary" onClick={handleAddEvent}>
              <FiPlus className="btn-icon" />
              Add Event
            </button>
          </div>
        )}

        {events.length > 0 && (
          <div className="events-grid">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isAdmin={true}
                onEdit={handleEditEvent}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal for adding/editing events */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentEvent ? 'Edit Event' : 'Add New Event'}
      >
        <EventForm
          event={currentEvent}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Confirm Delete"
      >
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this event? This action cannot be undone.</p>
          <div className="modal-actions">
            <button 
              className="btn btn-outline" 
              onClick={() => setConfirmDelete(null)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-danger" 
              onClick={handleConfirmDelete}
            >
              Delete Event
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;