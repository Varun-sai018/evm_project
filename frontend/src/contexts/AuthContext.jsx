import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // Mock login function - in a real app, this would validate with a backend
  const login = (email, password) => {
    // Mock authentication logic
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // For demo, admin is admin@example.com with password "admin"
        if (email === 'admin@example.com' && password === 'admin') {
          const user = { 
            id: '1', 
            email, 
            name: 'Admin User', 
            role: 'admin' 
          };
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } 
        // Any other email/password combo is treated as a regular user
        else if (email && password) {
          const user = { 
            id: '2', 
            email, 
            name: email.split('@')[0], 
            role: 'user' 
          };
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500); // simulate network delay
    });
  };

  // Mock signup function
  const signup = (email, password, name) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const user = { 
            id: Math.random().toString(36).substr(2, 9), 
            email, 
            name: name || email.split('@')[0], 
            role: 'user' 
          };
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid data'));
        }
      }, 500); // simulate network delay
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('booked_events');
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isAdmin: currentUser?.role === 'admin',
    isUser: currentUser?.role === 'user',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};