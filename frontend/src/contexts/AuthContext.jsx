import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in on component mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await fetch('http://localhost:8056/api/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Invalid credentials');
    }

    const data = await response.json();
    const token = data.token;
    localStorage.setItem('token', token);

    const user = data.user; 
    // Role is now provided by the backend, no need to hardcode

    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  };

  const signup = async (email, password, name, role) => {
    const response = await fetch('http://localhost:8056/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to sign up');
    }

    // Auto-login after successful signup
    return await login(email, password);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('booked_events');
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isAdmin: currentUser?.role === 'organizer', // Keeping the internal prop name isAdmin but mapping to 'organizer'
    isUser: currentUser?.role === 'user',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
