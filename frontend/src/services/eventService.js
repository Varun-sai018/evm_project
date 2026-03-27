// This service handles all event-related API calls

const API_URL = 'http://localhost:8056/api/events';

// Get all events
export const getAllEvents = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get a single event by ID
export const getEventById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
};

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update an existing event
export const updateEvent = async (id, eventData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating event with ID ${id}:`, error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return true; // Return true to indicate successful deletion
  } catch (error) {
    console.error(`Error deleting event with ID ${id}:`, error);
    throw error;
  }
};

// Mock functions for user event booking
export const getUserBookedEvents = () => {
  const bookedEvents = localStorage.getItem('booked_events');
  return bookedEvents ? JSON.parse(bookedEvents) : [];
};

export const bookEvent = (event) => {
  const bookedEvents = getUserBookedEvents();
  
  // Check if event is already booked
  if (!bookedEvents.some(e => e.id === event.id)) {
    const updatedBookings = [...bookedEvents, event];
    localStorage.setItem('booked_events', JSON.stringify(updatedBookings));
    return updatedBookings;
  }
  
  return bookedEvents;
};

export const cancelBooking = (eventId) => {
  const bookedEvents = getUserBookedEvents();
  const updatedBookings = bookedEvents.filter(event => event.id !== eventId);
  localStorage.setItem('booked_events', JSON.stringify(updatedBookings));
  return updatedBookings;
};