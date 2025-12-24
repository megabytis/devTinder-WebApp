import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, RefreshCw, Heart, Frown } from 'lucide-react';
import SwipeCard from '../components/SwipeCard';
import { userAPI, requestAPI } from '../api/axios';
import './Feed.css';

const Feed = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await userAPI.getFeed(pageNum, 10);
      const newUsers = response.data.data || [];
      
      if (pageNum === 1) {
        setUsers(newUsers);
      } else {
        setUsers(prev => [...prev, ...newUsers]);
      }
      
      setHasMore(newUsers.length === 10);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed(1);
  }, [fetchFeed]);

  const handleSwipe = async (status) => {
    if (users.length === 0) return;
    
    const currentUser = users[0];
    
    try {
      await requestAPI.sendRequest(status, currentUser._id);
      
      // Remove the swiped user
      setUsers(prev => prev.slice(1));
      
      // Load more if running low
      if (users.length <= 3 && hasMore) {
        fetchFeed(page + 1);
        setPage(p => p + 1);
      }
    } catch (err) {
      console.error('Swipe error:', err);
      // Still remove the card on error to prevent stuck state
      setUsers(prev => prev.slice(1));
    }
  };

  const handleRefresh = () => {
    setPage(1);
    fetchFeed(1);
  };

  if (loading && users.length === 0) {
    return (
      <div className="feed-page">
        <div className="feed-loading">
          <div className="spinner" />
          <p>Finding developers near you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-page">
      <div className="feed-header">
        <h1>
          <Flame className="header-icon" />
          Discover
        </h1>
        <button className="refresh-btn" onClick={handleRefresh}>
          <RefreshCw size={20} />
        </button>
      </div>

      {error && (
        <div className="message message-error">{error}</div>
      )}

      <div className="swipe-container">
        {users.length > 0 ? (
          <div className="cards-stack">
            <AnimatePresence>
              {users.slice(0, 3).map((user, index) => (
                <SwipeCard
                  key={user._id}
                  user={user}
                  isTop={index === 0}
                  onSwipe={handleSwipe}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            className="empty-feed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="empty-icon">
              {hasMore ? <Heart size={64} /> : <Frown size={64} />}
            </div>
            <h2>
              {hasMore ? 'Loading more developers...' : 'No more developers!'}
            </h2>
            <p>
              {hasMore 
                ? 'Please wait while we find more matches'
                : "You've seen everyone. Check back later for new devs!"}
            </p>
            <button className="btn btn-primary" onClick={handleRefresh}>
              <RefreshCw size={18} />
              Refresh Feed
            </button>
          </motion.div>
        )}
      </div>

      {/* Match hint */}
      <div className="swipe-hints">
        <div className="hint nope">
          <span className="hint-icon">←</span>
          <span>Swipe left to pass</span>
        </div>
        <div className="hint like">
          <span>Swipe right to like</span>
          <span className="hint-icon">→</span>
        </div>
      </div>
    </div>
  );
};

export default Feed;
