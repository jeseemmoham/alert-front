import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { alertAPI } from '../services/api';
import { connectSocket, disconnectSocket, joinZipRoom, leaveZipRoom, getSocket } from '../services/socket';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [allAlerts, setAllAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState({ total: 0, critical: 0, high: 0, medium: 0, low: 0 });
  const prevZipRef = useRef(null);

  // Calculate stats from alerts
  const calculateStats = useCallback((alertList) => {
    const newStats = { total: alertList.length, critical: 0, high: 0, medium: 0, low: 0 };
    alertList.forEach(alert => {
      if (newStats[alert.severity] !== undefined) {
        newStats[alert.severity]++;
      }
    });
    setStats(newStats);
  }, []);

  // Fetch alerts for user's ZIP code
  const fetchAlerts = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await alertAPI.getMyAlerts();
      const fetchedAlerts = res.data.data.alerts;
      setAlerts(fetchedAlerts);
      calculateStats(fetchedAlerts);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, calculateStats]);

  // Fetch all alerts (for map/admin)
  const fetchAllAlerts = useCallback(async () => {
    try {
      const res = await alertAPI.getAllAlerts();
      setAllAlerts(res.data.data.alerts);
    } catch (err) {
      console.error('Failed to fetch all alerts:', err);
    }
  }, []);

  // Severity to toast style mapping
  const getSeverityIcon = (severity) => {
    const icons = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' };
    return icons[severity] || '⚠️';
  };

  // Socket.io connection management
  useEffect(() => {
    if (!isAuthenticated || !user?.zipCode) return;

    const socket = connectSocket();

    socket.on('connect', () => {
      setConnected(true);
      joinZipRoom(user.zipCode);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    // Listen for new alerts
    socket.on('new-alert', (data) => {
      const { alert: newAlert, message } = data;
      
      // Add to alerts list
      setAlerts(prev => [newAlert, ...prev]);
      setAllAlerts(prev => [newAlert, ...prev]);
      
      // Show toast notification
      toast(message || `${getSeverityIcon(newAlert.severity)} ${newAlert.title}`, {
        duration: 6000,
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: `1px solid ${
            newAlert.severity === 'critical' ? 'rgba(239,68,68,0.5)' :
            newAlert.severity === 'high' ? 'rgba(249,115,22,0.5)' :
            newAlert.severity === 'medium' ? 'rgba(245,158,11,0.5)' :
            'rgba(34,197,94,0.5)'
          }`,
          borderRadius: '12px',
          padding: '14px 18px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        },
        icon: getSeverityIcon(newAlert.severity),
      });

      // Recalculate stats
      calculateStats(prev => [newAlert, ...prev]);
    });

    // Alert updates
    socket.on('alert-updated', (data) => {
      setAlerts(prev => prev.map(a => a._id === data.alert._id ? data.alert : a));
    });

    // Alert deletions
    socket.on('alert-deleted', (data) => {
      setAlerts(prev => prev.filter(a => a._id !== data.alertId));
      setAllAlerts(prev => prev.filter(a => a._id !== data.alertId));
    });

    return () => {
      if (user?.zipCode) {
        leaveZipRoom(user.zipCode);
      }
      disconnectSocket();
      setConnected(false);
    };
  }, [isAuthenticated, user?.zipCode, calculateStats]);

  // Handle ZIP code changes (leave old room, join new)
  useEffect(() => {
    if (!user?.zipCode || !connected) return;

    const socket = getSocket();
    if (!socket) return;

    if (prevZipRef.current && prevZipRef.current !== user.zipCode) {
      leaveZipRoom(prevZipRef.current);
      joinZipRoom(user.zipCode);
      fetchAlerts(); // Refresh alerts for new ZIP
    }

    prevZipRef.current = user.zipCode;
  }, [user?.zipCode, connected, fetchAlerts]);

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchAlerts();
      fetchAllAlerts();
    }
  }, [isAuthenticated, fetchAlerts, fetchAllAlerts]);

  const value = {
    alerts,
    allAlerts,
    loading,
    connected,
    stats,
    fetchAlerts,
    fetchAllAlerts,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
}

export default AlertContext;
