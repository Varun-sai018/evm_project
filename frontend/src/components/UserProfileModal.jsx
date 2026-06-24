import { FiX, FiUser, FiMail, FiShield } from 'react-icons/fi';
import './UserProfileModal.css';

const UserProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content profile-modal">
          <button className="modal-close" onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px' }}>
            <FiX size={24} />
          </button>
          
          <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0, textAlign: 'center' }}>
            <div className="profile-avatar">
              <FiUser size={40} />
            </div>
            <h2 style={{ marginTop: '15px', marginBottom: '5px' }}>{user.name}</h2>
            <span className={`badge ${user.role === 'organizer' ? 'badge-primary' : 'badge-secondary'}`}>
              {user.role === 'organizer' ? 'Organizer' : 'User'}
            </span>
          </div>
          
          <div className="modal-body profile-details">
            <div className="profile-detail-item">
              <div className="detail-icon">
                <FiUser />
              </div>
              <div className="detail-text">
                <span className="label">Full Name</span>
                <span className="value">{user.name}</span>
              </div>
            </div>
            
            <div className="profile-detail-item">
              <div className="detail-icon">
                <FiMail />
              </div>
              <div className="detail-text">
                <span className="label">Email Address</span>
                <span className="value">{user.email}</span>
              </div>
            </div>
            
            <div className="profile-detail-item">
              <div className="detail-icon">
                <FiShield />
              </div>
              <div className="detail-text">
                <span className="label">Account Type</span>
                <span className="value" style={{ textTransform: 'capitalize' }}>{user.role} Account</span>
              </div>
            </div>
          </div>
          
          <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
