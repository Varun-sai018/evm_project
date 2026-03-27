import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMenu, FiX, FiMoon, FiSun, FiUser, FiLogOut } from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          EventHub
        </Link>

        <div className="navbar-icons">
          
          <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
          <div className="navbar-links">
            <Link to="/" className="navbar-link">Home</Link>
            
            {currentUser ? (
              <>
                <Link to={isAdmin ? "/admin" : "/user"} className="navbar-link">
                  Dashboard
                </Link>
                
                <div className="navbar-user">
                  <span className="navbar-username">
                    <FiUser className="navbar-icon" />
                    {currentUser.name}
                  </span>
                  
                  <button onClick={handleLogout} className="navbar-logout">
                    <FiLogOut className="navbar-icon" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link">Login</Link>
                <Link to="/signup" className="navbar-link btn-signup">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;