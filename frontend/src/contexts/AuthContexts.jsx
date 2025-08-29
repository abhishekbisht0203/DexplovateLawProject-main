/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Backend API URL
const API_URL = "http://localhost:5000/api/auth";

// Axios instance (with credentials for httpOnly cookie)
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on initial app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data } = await axiosInstance.get("/profile");
        setUser(data.user);
      } catch (error) {
        console.log("No active session found:", error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login with email/password
  const login = async (email, password) => {
    try {
      const { data } = await axiosInstance.post("/login", { email, password });
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
      throw new Error(error.response?.data?.message || "Login failed!");
    }
  };

  // Google login
  const loginWithGoogle = () => {
    window.location.href = `${API_URL}/google/login`;
  };

  // Google registration
  const registerWithGoogle = () => {
    window.location.href = `${API_URL}/google/register`;
  };

  // Logout
  const logout = async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    loginWithGoogle,
    registerWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth
export const useAuth = () => {
  return useContext(AuthContext);
};
