import { useState, useEffect } from 'react';
import './EventForm.css';

const EventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    ticketPrice: 0,
    location: '',
    capacity: 100,
    category: 'technology'
  });
  
  const [errors, setErrors] = useState({});
  
  // If editing, populate form with event data
  useEffect(() => {
    if (event) {
      // Format the dates for the datetime-local input
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };
      
      const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
      };
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        startTime: event.startTime ? formatDateForInput(event.startTime) : '',
        endTime: event.endTime ? formatDateForInput(event.endTime) : '',
        ticketPrice: event.ticketPrice !== undefined ? event.ticketPrice : 0,
        location: event.location || '',
        capacity: event.capacity !== undefined ? event.capacity : 100,
        category: event.category || 'technology'
      });
    }
  }, [event]);

  const THEMES = [
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'music', label: 'Music & Concerts', icon: '🎵' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'arts', label: 'Arts & Culture', icon: '🎨' },
    { id: 'food', label: 'Food & Drink', icon: '🍔' }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    const now = new Date();
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    } else if (new Date(formData.startTime) < now) {
      newErrors.startTime = 'Event cannot start in the past';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (new Date(formData.endTime) < now) {
      newErrors.endTime = 'Event cannot end in the past';
    } else if (formData.startTime && formData.endTime && new Date(formData.endTime) <= new Date(formData.startTime)) {
      newErrors.endTime = 'End time must be after start time';
    }
    if (formData.ticketPrice === '' || Number(formData.ticketPrice) < 0) {
      newErrors.ticketPrice = 'Valid ticket price is required';
    }
    
    if (!formData.location?.trim()) {
      newErrors.location = 'Location/Place is required';
    }

    if (!formData.capacity || Number(formData.capacity) <= 0) {
      newErrors.capacity = 'Capacity must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h2 className="event-form-title">{event ? 'Edit Event' : 'Create New Event'}</h2>
      
      <div className="form-group">
        <label htmlFor="title" className="form-label">Event Title</label>
        <input
          type="text"
          id="title"
          name="title"
          className={`form-input ${errors.title ? 'error' : ''}`}
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter event title"
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          name="description"
          className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter event description"
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="startTime" className="form-label">Start Time</label>
        <input
          type="datetime-local"
          id="startTime"
          name="startTime"
          className={`form-input ${errors.startTime ? 'error' : ''}`}
          value={formData.startTime}
          min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
          onChange={handleChange}
        />
        {errors.startTime && <p className="form-error">{errors.startTime}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="endTime" className="form-label">End Time</label>
        <input
          type="datetime-local"
          id="endTime"
          name="endTime"
          className={`form-input ${errors.endTime ? 'error' : ''}`}
          value={formData.endTime}
          min={formData.startTime || new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
          onChange={handleChange}
        />
        {errors.endTime && <p className="form-error">{errors.endTime}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="ticketPrice" className="form-label">Ticket Price ($)</label>
        <input
          type="number"
          id="ticketPrice"
          name="ticketPrice"
          min="0"
          step="0.01"
          className={`form-input ${errors.ticketPrice ? 'error' : ''}`}
          value={formData.ticketPrice}
          onChange={handleChange}
        />
        {errors.ticketPrice && <p className="form-error">{errors.ticketPrice}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="location" className="form-label">Location (Place)</label>
        <input
          type="text"
          id="location"
          name="location"
          className={`form-input ${errors.location ? 'error' : ''}`}
          value={formData.location}
          onChange={handleChange}
          placeholder="E.g. Main Auditorium"
        />
        {errors.location && <p className="form-error">{errors.location}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="capacity" className="form-label">Total Capacity (People)</label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          min="1"
          className={`form-input ${errors.capacity ? 'error' : ''}`}
          value={formData.capacity}
          onChange={handleChange}
          placeholder="E.g. 200"
        />
        {errors.capacity && <p className="form-error">{errors.capacity}</p>}
      </div>
      
      <div className="form-group">
        <label className="form-label">Event Theme / Visual Category</label>
        <p className="form-hint" style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '10px' }}>
          Select a category to represent your event on the dashboard.
        </p>
        <div className="theme-selector-grid">
          {THEMES.map(theme => (
            <div 
              key={theme.id}
              className={`theme-card ${formData.category === theme.id ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, category: theme.id }))}
            >
              <div className="theme-icon">{theme.icon}</div>
              <div className="theme-label">{theme.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="event-form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {event ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;