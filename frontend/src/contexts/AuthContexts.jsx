/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Backend API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Axios instance (with credentials for httpOnly cookie)
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on initial app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // First try to get user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Verify session with backend
        const { data } = await axiosInstance.get("/profile");
        if (data.success) {
          setUser(data.data.user);
          localStorage.setItem("user", JSON.stringify(data.data.user));
        } else {
          throw new Error("Session invalid");
        }
      } catch (error) {
        console.log("No active session found:", error.message);
        localStorage.removeItem("user");
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
      const response = await axiosInstance.post("/login", { email, password });
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data.user;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || error.message || "Login failed!"
      );
    }
  };

  // Google login (via popup)
  const loginWithGoogle = async () => {
    try {
      const popupWindow = window.open(
        `${API_URL}/google/login`,
        "Google Login",
        "width=500,height=600"
      );

      if (popupWindow) {
        const messageHandler = (event) => {
          if (
            event.origin === window.location.origin &&
            event.data.type === "googleLoginSuccess"
          ) {
            window.removeEventListener("message", messageHandler);
            popupWindow.close();
            setUser(event.data.user);
            localStorage.setItem("user", JSON.stringify(event.data.user));
          }
        };

        window.addEventListener("message", messageHandler);
      }
    } catch (error) {
      console.error("Google login failed:", error);
      throw new Error("Google login failed. Please try again.");
    }
  };

  // Google registration
  const registerWithGoogle = () => {
    window.location.href = `${API_URL}/google/register`;
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
      window.location.href = "/login"; // redirect
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
export const useAuth = () => useContext(AuthContext);
