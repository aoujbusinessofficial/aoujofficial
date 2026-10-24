"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminUser } from "@/services/adminService";
import {
  authenticateUser,
  updateUserProfile,
  changeUserPassword,
  AuthResult,
} from "@/services/authService";

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, passwordInput: string) => Promise<AuthResult>;
  logout: () => void;
  updateAdminProfile: (updates: {
    fullName?: string;
    phone?: string;
    avatarUrl?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  changeAdminPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = "aouj_admin_session";

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      const lastActivityStr = localStorage.getItem("aouj_last_activity");

      if (stored) {
        const lastActivity = lastActivityStr ? parseInt(lastActivityStr, 10) : Date.now();
        const now = Date.now();
        // 2 hours timeout check
        if (now - lastActivity > 2 * 60 * 60 * 1000) {
          localStorage.removeItem(ADMIN_STORAGE_KEY);
          localStorage.removeItem("aouj_user_session");
          localStorage.removeItem("aouj_last_activity");
          setAdmin(null);
        } else {
          const parsed: AdminUser = JSON.parse(stored);
          if (parsed.role === "ADMIN") {
            setAdmin(parsed);
          } else {
            localStorage.removeItem(ADMIN_STORAGE_KEY);
          }
        }
      }
    } catch (e) {
      console.error("Admin session error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, passwordInput: string): Promise<AuthResult> => {
    setIsLoading(true);
    const result = await authenticateUser(email, passwordInput);
    setIsLoading(false);

    if (result.success && result.user) {
      if (result.user.role !== "ADMIN") {
        return {
          success: false,
          error: "Access Denied: Only Administrator accounts can enter this portal. (Current role: CUSTOMER)",
        };
      }

      const adminUser: AdminUser = {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.name,
        phone: result.user.phone || null,
        role: "ADMIN",
        avatarUrl: result.user.avatarUrl,
        createdAt: new Date().toISOString(),
      };
      setAdmin(adminUser);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
      return result;
    }

    return result;
  };

  const updateAdminProfile = async (updates: {
    fullName?: string;
    phone?: string;
    avatarUrl?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!admin || !admin.email) return { success: false, error: "No active admin session found." };

    const res = await updateUserProfile(admin.email, {
      fullName: updates.fullName,
      phone: updates.phone,
      avatarUrl: updates.avatarUrl,
    });

    if (res.success) {
      const updated: AdminUser = {
        ...admin,
        fullName: updates.fullName !== undefined ? updates.fullName : admin.fullName,
        phone: updates.phone !== undefined ? updates.phone : admin.phone,
        avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : admin.avatarUrl,
      };
      setAdmin(updated);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updated));
      return { success: true };
    }

    return { success: false, error: res.error || "Failed to update admin profile." };
  };

  const changeAdminPassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!admin || !admin.email) return { success: false, error: "No active admin session found." };
    return changeUserPassword(admin.email, currentPassword, newPassword, true);
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem("aouj_user_session");
    localStorage.removeItem("aouj_last_activity");
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.clear();
    }
    router.push("/login");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin && admin.role === "ADMIN",
        isLoading,
        login,
        logout,
        updateAdminProfile,
        changeAdminPassword,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return ctx;
};
