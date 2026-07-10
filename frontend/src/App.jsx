import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminApprovals from './pages/AdminApprovals';
import UserDashboard from './pages/UserDashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

function App() {

  const [darkMode] = useState(localStorage.getItem('darkMode') === 'true');


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/organizer" element={<ProtectedRoute role="organizer"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/organizer/analytics/:eventId" element={<ProtectedRoute role="organizer"><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/admin/approvals" element={<ProtectedRoute role="admin"><AdminApprovals /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
            <Route path="/event/:id" element={<EventDetailsPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}


function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Normalize role in case of case-mismatch or missing old data
  const userRole = user.role ? user.role.toLowerCase() : 'user';
  
  if (userRole !== role) {
    // Prevent infinite redirect if we're already trying to go to the default route
    if (role === 'user' && userRole !== 'organizer' && userRole !== 'admin') {
      return children;
    }
    return <Navigate to={userRole === 'admin' ? '/admin/approvals' : (userRole === 'organizer' ? '/organizer' : '/dashboard')} replace />;
  }
  
  return children;
}

export default App;
