import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create AuthContext to provide authentication state to the app
const AuthContext = createContext();

// Backend API URL (assumes a local backend is running)
// This should be set in a .env file for production, but we'll hardcode it for this example.
const API_URL = 'http://localhost:5000/api/auth';

// Axios instance with credentials for httpOnly cookies
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check the authentication status when the component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data } = await axiosInstance.get('/profile');
        if (data.success) {
          setUser(data.user);
        } else {
          // If the session is invalid, the backend will return an error
          setUser(null);
        }
      } catch (error) {
        console.error("No active session found:", error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/login', { email, password });
      if (response.data.success) {
        setUser(response.data.user);
        return response.data.user;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Login failed!');
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
