// This service handles all event-related API calls

const API_URL = 'http://localhost:8056/api/events';

// Helper for auth headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Get all events
export const getAllEvents = async () => {
  try {
    const response = await fetch(API_URL, { headers: getHeaders() });
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
    const response = await fetch(`${API_URL}/${id}`, { headers: getHeaders() });
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
      headers: getHeaders(),
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
      headers: getHeaders(),
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
      headers: getHeaders(),
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

const BOOKING_API_URL = 'http://localhost:8056/api/bookings';

export const getUserBookedEvents = async (userId) => {
  try {
    const response = await fetch(`${BOOKING_API_URL}/user/${userId}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch booked events');
    return await response.json();
  } catch (error) {
    console.error('Error fetching booked events:', error);
    return [];
  }
};

export const bookEvent = async (userId, eventId) => {
  try {
    const response = await fetch(BOOKING_API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId, eventId })
    });
    if (!response.ok) throw new Error('Failed to book event');
    return await response.json();
  } catch (error) {
    console.error('Error booking event:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await fetch(`${BOOKING_API_URL}/${bookingId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to cancel booking');
    return true;
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw error;
  }
};

export const processPayment = async (bookingId, paymentDetails) => {
  try {
    const response = await fetch('http://localhost:8056/api/payments/process', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ bookingId, paymentDetails })
    });
    if (!response.ok) throw new Error('Failed to process payment');
    return await response.json();
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

export const getEventAnalytics = async (eventId) => {
  try {
    const response = await fetch(`http://localhost:8056/api/analytics/event/${eventId}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};