import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RefreshCw, Inbox, Check, X } from 'lucide-react';
import UserCard from '../components/UserCard';
import { userAPI, requestAPI } from '../api/axios';
import './Requests.css';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getReceivedRequests();
      setRequests(response.data.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      setActionLoading(requestId);
      await requestAPI.reviewRequest('accepted', requestId);
      setRequests(prev => prev.filter(req => req.fromUserID._id !== requestId));
    } catch (err) {
      setError(err.message || 'Failed to accept request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setActionLoading(requestId);
      await requestAPI.reviewRequest('rejected', requestId);
      setRequests(prev => prev.filter(req => req.fromUserID._id !== requestId));
    } catch (err) {
      setError(err.message || 'Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="requests-page">
        <div className="page-loading">
          <div className="spinner" />
          <p>Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="requests-page">
      <motion.div 
        className="requests-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="page-header">
          <h1>
            <Heart className="header-icon" />
            Requests
          </h1>
          <button className="refresh-btn" onClick={fetchRequests}>
            <RefreshCw size={20} />
          </button>
        </div>

        {error && (
          <div className="message message-error">{error}</div>
        )}

        <div className="requests-stats glass">
          <div className="stat-item">
            <Inbox size={24} />
            <div className="stat-info">
              <span className="stat-number">{requests.length}</span>
              <span className="stat-label">Pending Requests</span>
            </div>
          </div>
        </div>

        {requests.length > 0 ? (
          <div className="requests-list">
            <AnimatePresence>
              {requests.map((request, index) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ delay: index * 0.05 }}
                  className="request-item"
                >
                  <UserCard 
                    user={request.fromUserID}
                    showActions={true}
                    onAccept={() => handleAccept(request.fromUserID._id)}
                    onReject={() => handleReject(request.fromUserID._id)}
                  />
                  {actionLoading === request.fromUserID._id && (
                    <div className="action-overlay">
                      <div className="spinner small" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            className="empty-state glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="empty-icon-wrapper">
              <Inbox size={48} />
            </div>
            <h3>No pending requests</h3>
            <p>
              When someone shows interest in you, their request will appear here.
              Keep swiping to get more matches!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Requests;
