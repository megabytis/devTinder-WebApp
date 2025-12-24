import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Mail, Lock, User, Calendar, Eye, EyeOff, Code, Image, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    skills: '',
    photoURL: '',
    about: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        age: parseInt(formData.age) || undefined,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : []
      };
      
      await signup(submitData);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>
      
      <motion.div
        className="auth-container signup-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-card glass signup-card">
          {/* Logo */}
          <div className="auth-logo">
            <Flame className="logo-icon" size={40} />
            <h1>Dev<span className="gradient-text">Tinder</span></h1>
          </div>
          
          <p className="auth-subtitle">Create your profile and start matching</p>
          
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
          
          <form onSubmit={handleSubmit} className="auth-form signup-form">
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="firstName">First Name *</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
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
              </div>
              
              <div className="input-group">
                <label htmlFor="lastName">Last Name *</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
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
            </div>
            
            <div className="input-group">
              <label htmlFor="email">Email *</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password *</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="input-hint">
                Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
              </p>
            </div>
            
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="age">Age *</label>
                <div className="input-with-icon">
                  <Calendar size={18} className="input-icon" />
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="18"
                    placeholder="18+"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor="gender">Gender *</label>
                <div className="input-with-icon">
                  <Users size={18} className="input-icon" />
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="skills">Skills</label>
              <div className="input-with-icon">
                <Code size={18} className="input-icon" />
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  placeholder="React, Node.js, Python (comma separated)"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="photoURL">Photo URL</label>
              <div className="input-with-icon">
                <Image size={18} className="input-icon" />
                <input
                  id="photoURL"
                  name="photoURL"
                  type="url"
                  placeholder="https://example.com/your-photo.jpg"
                  value={formData.photoURL}
                  onChange={handleChange}
                />
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
                rows={3}
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary auth-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner small" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Log In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
