import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Code, Image, FileText, Lock, Save, ArrowLeft, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../api/axios';
import './EditProfile.css';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    about: '',
    skills: [],
    photoURL: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        age: user.age || '',
        gender: user.gender || '',
        about: user.about || '',
        skills: user.skills || [],
        photoURL: user.photoURL || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && formData.skills.length < 10) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        ...formData,
        age: parseInt(formData.age) || undefined
      };
      
      const response = await profileAPI.updateProfile(updateData);
      updateUser(response.data.data);
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!newPassword) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await profileAPI.changePassword(newPassword);
      setSuccess('Password changed successfully!');
      setNewPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <motion.div 
        className="edit-profile-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="edit-header">
          <button className="back-btn" onClick={() => navigate('/profile')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Edit Profile</h1>
        </div>

        {error && (
          <motion.div 
            className="message message-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div 
            className="message message-success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {success}
          </motion.div>
        )}

        {/* Profile Photo Preview */}
        <div className="photo-preview-section glass">
          <img 
            src={formData.photoURL || 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'}
            alt="Profile preview"
            className="photo-preview"
          />
          <div className="input-group">
            <label htmlFor="photoURL">Photo URL</label>
            <div className="input-with-icon">
              <Image size={18} className="input-icon" />
              <input
                id="photoURL"
                name="photoURL"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={formData.photoURL}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="edit-form glass">
          <h2>
            <User size={20} />
            Personal Information
          </h2>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                min="18"
                placeholder="Your age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="about">About</label>
            <textarea
              id="about"
              name="about"
              placeholder="Tell others about yourself..."
              value={formData.about}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <h2>
            <Code size={20} />
            Skills
          </h2>

          <div className="skills-editor">
            <div className="skills-input-row">
              <input
                type="text"
                placeholder="Add a skill (e.g., React)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(e)}
              />
              <button type="button" className="btn btn-secondary" onClick={handleAddSkill}>
                Add
              </button>
            </div>
            
            <div className="skills-list">
              {formData.skills.map((skill, index) => (
                <span key={index} className="skill-tag editable">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(index)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
              {formData.skills.length === 0 && (
                <span className="no-skills">No skills added yet</span>
              )}
            </div>
            <p className="skill-hint">{formData.skills.length}/10 skills</p>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary save-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner small" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </form>

        {/* Password Section */}
        <form onSubmit={handlePasswordChange} className="password-form glass">
          <h2>
            <Lock size={20} />
            Change Password
          </h2>
          
          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <p className="input-hint">
              Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
            </p>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-secondary"
            disabled={loading || !newPassword}
          >
            Update Password
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfile;
