import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, User, Users, Heart, MessageCircle, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/feed', icon: Flame, label: 'Discover' },
    { path: '/connections', icon: Users, label: 'Connections' },
    { path: '/requests', icon: Heart, label: 'Requests' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/feed" className="navbar-logo">
          <Flame className="logo-icon" />
          <span className="logo-text">
            Dev<span className="gradient-text">Tinder</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links hide-mobile">
          {navLinks.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* User Section */}
        <div className="navbar-user hide-mobile">
          {user && (
            <div className="user-info">
              <img
                src={user.photoURL || 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'}
                alt={user.firstName}
                className="avatar"
              />
              <span className="user-name">{user.firstName}</span>
            </div>
          )}
          <button onClick={handleLogout} className="btn btn-secondary logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`mobile-nav-link ${location.pathname === path ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
            <button onClick={handleLogout} className="mobile-nav-link logout">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
