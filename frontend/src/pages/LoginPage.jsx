import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiLogIn, FiUser, FiLock, FiAlertCircle } from 'react-icons/fi';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/user');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue to EventHub</p>
          </div>
          
          {error && (
            <div className="auth-error">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-icon-wrapper">
                <FiUser className="input-icon" />
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-icon-wrapper">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <FiLogIn className="btn-icon" />}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
            <p className="auth-hint">
              <strong>Hint:</strong> Use admin@example.com / admin for admin access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;