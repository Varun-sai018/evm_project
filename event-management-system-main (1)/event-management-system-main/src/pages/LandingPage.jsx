import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiCalendar, FiUsers, FiCheckCircle, FiClock } from 'react-icons/fi';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Organize and Manage Your Events with Ease</h1>
            <p className="hero-subtitle">
              A powerful platform that helps you create, manage, and track events in one place.
            </p>
            <div className="hero-buttons">
              {currentUser ? (
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate(currentUser.role === 'admin' ? '/admin' : '/user')}
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button className="btn btn-primary" onClick={() => navigate('/login')}>
                    Get Started
                  </button>
                  <button className="btn btn-outline" onClick={() => navigate('/signup')}>
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                 alt="Event Management" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FiCalendar />
              </div>
              <h3 className="feature-title">Easy Event Creation</h3>
              <p className="feature-description">
                Create and customize events in minutes with our intuitive interface.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiUsers />
              </div>
              <h3 className="feature-title">Attendee Management</h3>
              <p className="feature-description">
                Easily manage attendees, send invitations, and track responses.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiCheckCircle />
              </div>
              <h3 className="feature-title">Simplified Booking</h3>
              <p className="feature-description">
                Book events with a single click and manage all your bookings in one place.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiClock />
              </div>
              <h3 className="feature-title">Real-time Updates</h3>
              <p className="feature-description">
                Get instant notifications and keep track of your events in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">
                "This platform has transformed how we manage our corporate events. It's intuitive and powerful."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Sarah Johnson" />
                </div>
                <div className="author-info">
                  <h4 className="author-name">Sarah Johnson</h4>
                  <p className="author-title">Event Manager, TechCorp</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <p className="testimonial-text">
                "I've tried several event platforms, but this one stands out with its simplicity and comprehensive features."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Michael Chen" />
                </div>
                <div className="author-info">
                  <h4 className="author-name">Michael Chen</h4>
                  <p className="author-title">Community Organizer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Simplify Your Event Management?</h2>
            <p className="cta-subtitle">
              Join thousands of users who are already using our platform to manage their events.
            </p>
            <button className="btn btn-accent" onClick={() => navigate('/signup')}>
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">EventHub</div>
            <p className="footer-copyright">
              © {new Date().getFullYear()} EventHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;