// context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
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
          localStorage.setItem('isLoggedIn', 'false');
        })
        .finally(() => setLoading(false));
    } else {
      setCurrentUser(null);
      setLoading(false);
    }
  }, []);

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
  return (
    <AuthContext.Provider value={{ currentUser, updateUser, loading, setLoading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useUser = () => useContext(AuthContext);