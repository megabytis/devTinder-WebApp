import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, RefreshCw, UserCheck, MessageCircle } from 'lucide-react';
import UserCard from '../components/UserCard';
import { userAPI } from '../api/axios';
import './Connections.css';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getConnections();
      setConnections(response.data.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) {
    return (
      <div className="connections-page">
        <div className="page-loading">
          <div className="spinner" />
          <p>Loading your connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="connections-page">
      <motion.div 
        className="connections-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="page-header">
          <h1>
            <Users className="header-icon" />
            Connections
          </h1>
          <button className="refresh-btn" onClick={fetchConnections}>
            <RefreshCw size={20} />
          </button>
        </div>

        {error && (
          <div className="message message-error">{error}</div>
        )}

        <div className="connections-stats glass">
          <div className="stat-item">
            <UserCheck size={24} />
            <div className="stat-info">
              <span className="stat-number">{connections.length}</span>
              <span className="stat-label">Total Connections</span>
            </div>
          </div>
        </div>

        {connections.length > 0 ? (
          <div className="connections-list">
            {connections.map((connection, index) => (
              <motion.div
                key={connection._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <UserCard user={connection} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="empty-state glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="empty-icon-wrapper">
              <Users size={48} />
            </div>
            <h3>No connections yet</h3>
            <p>
              Start swiping to connect with other developers! 
              When someone accepts your request, they'll show up here.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Connections;
