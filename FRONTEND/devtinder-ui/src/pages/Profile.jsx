import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, MapPin, Calendar, Code, Edit, Mail, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="profile-page">
        <div className="loading-screen">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <motion.div 
        className="profile-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Profile Header */}
        <div className="profile-header-section">
          <div className="profile-cover">
            <div className="cover-gradient" />
          </div>
          
          <div className="profile-avatar-section">
            <img 
              src={user.photoURL || 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'}
              alt={user.firstName}
              className="profile-avatar"
            />
            <div className="profile-name-section">
              <h1>
                {user.firstName} {user.lastName}
                {user.age && <span className="profile-age">, {user.age}</span>}
              </h1>
              <p className="profile-email">
                <Mail size={16} />
                {user.email}
              </p>
            </div>
          </div>
          
          <Link to="/edit-profile" className="btn btn-primary edit-btn">
            <Edit size={18} />
            Edit Profile
          </Link>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* About Section */}
          <div className="profile-section glass">
            <h2>
              <User size={20} />
              About
            </h2>
            <p className="profile-about">
              {user.about || 'No bio added yet. Tell others about yourself!'}
            </p>
          </div>

          {/* Info Grid */}
          <div className="profile-info-grid">
            <div className="info-card glass">
              <Calendar size={24} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Age</span>
                <span className="info-value">{user.age || 'Not specified'}</span>
              </div>
            </div>
            
            <div className="info-card glass">
              <User size={24} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Gender</span>
                <span className="info-value capitalize">{user.gender || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="profile-section glass">
            <h2>
              <Code size={20} />
              Skills
            </h2>
            {user.skills && user.skills.length > 0 ? (
              <div className="skills-container">
                {user.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="no-data">No skills added yet. Add your tech stack!</p>
            )}
          </div>

          {/* Account Actions */}
          <div className="profile-section glass">
            <h2>
              <Shield size={20} />
              Account
            </h2>
            <div className="account-actions">
              <Link to="/edit-profile" className="account-link">
                Change Password
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
