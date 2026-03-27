const API_URL = 'http://localhost:8056/api/schedules';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const getEventSessions = async (eventId) => {
  try {
    const response = await fetch(`${API_URL}/event/${eventId}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch schedule');
    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const addSession = async (eventId, sessionData) => {
  try {
    const response = await fetch(`${API_URL}/event/${eventId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sessionData)
    });
    if (!response.ok) throw new Error('Failed to add session');
    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateSession = async (sessionId, sessionData) => {
  try {
    const response = await fetch(`${API_URL}/${sessionId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(sessionData)
    });
    if (!response.ok) throw new Error('Failed to update session');
    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteSession = async (sessionId) => {
  try {
    const response = await fetch(`${API_URL}/${sessionId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete session');
    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
