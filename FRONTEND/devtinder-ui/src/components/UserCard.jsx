import { Check, X } from 'lucide-react';
import './UserCard.css';

const UserCard = ({ user, showActions, onAccept, onReject, type = 'connection' }) => {
  return (
    <div className="user-card">
      <div className="user-card-avatar">
        <img
          src={user.photoURL || 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'}
          alt={user.firstName}
        />
      </div>
      
      <div className="user-card-info">
        <h3 className="user-card-name">
          {user.firstName} {user.lastName}
          {user.age && <span className="user-card-age">, {user.age}</span>}
        </h3>
        
        {user.about && (
          <p className="user-card-about">{user.about}</p>
        )}
        
        {user.skills && user.skills.length > 0 && (
          <div className="user-card-skills">
            {user.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="mini-skill-tag">
                {skill}
              </span>
            ))}
            {user.skills.length > 3 && (
              <span className="mini-skill-tag more">+{user.skills.length - 3}</span>
            )}
          </div>
        )}
      </div>
      
      {showActions && (
        <div className="user-card-actions">
          <button 
            className="card-action-btn reject"
            onClick={() => onReject(user._id)}
            title="Reject"
          >
            <X size={18} />
          </button>
          <button 
            className="card-action-btn accept"
            onClick={() => onAccept(user._id)}
            title="Accept"
          >
            <Check size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
