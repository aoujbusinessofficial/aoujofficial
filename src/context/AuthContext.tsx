"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { syncProfileToSupabase, syncMeasurementsToSupabase } from "@/services/authService";

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
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
  isLoading: boolean;
  login: (email: string, name?: string) => Promise<boolean>;
  signup: (name: string, email: string, phone?: string) => Promise<boolean>;
  continueAsGuest: (name?: string, email?: string) => void;
  logout: () => void;
  updateMeasurements: (measurements: UserProfile["measurements"]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "aouj_user_session";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      }
    } catch (e) {
      console.error("Failed to load user session from storage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save changes to localStorage
  const persistUser = (newUser: UserProfile | null) => {
    setUser(newUser);
    try {
      if (newUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to persist user session", e);
    }
  };

  const login = async (email: string, name?: string): Promise<boolean> => {
    // Simulated client authentication with automatic Supabase sync
    const displayName = name || email.split("@")[0].replace(/[._]/g, " ") || "Valued Client";
    const formattedName = displayName
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const profile: UserProfile = {
      name: formattedName,
      email,
      isGuest: false,
      measurements: user?.measurements,
    };
    persistUser(profile);

    // Sync to Supabase in background
    syncProfileToSupabase({
      email,
      fullName: formattedName,
    }).catch((e) => console.warn(e));

    return true;
  };

  const signup = async (name: string, email: string, phone?: string): Promise<boolean> => {
    const profile: UserProfile = {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim(),
      isGuest: false,
    };
    persistUser(profile);

    // Sync to Supabase in background
    syncProfileToSupabase({
      email: email.trim(),
      fullName: name.trim(),
      phone: phone?.trim(),
    }).catch((e) => console.warn(e));

    return true;
  };

  const continueAsGuest = (name?: string, email?: string) => {
    const guestProfile: UserProfile = {
      name: name || "Guest Shopper",
      email: email || "guest@aouj.luxury",
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
        isLoading,
        login,
        signup,
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
