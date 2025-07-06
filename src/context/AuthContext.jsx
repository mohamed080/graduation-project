// context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();
const NotificationContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  // Notification state
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {                                                                                                                             

    if (token) {
      axiosInstance.get('/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setCurrentUser(response.data); // Assumes response.data contains user object
          localStorage.setItem('user', JSON.stringify(response.data));
        })
        .catch(() => {
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
        })
        .finally(() => setLoading(false));
    } else {
      setCurrentUser(null);
      setLoading(false);
    }
  }, [token]);

  // Initialize notifications
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  /* ── PUT /profile helper ── */
  const updateUser = async (payload) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.put('/profile', payload);
      setCurrentUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Notification methods
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

    // ------- helper to log in ----------
  const login = (access_token) => {
    localStorage.setItem('accessToken', access_token);
    setToken(access_token);              // <—  triggers the /profile fetch
  };

  // ------- helper to log out ----------
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
  };

  const authValue = {
    currentUser,
    updateUser,
    loading,
    login,
    logout,
    setLoading,
    token
  };

  const notificationValue = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll: clearAllNotifications
  };
  
  return (
    <AuthContext.Provider value={authValue}>
      <NotificationContext.Provider value={notificationValue}>
        {!loading && children}
      </NotificationContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useNotification = () => useContext(NotificationContext);