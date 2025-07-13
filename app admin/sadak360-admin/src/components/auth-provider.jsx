"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem("auth-token");
    const userData = localStorage.getItem("user-data");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isLoginPage = location.pathname === "/";
      const isAdminPage = location.pathname.startsWith("/");

      if (!user && isAdminPage) {
        navigate("/");
      } else if (user && isLoginPage) {
        navigate("/dashboard");
      }
    }
  }, [user, location.pathname, isLoading, navigate]);

  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "admin@example.com" && password === "admin123") {
        const userData = {
          id: "admin-001",
          email: email,
          name: "admin 1",
        };

        setUser(userData);
        localStorage.setItem("auth-token", "admin-token-2024");
        localStorage.setItem("user-data", JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-data");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
