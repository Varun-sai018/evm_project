import { useState, useEffect } from 'react';
import './EventForm.css';

const EventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: ''
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
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        startTime: event.startTime ? formatDateForInput(event.startTime) : '',
        endTime: event.endTime ? formatDateForInput(event.endTime) : ''
      });
    }
  }, [event]);
  
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
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (formData.startTime && formData.endTime && new Date(formData.endTime) <= new Date(formData.startTime)) {
      newErrors.endTime = 'End time must be after start time';
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
          onChange={handleChange}
        />
        {errors.endTime && <p className="form-error">{errors.endTime}</p>}
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