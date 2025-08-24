"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Check if user is already logged in (session persisted on backend)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/users/profile", {
          credentials: "include", // Send cookies
        });

        if (response.ok) {
          const data = await response.json();
          console.log("User session:", data);
          setUser(data); // Assuming API returns { user }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user session:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Redirect based on auth state
  useEffect(() => {
    if (!isLoading) {
      const isLoginPage = location.pathname === "/";
      const isProtectedPage = location.pathname.startsWith("/");

      if (!user && isProtectedPage) {
        navigate("/"); // Redirect to login if not logged in
      } else if (user && isLoginPage) {
        navigate("/dashboard"); // Redirect to dashboard if already logged in
      }
    }
  }, [user, location.pathname, isLoading, navigate]);

// ✅ Login
const login = async (email, password) => {
  try {
    const response = await fetch("http://localhost:4000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Send/receive cookies
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login successful:", data);
      // ✅ Check if logUser is admin
      if (data.user.logUser === "admin") {
        setUser(data.user); // Save user info in state
        return true;
      } else {
        console.warn("Login user is not admin");

        // ✅ Remove session cookie by hitting logout endpoint
        await fetch("http://localhost:4000/api/users/logout", {
          method: "GET",
          credentials: "include",
        });

        alert("Login user is not admin"); // Optional: show user-facing message
        return false;
      }
    } else {
      console.error("Login failed:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};


  // ✅ Logout
  const logout = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users/logout", {
        method: "GET",
        credentials: "include", // Send cookies
      });

      if (response.ok) {
        setUser(null);
        navigate("/"); // Redirect to login page
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
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
