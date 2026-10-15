"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { verifyAdminUser, AdminUser } from "@/services/adminService";

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
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
      if (stored) {
        const parsed: AdminUser = JSON.parse(stored);
        if (parsed.role === "ADMIN") {
          setAdmin(parsed);
        } else {
          localStorage.removeItem(ADMIN_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error("Admin session error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    const result = await verifyAdminUser(email);
    setIsLoading(false);

    if (result.isAdmin && result.profile) {
      setAdmin(result.profile);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(result.profile));
      return { success: true };
    }

    return {
      success: false,
      error: result.error || "Access Denied: Only Admin accounts can access this portal.",
    };
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin && admin.role === "ADMIN",
        isLoading,
        login,
        logout,
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
