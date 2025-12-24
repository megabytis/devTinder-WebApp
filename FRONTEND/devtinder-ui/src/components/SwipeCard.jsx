import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, MapPin, Briefcase, Info } from 'lucide-react';
import './SwipeCard.css';

const SwipeCard = ({ user, onSwipe, isTop }) => {
  const [exitX, setExitX] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  
  // Like/Nope indicators
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_, info) => {
    const threshold = 120;
    const velocity = info.velocity.x;
    
    if (info.offset.x > threshold || velocity > 500) {
      setExitX(1000);
      onSwipe('interested');
    } else if (info.offset.x < -threshold || velocity < -500) {
      setExitX(-1000);
      onSwipe('ignored');
    }
  };

  const handleButtonSwipe = (direction) => {
    if (direction === 'like') {
      setExitX(1000);
      onSwipe('interested');
    } else {
      setExitX(-1000);
      onSwipe('ignored');
    }
  };

  return (
    <motion.div
      className={`swipe-card ${isTop ? 'is-top' : ''}`}
      style={{ x, rotate, opacity }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ 
        scale: isTop ? 1 : 0.95, 
        y: isTop ? 0 : 10,
        opacity: isTop ? 1 : 0.7,
        transition: { duration: 0.3 }
      }}
      exit={{ 
        x: exitX, 
        opacity: 0,
        rotate: exitX > 0 ? 45 : -45,
        transition: { duration: 0.4, ease: "easeIn" }
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Background Image */}
      <div 
        className="card-image"
        style={{ 
          backgroundImage: `url(${user.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'})` 
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="card-gradient" />
      
      {/* Like/Nope Indicators */}
      {isTop && (
        <>
          <motion.div 
            className="swipe-indicator like"
            style={{ opacity: likeOpacity }}
          >
            LIKE
          </motion.div>
          <motion.div 
            className="swipe-indicator nope"
            style={{ opacity: nopeOpacity }}
          >
            NOPE
          </motion.div>
        </>
      )}
      
      {/* Card Content */}
      <div className="card-content">
        <div className="card-header">
          <h2 className="card-name">
            {user.firstName} {user.lastName}
            {user.age && <span className="card-age">, {user.age}</span>}
          </h2>
        </div>
        
        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="card-skills">
            {user.skills.slice(0, 4).map((skill, index) => (
              <span key={index} className="skill-badge">
                {skill}
              </span>
            ))}
            {user.skills.length > 4 && (
              <span className="skill-badge more">+{user.skills.length - 4}</span>
            )}
          </div>
        )}
        
        {/* About */}
        {user.about && (
          <p className="card-about">{user.about}</p>
        )}
        
        {/* Action Buttons */}
        {isTop && (
          <div className="card-actions">
            <button 
              className="action-btn nope-btn"
              onClick={() => handleButtonSwipe('nope')}
            >
              <X size={28} />
            </button>
            <button 
              className="action-btn superlike-btn"
              onClick={() => handleButtonSwipe('like')}
            >
              <Star size={24} />
            </button>
            <button 
              className="action-btn like-btn"
              onClick={() => handleButtonSwipe('like')}
            >
              <Heart size={28} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SwipeCard;
