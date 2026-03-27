import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

function App() {

  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/user" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
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
  
  if (user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />;
  }
  
  return children;
}

export default App;