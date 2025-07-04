// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  // Core authentication state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  // User activity and preferences
  const [userPreferences, setUserPreferences] = useState({
    theme: "light",
    language: "en",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  });

  // App state
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [lastActivity, setLastActivity] = useState(null);

  // Error handling
  const [authError, setAuthError] = useState(null);

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  // Track user activity
  useEffect(() => {
    if (isAuthenticated) {
      setLastActivity(new Date());

      // Set up activity tracking
      const activityInterval = setInterval(() => {
        setLastActivity(new Date());
      }, 60000); // Update every minute

      return () => clearInterval(activityInterval);
    }
  }, [isAuthenticated]);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);

      // Check for stored token
      const storedToken =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      const storedPreferences = localStorage.getItem("userPreferences");
      const completedTour = localStorage.getItem("hasCompletedTour");

      if (storedToken && storedUser) {
        // Verify token with backend
        const isValid = await verifyToken(storedToken);

        if (isValid) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);

          if (storedPreferences) {
            setUserPreferences(JSON.parse(storedPreferences));
          }

          setHasCompletedTour(completedTour === "true");
        } else {
          // Token is invalid, clear storage
          clearAuthData();
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      setAuthError("Failed to initialize authentication");
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials, rememberMe = false) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      // API call to login endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        const {
          user: userData,
          token: authToken,
          isFirstLogin: firstLogin,
        } = data;

        // Set auth state
        setUser(userData);
        setToken(authToken);
        setIsAuthenticated(true);
        setIsFirstLogin(firstLogin || false);

        // Store in appropriate storage based on remember me
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("authToken", authToken);
        storage.setItem("user", JSON.stringify(userData));

        // Load user preferences
        if (userData.preferences) {
          setUserPreferences(userData.preferences);
          storage.setItem(
            "userPreferences",
            JSON.stringify(userData.preferences)
          );
        }

        // Update last login
        await updateLastLogin();

        return { success: true, user: userData };
      } else {
        setAuthError(data.message || "Login failed");
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Network error. Please try again.");
      return { success: false, error: "Network error" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Don't auto-login after registration if email verification is required
        if (data.requiresVerification) {
          return {
            success: true,
            message:
              "Registration successful. Please check your email to verify your account.",
            requiresVerification: true,
          };
        } else {
          // Auto-login after registration
          setUser(data.user);
          setToken(data.token);
          setIsAuthenticated(true);
          setIsFirstLogin(true);

          sessionStorage.setItem("authToken", data.token);
          sessionStorage.setItem("user", JSON.stringify(data.user));

          return { success: true, user: data.user };
        }
      } else {
        setAuthError(data.message || "Registration failed");
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError("Network error. Please try again.");
      return { success: false, error: "Network error" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token server-side
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
    }
  };

  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setIsFirstLogin(false);
    setAuthError(null);
    setLastActivity(null);

    // Clear storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userPreferences");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userPreferences");
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);

        // Update stored user data
        const storage = localStorage.getItem("authToken")
          ? localStorage
          : sessionStorage;
        storage.setItem("user", JSON.stringify(data.user));

        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Profile update error:", error);
      return { success: false, error: "Network error" };
    }
  };

  const updatePreferences = async (newPreferences) => {
    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPreferences),
      });

      if (response.ok) {
        setUserPreferences(newPreferences);

        // Update stored preferences
        const storage = localStorage.getItem("authToken")
          ? localStorage
          : sessionStorage;
        storage.setItem("userPreferences", JSON.stringify(newPreferences));

        return { success: true };
      } else {
        return { success: false, error: "Failed to update preferences" };
      }
    } catch (error) {
      console.error("Preferences update error:", error);
      return { success: false, error: "Network error" };
    }
  };

  const completeTour = () => {
    setHasCompletedTour(true);
    localStorage.setItem("hasCompletedTour", "true");
  };

  const resetTour = () => {
    setHasCompletedTour(false);
    localStorage.removeItem("hasCompletedTour");
  };

  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await fetch("/api/auth/verify-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenToVerify}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  };

  const updateLastLogin = async () => {
    try {
      await fetch("/api/user/last-login", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Failed to update last login:", error);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);

        // Update stored token
        const storage = localStorage.getItem("authToken")
          ? localStorage
          : sessionStorage;
        storage.setItem("authToken", data.token);

        return true;
      } else {
        // Token refresh failed, logout user
        logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      return false;
    }
  };

  // Context value
  const contextValue = {
    // State
    user,
    isAuthenticated,
    isLoading,
    token,
    userPreferences,
    isFirstLogin,
    hasCompletedTour,
    lastActivity,
    authError,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    completeTour,
    resetTour,
    refreshToken,
    clearError: () => setAuthError(null),

    // Utility functions
    hasRole: (role) => user?.role === role,
    hasPermission: (permission) => {
      // Add your permission logic here
      return user?.permissions?.includes(permission);
    },
    isEmailVerified: () => user?.isEmailVerified || false,
    getFullName: () =>
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.name || "User",
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
