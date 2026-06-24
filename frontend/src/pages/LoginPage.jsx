import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiLogIn, FiUser, FiLock, FiAlertCircle, FiRefreshCw, FiShield } from 'react-icons/fi';
import './AuthPages.css';
import { API_BASE_URL } from "../config";

const createCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return {
    code,
    answer: code,
  };
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetStep, setResetStep] = useState('login');
  const [captcha, setCaptcha] = useState(createCaptcha);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const refreshCaptcha = () => {
    setCaptcha(createCaptcha());
    setCaptchaAnswer('');
  };

  const handleForgotPassword = () => {
    setError('');
    setNotice('');
    setResetEmail(email);
    setResetStep('requestOtp');
  };

  const handleBackToLogin = () => {
    setError('');
    setNotice('');
    setResetStep('login');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!resetEmail) {
      setError('Please enter your registered email address');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/users/forgot-password/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });

      const message = await response.text();
      if (!response.ok) {
        throw new Error(message || 'Failed to send OTP');
      }

      setNotice(message);
      setResetStep('verifyOtp');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!otp || !newPassword || !confirmPassword) {
      setError('Please enter OTP and your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(const response = await fetch(
  `${API_BASE_URL}/api/users/forgot-password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp, newPassword })
      });

      const message = await response.text();
      if (!response.ok) {
        throw new Error(message || 'Failed to reset password');
      }

      setNotice(message);
      setPassword('');
      setEmail(resetEmail);
      setResetStep('login');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      refreshCaptcha();
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (captchaAnswer.trim().toUpperCase() !== captcha.answer) {
      setError('Captcha verification failed. Please try again.');
      refreshCaptcha();
      return;
    }
    
    try {
      setLoading(true);
      const user = await login(email, password);
      const normalizedRole = user.role ? user.role.replace('ROLE_', '').toLowerCase() : 'user';
      if (normalizedRole !== selectedRole.toLowerCase()) {
        // If they chose the wrong role toggle, just switch it and log them in anyway!
        console.log(`User role mismatch. Backend: ${normalizedRole}, Selected: ${selectedRole}. Auto-correcting.`);
      }
      navigate(normalizedRole === 'organizer' ? '/organizer' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
      console.error(err);
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card login-card">
          <div className="auth-brand-mark">
            <FiShield />
          </div>
          <div className="auth-header">
            <h1>{resetStep === 'login' ? 'Welcome Back' : 'Reset Password'}</h1>
            <p>{resetStep === 'login' ? 'Sign in to continue to EventHub' : 'Verify your email with an OTP'}</p>
          </div>
          
          {error && (
            <div className="auth-error">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          {notice && (
            <div className="auth-notice">
              <FiShield />
              <span>{notice}</span>
            </div>
          )}
          
          {resetStep === 'login' && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Login As</label>
              <div className="role-selector" role="group" aria-label="Select login role">
                <button
                  type="button"
                  className={`role-option ${selectedRole === 'user' ? 'active' : ''}`}
                  onClick={() => setSelectedRole('user')}
                >
                  User
                </button>
                <button
                  type="button"
                  className={`role-option ${selectedRole === 'organizer' ? 'active' : ''}`}
                  onClick={() => setSelectedRole('organizer')}
                >
                  Organizer
                </button>
              </div>
            </div>

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

            <div className="form-row-between">
              <span className="form-label compact-label">Security Check</span>
              <button type="button" className="text-action" onClick={handleForgotPassword}>
                Forgot password?
              </button>
            </div>

            <div className="captcha-box">
              <div className="captcha-challenge">
                <span className="captcha-code" aria-label="Captcha verification code">
                  {captcha.code.split('').map((char, index) => (
                    <span
                      key={`${char}-${index}`}
                      style={{
                        transform: `translateY(${index % 2 === 0 ? -2 : 2}px) rotate(${index % 2 === 0 ? -8 : 7}deg)`,
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <button type="button" className="captcha-refresh" onClick={refreshCaptcha} aria-label="Refresh captcha">
                  <FiRefreshCw />
                </button>
              </div>
              <input
                type="text"
                className="form-input captcha-input"
                placeholder="Enter verification Code"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value.toUpperCase())}
                autoComplete="off"
                required
              />
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
          )}

          {resetStep === 'requestOtp' && (
          <form className="auth-form" onSubmit={handleSendOtp}>
            <div className="form-group">
              <label htmlFor="resetEmail" className="form-label">
                Registered Email Address
              </label>
              <div className="input-icon-wrapper">
                <FiUser className="input-icon" />
                <input
                  type="email"
                  id="resetEmail"
                  className="form-input"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
            <button type="button" className="btn btn-outline btn-block secondary-auth-action" onClick={handleBackToLogin}>
              Back to Sign In
            </button>
          </form>
          )}

          {resetStep === 'verifyOtp' && (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="otp" className="form-label">
                Email OTP
              </label>
              <input
                type="text"
                id="otp"
                className="form-input"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <div className="input-icon-wrapper">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  id="newPassword"
                  className="form-input"
                  placeholder="Create new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="input-icon-wrapper">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-input"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button type="button" className="btn btn-outline btn-block secondary-auth-action" onClick={handleSendOtp} disabled={loading}>
              Resend OTP
            </button>
            <button type="button" className="text-action auth-inline-action" onClick={handleBackToLogin}>
              Back to Sign In
            </button>
          </form>
          )}
          
          {resetStep === 'login' && (
          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
