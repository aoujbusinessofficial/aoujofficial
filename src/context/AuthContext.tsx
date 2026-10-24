"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  authenticateUser,
  registerUser,
  updateProfileAvatar,
  updateUserProfile,
  changeUserPassword,
  syncMeasurementsToSupabase,
  syncProfileToSupabase,
  AuthResult,
} from "@/services/authService";

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
  avatarUrl?: string;
  isGuest?: boolean;
  measurements?: {
    bust?: string;
    waist?: string;
    hip?: string;
    shirtLength?: string;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateAvatar: (avatarDataUrl: string) => Promise<boolean>;
  updateProfile: (updates: {
    name?: string;
    phone?: string;
    avatarUrl?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  continueAsGuest: (name?: string, email?: string) => void;
  logout: () => void;
  updateMeasurements: (measurements: UserProfile["measurements"]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "aouj_user_session";
const ADMIN_STORAGE_KEY = "aouj_admin_session";
const LAST_ACTIVITY_KEY = "aouj_last_activity";
const INACTIVITY_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user session on mount with 2-hour inactivity check
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const lastActivityStr = localStorage.getItem(LAST_ACTIVITY_KEY);

      if (saved) {
        const lastActivity = lastActivityStr ? parseInt(lastActivityStr, 10) : Date.now();
        const now = Date.now();

        // If more than 2 hours passed since last activity, log out immediately
        if (now - lastActivity > INACTIVITY_TIMEOUT_MS) {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(ADMIN_STORAGE_KEY);
          localStorage.removeItem(LAST_ACTIVITY_KEY);
          setUser(null);
        } else {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
        }
      }
    } catch (e) {
      console.error("Failed to load user session from storage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2-Hour Inactivity Auto-Logout Tracker
  useEffect(() => {
    if (!user || user.isGuest) return;

    let lastRecorded = Date.now();

    const recordActivity = () => {
      const now = Date.now();
      // Throttle updates to localStorage to once every 20 seconds
      if (now - lastRecorded > 20000) {
        lastRecorded = now;
        try {
          localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
        } catch {
          // ignore
        }
      }
    };

    // User activity listeners
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((evt) => window.addEventListener(evt, recordActivity, { passive: true }));

    // Periodic check every 30 seconds for 2-hour timeout
    const interval = setInterval(() => {
      const lastStr = localStorage.getItem(LAST_ACTIVITY_KEY);
      if (lastStr) {
        const last = parseInt(lastStr, 10);
        if (Date.now() - last > INACTIVITY_TIMEOUT_MS) {
          // Auto logout due to 2 hours of inactivity
          logout();
          if (typeof window !== "undefined") {
            window.location.href = "/login?reason=inactivity";
          }
        }
      }
    }, 30000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, recordActivity));
      clearInterval(interval);
    };
  }, [user]);

  const persistUser = (newUser: UserProfile | null) => {
    setUser(newUser);
    try {
      if (newUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
        if (newUser.role === "ADMIN") {
          localStorage.setItem(
            ADMIN_STORAGE_KEY,
            JSON.stringify({
              id: newUser.id || "admin-id",
              email: newUser.email,
              fullName: newUser.name,
              phone: newUser.phone,
              role: "ADMIN",
            })
          );
        } else {
          localStorage.removeItem(ADMIN_STORAGE_KEY);
        }
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        localStorage.removeItem(LAST_ACTIVITY_KEY);
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.clear();
        }
      }
    } catch (e) {
      console.error("Failed to persist user session", e);
    }
  };

  const login = async (email: string, passwordInput: string): Promise<AuthResult> => {
    const result = await authenticateUser(email, passwordInput);

    if (result.success && result.user) {
      const profile: UserProfile = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        phone: result.user.phone,
        role: result.user.role || "CUSTOMER",
        avatarUrl: result.user.avatarUrl,
        isGuest: false,
        measurements: result.user.measurements,
      };
      persistUser(profile);
    }

    return result;
  };

  const signup = async (
    name: string,
    email: string,
    passwordInput: string,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const result = await registerUser(name, email, passwordInput, phone);

    if (result.success && result.user) {
      const profile: UserProfile = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        phone: result.user.phone,
        role: "CUSTOMER",
        isGuest: false,
      };
      persistUser(profile);
      return { success: true };
    }

    return { success: false, error: result.error || "Registration failed." };
  };

  const updateAvatar = async (avatarDataUrl: string): Promise<boolean> => {
    if (!user || !user.email) return false;

    const res = await updateProfileAvatar(user.email, avatarDataUrl);
    if (res.success) {
      const updated = { ...user, avatarUrl: avatarDataUrl };
      persistUser(updated);
      return true;
    }
    return false;
  };

  const updateProfile = async (updates: {
    name?: string;
    phone?: string;
    avatarUrl?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!user || !user.email) return { success: false, error: "No active session found." };

    const res = await updateUserProfile(user.email, {
      fullName: updates.name,
      phone: updates.phone,
      avatarUrl: updates.avatarUrl,
    });

    if (res.success) {
      const updated: UserProfile = {
        ...user,
        name: updates.name !== undefined ? updates.name : user.name,
        phone: updates.phone !== undefined ? updates.phone : user.phone,
        avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : user.avatarUrl,
      };
      persistUser(updated);
      return { success: true };
    }

    return { success: false, error: res.error || "Failed to update profile." };
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user || !user.email) return { success: false, error: "No active session found." };
    return changeUserPassword(user.email, currentPassword, newPassword);
  };

  const continueAsGuest = (name?: string, email?: string) => {
    const guestProfile: UserProfile = {
      name: name || "Guest Shopper",
      email: email || "guest@aouj.luxury",
      role: "CUSTOMER",
      isGuest: true,
    };
    persistUser(guestProfile);
  };

  const logout = () => {
    persistUser(null);
  };

  const updateMeasurements = (measurements: UserProfile["measurements"]) => {
    if (user) {
      const updated = { ...user, measurements };
      persistUser(updated);

      if (user.email) {
        syncProfileToSupabase({
          email: user.email,
          fullName: user.name,
          phone: user.phone,
        }).then((dbUser) => {
          if (dbUser?.id) {
            syncMeasurementsToSupabase({
              userId: dbUser.id,
              ...measurements,
            });
          }
        });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !user.isGuest,
        isAdmin: !!user && user.role === "ADMIN",
        isLoading,
        login,
        signup,
        updateAvatar,
        updateProfile,
        changePassword,
        continueAsGuest,
        logout,
        updateMeasurements,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
