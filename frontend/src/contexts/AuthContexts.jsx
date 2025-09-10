/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// This baseURL is critical. It must match the backend route prefix exactly.
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on initial app load and verify with backend
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Correctly using the relative path "/profile"
        // The baseURL handles the "/api/auth" part
        const { data } = await axiosInstance.get("/profile");
        if (data.success) {
          setUser(data.data.user);
        } else {
          throw new Error('No active session found');
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

  // Login with email/password
  const login = async (email, password) => {
    try {
      // The path here is just "/login" because the baseURL is already set
      const response = await axiosInstance.post("/login", { email, password });
      if (response.data.success) {
        setUser(response.data.user);
        return response.data.user;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || error.message || "Login failed!");
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setLoading(false);
      window.location.href = "/login";
    }
  };
  
  // Placeholder functions for social logins
  const loginWithGoogle = () => {
    window.open(`${axiosInstance.defaults.baseURL}/google`, "_blank", "width=500,height=600");
  };

  const registerWithGoogle = () => {
    window.open(`${axiosInstance.defaults.baseURL}/google`, "_blank", "width=500,height=600");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    loginWithGoogle,
    registerWithGoogle,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// Custom hook to use Auth
export const useAuth = () => {
  return useContext(AuthContext);
};
