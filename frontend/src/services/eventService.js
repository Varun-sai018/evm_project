// This service handles all event-related API calls

import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/events`;

// Helper for auth headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Helper to catch 401/403 and auto-logout
const checkResponse = (response) => {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login?expired=true';
    throw new Error('Session expired. Please log in again.');
  }
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response;
};

// Get all events
export const getAllEvents = async (organizerId = null) => {
  try {
    const url = organizerId ? `${API_URL}?organizerId=${organizerId}` : API_URL;
    const response = await fetch(url, { headers: getHeaders() });
    checkResponse(response);
    const data = await response.json();
    return data.content !== undefined ? data.content : data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get a single event by ID
export const getEventById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { headers: getHeaders() });
    checkResponse(response);
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
    
    checkResponse(response);
    
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
    
    checkResponse(response);
    
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
    
    checkResponse(response);
    
    return true; // Return true to indicate successful deletion
  } catch (error) {
    console.error(`Error deleting event with ID ${id}:`, error);
    throw error;
  }
};

const BOOKING_API_URL = `${API_BASE_URL}/bookings`;

export const getUserBookedEvents = async (userId) => {
  try {
    const response = await fetch(`${BOOKING_API_URL}/user/${userId}`, { headers: getHeaders() });
    checkResponse(response);
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
    checkResponse(response);
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
    checkResponse(response);
    return true;
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw error;
  }
};

export const processPayment = async (bookingId, amount) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/process`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ bookingId, amount })
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
    const response = await fetch(`${API_BASE_URL}/analytics/event/${eventId}`, {
      headers: getHeaders()
    });
    checkResponse(response);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching analytics for event ${eventId}:`, error);
    throw error;
  }
};

export const getDashboardSummary = async (organizerId = null) => {
  try {
    const url = organizerId 
      ? `${API_BASE_URL}/analytics/dashboard?organizerId=${organizerId}` 
      : `${API_BASE_URL}/analytics/dashboard`;
    const response = await fetch(url, {
      headers: getHeaders()
    });
    checkResponse(response);
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};

// Admin API Calls
export const getPendingEvents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/events/pending`, {
      headers: getHeaders()
    });
    checkResponse(response);
    const data = await response.json();
    return data.content !== undefined ? data.content : data;
  } catch (error) {
    console.error('Error fetching pending events:', error);
    throw error;
  }
};

export const approveEvent = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/events/${id}/approve`, {
      method: 'PUT',
      headers: getHeaders()
    });
    checkResponse(response);
    return await response.json();
  } catch (error) {
    console.error(`Error approving event ${id}:`, error);
    throw error;
  }
};

export const rejectEvent = async (id, reason) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/events/${id}/reject`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ reason })
    });
    checkResponse(response);
    return await response.json();
  } catch (error) {
    console.error(`Error rejecting event ${id}:`, error);
    throw error;
  }
};